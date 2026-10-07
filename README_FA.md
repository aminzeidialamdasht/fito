# 🏋️ فیتو | Fito — دستیار هوشمند بدنسازی آفلاین

<div align="center">

![Version](https://img.shields.io/badge/version-1.3.0-D4AF37?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-Android-14B8A6?style=for-the-badge)
![Min Android](https://img.shields.io/badge/min%20android-7.0-0D9488?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-22C55E?style=for-the-badge)
![Flavors](https://img.shields.io/badge/flavors-myket%20%7C%20bazaar%20%7C%20personal-8B5CF6?style=for-the-badge)

**دستیار هوشمند بدنسازی کاملاً آفلاین**
**AI-Powered Offline Fitness Coach**

*یک اپلیکیشن حرفه‌ای برای مربیان و ورزشکاران*

[📥 دانلود APK](../../releases) • [📖 مستندات](#-مستندات) • [🇬🇧 English](README.md)

</div>

---

## 🎯 معرفی

**فیتو (Fito)** یک اپلیکیشن حرفه‌ای بدنسازی با موتور تمرینی **کاملاً آفلاین و علمی** است که برنامه‌های تمرینی شخصی‌سازی‌شده برای ورزشکاران تولید می‌کند.

برخلاف نسخه‌های قبلی که به AI آنلاین وابسته بودند، **فیتو نسخه ۱.۳.۰** کاملاً آفلاین کار می‌کند و از **۱۶ ماژول موتور تمرینی** بر پایه تحقیقات Schoenfeld، Helms و Israetel استفاده می‌کند.

---

## ✨ ویژگی‌ها

### 🧠 موتور آفلاین
- **۱۶ ماژول علمی**: profileAnalyzer، splitSelector، volumeAllocator، progressionEngine، deloadEngine، injurySafetyEngine، substitutionEngine و...
- **دیتابیس ۵۸ حرکت** در ۶ گروه عضلانی
- **بدون نیاز به اینترنت**
- **Auto-Regeneration**: بازتولید خودکار برنامه بر اساس هفته جاری (نسخه ۱.۳.۰)
- **Periodization + Deload**: پریودیزیشن و هفته‌های استراحت خودکار
- **Injury Safety Engine**: موتور ایمنی آسیب‌دیدگی

### 📅 سیستم هفته‌محور (نسخه ۱.۳.۰)
- **Week Calculator**: محاسبه‌گر پیشرفته هفته تمرینی
- **Auto-Regeneration**: تطبیق خودکار برنامه با هفته جاری
- **Week Indicator**: نمایشگر هفته در ProgramDetail
- **Progressive Overload**: اضافه‌بار تدریجی خودکار

### 🤖 تولید پرامپت AI
- **تولید پرامپت علمی** برای ChatGPT، Gemini، Claude
- **خروجی JSON** برای همه مدل‌ها
- **Import**: وارد کردن برنامه تولیدشده توسط AI

### 👥 مدیریت چند پروفایل
- پروفایل‌های نامحدود برای هر شاگرد
- سوئیچ سریع بین پروفایل‌ها
- داده‌های کاملاً مجزا

### 🏋️ ردیاب تمرین حرفه‌ای
- **TodaySession**: نمایش خودکار تمرین روز
- **Rest Timer**: تایمر استراحت خودکار
- **WorkoutTracker**: ردیاب زنده با ثبت وزن/تکرار
- **SessionPreview**: پیش‌نمایش قبل از شروع
- **StrengthRecords**: ثبت رکوردهای قدرتی

### 📊 داشبورد حرفه‌ای
- **DashboardHero**: کارت هیرو با پیشرفت هفتگی
- **آمار کامل**: جلسات، حجم، استریک، هدف هفتگی
- **نمودار وزن** و **رادار عضلانی**
- **SafetyReportCard**: گزارش ایمنی تمرین

### 🥗 تغذیه و مکمل
- **Nutrition**: مدیریت تغذیه
- **NutritionImport**: ورود داده‌های تغذیه
- **Supplements**: مدیریت مکمل‌ها
- **SupplementImport**: ورود مکمل‌ها

### 💳 سیستم اشتراک (نسخه ۱.۲+)
- **۳ پلن**: ماهانه / سالانه / مادام‌العمر
- **۳ فروشگاه**: کافه‌بازار، مایکت، نسخه شخصی
- **Trial ۳۰ روزه** رایگان
- **PremiumGate**: مدیریت دسترسی ویژه

### 🎨 طراحی حرفه‌ای
- **تم تاریک**: سرمه‌ای + بنفش (#0f172a + #a78bfa)
- **تم روشن**: سفید + بنفش (#f8fafc + #8b5cf6)
- **Glassmorphism Cards**: کارت‌های شیشه‌ای
- **Framer Motion**: انیمیشن‌های روان
- **RTL کامل** + **فونت Vazirmatn**

---

## 📥 دانلود

| فروشگاه | Flavor | لینک |
|---|---|---|
| **GitHub Releases** | myket / personal | [Releases](../../releases) |
| **کافه‌بازار** | bazaar | به‌زودی |
| **مایکت** | myket | به‌زودی |

### آخرین نسخه: **v1.3.0**
- VersionCode: 10300
- App ID: com.fito.app
- حجم APK: ~۱۵ MB

---

## 🛠 ساخت از سورس

### پیش‌نیازها
- Node.js 18+
- npm 9+
- Java JDK 21
- Android Studio (برای build محلی)

### ساخت برای فروشگاه‌های مختلف

    # Clone
    git clone https://github.com/aminzeidialamdasht/fito.git
    cd fito

    # نصب وابستگی‌ها
    npm install

    # ساخت برای مایکت
    npm run android:myket
    cd android && ./gradlew assembleRelease

    # ساخت برای کافه‌بازار
    npm run android:bazaar
    cd android && ./gradlew assembleRelease

    # ساخت نسخه شخصی
    npm run android:personal
    cd android && ./gradlew assembleRelease

### محل APK

    android/app/build/outputs/apk/release/app-release.apk

---

## 🚀 فرآیند انتشار

این پروژه از **GitHub Actions** برای ساخت خودکار APK استفاده می‌کند:

    # ۱. ایجاد tag برای مایکت و شخصی
    git tag v1.3.1-myket
    git tag v1.3.1-personal
    git push origin v1.3.1-myket v1.3.1-personal

    # ۲. GitHub Actions به‌صورت خودکار APK می‌سازد
    # ۳. Release ایجاد می‌شود و APK ضمیمه می‌شود

**نکته مهم**: نسخه از **git tag** خوانده می‌شود، نه از package.json (به vite.config.js نگاه کنید).

---

## 🏗 تکنولوژی‌ها

### Frontend
- **React 18** + **TypeScript 5.7**
- **Vite 6.3.5** — Build tool
- **Tailwind CSS 4.1.7** — Styling
- **Framer Motion 11** — انیمیشن‌ها
- **React Router 6** — ناوبری
- **Recharts 2.10** — نمودارها
- **Lucide React** — آیکون‌ها
- **jalaali-js** — تقویم شمسی
- **@dnd-kit** — Drag & Drop
- **canvas-confetti** — افکت‌ها

### Backend & Services
- **Supabase 2.98** — همگام‌سازی ابری (آینده)

### Billing (پرداخت)
- **@salarizadi/capacitor-cafebazaar-poolakey** — کافه‌بازار
- **@salarizadi/capacitor-myket** — مایکت

### Android
- **Capacitor 8.5.2** — Native bridge
- **Kotlin** — کد نیتیو
- **Material Design 3** — UI
- **Android SDK 34** — Target
- **Min SDK 24** (Android 7.0)

### Build & CI/CD
- **GitHub Actions** — بیلد خودکار
- **Gradle 8.13**
- **Java 21**

---

## 📊 اطلاعات فنی

| مورد | مقدار |
|---|---|
| **نسخه فعلی** | v1.3.0 |
| حداقل Android | 7.0 (API 24) |
| هدف Android | 14 (API 34) |
| حجم APK | ~۱۵ MB |
| معماری | Universal |
| زبان | فارسی (RTL) |
| فونت | Vazirmatn |
| App ID | com.fito.app |
| Storage Key | fito_state_v2 |
| نسخه موتور | 1.0.0 |
| تعداد حرکات | ۵۸ |

---

## 🎨 سیستم طراحی

### رنگ‌های واقعی (بر اساس designTokens.ts)

**تم تاریک:**

    bg: #0f172a
    surface: #1e1b4b
    surfaceElevated: #292554
    accent: #a78bfa
    accentSoft: rgba(167,139,250,0.16)
    gold: #d4af37
    success: #34d399
    warning: #fbbf24
    danger: #f87171
    info: #60a5fa

**تم روشن:**

    bg: #f8fafc
    surface: #ffffff
    surfaceElevated: #f5f3ff
    accent: #8b5cf6
    accentSoft: rgba(139,92,246,0.1)
    gold: #f59e0b
    success: #16a34a
    warning: #d97706
    danger: #dc2626
    info: #2563eb

### Design Tokens
- فایل مرکزی: src/styles/designTokens.ts
- تابع: getTokens(isDark) → تمام رنگ‌ها
- فونت: **Vazirmatn** (RTL کامل)

---

## 🤝 مشارکت

مشارکت شما باعث خوشحالی ماست!

### نحوه مشارکت
۱. Fork کنید
۲. Branch جدید بسازید (git checkout -b feature/amazing-feature)
۳. Commit کنید (git commit -m 'Add amazing feature')
۴. Push کنید (git push origin feature/amazing-feature)
۵. Pull Request باز کنید

### گزارش مشکل
- از [Issues](../../issues) استفاده کنید
- توضیح کامل مشکل را بنویسید
- اسکرین‌شات اضافه کنید

---

## 📄 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است.

---

## 📞 ارتباط

- 🐙 GitHub: [@aminzeidialamdasht](https://github.com/aminzeidialamdasht)

---

## 🙏 تشکر

- **Vazirmatn Font** — Saber Rastikerdar
- **Lucide Icons** — Lucide Contributors
- **Capacitor** — Ionic Team
- **React** — Meta
- **Recharts** — Recharts Team
- **Framer Motion** — Framer

---

<div align="center">

**ساخته شده با ❤️ برای جامعه بدنسازی ایران**
**Made with ❤️ for the Iranian bodybuilding community**

⭐ اگر این پروژه برایتان مفید بود، ستاره بدهید!

[⬆ بازگشت به بالا](#-فیتو--fito--دستیار-هوشمند-بدنسازی-آفلاین)

</div>
