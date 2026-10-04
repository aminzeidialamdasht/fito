import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Calendar as CalendarIcon, Info, ChevronDown, Dumbbell } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { toPersianNumber } from '../utils/jalali';
import type { WorkoutDay as BaseWorkoutDay } from '../types';

interface ExtendedWorkoutDay extends BaseWorkoutDay {
  totalSets?: number;
}

// ✅ نگاشت هوشمند برای تطبیق نام روزهای مختلف
const DAY_MAP: Record<string, string> = {
  'saturday': 'شنبه', 'sat': 'شنبه', '0': 'شنبه',
  'sunday': 'یکشنبه', 'sun': 'یکشنبه', '1': 'یکشنبه',
  'monday': 'دوشنبه', 'mon': 'دوشنبه', '2': 'دوشنبه',
  'tuesday': 'سه‌شنبه', 'tue': 'سه‌شنبه', '3': 'سه‌شنبه',
  'wednesday': 'چهارشنبه', 'wed': 'چهارشنبه', '4': 'چهارشنبه',
  'thursday': 'پنجشنبه', 'thu': 'پنجشنبه', '5': 'پنجشنبه',
  'friday': 'جمعه', 'fri': 'جمعه', '6': 'جمعه',
  'شنبه': 'شنبه', 'یکشنبه': 'یکشنبه', 'دوشنبه': 'دوشنبه',
  'سه‌شنبه': 'سه‌شنبه', 'چهارشنبه': 'چهارشنبه', 'پنجشنبه': 'پنجشنبه', 'جمعه': 'جمعه'
};

const PERSIAN_WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

/** استخراج نام روز هفته از weekday یا day (حتی اگر day توضیح طولانی باشد) */
function getNormalizedWeekday(d: any): string {
  // 1) اولویت با فیلد weekday
  if (d?.weekday) {
    const key = String(d.weekday).trim().toLowerCase();
    if (DAY_MAP[key]) return DAY_MAP[key];
    const raw = String(d.weekday).trim();
    if (DAY_MAP[raw]) return DAY_MAP[raw];
  }

  // 2) تطبیق دقیق day
  const planDay = String(d?.day || '').trim();
  const lowerPlan = planDay.toLowerCase();
  if (DAY_MAP[lowerPlan]) return DAY_MAP[lowerPlan];
  if (DAY_MAP[planDay]) return DAY_MAP[planDay];

  // 3) تطبیق جزئی: day شامل نام روز باشد
  for (const wd of PERSIAN_WEEKDAYS) {
    if (planDay.includes(wd)) return wd;
  }
  for (const [key, value] of Object.entries(DAY_MAP)) {
    if (key.length >= 3 && lowerPlan.includes(key)) return value;
  }

  return planDay;
}

const getDayName = (date: Date) => {
  const days = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
  return days[date.getDay()];
};

const WEEK_DAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

export default function Calendar() {
  const navigate = useNavigate();
  const { activeProgramData } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeDay, setActiveDay] = useState<string | null>(null);
  const todayName = getDayName(new Date());

  // ✅ جستجوی انعطاف‌پذیر با weekday + day
  const currentDayPlan = useMemo(() => {
    if (!activeProgramData?.days) return undefined;
    return activeProgramData.days.find((d: any) => {
      return getNormalizedWeekday(d) === todayName;
    }) as ExtendedWorkoutDay | undefined;
  }, [activeProgramData, todayName]);

  const handleStartSession = () => navigate('/today-session');
  const toggleDay = (dayName: string) => setActiveDay(prev => prev === dayName ? null : dayName);

  // ✅ مدیریت حالت بدون برنامه
  if (!activeProgramData) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${isDark ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-gray-900'}`}>
        <CalendarIcon size={48} className="mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">برنامه تمرینی فعال نیست</h2>
        <p className="text-sm opacity-70 mb-6">لطفاً ابتدا یک برنامه وارد کنید یا بسازید.</p>
        <button onClick={() => navigate('/import')} className="px-6 py-2 rounded-xl bg-violet-500 text-white font-bold">ورود برنامه</button>
      </div>
    );
  }

  const hasExercises = currentDayPlan && Array.isArray(currentDayPlan.exercises) && currentDayPlan.exercises.length > 0;

  return (
    <div className={`min-h-screen pb-24 ${isDark ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <div className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 py-4 flex items-center justify-between ${isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white/90 border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5">
            <ChevronLeft size={24} className={isDark ? 'text-white' : 'text-gray-800'} />
          </button>
          <div>
            <h1 className={`font-bold text-lg flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <CalendarIcon size={20} className="text-violet-500" /> تقویم تمرینی
            </h1>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{activeProgramData.name}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {hasExercises ? (
          <div className={`rounded-2xl p-5 border shadow-sm relative overflow-hidden ${isDark ? 'bg-[#1e293b] border-violet-500/30' : 'bg-white border-violet-200'}`}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-50 text-violet-700'}`}>امروز</span>
                  <h2 className={`text-xl font-black mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentDayPlan!.day}</h2>
                </div>
                <button onClick={handleStartSession} className="w-12 h-12 rounded-full bg-violet-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 active:scale-95 transition-transform">
                  <Play size={20} fill="currentColor" className="ml-0.5" />
                </button>
              </div>
              <div className="space-y-2 mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-white/10">
                {currentDayPlan!.exercises.map((ex: any, idx: number) => (
                  <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-700'}`}>{idx + 1}</span>
                      <span className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{ex.name}</span>
                    </div>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{ex.sets} ست × {ex.reps}</span>
                  </div>
                ))}
              </div>
              <div className={`flex items-center gap-4 text-xs font-bold pt-4 mt-2 border-t ${isDark ? 'border-white/10 text-gray-400' : 'border-gray-100 text-gray-500'}`}>
                <span className="flex items-center gap-1"><Info size={12} />{toPersianNumber(currentDayPlan!.exercises.length)} حرکت</span>
                <span className="flex items-center gap-1"><Dumbbell size={12} />{toPersianNumber(currentDayPlan!.totalSets || 0)} ست کل</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={`rounded-2xl p-8 text-center border ${isDark ? 'bg-[#1e293b] border-white/5' : 'bg-white border-gray-200'}`}>
            <p className="font-bold opacity-70">امروز ({todayName}) روز استراحت است 🎉</p>
          </div>
        )}

        <div className="space-y-3">
          <h3 className={`font-bold text-sm px-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>برنامه هفتگی:</h3>
          {WEEK_DAYS.map((dayName, index) => {
            const dayPlan = activeProgramData.days.find((d: any) => {
              return getNormalizedWeekday(d) === dayName;
            }) as ExtendedWorkoutDay | undefined;

            const isToday = dayName === todayName;
            const isRest = !dayPlan || !Array.isArray(dayPlan.exercises) || dayPlan.exercises.length === 0;
            const isOpen = activeDay === dayName;
            if (isToday) return null;

            return (
              <div key={index} className={`rounded-xl border transition-all overflow-hidden ${isRest ? (isDark ? 'bg-[#1e293b]/50 border-white/5 opacity-60' : 'bg-gray-50 border-gray-100 opacity-60') : (isDark ? 'bg-[#1e293b] border-white/5' : 'bg-white border-gray-100')}`}>
                <button onClick={() => !isRest && toggleDay(dayName)} disabled={isRest} className={`w-full flex items-center justify-between p-4 text-right ${isRest ? 'cursor-default' : 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${isRest ? (isDark ? 'bg-gray-800 text-gray-600' : 'bg-gray-200 text-gray-400') : (isOpen ? 'bg-violet-500 text-white' : (isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-50 text-violet-700'))}`}>
                      {isRest ? 'R' : ((index + 1) % 7) + 1}
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{dayName}</p>
                      <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{isRest ? 'استراحت' : `${dayPlan?.exercises?.length || 0} حرکت · ${dayPlan?.totalSets || 0} ست`}</p>
                    </div>
                  </div>
                  {!isRest && (
                    <div className="flex items-center gap-2">
                       <button onClick={(e) => { e.stopPropagation(); handleStartSession(); }} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-400'}`}><Play size={16} fill="currentColor" /></button>
                      <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-violet-500' : 'text-gray-400'}`} />
                    </div>
                  )}
                </button>
                {!isRest && (
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className={`p-4 pt-0 space-y-2 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                      {dayPlan?.exercises?.map((ex: any, exIdx: number) => (
                        <div key={exIdx} className={`flex items-center justify-between p-3 rounded-lg text-sm ${isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                          <span className="font-medium">{ex.name}</span>
                          <span className="text-xs opacity-70">{ex.sets} ست × {ex.reps}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
