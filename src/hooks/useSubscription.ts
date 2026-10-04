import { useCallback, useEffect, useState } from 'react';
import {
  SubscriptionState,
  loadSubscriptionState,
  saveSubscriptionState,
  canAccessWorkout,
  canAccessNutrition,
  canAccessSupplement,
  canAccessCompact,
  isTrialActive,
  isSubscriptionActive,
  getRemainingTrialDays,
  applyPurchase,
  checkExistingPurchases,
  IS_PERSONAL,
} from '../billing';

/**
 * هوک اشتراک
 * در App.tsx استفاده می‌شود
 */
export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>(() => {
    const loaded = loadSubscriptionState();
    // نسخه شخصی — همیشه subscribed
    if (IS_PERSONAL) {
      return {
        ...loaded,
        isSubscribed: true,
        subscriptionSku: 'personal',
        subscriptionExpiresAt: null,
      };
    }
    return loaded;
  });

  // ذخیره خودکار در localStorage
  useEffect(() => {
    saveSubscriptionState(state);
  }, [state]);

  // چک خریدهای قبلی در mount
  useEffect(() => {
    if (IS_PERSONAL) return;

    let cancelled = false;

    (async () => {
      try {
        const purchases = await checkExistingPurchases();
        if (cancelled || purchases.length === 0) return;

        // آخرین خرید را اعمال کن
        const latest = purchases.reduce((a, b) =>
          a.purchaseTime > b.purchaseTime ? a : b
        );

        setState(prev => applyPurchase(prev, latest));
        console.log('✅ Restored subscription from purchase:', latest.sku);
      } catch (e) {
        console.warn('⚠️  Failed to restore purchases:', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const onPurchaseSuccess = useCallback(
    (purchase: { purchaseToken: string; sku: string; purchaseTime: number; payload?: string; signature?: string }) => {
      setState(prev => applyPurchase(prev, purchase));
    },
    []
  );

  return {
    state,
    trialActive: isTrialActive(state),
    subscriptionActive: isSubscriptionActive(state),
    remainingTrialDays: getRemainingTrialDays(state),
    canAccessWorkout: canAccessWorkout(state),
    canAccessNutrition: canAccessNutrition(state),
    canAccessSupplement: canAccessSupplement(state),
    canAccessCompact: canAccessCompact(state),
    onPurchaseSuccess,
  };
}
