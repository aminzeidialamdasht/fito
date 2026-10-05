/**
 * نمایش خلاصه حجم هفتگی (Effective Sets) برای هر عضله
 * نشان می‌دهد: MEV/MAV/MRV کجاست و کاربر الان کجاست
 */

import { useMemo } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { MuscleGroup } from '../engine/types/exercise';
import type { ExperienceLevel, Goal } from '../engine/types/program';
import { getTargetWeeklyVolume } from '../engine/data/rules/volumeRules';

interface VolumeSummaryProps {
  weeklyVolume: Partial<Record<MuscleGroup, number>>;
  experience: ExperienceLevel;
  goal: Goal;
  priorityMuscles?: string[];
  isDark?: boolean;
}

const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: 'سینه',
  upper_back: 'پشت میانی',
  lats: 'لت',
  lower_back: 'پایین پشت',
  traps: 'کول',
  front_delts: 'سرشانه جلو',
  side_delts: 'سرشانه کنار',
  rear_delts: 'سرشانه پشت',
  biceps: 'جلوبازو',
  triceps: 'پشت بازو',
  forearms: 'ساعد',
  quads: 'چهارسر',
  hamstrings: 'همسترینگ',
  glutes: 'سرینی',
  calves: 'ساق',
  abs: 'شکم',
  obliques: 'پهلو',
};

type Status = 'below' | 'optimal' | 'high' | 'too_high';

const STATUS_CONFIG: Record<Status, { color: string; label: string; icon: any }> = {
  below: { color: '#fbbf24', label: 'کمتر از حد بهینه', icon: AlertTriangle },
  optimal: { color: '#22c55e', label: 'بهینه', icon: CheckCircle2 },
  high: { color: '#fb923c', label: 'بالاتر از بهینه', icon: TrendingUp },
  too_high: { color: '#ef4444', label: 'بیش از حد', icon: AlertTriangle },
};

export default function VolumeSummary({
  weeklyVolume,
  experience,
  goal,
  priorityMuscles = [],
  isDark = true,
}: VolumeSummaryProps) {
  const textMain = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';
  const cardBg = isDark
    ? 'bg-[#1e1b4b]/50 backdrop-blur-md'
    : 'bg-white/70 backdrop-blur-md shadow-sm';
  const border = isDark ? 'border-white/10' : 'border-violet-200/60';
  const barBg = isDark ? 'bg-white/10' : 'bg-gray-200';

  // محاسبه وضعیت هر عضله
  const muscleStats = useMemo(() => {
    return (Object.keys(weeklyVolume) as MuscleGroup[])
      .filter((m) => (weeklyVolume[m] || 0) > 0)
      .map((muscle) => {
        const volume = weeklyVolume[muscle] || 0;
        const isPriority = priorityMuscles.includes(muscle);
        const target = getTargetWeeklyVolume(muscle, experience, goal, isPriority);

        let status: Status = 'optimal';
        if (volume < target.min) status = 'below';
        else if (volume > target.max) status = 'too_high';
        else if (volume > target.target * 1.15) status = 'high';

        return { muscle, volume, target, status };
      })
      .sort((a, b) => b.volume - a.volume);
  }, [weeklyVolume, experience, goal, priorityMuscles]);

  // آمار کلی
  const summary = useMemo(() => {
    const total = muscleStats.length;
    const optimal = muscleStats.filter((s) => s.status === 'optimal').length;
    const tooHigh = muscleStats.filter((s) => s.status === 'too_high').length;
    const below = muscleStats.filter((s) => s.status === 'below').length;
    return { total, optimal, tooHigh, below };
  }, [muscleStats]);

  if (muscleStats.length === 0) return null;

  return (
    <div className={`rounded-2xl p-4 border ${border} ${cardBg}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={18} className="text-violet-400" />
        <h3 className={`font-black text-sm ${textMain}`}>حجم هفتگی مؤثر</h3>
      </div>

      {/* Summary */}
      <div className="flex gap-3 mb-4 text-[10px]">
        <span className="flex items-center gap-1" style={{ color: '#22c55e' }}>
          <CheckCircle2 size={10} /> {summary.optimal} بهینه
        </span>
        {summary.below > 0 && (
          <span className="flex items-center gap-1" style={{ color: '#fbbf24' }}>
            <AlertTriangle size={10} /> {summary.below} کم
          </span>
        )}
        {summary.tooHigh > 0 && (
          <span className="flex items-center gap-1" style={{ color: '#ef4444' }}>
            <AlertTriangle size={10} /> {summary.tooHigh} زیاد
          </span>
        )}
      </div>

      {/* Muscles List */}
      <div className="space-y-2">
        {muscleStats.map(({ muscle, volume, target, status }) => {
          const config = STATUS_CONFIG[status];
          const Icon = config.icon;

          // درصد نوار (نسبت به MRV برای نمایش)
          const percent = Math.min((volume / target.max) * 100, 100);
          // موقعیت MEV/MAV/MRV روی نوار
          const mevPercent = Math.min((target.min / target.max) * 100, 100);

          return (
            <div key={muscle} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Icon size={11} style={{ color: config.color }} />
                  <span className={`font-bold ${textMain}`}>
                    {MUSCLE_LABELS[muscle]}
                  </span>
                </div>
                <span style={{ color: config.color }} className="font-bold">
                  {volume.toFixed(1)} / {target.target} ست
                </span>
              </div>

              {/* Progress bar */}
              <div className={`relative h-1.5 rounded-full overflow-hidden ${barBg}`}>
                {/* MEV marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-yellow-500/40"
                  style={{ left: `${mevPercent}%` }}
                />
                {/* Fill */}
                <div
                  className="absolute top-0 bottom-0 right-0 rounded-full transition-all"
                  style={{
                    width: `${percent}%`,
                    background: config.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className={`mt-4 pt-3 border-t ${border} flex items-center gap-2 text-[9px] ${textSub}`}>
        <Info size={10} />
        <span>
          علامت زرد میانی = MEV. ست‌ها به‌صورت Effective محاسبه می‌شوند (شامل عضلات ثانویه).
        </span>
      </div>
    </div>
  );
}
