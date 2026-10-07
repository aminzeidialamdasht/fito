import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, User, Target, Dumbbell, Ruler, Heart,
  Moon, Settings, Edit3, Trash2, CheckCircle2, Activity,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { getTokens } from '../styles/designTokens';
import { toPersianNumber } from '../utils/jalali';
import { soundEffects } from '../utils/sound';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import PrimaryButton from '../components/ui/PrimaryButton';
import EmptyState from '../components/ui/EmptyState';
import { useState } from 'react';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';

const GOAL_LABELS: Record<string, string> = {
  hypertrophy: 'حجم عضلانی',
  strength: 'قدرت',
  fat_loss: 'کاهش چربی',
  recomposition: 'بازترکیب',
  competition: 'مسابقه',
  general_fitness: 'تناسب اندام',
};

const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: 'مبتدی',
  intermediate: 'متوسط',
  advanced: 'پیشرفته',
  professional: 'حرفه‌ای',
};

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: 'بی‌تحرک',
  light: 'سبک',
  moderate: 'متوسط',
  active: 'فعال',
  very_active: 'خیلی فعال',
};

const RECOVERY_LABELS: Record<string, string> = {
  poor: 'ضعیف',
  fair: 'متوسط',
  good: 'خوب',
  excellent: 'عالی',
};

const STRESS_LABELS: Record<string, string> = {
  low: 'کم',
  medium: 'متوسط',
  high: 'زیاد',
};

const SHIFT_LABELS: Record<string, string> = {
  day: 'روز',
  evening: 'عصر',
  night: 'شب',
  rotating: 'شیفتی',
};

const LOCATION_LABELS: Record<string, string> = {
  gym: 'باشگاه',
  home: 'خانه',
  both: 'هر دو',
  park: 'پارک',
};

const EQUIPMENT_TYPE_LABELS: Record<string, string> = {
  full_gym: 'باشگاه کامل',
  home: 'خانه',
  park: 'پارک',
  custom: 'سفارشی',
};

function calculateBMI(weight?: number, height?: number): string | null {
  if (!weight || !height) return null;
  const bmi = weight / Math.pow(height / 100, 2);
  return bmi.toFixed(1);
}

interface InfoRowProps {
  label: string;
  value: string;
  isDark: boolean;
  tokens: any;
}

function InfoRow({ label, value, tokens }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs" style={{ color: tokens.textSub }}>{label}</span>
      <span className="text-xs font-bold" style={{ color: tokens.textMain }}>{value}</span>
    </div>
  );
}

export default function ProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profiles, activeProfile, setActiveProfile, deleteProfile } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const tokens = getTokens(isDark);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const profile = profiles.find((p) => p.id === id);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <EmptyState
          icon={<User size={48} />}
          title="پروفایل یافت نشد"
          subtitle="این پروفایل حذف شده یا وجود ندارد."
          action={
            <PrimaryButton variant="accent" onClick={() => navigate('/profile')}>
              بازگشت به پروفایل‌ها
            </PrimaryButton>
          }
        />
      </div>
    );
  }

  const isActive = profile.id === activeProfile?.id;
  const bmi = calculateBMI(profile.weight, profile.height);
  const bm = profile.bodyMeasurements || {};
  const bmEntries = Object.entries(bm).filter(([_, v]) => v != null && v !== '' && v !== 0);
  const strengthRecords = (profile.strengthRecordsExtended as any) || {};
  const recordCount = Object.keys(strengthRecords)
    .filter((key) => key !== 'lastUpdated' && strengthRecords[key]).length;
  const nutrition = profile.nutrition || {};
  const supplement = profile.supplement || {};

  const handleEdit = () => {
    soundEffects.playClick();
    navigate(`/onboarding?mode=edit&id=${profile.id}`);
  };

  const handleActivate = () => {
    soundEffects.playClick();
    setActiveProfile(profile.id);
    setToastMessage('پروفایل فعال شد');
    setShowToast(true);
  };

  const handleDelete = () => {
    soundEffects.playClick();
    deleteProfile(profile.id);
    setConfirmDelete(false);
    setToastMessage('پروفایل حذف شد');
    setShowToast(true);
    setTimeout(() => navigate('/profile'), 800);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full transition-colors"
          style={{ color: tokens.textMain }}
          aria-label="بازگشت"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-lg truncate" style={{ color: tokens.textMain }}>
            {profile.name}
          </h1>
          <p className="text-xs" style={{ color: tokens.textSub }}>
            {toPersianNumber(profile.age)} سال · {profile.gender === 'male' ? 'مرد' : 'زن'}
          </p>
        </div>
        {isActive && <Badge color="success" size="sm">فعال</Badge>}
      </div>

      <div className="space-y-3">
        {/* ═══ ۱. اطلاعات بدنی ═══ */}
        <Card variant="elevated">
          <div className="flex items-center gap-3 mb-3">
            <Ruler size={18} style={{ color: tokens.accent }} />
            <h3 className="font-bold text-sm" style={{ color: tokens.textMain }}>
              اطلاعات بدنی
            </h3>
          </div>
          <div className="divide-y" style={{ borderColor: tokens.border }}>
            <InfoRow label="قد" value={`${toPersianNumber(profile.height)} سانتی‌متر`} isDark={isDark} tokens={tokens} />
            <InfoRow label="وزن فعلی" value={`${toPersianNumber(profile.weight)} کیلوگرم`} isDark={isDark} tokens={tokens} />
            {profile.targetWeight && (
              <InfoRow label="وزن هدف" value={`${toPersianNumber(profile.targetWeight)} کیلوگرم`} isDark={isDark} tokens={tokens} />
            )}
            {bmi && <InfoRow label="BMI" value={toPersianNumber(bmi)} isDark={isDark} tokens={tokens} />}
            <InfoRow label="سطح فعالیت" value={ACTIVITY_LABELS[profile.activityLevel] || '—'} isDark={isDark} tokens={tokens} />
            {profile.bodyFatPercent && (
              <InfoRow label="درصد چربی" value={`${toPersianNumber(profile.bodyFatPercent)}٪`} isDark={isDark} tokens={tokens} />
            )}
            {bmEntries.length > 0 && (
              <InfoRow label="تعداد اندازه‌ها" value={`${toPersianNumber(bmEntries.length)} مورد`} isDark={isDark} tokens={tokens} />
            )}
          </div>
        </Card>

        {/* ═══ ۲. تجربه و رکوردها ═══ */}
        <Card variant="elevated">
          <div className="flex items-center gap-3 mb-3">
            <Activity size={18} style={{ color: tokens.gold }} />
            <h3 className="font-bold text-sm" style={{ color: tokens.textMain }}>
              تجربه و رکوردها
            </h3>
          </div>
          <div className="divide-y" style={{ borderColor: tokens.border }}>
            <InfoRow label="سطح تجربه" value={EXPERIENCE_LABELS[profile.experience] || '—'} isDark={isDark} tokens={tokens} />
            {profile.trainingHistory && (
              <div className="py-2">
                <p className="text-xs mb-1" style={{ color: tokens.textSub }}>سابقه تمرینی</p>
                <p className="text-xs" style={{ color: tokens.textMain }}>{profile.trainingHistory}</p>
              </div>
            )}
            <InfoRow label="رکوردهای ثبت‌شده" value={`${toPersianNumber(recordCount)} مورد`} isDark={isDark} tokens={tokens} />
          </div>
          <PrimaryButton
            variant="gold"
            size="sm"
            fullWidth
            onClick={() => { soundEffects.playClick(); navigate('/strength-records'); }}
            className="mt-3"
          >
            {recordCount > 0 ? 'ویرایش رکوردها' : 'ثبت رکوردها'}
          </PrimaryButton>
        </Card>

        {/* ═══ ۳. هدف تمرینی ═══ */}
        <Card variant="elevated">
          <div className="flex items-center gap-3 mb-3">
            <Target size={18} style={{ color: tokens.accent }} />
            <h3 className="font-bold text-sm" style={{ color: tokens.textMain }}>
              هدف تمرینی
            </h3>
          </div>
          <div className="divide-y" style={{ borderColor: tokens.border }}>
            <InfoRow label="هدف اصلی" value={GOAL_LABELS[profile.primaryGoal] || '—'} isDark={isDark} tokens={tokens} />
            {profile.secondaryGoal && (
              <InfoRow label="هدف دوم" value={GOAL_LABELS[profile.secondaryGoal] || '—'} isDark={isDark} tokens={tokens} />
            )}
            {profile.targetMuscles && profile.targetMuscles.length > 0 && (
              <div className="py-2">
                <p className="text-xs mb-2" style={{ color: tokens.textSub }}>عضلات اولویت‌دار</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.targetMuscles.map((m, i) => (
                    <Badge key={i} color="priority" size="sm">{m}</Badge>
                  ))}
                </div>
              </div>
            )}
            {profile.timeline && (
              <InfoRow label="مدت برنامه" value={profile.timeline} isDark={isDark} tokens={tokens} />
            )}
          </div>
        </Card>

        {/* ═══ ۴. برنامه تمرینی ═══ */}
        <Card variant="elevated">
          <div className="flex items-center gap-3 mb-3">
            <Dumbbell size={18} style={{ color: tokens.accent }} />
            <h3 className="font-bold text-sm" style={{ color: tokens.textMain }}>
              برنامه تمرینی
            </h3>
          </div>
          <div className="divide-y" style={{ borderColor: tokens.border }}>
            <InfoRow label="روزهای تمرین" value={`${toPersianNumber(profile.trainingDays)} روز/هفته`} isDark={isDark} tokens={tokens} />
            <InfoRow label="مدت هر جلسه" value={`${toPersianNumber(profile.sessionDuration)} دقیقه`} isDark={isDark} tokens={tokens} />
            <InfoRow label="محل تمرین" value={LOCATION_LABELS[profile.location] || '—'} isDark={isDark} tokens={tokens} />
            <InfoRow label="نوع تجهیزات" value={EQUIPMENT_TYPE_LABELS[profile.equipmentType] || '—'} isDark={isDark} tokens={tokens} />
            {profile.equipment && profile.equipment.length > 0 && (
              <div className="py-2">
                <p className="text-xs mb-2" style={{ color: tokens.textSub }}>تجهیزات در دسترس</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.equipment.slice(0, 8).map((eq, i) => (
                    <Badge key={i} color="info" size="sm">{eq}</Badge>
                  ))}
                  {profile.equipment.length > 8 && (
                    <Badge color="neutral" size="sm">+{toPersianNumber(profile.equipment.length - 8)}</Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* ═══ ۵. سلامت ═══ */}
        {(profile.injuries?.length > 0 || profile.limitations?.length > 0 ||
          profile.avoidedExercises?.length > 0 || profile.healthConditions?.length > 0 ||
          profile.injuryDetails || profile.hormoneMedNotes) && (
          <Card variant="elevated">
            <div className="flex items-center gap-3 mb-3">
              <Heart size={18} style={{ color: tokens.danger }} />
              <h3 className="font-bold text-sm" style={{ color: tokens.textMain }}>
                سلامت و محدودیت‌ها
              </h3>
            </div>
            <div className="divide-y" style={{ borderColor: tokens.border }}>
              {profile.injuries && profile.injuries.length > 0 && (
                <div className="py-2">
                  <p className="text-xs mb-2" style={{ color: tokens.textSub }}>آسیب‌ها</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.injuries.map((inj, i) => (
                      <Badge key={i} color="danger" size="sm">{inj}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {profile.injuryDetails && (
                <div className="py-2">
                  <p className="text-xs mb-1" style={{ color: tokens.textSub }}>جزئیات آسیب</p>
                  <p className="text-xs" style={{ color: tokens.textMain }}>{profile.injuryDetails}</p>
                </div>
              )}
              {profile.limitations && profile.limitations.length > 0 && (
                <div className="py-2">
                  <p className="text-xs mb-2" style={{ color: tokens.textSub }}>محدودیت‌ها</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.limitations.map((lim, i) => (
                      <Badge key={i} color="warning" size="sm">{lim}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {profile.avoidedExercises && profile.avoidedExercises.length > 0 && (
                <div className="py-2">
                  <p className="text-xs mb-2" style={{ color: tokens.textSub }}>تمرینات ممنوع</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.avoidedExercises.map((ex, i) => (
                      <Badge key={i} color="danger" size="sm">{ex}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {profile.healthConditions && profile.healthConditions.length > 0 && (
                <div className="py-2">
                  <p className="text-xs mb-2" style={{ color: tokens.textSub }}>شرایط پزشکی</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.healthConditions.map((hc, i) => (
                      <Badge key={i} color="warning" size="sm">{hc}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {profile.hormoneMedNotes && (
                <div className="py-2">
                  <p className="text-xs mb-1" style={{ color: tokens.textSub }}>یادداشت دارو/هورمون</p>
                  <p className="text-xs" style={{ color: tokens.textMain }}>{profile.hormoneMedNotes}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* ═══ ۶. ریکاوری ═══ */}
        {(profile.sleepHours || profile.recoveryQuality || profile.jobStress || profile.workShift) && (
          <Card variant="elevated">
            <div className="flex items-center gap-3 mb-3">
              <Moon size={18} style={{ color: tokens.priority }} />
              <h3 className="font-bold text-sm" style={{ color: tokens.textMain }}>
                ریکاوری
              </h3>
            </div>
            <div className="divide-y" style={{ borderColor: tokens.border }}>
              {profile.sleepHours && (
                <InfoRow label="ساعت خواب" value={`${toPersianNumber(profile.sleepHours)} ساعت`} isDark={isDark} tokens={tokens} />
              )}
              {profile.recoveryQuality && (
                <InfoRow label="کیفیت ریکاوری" value={RECOVERY_LABELS[profile.recoveryQuality] || '—'} isDark={isDark} tokens={tokens} />
              )}
              {profile.jobStress && (
                <InfoRow label="سطح استرس" value={STRESS_LABELS[profile.jobStress] || '—'} isDark={isDark} tokens={tokens} />
              )}
              {profile.workShift && (
                <InfoRow label="شیفت کاری" value={SHIFT_LABELS[profile.workShift] || '—'} isDark={isDark} tokens={tokens} />
              )}
            </div>
          </Card>
        )}

        {/* ═══ ۷. مدیریت ═══ */}
        <Card variant="elevated">
          <div className="flex items-center gap-3 mb-3">
            <Settings size={18} style={{ color: tokens.textSub }} />
            <h3 className="font-bold text-sm" style={{ color: tokens.textMain }}>
              مدیریت پروفایل
            </h3>
          </div>
          <div className="space-y-2">
            <PrimaryButton variant="accent" fullWidth onClick={handleEdit}>
              <Edit3 size={16} />
              ویرایش پروفایل
            </PrimaryButton>
            {!isActive && (
              <PrimaryButton variant="success" fullWidth onClick={handleActivate}>
                <CheckCircle2 size={16} />
                فعال‌سازی این پروفایل
              </PrimaryButton>
            )}
            <PrimaryButton variant="danger" fullWidth onClick={() => setConfirmDelete(true)}>
              <Trash2 size={16} />
              حذف پروفایل
            </PrimaryButton>
          </div>
        </Card>
      </div>

      {/* Modal حذف */}
      <Modal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="حذف پروفایل؟"
        size="sm"
      >
        <div className="text-center">
          <Trash2 size={40} style={{ color: tokens.danger }} className="mx-auto mb-3" />
          <p className="text-xs mb-5" style={{ color: tokens.textSub }}>
            تمام برنامه‌ها و تاریخچه این پروفایل حذف خواهد شد.
          </p>
          <div className="flex gap-3">
            <PrimaryButton variant="outline" fullWidth onClick={() => setConfirmDelete(false)}>
              انصراف
            </PrimaryButton>
            <PrimaryButton variant="danger" fullWidth onClick={handleDelete}>
              حذف کن
            </PrimaryButton>
          </div>
        </div>
      </Modal>

      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        type="success"
        duration={2000}
      />
    </div>
  );
}
