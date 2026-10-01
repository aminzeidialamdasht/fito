import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Calendar as CalendarIcon, ChevronLeft, Dumbbell, Play, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { toPersianNumber } from '../utils/jalali';
import { useNavigate } from 'react-router-dom';

export default function CalendarPage() {
  const { state, programs } = useAppContext();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});

  const textMain = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';
  const gold = isDark ? '#d4af37' : '#f59e0b';
  const teal = isDark ? '#14b8a6' : '#0d9488';
  const cardBg = isDark ? '#1e293b' : '#f8fafc';

  const activeProgram = programs.find(p => p.id === state.activeProgram) || programs[0];

  // محاسبه ایندکس امروز بر اساس تقویم شمسی (شنبه=0 تا جمعه=6)
  const today = new Date();
  const jsDay = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const currentDayIndex = (jsDay + 1) % 7; 

  const weekDays = useMemo(() => {
    if (!activeProgram?.days) return [];
    // نگاشت صریح ایندکس به نام روزهای هفته فارسی
    const persianWeekdays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
    
    return activeProgram.days.map((day: any, i: number) => ({
      ...day,
      index: i,
      name: day.day || day.weekday || persianWeekdays[i] || `روز ${i + 1}`,
      weekdayName: persianWeekdays[i], // ذخیره نام روز برای نمایش جداگانه
      isToday: i === currentDayIndex,
      muscleGroups: day.muscleGroups || day.muscle_groups || [],
      exercises: Array.isArray(day.exercises) ? day.exercises : [],
    }));
  }, [activeProgram, currentDayIndex]);

  const toggleExpand = (index: number) => {
    setExpandedDays(prev => ({ ...prev, [index]: !prev[index] }));
  };

  if (!activeProgram) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <CalendarIcon size={48} className="mb-4 opacity-40" style={{ color: textSub }} />
        <h2 className={`text-xl font-black mb-2 ${textMain}`}>برنامه‌ای یافت نشد</h2>
        <button onClick={() => navigate('/')} className="px-6 py-3 rounded-xl font-bold text-white shadow-lg" style={{ background: teal }}>
          بازگشت به داشبورد
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-1">
        <button onClick={() => navigate('/')} className={`p-2 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
          <ChevronLeft size={20} style={{ color: textMain }} />
        </button>
        <div>
          <h2 className={`text-xl font-black flex items-center gap-2 ${textMain}`}>
            <CalendarIcon size={22} style={{ color: teal }} /> تقویم تمرینی
          </h2>
          <p className={`text-xs mt-0.5 ${textSub}`}>{(activeProgram as any).program_name || activeProgram.name}</p>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-4">
        {weekDays.map((day: any) => {
          const isExpanded = expandedDays[day.index];
          return (
            <div key={day.index} 
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${day.isToday 
                ? (isDark ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-[#14b8a6] bg-[#14b8a6]/10') 
                : (isDark ? 'border-white/5 bg-[#1e293b]' : 'border-gray-100 bg-white shadow-sm')}`}
            >
              {/* Day Header */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {/* نمایش شماره جلسه و نام روز هفته */}
                      <h4 className={`font-bold text-base ${textMain}`}>
                        روز {toPersianNumber(day.index + 1)} ({day.weekdayName})
                      </h4>
                      {day.isToday && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-white" style={{ background: teal }}>امروز</span>
                      )}
                    </div>
                    {day.muscleGroups.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {day.muscleGroups.map((m: string, i: number) => (
                          <span key={i} className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => navigate(`/workout?day=${day.index}`)}
                      className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-2 rounded-xl transition-all active:scale-95 ${
                        day.isToday ? 'text-black shadow-md' : (isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600')
                      }`}
                      style={day.isToday ? { background: gold } : {}}
                    >
                      <Play size={12} fill="currentColor" /> شروع
                    </button>
                    
                    <button 
                      onClick={() => toggleExpand(day.index)}
                      className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="flex items-center gap-3 text-[10px] pt-2 border-t border-dashed border-opacity-20" style={{ borderColor: textSub }}>
                  <span className={`font-bold flex items-center gap-1 ${textSub}`}>
                    <Dumbbell size={12} /> {toPersianNumber(day.exercises.length)} حرکت
                  </span>
                  <span className={`font-bold flex items-center gap-1 ${textSub}`}>
                    <Layers size={12} /> {toPersianNumber(day.exercises.reduce((sum: number, ex: any) => sum + (ex.sets || 1), 0))} ست کل
                  </span>
                </div>
              </div>

              {/* Expanded Exercises List */}
              {isExpanded && (
                <div className={`px-4 pb-4 pt-2 border-t ${isDark ? 'border-white/5 bg-black/20' : 'border-gray-100 bg-gray-50/50'}`}>
                  <div className="space-y-2 mt-2">
                    {day.exercises.map((ex: any, i: number) => (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-[#0f172a]' : 'bg-white border border-gray-100'}`}>
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                            {toPersianNumber(i + 1)}
                          </span>
                          <span className={`text-xs font-bold ${textMain}`}>{ex.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                            {toPersianNumber(ex.sets || 1)} ست
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                            {toPersianNumber(ex.reps)} تکرار
                          </span>
                        </div>
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
  );
}
