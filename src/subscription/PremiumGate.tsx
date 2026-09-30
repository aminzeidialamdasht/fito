import React, { useState } from 'react';
import { Lock, Crown, Check } from 'lucide-react';
import { useSubscription } from './SubscriptionContext';
import { useTheme } from '../context/ThemeContext';

/** صفحه‌هایی که ورود/خروج پرامپت دارند را پشت اشتراک قفل می‌کند. */
export default function PremiumGate({ children, title }: { children: React.ReactNode; title: string }) {
  const { isPremium, checking, buy, refresh } = useSubscription();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  if (isPremium) return <>{children}</>;
  if (checking) {
    return <div className="text-center py-20 text-sm opacity-60">در حال بررسی وضعیت اشتراک...</div>;
  }

  const onBuy = async () => {
    setBusy(true);
    setMsg('');
    const ok = await buy();
    setBusy(false);
    if (!ok) setMsg('خرید انجام نشد. مطمئن شوید کافه بازار نصب و وارد حساب شده است.');
  };

  const onRestore = async () => {
    setBusy(true);
    setMsg('');
    await refresh();
    setBusy(false);
    setMsg('اگر اشتراک فعالی داشته باشید، به‌صورت خودکار باز می‌شود.');
  };

  return (
    <div className={'max-w-md mx-auto mt-10 rounded-3xl p-8 text-center border ' + (
      isDark ? 'bg-[#141414] border-[#d4af37]/30 text-white' : 'bg-white border-[#14b8a6]/30 text-[#134e4a]'
    )}>
      <div className={'w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ' + (
        isDark ? 'bg-[#d4af37]/15 text-[#d4af37]' : 'bg-[#14b8a6]/15 text-[#0d9488]'
      )}>
        <Lock size={30} />
      </div>
      <h2 className="text-lg font-bold mb-2">{title} — ویژه مشترکین</h2>
      <p className="text-sm opacity-70 mb-5 leading-7">
        در نسخه آزمایشی، ورود و خروج پرامپت قفل است. با تهیه اشتراک ماهانه، تولید و کپی پرامپت
        و ورود برنامه‌های تمرینی، تغذیه و مکمل فعال می‌شود. با پایان اشتراک، دوباره قفل می‌شود.
      </p>
      <ul className="text-sm text-right mb-6 space-y-2">
        {['تولید و کپی پرامپت هوش مصنوعی', 'ورود برنامه تمرینی', 'ورود برنامه تغذیه و مکمل'].map(t => (
          <li key={t} className="flex items-center gap-2"><Check size={16} /> {t}</li>
        ))}
      </ul>
      <button
        onClick={onBuy}
        disabled={busy}
        className={'w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 ' + (
          isDark ? 'bg-[#d4af37] text-black' : 'bg-[#14b8a6] text-white'
        )}
      >
        <Crown size={18} /> {busy ? 'لطفاً صبر کنید...' : 'تهیه اشتراک ماهانه'}
      </button>
      <button onClick={onRestore} disabled={busy} className="mt-3 text-xs underline opacity-70">
        قبلاً اشتراک گرفته‌ام (بازیابی)
      </button>
      {msg && <p className="mt-3 text-xs opacity-80">{msg}</p>}
    </div>
  );
}
