/**
 * تایپ‌های مربوط به دیتابیس حرکات
 * منابع: ExRx, NSCA, ACE, Bret Contreras
 */

export type MuscleGroup =
  | 'chest'
  | 'upper_back'
  | 'lats'
  | 'lower_back'
  | 'traps'
  | 'front_delts'
  | 'side_delts'
  | 'rear_delts'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'abs'
  | 'obliques';

export type MovementPattern =
  | 'horizontal_push'
  | 'vertical_push'
  | 'horizontal_pull'
  | 'vertical_pull'
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'carry'
  | 'rotation'
  | 'anti_rotation'
  | 'flexion'
  | 'extension';

export type ExerciseType = 'compound' | 'isolation';

export type EquipmentType =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'kettlebell'
  | 'bands'
  | 'smith_machine'
  | 'ez_bar'
  | 'bench'
  | 'pull_up_bar'
  | 'dip_station'
  | 'trx';

export type DifficultyLevel = 1 | 2 | 3;

export type InjuryRiskLevel = 'low' | 'medium' | 'high';

export interface InjuryRisk {
  shoulder?: InjuryRiskLevel;
  lowerBack?: InjuryRiskLevel;
  knee?: InjuryRiskLevel;
  hip?: InjuryRiskLevel;
  elbow?: InjuryRiskLevel;
  wrist?: InjuryRiskLevel;
  ankle?: InjuryRiskLevel;
}

export interface RepRange {
  min: number;
  max: number;
}

export interface Exercise {
  id: string;
  name: string;
  englishName: string;
  aliases?: string[];
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  type: ExerciseType;
  movementPattern: MovementPattern;
  equipment: EquipmentType[];
  difficulty: DifficultyLevel;
  injuryRisk: InjuryRisk;
  substitutes: string[];
  cues: string[];
  repRanges: {
    hypertrophy: RepRange;
    strength: RepRange;
    endurance: RepRange;
  };
  rirRange: {
    hypertrophy: RepRange;
    strength: RepRange;
  };
  restSeconds: {
    min: number;
    max: number;
  };
  tempo?: string;
  isCompound: boolean;
  isSpineSensitive: boolean;
  imageUrl?: string;
  videoUrl?: string;
  tags: string[];
}
