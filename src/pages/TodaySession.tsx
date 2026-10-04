import { useNavigate } from 'react-router-dom';
import { Play, ChevronLeft, Dumbbell } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { toPersianNumber } from '../utils/jalali';
import { useMemo } from 'react';
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

export default function TodaySession() {
  const navigate = useNavigate();
  const { activeProgramData } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const todayName = getDayName(new Date());


  const currentDayIndex = useMemo(() => {
    if (!activeProgramData?.days) return -1;
    return activeProgramData.days.findIndex((d: any) => {
      return getNormalizedWeekday(d) === todayName;
    });
  }, [activeProgramData, todayName]);

  const currentDayPlan = useMemo(() => {
    if (!activeProgramData?.days || currentDayIndex === -1) return undefined;
    return activeProgramData.days[currentDayIndex] as ExtendedWorkoutDay;
  }, [activeProgramData, currentDayIndex]);

  const hasExercises = currentDayPlan && Array.isArray(currentDayPlan.exercises) && currentDayPlan.exercises.length > 0;

  // ✅ مدیریت حالت بدون برنامه یا استراحت
  if (!activeProgramData || !hasExercises) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${isDark ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-gray-900'}`}>
        <Dumbbell size={48} className="mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">
          {!activeProgramData ? 'برنامه تمرینی فعال نیست' : `امروز (${todayName}) روز استراحت است!`}
        </h2>
        <p className="text-sm opacity-70 mb-6">
          {!activeProgramData ? 'لطفاً ابتدا یک برنامه وارد کنید.' : 'بدن شما برای رشد نیاز به ریکاوری دارد.'}
        </p>
        <button onClick={() => navigate('/')} className="px-6 py-2 rounded-xl bg-violet-500 text-white font-bold">بازگشت به داشبورد</button>
      </div>
    );
  }

  const totalSets = currentDayPlan!.exercises?.reduce((acc: number, ex: any) => acc + (ex.sets || 3), 0) || 0;
  const estimatedTime = Math.ceil(totalSets * 1.5);

  const handleStart = () => {
    navigate(`/tracker/${currentDayIndex}?day=${currentDayIndex}&autoStart=true`);
  };

  return (
    <div className={`min-h-screen pb-44 ${isDark ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <div className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 py-4 flex items-center gap-3 ${isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white/90 border-gray-200'}`}>
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5">
          <ChevronLeft size={24} className={isDark ? 'text-white' : 'text-gray-800'} />
        </button>
        <div>
          <h1 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>برنامه {todayName}</h1>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>آماده‌سازی برای شروع تمرین</p>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        <div className={`rounded-2xl p-5 border shadow-sm ${isDark ? 'bg-[#1e293b] border-white/5' : 'bg-white border-violet-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-50 text-violet-600'}`}>
                <Dumbbell size={24} />
              </div>
              <div>
                <p className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>حجم تمرین</p>
                <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{toPersianNumber(currentDayPlan!.exercises?.length || 0)} حرکت · {toPersianNumber(totalSets)} ست</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>زمان تخمینی</p>
              <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>~{toPersianNumber(estimatedTime)} دقیقه</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className={`font-bold text-sm px-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>حرکات امروز:</h3>
          {currentDayPlan!.exercises?.map((ex: any, idx: number) => (
            <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border ${isDark ? 'bg-[#1e293b] border-white/5' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{idx + 1}</div>
                <div>
                  <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{ex.name}</p>
                  <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{ex.sets || 3} ست × {ex.reps || 12} تکرار</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`fixed bottom-[70px] left-0 right-0 p-4 pt-2 border-t backdrop-blur-xl z-30 ${isDark ? 'bg-[#0f172a]/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
        <div className="max-w-2xl mx-auto">
          <button onClick={handleStart} className="w-full py-4 rounded-2xl font-black text-base text-white shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)' }}>
            <Play size={20} fill="currentColor" />
            شروع جلسه تمرینی
          </button>
        </div>
      </div>
    </div>
  );
}
