import { useNavigate } from 'react-router-dom';
import { Dumbbell, CheckCircle2, ChevronLeft, CalendarDays, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { formatDateJalali, toPersianNumber } from '../utils/jalali';
import { getTokens } from '../styles/designTokens';
import { useMemo, useState } from 'react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import PrimaryButton from '../components/ui/PrimaryButton';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';

export default function History() {
  const navigate = useNavigate();
  const { sessions } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const tokens = getTokens(isDark);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) =>
      new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    );
  }, [sessions]);

  const handleDelete = () => {
    if (!deleteId) return;
    setDeleteId(null);
    setToastMessage('جلسه حذف شد');
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
        <div>
          <h1 className="font-bold text-lg" style={{ color: tokens.textMain }}>
            تاریخچه تمرینات
          </h1>
          <p className="text-xs" style={{ color: tokens.textSub }}>
            {toPersianNumber(sortedSessions.length)} جلسه ثبت شده
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sortedSessions.length === 0 ? (
          <EmptyState
            icon={<Dumbbell size={48} />}
            title="هنوز جلسه‌ای ثبت نشده"
            subtitle="اولین تمرین خود را از داشبورد شروع کنید"
          />
        ) : (
          sortedSessions.map((session) => {
            const isCompleted = session.sets.every(s => s.completed);
            const completedCount = session.sets.filter(s => s.completed).length;

            return (
              <Card key={session.id} variant="elevated" className="relative">
                <div
                  onClick={() => navigate(`/session/${session.id}`)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: isCompleted ? tokens.accentSoft : tokens.surfaceElevated,
                        color: isCompleted ? tokens.accent : tokens.textSub,
                      }}
                    >
                      {isCompleted ? <CheckCircle2 size={24} /> : <Dumbbell size={24} />}
                    </div>

                    <div className="flex-1">
                      <p className="font-bold text-sm" style={{ color: tokens.textMain }}>
                        {session.sets[0]?.exerciseName?.split(' ')[0] || 'جلسه تمرینی'}...
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <CalendarDays size={12} style={{ color: tokens.textSub }} />
                        <span className="text-xs" style={{ color: tokens.textSub }}>
                          {session.date ? formatDateJalali(session.date) : 'بدون تاریخ'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge color={isCompleted ? 'success' : 'warning'} size="sm">
                      {isCompleted
                        ? 'تکمیل شده'
                        : `${completedCount} / ${session.sets.length} ست`}
                    </Badge>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(session.id);
                      }}
                      className="p-1 rounded-full transition-colors"
                      style={{ color: tokens.danger }}
                      aria-label="حذف"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="حذف جلسه"
        size="sm"
      >
        <p className="mb-5 text-sm" style={{ color: tokens.textSub }}>
          آیا از حذف این جلسه مطمئن هستید؟ این عمل قابل بازگشت نیست.
        </p>
        <div className="flex gap-2">
          <PrimaryButton variant="outline" fullWidth onClick={() => setDeleteId(null)}>
            انصراف
          </PrimaryButton>
          <PrimaryButton variant="danger" fullWidth onClick={handleDelete}>
            حذف
          </PrimaryButton>
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
