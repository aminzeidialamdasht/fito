import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useSubscription } from '../hooks/useSubscription';
import { useTheme } from '../context/ThemeContext';
import { soundEffects } from '../utils/sound';
import { toPersianNumber } from '../utils/jalali';
import { getTokens } from '../styles/designTokens';
import {
  User,
  Plus,
  Edit3,
  Trash2,
  ChevronLeft,
  CheckCircle2,
  Target,
  Dumbbell,
  Ruler,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import PrimaryButton from '../components/ui/PrimaryButton';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';

export default function Profile() {
  const navigate = useNavigate();
  const { profiles, activeProfile, setActiveProfile, deleteProfile } = useAppContext();
  const sub = useSubscription();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const tokens = getTokens(isDark);

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const strengthRecords = (activeProfile?.strengthRecordsExtended as any) || {};
  const strengthEntries = Object.entries(strengthRecords)
    .filter(([key, value]) => key !== 'lastUpdated' && value)
    .slice(0, 3);
  const recordCount = Object.keys(strengthRecords)
    .filter((key) => key !== 'lastUpdated' && strengthRecords[key]).length;

  const handleDelete = (id: string) => {
    soundEffects.playClick();
    deleteProfile(id);
    setConfirmDelete(null);
    setToastMessage('پروفایل حذف شد');
    setShowToast(true);
  };

  const handleEdit = (id: string) => {
    soundEffects.playClick();
    navigate(`/onboarding?mode=edit&id=${id}`);
  };

  const handleCreateNew = () => {
    soundEffects.playClick();
    if (!sub.canCreateProfile(profiles.length)) {
      navigate('/subscription');
      return;
    }
    navigate('/onboarding?mode=new');
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full transition-colors"
          style={{ color: tokens.textMain }}
          aria-label="بازگشت"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-lg" style={{ color: tokens.textMain }}>
            پروفایل‌ها
          </h1>
          <p className="text-xs" style={{ color: tokens.textSub }}>
            {toPersianNumber(profiles.length)} پروفایل
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
          style={{ background: `linear-gradient(135deg, ${tokens.accent} 0%, ${tokens.gold} 100%)` }}
          aria-label="ایجاد پروفایل"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {activeProfile && (
          <Card variant="elevated">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: tokens.accentSoft, color: tokens.gold }}
              >
                <Dumbbell size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-sm" style={{ color: tokens.textMain }}>
                  رکوردهای قدرت
                </h3>
                <p className="text-[11px]" style={{ color: tokens.textSub }}>
                  {recordCount > 0
                    ? `${toPersianNumber(recordCount)} رکورد ثبت شده — ${new Date(strengthRecords.lastUpdated || '').toLocaleDateString('fa-IR')}`
                    : 'هنوز رکوردی ثبت نکرده‌اید'}
                </p>
              </div>
            </div>
            {recordCount > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {strengthEntries.map(([key, value]: [string, any]) => (
                  <div
                    key={key}
                    className="rounded-xl p-2 text-center"
                    style={{ background: tokens.surfaceElevated }}
                  >
                    <p className="text-[10px]" style={{ color: tokens.textSub }}>{key}</p>
                    <p className="text-sm font-black" style={{ color: tokens.gold }}>
                      {toPersianNumber(Number(value.estimated1RM || value.weight).toFixed(1))}
                    </p>
                    <p className="text-[10px]" style={{ color: tokens.textSub }}>کیلوگرم</p>
                  </div>
                ))}
              </div>
            )}
            <PrimaryButton
              variant="gold"
              fullWidth
              onClick={() => { soundEffects.playClick(); navigate('/strength-records'); }}
            >
              {recordCount > 0 ? 'ویرایش رکوردها' : 'ثبت رکوردها'}
            </PrimaryButton>
          </Card>
        )}

        {profiles.length === 0 ? (
          <EmptyState
            icon={<User size={48} />}
            title="هنوز پروفایلی ندارید"
            subtitle="برای شروع، یک پروفایل جدید ایجاد کنید تا برنامه تمرینی و تغذیه اختصاصی دریافت کنید"
            action={
              <PrimaryButton variant="accent" onClick={handleCreateNew}>
                <Plus size={18} />
                ایجاد پروفایل جدید
              </PrimaryButton>
            }
          />
        ) : (
          profiles.map((profile) => {
            const isActive = profile.id === activeProfile?.id;
            const bm = profile.bodyMeasurements || {};
            const bmCount = Object.values(bm).filter((v) => v != null && v !== '').length;

            return (
              <Card
                key={profile.id}
                variant={isActive ? 'soft' : 'elevated'}
                className="overflow-hidden"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-black"
                      style={{ background: tokens.accentSoft, color: tokens.accent }}
                    >
                      {profile.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-sm truncate" style={{ color: tokens.textMain }}>
                        {profile.name}
                      </h3>
                      <p className="text-[11px] mt-0.5" style={{ color: tokens.textSub }}>
                        {profile.age} سال · {profile.height} cm · {profile.weight} kg
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <Badge color="success" size="sm">فعال</Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div
                    className="p-2 rounded-lg text-center"
                    style={{ background: tokens.surfaceElevated }}
                  >
                    <Target size={12} className="mx-auto mb-0.5" style={{ color: tokens.accent }} />
                    <p className="text-[10px] font-black" style={{ color: tokens.textMain }}>
                      {getGoalLabel(profile.primaryGoal)}
                    </p>
                  </div>
                  <div
                    className="p-2 rounded-lg text-center"
                    style={{ background: tokens.surfaceElevated }}
                  >
                    <Dumbbell size={12} className="mx-auto mb-0.5" style={{ color: tokens.accent }} />
                    <p className="text-[10px] font-black" style={{ color: tokens.textMain }}>
                      {toPersianNumber(profile.trainingDays)} روز/هفته
                    </p>
                  </div>
                  <div
                    className="p-2 rounded-lg text-center"
                    style={{ background: tokens.surfaceElevated }}
                  >
                    <Ruler size={12} className="mx-auto mb-0.5" style={{ color: tokens.accent }} />
                    <p className="text-[10px] font-black" style={{ color: tokens.textMain }}>
                      {toPersianNumber(bmCount)} اندازه
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!isActive ? (
                    <PrimaryButton
                      variant="accent"
                      fullWidth
                      onClick={() => { soundEffects.playClick(); setActiveProfile(profile.id); }}
                    >
                      <CheckCircle2 size={16} />
                      فعال‌سازی
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton
                      variant="gold"
                      fullWidth
                      onClick={() => handleEdit(profile.id)}
                    >
                      <Edit3 size={16} />
                      ویرایش
                    </PrimaryButton>
                  )}
                  <button
                    onClick={() => setConfirmDelete(profile.id)}
                    className="w-11 rounded-xl flex items-center justify-center active:scale-95 transition-all"
                    style={{ background: `${tokens.danger}20`, color: tokens.danger }}
                    aria-label="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            );
          })
        )}

        {profiles.length > 0 && (
          <button
            onClick={handleCreateNew}
            className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border-2 border-dashed transition-all active:scale-95"
            style={{ color: tokens.accent, borderColor: tokens.accent }}
          >
            <Plus size={20} />
            ایجاد پروفایل جدید
          </button>
        )}
      </div>

      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="حذف پروفایل؟"
        size="sm"
      >
        <div className="text-center">
          <Trash2 size={40} style={{ color: tokens.danger }} className="mx-auto mb-3" />
          <p className="text-xs mb-5" style={{ color: tokens.textSub }}>
            تمام برنامه‌ها و تاریخچه این پروفایل حذف خواهد شد.
          </p>
          <div className="flex gap-3">
            <PrimaryButton
              variant="outline"
              fullWidth
              onClick={() => setConfirmDelete(null)}
            >
              انصراف
            </PrimaryButton>
            <PrimaryButton
              variant="danger"
              fullWidth
              onClick={() => confirmDelete && handleDelete(confirmDelete)}
            >
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

function getGoalLabel(goal: string): string {
  const map: Record<string, string> = {
    hypertrophy: 'حجم',
    strength: 'قدرت',
    fat_loss: 'چربی‌سوزی',
    recomposition: 'بازترکیب',
    competition: 'مسابقه',
    general_fitness: 'تناسب',
  };
  return map[goal] || goal || 'نامشخص';
}
