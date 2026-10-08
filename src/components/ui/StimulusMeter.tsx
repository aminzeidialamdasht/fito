import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';
import { toPersianNumber } from '../../utils/jalali';

interface StimulusMeterProps {
  score: number; // 0-100
  rir?: number;
  label?: string;
  size?: number;
  className?: string;
}

export default function StimulusMeter({
  score,
  rir,
  label = 'محرک عضلانی',
  size = 96,
  className = '',
}: StimulusMeterProps) {
  const { theme } = useTheme();
  const tokens = getTokens(theme === 'dark');
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const color =
    clamped >= 80 ? tokens.success :
    clamped >= 55 ? tokens.gold :
    clamped >= 30 ? tokens.warning : tokens.danger;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={tokens.border}
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black" style={{ color }}>
            {toPersianNumber(Math.round(clamped))}
          </span>
          {rir !== undefined && (
            <span className="text-[10px] font-bold" style={{ color: tokens.textSub }}>
              RIR {toPersianNumber(rir)}
            </span>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs font-bold text-center" style={{ color: tokens.textSub }}>
        {label}
      </p>
    </div>
  );
}
