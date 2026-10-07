# 🎨 Fito Design System

> **نسخه**: v1.3.0
> **آخرین به‌روزرسانی**: 2026-10-07
> **فایل مرکزی**: `src/styles/designTokens.ts`

---

## 📋 فهرست

- [فلسفه طراحی](#-فلسفه-طراحی)
- [رنگ‌ها](#-رنگ‌ها)
- [تایپوگرافی](#-تایپوگرافی)
- [فاصله‌گذاری](#-فاصله‌گذاری)
- [گوشه‌ها](#-گوشه‌ها)
- [سایه‌ها](#-سایه‌ها)
- [انیمیشن‌ها](#-انیمیشن‌ها)
- [کامپوننت‌های UI](#-کامپوننت‌های-ui)
- [دسترسی‌پذیری](#-دسترسی‌پذیری)
- [الگوهای استفاده](#-الگوهای-استفاده)

---

## 🎯 فلسفه طراحی

**Fito Design System** بر سه اصل بنا شده:

1. **وضوح (Clarity)**: هر عنصر باید هدف مشخصی داشته باشد
2. **دسترسی‌پذیری (Accessibility)**: برای همه، بدون توجه به توانایی
3. **کارایی (Performance)**: انیمیشن‌های روان، بدون افت FPS

**ویژگی‌های کلیدی:**
- RTL کامل (فارسی)
- تم تاریک + روشن
- Glassmorphism
- Mobile-First
- Responsive

---

## 🎨 رنگ‌ها

### تم تاریک (Dark Theme)

| نقش | مقدار | کاربرد |
|---|---|---|
| bg | #0f172a | پس‌زمینه اصلی |
| surface | #1e1b4b | کارت‌ها |
| surfaceElevated | #292554 | کارت‌های برجسته |
| border | rgba(255,255,255,0.1) | حاشیه‌ها |
| textMain | #ffffff | متن اصلی |
| textSub | #94a3b8 | متن فرعی |
| accent | #a78bfa | رنگ برند (بنفش) |
| accentSoft | rgba(167,139,250,0.16) | Accent شفاف |
| gold | #d4af37 | طلایی (CTA) |
| success | #34d399 | موفقیت |
| warning | #fbbf24 | هشدار |
| danger | #f87171 | خطا |
| info | #60a5fa | اطلاعات |

### تم روشن (Light Theme)

| نقش | مقدار | کاربرد |
|---|---|---|
| bg | #f8fafc | پس‌زمینه اصلی |
| surface | #ffffff | کارت‌ها |
| surfaceElevated | #f5f3ff | کارت‌های برجسته |
| border | rgba(139,92,246,0.2) | حاشیه‌ها |
| textMain | #0f172a | متن اصلی |
| textSub | #64748b | متن فرعی |
| accent | #8b5cf6 | رنگ برند |
| accentSoft | rgba(139,92,246,0.1) | Accent شفاف |
| gold | #f59e0b | کهربایی |
| success | #16a34a | سبز |
| warning | #d97706 | نارنجی |
| danger | #dc2626 | قرمز |
| info | #2563eb | آبی |

---

## ✍️ تایپوگرافی

### فونت

- **فونت اصلی**: Vazirmatn
- **Fallback**: sans-serif
- **وزن‌ها**: 400, 500, 600, 700, 800, 900

### مقیاس پیشنهادی

| نقش | کلاس | اندازه | وزن |
|---|---|---|---|
| Hero | text-3xl font-black | 30px | 900 |
| H1 | text-2xl font-black | 24px | 900 |
| H2 | text-xl font-bold | 20px | 700 |
| H3 | text-lg font-bold | 18px | 700 |
| Body | text-sm | 14px | 500 |
| Caption | text-xs | 12px | 600 |
| Tiny | text-[10px] | 10px | 700 |

### اصول RTL

- dir="rtl" روی body
- text-align: right برای inputها
- letter-spacing: normal
- -webkit-font-smoothing: antialiased

---

## 📏 فاصله‌گذاری

از مقیاس Tailwind استفاده می‌کنیم:

| کلاس | مقدار | کاربرد |
|---|---|---|
| gap-1 | 4px | فاصله داخلی کوچک |
| gap-2 | 8px | فاصله بین آیکون و متن |
| gap-3 | 12px | فاصله بین کارت‌ها |
| gap-4 | 16px | فاصله بخش‌ها |
| gap-6 | 24px | فاصله بین بلوک‌ها |
| p-4 | 16px | padding کارت |
| p-5 | 20px | padding modal |
| px-3 py-2 | 12x8 | دکمه sm |
| px-4 py-2.5 | 16x10 | دکمه md |
| px-6 py-3.5 | 24x14 | دکمه lg |

---

## 🔘 گوشه‌ها

| کلاس | مقدار | کاربرد |
|---|---|---|
| rounded-lg | 8px | دکمه‌های کوچک |
| rounded-xl | 12px | دکمه‌ها، inputها |
| rounded-2xl | 16px | کارت‌ها، modalها |
| rounded-full | 9999px | Badge، Switch |

---

## 🌑 سایه‌ها

| کلاس | کاربرد |
|---|---|
| بدون سایه | کارت معمولی |
| shadow-sm | تب فعال |
| shadow-md | Switch thumb |
| shadow-lg | Card elevated، Toast |

---

## 🎬 انیمیشن‌ها

### کلاس‌های آماده

| کلاس | توضیح |
|---|---|
| animate-slide-up | از پایین به بالا |
| animate-fade-in | محو شدن |
| animate-pulse-gold | پالس طلایی |
| timer-animate | پالس تایمر |
| chart-animate | ورود نمودار |
| card-enter | ورود کارت (bounce) |
| btn-animate | فشار دکمه |

### دسترسی‌پذیری (مهم!)

هر انیمیشن جدید باید در حالت prefers-reduced-motion غیرفعال شود.

---

## 🧩 کامپوننت‌های UI

### لیست کامل

| کامپوننت | مسیر | کاربرد |
|---|---|---|
| Card | src/components/ui/Card.tsx | کارت پایه (4 variant) |
| PrimaryButton | src/components/ui/PrimaryButton.tsx | دکمه (6 variant) |
| Badge | src/components/ui/Badge.tsx | برچسب (7 رنگ) |
| Input | src/components/ui/Input.tsx | فیلد متنی |
| Modal | src/components/ui/Modal.tsx | دیالوگ |
| Toast | src/components/ui/Toast.tsx | نوتیفیکیشن |
| Tabs | src/components/ui/Tabs.tsx | تب |
| ProgressBar | src/components/ui/ProgressBar.tsx | نوار پیشرفت |
| Switch | src/components/ui/Switch.tsx | سوییچ |
| Slider | src/components/ui/Slider.tsx | اسلایدر |
| EmptyState | src/components/ui/EmptyState.tsx | حالت خالی |
| LoadingSkeleton | src/components/ui/LoadingSkeleton.tsx | لودینگ |
| SectionHeader | src/components/ui/SectionHeader.tsx | سرتیتر بخش |

### Card — 4 variant

- default: کارت ساده
- elevated: کارت با سایه
- soft: کارت با accentSoft
- glass: کارت شیشه‌ای (backdrop-blur)

### PrimaryButton — 6 variant

- accent: اقدام اصلی
- gold: CTA طلایی
- danger: حذف
- success: تایید
- outline: حاشیه‌دار
- ghost: شفاف

### Badge — 7 رنگ

success, warning, danger, info, neutral, priority, accessory

---

## ♿ دسترسی‌پذیری

### چک‌لیست

- min-h-[44px] برای همه دکمه‌های لمسی
- aria-label برای آیکون‌های بدون متن
- aria-checked برای Switch
- aria-selected برای Tabs
- aria-modal برای Modal
- role="progressbar" برای ProgressBar
- role="alert" برای Toast
- prefers-reduced-motion در CSS
- کنتراست رنگ >= 4.5:1

---

## 🎯 الگوهای استفاده

### 1. کارت با محتوای مخصوص

- از Card variant="elevated" استفاده کن
- عنوان با text-lg font-bold
- محتوا با text-sm

### 2. فرم کامل

- از Input با label و error
- از PrimaryButton variant="accent" fullWidth

### 3. دیالوگ تایید

- از Modal + دو PrimaryButton (outline + danger)
- متن تایید واضح

---

## 📚 منابع

- **Design Tokens**: src/styles/designTokens.ts
- **CSS اصلی**: src/index.css
- **کامپوننت‌ها**: src/components/ui/
- **ThemeContext**: src/context/ThemeContext.tsx

---

## 🔄 تاریخچه

| نسخه | تاریخ | تغییرات |
|---|---|---|
| 1.3.0 | 2026-10-07 | مستندسازی کامل + حذف themeColors.ts |
| 1.3.0 | 2026-10-04 | Design System جدید (navy + purple) |

---

<div align="center">

**Made with ❤️ for the Iranian bodybuilding community**

</div>
