import type { WorkoutProgram } from '../types';
import type { GeneratedProgram } from '../engine/types/program';

export function convertGeneratedToWorkout(
  generated: GeneratedProgram,
  existing?: WorkoutProgram,
  profileId?: string,
  currentWeek?: number,
): WorkoutProgram {
  return {
    id: existing?.id ?? generated.id,
    profileId: existing?.profileId ?? profileId ?? '',
    name: existing?.name ?? generated.name,
    duration: `${generated.durationWeeks} هفته`,
    createdAt: existing?.createdAt ?? generated.createdAt,
    ...(existing?.startDate !== undefined
      ? { startDate: existing.startDate }
      : {}),
    trainingDays: generated.trainingDaysPerWeek,
    splitType: generated.splitType,
    goal: generated.goal,
    experience: generated.experience,
    days: generated.days.map((day) => ({
      day: day.title,
      weekday: day.dayName,
      muscleGroups: day.exercises.map((e) => e.primaryMuscle),
      muscle_groups: day.exercises.map((e) => e.primaryMuscle),
      exercises: day.exercises.map((ex) => ({
        id: ex.exerciseId,
        exerciseId: ex.exerciseId,
        name: ex.name,
        sets: ex.sets.length,
        reps: ex.sets[0]?.targetReps || '8-12',
        rest: ex.sets[0]?.restSeconds || 90,
        tempo: ex.sets[0]?.tempo,
        rir: ex.sets[0]?.targetRIR,
        loadMethod:
          ex.sets.find((set) => set.technique)?.techniqueNameFa ||
          ex.sets.find((set) => set.technique)?.technique ||
          undefined,
        targetMuscle: ex.primaryMuscle,
        primaryMuscle: ex.primaryMuscle,
        secondaryMuscles: ex.secondaryMuscles || [],
        type: ex.type,
        englishName: ex.englishName,
        substitute: ex.substituteId,
        notes: ex.notes,
      })),
    })),
    weeklyVolumeSummary: generated.weeklyVolumeSummary || {},
    restDays: generated.restDays || [],
    metadata: {
      ...generated.metadata,
      ...existing?.metadata,
      currentWeek:
        currentWeek ??
        generated.metadata.currentWeek ??
        existing?.metadata?.currentWeek,
    },
  };
}
