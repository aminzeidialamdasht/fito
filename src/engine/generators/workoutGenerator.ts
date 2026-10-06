/**
 * ماشین تولید برنامه تمرینی آفلاین
 * ترکیب تمام ماژول‌ها برای تولید JSON نهایی سازگار با اپ
 */

import type { AthleteProfile, WorkoutSession } from '../../types';
import type {
  GeneratedProgram,
  GeneratedDay,
  GeneratedExercise,
  GeneratedSet,
  Goal,
} from '../types/program';
import type { MuscleGroup, Exercise } from '../types/exercise';
import { analyzeProfile, type ProfileAnalysis } from '../core/profileAnalyzer';
import { selectSplit, getSplitName, type SplitPlan } from '../core/splitSelector';
import { selectExercisesForSession } from '../core/exerciseSelector';
import { getTargetWeeklyVolume, MAX_VOLUME_PER_SESSION } from '../data/rules/volumeRules';
import { addEffectiveSetsToVolume } from '../core/stimulusCalculator';
import { validateProgram } from '../core/programValidator';
import {
  distributeMuscleAcrossSessions,
  buildSessionBudget,
  getDirectVolumeMultiplierWrapper,
  type SessionBudget,
} from '../core/volumeAllocator';
import { analyzePerformance, type PerformanceAnalysis } from '../core/performanceAnalyzer';
import { selectProgramSystem } from '../core/systemSelector';
import { applyTechniquesToExercises } from '../core/techniqueApplier';
import type { ProgramSystemRule } from '../data/rules/trainingSystems';
import { suggestWeightForSet } from '../core/progressionEngine';

export const ENGINE_VERSION = '1.0.0';

const PERSIAN_WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

const GOAL_TO_PERSIAN: Record<Goal, string> = {
  hypertrophy: 'حجم عضلانی',
  strength: 'قدرت',
  fat_loss: 'کاهش چربی',
  recomposition: 'بازترکیب بدن',
  competition: 'آماده‌سازی مسابقه',
  general_fitness: 'تناسب اندام عمومی',
};

const MUSCLE_TO_PERSIAN: Record<MuscleGroup, string> = {
  chest: 'سینه',
  upper_back: 'پشت',
  lats: 'زیربغل',
  lower_back: 'کمر',
  traps: 'کول',
  front_delts: 'سرشانه جلو',
  side_delts: 'سرشانه میانی',
  rear_delts: 'پشت سرشانه',
  biceps: 'جلوبازو',
  triceps: 'پشت‌بازو',
  forearms: 'ساعد',
  quads: 'چهارسر',
  hamstrings: 'همسترینگ',
  glutes: 'سرینی',
  calves: 'ساق',
  abs: 'شکم',
  obliques: 'پهلو',
};

/**
 * تولید برنامه تمرینی کامل
 */
export function generateWorkoutProgram(
  profile: AthleteProfile,
  sessions: WorkoutSession[] = []
): GeneratedProgram {
  // ۱. تحلیل پروفایل
  const analysis = analyzeProfile(profile);

  // ۲. تحلیل عملکرد از تاریخچه تمرینات
  const performance = analyzePerformance(sessions);

  // تنظیم سطح تجربه بر اساس خستگی
  if (performance.fatigue.needsDeload) {
    // کاهش حجم در صورت خستگی بالا
    analysis.fatigueDetected = true;
  }

  // ۲. انتخاب Split
  // فاز ۶: انتخاب سیستم تمرینی سطح برنامه
  const programSystem = selectProgramSystem(profile, analysis, performance);

  const split = selectSplit(analysis.weeklyTrainingDays, analysis.experience, analysis.goal);

  // ۳. تولید جلسات
  const sessionDayIndices = getTrainingDayIndices(analysis.weeklyTrainingDays);
  const days: GeneratedDay[] = [];
  const allSelectedIds: string[] = [];
  const weeklyVolume: Partial<Record<MuscleGroup, number>> = {};

  // ۳.۵. محاسبه توزیع حجم هر عضله بین جلسات
  const allMuscles = Array.from(
    new Set(split.sessions.flatMap((s) => s.muscleGroups as MuscleGroup[]))
  ) as MuscleGroup[];

  const muscleWeeklyTargets: Record<string, number> = {};
  for (const muscle of allMuscles) {
    const isPriority = analysis.priorityMuscles.includes(muscle);
    const target = getTargetWeeklyVolume(
      muscle,
      analysis.experience,
      analysis.goal,
      isPriority
    );
    muscleWeeklyTargets[muscle] = target.target;
  }

  const muscleDistributions: Record<string, Record<number, number>> = {};
  for (const muscle of allMuscles) {
    const sessionsWithMuscle: number[] = [];
    split.sessions.forEach((s, idx) => {
      if ((s.muscleGroups as MuscleGroup[]).includes(muscle)) {
        sessionsWithMuscle.push(idx);
      }
    });
    const directMultiplier = getDirectVolumeMultiplierWrapper(
      muscle,
      analysis.experience,
      analysis.goal
    );
    muscleDistributions[muscle] = distributeMuscleAcrossSessions(
      muscle,
      muscleWeeklyTargets[muscle],
      sessionsWithMuscle,
      directMultiplier,
      analysis.priorityMuscles.includes(muscle)
    );
  }

  // ۴. تولید هر جلسه با بودجه
  // allSelectedIds: IDهایی که در این جلسه استفاده شده‌اند (برای جلوگیری از تکرار در یک جلسه)
  // usedAcrossWeek: IDهایی که در هفته استفاده شده‌اند (برای تنوع بین جلسات)
  const usedAcrossWeek: string[] = [];

  for (let i = 0; i < split.sessions.length; i++) {
    const session = split.sessions[i];
    const dayIndex = sessionDayIndices[i];

    const sessionBudget = buildSessionBudget(
      session.muscleGroups as MuscleGroup[],
      muscleDistributions,
      i
    );

    // allSelectedIds فقط در این جلسه ریست می‌شود
    const allSelectedIds: string[] = [];

    const day = generateDay(
      profile,
      dayIndex,
      session.title,
      session.muscleGroups as MuscleGroup[],
      analysis,
      allSelectedIds,
      weeklyVolume,
      performance,
      programSystem,
      sessionBudget,
      usedAcrossWeek
    );

    // اضافه کردن به لیست هفتگی
    // فاز ۶: اعمال تکنیک‌های ست روی حرکات همین جلسه
    applyTechniquesToExercises(day.exercises, profile, analysis, performance);

    usedAcrossWeek.push(...allSelectedIds);

    days.push(day);
  }

  // ۴. محاسبه روزهای استراحت
  const restDays = [0, 1, 2, 3, 4, 5, 6].filter((d) => !sessionDayIndices.includes(d));

  // ۵. خلاصه حجم هفتگی
  const weeklyVolumeSummary = {} as Record<MuscleGroup, number>;
  for (const muscle of Object.keys(MUSCLE_TO_PERSIAN) as MuscleGroup[]) {
    weeklyVolumeSummary[muscle] = weeklyVolume[muscle] || 0;
  }

  // ۶. ساخت برنامه نهایی
  const program: GeneratedProgram = {
    id: `offline_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name: `برنامه ${GOAL_TO_PERSIAN[analysis.goal]} - ${getSplitName(split.type)}`,
    goal: analysis.goal,
    experience: analysis.experience,
    splitType: split.type,
    trainingDaysPerWeek: analysis.weeklyTrainingDays,
    sessionDuration: analysis.sessionMinutes,
    durationWeeks: programSystem.weeks > 0
      ? programSystem.weeks
      : analysis.programDurationWeeks,
    createdAt: new Date().toISOString(),
    days,
    restDays,
    weeklyVolumeSummary,
    metadata: {
      engineVersion: ENGINE_VERSION,
      generatedFrom: 'offline_engine',
      notes: `برنامه تولیدشده توسط موتور آفلاین فیتو نسخه ${ENGINE_VERSION}`,
      priorityMuscles: analysis.priorityMuscles,
      goal: analysis.goal,
      experience: analysis.experience,
      injuries: analysis.safeInjuries,
      systemName: programSystem.id,
      systemNameFa: programSystem.nameFa,
      periodizationPhase: programSystem.weeklyScheme[0]?.label,
      weeklyProgression: programSystem.weeklyScheme.map((w, idx) => ({ week: idx + 1, ...w })),
    },
  };
  // ۷. اعتبارسنجی برنامه
  const validation = validateProgram(program);
  if (!validation.isValid) {
    console.warn('⚠️ Program validation issues:');
    validation.errors.forEach((e) => console.warn('  ❌', e.message));
  } else {
    console.log('✅ Program valid (score: ' + validation.score + '/100)');
  }

  return program;
}

/**
 * تولید یک جلسه تمرینی
 */
function generateDay(
  profile: AthleteProfile,
  dayIndex: number,
  title: string,
  muscleGroups: MuscleGroup[],
  analysis: ProfileAnalysis,
  allSelectedIds: string[],
  weeklyVolume: Partial<Record<MuscleGroup, number>>,
  performance: PerformanceAnalysis,
  programSystem: ProgramSystemRule,
  sessionBudget?: SessionBudget,
  usedAcrossWeek: string[] = []
): GeneratedDay {
  // ═══════════════════════════════════════════════════════════
  // منطق انتخاب Exercise + تعیین Set بر اساس Budget
  // ═══════════════════════════════════════════════════════════

  const generatedExercises: GeneratedExercise[] = [];

  if (sessionBudget && Object.keys(sessionBudget).length > 0) {
    // === مسیر ۱: با Budget دقیق ===
    // برای هر عضله در بودجه، تعداد Exercise و Set را تعیین کن

    for (const [muscle, budget] of Object.entries(sessionBudget)) {
      if (budget <= 0) continue;

      // تعداد Exercise بر اساس Budget
      const exerciseCountForMuscle = calculateMuscleExerciseCount(budget);

      // انتخاب Exerciseها فقط برای این عضله
      // اول تلاش با حرکات استفاده‌نشده در هفته، بعد fallback
      let exercisesForMuscle = selectExercisesForSession(
        [muscle as MuscleGroup],
        analysis,
        [...allSelectedIds, ...usedAcrossWeek],
        exerciseCountForMuscle
      );

      // اگر کمتر از انتظار بود، بدون usedAcrossWeek امتحان کن
      if (exercisesForMuscle.length < exerciseCountForMuscle) {
        const retry = selectExercisesForSession(
          [muscle as MuscleGroup],
          analysis,
          allSelectedIds,
          exerciseCountForMuscle
        );
        for (const ex of retry) {
          if (!exercisesForMuscle.find(e => e.id === ex.id)) {
            exercisesForMuscle.push(ex);
          }
        }
      }

      // توزیع Set بین Exerciseها
      const setDistribution = distributeSetsAmongExercises(
        budget,
        exercisesForMuscle.length
      );

      for (let idx = 0; idx < exercisesForMuscle.length; idx++) {
        const ex = exercisesForMuscle[idx];
        const sets = generateSets(profile, ex, analysis, performance, setDistribution[idx], programSystem);

        addEffectiveSetsToVolume(weeklyVolume, ex, sets.length);

        generatedExercises.push({
          exerciseId: ex.id,
          name: ex.name,
          englishName: ex.englishName,
          primaryMuscle: ex.primaryMuscle,
          secondaryMuscles: ex.secondaryMuscles,
          type: ex.type,
          sets,
          notes: ex.cues[0] || undefined,
          substituteId: ex.substitutes[0] || undefined,
        });

        allSelectedIds.push(ex.id);
      }
    }
  } else {
    // === مسیر ۲: بدون Budget (fallback قدیم) ===
    const exerciseCount = calculateExerciseCount(analysis.sessionMinutes, analysis.experience);
    const selectedExercises = selectExercisesForSession(
      muscleGroups,
      analysis,
      allSelectedIds,
      exerciseCount
    );

    for (const ex of selectedExercises) {
      const sets = generateSets(profile, ex, analysis, performance);
      addEffectiveSetsToVolume(weeklyVolume, ex, sets.length);
      generatedExercises.push({
        exerciseId: ex.id,
        name: ex.name,
        englishName: ex.englishName,
        primaryMuscle: ex.primaryMuscle,
        secondaryMuscles: ex.secondaryMuscles,
        type: ex.type,
        sets,
        notes: ex.cues[0] || undefined,
        substituteId: ex.substitutes[0] || undefined,
      });
      allSelectedIds.push(ex.id);
    }
  }

  const durationEstimate = estimateDuration(generatedExercises, analysis.sessionMinutes);

  return {
    dayIndex,
    dayName: PERSIAN_WEEKDAYS[dayIndex],
    focus: 'custom',
    title: `${PERSIAN_WEEKDAYS[dayIndex]} - ${title}`,
    estimatedDuration: durationEstimate,
    exercises: generatedExercises,
    warmup: '۵ تا ۱۰ دقیقه گرم‌کردن عمومی (دویدن سبک، تحرک مفاصل) + ۲ ست آماده‌سازی با وزنه سبک',
    cooldown: '۵ دقیقه سردکردن و کشش سبک',
  };
}

/**
 * محاسبه تعداد Exercise برای یک عضله بر اساس Budget
 *  1-3 ست  → 1 حرکت
 *  4-6 ست  → 2 حرکت
 *  7-9 ست  → 3 حرکت
 *  10+ ست  → 4 حرکت
 */
function calculateMuscleExerciseCount(budget: number): number {
  if (budget <= 3) return 1;
  if (budget <= 6) return 2;
  if (budget <= 9) return 3;
  return 4;
}

/**
 * توزیع ست‌ها بین Exerciseهای یک عضله
 * مثال: budget=7, exerciseCount=2 → [4, 3]
 * مثال: budget=9, exerciseCount=3 → [3, 3, 3]
 */
function distributeSetsAmongExercises(budget: number, exerciseCount: number): number[] {
  if (exerciseCount <= 0) return [];

  const base = Math.floor(budget / exerciseCount);
  const remainder = budget % exerciseCount;

  const distribution: number[] = [];
  for (let i = 0; i < exerciseCount; i++) {
    // Exerciseهای اول کمی بیشتر
    distribution.push(base + (i < remainder ? 1 : 0));
  }

  return distribution;
}

/**
 * محاسبه تعداد حرکات بر اساس مدت جلسه
 */
function calculateExerciseCount(sessionMinutes: number, experience: string): number {
  const base: Record<string, number> = {
    beginner: 5,
    intermediate: 6,
    advanced: 7,
    professional: 8,
  };
  const baseCount = base[experience] || 6;

  if (sessionMinutes <= 45) return Math.max(4, baseCount - 2);
  if (sessionMinutes <= 60) return baseCount;
  if (sessionMinutes <= 90) return baseCount + 1;
  return baseCount + 2;
}

/**
 * تولید ست‌ها برای یک حرکت
 */
/**
 * محاسبه وزنه پیشنهادی بر اساس Double Progression
 */
function calculateProgression(
  lastWeight: number,
  lastReps: number,
  lastRIR: number,
  repMin: number,
  repMax: number,
  targetRIR: number
): number {
  if (!lastWeight || !lastReps) return 0;

  // تکرار کمتر از پایین بازه → کاهش وزنه
  if (lastReps < repMin) {
    return Math.round((lastWeight * 0.95) / 2.5) * 2.5;
  }

  // در پایین بازه + RIR کم → کاهش جزئی
  if (lastReps === repMin && lastRIR <= 1) {
    return Math.round((lastWeight * 0.975) / 2.5) * 2.5;
  }

  // در بالای بازه + RIR در محدوده هدف → افزایش وزنه
  if (lastReps >= repMax && lastRIR <= targetRIR + 1) {
    const increment = lastRIR <= targetRIR ? 1.05 : 1.025;
    return Math.round((lastWeight * increment) / 2.5) * 2.5;
  }

  // در غیر این صورت: همان وزنه
  return lastWeight;
}

function generateSets(
  profile: AthleteProfile,
  exercise: Exercise,
  analysis: ProfileAnalysis,
  performance: PerformanceAnalysis,
  overrideSetCount: number = 0,
  programSystem?: ProgramSystemRule
): GeneratedSet[] {
  const setCount = overrideSetCount > 0
    ? overrideSetCount
    : calculateSetCount(exercise, analysis, performance);
  const goal = analysis.goal;

  // تعیین محدوده تکرار
  let repRange = exercise.repRanges.hypertrophy;
  let rirRange = exercise.rirRange.hypertrophy;

  if (goal === 'strength' && exercise.isCompound) {
    repRange = exercise.repRanges.strength;
    rirRange = exercise.rirRange.strength;
  } else if (goal === 'fat_loss') {
    repRange = exercise.repRanges.endurance;
    rirRange = exercise.rirRange.hypertrophy;
  } else if (goal === 'general_fitness') {
    repRange = exercise.repRanges.endurance;
    rirRange = exercise.rirRange.hypertrophy;
  }

  const weekOneScheme = programSystem?.weeklyScheme?.[0];

  // RIR پایه
  let baseRIR = typeof weekOneScheme?.rir === 'number'
    ? weekOneScheme.rir
    : rirRange.min;
  if (analysis.experience === 'beginner') baseRIR = Math.min(baseRIR + 1, rirRange.max);

  // اگر خستگی بالا → RIR بیشتر (تمرین سبک‌تر)
  if (performance.fatigue.needsDeload) {
    baseRIR = Math.min(baseRIR + 2, rirRange.max + 2);
  }

  const repsStr = weekOneScheme?.reps?.trim()
    || `${repRange.min}-${repRange.max}`;
  const restSeconds = Math.round((exercise.restSeconds.min + exercise.restSeconds.max) / 2);

  // محاسبه وزنه پیشنهادی از رکورد قبلی
  const lastPerformance = performance.allExercises.find(
    (p) => p.exerciseId === exercise.id || p.exerciseName === exercise.name
  );

  const sets: GeneratedSet[] = [];
  for (let i = 1; i <= setCount; i++) {
    sets.push({
      setNumber: i,
      targetReps: repsStr,
      targetRIR: baseRIR,
      restSeconds,
      tempo: exercise.tempo,
      // وزنه پیشنهادی بر اساس Double Progression
      week: 1,
      suggestedWeight: suggestWeightForSet(
        exercise,
        repRange.min,
        i,
        profile,
        performance,
        lastPerformance?.lastWeight,
        lastPerformance?.lastReps,
        lastPerformance?.lastRIR ?? 2,
        baseRIR,
        repRange.min,
        repRange.max
      ),
      lastWeight: lastPerformance?.lastWeight,
      lastReps: lastPerformance?.lastReps,
      lastRIR: lastPerformance?.lastRIR,
    } as any);
  }

  return sets;
}

/**
 * محاسبه تعداد ست برای یک حرکت
 * با در نظر گرفتن خستگی
 */
function calculateSetCount(
  exercise: Exercise,
  analysis: ProfileAnalysis,
  performance: PerformanceAnalysis
): number {
  const baseSets: Record<string, number> = {
    beginner: exercise.isCompound ? 3 : 2,
    intermediate: exercise.isCompound ? 4 : 3,
    advanced: exercise.isCompound ? 4 : 3,
    professional: exercise.isCompound ? 5 : 4,
  };

  let sets = baseSets[analysis.experience] || 3;

  // محدودیت برای آسیب‌ها
  if (exercise.isSpineSensitive && analysis.hasSpineIssue) {
    sets = Math.max(2, sets - 1);
  }

  // کاهش حجم در صورت خستگی بالا
  if (performance.fatigue.needsDeload) {
    sets = Math.max(2, sets - 1);
  }

  // محدودیت حجم هر جلسه
  const maxPerSession = MAX_VOLUME_PER_SESSION[exercise.primaryMuscle] || 10;
  sets = Math.min(sets, Math.ceil(maxPerSession / 2));

  return sets;
}


function estimateDuration(exercises: GeneratedExercise[], maxMinutes: number): number {
  let totalSeconds = 600; // گرم‌کردن
  for (const ex of exercises) {
    for (const set of ex.sets) {
      totalSeconds += 40 + set.restSeconds; // زمان ست + استراحت
    }
  }
  const minutes = Math.round(totalSeconds / 60);
  return Math.min(minutes, maxMinutes);
}

/**
 * روزهای تمرینی هفته (0=شنبه تا 6=جمعه)
 */
function getTrainingDayIndices(daysPerWeek: number): number[] {
  const patterns: Record<number, number[]> = {
    2: [0, 3],
    3: [0, 2, 4],
    4: [0, 1, 3, 4],
    5: [0, 1, 2, 4, 5],
    6: [0, 1, 2, 3, 4, 5],
    7: [0, 1, 2, 3, 4, 5, 6],
  };
  return patterns[daysPerWeek] || patterns[4];
}
