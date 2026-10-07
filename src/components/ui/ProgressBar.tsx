import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'accent' | 'gold' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  color = 'accent',
  size = 'md',
  showLabel = false,
  label,
  className = '',
}: ProgressBarProps) {
  const { theme } = useTheme();
  const tokens = getTokens(theme === 'dark');

  const colorMap = {
    accent: tokens.accent,
    gold: tokens.gold,
    success: tokens.success,
    warning: tokens.warning,
    danger: tokens.danger,
  };

  const c = colorMap[color];
  const percent = Math.max(0, Math.min(100, (value / max) * 100));

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span style={{ color: tokens.textSub }}>{label}</span>
          {showLabel && (
            <span className="font-bold" style={{ color: c }}>
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full ${heightClass}`}
        style={{ backgroundColor: tokens.border }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, backgroundColor: c }}
        />
      </div>
    </div>
  );
}
