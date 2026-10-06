/**
 * فاز 6 — اعمال تکنیک‌های انتخاب‌شده روی ست‌های هر جلسه
 */
import type { AthleteProfile } from '../../types';
import type { GeneratedExercise } from '../types/program';
import type { ProfileAnalysis } from './profileAnalyzer';
import type { PerformanceAnalysis } from './performanceAnalyzer';
import { ALL_EXERCISES } from '../data/exercises';
import { planSessionTechniques, type ExerciseSlot } from './systemSelector';
import { getTechniqueRule } from '../data/rules/trainingSystems';
import type { ProgramSystemRule } from '../data/rules/trainingSystems';

const DEFAULT_RPT_REPS = ['6-8', '8-10', '10-12', '12-15'];

function roundWeight(w: number): number {
  return Math.round(w / 2.5) * 2.5;
}

export function applyTechniquesToExercises(
  exercises: GeneratedExercise[],
  profile: AthleteProfile,
  analysis: ProfileAnalysis,
  performance: PerformanceAnalysis,
  programSystem?: ProgramSystemRule
): void {
  const rptReps = programSystem?.weeklyScheme
    ?.map((week) => week.reps?.trim())
    .filter((reps): reps is string => Boolean(reps));

  const effectiveRptReps =
    rptReps && rptReps.length > 0 ? rptReps : DEFAULT_RPT_REPS;

  const slots: ExerciseSlot[] = exercises.map((ex) => {
    const def = ALL_EXERCISES.find((e) => e.id === ex.exerciseId);
    return {
      isCompound: def ? def.isCompound : ex.type === 'compound',
      isSpineSensitive: def ? def.isSpineSensitive : false,
    };
  });

  const plan = planSessionTechniques(slots, profile, analysis, performance);

  exercises.forEach((ex, i) => {
    const technique = plan[i];
    if (technique === 'straight' || ex.sets.length < 2) return;
    const rule = getTechniqueRule(technique);
    const sets = ex.sets;

    if (technique === 'rpt') {
      const first = sets[0].suggestedWeight;
      sets.forEach((s, idx) => {
        const pct = 100 - 8 * idx;
        s.technique = 'rpt'; s.techniqueNameFa = rule.nameFa;
        s.techniqueConfig = { ...rule.config, loadPercent: pct };
        s.targetReps = effectiveRptReps[Math.min(idx, effectiveRptReps.length - 1)];
        s.restSeconds = Math.max(s.restSeconds, 150);
        if (typeof first === 'number') s.suggestedWeight = roundWeight((first * pct) / 100);
      });
    } else if (technique === 'cluster') {
      sets.forEach((s) => {
        s.technique = 'cluster'; s.techniqueNameFa = rule.nameFa;
        s.techniqueConfig = { ...rule.config };
        s.restSeconds = Math.max(s.restSeconds, 150);
      });
    } else if (technique === 'super_giant') {
      const transitionRest = rule.config.miniSetRest ?? 20;
      const followedByPair = plan[i + 1] === 'super_giant';
      sets.forEach((s) => {
        s.technique = 'super_giant'; s.techniqueNameFa = rule.nameFa;
        s.techniqueConfig = { ...rule.config };
        if (followedByPair) s.restSeconds = transitionRest;
      });
    } else {
      const last = sets[sets.length - 1];
      last.technique = technique; last.techniqueNameFa = rule.nameFa;
      last.techniqueConfig = { ...rule.config };
      last.targetRIR = 0;
    }
  });
}
