# 🎨 Profile UI Design — Fito

> نسخه: 1.0.0
> آخرین به‌روزرسانی: 2026-10-08
> هدف: طراحی UI پروفایل بر اساس فیلدهای استفاده‌شده در موتور

---

## 🎯 اصل طراحی

**هر فیلد با توضیح "چرا پرسیده می‌شه" نمایش داده بشه.**
**هر فیلد در موتور استفاده بشه.**
**هیچ فیلد بی‌استفاده‌ای در UI نباشه.**

---

## 📊 ساختار جدید (۳ step)

### 🟣 Step 1: مشخصات پایه (basic)

**هدف**: اطلاعات پایه برای محاسبه BMR، TDEE، BMI و سطح تجربه

| فیلد | کاربرد در موتور | توضیح برای کاربر |
|---|---|---|
| نام | — | شناسه |
| سن | trainingDaysCalculator, profileAnalyzer | تعیین حجم و ریکاوری |
| جنسیت | profileAnalyzer | محاسبه BMR |
| قد | profileAnalyzer | BMI |
| وزن فعلی | profileAnalyzer, progressionEngine | BMR، TDEE |
| وزن هدف | profileAnalyzer | تعیین هدف |
| سطح فعالیت | profileAnalyzer | TDEE |
| سطح تجربه | profileAnalyzer, splitSelector | نوع اسپلیت |
| سابقه تمرینی | profileAnalyzer | سطح واقعی |

---

### 🟢 Step 2: اطلاعات بدنی و سلامت (body)

**هدف**: اطلاعات برای انتخاب حرکات ایمن و برنامه دقیق

| فیلد | کاربرد در موتور | توضیح برای کاربر |
|---|---|---|
| اندازه‌ها (۱۱ فیلد) | profileAnalyzer, systemSelector | نسبت‌های بدن |
| درصد چربی | profileAnalyzer | تعیین سطح دقیق |
| تیپ بدنی | profileAnalyzer | سرعت متابولیسم |
| آسیب‌ها | profileAnalyzer, injurySafetyEngine | حرکات ایمن |
| محدودیت‌ها | profileAnalyzer | حرکات جایگزین |
| تمرینات ممنوع | exerciseSelector | جایگزینی |
| شرایط پزشکی | injurySafetyEngine | حرکات ایمن |
| جزئیات آسیب | injurySafetyEngine | دقیق‌تر |
| یادداشت دارو/هورمون | injurySafetyEngine | ریکاوری |

---

### 🔵 Step 3: تمرین و ریکاوری (training)

**هدف**: اطلاعات برای طراحی برنامه تمرینی و تنظیم حجم

| فیلد | کاربرد در موتور | توضیح برای کاربر |
|---|---|---|
| هدف اصلی | profileAnalyzer, splitSelector | نوع برنامه |
| هدف دوم | profileAnalyzer | تکمیل هدف |
| عضلات اولویت‌دار | profileAnalyzer | حجم بیشتر |
| مدت برنامه | profileAnalyzer | دوره |
| روزهای تمرین | trainingDaysCalculator | تعیین بازه |
| مدت جلسه | trainingDaysCalculator | حجم |
| محل تمرین | exerciseSelector | نوع حرکات |
| نوع تجهیزات | exerciseSelector | حرکات قابل انجام |
| تجهیزات سفارشی | exerciseSelector | حرکات خاص |
| تجهیزات در دسترس | exerciseSelector | حرکات قابل انجام |
| ساعت خواب | trainingDaysCalculator | ریکاوری |
| کیفیت ریکاوری | trainingDaysCalculator | حجم |
| استرس کاری | trainingDaysCalculator | حجم |
| شیفت کاری | trainingDaysCalculator | زمان تمرین |
| ترجیحات تمرینی | exerciseSelector | حرکات دلخواه |

---

## 🎯 مراحل بازطراحی

### مرحله ۱: افزودن فیلدهای گم‌شده به stepها
- Step 1: `experience`, `trainingHistory`
- Step 2: `healthConditions`, `injuryDetails`, `hormoneMedNotes`
- Step 3: `secondaryGoal`, `equipmentType`, `customEquipment`, `equipment`, `sleepHours`, `recoveryQuality`, `jobStress`, `workShift`, `exercisePreferences`

### مرحله ۲: بهبود UI
- هر فیلد با tooltip "چرا پرسیده می‌شه"
- گروه‌بندی منطقی
- طراحی کارت‌محور

### مرحله ۳: بازطراحی Profile.tsx
- نمایش حرفه‌ای
- دسترسی به ویرایش

---

## 📚 مراجع علمی

- Schoenfeld, Helms, Israetel
- ACSM Guidelines
