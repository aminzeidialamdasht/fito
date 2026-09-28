import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { getPersianDate, toPersianNumber, getTodayJalali, getWeekdayName, getMonthName, getProgramTimelineDetails } from '../utils/jalali';
import { EXPERIENCE_LABELS, getGoalLabel } from '../types';
import { 
  Dumbbell, TrendingUp, Calendar, Target, 
  Flame, Award, Activity, Clock, Sparkles,
  CheckCircle2, Timer, Zap, User, ChevronLeft,
  Trophy, TrendingDown, Heart, Apple, Pill, Brain, AlertTriangle, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Dashboard() {
  const { state, activeProfile, sessions, programs, progress, profiles, setActiveProfile, nutritionPrograms, supplementPrograms } = useAppContext();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const profile = activeProfile;

  const completedSessions = sessions.filter(s => s.completed);
  const totalSessions = completedSessions.length;
  const totalVolume = completedSessions.reduce((acc, s) => acc + s.totalVolume, 0);
  const currentStreak = calculateStreak(sessions);
  const activeProgram = programs.find(p => p.id === state.activeProgram);
  const activeProgramTimeline = activeProgram
    ? getProgramTimelineDetails(activeProgram.startDate, activeProgram.duration, activeProgram.createdAt)
    : null;

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
    <div className="space-y-5">
      {profiles.length > 1 && (
        <div className={`rounded-2xl p-3 border theme-transition ${
          isDark ? 'bg-[#1a1a2e]/50 border-[#14b8a6]/10' : 'bg-white/70 border-[#14b8a6]/20'
        }`}>
          <div className="flex items-center gap-2 overflow-x-auto">
            <User size={16} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
            <div className="flex gap-2">
              {profiles.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActiveProfile(p.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    p.id === profile?.id
                      ? isDark
                        ? 'bg-gradient-to-l from-[#14b8a6] to-[#2dd4bf] text-[#0d0d1a]'
                        : 'bg-gradient-to-l from-[#14b8a6] to-[#0d9488] text-white'
                      : isDark
                        ? 'bg-[#0d0d1a] text-gray-400 hover:text-white'
                        : 'bg-[#f0fdfa] text-[#0f766e] hover:bg-[#ccfbf1]'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Program Alarm Banner (Triggered when 1 day or <= 1 day remaining) */}
      {activeProgram && activeProgramTimeline && activeProgramTimeline.isAlarmRequired && (
        <div className={`rounded-2xl p-5 border shadow-xl animate-pulse-subtle theme-transition ${
          isDark
            ? 'bg-gradient-to-l from-amber-500/20 via-[#1a1a2e] to-red-500/10 border-amber-500/50 text-amber-200'
            : 'bg-gradient-to-l from-amber-100 via-white to-red-50 border-amber-400 text-amber-900'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                <Bell size={26} className="animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-500 text-black">
                    🚨 آلارم پایان برنامه
                  </span>
                  <span className="text-xs font-bold">
                    ({activeProgramTimeline.daysRemaining > 0 ? `${toPersianNumber(activeProgramTimeline.daysRemaining)} روز باقی‌مانده` : 'امروز پایان برنامه'})
                  </span>
                </div>
                <h3 className="text-lg font-bold">
                  تنها {toPersianNumber(Math.max(0, activeProgramTimeline.daysRemaining))} روز تا پایان برنامه «{activeProgram.name}» باقی مانده است!
                </h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-amber-200/80' : 'text-amber-800'}`}>
                  برای حفظ تداوم رشد و پیشرفت ورزشی، همین حالا نسبت به تولید و دریافت برنامه جدید اقدام کنید.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/prompt')}
              className={`px-5 py-3 rounded-xl font-bold text-sm shrink-0 flex items-center justify-center gap-2 transition-all shadow-lg ${
                isDark
                  ? 'bg-gradient-to-l from-amber-400 to-amber-500 text-slate-950 hover:opacity-90'
                  : 'bg-gradient-to-l from-amber-500 to-amber-600 text-white hover:opacity-90'
              }`}
            >
              <Brain size={18} />
              <span>تولید پرامپت جدید</span>
            </button>
          </div>
        </div>
      )}

      {/* Program Timeline Overview Card */}
      {activeProgram && activeProgramTimeline && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/20' : 'bg-white border-[#14b8a6]/25 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#14b8a6]/20 text-[#14b8a6]' : 'bg-[#14b8a6]/15 text-[#0d9488]'}`}>
                <Clock size={20} />
              </div>
              <div>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                  زمان‌بندی برنامه «{activeProgram.name}»
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                  مدت کل: {activeProgram.duration} ({toPersianNumber(activeProgramTimeline.totalDays)} روز)
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/import')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                isDark
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'border-teal-200 text-[#0d9488] hover:bg-[#f0fdfa]'
              }`}
            >
              مدیریت برنامه‌ها ←
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
            <div className={`rounded-xl p-2.5 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
              <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>تاریخ شروع:</span>
              <p className={`font-bold mt-0.5 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{activeProgramTimeline.startDateJalali}</p>
            </div>
            <div className={`rounded-xl p-2.5 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
              <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>تاریخ پایان:</span>
              <p className={`font-bold mt-0.5 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{activeProgramTimeline.endDateJalali}</p>
            </div>
            <div className={`rounded-xl p-2.5 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
              <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>روزهای طی شده:</span>
              <p className={`font-bold mt-0.5 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{toPersianNumber(activeProgramTimeline.daysPassed)} روز</p>
            </div>
            <div className={`rounded-xl p-2.5 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
              <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>روزهای باقی‌مانده:</span>
              <p className={`font-bold mt-0.5 ${activeProgramTimeline.isAlarmRequired ? 'text-amber-500 font-black' : isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                {activeProgramTimeline.daysRemaining >= 0 ? `${toPersianNumber(activeProgramTimeline.daysRemaining)} روز` : 'پایان یافته'}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>پیشرفت دوره برنامه</span>
              <span className={`font-bold ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>{toPersianNumber(activeProgramTimeline.progressPercent)}٪</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-[#f0fdfa]'}`}>
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  activeProgramTimeline.isAlarmRequired ? 'bg-amber-500' : isDark ? 'bg-[#14b8a6]' : 'bg-[#0d9488]'
                }`}
                style={{ width: `${activeProgramTimeline.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => navigate('/prompt')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
            isDark
              ? 'bg-gradient-to-l from-[#14b8a6]/20 to-[#14b8a6]/5 border border-[#14b8a6]/30 text-[#14b8a6] hover:bg-[#14b8a6]/20'
              : 'bg-gradient-to-l from-[#14b8a6]/15 to-[#14b8a6]/5 border border-[#14b8a6]/30 text-[#0d9488] hover:bg-[#14b8a6]/15'
          }`}
        >
          <Brain size={18} />
          تولید پرامپت
        </button>
        <button
          onClick={() => navigate('/import')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
            isDark
              ? 'bg-gradient-to-l from-[#4a90d9]/20 to-[#4a90d9]/5 border border-[#4a90d9]/30 text-[#6bb5ff] hover:bg-[#4a90d9]/20'
              : 'bg-gradient-to-l from-blue-50 to-white border border-blue-200 text-blue-600 hover:bg-blue-50'
          }`}
        >
          <Dumbbell size={18} />
          ورود برنامه
        </button>
      </div>

      {todayWorkout && (
        <div className={`relative rounded-3xl p-6 overflow-hidden theme-transition ${
          isDark
            ? 'bg-gradient-to-bl from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] border border-[#14b8a6]/20'
            : 'bg-gradient-to-bl from-[#f0fdfa] via-[#ccfbf1] to-[#ecfdf5] border border-[#14b8a6]/30'
        }`}>
          <div className={`absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl ${
            isDark ? 'bg-[#14b8a6]/10' : 'bg-[#14b8a6]/20'
          }`} />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-[#14b8a6]' : 'bg-[#14b8a6]'}`} />
                  <span className={`text-xs font-bold ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>تمرین امروز</span>
                </div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{todayWorkout.day}</h2>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                  {getWeekdayName(today)}، {toPersianNumber(getTodayJalali().day)} {getMonthName(getTodayJalali().month)}
                </p>
              </div>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                isDark
                  ? 'bg-gradient-to-br from-[#14b8a6] to-[#2dd4bf] shadow-lg shadow-[#14b8a6]/30'
                  : 'bg-gradient-to-br from-[#14b8a6] to-[#0d9488] shadow-lg shadow-[#14b8a6]/30'
              }`}>
                <Dumbbell size={32} className={isDark ? 'text-[#0d0d1a]' : 'text-white'} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {todayWorkout.muscleGroups.map((mg, i) => (
                <span key={i} className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isDark ? 'bg-[#4a90d9]/20 text-[#6bb5ff]' : 'bg-[#14b8a6]/15 text-[#0d9488]'
                }`}>{mg}</span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]/50' : 'bg-white/70'}`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>تمرینات</p>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{toPersianNumber(todayWorkout.exercises.length)}</p>
              </div>
              <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]/50' : 'bg-white/70'}`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>ست‌ها</p>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{toPersianNumber(todayWorkout.exercises.reduce((a, e) => a + e.sets, 0))}</p>
              </div>
              <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]/50' : 'bg-white/70'}`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>زمان تقریبی</p>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                  {toPersianNumber(Math.round(todayWorkout.exercises.reduce((a: number, e) => a + (e.sets * (parseInt(e.reps) || 10) * 3 + e.rest * e.sets) / 60, 0)))}
                  <span className="text-xs">د</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const dayIndex = dayOfWeek % (activeProgram?.days.length || 1);
                navigate(`/workout?day=${dayIndex}&autoStart=true`);
              }}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                isDark
                  ? 'bg-gradient-to-l from-[#14b8a6] to-[#2dd4bf] text-[#0d0d1a] shadow-lg shadow-[#14b8a6]/30 hover:opacity-90'
                  : 'bg-gradient-to-l from-[#14b8a6] to-[#0d9488] text-white shadow-lg shadow-[#14b8a6]/30 hover:opacity-90'
              }`}
            >
              <span>شروع تمرین</span>
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>
      )}

      {activeNutrition && todayNutritionDay && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-gradient-to-l from-[#22c55e]/5 to-transparent border-[#22c55e]/20' : 'bg-gradient-to-l from-[#ecfdf5] to-white border-[#10b981]/20'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#22c55e]/20' : 'bg-[#10b981]/15'}`}>
                <Apple size={20} className={isDark ? 'text-[#22c55e]' : 'text-[#059669]'} />
              </div>
              <div>
                <h3 className={`font-bold ${isDark ? 'text-[#22c55e]' : 'text-[#059669]'}`}>تغذیه امروز</h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>{todayNutritionDay.day} • {activeNutrition.plan_name}</p>
              </div>
            </div>
            <button onClick={() => navigate('/nutrition')} className={`text-xs font-bold ${isDark ? 'text-[#22c55e] hover:underline' : 'text-[#059669] hover:underline'}`}>جزئیات ←</button>
          </div>
          <div className="space-y-2">
            {(todayNutritionDay.meals || []).slice(0, 4).map((meal: any, i: number) => (
              <div key={i} className={`flex items-center justify-between rounded-lg px-3 py-2 ${isDark ? 'bg-[#0d0d1a]/50' : 'bg-white/70'}`}>
                <div>
                  <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{meal.meal_name}</p>
                  <p className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}`}>{(meal.foods || []).map((f: any) => f.name).join('، ') || meal.time}</p>
                </div>
                {meal.time && <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>{meal.time}</span>}
              </div>
            ))}
          </div>
          <div className={`mt-3 flex items-center justify-between text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
            <span>کالری روزانه: <strong className={isDark ? 'text-white' : 'text-[#134e4a]'}>{toPersianNumber(todayNutritionDay.total_calories || activeNutrition.daily_calories)}</strong></span>
            <span>P: {toPersianNumber(activeNutrition.macros.protein)}g · C: {toPersianNumber(activeNutrition.macros.carbs)}g · F: {toPersianNumber(activeNutrition.macros.fats)}g</span>
          </div>
        </div>
      )}

      {activeSupplement && activeSupplement.supplements && activeSupplement.supplements.length > 0 && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-gradient-to-l from-[#4a90d9]/5 to-transparent border-[#4a90d9]/20' : 'bg-gradient-to-l from-[#eff6ff] to-white border-[#3b82f6]/20'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#4a90d9]/20' : 'bg-[#3b82f6]/15'}`}>
                <Pill size={20} className={isDark ? 'text-[#4a90d9]' : 'text-[#2563eb]'} />
              </div>
              <div>
                <h3 className={`font-bold ${isDark ? 'text-[#4a90d9]' : 'text-[#2563eb]'}`}>مکمل‌های امروز</h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>{activeSupplement.recommendation_title}</p>
              </div>
            </div>
            <button onClick={() => navigate('/supplements')} className={`text-xs font-bold ${isDark ? 'text-[#4a90d9] hover:underline' : 'text-[#2563eb] hover:underline'}`}>جزئیات ←</button>
          </div>
          <div className="space-y-2">
            {activeSupplement.supplements.slice(0, 5).map((supp: any, i: number) => (
              <div key={i} className={`flex items-center justify-between rounded-lg px-3 py-2 ${isDark ? 'bg-[#0d0d1a]/50' : 'bg-white/70'}`}>
                <div>
                  <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{supp.name}</p>
                  <p className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}`}>{supp.dosage}</p>
                </div>
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>{supp.timing}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<Activity size={18} />} label="جلسات" value={toPersianNumber(totalSessions)} subtext="تکمیل شده" color={isDark ? 'text-[#4a90d9]' : 'text-[#0d9488]'} bgColor={isDark ? 'bg-[#4a90d9]/10' : 'bg-[#14b8a6]/10'} borderColor={isDark ? 'border-[#4a90d9]/20' : 'border-[#14b8a6]/20'} isDark={isDark} />
        <StatCard icon={<TrendingUp size={18} />} label="حجم کل" value={toPersianNumber(totalVolume.toLocaleString())} subtext="کیلوگرم" color={isDark ? 'text-[#22c55e]' : 'text-[#059669]'} bgColor={isDark ? 'bg-[#22c55e]/10' : 'bg-[#10b981]/10'} borderColor={isDark ? 'border-[#22c55e]/20' : 'border-[#10b981]/20'} isDark={isDark} />
        <StatCard icon={<Flame size={18} />} label="استریک" value={toPersianNumber(currentStreak)} subtext="روز متوالی" color={isDark ? 'text-[#f59e0b]' : 'text-[#d97706]'} bgColor={isDark ? 'bg-[#f59e0b]/10' : 'bg-[#f59e0b]/10'} borderColor={isDark ? 'border-[#f59e0b]/20' : 'border-[#f59e0b]/20'} isDark={isDark} />
        <StatCard icon={<Target size={18} />} label="هدف هفتگی" value={`${toPersianNumber(weeklyCompleted)}/${toPersianNumber(weeklyGoal)}`} subtext="جلسه" color={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} bgColor={isDark ? 'bg-[#14b8a6]/10' : 'bg-[#14b8a6]/10'} borderColor={isDark ? 'border-[#14b8a6]/20' : 'border-[#14b8a6]/20'} isDark={isDark} progress={weeklyProgress} />
      </div>

      <div className={`rounded-2xl p-5 border theme-transition ${isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}><Calendar size={16} />پیشرفت هفتگی</h3>
          <span className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>{toPersianNumber(Math.round(weeklyProgress))}٪</span>
        </div>
        <div className={`w-full h-3 rounded-full overflow-hidden mb-3 ${isDark ? 'bg-gray-800' : 'bg-[#f0fdfa]'}`}>
          <div className={`h-full rounded-full transition-all duration-1000 ${isDark ? 'bg-gradient-to-l from-[#14b8a6] to-[#2dd4bf]' : 'bg-gradient-to-l from-[#14b8a6] to-[#0d9488]'}`} style={{ width: `${weeklyProgress}%` }} />
        </div>
        <div className="flex justify-between">
          {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((day, i) => {
            const hasSession = weekData[i]?.sessions > 0;
            const isToday = i === dayOfWeek;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  hasSession ? (isDark ? 'bg-[#14b8a6] text-[#0d0d1a]' : 'bg-[#14b8a6] text-white')
                    : isToday ? (isDark ? 'bg-[#14b8a6]/20 text-[#14b8a6] border border-[#14b8a6]/50' : 'bg-[#14b8a6]/20 text-[#0d9488] border border-[#14b8a6]/50')
                    : (isDark ? 'bg-gray-800 text-gray-500' : 'bg-[#f0fdfa] text-[#0f766e]/50')
                }`}>{hasSession ? <CheckCircle2 size={14} /> : day}</div>
              </div>
            );
          })}
        </div>
      </div>

      {lastSession && (
        <div className={`rounded-2xl p-5 border theme-transition ${isDark ? 'bg-gradient-to-l from-[#22c55e]/5 to-transparent border-[#22c55e]/20' : 'bg-gradient-to-l from-[#ecfdf5] to-white border-[#10b981]/20'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#22c55e]/20' : 'bg-[#10b981]/15'}`}>
                <Trophy size={20} className={isDark ? 'text-[#22c55e]' : 'text-[#059669]'} />
              </div>
              <div>
                <h3 className={`font-bold ${isDark ? 'text-[#22c55e]' : 'text-[#059669]'}`}>آخرین جلسه</h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>{new Date(lastSession.date).toLocaleDateString('fa-IR')}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#10b981]/15 text-[#059669]'}`}>تکمیل ✓</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]/50' : 'bg-white/70'}`}>
              <Timer size={14} className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'} />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>مدت</p>
              <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{getSessionDuration(lastSession) || '-'}</p>
            </div>
            <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]/50' : 'bg-white/70'}`}>
              <Zap size={14} className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'} />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>ست‌ها</p>
              <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{toPersianNumber(lastSession.sets.filter((s: any) => s.completed).length)}</p>
            </div>
            <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]/50' : 'bg-white/70'}`}>
              <TrendingUp size={14} className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'} />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>حجم</p>
              <p className={`font-bold text-sm ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>{toPersianNumber(lastSession.totalVolume)} kg</p>
            </div>
          </div>
        </div>
      )}

      {profile && (
        <div className={`rounded-2xl p-5 border theme-transition ${isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}><User size={16} />{profile.name}</h3>
            <button onClick={() => navigate('/profile')} className={`text-xs ${isDark ? 'text-gray-400 hover:text-white' : 'text-[#0f766e]/70 hover:text-[#0d9488]'}`}>ویرایش</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <InfoItem label="هدف" value={getGoalLabel(profile.primaryGoal)} isDark={isDark} />
            <InfoItem label="سطح" value={EXPERIENCE_LABELS[profile.experience]} isDark={isDark} />
            <InfoItem label="وزن" value={`${toPersianNumber(profile.weight)} kg`} isDark={isDark} />
            <InfoItem label="قد" value={`${toPersianNumber(profile.height)} cm`} isDark={isDark} />
          </div>
        </div>
      )}

      {weightData.length > 1 && (
        <div className={`rounded-2xl p-5 border theme-transition ${isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'}`}>
          <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}><TrendingUp size={16} />روند وزن</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDark ? '#14b8a6' : '#14b8a6'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isDark ? '#14b8a6' : '#14b8a6'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#e5e7eb'} />
              <XAxis dataKey="date" stroke={isDark ? '#888' : '#6b7280'} fontSize={10} />
              <YAxis stroke={isDark ? '#888' : '#6b7280'} fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip contentStyle={{ background: isDark ? '#1a1a2e' : '#ffffff', border: `1px solid ${isDark ? '#14b8a6' : '#14b8a6'}`, borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="weight" stroke={isDark ? '#14b8a6' : '#14b8a6'} strokeWidth={2} fill="url(#weightGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {!profile && (
        <div className={`rounded-2xl p-6 border theme-transition ${isDark ? 'bg-gradient-to-l from-[#14b8a6]/10 to-transparent border-[#14b8a6]/30' : 'bg-gradient-to-l from-[#f0fdfa] to-white border-[#14b8a6]/30'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#14b8a6]/20' : 'bg-[#14b8a6]/15'}`}>
              <Sparkles size={24} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
            </div>
            <div>
              <p className={`font-bold ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>⚡ شروع کنید</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>برای شروع، ابتدا پروفایل ورزشکار خود را تکمیل کنید</p>
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
    <div className={`rounded-2xl p-4 border theme-transition ${isDark ? `bg-gradient-to-b from-[#1a1a2e] to-[#16213e] ${borderColor}` : `bg-gradient-to-b from-white to-[#f0fdfa] ${borderColor}`}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${bgColor} ${color}`}>{icon}</div>
      <p className={`text-xs mb-0.5 ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-[#0f766e]/50'}`}>{subtext}</p>
      {progress !== undefined && (
        <div className={`w-full h-1 rounded-full mt-2 ${isDark ? 'bg-gray-800' : 'bg-[#f0fdfa]'}`}>
          <div className={`h-full rounded-full transition-all duration-1000 ${isDark ? 'bg-[#14b8a6]' : 'bg-[#14b8a6]'}`} style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
      <p className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-[#0f766e]/60'}`}>{label}</p>
      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{value}</p>
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
