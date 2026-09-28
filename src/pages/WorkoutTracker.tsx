import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Dumbbell, Timer, Trophy, X, AlertTriangle, Play, Check, TrendingUp, Calendar } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { SetRecord, WorkoutSession } from '../types';
import { toPersianNumber, getWeekdayName } from '../utils/jalali';
import { soundEffects } from '../utils/sound';
import confetti from 'canvas-confetti';

const WEEKDAY_NAMES = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

const parseTargetReps = (target: string) => {
  const match = target.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

export default function WorkoutTracker() {
  const { state, activeProfile, programs, sessions, addSession } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeProgram = programs.find(p => p.id === state.activeProgram) || programs[0];
  const initialDay = Number(searchParams.get('day') || 0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(initialDay);
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activeProgram && selectedDayIndex >= activeProgram.days.length) setSelectedDayIndex(0);
  }, [activeProgram, selectedDayIndex]);

  useEffect(() => {
    if (searchParams.get('autoStart') === 'true' && activeProgram && !workoutStarted && !session) {
      startWorkout(initialDay);
    }
  }, [activeProgram]);

  useEffect(() => {
    if (!workoutStarted) return;
    timerRef.current = setInterval(() => setWorkoutTime(t => t + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [workoutStarted]);

  useEffect(() => {
    if (!isResting || restTimer <= 0) return;
    restRef.current = setInterval(() => setRestTimer(t => {
      if (t <= 1) {
        setIsResting(false);
        soundEffects.playTimerComplete();
        return 0;
      }
      return t - 1;
    }), 1000);
    return () => { if (restRef.current) clearInterval(restRef.current); };
  }, [isResting, restTimer]);

  const formatTime = (seconds: number) => `${toPersianNumber(String(Math.floor(seconds / 60)).padStart(2, '0'))}:${toPersianNumber(String(seconds % 60).padStart(2, '0'))}`;

  const startWorkout = (dayIdx?: number) => {
    const targetIdx = dayIdx !== undefined ? dayIdx : selectedDayIndex;
    const dayToStart = activeProgram?.days[targetIdx];
    if (!dayToStart || !activeProfile || !activeProgram) return;

    setSelectedDayIndex(targetIdx);
    const sets: SetRecord[] = [];
    dayToStart.exercises.forEach(ex => {
      for (let i = 1; i <= ex.sets; i++) {
        sets.push({
          exerciseId: ex.id || ex.name,
          exerciseName: ex.name,
          setNumber: i,
          targetReps: ex.reps,
          actualReps: parseTargetReps(ex.reps),
          weight: 0,
          completed: false
        });
      }
    });

    setSession({
      id: uuidv4(),
      profileId: activeProfile.id,
      programId: activeProgram.id,
      dayId: dayToStart.id || String(targetIdx),
      dayName: dayToStart.day,
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
      duration: 0,
      sets,
      totalVolume: 0,
      completed: false,
      notes: ''
    });
    setWorkoutStarted(true);
    setWorkoutTime(0);
  };

  const updateSet = (index: number, patch: Partial<SetRecord>) => {
    if (!session) return;
    const sets = session.sets.map((s, i) => i === index ? { ...s, ...patch } : s);
    const totalVolume = sets.filter(s => s.completed).reduce((sum, s) => sum + (s.weight || 0) * (s.actualReps || 0), 0);
    setSession({ ...session, sets, totalVolume });
  };

  const completeSet = (index: number) => {
    if (!session) return;
    soundEffects.playSetComplete();
    const current = session.sets[index];
    updateSet(index, { completed: true, actualReps: current.actualReps || parseTargetReps(current.targetReps) });
    const currentDay = activeProgram?.days[selectedDayIndex];
    const ex = currentDay?.exercises.find(e => (e.id || e.name) === current.exerciseId);
    if (ex?.rest) { setRestTimer(Number(ex.rest)); setIsResting(true); }
  };

  const previousSet = (exerciseId: string, setNumber: number) => {
    const prior = sessions.slice().reverse().find(s => s.completed && s.id !== session?.id && s.sets.some(x => x.exerciseId === exerciseId && x.setNumber === setNumber && x.completed));
    return prior?.sets.find(x => x.exerciseId === exerciseId && x.setNumber === setNumber && x.completed);
  };

  const completeWorkout = () => {
    if (!session) return;
    soundEffects.playWorkoutFinish();
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch {
      // Ignore confetti fallback
    }
    const completed = session.sets.filter(s => s.completed);
    const finalSession: WorkoutSession = { ...session, completed: true, endTime: new Date().toISOString(), duration: workoutTime, totalVolume: completed.reduce((sum, s) => sum + s.weight * s.actualReps, 0) };
    addSession(finalSession);
    setWorkoutStarted(false);
    setShowComplete(true);
  };

  const cancelWorkout = () => { setShowCancel(false); setWorkoutStarted(false); setSession(null); setIsResting(false); setRestTimer(0); };

  if (!activeProgram) return <div className="flex flex-col items-center justify-center py-20"><Dumbbell size={48} className="text-[#14b8a6]" /><h2 className="text-2xl font-bold mt-4">برنامه‌ای فعال نیست</h2><button onClick={() => navigate('/import')} className="mt-6 px-5 py-3 rounded-xl font-bold bg-[#14b8a6] text-black">ورود برنامه تمرینی</button></div>;

  if (showComplete) return <div className="flex flex-col items-center justify-center py-20 text-center"><Trophy size={56} className="text-[#14b8a6] mb-4" /><h2 className="text-2xl font-bold">جلسه با موفقیت ثبت شد!</h2><p className="mt-2 text-gray-400">حجم تمرین: {toPersianNumber(String(session?.totalVolume || 0))} kg</p><button onClick={() => { setShowComplete(false); setSession(null); navigate('/progress'); }} className="mt-6 px-5 py-3 rounded-xl font-bold bg-[#14b8a6] text-black">مشاهده تحلیل پیشرفت</button></div>;

  // Calculate Today's Day for Workout
  const today = new Date();
  const dayOfWeek = (today.getDay() + 1) % 7; // Saturday = 0
  const todayName = WEEKDAY_NAMES[dayOfWeek];
  const todayWorkout = activeProgram.days.find(d =>
    d.day.includes(todayName) || d.day === todayName || d.day.includes(getWeekdayName(today))
  ) || activeProgram.days[dayOfWeek % activeProgram.days.length];
  const todayDayIndex = activeProgram.days.indexOf(todayWorkout) !== -1 ? activeProgram.days.indexOf(todayWorkout) : (dayOfWeek % activeProgram.days.length);

  const activeDayForTracker = activeProgram.days[selectedDayIndex] || activeProgram.days[0];
  const targetMuscles = activeDayForTracker?.muscleGroups || activeDayForTracker?.muscle_groups || [];

  if (!workoutStarted) {
    const todayMuscles = todayWorkout?.muscleGroups || todayWorkout?.muscle_groups || [];
    const todayEstTime = Math.round(todayWorkout?.exercises.reduce((a, e) => a + (e.sets * (parseInt(e.reps) || 10) * 3 + (e.rest || 60) * e.sets) / 60, 0) || 0);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
            <Dumbbell size={24} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
            اجرا و ترکر تمرین
          </h2>
          <button
            onClick={() => navigate('/import')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isDark ? 'bg-[#14b8a6]/20 text-[#14b8a6] hover:bg-[#14b8a6]/30' : 'bg-[#14b8a6]/15 text-[#0d9488] hover:bg-[#14b8a6]/25'
            }`}
          >
            مدیریت برنامه
          </button>
        </div>

        {/* Today's Workout Program */}
        {todayWorkout && (
          <div className={`rounded-2xl p-5 border theme-transition ${
            isDark
              ? 'bg-gradient-to-l from-[#1a1a2e] to-[#16213e] border-[#14b8a6]/20'
              : 'bg-gradient-to-l from-white to-[#f0fdfa] border-[#14b8a6]/30'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  isDark ? 'bg-[#14b8a6]/20' : 'bg-[#14b8a6]/15'
                }`}>
                  <Dumbbell size={20} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
                </div>
                <div>
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                    برنامه تمرینی امروز
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                    {todayWorkout.day} • {activeProgram.name || 'برنامه فعال'}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                isDark ? 'bg-[#14b8a6]/20 text-[#14b8a6]' : 'bg-[#14b8a6]/15 text-[#0d9488]'
              }`}>
                {getWeekdayName(today)}
              </div>
            </div>

            {todayMuscles.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>عضلات هدف:</span>
                {todayMuscles.map((m, idx) => (
                  <span key={idx} className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                    isDark ? 'bg-[#14b8a6]/20 text-[#14b8a6]' : 'bg-[#14b8a6]/15 text-[#0d9488]'
                  }`}>
                    {m}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#0f766e]/60'}`}>حرکات</p>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                  {toPersianNumber(todayWorkout.exercises.length)}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#0f766e]/60'}`}>ست‌ها</p>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                  {toPersianNumber(todayWorkout.exercises.reduce((acc, e) => acc + e.sets, 0))}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#0f766e]/60'}`}>زمان تقریبی</p>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                  {toPersianNumber(todayEstTime)} د
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              {todayWorkout.exercises.map((ex, exIdx) => (
                <div key={ex.id || exIdx} className={`flex items-center justify-between rounded-xl p-3 ${
                  isDark ? 'bg-[#0d0d1a]/70' : 'bg-white/80'
                }`}>
                  <div>
                    <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                      {ex.name}
                    </h4>
                    {ex.notes && (
                      <p className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-[#0f766e]/60'}`}>
                        💡 {ex.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-left">
                    <span className={`font-bold text-xs ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
                      {toPersianNumber(ex.sets)} ست × {toPersianNumber(ex.reps)}
                    </span>
                    {ex.rest && (
                      <p className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-[#0f766e]/60'}`}>
                        استراحت: {toPersianNumber(ex.rest)} ثانیه
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => startWorkout(todayDayIndex)}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${
                isDark
                  ? 'bg-gradient-to-l from-[#14b8a6] to-[#2dd4bf] text-[#0d0d1a] shadow-lg shadow-[#14b8a6]/20'
                  : 'bg-gradient-to-l from-[#14b8a6] to-[#0d9488] text-white shadow-lg shadow-[#14b8a6]/20'
              }`}
            >
              <Play size={18} />
              شروع جلسه امروز
            </button>
          </div>
        )}

        {/* Full Weekly Program */}
        {activeProgram.days && activeProgram.days.length > 0 && (
          <div className={`rounded-2xl p-5 border theme-transition ${
            isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
                <Calendar size={18} />
                برنامه کامل هفته — {activeProgram.name || 'برنامه تمرینی'}
              </h3>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                {toPersianNumber(activeProgram.days.length)} روز تمرینی
              </span>
            </div>

            <div className="space-y-4">
              {activeProgram.days.map((day, di) => {
                const dayMuscles = day.muscleGroups || day.muscle_groups || [];
                const isToday = di === todayDayIndex;

                return (
                  <div key={day.id || di} className={`rounded-xl p-4 border transition-all ${
                    isDark
                      ? isToday ? 'bg-[#14b8a6]/5 border-[#14b8a6]/30' : 'bg-[#0d0d1a] border-gray-800'
                      : isToday ? 'bg-[#f0fdfa] border-[#14b8a6]/40' : 'bg-[#f0fdfa]/50 border-[#14b8a6]/20'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-gray-700/20">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                            {day.day}
                          </h4>
                          {isToday && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              isDark ? 'bg-[#14b8a6]/30 text-[#14b8a6]' : 'bg-[#14b8a6]/20 text-[#0d9488]'
                            }`}>
                              امروز
                            </span>
                          )}
                        </div>
                        {dayMuscles.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {dayMuscles.map((m, mi) => (
                              <span key={mi} className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                isDark ? 'bg-[#14b8a6]/15 text-[#14b8a6]' : 'bg-[#14b8a6]/10 text-[#0d9488]'
                              }`}>
                                {m}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => startWorkout(di)}
                        className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                          isDark
                            ? 'bg-[#14b8a6] text-[#0d0d1a] hover:bg-[#2dd4bf]'
                            : 'bg-[#14b8a6] text-white hover:bg-[#0d9488]'
                        }`}
                      >
                        <Play size={14} />
                        شروع این جلسه
                      </button>
                    </div>

                    <div className="space-y-2">
                      {day.exercises.map((ex, ei) => (
                        <div key={ex.id || ei} className="flex items-center justify-between text-xs py-1 border-b last:border-0 border-gray-700/10">
                          <span className={isDark ? 'text-gray-300' : 'text-[#134e4a]'}>
                            • {ex.name}
                          </span>
                          <span className={`font-bold ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
                            {toPersianNumber(ex.sets)} × {toPersianNumber(ex.reps)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  const completedCount = session?.sets.filter(s => s.completed).length || 0;

  return (
    <div className="space-y-4 pb-28">
      <div className={`sticky top-0 z-30 rounded-2xl p-4 border backdrop-blur ${isDark ? 'bg-[#161616]/95 border-white/5' : 'bg-white/95 border-gray-200'}`}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-bold text-base">{session?.dayName || activeDayForTracker?.day}</h3>
            {targetMuscles.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 mt-1">
                <span className="text-[11px] text-gray-400">عضلات هدف:</span>
                {targetMuscles.map((m, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#14b8a6]/20 text-[#14b8a6]">
                    {m}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setShowCancel(true)} className="text-red-500 p-2 shrink-0"><X size={20} /></button>
        </div>

        <div className="flex items-center justify-between border-t border-gray-700/20 pt-2">
          <div><p className="text-xs text-gray-400">زمان جلسه</p><p className="text-xl font-black text-[#14b8a6] tabular-nums">{formatTime(workoutTime)}</p></div>
          <div className="text-left"><p className="text-xs text-gray-400">حجم ثبت‌شده</p><p className="font-bold">{toPersianNumber(String(session?.totalVolume || 0))} kg</p></div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-gray-700/40 overflow-hidden"><div className="h-full bg-[#14b8a6] transition-all" style={{ width: `${session ? Math.round(completedCount / Math.max(session.sets.length, 1) * 100) : 0}%` }} /></div>
        <p className="text-xs text-gray-400 mt-1">{toPersianNumber(String(completedCount))} از {toPersianNumber(String(session?.sets.length || 0))} ست تکمیل شده</p>
      </div>

      {isResting && <div className="rounded-2xl p-4 text-center bg-[#4a90d9]/10 border border-[#4a90d9]/30"><Timer size={22} className="mx-auto mb-1 text-[#4a90d9]" /><p className="text-2xl font-black text-[#4a90d9]">{formatTime(restTimer)}</p><button onClick={() => { setIsResting(false); setRestTimer(0); }} className="text-xs mt-1 text-gray-400">رد کردن استراحت</button></div>}

      {activeDayForTracker?.exercises.map(ex => <div key={ex.id || ex.name} className={`rounded-2xl p-4 border ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-3"><h4 className="font-bold">{ex.name}</h4><span className="text-xs text-gray-400">هدف: {toPersianNumber(ex.reps)}</span></div>
        <div className="space-y-2">{session?.sets.filter(s => s.exerciseId === (ex.id || ex.name)).map((set) => {
          const globalIndex = session.sets.indexOf(set);
          const prev = previousSet(set.exerciseId, set.setNumber);
          return <div key={set.setNumber} className={`rounded-xl p-3 ${set.completed ? isDark ? 'bg-[#14b8a6]/10' : 'bg-amber-50' : isDark ? 'bg-[#0d0d1a]' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2"><span className="font-bold text-sm">ست {toPersianNumber(String(set.setNumber))}</span>{prev && <span className="text-[11px] text-gray-500">قبلی: {toPersianNumber(prev.weight)}kg × {toPersianNumber(prev.actualReps)}</span>}{set.completed && <Check size={17} className="text-green-500" />}</div>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-[11px] text-gray-400">وزنه (kg)<input type="number" min="0" step="0.5" value={set.weight || ''} onChange={e => updateSet(globalIndex, { weight: Number(e.target.value) })} className={`mt-1 w-full rounded-lg px-2 py-2 text-sm ${isDark ? 'bg-[#090909] text-white' : 'bg-white border'}`} /></label>
              <label className="text-[11px] text-gray-400">تکرار<input type="number" min="0" value={set.actualReps || ''} onChange={e => updateSet(globalIndex, { actualReps: Number(e.target.value) })} className={`mt-1 w-full rounded-lg px-2 py-2 text-sm ${isDark ? 'bg-[#090909] text-white' : 'bg-white border'}`} /></label>
            </div>
            {!set.completed && <button onClick={() => completeSet(globalIndex)} className="mt-2 w-full py-2 rounded-lg text-xs font-bold bg-[#14b8a6] text-black">ثبت ست</button>}
          </div>;
        })}</div>
      </div>)}

      <button onClick={completeWorkout} className="w-full py-4 rounded-2xl font-black bg-[#14b8a6] text-black flex items-center justify-center gap-2"><TrendingUp size={19} /> پایان و ثبت جلسه</button>
      {showCancel && <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"><div className={`w-full max-w-sm rounded-2xl p-6 ${isDark ? 'bg-[#161616]' : 'bg-white'}`}><AlertTriangle className="mx-auto text-red-500" size={40} /><h3 className="text-center font-bold mt-3">لغو جلسه؟</h3><p className="text-center text-sm text-gray-400 mt-2">تمام اطلاعات ثبت‌نشده این جلسه از بین می‌رود.</p><div className="flex gap-2 mt-5"><button onClick={() => setShowCancel(false)} className="flex-1 py-3 rounded-xl bg-gray-700 text-white">بازگشت</button><button onClick={cancelWorkout} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold">لغو جلسه</button></div></div></div>}
    </div>
  );
}
