/**
 * تایپ‌های Billing و Subscription
 */

export interface Product {
  sku: string;
  title: string;
  price: string;
  description?: string;
  type: string;
}

export interface Purchase {
  purchaseToken: string;
  sku: string;
  purchaseTime: number;
  payload?: string;
  signature?: string;
}

export interface SubscriptionState {
  /** زمان شروع trial (اولین بار که کاربر اپ را باز کرد) */
  trialStartedAt: number | null;

  /** آیا کاربر اشتراک فعال دارد */
  isSubscribed: boolean;

  /** SKU اشتراک فعلی (اگر دارد) */
  subscriptionSku: string | null;

  /** زمان انقضای اشتراک (null = مادام‌العمر) */
  subscriptionExpiresAt: number | null;

  /** آخرین بار که وضعیت بررسی شد */
  lastCheckAt: number | null;

  /** purchase token (برای validation) */
  purchaseToken?: string;
}

/**
 * مدت Trial
 */
export const TRIAL_DAYS = 30;
export const TRIAL_MS = TRIAL_DAYS * 24 * 60 * 60 * 1000;

/**
 * مدت هر پلن (میلی‌ثانیه)
 */
export const PLAN_DURATIONS = {
  monthly: 30 * 24 * 60 * 60 * 1000,
  yearly: 365 * 24 * 60 * 60 * 1000,
  lifetime: null, // مادام‌العمر
} as const;
