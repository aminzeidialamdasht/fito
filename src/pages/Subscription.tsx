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
import { getTokens } from '../styles/designTokens';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import PrimaryButton from '../components/ui/PrimaryButton';
import Toast from '../components/ui/Toast';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

export default function Subscription() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const sub = useSubscription();

  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const tokens = getTokens(isDark);

  const teal = tokens.accent;
  const gold = tokens.gold;
  const bgMain = tokens.bg;
  const cardBg = '';
  const textMain = tokens.textMain;
  const textSub = tokens.textSub;

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
      setToastMessage('خرید با موفقیت انجام شد!');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (e: any) {
      console.error('Purchase failed:', e);
      setToastMessage('خرید ناموفق بود. لطفاً دوباره تلاش کنید.');
      setToastType('error');
      setShowToast(true);
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
          className="flex items-center gap-1 text-xs mb-6 transition-colors"
          style={{ color: tokens.textSub }}
          aria-label="بازگشت"
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
          <Card variant="soft" className="p-4 text-center mb-5">
            <p className="text-xs" style={{ color: tokens.textSub }}>
              این نسخه شخصی است — همه امکانات باز است ✅
            </p>
          </Card>
        )}

        {/* Loading */}
        {initializing && !IS_PERSONAL && (
          <Card variant="elevated" className="p-8 text-center">
            <Loader2 size={32} className="animate-spin mx-auto mb-3" style={{ color: tokens.accent }} />
            <p className="text-xs" style={{ color: tokens.textSub }}>
              در حال اتصال به فروشگاه...
            </p>
          </Card>
        )}

        {/* Plans */}
        {!initializing && !IS_PERSONAL && (
          <div className="space-y-3">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const productInfo = products[plan.sku];
              const displayPrice = productInfo?.price || plan.price;
              const isLoading = loading === plan.sku;

              return (
                <Card
                  key={plan.sku}
                  variant={plan.best ? 'soft' : 'elevated'}
                  className={`p-4 transition-all ${plan.best ? 'border-2' : ''}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-black" style={{ color: tokens.textMain }}>
                          {plan.label}
                        </p>
                        {plan.best && (
                          <Badge color="priority" size="sm">پیشنهاد ویژه</Badge>
                        )}
                      </div>
                      <p className="text-xs" style={{ color: tokens.textSub }}>
                        {displayPrice} / {plan.period}
                      </p>
                      {plan.saves && (
                        <p className="text-[10px] mt-1" style={{ color: tokens.gold }}>
                          {plan.saves}
                        </p>
                      )}
                    </div>
                    <PrimaryButton
                      variant={plan.best ? 'gold' : 'accent'}
                      size="sm"
                      disabled={!!loading}
                      onClick={() => handlePurchase(plan.sku)}
                    >
                      {isLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Zap size={16} />
                      )}
                      خرید
                    </PrimaryButton>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Benefits */}
        <Card variant="elevated" className="mt-6 p-5">
          <p className="text-sm font-black mb-3" style={{ color: tokens.textMain }}>
            با اشتراک فیتو:
          </p>
          <ul className="text-xs space-y-2" style={{ color: tokens.textSub }}>
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
              <Check size={14} style={{ color: tokens.accent }} /> تمام آپدیت‌های آینده
            </li>
          </ul>
        </Card>

        {/* Footer note */}
        <p className="text-center text-[10px] mt-5" style={{ color: tokens.textSub }}>
          پرداخت امن از طریق {currentBilling.provider === 'myket' ? 'مایکت' : currentBilling.provider === 'bazaar' ? 'کافه‌بازار' : '—'}
        </p>
      </div>

      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        type={toastType}
        duration={2500}
      />
    </div>
  );
}
