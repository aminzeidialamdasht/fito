import { useNavigate } from 'react-router-dom';
import { Play, ChevronLeft, Dumbbell } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { toPersianNumber } from '../utils/jalali';
import { useMemo } from 'react';

const getDayName = (date: Date) => {
  const days = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
  return days[date.getDay()];
};

export default function TodaySession() {
  const navigate = useNavigate();
  // دریافت دیتای کاملاً نرمال‌شده از هسته هوشمند
  const { activeProgramData } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const todayName = getDayName(new Date());

  // پیدا کردن برنامه روز جاری از دیتای استاندارد شده
  const currentDayPlan = useMemo(() => 
    activeProgramData?.days?.find((d: any) => d.day === todayName),
    [activeProgramData, todayName]
  );

  if (!currentDayPlan || currentDayPlan.exercises?.length === 0) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${isDark ? 'bg-[#0f172a] text-white' : 'bg-[#f8fafc] text-gray-900'}`}>
        <Dumbbell size={48} className="mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">امروز ({todayName}) روز استراحت است!</h2>
        <p className="text-sm opacity-70 mb-6">برنامه‌ای برای امروز تعریف نشده است.</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 rounded-xl bg-teal-500 text-white font-bold">بازگشت به داشبورد</button>
      </div>
    );
  }

  const totalSets = currentDayPlan.exercises?.reduce((acc: number, ex: any) => acc + (ex.sets || 3), 0) || 0;
  const estimatedTime = Math.ceil(totalSets * 1.5);

  const handleStart = () => {
    navigate('/tracker/today', { state: { dayPlan: currentDayPlan } });
  };

  return (
    <div className={`min-h-screen pb-44 ${isDark ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      {/* هدر */}
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
        {/* کارت خلاصه */}
        <div className={`rounded-2xl p-5 border shadow-sm ${isDark ? 'bg-[#1e293b] border-white/5' : 'bg-white border-teal-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-50 text-teal-600'}`}>
                <Dumbbell size={24} />
              </div>
              <div>
                <p className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>حجم تمرین</p>
                <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{toPersianNumber(currentDayPlan.exercises?.length || 0)} حرکت · {toPersianNumber(totalSets)} ست</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>زمان تخمینی</p>
              <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>~{toPersianNumber(estimatedTime)} دقیقه</p>
            </div>
          </div>
        </div>

        {/* لیست حرکات */}
        <div className="space-y-3">
          <h3 className={`font-bold text-sm px-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>حرکات امروز:</h3>
          {currentDayPlan.exercises?.map((ex: any, idx: number) => (
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

      {/* دکمه شروع شناور - تنظیم شده برای عدم پوشش توسط نوار پایین */}
      <div className={`fixed bottom-[70px] left-0 right-0 p-4 pt-2 border-t backdrop-blur-xl z-30 ${isDark ? 'bg-[#0f172a]/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
        <div className="max-w-2xl mx-auto">
          <button onClick={handleStart} className="w-full py-4 rounded-2xl font-black text-base text-white shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' }}>
            <Play size={20} fill="currentColor" />
            شروع جلسه تمرینی
          </button>
        </div>
      </div>
    </div>
  );
}
