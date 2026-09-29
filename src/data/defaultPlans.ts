export const DEFAULT_WORKOUT_PLAN = {
  program_name: "برنامه جامع فیتنس به روش پوش/پول/لگ (سطح متوسط)",
  duration: "۴ هفته",
  days: [
    {
      day: "روز اول: پوش (سینه، سرشانه، پشت بازو)",
      muscle_groups: ["سینه", "سرشانه", "پشت بازو"],
      exercises: [
        { name: "پرس سینه هالتر", sets: 4, reps: "6-8", rest: 180, tempo: "3-1-1-0", notes: "حرکت پایه چندمفصلی؛ کتف‌ها را جمع و فشرده نگه دارید. با وزنه‌ای شروع کنید که در تکرارهای تعیین‌شده فرم حفظ شود." },
        { name: "پرس بالاسینه دمبل", sets: 3, reps: "8-12", rest: 120, tempo: "2-1-1-0", notes: "دامنه حرکت کامل؛ در پایین آرنج کمی پایین‌تر از سطح شانه قرار گیرد. بر انقباض سینه فوقانی تمرکز کنید." },
        { name: "نشر جانب دمبل", sets: 3, reps: "12-15", rest: 90, tempo: "2-0-1-1", notes: "سرشانه میانی؛ آرنج کمی خم، حرکت تا سطح شانه. از تاب دادن بدن خودداری کنید." },
        { name: "پشت بازو سیم‌کش پرس‌داون", sets: 3, reps: "10-15", rest: 90, tempo: "3-1-1-0", notes: "سر سه‌سر؛ آرنج‌ها را ثابت کنار بدن نگه دارید. انقباض کامل در پایین و بازگشت کنترل‌شده." },
        { name: "پشت بازو خوابیده هالتر (اسکال‌کراشر)", sets: 3, reps: "8-12", rest: 90, tempo: "3-1-1-0", notes: "سر سه‌سر بلند؛ آرنج‌ها را به سمت داخل جمع کنید تا فشار از مفصل برداشته شود." }
      ]
    },
    {
      day: "روز دوم: پول (زیربغل، پشت سرشانه، جلوبازو)",
      muscle_groups: ["زیربغل", "پشت سرشانه", "جلوبازو", "ساعد"],
      exercises: [
        { name: "بارفیکس دست باز (یا لت‌پول‌داون)", sets: 4, reps: "6-10", rest: 180, tempo: "3-1-1-0", notes: "حرکت پایه زیربغل؛ از کشیدن با بازو خودداری کنید و حرکت را با عضلات پشت آغاز کنید. در صورت ناتوانی از لت‌پول‌داون استفاده کنید." },
        { name: "زیربغل هالتر خم", sets: 3, reps: "8-12", rest: 150, tempo: "2-1-1-0", notes: "کمر صاف، هالتر را به سمت ناف بکشید. کتف‌ها را در انتهای حرکت فشرده کنید." },
        { name: "فیس‌پول سیم‌کش", sets: 3, reps: "12-15", rest: 90, tempo: "2-1-1-1", notes: "پشت سرشانه و روتاتور کاف؛ طناب را به سمت صورت بکشید و آرنج‌ها را بالا نگه دارید." },
        { name: "جلوبازو دمبل چکشی", sets: 3, reps: "10-12", rest: 90, tempo: "3-1-1-0", notes: "جلوبازو و ساعد؛ مچ‌ها را خنثی نگه دارید. از تاب دادن بدن پرهیز کنید." },
        { name: "جلوبازو لاری سیم‌کش", sets: 3, reps: "10-15", rest: 90, tempo: "3-1-1-0", notes: "جلوبازو؛ آرنج‌ها را روی پد ثابت کنید و دامنه کامل حرکت را رعایت کنید." }
      ]
    },
    {
      day: "روز سوم: لگ (چهارسر، همسترینگ، سرینی، ساق)",
      muscle_groups: ["چهارسر", "همسترینگ", "سرینی", "ساق"],
      exercises: [
        { name: "اسکوات پشت هالتر", sets: 4, reps: "6-8", rest: 240, tempo: "3-1-1-0", notes: "حرکت پایه زانو-غالب؛ تا عمق مناسب پایین بروید، زانوها هم‌راستا با پنجه. کمر صاف." },
        { name: "پرس پا دستگاه", sets: 3, reps: "10-12", rest: 180, tempo: "2-1-1-0", notes: "چهارسر و سرینی؛ پاها به عرض شانه، دامنه کامل بدون قفل کردن زانو در بالا." },
        { name: "ددلیفت رومانیایی هالتر", sets: 4, reps: "8-10", rest: 180, tempo: "3-1-1-0", notes: "حرکت پایه هیپ-غالب؛ هالتر را نزدیک بدن نگه دارید، لگد را به عقب ببرید و همسترینگ را کشش دهید." },
        { name: "جلو پا دستگاه", sets: 3, reps: "12-15", rest: 90, tempo: "2-1-1-0", notes: "چهارسر؛ در بالا انقباض کامل، در پایین بازگشت کنترل‌شده." },
        { name: "پشت پا خوابیده دستگاه", sets: 3, reps: "12-15", rest: 90, tempo: "3-1-1-0", notes: "همسترینگ؛ از حرکت دادن لگن خودداری کنید و فقط زانو را خم کنید." },
        { name: "ساق ایستاده دستگاه", sets: 4, reps: "12-15", rest: 60, tempo: "3-2-1-0", notes: "ساق؛ دامنه کامل، در پایین کشش و در بالا انقباض شدید. از فنر زدن پرهیز کنید." }
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
