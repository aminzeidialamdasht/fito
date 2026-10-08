/**
 * نگاشت تجهیزات فارسی (UI) به انگلیسی (موتور)
 *
 * مسئله: کاربر در Onboarding نام فارسی انتخاب می‌کند
 * ولی موتور فقط EquipmentType انگلیسی را می‌شناسد.
 */

import type { EquipmentType } from '../types/exercise';

export const EQUIPMENT_FA_TO_EN: Record<string, EquipmentType> = {
  // هالتر
  'هالتر': 'barbell',
  'صفحه وزنه': 'barbell',

  // دمبل
  'دمبل': 'dumbbell',
  'دمبل متغیر': 'dumbbell',

  // دستگاه سیم‌کش
  'دستگاه سیم‌کش': 'cable',
  'زیربغل سیم‌کش': 'cable',
  'سیم‌کش پایین': 'cable',
  'سیم‌کش بالا': 'cable',

  // دستگاه
  'دستگاه اسمیت': 'smith_machine',
  'پرس پا': 'machine',
  'دستگاه پرس سینه': 'machine',

  // نیمکت
  'نیمکت': 'bench',

  // بارفیکس
  'میله بارفیکس': 'pull_up_bar',

  // پارالل
  'پارالل': 'dip_station',

  // کتل‌بل
  'کتل‌بل': 'kettlebell',

  // TRX
  'تی‌آر‌ایکس': 'trx',

  // کش
  'کش مقاومتی': 'bands',

  // وزن بدن
  'وزن بدن': 'bodyweight',
};

/**
 * تبدیل نام فارسی به EquipmentType انگلیسی
 * @returns EquipmentType یا null اگر نام معتبر نباشد
 */
export function mapEquipmentFaToEn(fa: string): EquipmentType | null {
  if (!fa) return null;
  const trimmed = fa.trim();
  return EQUIPMENT_FA_TO_EN[trimmed] || null;
}

/**
 * تبدیل آرایه تجهیزات فارسی به آرایه EquipmentType انگلیسی
 * (بدون تکرار)
 */
export function mapEquipmentArrayFaToEn(faArray: string[]): EquipmentType[] {
  const set = new Set<EquipmentType>();
  for (const fa of faArray) {
    const en = mapEquipmentFaToEn(fa);
    if (en) set.add(en);
  }
  return Array.from(set);
}
