import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { soundEffects } from '../utils/sound';
import { toPersianNumber } from '../utils/jalali';
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
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

export default function Programs() {
  const navigate = useNavigate();
  const { programs, state, setActiveProgram, removeProgram } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

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

  const sortedPrograms = [...programs].sort((a, b) =>
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );

  const handleDelete = (id: string) => {
    soundEffects.playClick();
    removeProgram(id);
    setConfirmDelete(null);
  };

  return (
    <div className={`min-h-screen pb-24 ${bgMain}`}>
      <div className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 py-4 flex items-center gap-3 ${isDark ? 'bg-[#0f172a]/90 border-white/10' : 'bg-white/90 border-gray-200'}`}>
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5">
          <ChevronLeft size={24} className={isDark ? 'text-white' : 'text-gray-800'} />
        </button>
        <div className="flex-1">
          <h1 className={`font-black text-lg ${textMain}`}>برنامه‌های من</h1>
          <p className={`text-xs ${textSub}`}>{toPersianNumber(programs.length)} برنامه ذخیره شده</p>
        </div>
        <button
          onClick={() => { soundEffects.playClick(); navigate('/generate/workout'); }}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
          style={{ background: `linear-gradient(135deg, ${teal} 0%, ${gold} 100%)` }}
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        {sortedPrograms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: `${teal}15` }}>
              <Dumbbell size={40} style={{ color: teal }} />
            </div>
            <h3 className={`font-black text-lg mb-2 ${textMain}`}>هنوز برنامه‌ای نساخته‌اید</h3>
            <p className={`text-sm ${textSub} mb-6 max-w-xs leading-6`}>
              با یک کلیک، برنامه تمرینی اختصاصی خود را به‌صورت آفلاین تولید کنید
            </p>
            <button
              onClick={() => { soundEffects.playClick(); navigate('/generate/workout'); }}
              className="px-6 py-3.5 rounded-2xl font-black text-white shadow-lg active:scale-95 transition-all flex items-center gap-2"
              style={{ background: `linear-gradient(135deg, ${teal} 0%, ${gold} 100%)` }}
            >
              <Sparkles size={20} />
              تولید برنامه تمرینی
            </button>
          </div>
        ) : (
          sortedPrograms.map((program) => {
            const isActive = program.id === state.activeProgram;
            const dayCount = (program as any).days?.length || 0;
            const exerciseCount = (program as any).days?.reduce(
              (acc: number, d: any) => acc + (d.exercises?.length || 0), 0
            ) || 0;
            const goalLabel = getGoalLabel(program);

            return (
              <div
                key={program.id}
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
                        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${teal}20` }}
                      >
                        <Dumbbell size={26} style={{ color: teal }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-black text-base truncate ${textMain}`}>{program.name}</h3>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${teal}15`, color: teal }}>
                            {goalLabel}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                            {program.duration || '—'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isActive && (
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: `${gold}20`, color: gold }}>
                        فعال
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className={`p-2.5 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <Calendar size={14} className="mx-auto mb-1" style={{ color: teal }} />
                      <p className={`text-sm font-black ${textMain}`}>{toPersianNumber(dayCount)}</p>
                      <p className={`text-[9px] ${textSub}`}>روز تمرین</p>
                    </div>
                    <div className={`p-2.5 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <Target size={14} className="mx-auto mb-1" style={{ color: teal }} />
                      <p className={`text-sm font-black ${textMain}`}>{toPersianNumber(exerciseCount)}</p>
                      <p className={`text-[9px] ${textSub}`}>حرکت</p>
                    </div>
                    <div className={`p-2.5 rounded-xl text-center ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <Clock size={14} className="mx-auto mb-1" style={{ color: teal }} />
                      <p className={`text-sm font-black ${textMain}`}>{toPersianNumber(program.trainingDays || 0)}</p>
                      <p className={`text-[9px] ${textSub}`}>روز/هفته</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      onClick={() => { soundEffects.playClick(); navigate(`/program/${program.id}`); }}
                      className={`py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all ${isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      <Eye size={16} />
                      جزئیات برنامه
                    </button>
                    {!isActive ? (
                      <button
                        onClick={() => { soundEffects.playClick(); setActiveProgram(program.id); }}
                        className="py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white active:scale-95 transition-all"
                        style={{ background: teal }}
                      >
                        <CheckCircle2 size={16} />
                        فعال‌سازی
                      </button>
                    ) : (
                      <button
                        onClick={() => { soundEffects.playClick(); navigate(`/program/${program.id}`); }}
                        className="py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-black active:scale-95 transition-all"
                        style={{ background: gold }}
                      >
                        <Play size={16} />
                        شروع تمرین
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setConfirmDelete(program.id)}
                    className={`w-full py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
                      isDark ? 'text-red-400' : 'text-red-500'
                    }`}
                  >
                    <Trash2 size={12} />
                    حذف برنامه
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setConfirmDelete(null)}>
          <div className={`rounded-2xl p-5 max-w-sm w-full ${cardBg}`} onClick={(e) => e.stopPropagation()}>
            <Trash2 size={40} className="text-red-500 mx-auto mb-3" />
            <h3 className={`font-black text-lg text-center mb-2 ${textMain}`}>حذف برنامه؟</h3>
            <p className={`text-xs text-center mb-5 ${textSub}`}>
              آیا مطمئن هستید؟ این عمل قابل بازگشت نیست.
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

function getGoalLabel(program: any): string {
  const name = (program.name || '').toLowerCase();
  if (name.includes('حجم')) return 'حجم عضلانی';
  if (name.includes('قدرت')) return 'قدرت';
  if (name.includes('چربی')) return 'کاهش چربی';
  if (name.includes('بازترکیب')) return 'بازترکیب';
  if (name.includes('مسابقه')) return 'مسابقه';
  return 'تناسب اندام';
}
