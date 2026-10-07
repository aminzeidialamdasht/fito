import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Dumbbell, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { toPersianNumber } from '../utils/jalali';
import { soundEffects } from '../utils/sound';
import { getTokens } from '../styles/designTokens';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import PrimaryButton from '../components/ui/PrimaryButton';
import EmptyState from '../components/ui/EmptyState';
import Toast from '../components/ui/Toast';

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

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
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

  const tokens = getTokens(isDark);

  const colors = {
    teal: tokens.accent,
    gold: tokens.gold,
    bg: tokens.bg,
    card: '',
    text: tokens.textMain,
    sub: tokens.textSub,
    border: '',
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
    setToastMessage('رکوردها با موفقیت ذخیره شد');
    setShowToast(true);
    setTimeout(() => navigate('/profile'), 1500);
  };

  if (!activeProfile) {
    return (
      <main className="min-h-screen p-4 flex items-center justify-center">
        <EmptyState
          icon={<Dumbbell size={48} />}
          title="پروفایل فعالی انتخاب نشده"
          subtitle="ابتدا یک پروفایل فعال انتخاب کنید."
          action={
            <PrimaryButton variant="accent" onClick={() => navigate('/profile')}>
              رفتن به پروفایل‌ها
            </PrimaryButton>
          }
        />
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

        <Card variant="elevated" className="p-4">
          <div className="mb-5 flex items-center gap-3">
            <Dumbbell size={24} style={{ color: tokens.gold }} />
            <div>
              <h1 className="text-xl font-bold">رکوردهای قدرت</h1>
              <p style={{ color: tokens.textSub }}>1RM تخمینی با فرمول Epley</p>
            </div>
          </div>

          <div className="space-y-4">
            {exercises.map(({ key, label }) => {
              const oneRepMax = estimated(records[key]);
              return (
                <Card key={key} variant="soft" className="p-3">
                  <h2 className="mb-3 font-semibold">{label}</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="وزنه (کیلوگرم)"
                      type="number"
                      inputSize="sm"
                      value={records[key].weight}
                      onChange={(event) => updateRecord(key, 'weight', event.target.value)}
                    />
                    <Input
                      label="تکرار"
                      type="number"
                      inputSize="sm"
                      value={records[key].reps}
                      onChange={(event) => updateRecord(key, 'reps', event.target.value)}
                    />
                  </div>
                  <p className="mt-3 text-sm" style={{ color: oneRepMax ? tokens.gold : tokens.textSub }}>
                    {oneRepMax
                      ? `1RM تخمینی: ${toPersianNumber(oneRepMax.toFixed(1))} کیلوگرم`
                      : 'برای محاسبه، وزنه و تکرار را وارد کنید'}
                  </p>
                </Card>
              );
            })}
          </div>

          <PrimaryButton
            variant="accent"
            size="lg"
            fullWidth
            onClick={handleSave}
            ariaLabel="ذخیره رکوردهای قدرت"
            className="mt-5"
          >
            <Save size={20} /> ذخیره رکوردها
          </PrimaryButton>
        </Card>
      </div>

      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        type="success"
        duration={1500}
      />
    </main>
  );
}
