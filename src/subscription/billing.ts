import { registerPlugin } from '@capacitor/core';

/**
 * شناسه محصول اشتراک ماهانه — باید دقیقاً همان شناسه‌ای باشد که
 * در پنل توسعه‌دهندگان کافه بازار (بخش «درون‌برنامه‌ای» → «اشتراک») تعریف می‌کنید.
 */
export const MONTHLY_SKU = 'ai_fitness_premium_monthly';

export interface BillingPlugin {
  /** آیا کافه بازار روی دستگاه نصب و متصل است؟ */
  isAvailable(): Promise<{ available: boolean }>;
  /** اشتراک‌های فعال (از دید بازار) را برمی‌گرداند. */
  getActiveSubscriptions(): Promise<{ skus: string[] }>;
  /** شروع فرایند خرید اشتراک. */
  subscribe(options: { sku: string }): Promise<{ sku: string; purchaseToken: string }>;
}

export const Billing = registerPlugin<BillingPlugin>('CafeBazaarBilling');
