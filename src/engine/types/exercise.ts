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

/**
 * دسته‌بندی کلی تجهیزات (نه دستگاه خاص)
 * این برای فیلتر سطح بالا در UI استفاده می‌شود
 */
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

/**
 * نوع مکانیزم دستگاه (برای جایگزینی هوشمند)
 * pin_loaded: دستگاه با پین و صفحات وزنه
 * plate_loaded: دستگاه با صفحات جداگانه
 * lever: دستگاه اهرمی (مثل هامر)
 * cable: دستگاه کابلی
 * smith: اسمیت
 */
export type MachineType =
  | 'pin_loaded'
  | 'plate_loaded'
  | 'lever'
  | 'cable'
  | 'smith';

/**
 * جزئیات تجهیزات برای یک حرکت خاص
 * variant برای تشخیص حالت: تخت/شیب‌دار/زیرسینه/ایستاده/نشسته
 */
export type EquipmentVariant =
  | 'flat'
  | 'incline'
  | 'decline'
  | 'seated'
  | 'standing'
  | 'lying'
  | 'kneeling'
  | 'bent_over'
  | 'high'
  | 'low'
  | 'neutral'
  | 'wide'
  | 'close'
  | 'unilateral'
  | 'bilateral';

export interface EquipmentDetails {
  primary: EquipmentType;
  support?: EquipmentType[];
  machineType?: MachineType;
  variant?: EquipmentVariant;
}

export type DifficultyLevel = 1 | 2 | 3;

export type InjuryRiskLevel = 'low' | 'medium' | 'high';

export interface InjuryRisk {
  shoulder?: InjuryRiskLevel;
  lowerBack?: InjuryRiskLevel;
  upperBack?: InjuryRiskLevel;
  neck?: InjuryRiskLevel;
  knee?: InjuryRiskLevel;
  hip?: InjuryRiskLevel;
  hamstring?: InjuryRiskLevel;
  quad?: InjuryRiskLevel;
  glute?: InjuryRiskLevel;
  elbow?: InjuryRiskLevel;
  wrist?: InjuryRiskLevel;
  ankle?: InjuryRiskLevel;
  biceps?: InjuryRiskLevel;
  triceps?: InjuryRiskLevel;
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
  equipmentDetails?: EquipmentDetails;
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

/**
 * گزینه‌های جایگزینی هوشمند
 */
export interface SubstituteOptions {
  /** تجهیزات موجود کاربر */
  availableEquipment: EquipmentType[];
  /** آسیب‌های کاربر */
  injuries?: Partial<InjuryRisk>;
  /** حداکثر تعداد جایگزین */
  maxResults?: number;
  /** IDهایی که نباید جایگزین شوند */
  excludeIds?: string[];
  /** آیا فقط حرکات هم‌سطح (difficulty) برگردانده شوند */
  sameDifficultyOnly?: boolean;
}

/**
 * نتیجه جایگزینی با امتیاز
 */
export interface SubstituteCandidate {
  exercise: Exercise;
  score: number;
  reasons: string[];
}
