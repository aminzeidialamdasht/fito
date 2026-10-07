import type { WeeklyProgressionStep } from '../engine/types/program';
import type { WorkoutProgram } from '../types';
import { toPersianNumber } from './jalali';

type ProgramWithWeekMetadata = WorkoutProgram & {
  durationWeeks?: number;
  metadata?: WorkoutProgram['metadata'] & { durationWeeks?: number };
};

const DAY_MS = 24 * 60 * 60 * 1000;

function dateAtMidnight(value: string | Date): Date | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

function getStartDate(program: WorkoutProgram): Date | null {
  const start = program.startDate || program.createdAt;
  return start ? dateAtMidnight(start) : null;
}

function getDurationWeeks(program: WorkoutProgram): number {
  const p = program as ProgramWithWeekMetadata;
  const metadataWeeks = p.metadata?.durationWeeks;
  if (typeof metadataWeeks === 'number' && metadataWeeks > 0) return metadataWeeks;
  if (typeof p.durationWeeks === 'number' && p.durationWeeks > 0) return p.durationWeeks;
  const steps = p.metadata?.weeklyProgression;
  if (steps?.length) return steps.length;
  const match = program.duration?.match(/\d+/);
  return match ? Math.max(1, Math.ceil(Number(match[0]) / 7)) : 4;
}

export function getCurrentWeek(program: WorkoutProgram, today = new Date()): number {
  const start = getStartDate(program);
  const current = dateAtMidnight(today);
  if (!start || !current) return 1;
  const daysDiff = Math.floor((current.getTime() - start.getTime()) / DAY_MS);
  if (daysDiff < 0) return 0;
  return Math.min(Math.floor(daysDiff / 7) + 1, getDurationWeeks(program));
}

export function getWeekScheme(
  program: WorkoutProgram,
  week: number,
): WeeklyProgressionStep | null {
  if (!Number.isInteger(week) || week < 1) return null;
  return program.metadata?.weeklyProgression?.[week - 1] || null;
}

export function getProgramWeekRange(
  program: WorkoutProgram,
  week: number,
): { start: Date; end: Date } | null {
  const start = getStartDate(program);
  if (!start || !Number.isInteger(week) || week < 1) return null;
  const weekStart = new Date(start.getTime() + (week - 1) * 7 * DAY_MS);
  const end = new Date(weekStart.getTime() + 7 * DAY_MS);
  return { start: weekStart, end };
}

export function formatWeekLabel(program: WorkoutProgram, week: number): string {
  const label = getWeekScheme(program, week)?.label;
  const number = toPersianNumber(week);
  return label ? `هفته ${number} — ${label}` : `هفته ${number}`;
}

export function getDaysUntilNextWeek(
  program: WorkoutProgram,
  today = new Date(),
): number | null {
  const current = dateAtMidnight(today);
  if (!current) return null;
  const range = getProgramWeekRange(program, getCurrentWeek(program, today));
  if (!range) return null;
  return Math.max(0, Math.floor((range.end.getTime() - current.getTime()) / DAY_MS));
}
