import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export default function Switch({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
}: SwitchProps) {
  const { theme } = useTheme();
  const tokens = getTokens(theme === 'dark');

  const dims = size === 'sm'
    ? { w: 'w-9', h: 'h-5', thumb: 'h-4 w-4', translate: 'translate-x-4' }
    : { w: 'w-11', h: 'h-6', thumb: 'h-5 w-5', translate: 'translate-x-5' };

  return (
    <label
      className={`inline-flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex ${dims.w} ${dims.h} shrink-0 items-center rounded-full transition-colors`}
        style={{
          backgroundColor: checked ? tokens.accent : tokens.border,
        }}
      >
        <span
          className={`inline-block ${dims.thumb} transform rounded-full bg-white shadow-md transition-transform ${checked ? dims.translate : 'translate-x-0.5'}`}
        />
      </button>
      {label && (
        <span className="text-sm font-semibold" style={{ color: tokens.textMain }}>
          {label}
        </span>
      )}
    </label>
  );
}
