import type {
  GeneratedProgram,
  GeneratedSet,
  TrainingTechnique,
} from '../engine/types/program';
import type { WorkoutProgram } from '../types';
import {
  getProgramSystem,
  getTechniqueRule,
  type ProgramSystemId,
} from '../engine/data/rules/trainingSystems';

type Program = WorkoutProgram | GeneratedProgram;

interface ExtendedMetadata {
  systemName?: string;
  systemNameFa?: string;
  systemId?: string;
  periodizationPhase?: string;
  weeklyProgression?: Array<{
    week: number;
    reps: string;
    rir: number;
    label: string;
  }>;
  deloadLevel?: 'none' | 'light' | 'medium' | 'heavy';
}

type ProgramWithExtendedMetadata = Program & {
  metadata?: ExtendedMetadata;
};

export interface SystemInfo {
  id: string;
  nameFa: string;
  summaryFa: string;
}

export interface DeloadInfo {
  level: 'none' | 'light' | 'medium' | 'heavy';
  labelFa: string;
  color: string;
  impactPercent: number;
}

export interface PeriodizationInfo {
  phase: string;
  week: number;
  totalWeeks: number;
}

const DEFAULT_SET: GeneratedSet = {
  setNumber: 1,
  targetReps: '—',
  targetRIR: 2,
  restSeconds: 0,
};

export function getSystemInfo(program: Program): SystemInfo | null {
  const metadata = (program as ProgramWithExtendedMetadata).metadata;
  const systemId = metadata?.systemId || metadata?.systemName;
  const system = systemId
    ? getProgramSystem(systemId as ProgramSystemId)
    : null;

  if (!system && !metadata?.systemNameFa) return null;

  return {
    id: system?.id || systemId || 'custom',
    nameFa: metadata?.systemNameFa || system?.nameFa || metadata?.systemName || 'سیستم اختصاصی',
    summaryFa: system?.summaryFa || metadata?.periodizationPhase || 'برنامه تمرینی شخصی‌سازی‌شده',
  };
}

export function getDeloadInfo(program: Program): DeloadInfo {
  const level = (program as ProgramWithExtendedMetadata).metadata?.deloadLevel || 'none';
  const values: Record<DeloadInfo['level'], Omit<DeloadInfo, 'level'>> = {
    none: { labelFa: 'بدون دیلود', color: '#94a3b8', impactPercent: 0 },
    light: { labelFa: 'دیلود سبک', color: '#facc15', impactPercent: 15 },
    medium: { labelFa: 'دیلود متوسط', color: '#fb923c', impactPercent: 30 },
    heavy: { labelFa: 'دیلود سنگین', color: '#f87171', impactPercent: 50 },
  };

  return { level, ...values[level] };
}

export function getPeriodizationInfo(program: Program): PeriodizationInfo {
  const metadata = (program as ProgramWithExtendedMetadata).metadata;
  const progression = metadata?.weeklyProgression || [];
  const week = progression[0]?.week || 1;
  const totalWeeks =
    'durationWeeks' in program
      ? program.durationWeeks
      : progression.length || 1;

  return {
    phase: metadata?.periodizationPhase || progression[week - 1]?.label || 'پیشرفت تدریجی',
    week,
    totalWeeks,
  };
}

export function getTechniqueInfo(techniqueId?: TrainingTechnique) {
  const rule = getTechniqueRule(techniqueId || 'straight');
  return {
    nameFa: rule.nameFa,
    noteFa: rule.config.noteFa || '',
    config: rule.config,
  };
}

export function normalizeSets(sets: number | GeneratedSet[] | undefined): GeneratedSet[] {
  if (Array.isArray(sets)) return sets;
  const count = Math.max(0, sets || 0);
  return Array.from({ length: count }, (_, index) => ({
    ...DEFAULT_SET,
    setNumber: index + 1,
  }));
}

export function countTotalSets(program: Program): number {
  return program.days.reduce(
    (total, day) =>
      total +
      day.exercises.reduce(
        (dayTotal, exercise) =>
          dayTotal + normalizeSets(exercise.sets as number | GeneratedSet[]).length,
        0,
      ),
    0,
  );
}
