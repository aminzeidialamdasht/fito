# 🎯 Profile Design — Fito

> نسخه: 1.0.0
> آخرین به‌روزرسانی: 2026-10-08
> هدف: طراحی علمی پروفایل بر اساس نیازهای واقعی موتور

---

## 🎯 اصل طراحی

**هر فیلدی که در پروفایل هست، باید در موتور استفاده بشه.**
**هر فیلدی که در موتور استفاده می‌شه، باید در پروفایل باشه.**

---

## 📊 نقشه‌برداری فعلی (2026-10-08)

### ✅ فیلدهای استفاده‌شده در موتور (۲۴ فیلد)

| فیلد | استفاده در موتور |
|---|---|
| id | همه |
| name | exerciseSelector, injurySafetyEngine, programValidator, workoutGenerator |
| age | trainingDaysCalculator |
| height | profileAnalyzer |
| weight | performanceAnalyzer, profileAnalyzer, progressionEngine |
| activityLevel | profileAnalyzer |
| experience | exerciseSelector, profileAnalyzer, programValidator, progressionEngine, systemSelector, trainingDaysCalculator, workoutGenerator |
| trainingDays | profileAnalyzer |
| sessionDuration | profileAnalyzer, programValidator, trainingDaysCalculator |
| equipmentType | exerciseSelector, profileAnalyzer, profileToEquipment |
| customEquipment | exerciseSelector, profileAnalyzer |
| equipment | exerciseSelector, profileToEquipment, substitutionEngine |
| injuries | profileAnalyzer, profileToEquipment, programValidator |
| limitations | profileAnalyzer |
| avoidedExercises | exerciseSelector, profileAnalyzer, profileToEquipment |
| primaryGoal | profileAnalyzer, trainingDaysCalculator |
| secondaryGoal | profileAnalyzer, workoutGenerator |
| targetMuscles | profileAnalyzer |
| timeline | profileAnalyzer |
| strengthRecords | performanceAnalyzer, progressionEngine |
| strengthRecordsExtended | progressionEngine |
| bodyMeasurements | profileAnalyzer, systemSelector |
| sleepHours | trainingDaysCalculator |
| recoveryQuality | trainingDaysCalculator |

### ❌ فیلدهای بی‌استفاده (۲۶ فیلد)

#### گروه ۱: تغذیه (۸ فیلد) — برای موتور تغذیه
- dietaryGoal
- dietType
- foodAllergies
- favoriteFoods
- dislikedFoods
- mealsPerDay
- calorieTarget
- cookingSkill

#### گروه ۲: مکمل (۳ فیلد) — برای موتور مکمل
- supplementGoal
- currentSupplements
- supplementBudget

#### گروه ۳: باید به موتور تمرین اضافه شن (۱۱ فیلد)
- gender → profileAnalyzer (BMR)
- targetWeight → profileAnalyzer (هدف)
- location → exerciseSelector (نوع تمرین)
- trainingHistory → profileAnalyzer (سطح واقعی)
- healthConditions → injurySafetyEngine
- bodyFatPercent → profileAnalyzer
- bodyComposition → profileAnalyzer
- jobStress → trainingDaysCalculator
- workShift → trainingDaysCalculator
- competitionDate → splitSelector
- hormoneMedNotes → injurySafetyEngine

#### گروه ۴: واقعاً بی‌استفاده (۴ فیلد) — حذف
- programType → موتور خودش انتخاب می‌کنه
- preferredExercises → تکراری با exercisePreferences
- injuryDetails → در injurySafetyEngine استفاده نمی‌شه
- exercisePreferences → باید در exerciseSelector اضافه شه

---

## 🏗️ ساختار جدید پیشنهادی

### AthleteProfile (اصلی)

| گروه | فیلدها |
|---|---|
| اطلاعات پایه | id, name, age, gender, height, weight, targetWeight |
| سطح و تجربه | experience, trainingHistory, strengthRecords, strengthRecordsExtended |
| هدف | primaryGoal, secondaryGoal, targetMuscles, timeline, competitionDate |
| تمرین | trainingDays, sessionDuration, location, equipmentType, customEquipment, equipment |
| سلامت | injuries, limitations, avoidedExercises, healthConditions, injuryDetails, hormoneMedNotes |
| آنالیز بدن | bodyMeasurements, bodyFatPercent, bodyComposition |
| ریکاوری | sleepHours, recoveryQuality, jobStress, workShift |
| ترجیحات | exercisePreferences |
| زیر-پروفایل | nutrition?, supplement? |
| متادیتا | createdAt, updatedAt |

### NutritionProfile (جدید)

- dietaryGoal
- dietType
- foodAllergies
- favoriteFoods
- dislikedFoods
- mealsPerDay
- calorieTarget
- cookingSkill

### SupplementProfile (جدید)

- supplementGoal
- currentSupplements
- supplementBudget

---

## 🎯 فازهای اجرا

### فاز ۱: جدا کردن تغذیه و مکمل
- حذف ۱۱ فیلد از `AthleteProfile`
- اضافه کردن `nutrition?` و `supplement?`
- رفع خطاها در `Nutrition.tsx`, `Supplements.tsx`, `NutritionImport.tsx`, `SupplementImport.tsx`

### فاز ۲: اضافه کردن ۱۱ فیلد به موتور
- `gender`, `targetWeight` → `profileAnalyzer.ts`
- `location` → `exerciseSelector.ts`
- `trainingHistory` → `profileAnalyzer.ts`
- `healthConditions`, `hormoneMedNotes` → `injurySafetyEngine.ts`
- `bodyFatPercent`, `bodyComposition` → `profileAnalyzer.ts`
- `jobStress`, `workShift` → `trainingDaysCalculator.ts`
- `competitionDate` → `splitSelector.ts`

### فاز ۳: بازطراحی UI پروفایل
- ۸ گروه منطقی
- توضیح برای هر فیلد ("چرا پرسیده می‌شه")
- Tooltip ("چطور استفاده می‌شه")

### فاز ۴: Backend Validation
- `profileValidator.ts` جدید
- چک همه فیلدهای لازم
- چک تناقض‌ها

### فاز ۵: تست + تگ `v2.0.0`
- تست با ۱۰ پروفایل مختلف
- تگ نسخه جدید

---

## 📚 مراجع علمی

- **Schoenfeld, B. J.** (2016). Science and Development of Muscle Hypertrophy
- **Helms, E. R.** (2014). The Muscle and Strength Pyramid
- **Israetel, M.** (2018). Scientific Principles of Strength Training
- **ACSM** Guidelines for Exercise Testing and Prescription

---

## 📝 تاریخچه تغییرات

| تاریخ | نسخه | تغییرات |
|---|---|---|
| 2026-10-08 | 1.0.0 | نقشه‌برداری اولیه + ساختار پیشنهادی |
