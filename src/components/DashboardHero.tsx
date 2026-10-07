import { useNavigate } from 'react-router-dom';
import { Award, CheckCircle2, Dumbbell, Flame } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toPersianNumber } from '../utils/jalali';
import { soundEffects } from '../utils/sound';
import { getTokens } from '../styles/designTokens';
import Card from './ui/Card';
import PrimaryButton from './ui/PrimaryButton';
import SectionHeader from './ui/SectionHeader';

interface Props {
  isDark?: boolean;
  isPremium: boolean;
  profileName?: string;
  isTodayRest: boolean;
  todayDayIndex: number;
  nextTrainingDayIndex: number;
  weeklyCompleted: number;
  weeklyGoal: number;
  weeklyProgress: number;
  currentStreak: number;
  lastSession: any;
  getSessionDuration: (s: any) => string | null;
}

export default function DashboardHero({
  isDark: isDarkProp, isPremium, profileName, isTodayRest, todayDayIndex,
  nextTrainingDayIndex, weeklyCompleted, weeklyGoal, weeklyProgress,
  currentStreak, lastSession, getSessionDuration,
}: Props) {
  const { theme } = useTheme();
  const isDark = isDarkProp ?? theme === 'dark';
  const tokens = getTokens(isDark);
  const navigate = useNavigate();
  const progress = Math.max(0, Math.min(weeklyProgress, 100));
  const progressColor = isDark ? tokens.gold : tokens.accent;

  const startWorkout = () => {
    soundEffects.playClick();
    const day = isTodayRest
      ? nextTrainingDayIndex
      : todayDayIndex >= 0 ? todayDayIndex : nextTrainingDayIndex;
    navigate(`/workout?day=${day}${isTodayRest ? '' : '&autoStart=true'}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <SectionHeader
          title={`سلام، ${profileName || 'مربی'} 👋`}
          subtitle="آماده‌ای برای پیشرفت؟"
        />
        {!isPremium && (
          <button
            type="button"
            onClick={() => navigate('/prompt')}
            aria-label="ارتقا به نسخه ویژه"
            className="flex min-h-[44px] items-center gap-1.5 rounded-full border px-3 text-xs font-bold"
            style={{ borderColor: tokens.gold, color: tokens.gold }}
          >
            <Award size={15} /> ویژه
          </button>
        )}
      </div>

      <PrimaryButton
        onClick={startWorkout}
        variant="gold"
        size="lg"
        fullWidth
        ariaLabel={isTodayRest ? 'شروع جلسه تمرینی بعدی' : 'شروع تمرین امروز'}
        className="gap-3"
      >
        <Dumbbell size={21} />
        {isTodayRest ? 'شروع جلسه بعدی' : 'شروع تمرین امروز'}
      </PrimaryButton>

      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col items-center justify-center text-center">
          <div className="relative mb-2 h-16 w-16">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke={tokens.border} strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.5" fill="none" stroke={progressColor}
                strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${progress * 0.97} 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-black" style={{ color: progressColor }}>
                {toPersianNumber(weeklyCompleted)}/{toPersianNumber(weeklyGoal)}
              </span>
            </div>
          </div>
          <p className="text-xs font-bold" style={{ color: tokens.textSub }}>روزهای تکمیل‌شده</p>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center">
          <Flame
            size={28}
            className="mb-1"
            style={{ color: currentStreak > 0 ? tokens.warning : tokens.textSub }}
          />
          <p className="text-2xl font-black" style={{ color: progressColor }}>
            {toPersianNumber(currentStreak)}
          </p>
          <p className="text-xs font-bold" style={{ color: tokens.textSub }}>روز استریک تمرینی</p>
        </Card>
      </div>

      {lastSession && (
        <Card>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-sm font-bold" style={{ color: tokens.textMain }}>
              <CheckCircle2 size={16} style={{ color: tokens.success }} /> آخرین جلسه
            </h3>
            <span className="text-xs" style={{ color: tokens.textSub }}>
              {lastSession.date ? new Date(lastSession.date).toLocaleDateString('fa-IR') : ''}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-sm font-black" style={{ color: tokens.accent }}>
                {toPersianNumber(Math.round(lastSession.totalVolume || 0))}
              </p>
              <p className="text-xs" style={{ color: tokens.textSub }}>حجم (kg)</p>
            </div>
            <div>
              <p className="text-sm font-black" style={{ color: tokens.accent }}>
                {getSessionDuration(lastSession) || '—'}
              </p>
              <p className="text-xs" style={{ color: tokens.textSub }}>مدت زمان</p>
            </div>
            <div>
              <p className="text-sm font-black" style={{ color: tokens.accent }}>
                {toPersianNumber((lastSession.sets || []).filter((set: any) => set.completed).length)}
              </p>
              <p className="text-xs" style={{ color: tokens.textSub }}>ست تکمیل</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
