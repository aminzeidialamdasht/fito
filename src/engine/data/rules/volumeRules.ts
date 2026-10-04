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
  lower_back:  0.6,
  traps:       0.7,
  front_delts: 0.9,
  side_delts:  1.0,
  rear_delts:  0.9,
  biceps:      0.9,
  triceps:     0.9,
  forearms:    0.5,
  quads:       1.3,
  hamstrings:  1.0,
  glutes:      1.0,
  calves:      0.9,
  abs:         0.9,
  obliques:    0.6,
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
  const priorityModifier = isPriority ? 1.4 : 1.0;

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
