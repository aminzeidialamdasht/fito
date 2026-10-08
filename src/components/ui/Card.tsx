import type { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'soft' | 'glass' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
}: CardProps) {
  const { theme } = useTheme();
  const tokens = getTokens(theme === 'dark');

  const backgrounds: Record<string, string> = {
    default: tokens.surface,
    elevated: tokens.surfaceElevated,
    soft: tokens.accentSoft,
    glass: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
    outline: 'transparent',
  };

  const paddingClass = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  }[padding];

  const shadow =
    variant === 'elevated'
      ? theme === 'dark'
        ? 'shadow-lg shadow-black/30'
        : 'shadow-md shadow-violet-100'
      : '';

  const glassClass =
    variant === 'glass' ? 'backdrop-blur-xl' : '';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      className={`rounded-2xl border transition-all ${paddingClass} ${shadow} ${glassClass} ${
        onClick ? 'cursor-pointer active:scale-[0.98]' : ''
      } ${className}`}
      style={{
        backgroundColor: backgrounds[variant],
        borderColor: tokens.border,
      }}
    >
      {children}
    </div>
  );
}
