import type { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'soft';
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
    variant === 'soft' ? tokens.accentSoft : tokens.surface;
  const shadow = variant === 'elevated' ? 'shadow-lg' : '';

  return (
    <div
      className={`rounded-2xl border p-4 ${shadow} ${className}`}
      style={{ backgroundColor: background, borderColor: tokens.border }}
    >
      {children}
    </div>
  );
}
