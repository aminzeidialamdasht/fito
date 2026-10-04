import { useNavigate } from 'react-router-dom';
import { Dumbbell, CheckCircle2, Circle, ChevronLeft, CalendarDays } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { formatDateJalali, toPersianNumber } from '../utils/jalali';
import { useMemo } from 'react';

export default function History() {
  const navigate = useNavigate();
  const { sessions } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // مرتب‌سازی جلسات: جدیدترین اول
  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => 
      new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    );
  }, [sessions]);

  return (
    <div className={`min-h-screen pb-24 ${isDark ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      {/* هدر */}
      <div className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 py-4 flex items-center gap-3 ${
        isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white/90 border-gray-200'
      }`}>
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5">
          <ChevronLeft size={24} className={isDark ? 'text-white' : 'text-gray-800'} />
        </button>
        <div>
          <h1 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
            تاریخچه تمرینات
          </h1>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {toPersianNumber(sortedSessions.length)} جلسه ثبت شده
          </p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {sortedSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <Dumbbell size={48} className="mb-4" />
            <p className="font-bold">هنوز جلسه‌ای ثبت نشده</p>
            <p className="text-sm mt-1">اولین تمرین خود را از داشبورد شروع کنید</p>
          </div>
        ) : (
          sortedSessions.map((session) => {
            const isCompleted = session.sets.every(s => s.completed);
            const completedCount = session.sets.filter(s => s.completed).length;
            
            return (
              <div 
                key={session.id}
                onClick={() => navigate(`/session/${session.id}`)}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer active:scale-[0.98] transition-all ${
                  isDark 
                    ? 'bg-[#1e293b] border-white/5 hover:border-teal-500/30' 
                    : 'bg-white border-gray-100 hover:border-teal-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isCompleted 
                      ? (isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-50 text-teal-600')
                      : (isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')
                  }`}>
                    {isCompleted ? <CheckCircle2 size={24} /> : <Dumbbell size={24} />}
                  </div>
                  
                  <div>
                    <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {session.sets[0]?.exerciseName?.split(' ')[0] || 'جلسه تمرینی'}...
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <CalendarDays size={12} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {session.date ? formatDateJalali(session.date) : 'بدون تاریخ'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isCompleted 
                      ? (isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-50 text-teal-700')
                      : (isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-700')
                  }`}>
                    {isCompleted ? 'تکمیل شده' : `${session.sets.filter(s=>s.completed).length} / ${session.sets.length} ست`}
                  </span>
                  {!isCompleted && (
                    <div className="flex items-center gap-1 text-[10px] opacity-70">
                      <Circle size={10} className="fill-current" />
                      <span>ادامه دهید</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
