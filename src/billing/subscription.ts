import type { SubscriptionState, Purchase } from './types';
import { TRIAL_MS, PLAN_DURATIONS } from './types';
import { SUBSCRIPTION_SKUS } from './billingConfig';

const STORAGE_KEY = 'fito_subscription_state_v1';

/**
 * بارگذاری وضعیت اشتراک از localStorage
 */
export function loadSubscriptionState(): SubscriptionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const state = JSON.parse(raw) as SubscriptionState;
      // اگر trial هنوز شروع نشده، الان شروع کن
      if (!state.trialStartedAt) {
        state.trialStartedAt = Date.now();
      }
      return state;
    }
  } catch (e) {
    console.warn('Failed to load subscription state:', e);
  }

  // اولین بار — شروع trial
  return {
    trialStartedAt: Date.now(),
    isSubscribed: false,
    subscriptionSku: null,
    subscriptionExpiresAt: null,
    lastCheckAt: null,
  };
}

/**
 * ذخیره وضعیت اشتراک
 */
export function saveSubscriptionState(state: SubscriptionState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save subscription state:', e);
  }
}

/**
 * آیا trial فعال است؟
 */
export function isTrialActive(state: SubscriptionState): boolean {
  if (state.isSubscribed) return true;
  if (!state.trialStartedAt) return false;
  return Date.now() - state.trialStartedAt < TRIAL_MS;
}

/**
 * آیا اشتراک فعال است؟
 */
export function isSubscriptionActive(state: SubscriptionState): boolean {
  if (!state.isSubscribed) return false;
  // مادام‌العمر
  if (state.subscriptionExpiresAt === null) return true;
  // زمان‌دار
  return Date.now() < state.subscriptionExpiresAt;
}

/**
 * روزهای باقی‌مانده از trial
 */
export function getRemainingTrialDays(state: SubscriptionState): number {
  if (!state.trialStartedAt) return 0;
  const elapsed = Date.now() - state.trialStartedAt;
  const remaining = TRIAL_MS - elapsed;
  return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
}

/**
 * دسترسی به برنامه تمرینی
 */
export function canAccessWorkout(state: SubscriptionState): boolean {
  return isTrialActive(state) || isSubscriptionActive(state);
}

/**
 * دسترسی به برنامه تغذیه — نیاز به اشتراک از ابتدا
 */
export function canAccessNutrition(state: SubscriptionState): boolean {
  return isSubscriptionActive(state);
}

/**
 * دسترسی به برنامه مکمل — نیاز به اشتراک از ابتدا
 */
export function canAccessSupplement(state: SubscriptionState): boolean {
  return isSubscriptionActive(state);
}

/**
 * دسترسی به برنامه فشرده
 */
export function canAccessCompact(state: SubscriptionState): boolean {
  return isTrialActive(state) || isSubscriptionActive(state);
}

/**
 * محاسبه تاریخ انقضا بر اساس SKU
 */
export function computeExpiration(sku: string): number | null {
  const now = Date.now();
  if (sku === SUBSCRIPTION_SKUS.monthly) return now + PLAN_DURATIONS.monthly;
  if (sku === SUBSCRIPTION_SKUS.yearly) return now + PLAN_DURATIONS.yearly;
  if (sku === SUBSCRIPTION_SKUS.lifetime) return null;
  return null;
}

/**
 * اعمال خرید موفق روی state
 */
export function applyPurchase(
  state: SubscriptionState,
  purchase: Purchase
): SubscriptionState {
  return {
    ...state,
    isSubscribed: true,
    subscriptionSku: purchase.sku,
    subscriptionExpiresAt: computeExpiration(purchase.sku),
    lastCheckAt: Date.now(),
    purchaseToken: purchase.purchaseToken,
  };
}

/**
 * بازگردانی اشتراک (لغو)
 */
export function clearSubscription(state: SubscriptionState): SubscriptionState {
  return {
    ...state,
    isSubscribed: false,
    subscriptionSku: null,
    subscriptionExpiresAt: null,
    purchaseToken: undefined,
  };
}


/**
 * محدودیت‌های مدل 4:
 * - کاربر رایگان: فقط ۱ برنامه + ۱ پروفایل
 * - بعد از اشتراک: نامحدود
 */
export const FREE_LIMITS = {
  programs: 1,
  profiles: 1,
} as const;

/**
 * آیا کاربر می‌تواند برنامه جدید بسازد؟
 */
export function canCreateProgram(
  state: SubscriptionState,
  currentProgramCount: number
): boolean {
  // اگر اشتراک فعال دارد، نامحدود
  if (isSubscriptionActive(state)) return true;
  // اگر trial فعال نیست، نه
  if (!isTrialActive(state)) return false;
  // در trial، فقط FREE_LIMITS.programs مجاز
  return currentProgramCount < FREE_LIMITS.programs;
}

/**
 * آیا کاربر می‌تواند پروفایل جدید بسازد؟
 */
export function canCreateProfile(
  state: SubscriptionState,
  currentProfileCount: number
): boolean {
  // اگر اشتراک فعال دارد، نامحدود
  if (isSubscriptionActive(state)) return true;
  // اگر trial فعال نیست، نه
  if (!isTrialActive(state)) return false;
  // در trial، فقط FREE_LIMITS.profiles مجاز
  return currentProfileCount < FREE_LIMITS.profiles;
}

/**
 * اطلاعات محدودیت برای نمایش
 */
export function getRemainingFree(
  state: SubscriptionState,
  programCount: number,
  profileCount: number
) {
  const unlimited = isSubscriptionActive(state);
  return {
    unlimited,
    programRemaining: unlimited
      ? Infinity
      : Math.max(0, FREE_LIMITS.programs - programCount),
    profileRemaining: unlimited
      ? Infinity
      : Math.max(0, FREE_LIMITS.profiles - profileCount),
  };
}
