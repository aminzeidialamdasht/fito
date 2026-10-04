import { useEffect, useMemo, useState } from 'react';
import { X, Shield, ShieldOff, Check, Info, AlertTriangle, Ban } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { soundEffects } from '../utils/sound';
import { toPersianNumber } from '../utils/jalali';
import { ALL_EXERCISES, getExerciseById } from '../engine/data/exercises';
import { findSubstitutes } from '../engine/core/substitutionEngine';
import {
  profileToEquipment,
  profileToInjuries,
  isAvoided,
} from '../engine/core/profileToEquipment';
import type { SubstituteCandidate } from '../engine/types/exercise';

interface SubstituteModalProps {
  exerciseId: string;
  exerciseName: string;
  onSelect: (newExerciseId: string, newExerciseName: string) => void;
  onClose: () => void;
}

export default function SubstituteModal({
  exerciseId,
  exerciseName,
  onSelect,
  onClose,
}: SubstituteModalProps) {
  const { activeProfile, saveProfile } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [showOnlySafe, setShowOnlySafe] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const teal = isDark ? '#a78bfa' : '#8b5cf6';
  const gold = isDark ? '#d4af37' : '#f59e0b';
  const bgCard = isDark ? '#1e293b' : '#ffffff';
  const bgMain = isDark ? '#0f172a' : '#f8fafc';
  const textMain = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';
  const border = isDark ? 'border-white/10' : 'border-gray-200';

  const source = useMemo(() => getExerciseById(exerciseId), [exerciseId]);
  const availableEquipment = useMemo(() => profileToEquipment(activeProfile), [activeProfile]);
  const injuries = useMemo(() => profileToInjuries(activeProfile), [activeProfile]);

  const candidates: SubstituteCandidate[] = useMemo(() => {
    if (!source) return [];
    return findSubstitutes(source, ALL_EXERCISES, {
      availableEquipment,
      injuries: showOnlySafe ? injuries : undefined,
      maxResults: 12,
      excludeIds: activeProfile?.avoidedExercises ?? [],
    });
  }, [source, availableEquipment, injuries, showOnlySafe, activeProfile]);

  // بستن با Esc
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSelect = (candidate: SubstituteCandidate) => {
    soundEffects.playClick();
    setSelectedId(candidate.exercise.id);
    onSelect(candidate.exercise.id, candidate.exercise.name);
  };

  const handleAvoid = () => {
    if (!activeProfile) return;
    soundEffects.playClick();

    const current = activeProfile.avoidedExercises ?? [];
    const isAlreadyAvoided = current.includes(exerciseId);
    const updated = isAlreadyAvoided
      ? current.filter((id) => id !== exerciseId)
      : [...current, exerciseId];

    saveProfile({
      ...activeProfile,
      avoidedExercises: updated,
    });
  };

  const alreadyAvoided = isAvoided(activeProfile, exerciseId);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`w-full sm:max-w-lg max-h-[90vh] overflow-hidden rounded-t-3xl sm:rounded-3xl border ${border} flex flex-col`}
        style={{ background: bgCard }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 border-b ${border} flex items-start gap-3`}>
          <div className="flex-1 min-w-0">
            <h2 className={`font-black text-base ${textMain}`}>تغییر حرکت</h2>
            <p className={`text-xs ${textSub} mt-1 truncate`}>
              جایگزین برای: {exerciseName}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
          >
            <X size={20} className={textMain} />
          </button>
        </div>

        {/* Toggle safety */}
        <div className={`px-4 py-3 border-b ${border} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            {showOnlySafe ? (
              <Shield size={16} style={{ color: teal }} />
            ) : (
              <ShieldOff size={16} style={{ color: textSub }} />
            )}
            <span className={`text-xs font-bold ${textMain}`}>
              فقط حرکات امن برای آسیب‌های من
            </span>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              setShowOnlySafe((v) => !v);
            }}
            className={`relative w-11 h-6 rounded-full transition-colors ${showOnlySafe ? '' : 'opacity-40'}`}
            style={{ background: showOnlySafe ? teal : (isDark ? '#334155' : '#cbd5e1') }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
              style={{ right: showOnlySafe ? '2px' : '22px' }}
            />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {!source && (
            <div className={`text-center py-8 ${textSub}`}>
              <AlertTriangle size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">اطلاعات حرکت پیدا نشد</p>
            </div>
          )}

          {source && candidates.length === 0 && (
            <div className={`text-center py-8 ${textSub}`}>
              <Info size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">هیچ جایگزین مناسبی یافت نشد</p>
              <p className="text-xs mt-2 opacity-70">
                {showOnlySafe
                  ? 'شاید با غیرفعال کردن فیلتر ایمنی، گزینه‌های بیشتری ببینی'
                  : 'تجهیزات باشگاه شما محدود است'}
              </p>
            </div>
          )}

          {candidates.map((c, idx) => {
            const isSelected = selectedId === c.exercise.id;
            const primaryEq = c.exercise.equipmentDetails?.primary ?? c.exercise.equipment[0];

            return (
              <button
                key={c.exercise.id}
                onClick={() => handleSelect(c)}
                disabled={isSelected}
                className={`w-full text-right p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-2'
                    : isDark
                    ? 'border-white/5 hover:border-white/20 hover:bg-white/5'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                style={
                  isSelected
                    ? { borderColor: teal, background: `${teal}15` }
                    : undefined
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black ${
                      isSelected ? 'text-white' : isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                    style={isSelected ? { background: teal } : undefined}
                  >
                    {isSelected ? <Check size={16} /> : toPersianNumber(idx + 1)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-sm font-bold ${textMain}`}>{c.exercise.name}</h3>
                      {idx === 0 && !isSelected && (
                        <span
                          className="text-[9px] font-black px-1.5 py-0.5 rounded"
                          style={{ background: `${gold}25`, color: gold }}
                        >
                          بهترین
                        </span>
                      )}
                    </div>

                    <p className={`text-[10px] ${textSub} mt-0.5`}>
                      {c.exercise.englishName}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: `${teal}20`, color: teal }}
                      >
                        {primaryEq}
                      </span>
                      <span className={`text-[9px] ${textSub}`}>
                        امتیاز: {toPersianNumber(c.score)}
                      </span>
                    </div>

                    {c.reasons.length > 0 && (
                      <p className={`text-[9px] ${textSub} mt-1.5 leading-4`}>
                        {c.reasons.slice(0, 3).join(' • ')}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer: Avoid button */}
        <div className={`p-4 border-t ${border} flex items-center gap-2`}>
          <button
            onClick={handleAvoid}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              alreadyAvoided
                ? isDark
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
                : isDark
                ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Ban size={14} />
            {alreadyAvoided
              ? 'حذف از لیست اجتناب (بازگردانی)'
              : 'این دستگاه را ندارم (حذف دائمی)'}
          </button>
        </div>
      </div>
    </div>
  );
}
