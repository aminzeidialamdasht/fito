import { useState } from 'react';
import { Calendar as CalIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import { 
  getTodayJalali, getJalaliCalendarDays, getMonthName, 
  PERSIAN_WEEKDAYS, toPersianNumber, getTodayJalaliString 
} from '../utils/jalali';
import { useAppContext } from '../context/AppContext';

export default function CalendarPage() {
  const { state } = useAppContext();
  const today = getTodayJalali();
  const [currentYear, setCurrentYear] = useState(today.year);
  const [currentMonth, setCurrentMonth] = useState(today.month);

  const days = getJalaliCalendarDays(currentYear, currentMonth);
  const todayStr = getTodayJalaliString();

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(today.year);
    setCurrentMonth(today.month);
  };

  // Get completed sessions for current month (simplified)

  const getSessionsForDay = (day: number) => {
    return state.sessions.filter(s => {
      const d = new Date(s.date);
      // Only show completed sessions
      return d.getDate() === day && s.completed;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <CalIcon size={22} className="text-[#14b8a6]" />
        تقویم تمرینی
      </h2>

      {/* Calendar */}
      <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#14b8a6]/10">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-lg transition-all">
            <ChevronRight size={20} className="text-[#14b8a6]" />
          </button>
          <div className="text-center">
            <h3 className="text-white font-bold text-lg">
              {getMonthName(currentMonth)} {toPersianNumber(currentYear)}
            </h3>
            <button onClick={goToToday} className="text-xs text-[#4a90d9] hover:underline mt-1">
              برو به امروز
            </button>
          </div>
          <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-lg transition-all">
            <ChevronLeft size={20} className="text-[#14b8a6]" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {PERSIAN_WEEKDAYS.map(day => (
            <div key={day} className="text-center text-xs text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="aspect-square" />;
            }
            
            const dateStr = `${toPersianNumber(currentYear)}/${toPersianNumber(String(currentMonth).padStart(2, '0'))}/${toPersianNumber(String(day).padStart(2, '0'))}`;
            const isToday = dateStr === todayStr;
            const daySessions = getSessionsForDay(day);
            const hasSession = daySessions.length > 0;
            
            return (
              <div
                key={index}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative transition-all cursor-pointer
                  ${isToday ? 'bg-[#14b8a6] text-[#0d0d1a] font-bold' : 'hover:bg-white/5'}
                  ${hasSession && !isToday ? 'border border-[#4a90d9]/30' : ''}
                `}
              >
                <span>{toPersianNumber(day)}</span>
                {hasSession && !isToday && (
                  <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#4a90d9]" />
                )}
                {hasSession && isToday && (
                  <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#0d0d1a]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#14b8a6]/10">
        <h3 className="text-[#14b8a6] font-bold mb-4">جلسات اخیر</h3>
        {state.sessions.filter(s => s.completed).length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">هنوز جلسه تکمیل شده‌ای ثبت نشده</p>
        ) : (
          <div className="space-y-3">
            {state.sessions.filter(s => s.completed).slice(-5).reverse().map(session => (
              <div key={session.id} className="flex items-center justify-between bg-[#0d0d1a] rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    session.completed ? 'bg-[#22c55e]/20' : 'bg-[#f59e0b]/20'
                  }`}>
                    {session.completed ? '✓' : '⏳'}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {session.completed ? 'تکمیل شده' : 'در حال انجام'}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(session.date).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-[#14b8a6] text-sm font-bold">{toPersianNumber(session.totalVolume)} kg</p>
                  <p className="text-gray-500 text-xs">حجم کل</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Training Schedule */}
      {state.activeProgram && (
        <div className="bg-[#1a1a2e] rounded-2xl p-5 border border-[#14b8a6]/10">
          <h3 className="text-[#14b8a6] font-bold mb-4">برنامه هفتگی</h3>
          <div className="space-y-2">
            {state.programs.find(p => p.id === state.activeProgram)?.days.map((day, i) => (
              <div key={day.id} className="flex items-center gap-3 bg-[#0d0d1a] rounded-xl p-3">
                <div className="w-8 h-8 rounded-full bg-[#4a90d9]/20 flex items-center justify-center text-[#4a90d9] text-xs font-bold">
                  {toPersianNumber(i + 1)}
                </div>
                <div>
                  <p className="text-white text-sm">{day.day}</p>
                  <p className="text-gray-500 text-xs">{day.muscleGroups.join('، ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
