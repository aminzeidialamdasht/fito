import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Crown, Check, Sparkles } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { useTheme } from '../context/ThemeContext';
import { soundEffects } from '../utils/sound';

interface PremiumGateProps {
  feature: 'nutrition' | 'supplement' | 'workout' | 'compact';
  children: ReactNode;
}

export default function PremiumGate({ feature, children }: PremiumGateProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const sub = useSubscription();

  const teal = isDark ? '#a78bfa' : '#8b5cf6';
  const gold = isDark ? '#fbbf24' : '#f59e0b';
  const bgMain = isDark ? '#0f0e1f' : '#f8fafc';
  const cardBg = isDark
    ? 'bg-[#1e1b4b]/70 backdrop-blur-md'
    : 'bg-white/80 backdrop-blur-md shadow-sm';
  const textMain = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';

  // چک دسترسی
  const hasAccess =
    feature === 'nutrition'
      ? sub.canAccessNutrition
      : feature === 'supplement'
      ? sub.canAccessSupplement
      : feature === 'compact'
      ? sub.canAccessCompact
      : sub.canAccessWorkout;

  if (hasAccess) {
    return <>{children}</>;
  }

  // قفل — نمایش صفحه اشتراک
  const featureNames: Record<typeof feature, string> = {
    nutrition: 'برنامه تغذیه',
    supplement: 'برنامه مکمل',
    workout: 'برنامه تمرینی',
    compact: 'برنامه فشرده',
  };

  const handleGoSubscribe = () => {
    soundEffects.playClick();
    navigate('/subscription');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${bgMain}`} dir="rtl">
      <div className={`max-w-md w-full p-6 rounded-3xl border ${cardBg} ${isDark ? 'border-white/10' : 'border-violet-200/60'}`}>
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{ background: `${teal}20` }}
          >
            <Lock size={36} style={{ color: teal }} />
          </div>
        </div>

        {/* Title */}
        <h1 className={`text-xl font-black text-center mb-2 ${textMain}`}>
          {featureNames[feature]} قفل است
        </h1>
        <p className={`text-sm text-center mb-6 ${textSub}`}>
          برای دسترسی به این بخش، اشتراک تهیه کنید
        </p>

        {/* Benefits */}
        <div className={`p-4 rounded-2xl mb-5 ${isDark ? 'bg-white/5' : 'bg-violet-50'}`}>
          <p className={`text-xs font-bold mb-3 flex items-center gap-2 ${textMain}`}>
            <Sparkles size={14} style={{ color: gold }} />
            با اشتراک فیتو:
          </p>
          <ul className={`text-xs space-y-2 ${textSub}`}>
            <li className="flex items-center gap-2">
              <Check size={12} style={{ color: teal }} /> برنامه تمرینی نامحدود
            </li>
            <li className="flex items-center gap-2">
              <Check size={12} style={{ color: teal }} /> برنامه تغذیه اختصاصی
            </li>
            <li className="flex items-center gap-2">
              <Check size={12} style={{ color: teal }} /> برنامه مکمل ورزشی
            </li>
            <li className="flex items-center gap-2">
              <Check size={12} style={{ color: teal }} /> جایگزینی هوشمند حرکات
            </li>
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={handleGoSubscribe}
          className="w-full py-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          style={{
            background: `linear-gradient(135deg, ${teal} 0%, ${gold} 130%)`,
            boxShadow: `0 10px 40px ${teal}40`,
          }}
        >
          <Crown size={18} />
          تهیه اشتراک
        </button>
      </div>
    </div>
  );
}
