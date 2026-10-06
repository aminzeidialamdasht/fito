import { TrendingUp } from 'lucide-react';
import { getPeriodizationInfo } from '../../utils/programHelpers';
import { toPersianNumber } from '../../utils/jalali';
import { useTheme } from '../../context/ThemeContext';

type Props = { program: Parameters<typeof getPeriodizationInfo>[0] };

export default function PeriodizationCard({ program }: Props) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const info = getPeriodizationInfo(program);

  const meta = (program.metadata ?? {}) as Record<string, any>;
  const weeks = (meta.weeklyProgression ?? []) as Record<string, any>[];

  if (!weeks.length) return null;

  const current = info.week || 1;

  return (
    <section
      className={`rounded-2xl border p-4 ${
        dark
          ? 'border-white/10 bg-[#1e1b4b]/50 text-white'
          : 'border-violet-200/60 bg-violet-50/70 text-slate-900'
      }`}
    >
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <TrendingUp size={20} aria-hidden="true" />
        پیشرفت هفتگی
      </h2>

      <div className="space-y-3">
        {weeks.map((week, index) => {
          const number = week.week ?? index + 1;
          const active = number === current;
          const label = week.label ?? week.name ?? `هفته ${toPersianNumber(number)}`;
          const reps = week.reps ?? week.repRange ?? week.targetReps ?? '—';
          const rir = week.rir ?? week.targetRIR ?? '—';

          return (
            <div
              key={number}
              className={`rounded-xl border p-3 ${
                active ? 'border-amber-400/60 bg-amber-400/10' : 'border-current/10'
              }`}
            >
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-bold">
                  هفته {toPersianNumber(number)} · {label}
                </span>
                <span className="text-xs opacity-70">{active ? 'هفته جاری' : ''}</span>
              </div>
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-current/10">
                <div
                  className={`h-full rounded-full ${active ? 'bg-amber-400' : 'bg-violet-400'}`}
                  style={{ width: `${Math.min(100, (number / weeks.length) * 100)}%` }}
                />
              </div>
              <div className="text-xs opacity-75">
                {reps} تکرار · RIR {rir}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
