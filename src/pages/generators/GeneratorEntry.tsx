import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { soundEffects } from '../../utils/sound';
import {
  User,
  UserPlus,
  Edit3,
  ChevronLeft,
  Dumbbell,
  Apple,
  Pill,
  Zap,
  Sparkles,
} from 'lucide-react';

type GeneratorType = 'workout' | 'nutrition' | 'supplement' | 'compact';

const GENERATOR_INFO: Record<GeneratorType, { title: string; icon: any; color: string }> = {
  workout: { title: 'برنامه تمرینی', icon: Dumbbell, color: '#a78bfa' },
  nutrition: { title: 'برنامه تغذیه', icon: Apple, color: '#10b981' },
  supplement: { title: 'برنامه مکمل', icon: Pill, color: '#ec4899' },
  compact: { title: 'برنامه فشرده', icon: Zap, color: '#f59e0b' },
};

export default function GeneratorEntry() {
  const { type } = useParams<{ type: GeneratorType }>();
  const navigate = useNavigate();
  const { profiles, activeProfile, setActiveProfile } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [showChoice, setShowChoice] = useState(false);

  const teal = isDark ? '#a78bfa' : '#8b5cf6';
  const gold = isDark ? '#d4af37' : '#f59e0b';
  const bgMain = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark
    ? 'bg-[#1e1b4b]/50 backdrop-blur-md'
    : 'bg-violet-50/70 backdrop-blur-md';
  const textMain = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';
  const borderCard = isDark
    ? 'border-white/10'
    : 'border-violet-200/60';

  const info = GENERATOR_INFO[type || 'workout'] || GENERATOR_INFO.workout;
  const Icon = info.icon;

  // اگر پروفایل نداریم → مستقیم به ویزارد جدید
  useEffect(() => {
    if (!profiles || profiles.length === 0) {
      navigate(`/onboarding?type=${type}`, { replace: true });
      return;
    }

    // اگر پروفایل داریم ولی فعال نیست → فعالش کن
    if (!activeProfile && profiles.length > 0) {
      setActiveProfile(profiles[0].id);
    }
  }, [profiles, activeProfile, navigate, setActiveProfile, type]);

  // اگر پروفایل‌ها لود نشده
  if (!profiles || profiles.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgMain}`}>
        <div className={`w-12 h-12 rounded-full border-4 border-t-transparent animate-spin`} style={{ borderColor: teal, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  // اگر فقط یک پروفایل داریم → مستقیم به صفحه تولید
  // اما اگر بیش از یک داریم یا می‌خواهیم انتخاب کنیم:
  const handleEditCurrent = () => {
    soundEffects.playClick();
    navigate(`/generate/${type}/ready`);
  };

  const handleNewProfile = () => {
    soundEffects.playClick();
    navigate(`/onboarding?type=${type}&mode=new`);
  };

  return (
    <div className={`min-h-screen pb-24 ${bgMain}`}>
      {/* Header */}
      <div className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 py-4 ${isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white/90 border-gray-200'}`}>
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5">
            <ChevronLeft size={24} className={isDark ? 'text-white' : 'text-gray-800'} />
          </button>
          <div className="flex-1">
            <h1 className={`font-black text-lg ${textMain} flex items-center gap-2`}>
              <Icon size={20} style={{ color: info.color }} />
              {info.title}
            </h1>
            <p className={`text-xs ${textSub}`}>انتخاب پروفایل</p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="p-4 max-w-2xl mx-auto space-y-4">
        <div className={`rounded-2xl p-5 border ${borderCard} ${cardBg}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${teal}20` }}>
              <User size={24} style={{ color: teal }} />
            </div>
            <div>
              <p className={`font-black ${textMain}`}>پروفایل فعلی</p>
              <p className={`text-xs ${textSub}`}>{activeProfile?.name || 'انتخاب نشده'}</p>
            </div>
          </div>

          {activeProfile && (
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <p className={textSub}>سن</p>
                <p className={`font-black ${textMain}`}>{activeProfile.age} سال</p>
              </div>
              <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <p className={textSub}>قد / وزن</p>
                <p className={`font-black ${textMain}`}>{activeProfile.height} / {activeProfile.weight}</p>
              </div>
              <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <p className={textSub}>هدف</p>
                <p className={`font-black ${textMain}`}>{getGoalLabel(activeProfile.primaryGoal)}</p>
              </div>
              <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <p className={textSub}>سطح</p>
                <p className={`font-black ${textMain}`}>{getExpLabel(activeProfile.experience)}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleEditCurrent}
            className="w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            style={{ background: `linear-gradient(135deg, ${teal} 0%, ${info.color} 100%)` }}
          >
            <Sparkles size={20} />
            ادامه با این پروفایل
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
          <span className={`text-xs font-bold ${textSub}`}>یا</span>
          <div className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
        </div>

        {/* Create New */}
        <button
          onClick={handleNewProfile}
          className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border-2 border-dashed transition-all active:scale-95 ${borderCard}`}
          style={{ color: teal, borderColor: teal }}
        >
          <UserPlus size={20} />
          ایجاد پروفایل جدید
        </button>

        {/* Existing Profiles */}
        {profiles.length > 1 && (
          <div className={`rounded-2xl p-4 border ${borderCard} ${cardBg}`}>
            <p className={`font-black text-sm mb-3 ${textMain}`}>پروفایل‌های موجود</p>
            <div className="space-y-2">
              {profiles.filter(p => p.id !== activeProfile?.id).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setActiveProfile(p.id);
                    navigate(`/generate/${type}/ready`);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs" style={{ background: `${teal}20`, color: teal }}>
                      {p.name.charAt(0)}
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold ${textMain}`}>{p.name}</p>
                      <p className={`text-[10px] ${textSub}`}>{getGoalLabel(p.primaryGoal)}</p>
                    </div>
                  </div>
                  <Edit3 size={14} style={{ color: teal }} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
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
    general_fitness: 'تناسب اندام',
  };
  return map[goal] || goal;
}

function getExpLabel(exp: string): string {
  const map: Record<string, string> = {
    beginner: 'مبتدی',
    intermediate: 'متوسط',
    advanced: 'پیشرفته',
    professional: 'حرفه‌ای',
  };
  return map[exp] || exp;
}
