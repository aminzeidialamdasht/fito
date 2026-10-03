import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useActiveWorkout } from '../hooks/useActiveWorkout';
import { v4 as uuidv4 } from 'uuid';
import { Dumbbell, Check, X, Minus, Plus, Trophy, AlertTriangle, Play, ChevronLeft, Layers } from 'lucide-react';
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
  const [exerciseChanged, setExerciseChanged] = useState(false);
  const prevExerciseRef = useRef<string>("");
  const timerRef = useRef<any>(null);
  const restTimerRef = useRef<any>(null);

  const selectedDay = activeProgram?.days[selectedDayIndex];
  const isCurrentDayActive = isActive && session?.dayId === String(selectedDayIndex);

  const gold = isDark ? '#d4af37' : '#f59e0b';
  const darkBg = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? '#1e293b' : '#f8fafc';
  const textMain = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';

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
    return `${toPersianNumber(String(mins).padStart(2, '0'))}:${toPersianNumber(String(secs).padStart(2, '0'))}`;
  };

  const sets = (session as any)?.setsLog || [];
  const completedCount = sets.filter((s: any) => s.completed).length;
  const totalSets = sets.length || 1;
  const progressPct = Math.round((completedCount / totalSets) * 100);

  const currentSetIndex = sets.findIndex((s: any) => !s.completed);
  const currentSet = currentSetIndex !== -1 ? sets[currentSetIndex] : (sets.length > 0 ? sets[sets.length - 1] : null);
  useEffect(() => {
    if (!isActive) return;
    const current = currentSet?.exerciseName || '';
    if (prevExerciseRef.current && current && current !== prevExerciseRef.current) {
      setExerciseChanged(true);
      setTimeout(() => setExerciseChanged(false), 2500);
    }
    prevExerciseRef.current = current;
  }, [currentSet?.exerciseName, isActive]);
  
  if (!currentSet && isActive) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[80vh] ${textMain}`}>
        <Dumbbell size={48} className="animate-bounce mb-4" style={{ color: gold }} />
        <p>در حال آماده‌سازی تمرین...</p>
      </div>
    );
  }

  const currentExercise = currentSet?.exerciseName || '';

  // محاسبه حرکت بعدی
  const exerciseNames: string[] = [];
  sets.forEach((s: any) => {
    if (!exerciseNames.includes(s.exerciseName)) exerciseNames.push(s.exerciseName);
  });
  const currentExerciseIdx = exerciseNames.indexOf(currentExercise);
  const nextExerciseName = currentExerciseIdx >= 0 && currentExerciseIdx < exerciseNames.length - 1 ? exerciseNames[currentExerciseIdx + 1] : null;
  const isLastExercise = currentExerciseIdx === exerciseNames.length - 1;
  const totalSetsForExercise = sets.filter((s: any) => s.exerciseName === currentExercise).length;
  const completedSetsForExercise = sets.filter((s: any) => s.exerciseName === currentExercise && s.completed).length;


  if (!activeProgram) {
    return (
      <div className="p-10 text-center space-y-4">
        <Dumbbell size={48} className="mx-auto opacity-40" />
        <p className="font-bold">برنامه‌ای یافت نشد</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 rounded-xl font-bold text-white" style={{ background: gold }}>
          بازگشت به داشبورد
        </button>
      </div>
    );
  }

  if (showComplete) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[80vh] ${textMain}`}>
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: `${gold}20` }}>
          <Trophy size={48} style={{ color: gold }} />
        </div>
        <h2 className="text-3xl font-black mb-2">جلسه عالی بود!</h2>
        <p className={`mb-8 ${textSub}`}>مدت زمان: {formatTime(workoutTime)}</p>
        <button onClick={() => navigate('/progress')} className="px-8 py-3.5 font-bold rounded-xl shadow-lg text-black" style={{ background: gold }}>
          مشاهده گزارش پیشرفت
        </button>
      </div>
    );
  }

  if (showCancelModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div className={`rounded-2xl p-6 max-w-sm w-full ${cardBg}`}>
          <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className={`font-bold text-xl text-center mb-2 ${textMain}`}>لغو جلسه؟</h3>
          <p className={`text-sm text-center mb-6 ${textSub}`}>آیا مطمئن هستید؟ اطلاعات ثبت‌شده ذخیره نخواهد شد.</p>
          <div className="flex gap-3">
            <button onClick={() => setShowCancelModal(false)} className={`flex-1 py-3 rounded-xl font-bold ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>خیر</button>
            <button onClick={confirmCancel} className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white">بله، لغو کن</button>
          </div>
        </div>
      </div>
    );
  }

  // Exercise List View (Before Starting Session)
  if (!isActive && selectedDay) {
    const exercises = selectedDay.exercises || [];
    return (
      <div className={`min-h-screen pb-24 ${darkBg}`}>
        <div className={`sticky top-0 z-10 px-4 py-3 flex items-center justify-between backdrop-blur-md ${isDark ? 'bg-[#0f172a]/90' : 'bg-white/90'}`}>
          <button onClick={() => navigate(-1)} className={`p-2 rounded-full ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <ChevronLeft size={24} />
          </button>
          <h2 className={`font-bold text-base ${textMain}`}>{selectedDay.day || selectedDay.weekday || `روز ${selectedDayIndex + 1}`}</h2>
          <div className="w-10" />
        </div>

        <div className="p-4 space-y-4">
          <div className={`rounded-2xl p-5 border ${isDark ? 'border-white/5 bg-[#1e293b]' : 'border-teal-100 bg-white shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${gold}15` }}>
                <Dumbbell size={24} style={{ color: gold }} />
              </div>
              <div>
                <h3 className={`font-black text-lg ${textMain}`}>{selectedDay.day || selectedDay.weekday}</h3>
                <p className={`text-xs ${textSub}`}>
                  {(selectedDay.muscleGroups || selectedDay.muscle_groups || []).join(' · ')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className={`font-bold ${textSub}`}>{toPersianNumber(exercises.length)} حرکت</span>
              <span className={`font-bold ${textSub}`}>·</span>
              <span className={`font-bold ${textSub}`}>
                {toPersianNumber(exercises.reduce((sum: number, ex: any) => sum + (ex.sets || 1), 0))} ست
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {exercises.map((ex: any, i: number) => (
              <div key={i} className={`rounded-2xl p-4 border ${isDark ? 'border-white/5 bg-[#1e293b]' : 'border-gray-100 bg-white shadow-sm'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                      {toPersianNumber(i + 1)}
                    </span>
                    <h4 className={`font-bold text-sm ${textMain}`}>{ex.name}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs pl-9">
                  <span className={`font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                    {toPersianNumber(ex.sets || 1)} ست
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                    {toPersianNumber(ex.reps)} تکرار
                  </span>
                  {ex.rest && (
                    <span className={`font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                      استراحت {toPersianNumber(ex.rest)}ث
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleStartOrResume}
            className="w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 text-black mt-6"
            style={{ background: gold }}>
            <Play size={22} fill="currentColor" /> شروع جلسه تمرین
          </button>
        </div>
      </div>
    );
  }

  // Active Session View (Timer + Sets)
  return (
    <div className={`min-h-screen pb-24 ${darkBg}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 px-4 py-3 flex items-center justify-between backdrop-blur-md ${isDark ? 'bg-[#0f172a]/90' : 'bg-white/90'}`}>
        <button onClick={() => setShowCancelModal(true)} className={`p-2 rounded-full ${isDark ? 'text-gray-400' : 'text-gray-600'}`}><X size={24} /></button>
        <div className="text-center">
          <h2 className={`font-bold text-base ${textMain}`}>{selectedDay?.day || selectedDay?.weekday}</h2>
          <p className="text-xs font-mono" style={{ color: gold }}>{formatTime(workoutTime)}</p>
        </div>
        <button onClick={completeWorkout} className="px-4 py-2 text-sm font-bold rounded-xl text-black shadow-md" style={{ background: gold }}>پایان</button>
      </div>

      {/* Progress Bar */}
      <div className="px-4 mt-4">
        <div className="flex justify-between text-xs font-bold mb-1.5">
          <span className={textSub}>{toPersianNumber(completedCount)} از {toPersianNumber(totalSets)} ست تکمیل‌شده</span>
          <span style={{ color: gold }}>{toPersianNumber(progressPct)}٪</span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, background: gold }} />
        </div>
      </div>

      {/* FIXED Rest Timer Overlay with High Contrast Inner Circle */}
      {isResting && restTimer > 0 && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className={`w-72 rounded-3xl p-8 text-center border-2 shadow-2xl ${cardBg}`} style={{ borderColor: `${gold}60` }}>
            <div className="mx-auto w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center mb-4 relative"
              style={{ 
                borderColor: gold, 
                background: `conic-gradient(${gold} ${(restTimer / 180) * 360}deg, transparent 0deg)` 
              }}>
              {/* Inner Circle for Readability */}
              <div className={`absolute inset-2 rounded-full flex flex-col items-center justify-center ${isDark ? 'bg-[#0f172a]' : 'bg-white'}`}>
                <Dumbbell size={24} style={{ color: gold }} />
                <p className="font-black text-4xl tracking-wider mt-1" style={{ color: gold }}>{formatTime(restTimer)}</p>
                <p className="text-xs font-bold mt-1" style={{ color: gold }}>استراحت</p>
              </div>
            </div>
            <button onClick={() => setIsResting(false)} className={`text-xs px-6 py-2 rounded-full font-bold ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'}`}>
              رد کردن استراحت
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <div className="relative w-56 h-56 rounded-full border-4 flex flex-col items-center justify-center mb-6 shadow-lg"
          style={{ borderColor: gold, background: isDark ? '#1e293b' : '#fffbeb' }}>
          <Dumbbell size={32} className="mb-2" style={{ color: gold }} />
          <p className="font-black text-5xl tracking-widest" style={{ color: gold }}>{formatTime(workoutTime)}</p>
          <p className="text-sm font-bold mt-2 opacity-80" style={{ color: gold }}>— استراحت —</p>
        </div>

        {/* Next Exercise Banner - always visible */}
        {nextExerciseName && (
          <div className="w-full max-w-md mb-4 rounded-2xl p-3 flex items-center gap-3 shadow-md"
            style={{ background: `linear-gradient(135deg, ${gold}20, ${gold}05)`, border: `1px solid ${gold}60` }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: gold }}>
              <Dumbbell size={18} className="text-black" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold opacity-60" style={{ color: gold }}>حرکت بعدی</p>
              <p className={`text-sm font-black ${textMain}`}>{nextExerciseName}</p>
            </div>
          </div>
        )}

        {/* Current Exercise Card */}
        <div className={`w-full max-w-md rounded-2xl p-5 border shadow-sm ${cardBg}`} style={{ borderColor: `${gold}30` }}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell size={20} style={{ color: gold }} />
            <h3 className={`text-xl font-black ${textMain}`}>{currentExercise}</h3>
          </div>
          
          <div className="flex justify-center items-center gap-2 mb-6">
            <span className={`text-sm font-bold ${textSub}`}>ست</span>
            <span className={`text-lg font-black ${textMain}`}>{toPersianNumber(completedSetsForExercise + 1)}</span>
            <span className={`text-sm font-bold ${textSub}`}>از</span>
            <span className={`text-lg font-black ${textMain}`}>{toPersianNumber(totalSetsForExercise)}</span>
            <Dumbbell size={18} style={{ color: gold }} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Weight Input */}
            <div className="flex flex-col items-center">
              <label className={`text-xs font-bold mb-2 ${textSub}`}>وزن (کیلوگرم)</label>
              <div className="flex items-center gap-2 w-full">
                <button onClick={() => updateSet(currentSetIndex, 'weight', Math.max(0, Number(currentSet.weight || 0) - 2.5))}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'}`} style={{ color: gold }}>−</button>
                <div className="flex-1 relative">
                  <input type="number" inputMode="decimal" placeholder="0"
                    className={`w-full h-12 rounded-xl text-center text-xl font-black outline-none ${isDark ? 'bg-[#0f172a] text-white' : 'bg-white text-gray-900 border border-gray-200'}`}
                    value={currentSet.weight === 0 ? '' : currentSet.weight}
                    onChange={e => updateSet(currentSetIndex, 'weight', Number(e.target.value))} />
                  <span className="absolute left-2 bottom-2 text-[10px] opacity-50">kg</span>
                </div>
                <button onClick={() => updateSet(currentSetIndex, 'weight', Number(currentSet.weight || 0) + 2.5)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'}`} style={{ color: gold }}>+</button>
              </div>
            </div>

            {/* Reps Input */}
            <div className="flex flex-col items-center">
              <label className={`text-xs font-bold mb-2 ${textSub}`}>تکرار</label>
              <div className="flex items-center gap-2 w-full">
                <button onClick={() => updateSet(currentSetIndex, 'actualReps', Math.max(0, Number(currentSet.actualReps || 0) - 1))}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'}`} style={{ color: gold }}>−</button>
                <div className="flex-1 relative">
                  <input type="number" inputMode="numeric" placeholder="0"
                    className={`w-full h-12 rounded-xl text-center text-xl font-black outline-none ${isDark ? 'bg-[#0f172a] text-white' : 'bg-white text-gray-900 border border-gray-200'}`}
                    value={currentSet.actualReps === 0 ? '' : currentSet.actualReps}
                    onChange={e => updateSet(currentSetIndex, 'actualReps', Number(e.target.value))} />
                  <span className="absolute left-1 bottom-2 text-[10px] opacity-50">rep</span>
                </div>
                <button onClick={() => updateSet(currentSetIndex, 'actualReps', Number(currentSet.actualReps || 0) + 1)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'}`} style={{ color: gold }}>+</button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {(() => {
            const isLastSet = completedCount === totalSets - 1;
            return (
              <button
                onClick={() => {
                  if (isLastSet) {
                    completeSet(currentSetIndex);
                    setTimeout(() => completeWorkout(), 300);
                  } else {
                    completeSet(currentSetIndex);
                  }
                }}
                disabled={currentSet.completed}
                className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 text-black mb-3`}
                style={{ background: currentSet.completed ? '#22c55e' : isLastSet ? '#22c55e' : gold }}>
                {isLastSet ? (
                  <>
                    <Trophy size={24} strokeWidth={3} /> پایان جلسه تمرین
                  </>
                ) : (
                  <>
                    <Check size={24} strokeWidth={3} /> اتمام ست
                  </>
                )}
              </button>
            );
          })()}
          
          <button onClick={() => setShowCancelModal(true)}
            className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
            <X size={18} /> لغو ست
          </button>
        </div>
      </div>
    </div>
  );
}
