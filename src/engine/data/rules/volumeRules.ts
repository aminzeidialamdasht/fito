/**
 * قوانین حجم تمرینی
 *
 * منابع:
 * - Israetel et al. (2017) - Scientific Principles of Strength Training
 * - Schoenfeld et al. (2017) - Dose-Response of Weekly Volume
 * - Helms et al. (2014) - Recommendations for Natural Bodybuilding
 */

import type { MuscleGroup } from '../../types/exercise';
import type { ExperienceLevel, Goal } from '../../types/program';

/** محدودیت‌های حجم هفتگی (ست در هفته) */
export interface VolumeLandmarks {
  mev: number; // Minimum Effective Volume
  mav: number; // Maximum Adaptive Volume
  mrv: number; // Maximum Recoverable Volume
}

/** حجم پایه بر اساس سطح تجربه */
export const BASE_VOLUME_BY_EXPERIENCE: Record<ExperienceLevel, VolumeLandmarks> = {
  beginner:     { mev: 4,  mav: 10, mrv: 14 },
  intermediate: { mev: 6,  mav: 14, mrv: 20 },
  advanced:     { mev: 8,  mav: 18, mrv: 24 },
  professional: { mev: 10, mav: 22, mrv: 28 },
};

/** حجم اختصاصی هر عضله (ضریب نسبت به پایه) */
export const MUSCLE_VOLUME_MULTIPLIER: Record<MuscleGroup, number> = {
  chest:       1.2,
  upper_back:  1.3,
  lats:        1.3,
  // عضلات کمکی — MEV پایین‌تر (چون از compoundها Effective می‌گیرند)
  lower_back:  0.4,
  traps:       0.4,
  forearms:    0.3,
  obliques:    0.4,
  // عضلات متوسط
  front_delts: 0.9,
  side_delts:  1.0,
  rear_delts:  0.9,
  biceps:      0.9,
  triceps:     0.9,
  // عضلات بزرگ
  quads:       1.3,
  hamstrings:  1.0,
  glutes:      1.0,
  calves:      0.5,
  abs:         0.9,
};

/** تنظیم حجم بر اساس هدف */
export const GOAL_VOLUME_MODIFIER: Record<Goal, number> = {
  hypertrophy:    1.0,
  strength:       0.7,
  fat_loss:       0.85,
  recomposition:  0.9,
  competition:    1.1,
  general_fitness: 0.8,
};


/**
 * تنظیم MEV اختصاصی برای عضلات کمکی
 * این عضلات از compoundها Effective می‌گیرند و MEV واقعی‌شان پایین‌تر است.
 */
function getMuscleSpecificMEV(
  muscle: MuscleGroup,
  baseMEV: number
): number {
  const accessoryMuscles: Partial<Record<MuscleGroup, number>> = {
    traps: 3,
    forearms: 3,
    obliques: 3,
    lower_back: 6,
    calves: 4,
    abs: 5,
    rear_delts: 8,
    front_delts: 5,
    biceps: 5,
    triceps: 5,
  };

  return accessoryMuscles[muscle] ?? baseMEV;
}


/**
 * ضریب اولویت‌داری بر اساس اندازه عضله
 * عضلات بزرگ (سینه، پشت، پا) → ضریب کمتر (چون Effective از compound زیاد است)
 * عضلات کوچک (سرشانه کنار، بازو) → ضریب بیشتر
 */
function getPriorityModifier(muscle: MuscleGroup): number {
  const largeMuscles: MuscleGroup[] = ['chest', 'upper_back', 'lats', 'quads', 'hamstrings', 'glutes'];
  const smallMuscles: MuscleGroup[] = ['side_delts', 'rear_delts', 'biceps', 'triceps', 'calves', 'forearms', 'traps', 'abs', 'obliques'];

  if (largeMuscles.includes(muscle)) return 1.15;   // عضلات بزرگ
  if (smallMuscles.includes(muscle)) return 1.4;    // عضلات کوچک
  return 1.25;                                       // عضلات متوسط (سرشانه جلو، ...)
}

/** محاسبه حجم هفتگی هدف برای یک عضله */
export function getTargetWeeklyVolume(
  muscle: MuscleGroup,
  experience: ExperienceLevel,
  goal: Goal,
  isPriority: boolean = false
): { min: number; max: number; target: number } {
  const base = BASE_VOLUME_BY_EXPERIENCE[experience];
  const muscleMultiplier = MUSCLE_VOLUME_MULTIPLIER[muscle] || 1.0;
  const goalModifier = GOAL_VOLUME_MODIFIER[goal] || 1.0;
  const priorityModifier = isPriority ? getPriorityModifier(muscle) : 1.0;

  const target = Math.round(base.mav * muscleMultiplier * goalModifier * priorityModifier);
  const min = Math.max(base.mev, Math.round(base.mev * muscleMultiplier * goalModifier));
  const max = Math.round(base.mrv * muscleMultiplier * goalModifier * priorityModifier);

  return {
    min,
    max: Math.min(max, 30),
    target: Math.min(target, 28),
  };
}

/**
 * توزیع حجم در روزهای تمرینی
 * برای جلوگیری از خستگی مفرط، حجم هر عضله در هر جلسه محدود می‌شود.
 */
export const MAX_VOLUME_PER_SESSION: Record<MuscleGroup, number> = {
  chest:       10,
  upper_back:  10,
  lats:        10,
  lower_back:  6,
  traps:       8,
  front_delts: 8,
  side_delts:  10,
  rear_delts:  8,
  biceps:      8,
  triceps:     8,
  forearms:    6,
  quads:       12,
  hamstrings:  8,
  glutes:      10,
  calves:      10,
  abs:         10,
  obliques:    8,
};
