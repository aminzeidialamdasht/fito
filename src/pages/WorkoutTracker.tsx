import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useActiveWorkout } from '../hooks/useActiveWorkout';
import { v4 as uuidv4 } from 'uuid';
import { Dumbbell, Timer, Check, Trophy, X, Play, SkipForward } from 'lucide-react';
import { toPersianNumber } from '../utils/jalali';

// Mock sound effects if not available in utils
const soundEffects = {
  playSetComplete: () => {}, // Placeholder
};

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
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const timerRef = useRef<any>(null);
  const restTimerRef = useRef<any>(null);
  
  const selectedDay = activeProgram?.days[selectedDayIndex];
  const isCurrentDayActive = isActive && session?.dayId === String(selectedDayIndex);

  // Initialize sets when session starts
  useEffect(() => {
    if (isActive && selectedDay && !session?.setsLog?.length) {
       const initialSets: any[] = [];
      (selectedDay.exercises || []).forEach((ex: any) => {
        for (let i = 1; i <= (ex.sets || 1); i++) {
          initialSets.push({ 
            exerciseId: ex.id || ex.name, 
            exerciseName: ex.name, 
            setNumber: i, 
            targetReps: ex.reps, 
            completed: false,
            actualReps: 0,
            weight: 0
          });
        }
      });
      updateSession({ setsLog: initialSets });
    }
  }, [isActive, selectedDay, session]);

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

  const updateSet = (index: number, data: any) => {
    if (!session) return;
    const updatedSets = [...(session.setsLog || [])];
    updatedSets[index] = { ...updatedSets[index], ...data };
    updateSession({ setsLog: updatedSets });
  };

  const completeSet = (index: number) => {
    if (!session) return;
    soundEffects.playSetComplete();
    const current = session.setsLog?.[index];
    
    updateSet(index, {
      completed: true,
      actualReps: Number(current?.actualReps) || parseInt(String(current?.targetReps) || '10'),
    });
    
    const ex = selectedDay?.exercises?.find((e: any) => (e.id || e.name) === current?.exerciseId);
    if (ex?.rest) { setRestTimer(Number(ex.rest) || 60); setIsResting(true); }
  };

  const cancelWorkout = () => setShowCancelModal(true);
  
  const confirmCancel = () => {
    endSession();
    setShowCancelModal(false); 
    setShowCancelConfirm(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (restTimerRef.current) clearInterval(restTimerRef.current);
    navigate('/dashboard');
  };

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
    
    endSession();
    setShowComplete(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60), secs = seconds % 60;
    return toPersianNumber(String(mins).padStart(2, '0')) + ':' + toPersianNumber(String(secs).padStart(2, '0'));
  };

  if (!activeProgram) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Dumbbell size={48} className={isDark ? 'text-[#b8f542]' : 'text-[#0d9488]'} />
        <h2 className={'text-2xl font-bold mt-4 ' + (isDark ? 'text-white' : 'text-gray-900')}>برنامه‌ای فعال نیست</h2>
        <button onClick={() => navigate('/import')} className={'mt-6 px-5 py-3 rounded-xl font-bold ' + (isDark ? 'bg-[#b8f542] text-black' : 'bg-[#14b8a6] text-white')}>ورود برنامه تمرینی</button>
      </div>
    );
  }

  if (showComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Trophy size={48} className="text-[#b8f542] mb-4" />
        <h2 className={'text-2xl font-bold ' + (isDark ? 'text-white' : 'text-gray-900')}>جلسه تمام شد!</h2>
        <p className={'mt-2 ' + (isDark ? 'text-gray-400' : 'text-gray-600')}>زمان: {formatTime(workoutTime)}</p>
        <button onClick={() => { setShowComplete(false); navigate('/progress'); }} className="mt-6 px-5 py-3 rounded-xl font-bold bg-[#b8f542] text-black">مشاهده پیشرفت</button>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="space-y-5">
        <h2 className={'text-2xl font-bold flex items-center gap-2 ' + (isDark ? 'text-white' : 'text-gray-900')}>
          <Dumbbell size={24} className={isDark ? 'text-[#b8f542]' : 'text-[#0d9488]'} /> ترکر تمرین
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {activeProgram.days.map((day: any, i: number) => (
            <button key={i} onClick={() => setSelectedDayIndex(i)}
              className={'px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap ' + (i === selectedDayIndex ? (isDark ? 'bg-[#b8f542] text-black' : 'bg-[#14b8a6] text-white') : (isDark ? 'bg-[#161616] text-gray-400' : 'bg-gray-100'))}>
              {day.day || ('روز ' + (i + 1))}
            </button>
          ))}
        </div>
        {selectedDay && (
          <div className={'rounded-2xl p-5 border ' + (isDark ? 'bg-[#161616] border-white/5' : 'bg-white')}>
            <h3 className={'font-bold mb-3 ' + (isDark ? 'text-white' : 'text-gray-900')}>{selectedDay.day}</h3>
            <ul className="space-y-2 mb-4">
              {(selectedDay.exercises || []).map((ex: any, i: number) => (
                <li key={i} className={'text-sm ' + (isDark ? 'text-gray-300' : 'text-gray-700')}>{ex.name} — {toPersianNumber(String(ex.sets))}×{ex.reps}</li>
              ))}
            </ul>
            <button onClick={handleStartOrResume} className={'w-full py-3.5 rounded-full font-bold flex items-center justify-center gap-2 ' + (isDark ? 'bg-[#b8f542] text-black' : 'bg-[#14b8a6] text-white')}>
              <Play size={18} /> شروع جلسه
            </button>
          </div>
        )}
      </div>
    );
  }

  const sets = session?.setsLog || [];

  return (
    <div className="space-y-4 pb-28">
      <div className={'rounded-2xl p-4 border flex items-center justify-between ' + (isDark ? 'bg-[#161616] border-white/5' : 'bg-white')}>
        <div>
          <p className={'text-xs ' + (isDark ? 'text-gray-400' : 'text-gray-600')}>زمان جلسه</p>
          <p className={'font-bold text-xl timer-animate tabular-nums ' + (isDark ? 'text-[#b8f542]' : 'text-[#0d9488]')}>{formatTime(workoutTime)}</p>
        </div>
        <button onClick={cancelWorkout} className="text-[#ef4444] p-2 rounded-lg"><X size={20} /></button>
      </div>
      
      {isResting && restTimer > 0 && (
        <div className={'rounded-2xl p-4 border text-center ' + (isDark ? 'bg-[#4a90d9]/10 border-[#4a90d9]/30' : 'bg-blue-50')}>
          <Timer size={24} className="mx-auto mb-2 text-[#4a90d9]" />
          <p className="font-bold text-2xl timer-animate text-[#4a90d9]">{formatTime(restTimer)}</p>
          <button onClick={() => { setIsResting(false); setRestTimer(0); }} className="mt-2 text-xs px-3 py-1 rounded-full bg-gray-700 text-white">رد کردن استراحت</button>
        </div>
      )}

      {(selectedDay?.exercises || []).map((ex: any, ei: number) => {
        const exerciseSets = sets.filter((s: any) => s.exerciseId === (ex.id || ex.name));
        return (
          <div key={ei} className={'rounded-2xl p-4 border ' + (isDark ? 'bg-[#161616] border-white/5' : 'bg-white')}>
            <h4 className={'font-bold mb-3 ' + (isDark ? 'text-white' : 'text-gray-900')}>{ex.name}</h4>
            <div className="space-y-2">
              {exerciseSets.map((set: any, si: number) => {
                const globalIndex = sets.indexOf(set);
                return (
                  <div key={si} className={'flex items-center justify-between rounded-xl px-3 py-2 ' + (set.completed ? (isDark ? 'bg-[#b8f542]/10' : 'bg-green-50') : (isDark ? 'bg-[#0c0c0c]' : 'bg-gray-50'))}>
                    <span className="text-sm">ست {toPersianNumber(String(set.setNumber))} — {set.targetReps}</span>
                    {!set.completed ? (
                      <button onClick={() => completeSet(globalIndex)} className={'px-3 py-1.5 rounded-lg text-xs font-bold ' + (isDark ? 'bg-[#b8f542] text-black' : 'bg-[#14b8a6] text-white')}>تکمیل</button>
                    ) : (<Check size={16} className="text-green-500" />)}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      
      <div className="flex gap-3 sticky bottom-20 z-20 pt-2">
        <button type="button" onClick={completeWorkout} className={'flex-1 py-3.5 rounded-2xl font-bold text-sm active:scale-[0.97] ' + (isDark ? 'bg-[#b8f542] text-black' : 'bg-[#14b8a6] text-white')}>پایان جلسه</button>
        <button type="button" onClick={cancelWorkout} className={'px-5 py-3.5 rounded-2xl font-bold text-sm active:scale-[0.97] ' + (isDark ? 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30' : 'bg-red-50 text-red-600 border border-red-200')}>لغو جلسه</button>
      </div>
    </div>
  );
}
