import type { TrainingTechnique } from '../../engine/types/program';
import { getTechniqueInfo } from '../../utils/programHelpers';

interface TechniqueBadgeProps {
  technique?: TrainingTechnique;
  compact?: boolean;
}

const TECHNIQUE_COLORS: Record<Exclude<TrainingTechnique, 'straight'>, string> = {
  rpt: '#a78bfa',
  rest_pause: '#fb923c',
  myo_reps: '#60a5fa',
  drop_set: '#f87171',
  cluster: '#4ade80',
  super_giant: '#d4af37',
};

export default function TechniqueBadge({
  technique,
  compact = false,
}: TechniqueBadgeProps) {
  if (!technique || technique === 'straight') return null;

  const info = getTechniqueInfo(technique);
  const color = TECHNIQUE_COLORS[technique];

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold ${
        compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-1 text-[10px]'
      }`}
      style={{
        color,
        backgroundColor: `${color}20`,
        border: `1px solid ${color}50`,
      }}
      aria-label={`تکنیک: ${info.nameFa}`}
    >
      {info.nameFa}
    </span>
  );
}
