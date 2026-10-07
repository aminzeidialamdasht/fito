/** کارت گزارش ایمنی برنامه */
import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toPersianNumber } from '../utils/jalali';
import type { SafetyReport } from '../engine/types/injury';
import { getTokens } from '../styles/designTokens';
import Card from './ui/Card';
import Badge from './ui/Badge';

interface Props {
  report: SafetyReport;
}

const INJURY_FA_LOCAL: Record<string, string> = {
  shoulder: 'شانه', lowerBack: 'کمر', upperBack: 'پشت بالایی',
  neck: 'گردن', knee: 'زانو', hip: 'لگن',
  hamstring: 'همسترینگ', quad: 'چهارسر', glute: 'سرینی',
  elbow: 'آرنج', wrist: 'مچ دست', ankle: 'مچ پا',
  biceps: 'جلوبازو', triceps: 'پشت‌بازو',
};

export default function SafetyReportCard({ report }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const tokens = getTokens(isDark);
  const [expanded, setExpanded] = useState(false);

  if (!report?.activeInjuries?.length) return null;

  const score = typeof report.score === 'number' ? report.score : 100;
  const scoreColor = score >= 80 ? tokens.success : score >= 50 ? tokens.warning : tokens.danger;
  const ScoreIcon = score >= 80 ? ShieldCheck : score >= 50 ? ShieldAlert : AlertTriangle;
  let scoreText: string;
  try {
    scoreText = toPersianNumber(score);
  } catch {
    scoreText = String(score);
  }
  const injuryNames = report.activeInjuries
    .map((injury) => INJURY_FA_LOCAL[injury] || injury)
    .join('، ');

  return (
    <Card className="space-y-3">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-label={expanded ? 'بستن جزئیات گزارش ایمنی' : 'نمایش جزئیات گزارش ایمنی'}
        aria-expanded={expanded}
        aria-controls="safety-report-details"
        className="flex min-h-[44px] w-full items-center gap-3 text-right"
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${scoreColor}20`, color: scoreColor }}
        >
          <ScoreIcon size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold" style={{ color: tokens.textMain }}>
              گزارش ایمنی برنامه
            </span>
            <Badge color={score >= 80 ? 'success' : score >= 50 ? 'warning' : 'danger'}>
              {scoreText}/۱۰۰
            </Badge>
          </span>
          <span className="mt-1 block text-xs" style={{ color: tokens.textSub }}>
            آسیب‌های فعال: {injuryNames}
          </span>
        </span>
        {expanded
          ? <ChevronUp size={18} style={{ color: tokens.textSub }} />
          : <ChevronDown size={18} style={{ color: tokens.textSub }} />}
      </button>

      <div className="flex flex-wrap gap-2" aria-label="خلاصه موارد ایمنی">
        <Badge color="danger">پرخطر: {report.forbidden.length}</Badge>
        <Badge color="warning">احتیاط: {report.caution.length}</Badge>
      </div>

      {expanded && (
        <div id="safety-report-details" className="space-y-3">
          {report.warnings.length > 0 && (
            <div className="space-y-2">
              {report.warnings.map((warning, index) => {
                const color = warning.severity === 'error' ? tokens.danger : tokens.warning;
                return (
                  <div
                    key={`${warning.messageFa}-${index}`}
                    className="rounded-xl p-3 text-xs leading-6"
                    style={{ color, backgroundColor: `${color}18` }}
                  >
                    {warning.messageFa}
                  </div>
                );
              })}
            </div>
          )}

          {report.substitutions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold" style={{ color: tokens.textSub }}>
                جایگزین‌های پیشنهادی
              </h4>
              {report.substitutions.map((substitution, index) => (
                <Card
                  key={`${substitution.alternativeName}-${index}`}
                  variant="soft"
                  className="p-3"
                >
                  <p className="mb-1 text-sm font-bold" style={{ color: tokens.textMain }}>
                    {substitution.alternativeName}
                  </p>
                  <p className="text-xs leading-5" style={{ color: tokens.textSub }}>
                    {substitution.reasonFa}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
