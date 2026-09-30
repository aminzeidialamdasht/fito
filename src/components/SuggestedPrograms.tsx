import { Dumbbell, Brain, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { soundEffects } from '../utils/sound';
import { DEFAULT_WORKOUT_PLAN } from '../data/defaultPlans';

interface Props {
  isDark: boolean;
  isPremium: boolean;
}

export default function SuggestedPrograms({ isDark, isPremium }: Props) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className={`font-black text-lg flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <Sparkles size={18} className={isDark ? 'text-[#d4af37]' : 'text-teal-500'} />
          برنامه‌های پیشنهادی
        </h2>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
        }`}>رایگان</span>
      </div>
      <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        این برنامه‌ها برای همه باز است. برای برنامه اختصاصی با هوش مصنوعی، اشتراک تهیه کنید.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className={`rounded-2xl p-4 border ${
          isDark ? 'bg-[#1a1a2e] border-white/5' : 'bg-white border-teal-100 shadow-sm'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isDark ? 'bg-[#d4af37]/15 text-[#d4af37]' : 'bg-teal-100 text-teal-700'
            }`}>
              <Dumbbell size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {(DEFAULT_WORKOUT_PLAN as any).program_name || 'برنامه پوش/پول/لگ'}
              </h3>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                سطح متوسط · {(DEFAULT_WORKOUT_PLAN as any).duration || '۴ هفته'} · ۳ روز در هفته
              </p>
              <button
                onClick={() => { soundEffects.playClick(); navigate('/workout'); }}
                className={`mt-2 text-xs font-bold px-3 py-1.5 rounded-lg ${
                  isDark ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-teal-100 text-teal-700'
                }`}
              >
                شروع تمرین
              </button>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-4 border relative overflow-hidden ${
          isDark ? 'bg-[#1a1a2e] border-[#d4af37]/20' : 'bg-white border-amber-200 shadow-sm'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isDark ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
            }`}>
              <Brain size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  برنامه اختصاصی AI
                </h3>
                {!isPremium && (
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                    isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'
                  }`}>ویژه</span>
                )}
              </div>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                بر اساس پروفایل و هدف شما ساخته می‌شود
              </p>
              <button
                onClick={() => { soundEffects.playClick(); navigate('/prompt'); }}
                className={`mt-2 text-xs font-bold px-3 py-1.5 rounded-lg ${
                  isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                {isPremium ? 'ساخت برنامه' : 'ارتقا و ساخت'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
