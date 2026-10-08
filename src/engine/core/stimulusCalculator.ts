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

/**
 * محاسبه نمره تحریک عضلانی (0-100)
 *
 * بر اساس:
 * - مجموع Effective Sets
 * - نسبت به MAV (Maximum Adaptive Volume)
 *
 * @param effectiveVolume مجموع Effective Sets برای هر عضله
 * @param targetVolume حجم هدف (MAV)
 * @returns نمره 0-100
 */
export function calculateStimulusScore(
  effectiveVolume: Partial<Record<MuscleGroup, number>>,
  targetVolume: Partial<Record<MuscleGroup, number>>
): number {
  const muscles = Object.keys(effectiveVolume) as MuscleGroup[];
  if (muscles.length === 0) return 0;

  let totalScore = 0;
  let muscleCount = 0;

  for (const muscle of muscles) {
    const effective = effectiveVolume[muscle] || 0;
    const target = targetVolume[muscle] || 10;
    if (effective <= 0 || target <= 0) continue;

    // نسبت effective به target (0 تا 1+)
    const ratio = effective / target;

    // نمره: 100 اگر = target، کمتر اگر زیر، کمتر اگر خیلی بالاتر
    let muscleScore: number;
    if (ratio <= 1) {
      // زیر هدف: نمره = ratio × 100
      muscleScore = ratio * 100;
    } else if (ratio <= 1.2) {
      // کمی بالاتر از هدف: نمره = 100
      muscleScore = 100;
    } else {
      // خیلی بالاتر: کاهش نمره (خطر overtraining)
      muscleScore = Math.max(0, 100 - (ratio - 1.2) * 100);
    }

    totalScore += muscleScore;
    muscleCount++;
  }

  return muscleCount > 0 ? Math.round(totalScore / muscleCount) : 0;
}
