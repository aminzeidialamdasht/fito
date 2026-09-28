import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { cachedEntitlement, purchaseMonthly, verifyWithBazaar } from './entitlement';

interface Ctx {
  /** آیا ورود/خروج پرامپت باز است؟ */
  isPremium: boolean;
  checking: boolean;
  refresh: () => Promise<void>;
  buy: () => Promise<boolean>;
}

const SubscriptionContext = createContext<Ctx | null>(null);

const RECHECK_MS = 30 * 60 * 1000; // هر ۳۰ دقیقه

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState<boolean>(() => cachedEntitlement());
  const [checking, setChecking] = useState(true);

  const refresh = useCallback(async () => {
    const r = await verifyWithBazaar();
    if (r === 'active') setIsPremium(true);
    else if (r === 'inactive') setIsPremium(false);
    else setIsPremium(cachedEntitlement());
    setChecking(false);
  }, []);

  const buy = useCallback(async () => {
    const ok = await purchaseMonthly();
    setIsPremium(ok);
    return ok;
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, RECHECK_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refresh]);

  return (
    <SubscriptionContext.Provider value={{ isPremium, checking, refresh, buy }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): Ctx {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used inside SubscriptionProvider');
  return ctx;
}
