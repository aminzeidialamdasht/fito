/** خلاصه حجم هفتگی مؤثر برای هر عضله */
import { useMemo } from 'react';
import { Info, TrendingUp } from 'lucide-react';
import type { MuscleGroup } from '../engine/types/exercise';
import type { ExperienceLevel, Goal } from '../engine/types/program';
import { getTargetWeeklyVolume } from '../engine/data/rules/volumeRules';
import { getTokens } from '../styles/designTokens';
import Card from './ui/Card';
import Badge from './ui/Badge';
import SectionHeader from './ui/SectionHeader';

interface VolumeSummaryProps {
  weeklyVolume: Partial<Record<MuscleGroup, number>>;
  experience: ExperienceLevel;
  goal: Goal;
  priorityMuscles?: string[];
  accessoryMuscles?: string[];
  isDark?: boolean;
}

const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: 'سینه', upper_back: 'پشت میانی', lats: 'لت', lower_back: 'پایین پشت',
  traps: 'کول', front_delts: 'سرشانه جلو', side_delts: 'سرشانه کنار',
  rear_delts: 'سرشانه پشت', biceps: 'جلوبازو', triceps: 'پشت بازو',
  forearms: 'ساعد', quads: 'چهارسر', hamstrings: 'همسترینگ',
  glutes: 'سرینی', calves: 'ساق', abs: 'شکم', obliques: 'پهلو',
};

const ACCESSORY_MUSCLES = [
  'calves', 'forearms', 'traps', 'abs', 'obliques',
  'lower_back', 'side_delts', 'rear_delts',
];

type Status = 'below' | 'optimal' | 'high' | 'too_high';

export default function VolumeSummary({
  weeklyVolume, experience, goal, priorityMuscles = [],
  accessoryMuscles = ACCESSORY_MUSCLES, isDark = true,
}: VolumeSummaryProps) {
  const tokens = getTokens(isDark);
  const muscleStats = useMemo(() => (
    (Object.keys(weeklyVolume) as MuscleGroup[])
      .filter((muscle) => (weeklyVolume[muscle] || 0) > 0)
      .map((muscle) => {
        const volume = weeklyVolume[muscle] || 0;
        const isPriority = priorityMuscles.includes(muscle);
        const target = getTargetWeeklyVolume(muscle, experience, goal, isPriority);
        let status: Status = 'optimal';
        if (volume < target.min) status = 'below';
        else if (volume > target.max) status = 'too_high';
        else if (volume > target.target * 1.15) status = 'high';
        return { muscle, volume, target, status, isPriority };
      })
      .sort((a, b) => b.volume - a.volume)
  ), [weeklyVolume, experience, goal, priorityMuscles]);

  if (!muscleStats.length) return null;

  const counts = {
    optimal: muscleStats.filter((item) => item.status === 'optimal').length,
    below: muscleStats.filter((item) => item.status === 'below').length,
    tooHigh: muscleStats.filter((item) => item.status === 'too_high').length,
  };
  const statusColor: Record<Status, string> = {
    below: tokens.warning, optimal: tokens.success,
    high: tokens.warning, too_high: tokens.danger,
  };

  return (
    <Card>
      <SectionHeader icon={<TrendingUp size={18} />} title="حجم هفتگی مؤثر" />
      <div className="flex flex-wrap gap-2 my-3">
        <Badge color="success">{counts.optimal} بهینه</Badge>
        {counts.below > 0 && <Badge color="warning">{counts.below} کم</Badge>}
        {counts.tooHigh > 0 && <Badge color="danger">{counts.tooHigh} زیاد</Badge>}
      </div>

      <div className="space-y-3">
        {muscleStats.map(({ muscle, volume, target, status, isPriority }) => {
          const isAccessory = accessoryMuscles.includes(muscle);
          const color = isPriority ? tokens.priority
            : isAccessory ? tokens.accessory : statusColor[status];
          const percent = Math.min((volume / target.max) * 100, 100);
          const mevPercent = Math.min((target.min / target.max) * 100, 100);
          return (
            <div key={muscle} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold" style={{ color: tokens.textMain }}>
                    {MUSCLE_LABELS[muscle]}
                  </span>
                  {isPriority && <Badge color="priority" size="sm">اولویت</Badge>}
                  {!isPriority && isAccessory && <Badge color="accessory" size="sm">فرعی</Badge>}
                </div>
                <span className="font-bold whitespace-nowrap" style={{ color }}>
                  {volume.toFixed(1)} / {target.target} ست
                </span>
              </div>
              <div
                className="relative h-2 overflow-hidden rounded-full"
                style={{ backgroundColor: tokens.border }}
                role="img"
                aria-label={`${MUSCLE_LABELS[muscle]}: ${volume} از هدف ${target.target} ست`}
              >
                <div className="absolute inset-y-0 w-0.5" style={{ right: `${mevPercent}%`, backgroundColor: tokens.warning }} />
                <div className="absolute inset-y-0 right-0 rounded-full transition-all" style={{ width: `${percent}%`, backgroundColor: color }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 pt-3 border-t text-xs" style={{ borderColor: tokens.border, color: tokens.textSub }}>
        <span><i className="inline-block w-2.5 h-2.5 rounded-full ml-1" style={{ backgroundColor: tokens.priority }} />اولویت‌دار</span>
        <span><i className="inline-block w-2.5 h-2.5 rounded-full ml-1" style={{ backgroundColor: tokens.accessory }} />عضله فرعی</span>
        <span><i className="inline-block w-2.5 h-2.5 rounded-full ml-1" style={{ backgroundColor: tokens.success }} />عادی</span>
        <span className="flex items-center gap-1"><Info size={12} />خط زرد = MEV؛ ست‌ها شامل عضلات ثانویه‌اند.</span>
      </div>
    </Card>
  );
}
