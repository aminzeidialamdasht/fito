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
  BICEPS_EXERCISES,
  TRICEPS_EXERCISES,
  FOREARMS_EXERCISES,
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

// ============================================
// Phase 6 — Advanced Training Systems
// ============================================

// Types
export type {
  TrainingTechnique,
  TechniqueConfig,
  WeeklyProgressionStep,
} from './types/program';

export type {
  ProgramSystemId,
  ProgramSystemRule,
  TechniqueRule,
} from './data/rules/trainingSystems';

export type {
  ExerciseSlot,
} from './core/systemSelector';

// Data
export {
  PROGRAM_SYSTEMS,
  TECHNIQUES,
  TECHNIQUES_BASIC,
  TECHNIQUES_ADVANCED,
} from './data/rules/trainingSystems';

// Functions
export {
  getTechniqueRule,
  getProgramSystem,
} from './data/rules/trainingSystems';

export {
  selectProgramSystem,
  planSessionTechniques,
} from './core/systemSelector';

export {
  applyTechniquesToExercises,
} from './core/techniqueApplier';
