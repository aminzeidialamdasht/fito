/**
 * Progression Engine — فاز 5
 *
 * هدف: محاسبه وزنه پیشنهادی برای هر حرکت، از سه منبع (به ترتیب اولویت):
 *   1. تاریخچه تمرین کاربر (performance.strengthRecords)
 *   2. رکوردهای دستی پروفایل (profile.strengthRecordsExtended)
 *   3. تخمین از وزن بدن × ضریب تجربه (برای کاربر جدید)
 *
 * سپس تبدیل 1RM به وزنه‌ی تمرین بر اساس:
 *   - rep range هدف
 *   - % 1RM استاندارد (NSCA / ACSM)
 *   - نوع حرکت (compound vs isolation)
 *
 * رفرنس علمی:
 *   - Epley formula: 1RM = w × (1 + r/30)
 *   - Brzycki: 1RM = w × 36 / (37 - r)
 *   - NSCA %1RM ↔ reps: 
 *       100% → 1, 95% → 2, 90% → 4, 85% → 6, 80% → 8,
 *       75% → 10, 70% → 12, 65% → 15, 60% → 18, 55% → 20
 */

import type { AthleteProfile } from '../../types';
import type { Exercise, MuscleGroup } from '../types/exercise';
import type { Goal, ExperienceLevel } from '../types/program';
import type { PerformanceAnalysis } from './performanceAnalyzer';

/**
 * شناسه حرکات اصلی که در پروفایل ثبت می‌شن
 */
type MainLiftKey = 'squat' | 'benchPress' | 'deadlift' | 'overheadPress' | 'barbellRow' | 'pullUp' | 'dip';

/**
 * ضریب تخمین برای کاربر جدید (بدون رکورد) — نسبت به وزن بدن
 * منبع: استانداردهای Strength Level / ExRx
 */
const BODYWEIGHT_MULTIPLIERS: Record<ExperienceLevel, Record<MainLiftKey, number>> = {
  beginner: {
    squat: 0.5,
    benchPress: 0.4,
    deadlift: 0.75,
    overheadPress: 0.25,
    barbellRow: 0.35,
    pullUp: 0,      // وزن بدن
    dip: 0,         // وزن بدن
  },
  intermediate: {
    squat: 1.0,
    benchPress: 0.75,
    deadlift: 1.25,
    overheadPress: 0.5,
    barbellRow: 0.6,
    pullUp: 0.15,   // وزن بدن + وزنه اضافه
    dip: 0.2,
  },
  advanced: {
    squat: 1.5,
    benchPress: 1.1,
    deadlift: 1.75,
    overheadPress: 0.7,
    barbellRow: 0.85,
    pullUp: 0.35,
    dip: 0.4,
  },
  professional: {
    squat: 1.85,
    benchPress: 1.35,
    deadlift: 2.1,
    overheadPress: 0.85,
    barbellRow: 1.0,
    pullUp: 0.5,
    dip: 0.55,
  },
};

/**
 * تخمین 1RM از وزن و تکرار (Epley)
 */
export function calc1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/**
 * درصد 1RM بر اساس تعداد تکرار هدف
 * منبع: NSCA Essentials of Strength Training (4th ed.)
 */
export function percentFromReps(reps: number): number {
  if (reps <= 1) return 1.0;
  if (reps === 2) return 0.95;
  if (reps === 3) return 0.93;
  if (reps === 4) return 0.90;
  if (reps === 5) return 0.87;
  if (reps === 6) return 0.85;
  if (reps === 7) return 0.82;
  if (reps === 8) return 0.80;
  if (reps === 9) return 0.77;
  if (reps === 10) return 0.75;
  if (reps === 11) return 0.73;
  if (reps === 12) return 0.70;
  if (reps === 13) return 0.68;
  if (reps === 14) return 0.66;
  if (reps === 15) return 0.65;
  if (reps >= 20) return 0.60;
  return 0.60;
}

/**
 * شناسایی حرکت پایه از muscle + movementPattern
 */
function detectMainLiftFromExercise(exercise: Exercise): MainLiftKey | null {
  const pattern = exercise.movementPattern;
  const muscle = exercise.primaryMuscle;

  // Squat patterns
  if (pattern === 'squat' || (muscle === 'quads' && exercise.isCompound)) return 'squat';
  // Hinge / Deadlift
  if (pattern === 'hinge' && exercise.isCompound) return 'deadlift';
  // Horizontal press → bench
  if (pattern === 'horizontal_push' && muscle === 'chest' && exercise.isCompound) return 'benchPress';
  // Vertical press → overhead
  if (pattern === 'vertical_push' && exercise.isCompound) return 'overheadPress';
  // Horizontal pull → row
  if (pattern === 'horizontal_pull' && exercise.isCompound) return 'barbellRow';
  // Vertical pull → pull-up
  if (pattern === 'vertical_pull' && exercise.isCompound) return 'pullUp';
  // Dip
  if (pattern === 'vertical_push' && muscle === 'triceps') return 'dip';

  return null;
}

/**
 * تخمین 1RM برای یک حرکت از سه منبع
 */
export function estimate1RMForExercise(
  exercise: Exercise,
  profile: AthleteProfile,
  performance: PerformanceAnalysis
): number | null {
  const mainLift = detectMainLiftFromExercise(exercise);
  const bodyWeight = profile.weight || 75;
  const experience: ExperienceLevel = (profile.experience || 'intermediate') as ExperienceLevel;

  // ۱. از تاریخچه تمرین (performance) — دقیق‌ترین
  if (mainLift && performance.strengthRecords[mainLift]) {
    const rec = performance.strengthRecords[mainLift];
    if (rec?.estimated1RM && rec.estimated1RM > 0) return rec.estimated1RM;
  }

  // ۲. از رکوردهای دستی پروفایل
  if (mainLift && profile.strengthRecordsExtended) {
    const ext = profile.strengthRecordsExtended[mainLift];
    if (ext && ext.weight > 0 && ext.reps > 0) {
      const anyExt = ext as { estimated1RM?: number };
      if (anyExt.estimated1RM && anyExt.estimated1RM > 0) return anyExt.estimated1RM;
      return calc1RM(ext.weight, ext.reps);
    }
  }

  // ۳. تخمین از وزن بدن × ضریب تجربه
  if (mainLift) {
    const multiplier = BODYWEIGHT_MULTIPLIERS[experience]?.[mainLift];
    if (multiplier && multiplier > 0) {
      return Math.round(bodyWeight * multiplier);
    }
    // pull-up / dip → وزن بدن + وزنه اضافه
    if (mainLift === 'pullUp' || mainLift === 'dip') {
      return Math.round(bodyWeight * (1 + (multiplier || 0)));
    }
  }

  return null;
}

/**
 * تبدیل 1RM به وزنه تمرین بر اساس rep range
 */
export function weightFrom1RM(
  estimated1RM: number,
  targetReps: number,
  setNumber: number = 1,
  isCompound: boolean = true
): number {
  if (estimated1RM <= 0) return 0;

  const pct = percentFromReps(targetReps);

  // برای compound: احترام به استاندارد
  // برای isolation: 5% تخفیف (کاربر معمولاً کمتر می‌زنه)
  const adjustedPct = isCompound ? pct : pct * 0.95;

  let weight = estimated1RM * adjustedPct;

  // Set 1 = گرم‌کردن (60% از وزنه کاری) برای compound
  if (setNumber === 1 && isCompound) {
    weight = estimated1RM * percentFromReps(targetReps + 4) * 0.9;
  }

  // رُند به 2.5
  return Math.max(2.5, Math.round(weight / 2.5) * 2.5);
}

/**
 * تابع اصلی: پیشنهاد وزنه برای یک ست
 *
 * اولویت:
 *   1. lastWeight از تاریخچه (با Double Progression — logic فعلی)
 *   2. estimated1RM × درصد (از پروفایل یا تخمین)
 *   3. null
 */
export function suggestWeightForSet(
  exercise: Exercise,
  targetReps: number,
  setNumber: number,
  profile: AthleteProfile,
  performance: PerformanceAnalysis,
  lastWeight?: number,
  lastReps?: number,
  lastRIR?: number,
  targetRIR?: number,
  repMin?: number,
  repMax?: number
): number | undefined {
  // ۱. اگه تاریخچه داریم → Double Progression
  if (lastWeight && lastReps && lastWeight > 0 && repMin && repMax && targetRIR !== undefined) {
    // منطق مشابه calculateProgression فعلی
    if (lastReps < repMin) {
      return Math.round((lastWeight * 0.95) / 2.5) * 2.5;
    }
    if (lastReps === repMin && (lastRIR ?? 2) <= 1) {
      return Math.round((lastWeight * 0.975) / 2.5) * 2.5;
    }
    if (lastReps >= repMax && (lastRIR ?? 2) <= targetRIR + 1) {
      const inc = (lastRIR ?? 2) <= targetRIR ? 1.05 : 1.025;
      return Math.round((lastWeight * inc) / 2.5) * 2.5;
    }
    return lastWeight;
  }

  // ۲. اگه 1RM تخمینی داریم → محاسبه
  const e1rm = estimate1RMForExercise(exercise, profile, performance);
  if (e1rm && e1rm > 0) {
    return weightFrom1RM(e1rm, targetReps, setNumber, exercise.isCompound);
  }

  return undefined;
}

/**
 * بررسی می‌کنه آیا کاربر رکورد کافی برای این حرکت داره
 */
export function hasStrengthData(
  exercise: Exercise,
  profile: AthleteProfile,
  performance: PerformanceAnalysis
): boolean {
  return estimate1RMForExercise(exercise, profile, performance) !== null;
}

/**
 * برای Debug: خلاصه‌ی رکوردها
 */
export function summarizeStrengthProfile(
  profile: AthleteProfile,
  performance: PerformanceAnalysis
): Record<string, number | null> {
  const result: Record<string, number | null> = {};
  const fakeExercise = (muscle: MuscleGroup, pattern: any): Exercise => ({
    id: 'tmp',
    name: 'tmp',
    englishName: 'tmp',
    primaryMuscle: muscle,
    secondaryMuscles: [],
    type: 'compound',
    movementPattern: pattern,
    equipment: [],
    difficulty: 2,
    injuryRisk: {},
    substitutes: [],
    cues: [],
    repRanges: {
      hypertrophy: { min: 8, max: 12 },
      strength: { min: 3, max: 6 },
      endurance: { min: 12, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 3 },
    },
    restSeconds: { min: 90, max: 180 },
    isCompound: true,
    isSpineSensitive: false,
    tags: [],
  });

  const checks: Array<[string, MuscleGroup, any]> = [
    ['squat', 'quads', 'squat'],
    ['benchPress', 'chest', 'horizontal_push'],
    ['deadlift', 'hamstrings', 'hinge'],
    ['overheadPress', 'front_delts', 'vertical_push'],
    ['barbellRow', 'upper_back', 'horizontal_pull'],
  ];

  for (const [key, muscle, pattern] of checks) {
    result[key] = estimate1RMForExercise(fakeExercise(muscle, pattern), profile, performance);
  }
  return result;
}
