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
  goal: Goal,
  competitionDate?: string
): SplitType {
  const strengthGoal = goal === 'strength' || goal === 'competition';
  
  // ═══ تنظیم بر اساس فاصله از مسابقه ═══
  const weeksUntilCompetition = getWeeksUntilCompetition(competitionDate);
  if (weeksUntilCompetition !== null) {
    // کمتر از ۴ هفته: پیکینگ — تمرکز روی حرکات اصلی
    if (weeksUntilCompetition < 4) {
      if (days >= 4) return 'upper_lower';
      return 'full_body';
    }
    // ۴-۸ هفته: قدرت
    if (weeksUntilCompetition < 8) {
      if (days >= 5) return 'upper_lower_push_pull_legs';
      if (days >= 4) return 'push_pull';
      return 'full_body';
    }
    // ۸-۱۲ هفته: قدرت + حجم
    if (weeksUntilCompetition < 12) {
      if (days >= 5) return 'ppl_ul_hybrid';
      if (days >= 4) return 'torso_limbs';
      return 'push_pull_legs';
    }
    // > ۱۲ هفته: برنامه معمولی
  }
  const hypertrophyGoal = goal === 'hypertrophy' || goal === 'recomposition';

  if (days <= 2) return 'full_body';

  if (experience === 'beginner') {
    if (days <= 3) return 'full_body';
    return 'upper_lower';
  }

  if (days === 3) return 'push_pull_legs';

  if (days === 4) {
    if (experience === 'advanced' || experience === 'professional') {
      return 'torso_limbs';
    }
    return strengthGoal ? 'push_pull' : 'torso_limbs';
  }

  if (days === 5) {
    if (experience === 'advanced' || experience === 'professional') {
      return hypertrophyGoal ? 'arnold_split' : 'bro_split';
    }
    return strengthGoal ? 'upper_lower_push_pull_legs' : 'ppl_ul_hybrid';
  }

  if (experience === 'advanced' || experience === 'professional') {
    return strengthGoal ? 'ppl_ul_hybrid' : 'arnold_split';
  }

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
          { focus: 'lower', title: 'پایین‌تنه ۱', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs', 'obliques'] },
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
          { focus: 'pull', title: 'کشش - پشت، جلوبازو', muscleGroups: ['upper_back', 'lats', 'rear_delts', 'traps', 'biceps', 'forearms'] },
          { focus: 'legs', title: 'پا - چهارسر، همسترینگ، سرینی', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
        ];
      }
      if (days === 6) {
        return [
          { focus: 'push', title: 'پرس ۱ - سینه، سرشانه، پشت‌بازو', muscleGroups: ['chest', 'front_delts', 'side_delts', 'triceps'] },
          { focus: 'pull', title: 'کشش ۱ - پشت، جلوبازو', muscleGroups: ['upper_back', 'lats', 'rear_delts', 'traps', 'biceps', 'forearms'] },
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
      if (days === 6) {
        return ([
          { focus: 'push', title: 'پرس ۱', muscleGroups: ['chest', 'front_delts', 'side_delts', 'triceps'] },
          { focus: 'pull', title: 'کشش ۱', muscleGroups: ['upper_back', 'lats', 'rear_delts', 'biceps'] },
          { focus: 'legs', title: 'پا ۱', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
          { focus: 'push', title: 'پرس ۲', muscleGroups: ['chest', 'front_delts', 'side_delts', 'triceps'] },
          { focus: 'pull', title: 'کشش ۲', muscleGroups: ['upper_back', 'lats', 'rear_delts', 'biceps'] },
          { focus: 'legs', title: 'پا ۲', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
        ] as SplitSession[]).slice(0, days);
      }
      return ([
        { focus: 'push', title: 'پرس', muscleGroups: ['chest', 'front_delts', 'side_delts', 'triceps'] },
        { focus: 'pull', title: 'کشش', muscleGroups: ['upper_back', 'lats', 'rear_delts', 'biceps'] },
        { focus: 'legs', title: 'پا', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
        { focus: 'upper', title: 'بالاتنه', muscleGroups: ['chest', 'upper_back', 'side_delts', 'rear_delts', 'biceps', 'triceps'] },
        { focus: 'lower', title: 'پایین‌تنه', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
      ] as SplitSession[]).slice(0, days);

    case 'upper_lower_push_pull_legs':
      return ([
        { focus: 'upper', title: 'بالاتنه', muscleGroups: ['chest', 'upper_back', 'lats', 'front_delts', 'side_delts', 'rear_delts', 'biceps', 'triceps'] },
        { focus: 'lower', title: 'پایین‌تنه', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
        { focus: 'push', title: 'پرس', muscleGroups: ['chest', 'front_delts', 'side_delts', 'triceps'] },
        { focus: 'pull', title: 'کشش', muscleGroups: ['upper_back', 'lats', 'traps', 'rear_delts', 'biceps', 'forearms'] },
        { focus: 'legs', title: 'پا', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
      ] as SplitSession[]).slice(0, days);

    case 'push_pull':
      return ([
        { focus: 'push', title: 'پرس', muscleGroups: ['chest', 'front_delts', 'side_delts', 'triceps'] },
        { focus: 'pull', title: 'کشش', muscleGroups: ['upper_back', 'lats', 'traps', 'rear_delts', 'biceps', 'forearms'] },
        { focus: 'push', title: 'پرس', muscleGroups: ['chest', 'front_delts', 'side_delts', 'triceps'] },
        { focus: 'pull', title: 'کشش', muscleGroups: ['upper_back', 'lats', 'traps', 'rear_delts', 'biceps', 'forearms'] },
      ] as SplitSession[]).slice(0, days);

    case 'torso_limbs':
      return ([
        { focus: 'torso', title: 'تنه', muscleGroups: ['chest', 'upper_back', 'lats', 'front_delts', 'side_delts', 'rear_delts'] },
        { focus: 'limbs', title: 'اندام', muscleGroups: ['biceps', 'triceps', 'forearms', 'quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
        { focus: 'torso', title: 'تنه', muscleGroups: ['chest', 'upper_back', 'lats', 'front_delts', 'side_delts', 'rear_delts'] },
        { focus: 'limbs', title: 'اندام', muscleGroups: ['biceps', 'triceps', 'forearms', 'quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
      ] as SplitSession[]).slice(0, days);

    case 'arnold_split':
      return ([
        { focus: 'chest_back', title: 'سینه و پشت ۱', muscleGroups: ['chest', 'upper_back', 'lats', 'traps'] },
        { focus: 'shoulders_arms', title: 'سرشانه و بازو ۱', muscleGroups: ['front_delts', 'side_delts', 'rear_delts', 'biceps', 'triceps', 'forearms'] },
        { focus: 'legs', title: 'پا ۱', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
        { focus: 'chest_back', title: 'سینه و پشت ۲', muscleGroups: ['chest', 'upper_back', 'lats', 'traps'] },
        { focus: 'shoulders_arms', title: 'سرشانه و بازو ۲', muscleGroups: ['front_delts', 'side_delts', 'rear_delts', 'biceps', 'triceps', 'forearms'] },
        { focus: 'legs', title: 'پا ۲', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
      ] as SplitSession[]).slice(0, days);
    case 'bro_split':
      return ([
        { focus: 'chest', title: 'روز سینه', muscleGroups: ['chest'] },
        { focus: 'back', title: 'روز پشت', muscleGroups: ['upper_back', 'lats', 'traps'] },
        { focus: 'shoulders', title: 'روز سرشانه', muscleGroups: ['front_delts', 'side_delts', 'rear_delts'] },
        { focus: 'arms', title: 'روز بازو', muscleGroups: ['biceps', 'triceps', 'forearms'] },
        { focus: 'legs', title: 'روز پا', muscleGroups: ['quads', 'hamstrings', 'glutes', 'calves', 'abs'] },
      ] as SplitSession[]).slice(0, days);

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
  goal: Goal,
  competitionDate?: string
): SplitPlan {
  const splitType = determineSplitType(days, experience, goal, competitionDate);
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
    arnold_split: 'آرنولد اسپلیت',
    torso_limbs: 'تنه / اندام',
    push_pull: 'پرس / کشش',
    upper_lower_push_pull_legs: 'بالاتنه / پایین‌تنه / پرس / کشش / پا',
    ppl_ul_hybrid: 'ترکیبی PPL + بالاتنه/پایین‌تنه',
  };
  return names[splitType] || 'سفارشی';
}

/**
 * محاسبه هفته‌های مانده تا مسابقه
 * @returns تعداد هفته یا null اگر competitionDate موجود نباشه
 */
function getWeeksUntilCompetition(competitionDate?: string): number | null {
  if (!competitionDate) return null;
  
  try {
    const target = new Date(competitionDate);
    if (isNaN(target.getTime())) return null;
    
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    const weeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
    
    return weeks > 0 ? weeks : null;
  } catch {
    return null;
  }
}
