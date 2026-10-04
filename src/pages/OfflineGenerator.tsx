import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { soundEffects } from '../utils/sound';
import { generateOfflineWorkout } from '../engine';
import type { GeneratedProgram } from '../engine';
import { analyzePerformance, getPerformanceSummary } from '../engine/core/performanceAnalyzer';
import type { WorkoutProgram } from '../types';
import { toPersianNumber } from '../utils/jalali';
import {
  Sparkles,
  Dumbbell,
  Target,
  Calendar,
  Clock,
  Zap,
  CheckCircle2,
  ChevronLeft,
  Save,
  RefreshCw,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export default function OfflineGenerator() {
  const navigate = useNavigate();
  const { activeProfile, programs, addProgram, setActiveProgram, sessions } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [generatedProgram, setGeneratedProgram] = useState<GeneratedProgram | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  // تحلیل عملکرد از تاریخچه تمرینات
  const performance = useMemo(() => analyzePerformance(sessions), [sessions]);
  const perfSummary = useMemo(() => getPerformanceSummary(performance), [performance]);

  // رنگ‌ها
  const teal = isDark ? '#14b8a6' : '#0d9488';
  const gold = isDark ? '#d4af37' : '#f59e0b';
  const bgMain = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textMain = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';
  const borderCard = isDark ? 'border-white/5' : 'border-gray-200';

  const handleGenerate = () => {
    if (!activeProfile) return;
    soundEffects.playClick();
    setIsGenerating(true);
    setSaved(false);

    // شبیه‌سازی تأخیر کوچک برای UX بهتر
    setTimeout(() => {
      try {
        const program = generateOfflineWorkout(activeProfile, sessions);
        setGeneratedProgram(program);
        soundEffects.playWorkoutFinish?.();
      } catch (e) {
        console.error('خطا در تولید برنامه:', e);
        alert('خطا در تولید برنامه. لطفاً دوباره تلاش کنید.');
      } finally {
        setIsGenerating(false);
      }
    }, 400);
  };

  const handleSave = () => {
    if (!generatedProgram || !activeProfile) return;
    soundEffects.playClick();

    // تبدیل به فرمت WorkoutProgram اپ
    const programForApp: WorkoutProgram = {
      id: generatedProgram.id,
      profileId: activeProfile.id,
      name: generatedProgram.name,
      duration: `${generatedProgram.durationWeeks} هفته`,
      createdAt: generatedProgram.createdAt,
      trainingDays: generatedProgram.trainingDaysPerWeek,
      days: generatedProgram.days.map((day) => ({
        day: day.title,
        weekday: day.dayName,
        muscleGroups: day.exercises.map((e) => e.primaryMuscle),
        muscle_groups: day.exercises.map((e) => e.primaryMuscle),
        exercises: day.exercises.map((ex) => ({
          id: ex.exerciseId,
          name: ex.name,
          sets: ex.sets.length,
          reps: ex.sets[0]?.targetReps || '8-12',
          rest: ex.sets[0]?.restSeconds || 90,
          tempo: ex.sets[0]?.tempo,
          rir: ex.sets[0]?.targetRIR,
          targetMuscle: ex.primaryMuscle,
          substitute: ex.substituteId,
          notes: ex.notes,
        })),
      })),
    };

    addProgram(programForApp);
    setActiveProgram(generatedProgram.id);
    setSaved(true);
    soundEffects.playWorkoutFinish?.();

    setTimeout(() => {
      navigate('/programs');
    }, 1500);
  };

  if (!activeProfile) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${bgMain}`}>
        <AlertCircle size={48} className="text-amber-500 mb-4" />
        <h2 className={`text-xl font-bold mb-2 ${textMain}`}>پروفایل تکمیل نشده</h2>
        <p className={`text-sm ${textSub} mb-6 text-center`}>
          برای تولید برنامه، ابتدا پروفایل ورزشکار را تکمیل کنید
        </p>
        <button
          onClick={() => navigate('/profile')}
          className="px-6 py-3 rounded-xl font-bold text-white"
          style={{ background: teal }}
        >
          تکمیل پروفایل
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-24 ${bgMain}`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 py-4 ${isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white/90 border-gray-200'}`}>
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5">
            <ChevronLeft size={24} className={isDark ? 'text-white' : 'text-gray-800'} />
          </button>
          <div className="flex-1">
            <h1 className={`font-black text-lg ${textMain} flex items-center gap-2`}>
              <Sparkles size={20} style={{ color: gold }} />
              تولید برنامه هوشمند
            </h1>
            <p className={`text-xs ${textSub}`}>آفلاین — سریع — علمی</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Profile Summary */}
        <div className={`rounded-2xl p-4 border ${borderCard} ${cardBg}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-bold text-sm flex items-center gap-2 ${textMain}`}>
              <Target size={16} style={{ color: teal }} />
              مشخصات ورزشکار
            </h3>
            <button
              onClick={() => navigate('/profile')}
              className="text-xs font-bold"
              style={{ color: teal }}
            >
              ویرایش
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className={textSub}>نام: </span>
              <span className={`font-bold ${textMain}`}>{activeProfile.name}</span>
            </div>
            <div>
              <span className={textSub}>هدف: </span>
              <span className={`font-bold ${textMain}`}>{getGoalPersian(activeProfile.primaryGoal)}</span>
            </div>
            <div>
              <span className={textSub}>سطح: </span>
              <span className={`font-bold ${textMain}`}>{getExperiencePersian(activeProfile.experience)}</span>
            </div>
            <div>
              <span className={textSub}>روزهای تمرین: </span>
              <span className={`font-bold ${textMain}`}>{toPersianNumber(activeProfile.trainingDays)} روز/هفته</span>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className={`rounded-2xl p-4 border ${borderCard} ${cardBg}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-bold text-sm flex items-center gap-2 ${textMain}`}>
              <TrendingUp size={16} style={{ color: teal }} />
              تحلیل عملکرد
            </h3>
            {perfSummary.hasData && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${teal}20`, color: teal }}>
                {toPersianNumber(performance.totalSessions)} جلسه
              </span>
            )}
          </div>

          {/* Main Records */}
          {perfSummary.hasData && perfSummary.mainRecords.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {perfSummary.mainRecords.map((rec, i) => (
                <div key={i} className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <p className={`text-[10px] ${textSub}`}>{rec.label}</p>
                  <p className={`text-sm font-black ${textMain}`}>{rec.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Fatigue Warning */}
          {performance.fatigue.needsDeload && (
            <div className={`p-3 rounded-lg mb-3 flex items-start gap-2 ${isDark ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
              <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className={`text-xs font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>سطح خستگی بالا</p>
                <p className={`text-[10px] mt-0.5 ${isDark ? 'text-amber-300/70' : 'text-amber-600'}`}>
                  برنامه با حجم کمتر و RIR بالاتر تولید می‌شود
                </p>
              </div>
            </div>
          )}

          {/* Message */}
          <p className={`text-[11px] leading-5 ${textSub}`}>
            {perfSummary.message}
          </p>

          {/* Fatigue Bar */}
          {perfSummary.hasData && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-bold ${textSub}`}>سطح خستگی</span>
                <span className={`text-[10px] font-black`} style={{ color: performance.fatigue.fatigueLevel > 75 ? '#ef4444' : performance.fatigue.fatigueLevel > 50 ? '#f59e0b' : teal }}>
                  {toPersianNumber(performance.fatigue.fatigueLevel)}٪
                </span>
              </div>
              <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${performance.fatigue.fatigueLevel}%`,
                    background: performance.fatigue.fatigueLevel > 75 ? '#ef4444' : performance.fatigue.fatigueLevel > 50 ? '#f59e0b' : teal,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        {!generatedProgram && (
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 text-white"
            style={{ background: `linear-gradient(135deg, ${teal} 0%, ${gold} 100%)` }}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={24} className="animate-spin" />
                در حال تولید...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                تولید برنامه من
              </>
            )}
          </button>
        )}

        {/* Generated Program Preview */}
        {generatedProgram && (
          <div className="space-y-4">
            {/* Program Header */}
            <div className={`rounded-2xl p-5 border ${borderCard} ${cardBg}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className={`font-black text-lg ${textMain} mb-1`}>{generatedProgram.name}</h2>
                  <p className={`text-xs ${textSub}`}>
                    {getSplitName(generatedProgram.splitType)} · {toPersianNumber(generatedProgram.durationWeeks)} هفته
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${gold}20` }}>
                  <Dumbbell size={24} style={{ color: gold }} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <StatBox icon={Calendar} label="روز/هفته" value={toPersianNumber(generatedProgram.trainingDaysPerWeek)} color={teal} />
                <StatBox icon={Clock} label="دقیقه/جلسه" value={toPersianNumber(generatedProgram.sessionDuration)} color={gold} />
                <StatBox icon={Zap} label="حرکات" value={toPersianNumber(generatedProgram.days.reduce((a, d) => a + d.exercises.length, 0))} color="#8b5cf6" />
              </div>
            </div>

            {/* Days */}
            {generatedProgram.days.map((day, idx) => (
              <div key={idx} className={`rounded-2xl border ${borderCard} ${cardBg} overflow-hidden`}>
                <div className={`px-4 py-3 border-b ${isDark ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-black text-sm ${textMain}`}>{day.dayName}</h3>
                      <p className={`text-[10px] ${textSub}`}>{day.title.split(' - ')[1] || ''}</p>
                    </div>
                    <div className={`text-xs font-bold px-2 py-1 rounded-lg`} style={{ background: `${teal}20`, color: teal }}>
                      {toPersianNumber(day.estimatedDuration)} دقیقه
                    </div>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  {day.exercises.map((ex, exIdx) => (
                    <div key={exIdx} className={`flex items-center justify-between p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black flex-shrink-0 ${isDark ? 'bg-white/10 text-white' : 'bg-white text-gray-600'}`}>
                          {toPersianNumber(exIdx + 1)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-bold truncate ${textMain}`}>{ex.name}</p>
                          <p className={`text-[10px] ${textSub}`}>{ex.sets.length} ست × {ex.sets[0]?.targetReps}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 sticky bottom-4">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50 ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}
              >
                <RefreshCw size={18} />
                تولید دوباره
              </button>
              <button
                onClick={handleSave}
                disabled={saved}
                className="py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-black shadow-lg active:scale-[0.98] transition-all"
                style={{ background: saved ? '#22c55e' : gold }}
              >
                {saved ? (
                  <>
                    <CheckCircle2 size={18} />
                    ذخیره شد
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    ذخیره برنامه
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Info Footer */}
        {!generatedProgram && (
          <div className={`rounded-2xl p-4 border ${borderCard} ${isDark ? 'bg-white/5' : 'bg-teal-50'}`}>
            <div className="flex items-start gap-3">
              <TrendingUp size={20} className="flex-shrink-0 mt-0.5" style={{ color: teal }} />
              <div>
                <p className={`text-xs font-bold ${textMain} mb-1`}>موتور هوشمند آفلاین</p>
                <p className={`text-[11px] ${textSub} leading-5`}>
                  برنامه‌ها بر اساس اصول علمی Israetel، Schoenfeld و Helms تولید می‌شوند.
                  کاملاً آفلاین، بدون نیاز به اینترنت و هوش مصنوعی.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// کامپوننت‌های کمکی
function StatBox({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex flex-col items-center">
      <Icon size={18} style={{ color }} />
      <p className="text-lg font-black mt-1" style={{ color }}>{value}</p>
      <p className="text-[10px] opacity-70">{label}</p>
    </div>
  );
}

function getGoalPersian(goal: string): string {
  const map: Record<string, string> = {
    hypertrophy: 'حجم عضلانی',
    strength: 'قدرت',
    fat_loss: 'کاهش چربی',
    recomposition: 'بازترکیب',
    competition: 'مسابقه',
    general_fitness: 'تناسب اندام',
  };
  return map[goal] || goal;
}

function getExperiencePersian(exp: string): string {
  const map: Record<string, string> = {
    beginner: 'مبتدی',
    intermediate: 'متوسط',
    advanced: 'پیشرفته',
    professional: 'حرفه‌ای',
  };
  return map[exp] || exp;
}

function getSplitName(split: string): string {
  const map: Record<string, string> = {
    full_body: 'تمام‌بدن',
    upper_lower: 'بالاتنه/پایین‌تنه',
    push_pull_legs: 'پرس/کشش/پا',
    bro_split: 'تفکیک عضلانی',
    ppl_ul_hybrid: 'ترکیبی',
  };
  return map[split] || split;
}
