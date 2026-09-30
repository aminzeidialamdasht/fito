import { useState } from 'react';
import { Calendar as CalIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import { 
  getTodayJalali, getJalaliCalendarDays, getMonthName, 
  PERSIAN_WEEKDAYS, toPersianNumber, getTodayJalaliString,
  toGregorianDateFromJalali, getWeekdayName, formatDateJalali
} from '../utils/jalali';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { getThemeClasses } from '../utils/themeColors';

export default function CalendarPage() {
  const { state, programs } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const tc = getThemeClasses(isDark);
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

  // برنامه فعال برای نمایش جلسات تمرین برنامه‌ریزی‌شده در تقویم
  const activeProgram = programs.find(p => p.id === state.activeProgram) || programs[0];
  const programDays: any[] = Array.isArray((activeProgram as any)?.days) ? (activeProgram as any).days : [];

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

  const hasExplicitSchedule =
    programDays.some((d: any) => typeof d?.weekday === 'string' && d.weekday.trim().length > 0) ||
    ((activeProgram as any)?.restDays ?? []).length > 0;

  // یک جلسه تمرین برنامه‌ریزی‌شده (نه تکمیل‌شده) برای روز داده‌شده از ماه جاری
  const getScheduledSessionForDay = (day: number) => {
    if (!programDays.length) return null;

    // اولویت ۱: اگر جلسه‌ای با تاریخ دقیق همان روز ثبت شده باشد (بدون نیاز به تطبیق روز هفته)
    const exact = state.sessions.find(s => {
      const g = toGregorianDateFromJalali(currentYear, currentMonth, day);
      const d = new Date(s.date);
      return (
        d.getFullYear() === g.getFullYear() &&
        d.getMonth() === g.getMonth() &&
        d.getDate() === g.getDate()
      );
    });
    if (exact) return exact;

    // اولویت ۲: تطبیق روز هفته با برنامه هفتگی
    const g = toGregorianDateFromJalali(currentYear, currentMonth, day);
    const weekdayName = getWeekdayName(g);
    let dayData = hasExplicitSchedule
      ? findProgramDayByWeekday(weekdayName)
      : programDays[(g.getDay() + 1) % 7] ?? programDays[0];
    if (!dayData) return null;

    const dayIndex = programDays.indexOf(dayData);
    const scheduled = [...state.sessions]
      .reverse()
      .find(s => s.dayId === String(dayIndex) || s.dayId === dayData.id);
    return scheduled || null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className={`text-xl font-bold flex items-center gap-2 ${tc.textPrimary}`}>
        <CalIcon size={22} className="text-[#14b8a6]" />
        تقویم تمرینی
      </h2>

      {/* Calendar */}
      <div className={`rounded-2xl p-5 border ${tc.card}`}>
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className={`p-2 rounded-lg transition-all ${tc.hoverBg}`}>
            <ChevronRight size={20} className="text-[#14b8a6]" />
          </button>
          <div className="text-center">
            <h3 className={`font-bold text-lg ${tc.textPrimary}`}>
              {getMonthName(currentMonth)} {toPersianNumber(currentYear)}
            </h3>
            <button onClick={goToToday} className="text-xs text-[#4a90d9] hover:underline mt-1">
              برو به امروز
            </button>
          </div>
          <button onClick={nextMonth} className={`p-2 rounded-lg transition-all ${tc.hoverBg}`}>
            <ChevronLeft size={20} className="text-[#14b8a6]" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {PERSIAN_WEEKDAYS.map(day => (
            <div key={day} className={`text-center text-xs py-2 ${tc.textMuted}`}>
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
            // جلسه تکمیل‌شده در این روز
            const hasCompleted = getSessionsForDay(day).length > 0 ||
              (() => {
                const g = toGregorianDateFromJalali(currentYear, currentMonth, day);
                return state.sessions.some(s =>
                  s.completed &&
                  s.date &&
                  (() => {
                    const d = new Date(s.date);
                    return d.getFullYear() === g.getFullYear() &&
                      d.getMonth() === g.getMonth() &&
                      d.getDate() === g.getDate();
                  })()
                );
              })();
            // جلسه برنامه‌ریزی‌شده (تمرین روز) از روی برنامه هفتگی
            const hasScheduled = !!getScheduledSessionForDay(day);
            
            return (
              <div
                key={index}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative transition-all cursor-pointer
                  ${isToday ? 'bg-[#14b8a6] text-[#0d0d1a] font-bold' : tc.hoverBg}
                  ${hasScheduled && !isToday ? 'border border-[#4a90d9]/30' : ''}
                `}
              >
                <span>{toPersianNumber(day)}</span>
                {/* دو نشانگر مجزا: نقطه آبی = تمرین برنامه‌ریزی‌شده، نقطه سبز = جلسه تکمیل‌شده */}
                {(hasScheduled || hasCompleted) && (
                  <div className="absolute bottom-1 flex items-center gap-0.5">
                    {hasScheduled && (
                      <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-[#0d0d1a]' : 'bg-[#4a90d9]'}`} />
                    )}
                    {hasCompleted && (
                      <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-[#0d0d1a]' : 'bg-[#22c55e]'}`} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className={`flex items-center justify-center gap-5 mt-4 pt-4 border-t ${tc.border}`}>
          <div className={`flex items-center gap-1.5 text-xs ${tc.textSecondary}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#4a90d9]" />
            تمرین برنامه‌ریزی‌شده
          </div>
          <div className={`flex items-center gap-1.5 text-xs ${tc.textSecondary}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            جلسه تکمیل‌شده
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className={`rounded-2xl p-5 border ${tc.card}`}>
        <h3 className="text-[#14b8a6] font-bold mb-4">جلسات اخیر</h3>
        {state.sessions.filter(s => s.completed).length === 0 ? (
          <p className={`text-sm text-center py-4 ${tc.textMuted}`}>هنوز جلسه تکمیل شده‌ای ثبت نشده</p>
        ) : (
          <div className="space-y-3">
            {state.sessions.filter(s => s.completed).slice(-5).reverse().map(session => (
              <div key={session.id} className={`flex items-center justify-between rounded-xl p-3 ${tc.bgSubtle}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    session.completed ? 'bg-[#22c55e]/20' : 'bg-[#f59e0b]/20'
                  }`}>
                    {session.completed ? '✓' : '⏳'}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${tc.textPrimary}`}>
                      {session.dayName || (session.completed ? 'تکمیل شده' : 'در حال انجام')}
                    </p>
                    <p className={`text-xs ${tc.textMuted}`}>
                      {formatDateJalali(session.date)}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-[#14b8a6] text-sm font-bold">{toPersianNumber(session.totalVolume)} kg</p>
                  <p className={`text-xs ${tc.textMuted}`}>حجم کل</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Training Schedule */}
      {state.activeProgram && (
        <div className={`rounded-2xl p-5 border ${tc.card}`}>
          <h3 className="text-[#14b8a6] font-bold mb-4">برنامه هفتگی</h3>
          <div className="space-y-2">
            {programs.find(p => p.id === state.activeProgram)?.days.map((day, i) => (
              <div key={day.id} className={`flex items-center gap-3 rounded-xl p-3 ${tc.bgSubtle}`}>
                <div className="w-8 h-8 rounded-full bg-[#4a90d9]/20 flex items-center justify-center text-[#4a90d9] text-xs font-bold">
                  {toPersianNumber(i + 1)}
                </div>
                <div>
                  <p className={`text-sm ${tc.textPrimary}`}>{day.day}</p>
                  <p className={`text-xs ${tc.textMuted}`}>{day.muscleGroups.join('، ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
