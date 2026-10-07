import type { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';

interface SectionHeaderProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export default function SectionHeader({
  icon,
  title,
  subtitle,
  action,
  className = '',
}: SectionHeaderProps) {
  const { theme } = useTheme();
  const tokens = getTokens(theme === 'dark');

  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2 min-w-0">
        {icon && (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: tokens.accentSoft, color: tokens.accent }}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-black text-sm truncate" style={{ color: tokens.textMain }}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] mt-0.5 truncate" style={{ color: tokens.textSub }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
