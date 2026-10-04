import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, Zap, Loader2, ChevronRight, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSubscription } from '../hooks/useSubscription';
import {
  SUBSCRIPTION_PLANS,
  fetchProducts,
  purchase,
  initializeBilling,
  currentBilling,
  IS_PERSONAL,
  type Product,
} from '../billing';
import { soundEffects } from '../utils/sound';
import { toPersianNumber } from '../utils/jalali';

export default function Subscription() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const sub = useSubscription();

  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  const teal = isDark ? '#a78bfa' : '#8b5cf6';
  const gold = isDark ? '#fbbf24' : '#f59e0b';
  const bgMain = isDark ? '#0f0e1f' : '#f8fafc';
  const cardBg = isDark
    ? 'bg-[#1e1b4b]/70 backdrop-blur-md'
    : 'bg-white/80 backdrop-blur-md shadow-sm';
  const textMain = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';

  // مقداردهی اولیه + بارگذاری محصولات
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // در مرورگر: skip billing init
        const isNative = typeof window !== 'undefined' && !!(window as any).Capacitor?.isNativePlatform?.();
        if (isNative) {
          await initializeBilling();
        }
        const skus = SUBSCRIPTION_PLANS.map((p) => p.sku);
        const list = await fetchProducts(skus);
        if (cancelled) return;

        const map: Record<string, Product> = {};
        list.forEach((p) => {
          map[p.sku] = p;
        });
        setProducts(map);
      } catch (e) {
        console.error('Failed to init subscription page:', e);
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePurchase = async (sku: string) => {
    soundEffects.playClick();
    setLoading(sku);
    try {
      const result = await purchase(sku);
      sub.onPurchaseSuccess(result);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (e: any) {
      console.error('Purchase failed:', e);
      alert('خرید ناموفق بود. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={`min-h-screen p-4 ${bgMain}`} dir="rtl">
      <div className="max-w-md mx-auto pt-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-1 text-xs mb-6 ${textSub}`}
        >
          <ChevronRight size={16} />
          بازگشت
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4"
            style={{ background: `${teal}20` }}
          >
            <Crown size={40} style={{ color: teal }} />
          </div>
          <h1 className={`text-2xl font-black mb-2 ${textMain}`}>اشتراک فیتو</h1>
          <p className={`text-sm ${textSub}`}>
            {sub.subscriptionActive
              ? 'اشتراک شما فعال است ✅'
              : sub.remainingTrialDays > 0
              ? `${toPersianNumber(sub.remainingTrialDays)} روز از دوره رایگان باقی مانده`
              : 'دوره رایگان شما به پایان رسیده'}
          </p>
        </div>

        {/* Trial warning */}
        {!sub.subscriptionActive && sub.remainingTrialDays > 0 && sub.remainingTrialDays <= 7 && (
          <div
            className="p-3 rounded-xl mb-5 flex items-center gap-2"
            style={{ background: `${gold}15` }}
          >
            <Clock size={16} style={{ color: gold }} />
            <p className="text-xs" style={{ color: gold }}>
              فقط {toPersianNumber(sub.remainingTrialDays)} روز از دوره رایگان شما باقی مانده
            </p>
          </div>
        )}

        {/* Personal note */}
        {IS_PERSONAL && (
          <div className={`p-4 rounded-2xl mb-5 ${cardBg} text-center`}>
            <p className={`text-xs ${textSub}`}>
              این نسخه شخصی است — همه امکانات باز است ✅
            </p>
          </div>
        )}

        {/* Loading */}
        {initializing && !IS_PERSONAL && (
          <div className={`p-8 rounded-2xl ${cardBg} text-center`}>
            <Loader2 size={32} className="animate-spin mx-auto mb-3" style={{ color: teal }} />
            <p className={`text-xs ${textSub}`}>در حال اتصال به فروشگاه...</p>
          </div>
        )}

        {/* Plans */}
        {!initializing && !IS_PERSONAL && (
          <div className="space-y-3">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const productInfo = products[plan.sku];
              const displayPrice = productInfo?.price || plan.price;
              const isLoading = loading === plan.sku;

              return (
                <button
                  key={plan.sku}
                  onClick={() => handlePurchase(plan.sku)}
                  disabled={!!loading}
                  className={`w-full p-4 rounded-2xl border text-right transition-all ${cardBg} ${
                    plan.best ? 'border-2' : isDark ? 'border-white/10' : 'border-violet-200/60'
                  } active:scale-[0.98]`}
                  style={plan.best ? { borderColor: teal } : undefined}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-black ${textMain}`}>{plan.label}</p>
                        {plan.best && (
                          <span
                            className="text-[10px] font-black px-2 py-0.5 rounded"
                            style={{ background: `${teal}20`, color: teal }}
                          >
                            پیشنهاد ویژه
                          </span>
                        )}
                      </div>
                      <p className={`text-xs ${textSub}`}>
                        {displayPrice} / {plan.period}
                      </p>
                      {plan.saves && (
                        <p className="text-[10px] mt-1" style={{ color: gold }}>
                          {plan.saves}
                        </p>
                      )}
                    </div>
                    {isLoading ? (
                      <Loader2 size={20} className="animate-spin" style={{ color: teal }} />
                    ) : (
                      <Zap size={20} style={{ color: teal }} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Benefits */}
        <div className={`mt-6 p-5 rounded-2xl ${cardBg}`}>
          <p className={`text-sm font-black mb-3 ${textMain}`}>با اشتراک فیتو:</p>
          <ul className={`text-xs space-y-2 ${textSub}`}>
            <li className="flex items-center gap-2">
              <Check size={14} style={{ color: teal }} /> برنامه تمرینی نامحدود
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} style={{ color: teal }} /> برنامه تغذیه اختصاصی
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} style={{ color: teal }} /> برنامه مکمل ورزشی
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} style={{ color: teal }} /> جایگزینی هوشمند حرکات
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} style={{ color: teal }} /> ذخیره بی‌نهایت برنامه
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} style={{ color: teal }} /> تمام آپدیت‌های آینده
            </li>
          </ul>
        </div>

        {/* Footer note */}
        <p className={`text-center text-[10px] mt-5 ${textSub}`}>
          پرداخت امن از طریق {currentBilling.provider === 'myket' ? 'مایکت' : currentBilling.provider === 'bazaar' ? 'کافه‌بازار' : '—'}
        </p>
      </div>
    </div>
  );
}
