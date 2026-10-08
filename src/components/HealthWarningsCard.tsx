import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getTokens } from '../styles/designTokens';
import Card from './ui/Card';
import Badge from './ui/Badge';
import type { HealthWarning } from '../engine/types/injury';

interface HealthWarningsCardProps {
  warnings: HealthWarning[];
}

export default function HealthWarningsCard({ warnings }: HealthWarningsCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const tokens = getTokens(isDark);

  if (!warnings || warnings.length === 0) return null;

  const getIcon = (severity: HealthWarning['severity']) => {
    switch (severity) {
      case 'danger': return <AlertCircle size={16} />;
      case 'caution': return <AlertTriangle size={16} />;
      default: return <Info size={16} />;
    }
  };

  const getColor = (severity: HealthWarning['severity']) => {
    switch (severity) {
      case 'danger': return tokens.danger;
      case 'caution': return tokens.warning;
      default: return tokens.info;
    }
  };

  const getBadgeColor = (severity: HealthWarning['severity']): 'danger' | 'warning' | 'info' => {
    switch (severity) {
      case 'danger': return 'danger';
      case 'caution': return 'warning';
      default: return 'info';
    }
  };

  const getLabel = (severity: HealthWarning['severity']) => {
    switch (severity) {
      case 'danger': return 'هشدار';
      case 'caution': return 'احتیاط';
      default: return 'اطلاع';
    }
  };

  return (
    <Card variant="elevated">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: tokens.surfaceElevated, color: tokens.warning }}
        >
          <AlertTriangle size={18} />
        </div>
        <div>
          <h3 className="font-bold text-sm" style={{ color: tokens.textMain }}>
            هشدارهای سلامت
          </h3>
          <p className="text-[10px]" style={{ color: tokens.textSub }}>
            {warnings.length} هشدار برای شرایط شما
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {warnings.map((w) => {
          const color = getColor(w.severity);
          return (
            <div
              key={w.id}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{
                background: tokens.surfaceElevated,
                borderRight: `3px solid ${color}`,
              }}
            >
              <div style={{ color, marginTop: '2px' }}>
                {getIcon(w.severity)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge color={getBadgeColor(w.severity)} size="sm">
                    {getLabel(w.severity)}
                  </Badge>
                </div>
                <p className="text-xs leading-5" style={{ color: tokens.textMain }}>
                  {w.messageFa}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
