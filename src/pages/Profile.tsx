import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useSubscription } from '../hooks/useSubscription';
import { useTheme } from '../context/ThemeContext';
import { soundEffects } from '../utils/sound';
import { toPersianNumber } from '../utils/jalali';
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

export default function Profile() {
  const navigate = useNavigate();
  const { profiles, activeProfile, setActiveProfile, deleteProfile } = useAppContext();
  const sub = useSubscription();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const teal = isDark ? '#a78bfa' : '#8b5cf6';
  const gold = isDark ? '#d4af37' : '#f59e0b';
  const bgMain = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark
    ? 'bg-[#1e1b4b]/50 backdrop-blur-md'
    : 'bg-white/70 backdrop-blur-md shadow-sm';
  const textMain = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';
  const borderCard = isDark
    ? 'border-white/10'
    : 'border-violet-200/60';

  const handleDelete = (id: string) => {
    soundEffects.playClick();
    deleteProfile(id);
    setConfirmDelete(null);
  };

  const handleEdit = (id: string) => {
    soundEffects.playClick();
    // TODO: پیاده‌سازی ویرایش با Onboarding
    navigate(`/onboarding?mode=edit&id=${id}`);
  };

  const handleCreateNew = () => {
    soundEffects.playClick();
    // محدودیت: ۱ پروفایل رایگان
    if (!sub.canCreateProfile(profiles.length)) {
      navigate('/subscription');
      return;
    }
    navigate('/onboarding?mode=new');
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
            <h1 className={`font-black text-lg ${textMain}`}>پروفایل‌ها</h1>
            <p className={`text-xs ${textSub}`}>{toPersianNumber(profiles.length)} پروفایل</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
            style={{ background: `linear-gradient(135deg, ${teal} 0%, ${gold} 100%)` }}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="p-4 space-y-3 max-w-2xl mx-auto">
        {profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: `${teal}15` }}>
              <User size={40} style={{ color: teal }} />
            </div>
            <h3 className={`font-black text-lg mb-2 ${textMain}`}>هنوز پروفایلی ندارید</h3>
            <p className={`text-sm ${textSub} mb-6 max-w-xs leading-6`}>
              برای شروع، یک پروفایل جدید ایجاد کنید تا برنامه تمرینی و تغذیه اختصاصی دریافت کنید
            </p>
            <button
              onClick={handleCreateNew}
              className="px-6 py-3.5 rounded-2xl font-black text-white shadow-lg active:scale-95 transition-all flex items-center gap-2"
              style={{ background: `linear-gradient(135deg, ${teal} 0%, ${gold} 100%)` }}
            >
              <Plus size={20} />
              ایجاد پروفایل جدید
            </button>
          </div>
        ) : (
          profiles.map((profile) => {
            const isActive = profile.id === activeProfile?.id;
            const bm = profile.bodyMeasurements || {};
            const bmCount = Object.values(bm).filter((v) => v != null && v !== '').length;

            return (
              <div
                key={profile.id}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  isActive
                    ? isDark
                      ? 'border-[#d4af37]/40 bg-[#d4af37]/5'
                      : 'border-violet-300 bg-violet-50/50'
                    : `${borderCard} ${cardBg}`
                }`}
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-black"
                        style={{ background: `${teal}20`, color: teal }}
                      >
                        {profile.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-black text-sm truncate ${textMain}`}>{profile.name}</h3>
                        <p className={`text-[11px] ${textSub} mt-0.5`}>
                          {profile.age} سال · {profile.height} cm · {profile.weight} kg
                        </p>
                      </div>
                    </div>

                    {isActive && (
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: `${gold}20`, color: gold }}>
                        فعال
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className={`p-2 rounded-lg text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <Target size={12} className="mx-auto mb-0.5" style={{ color: teal }} />
                      <p className={`text-[10px] font-black ${textMain}`}>{getGoalLabel(profile.primaryGoal)}</p>
                    </div>
                    <div className={`p-2 rounded-lg text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <Dumbbell size={12} className="mx-auto mb-0.5" style={{ color: teal }} />
                      <p className={`text-[10px] font-black ${textMain}`}>{toPersianNumber(profile.trainingDays)} روز/هفته</p>
                    </div>
                    <div className={`p-2 rounded-lg text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <Ruler size={12} className="mx-auto mb-0.5" style={{ color: teal }} />
                      <p className={`text-[10px] font-black ${textMain}`}>{toPersianNumber(bmCount)} اندازه</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!isActive ? (
                      <button
                        onClick={() => { soundEffects.playClick(); setActiveProfile(profile.id); }}
                        className="flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white active:scale-95 transition-all"
                        style={{ background: teal }}
                      >
                        <CheckCircle2 size={16} />
                        فعال‌سازی
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(profile.id)}
                        className="flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-black active:scale-95 transition-all"
                        style={{ background: gold }}
                      >
                        <Edit3 size={16} />
                        ویرایش
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(profile.id)}
                      className={`w-11 rounded-xl flex items-center justify-center active:scale-95 transition-all ${
                        isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(profile.id)}
                      className={`w-11 rounded-xl flex items-center justify-center active:scale-95 transition-all ${
                        isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-500'
                      }`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Create New (Bottom) */}
        {profiles.length > 0 && (
          <button
            onClick={handleCreateNew}
            className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border-2 border-dashed transition-all active:scale-95 ${borderCard}`}
            style={{ color: teal, borderColor: teal }}
          >
            <Plus size={20} />
            ایجاد پروفایل جدید
          </button>
        )}
      </div>

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setConfirmDelete(null)}>
          <div className={`rounded-2xl p-5 max-w-sm w-full ${cardBg}`} onClick={(e) => e.stopPropagation()}>
            <Trash2 size={40} className="text-red-500 mx-auto mb-3" />
            <h3 className={`font-black text-lg text-center mb-2 ${textMain}`}>حذف پروفایل؟</h3>
            <p className={`text-xs text-center mb-5 ${textSub}`}>
              تمام برنامه‌ها و تاریخچه این پروفایل حذف خواهد شد.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className={`flex-1 py-3 rounded-xl font-bold ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                انصراف
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white"
              >
                حذف کن
              </button>
            </div>
          </div>
        </div>
      )}
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
