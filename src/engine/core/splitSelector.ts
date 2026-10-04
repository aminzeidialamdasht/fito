/**
 * انتخاب‌گر Split برنامه تمرینی
 * بر اساس تعداد روز، سطح تجربه، و هدف
 */

import type { SplitType, SessionFocus, ExperienceLevel, Goal } from '../types/program';

export interface SplitSession {
  focus: SessionFocus;
  title: string;
  muscleGroups: string[];
}

export interface SplitPlan {
  type: SplitType;
  daysPerWeek: number;
  sessions: SplitSession[];
  restPattern: number[]; // ایندکس روزهای استراحت (0=شنبه تا 6=جمعه)
}

/**
 * Split پیشنهادی بر اساس تعداد روز و سطح تجربه
 */
function determineSplitType(
  days: number,
  experience: ExperienceLevel,
  goal: Goal
): SplitType {
  // مبتدی‌ها همیشه Full Body
  if (experience === 'beginner') {
    if (days <= 3) return 'full_body';
    return 'upper_lower';
  }

  // حرفه‌ای‌ها
  if (experience === 'advanced' || experience === 'professional') {
    if (days <= 3) return 'full_body';
    if (days === 4) return 'upper_lower';
    if (days === 5) return 'ppl_ul_hybrid';
    return 'push_pull_legs';
  }

  // متوسط‌ها
  if (days <= 3) return 'full_body';
  if (days === 4) return 'upper_lower';
  return 'push_pull_legs';
}

/**
 * تعریف جلسات برای هر Split
 */
function buildSessions(splitType: SplitType, days: number): SplitSession[] {
  switch (splitType) {
    case 'full_body':
      return Array.from({ length: days }, (_, i) => ({
        focus: 'full_body' as SessionFocus,
        title: `جلسه تمام‌بدن ${i + 1}`,
        muscleGroups: ['chest', 'upper_back', 'lats', 'quads', 'hamstrings', 'front_delts', 'biceps', 'triceps'],
      }));

    case 'upper_lower':
      if (days === 4) {
        return [
          { focus: 'upper', title: 'بالاتنه ۱', muscleGroups: ['chest', 'upper_back', 'lats', 'front_delts', 'side_delts', 'biceps', 'triceps'] },
          { focus: 'lower', title: 'پایین‌تنه ۱', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
          { focus: 'upper', title: 'بالاتنه ۲', muscleGroups: ['chest', 'upper_back', 'lats', 'rear_delts', 'biceps', 'triceps'] },
          { focus: 'lower', title: 'پایین‌تنه ۲', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
        ];
      }
      // days = 2, 3
      return Array.from({ length: days }, (_, i) => ({
        focus: i % 2 === 0 ? ('upper' as SessionFocus) : ('lower' as SessionFocus),
        title: i % 2 === 0 ? `بالاتنه ${Math.floor(i / 2) + 1}` : `پایین‌تنه ${Math.floor(i / 2) + 1}`,
        muscleGroups: i % 2 === 0
          ? ['chest', 'upper_back', 'lats', 'front_delts', 'side_delts', 'biceps', 'triceps']
          : ['quads', 'hamstrings', 'glutes', 'calves', 'abs'],
      }));

    case 'push_pull_legs':
      if (days === 3) {
        return [
          { focus: 'push', title: 'پرس - سینه، سرشانه، پشت‌بازو', muscleGroups: ['chest', 'front_delts', 'side_delts', 'triceps'] },
          { focus: 'pull', title: 'کشش - پشت، جلوبازو', muscleGroups: ['upper_back', 'lats', 'rear_delts', 'biceps', 'forearms'] },
          { focus: 'legs', title: 'پا - چهارسر، همسترینگ، سرینی', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
        ];
      }
      if (days === 6) {
        return [
          { focus: 'push', title: 'پرس ۱ - سینه، سرشانه، پشت‌بازو', muscleGroups: ['chest', 'front_delts', 'side_delts', 'triceps'] },
          { focus: 'pull', title: 'کشش ۱ - پشت، جلوبازو', muscleGroups: ['upper_back', 'lats', 'rear_delts', 'biceps'] },
          { focus: 'legs', title: 'پا ۱ - چهارسر، همسترینگ، سرینی', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
          { focus: 'push', title: 'پرس ۲ - سینه، سرشانه، پشت‌بازو', muscleGroups: ['chest', 'front_delts', 'side_delts', 'triceps'] },
          { focus: 'pull', title: 'کشش ۲ - پشت، جلوبازو', muscleGroups: ['upper_back', 'lats', 'rear_delts', 'biceps'] },
          { focus: 'legs', title: 'پا ۲ - چهارسر، همسترینگ، سرینی', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
        ];
      }
      // days = 4, 5
      const sessions: SplitSession[] = [];
      for (let i = 0; i < days; i++) {
        const mod = i % 3;
        if (mod === 0) sessions.push({ focus: 'push', title: `پرس ${Math.floor(i / 3) + 1}`, muscleGroups: ['chest', 'front_delts', 'side_delts', 'triceps'] });
        else if (mod === 1) sessions.push({ focus: 'pull', title: `کشش ${Math.floor(i / 3) + 1}`, muscleGroups: ['upper_back', 'lats', 'rear_delts', 'biceps'] });
        else sessions.push({ focus: 'legs', title: `پا ${Math.floor(i / 3) + 1}`, muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] });
      }
      return sessions;

    case 'ppl_ul_hybrid':
      return [
        { focus: 'push', title: 'پرس', muscleGroups: ['chest', 'front_delts', 'side_delts', 'triceps'] },
        { focus: 'pull', title: 'کشش', muscleGroups: ['upper_back', 'lats', 'rear_delts', 'biceps'] },
        { focus: 'legs', title: 'پا', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
        { focus: 'upper', title: 'بالاتنه', muscleGroups: ['chest', 'upper_back', 'side_delts', 'rear_delts', 'biceps', 'triceps'] },
        { focus: 'lower', title: 'پایین‌تنه', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
      ];

    case 'bro_split':
      return [
        { focus: 'chest_back', title: 'سینه و پشت', muscleGroups: ['chest', 'upper_back', 'lats'] },
        { focus: 'shoulders_arms', title: 'سرشانه و بازو', muscleGroups: ['front_delts', 'side_delts', 'rear_delts', 'biceps', 'triceps'] },
        { focus: 'legs', title: 'پا', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves'] },
        { focus: 'chest_triceps', title: 'سینه و پشت‌بازو', muscleGroups: ['chest', 'triceps'] },
        { focus: 'back_biceps', title: 'پشت و جلوبازو', muscleGroups: ['upper_back', 'lats', 'biceps'] },
      ];

    default:
      return [];
  }
}

/**
 * توزیع جلسات در هفته (7 روز، شنبه=0 تا جمعه=6)
 * تلاش می‌شود روزهای استراحت به شکل منطقی توزیع شوند.
 */
function distributeSessions(days: number): number[] {
  // ایندکس روزها: 0=شنبه, 1=یکشنبه, 2=دوشنبه, 3=سه‌شنبه, 4=چهارشنبه, 5=پنجشنبه, 6=جمعه
  const patterns: Record<number, number[]> = {
    2: [0, 3],                    // شنبه، سه‌شنبه
    3: [0, 2, 4],                 // شنبه، دوشنبه، چهارشنبه
    4: [0, 1, 3, 4],              // شنبه، یکشنبه، سه‌شنبه، چهارشنبه
    5: [0, 1, 2, 4, 5],           // شنبه تا دوشنبه + چهارشنبه، پنجشنبه
    6: [0, 1, 2, 3, 4, 5],        // شنبه تا پنجشنبه (جمعه استراحت)
    7: [0, 1, 2, 3, 4, 5, 6],     // همه روزها
  };
  return patterns[days] || patterns[4];
}

/**
 * محاسبه روزهای استراحت (روزهایی که جلسه ندارند)
 */
function calculateRestDays(trainingDays: number[]): number[] {
  const allDays = [0, 1, 2, 3, 4, 5, 6];
  return allDays.filter((d) => !trainingDays.includes(d));
}

/**
 * انتخاب Split کامل
 */
export function selectSplit(
  days: number,
  experience: ExperienceLevel,
  goal: Goal
): SplitPlan {
  const splitType = determineSplitType(days, experience, goal);
  const sessions = buildSessions(splitType, days);
  const trainingDays = distributeSessions(days);
  const restDays = calculateRestDays(trainingDays);

  return {
    type: splitType,
    daysPerWeek: days,
    sessions,
    restPattern: restDays,
  };
}

/**
 * نام فارسی Split
 */
export function getSplitName(splitType: SplitType): string {
  const names: Record<SplitType, string> = {
    full_body: 'تمام‌بدن',
    upper_lower: 'بالاتنه / پایین‌تنه',
    push_pull_legs: 'پرس / کشش / پا',
    bro_split: 'تفکیک گروه‌های عضلانی',
    ppl_ul_hybrid: 'ترکیبی PPL + بالاتنه/پایین‌تنه',
  };
  return names[splitType] || 'سفارشی';
}
