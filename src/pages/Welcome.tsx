import { Sparkles, ChevronLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { APP_VERSION } from '../version';

interface WelcomeProps {
  onContinue: () => void;
}

export default function Welcome({ onContinue }: WelcomeProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <main
      dir="rtl"
      className="relative min-h-screen flex items-stretch justify-center overflow-hidden"
      style={{ background: '#0f0e1f' }}
    >
      {/* کانتینر موبایل (روی دسکتاپ وسط قرار می‌گیرد) */}
      <div className="relative w-full max-w-md mx-auto flex flex-col">

        {/* پس‌زمینه تصویری */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/welcome-bg.png')",
            backgroundPosition: 'center',
          }}
        />

        {/* Overlay تیره */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'linear-gradient(180deg, rgba(15,14,31,0.3) 0%, rgba(15,14,31,0.5) 40%, rgba(15,14,31,0.92) 100%)'
              : 'linear-gradient(180deg, rgba(15,14,31,0.45) 0%, rgba(15,14,31,0.65) 40%, rgba(15,14,31,0.95) 100%)',
          }}
        />

        {/* محتوا */}
        <div className="relative z-10 flex flex-col min-h-screen px-6 py-6 text-white">

          {/* بالا: برند */}
          <div className="flex flex-col items-center pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={15} className="text-[#c4b5fd]" />
              <span className="text-xs font-bold text-[#c4b5fd]">
                دستیار هوشمند بدنسازی
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">فیتو</h1>
            <p className="mt-0.5 text-base font-semibold text-[#a78bfa]">
              Fito
            </p>
            <span className="text-[10px] opacity-40 mt-1">{APP_VERSION}</span>
          </div>

          {/* فضای میانی */}
          <div className="flex-1" />

          {/* پایین */}
          <div className="space-y-3 pb-2">
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-black leading-tight">
                تمرین هوشمند، آفلاین و بی‌مرز
              </h2>
              <p className="text-xs text-white/70 leading-5 px-2">
                برنامه تمرینی اختصاصی، دقیق و همیشه در دسترس — بدون نیاز به
                اینترنت
              </p>
            </div>

            <button
              onClick={onContinue}
              className="w-full py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98] text-white"
              style={{
                background:
                  'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                boxShadow: '0 10px 30px rgba(124,58,237,0.45)',
              }}
            >
              ورود به فیتو
              <ChevronLeft size={18} />
            </button>

            <div className="text-center space-y-1 pt-1">
              <p className="text-[10px] text-white/50">
                نسخه حرفه‌ای دستیار تمرین، پیشرفت و برنامه‌ریزی بدنسازی
              </p>
              <p className="text-[10px] text-white/40 px-2">
                طراحی و توسعه توسط{' '}
                <span className="font-bold text-[#c4b5fd]">امین زیدی</span>{' '}
                — مربی رسمی فدراسیون بدنسازی و پرورش اندام ایران
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
