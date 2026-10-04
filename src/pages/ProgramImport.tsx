import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { validateWorkoutJSON } from '../utils/promptGenerator';
import { WorkoutProgram } from '../types';
import { v4 as uuidv4 } from 'uuid';
import {
  Import as ImportIcon,
  Check,
  AlertCircle,
  Trash2,
  Save,
  Eye,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Lock,
  Crown,
} from 'lucide-react';
import { toPersianNumber, getProgramTimelineDetails } from '../utils/jalali';
import { DEFAULT_WORKOUT_PLAN } from '../data/defaultPlans';

const isStoreBuild = ['bazaar', 'myket'].includes(import.meta.env.VITE_APP_FLAVOR || '');

const PERSIAN_WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

const SAMPLE_TRAINING_WEEKDAYS: Record<number, string[]> = {
  1: ['شنبه'],
  2: ['شنبه', 'چهارشنبه'],
  3: ['شنبه', 'دوشنبه', 'چهارشنبه'],
  4: ['شنبه', 'یکشنبه', 'چهارشنبه', 'پنجشنبه'],
  5: ['شنبه', 'دوشنبه', 'سه‌شنبه', 'پنجشنبه', 'جمعه'],
  6: ['شنبه', 'یکشنبه', 'دوشنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
  7: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
};

function getSafeTrainingDays(days: number): number {
  return Math.min(7, Math.max(1, Number(days) || 4));
}

function getSampleTrainingWeekdays(days: number): string[] {
  const safeDays = getSafeTrainingDays(days);
  return SAMPLE_TRAINING_WEEKDAYS[safeDays] || PERSIAN_WEEKDAYS.slice(0, safeDays);
}

function getRestDaysFromTraining(trainingWeekdays: string[]): string[] {
  return PERSIAN_WEEKDAYS.filter((weekday) => !trainingWeekdays.includes(weekday));
}

export default function ProgramImport() {
  const {
    activeProfile,
    programs,
    addProgram,
    updateProgram,
    removeProgram,
    setActiveProgram,
    state,
  } = useAppContext();

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [jsonInput, setJsonInput] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    data?: any;
    error?: string;
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [imported, setImported] = useState(false);

  const canUseJsonImport = true;

  const handleValidate = () => {
    if (!canUseJsonImport) return;
    const expectedDays = activeProfile ? Number(activeProfile.trainingDays) : undefined;
    const result = validateWorkoutJSON(jsonInput, expectedDays, activeProfile?.targetMuscles);
    setValidationResult(result);

    if (result.valid) {
      setShowPreview(true);
    }
  };

  const handleImportDefault = () => {
    if (!activeProfile) return;

    const programId = uuidv4();
    const program: WorkoutProgram = {
      ...DEFAULT_WORKOUT_PLAN,
      id: programId,
      profileId: activeProfile.id,
      startDate: startDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      days: DEFAULT_WORKOUT_PLAN.days.map((day) => ({
        ...day,
        id: uuidv4(),
        exercises: day.exercises.map((ex) => ({
          ...ex,
          id: uuidv4(),
        })),
      })),
    };

    addProgram(program);
    setActiveProgram(programId);
    setImported(true);
    setTimeout(() => setImported(false), 3000);
  };

  const handleImport = () => {
    if (!validationResult?.valid || !validationResult.data || !activeProfile) return;

    const data = validationResult.data;
    const days = Array.isArray(data.days) ? data.days : [];

    const restDays = Array.isArray(data.rest_days)
      ? data.rest_days.filter((x: any) => typeof x === 'string')
      : undefined;

    const weeklyVolumeSummary =
      data.weekly_volume_summary && typeof data.weekly_volume_summary === 'object'
        ? (data.weekly_volume_summary as Record<string, string>)
        : undefined;

    const sessionDurationSummary =
      data.session_duration_summary && typeof data.session_duration_summary === 'object'
        ? (data.session_duration_summary as Record<string, string>)
        : undefined;

    const programId = uuidv4();

    const program: WorkoutProgram = {
      id: programId,
      profileId: activeProfile.id,
      name: typeof data.program_name === 'string' ? data.program_name : 'برنامه بدون نام',
      duration: typeof data.duration === 'string' ? data.duration : '۱ ماه',
      startDate: startDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      trainingDays: Number(data.training_days) || activeProfile.trainingDays || days.length,
      restDays,
      weeklyVolumeSummary,
      sessionDurationSummary,
      adjustmentRules: typeof data.adjustment_rules === 'string' ? data.adjustment_rules : undefined,
      days: days.map((day: any, index: number) => ({
        id: uuidv4(),
        weekday: typeof day.weekday === 'string' ? day.weekday : undefined,
        order: Number(day.order) || index + 1,
        day: typeof day.day === 'string' ? day.day : `روز ${index + 1}`,
        muscleGroups: Array.isArray(day.muscle_groups) ? day.muscle_groups : [],
        warmUp: typeof day.warm_up === 'string' ? day.warm_up : undefined,
        coreWork: typeof day.core_work === 'string' ? day.core_work : undefined,
        cardio: typeof day.cardio === 'string' ? day.cardio : undefined,
        exercises: Array.isArray(day.exercises)
          ? day.exercises.map((ex: any) => ({
              id: uuidv4(),
              name: typeof ex.name === 'string' ? ex.name : 'حرکت بدون نام',
              sets: Number(ex.sets) || 4,
              reps: typeof ex.reps === 'string' ? ex.reps : String(ex.reps || ''),
              rest: Number(ex.rest) || 90,
              tempo: typeof ex.tempo === 'string' ? ex.tempo : '',
              rir:
                typeof ex.rir === 'string' || typeof ex.rir === 'number'
                  ? ex.rir
                  : undefined,
              loadMethod: typeof ex.load_method === 'string' ? ex.load_method : '',
              targetMuscle: typeof ex.target_muscle === 'string' ? ex.target_muscle : '',
              substitute: typeof ex.substitute === 'string' ? ex.substitute : '',
              stoppingCriterion:
                typeof ex.stopping_criterion === 'string' ? ex.stopping_criterion : '',
              progression: typeof ex.progression === 'string' ? ex.progression : '',
              notes: typeof ex.notes === 'string' ? ex.notes : '',
            }))
          : [],
      })),
    };

    addProgram(program);
    setActiveProgram(programId);
    setImported(true);
    setJsonInput('');
    setValidationResult(null);
    setShowPreview(false);

    setTimeout(() => setImported(false), 3000);
  };

  const makeSampleJSON = (days: number) => {
    const safeDays = getSafeTrainingDays(days);
    const trainingWeekdays = getSampleTrainingWeekdays(safeDays);
    const orderedTrainingWeekdays = PERSIAN_WEEKDAYS.filter((weekday) =>
      trainingWeekdays.includes(weekday)
    );
    const restDays = getRestDaysFromTraining(orderedTrainingWeekdays);

    const sessionDurationSummary: Record<string, string> = {};
    orderedTrainingWeekdays.forEach((_, index) => {
      sessionDurationSummary[`Day ${index + 1}`] = 'XX دقیقه';
    });

    const sample = {
      program_name: `برنامه نمونه ${toPersianNumber(safeDays)} روزه`,
      duration: '۱ ماه',
      training_days: safeDays,
      rest_days: restDays,
      weekly_volume_summary: {
        Chest: 'X sets direct, Y sets indirect',
        Back: 'X sets direct, Y sets indirect',
        Quadriceps: 'X sets direct, Y sets indirect',
        Hamstrings: 'X sets direct, Y sets indirect',
        Shoulders: 'X sets direct, Y sets indirect',
        Biceps: 'X sets direct, Y sets indirect',
        Triceps: 'X sets direct, Y sets indirect',
        Calves: 'X sets direct, Y sets indirect',
        Abs: 'X sets direct',
      },
      session_duration_summary: sessionDurationSummary,
      adjustment_rules:
        'اگر خواب ضعیف بود، استرس بالا بود یا درد مفصلی حس شد، شدت تمرین را کاهش بده و در صورت نیاز یک روز استراحت اضافه کن.',
      days: orderedTrainingWeekdays.map((weekday, index) => ({
        weekday,
        order: index + 1,
        day: `${weekday} - روز ${toPersianNumber(index + 1)} نمونه`,
        muscle_groups: ['نمونه'],
        warm_up: 'گرم‌کردن عمومی ۵ دقیقه‌ای + ۲ ست آماده‌سازی سبک',
        exercises: [
          {
            name: 'حرکت نمونه',
            sets: '3',
            reps: '8-12',
            rest: '90',
            tempo: '2-1-1-0',
            rir: '2',
            load_method: 'RPE-based',
            target_muscle: 'عضله نمونه',
            substitute: 'حرکت جایگزین نمونه',
            stopping_criterion: 'RIR 2 reached',
            progression: 'Double progression',
            notes: 'این فقط یک نمونه ساختاری است.',
          },
        ],
        core_work: 'در صورت نیاز',
        cardio: 'در صورت نیاز',
      })),
    };

    return JSON.stringify(sample, null, 2);
  };

  if (!activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle size={48} className={isDark ? 'text-[#f59e0b]' : 'text-[#d97706]'} />
        <h2 className={`text-xl font-bold mt-4 mb-2 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
          پروفایل انتخاب نشده
        </h2>
        <p className={`text-center ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
          لطفاً ابتدا یک پروفایل را انتخاب کنید
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className={'text-xl font-bold flex items-center gap-2 ' + (isDark ? 'text-white' : 'text-[#134e4a]')}>
        <ImportIcon size={22} className={isDark ? 'text-[#22c55e]' : 'text-[#059669]'} />
        ورود برنامه تمرینی
        <span className={'text-sm font-normal ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>
          — {activeProfile.name}
        </span>
      </h2>

      {imported && (
        <div className={`rounded-xl p-4 flex items-center gap-3 animate-slide-up ${
          isDark ? 'bg-[#22c55e]/20 border border-[#22c55e]/30' : 'bg-[#10b981]/15 border border-[#10b981]/30'
        }`}>
          <Check size={20} className={isDark ? 'text-[#22c55e]' : 'text-[#059669]'} />
          <span className={'font-bold ' + (isDark ? 'text-[#22c55e]' : 'text-[#059669]')}>
            برنامه با موفقیت وارد شد و فعال شد!
          </span>
        </div>
      )}

      {isStoreBuild && (
        <div className={`rounded-2xl p-5 border theme-transition ${
          isDark ? 'bg-[#1a1a2e] border-[#d4af37]/25' : 'bg-white border-amber-200'
        }`}>
          <div className="flex items-start gap-3 mb-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isDark ? 'bg-[#d4af37]/15 text-[#d4af37]' : 'bg-amber-100 text-amber-700'
            }`}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className={'font-bold ' + (isDark ? 'text-[#d4af37]' : 'text-amber-800')}>
                برنامه پیش‌فرض رایگان
              </h3>
              <p className={'text-sm mt-1 leading-6 ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>
                برنامه فول‌بادی ۳ روزه برای فرد مبتدی (~۲۵ ساله): شنبه، دوشنبه و چهارشنبه.
                بدون نیاز به اشتراک می‌توانید همین الان فعال کنید.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className={'text-xs ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>
              تاریخ شروع:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold border focus:outline-none ${
                isDark ? 'bg-[#0d0d1a] border-gray-700 text-white' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a]'
              }`}
            />
            <button
              onClick={handleImportDefault}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isDark
                  ? 'bg-[#d4af37] text-black hover:brightness-110'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
              }`}
            >
              <Save size={16} />
              ورود برنامه پیش‌فرض
            </button>
          </div>
        </div>
      )}

      <div className={`rounded-2xl p-5 border theme-transition ${
        isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'
      }`}>
        <h3 className={'font-bold mb-3 flex items-center gap-2 ' + (isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]')}>
          JSON برنامه تمرینی
        </h3>

                {(
          <>
            <p className={'text-sm mb-3 ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>
              خروجی هوش مصنوعی را در قالب JSON وارد کنید.
              سیستم بررسی می‌کند که تعداد روزهای برنامه دقیقاً با پروفایل کاربر مطابقت داشته باشد.
            </p>

            <textarea
              value={jsonInput}
              onChange={e => {
                setJsonInput(e.target.value);
                setValidationResult(null);
                setShowPreview(false);
              }}
              className={`w-full border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none resize-none ${
                isDark
                  ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#14b8a6]'
                  : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]'
              }`}
              rows={10}
              dir="ltr"
              placeholder='{"program_name": "...", "duration": "...", "rest_days": [...], "days": [...]}'
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleValidate}
                disabled={!jsonInput.trim()}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  isDark
                    ? 'bg-[#4a90d9] text-white hover:bg-[#6bb5ff] disabled:opacity-50'
                    : 'bg-[#14b8a6] text-white hover:bg-[#0d9488] disabled:opacity-50'
                }`}
              >
                <Eye size={16} />
                اعتبارسنجی و پیش‌نمایش
              </button>

              <button
                onClick={() => setJsonInput(makeSampleJSON(activeProfile.trainingDays))}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all ${
                  isDark
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                نمونه JSON
              </button>
            </div>
          </>
        )}
      </div>

      {canUseJsonImport && validationResult && !validationResult.valid && (
        <div className={`rounded-xl p-4 flex items-start gap-3 ${
          isDark ? 'bg-[#ef4444]/10 border border-[#ef4444]/30' : 'bg-red-50 border border-red-200'
        }`}>
          <AlertCircle size={20} className={isDark ? 'text-[#ef4444]' : 'text-[#dc2626]'} />
          <div>
            <p className={`font-bold ${isDark ? 'text-[#ef4444]' : 'text-[#dc2626]'}`}>خطا در اعتبارسنجی</p>
            <p className={'text-sm mt-1 ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>
              {validationResult.error}
            </p>
          </div>
        </div>
      )}

      {canUseJsonImport && showPreview && validationResult?.valid && (
        <div className={`rounded-2xl p-5 border animate-slide-up ${
          isDark ? 'bg-[#1a1a2e] border-[#22c55e]/20' : 'bg-white border-[#10b981]/30'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={'font-bold flex items-center gap-2 ' + (isDark ? 'text-[#22c55e]' : 'text-[#059669]')}>
              <Check size={18} />
              پیش‌نمایش برنامه
            </h3>

            <button
              onClick={handleImport}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                isDark
                  ? 'bg-[#22c55e] text-white hover:bg-[#16a34a]'
                  : 'bg-[#10b981] text-white hover:bg-[#059669]'
              }`}
            >
              <Save size={16} />
              ذخیره برنامه
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>نام برنامه:</span>
              <span className={'font-bold ' + (isDark ? 'text-white' : 'text-[#134e4a]')}>
                {validationResult.data.program_name}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>مدت:</span>
              <span className={isDark ? 'text-white' : 'text-[#134e4a]'}>
                {validationResult.data.duration}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>تاریخ شروع برنامه:</span>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold border focus:outline-none ${
                  isDark ? 'bg-[#0d0d1a] border-gray-700 text-white' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a]'
                }`}
              />
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>تعداد روزهای پروفایل:</span>
              <span className={isDark ? 'text-white' : 'text-[#134e4a]'}>
                {toPersianNumber(activeProfile.trainingDays)} روز
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>تعداد روزهای JSON:</span>
              <span className={isDark ? 'text-white' : 'text-[#134e4a]'}>
                {toPersianNumber(validationResult.data.days.length)} روز
              </span>
            </div>

            {Array.isArray(validationResult.data.rest_days) && validationResult.data.rest_days.length > 0 && (
              <div className="flex items-center gap-4 text-sm">
                <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>روزهای استراحت:</span>
                <span className={isDark ? 'text-white' : 'text-[#134e4a]'}>
                  {(validationResult.data.rest_days as string[]).join('، ')}
                </span>
              </div>
            )}

            <div className={`border-t pt-4 mt-4 ${isDark ? 'border-gray-700' : 'border-[#14b8a6]/20'}`}>
              {validationResult.data.days.map((day: any, i: number) => (
                <div key={i} className={`mb-4 rounded-xl p-4 ${
                  isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'
                }`}>
                  <h4 className={'font-bold mb-2 flex items-center gap-2 ' + (isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]')}>
                    {day.weekday ? (
                      <span className={`px-2 py-0.5 rounded-lg text-xs ${
                        isDark ? 'bg-[#14b8a6]/20 text-[#14b8a6]' : 'bg-[#14b8a6]/15 text-[#0d9488]'
                      }`}>
                        {day.weekday}
                      </span>
                    ) : null}
                    {day.day}
                  </h4>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {(day.muscle_groups || []).map((mg: string, j: number) => (
                      <span key={j} className={`px-2 py-0.5 rounded text-xs ${
                        isDark ? 'bg-[#4a90d9]/20 text-[#4a90d9]' : 'bg-[#14b8a6]/15 text-[#0d9488]'
                      }`}>
                        {mg}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {(day.exercises || []).map((ex: any, k: number) => (
                      <div key={k} className={`flex items-center justify-between text-sm border-b pb-2 ${
                        isDark ? 'border-gray-800' : 'border-[#14b8a6]/10'
                      }`}>
                        <span className={isDark ? 'text-white' : 'text-[#134e4a]'}>{ex.name}</span>
                        <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
                          {toPersianNumber(ex.sets)}×{ex.reps} | استراحت: {toPersianNumber(ex.rest)}ث
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`rounded-2xl p-5 border theme-transition ${
        isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'
      }`}>
        <h3 className={'font-bold mb-4 ' + (isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]')}>
          برنامه‌های ذخیره‌شده
        </h3>

        {programs.length === 0 ? (
          <p className={'text-sm text-center py-6 ' + (isDark ? 'text-gray-500' : 'text-[#0f766e]/60')}>
            هنوز برنامه‌ای ذخیره نشده است
          </p>
        ) : (
          <div className="space-y-3">
            {programs.map((program) => {
              const timeline = getProgramTimelineDetails(
                program.startDate,
                program.duration,
                program.createdAt
              );
              return (
                <div
                  key={program.id}
                  className={`rounded-xl p-4 border ${
                    state.activeProgram === program.id
                      ? (isDark ? 'border-[#22c55e]/40 bg-[#22c55e]/5' : 'border-[#10b981]/40 bg-[#10b981]/5')
                      : (isDark ? 'border-gray-700 bg-[#0d0d1a]' : 'border-[#14b8a6]/15 bg-[#f0fdfa]')
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className={'font-bold text-sm truncate ' + (isDark ? 'text-white' : 'text-[#134e4a]')}>
                        {program.name}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
                          {program.duration}
                        </span>
                        <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>|</span>
                        <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
                          {toPersianNumber(program.days?.length || 0)} روز تمرین
                        </span>
                        <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>|</span>
                        <CalendarIcon size={12} className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'} />
                        <input
                          type="date"
                          value={program.startDate || ''}
                          onChange={(e) => {
                            updateProgram({ ...program, startDate: e.target.value });
                          }}
                          className={`mr-2 px-2 py-0.5 text-[11px] rounded border ${
                            isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'
                          }`}
                          title="تغییر تاریخ شروع"
                        />
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <Clock
                          size={14}
                          className={timeline.isAlarmRequired ? 'text-amber-500 animate-pulse' : (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}
                        />
                        <span className={timeline.isAlarmRequired ? 'text-amber-500 font-bold' : (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>
                          {timeline.daysRemaining > 0
                            ? `${toPersianNumber(timeline.daysRemaining)} روز باقی مانده`
                            : timeline.daysRemaining === 0
                            ? 'امروز آخرین روز برنامه است!'
                            : `برنامه ${toPersianNumber(Math.abs(timeline.daysRemaining))} روز پیش پایان یافته`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {state.activeProgram === program.id ? (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          isDark ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#10b981]/15 text-[#059669]'
                        }`}>
                          فعال
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveProgram(program.id)}
                          className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all ${
                            isDark
                              ? 'bg-[#4a90d9]/20 text-[#4a90d9] hover:bg-[#4a90d9]/30'
                              : 'bg-[#14b8a6]/15 text-[#0d9488] hover:bg-[#14b8a6]/25'
                          }`}
                        >
                          فعال‌سازی
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm('آیا مطمئن هستید؟')) removeProgram(program.id);
                        }}
                        className="text-[#ef4444] p-1.5 hover:bg-[#ef4444]/10 rounded-lg transition-all"
                        title="حذف برنامه"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
