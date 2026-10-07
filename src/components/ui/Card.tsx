import type { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'soft' | 'glass';
  className?: string;
}

export default function Card({
  children,
  variant = 'default',
  className = '',
}: CardProps) {
  const { theme } = useTheme();
  const tokens = getTokens(theme === 'dark');

  const background =
    variant === 'soft' ? tokens.accentSoft :
    variant === 'glass' ? 'transparent' :
    tokens.surface;
  const shadow = variant === 'elevated' ? 'shadow-lg' : '';
  const glassClass =
    variant === 'glass'
      ? 'backdrop-blur-xl bg-white/5 border-white/10'
      : '';

  return (
    <div
      className={`rounded-2xl border p-4 ${shadow} ${glassClass} ${className}`}
      style={{ backgroundColor: background, borderColor: tokens.border }}
    >
      {children}
    </div>
  );
}
