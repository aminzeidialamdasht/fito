/**
 * پیکربندی Billing برای هر flavor
 *
 * سه flavor:
 *  - myket    : انتشار در مایکت (RSA key مایکت)
 *  - bazaar   : انتشار در کافه‌بازار (RSA key بازار)
 *  - personal : نسخه شخصی فول (بدون محدودیت)
 */

export type AppFlavor = 'myket' | 'bazaar' | 'personal';
export type BillingProvider = 'myket' | 'bazaar' | null;

/**
 * SKU محصولات (یکسان در هر دو فروشگاه)
 */
export const SUBSCRIPTION_SKUS = {
  monthly: 'fito_monthly',
  yearly: 'fito_yearly',
  lifetime: 'fito_lifetime',
} as const;

export type SubscriptionSku = typeof SUBSCRIPTION_SKUS[keyof typeof SUBSCRIPTION_SKUS];

/**
 * تشخیص flavor از Vite env
 */
export const APP_FLAVOR: AppFlavor =
  (import.meta.env.VITE_APP_FLAVOR as AppFlavor) || 'personal';

/**
 * نسخه شخصی — همه چیز باز
 */
export const IS_PERSONAL = APP_FLAVOR === 'personal';

/**
 * RSA Public Keys از پنل توسعه‌دهندگان
 * این کلیدها public هستند و در bundle نهایی قابل مشاهده‌اند — مشکلی نیست
 */
const RSA_KEYS = {
  myket: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwJCAs/SeSZg8PlkvDq5sd+BGr2lTn9yqpmK1cvb47BkN8jZhc0Z2rZBjYWQCy+N0041sZxWiKh2KcPIV5H5hbFEbiDPUeR0C3+qk1N/hPECldfrNmx3/R47OpXsp6A5jsBVohFRFSqr8gTlvKBb34FkdvUvOHJ1D2ZzIpeLyQIDAQAB',
  bazaar: '', // ← بعداً از پنل بازار پر می‌کنیم
} as const;

/**
 * Billing config بر اساس flavor
 */
export const BILLING_CONFIG = {
  myket: {
    provider: 'myket' as BillingProvider,
    rsaKey: RSA_KEYS.myket,
    skus: SUBSCRIPTION_SKUS,
    bypass: false,
  },
  bazaar: {
    provider: 'bazaar' as BillingProvider,
    rsaKey: RSA_KEYS.bazaar,
    skus: SUBSCRIPTION_SKUS,
    bypass: false,
  },
  personal: {
    provider: null as BillingProvider,
    rsaKey: null,
    skus: SUBSCRIPTION_SKUS,
    bypass: true, // همه چیز باز
  },
} as const;

export const currentBilling = BILLING_CONFIG[APP_FLAVOR];

/**
 * اطلاعات نمایشی پلن‌ها برای صفحه Subscription
 */
export interface PlanInfo {
  sku: SubscriptionSku;
  label: string;
  price: string;
  period: string;
  best?: boolean;
  saves?: string;
}

export const SUBSCRIPTION_PLANS: PlanInfo[] = [
  {
    sku: SUBSCRIPTION_SKUS.monthly,
    label: 'ماهانه',
    price: '۹۹ هزار تومان',
    period: 'ماه',
  },
  {
    sku: SUBSCRIPTION_SKUS.yearly,
    label: 'سالانه',
    price: '۷۹۰ هزار تومان',
    period: 'سال',
    best: true,
    saves: '۳۳٪ صرفه‌جویی',
  },
  {
    sku: SUBSCRIPTION_SKUS.lifetime,
    label: 'مادام‌العمر',
    price: '۱.۹۹ میلیون تومان',
    period: 'یک‌بار',
  },
];
