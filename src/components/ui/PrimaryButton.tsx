import type { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';

interface PrimaryButtonProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: 'accent' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

export default function PrimaryButton({
  onClick,
  children,
  variant = 'accent',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  ariaLabel,
}: PrimaryButtonProps) {
  const { theme } = useTheme();
  const tokens = getTokens(theme === 'dark');

  const bg = variant === 'gold' ? tokens.gold : tokens.accent;
  const fg = variant === 'gold' ? '#0f172a' : '#ffffff';

  const sizeClass = {
    sm: 'py-2 px-3 text-xs',
    md: 'py-2.5 px-4 text-sm',
    lg: 'py-3.5 px-6 text-base',
  }[size];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`rounded-xl font-bold min-h-[44px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 ${sizeClass} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      style={{ backgroundColor: bg, color: fg }}
    >
      {children}
    </button>
  );
}
