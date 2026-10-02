/**
 * منطق «قفل / بازکردن» امکانات پرمیوم.
 * منبع حقیقت، خودِ فروشگاه است. کش محلی فقط برای حالت آفلاین است.
 */
import { Billing, MONTHLY_SKU } from './billing';

const KEY = 'aifit_entitlement_v1';

export const OFFLINE_GRACE_MS = 48 * 60 * 60 * 1000;

interface Cache {
  verifiedAt: number;
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

export function cachedEntitlement(now = Date.now()): boolean {
  const c = read();
  if (!c) return false;
  if (now < c.lastSeen - 5 * 60 * 1000) return false;
  const ok = now - c.verifiedAt < OFFLINE_GRACE_MS;
  if (ok) write({ ...c, lastSeen: Math.max(c.lastSeen, now) });
  else write(null);
  return ok;
}

export type VerifyResult = 'active' | 'inactive' | 'unknown';

export async function verifyWithStore(): Promise<VerifyResult> {
  try {
    const { available } = await Billing.isAvailable();
    if (!available) return 'unknown';
    const { skus } = await Billing.getActiveSubscriptions();
    if (skus.includes(MONTHLY_SKU)) {
      const now = Date.now();
      write({ verifiedAt: now, lastSeen: now });
      return 'active';
    }
    write(null);
    return 'inactive';
  } catch {
    return 'unknown';
  }
}

export async function purchaseMonthly(): Promise<boolean> {
  try {
    await Billing.subscribe({ sku: MONTHLY_SKU });
  } catch {
    return false;
  }
  return (await verifyWithStore()) === 'active';
}

export function clearEntitlement() {
  write(null);
}
