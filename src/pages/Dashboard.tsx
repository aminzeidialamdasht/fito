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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Dashboard() {
  const { state, activeProfile, sessions, programs, progress, profiles, setActiveProfile, nutritionPrograms, supplementPrograms } = useAppContext();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const profile = activeProfile;

  const [showSupersetModal, setShowSupersetModal] = useState(false);
  const [supersetDuration, setSupersetDuration] = useState(30);
  const [generatedSupersetPrompt, setGeneratedSupersetPrompt] = useState('');
  const [copiedSuperset, setCopiedSuperset] = useState(false);

  const completedSessions = sessions.filter(s => s.completed);
  const totalSessions = completedSessions.length;
  const totalVolume = completedSessions.reduce((acc, s) => acc + s.totalVolume, 0);
  const currentStreak = calculateStreak(sessions);
  const activeProgram = programs.find(p => p.id === state.activeProgram);

  const today = new Date();
  const dayOfWeek = (today.getDay() + 1) % 7;
  const todayWorkout = activeProgram?.days[dayOfWeek % (activeProgram?.days.length || 1)];

  const activeNutrition = nutritionPrograms.find(p => p.id === state.activeNutritionProgram) || nutritionPrograms[0];
  const activeSupplement = supplementPrograms.find(p => p.id === state.activeSupplementProgram) || supplementPrograms[0];
  const WEEKDAY_NAMES = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
  const todayNutritionDay = activeNutrition?.days?.find(d =>
    d.day.includes(WEEKDAY_NAMES[dayOfWeek]) || d.day === WEEKDAY_NAMES[dayOfWeek]
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
      {/* Athlete Selector Header */}
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

      {/* Colorful Category Feature Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`font-black text-lg flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <Sparkles size={18} className="text-amber-400" />
            دسته‌بندی‌ها و میانبرها
          </h2>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            دسترسی سریع به امکانات
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Workout Express */}
          <div
            onClick={() => {
              soundEffects.playClick();
              navigate('/workout');
            }}
            className={`group cursor-pointer rounded-2xl p-4 border transition-all duration-200 active:scale-95 hover:shadow-lg ${
              isDark
                ? 'bg-gradient-to-br from-teal-950/60 via-slate-900 to-emerald-950/40 border-teal-500/30 hover:border-teal-400'
                : 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white border-transparent hover:brightness-105'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-white/20 text-white'
              }`}>
                <Dumbbell size={22} />
              </div>
              <ChevronLeft size={16} className={`transition-transform group-hover:-translate-x-1 ${
                isDark ? 'text-teal-400' : 'text-white'
              }`} />
            </div>
            <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-white'}`}>اجرا و ترکر</h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-teal-300/70' : 'text-teal-100'}`}>ثبت ست‌ها و زمان</p>
          </div>

          {/* Special Intense Superset Prompt (High Priority Feature) */}
          <div
            onClick={handleOpenSupersetModal}
            className={`group cursor-pointer rounded-2xl p-4 border transition-all duration-200 active:scale-95 hover:shadow-lg relative overflow-hidden ${
              isDark
                ? 'bg-gradient-to-br from-amber-950/60 via-slate-900 to-orange-950/40 border-amber-500/40 hover:border-amber-400'
                : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-transparent hover:brightness-105'
            }`}
          >
            <div className="absolute top-0 left-0 w-20 h-20 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-white/20 text-white'
              }`}>
                <Zap size={22} />
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                isDark ? 'bg-amber-500/30 text-amber-300' : 'bg-white/30 text-white'
              }`}>ویژه</span>
            </div>
            <h3 className={`font-black text-sm ${isDark ? 'text-amber-300' : 'text-white'}`}>پرامپت سوپرست</h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-amber-200/70' : 'text-amber-100'}`}>تمرین فشرده روزانه</p>
          </div>

          {/* AI Prompt Generator */}
          <div
            onClick={() => {
              soundEffects.playClick();
              navigate('/prompt');
            }}
            className={`group cursor-pointer rounded-2xl p-4 border transition-all duration-200 active:scale-95 hover:shadow-lg ${
              isDark
                ? 'bg-gradient-to-br from-indigo-950/60 via-slate-900 to-violet-950/40 border-indigo-500/30 hover:border-indigo-400'
                : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-transparent hover:brightness-105'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/20 text-white'
              }`}>
                <Brain size={22} />
              </div>
              <ChevronLeft size={16} className={`transition-transform group-hover:-translate-x-1 ${
                isDark ? 'text-indigo-400' : 'text-white'
              }`} />
            </div>
            <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-white'}`}>مولد پرامپت</h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-indigo-300/70' : 'text-indigo-100'}`}>تولید پرامپت هوشمند</p>
          </div>

          {/* Import JSON Program */}
          <div
            onClick={() => {
              soundEffects.playClick();
              navigate('/import');
            }}
            className={`group cursor-pointer rounded-2xl p-4 border transition-all duration-200 active:scale-95 hover:shadow-lg ${
              isDark
                ? 'bg-gradient-to-br from-blue-950/60 via-slate-900 to-cyan-950/40 border-blue-500/30 hover:border-blue-400'
                : 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-transparent hover:brightness-105'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-white/20 text-white'
              }`}>
                <Import size={22} />
              </div>
              <ChevronLeft size={16} className={`transition-transform group-hover:-translate-x-1 ${
                isDark ? 'text-blue-400' : 'text-white'
              }`} />
            </div>
            <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-white'}`}>ورود برنامه</h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-blue-300/70' : 'text-blue-100'}`}>ثبت JSON دریافتی</p>
          </div>

          {/* Nutrition */}
          <div
            onClick={() => {
              soundEffects.playClick();
              navigate('/nutrition');
            }}
            className={`group cursor-pointer rounded-2xl p-4 border transition-all duration-200 active:scale-95 hover:shadow-lg ${
              isDark
                ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-green-950/40 border-emerald-500/30 hover:border-emerald-400'
                : 'bg-gradient-to-br from-emerald-500 to-green-600 text-white border-transparent hover:brightness-105'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/20 text-white'
              }`}>
                <Apple size={22} />
              </div>
              <ChevronLeft size={16} className={`transition-transform group-hover:-translate-x-1 ${
                isDark ? 'text-emerald-400' : 'text-white'
              }`} />
            </div>
            <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-white'}`}>برنامه تغذیه</h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-emerald-300/70' : 'text-emerald-100'}`}>وعده‌ها و کالری</p>
          </div>

          {/* Supplements */}
          <div
            onClick={() => {
              soundEffects.playClick();
              navigate('/supplements');
            }}
            className={`group cursor-pointer rounded-2xl p-4 border transition-all duration-200 active:scale-95 hover:shadow-lg ${
              isDark
                ? 'bg-gradient-to-br from-rose-950/60 via-slate-900 to-pink-950/40 border-rose-500/30 hover:border-rose-400'
                : 'bg-gradient-to-br from-rose-500 to-pink-600 text-white border-transparent hover:brightness-105'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-rose-500/20 text-rose-300' : 'bg-white/20 text-white'
              }`}>
                <Pill size={22} />
              </div>
              <ChevronLeft size={16} className={`transition-transform group-hover:-translate-x-1 ${
                isDark ? 'text-rose-400' : 'text-white'
              }`} />
            </div>
            <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-white'}`}>مکمل‌ها</h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-rose-300/70' : 'text-rose-100'}`}>زمان‌بندی و دوز</p>
          </div>

          {/* Progress Analytics */}
          <div
            onClick={() => {
              soundEffects.playClick();
              navigate('/progress');
            }}
            className={`group cursor-pointer rounded-2xl p-4 border transition-all duration-200 active:scale-95 hover:shadow-lg ${
              isDark
                ? 'bg-gradient-to-br from-fuchsia-950/60 via-slate-900 to-purple-950/40 border-fuchsia-500/30 hover:border-fuchsia-400'
                : 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white border-transparent hover:brightness-105'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'bg-white/20 text-white'
              }`}>
                <Trophy size={22} />
              </div>
              <ChevronLeft size={16} className={`transition-transform group-hover:-translate-x-1 ${
                isDark ? 'text-fuchsia-400' : 'text-white'
              }`} />
            </div>
            <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-white'}`}>تحلیل پیشرفت</h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-fuchsia-300/70' : 'text-fuchsia-100'}`}>نمودارها و دستاوردها</p>
          </div>

          {/* Calendar */}
          <div
            onClick={() => {
              soundEffects.playClick();
              navigate('/calendar');
            }}
            className={`group cursor-pointer rounded-2xl p-4 border transition-all duration-200 active:scale-95 hover:shadow-lg ${
              isDark
                ? 'bg-gradient-to-br from-sky-950/60 via-slate-900 to-blue-950/40 border-sky-500/30 hover:border-sky-400'
                : 'bg-gradient-to-br from-sky-500 to-blue-600 text-white border-transparent hover:brightness-105'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-sky-500/20 text-sky-300' : 'bg-white/20 text-white'
              }`}>
                <Calendar size={22} />
              </div>
              <ChevronLeft size={16} className={`transition-transform group-hover:-translate-x-1 ${
                isDark ? 'text-sky-400' : 'text-white'
              }`} />
            </div>
            <h3 className={`font-black text-sm ${isDark ? 'text-white' : 'text-white'}`}>تقویم تمرینی</h3>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-sky-300/70' : 'text-sky-100'}`}>تاریخچه جلسات</p>
          </div>
        </div>
      </div>

      {/* Progress & Goals Progress Section */}
      <div className={`rounded-3xl p-6 border theme-transition ${
        isDark ? 'bg-gradient-to-b from-[#18182c] to-[#121222] border-teal-500/20 shadow-xl' : 'bg-white border-teal-500/20 shadow-md'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Target size={18} />
            </div>
            <div>
              <h3 className={`font-black text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
                نوار پیشرفت هفتگی و تمرینی
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                میزان تحقق هدف هفته ({toPersianNumber(weeklyCompleted)} از {toPersianNumber(weeklyGoal)} جلسه)
              </p>
            </div>
          </div>
          <span className="text-lg font-black text-teal-400">
            {toPersianNumber(Math.round(weeklyProgress))}٪
          </span>
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-4 rounded-full overflow-hidden p-0.5 mb-4 ${
          isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100 border border-slate-200'
        }`}>
          <div
            className="h-full rounded-full transition-all duration-1000 bg-gradient-to-l from-teal-400 via-emerald-400 to-cyan-400 shadow-md shadow-teal-500/30"
            style={{ width: `${weeklyProgress}%` }}
          />
        </div>

        {/* Days Circle Tracker */}
        <div className="flex justify-between items-center pt-2">
          {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((day, i) => {
            const hasSession = weekData[i]?.sessions > 0;
            const isToday = i === dayOfWeek;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${
                  hasSession
                    ? 'bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 shadow-md shadow-teal-500/30 scale-105'
                    : isToday
                    ? isDark
                      ? 'bg-teal-500/20 text-teal-300 border-2 border-teal-400'
                      : 'bg-teal-100 text-teal-800 border-2 border-teal-500'
                    : isDark
                    ? 'bg-slate-900 text-slate-500 border border-slate-800'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {hasSession ? <CheckCircle2 size={16} /> : day}
                </div>
                <span className={`text-[10px] font-bold ${isToday ? 'text-teal-400' : 'text-slate-500'}`}>
                  {isToday ? 'امروز' : day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today Workout Card */}
      {todayWorkout && (
        <div className={`relative rounded-3xl p-6 overflow-hidden theme-transition ${
          isDark
            ? 'bg-gradient-to-br from-teal-950/80 via-slate-900 to-emerald-950/80 border border-teal-500/30 shadow-2xl'
            : 'bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 border border-teal-300 shadow-lg'
        }`}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                  <span className={`text-xs font-black ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>برنامه پیشنهادی امروز</span>
                </div>
                <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{todayWorkout.day}</h2>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {getWeekdayName(today)}، {toPersianNumber(getTodayJalali().day)} {getMonthName(getTodayJalali().month)}
                </p>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                isDark ? 'bg-teal-500 text-slate-950 shadow-teal-500/30' : 'bg-teal-600 text-white shadow-teal-600/30'
              }`}>
                <Dumbbell size={28} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {(todayWorkout.muscleGroups || todayWorkout.muscle_groups || []).map((mg: string, i: number) => (
                <span key={i} className={`px-3 py-1 rounded-xl text-xs font-black ${
                  isDark ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-teal-200/80 text-teal-900'
                }`}>{mg}</span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className={`rounded-2xl p-3 text-center ${isDark ? 'bg-slate-950/60 border border-slate-800' : 'bg-white/80 border border-teal-200'}`}>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>تمرینات</p>
                <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{toPersianNumber(todayWorkout.exercises.length)}</p>
              </div>
              <div className={`rounded-2xl p-3 text-center ${isDark ? 'bg-slate-950/60 border border-slate-800' : 'bg-white/80 border border-teal-200'}`}>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>ست‌ها</p>
                <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{toPersianNumber(todayWorkout.exercises.reduce((a, e) => a + e.sets, 0))}</p>
              </div>
              <div className={`rounded-2xl p-3 text-center ${isDark ? 'bg-slate-950/60 border border-slate-800' : 'bg-white/80 border border-teal-200'}`}>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>زمان تقریبی</p>
                <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {toPersianNumber(Math.round(todayWorkout.exercises.reduce((a: number, e) => a + (e.sets * (parseInt(e.reps) || 10) * 3 + (e.rest || 60) * e.sets) / 60, 0)))}
                  <span className="text-xs"> د</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEffects.playClick();
                const dayIndex = dayOfWeek % (activeProgram?.days.length || 1);
                navigate(`/workout?day=${dayIndex}&autoStart=true`);
              }}
              className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all bg-gradient-to-l from-teal-400 to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/30 hover:brightness-110 active:scale-[0.98]"
            >
              <span>شروع تمرین امروز</span>
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<Activity size={20} />} label="جلسات تکمیلی" value={toPersianNumber(totalSessions)} subtext="تمرین ثبت‌شده" color="text-teal-400" bgColor="bg-teal-500/20" borderColor={isDark ? 'border-teal-500/20' : 'border-teal-200'} isDark={isDark} />
        <StatCard icon={<TrendingUp size={20} />} label="حجم کل جابجا شده" value={toPersianNumber(totalVolume.toLocaleString())} subtext="کیلوگرم" color="text-emerald-400" bgColor="bg-emerald-500/20" borderColor={isDark ? 'border-emerald-500/20' : 'border-emerald-200'} isDark={isDark} />
        <StatCard icon={<Flame size={20} />} label="زنجیره استریک" value={toPersianNumber(currentStreak)} subtext="روز متوالی" color="text-amber-400" bgColor="bg-amber-500/20" borderColor={isDark ? 'border-amber-500/20' : 'border-amber-200'} isDark={isDark} />
        <StatCard icon={<Target size={20} />} label="هدف هفته" value={`${toPersianNumber(weeklyCompleted)}/${toPersianNumber(weeklyGoal)}`} subtext="جلسه موفق" color="text-sky-400" bgColor="bg-sky-500/20" borderColor={isDark ? 'border-sky-500/20' : 'border-sky-200'} isDark={isDark} progress={weeklyProgress} />
      </div>

      {/* Today Nutrition Preview */}
      {activeNutrition && todayNutritionDay && (
        <div className={`rounded-3xl p-5 border theme-transition ${
          isDark ? 'bg-gradient-to-l from-emerald-950/30 via-slate-900 to-slate-900 border-emerald-500/20' : 'bg-gradient-to-l from-emerald-50 to-white border-emerald-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                <Apple size={22} />
              </div>
              <div>
                <h3 className={`font-black ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>برنامه تغذیه امروز</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{todayNutritionDay.day} • {activeNutrition.plan_name}</p>
              </div>
            </div>
            <button onClick={() => { soundEffects.playClick(); navigate('/nutrition'); }} className="text-xs font-bold text-emerald-400 hover:underline">مشاهده برنامه ←</button>
          </div>
          <div className="space-y-2">
            {(todayNutritionDay.meals || []).slice(0, 3).map((meal: any, i: number) => (
              <div key={i} className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 ${isDark ? 'bg-slate-950/60 border border-slate-800' : 'bg-white border border-slate-100'}`}>
                <div>
                  <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{meal.meal_name}</p>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{(meal.foods || []).map((f: any) => f.name).join('، ') || meal.time}</p>
                </div>
                {meal.time && <span className={`text-xs font-bold ${isDark ? 'text-teal-400' : 'text-teal-700'}`}>{meal.time}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Session summary */}
      {lastSession && (
        <div className={`rounded-3xl p-5 border theme-transition ${isDark ? 'bg-gradient-to-l from-blue-950/30 via-slate-900 to-slate-900 border-blue-500/20' : 'bg-gradient-to-l from-blue-50 to-white border-blue-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                <Trophy size={22} />
              </div>
              <div>
                <h3 className={`font-black ${isDark ? 'text-blue-400' : 'text-blue-800'}`}>آخرین جلسه ثبت‌شده</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{new Date(lastSession.date).toLocaleDateString('fa-IR')}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-black ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-800'}`}>تکمیل شد ✓</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className={`rounded-2xl p-3 text-center ${isDark ? 'bg-slate-950/60 border border-slate-800' : 'bg-white border border-slate-100'}`}>
              <Timer size={16} className="mx-auto mb-1 text-slate-400" />
              <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>مدت</p>
              <p className={`font-black text-xs sm:text-sm mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{getSessionDuration(lastSession) || '-'}</p>
            </div>
            <div className={`rounded-2xl p-3 text-center ${isDark ? 'bg-slate-950/60 border border-slate-800' : 'bg-white border border-slate-100'}`}>
              <Zap size={16} className="mx-auto mb-1 text-slate-400" />
              <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>ست‌های اجرا شده</p>
              <p className={`font-black text-xs sm:text-sm mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{toPersianNumber(lastSession.sets.filter((s: any) => s.completed).length)}</p>
            </div>
            <div className={`rounded-2xl p-3 text-center ${isDark ? 'bg-slate-950/60 border border-slate-800' : 'bg-white border border-slate-100'}`}>
              <TrendingUp size={16} className="mx-auto mb-1 text-slate-400" />
              <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>حجم جلسه</p>
              <p className="font-black text-xs sm:text-sm mt-0.5 text-teal-400">{toPersianNumber(lastSession.totalVolume)} kg</p>
            </div>
          </div>
        </div>
      )}

      {/* Weight History Chart */}
      {weightData.length > 1 && (
        <div className={`rounded-3xl p-5 border theme-transition ${isDark ? 'bg-slate-900 border-teal-500/20' : 'bg-white border-teal-200'}`}>
          <h3 className={`font-black mb-4 flex items-center gap-2 ${isDark ? 'text-teal-400' : 'text-teal-800'}`}>
            <TrendingUp size={18} />
            روند تغییرات وزن
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#e5e7eb'} />
              <XAxis dataKey="date" stroke={isDark ? '#888' : '#6b7280'} fontSize={10} />
              <YAxis stroke={isDark ? '#888' : '#6b7280'} fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip contentStyle={{ background: isDark ? '#1a1a2e' : '#ffffff', border: '1px solid #14b8a6', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="weight" stroke="#14b8a6" strokeWidth={3} fill="url(#weightGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Specialized Superset Prompt Generator Modal */}
      {showSupersetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className={`w-full max-w-xl rounded-3xl p-6 border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-slate-900 border-amber-500/40 text-white' : 'bg-white border-amber-300 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
              <div className="flex items-center gap-2 text-amber-500">
                <Zap size={24} />
                <h3 className="text-lg font-black">مولد اختصاصی پرامپت تمرین فشرده سوپرست</h3>
              </div>
              <button
                onClick={() => { soundEffects.playClick(); setShowSupersetModal(false); }}
                className="p-1 rounded-xl hover:bg-slate-800 text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <p className={`text-xs leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              این پرامپت مخصوص روزهایی است که وقت کافی یا حوصله تمرینات طولانی را ندارید. هوش مصنوعی یک جلسه پرتراکم، سریع و سوپرست اختصاصی بر اساس مشخصات شما طراحی می‌کند.
            </p>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold">مدت زمان جلسه:</span>
              {[20, 30, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    soundEffects.playClick();
                    setSupersetDuration(mins);
                    if (profile) {
                      setGeneratedSupersetPrompt(generateSupersetPrompt(profile, mins));
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    supersetDuration === mins
                      ? 'bg-amber-500 text-black font-black shadow-md'
                      : isDark
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {mins} دقیقه
                </button>
              ))}
            </div>

            <div className={`rounded-2xl p-4 border max-h-60 overflow-y-auto ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <pre className="text-xs whitespace-pre-wrap leading-6 font-vazir text-slate-300">
                {generatedSupersetPrompt}
              </pre>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCopySupersetPrompt}
                className="flex-1 py-3 rounded-2xl font-black text-sm bg-gradient-to-l from-amber-500 to-orange-500 text-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
              >
                {copiedSuperset ? <Check size={18} /> : <Copy size={18} />}
                <span>{copiedSuperset ? 'پرامپت کپی شد!' : 'کپی پرامپت'}</span>
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setShowSupersetModal(false);
                  navigate('/import');
                }}
                className="px-4 py-3 rounded-2xl font-bold text-sm bg-slate-800 text-slate-200 hover:bg-slate-700"
              >
                ورود برنامه
              </button>
            </div>
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
    <div className={`rounded-3xl p-4 border theme-transition ${
      isDark ? `bg-slate-900/90 ${borderColor}` : `bg-white ${borderColor} shadow-sm`
    }`}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2.5 ${bgColor} ${color}`}>{icon}</div>
      <p className={`text-[11px] mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
      <p className={`text-xl font-black ${color}`}>{value}</p>
      <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{subtext}</p>
      {progress !== undefined && (
        <div className={`w-full h-1.5 rounded-full mt-2.5 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <div className="h-full rounded-full bg-teal-400 transition-all duration-1000" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function calculateStreak(sessions: any[]): number {
  if (sessions.length === 0) return 0;
  const completedDates = sessions.filter(s => s.completed).map(s => new Date(s.date).toDateString())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  if (completedDates.length === 0) return 0;
  let streak = 1;
  for (let i = 1; i < completedDates.length; i++) {
    const curr = new Date(completedDates[i - 1]);
    const prev = new Date(completedDates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff <= 1) streak++;
    else break;
  }
  return streak;
}

function getWeekData(sessions: any[]): { day: string; sessions: number }[] {
  const days = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  const result: { day: string; sessions: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = date.toDateString();
    const count = sessions.filter(s => new Date(s.date).toDateString() === dayStr && s.completed).length;
    const dayOfWeek = (date.getDay() + 1) % 7;
    result.push({ day: days[dayOfWeek], sessions: count });
  }
  return result;
}
