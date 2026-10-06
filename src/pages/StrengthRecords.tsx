import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Dumbbell, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { toPersianNumber } from '../utils/jalali';
import { soundEffects } from '../utils/sound';

type RecordKey = 'squat' | 'benchPress' | 'deadlift' | 'overheadPress' | 'barbellRow';
type RecordValue = { weight: string; reps: string };

const exercises: { key: RecordKey; label: string }[] = [
  { key: 'squat', label: 'اسکوات' },
  { key: 'benchPress', label: 'پرس سینه' },
  { key: 'deadlift', label: 'ددلیفت' },
  { key: 'overheadPress', label: 'پرس سرشانه' },
  { key: 'barbellRow', label: 'زیربغل هالتر' },
];

const emptyRecords = (): Record<RecordKey, RecordValue> => ({
  squat: { weight: '', reps: '' },
  benchPress: { weight: '', reps: '' },
  deadlift: { weight: '', reps: '' },
  overheadPress: { weight: '', reps: '' },
  barbellRow: { weight: '', reps: '' },
});

export default function StrengthRecords() {
  const navigate = useNavigate();
  const { activeProfile, saveProfile } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [records, setRecords] = useState<Record<RecordKey, RecordValue>>(() => {
    const existing = (activeProfile as any)?.strengthRecordsExtended ?? {};
    return exercises.reduce((result, { key }) => {
      const value = existing[key];
      result[key] = {
        weight: value?.weight?.toString() ?? '',
        reps: value?.reps?.toString() ?? '',
      };
      return result;
    }, emptyRecords());
  });

  const colors = {
    teal: isDark ? '#a78bfa' : '#8b5cf6',
    gold: isDark ? '#d4af37' : '#f59e0b',
    bg: isDark ? '#0f172a' : '#f8fafc',
    card: isDark ? 'bg-[#1e1b4b]/50 backdrop-blur-md' : 'bg-violet-50/70 backdrop-blur-md',
    text: isDark ? '#ffffff' : '#0f172a',
    sub: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? 'border-white/10' : 'border-violet-200/60',
  };

  const updateRecord = (key: RecordKey, field: keyof RecordValue, value: string) => {
    setRecords((current) => ({ ...current, [key]: { ...current[key], [field]: value } }));
  };

  const estimated = useMemo(() => (record: RecordValue) => {
    const weight = Number(record.weight);
    const reps = Number(record.reps);
    if (!weight || !reps || weight <= 0 || reps <= 0) return null;
    return weight * (1 + reps / 30);
  }, []);

  const handleSave = () => {
    if (!activeProfile) return;
    const strengthRecordsExtended = Object.fromEntries(
      exercises
        .filter(({ key }) => Number(records[key].weight) > 0 && Number(records[key].reps) > 0)
        .map(({ key }) => {
          const weight = Number(records[key].weight);
          const reps = Number(records[key].reps);
          return [key, { weight, reps, estimated1RM: weight * (1 + reps / 30) }];
        }),
    );
    saveProfile({
      ...(activeProfile as any),
      strengthRecordsExtended: {
        ...strengthRecordsExtended,
        lastUpdated: new Date().toISOString(),
      },
    } as any);
    soundEffects.playClick();
    navigate('/profile');
  };

  if (!activeProfile) {
    return (
      <main
        className="min-h-screen p-4"
        style={{ background: colors.bg, color: colors.text }}
      >
        ابتدا یک پروفایل فعال انتخاب کنید.
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen px-4 pb-28 pt-6" style={{ background: colors.bg, color: colors.text }}>
      <div className="mx-auto max-w-xl">
        <button
          onClick={() => navigate(-1)}
          aria-label="بازگشت"
          className="mb-5 flex min-h-[44px] items-center gap-2"
          style={{ color: colors.teal }}
        >
          <ArrowRight size={22} /> رکوردهای قدرت
        </button>

        <section className={`rounded-3xl border ${colors.border} ${colors.card} p-4 shadow-lg`}>
          <div className="mb-5 flex items-center gap-3">
            <Dumbbell size={24} style={{ color: colors.gold }} />
            <div>
              <h1 className="text-xl font-bold">رکوردهای قدرت</h1>
              <p style={{ color: colors.sub }}>1RM تخمینی با فرمول Epley</p>
            </div>
          </div>

          <div className="space-y-4">
            {exercises.map(({ key, label }) => {
              const oneRepMax = estimated(records[key]);
              return (
                <div key={key} className="rounded-2xl border border-white/10 p-3">
                  <h2 className="mb-3 font-semibold">{label}</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-sm" style={{ color: colors.sub }}>
                      وزنه (کیلوگرم)
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={records[key].weight}
                        onChange={(event) => updateRecord(key, 'weight', event.target.value)}
                        aria-label={`وزنه ${label}`}
                        className="mt-1 min-h-[44px] w-full rounded-xl border border-white/10 bg-black/10 px-3 text-base"
                      />
                    </label>
                    <label className="text-sm" style={{ color: colors.sub }}>
                      تکرار
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={records[key].reps}
                        onChange={(event) => updateRecord(key, 'reps', event.target.value)}
                        aria-label={`تکرار ${label}`}
                        className="mt-1 min-h-[44px] w-full rounded-xl border border-white/10 bg-black/10 px-3 text-base"
                      />
                    </label>
                  </div>
                  <p className="mt-3 text-sm" style={{ color: oneRepMax ? colors.gold : colors.sub }}>
                    {oneRepMax
                      ? `1RM تخمینی: ${toPersianNumber(oneRepMax.toFixed(1))} کیلوگرم`
                      : 'برای محاسبه، وزنه و تکرار را وارد کنید'}
                  </p>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleSave}
            className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl px-4 font-bold text-white"
            style={{ background: colors.teal }}
            aria-label="ذخیره رکوردهای قدرت"
          >
            <Save size={20} /> ذخیره رکوردها
          </button>
        </section>
      </div>
    </main>
  );
}
