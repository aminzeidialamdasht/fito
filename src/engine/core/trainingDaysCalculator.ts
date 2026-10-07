/**
 * محاسبه علمی تعداد روزهای تمرین بهینه
 *
 * بر اساس:
 * - سطح تجربه (Schoenfeld et al., 2016)
 * - هدف (Helms et al., 2014)
 * - حجم تمرین (Israetel et al., 2018)
 * - مدت جلسه
 * - سن و ریکاوری
 */

import type { AthleteProfile } from '../../types';

export interface TrainingDaysRecommendation {
  min: number;
  max: number;
  recommended: number;
  reason: string;
}

/**
 * محاسبه تعداد روزهای تمرین بهینه بر اساس اصول علمی
 */
export function calculateOptimalTrainingDays(
  profile: Partial<AthleteProfile>
): TrainingDaysRecommendation {
  const experience = (profile.experience || 'intermediate') as
    | 'beginner'
    | 'intermediate'
    | 'advanced'
    | 'professional';
  const goal = profile.primaryGoal || 'hypertrophy';
  const age = Number(profile.age) || 30;
  const sessionMinutes = Number(profile.sessionDuration) || 60;
  const recoveryQuality = profile.recoveryQuality || 'good';
  const sleepHours = Number(profile.sleepHours) || 7;
  const jobStress = profile.jobStress || 'medium';
  const workShift = profile.workShift || 'day';

  // ═══════════════════════════════════════════════════════════
  //  مرحله ۱: بازه پایه بر اساس سطح تجربه
  // ═══════════════════════════════════════════════════════════
  let min = 2;
  let max = 4;
  let recommended = 3;
  let reason = '';

  switch (experience) {
    case 'beginner':
      min = 2;
      max = 4;
      recommended = 3;
      reason = 'برای مبتدی، ۲ تا ۴ روز فول‌بادی بهترین رشد رو می‌ده.';
      break;
    case 'intermediate':
      min = 3;
      max = 5;
      recommended = 4;
      reason = 'برای متوسط، ۳ تا ۵ روز با اسپلیت مناسب بهترین نتیجه رو داره.';
      break;
    case 'advanced':
      min = 4;
      max = 6;
      recommended = 5;
      reason = 'برای حرفه‌ای، ۴ تا ۶ روز با اسپلیت تخصصی بهترین بازدهی رو داره.';
      break;
    case 'professional':
      min = 5;
      max = 6;
      recommended = 6;
      reason = 'برای حرفه‌ای، ۵ تا ۶ روز با اسپلیت‌های پیشرفته توصیه می‌شه.';
      break;
  }

  // ═══════════════════════════════════════════════════════════
  //  مرحله ۲: تنظیم بر اساس هدف
  // ═══════════════════════════════════════════════════════════
  const goalAdjust: Record<string, { min?: number; max?: number; rec?: number; note?: string }> = {
    strength: {
      min: min,
      max: Math.min(max, 4),
      rec: Math.min(recommended, 4),
      note: 'قدرت نیاز به ریکاوری بیشتر داره (۳-۴ روز).',
    },
    hypertrophy: {
      min: Math.max(min, 4),
      max: Math.max(max, 6),
      rec: 5,
      note: 'حجم عضلانی با فرکانس بالاتر بهتر پاسخ می‌ده (۴-۶ روز).',
    },
    fat_loss: {
      min: Math.max(min, 3),
      max: Math.min(max, 5),
      rec: 4,
      note: 'چربی‌سوزی با ۳-۵ روز + کاردیو ترکیبی بهتره.',
    },
    recomposition: {
      min: Math.max(min, 4),
      max: Math.max(max, 5),
      rec: 5,
      note: 'بازترکیب با ۴-۵ روز و تمرین ترکیبی بهتره.',
    },
    competition: {
      min: Math.max(min, 5),
      max: Math.max(max, 6),
      rec: 6,
      note: 'آماده‌سازی مسابقه نیاز به ۵-۶ روز داره.',
    },
    general_fitness: {
      min: 2,
      max: 4,
      rec: 3,
      note: 'تناسب اندام عمومی با ۲-۴ روز قابل دستیابیه.',
    },
  };

  const adj = goalAdjust[goal];
  if (adj) {
    if (adj.min) min = Math.max(min, adj.min);
    if (adj.max) max = Math.min(max, adj.max);
    if (adj.rec) recommended = adj.rec;
    if (adj.note) reason += ' ' + adj.note;
  }

  // ═══════════════════════════════════════════════════════════
  //  مرحله ۳: تنظیم بر اساس مدت جلسه
  // ═══════════════════════════════════════════════════════════
  if (sessionMinutes < 45) {
    // جلسه کوتاه → روز بیشتر
    min = Math.max(min, 4);
    max = Math.min(max + 1, 6);
    recommended = Math.min(recommended + 1, max);
    reason += ' چون جلسات کوتاهه، روزهای بیشتر توصیه می‌شه.';
  } else if (sessionMinutes > 90) {
    // جلسه بلند → روز کمتر
    max = Math.min(max, 4);
    recommended = Math.min(recommended, 4);
    reason += ' چون جلسات طولانیه، روزهای کمتر برای ریکاوری بهتره.';
  }

  // ═══════════════════════════════════════════════════════════
  //  مرحله ۴: تنظیم بر اساس سن و ریکاوری
  // ═══════════════════════════════════════════════════════════
  if (age >= 45) {
    max = Math.max(min, max - 1);
    recommended = Math.max(min, recommended - 1);
    reason += ' با توجه به سن، یک روز کمتر برای ریکاوری توصیه می‌شه.';
  }

  if (recoveryQuality === 'poor' || sleepHours < 6) {
    max = Math.max(min, max - 1);
    recommended = Math.max(min, recommended - 1);
    reason += ' کیفیت ریکاوری یا خواب پایین، کاهش یک روز رو ایجاب می‌کنه.';
  }

  // ═══════════════════════════════════════════════════════════
  //  مرحله ۴.۵: تنظیم بر اساس استرس و شیفت کاری
  // ═══════════════════════════════════════════════════════════
  if (jobStress === 'high') {
    max = Math.max(min, max - 1);
    recommended = Math.max(min, recommended - 1);
    reason += ' استرس کاری بالا، کاهش یک روز رو ایجاب می‌کنه.';
  }

  if (workShift === 'night' || workShift === 'rotating') {
    max = Math.max(min, max - 1);
    recommended = Math.max(min, recommended - 1);
    reason += ' شیفت شب یا شیفتی، ریکاوری رو کاهش می‌ده.';
  }

  // ═══════════════════════════════════════════════════════════
  //  مرحله ۵: محدودسازی نهایی (۲-۷ روز)
  // ═══════════════════════════════════════════════════════════
  min = Math.min(7, Math.max(2, Math.round(min)));
  max = Math.min(7, Math.max(min, Math.round(max)));
  recommended = Math.min(max, Math.max(min, Math.round(recommended)));

  return { min, max, recommended, reason };
}

/**
 * اعتبارسنجی انتخاب کاربر: آیا داخل بازه علمیه؟
 */
export function validateTrainingDaysChoice(
  userChoice: number,
  recommendation: TrainingDaysRecommendation
): { valid: boolean; corrected: number; message?: string } {
  if (userChoice < recommendation.min) {
    return {
      valid: false,
      corrected: recommendation.min,
      message: `حداقل ${recommendation.min} روز از نظر علمی لازمه.`,
    };
  }
  if (userChoice > recommendation.max) {
    return {
      valid: false,
      corrected: recommendation.max,
      message: `حداکثر ${recommendation.max} روز از نظر علمی توصیه می‌شه.`,
    };
  }
  return { valid: true, corrected: userChoice };
}
