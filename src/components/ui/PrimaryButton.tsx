import type { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';

interface PrimaryButtonProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: 'accent' | 'gold' | 'danger' | 'success' | 'outline' | 'ghost';
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

  const variantStyles: Record<string, { bg: string; fg: string; extra?: string }> = {
    accent:  { bg: tokens.accent,  fg: '#ffffff' },
    gold:    { bg: tokens.gold,    fg: '#0f172a' },
    danger:  { bg: tokens.danger,  fg: '#ffffff' },
    success: { bg: tokens.success, fg: '#0f172a' },
    outline: { bg: 'transparent',  fg: tokens.accent, extra: 'border-2' },
    ghost:   { bg: 'transparent',  fg: tokens.textMain, extra: 'hover:bg-white/5' },
  };
  const vs = variantStyles[variant] || variantStyles.accent;
  const bg = vs.bg;
  const fg = vs.fg;
  const extraClass = vs.extra || '';

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
      className={`rounded-xl font-bold min-h-[44px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 ${sizeClass} ${extraClass} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      style={{ backgroundColor: bg, color: fg, ...(variant === 'outline' ? { borderColor: tokens.accent } : {}) }}
    >
      {children}
    </button>
  );
}
