import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useActiveWorkout } from '../hooks/useActiveWorkout';
import { v4 as uuidv4 } from 'uuid';
import { Dumbbell, Timer, Check, Trophy, X, Play, ChevronLeft, AlertTriangle } from 'lucide-react';
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

  // مقداردهی اولیه ست‌ها
  useEffect(() => {
    if (isActive && selectedDay && (!session?.setsLog || session.setsLog.length === 0)) {
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
            weight: 0
          });
        }
      });
      updateSession({ setsLog: initialSets });
    }
  }, [isActive, selectedDay]);

  // AutoStart logic
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
        setRestTimer(prev => { if (prev <= 1) { setIsResting(false); return 0; } return prev - 1; });
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
    const updatedSets = [...(session.setsLog || [])];
    updatedSets[index] = { ...updatedSets[index], [field]: value };
    updateSession({ setsLog: updatedSets });
  };

  const completeSet = (index: number) => {
    if (!session) return;
    updateSet(index, 'completed', true);
    const current = session.setsLog?.[index];
    const ex = selectedDay?.exercises?.find((e: any) => (e.id || e.name) === current?.exerciseId);
    if (ex?.rest) { setRestTimer(Number(ex.rest) || 60); setIsResting(true); }
  };

  // ✅ اصلاح شده: لغو ایمن بدون صفحه سفید و بدون بازگشت سشن پاک‌شده از localStorage
  const confirmCancel = () => {
    // 1. ابتدا سشن را در همین لحظه و به‌صورت همزمان پاک کن (localStorage + state).
    //    قبلاً این کار با setTimeout بعد از navigate انجام می‌شد؛ چون هوک useActiveWorkout
    //    هنگام unmount شدن این کامپوننت cleanup اجرا نمی‌کند، سشن در localStorage باقی
    //    می‌ماند و با هر ورود مجدد به صفحه تمرین دوباره برمی‌گشت («لغو کار نمی‌کند»).
    endSession();

    // 2. مودال را ببند تا رندر نهایی این کامپوننت تمیز بماند
    setShowCancelModal(false);

    // 3. تایمرها را متوقف کن
    if (timerRef.current) clearInterval(timerRef.current);
    if (restTimerRef.current) clearInterval(restTimerRef.current);
    
    // 4. کاربر را به داشبورد بفرست (با replace تا دکمه بازگشت به صفحه تمرین برنگردد)
    navigate('/dashboard', { replace: true });
  };

  // ✅ اصلاح شده: پایان و رفتن به گزارش پیشرفت
  const completeWorkout = () => {
    if (!activeProfile || !activeProgram || !session) return;
    
    const completed = session.setsLog?.filter(s => s.completed) || [];
    let totalVolume = 0;
    completed.forEach(set => {
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
      sets: session.setsLog || [],
      notes: '',
      totalVolume,
    });
    
    if (timerRef.current) clearInterval(timerRef.current);
    if (restTimerRef.current) clearInterval(restTimerRef.current);

    setShowComplete(true);
    
    setTimeout(() => {
      endSession();
    }, 200);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60), secs = seconds % 60;
    return toPersianNumber(String(mins).padStart(2, '0')) + ':' + toPersianNumber(String(secs).padStart(2, '0'));
  };

  // --- UI Components ---

  if (!activeProgram) return <div className="p-10 text-center">برنامه‌ای یافت نشد</div>;
  
  if (showComplete) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[80vh] ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <Trophy size={64} className="text-[#b8f542] mb-6" />
        <h2 className="text-3xl font-bold mb-2">جلسه عالی بود!</h2>
        <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>مدت زمان: {formatTime(workoutTime)}</p>
        <button onClick={() => navigate('/progress')} className="px-8 py-3 bg-[#b8f542] text-black font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
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
          <p className={`text-sm text-center mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>آیا مطمئن هستید؟ اطلاعات ثبت شده ذخیره نخواهد شد.</p>
          <div className="flex gap-3">
            <button onClick={() => setShowCancelModal(false)} className={`flex-1 py-3 rounded-xl font-bold ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}>خیر</button>
            <button onClick={confirmCancel} className="flex-1 py-3 rounded-xl font-bold bg-[#ef4444] text-white">بله، لغو کن</button>
          </div>
        </div>
      </div>
    );
  }

  // صفحه انتخاب روز (وقتی سشن فعال نیست)
  if (!isActive) {
    return (
      <div className={`space-y-5 p-4 min-h-screen ${isDark ? 'bg-[#0d0d1a] text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="flex items-center justify-between mb-6">
           <button onClick={() => navigate(-1)} className={`p-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white shadow'}`}><ChevronLeft size={20} /></button>
           <h2 className="text-xl font-bold">انتخاب روز تمرین</h2>
           <div className="w-8"></div>
        </div>
        <div className="grid gap-3">
          {activeProgram.days.map((day: any, i: number) => (
            <button key={i} onClick={() => { setSelectedDayIndex(i); navigate(`/workout?day=${i}`); }}
              className={`p-4 rounded-2xl border text-right transition-all ${
                i === selectedDayIndex 
                  ? 'border-[#b8f542] bg-[#b8f542]/10' 
                  : isDark ? 'border-gray-700 bg-[#1a1a2e]' : 'border-gray-200 bg-white'
              }`}>
              <h3 className="font-bold text-lg">{day.day}</h3>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{day.muscleGroups?.join('، ')}</p>
            </button>
          ))}
        </div>
        <button 
          onClick={handleStartOrResume} 
          className="w-full py-4 bg-[#b8f542] text-black font-bold rounded-xl mt-6 text-lg shadow-lg active:scale-95 transition-transform"
        >
          شروع تمرین {selectedDay?.day}
        </button>
      </div>
    );
  }

  // محیط اصلی تمرین
  const sets = session?.setsLog || [];

  return (
    <div className={`min-h-screen pb-28 p-4 ${isDark ? 'bg-[#0d0d1a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sticky top-0 z-10 py-2">
        <button onClick={() => setShowCancelModal(true)} className={`p-2 rounded-full ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white shadow text-gray-600'}`}>
          <X size={24} />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-lg">{selectedDay?.day}</h2>
          <p className={`text-xs font-mono ${isDark ? 'text-[#b8f542]' : 'text-[#0d9488]'}`}>{formatTime(workoutTime)}</p>
        </div>
        <button onClick={completeWorkout} className="px-4 py-2 bg-[#b8f542] text-black text-sm font-bold rounded-xl shadow-md">
          پایان
        </button>
      </div>

      {/* Rest Timer */}
      {isResting && restTimer > 0 && (
        <div className={`mb-6 p-4 rounded-2xl text-center border ${isDark ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
          <p className={`font-bold text-3xl mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{formatTime(restTimer)}</p>
          <p className="text-xs opacity-70">زمان استراحت</p>
          <button onClick={() => setIsResting(false)} className="mt-3 text-xs px-4 py-1.5 rounded-full bg-blue-600 text-white font-bold">رد کردن استراحت</button>
        </div>
      )}

      {/* Exercises List */}
      <div className="space-y-6">
        {(selectedDay?.exercises || []).map((ex: any, ei: number) => {
          const exerciseSets = sets.filter((s: any) => s.exerciseId === (ex.id || ex.name));
          return (
            <div key={ei} className={`rounded-2xl p-5 border ${isDark ? 'bg-[#1a1a2e] border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex justify-between items-end mb-4 border-b pb-3 border-gray-700/50">
                <h4 className={`font-bold text-lg ${isDark ? 'text-[#b8f542]' : 'text-[#0d9488]'}`}>{ex.name}</h4>
                <span className="text-xs opacity-60">{ex.sets} ست × {ex.reps}</span>
              </div>
              
              <div className="space-y-3">
                {exerciseSets.map((set: any, si: number) => {
                  const globalIndex = sets.indexOf(set);
                  return (
                    <div key={si} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      set.completed 
                        ? (isDark ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200') 
                        : (isDark ? 'bg-[#0d0d1a] border border-gray-700' : 'bg-gray-50 border border-gray-200')
                    }`}>
                      <span className="text-xs font-bold w-6 opacity-50">#{set.setNumber}</span>
                      
                      <div className="flex-1 flex items-center gap-2">
                        <div className="relative flex-1">
                          <input 
                            type="number" 
                            placeholder="وزنه"
                            className={`w-full rounded-lg p-2 text-center text-sm outline-none focus:ring-2 focus:ring-[#b8f542] ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 border border-gray-300'}`}
                            value={set.weight === 0 ? '' : set.weight}
                            onChange={(e) => updateSet(globalIndex, 'weight', Number(e.target.value))}
                          />
                          <span className="absolute left-2 top-2 text-[10px] opacity-40">kg</span>
                        </div>
                        
                        <span className="opacity-30">×</span>
                        
                        <div className="relative flex-1">
                          <input 
                            type="number" 
                            placeholder="تکرار"
                            className={`w-full rounded-lg p-2 text-center text-sm outline-none focus:ring-2 focus:ring-[#b8f542] ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 border border-gray-300'}`}
                            value={set.actualReps === 0 ? '' : set.actualReps}
                            onChange={(e) => updateSet(globalIndex, 'actualReps', Number(e.target.value))}
                          />
                        </div>
                      </div>

                      <button 
                        onClick={() => completeSet(globalIndex)} 
                        disabled={set.completed}
                        className={`p-2.5 rounded-xl transition-all ${
                          set.completed 
                            ? 'bg-green-500 text-white shadow-inner' 
                            : 'bg-[#b8f542] text-black hover:bg-[#a3d93b] shadow-md'
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
