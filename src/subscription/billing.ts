import { registerPlugin } from '@capacitor/core';

const FLAVOR = import.meta.env.VITE_APP_FLAVOR || 'myket';

/**
 * شناسه محصول اشتراک ماهانه — بر اساس فروشگاه متفاوت است.
 * - بازار: ai_fitness_premium_monthly
 * - مایکت: coachino_premium_monthly
 */
export const MONTHLY_SKU: string =
  FLAVOR === 'myket'
    ? (import.meta.env.VITE_MYKET_SKU as string) || 'coachino_premium_monthly'
    : FLAVOR === 'bazaar'
    ? (import.meta.env.VITE_BAZAAR_SKU as string) || 'ai_fitness_premium_monthly'
    : 'ai_fitness_premium_monthly';

export interface BillingPlugin {
  isAvailable(): Promise<{ available: boolean }>;
  getActiveSubscriptions(): Promise<{ skus: string[] }>;
  subscribe(options: { sku: string }): Promise<{ sku: string; purchaseToken: string }>;
}

const PLUGIN_NAME = FLAVOR === 'myket' ? 'MyketBilling' : 'CafeBazaarBilling';

export const Billing = registerPlugin<BillingPlugin>(PLUGIN_NAME);

/** نام فروشگاه فعلی برای نمایش در UI */
export const STORE_NAME =
  FLAVOR === 'myket' ? 'مایکت' : FLAVOR === 'bazaar' ? 'کافه بازار' : 'فروشگاه';
