export const DEFAULT_WORKOUT_PLAN = {
  program_name: "برنامه نمونه ۳ روزه فول‌بادی (نسخه نمایشی)",
  duration: "۳ روز در هفته",
  days: [
    {
      day: "روز اول: تمرکز بر پایین‌تنه و فشار",
      muscle_groups: ["چهارسر ران", "سینه", "شکم"],
      exercises: [
        { name: "اسکات با هالتر", sets: 3, reps: "8-10", rest: 90, tempo: "3-1-1-0", notes: "کنترل کامل در فاز منفی" },
        { name: "پرس سینه دمبل", sets: 3, reps: "10-12", rest: 90, tempo: "2-0-1-0", notes: "جمع کردن کتف‌ها" },
        { name: "پلانک", sets: 3, reps: "30-45 ثانیه", rest: 60, tempo: "ایستا", notes: "حفظ خط صاف بدن" }
      ]
    },
    {
      day: "روز دوم: تمرکز بر کشش و پشت",
      muscle_groups: ["پشت (زیربغل)", "همسترینگ", "جلوبازو"],
      exercises: [
        { name: "ددلیفت رومانیایی", sets: 3, reps: "10-12", rest: 90, tempo: "3-1-1-0", notes: "حفظ قوس طبیعی کمر" },
        { name: "زیربغل سیم‌کش از بالا", sets: 3, reps: "10-12", rest: 60, tempo: "2-1-1-0", notes: "کشش کامل در بالا" },
        { name: "جلوبازو هالتر ایستاده", sets: 3, reps: "10-12", rest: 60, tempo: "2-0-1-0", notes: "بدون تاب دادن بدن" }
      ]
    },
    {
      day: "روز سوم: تمرکز بر سرشانه و تکمیلی",
      muscle_groups: ["سرشانه", "پشت‌بازو", "ساق پا"],
      exercises: [
        { name: "پرس سرشانه دمبل نشسته", sets: 3, reps: "10-12", rest: 90, tempo: "2-0-1-0", notes: "تکیه‌گاه پشتی صندلی" },
        { name: "پشت‌بازو سیم‌کش با طناب", sets: 3, reps: "12-15", rest: 60, tempo: "2-0-1-0", notes: "باز کردن طناب در انتهای حرکت" },
        { name: "ساق پا ایستاده دستگاه", sets: 4, reps: "15-20", rest: 45, tempo: "2-1-1-0", notes: "مکث ۱ ثانیه‌ای در انقباض" }
      ]
    }
  ]
};

export const DEFAULT_NUTRITION_PLAN = {
  plan_name: "برنامه تغذیه نمونه ۳ وعده (نسخه نمایشی)",
  duration: "۱ روز نمونه",
  daily_calories: 2200,
  macros: { protein: 150, carbs: 220, fats: 70 },
  days: [
    {
      day: "روز نمونه",
      meals: [
        { meal_name: "صبحانه", time: "08:00", foods: [{ name: "تخم‌مرغ آب‌پز", portion: "۳ عدد", calories: 210, protein: 18, carbs: 2, fats: 15 }, { name: "نان جو", portion: "۲ کف دست", calories: 160, protein: 6, carbs: 30, fats: 2 }], preparation: "تخم‌مرغ‌ها را به‌صورت آب‌پز سفت آماده کنید." },
        { meal_name: "ناهار", time: "14:00", foods: [{ name: "سینه مرغ گریل شده", portion: "۱۵۰ گرم", calories: 250, protein: 45, carbs: 0, fats: 5 }, { name: "برنج کته", portion: "۱۰ قاشق", calories: 300, protein: 6, carbs: 60, fats: 3 }], preparation: "مرغ را با زردچوبه و فلفل سیاه مزه‌دار و گریل کنید." },
        { meal_name: "شام", time: "20:00", foods: [{ name: "ماهی قزل‌آلا", portion: "۱۲۰ گرم", calories: 200, protein: 25, carbs: 0, fats: 10 }, { name: "سبزیجات بخارپز", portion: "۱ کاسه", calories: 80, protein: 4, carbs: 15, fats: 1 }], preparation: "ماهی را با کمی لیموترش بپزید." }
      ],
      total_calories: 1450,
      notes: "این یک نمونه است. برای محاسبه دقیق کالری، اشتراک تهیه کنید."
    }
  ],
  hydration: "حداقل ۸ تا ۱۰ لیوان آب در روز",
  supplements: "مصرف مولتی‌ویتامین همراه با صبحانه توصیه می‌شود."
};

export const DEFAULT_SUPPLEMENT_PLAN = {
  recommendation_title: "توصیه مکمل پایه (نسخه نمایشی)",
  summary: "این سه مکمل، پایه‌ای‌ترین و علمی‌ترین مکمل‌ها برای حمایت از تمرین و ریکاوری هستند.",
  supplements: [
    { name: "پروتئین وی", english_name: "Whey Protein", priority: "بالا", dosage: "۱ اسکوپ", timing: "بعد از تمرین", benefits: "تأمین سریع اسیدهای آمینه", side_effects: "احتمال نفخ در صورت عدم تحمل لاکتوز", estimated_cost: "متغیر", recommended_brands: "برندهای دارای مجوز", notes: "اولویت با غذای واقعی است." },
    { name: "کراتین مونوهیدرات", english_name: "Creatine Monohydrate", priority: "بالا", dosage: "۵ گرم", timing: "هر روز", benefits: "افزایش قدرت و حجم عضلانی", side_effects: "احتباس آب درون‌سلولی", estimated_cost: "مقرون‌به‌صرفه", recommended_brands: "Creapure", notes: "نیازی به دوره بارگیری نیست." },
    { name: "مولتی‌ویتامین ورزشی", english_name: "Sports Multivitamin", priority: "متوسط", dosage: "۱ عدد", timing: "همراه صبحانه", benefits: "حمایت از سیستم ایمنی", side_effects: "تغییر رنگ ادرار (بی‌خطر)", estimated_cost: "متوسط", recommended_brands: "برندهای معتبر دارویی", notes: "جایگزین رژیم غذایی متنوع نیست." }
  ],
  total_estimated_cost: "بسته به برند انتخابی متغیر است",
  important_notes: "قبل از مصرف هرگونه مکمل، از نداشتن منع مصرف پزشکی اطمینان حاصل کنید.",
  warnings: "این توصیه عمومی است و جایگزین مشاوره با پزشک نیست."
};

export const SAMPLE_PROFILE: any = {
  id: 'sample-profile',
  name: 'کاربر نمونه',
  age: 30,
  gender: 'male',
  height: 175,
  weight: 80,
  targetWeight: 75,
  primaryGoal: 'hypertrophy',
  experience: 'intermediate',
  trainingDays: 3,
  sessionDuration: 60,
  location: 'gym',
  equipmentType: 'full_gym',
  programType: 'split',
  targetMuscles: ['سینه', 'پشت', 'چهارسر ران'],
  mealsPerDay: 3,
  dietaryGoal: 'fat_loss',
  equipment: [],
  customEquipment: [],
  injuries: [],
  avoidedExercises: [],
  limitations: [],
  preferredExercises: [],
  strengthRecords: {},
  bodyMeasurements: {},
  favoriteFoods: [],
  dislikedFoods: [],
  foodAllergies: [],
  healthConditions: [],
  currentSupplements: [],
};
