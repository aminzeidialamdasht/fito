import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { toPersianNumber } from '../utils/jalali';
import { soundEffects } from '../utils/sound';
import {
  Dumbbell, Trophy, Flame, Apple, Pill, Brain, Import,
  Calendar, ChevronLeft, User, Sparkles, Zap, Target, Activity,
  CheckCircle2, Heart, BarChart3, ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../subscription/SubscriptionContext';

// ✅ حذف کامل ایمپورت DEFAULT_WORKOUT_PLAN و SAMPLE_PROFILE

export default function Dashboard() {
  const { state, activeProfile, sessions, programs, profiles, setActiveProfile } = useAppContext();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const { isPremium } = useSubscription();
  
  // ✅ فقط از پروفایل فعال استفاده کن، نه نمونه پیش‌فرض
  const profile = activeProfile;

  const teal = isDark ? '#14b8a6' : '#0d9488';
  const tealLight = isDark ? '#2dd4bf' : '#14b8a6';
  const bgMain = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? '#1e293b' : '#f8fafc';
  const textMain = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';
  const borderCard = isDark ? 'border-white/5' : 'border-teal-100';
  const gold = isDark ? '#d4af37' : '#f59e0b';

  const completedSessions = sessions.filter(s => s.completed);
  const currentStreak = calculateStreak(sessions);
  
  // ✅ فقط برنامه‌های واقعی را بخوان
  const activeProgram = programs.find(p => p.id === state.activeProgram);
  const programDays: any[] = Array.isArray((activeProgram as any)?.days) ? (activeProgram as any).days : [];

  const today = new Date();
  const jsDay = today.getDay();
  const persianDayIndex = (jsDay + 1) % 7;
  const WEEKDAY_NAMES = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
  const todayName = WEEKDAY_NAMES[persianDayIndex];

  const normalizePersian = (value?: string) => String(value || '').replace(/\u200c|\u200f|\u200e/g, '').trim();
  const weekdayMatches = (value?: string, target?: string) => {
    const v = normalizePersian(value);
    const t = normalizePersian(target);
    if (!v || !t) return false;
    return v === t || v.includes(t);
  };

  const findProgramDayByWeekday = (name: string) =>
    programDays.find((d: any) => weekdayMatches(d?.weekday, name) || weekdayMatches(d?.day, name));

  const hasExplicitSchedule = programDays.some((d: any) => typeof d?.weekday === 'string' && d.weekday.trim().length > 0);
  const todayWorkout = hasExplicitSchedule ? findProgramDayByWeekday(todayName) : undefined;
  const isTodayRest = hasExplicitSchedule && !todayWorkout;
  const todayDayIndex = todayWorkout ? programDays.indexOf(todayWorkout) : -1;

  const weeklyGoal = profile?.trainingDays || 4;
  const weekData = getWeekData(sessions);
  const weeklyCompleted = weekData.filter(d => d.sessions > 0).length;
  const weeklyProgress = Math.min(100, (weeklyCompleted / weeklyGoal) * 100);
  const totalVolume = completedSessions.reduce((acc, s) => acc + s.totalVolume, 0);

  const streakDots = useMemo(() => {
    const days = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
    return days.map((dayLabel, i) => {
      const targetJsDay = (i === 0) ? 6 : i - 1;
      let diff = targetJsDay - jsDay;
      if (diff < 0) diff += 7;
      if (diff > 6) diff -= 7;
      const d = new Date(today);
      d.setDate(d.getDate() - diff);
      const dateStr = d.toDateString();
      const hasSession = sessions.some(s => s.completed && new Date(s.date).toDateString() === dateStr);
      const isToday = (i === persianDayIndex);
      return { label: dayLabel, active: hasSession, isToday };
    });
  }, [sessions, persianDayIndex, jsDay]);

  const shortcuts = [
    { icon: Dumbbell, label: 'تمرین', path: '/workout', gradient: 'from-teal-500 to-emerald-600' },
    { icon: Brain, label: 'پرامپت', path: '/prompt', gradient: 'from-violet-500 to-purple-600' },
    { icon: Import, label: 'ورود', path: '/import', gradient: 'from-blue-500 to-cyan-600' },
    { icon: Apple, label: 'تغذیه', path: '/nutrition', gradient: 'from-emerald-500 to-green-600' },
    { icon: Pill, label: 'مکمل', path: '/supplements', gradient: 'from-pink-500 to-rose-600' },
    { icon: Trophy, label: 'پیشرفت', path: '/progress', gradient: 'from-amber-500 to-orange-600' },
    { icon: Calendar, label: 'تقویم', path: '/calendar', gradient: 'from-sky-500 to-blue-600' },
    { icon: Zap, label: 'سوپرست', path: '/prompt', gradient: 'from-orange-500 to-red-600' },
  ];

  return (
    <div className={`min-h-screen pb-24 space-y-5 ${bgMain}`}>
      {/* Profile Switcher */}
      {profiles.length > 1 && (
        <div className={`rounded-2xl p-3 border ${borderCard} ${cardBg}`}>
          <div className="flex items-center gap-2 overflow-x-auto">
            <User size={16} style={{ color: teal }} />
            <div className="flex gap-2">
              {profiles.map(p => (
                <button key={p.id} onClick={() => { soundEffects.playClick(); setActiveProfile(p.id); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${p.id === profile?.id
                    ? `text-black shadow-md` : isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-teal-50 text-teal-800 hover:bg-teal-100'}`}
                  style={p.id === profile?.id ? { background: `linear-gradient(to left, ${teal}, ${tealLight})` } : {}}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Welcome Hero Card */}
      <div className={`rounded-3xl p-5 border ${borderCard} ${cardBg} relative overflow-hidden`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className={`text-sm font-bold ${textSub}`}>سلام، {profile?.name || 'ورزشکار'} 👋</p>
            <h2 className={`text-xl font-black mt-1 ${textMain}`}>مربی هوشمند تو</h2>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black"
            style={{ background: `${teal}20`, color: teal }}>
            {profile?.name?.charAt(0) || 'ع'}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={teal} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${weeklyProgress * 2.64} 264`} className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black ${textMain}`}>{toPersianNumber(Math.round(weeklyProgress))}%</span>
              <span className={`text-[9px] font-bold ${textSub}`}>هدف هفتگی</span>
            </div>
          </div>

          <div className="flex-1">
            <h3 className={`font-black text-base ${textMain}`}>عالیه، داری عالی پیش می‌ری!</h3>
            <p className={`text-xs mt-1 ${textSub}`}>تا حالا {toPersianNumber(weeklyCompleted)} جلسه از {toPersianNumber(weeklyGoal)} هدف رو کامل کردی</p>
            <div className={`mt-3 h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${weeklyProgress}%`, background: teal }} />
            </div>
            <p className={`text-[10px] mt-1 text-right ${textSub}`}>{toPersianNumber(weeklyCompleted)} از {toPersianNumber(weeklyGoal)}</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-2xl p-4 border ${borderCard} ${cardBg}`}>
          <div className="flex items-center gap-2 mb-3">
            <Flame size={18} style={{ color: '#f59e0b' }} />
            <span className={`text-xs font-bold ${textSub}`}>استریک تمرینی</span>
          </div>
          <p className={`text-3xl font-black ${textMain}`}>{toPersianNumber(currentStreak)} <span className="text-sm font-bold">روز</span></p>
          <div className="flex justify-between mt-4 gap-0.5">
            {streakDots.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] font-bold transition-all ${
                  d.active ? 'text-white shadow-sm' : (isDark ? 'bg-slate-800 text-slate-600' : 'bg-gray-100 text-gray-400')
                }`}
                style={d.active ? { background: teal } : {}}>
                  {d.label}
                </div>
                {d.isToday && <div className="w-1 h-1 rounded-full" style={{background: gold}} />}
              </div>
            ))}
          </div>
          <p className={`text-[10px] mt-3 text-center ${textSub}`}>عالی! استریکت رو حفظ کن.</p>
        </div>

        <div className={`rounded-2xl p-4 border ${borderCard} ${cardBg}`}>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={18} style={{ color: teal }} />
            <span className={`text-xs font-bold ${textSub}`}>آمار این هفته</span>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className={`text-xs ${textSub}`}>جلسات تمرین</span>
              <span className={`text-sm font-black flex items-center gap-1 ${textMain}`}><Dumbbell size={14} style={{ color: teal }} /> {toPersianNumber(weeklyCompleted)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${textSub}`}>مدت تمرین</span>
              <span className={`text-sm font-black flex items-center gap-1 ${textMain}`}><Activity size={14} style={{ color: teal }} /> {toPersianNumber(completedSessions.reduce((a, s) => a + (s.duration || 0), 0))} دقیقه</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${textSub}`}>کالری سوزانده</span>
              <span className={`text-sm font-black flex items-center gap-1 ${textMain}`}><Flame size={14} style={{ color: '#f59e0b' }} /> {toPersianNumber(Math.round(totalVolume * 0.1))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Big Start Workout Button - Only show if real program exists */}
      {!isTodayRest && todayWorkout && activeProgram && (
        <button onClick={() => { soundEffects.playClick(); navigate(`/workout?day=${todayDayIndex}&autoStart=true`); }}
          className="w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 text-white hover:brightness-110"
          style={{ background: `linear-gradient(to left, ${teal}, ${tealLight})` }}>
          <Dumbbell size={22} /> شروع تمرین امروز ({todayName})
        </button>
      )}

      {isTodayRest && activeProgram && (
        <div className={`rounded-2xl p-4 border ${borderCard} ${cardBg} flex items-center gap-3`}>
          <Heart size={20} style={{ color: '#ef4444' }} />
          <div>
            <p className={`font-bold text-sm ${textMain}`}>امروز ({todayName}) روز استراحته 💪</p>
            <p className={`text-xs ${textSub}`}>ریکاوری کن تا فردا قوی‌تر باشی!</p>
          </div>
        </div>
      )}

      {/* Colorful Animated Shortcut Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`font-black text-sm flex items-center gap-2 ${textMain}`}><Sparkles size={16} style={{ color: '#f59e0b' }} /> میانبرها</h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {shortcuts.map((item, i) => (
            <button key={i} onClick={() => { soundEffects.playClick(); navigate(item.path); }}
              className={`group relative flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 active:scale-90 hover:-translate-y-1 hover:shadow-lg overflow-hidden bg-gradient-to-br ${item.gradient}`}>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
              <div className="relative z-10 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
                <item.icon size={20} className="text-white drop-shadow-md" />
              </div>
              <span className="relative z-10 text-[10px] font-bold text-white drop-shadow-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Focus */}
      <div className={`rounded-2xl p-4 border ${borderCard} ${cardBg}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target size={16} style={{ color: teal }} />
            <span className={`text-xs font-bold ${textSub}`}>تمرکز امروز</span>
          </div>
          <button onClick={() => navigate('/workout')} className={`text-[10px] font-bold flex items-center gap-1 ${textSub}`} style={{ color: teal }}>
            مشاهده همه <ArrowUpRight size={12} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${teal}15` }}>
            <CheckCircle2 size={20} style={{ color: teal }} />
          </div>
          <div>
            <p className={`font-bold text-sm ${textMain}`}>قدرت و استقامت</p>
            <p className={`text-[10px] ${textSub}`}>یه جلسه عالی در انتظارت باشه 💪</p>
          </div>
        </div>
      </div>

      {/* ✅ حذف کامل SuggestedPrograms که منبع برنامه پیش‌فرض بود */}
    </div>
  );
}

function calculateStreak(sessions: any[]): number {
  if (sessions.length === 0) return 0;
  const completedDates = sessions.filter(s => s.completed).map(s => new Date(s.date).toDateString())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const unique = [...new Set(completedDates)];
  if (unique.length === 0) return 0;
  let streak = 1;
  for (let i = 0; i < unique.length - 1; i++) {
    const diff = (new Date(unique[i]).getTime() - new Date(unique[i + 1]).getTime()) / 86400000;
    if (diff <= 1) streak++; else break;
  }
  return streak;
}

function getWeekData(sessions: any[]) {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toDateString();
    const count = sessions.filter(s => s.completed && new Date(s.date).toDateString() === dateStr).length;
    result.push({ date: dateStr, sessions: count });
  }
  return result;
}
