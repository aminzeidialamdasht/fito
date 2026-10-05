/**
 * کارت گزارش ایمنی — فاز 4 (نسخه ساده و مقاوم)
 */
import { useState } from 'react';
import { AlertTriangle, ShieldCheck, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toPersianNumber } from '../utils/jalali';
import type { SafetyReport } from '../engine/types/injury';

interface Props {
  report: SafetyReport;
  onApplySubstitution?: (originalId: string, alternativeId: string) => void;
}

const INJURY_FA_LOCAL: Record<string, string> = {
  shoulder: 'شانه',
  lowerBack: 'کمر',
  upperBack: 'پشت بالایی',
  neck: 'گردن',
  knee: 'زانو',
  hip: 'لگن',
  hamstring: 'همسترینگ',
  quad: 'چهارسر',
  glute: 'سرینی',
  elbow: 'آرنج',
  wrist: 'مچ دست',
  ankle: 'مچ پا',
  biceps: 'جلوبازو',
  triceps: 'پشت‌بازو',
};

export default function SafetyReportCard({ report }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [expanded, setExpanded] = useState(false);

  if (!report || !report.activeInjuries || report.activeInjuries.length === 0) {
    return null;
  }

  let scoreText = '100';
  try {
    scoreText = toPersianNumber(report.score);
  } catch {
    scoreText = String(report.score);
  }

  const scoreNum = typeof report.score === 'number' ? report.score : 100;
  const scoreColor = scoreNum >= 80 ? 'emerald' : scoreNum >= 50 ? 'amber' : 'red';

  const bgClass = {
    emerald: isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200',
    amber: isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200',
    red: isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200',
  }[scoreColor];

  const textClass = {
    emerald: isDark ? 'text-emerald-400' : 'text-emerald-600',
    amber: isDark ? 'text-amber-400' : 'text-amber-600',
    red: isDark ? 'text-red-400' : 'text-red-600',
  }[scoreColor];

  const ScoreIcon = scoreNum >= 80 ? ShieldCheck : scoreNum >= 50 ? ShieldAlert : AlertTriangle;

  const injuryNames = report.activeInjuries
    .map((i) => INJURY_FA_LOCAL[i] || i)
    .join('، ');

  return (
    <div className={`rounded-2xl border p-4 ${bgClass}`}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 text-right"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-white/10' : 'bg-white'}`}>
          <ScoreIcon className={`w-5 h-5 ${textClass}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              گزارش ایمنی برنامه
            </span>
            <span className={`text-xs font-black ${textClass}`}>
              {scoreText}/۱۰۰
            </span>
          </div>
          <div className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            آسیب‌های فعال: {injuryNames}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        ) : (
          <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        )}
      </button>

      {report.forbidden.length > 0 && (
        <div className="flex gap-2 mt-3">
          <div className={`flex-1 rounded-lg px-3 py-2 text-center ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
            <div className={`text-lg font-black ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              {report.forbidden.length}
            </div>
            <div className={`text-[10px] ${isDark ? 'text-red-300' : 'text-red-500'}`}>پرخطر</div>
          </div>
          <div className={`flex-1 rounded-lg px-3 py-2 text-center ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
            <div className={`text-lg font-black ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              {report.caution.length}
            </div>
            <div className={`text-[10px] ${isDark ? 'text-amber-300' : 'text-amber-500'}`}>احتیاط</div>
          </div>
        </div>
      )}

      {expanded && report.warnings.length > 0 && (
        <div className="mt-4 space-y-3">
          {report.warnings.map((w, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-3 text-xs leading-6 ${
                w.severity === 'error'
                  ? isDark ? 'bg-red-500/10 text-red-300' : 'bg-red-50 text-red-700'
                  : isDark ? 'bg-amber-500/10 text-amber-300' : 'bg-amber-50 text-amber-700'
              }`}
            >
              {w.messageFa}
            </div>
          ))}
        </div>
      )}

      {expanded && report.substitutions.length > 0 && (
        <div className="mt-3 space-y-2">
          <div className={`text-[11px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            جایگزین‌های پیشنهادی:
          </div>
          {report.substitutions.map((sub, idx) => (
            <div key={idx} className={`rounded-xl p-3 ${isDark ? 'bg-white/5' : 'bg-white'}`}>
              <div className={`text-xs font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {sub.alternativeName}
              </div>
              <div className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {sub.reasonFa}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
