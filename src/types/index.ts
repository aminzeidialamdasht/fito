export interface AthleteProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  targetWeight?: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  experience: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  trainingDays: number;
  sessionDuration: number;
  location: 'gym' | 'home' | 'both' | 'park';
  equipmentType: 'full_gym' | 'home' | 'park' | 'custom';
  customEquipment: string[];
  equipment: string[];
  injuries: string[];
  limitations: string[];
  avoidedExercises: string[];
  primaryGoal: string;
  secondaryGoal?: string;
  targetMuscles: string[];
  programType: 'full_body' | 'split' | 'push_pull_legs' | 'upper_lower' | 'ai_suggested';
  timeline: string;
  trainingHistory: string;
  strengthRecords: Record<string, string>;
  bodyMeasurements: BodyMeasurements;
  dietaryGoal: string;
  dietType: string;
  foodAllergies: string[];
  favoriteFoods: string[];
  dislikedFoods: string[];
  mealsPerDay: number;
  calorieTarget?: number;
  cookingSkill: 'none' | 'basic' | 'intermediate' | 'advanced';
  supplementGoal: string;
  currentSupplements: string[];
  supplementBudget: string;
  healthConditions: string[];
  bodyFatPercent?: number;
  bodyComposition?: string;
  sleepHours?: number;
  recoveryQuality?: string;
  jobStress?: string;
  workShift?: string;
  injuryDetails?: string;
  preferredExercises?: string[];
  exercisePreferences?: string;
  hormoneMedNotes?: string;
  competitionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type Goal = 'hypertrophy' | 'strength' | 'fat_loss' | 'recomposition' | 'competition' | 'general_fitness';

export interface BodyMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  calves?: number;
  shoulders?: number;
  neck?: number;
}

export interface WorkoutProgram {
  id: string;
  profileId: string;
  name: string;
  duration: string;
  createdAt: string;
  startDate?: string;
  days: WorkoutDay[];
}

export interface WorkoutDay {
  id?: string;
  day: string;
  muscleGroups: string[];
  muscle_groups?: string[];
  exercises: Exercise[];
}

export interface Exercise {
  id?: string;
  name: string;
  sets: number;
  reps: string;
  rest: number;
  tempo?: string;
  notes?: string;
}

export interface SetRecord {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  targetReps: string;
  actualReps: number;
  weight: number;
  rir?: number;
  rpe?: number;
  completed: boolean;
}

export interface WorkoutSession {
  id: string;
  profileId: string;
  programId: string;
  dayId: string;
  dayName?: string;
  date: string;
  startTime: string;
  endTime?: string;
  duration: number;
  sets: SetRecord[];
  exercises?: SessionExercise[];
  totalVolume: number;
  completed: boolean;
  notes?: string;
}

export interface SessionExercise {
  name: string;
  sets: SetRecord[];
}

export interface ProgressEntry {
  id: string;
  profileId: string;
  date: string;
  weight: number;
  bodyFat?: number;
  measurements?: BodyMeasurements;
  notes?: string;
}

export interface NutritionProgram {
  id: string;
  profileId: string;
  plan_name: string;
  duration: string;
  daily_calories: number;
  macros: { protein: number; carbs: number; fats: number };
  days: NutritionDay[];
  hydration: string;
  supplements?: string;
  createdAt: string;
  startDate?: string;
}

export interface NutritionDay { day: string; meals: Meal[]; total_calories: number; notes?: string; }
export interface Meal { meal_name: string; time: string; foods: Food[]; preparation?: string; }
export interface Food { name: string; portion: string; calories: number; protein: number; carbs: number; fats: number; }

export interface Supplement {
  name: string;
  english_name?: string;
  priority?: string;
  dosage?: string;
  timing?: string;
  benefits?: string;
  side_effects?: string;
  estimated_cost?: string;
  recommended_brands?: string;
  notes?: string;
}

export interface SupplementProgram {
  id: string;
  profileId: string;
  recommendation_title: string;
  summary?: string;
  supplements: Supplement[];
  total_estimated_cost?: string;
  important_notes?: string;
  warnings?: string;
  createdAt: string;
  startDate?: string;
}

export interface AppState {
  profiles: AthleteProfile[];
  activeProfileId: string | null;
  programs: WorkoutProgram[];
  activeProgram: string | null;
  nutritionPrograms: NutritionProgram[];
  activeNutritionProgram: string | null;
  supplementPrograms: SupplementProgram[];
  activeSupplementProgram: string | null;
  sessions: WorkoutSession[];
  progress: ProgressEntry[];
}

export const GOAL_LABELS: Record<Goal, string> = {
  hypertrophy: 'عضله‌سازی (هایپرتروفی)', strength: 'افزایش قدرت', fat_loss: 'کاهش چربی',
  recomposition: 'ریکامپوزیشن', competition: 'آماده‌سازی مسابقه', general_fitness: 'آمادگی عمومی',
};
export function getGoalLabel(goal: string): string { return GOAL_LABELS[goal as Goal] || goal; }
export const EXPERIENCE_LABELS: Record<string, string> = { beginner: 'مبتدی', intermediate: 'متوسط', advanced: 'پیشرفته', professional: 'حرفه‌ای' };
export const EQUIPMENT_OPTIONS = ['هالتر','دمبل','دستگاه سیم‌کش','دستگاه اسمیت','زیربغل سیم‌کش','سیم‌کش پایین','سیم‌کش بالا','نیمکت','میله بارفیکس','پارالل','کتل‌بل','تی‌آر‌ایکس','کش مقاومتی','وزن بدن','پرس پا','دستگاه پرس سینه','صفحه وزنه','دمبل متغیر'];
export const MUSCLE_GROUPS = ['سینه','پشت','سرشانه','جلوبازو','پشت‌بازو','چهارسر ران','همسترینگ','باسن','ساق پا','شکم','کول','ساعد'];
export const PROGRAM_TYPES = { full_body:'کل بدن (Full Body)', split:'اسپلیت عضلانی', push_pull_legs:'پوش / پول / لگز', upper_lower:'بالاتنه / پایین‌تنه', ai_suggested:'پیشنهاد هوش مصنوعی' };
export const ACTIVITY_LEVELS = { sedentary:'کم‌تحرک (کار پشت میز)', light:'فعالیت سبک', moderate:'فعالیت متوسط', active:'فعال', very_active:'بسیار فعال' };
export const BODY_COMPOSITION_LABELS: Record<string,string> = { lean:'لاغر / کم‌چربی', athletic:'ورزشی / عضلانی', average:'متوسط', overweight:'اضافه‌وزن', obese:'چاقی' };
export const RECOVERY_QUALITY_LABELS: Record<string,string> = { poor:'ضعیف', fair:'متوسط', good:'خوب', excellent:'عالی' };
export const JOB_STRESS_LABELS: Record<string,string> = { low:'کم', moderate:'متوسط', high:'بالا' };
export const WORK_SHIFT_LABELS: Record<string,string> = { normal:'عادی (روزکار)', shift:'شیفتی', night:'شب‌کار', irregular:'نامنظم' };
export const EQUIPMENT_TYPES = { full_gym:'باشگاه کامل', home:'خانه', park:'پارک / فضای باز', custom:'سفارشی' };
export const DIET_TYPES = ['Balanced','High Protein','Low Carb','Mediterranean','Vegetarian','Vegan','Keto','Traditional Iranian'];
export const IRANIAN_FOODS = ['چلو کباب','قورمه‌سبزی','قیمه','ته‌چین','آش رشته','کوکو سبزی','فسنجان','زرشک‌پلو','باقالی‌پلو','دیزی','آبگوشت','ته‌دیگ','نان سنگک','نان لواش','برنج','عدس‌پلو','ماست','دوغ','سبزی خوردن','گردو','مرغ','ماهی','گوشت قرمز','تخم‌مرغ','لوبیا','نخود','عدس','سیب‌زمینی','گوجه‌فرنگی','خیار','پیاز','سیر'];
export const SUPPLEMENT_CATEGORIES = ['پودر پروتئین','کراتین','بی‌سی‌ای‌ای','پری‌ورک‌اوت','مولتی‌ویتامین','امگا ۳','ویتامین D','ZMA','گلوتامین','بتا-آلانین','سیترولین','کافئین'];
