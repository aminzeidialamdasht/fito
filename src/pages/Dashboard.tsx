import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { getPersianDate, toPersianNumber, getTodayJalali, getWeekdayName, getMonthName } from '../utils/jalali';
import { EXPERIENCE_LABELS, getGoalLabel } from '../types';
import { generateSupersetPrompt } from '../utils/promptGenerator';
import { soundEffects } from '../utils/sound';
import {
  Dumbbell, TrendingUp, Calendar, Target,
  Flame, Award, Activity, Clock, Sparkles,
  CheckCircle2, Timer, Zap, User, ChevronLeft,
  Trophy, TrendingDown, Heart, Apple, Pill, Brain,
  Copy, Check, X, Import
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../subscription/SubscriptionContext';
import { DEFAULT_WORKOUT_PLAN, DEFAULT_NUTRITION_PLAN, DEFAULT_SUPPLEMENT_PLAN, SAMPLE_PROFILE } from '../data/defaultPlans';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import DashboardHero from '../components/DashboardHero';
import SuggestedPrograms from '../components/SuggestedPrograms';

export default function Dashboard() {
  const { state, activeProfile, sessions, programs, progress, profiles, setActiveProfile, nutritionPrograms, supplementPrograms } = useAppContext();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const { isPremium } = useSubscription();
  const profile = activeProfile ?? (!isPremium ? SAMPLE_PROFILE : null);

  const [showSupersetModal, setShowSupersetModal] = useState(false);
  const [supersetDuration, setSupersetDuration] = useState(30);
  const [generatedSupersetPrompt, setGeneratedSupersetPrompt] = useState('');
  const [copiedSuperset, setCopiedSuperset] = useState(false);

  const completedSessions = sessions.filter(s => s.completed);
  const totalSessions = completedSessions.length;
  const totalVolume = completedSessions.reduce((acc, s) => acc + s.totalVolume, 0);
  const currentStreak = calculateStreak(sessions);

  const activeProgram = programs.find(p => p.id === state.activeProgram) || DEFAULT_WORKOUT_PLAN;
  const programAny = activeProgram as any;
  const programDays: any[] = Array.isArray(programAny?.days) ? programAny.days : [];
  const programRestDays: string[] = Array.isArray(programAny?.restDays) ? programAny.restDays : [];

  const hasExplicitSchedule =
    programDays.some((d: any) => typeof d?.weekday === 'string' && d.weekday.trim().length > 0) ||
    programRestDays.length > 0;

  const today = new Date();
  const dayOfWeek = (today.getDay() + 1) % 7;
  const WEEKDAY_NAMES = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
  const todayName = WEEKDAY_NAMES[dayOfWeek];

  const normalizePersian = (value?: string) =>
    String(value || '').replace(/\u200c|\u200f|\u200e/g, '').trim();

  const weekdayMatches = (value?: string, target?: string) => {
    const v = normalizePersian(value);
    const t = normalizePersian(target);
    if (!v || !t) return false;
    return v === t || v.includes(t);
  };

  const findProgramDayByWeekday = (name: string) =>
    programDays.find((d: any) => weekdayMatches(d?.weekday, name) || weekdayMatches(d?.day, name));

  const todayWorkout = hasExplicitSchedule
    ? findProgramDayByWeekday(todayName)
    : programDays.length
      ? programDays[dayOfWeek % programDays.length]
      : undefined;

  const isTodayRest = hasExplicitSchedule && !todayWorkout;
  const todayDayIndex = todayWorkout ? programDays.indexOf(todayWorkout) : -1;

  const nextTrainingDayIndex = (() => {
    if (todayDayIndex !== -1) return todayDayIndex;
    if (!hasExplicitSchedule) return 0;

    for (let offset = 1; offset <= 7; offset++) {
      const idx = (dayOfWeek + offset) % 7;
      const found = findProgramDayByWeekday(WEEKDAY_NAMES[idx]);
      if (found) return programDays.indexOf(found);
    }

    return 0;
  })();

  const getExercises = (day: any): any[] => Array.isArray(day?.exercises) ? day.exercises : [];
  const todayExercises = getExercises(todayWorkout);

  const todayMuscleGroups: string[] = Array.isArray((todayWorkout as any)?.muscleGroups)
    ? (todayWorkout as any).muscleGroups
    : Array.isArray((todayWorkout as any)?.muscle_groups)
      ? (todayWorkout as any).muscle_groups
      : [];

  const activeNutrition = nutritionPrograms.find(p => p.id === state.activeNutritionProgram) || nutritionPrograms[0] || (!isPremium ? DEFAULT_NUTRITION_PLAN : null);
  const activeSupplement = supplementPrograms.find(p => p.id === state.activeSupplementProgram) || supplementPrograms[0] || (!isPremium ? DEFAULT_SUPPLEMENT_PLAN : null);

  const todayNutritionDay = activeNutrition?.days?.find((d: any) =>
    weekdayMatches(d?.day, todayName)
  ) || activeNutrition?.days?.[dayOfWeek % (activeNutrition?.days?.length || 1)];

  const lastSession = completedSessions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const weekData = getWeekData(sessions);
  const weeklyGoal = profile?.trainingDays || 4;
  const weeklyCompleted = weekData.filter(d => d.sessions > 0).length;
  const weeklyProgress = Math.min(100, (weeklyCompleted / weeklyGoal) * 100);

  const weightData = progress.slice(-10).map(p => ({
    date: p.date.split('-').slice(1).join('/'),
    weight: p.weight,
  }));

  const handleOpenSupersetModal = () => {
    soundEffects.playClick();
    if (profile) {
      const prompt = generateSupersetPrompt(profile, supersetDuration);
      setGeneratedSupersetPrompt(prompt);
    }
    setShowSupersetModal(true);
  };

  const handleCopySupersetPrompt = () => {
    soundEffects.playClick();
    navigator.clipboard.writeText(generatedSupersetPrompt);
    setCopiedSuperset(true);
    setTimeout(() => setCopiedSuperset(false), 2000);
  };

  const getSessionDuration = (session: any) => {
    if (!session.startTime || !session.endTime) return null;
    const start = new Date(session.startTime).getTime();
    const end = new Date(session.endTime).getTime();
    const minutes = Math.floor((end - start) / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${toPersianNumber(hours)} ساعت و ${toPersianNumber(mins)} دقیقه`;
    return `${toPersianNumber(minutes)} دقیقه`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {profiles.length > 1 && (
        <div className={`rounded-2xl p-3 border theme-transition ${
          isDark ? 'bg-[#16162a]/80 border-teal-500/20' : 'bg-white border-teal-500/20 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 overflow-x-auto">
            <User size={16} className={isDark ? 'text-teal-400' : 'text-teal-600'} />
            <div className="flex gap-2">
              {profiles.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setActiveProfile(p.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    p.id === profile?.id
                      ? isDark
                        ? 'bg-gradient-to-l from-teal-400 to-emerald-400 text-slate-950 font-black shadow-md shadow-teal-500/20'
                        : 'bg-gradient-to-l from-teal-600 to-emerald-600 text-white font-black shadow-md shadow-teal-600/20'
                      : isDark
                        ? 'bg-slate-900 text-slate-400 hover:text-white'
                        : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isPremium && programs.length === 0 && (
        <div className={`rounded-2xl p-4 border-2 border-dashed mb-4 ${isDark ? 'bg-amber-950/20 border-amber-500/50' : 'bg-amber-50 border-amber-400'}`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
              <Sparkles size={20} />
            </div>
            <div className="flex-1">
              <h3 className={`font-black text-sm mb-1 ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>🎁 این یک برنامه نمونه است</h3>
              <p className={`text-xs leading-5 ${isDark ? 'text-amber-200/80' : 'text-amber-700'}`}>برای دریافت برنامه اختصاصی هوش مصنوعی، <button onClick={() => navigate('/prompt')} className="font-black underline">اشتراک تهیه کنید</button>.</p>
            </div>
          </div>
        </div>
      )}

      <DashboardHero
        isDark={isDark}
        isPremium={isPremium}
        profileName={profile?.name}
        isTodayRest={!!isTodayRest}
        todayDayIndex={todayDayIndex}
        nextTrainingDayIndex={nextTrainingDayIndex}
        weeklyCompleted={weeklyCompleted}
        weeklyGoal={weeklyGoal}
        weeklyProgress={weeklyProgress}
        currentStreak={currentStreak}
        lastSession={lastSession}
        getSessionDuration={getSessionDuration}
      />

      <SuggestedPrograms isDark={isDark} isPremium={isPremium} />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`font-black text-lg flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <Sparkles size={18} className="text-amber-400" />
            دسته‌بندی‌ها و میانبرها
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div onClick={() => { soundEffects.playClick(); navigate('/workout'); }} className={`group cursor-pointer rounded-2xl p-4 border transition-all active:scale-95 ${
            isDark ? 'bg-gradient-to-br from-teal-950/60 via-slate-900 to-emerald-950/40 border-teal-500/30' : 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white border-transparent'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-white/20 text-white'}`}><Dumbbell size={22} /></div>
              <ChevronLeft size={16} className={isDark ? 'text-teal-400' : 'text-white'} />
            </div>
            <h3 className="font-black text-sm text-white">اجرا و ترکر</h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-teal-300/70' : 'text-teal-100'}`}>ثبت ست‌ها و زمان</p>
          </div>

          <div onClick={handleOpenSupersetModal} className={`group cursor-pointer rounded-2xl p-4 border transition-all active:scale-95 relative overflow-hidden ${
            isDark ? 'bg-gradient-to-br from-amber-950/60 via-slate-900 to-orange-950/40 border-amber-500/40' : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-transparent'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-white/20 text-white'}`}><Zap size={22} /></div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${isDark ? 'bg-amber-500/30 text-amber-300' : 'bg-white/30 text-white'}`}>ویژه</span>
            </div>
            <h3 className={`font-black text-sm ${isDark ? 'text-amber-300' : 'text-white'}`}>پرامپت سوپرست</h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-amber-200/70' : 'text-amber-100'}`}>تمرین فشرده روزانه</p>
          </div>

          <div onClick={() => { soundEffects.playClick(); navigate('/prompt'); }} className={`group cursor-pointer rounded-2xl p-4 border transition-all active:scale-95 ${
            isDark ? 'bg-gradient-to-br from-indigo-950/60 via-slate-900 to-violet-950/40 border-indigo-500/30' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-transparent'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/20 text-white'}`}><Brain size={22} /></div>
              <ChevronLeft size={16} className={isDark ? 'text-indigo-400' : 'text-white'} />
            </div>
            <h3 className="font-black text-sm text-white">مولد پرامپت</h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-indigo-300/70' : 'text-indigo-100'}`}>تولید پرامپت هوشمند</p>
          </div>

          <div onClick={() => { soundEffects.playClick(); navigate('/import'); }} className={`group cursor-pointer rounded-2xl p-4 border transition-all active:scale-95 ${
            isDark ? 'bg-gradient-to-br from-blue-950/60 via-slate-900 to-cyan-950/40 border-blue-500/30' : 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-transparent'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-white/20 text-white'}`}><Import size={22} /></div>
              <ChevronLeft size={16} className={isDark ? 'text-blue-400' : 'text-white'} />
            </div>
            <h3 className="font-black text-sm text-white">ورود برنامه</h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-blue-300/70' : 'text-blue-100'}`}>ثبت JSON دریافتی</p>
          </div>

          <div onClick={() => { soundEffects.playClick(); navigate('/nutrition'); }} className={`group cursor-pointer rounded-2xl p-4 border transition-all active:scale-95 ${
            isDark ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-green-950/40 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-500 to-green-600 text-white border-transparent'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/20 text-white'}`}><Apple size={22} /></div>
              <ChevronLeft size={16} className={isDark ? 'text-emerald-400' : 'text-white'} />
            </div>
            <h3 className="font-black text-sm text-white">برنامه تغذیه</h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-emerald-300/70' : 'text-emerald-100'}`}>وعده‌ها و کالری</p>
          </div>

          <div onClick={() => { soundEffects.playClick(); navigate('/supplements'); }} className={`group cursor-pointer rounded-2xl p-4 border transition-all active:scale-95 ${
            isDark ? 'bg-gradient-to-br from-rose-950/60 via-slate-900 to-pink-950/40 border-rose-500/30' : 'bg-gradient-to-br from-rose-500 to-pink-600 text-white border-transparent'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-rose-500/20 text-rose-300' : 'bg-white/20 text-white'}`}><Pill size={22} /></div>
              <ChevronLeft size={16} className={isDark ? 'text-rose-400' : 'text-white'} />
            </div>
            <h3 className="font-black text-sm text-white">مکمل‌ها</h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-rose-300/70' : 'text-rose-100'}`}>زمان‌بندی و دوز</p>
          </div>

          <div onClick={() => { soundEffects.playClick(); navigate('/progress'); }} className={`group cursor-pointer rounded-2xl p-4 border transition-all active:scale-95 ${
            isDark ? 'bg-gradient-to-br from-fuchsia-950/60 via-slate-900 to-purple-950/40 border-fuchsia-500/30' : 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white border-transparent'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'bg-white/20 text-white'}`}><Trophy size={22} /></div>
              <ChevronLeft size={16} className={isDark ? 'text-fuchsia-400' : 'text-white'} />
            </div>
            <h3 className="font-black text-sm text-white">پیشرفت</h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-fuchsia-300/70' : 'text-fuchsia-100'}`}>نمودار و آمار</p>
          </div>

          <div onClick={() => { soundEffects.playClick(); navigate('/calendar'); }} className={`group cursor-pointer rounded-2xl p-4 border transition-all active:scale-95 ${
            isDark ? 'bg-gradient-to-br from-sky-950/60 via-slate-900 to-blue-950/40 border-sky-500/30' : 'bg-gradient-to-br from-sky-500 to-blue-600 text-white border-transparent'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-sky-500/20 text-sky-300' : 'bg-white/20 text-white'}`}><Calendar size={22} /></div>
              <ChevronLeft size={16} className={isDark ? 'text-sky-400' : 'text-white'} />
            </div>
            <h3 className="font-black text-sm text-white">تقویم</h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-sky-300/70' : 'text-sky-100'}`}>برنامه هفتگی</p>
          </div>
        </div>
      </div>

      {todayWorkout && !isTodayRest && (
        <div className={`rounded-2xl p-4 border ${isDark ? 'bg-[#1a1a2e] border-white/5' : 'bg-white border-teal-100 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Dumbbell size={16} className={isDark ? 'text-[#d4af37]' : 'text-teal-600'} />
              <span className={`text-xs font-black ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>برنامه امروز</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-100 text-teal-700'}`}>{todayName}</span>
          </div>
          <h3 className={`font-black text-base mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{(todayWorkout as any).name || (todayWorkout as any).title || 'تمرین امروز'}</h3>
          {todayMuscleGroups.length > 0 && (
            <p className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{todayMuscleGroups.join(' · ')}</p>
          )}
          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{toPersianNumber(todayExercises.length)} حرکت</p>
          <button
            onClick={() => { soundEffects.playClick(); navigate(`/workout?day=${todayDayIndex}&autoStart=true`); }}
            className={`mt-3 w-full py-2.5 rounded-xl font-bold text-sm ${isDark ? 'bg-[#d4af37]/20 text-[#d4af37]' : 'bg-teal-100 text-teal-700'}`}
          >
            شروع این جلسه
          </button>
        </div>
      )}

      {isTodayRest && (
        <div className={`rounded-2xl p-4 border ${isDark ? 'bg-[#1a1a2e] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Heart size={16} className="text-rose-400" />
            <span className={`text-xs font-black ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>روز استراحت</span>
          </div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>امروز روز ریکاوری است. می‌توانی جلسه بعدی را زودتر شروع کنی.</p>
          {programRestDays.length > 0 && (
            <p className={`text-[11px] mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>روزهای استراحت برنامه: {programRestDays.join('، ')}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<Flame size={20} />} label="استریک" value={toPersianNumber(currentStreak)} subtext="روز متوالی" color="text-orange-400" bgColor="bg-orange-500/20" borderColor={isDark ? 'border-orange-500/20' : 'border-orange-200'} isDark={isDark} />
        <StatCard icon={<Activity size={20} />} label="حجم کل" value={toPersianNumber(Math.round(totalVolume))} subtext="کیلوگرم" color="text-teal-400" bgColor="bg-teal-500/20" borderColor={isDark ? 'border-teal-500/20' : 'border-teal-200'} isDark={isDark} />
        <StatCard icon={<Trophy size={20} />} label="جلسات" value={toPersianNumber(totalSessions)} subtext="تکمیل‌شده" color="text-amber-400" bgColor="bg-amber-500/20" borderColor={isDark ? 'border-amber-500/20' : 'border-amber-200'} isDark={isDark} />
        <StatCard icon={<Target size={20} />} label="هدف هفته" value={`${toPersianNumber(weeklyCompleted)}/${toPersianNumber(weeklyGoal)}`} subtext="جلسه موفق" color="text-sky-400" bgColor="bg-sky-500/20" borderColor={isDark ? 'border-sky-500/20' : 'border-sky-200'} isDark={isDark} progress={weeklyProgress} />
      </div>

      {activeNutrition && todayNutritionDay && (
        <div className={`rounded-2xl p-4 border ${isDark ? 'bg-[#1a1a2e] border-emerald-500/20' : 'bg-white border-emerald-100 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Apple size={16} className="text-emerald-400" />
              <h3 className={`font-black text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>برنامه تغذیه امروز</h3>
            </div>
            <button onClick={() => { soundEffects.playClick(); navigate('/nutrition'); }} className="text-xs font-bold text-emerald-400 hover:underline">مشاهده برنامه ←</button>
          </div>
          <div className="space-y-2">
            {(Array.isArray((todayNutritionDay as any).meals) ? (todayNutritionDay as any).meals : []).slice(0, 3).map((m: any, i: number) => (
              <div key={i} className={`text-xs rounded-lg px-3 py-2 ${isDark ? 'bg-slate-900/50' : 'bg-emerald-50'}`}>
                <span className="font-bold">{m.name || m.meal || `وعده ${i + 1}`}</span>
                {m.calories != null && <span className={`mr-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}> · {toPersianNumber(m.calories)} کالری</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {showSupersetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowSupersetModal(false)}>
          <div className={`w-full max-w-xl rounded-3xl p-6 border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-[#12121f] border-amber-500/30' : 'bg-white border-amber-200'
          }`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className={`font-black text-lg flex items-center gap-2 ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                <Zap size={20} /> پرامپت سوپرست فشرده
              </h3>
              <button onClick={() => setShowSupersetModal(false)} className={isDark ? 'text-slate-400' : 'text-slate-500'}><X size={20} /></button>
            </div>
            <div className="flex items-center gap-3">
              <label className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>مدت (دقیقه):</label>
              <input type="number" min={15} max={90} value={supersetDuration} onChange={e => {
                const v = parseInt(e.target.value) || 30;
                setSupersetDuration(v);
                if (profile) setGeneratedSupersetPrompt(generateSupersetPrompt(profile, v));
              }} className={`w-20 px-2 py-1 rounded-lg text-sm border ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`} />
            </div>
            <textarea readOnly value={generatedSupersetPrompt} rows={12} className={`w-full text-xs p-3 rounded-xl border font-mono ${isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`} />
            <button onClick={handleCopySupersetPrompt} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-800'}`}>
              {copiedSuperset ? <><Check size={18} /> کپی شد</> : <><Copy size={18} /> کپی پرامپت</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, subtext, color, bgColor, borderColor, isDark, progress }: {
  icon: React.ReactNode; label: string; value: string; subtext: string;
  color: string; bgColor: string; borderColor: string; isDark: boolean; progress?: number;
}) {
  return (
    <div className={`rounded-2xl p-4 border ${borderColor} ${isDark ? 'bg-[#1a1a2e]' : 'bg-white shadow-sm'}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgColor} ${color}`}>{icon}</div>
        <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
      </div>
      <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</p>
      <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{subtext}</p>
      {progress != null && (
        <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <div className={`h-full rounded-full ${isDark ? 'bg-[#d4af37]' : 'bg-teal-500'}`} style={{ width: `${progress}%` }} />
        </div>
      )}
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
    if (diff <= 1) streak++;
    else break;
  }
  return streak;
}

function getWeekData(sessions: any[]) {
  const days = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toDateString();
    const count = sessions.filter(s => s.completed && new Date(s.date).toDateString() === dateStr).length;
    const dayOfWeek = (d.getDay() + 1) % 7;
    result.push({ day: days[dayOfWeek], sessions: count });
  }
  return result;
}
