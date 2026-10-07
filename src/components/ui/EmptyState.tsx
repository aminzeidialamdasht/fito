import type { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon, title, subtitle, action, className = '',
}: EmptyStateProps) {
  const { theme } = useTheme();
  const tokens = getTokens(theme === 'dark');

  return (
    <section
      aria-label={title}
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border p-6 text-center ${className}`}
      style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
    >
      {icon && (
        <div aria-hidden="true" style={{ color: tokens.accent }}>
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold" style={{ color: tokens.textMain }}>
        {title}
      </h3>
      {subtitle && (
        <p className="max-w-sm text-sm leading-6" style={{ color: tokens.textSub }}>
          {subtitle}
        </p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </section>
  );
}
