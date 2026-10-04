/**
 * تحلیل‌گر عملکرد ورزشکار
 * استخراج خودکار رکوردها، پیشرفت، و خستگی از تاریخچه تمرینات
 *
 * منابع داده:
 * - sessions (جلسات تمرینی انجام‌شده)
 * - sets (ست‌های ثبت‌شده با وزن و تکرار)
 */

import type { WorkoutSession } from '../../types';

export interface ExercisePerformance {
  exerciseId: string;
  exerciseName: string;
  /** بهترین وزنه ثبت‌شده */
  bestWeight: number;
  /** بهترین تکرار در آن وزنه */
  bestReps: number;
  /** تخمین 1RM (فرمول Epley) */
  estimated1RM: number;
  /** میانگین حجم در هر جلسه */
  avgVolumePerSession: number;
  /** تعداد کل جلسات این حرکت */
  totalSessions: number;
  /** آخرین وزنه استفاده‌شده */
  lastWeight: number;
  /** آخرین تاریخ تمرین */
  lastDate: string;
  /** روند پیشرفت (مثبت = بهبود، منفی = پسرفت) */
  trend: number;
}

export interface PerformanceAnalysis {
  /** رکوردهای اصلی (Squat, Bench, Deadlift, etc.) */
  strengthRecords: {
    squat?: ExercisePerformance;
    benchPress?: ExercisePerformance;
    deadlift?: ExercisePerformance;
    overheadPress?: ExercisePerformance;
    barbellRow?: ExercisePerformance;
    pullUp?: ExercisePerformance;
    dip?: ExercisePerformance;
  };

  /** همه حرکات تمرین‌شده */
  allExercises: ExercisePerformance[];

  /** آمار کلی */
  totalSessions: number;
  totalVolume: number;
  avgSessionDuration: number;

  /** خستگی */
  fatigue: {
    /** تعداد جلسات در ۷ روز اخیر */
    sessionsLast7Days: number;
    /** تعداد جلسات در ۳۰ روز اخیر */
    sessionsLast30Days: number;
    /** روزهای استراحت متوالی اخیر */
    consecutiveRestDays: number;
    /** سطح خستگی (0-100) */
    fatigueLevel: number;
    /** نیاز به deload */
    needsDeload: boolean;
  };

  /** تاریخچه تمرینات برای تحلیل */
  exerciseHistory: Record<string, Array<{ date: string; weight: number; reps: number; volume: number }>>;
}

/**
 * محاسبه تخمین 1RM با فرمول Epley
 */
function calculate1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/**
 * تشخیص رکوردهای اصلی از نام حرکت
 */
function detectMainLift(exerciseName: string): keyof PerformanceAnalysis['strengthRecords'] | null {
  const name = exerciseName.toLowerCase();

  if (name.includes('اسکوات') && !name.includes('جلو') && !name.includes('بلغاری')) return 'squat';
  if (name.includes('پرس سینه') && !name.includes('دمبل') && !name.includes('بالا') && !name.includes('شیب')) return 'benchPress';
  if (name.includes('ددلیفت') && !name.includes('رومانیایی')) return 'deadlift';
  if (name.includes('پرس سرشانه') || name.includes('پرس نظامی') || name.includes('ohp')) return 'overheadPress';
  if (name.includes('زیربغل هالتر') || name.includes('پارویی') || name.includes('bent')) return 'barbellRow';
  if (name.includes('بارفیکس') || name.includes('پول آپ') || name.includes('pull')) return 'pullUp';
  if (name.includes('دیپ') || name.includes('پارالل')) return 'dip';

  return null;
}

/**
 * تحلیل کامل عملکرد از تاریخچه
 */
export function analyzePerformance(
  sessions: WorkoutSession[],
  currentDate: Date = new Date()
): PerformanceAnalysis {
  const completedSessions = sessions.filter((s) => s.completed);

  const exerciseMap = new Map<string, {
    name: string;
    records: Array<{ date: string; weight: number; reps: number; volume: number }>;
  }>();

  let totalVolume = 0;
  let totalDuration = 0;
  let sessionsWithDuration = 0;

  // جمع‌آوری داده‌ها از تمام جلسات
  for (const session of completedSessions) {
    if (session.duration) {
      totalDuration += session.duration;
      sessionsWithDuration++;
    }

    for (const set of session.sets || []) {
      if (!set.completed) continue;

      const weight = Number(set.weight) || 0;
      const reps = Number(set.actualReps) || 0;
      const volume = weight * reps;

      totalVolume += volume;

      const exerciseId = set.exerciseId || set.exerciseName;
      const exerciseName = set.exerciseName || '';

      if (!exerciseMap.has(exerciseId)) {
        exerciseMap.set(exerciseId, { name: exerciseName, records: [] });
      }

      exerciseMap.get(exerciseId)!.records.push({
        date: session.date,
        weight,
        reps,
        volume,
      });
    }
  }

  // تحلیل هر حرکت
  const allExercises: ExercisePerformance[] = [];
  const exerciseHistory: Record<string, Array<{ date: string; weight: number; reps: number; volume: number }>> = {};

  for (const [exerciseId, data] of exerciseMap.entries()) {
    const records = data.records;
    if (records.length === 0) continue;

    // بهترین وزنه
    let bestWeight = 0;
    let bestReps = 0;
    let best1RM = 0;

    for (const r of records) {
      if (r.weight > bestWeight) {
        bestWeight = r.weight;
        bestReps = r.reps;
      }
      const e1rm = calculate1RM(r.weight, r.reps);
      if (e1rm > best1RM) best1RM = e1rm;
    }

    // آخرین وزنه
    const sorted = [...records].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const lastRecord = sorted[0];

    // میانگین حجم
    const totalVol = records.reduce((sum, r) => sum + r.volume, 0);
    const avgVolume = Math.round(totalVol / Math.max(1, Math.ceil(records.length / 3)));

    // روند (مقایسه ۳ رکورد اول و ۳ رکورد آخر)
    let trend = 0;
    if (sorted.length >= 6) {
      const firstThree = sorted.slice(-3).reduce((s, r) => s + r.weight, 0) / 3;
      const lastThree = sorted.slice(0, 3).reduce((s, r) => s + r.weight, 0) / 3;
      trend = Math.round(((lastThree - firstThree) / Math.max(firstThree, 1)) * 100);
    }

    allExercises.push({
      exerciseId,
      exerciseName: data.name,
      bestWeight,
      bestReps,
      estimated1RM: Math.round(best1RM * 10) / 10,
      avgVolumePerSession: avgVolume,
      totalSessions: new Set(records.map((r) => r.date)).size,
      lastWeight: lastRecord.weight,
      lastDate: lastRecord.date,
      trend,
    });

    exerciseHistory[exerciseId] = sorted;
  }

  // استخراج رکوردهای اصلی
  const strengthRecords: PerformanceAnalysis['strengthRecords'] = {};

  for (const exercise of allExercises) {
    const lift = detectMainLift(exercise.exerciseName);
    if (lift && !strengthRecords[lift]) {
      strengthRecords[lift] = exercise;
    } else if (lift && strengthRecords[lift] && exercise.estimated1RM > strengthRecords[lift]!.estimated1RM) {
      strengthRecords[lift] = exercise;
    }
  }

  // تحلیل خستگی
  const now = currentDate.getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  const sessionsLast7Days = completedSessions.filter((s) => {
    const diff = now - new Date(s.date).getTime();
    return diff >= 0 && diff <= 7 * dayMs;
  }).length;

  const sessionsLast30Days = completedSessions.filter((s) => {
    const diff = now - new Date(s.date).getTime();
    return diff >= 0 && diff <= 30 * dayMs;
  }).length;

  // محاسبه روزهای استراحت متوالی
  let consecutiveRestDays = 0;
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(now - i * dayMs).toDateString();
    const hasSession = completedSessions.some(
      (s) => new Date(s.date).toDateString() === checkDate
    );
    if (hasSession) break;
    consecutiveRestDays++;
  }

  // سطح خستگی (0-100)
  // معیار: تعداد جلسات در ۷ روز + تعداد جلسات متوالی بدون استراحت
  const weeklyFrequency = sessionsLast7Days / 7;
  const fatigueFromFrequency = Math.min(50, weeklyFrequency * 100);
  const fatigueFromVolume = Math.min(30, totalVolume / 10000);
  const fatigueFromRest = Math.max(0, 20 - consecutiveRestDays * 2);
  const fatigueLevel = Math.round(fatigueFromFrequency + fatigueFromVolume + fatigueFromRest);

  return {
    strengthRecords,
    allExercises,
    totalSessions: completedSessions.length,
    totalVolume: Math.round(totalVolume),
    avgSessionDuration: sessionsWithDuration > 0 ? Math.round(totalDuration / sessionsWithDuration) : 0,
    fatigue: {
      sessionsLast7Days,
      sessionsLast30Days,
      consecutiveRestDays,
      fatigueLevel,
      needsDeload: fatigueLevel > 75,
    },
    exerciseHistory,
  };
}

/**
 * دریافت خلاصه‌ای از تحلیل برای نمایش در UI
 */
export function getPerformanceSummary(analysis: PerformanceAnalysis): {
  hasData: boolean;
  mainRecords: Array<{ label: string; value: string }>;
  message: string;
} {
  const records = analysis.strengthRecords;
  const mainRecords: Array<{ label: string; value: string }> = [];

  if (records.squat) mainRecords.push({ label: 'اسکوات', value: `${records.squat.bestWeight} کیلو` });
  if (records.benchPress) mainRecords.push({ label: 'پرس سینه', value: `${records.benchPress.bestWeight} کیلو` });
  if (records.deadlift) mainRecords.push({ label: 'ددلیفت', value: `${records.deadlift.bestWeight} کیلو` });
  if (records.overheadPress) mainRecords.push({ label: 'پرس سرشانه', value: `${records.overheadPress.bestWeight} کیلو` });

  const hasData = analysis.totalSessions > 0;

  let message = '';
  if (!hasData) {
    message = 'هنوز تمرینی ثبت نشده. برنامه بر اساس مشخصات پروفایل تولید می‌شود.';
  } else if (analysis.fatigue.needsDeload) {
    message = '⚠️ سطح خستگی بالاست. برنامه با حجم کمتر تولید می‌شود.';
  } else if (analysis.fatigue.sessionsLast7Days >= 5) {
    message = 'برنامه بر اساس حجم تمرین اخیر تنظیم می‌شود.';
  } else {
    message = 'برنامه بر اساس رکوردها و پیشرفت شما تولید می‌شود.';
  }

  return { hasData, mainRecords, message };
}
