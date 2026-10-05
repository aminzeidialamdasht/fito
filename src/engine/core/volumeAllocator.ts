/**
 * توزیع‌کننده حجم تمرینی
 *
 * هدف: به‌جای اینکه بعد از انتخاب Exercise، حجم را گزارش دهیم،
 * از ابتدا برای هر عضله و هر جلسه، بودجه تعیین می‌کنیم.
 *
 * جریان:
 *   1. Target Weekly Volume per muscle (MEV-MAV)
 *   2. Frequency per muscle (بر اساس Split)
 *   3. Target Volume per session
 *   4. Session Budget (سهمیه‌ی هر عضله در هر جلسه)
 */

import type { MuscleGroup } from '../types/exercise';
import type { ExperienceLevel, Goal, SplitType } from '../types/program';
import { getTargetWeeklyVolume } from '../data/rules/volumeRules';

export interface SessionBudget {
  /** عضله → تعداد ست مؤثر هدف */
  [muscle: string]: number;
}

export interface VolumeAllocation {
  /** هدف هفتگی برای هر عضله */
  weeklyTargets: Partial<Record<MuscleGroup, number>>;
  /** بودجه هر جلسه */
  sessionBudgets: SessionBudget[];
  /** سهمیه پیشنهادی exercise به ازای هر عضله در هر جلسه */
  exerciseCounts: Record<number, Partial<Record<MuscleGroup, number>>>;
}

/**
 * فرکانس پیش‌فرض هر عضله بر اساس Split و تعداد روز
 * فرکانس = چند بار در هفته هر عضله تمرین می‌شود
 */
function getMuscleFrequency(
  muscle: MuscleGroup,
  splitType: SplitType,
  trainingDays: number
): number {
  // عضلات کوچک: فرکانس بالاتر
  const isSmallMuscle = ['biceps', 'triceps', 'forearms', 'calves', 'rear_delts', 'abs', 'obliques', 'traps'].includes(muscle);
  const isMediumMuscle = ['side_delts', 'front_delts', 'chest', 'lats', 'upper_back'].includes(muscle);
  const isLargeMuscle = ['quads', 'hamstrings', 'glutes', 'lower_back'].includes(muscle);

  // پیش‌فرض بر اساس نوع Split
  switch (splitType) {
    case 'full_body':
      // هر جلسه تمام بدن → فرکانس = تعداد روز
      return trainingDays;

    case 'upper_lower':
      if (isLargeMuscle) return Math.max(2, Math.floor(trainingDays / 2));
      return Math.max(2, Math.floor(trainingDays / 2));

    case 'push_pull_legs':
      // هر عضله در گروه push/pull/legs → 1-2 بار در هفته
      if (isSmallMuscle) return Math.max(2, Math.floor(trainingDays / 3));
      return Math.max(1, Math.floor(trainingDays / 3));

    case 'ppl_ul_hybrid':
      // هیبرید: عضلات کوچک فرکانس بالاتر
      if (isSmallMuscle) return Math.max(2, Math.floor(trainingDays / 2));
      if (isMediumMuscle) return 2;
      if (isLargeMuscle) return Math.max(1, Math.floor(trainingDays / 3));
      return 2;

    case 'bro_split':
      // هر عضله یک بار در هفته
      return 1;

    default:
      return 2;
  }
}

/**
 * تخصیص حجم برای کل برنامه
 */
export function allocateVolume(
  muscles: MuscleGroup[],
  splitType: SplitType,
  trainingDays: number,
  experience: ExperienceLevel,
  goal: Goal,
  priorityMuscles: string[] = []
): VolumeAllocation {
  const weeklyTargets: Partial<Record<MuscleGroup, number>> = {};
  const exerciseCounts: Record<number, Partial<Record<MuscleGroup, number>>> = {};

  // ۱. محاسبه هدف هفتگی برای هر عضله
  for (const muscle of muscles) {
    const isPriority = priorityMuscles.includes(muscle);
    const target = getTargetWeeklyVolume(muscle, experience, goal, isPriority);
    weeklyTargets[muscle] = target.target;
  }

  return {
    weeklyTargets,
    sessionBudgets: [], // بعداً پر می‌شود
    exerciseCounts,
  };
}

/**
 * توزیع هدف هفتگی بین جلسات
 *
 * @param muscle عضله
 * @param weeklyTarget هدف هفتگی (مثلاً ۱۴ ست)
 * @param sessionsInvolvingMuscle شماره جلساتی که این عضله را دارند
 * @returns مقدار بودجه برای هر جلسه
 */
export function distributeMuscleAcrossSessions(
  muscle: MuscleGroup,
  weeklyTarget: number,
  sessionsInvolvingMuscle: number[]
): Record<number, number> {
  const distribution: Record<number, number> = {};
  const count = sessionsInvolvingMuscle.length;

  if (count === 0) return distribution;

  // تقسیم مساوی
  const perSession = weeklyTarget / count;

  // عضلات بزرگ‌تر ترجیحاً در جلسه اول حجم بیشتری بگیرند
  for (let i = 0; i < count; i++) {
    const sessionIdx = sessionsInvolvingMuscle[i];
    // جلسه اول کمی بیشتر
    const multiplier = i === 0 ? 1.1 : (i === count - 1 ? 0.9 : 1.0);
    distribution[sessionIdx] = Math.round(perSession * multiplier);
  }

  return distribution;
}

/**
 * محاسبه تعداد حرکات پیشنهادی برای هر عضله در یک جلسه
 *
 * مثال: اگر بودجه ۷ ست و prefer compound → 2-3 حرکت
 */
export function calculateExerciseCount(
  budget: number,
  preferCompound: boolean = true
): number {
  if (budget <= 0) return 0;
  if (budget <= 3) return 1;
  if (budget <= 6) return 2;
  if (budget <= 9) return 3;
  if (budget <= 12) return 4;
  return Math.ceil(budget / 3);
}

/**
 * ساخت بودجه‌ی یک جلسه مشخص
 *
 * @param sessionMuscles عضلات این جلسه
 * @param muscleDistributions توزیع هر عضله در جلسات
 * @param sessionIndex شماره جلسه فعلی
 */
export function buildSessionBudget(
  sessionMuscles: MuscleGroup[],
  muscleDistributions: Record<string, Record<number, number>>,
  sessionIndex: number
): SessionBudget {
  const budget: SessionBudget = {};

  for (const muscle of sessionMuscles) {
    const dist = muscleDistributions[muscle];
    if (dist && dist[sessionIndex] !== undefined) {
      budget[muscle] = dist[sessionIndex];
    }
  }

  return budget;
}
