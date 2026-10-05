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

const RPT_REPS = ['6-8', '8-10', '10-12', '12-15'];

function roundWeight(w: number): number {
  return Math.round(w / 2.5) * 2.5;
}

export function applyTechniquesToExercises(
  exercises: GeneratedExercise[],
  profile: AthleteProfile,
  analysis: ProfileAnalysis,
  performance: PerformanceAnalysis
): void {
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
        s.technique = 'rpt';
        s.techniqueConfig = { ...rule.config, loadPercent: pct };
        s.targetReps = RPT_REPS[Math.min(idx, RPT_REPS.length - 1)];
        s.restSeconds = Math.max(s.restSeconds, 150);
        if (typeof first === 'number') s.suggestedWeight = roundWeight((first * pct) / 100);
      });
    } else if (technique === 'cluster') {
      sets.forEach((s) => {
        s.technique = 'cluster';
        s.techniqueConfig = { ...rule.config };
        s.restSeconds = Math.max(s.restSeconds, 150);
      });
    } else {
      const last = sets[sets.length - 1];
      last.technique = technique;
      last.techniqueConfig = { ...rule.config };
      last.targetRIR = 0;
    }
  });
}
