import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useActiveWorkout } from '../hooks/useActiveWorkout';
import { v4 as uuidv4 } from 'uuid';
import { Dumbbell, Timer, Check, Trophy, X, Play, ChevronLeft } from 'lucide-react';
import { toPersianNumber } from '../utils/jalali';

const soundEffects = { playSetComplete: () => {} };

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

  // منطق AutoStart: اگر پارامتر وجود داشت و سشن فعال نبود، خودکار شروع کن
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
    soundEffects.playSetComplete();
    updateSet(index, 'completed', true);
    
    const current = session.setsLog?.[index];
    const ex = selectedDay?.exercises?.find((e: any) => (e.id || e.name) === current?.exerciseId);
    if (ex?.rest) { setRestTimer(Number(ex.rest) || 60); setIsResting(true); }
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

  if (!activeProgram) return <div className="p-10 text-center">برنامه‌ای یافت نشد</div>;
  if (showComplete) return <div className="flex flex-col items-center justify-center py-20"><Trophy size={48} className="text-[#b8f542] mb-4" /><h2 className="text-2xl font-bold">جلسه تمام شد!</h2><button onClick={() => navigate('/dashboard')} className="mt-4 px-6 py-2 bg-[#b8f542] rounded-xl text-black font-bold">بازگشت به داشبورد</button></div>;

  // اگر سشن فعال نیست (و autoStart هم نبوده)، صفحه انتخاب روز را نشان بده
  if (!isActive) {
    return (
      <div className="space-y-5 p-4">
        <div className="flex items-center justify-between">
           <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-gray-800"><ChevronLeft size={20} /></button>
           <h2 className="text-xl font-bold">انتخاب روز تمرین</h2>
           <div className="w-8"></div>
        </div>
        <div className="grid gap-3">
          {activeProgram.days.map((day: any, i: number) => (
            <button key={i} onClick={() => { setSelectedDayIndex(i); navigate(`/workout?day=${i}`); }}
              className={`p-4 rounded-2xl border text-left transition-all ${i === selectedDayIndex ? 'border-[#b8f542] bg-[#b8f542]/10' : 'border-gray-700 hover:border-gray-500'}`}>
              <h3 className="font-bold">{day.day}</h3>
              <p className="text-sm text-gray-400 mt-1">{day.muscleGroups?.join('، ')}</p>
            </button>
          ))}
        </div>
        <button 
          onClick={handleStartOrResume} 
          className="w-full py-3 bg-[#b8f542] text-black font-bold rounded-xl mt-4 active:scale-95 transition-transform"
        >
          شروع تمرین {selectedDay?.day}
        </button>
      </div>
    );
  }

  // محیط اصلی تمرین (وقتی isActive true است)
  const sets = session?.setsLog || [];

  return (
    <div className="space-y-4 pb-28 p-4">
      <div className="flex items-center justify-between mb-4 sticky top-0 z-10 bg-[#0d0d1a]/90 backdrop-blur-md py-2 -mx-4 px-4">
        <button onClick={() => { endSession(); navigate('/dashboard'); }} className="p-2 rounded-full bg-gray-800"><X size={20} /></button>
        <div className="text-center">
          <p className="text-xs text-gray-400">زمان جلسه</p>
          <p className="font-bold text-xl text-[#b8f542]">{formatTime(workoutTime)}</p>
        </div>
        <button onClick={completeWorkout} className="px-4 py-1.5 bg-[#b8f542] text-black text-sm font-bold rounded-lg">پایان</button>
      </div>

      {isResting && restTimer > 0 && (
        <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-2xl text-center mb-4 animate-pulse">
          <p className="font-bold text-2xl text-blue-400">{formatTime(restTimer)}</p>
          <p className="text-xs text-blue-300">زمان استراحت</p>
          <button onClick={() => setIsResting(false)} className="mt-2 text-xs bg-blue-600 px-3 py-1 rounded-full text-white">رد کردن</button>
        </div>
      )}

      {(selectedDay?.exercises || []).map((ex: any, ei: number) => {
        const exerciseSets = sets.filter((s: any) => s.exerciseId === (ex.id || ex.name));
        return (
          <div key={ei} className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
            <h4 className="font-bold mb-3 text-[#b8f542] flex justify-between">
              <span>{ex.name}</span>
              <span className="text-xs text-gray-400 font-normal">{ex.sets} ست × {ex.reps}</span>
            </h4>
            <div className="space-y-3">
              {exerciseSets.map((set: any, si: number) => {
                const globalIndex = sets.indexOf(set);
                return (
                  <div key={si} className={`flex items-center gap-2 p-2 rounded-xl transition-colors ${set.completed ? 'bg-green-900/20 border border-green-500/30' : 'bg-gray-900 border border-gray-800'}`}>
                    <span className="text-xs w-8 text-gray-400 font-bold">#{toPersianNumber(String(set.setNumber))}</span>
                    
                    <div className="flex-1 flex items-center gap-2">
                      <input 
                        type="number" 
                        placeholder="وزنه"
                        className="w-full bg-gray-800 rounded-lg p-2 text-center text-sm focus:ring-1 focus:ring-[#b8f542] outline-none"
                        value={set.weight === 0 ? '' : set.weight}
                        onChange={(e) => updateSet(globalIndex, 'weight', Number(e.target.value))}
                      />
                      <span className="text-gray-500">×</span>
                      <input 
                        type="number" 
                        placeholder="تکرار"
                        className="w-full bg-gray-800 rounded-lg p-2 text-center text-sm focus:ring-1 focus:ring-[#b8f542] outline-none"
                        value={set.actualReps === 0 ? '' : set.actualReps}
                        onChange={(e) => updateSet(globalIndex, 'actualReps', Number(e.target.value))}
                      />
                    </div>

                    <button 
                      onClick={() => completeSet(globalIndex)} 
                      disabled={set.completed}
                      className={`p-2 rounded-lg transition-all ${set.completed ? 'text-green-500 bg-green-500/10' : 'bg-[#b8f542] text-black hover:bg-[#a3d93b]'}`}
                    >
                      <Check size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
