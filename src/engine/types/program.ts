/**
 * تایپ‌های برنامه تمرینی تولیدشده
 */

import type { MuscleGroup } from './exercise';

export type Goal =
  | 'hypertrophy'
  | 'strength'
  | 'fat_loss'
  | 'recomposition'
  | 'competition'
  | 'general_fitness';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional';

export type SplitType =
  | 'full_body'
  | 'upper_lower'
  | 'push_pull_legs'
  | 'bro_split'
  | 'ppl_ul_hybrid';

export type SessionFocus =
  | 'full_body'
  | 'upper'
  | 'lower'
  | 'push'
  | 'pull'
  | 'legs'
  | 'chest_back'
  | 'chest_triceps'
  | 'back_biceps'
  | 'shoulders_arms'
  | 'custom';

export interface GeneratedSet {
  setNumber: number;
  targetReps: string;      // "8-12"
  targetRIR: number;       // 2
  restSeconds: number;     // 90
  tempo?: string;          // "3-1-1-0"
  suggestedWeight?: number;  // وزنه پیشنهادی بر اساس رکورد قبلی
  lastWeight?: number;       // آخرین وزنه ثبت‌شده
}

export interface GeneratedExercise {
  exerciseId: string;
  name: string;
  englishName: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  type: 'compound' | 'isolation';
  sets: GeneratedSet[];
  notes?: string;
  substituteId?: string;
}

export interface GeneratedDay {
  dayIndex: number;        // 0-6 (شنبه تا جمعه)
  dayName: string;         // "شنبه"
  focus: SessionFocus;
  title: string;           // "روز پوش - سینه و سرشانه"
  estimatedDuration: number; // دقیقه
  exercises: GeneratedExercise[];
  warmup?: string;
  cooldown?: string;
}

export interface GeneratedProgram {
  id: string;
  name: string;
  goal: Goal;
  experience: ExperienceLevel;
  splitType: SplitType;
  trainingDaysPerWeek: number;
  sessionDuration: number;
  durationWeeks: number;
  createdAt: string;
  days: GeneratedDay[];
  restDays: number[];      // ایندکس روزهای استراحت
  weeklyVolumeSummary: Record<MuscleGroup, number>;
  metadata: {
    engineVersion: string;
    generatedFrom: 'offline_engine';
    notes?: string;
  };
}
