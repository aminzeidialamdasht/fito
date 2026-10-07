import { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useSubscription } from '../hooks/useSubscription';
import { useTheme } from '../context/ThemeContext';
import { toPersianNumber } from '../utils/jalali';
import { soundEffects } from '../utils/sound';
import {
  Dumbbell, Trophy, Flame, Apple, Pill, Brain,
  Calendar, User, Sparkles, Target, Activity,
  CheckCircle2, Heart, BarChart3,
  Zap, ArrowUpRight, Plus, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FEATURE_FLAGS } from '../engine/version';
import { getTokens } from '../styles/designTokens';
import Card from '../components/ui/Card';
import Toast from '../components/ui/Toast';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';

const isStoreBuild = ['bazaar', 'myket'].includes(import.meta.env.VITE_APP_FLAVOR || '');

type GeneratorKey = 'workout' | 'nutrition' | 'supplement' | 'compact';

export default function Dashboard() {
  const { state, activeProfile, sessions, programs, profiles, setActiveProfile } = useAppContext();
  const sub = useSubscription();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const tokens = getTokens(isDark);

  const profile = activeProfile;

  // رنگ‌ها از Design Tokens
  const teal = tokens.accent;
  const tealLight = tokens.accent;
  const gold = tokens.gold;
  const bgMain = tokens.bg;
  const cardBg = '';
  const textMain = tokens.textMain;
  const textSub = tokens.textSub;
  const borderCard = '';

  // آمار
  const completedSessions = sessions.filter(s => s.completed);
  const currentStreak = calculateStreak(sessions);

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

  // ۴ ژنراتور اصلی
  const generators: Array<{
    key: GeneratorKey;
    icon: any;
    title: string;
    subtitle: string;
    enabled: boolean;
    gradient: string;
    path: string;
  }> = [
    {
      key: 'workout',
      icon: Dumbbell,
      title: 'برنامه تمرینی',
      subtitle: 'تولید خودکار آفلاین',
      enabled: FEATURE_FLAGS.offlineWorkout,
      gradient: 'from-indigo-600 via-violet-600 to-purple-600',
      path: '/generate/workout',
    },
    {
      key: 'nutrition',
      icon: Apple,
      title: 'برنامه تغذیه',
      subtitle: FEATURE_FLAGS.offlineNutrition ? 'تولید خودکار' : 'به‌زودی',
      enabled: FEATURE_FLAGS.offlineNutrition,
      gradient: 'from-amber-500 via-orange-500 to-rose-500',
      path: '/generate/nutrition',
    },
    {
      key: 'supplement',
      icon: Pill,
      title: 'برنامه مکمل',
      subtitle: FEATURE_FLAGS.offlineSupplements ? 'تولید خودکار' : 'به‌زودی',
      enabled: FEATURE_FLAGS.offlineSupplements,
      gradient: 'from-violet-600 via-fuchsia-500 to-pink-500',
      path: '/generate/supplement',
    },
    {
      key: 'compact',
      icon: Zap,
      title: 'برنامه فشرده',
      subtitle: FEATURE_FLAGS.compactWorkout ? 'تک‌جلسه‌ای' : 'به‌زودی',
      enabled: FEATURE_FLAGS.compactWorkout,
      gradient: 'from-violet-500 via-blue-600 to-indigo-700',
      path: '/generate/compact',
    },
  ];

  const handleGeneratorClick = (gen: typeof generators[number]) => {
    if (!gen.enabled) {
      soundEffects.playClick();
      setToastMessage(`${gen.title} به‌زودی در دسترس خواهد بود!`);
      setShowToast(true);
      return;
    }

    // محدودیت برنامه تمرینی: ۱ برنامه رایگان
    if (gen.key === 'workout' && !sub.canCreateProgram(programs.length)) {
      soundEffects.playClick();
      navigate('/subscription');
      return;
    }

    // تغذیه: نیاز به اشتراک از ابتدا
    if (gen.key === 'nutrition' && !sub.canAccessNutrition) {
      soundEffects.playClick();
      navigate('/subscription');
      return;
    }

    // مکمل: نیاز به اشتراک از ابتدا
    if (gen.key === 'supplement' && !sub.canAccessSupplement) {
      soundEffects.playClick();
      navigate('/subscription');
      return;
    }

    soundEffects.playClick();
    navigate(gen.path);
  };


  return (
    <div className={`min-h-screen pb-24 space-y-5 ${bgMain}`}>
      {/* Profile Switcher */}
      {profiles.length > 1 && (
        <Card className="p-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <User size={16} style={{ color: teal }} />
            <div className="flex gap-2">
              {profiles.map(p => (
                <button key={p.id} onClick={() => { soundEffects.playClick(); setActiveProfile(p.id); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${p.id === profile?.id
                    ? `text-black shadow-md` : isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-violet-50 text-violet-800 hover:bg-violet-100'}`}
                  style={p.id === profile?.id ? { background: `linear-gradient(to left, ${teal}, ${tealLight})` } : {}}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Welcome Hero */}
      <div
        className="rounded-3xl p-5 relative overflow-hidden shadow-xl"
        style={{ background: `linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #6d28d9 75%, #a78bfa 130%)` }}
      >
        {/* دایره‌های تزئینی */}
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full opacity-20 bg-white" />
        <div className="absolute -bottom-20 -right-12 w-56 h-56 rounded-full opacity-10 bg-white" />

        {/* واترمارک لوگوی Fito در وسط و بزرگ */}
        <img
          src="/fito-logo-transparent.png"
          alt=""
          aria-hidden="true"
          className="absolute pointer-events-none select-none"
          style={{
            top: '50%',
            left: '50%',
            width: '85%',
            height: '85%',
            maxWidth: '320px',
            maxHeight: '320px',
            transform: 'translate(-50%, -50%)',
            opacity: 0.12,
            filter: 'brightness(1.5)',
          }}
        />
        <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white/90">سلام، {profile?.name || 'ورزشکار'} 👋</p>
            <h2 className="text-xl font-black mt-1 text-white">مربی اختصاصی تو</h2>
            <p className="text-xs mt-1 text-white/80">امروز {todayName}</p>
          </div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black backdrop-blur-md shrink-0"
            style={{ background: 'rgba(255,255,255,0.25)', color: '#ffffff' }}>
            {profile?.name?.charAt(0) || 'ع'}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${weeklyProgress * 2.64} 264`} className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-white">{toPersianNumber(Math.round(weeklyProgress))}%</span>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="font-black text-sm text-white">هدف هفتگی</h3>
            <p className="text-xs mt-1 text-white/80">{toPersianNumber(weeklyCompleted)} از {toPersianNumber(weeklyGoal)} جلسه</p>
          </div>
        </div>
      </div></div>

      {/* 🎯 4 Main Generators */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`font-black text-base flex items-center gap-2 ${textMain}`}>
            <Sparkles size={18} style={{ color: gold }} />
            تولید برنامه با یک کلیک
          </h2>
          <Badge color="info" size="sm">
            آفلاین
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {generators.map((gen) => (
            <button
              key={gen.key}
              onClick={() => handleGeneratorClick(gen)}
              disabled={!gen.enabled}
              className={`relative group flex flex-col items-start gap-2 p-4 rounded-2xl transition-all duration-300 overflow-hidden text-left ${
                gen.enabled
                  ? `bg-gradient-to-br ${gen.gradient} hover:-translate-y-1 hover:shadow-lg active:scale-95`
                  : isDark ? 'bg-slate-800/50 cursor-not-allowed' : 'bg-gray-100 cursor-not-allowed'
              }`}
            >
              {/* Shine effect */}
              {gen.enabled && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
              )}

              <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center ${
                gen.enabled ? 'bg-white/20 backdrop-blur-sm' : isDark ? 'bg-slate-700' : 'bg-gray-200'
              }`}>
                <gen.icon size={24} className={gen.enabled ? 'text-white drop-shadow-md' : textSub} />
              </div>

              <div className="relative z-10">
                <p className={`font-black text-sm ${gen.enabled ? 'text-white drop-shadow-sm' : textMain}`}>
                  {gen.title}
                </p>
                <p className={`text-[10px] mt-0.5 ${gen.enabled ? 'text-white/80' : textSub}`}>
                  {gen.subtitle}
                </p>
              </div>

              {!gen.enabled && (
                <div className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-300 text-gray-600'
                }`}>
                  به‌زودی
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Start Today's Workout */}
      {!isTodayRest && todayWorkout && activeProgram && (
        <button
          onClick={() => { soundEffects.playClick(); navigate('/today-session'); }}
          className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 text-white hover:brightness-110"
          style={{ background: `linear-gradient(to left, ${teal}, ${tealLight})` }}
        >
          <Dumbbell size={22} /> شروع تمرین امروز ({todayName})
        </button>
      )}

      {isTodayRest && activeProgram && (
        <Card className="flex items-center gap-3 p-4">
          <Heart size={20} style={{ color: '#ef4444' }} />
          <div>
            <p className={`font-bold text-sm ${textMain}`}>امروز ({todayName}) روز استراحته 💪</p>
            <p className={`text-xs ${textSub}`}>ریکاوری کن تا فردا قوی‌تر باشی!</p>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flame size={18} style={{ color: '#f59e0b' }} />
            <span className={`text-xs font-bold ${textSub}`}>استریک</span>
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
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={18} style={{ color: teal }} />
            <span className={`text-xs font-bold ${textSub}`}>این هفته</span>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className={`text-xs ${textSub}`}>جلسات</span>
              <span className={`text-sm font-black flex items-center gap-1 ${textMain}`}>
                <Dumbbell size={14} style={{ color: teal }} /> {toPersianNumber(weeklyCompleted)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${textSub}`}>مدت</span>
              <span className={`text-sm font-black flex items-center gap-1 ${textMain}`}>
                <Activity size={14} style={{ color: teal }} /> {toPersianNumber(completedSessions.reduce((a, s) => a + (s.duration || 0), 0))}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${textSub}`}>کالری</span>
              <span className={`text-sm font-black flex items-center gap-1 ${textMain}`}>
                <Flame size={14} style={{ color: '#f59e0b' }} /> {toPersianNumber(Math.round(totalVolume * 0.1))}
              </span>
            </div>

            {/* ProgressBar پیشرفت هفتگی */}
            <div className="pt-2 border-t" style={{ borderColor: tokens.border }}>
              <ProgressBar
                value={weeklyProgress}
                color="accent"
                size="sm"
                showLabel
                label="پیشرفت هفتگی"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* My Programs */}
      {programs.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-black text-sm flex items-center gap-2 ${textMain}`}>
              <Target size={16} style={{ color: teal }} />
              برنامه‌های من
            </h3>
            <button
              onClick={() => navigate('/workouts')}
              className="text-[10px] font-bold flex items-center gap-1"
              style={{ color: teal }}
            >
              مشاهده همه <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {programs.slice(0, 3).map((p) => (
              <button
                key={p.id}
                onClick={() => navigate('/workouts')}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${teal}20` }}>
                    <Dumbbell size={16} style={{ color: teal }} />
                  </div>
                  <div className="text-right min-w-0 flex-1">
                    <p className={`text-xs font-bold truncate ${textMain}`}>{p.name}</p>
                    <p className={`text-[10px] ${textSub}`}>{toPersianNumber((p as any).days?.length || 0)} روز تمرین</p>
                  </div>
                </div>
                {p.id === state.activeProgram && (
                  <Badge color="success" size="sm">
                    فعال
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </Card>
      )}

      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        type="info"
        duration={2500}
      />
    </div>
  );
}

// ============================================
// Helper Functions
// ============================================

function calculateStreak(sessions: any[]): number {
  if (!sessions.length) return 0;
  const completed = sessions.filter(s => s.completed);
  if (!completed.length) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toDateString();
    const hasSession = completed.some(s => new Date(s.date).toDateString() === dateStr);
    if (hasSession) streak++;
    else if (i > 0) break;
  }
  return streak;
}

function getWeekData(sessions: any[]): Array<{ date: string; sessions: number }> {
  const today = new Date();
  const dayOfWeek = (today.getDay() + 1) % 7;
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);

  const week: Array<{ date: string; sessions: number }> = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const dateStr = d.toDateString();
    const count = sessions.filter(s => s.completed && new Date(s.date).toDateString() === dateStr).length;
    week.push({ date: dateStr, sessions: count });
  }
  return week;
}
