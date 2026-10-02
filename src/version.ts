/**
 * نسخه اپلیکیشن — تنها منبع حقیقت (Single Source of Truth).
 *
 * این مقدار از package.json خوانده می‌شود که در زمان build توسط Vite تزریق می‌گردد.
 * تگ گیت باید دقیقاً با این نسخه هماهنگ باشد (با پسوند فروشگاه):
 *   - بازار:  v1.6.1-bazaar
 *   - مایکت:  v1.6.1-myket
 *   - شخصی:   v1.6.1
 */
export const APP_VERSION = `v${__APP_VERSION__}`;

/** نام فروشگاه بر اساس flavor */
export const STORE_DISPLAY_NAME =
  import.meta.env.VITE_APP_FLAVOR === 'myket'
    ? 'مایکت'
    : import.meta.env.VITE_APP_FLAVOR === 'bazaar'
    ? 'کافه بازار'
    : 'فروشگاه';
