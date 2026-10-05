/**
 * تحلیل‌گر پروفایل ورزشکار
 * محاسبه BMR, TDEE, BMI و تعیین فاکتورهای کلیدی
 */

import type { AthleteProfile } from '../../types';
import type { ExperienceLevel, Goal } from '../types/program';
import type { EquipmentType } from '../types/exercise';
import { mapMusclesToEnglish, mapInjuriesToEnglish } from './persianMapping';

export interface ProfileAnalysis {
  bmr: number;
  tdee: number;
  bmi: number;
  bmiCategory: string;
  experience: ExperienceLevel;
  goal: Goal;
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
  fatigueDetected?: boolean;
  equipmentType: string;
  customEquipment: string[];
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

/**
 * تبدیل مدت زمان به هفته
 */
function parseDurationToWeeks(timeline: string): number {
  if (!timeline) return 8;
  const num = parseInt(timeline.replace(/[^\d]/g, ''), 10);
  if (isNaN(num) || num <= 0) return 8;

  if (timeline.includes('هفته')) return num;
  if (timeline.includes('ماه')) return num * 4;
  if (timeline.includes('سال')) return num * 52;
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

  const rawTrainingDays = Number(profile.trainingDays) || 4;
  const weeklyTrainingDays = Math.min(7, Math.max(2, Math.round(rawTrainingDays)));

  const rawSessionDuration = Number(profile.sessionDuration) || 60;
  const sessionMinutes = Math.min(120, Math.max(30, Math.round(rawSessionDuration)));

  const programDurationWeeks = Math.min(52, Math.max(4, parseDurationToWeeks(profile.timeline)));

  return {
    bmr,
    tdee,
    bmi,
    bmiCategory: categorizeBMI(bmi),
    experience,
    goal,
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
    equipmentType: profile.equipmentType || 'full_gym',
    customEquipment: profile.customEquipment || [],
  };
}
