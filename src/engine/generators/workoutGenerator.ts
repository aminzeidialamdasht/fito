/**
 * ماشین تولید برنامه تمرینی آفلاین
 * ترکیب تمام ماژول‌ها برای تولید JSON نهایی سازگار با اپ
 */

import type { AthleteProfile } from '../../types';
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
export function generateWorkoutProgram(profile: AthleteProfile): GeneratedProgram {
  // ۱. تحلیل پروفایل
  const analysis = analyzeProfile(profile);

  // ۲. انتخاب Split
  const split = selectSplit(analysis.weeklyTrainingDays, analysis.experience, analysis.goal);

  // ۳. تولید جلسات
  const sessionDayIndices = getTrainingDayIndices(analysis.weeklyTrainingDays);
  const days: GeneratedDay[] = [];
  const allSelectedIds: string[] = [];
  const weeklyVolume: Partial<Record<MuscleGroup, number>> = {};

  for (let i = 0; i < split.sessions.length; i++) {
    const session = split.sessions[i];
    const dayIndex = sessionDayIndices[i];

    const day = generateDay(
      dayIndex,
      session.title,
      session.muscleGroups as MuscleGroup[],
      analysis,
      allSelectedIds,
      weeklyVolume
    );

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
    durationWeeks: analysis.programDurationWeeks,
    createdAt: new Date().toISOString(),
    days,
    restDays,
    weeklyVolumeSummary,
    metadata: {
      engineVersion: ENGINE_VERSION,
      generatedFrom: 'offline_engine',
      notes: `برنامه تولیدشده توسط موتور آفلاین کوچینو نسخه ${ENGINE_VERSION}`,
    },
  };

  return program;
}

/**
 * تولید یک جلسه تمرینی
 */
function generateDay(
  dayIndex: number,
  title: string,
  muscleGroups: MuscleGroup[],
  analysis: ProfileAnalysis,
  allSelectedIds: string[],
  weeklyVolume: Partial<Record<MuscleGroup, number>>
): GeneratedDay {
  // تعداد حرکات بر اساس مدت جلسه
  const exerciseCount = calculateExerciseCount(analysis.sessionMinutes, analysis.experience);

  // انتخاب حرکات
  const selectedExercises = selectExercisesForSession(
    muscleGroups,
    analysis,
    allSelectedIds,
    exerciseCount
  );

  // تبدیل به GeneratedExercise
  const generatedExercises: GeneratedExercise[] = selectedExercises.map((ex) => {
    const sets = generateSets(ex, analysis);

    // ثبت حجم هفتگی
    weeklyVolume[ex.primaryMuscle] = (weeklyVolume[ex.primaryMuscle] || 0) + sets.length;

    return {
      exerciseId: ex.id,
      name: ex.name,
      englishName: ex.englishName,
      primaryMuscle: ex.primaryMuscle,
      secondaryMuscles: ex.secondaryMuscles,
      type: ex.type,
      sets,
      notes: ex.cues[0] || undefined,
      substituteId: ex.substitutes[0] || undefined,
    };
  });

  // اضافه کردن به لیست انتخاب‌شده‌ها
  for (const ex of selectedExercises) {
    allSelectedIds.push(ex.id);
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
function generateSets(exercise: Exercise, analysis: ProfileAnalysis): GeneratedSet[] {
  const setCount = calculateSetCount(exercise, analysis);
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

  // RIR پایه
  let baseRIR = rirRange.min;
  if (analysis.experience === 'beginner') baseRIR = Math.min(baseRIR + 1, rirRange.max);

  const repsStr = `${repRange.min}-${repRange.max}`;
  const restSeconds = Math.round((exercise.restSeconds.min + exercise.restSeconds.max) / 2);

  const sets: GeneratedSet[] = [];
  for (let i = 1; i <= setCount; i++) {
    sets.push({
      setNumber: i,
      targetReps: repsStr,
      targetRIR: baseRIR,
      restSeconds,
      tempo: exercise.tempo,
    });
  }

  return sets;
}

/**
 * محاسبه تعداد ست برای یک حرکت
 */
function calculateSetCount(exercise: Exercise, analysis: ProfileAnalysis): number {
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

  // محدودیت حجم هر جلسه
  const maxPerSession = MAX_VOLUME_PER_SESSION[exercise.primaryMuscle] || 10;
  sets = Math.min(sets, Math.ceil(maxPerSession / 2));

  return sets;
}

/**
 * تخمین مدت جلسه
 */
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
