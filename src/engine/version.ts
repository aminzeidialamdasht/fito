/**
 * نسخه‌گذاری موتور و دیتابیس‌ها
 *
 * برای آپدیت در آینده:
 * - تغییر MINOR_VERSION: افزودن حرکات/غذاهای جدید
 * - تغییر MAJOR_VERSION: تغییر ساختار دیتابیس
 * - migration: اگر ساختار تغییر کرد
 */

export const ENGINE_VERSION = {
  major: 1,
  minor: 0,
  patch: 0,
  full: '1.0.0',
  releasedAt: '2025-01-01',
};

export const DATABASE_VERSIONS = {
  exercises: {
    version: '1.0.0',
    totalItems: 58,
    lastUpdated: '2025-01-01',
    changelog: [
      'نسخه اولیه با ۵۸ حرکت در ۶ گروه عضلانی',
    ],
  },
  nutrition: {
    version: '0.0.0',  // به‌زودی
    totalItems: 0,
    lastUpdated: null,
    changelog: [],
  },
  supplements: {
    version: '0.0.0',  // به‌زودی
    totalItems: 0,
    lastUpdated: null,
    changelog: [],
  },
};

export const FEATURE_FLAGS = {
  offlineWorkout: true,        // ✅ آماده
  offlineNutrition: false,     // ⏳ به‌زودی
  offlineSupplements: false,   // ⏳ به‌زودی
  compactWorkout: false,       // ⏳ به‌زودی
  aiPrompt: false,             // ❌ حذف شده در نسخه آفلاین
};

/**
 * بررسی امکان استفاده از یک فیچر
 */
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature] === true;
}

/**
 * اطلاعات کامل سیستم
 */
export function getSystemInfo() {
  return {
    engine: ENGINE_VERSION.full,
    databases: {
      exercises: DATABASE_VERSIONS.exercises.version,
      nutrition: DATABASE_VERSIONS.nutrition.version,
      supplements: DATABASE_VERSIONS.supplements.version,
    },
    features: FEATURE_FLAGS,
    totalExercises: DATABASE_VERSIONS.exercises.totalItems,
  };
}
