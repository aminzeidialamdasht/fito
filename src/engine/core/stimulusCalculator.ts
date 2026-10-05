/**
 * محاسبه ضریب تحریک (Stimulus Coefficient) برای هر عضله
 *
 * هدف: تبدیل حجم مستقیم به حجم مؤثر
 *
 * Effective Sets = Direct Sets + (Secondary Sets × coefficient)
 *
 * قاعده:
 * - عضله اصلی: 1.0
 * - عضلات ثانویه compound: 0.5
 * - عضلات ثانویه isolation: 0.3
 */

import type { Exercise, MuscleGroup } from '../types/exercise';

/**
 * محاسبه ضرایب تحریک برای یک حرکت
 */
export function getStimulusCoefficients(
  exercise: Exercise
): Partial<Record<MuscleGroup, number>> {
  const coefficients: Partial<Record<MuscleGroup, number>> = {};

  // عضله اصلی: 1.0
  coefficients[exercise.primaryMuscle] = 1.0;

  // عضلات ثانویه
  const secondaryCoeff = exercise.type === 'compound' ? 0.5 : 0.3;

  for (const muscle of exercise.secondaryMuscles) {
    // اگر عضله از قبل در coefficients هست، بیشترین مقدار را نگه دار
    const current = coefficients[muscle] || 0;
    coefficients[muscle] = Math.max(current, secondaryCoeff);
  }

  return coefficients;
}

/**
 * محاسبه Effective Sets برای یک حرکت
 *
 * @param exercise حرکت
 * @param directSets تعداد ست مستقیم
 * @returns map از عضله به Effective Sets
 */
export function calculateEffectiveSets(
  exercise: Exercise,
  directSets: number
): Partial<Record<MuscleGroup, number>> {
  const coeffs = getStimulusCoefficients(exercise);
  const effective: Partial<Record<MuscleGroup, number>> = {};

  for (const [muscle, coeff] of Object.entries(coeffs)) {
    // گرد کردن به یک رقم اعشار
    const value = directSets * (coeff as number);
    effective[muscle as MuscleGroup] = Math.round(value * 10) / 10;
  }

  return effective;
}

/**
 * افزودن Effective Sets به volume accumulator
 */
export function addEffectiveSetsToVolume(
  volume: Partial<Record<MuscleGroup, number>>,
  exercise: Exercise,
  directSets: number
): void {
  const effective = calculateEffectiveSets(exercise, directSets);

  for (const [muscle, sets] of Object.entries(effective)) {
    const m = muscle as MuscleGroup;
    const current = volume[m] || 0;
    // گرد کردن به یک رقم اعشار
    volume[m] = Math.round((current + (sets as number)) * 10) / 10;
  }
}
