# UI/UX Redesign – Scientific Premium Edition

**Branch:** `feature/ui-ux-redesign-scientific`  
**Status:** In Progress

## هدف
بازطراحی کامل رابط کاربری فیتو با تمرکز روی:
- ظاهر پرمیوم و حرفه‌ای
- نمایش علمی‌تر داده‌ها (Volume Landmarks, Stimulus, Safety Score)
- تجربه کاربری تمیزتر و سلسله‌مراتب بصری قوی‌تر
- سازگاری کامل با RTL و فونت Vazirmatn

## تغییرات انجام‌شده تا این لحظه

### 1. Design Tokens (`src/styles/designTokens.ts`)
- پالت رنگی جدید و تیره‌تر برای حس premium
- اضافه شدن `textMuted`, `accentStrong`, `goldSoft`, `successSoft`
- توکن‌های تخصصی: `volume`, `intensity`, `recovery`

### 2. Bottom Navigation (`src/components/BottomNav.tsx`)
- دکمه مرکزی برجسته «تولید» با گرادیان بنفش
- طراحی glass + blur
- ۵ تب: داشبورد · برنامه‌ها · تولید · پیشرفت · پروفایل

### 3. کامپوننت‌های جدید علمی
- `VolumeLandmarkCard` – نمایش MV / MEV / MAV / MRV با نشانگر حجم فعلی
- `StimulusMeter` – متر دایره‌ای محرک عضلانی + RIR
- `SafetyScoreCard` – امتیاز ایمنی + سطح ریسک + یادداشت‌ها

### 4. بهبود کامپوننت‌های پایه
- `Card` – variantهای بهتر (elevated, soft, glass, outline) + padding کنترل‌شده
- `PrimaryButton` – کنتراست بهتر و پشتیبانی از `accentStrong`

## مراحل بعدی پیشنهادی
1. بازطراحی کامل صفحه Dashboard با استفاده از کامپوننت‌های جدید
2. یکپارچه‌سازی VolumeLandmark و SafetyScore در ProgramDetail
3. بهبود WorkoutTracker با StimulusMeter و Progressive Overload indicators
4. به‌روزرسانی Layout و حذف ناوبری تکراری
5. تست کامل روی Android (dark/light)

## نحوه تست
```bash
git checkout feature/ui-ux-redesign-scientific
npm install
npm run dev
```

---
ساخته‌شده با ❤️ برای جامعه بدنسازی ایران
