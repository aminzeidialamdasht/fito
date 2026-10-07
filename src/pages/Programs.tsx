import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { soundEffects } from '../utils/sound';
import { toPersianNumber } from '../utils/jalali';
import { getTokens } from '../styles/designTokens';
import {
  Dumbbell,
  ChevronLeft,
  Plus,
  Calendar,
  Clock,
  Target,
  Sparkles,
  Trash2,
  CheckCircle2,
  Play,
  Eye,
} from 'lucide-react';
import { useState } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import PrimaryButton from '../components/ui/PrimaryButton';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';

export default function Programs() {
  const navigate = useNavigate();
  const { programs, state, setActiveProgram, removeProgram } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const tokens = getTokens(isDark);

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const sortedPrograms = [...programs].sort((a, b) =>
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );

  const handleDelete = (id: string) => {
    soundEffects.playClick();
    removeProgram(id);
    setConfirmDelete(null);
    setToastMessage('برنامه حذف شد');
    setShowToast(true);
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
            برنامه‌های من
          </h1>
          <p className="text-xs" style={{ color: tokens.textSub }}>
            {toPersianNumber(programs.length)} برنامه ذخیره شده
          </p>
        </div>
        <button
          onClick={() => { soundEffects.playClick(); navigate('/generate/workout'); }}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
          style={{ background: `linear-gradient(135deg, ${tokens.accent} 0%, ${tokens.gold} 100%)` }}
          aria-label="تولید برنامه"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        {sortedPrograms.length === 0 ? (
          <EmptyState
            icon={<Dumbbell size={48} />}
            title="هنوز برنامه‌ای نساخته‌اید"
            subtitle="با یک کلیک، برنامه تمرینی اختصاصی خود را به‌صورت آفلاین تولید کنید"
            action={
              <PrimaryButton
                variant="accent"
                onClick={() => { soundEffects.playClick(); navigate('/generate/workout'); }}
              >
                <Sparkles size={18} />
                تولید برنامه تمرینی
              </PrimaryButton>
            }
          />
        ) : (
          sortedPrograms.map((program) => {
            const isActive = program.id === state.activeProgram;
            const dayCount = (program as any).days?.length || 0;
            const exerciseCount = (program as any).days?.reduce(
              (acc: number, d: any) => acc + (d.exercises?.length || 0), 0
            ) || 0;
            const goalLabel = getGoalLabel(program);

            return (
              <Card
                key={program.id}
                variant={isActive ? 'soft' : 'elevated'}
                className="overflow-hidden"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: tokens.accentSoft }}
                    >
                      <Dumbbell size={26} style={{ color: tokens.accent }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-base truncate" style={{ color: tokens.textMain }}>
                        {program.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <Badge color="info" size="sm">{goalLabel}</Badge>
                        <Badge color="neutral" size="sm">{program.duration || '—'}</Badge>
                      </div>
                    </div>
                  </div>
                  {isActive && (
                    <Badge color="success" size="sm">فعال</Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div
                    className="p-2.5 rounded-xl text-center"
                    style={{ background: tokens.surfaceElevated }}
                  >
                    <Calendar size={14} className="mx-auto mb-1" style={{ color: tokens.accent }} />
                    <p className="text-sm font-black" style={{ color: tokens.textMain }}>
                      {toPersianNumber(dayCount)}
                    </p>
                    <p className="text-[9px]" style={{ color: tokens.textSub }}>روز تمرین</p>
                  </div>
                  <div
                    className="p-2.5 rounded-xl text-center"
                    style={{ background: tokens.surfaceElevated }}
                  >
                    <Target size={14} className="mx-auto mb-1" style={{ color: tokens.accent }} />
                    <p className="text-sm font-black" style={{ color: tokens.textMain }}>
                      {toPersianNumber(exerciseCount)}
                    </p>
                    <p className="text-[9px]" style={{ color: tokens.textSub }}>حرکت</p>
                  </div>
                  <div
                    className="p-2.5 rounded-xl text-center"
                    style={{ background: tokens.surfaceElevated }}
                  >
                    <Clock size={14} className="mx-auto mb-1" style={{ color: tokens.accent }} />
                    <p className="text-sm font-black" style={{ color: tokens.textMain }}>
                      {toPersianNumber(program.trainingDays || 0)}
                    </p>
                    <p className="text-[9px]" style={{ color: tokens.textSub }}>روز/هفته</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <PrimaryButton
                    variant="outline"
                    fullWidth
                    onClick={() => { soundEffects.playClick(); navigate(`/program/${program.id}`); }}
                  >
                    <Eye size={16} />
                    جزئیات
                  </PrimaryButton>
                  {!isActive ? (
                    <PrimaryButton
                      variant="accent"
                      fullWidth
                      onClick={() => { soundEffects.playClick(); setActiveProgram(program.id); }}
                    >
                      <CheckCircle2 size={16} />
                      فعال‌سازی
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton
                      variant="gold"
                      fullWidth
                      onClick={() => { soundEffects.playClick(); navigate(`/program/${program.id}`); }}
                    >
                      <Play size={16} />
                      شروع تمرین
                    </PrimaryButton>
                  )}
                </div>

                <button
                  onClick={() => setConfirmDelete(program.id)}
                  className="w-full py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  style={{ color: tokens.danger }}
                >
                  <Trash2 size={12} />
                  حذف برنامه
                </button>
              </Card>
            );
          })
        )}
      </div>

      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="حذف برنامه؟"
        size="sm"
      >
        <div className="text-center">
          <Trash2 size={40} style={{ color: tokens.danger }} className="mx-auto mb-3" />
          <p className="text-xs mb-5" style={{ color: tokens.textSub }}>
            آیا مطمئن هستید؟ این عمل قابل بازگشت نیست.
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

function getGoalLabel(program: any): string {
  const name = (program.name || '').toLowerCase();
  if (name.includes('حجم')) return 'حجم عضلانی';
  if (name.includes('قدرت')) return 'قدرت';
  if (name.includes('چربی')) return 'کاهش چربی';
  if (name.includes('بازترکیب')) return 'بازترکیب';
  if (name.includes('مسابقه')) return 'مسابقه';
  return 'تناسب اندام';
}
