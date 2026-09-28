import { Sparkles, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface WelcomeProps { onContinue: () => void; }

export default function Welcome({ onContinue }: WelcomeProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <main dir="rtl" className={`min-h-screen flex items-center justify-center p-6 ${isDark ? 'bg-[#0d0d1a] text-white' : 'bg-gradient-to-br from-white to-[#f0fdfa] text-[#134e4a]'}`}>
      <section className="w-full max-w-md text-center">
        <div className={`mx-auto mb-7 w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden ${isDark ? 'bg-[#0D0D1A] shadow-[#88C038]/25' : 'bg-[#0D0D1A] shadow-[#88C038]/20'}`}>
          <img src="/coachino-icon.png" alt="کوچینو" className="w-24 h-24 object-contain" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles size={17} className={isDark ? 'text-[#88C038]' : 'text-[#6BA82A]'} />
          <span className={`text-sm font-bold ${isDark ? 'text-[#88C038]' : 'text-[#6BA82A]'}`}>دستیار هوشمند بدنسازی</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight">کوچینو</h1>
        <p className={`mt-1 text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-[#0f766e]'}`}>Coachino</p>
        <div className={`mt-8 rounded-3xl p-6 border ${isDark ? 'bg-[#1a1a2e] border-[#88C038]/20' : 'bg-white border-[#88C038]/20 shadow-lg'}`}>
          <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>ساخته شده توسط</p>
          <h2 className="text-xl font-extrabold">امین زیدی</h2>
          <p className={`mt-2 text-sm leading-7 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>مربی رسمی فدراسیون بدنسازی و پرورش اندام ایران</p>
        </div>
        <button onClick={onContinue} className={`mt-7 w-full py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${isDark ? 'bg-gradient-to-l from-[#88C038] to-[#9AD43A] text-[#0d0d1a]' : 'bg-gradient-to-l from-[#6BA82A] to-[#88C038] text-white'}`}>
          ورود به کوچینو
          <ArrowLeft size={19} />
        </button>
        <p className={`mt-5 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>نسخه حرفه‌ای دستیار تمرین، پیشرفت و برنامه‌ریزی بدنسازی</p>
      </section>
    </main>
  );
}
