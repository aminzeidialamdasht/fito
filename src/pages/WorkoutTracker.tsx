import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Dumbbell,
  Timer,
  Trophy,
  X,
  AlertTriangle,
  Play,
  Check,
  TrendingUp,
  Calendar,
  Heart,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Exercise, SetRecord, WorkoutDay, WorkoutSession } from '../types';
import { toPersianNumber, getWeekdayName } from '../utils/jalali';
import { soundEffects } from '../utils/sound';
import confetti from 'canvas-confetti';

const WEEKDAY_NAMES = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

const normalizePersian = (value?: string): string =>
  String(value || '')
    .replace(/\u200c|\u200f|\u200e/g, '')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .trim();

const weekdayMatches = (value?: string, target?: string): boolean => {
  const v = normalizePersian(value);
  const t = normalizePersian(target);
  if (!v || !t) return false;
  return v === t || v.includes(t);
};

const hasTextValue = (value: unknown): boolean =>
  value !== undefined && value !== null && String(value).trim() !== '';

const parseTargetReps = (target: string): number => {
  const match = String(target || '').match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const getExercises = (day?: WorkoutDay): Exercise[] =>
  Array.isArray(day?.exercises) ? day.exercises : [];

const estimateExerciseTime = (exercises: Exercise[]): number =>
  Math.round(
    exercises.reduce((acc: number, ex: Exercise) => {
      const sets = Number(ex.sets || 0);
      const reps = parseInt(String(ex.reps || ''), 10) || 10;
      const rest = Number(ex.rest || 0) || 60;
      return acc + (sets * reps * 3 + rest * sets) / 60;
    }, 0)
  );

const hasExerciseMeta = (ex: Exercise): boolean =>
  hasTextValue(ex.rir) ||
  hasTextValue(ex.targetMuscle) ||
  hasTextValue(ex.loadMethod) ||
  hasTextValue(ex.substitute) ||
  hasTextValue(ex.stoppingCriterion) ||
  hasTextValue(ex.progression);

function ExerciseMeta({ ex, isDark }: { ex: Exercise; isDark: boolean }) {
  if (!hasExerciseMeta(ex)) return null;

  const chip = `px-2 py-0.5 rounded-md font-bold ${
    isDark
      ? 'bg-white/5 text-gray-300 border border-white/10'
      : 'bg-slate-100 text-slate-700 border border-slate-200'
  }`;

  return (
    <div className="mt-1 flex flex-wrap gap-1 text-[10px]">
      {hasTextValue(ex.rir) && <span className={chip}>RIR: {String(ex.rir)}</span>}
      {hasTextValue(ex.targetMuscle) && <span className={chip}>عضله: {String(ex.targetMuscle)}</span>}
      {hasTextValue(ex.loadMethod) && <span className={chip}>بار: {String(ex.loadMethod)}</span>}
      {hasTextValue(ex.substitute) && <span className={chip}>جایگزین: {String(ex.substitute)}</span>}
      {hasTextValue(ex.stoppingCriterion) && <span className={chip}>توقف: {String(ex.stoppingCriterion)}</span>}
      {hasTextValue(ex.progression) && <span className={chip}>پیشرفت: {String(ex.progression)}</span>}
    </div>
  );
}

export default function WorkoutTracker() {
  const { state, activeProfile, programs, sessions, addSession } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeProgram = programs.find((p) => p.id === state.activeProgram) || programs[0];
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

  const formatTime = (seconds: number) =>
    `${toPersianNumber(String(Math.floor(seconds / 60)).padStart(2, '0'))}:${toPersianNumber(
      String(seconds % 60).padStart(2, '0')
    )}`;

  const startWorkout = (dayIdx?: number) => {
    const targetIdx = dayIdx !== undefined ? dayIdx : selectedDayIndex;
    const dayToStart = activeProgram?.days[targetIdx];

    if (!dayToStart || !activeProfile || !activeProgram) return;

    setSelectedDayIndex(targetIdx);

    const sets: SetRecord[] = [];
    getExercises(dayToStart).forEach((ex: Exercise) => {
      const setsCount = Number(ex.sets || 0);
      for (let i = 1; i <= setsCount; i++) {
        sets.push({
          exerciseId: ex.id || ex.name,
          exerciseName: ex.name,
          setNumber: i,
          targetReps: String(ex.reps || ''),
          actualReps: parseTargetReps(String(ex.reps || '')),
          weight: 0,
          completed: false,
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
      notes: '',
    });

    setWorkoutStarted(true);
    setWorkoutTime(0);
  };

  const updateSet = (index: number, patch: Partial<SetRecord>) => {
    if (!session) return;

    const sets = session.sets.map((s: SetRecord, i: number) =>
      i === index ? { ...s, ...patch } : s
    );

    const totalVolume = sets
      .filter((s: SetRecord) => s.completed)
      .reduce((sum: number, s: SetRecord) => sum + Number(s.weight || 0) * Number(s.actualReps || 0), 0);

    setSession({ ...session, sets, totalVolume });
  };

  const completeSet = (index: number) => {
    if (!session) return;

    soundEffects.playSetComplete();

    const current = session.sets[index];
    updateSet(index, {
      completed: true,
      actualReps: current.actualReps || parseTargetReps(current.targetReps),
    });

    const currentDay = activeProgram?.days[selectedDayIndex];
    const ex = getExercises(currentDay).find((e: Exercise) => (e.id || e.name) === current.exerciseId);
    const restSeconds = Number(ex?.rest || 0);

    if (restSeconds > 0) {
      setRestTimer(restSeconds);
      setIsResting(true);
    }
  };

  const previousSet = (exerciseId: string, setNumber: number) => {
    const prior = sessions
      .slice()
      .reverse()
      .find(
        (s: WorkoutSession) =>
          s.completed &&
          s.id !== session?.id &&
          s.sets.some(
            (x: SetRecord) => x.exerciseId === exerciseId && x.setNumber === setNumber && x.completed
          )
      );

    return prior?.sets.find(
      (x: SetRecord) => x.exerciseId === exerciseId && x.setNumber === setNumber && x.completed
    );
  };

  const completeWorkout = () => {
    if (!session) return;

    soundEffects.playWorkoutFinish();

    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch {
      // Ignore confetti fallback
    }

    const completed = session.sets.filter((s: SetRecord) => s.completed);
    const finalSession: WorkoutSession = {
      ...session,
      completed: true,
      endTime: new Date().toISOString(),
      duration: workoutTime,
      totalVolume: completed.reduce(
        (sum: number, s: SetRecord) => sum + Number(s.weight || 0) * Number(s.actualReps || 0),
        0
      ),
    };

    addSession(finalSession);
    setWorkoutStarted(false);
    setShowComplete(true);
  };

  const cancelWorkout = () => {
    setShowCancel(false);
    setWorkoutStarted(false);
    setSession(null);
    setIsResting(false);
    setRestTimer(0);
  };

  useEffect(() => {
    if (activeProgram && selectedDayIndex >= activeProgram.days.length) {
      setSelectedDayIndex(0);
    }
  }, [activeProgram, selectedDayIndex]);

  useEffect(() => {
    if (searchParams.get('autoStart') === 'true' && activeProgram && !workoutStarted && !session) {
      startWorkout(initialDay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProgram]);

  useEffect(() => {
    if (!workoutStarted) return;

    timerRef.current = setInterval(() => setWorkoutTime((t) => t + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [workoutStarted]);

  useEffect(() => {
    if (!isResting || restTimer <= 0) return;

    restRef.current = setInterval(() => {
      setRestTimer((t) => {
        if (t <= 1) {
          setIsResting(false);
          soundEffects.playTimerComplete();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (restRef.current) clearInterval(restRef.current);
    };
  }, [isResting, restTimer]);

  if (!activeProgram) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Dumbbell size={48} className="text-[#14b8a6]" />
        <h2 className="text-2xl font-bold mt-4">برنامه‌ای فعال نیست</h2>
        <button
          onClick={() => navigate('/import')}
          className="mt-6 px-5 py-3 rounded-xl font-bold bg-[#14b8a6] text-black"
        >
          ورود برنامه تمرینی
        </button>
      </div>
    );
  }

  if (showComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Trophy size={56} className="text-[#14b8a6] mb-4" />
        <h2 className="text-2xl font-bold">جلسه با موفقیت ثبت شد!</h2>
        <p className="mt-2 text-gray-400">
          حجم تمرین: {toPersianNumber(String(session?.totalVolume || 0))} kg
        </p>
        <button
          onClick={() => {
            setShowComplete(false);
            setSession(null);
            navigate('/progress');
          }}
          className="mt-6 px-5 py-3 rounded-xl font-bold bg-[#14b8a6] text-black"
        >
          مشاهده تحلیل پیشرفت
        </button>
      </div>
    );
  }

  const programDays = activeProgram.days;

  if (programDays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Calendar size={48} className="text-[#14b8a6]" />
        <h2 className="text-2xl font-bold mt-4">این برنامه روز تمرینی ندارد</h2>
        <button
          onClick={() => navigate('/import')}
          className="mt-6 px-5 py-3 rounded-xl font-bold bg-[#14b8a6] text-black"
        >
          ورود برنامه جدید
        </button>
      </div>
    );
  }

  const programRestDays: string[] = Array.isArray((activeProgram as any).restDays)
    ? ((activeProgram as any).restDays as string[])
    : [];

  const hasExplicitSchedule =
    programDays.some((d: WorkoutDay) => hasTextValue((d as any).weekday)) ||
    programRestDays.length > 0;

  const today = new Date();
  const dayOfWeek = (today.getDay() + 1) % 7;
  const todayName = WEEKDAY_NAMES[dayOfWeek];

  const findProgramDayByWeekday = (name: string): WorkoutDay | undefined =>
    programDays.find(
      (d: WorkoutDay) =>
        weekdayMatches(String((d as any).weekday || ''), name) ||
        weekdayMatches(d.day, name)
    );

  const todayWorkout: WorkoutDay | undefined = hasExplicitSchedule
    ? findProgramDayByWeekday(todayName)
    : programDays[dayOfWeek % programDays.length];

  const isTodayRest = hasExplicitSchedule && !todayWorkout;
  const todayDayIndex = todayWorkout ? programDays.indexOf(todayWorkout) : -1;

  const nextTrainingDayIndex = (() => {
    if (todayDayIndex !== -1) return todayDayIndex;
    if (!hasExplicitSchedule) return 0;

    for (let offset = 1; offset <= 7; offset++) {
      const idx = (dayOfWeek + offset) % 7;
      const found = findProgramDayByWeekday(WEEKDAY_NAMES[idx]);
      if (found) return programDays.indexOf(found);
    }

    return 0;
  })();

  const activeDayForTracker: WorkoutDay = programDays[selectedDayIndex] || programDays[0];

  const targetMuscles: string[] = Array.isArray(activeDayForTracker.muscleGroups)
    ? activeDayForTracker.muscleGroups
    : Array.isArray(activeDayForTracker.muscle_groups)
    ? activeDayForTracker.muscle_groups
    : [];

  if (!workoutStarted) {
    const todayExercises = getExercises(todayWorkout);
    const todayMuscles: string[] = todayWorkout
      ? Array.isArray(todayWorkout.muscleGroups)
        ? todayWorkout.muscleGroups
        : Array.isArray(todayWorkout.muscle_groups)
        ? todayWorkout.muscle_groups
        : []
      : [];

    const todayEstTime = estimateExerciseTime(todayExercises);
    const todayWeekday = (todayWorkout as any)?.weekday;

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
              isDark
                ? 'bg-[#14b8a6]/20 text-[#14b8a6] hover:bg-[#14b8a6]/30'
                : 'bg-[#14b8a6]/15 text-[#0d9488] hover:bg-[#14b8a6]/25'
            }`}
          >
            مدیریت برنامه
          </button>
        </div>

        {isTodayRest && (
          <div className={`rounded-2xl p-5 border theme-transition ${
            isDark
              ? 'bg-slate-900/70 border-slate-700'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
              }`}>
                <Heart size={20} />
              </div>
              <div>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  امروز روز استراحت است
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                  {getWeekdayName(today)} • {activeProgram.name || 'برنامه فعال'}
                </p>
              </div>
            </div>

            {programRestDays.length > 0 && (
              <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                روزهای استراحت برنامه: {programRestDays.join('، ')}
              </p>
            )}

            <button
              onClick={() => startWorkout(nextTrainingDayIndex)}
              className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${
                isDark
                  ? 'bg-slate-700 text-white hover:bg-slate-600'
                  : 'bg-slate-600 text-white hover:bg-slate-700'
              }`}
            >
              <Play size={18} />
              شروع تمرین بعدی
            </button>
          </div>
        )}

        {!isTodayRest && todayWorkout && (
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

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {hasTextValue(todayWeekday) && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isDark ? 'bg-[#14b8a6]/20 text-[#14b8a6]' : 'bg-[#14b8a6]/15 text-[#0d9488]'
                  }`}>
                    {String(todayWeekday)}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isDark ? 'bg-[#14b8a6]/20 text-[#14b8a6]' : 'bg-[#14b8a6]/15 text-[#0d9488]'
                }`}>
                  {getWeekdayName(today)}
                </span>
              </div>
            </div>

            {todayMuscles.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                  عضلات هدف:
                </span>
                {todayMuscles.map((m: string, idx: number) => (
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
                  {toPersianNumber(todayExercises.length)}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-[#0f766e]/60'}`}>ست‌ها</p>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                  {toPersianNumber(todayExercises.reduce((acc: number, e: Exercise) => acc + Number(e.sets || 0), 0))}
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
              {todayExercises.map((ex: Exercise, exIdx: number) => (
                <div key={ex.id || exIdx} className={`flex items-center justify-between rounded-xl p-3 ${
                  isDark ? 'bg-[#0d0d1a]/70' : 'bg-white/80'
                }`}>
                  <div>
                    <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                      {ex.name}
                    </h4>
                    {hasTextValue(ex.notes) && (
                      <p className={`text-[11px] ${isDark ? 'text-gray-500' : 'text-[#0f766e]/60'}`}>
                        💡 {ex.notes}
                      </p>
                    )}
                    <ExerciseMeta ex={ex} isDark={isDark} />
                  </div>
                  <div className="text-left">
                    <span className={`font-bold text-xs ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
                      {toPersianNumber(ex.sets)} ست × {toPersianNumber(ex.reps)}
                    </span>
                    {Number(ex.rest || 0) > 0 && (
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

        {programDays.length > 0 && (
          <div className={`rounded-2xl p-5 border theme-transition ${
            isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
                <Calendar size={18} />
                برنامه کامل هفته — {activeProgram.name || 'برنامه تمرینی'}
              </h3>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                {toPersianNumber(programDays.length)} روز تمرینی
              </span>
            </div>

            {programRestDays.length > 0 && (
              <p className={`text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
                روزهای استراحت: {programRestDays.join('، ')}
              </p>
            )}

            <div className="space-y-4">
              {programDays.map((day: WorkoutDay, di: number) => {
                const dayMuscles: string[] = Array.isArray(day.muscleGroups)
                  ? day.muscleGroups
                  : Array.isArray(day.muscle_groups)
                  ? day.muscle_groups
                  : [];

                const dayWeekday = (day as any).weekday;
                const isToday = di === todayDayIndex;

                return (
                  <div key={day.id || di} className={`rounded-xl p-4 border transition-all ${
                    isDark
                      ? isToday ? 'bg-[#14b8a6]/5 border-[#14b8a6]/30' : 'bg-[#0d0d1a] border-gray-800'
                      : isToday ? 'bg-[#f0fdfa] border-[#14b8a6]/40' : 'bg-[#f0fdfa]/50 border-[#14b8a6]/20'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-gray-700/20">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {hasTextValue(dayWeekday) && (
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                              isDark ? 'bg-[#14b8a6]/20 text-[#14b8a6]' : 'bg-[#14b8a6]/15 text-[#0d9488]'
                            }`}>
                              {String(dayWeekday)}
                            </span>
                          )}
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
                            {dayMuscles.map((m: string, mi: number) => (
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
                      {getExercises(day).map((ex: Exercise, ei: number) => (
                        <div key={ex.id || ei}>
                          <div className="flex items-center justify-between text-xs py-1 border-b last:border-0 border-gray-700/10">
                            <span className={isDark ? 'text-gray-300' : 'text-[#134e4a]'}>
                              • {ex.name}
                            </span>
                            <span className={`font-bold ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
                              {toPersianNumber(ex.sets)} × {toPersianNumber(ex.reps)}
                            </span>
                          </div>
                          <ExerciseMeta ex={ex} isDark={isDark} />
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

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle size={48} className="text-amber-500" />
        <h2 className="text-2xl font-bold mt-4">جلسه‌ای فعال نیست</h2>
        <button
          onClick={() => navigate('/workout')}
          className="mt-6 px-5 py-3 rounded-xl font-bold bg-[#14b8a6] text-black"
        >
          بازگشت به انتخاب جلسه
        </button>
      </div>
    );
  }

  const completedCount = session.sets.filter((s: SetRecord) => s.completed).length || 0;
  const activeWeekday = (activeDayForTracker as any).weekday;

  return (
    <div className="space-y-4 pb-28">
      <div className={`sticky top-0 z-30 rounded-2xl p-4 border backdrop-blur ${
        isDark ? 'bg-[#161616]/95 border-white/5' : 'bg-white/95 border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {hasTextValue(activeWeekday) && (
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                  isDark ? 'bg-[#14b8a6]/20 text-[#14b8a6]' : 'bg-[#14b8a6]/15 text-[#0d9488]'
                }`}>
                  {String(activeWeekday)}
                </span>
              )}
              <h3 className="font-bold text-base">{session.dayName || activeDayForTracker.day}</h3>
            </div>

            {targetMuscles.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 mt-1">
                <span className="text-[11px] text-gray-400">عضلات هدف:</span>
                {targetMuscles.map((m: string, idx: number) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#14b8a6]/20 text-[#14b8a6]">
                    {m}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => setShowCancel(true)} className="text-red-500 p-2 shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-gray-700/20 pt-2">
          <div>
            <p className="text-xs text-gray-400">زمان جلسه</p>
            <p className="text-xl font-black text-[#14b8a6] tabular-nums">{formatTime(workoutTime)}</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-400">حجم ثبت‌شده</p>
            <p className="font-bold">{toPersianNumber(String(session.totalVolume || 0))} kg</p>
          </div>
        </div>

        <div className="mt-3 h-2 rounded-full bg-gray-700/40 overflow-hidden">
          <div
            className="h-full bg-[#14b8a6] transition-all"
            style={{
              width: `${Math.round((completedCount / Math.max(session.sets.length, 1)) * 100)}%`,
            }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {toPersianNumber(String(completedCount))} از {toPersianNumber(String(session.sets.length))} ست تکمیل شده
        </p>
      </div>

      {isResting && (
        <div className="rounded-2xl p-4 text-center bg-[#4a90d9]/10 border border-[#4a90d9]/30">
          <Timer size={22} className="mx-auto mb-1 text-[#4a90d9]" />
          <p className="text-2xl font-black text-[#4a90d9]">{formatTime(restTimer)}</p>
          <button
            onClick={() => {
              setIsResting(false);
              setRestTimer(0);
            }}
            className="text-xs mt-1 text-gray-400"
          >
            رد کردن استراحت
          </button>
        </div>
      )}

      {activeDayForTracker.exercises.map((ex: Exercise) => (
        <div key={ex.id || ex.name} className={`rounded-2xl p-4 border ${
          isDark ? 'bg-[#161616] border-white/5' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold">{ex.name}</h4>
            <span className="text-xs text-gray-400">هدف: {toPersianNumber(ex.reps)}</span>
          </div>

          <ExerciseMeta ex={ex} isDark={isDark} />

          <div className="space-y-2 mt-3">
            {session.sets
              .filter((s: SetRecord) => s.exerciseId === (ex.id || ex.name))
              .map((set: SetRecord) => {
                const globalIndex = session.sets.indexOf(set);
                const prev = previousSet(set.exerciseId, set.setNumber);

                return (
                  <div key={set.setNumber} className={`rounded-xl p-3 ${
                    set.completed
                      ? isDark ? 'bg-[#14b8a6]/10' : 'bg-amber-50'
                      : isDark ? 'bg-[#0d0d1a]' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">ست {toPersianNumber(String(set.setNumber))}</span>
                      {prev && (
                        <span className="text-[11px] text-gray-500">
                          قبلی: {toPersianNumber(prev.weight)}kg × {toPersianNumber(prev.actualReps)}
                        </span>
                      )}
                      {set.completed && <Check size={17} className="text-green-500" />}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <label className="text-[11px] text-gray-400">
                        وزنه (kg)
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={set.weight || ''}
                          onChange={(e) => updateSet(globalIndex, { weight: Number(e.target.value) })}
                          className={`mt-1 w-full rounded-lg px-2 py-2 text-sm ${
                            isDark ? 'bg-[#090909] text-white' : 'bg-white border'
                          }`}
                        />
                      </label>

                      <label className="text-[11px] text-gray-400">
                        تکرار
                        <input
                          type="number"
                          min="0"
                          value={set.actualReps || ''}
                          onChange={(e) => updateSet(globalIndex, { actualReps: Number(e.target.value) })}
                          className={`mt-1 w-full rounded-lg px-2 py-2 text-sm ${
                            isDark ? 'bg-[#090909] text-white' : 'bg-white border'
                          }`}
                        />
                      </label>
                    </div>

                    {!set.completed && (
                      <button
                        onClick={() => completeSet(globalIndex)}
                        className="mt-2 w-full py-2 rounded-lg text-xs font-bold bg-[#14b8a6] text-black"
                      >
                        ثبت ست
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      <button
        onClick={completeWorkout}
        className="w-full py-4 rounded-2xl font-black bg-[#14b8a6] text-black flex items-center justify-center gap-2"
      >
        <TrendingUp size={19} />
        پایان و ثبت جلسه
      </button>

      {showCancel && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className={`w-full max-w-sm rounded-2xl p-6 ${isDark ? 'bg-[#161616]' : 'bg-white'}`}>
            <AlertTriangle className="mx-auto text-red-500" size={40} />
            <h3 className="text-center font-bold mt-3">لغو جلسه؟</h3>
            <p className="text-center text-sm text-gray-400 mt-2">
              تمام اطلاعات ثبت‌نشده این جلسه از بین می‌رود.
            </p>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowCancel(false)}
                className="flex-1 py-3 rounded-xl bg-gray-700 text-white"
              >
                بازگشت
              </button>
              <button
                onClick={cancelWorkout}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold"
              >
                لغو جلسه
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
