import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useActiveWorkout } from '../hooks/useActiveWorkout';
import { v4 as uuidv4 } from 'uuid';
import { Dumbbell, Check, Trophy, X, ChevronLeft, AlertTriangle, Minus, Plus } from 'lucide-react';
import { toPersianNumber } from '../utils/jalali';

export default function WorkoutTracker() {
  const { state, activeProfile, programs, addSession } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { session, isActive, startSession, endSession, updateSession } = useActiveWorkout();
  const activeProgram = programs.find(p => p.id === state.activeProgram) || programs[0];

  const getInitialDayIndex = () => {
    const dayParam = searchParams.get('day');
    if (dayParam !== null) return parseInt(dayParam);
    return ((new Date().getDay() + 1) % 7) % (activeProgram?.days.length || 1);
  };

  const [selectedDayIndex, setSelectedDayIndex] = useState(getInitialDayIndex());
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const timerRef = useRef<any>(null);
  const restTimerRef = useRef<any>(null);

  const selectedDay = activeProgram?.days[selectedDayIndex];
  const isCurrentDayActive = isActive && session?.dayId === String(selectedDayIndex);

  const accent = isDark ? '#d4af37' : '#14b8a6';
  const accentText = isDark ? 'text-[#d4af37]' : 'text-[#0d9488]';

  useEffect(() => {
    if (isActive && selectedDay && (!(session as any)?.setsLog || (session as any).setsLog.length === 0)) {
      const initialSets: any[] = [];
      (selectedDay.exercises || []).forEach((ex: any) => {
        for (let i = 1; i <= (ex.sets || 1); i++) {
          initialSets.push({
            exerciseId: ex.id || ex.name,
            exerciseName: ex.name,
            setNumber: i,
            targetReps: String(ex.reps),
            completed: false,
            actualReps: 0,
            weight: 0,
          });
        }
      });
      updateSession({ setsLog: initialSets } as any);
    }
  }, [isActive, selectedDay]);

  useEffect(() => {
    if (searchParams.get('autoStart') === 'true' && activeProgram && !isActive) {
      handleStartOrResume();
    }
  }, [activeProgram, searchParams, isActive]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => setWorkoutTime(p => p + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive]);

  useEffect(() => {
    if (isResting && restTimer > 0) {
      restTimerRef.current = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) { setIsResting(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (restTimerRef.current) clearInterval(restTimerRef.current); };
  }, [isResting, restTimer]);

  const handleStartOrResume = () => {
    if (!selectedDay || !activeProfile || !activeProgram) return;
    if (!isCurrentDayActive) {
      startSession(activeProgram.id, String(selectedDayIndex));
      setWorkoutTime(0);
    }
  };

  const updateSet = (index: number, field: string, value: any) => {
    if (!session) return;
    const updatedSets = [...((session as any).setsLog || [])];
    updatedSets[index] = { ...updatedSets[index], [field]: value };
    updateSession({ setsLog: updatedSets } as any);
  };

  const completeSet = (index: number) => {
    if (!session) return;
    updateSet(index, 'completed', true);
    const current = (session as any).setsLog?.[index];
    const ex = selectedDay?.exercises?.find((e: any) => (e.id || e.name) === current?.exerciseId);
    if (ex?.rest) {
      setRestTimer(Number(ex.rest) || 60);
      setIsResting(true);
    }
  };

  const confirmCancel = () => {
    endSession();
    setShowCancelModal(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (restTimerRef.current) clearInterval(restTimerRef.current);
    navigate('/', { replace: true });
  };

  const completeWorkout = () => {
    if (!activeProfile || !activeProgram || !session) return;

    const setsLog = (session as any).setsLog || [];
    const completed = setsLog.filter((s: any) => s.completed);
    let totalVolume = 0;
    completed.forEach((set: any) => {
      totalVolume += Number(set.weight || 0) * Number(set.actualReps || 0);
    });

    addSession({
      id: uuidv4(),
      profileId: activeProfile.id,
      programId: activeProgram.id,
      dayId: session.dayId,
      date: new Date().toISOString(),
      startTime: new Date(session.startTime).toISOString(),
      endTime: new Date().toISOString(),
      duration: workoutTime,
      completed: true,
      sets: setsLog,
      notes: '',
      totalVolume,
    });

    if (timerRef.current) clearInterval(timerRef.current);
    if (restTimerRef.current) clearInterval(restTimerRef.current);
    setShowComplete(true);
    setTimeout(() => endSession(), 200);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return toPersianNumber(String(mins).padStart(2, '0')) + ':' + toPersianNumber(String(secs).padStart(2, '0'));
  };

  const sets = (session as any)?.setsLog || [];
  const completedCount = sets.filter((s: any) => s.completed).length;
  const totalSets = sets.length || 1;
  const progressPct = Math.round((completedCount / totalSets) * 100);

  if (!activeProgram) {
    return (
      <div className="p-10 text-center space-y-4">
        <Dumbbell size={48} className="mx-auto opacity-40" />
        <p className="font-bold">برنامه‌ای یافت نشد</p>
        <p className="text-sm text-gray-500">ابتدا یک برنامه تمرینی وارد کنید یا از برنامه‌های پیشنهادی استفاده کنید.</p>
        <button onClick={() => navigate('/')} className={`px-6 py-3 rounded-xl font-bold text-black ${isDark ? 'bg-[#d4af37]' : 'bg-[#14b8a6]'}`}>
          بازگشت به داشبورد
        </button>
      </div>
    );
  }

  if (showComplete) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[80vh] ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isDark ? 'bg-[#d4af37]/15' : 'bg-[#14b8a6]/15'}`}>
          <Trophy size={48} className={accentText} />
        </div>
        <h2 className="text-3xl font-black mb-2">جلسه عالی بود!</h2>
        <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>مدت زمان: {formatTime(workoutTime)}</p>
        <button
          onClick={() => navigate('/progress')}
          className={`px-8 py-3.5 font-bold rounded-xl shadow-lg active:scale-95 transition-transform text-black ${isDark ? 'bg-[#d4af37]' : 'bg-[#14b8a6]'}`}
        >
          مشاهده گزارش پیشرفت
        </button>
      </div>
    );
  }

  if (showCancelModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div className={`rounded-2xl p-6 max-w-sm w-full ${isDark ? 'bg-[#1a1a2e]' : 'bg-white'}`}>
          <AlertTriangle className="text-[#ef4444] mx-auto mb-4" size={48} />
          <h3 className={`font-bold text-xl text-center mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>لغو جلسه؟</h3>
          <p className={`text-sm text-center mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            آیا مطمئن هستید؟ اطلاعات ثبت‌شده ذخیره نخواهد شد.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setShowCancelModal(false)} className={`flex-1 py-3 rounded-xl font-bold ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>
              خیر
            </button>
            <button onClick={confirmCancel} className="flex-1 py-3 rounded-xl font-bold bg-[#ef4444] text-white">
              بله، لغو کن
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className={`space-y-5 min-h-screen ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => navigate(-1)} className={`p-2.5 rounded-full ${isDark ? 'bg-white/5' : 'bg-white shadow'}`}>
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-black">انتخاب روز تمرین</h2>
          <div className="w-10" />
        </div>
        <div className="grid gap-3">
          {activeProgram.days.map((day: any, i: number) => (
            <button
              key={i}
              onClick={() => { setSelectedDayIndex(i); navigate(`/workout?day=${i}`); }}
              className={`p-4 rounded-2xl border text-right transition-all active:scale-[0.98] ${
                i === selectedDayIndex
                  ? (isDark ? 'border-[#d4af37] bg-[#d4af37]/10' : 'border-[#14b8a6] bg-[#14b8a6]/10')
                  : isDark ? 'border-white/10 bg-[#1a1a2e]' : 'border-gray-200 bg-white'
              }`}
            >
              <h3 className="font-bold text-lg">{day.day || day.weekday || `روز ${i + 1}`}</h3>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {(day.muscleGroups || day.muscle_groups || []).join('، ')}
              </p>
            </button>
          ))}
        </div>
        <button
          onClick={handleStartOrResume}
          className={`w-full py-4 font-black rounded-2xl mt-4 text-lg shadow-lg active:scale-95 transition-transform text-black ${
            isDark ? 'bg-[#d4af37]' : 'bg-[#14b8a6]'
          }`}
        >
          شروع تمرین {selectedDay?.day || selectedDay?.weekday || ''}
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <div className={`flex items-center justify-between mb-4 sticky top-0 z-10 py-3 -mx-4 px-4 backdrop-blur-xl ${
        isDark ? 'bg-[#080808]/90' : 'bg-white/90'
      }`}>
        <button
          onClick={() => setShowCancelModal(true)}
          className={`p-2.5 rounded-full ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
        >
          <X size={22} />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-base">{selectedDay?.day || selectedDay?.weekday}</h2>
          <p className={`text-xs font-mono ${accentText}`}>{formatTime(workoutTime)}</p>
        </div>
        <button
          onClick={completeWorkout}
          className={`px-4 py-2 text-sm font-bold rounded-xl shadow-md text-black ${isDark ? 'bg-[#d4af37]' : 'bg-[#14b8a6]'}`}
        >
          پایان
        </button>
      </div>

      <div className="mb-5">
        <div className="flex justify-between text-[11px] font-bold mb-1.5">
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            {toPersianNumber(completedCount)} از {toPersianNumber(totalSets)} ست تکمیل‌شده
          </span>
          <span className={accentText}>{toPersianNumber(progressPct)}٪</span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${isDark ? 'bg-[#d4af37]' : 'bg-[#14b8a6]'}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {isResting && restTimer > 0 && (
        <div className={`mb-6 rounded-3xl p-8 text-center border-2 ${
          isDark
            ? 'bg-[#d4af37]/10 border-[#d4af37]/40 shadow-xl shadow-[#d4af37]/10'
            : 'bg-[#14b8a6]/10 border-[#14b8a6]/40 shadow-xl shadow-[#14b8a6]/10'
        }`}>
          <div className={`mx-auto w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center mb-3 ${
            isDark ? 'border-[#d4af37]' : 'border-[#14b8a6]'
          }`}
            style={{
              background: isDark
                ? `conic-gradient(#d4af37 ${(restTimer / 180) * 360}deg, transparent 0deg)`
                : `conic-gradient(#14b8a6 ${(restTimer / 180) * 360}deg, transparent 0deg)`,
            }}
          >
            <div className={`w-[7.5rem] h-[7.5rem] rounded-full flex flex-col items-center justify-center ${
              isDark ? 'bg-[#0d0d1a]' : 'bg-white'
            }`}>
              <Dumbbell size={20} className={`mb-1 ${accentText}`} />
              <p className={`font-black text-3xl tracking-wider ${accentText}`}>{formatTime(restTimer)}</p>
              <p className="text-[10px] opacity-60 mt-0.5">استراحت</p>
            </div>
          </div>
          <button
            onClick={() => setIsResting(false)}
            className={`text-xs px-5 py-2 rounded-full font-bold ${
              isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            رد کردن استراحت
          </button>
        </div>
      )}

      <div className="space-y-5">
        {(selectedDay?.exercises || []).map((ex: any, ei: number) => {
          const exerciseSets = sets.filter((s: any) => s.exerciseId === (ex.id || ex.name));
          const doneSets = exerciseSets.filter((s: any) => s.completed).length;
          return (
            <div
              key={ei}
              className={`rounded-2xl p-5 border ${
                isDark ? 'bg-[#1a1a2e] border-white/5' : 'bg-white border-gray-100 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-end mb-4 pb-3 border-b border-white/5">
                <div>
                  <h4 className={`font-black text-lg ${accentText}`}>{ex.name}</h4>
                  <p className="text-xs opacity-50 mt-0.5">
                    {toPersianNumber(ex.sets)} ست × {ex.reps}
                    {ex.rest ? ` · استراحت ${toPersianNumber(ex.rest)}ث` : ''}
                  </p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                  doneSets === exerciseSets.length
                    ? 'bg-green-500/20 text-green-400'
                    : isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}>
                  {toPersianNumber(doneSets)}/{toPersianNumber(exerciseSets.length)}
                </span>
              </div>

              <div className="space-y-3">
                {exerciseSets.map((set: any, si: number) => {
                  const globalIndex = sets.indexOf(set);
                  return (
                    <div
                      key={si}
                      className={`flex items-center gap-2 p-3 rounded-xl transition-all ${
                        set.completed
                          ? (isDark ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200')
                          : (isDark ? 'bg-[#0d0d1a] border border-white/10' : 'bg-gray-50 border border-gray-200')
                      }`}
                    >
                      <span className="text-xs font-bold w-5 opacity-40">#{toPersianNumber(set.setNumber)}</span>

                      <div className="flex-1 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateSet(globalIndex, 'weight', Math.max(0, Number(set.weight || 0) - 2.5))}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isDark ? 'bg-white/10 text-[#d4af37]' : 'bg-white border text-[#0d9488]'
                          }`}
                        >
                          <Minus size={14} />
                        </button>
                        <div className="relative flex-1">
                          <input
                            type="number"
                            inputMode="decimal"
                            placeholder="وزن"
                            className={`w-full rounded-lg py-2.5 text-center text-sm font-bold outline-none focus:ring-2 ${
                              isDark
                                ? 'bg-transparent text-white focus:ring-[#d4af37]/50'
                                : 'bg-white text-gray-900 border border-gray-200 focus:ring-[#14b8a6]/50'
                            }`}
                            value={set.weight === 0 ? '' : set.weight}
                            onChange={e => updateSet(globalIndex, 'weight', Number(e.target.value))}
                          />
                          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] opacity-40">kg</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateSet(globalIndex, 'weight', Number(set.weight || 0) + 2.5)}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isDark ? 'bg-white/10 text-[#d4af37]' : 'bg-white border text-[#0d9488]'
                          }`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span className="opacity-20 text-sm">×</span>

                      <div className="flex-1 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateSet(globalIndex, 'actualReps', Math.max(0, Number(set.actualReps || 0) - 1))}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isDark ? 'bg-white/10 text-[#d4af37]' : 'bg-white border text-[#0d9488]'
                          }`}
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          inputMode="numeric"
                          placeholder="تکرار"
                          className={`w-full rounded-lg py-2.5 text-center text-sm font-bold outline-none focus:ring-2 ${
                            isDark
                              ? 'bg-transparent text-white focus:ring-[#d4af37]/50'
                              : 'bg-white text-gray-900 border border-gray-200 focus:ring-[#14b8a6]/50'
                          }`}
                          value={set.actualReps === 0 ? '' : set.actualReps}
                          onChange={e => updateSet(globalIndex, 'actualReps', Number(e.target.value))}
                        />
                        <button
                          type="button"
                          onClick={() => updateSet(globalIndex, 'actualReps', Number(set.actualReps || 0) + 1)}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isDark ? 'bg-white/10 text-[#d4af37]' : 'bg-white border text-[#0d9488]'
                          }`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => completeSet(globalIndex)}
                        disabled={set.completed}
                        className={`p-3 rounded-xl transition-all shrink-0 ${
                          set.completed
                            ? 'bg-green-500 text-white'
                            : isDark
                              ? 'bg-[#d4af37] text-black hover:brightness-110 shadow-md shadow-[#d4af37]/20'
                              : 'bg-[#14b8a6] text-white hover:brightness-110 shadow-md'
                        }`}
                      >
                        <Check size={20} strokeWidth={3} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
