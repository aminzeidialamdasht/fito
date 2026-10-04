import { Dumbbell, Brain, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { soundEffects } from '../utils/sound';
import { DEFAULT_WORKOUT_PLAN } from '../data/defaultPlans';
import { useAppContext } from '../context/AppContext';
import type { WorkoutProgram } from '../types';

interface Props {
  isDark: boolean;
  isPremium: boolean;
}

export default function SuggestedPrograms({ isDark, isPremium }: Props) {
  const navigate = useNavigate();
  const { state, programs, setActiveProgram, addProgram, activeProfile } = useAppContext();

  // Safe normalization of the sample plan to match WorkoutProgram type
  const normalizedSamplePlan: WorkoutProgram = {
    id: (DEFAULT_WORKOUT_PLAN as any).id || 'sample-push-pull-legs',
    name: (DEFAULT_WORKOUT_PLAN as any).program_name || (DEFAULT_WORKOUT_PLAN as any).name || 'برنامه پوش/پول/لگ',
    profileId: '', // Will be set dynamically when adding
    duration: (DEFAULT_WORKOUT_PLAN as any).duration || '۴ هفته',
    createdAt: new Date().toISOString(),
    days: (DEFAULT_WORKOUT_PLAN as any).days || [],
    ...(DEFAULT_WORKOUT_PLAN as any), // Spread rest of properties
  };

  const handleStartSample = () => {
    soundEffects.playClick();
    
    if (!activeProfile) {
      alert('لطفاً ابتدا یک پروفایل بسازید.');
      navigate('/profile');
      return;
    }

    // Generate unique ID per profile to avoid conflicts
    const sampleId = `${normalizedSamplePlan.id}_${activeProfile.id}`;
    
    const existingSample = programs.find(p => p.id === sampleId);

    if (!existingSample) {
      const sampleWithProfile: WorkoutProgram = {
        ...normalizedSamplePlan,
        id: sampleId,
        profileId: activeProfile.id,
      };
      addProgram(sampleWithProfile);
      setActiveProgram(sampleId);
    } else {
      setActiveProgram(existingSample.id);
    }

    navigate('/workout?day=0&autoStart=true');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className={`font-black text-lg flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <Sparkles size={18} className={isDark ? 'text-[#d4af37]' : 'text-violet-500'} />
          برنامه‌های پیشنهادی
        </h2>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
        }`}>رایگان</span>
      </div>
      <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        این برنامه‌ها برای همه باز است. برای برنامه اختصاصی با هوش مصنوعی، اشتراک تهیه کنید.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Sample Program Card */}
        <div className={`rounded-2xl p-4 border ${
          isDark ? 'bg-[#1a1830] border-white/5' : 'bg-white border-violet-100 shadow-sm'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isDark ? 'bg-[#d4af37]/15 text-[#d4af37]' : 'bg-violet-100 text-violet-700'
            }`}>
              <Dumbbell size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {normalizedSamplePlan.name}
              </h3>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                سطح متوسط · {normalizedSamplePlan.duration} ·  روز در هفته
              </p>
              <button
                onClick={handleStartSample}
                className={`mt-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  isDark ? 'bg-[#d4af37]/20 text-[#d4af37] hover:bg-[#d4af37]/30' : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                }`}
              >
                شروع تمرین رایگان
              </button>
            </div>
          </div>
        </div>

        {/* AI Program Card */}
        <div className={`rounded-2xl p-4 border relative overflow-hidden ${
          isDark ? 'bg-[#1a1830] border-[#d4af37]/20' : 'bg-white border-amber-200 shadow-sm'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isDark ? 'bg-indigo-500/15 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
            }`}>
              <Brain size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  برنامه اختصاصی AI
                </h3>
                {!isPremium && (
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                    isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'
                  }`}>ویژه</span>
                )}
              </div>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                بر اساس پروفایل و هدف شما ساخته می‌شود
              </p>
              <button
                onClick={() => { soundEffects.playClick(); navigate('/prompt'); }}
                disabled={!isPremium}
                className={`mt-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  isPremium 
                    ? (isDark ? 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200')
                    : 'bg-gray-500/20 text-gray-400 cursor-not-allowed opacity-60'
                }`}
              >
                {isPremium ? 'ساخت برنامه' : 'نیاز به اشتراک'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
