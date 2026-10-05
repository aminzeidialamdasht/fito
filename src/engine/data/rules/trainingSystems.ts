/**
 * فاز 6 — قواعد تکنیک‌های تمرینی (بخش ۱)
 */
import type { Goal, ExperienceLevel, TrainingTechnique, TechniqueConfig } from '../../types/program';

export interface TechniqueRule {
  id: TrainingTechnique;
  nameFa: string;
  experience: ExperienceLevel[];
  goals: Goal[];
  allowCompound: boolean;
  allowIsolation: boolean;
  fatigueCost: number; // 1 تا 3
  config: TechniqueConfig;
}

export const ALL_EXP: ExperienceLevel[] = ['beginner', 'intermediate', 'advanced', 'professional'];
export const INT_UP: ExperienceLevel[] = ['intermediate', 'advanced', 'professional'];
export const ADV_UP: ExperienceLevel[] = ['advanced', 'professional'];
export const ALL_GOALS: Goal[] = ['hypertrophy', 'strength', 'fat_loss', 'recomposition', 'competition', 'general_fitness'];
export const GROWTH_GOALS: Goal[] = ['hypertrophy', 'recomposition', 'fat_loss'];

export const TECHNIQUES_BASIC: TechniqueRule[] = [
  { id: 'straight', nameFa: 'ست معمولی', experience: ALL_EXP, goals: ALL_GOALS,
    allowCompound: true, allowIsolation: true, fatigueCost: 1, config: {} },
  { id: 'rpt', nameFa: 'RPT (هرم معکوس)', experience: INT_UP, goals: ['strength', 'hypertrophy'],
    allowCompound: true, allowIsolation: false, fatigueCost: 3,
    config: { loadPercent: 92, noteFa: 'ست اول سنگین‌ترین؛ هر ست بعدی حدود ۸٪ سبک‌تر و تکرار بیشتر' } },
  { id: 'rest_pause', nameFa: 'Rest-Pause', experience: ADV_UP, goals: ['hypertrophy'],
    allowCompound: false, allowIsolation: true, fatigueCost: 3,
    config: { miniSets: 2, miniSetRest: 20, noteFa: 'تا نزدیک ناتوانی؛ ۲۰ ثانیه استراحت و ادامه با همان وزنه، دو بار' } },
];

// ── بخش ۲: تکنیک‌های پیشرفته ──
export const TECHNIQUES_ADVANCED: TechniqueRule[] = [
  { id: 'myo_reps', nameFa: 'Myo-Reps', experience: INT_UP, goals: GROWTH_GOALS,
    allowCompound: false, allowIsolation: true, fatigueCost: 2,
    config: { miniSets: 4, miniSetRest: 15, noteFa: 'یک ست فعال‌ساز نزدیک ناتوانی، بعد ۴ مینی‌ست با ۵ نفس استراحت' } },
  { id: 'drop_set', nameFa: 'Drop Set', experience: INT_UP, goals: GROWTH_GOALS,
    allowCompound: false, allowIsolation: true, fatigueCost: 2,
    config: { dropCount: 2, dropPercent: 20, noteFa: 'بعد از ناتوانی، وزنه را ۲۰٪ کم کن و بدون استراحت ادامه بده، دو بار' } },
  { id: 'cluster', nameFa: 'Cluster Set', experience: ADV_UP, goals: ['strength', 'competition'],
    allowCompound: true, allowIsolation: false, fatigueCost: 2,
    config: { clusterReps: 2, miniSetRest: 20, noteFa: 'هر ۲ تکرار ۲۰ ثانیه استراحت تا وزنه سنگین با کیفیت بالا زده شود' } },
];

export const TECHNIQUES: TechniqueRule[] = [...TECHNIQUES_BASIC, ...TECHNIQUES_ADVANCED];

export function getTechniqueRule(id: TrainingTechnique): TechniqueRule {
  return TECHNIQUES.find((t) => t.id === id) || TECHNIQUES[0];
}

// ── بخش ۳: سیستم‌های سطح برنامه ──
export type ProgramSystemId = 'linear' | 'dup' | 'gvt' | 'wendler_531';

export interface ProgramSystemRule {
  id: ProgramSystemId;
  nameFa: string;
  experience: ExperienceLevel[];
  goals: Goal[];
  minDaysPerWeek: number;
  maxDaysPerWeek: number;
  summaryFa: string;
  weeks: number;
  // تکرار هدف و RIR در هر هفته (چرخه‌ای)
  weeklyScheme: { reps: string; rir: number; label: string }[];
}

export const PROGRAM_SYSTEMS: ProgramSystemRule[] = [
  { id: 'linear', nameFa: 'پیشرفت خطی', experience: ['beginner', 'intermediate'],
    goals: ALL_GOALS, minDaysPerWeek: 2, maxDaysPerWeek: 6, weeks: 4,
    summaryFa: 'هر هفته کمی وزنه یا تکرار بیشتر، مناسب شروع',
    weeklyScheme: [
      { reps: '10-12', rir: 3, label: 'هفته ۱' },
      { reps: '10-12', rir: 2, label: 'هفته ۲' },
      { reps: '8-10', rir: 2, label: 'هفته ۳' },
      { reps: '8-10', rir: 1, label: 'هفته ۴' },
    ] },
  { id: 'dup', nameFa: 'DUP (دوره‌بندی موجی روزانه)', experience: INT_UP,
    goals: ['hypertrophy', 'strength', 'recomposition'], minDaysPerWeek: 3, maxDaysPerWeek: 6, weeks: 3,
    summaryFa: 'تغییر محدوده تکرار بین جلسات: سنگین، متوسط، سبک',
    weeklyScheme: [
      { reps: '4-6', rir: 2, label: 'روز سنگین' },
      { reps: '8-10', rir: 2, label: 'روز متوسط' },
      { reps: '12-15', rir: 1, label: 'روز سبک' },
    ] },
  { id: 'gvt', nameFa: 'GVT (۱۰×۱۰)', experience: ADV_UP,
    goals: ['hypertrophy'], minDaysPerWeek: 4, maxDaysPerWeek: 6, weeks: 6,
    summaryFa: 'حجم بالا: ۱۰ ست ۱۰ تکراری با ۶۰٪ وزنه برای حرکت اصلی هر روز',
    weeklyScheme: [
      { reps: '10', rir: 3, label: '۱۰×۱۰' },
    ] },
  { id: 'wendler_531', nameFa: '5/3/1', experience: INT_UP,
    goals: ['strength', 'recomposition'], minDaysPerWeek: 3, maxDaysPerWeek: 5, weeks: 4,
    summaryFa: 'چهار هفته موجی بر پایه 1RM: ۵، ۳، ۱ و دیلود',
    weeklyScheme: [
      { reps: '5', rir: 2, label: 'هفته ۵ تکرار' },
      { reps: '3', rir: 1, label: 'هفته ۳ تکرار' },
      { reps: '1-5', rir: 0, label: 'هفته 5/3/1' },
      { reps: '5', rir: 4, label: 'هفته دیلود' },
    ] },
];

export function getProgramSystem(id: ProgramSystemId): ProgramSystemRule {
  return PROGRAM_SYSTEMS.find((s) => s.id === id) || PROGRAM_SYSTEMS[0];
}
