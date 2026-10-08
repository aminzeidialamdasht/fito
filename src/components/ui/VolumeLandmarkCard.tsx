import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';
import { toPersianNumber } from '../../utils/jalali';

interface VolumeLandmarkCardProps {
  muscleName: string;
  currentVolume: number;
  mv: number;   // Maintenance Volume
  mev: number;  // Minimum Effective Volume
  mav: number;  // Maximum Adaptive Volume
  mrv: number;  // Maximum Recoverable Volume
  className?: string;
}

export default function VolumeLandmarkCard({
  muscleName,
  currentVolume,
  mv,
  mev,
  mav,
  mrv,
  className = '',
}: VolumeLandmarkCardProps) {
  const { theme } = useTheme();
  const tokens = getTokens(theme === 'dark');
  const max = Math.max(mrv * 1.1, currentVolume * 1.1, 1);

  const getPosition = (val: number) => Math.min(100, (val / max) * 100);

  const currentPos = getPosition(currentVolume);
  const zone =
    currentVolume < mev ? 'زیر مؤثر' :
    currentVolume < mav ? 'محدوده رشد' :
    currentVolume < mrv ? 'حداکثر' : 'فراتر از ریکاوری';

  const zoneColor =
    currentVolume < mev ? tokens.warning :
    currentVolume < mav ? tokens.success :
    currentVolume < mrv ? tokens.gold : tokens.danger;

  return (
    <div
      className={`rounded-2xl border p-4 ${className}`}
      style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-sm" style={{ color: tokens.textMain }}>
          {muscleName}
        </h4>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${zoneColor}22`, color: zoneColor }}
        >
          {zone}
        </span>
      </div>

      {/* Landmark bar */}
      <div className="relative h-3 rounded-full mb-2" style={{ backgroundColor: tokens.surfaceElevated }}>
        {/* Zones */}
        <div
          className="absolute top-0 bottom-0 rounded-l-full opacity-30"
          style={{ left: 0, width: `${getPosition(mev)}%`, backgroundColor: tokens.warning }}
        />
        <div
          className="absolute top-0 bottom-0 opacity-40"
          style={{
            left: `${getPosition(mev)}%`,
            width: `${getPosition(mav) - getPosition(mev)}%`,
            backgroundColor: tokens.success,
          }}
        />
        <div
          className="absolute top-0 bottom-0 opacity-30"
          style={{
            left: `${getPosition(mav)}%`,
            width: `${getPosition(mrv) - getPosition(mav)}%`,
            backgroundColor: tokens.gold,
          }}
        />

        {/* Current marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow"
          style={{ left: `calc(${currentPos}% - 7px)`, backgroundColor: zoneColor }}
        />
      </div>

      <div className="flex justify-between text-[10px]" style={{ color: tokens.textMuted }}>
        <span>MV {toPersianNumber(mv)}</span>
        <span>MEV {toPersianNumber(mev)}</span>
        <span>MAV {toPersianNumber(mav)}</span>
        <span>MRV {toPersianNumber(mrv)}</span>
      </div>

      <p className="mt-2 text-xs font-bold" style={{ color: tokens.textSub }}>
        حجم فعلی: <span style={{ color: tokens.textMain }}>{toPersianNumber(currentVolume)} ست</span>
      </p>
    </div>
  );
}
