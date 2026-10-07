import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { soundEffects } from '../../utils/sound';
import { toPersianNumber } from '../../utils/jalali';
import {
  ChevronLeft, Dumbbell, Play, ChevronDown, ChevronUp, Calendar,
  CheckCircle2, ArrowRightLeft, RefreshCw,
} from 'lucide-react';
import SubstituteModal from '../../components/SubstituteModal';
import VolumeSummary from '../../components/VolumeSummary';
import SafetyReportCard from '../../components/SafetyReportCard';
import ProgramIdentityCard from '../../components/program/ProgramIdentityCard';
import DeloadBadge from '../../components/program/DeloadBadge';
import PeriodizationCard from '../../components/program/PeriodizationCard';
import TechniqueBadge from '../../components/program/TechniqueBadge';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import SectionHeader from '../../components/ui/SectionHeader';
import { analyzeProgramSafety } from '../../engine/core/injurySafetyEngine';
import { analyzeProfile } from '../../engine/core/profileAnalyzer';
import { normalizeSets, countTotalSets } from '../../utils/programHelpers';
import type { WorkoutProgram, WorkoutDay, Exercise } from '../../types';
import type { TrainingTechnique } from '../../engine/types/program';
import { generateWorkoutProgram } from '../../engine/generators/workoutGenerator';
import { convertGeneratedToWorkout } from '../../utils/programConverter';
import {
  getCurrentWeek,
  getDaysUntilNextWeek,
  getWeekScheme,
} from '../../utils/weekCalculator';

const PERSIAN_WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

function getExerciseTechnique(ex: Exercise): TrainingTechnique | undefined {
  const sets = normalizeSets(ex.sets as unknown as any);
  return sets[0]?.technique;
}

export default function ProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { programs, state, setActiveProgram, updateProgram, activeProfile, sessions } = useAppContext();

  const [weekUpdate, setWeekUpdate] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const program = programs.find((p) => p.id === id);

  // Phase 11c: Auto-Regeneration در هفته جدید
  useEffect(() => {
    if (!program || !activeProfile) return;

    const currentWeek = getCurrentWeek(program);
    const storedWeek = program.metadata?.currentWeek ?? 1;

    if (currentWeek === 0 || currentWeek === storedWeek) return;

    try {
      const generated = generateWorkoutProgram(
        activeProfile,
        sessions,
        currentWeek,
      );

      const updated = convertGeneratedToWorkout(
        generated,
        program,
        activeProfile.id,
        currentWeek,
      );

      updateProgram(updated);
      setWeekUpdate(
        `برنامه برای هفته ${toPersianNumber(currentWeek)} بروزرسانی شد`,
      );
    } catch (err) {
      console.error('Regeneration failed:', err);
    }
  }, [program, activeProfile, sessions, updateProgram]);

  const allInjuries: string[] = activeProfile ? analyzeProfile(activeProfile).safeInjuries : [];
  const safetyReport = program && allInjuries.length > 0
    ? analyzeProgramSafety(
        program as unknown as Parameters<typeof analyzeProgramSafety>[0],
        allInjuries
      )
    : null;

  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [substituteTarget, setSubstituteTarget] = useState<{
    dayIdx: number; exIdx: number; exerciseId: string; exerciseName: string;
  } | null>(null);

  const teal = isDark ? '#a78bfa' : '#8b5cf6';
  const gold = isDark ? '#d4af37' : '#f59e0b';
  const bgMain = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? 'bg-[#1e1b4b]/50 backdrop-blur-md' : 'bg-violet-50/70 backdrop-blur-md';
  const textMain = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';
  const borderCard = isDark ? 'border-white/10' : 'border-violet-200/60';

  if (!program) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${bgMain}`}>
        <Dumbbell size={48} className="opacity-30 mb-4" />
        <h2 className={`text-xl font-black mb-2 ${textMain}`}>برنامه یافت نشد</h2>
        <button onClick={() => navigate('/programs')} className="mt-4 px-6 py-3 rounded-xl font-bold text-white" style={{ background: teal }}>
          بازگشت به برنامه‌ها
        </button>
      </div>
    );
  }

  const isActive = state.activeProgram === program.id;

  // Phase 11d: شاخص هفته
  const currentWeek = getCurrentWeek(program as any);
  const totalWeeks = (program as any).durationWeeks
    || program.metadata?.weeklyProgression?.length
    || 4;
  const weekScheme = getWeekScheme(program as any, currentWeek);
  const daysUntilNext = getDaysUntilNextWeek(program as any);
  const days = (program as WorkoutProgram).days || [];

  const handleStartDay = (dayIndex: number) => {
    soundEffects.playClick();
    if (!isActive) setActiveProgram(program.id);
    navigate(`/tracker/${dayIndex}?day=${dayIndex}&autoStart=true`);
  };

  const handleActivate = () => {
    soundEffects.playClick();
    setActiveProgram(program.id);
  };

  const handleSubstituteSelect = (newExerciseId: string, newExerciseName: string) => {
    if (!substituteTarget) return;
    const { dayIdx, exIdx } = substituteTarget;
    const updated: WorkoutProgram = {
      ...program,
      days: program.days.map((d, di) => di !== dayIdx ? d : ({
        ...d,
        exercises: d.exercises.map((e, ei) => ei !== exIdx ? e : ({
          ...e, id: newExerciseId, name: newExerciseName,
        })),
      })),
    };
    updateProgram(updated);
    setSubstituteTarget(null);
  };

  return (
    <div className={`min-h-screen pb-24 ${bgMain}`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 py-4 ${isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white/90 border-gray-200'}`}>
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5" aria-label="بازگشت">
            <ChevronLeft size={24} className={isDark ? 'text-white' : 'text-gray-800'} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className={`font-black text-base truncate ${textMain}`}>{program.name}</h1>
            <p className={`text-xs ${textSub}`}>{program.duration || 'برنامه تمرینی'}</p>
          </div>
          {!isActive && (
            <button onClick={handleActivate} className="px-3 py-2 rounded-xl font-bold text-xs text-white flex items-center gap-1.5" style={{ background: teal }}>
              <CheckCircle2 size={14} />
              فعال‌سازی
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-3xl mx-auto">
        {/* Phase 10: Program Identity Card */}
        <ProgramIdentityCard program={program} />

        {/* Phase 10: Deload Badge */}
        <DeloadBadge program={program} />

        {/* Phase 11d: Week Indicator */}
        {currentWeek > 0 && (
          <Card className="space-y-3">
            <SectionHeader
              icon={<Calendar size={18} />}
              title={`هفته ${toPersianNumber(currentWeek)} از ${toPersianNumber(totalWeeks)}`}
              subtitle={weekScheme?.label ? `فاز: ${weekScheme.label}` : 'فاز جاری'}
            />
            <div className="flex flex-wrap gap-2">
              {weekScheme?.reps && (
                <Badge color="info">{weekScheme.reps} تکرار</Badge>
              )}
              {typeof weekScheme?.rir === 'number' && (
                <Badge color="warning">RIR {toPersianNumber(weekScheme.rir)}</Badge>
              )}
              {daysUntilNext !== null && daysUntilNext > 0 && (
                <Badge color="priority">
                  {toPersianNumber(daysUntilNext)} روز تا هفته بعد
                </Badge>
              )}
              {daysUntilNext === 0 && (
                <Badge color="success">هفته جدید شروع شد</Badge>
              )}
            </div>
          </Card>
        )}

        {/* Phase 10: Periodization Card */}
        <PeriodizationCard program={program} />

        {/* Volume Summary */}
        {program.weeklyVolumeSummary && (
          <VolumeSummary
            weeklyVolume={program.weeklyVolumeSummary as any}
            experience={(program.metadata?.experience as any) || (program.experience as any) || 'intermediate'}
            goal={(program.metadata?.goal as any) || (program.goal as any) || 'hypertrophy'}
            priorityMuscles={program.metadata?.priorityMuscles || []}
            isDark={isDark}
          />
        )}

        {/* Safety Report */}
        {safetyReport && <SafetyReportCard report={safetyReport} />}

        {/* Days List */}
        <h2 className={`font-black text-sm px-1 ${textMain}`}>جلسات تمرینی</h2>

        {days.map((day: WorkoutDay, idx: number) => {
          const isExpanded = expandedDay === idx;
          const exercises = day.exercises || [];
          const totalSets = exercises.reduce(
            (a, e) => a + normalizeSets(e.sets as unknown as any).length,
            0
          );
          const dayName = day.weekday || day.day || PERSIAN_WEEKDAYS[idx % 7];

          return (
            <div key={idx} className={`rounded-2xl border overflow-hidden transition-all ${borderCard} ${cardBg}`}>
              <button
                onClick={() => { soundEffects.playClick(); setExpandedDay(isExpanded ? null : idx); }}
                className="w-full p-4 flex items-center justify-between text-right"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-base font-black" style={{ background: `${teal}20`, color: teal }}>
                    {toPersianNumber(idx + 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-black text-sm truncate ${textMain}`}>{dayName}</h3>
                    <p className={`text-[11px] ${textSub} mt-0.5`}>
                      {toPersianNumber(exercises.length)} حرکت · {toPersianNumber(totalSets)} ست
                    </p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={20} className={textSub} /> : <ChevronDown size={20} className={textSub} />}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {exercises.map((ex: Exercise, exIdx: number) => {
                    const sets = normalizeSets(ex.sets as unknown as any);
                    const tech = sets[0]?.technique;
                    return (
                      <div key={exIdx} className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 ${isDark ? 'bg-white/10 text-white' : 'bg-white text-gray-600'}`}>
                            {toPersianNumber(exIdx + 1)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`text-xs font-bold truncate ${textMain}`}>{ex.name}</p>
                              {tech && <TechniqueBadge technique={tech} compact />}
                            </div>
                            <p className={`text-[10px] ${textSub}`}>
                              {toPersianNumber(sets.length)} ست × {ex.reps || '—'}
                              {ex.rest ? ` · استراحت ${toPersianNumber(ex.rest)} ثانیه` : ''}
                            </p>
                          </div>
                          {(ex.id || (ex as any).exerciseId) && (
                            <button
                              onClick={() => {
                                soundEffects.playClick();
                                setSubstituteTarget({
                                  dayIdx: idx, exIdx,
                                  exerciseId: ex.id || (ex as any).exerciseId,
                                  exerciseName: ex.name,
                                });
                              }}
                              className={`p-2 rounded-lg flex-shrink-0 min-h-[44px] min-w-[44px] ${isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                              aria-label="تغییر حرکت"
                            >
                              <RefreshCw size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => handleStartDay(idx)}
                    className="w-full mt-3 py-3 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md min-h-[48px]"
                    style={{ background: `linear-gradient(135deg, ${teal} 0%, ${gold} 100%)` }}
                  >
                    <Play size={16} />
                    شروع جلسه {dayName}
                  </button>

                  <button
                    onClick={() => { soundEffects.playClick(); navigate(`/tracker/${idx}?day=${idx}&autoStart=true`); }}
                    className={`w-full py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    <ArrowRightLeft size={12} />
                    جابجایی یا شروع در روز دیگر
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {days.length === 0 && (
          <div className={`rounded-2xl p-8 text-center ${borderCard} ${cardBg}`}>
            <Dumbbell size={40} className="mx-auto mb-3 opacity-30" />
            <p className={`text-sm ${textSub}`}>این برنامه هیچ روز تمرینی ندارد</p>
          </div>
        )}
      </div>

      {substituteTarget && (
        <SubstituteModal
          exerciseId={substituteTarget.exerciseId}
          exerciseName={substituteTarget.exerciseName}
          onSelect={handleSubstituteSelect}
          onClose={() => setSubstituteTarget(null)}
        />
      )}

      {/* Phase 11c: Snackbar اطلاع هفته جدید */}
      {weekUpdate && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg"
        >
          {weekUpdate}
          <button
            type="button"
            className="mr-3 underline"
            onClick={() => setWeekUpdate(null)}
          >
            بستن
          </button>
        </div>
      )}
    </div>
  );
}
