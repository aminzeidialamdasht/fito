/**
 * موتور تولید برنامه تمرینی آفلاین فیتو
 * OfflineFito Engine v1.0.0
 *
 * استفاده:
 * ```ts
 * import { generateOfflineWorkout } from '@/engine';
 * const program = generateOfflineWorkout(profile);
 * ```
 */

// ============================================
// API اصلی
// ============================================

export { generateWorkoutProgram as generateOfflineWorkout, ENGINE_VERSION } from './generators/workoutGenerator';

// ============================================
// تایپ‌ها
// ============================================

export type {
  Exercise,
  MuscleGroup,
  MovementPattern,
  ExerciseType,
  EquipmentType,
  DifficultyLevel,
  InjuryRiskLevel,
  InjuryRisk,
  RepRange,
} from './types/exercise';

export type {
  Goal,
  ExperienceLevel,
  SplitType,
  SessionFocus,
  GeneratedSet,
  GeneratedExercise,
  GeneratedDay,
  GeneratedProgram,
} from './types/program';

export type { ProfileAnalysis } from './core/profileAnalyzer';
export type { SplitPlan, SplitSession } from './core/splitSelector';

// ============================================
// دیتابیس حرکات
// ============================================

export {
  ALL_EXERCISES,
  EXERCISE_DB_STATS,
  getExerciseById,
  getExercisesByMuscle,
  getExercisesByEquipment,
  getExercisesByDifficulty,
  getSafeExercises,
  filterAvoidedExercises,
  CHEST_EXERCISES,
  BACK_EXERCISES,
  SHOULDER_EXERCISES,
  ARM_EXERCISES,
  LEG_EXERCISES,
  ABS_EXERCISES,
} from './data/exercises';

// ============================================
// قوانین و ابزارها
// ============================================

export {
  BASE_VOLUME_BY_EXPERIENCE,
  MUSCLE_VOLUME_MULTIPLIER,
  GOAL_VOLUME_MODIFIER,
  MAX_VOLUME_PER_SESSION,
  getTargetWeeklyVolume,
} from './data/rules/volumeRules';

export { analyzeProfile } from './core/profileAnalyzer';
export { selectSplit, getSplitName } from './core/splitSelector';
export { selectExercisesForMuscle, selectExercisesForSession } from './core/exerciseSelector';
