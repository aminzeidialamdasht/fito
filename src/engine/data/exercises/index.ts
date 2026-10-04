/**
 * دیتابیس جامع حرکات تمرینی
 *
 * منابع علمی:
 * - ExRx.net Exercise Directory
 * - NSCA Essentials of Strength Training
 * - ACE Personal Trainer Manual
 * - Bret Contreras "Strong Curves"
 * - Schoenfeld et al. (2017) - Hypertrophy Research
 * - Israetel et al. (2017) - Scientific Principles of Strength Training
 */

import type { Exercise, MuscleGroup, EquipmentType, DifficultyLevel, MovementPattern } from '../../types/exercise';
import { CHEST_EXERCISES } from './chest';
import { BACK_EXERCISES } from './back';
import { SHOULDER_EXERCISES } from './shoulders';
import { ARM_EXERCISES } from './arms';
import { LEG_EXERCISES } from './legs';
import { ABS_EXERCISES } from './abs';

/** دیتابیس کامل حرکات */
export const ALL_EXERCISES: Exercise[] = [
  ...CHEST_EXERCISES,
  ...BACK_EXERCISES,
  ...SHOULDER_EXERCISES,
  ...ARM_EXERCISES,
  ...LEG_EXERCISES,
  ...ABS_EXERCISES,
];

/** آمار دیتابیس */
export const EXERCISE_DB_STATS = {
  total: ALL_EXERCISES.length,
  byMuscle: {} as Record<MuscleGroup, number>,
  byEquipment: {} as Record<EquipmentType, number>,
  byDifficulty: {} as Record<DifficultyLevel, number>,
  compound: 0,
  isolation: 0,
  spineSensitive: 0,
};

// محاسبه آمار
for (const ex of ALL_EXERCISES) {
  EXERCISE_DB_STATS.byMuscle[ex.primaryMuscle] = (EXERCISE_DB_STATS.byMuscle[ex.primaryMuscle] || 0) + 1;
  for (const eq of ex.equipment) {
    EXERCISE_DB_STATS.byEquipment[eq] = (EXERCISE_DB_STATS.byEquipment[eq] || 0) + 1;
  }
  EXERCISE_DB_STATS.byDifficulty[ex.difficulty] = (EXERCISE_DB_STATS.byDifficulty[ex.difficulty] || 0) + 1;
  if (ex.isCompound) EXERCISE_DB_STATS.compound++;
  else EXERCISE_DB_STATS.isolation++;
  if (ex.isSpineSensitive) EXERCISE_DB_STATS.spineSensitive++;
}

/**
 * جستجوی حرکت با شناسه
 */
export function getExerciseById(id: string): Exercise | undefined {
  return ALL_EXERCISES.find((ex) => ex.id === id);
}

/**
 * فیلتر حرکات بر اساس عضله اصلی
 */
export function getExercisesByMuscle(muscle: MuscleGroup): Exercise[] {
  return ALL_EXERCISES.filter((ex) => ex.primaryMuscle === muscle);
}

/**
 * فیلتر حرکات بر اساس تجهیزات موجود
 */
export function getExercisesByEquipment(availableEquipment: EquipmentType[]): Exercise[] {
  return ALL_EXERCISES.filter((ex) =>
    ex.equipment.every((eq) => availableEquipment.includes(eq) || eq === 'bodyweight')
  );
}

/**
 * فیلتر حرکات بر اساس سطح دشواری
 */
export function getExercisesByDifficulty(maxDifficulty: DifficultyLevel): Exercise[] {
  return ALL_EXERCISES.filter((ex) => ex.difficulty <= maxDifficulty);
}

/**
 * فیلتر حرکات امن (بدون خطر آسیب)
 */
export function getSafeExercises(avoidInjuries: string[]): Exercise[] {
  if (!avoidInjuries || avoidInjuries.length === 0) return ALL_EXERCISES;
  return ALL_EXERCISES.filter((ex) => {
    for (const injury of avoidInjuries) {
      const risk = (ex.injuryRisk as any)[injury];
      if (risk === 'high') return false;
    }
    return true;
  });
}

/**
 * فیلتر حرکات با حذف حرکات اجتنابی کاربر
 */
export function filterAvoidedExercises(avoidedIds: string[]): Exercise[] {
  return ALL_EXERCISES.filter((ex) => !avoidedIds.includes(ex.id));
}

// Export all individual databases for direct access
export { CHEST_EXERCISES, BACK_EXERCISES, SHOULDER_EXERCISES, ARM_EXERCISES, LEG_EXERCISES, ABS_EXERCISES };

// Re-export types
export type { Exercise, MuscleGroup, EquipmentType, DifficultyLevel, MovementPattern };
