/**
 * انتخاب‌گر حرکات برای برنامه تمرینی
 * انتخاب حرکات بر اساس عضله، تجهیزات، آسیب‌ها و سطح
 */

import type { Exercise, MuscleGroup, EquipmentType } from '../types/exercise';
import type { ExperienceLevel, Goal } from '../types/program';
import { ALL_EXERCISES } from '../data/exercises';
import type { ProfileAnalysis } from './profileAnalyzer';

export interface ExerciseSelectionOptions {
  muscle: MuscleGroup;
  analysis: ProfileAnalysis;
  alreadySelected: string[];
  preferCompound?: boolean;
  count?: number;
  /** اگر true، فقط حرکاتی که primaryMuscle برابر muscle است */
  onlyPrimary?: boolean;
}

/**
 * نگاشت تجهیزات پروفایل به تجهیزات دیتابیس
 */
function mapProfileEquipment(equipmentType: string, customEquipment: string[]): EquipmentType[] {
  const map: Record<string, EquipmentType[]> = {
    full_gym: ['barbell', 'dumbbell', 'machine', 'cable', 'ez_bar', 'bench', 'pull_up_bar', 'dip_station', 'smith_machine', 'bodyweight'],
    home: ['dumbbell', 'bodyweight', 'bands', 'bench'],
    park: ['bodyweight', 'pull_up_bar', 'dip_station'],
    custom: ['bodyweight'],
  };

  const base = map[equipmentType] || map.full_gym;

  // اضافه کردن تجهیزات سفارشی
  if (customEquipment && customEquipment.length > 0) {
    for (const ce of customEquipment) {
      const lower = ce.toLowerCase();
      if (lower.includes('هالتر') || lower.includes('barbell')) base.push('barbell');
      if (lower.includes('دمبل') || lower.includes('dumbbell')) base.push('dumbbell');
      if (lower.includes('سیم') || lower.includes('cable')) base.push('cable');
      if (lower.includes('دستگاه') || lower.includes('machine')) base.push('machine');
      if (lower.includes('بارفیکس') || lower.includes('pull')) base.push('pull_up_bar');
    }
  }

  return Array.from(new Set(base));
}

/**
 * بررسی امکان اجرای حرکت با تجهیزات موجود
 */
function canPerform(exercise: Exercise, availableEquipment: EquipmentType[]): boolean {
  if (exercise.equipment.length === 0) return true;
  return exercise.equipment.every(
    (eq) => availableEquipment.includes(eq) || eq === 'bodyweight'
  );
}

/**
 * بررسی ایمنی حرکت با توجه به آسیب‌های کاربر
 */
function isSafeForUser(exercise: Exercise, safeInjuries: string[]): boolean {
  for (const injury of safeInjuries) {
    const risk = (exercise.injuryRisk as any)[injury];
    if (risk === 'high') return false;
  }
  return true;
}

/**
 * بررسی مناسب بودن سطح دشواری
 */
function isSuitableDifficulty(exercise: Exercise, experience: ExperienceLevel): boolean {
  const maxDifficulty: Record<ExperienceLevel, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    professional: 3,
  };
  return exercise.difficulty <= maxDifficulty[experience];
}

/**
 * امتیازدهی به حرکت برای انتخاب بهتر
 */
function scoreExercise(
  exercise: Exercise,
  analysis: ProfileAnalysis,
  preferCompound: boolean
): number {
  let score = 0;

  // ترجیح Compound یا Isolation
  if (preferCompound && exercise.isCompound) score += 10;
  if (!preferCompound && !exercise.isCompound) score += 10;

  // حرکات پایه امتیاز بیشتری می‌گیرند
  if (exercise.isCompound) score += 5;

  // مناسب بودن با هدف
  if (analysis.goal === 'strength' && exercise.isCompound) score += 8;
  if (analysis.goal === 'hypertrophy') score += 3;
  if (analysis.goal === 'fat_loss' && exercise.isCompound) score += 4;

  // حرکات امن امتیاز بیشتری می‌گیرند
  const safetyScore = 10 - (exercise.injuryRisk.shoulder === 'high' ? 5 : 0) - (exercise.injuryRisk.lowerBack === 'high' ? 5 : 0);
  score += safetyScore;

  // عضلات اولویت‌دار
  const muscleName = exercise.primaryMuscle;
  if (analysis.priorityMuscles.some((pm) => pm.toLowerCase().includes(muscleName))) {
    score += 6;
  }

  return score;
}

/**
 * انتخاب حرکات برای یک عضله مشخص
 */
export function selectExercisesForMuscle(
  options: ExerciseSelectionOptions
): Exercise[] {
  const { muscle, analysis, alreadySelected, preferCompound = true, count = 2, onlyPrimary = false } = options;

  const availableEquipment = mapProfileEquipment(
    analysis.equipmentType,
    analysis.customEquipment || []
  );

  let candidates = ALL_EXERCISES.filter((ex) => {
    if (ex.primaryMuscle !== muscle && !ex.secondaryMuscles.includes(muscle)) return false;
    if (alreadySelected.includes(ex.id)) return false;
    if (!canPerform(ex, availableEquipment)) return false;
    if (!isSafeForUser(ex, analysis.safeInjuries)) return false;
    if (!isSuitableDifficulty(ex, analysis.experience)) return false;
    return true;
  });

  if (candidates.length === 0) return [];

  // اگر حرکات کافی نیستند، محدودیت تجهیزات را کم می‌کنیم
  if (candidates.length < count) {
    candidates = ALL_EXERCISES.filter((ex) => {
      if (ex.primaryMuscle !== muscle && !ex.secondaryMuscles.includes(muscle)) return false;
      if (alreadySelected.includes(ex.id)) return false;
      if (!isSafeForUser(ex, analysis.safeInjuries)) return false;
      return true;
    });
  }

  // امتیازدهی و مرتب‌سازی
  const scored = candidates.map((ex) => ({
    exercise: ex,
    score: scoreExercise(ex, analysis, preferCompound) + Math.random() * 2,
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, count).map((s) => s.exercise);
}

/**
 * انتخاب حرکات برای یک جلسه کامل
 */
export function selectExercisesForSession(
  muscleGroups: string[],
  analysis: ProfileAnalysis,
  alreadySelected: string[],
  targetCount: number
): Exercise[] {
  const selected: Exercise[] = [];
  const selectedIds = [...alreadySelected];

  // ابتدا حرکات پایه چندمفصلی
  const compoundPriorityMuscles = muscleGroups.slice(0, Math.ceil(muscleGroups.length / 2));
  for (const muscle of compoundPriorityMuscles) {
    if (selected.length >= targetCount) break;
    const picked = selectExercisesForMuscle({
      muscle: muscle as MuscleGroup,
      analysis,
      alreadySelected: selectedIds,
      preferCompound: true,
      count: 1,
    });
    for (const ex of picked) {
      selected.push(ex);
      selectedIds.push(ex.id);
    }
  }

  // سپس حرکات ایزوله
  for (const muscle of muscleGroups) {
    if (selected.length >= targetCount) break;
    const picked = selectExercisesForMuscle({
      muscle: muscle as MuscleGroup,
      analysis,
      alreadySelected: selectedIds,
      preferCompound: false,
      count: 1,
    });
    for (const ex of picked) {
      selected.push(ex);
      selectedIds.push(ex.id);
    }
  }

  // اگر هنوز کم است، دوباره از همه عضلات امتحان می‌کنیم
  let attempt = 0;
  while (selected.length < targetCount && attempt < 10) {
    let added = false;
    for (const muscle of muscleGroups) {
      if (selected.length >= targetCount) break;
      const picked = selectExercisesForMuscle({
        muscle: muscle as MuscleGroup,
        analysis,
        alreadySelected: selectedIds,
        preferCompound: false,
        count: 1,
      });
      if (picked.length > 0) {
        selected.push(picked[0]);
        selectedIds.push(picked[0].id);
        added = true;
      }
    }
    if (!added) break;
    attempt++;
  }

  return selected;
}
