import type { DeloadLevel } from '../../types';

/**
 * تحلیل‌گر پروفایل ورزشکار
 * محاسبه BMR, TDEE, BMI و تعیین فاکتورهای کلیدی
 */

import type { AthleteProfile } from '../../types';
import type { ExperienceLevel, Goal } from '../types/program';
import type { EquipmentType } from '../types/exercise';
import { mapMusclesToEnglish, mapInjuriesToEnglish } from './persianMapping';
import { calculateOptimalTrainingDays, validateTrainingDaysChoice } from './trainingDaysCalculator';

export interface ProfileAnalysis {
  bmr: number;
  bodyFatPercent?: number;
  bodyComposition?: string;
  trainingHistoryLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  tdee: number;
  bmi: number;
  bmiCategory: string;
  experience: ExperienceLevel;
  goal: Goal;
  secondaryGoal?: Goal;
  avoidedExercises: string[];
  bodyFrame?: 'ectomorph' | 'mesomorph' | 'endomorph';
  dominantLimbLength?: 'short' | 'average' | 'long';
  isBeginnerFriendly: boolean;
  hasSpineIssue: boolean;
  hasShoulderIssue: boolean;
  hasKneeIssue: boolean;
  hasHipIssue: boolean;
  safeInjuries: string[];
  priorityMuscles: string[];
  weeklyTrainingDays: number;
  sessionMinutes: number;
  programDurationWeeks: number;
  deloadLevel: DeloadLevel;
  equipmentType: string;
  equipment: string[];
  location: 'gym' | 'home' | 'both' | 'park';
}

/**
 * محاسبه BMR با فرمول Mifflin-St Jeor
 */
function calculateBMR(profile: AthleteProfile): number {
  const { gender, weight, height, age } = profile;
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

/**
 * محاسبه TDEE با ضریب فعالیت
 */
function calculateTDEE(bmr: number, activityLevel: string): number {
  const factors: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return Math.round(bmr * (factors[activityLevel] || 1.55));
}

/**
 * محاسبه BMI
 */
function calculateBMI(weight: number, height: number): number {
  const heightM = height / 100;
  return Math.round((weight / (heightM * heightM)) * 10) / 10;
}

/**
 * دسته‌بندی BMI
 */
function categorizeBMI(bmi: number): string {
  if (bmi < 18.5) return 'کمبود وزن';
  if (bmi < 25) return 'وزن نرمال';
  if (bmi < 30) return 'اضافه وزن';
  return 'چاقی';
}

/**
 * تعیین سطح تجربه
 */
function determineExperience(profile: AthleteProfile): ExperienceLevel {
  const exp = (profile.experience || 'intermediate') as ExperienceLevel;
  return exp;
}

/**
 * تعیین هدف
 */
function determineGoal(profile: AthleteProfile): Goal {
  const goal = (profile.primaryGoal || 'hypertrophy') as Goal;
  return goal;
}

function determineSecondaryGoal(profile: AthleteProfile): Goal | undefined {
  const secondaryGoal = profile.secondaryGoal?.trim();
  return secondaryGoal ? (secondaryGoal as Goal) : undefined;
}

/**
 * تبدیل مدت زمان به هفته
 */
function parseDurationToWeeks(timeline: string): number {
  if (!timeline) return 8;

  // تبدیل اعداد فارسی به لاتین
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const normalized = timeline.replace(/[۰-۹]/g, (d) =>
    String(persianDigits.indexOf(d))
  );

  const num = parseInt(normalized.replace(/[^\d]/g, ''), 10);
  if (isNaN(num) || num <= 0) return 8;

  const lower = timeline.toLowerCase();
  if (lower.includes('هفته') || lower.includes('week')) return num;
  if (lower.includes('ماه') || lower.includes('month')) return num * 4;
  if (lower.includes('سال') || lower.includes('year')) return num * 52;
  return num;
}

/**
 * تحلیل کامل پروفایل
 */
export function analyzeProfile(profile: AthleteProfile): ProfileAnalysis {
  const bmr = Math.round(calculateBMR(profile));
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const bmi = calculateBMI(profile.weight, profile.height);

  const injuries = (profile.injuries || []).map((i) => i.toLowerCase());
  const limitations = (profile.limitations || []).map((l) => l.toLowerCase());
  const allInjuries = [...injuries, ...limitations];

  const hasSpineIssue = allInjuries.some((i) => i.includes('کمر') || i.includes('دیسک') || i.includes('سیاتیک'));
  const hasShoulderIssue = allInjuries.some((i) => i.includes('شانه') || i.includes('rotator'));
  const hasKneeIssue = allInjuries.some((i) => i.includes('زانو') || i.includes('ACL') || i.includes('meniscus'));
  const hasHipIssue = allInjuries.some((i) => i.includes('لگن') || i.includes('hip'));

  const safeInjuries: string[] = [];
  if (hasSpineIssue) safeInjuries.push('lowerBack');
  if (hasShoulderIssue) safeInjuries.push('shoulder');
  if (hasKneeIssue) safeInjuries.push('knee');
  if (hasHipIssue) safeInjuries.push('hip');

  const experience = determineExperience(profile);
  const goal = determineGoal(profile);
  const secondaryGoal = determineSecondaryGoal(profile);

  // محاسبه علمی تعداد روزهای تمرین
  const trainingDaysRecommendation = calculateOptimalTrainingDays(profile);

  // اعتبارسنجی انتخاب کاربر: اگه داخل بازه نبود، اصلاح کن
  const userChoice = Number(profile.trainingDays);
  let weeklyTrainingDays: number;

  if (Number.isFinite(userChoice) && userChoice > 0) {
    const validation = validateTrainingDaysChoice(userChoice, trainingDaysRecommendation);
    weeklyTrainingDays = validation.corrected;
    if (!validation.valid) {
      console.log(`[profileAnalyzer] ${validation.message} (تنظیم به ${validation.corrected})`);
    }
  } else {
    // کاربر عددی وارد نکرده → پیشنهاد موتور
    weeklyTrainingDays = trainingDaysRecommendation.recommended;
  }

  // محدودسازی نهایی (۲-۷)
  weeklyTrainingDays = Math.min(7, Math.max(2, Math.round(weeklyTrainingDays)));

  const rawSessionDuration = Number(profile.sessionDuration) || 60;
  const sessionMinutes = Math.min(120, Math.max(30, Math.round(rawSessionDuration)));

  const programDurationWeeks = Math.min(52, Math.max(4, parseDurationToWeeks(profile.timeline)));

  // تحلیل سابقه تمرینی برای تعیین سطح واقعی
  const trainingHistoryLevel = determineTrainingHistoryLevel(profile);

  return {
    bmr,
    tdee,
    bodyFatPercent: profile.bodyFatPercent,
    bodyComposition: profile.bodyComposition,
    trainingHistoryLevel,
    bmi,
    bmiCategory: categorizeBMI(bmi),
    experience,
    goal,
    secondaryGoal,
    avoidedExercises: profile.avoidedExercises || [],
    bodyFrame: profile.bodyMeasurements?.bodyFrame,
    dominantLimbLength: profile.bodyMeasurements?.dominantLimbLength,
    isBeginnerFriendly: experience === 'beginner',
    hasSpineIssue,
    hasShoulderIssue,
    hasKneeIssue,
    hasHipIssue,
    safeInjuries,
    priorityMuscles: mapMusclesToEnglish(profile.targetMuscles || []) as string[],
    weeklyTrainingDays,
    sessionMinutes,
    programDurationWeeks,
    deloadLevel: 'none',
    equipmentType: profile.equipmentType || 'full_gym',
    equipment: profile.equipment || [],
    location: (profile.location as any) || 'gym',
  };
}

/**
 * تعیین سطح واقعی بر اساس سابقه تمرینی
 * Schoenfeld et al. (2016) — Training Age
 */
function determineTrainingHistoryLevel(
  profile: AthleteProfile
): 'beginner' | 'intermediate' | 'advanced' | 'professional' {
  const history = String(profile.trainingHistory || '').toLowerCase();
  const experience = profile.experience || 'intermediate';

  // اگر trainingHistory وجود داره، ازش استفاده کن
  if (history.includes('مبتدی') || history.includes('کمتر از ۱') || history.includes('کمتر از 1')) {
    return 'beginner';
  }
  if (history.includes('حرفه') || history.includes('بیش از ۵') || history.includes('بیش از 5') || history.includes('مسابقه')) {
    return 'professional';
  }
  if (history.includes('پیشرفته') || history.includes('۳-۵') || history.includes('3-5')) {
    return 'advanced';
  }

  // در غیر این صورت از experience استفاده کن
  return experience as any;
}
