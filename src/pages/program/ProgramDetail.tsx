import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { soundEffects } from '../../utils/sound';
import { toPersianNumber } from '../../utils/jalali';
import {
  ChevronLeft,
  Dumbbell,
  Play,
  Calendar,
  Clock,
  Target,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ArrowRightLeft,
  Zap,
  RefreshCw,
} from 'lucide-react';
import SubstituteModal from '../../components/SubstituteModal';

const PERSIAN_WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

export default function ProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { programs, state, setActiveProgram, updateProgram } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const program = programs.find((p) => p.id === id);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [substituteTarget, setSubstituteTarget] = useState<{
    dayIdx: number;
    exIdx: number;
    exerciseId: string;
    exerciseName: string;
  } | null>(null);

  const teal = isDark ? '#14b8a6' : '#0d9488';
  const gold = isDark ? '#d4af37' : '#f59e0b';
  const bgMain = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textMain = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';
  const borderCard = isDark ? 'border-white/5' : 'border-gray-200';

  if (!program) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${bgMain}`}>
        <Dumbbell size={48} className="opacity-30 mb-4" />
        <h2 className={`text-xl font-black mb-2 ${textMain}`}>برنامه یافت نشد</h2>
        <button
          onClick={() => navigate('/programs')}
          className="mt-4 px-6 py-3 rounded-xl font-bold text-white"
          style={{ background: teal }}
        >
          بازگشت به برنامه‌ها
        </button>
      </div>
    );
  }

  const isActive = state.activeProgram === program.id;
  const days = (program as any).days || [];

  const handleStartDay = (dayIndex: number) => {
    soundEffects.playClick();
    // فعال‌سازی برنامه اگر غیرفعال بود
    if (!isActive) {
      setActiveProgram(program.id);
    }
    // انتقال به tracker با روز موردنظر
    navigate(`/tracker/${dayIndex}?day=${dayIndex}&autoStart=true`);
  };

  const handleActivate = () => {
    soundEffects.playClick();
    setActiveProgram(program.id);
  };

  const handleSubstituteSelect = (newExerciseId: string, newExerciseName: string) => {
    if (!substituteTarget || !program) return;

    const { dayIdx, exIdx } = substituteTarget;
    const updatedProgram: any = { ...program };
    const updatedDays = [...(updatedProgram.days || [])];
    const updatedDay = { ...updatedDays[dayIdx] };
    const updatedExercises = [...(updatedDay.exercises || [])];
    const updatedExercise = { ...updatedExercises[exIdx] };

    updatedExercise.exerciseId = newExerciseId;
    updatedExercise.name = newExerciseName;

    updatedExercises[exIdx] = updatedExercise;
    updatedDay.exercises = updatedExercises;
    updatedDays[dayIdx] = updatedDay;
    updatedProgram.days = updatedDays;

    updateProgram(updatedProgram);
    setSubstituteTarget(null);
  };

  return (
    <div className={`min-h-screen pb-24 ${bgMain}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 py-4 ${isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white/90 border-gray-200'}`}>
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5">
            <ChevronLeft size={24} className={isDark ? 'text-white' : 'text-gray-800'} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className={`font-black text-base truncate ${textMain}`}>{program.name}</h1>
            <p className={`text-xs ${textSub}`}>{program.duration || 'برنامه تمرینی'}</p>
          </div>
          {!isActive && (
            <button
              onClick={handleActivate}
              className="px-3 py-2 rounded-xl font-bold text-xs text-white flex items-center gap-1.5"
              style={{ background: teal }}
            >
              <CheckCircle2 size={14} />
              فعال‌سازی
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-3xl mx-auto">
        {/* Program Info Card */}
        <div className={`rounded-2xl p-5 border ${borderCard} ${cardBg}`}>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className={`p-3 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
              <Calendar size={18} className="mx-auto mb-1.5" style={{ color: teal }} />
              <p className={`text-lg font-black ${textMain}`}>{toPersianNumber(days.length)}</p>
              <p className={`text-[10px] ${textSub}`}>روز تمرین</p>
            </div>
            <div className={`p-3 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
              <Target size={18} className="mx-auto mb-1.5" style={{ color: teal }} />
              <p className={`text-lg font-black ${textMain}`}>
                {toPersianNumber(days.reduce((a: number, d: any) => a + (d.exercises?.length || 0), 0))}
              </p>
              <p className={`text-[10px] ${textSub}`}>حرکت</p>
            </div>
            <div className={`p-3 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
              <Clock size={18} className="mx-auto mb-1.5" style={{ color: teal }} />
              <p className={`text-lg font-black ${textMain}`}>{toPersianNumber(program.trainingDays || 0)}</p>
              <p className={`text-[10px] ${textSub}`}>روز/هفته</p>
            </div>
          </div>

          <div className={`p-3 rounded-xl text-xs leading-6 ${isDark ? 'bg-teal-500/5 text-gray-300' : 'bg-teal-50 text-gray-700'}`}>
            <div className="flex items-start gap-2">
              <Zap size={14} className="flex-shrink-0 mt-0.5" style={{ color: teal }} />
              <p>
                برای شروع هر جلسه، روی دکمه «شروع جلسه» همان روز کلیک کنید.
                اگر روز تمرین شما تغییر کرده، می‌توانید هر روزی را انتخاب کنید.
              </p>
            </div>
          </div>
        </div>

        {/* Days List */}
        <h2 className={`font-black text-sm px-1 ${textMain}`}>جلسات تمرینی</h2>

        {days.map((day: any, idx: number) => {
          const isExpanded = expandedDay === idx;
          const exercises = day.exercises || [];
          const totalSets = exercises.reduce((a: number, e: any) => a + (Number(e.sets) || 0), 0);
          const dayName = day.weekday || day.day || PERSIAN_WEEKDAYS[idx % 7];

          return (
            <div
              key={idx}
              className={`rounded-2xl border overflow-hidden transition-all ${borderCard} ${cardBg}`}
            >
              {/* Day Header */}
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setExpandedDay(isExpanded ? null : idx);
                }}
                className="w-full p-4 flex items-center justify-between text-right"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-base font-black"
                    style={{ background: `${teal}20`, color: teal }}
                  >
                    {toPersianNumber(idx + 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-black text-sm truncate ${textMain}`}>{dayName}</h3>
                    <p className={`text-[11px] ${textSub} mt-0.5`}>
                      {toPersianNumber(exercises.length)} حرکت · {toPersianNumber(totalSets)} ست
                      {day.estimatedDuration ? ` · ~${toPersianNumber(day.estimatedDuration)} دقیقه` : ''}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp size={20} className={textSub} />
                ) : (
                  <ChevronDown size={20} className={textSub} />
                )}
              </button>

              {/* Day Content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {/* Exercises */}
                  {exercises.map((ex: any, exIdx: number) => (
                    <div
                      key={exIdx}
                      className={`flex items-center gap-2 p-2.5 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 ${isDark ? 'bg-white/10 text-white' : 'bg-white text-gray-600'}`}>
                        {toPersianNumber(exIdx + 1)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-bold truncate ${textMain}`}>{ex.name}</p>
                        <p className={`text-[10px] ${textSub}`}>
                          {toPersianNumber(ex.sets || 0)} ست × {ex.reps || '—'}
                          {ex.rest ? ` · استراحت ${toPersianNumber(ex.rest)} ثانیه` : ''}
                        </p>
                      </div>
                      {(ex.exerciseId || ex.id) && (
                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setSubstituteTarget({
                              dayIdx: idx,
                              exIdx,
                              exerciseId: ex.exerciseId || ex.id,
                              exerciseName: ex.name,
                            });
                          }}
                          className={`p-1.5 rounded-lg flex-shrink-0 ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                          title="تغییر حرکت"
                        >
                          <RefreshCw size={14} />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Start Day Button */}
                  <button
                    onClick={() => handleStartDay(idx)}
                    className="w-full mt-3 py-3 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md"
                    style={{ background: `linear-gradient(135deg, ${teal} 0%, ${gold} 100%)` }}
                  >
                    <Play size={16} />
                    شروع جلسه {dayName}
                  </button>

                  {/* Move/Reschedule hint */}
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      navigate(`/tracker/${idx}?day=${idx}&autoStart=true`);
                    }}
                    className={`w-full py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    <ArrowRightLeft size={12} />
                    جابجایی یا شروع در روز دیگر
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {days.length === 0 && (
          <div className={`rounded-2xl p-8 text-center ${borderCard} ${cardBg}`}>
            <Dumbbell size={40} className="mx-auto mb-3 opacity-30" />
            <p className={`text-sm ${textSub}`}>این برنامه هیچ روز تمرینی ندارد</p>
          </div>
        )}
      </div>

      {substituteTarget && (
        <SubstituteModal
          exerciseId={substituteTarget.exerciseId}
          exerciseName={substituteTarget.exerciseName}
          onSelect={handleSubstituteSelect}
          onClose={() => setSubstituteTarget(null)}
        />
      )}
    </div>
  );
}
