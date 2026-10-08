import { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import type { MuscleGroup } from '../engine/types/exercise';
import type { ExperienceLevel, Goal } from '../engine/types/program';
import { getTargetWeeklyVolume } from '../engine/data/rules/volumeRules';
import { useTheme } from '../context/ThemeContext';
import { getTokens } from '../styles/designTokens';
import { toPersianNumber } from '../utils/jalali';
import Card from './ui/Card';
import Badge from './ui/Badge';
import VolumeLandmarkCard from './ui/VolumeLandmarkCard';

interface VolumeLandmarksSectionProps {
  weeklyVolume: Partial<Record<MuscleGroup, number>>;
  experience: ExperienceLevel;
  goal: Goal;
  priorityMuscles?: string[];
}

const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: 'سینه', upper_back: 'پشت میانی', lats: 'لت', lower_back: 'پایین پشت',
  traps: 'کول', front_delts: 'سرشانه جلو', side_delts: 'سرشانه کنار',
  rear_delts: 'سرشانه پشت', biceps: 'جلوبازو', triceps: 'پشت بازو',
  forearms: 'ساعد', quads: 'چهارسر', hamstrings: 'همسترینگ',
  glutes: 'سرینی', calves: 'ساق', abs: 'شکم', obliques: 'پهلو',
};

export default function VolumeLandmarksSection({
  weeklyVolume,
  experience,
  goal,
  priorityMuscles = [],
}: VolumeLandmarksSectionProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const tokens = getTokens(isDark);

  const muscles = useMemo(() => {
    return (Object.keys(MUSCLE_LABELS) as MuscleGroup[])
      .filter((m) => (weeklyVolume[m] || 0) > 0)
      .map((m) => {
        const currentVolume = weeklyVolume[m] || 0;
        const isPriority = priorityMuscles.includes(m);
        const target = getTargetWeeklyVolume(m, experience, goal, isPriority);
        const base = getTargetWeeklyVolume(m, 'intermediate', goal, false);
        return {
          muscle: m,
          label: MUSCLE_LABELS[m],
          currentVolume,
          mv: 0,
          mev: target.min,
          mav: target.target,
          mrv: target.max,
        };
      })
      .sort((a, b) => b.currentVolume - a.currentVolume);
  }, [weeklyVolume, experience, goal, priorityMuscles]);

  if (muscles.length === 0) return null;

  return (
    <Card variant="elevated">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: tokens.surfaceElevated, color: tokens.volume }}
        >
          <BarChart3 size={18} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm" style={{ color: tokens.textMain }}>
            محدوده حجم (Volume Landmarks)
          </h3>
          <p className="text-[10px]" style={{ color: tokens.textSub }}>
            بر اساس اصول Israetel - {toPersianNumber(muscles.length)} عضله
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {muscles.map((m) => (
          <VolumeLandmarkCard
            key={m.muscle}
            muscleName={m.label}
            currentVolume={m.currentVolume}
            mv={m.mv}
            mev={m.mev}
            mav={m.mav}
            mrv={m.mrv}
          />
        ))}
      </div>

      <p className="text-[10px] mt-3 text-center" style={{ color: tokens.textMuted }}>
        MV: نگهداری · MEV: حداقل مؤثر · MAV: حداکثر تطبیقی · MRV: حداکثر قابل بازیابی
      </p>
    </Card>
  );
}
