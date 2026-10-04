/**
 * تبدیل پروفایل کاربر به پارامترهای موتور جایگزینی
 */

import type { AthleteProfile } from '../../types';
import type { EquipmentType, InjuryRisk } from '../types/exercise';

/**
 * تبدیل equipmentType + location + custom equipment به EquipmentType[]
 */
export function profileToEquipment(profile: AthleteProfile | null): EquipmentType[] {
  if (!profile) {
    // اگر پروفایل نیست، همه تجهیزات را فرض کن
    return [
      'barbell', 'dumbbell', 'machine', 'cable', 'bodyweight',
      'bench', 'pull_up_bar', 'dip_station', 'smith_machine',
      'kettlebell', 'bands', 'ez_bar', 'trx',
    ];
  }

  const set = new Set<EquipmentType>();

  // پایه: همه پروفایل‌ها bodyweight دارند
  set.add('bodyweight');

  // بر اساس equipmentType
  switch (profile.equipmentType) {
    case 'full_gym':
      set.add('barbell');
      set.add('dumbbell');
      set.add('machine');
      set.add('cable');
      set.add('bench');
      set.add('pull_up_bar');
      set.add('dip_station');
      set.add('smith_machine');
      set.add('ez_bar');
      set.add('preacher_bench');
      set.add('kettlebell');
      set.add('bands');
      break;

    case 'home':
      set.add('dumbbell');
      set.add('bench');
      set.add('bands');
      set.add('pull_up_bar');
      break;

    case 'park':
      set.add('pull_up_bar');
      set.add('dip_station');
      break;

    case 'custom':
      // بر اساس آرایه equipment
      break;
  }

  // equipment سفارشی کاربر را اضافه کن (اگر معتبر بود)
  if (Array.isArray(profile.equipment)) {
    for (const eq of profile.equipment) {
      if (isValidEquipmentType(eq)) {
        set.add(eq as EquipmentType);
      }
    }
  }

  return Array.from(set);
}

const VALID_EQUIPMENT: ReadonlySet<string> = new Set([
  'barbell', 'dumbbell', 'machine', 'cable', 'bodyweight',
  'kettlebell', 'bands', 'smith_machine', 'ez_bar',
  'bench', 'preacher_bench', 'pull_up_bar', 'dip_station', 'trx',
]);

function isValidEquipmentType(eq: string): boolean {
  return VALID_EQUIPMENT.has(eq);
}

/**
 * تبدیل injuries پروفایل به InjuryRisk برای موتور
 */
export function profileToInjuries(profile: AthleteProfile | null): Partial<InjuryRisk> {
  if (!profile) return {};

  const injuries: Partial<InjuryRisk> = {};

  // اگر injuryDetails هست، از آن استفاده کن
  if (profile.injuries && Array.isArray(profile.injuries)) {
    for (const injury of profile.injuries) {
      const normalized = injury.toLowerCase().trim();

      // نگاشت کلمات کلیدی فارسی/انگلیسی به کلیدهای InjuryRisk
      if (normalized.includes('شانه') || normalized.includes('shoulder')) {
        injuries.shoulder = 'medium';
      }
      if (normalized.includes('کمر') || normalized.includes('lower back') || normalized.includes('کمری')) {
        injuries.lowerBack = 'medium';
      }
      if (normalized.includes('زانو') || normalized.includes('knee')) {
        injuries.knee = 'medium';
      }
      if (normalized.includes('لگن') || normalized.includes('hip')) {
        injuries.hip = 'medium';
      }
      if (normalized.includes('آرنج') || normalized.includes('elbow')) {
        injuries.elbow = 'medium';
      }
      if (normalized.includes('مچ') || normalized.includes('wrist')) {
        injuries.wrist = 'medium';
      }
      if (normalized.includes('مچ پا') || normalized.includes('ankle')) {
        injuries.ankle = 'medium';
      }
      if (normalized.includes('همسترینگ') || normalized.includes('hamstring') || normalized.includes('پشت پا')) {
        injuries.hamstring = 'medium';
      }
      if (normalized.includes('گردن') || normalized.includes('neck')) {
        injuries.neck = 'medium';
      }
    }
  }

  return injuries;
}

/**
 * بررسی می‌کند آیا حرکت توسط کاربر اجتناب شده یا خیر
 */
export function isAvoided(profile: AthleteProfile | null, exerciseId: string): boolean {
  if (!profile) return false;
  return Array.isArray(profile.avoidedExercises) && profile.avoidedExercises.includes(exerciseId);
}
