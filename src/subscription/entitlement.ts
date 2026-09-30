/**
 * منطق «قفل / بازکردن» امکانات پرمیوم.
 *
 * اصل: منبع حقیقت، خودِ کافه بازار است. کش محلی فقط برای حالت آفلاین است
 * و تاریخ انقضای کوتاه دارد، پس با پایان اشتراک قفل دوباره فعال می‌شود.
 */
import { Billing, MONTHLY_SKU } from './billing';

const KEY = 'aifit_entitlement_v1';

/** بعد از آخرین تأیید موفق بازار، چند ساعت آفلاین اجازه داریم؟ */
export const OFFLINE_GRACE_MS = 48 * 60 * 60 * 1000;

interface Cache {
  /** زمان آخرین تأیید «فعال» از بازار */
  verifiedAt: number;
  /** آخرین زمانی که اپ اجرا شد (برای تشخیص دستکاری ساعت) */
  lastSeen: number;
}

function read(): Cache | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Cache) : null;
  } catch {
    return null;
  }
}

function write(c: Cache | null) {
  try {
    if (c) localStorage.setItem(KEY, JSON.stringify(c));
    else localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** وضعیت فعلی را از کش (بدون شبکه) محاسبه می‌کند. */
export function cachedEntitlement(now = Date.now()): boolean {
  const c = read();
  if (!c) return false;
  // ساعت دستگاه به عقب برگردانده شده → قفل
  if (now < c.lastSeen - 5 * 60 * 1000) return false;
  const ok = now - c.verifiedAt < OFFLINE_GRACE_MS;
  if (ok) write({ ...c, lastSeen: Math.max(c.lastSeen, now) });
  else write(null); // مدت تمام شد → قفل
  return ok;
}

export type VerifyResult = 'active' | 'inactive' | 'unknown';

/** از بازار می‌پرسد اشتراک فعال است یا نه و کش را به‌روز می‌کند. */
export async function verifyWithBazaar(): Promise<VerifyResult> {
  try {
    const { available } = await Billing.isAvailable();
    if (!available) return 'unknown';
    const { skus } = await Billing.getActiveSubscriptions();
    if (skus.includes(MONTHLY_SKU)) {
      const now = Date.now();
      write({ verifiedAt: now, lastSeen: now });
      return 'active';
    }
    write(null); // اشتراک تمام شده یا هرگز خریده نشده → قفل فوری
    return 'inactive';
  } catch {
    // آفلاین / بازار در دسترس نیست: تصمیم با کش (محدود به مهلت آفلاین)
    return 'unknown';
  }
}

export async function purchaseMonthly(): Promise<boolean> {
  try {
    await Billing.subscribe({ sku: MONTHLY_SKU });
  } catch {
    return false;
  }
  return (await verifyWithBazaar()) === 'active';
}

export function clearEntitlement() {
  write(null);
}
