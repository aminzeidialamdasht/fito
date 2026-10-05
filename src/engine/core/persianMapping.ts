/**
 * نگاشت اصطلاحات فارسی پروفایل به انگلیسی موتور
 *
 * کاربر در Onboarding با فارسی تعامل می‌کند، ولی موتور با انگلیسی کار می‌کند.
 * این ماژول تبدیل را انجام می‌دهد.
 */

import type { MuscleGroup } from '../types/exercise';

/**
 * نگاشت عضلات فارسی → انگلیسی
 */
const MUSCLE_MAP: Record<string, MuscleGroup> = {
  // سینه و پشت
  'سینه': 'chest',
  'پشت': 'upper_back',
  'زیربغل': 'lats',
  'لت': 'lats',
  'پشت میانی': 'upper_back',
  'پایین پشت': 'lower_back',

  // سرشانه
  'سرشانه': 'front_delts',
  'سرشانه جلو': 'front_delts',
  'سرشانه کنار': 'side_delts',
  'سرشانه میانی': 'side_delts',
  'سرشانه پشت': 'rear_delts',
  'کول': 'traps',

  // بازو
  'جلوبازو': 'biceps',
  'پشت‌بازو': 'triceps',
  'پشت بازو': 'triceps',
  'ساعد': 'forearms',

  // پا
  'چهارسر ران': 'quads',
  'چهارسر': 'quads',
  'همسترینگ': 'hamstrings',
  'پشت پا': 'hamstrings',
  'سرینی': 'glutes',
  'باسن': 'glutes',
  'ساق': 'calves',
  'ساق پا': 'calves',

  // شکم
  'شکم': 'abs',
  'پهلو': 'obliques',
};

/**
 * نگاشت آسیب‌ها فارسی → انگلیسی (کلید InjuryRisk)
 */
const INJURY_MAP: Record<string, string> = {
  'شانه': 'shoulder',
  'کمر': 'lowerBack',
  'زانو': 'knee',
  'لگن': 'hip',
  'آرنج': 'elbow',
  'مچ': 'wrist',
  'مچ پا': 'ankle',
  'همسترینگ': 'hamstring',
  'گردن': 'neck',
  'سینه': 'chest',
};

/**
 * تبدیل نام فارسی عضله به MuscleGroup انگلیسی
 */
export function mapMuscleToEnglish(persianName: string): MuscleGroup | null {
  const trimmed = persianName.trim();
  return MUSCLE_MAP[trimmed] || null;
}

/**
 * تبدیل آرایه‌ی عضلات فارسی به انگلیسی
 */
export function mapMusclesToEnglish(persianMuscles: string[]): MuscleGroup[] {
  return persianMuscles
    .map(mapMuscleToEnglish)
    .filter((m): m is MuscleGroup => m !== null);
}

/**
 * تبدیل آسیب فارسی به کلید InjuryRisk
 */
export function mapInjuryToEnglish(persianInjury: string): string | null {
  const trimmed = persianInjury.trim();
  return INJURY_MAP[trimmed] || null;
}

/**
 * تبدیل آرایه‌ی آسیب‌ها
 */
export function mapInjuriesToEnglish(persianInjuries: string[]): string[] {
  return persianInjuries
    .map(mapInjuryToEnglish)
    .filter((i): i is string => i !== null);
}
