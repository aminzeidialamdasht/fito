/**
 * فاز 6 — انتخاب هوشمند سیستم تمرینی و تکنیک ست‌ها
 * بر اساس: goal + experience + bodyFrame + خستگی/ریکاوری
 */
import type { AthleteProfile } from '../../types';
import type { ProfileAnalysis } from './profileAnalyzer';
import type { PerformanceAnalysis } from './performanceAnalyzer';
import type { TrainingTechnique } from '../types/program';
import {
  PROGRAM_SYSTEMS, getProgramSystem, getTechniqueRule,
  type ProgramSystemRule, type ProgramSystemId,
} from '../data/rules/trainingSystems';

export interface ExerciseSlot {
  isCompound: boolean;
  isSpineSensitive: boolean;
}

/** انتخاب سیستم سطح برنامه */
export function selectProgramSystem(
  profile: AthleteProfile,
  analysis: ProfileAnalysis,
  performance: PerformanceAnalysis
): ProgramSystemRule {
  const fatigue = performance.fatigue;
  if (fatigue.needsDeload || fatigue.fatigueLevel >= 70) return getProgramSystem('linear');

  const goal = analysis.goal === 'competition' ? 'strength' : analysis.goal;
  const days = analysis.weeklyTrainingDays;
  const allowed = PROGRAM_SYSTEMS.filter(
    (s) => s.experience.includes(analysis.experience) &&
           (s.goals as string[]).includes(goal) &&
           days >= s.minDaysPerWeek && days <= s.maxDaysPerWeek
  );

  const gvtOk = fatigue.fatigueLevel < 40 && profile.bodyMeasurements?.bodyFrame !== 'ectomorph';
  let order: ProgramSystemId[] = ['linear'];
  if (goal === 'strength') order = ['wendler_531', 'dup', 'linear'];
  else if (goal === 'hypertrophy') order = gvtOk ? ['gvt', 'dup', 'linear'] : ['dup', 'linear'];
  else if (goal === 'recomposition') order = ['dup', 'wendler_531', 'linear'];

  for (const id of order) {
    const found = allowed.find((s) => s.id === id);
    if (found) return found;
  }
  return getProgramSystem('linear');
}

/** بودجه‌ی خستگی یک جلسه برای تکنیک‌های سنگین */
function fatigueBudget(profile: AthleteProfile, performance: PerformanceAnalysis): number {
  const f = performance.fatigue;
  if (f.needsDeload) return 0;
  let budget = f.fatigueLevel < 30 ? 4 : f.fatigueLevel < 50 ? 3 : f.fatigueLevel < 70 ? 2 : 0;
  if (profile.bodyMeasurements?.bodyFrame === 'ectomorph') budget = Math.max(0, budget - 1);
  return budget;
}

/** تعیین تکنیک هر حرکت در یک جلسه */
export function planSessionTechniques(
  slots: ExerciseSlot[],
  profile: AthleteProfile,
  analysis: ProfileAnalysis,
  performance: PerformanceAnalysis
): TrainingTechnique[] {
  const result: TrainingTechnique[] = slots.map(() => 'straight');
  let budget = fatigueBudget(profile, performance);
  const goal = analysis.goal;

  const compoundPref: TrainingTechnique[] =
    goal === 'strength' || goal === 'competition' ? ['cluster', 'rpt']
    : goal === 'hypertrophy' || goal === 'recomposition' ? ['rpt'] : [];
  const isoPref: TrainingTechnique[] =
    goal === 'fat_loss' ? ['drop_set']
    : goal === 'hypertrophy' || goal === 'recomposition' ? ['rest_pause', 'myo_reps', 'drop_set'] : [];

  const tryApply = (idx: number, prefs: TrainingTechnique[]) => {
    for (const id of prefs) {
      const rule = getTechniqueRule(id);
      const ok = rule.experience.includes(analysis.experience) &&
        rule.goals.includes(goal) &&
        (slots[idx].isCompound ? rule.allowCompound : rule.allowIsolation) &&
        rule.fatigueCost <= budget;
      if (ok) { result[idx] = id; budget -= rule.fatigueCost; return; }
    }
  };

  // اولین حرکت ترکیبی (به‌جز حرکت حساس به کمر وقتی کاربر مشکل کمر دارد)
  const firstCompound = slots.findIndex((s) => s.isCompound && !(s.isSpineSensitive && analysis.hasSpineIssue));
  if (firstCompound >= 0) tryApply(firstCompound, compoundPref);

  // آخرین حرکت‌های ایزوله (حداکثر ۲ تا)
  let isoUsed = 0;
  for (let i = slots.length - 1; i >= 0 && isoUsed < 2; i--) {
    if (slots[i].isCompound) continue;
    tryApply(i, isoPref);
    if (result[i] !== 'straight') isoUsed++;
  }
  return result;
}
