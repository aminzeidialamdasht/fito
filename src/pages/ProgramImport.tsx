import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { validateWorkoutJSON } from '../utils/promptGenerator';
import { WorkoutProgram } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Import as ImportIcon, Check, AlertCircle, Trash2, Save, Eye, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { toPersianNumber, formatDateJalali, getProgramTimelineDetails } from '../utils/jalali';

export default function ProgramImport() {
  const { activeProfile, programs, addProgram, updateProgram, removeProgram, setActiveProgram, state } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [jsonInput, setJsonInput] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; data?: any; error?: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [imported, setImported] = useState(false);

  const handleValidate = () => {
    const result = validateWorkoutJSON(jsonInput);
    setValidationResult(result);
    if (result.valid) {
      setShowPreview(true);
    }
  };

  const handleImport = () => {
    if (!validationResult?.valid || !validationResult.data || !activeProfile) return;

    const programId = uuidv4();
    const program: WorkoutProgram = {
      id: programId,
      profileId: activeProfile.id,
      name: validationResult.data.program_name,
      duration: validationResult.data.duration,
      startDate: startDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      days: validationResult.data.days.map((day: any) => ({
        id: uuidv4(),
        day: day.day,
        muscleGroups: day.muscle_groups || [],
        exercises: day.exercises.map((ex: any) => ({
          id: uuidv4(),
          name: ex.name,
          sets: parseInt(ex.sets) || 4,
          reps: ex.reps,
          rest: parseInt(ex.rest) || 90,
          tempo: ex.tempo || '',
          notes: ex.notes || '',
        })),
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

  const sampleJSON = JSON.stringify({
    "program_name": "برنامه عضله‌سازی ۴ روزه",
    "duration": "۸ هفته",
    "days": [
      {
        "day": "روز اول - سینه و پشت‌بازو",
        "muscle_groups": ["سینه", "پشت‌بازو"],
        "exercises": [
          {
            "name": "پرس سینه هالتر",
            "sets": "4",
            "reps": "8-10",
            "rest": "120",
            "tempo": "3-1-1-0",
            "notes": "کنترل کامل در فاز منفی"
          },
          {
            "name": "پرس بالا سینه دمبل",
            "sets": "3",
            "reps": "10-12",
            "rest": "90",
            "tempo": "2-1-1-0",
            "notes": "انقباض در بالا"
          }
        ]
      }
    ]
  }, null, 2);

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

      <div className={`rounded-2xl p-5 border theme-transition ${
        isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'
      }`}>
        <h3 className={'font-bold mb-3 ' + (isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]')}>
          JSON برنامه تمرینی
        </h3>
        <p className={'text-sm mb-3 ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>
          خروجی هوش مصنوعی را در قالب JSON وارد کنید:
        </p>
        <textarea
          value={jsonInput}
          onChange={e => { setJsonInput(e.target.value); setValidationResult(null); setShowPreview(false); }}
          className={`w-full border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none resize-none ${
            isDark
              ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#14b8a6]'
              : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]'
          }`}
          rows={10}
          dir="ltr"
          placeholder='{"program_name": "...", "days": [...]}'
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
            onClick={() => setJsonInput(sampleJSON)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all ${
              isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            نمونه JSON
          </button>
        </div>
      </div>

      {validationResult && !validationResult.valid && (
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

      {showPreview && validationResult?.valid && (
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
              <span className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>تعداد روزها:</span>
              <span className={isDark ? 'text-white' : 'text-[#134e4a]'}>
                {toPersianNumber(validationResult.data.days.length)} روز
              </span>
            </div>

            <div className={`border-t pt-4 mt-4 ${isDark ? 'border-gray-700' : 'border-[#14b8a6]/20'}`}>
              {validationResult.data.days.map((day: any, i: number) => (
                <div key={i} className={`mb-4 rounded-xl p-4 ${
                  isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'
                }`}>
                  <h4 className={'font-bold mb-2 ' + (isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]')}>
                    {day.day}
                  </h4>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(day.muscle_groups || []).map((mg: string, j: number) => (
                      <span key={j} className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-[#4a90d9]/20 text-[#4a90d9]' : 'bg-[#14b8a6]/15 text-[#0d9488]'}`}>{mg}</span>
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

      {/* Saved Programs — only for active profile */}
      <div className={`rounded-2xl p-5 border theme-transition ${
        isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'
      }`}>
        <h3 className={'font-bold mb-4 ' + (isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]')}>
          برنامه‌های ذخیره شده ({activeProfile.name})
        </h3>
        {programs.length === 0 ? (
          <p className={'text-sm text-center py-4 ' + (isDark ? 'text-gray-500' : 'text-[#0f766e]/50')}>
            هنوز برنامه تمرینی برای این پروفایل وارد نشده است
          </p>
        ) : (
          <div className="space-y-3">
            {programs.map(program => {
              const timeline = getProgramTimelineDetails(program.startDate, program.duration, program.createdAt);
              return (
                <div
                  key={program.id}
                  className={`rounded-xl p-4 border ${
                    state.activeProgram === program.id
                      ? isDark
                        ? 'bg-[#0d0d1a] border-[#22c55e]/50'
                        : 'bg-[#f0fdfa] border-[#10b981]/40'
                      : isDark
                        ? 'bg-[#0d0d1a] border-gray-800'
                        : 'bg-[#f0fdfa] border-[#14b8a6]/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className={'font-bold ' + (isDark ? 'text-white' : 'text-[#134e4a]')}>
                        {program.name}
                      </h4>
                      <p className={'text-xs mt-1 flex flex-wrap items-center gap-2 ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>
                        <span>مدت: <strong>{program.duration}</strong> ({toPersianNumber(timeline.totalDays)} روز)</span>
                        <span>• {toPersianNumber(program.days.length)} روز تمرین</span>
                        <span>• {toPersianNumber(program.days.reduce((acc, d) => acc + d.exercises.length, 0))} حرکت</span>
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <CalendarIcon size={14} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
                        <span className={isDark ? 'text-gray-300' : 'text-[#134e4a]'}>
                          شروع: <strong>{timeline.startDateJalali}</strong> | پایان: <strong>{timeline.endDateJalali}</strong>
                        </span>
                        <input
                          type="date"
                          value={program.startDate ? program.startDate.split('T')[0] : timeline.startDateIso}
                          onChange={e => {
                            updateProgram({ ...program, startDate: e.target.value });
                          }}
                          className={`mr-2 px-2 py-0.5 text-[11px] rounded border ${
                            isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'
                          }`}
                          title="تغییر تاریخ شروع"
                        />
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <Clock size={14} className={timeline.isAlarmRequired ? 'text-amber-500 animate-pulse' : (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')} />
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
