import { useNavigate } from 'react-router-dom';
import { Play, ChevronLeft, Dumbbell } from 'lucide-react';
import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { toPersianNumber } from '../utils/jalali';
import {
  getExerciseSetCount,
  getExerciseRestSeconds,
  estimateWorkoutMinutes,
} from '../utils/programHelpers';
import TechniqueBadge from '../components/program/TechniqueBadge';
import type { WorkoutDay as BaseWorkoutDay } from '../types';

interface ExtendedWorkoutDay extends BaseWorkoutDay {
  totalSets?: number;
}

const DAY_MAP: Record<string, string> = {
  saturday: 'شنبه', sat: 'شنبه', '0': 'شنبه',
  sunday: 'یکشنبه', sun: 'یکشنبه', '1': 'یکشنبه',
  monday: 'دوشنبه', mon: 'دوشنبه', '2': 'دوشنبه',
  tuesday: 'سه‌شنبه', tue: 'سه‌شنبه', '3': 'سه‌شنبه',
  wednesday: 'چهارشنبه', wed: 'چهارشنبه', '4': 'چهارشنبه',
  thursday: 'پنجشنبه', thu: 'پنجشنبه', '5': 'پنجشنبه',
  friday: 'جمعه', fri: 'جمعه', '6': 'جمعه',
  شنبه: 'شنبه', یکشنبه: 'یکشنبه', دوشنبه: 'دوشنبه',
  'سه‌شنبه': 'سه‌شنبه', چهارشنبه: 'چهارشنبه',
  پنجشنبه: 'پنجشنبه', جمعه: 'جمعه',
};

const PERSIAN_WEEKDAYS = [
  'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه',
];

function getNormalizedWeekday(day: any): string {
  if (day?.weekday) {
    const key = String(day.weekday).trim().toLowerCase();
    if (DAY_MAP[key]) return DAY_MAP[key];
    const raw = String(day.weekday).trim();
    if (DAY_MAP[raw]) return DAY_MAP[raw];
  }
  const planDay = String(day?.day || '').trim();
  const lowerPlan = planDay.toLowerCase();
  if (DAY_MAP[lowerPlan]) return DAY_MAP[lowerPlan];
  if (DAY_MAP[planDay]) return DAY_MAP[planDay];
  for (const weekday of PERSIAN_WEEKDAYS) {
    if (planDay.includes(weekday)) return weekday;
  }
  for (const [key, value] of Object.entries(DAY_MAP)) {
    if (key.length >= 3 && lowerPlan.includes(key)) return value;
  }
  return planDay;
}

function getDayName(date: Date): string {
  return [
    'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه',
    'پنجشنبه', 'جمعه', 'شنبه',
  ][date.getDay()];
}

export default function TodaySession() {
  const navigate = useNavigate();
  const { activeProgramData } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const todayName = getDayName(new Date());

  const currentDayIndex = useMemo(() => {
    if (!activeProgramData?.days) return -1;
    return activeProgramData.days.findIndex(
      (day: any) => getNormalizedWeekday(day) === todayName,
    );
  }, [activeProgramData, todayName]);

  const currentDayPlan = useMemo(() => {
    if (!activeProgramData?.days || currentDayIndex === -1) return undefined;
    return activeProgramData.days[currentDayIndex] as ExtendedWorkoutDay;
  }, [activeProgramData, currentDayIndex]);

  const exercises = currentDayPlan?.exercises || [];
  const hasExercises = exercises.length > 0;

  if (!activeProgramData || !hasExercises) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${
        isDark ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-gray-900'
      }`}>
        <Dumbbell size={48} className="mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">
          {!activeProgramData ? 'برنامه تمرینی فعال نیست' : `امروز (${todayName}) روز استراحت است!`}
        </h2>
        <p className="text-sm opacity-70 mb-6">
          {!activeProgramData ? 'لطفاً ابتدا یک برنامه وارد کنید.' : 'بدن شما برای رشد نیاز به ریکاوری دارد.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="min-h-[44px] px-6 py-2 rounded-xl bg-violet-500 text-white font-bold"
          aria-label="بازگشت به داشبورد"
        >
          بازگشت به داشبورد
        </button>
      </div>
    );
  }

  const totalSets = exercises.reduce(
    (sum: number, exercise: any) => sum + getExerciseSetCount(exercise.sets),
    0,
  );

  const avgRest = Math.round(
    exercises.reduce(
      (sum: number, exercise: any) => sum + getExerciseRestSeconds(exercise),
      0,
    ) / Math.max(1, exercises.length),
  );

  const estimatedTime = estimateWorkoutMinutes(totalSets, avgRest, exercises.length);

  const handleStart = () => {
    navigate(`/tracker/${currentDayIndex}?day=${currentDayIndex}&autoStart=true`);
  };

  return (
    <div className={`min-h-screen pb-44 ${isDark ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <div className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 py-4 flex items-center gap-3 ${
        isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white/90 border-gray-200'
      }`}>
        <button
          onClick={() => navigate(-1)}
          className="min-h-[44px] min-w-[44px] p-2 rounded-full hover:bg-black/5"
          aria-label="بازگشت"
        >
          <ChevronLeft size={24} className={isDark ? 'text-white' : 'text-gray-800'} />
        </button>
        <div>
          <h1 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            برنامه {todayName}
          </h1>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            آماده‌سازی برای شروع تمرین
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        <div className={`rounded-2xl p-5 border shadow-sm ${
          isDark ? 'bg-[#1e293b] border-white/5' : 'bg-white border-violet-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-50 text-violet-600'
              }`}>
                <Dumbbell size={24} />
              </div>
              <div>
                <p className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  حجم تمرین
                </p>
                <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {toPersianNumber(exercises.length)} حرکت · {toPersianNumber(totalSets)} ست
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                زمان تخمینی
              </p>
              <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ~{toPersianNumber(estimatedTime)} دقیقه
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className={`font-bold text-sm px-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            حرکات امروز:
          </h3>
          {exercises.map((exercise: any, index: number) => {
            const setCount = getExerciseSetCount(exercise.sets);
            const technique = exercise.loadMethod;

            return (
              <div
                key={exercise.id || exercise.name || index}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  isDark ? 'bg-[#1e293b] border-white/5' : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {exercise.name}
                    </p>
                    <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {toPersianNumber(setCount)} ست × {toPersianNumber(exercise.reps || 12)} تکرار
                    </p>
                    {technique && (
                      <div className="mt-2">
                        <TechniqueBadge technique={technique} compact />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={`fixed bottom-[70px] left-0 right-0 p-4 pt-2 border-t backdrop-blur-xl z-30 ${
        isDark ? 'bg-[#0f172a]/95 border-white/10' : 'bg-white/95 border-gray-200'
      }`}>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleStart}
            className="min-h-[44px] w-full py-4 rounded-2xl font-black text-base text-white shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)' }}
            aria-label="شروع جلسه تمرینی"
          >
            <Play size={20} fill="currentColor" />
            شروع جلسه تمرینی
          </button>
        </div>
      </div>
    </div>
  );
}
