import { Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getTokens } from '../../styles/designTokens';
import { toPersianNumber } from '../../utils/jalali';

interface SafetyScoreCardProps {
  score: number; // 0-100
  riskLevel?: 'low' | 'medium' | 'high';
  notes?: string[];
  className?: string;
}

export default function SafetyScoreCard({
  score,
  riskLevel,
  notes = [],
  className = '',
}: SafetyScoreCardProps) {
  const { theme } = useTheme();
  const tokens = getTokens(theme === 'dark');
  const clamped = Math.max(0, Math.min(100, score));

  const level =
    riskLevel ||
    (clamped >= 80 ? 'low' : clamped >= 50 ? 'medium' : 'high');

  const config = {
    low: {
      color: tokens.success,
      icon: CheckCircle2,
      label: 'ایمن',
      bg: tokens.successSoft,
    },
    medium: {
      color: tokens.warning,
      icon: AlertTriangle,
      label: 'نیاز به توجه',
      bg: `${tokens.warning}22`,
    },
    high: {
      color: tokens.danger,
      icon: AlertTriangle,
      label: 'ریسک بالا',
      bg: `${tokens.danger}22`,
    },
  }[level];

  const Icon = config.icon;

  return (
    <div
      className={`rounded-2xl border p-4 ${className}`}
      style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: config.bg }}
        >
          <Icon size={22} style={{ color: config.color }} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold" style={{ color: tokens.textSub }}>
            امتیاز ایمنی تمرین
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black" style={{ color: config.color }}>
              {toPersianNumber(Math.round(clamped))}
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: config.bg, color: config.color }}
            >
              {config.label}
            </span>
          </div>
        </div>
        <Shield size={20} style={{ color: tokens.textMuted }} />
      </div>

      {notes.length > 0 && (
        <ul className="space-y-1.5 mt-2">
          {notes.map((note, i) => (
            <li
              key={i}
              className="text-xs flex items-start gap-2"
              style={{ color: tokens.textSub }}
            >
              <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: config.color }} />
              {note}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
