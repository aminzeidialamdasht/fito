import { useMemo } from 'react';
import { Calendar, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getTokens } from '../styles/designTokens';
import { toPersianNumber } from '../utils/jalali';
import {
  calculateOptimalTrainingDays,
  type TrainingDaysRecommendation,
} from '../engine/core/trainingDaysCalculator';
import type { AthleteProfile } from '../types';

interface TrainingDaysSelectorProps {
  profile: Partial<AthleteProfile>;
  value?: number;
  onChange: (value: number) => void;
}

export default function TrainingDaysSelector({
  profile,
  value,
  onChange,
}: TrainingDaysSelectorProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const tokens = getTokens(isDark);

  const recommendation: TrainingDaysRecommendation = useMemo(
    () => calculateOptimalTrainingDays(profile),
    [profile]
  );

  // اگه value نداشت، از recommended استفاده کن
  const effectiveValue = typeof value === 'number' ? value : recommendation.recommended;

  const options = useMemo(() => {
    const list: number[] = [];
    for (let d = recommendation.min; d <= recommendation.max; d++) {
      list.push(d);
    }
    return list;
  }, [recommendation]);

  const isValid = effectiveValue >= recommendation.min && effectiveValue <= recommendation.max;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Calendar size={16} style={{ color: tokens.accent }} />
        <label className="text-sm font-bold" style={{ color: tokens.textMain }}>
          روزهای تمرین در هفته
        </label>
      </div>

      {/* Recommendation */}
      <div
        className="rounded-xl p-3 flex items-start gap-2"
        style={{ background: tokens.accentSoft }}
      >
        <Info size={14} style={{ color: tokens.accent, marginTop: '2px' }} />
        <div className="flex-1">
          <p className="text-xs font-bold" style={{ color: tokens.accent }}>
            بازه پیشنهادی: {toPersianNumber(recommendation.min)} تا {toPersianNumber(recommendation.max)} روز
          </p>
          <p className="text-[11px] mt-1 leading-5" style={{ color: tokens.textSub }}>
            {recommendation.reason}
          </p>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option === effectiveValue;
          const isRecommended = option === recommendation.recommended;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className="relative flex-1 min-w-[60px] min-h-[44px] rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{
                backgroundColor: isSelected ? tokens.accent : tokens.surface,
                color: isSelected ? '#ffffff' : tokens.textMain,
                border: `2px solid ${isSelected ? tokens.accent : tokens.border}`,
              }}
            >
              {toPersianNumber(option)} روز
              {isRecommended && (
                <span
                  className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                  style={{
                    backgroundColor: tokens.gold,
                    color: '#0f172a',
                  }}
                >
                  پیشنهاد
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Validation */}
      {!isValid && (
        <p className="text-xs font-semibold" style={{ color: tokens.danger }}>
          لطفاً یکی از گزینه‌های بالا رو انتخاب کنید.
        </p>
      )}
    </div>
  );
}
