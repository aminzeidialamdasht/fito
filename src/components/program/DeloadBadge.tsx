import { AlertTriangle } from 'lucide-react';
import { getDeloadInfo } from '../../utils/programHelpers';
import { useTheme } from '../../context/ThemeContext';

type Props = { program: Parameters<typeof getDeloadInfo>[0] };

const descriptions = {
  light: 'کاهش ۱۵٪ حجم برای ریکاوری',
  medium: 'کاهش ۳۰٪ حجم + RIR بالاتر',
  heavy: 'کاهش ۵۰٪ حجم — هفته بازیابی',
} as const;

export default function DeloadBadge({ program }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const info = getDeloadInfo(program);
  if (info.level === 'none') return null;

  const color = isDark
    ? 'border-amber-400/30 bg-amber-400/10 text-amber-300'
    : 'border-amber-500/30 bg-amber-50 text-amber-700';

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${color}`}
      role="status"
      aria-label={`${info.labelFa}: ${descriptions[info.level]}`}
    >
      <AlertTriangle size={18} aria-hidden="true" />
      <div>
        <div className="text-sm font-bold">{info.labelFa}</div>
        <div className="text-xs opacity-80">{descriptions[info.level]}</div>
      </div>
    </div>
  );
}
