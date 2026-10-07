import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  unit?: string;
  disabled?: boolean;
}

export default function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  unit = '',
  disabled = false,
}: SliderProps) {
  const { theme } = useTheme();
  const tokens = getTokens(theme === 'dark');

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-bold" style={{ color: tokens.textSub }}>
            {label}
          </span>
          {showValue && (
            <span className="font-black" style={{ color: tokens.accent }}>
              {value}
              {unit}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none disabled:opacity-50"
        style={{
          background: `linear-gradient(to right, ${tokens.accent} 0%, ${tokens.accent} ${percent}%, ${tokens.border} ${percent}%, ${tokens.border} 100%)`,
        }}
      />
    </div>
  );
}
