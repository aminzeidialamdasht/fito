import type { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';

type BadgeColor =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'priority'
  | 'accessory';

interface BadgeProps {
  children: ReactNode;
  color?: BadgeColor;
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({
  children,
  color = 'neutral',
  size = 'md',
  className = '',
}: BadgeProps) {
  const { theme } = useTheme();
  const tokens = getTokens(theme === 'dark');

  const colorMap: Record<BadgeColor, string> = {
    success: tokens.success,
    warning: tokens.warning,
    danger: tokens.danger,
    info: tokens.info,
    neutral: tokens.textSub,
    priority: tokens.priority,
    accessory: tokens.accessory,
  };

  const c = colorMap[color];
  const sizeClass =
    size === 'sm' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-1 text-[10px]';

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold ${sizeClass} ${className}`}
      style={{
        ['--badge-color' as any]: c,
        color: 'var(--badge-color)',
        backgroundColor: 'color-mix(in srgb, var(--badge-color) 12%, transparent)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'color-mix(in srgb, var(--badge-color) 30%, transparent)',
      }}
    >
      {children}
    </span>
  );
}
