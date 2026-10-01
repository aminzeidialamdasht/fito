import type { WorkoutProgram, AthleteProfile } from '../types';

export const DEFAULT_WORKOUT_PLAN: WorkoutProgram = {
  id: 'sample-push-pull-legs',
  name: 'برنامه پوش/پول/لگ',
  profileId: '',
  duration: '۴ هفته',
  createdAt: new Date().toISOString(),
  days: [
    {
      day: 'شنبه', weekday: 'شنبه',
      muscle_groups: ['سینه', 'پشت بازو', 'شکم'], muscleGroups: ['سینه', 'پشت بازو', 'شکم'],
      exercises: [
        { name: 'پرس سینه هالتر', sets: 4, reps: '8-10', rest: 90, tempo: '2-0-1', notes: '' },
        { name: 'بالاسینه دمبل', sets: 3, reps: '10-12', rest: 60, tempo: '2-0-1', notes: '' },
        { name: 'قفسه سینه دستگاه', sets: 3, reps: '12-15', rest: 60, tempo: '2-0-1', notes: '' },
        { name: 'پشت بازو سیم‌کش', sets: 4, reps: '10-12', rest: 60, tempo: '2-0-1', notes: '' },
        { name: 'کرانچ شکم', sets: 3, reps: '15-20', rest: 45, tempo: '1-0-1', notes: '' },
      ],
    },
    {
      day: 'یکشنبه', weekday: 'یکشنبه',
      muscle_groups: ['زیربغل', 'جلوبازو'], muscleGroups: ['زیربغل', 'جلوبازو'],
      exercises: [
        { name: 'لت از جلو', sets: 4, reps: '10-12', rest: 60, tempo: '2-0-1', notes: '' },
        { name: 'قایقی سیم‌کش', sets: 3, reps: '10-12', rest: 60, tempo: '2-0-1', notes: '' },
        { name: 'فیس پول', sets: 3, reps: '12-15', rest: 45, tempo: '2-0-1', notes: '' },
        { name: 'جلوبازو هالتر', sets: 4, reps: '8-10', rest: 60, tempo: '2-0-1', notes: '' },
        { name: 'جلوبازو دمبل چکشی', sets: 3, reps: '10-12', rest: 60, tempo: '2-0-1', notes: '' },
      ],
    },
    {
      day: 'سه‌شنبه', weekday: 'سه‌شنبه',
      muscle_groups: ['سرشانه', 'کول', 'ساق'], muscleGroups: ['سرشانه', 'کول', 'ساق'],
      exercises: [
        { name: 'پرس سرشانه دستگاه', sets: 4, reps: '8-10', rest: 90, tempo: '2-0-1', notes: '' },
        { name: 'نشر از جانب دمبل', sets: 3, reps: '12-15', rest: 60, tempo: '2-0-1', notes: '' },
        { name: 'نشر خم دمبل', sets: 3, reps: '12-15', rest: 60, tempo: '2-0-1', notes: '' },
        { name: 'شراگ دمبل', sets: 4, reps: '12-15', rest: 60, tempo: '1-0-1', notes: '' },
        { name: 'ساق پا ایستاده', sets: 4, reps: '15-20', rest: 45, tempo: '1-1-1', notes: '' },
      ],
    },
    {
      day: 'چهارشنبه', weekday: 'چهارشنبه',
      muscle_groups: ['ران', 'باسن', 'شکم'], muscleGroups: ['ران', 'باسن', 'شکم'],
      exercises: [
        { name: 'پرس پا دستگاه', sets: 4, reps: '10-12', rest: 90, tempo: '2-0-1', notes: '' },
        { name: 'لانژ دمبل', sets: 3, reps: '10-12', rest: 60, tempo: '2-0-1', notes: '' },
        { name: 'پشت ران دستگاه', sets: 3, reps: '12-15', rest: 60, tempo: '2-0-1', notes: '' },
        { name: 'ساق پا نشسته', sets: 4, reps: '15-20', rest: 45, tempo: '1-1-1', notes: '' },
        { name: 'پلانک', sets: 3, reps: '30-45ث', rest: 45, tempo: '-', notes: '' },
      ],
    },
  ],
};

export const SAMPLE_PROFILE: AthleteProfile = {
  id: 'sample-profile',
  name: 'کاربر نمونه',
  age: 30,
  gender: 'male',
  height: 175,
  weight: 80,
  targetWeight: 85,
  activityLevel: 'moderate',
  experience: 'intermediate',
  trainingDays: 4,
  sessionDuration: 60,
  location: 'gym',
  equipmentType: 'full_gym',
  customEquipment: [],
  equipment: [],
  injuries: [],
  limitations: [],
  avoidedExercises: [],
  primaryGoal: 'افزایش حجم عضله',
  secondaryGoal: 'کاهش چربی',
  targetMuscles: ['سینه', 'پشت', 'ران'],
  programType: 'push_pull_legs',
  timeline: '۱۲ هفته',
  trainingHistory: '۲ سال سابقه تمرین مداوم',
  strengthRecords: { 'پرس سینه': '80kg', 'اسکوات': '100kg', 'ددلیفت': '120kg' },
  bodyMeasurements: { chest: 100, waist: 85, hips: 95, arms: 38, thighs: 55, calves: 38, shoulders: 45, neck: 38 },
  
  // Nutrition fields
  dietaryGoal: 'افزایش حجم',
  dietType: 'استاندارد',
  mealsPerDay: 5,
  calorieTarget: 2800,
  favoriteFoods: ['مرغ', 'برنج', 'سیب‌زمینی'],
  dislikedFoods: ['ماهی', 'فسنجان'],
  foodAllergies: ['ماهی'],
  
  // Supplement fields
  supplementGoal: 'ریکاوری و رشد عضله',
  supplementBudget: 'متوسط',
  currentSupplements: ['وی پروتئین', 'کراتین'],
  healthConditions: [],
  
  // Missing required fields
  cookingSkill: 'none',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_NUTRITION_PLAN = {
  id: 'default-nutrition',
  name: 'برنامه تغذیه پیش‌فرض',
  profileId: '',
  days: [],
};

export const DEFAULT_SUPPLEMENT_PLAN = {
  id: 'default-supplement',
  name: 'برنامه مکمل پیش‌فرض',
  profileId: '',
  days: [],
};
