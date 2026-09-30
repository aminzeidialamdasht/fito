import { Dumbbell, Flame, CheckCircle2, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toPersianNumber } from '../utils/jalali';
import { soundEffects } from '../utils/sound';

interface Props {
  isDark: boolean;
  isPremium: boolean;
  profileName?: string;
  isTodayRest: boolean;
  todayDayIndex: number;
  nextTrainingDayIndex: number;
  weeklyCompleted: number;
  weeklyGoal: number;
  weeklyProgress: number;
  currentStreak: number;
  lastSession: any;
  getSessionDuration: (s: any) => string | null;
}

export default function DashboardHero({
  isDark, isPremium, profileName, isTodayRest, todayDayIndex, nextTrainingDayIndex,
  weeklyCompleted, weeklyGoal, weeklyProgress, currentStreak, lastSession, getSessionDuration,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
            سلام، {profileName || 'مربی'} 👋
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            آماده‌ای برای پیشرفت؟
          </p>
        </div>
        {!isPremium && (
          <button
            onClick={() => navigate('/prompt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border ${
              isDark ? 'border-[#d4af37]/40 text-[#d4af37] bg-[#d4af37]/10' : 'border-amber-400 text-amber-700 bg-amber-50'
            }`}
          >
            <Award size={14} /> ارتقا به ویژه
          </button>
        )}
      </div>

      <button
        onClick={() => {
          soundEffects.playClick();
          if (isTodayRest) {
            navigate(`/workout?day=${nextTrainingDayIndex}`);
          } else {
            navigate(`/workout?day=${todayDayIndex >= 0 ? todayDayIndex : nextTrainingDayIndex}&autoStart=true`);
          }
        }}
        className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-transform ${
          isDark
            ? 'bg-gradient-to-l from-[#d4af37] to-amber-500 text-black shadow-[#d4af37]/25'
            : 'bg-gradient-to-l from-teal-500 to-emerald-600 text-white shadow-teal-500/25'
        }`}
      >
        <Dumbbell size={22} />
        {isTodayRest ? 'شروع تمرین بعدی' : 'شروع تمرین امروز'}
      </button>

      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-2xl p-4 border flex flex-col items-center justify-center ${
          isDark ? 'bg-[#1a1a2e] border-white/5' : 'bg-white border-teal-100 shadow-sm'
        }`}>
          <div className="relative w-20 h-20 mb-2">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke={isDark ? '#1f2937' : '#e5e7eb'} strokeWidth="7" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke={isDark ? '#d4af37' : '#14b8a6'}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - weeklyProgress / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-lg font-black ${isDark ? 'text-[#d4af37]' : 'text-teal-600'}`}>
                {toPersianNumber(weeklyCompleted)}/{toPersianNumber(weeklyGoal)}
              </span>
            </div>
          </div>
          <p className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>روزهای تکمیل‌شده</p>
        </div>

        <div className={`rounded-2xl p-4 border flex flex-col items-center justify-center ${
          isDark ? 'bg-[#1a1a2e] border-white/5' : 'bg-white border-orange-100 shadow-sm'
        }`}>
          <Flame size={28} className={currentStreak > 0 ? 'text-orange-400 mb-1' : 'text-slate-500 mb-1'} />
          <p className={`text-2xl font-black ${isDark ? 'text-[#d4af37]' : 'text-orange-600'}`}>
            {toPersianNumber(currentStreak)}
          </p>
          <p className={`text-[11px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>روز استریک تمرینی</p>
        </div>
      </div>

      {lastSession && (
        <div className={`rounded-2xl p-4 border ${
          isDark ? 'bg-[#1a1a2e] border-white/5' : 'bg-white border-teal-100 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <CheckCircle2 size={16} className="text-green-400" /> آخرین جلسه
            </h3>
            <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {lastSession.date ? new Date(lastSession.date).toLocaleDateString('fa-IR') : ''}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className={`text-sm font-black ${isDark ? 'text-[#d4af37]' : 'text-teal-600'}`}>
                {toPersianNumber(Math.round(lastSession.totalVolume || 0))}
              </p>
              <p className="text-[10px] text-slate-500">حجم (kg)</p>
            </div>
            <div>
              <p className={`text-sm font-black ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>
                {getSessionDuration(lastSession) || '—'}
              </p>
              <p className="text-[10px] text-slate-500">مدت زمان</p>
            </div>
            <div>
              <p className={`text-sm font-black ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                {toPersianNumber((lastSession.sets || []).filter((s: any) => s.completed).length)}
              </p>
              <p className="text-[10px] text-slate-500">ست تکمیل</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
