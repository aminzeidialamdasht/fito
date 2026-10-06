import { Target, BarChart3, CalendarDays, Clock } from 'lucide-react';
import { getSystemInfo } from '../../utils/programHelpers';
import { getGoalLabel, EXPERIENCE_LABELS } from '../../types';
import { useTheme } from '../../context/ThemeContext';

type Props = { program: Parameters<typeof getSystemInfo>[0] };

const splits: Record<string, string> = {
  full_body: 'کل بدن',
  upper_lower: 'بالاتنه / پایین‌تنه',
  push_pull_legs: 'پوش / پول / لگز',
  bro_split: 'برو اسپلیت',
  arnold_split: 'آرنولد اسپلیت',
  torso_limbs: 'تنه / اندام',
  push_pull: 'پرس / کشش',
  upper_lower_push_pull_legs: 'بالاتنه / پایین‌تنه / پرس / کشش / پا',
  ppl_ul_hybrid: 'PPL/UL ترکیبی',
};

export default function ProgramIdentityCard({ program }: Props) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const info = getSystemInfo(program);

  const p = program as typeof program & Record<string, any>;
  const meta = (p.metadata ?? {}) as Record<string, any>;

  const items = [
    [Target, '🎯 هدف', getGoalLabel(p.goal ?? meta.goal ?? ''), 'هدف برنامه'],
    [BarChart3, '📊 سطح', EXPERIENCE_LABELS[p.experience ?? ''] || '—', 'سطح تجربه'],
    [
      CalendarDays,
      '📅 روزها',
      `${p.trainingDays ?? p.trainingDaysPerWeek ?? p.days?.length ?? 0} روز/هفته`,
      'تعداد جلسات هفتگی',
    ],
    [Clock, '⏱️ مدت', `${p.durationWeeks ?? p.duration ?? 0} هفته`, 'مدت برنامه'],
  ] as const;

  return (
    <section
      className={`rounded-2xl border p-4 ${
        dark
          ? 'border-white/10 bg-[#1e1b4b]/50 text-white'
          : 'border-violet-200/60 bg-violet-50/70 text-slate-900'
      }`}
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold">{info?.nameFa || meta.systemNameFa || p.name}</h2>
        <p className="mt-1 text-sm opacity-70">{info?.summaryFa}</p>
        <p className="mt-1 text-xs opacity-60">
          {splits[p.splitType ?? meta.splitType] ?? p.splitType}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map(([Icon, label, value, sub]) => (
          <div className="rounded-xl border border-current/10 p-3" key={label}>
            <Icon size={18} className="mb-2 opacity-70" aria-hidden="true" />
            <div className="text-xs opacity-60">{label}</div>
            <div className="mt-1 text-sm font-bold">{value}</div>
            <div className="text-[10px] opacity-50">{sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
