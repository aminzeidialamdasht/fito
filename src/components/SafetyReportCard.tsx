/**
 * کارت گزارش ایمنی — فاز 4
 *
 * نمایش SafetyReport در ProgramDetail:
 *   - نمره ایمنی (0-100)
 *   - آسیب‌های فعال
 *   - حرکات ممنوعه (قرمز)
 *   - حرکات با احتیاط (زرد)
 *   - جایگزین‌های پیشنهادی
 */

import { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  ArrowRightLeft,
  HeartPulse,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toPersianNumber } from '../utils/jalali';
import type { SafetyReport } from '../engine/types/injury';
import { INJURY_FA } from '../engine/types/injury';

interface Props {
  report: SafetyReport;
  onApplySubstitution?: (originalId: string, alternativeId: string) => void;
}

export default function SafetyReportCard({ report, onApplySubstitution }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [expanded, setExpanded] = useState(false);

  // اگر کاربر آسیب ندارد → نمایش نده
  if (report.activeInjuries.length === 0) return null;

  const scoreColor =
    report.score >= 80
      ? 'emerald'
      : report.score >= 50
      ? 'amber'
      : 'red';

  const scoreBg = {
    emerald: isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200',
    amber: isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200',
    red: isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200',
  }[scoreColor];

  const scoreText = {
    emerald: isDark ? 'text-emerald-400' : 'text-emerald-600',
    amber: isDark ? 'text-amber-400' : 'text-amber-600',
    red: isDark ? 'text-red-400' : 'text-red-600',
  }[scoreColor];

  const ScoreIcon = report.score >= 80 ? ShieldCheck : report.score >= 50 ? ShieldAlert : AlertTriangle;

  const totalIssues = report.forbidden.length + report.caution.length;

  return (
    <div className={`rounded-2xl border p-4 ${scoreBg}`}>
      {/* هدر */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 text-right"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-white/10' : 'bg-white'}`}>
          <ScoreIcon className={`w-5 h-5 ${scoreText}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              گزارش ایمنی برنامه
            </span>
            <span className={`text-xs font-black ${scoreText}`}>
              {toPersianNumber(report.score)}/۱۰۰
            </span>
          </div>
          <div className={`text-[11px] mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            آسیب‌های فعال: {report.activeInjuries.map((i) => INJURY_FA[i]).join('، ')}
          </div>
        </div>
        {expanded ? (
          <ChevronUp className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        ) : (
          <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        )}
      </button>

      {/* خلاصه شمارشی */}
      {totalIssues > 0 && (
        <div className="flex gap-2 mt-3">
          {report.forbidden.length > 0 && (
            <div className={`flex-1 rounded-lg px-3 py-2 text-center ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
              <div className={`text-lg font-black ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                {toPersianNumber(report.forbidden.length)}
              </div>
              <div className={`text-[10px] ${isDark ? 'text-red-300' : 'text-red-500'}`}>پرخطر</div>
            </div>
          )}
          {report.caution.length > 0 && (
            <div className={`flex-1 rounded-lg px-3 py-2 text-center ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
              <div className={`text-lg font-black ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                {toPersianNumber(report.caution.length)}
              </div>
              <div className={`text-[10px] ${isDark ? 'text-amber-300' : 'text-amber-500'}`}>احتیاط</div>
            </div>
          )}
          {report.substitutions.length > 0 && (
            <div className={`flex-1 rounded-lg px-3 py-2 text-center ${isDark ? 'bg-violet-500/10' : 'bg-violet-50'}`}>
              <div className={`text-lg font-black ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                {toPersianNumber(report.substitutions.length)}
              </div>
              <div className={`text-[10px] ${isDark ? 'text-violet-300' : 'text-violet-500'}`}>جایگزین</div>
            </div>
          )}
        </div>
      )}

      {/* جزئیات */}
      {expanded && (
        <div className="mt-4 space-y-3">
          {/* هشدارها */}
          {report.warnings.map((w, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-3 text-xs leading-6 ${
                w.severity === 'error'
                  ? isDark ? 'bg-red-500/10 text-red-300' : 'bg-red-50 text-red-700'
                  : isDark ? 'bg-amber-500/10 text-amber-300' : 'bg-amber-50 text-amber-700'
              }`}
            >
              <div className="flex items-start gap-2">
                <HeartPulse className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{w.messageFa}</span>
              </div>
            </div>
          ))}

          {/* جایگزین‌ها */}
          {report.substitutions.length > 0 && (
            <div className="space-y-2">
              <div className={`text-[11px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                جایگزین‌های پیشنهادی:
              </div>
              {report.substitutions.map((sub, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-3 ${isDark ? 'bg-white/5' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {sub.originalName}
                    </span>
                    <ArrowRightLeft className={`w-3 h-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {sub.alternativeName}
                    </span>
                  </div>
                  <div className={`text-[10px] mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {sub.reasonFa}
                  </div>
                  {onApplySubstitution && (
                    <button
                      onClick={() => onApplySubstitution(sub.originalId, sub.alternativeId)}
                      className={`w-full py-2 rounded-lg text-xs font-bold ${
                        isDark
                          ? 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
                          : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                      }`}
                    >
                      اعمال جایگزینی
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
