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
  type?: 'button' | 'submit' | 'reset';
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
  type = 'button',
}: PrimaryButtonProps) {
  const { theme } = useTheme();
  const tokens = getTokens(theme === 'dark');

  const variantStyles: Record<
    string,
    { bg: string; fg: string; extra?: string; border?: string }
  > = {
    accent: {
      bg: tokens.accentStrong || tokens.accent,
      fg: '#ffffff',
    },
    gold: {
      bg: tokens.gold,
      fg: theme === 'dark' ? '#0B0F1A' : '#0F172A',
    },
    danger: {
      bg: tokens.danger,
      fg: '#ffffff',
    },
    success: {
      bg: tokens.success,
      fg: theme === 'dark' ? '#0B0F1A' : '#ffffff',
    },
    outline: {
      bg: 'transparent',
      fg: tokens.accent,
      extra: 'border-2',
      border: tokens.accent,
    },
    ghost: {
      bg: 'transparent',
      fg: tokens.textMain,
      extra: 'hover:bg-white/5',
    },
  };

  const vs = variantStyles[variant] || variantStyles.accent;

  const sizeClass = {
    sm: 'py-2 px-3 text-xs rounded-xl',
    md: 'py-2.5 px-4 text-sm rounded-xl',
    lg: 'py-3.5 px-6 text-base rounded-2xl',
  }[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`font-bold min-h-[44px] flex items-center justify-center gap-2 active:scale-[0.97] transition-all disabled:opacity-50 disabled:active:scale-100 ${sizeClass} ${
        vs.extra || ''
      } ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{
        backgroundColor: vs.bg,
        color: vs.fg,
        ...(vs.border ? { borderColor: vs.border } : {}),
      }}
    >
      {children}
    </button>
  );
}
