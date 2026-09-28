import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { generateWorkoutPrompt, generateSupersetPrompt, generateNutritionPrompt, generateSupplementPrompt } from '../utils/promptGenerator';
import { Brain, Dumbbell, Apple, Pill, Copy, Check, AlertTriangle, Zap } from 'lucide-react';
import { soundEffects } from '../utils/sound';

type PromptType = 'workout' | 'superset' | 'nutrition' | 'supplement';

export default function PromptGenerator() {
  const { activeProfile } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [promptType, setPromptType] = useState<PromptType>('workout');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const [supersetDuration, setSupersetDuration] = useState<number>(30);

  const handleGenerate = () => {
    if (!activeProfile) return;
    soundEffects.playClick();
    
    let prompt = '';
    switch (promptType) {
      case 'workout':
        prompt = generateWorkoutPrompt(activeProfile);
        break;
      case 'superset':
        prompt = generateSupersetPrompt(activeProfile, supersetDuration);
        break;
      case 'nutrition':
        prompt = generateNutritionPrompt(activeProfile);
        break;
      case 'supplement':
        prompt = generateSupplementPrompt(activeProfile);
        break;
    }
    
    setGeneratedPrompt(prompt);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!activeProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle size={48} className={isDark ? 'text-[#f59e0b]' : 'text-[#d97706]'} />
        <h2 className={`text-xl font-bold mt-4 mb-2 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
          پروفایل تکمیل نشده
        </h2>
        <p className={`text-center ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
          لطفاً ابتدا پروفایل ورزشکار را در بخش پروفایل تکمیل کنید
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
        <Brain size={24} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
        تولید پرامپت هوش مصنوعی
      </h2>

      {/* Prompt Type Selector */}
      <div className={`rounded-2xl p-4 border theme-transition ${
        isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'
      }`}>
        <h3 className={`font-bold mb-3 ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
          نوع پرامپت
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => { setPromptType('workout'); soundEffects.playClick(); }}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
              promptType === 'workout'
                ? isDark
                  ? 'bg-[#14b8a6]/20 border-2 border-[#14b8a6] text-[#14b8a6]'
                  : 'bg-[#14b8a6]/15 border-2 border-[#14b8a6] text-[#0d9488]'
                : isDark
                  ? 'bg-[#0d0d1a] border border-gray-700 text-gray-400 hover:border-[#14b8a6]'
                  : 'bg-[#f0fdfa] border border-[#14b8a6]/30 text-[#0f766e]/70 hover:border-[#14b8a6]'
            }`}
          >
            <Dumbbell size={22} />
            <span className="text-xs sm:text-sm font-bold">تمرین استاندارد</span>
          </button>

          <button
            onClick={() => { setPromptType('superset'); soundEffects.playClick(); }}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
              promptType === 'superset'
                ? isDark
                  ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-400'
                  : 'bg-amber-100 border-2 border-amber-500 text-amber-800'
                : isDark
                  ? 'bg-[#0d0d1a] border border-gray-700 text-gray-400 hover:border-amber-500'
                  : 'bg-[#f0fdfa] border border-[#14b8a6]/30 text-[#0f766e]/70 hover:border-amber-500'
            }`}
          >
            <Zap size={22} className="text-amber-500" />
            <span className="text-xs sm:text-sm font-bold">جلسه فشرده سوپرست</span>
          </button>

          <button
            onClick={() => { setPromptType('nutrition'); soundEffects.playClick(); }}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
              promptType === 'nutrition'
                ? isDark
                  ? 'bg-[#14b8a6]/20 border-2 border-[#14b8a6] text-[#14b8a6]'
                  : 'bg-[#14b8a6]/15 border-2 border-[#14b8a6] text-[#0d9488]'
                : isDark
                  ? 'bg-[#0d0d1a] border border-gray-700 text-gray-400 hover:border-[#14b8a6]'
                  : 'bg-[#f0fdfa] border border-[#14b8a6]/30 text-[#0f766e]/70 hover:border-[#14b8a6]'
            }`}
          >
            <Apple size={22} />
            <span className="text-xs sm:text-sm font-bold">تغذیه</span>
          </button>

          <button
            onClick={() => { setPromptType('supplement'); soundEffects.playClick(); }}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
              promptType === 'supplement'
                ? isDark
                  ? 'bg-[#14b8a6]/20 border-2 border-[#14b8a6] text-[#14b8a6]'
                  : 'bg-[#14b8a6]/15 border-2 border-[#14b8a6] text-[#0d9488]'
                : isDark
                  ? 'bg-[#0d0d1a] border border-gray-700 text-gray-400 hover:border-[#14b8a6]'
                  : 'bg-[#f0fdfa] border border-[#14b8a6]/30 text-[#0f766e]/70 hover:border-[#14b8a6]'
            }`}
          >
            <Pill size={22} />
            <span className="text-xs sm:text-sm font-bold">مکمل</span>
          </button>
        </div>
      </div>

      {/* Superset Specific Options */}
      {promptType === 'superset' && (
        <div className={`rounded-2xl p-4 border theme-transition ${
          isDark ? 'bg-amber-950/20 border-amber-500/30' : 'bg-amber-50 border-amber-300'
        }`}>
          <div className="flex items-center gap-2 mb-2 text-amber-500 font-bold">
            <Zap size={18} />
            <span>تنظیمات جلسه فشرده سوپرست</span>
          </div>
          <p className={`text-xs mb-3 ${isDark ? 'text-gray-300' : 'text-amber-900'}`}>
            مخصوص روزهایی که وقت یا انگیزه تمرین طولانی ندارید. برنامه‌ای سریع، پرتراکم و پرانرژی تولید می‌شود.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold">زمان کل جلسه:</span>
            {[20, 30, 45].map((mins) => (
              <button
                key={mins}
                onClick={() => { setSupersetDuration(mins); soundEffects.playClick(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  supersetDuration === mins
                    ? 'bg-amber-500 text-black shadow-md'
                    : isDark
                    ? 'bg-[#0d0d1a] text-gray-300 border border-gray-700'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {mins} دقیقه
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Profile Summary */}
      <div className={`rounded-2xl p-5 border theme-transition ${
        isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'
      }`}>
        <h3 className={`font-bold mb-3 ${isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'}`}>
          خلاصه اطلاعات ارسالی
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
            نام: <span className={isDark ? 'text-white' : 'text-[#134e4a]'}>{activeProfile.name}</span>
          </div>
          <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
            سن: <span className={isDark ? 'text-white' : 'text-[#134e4a]'}>{activeProfile.age} سال</span>
          </div>
          <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
            وزن: <span className={isDark ? 'text-white' : 'text-[#134e4a]'}>{activeProfile.weight} کیلو</span>
          </div>
          <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>
            قد: <span className={isDark ? 'text-white' : 'text-[#134e4a]'}>{activeProfile.height} سانتی‌متر</span>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
          isDark
            ? 'bg-gradient-to-l from-[#14b8a6] to-[#2dd4bf] text-[#0d0d1a] shadow-[#14b8a6]/20 hover:opacity-90'
            : 'bg-gradient-to-l from-[#14b8a6] to-[#0d9488] text-white shadow-[#14b8a6]/20 hover:opacity-90'
        }`}
      >
        🚀 تولید پرامپت حرفه‌ای
      </button>

      {/* Generated Prompt */}
      {generatedPrompt && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className={`font-bold ${isDark ? 'text-[#22c55e]' : 'text-[#059669]'}`}>
              ✅ پرامپت تولید شد
            </h3>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
                isDark
                  ? 'bg-[#22c55e]/20 text-[#22c55e] hover:bg-[#22c55e]/30'
                  : 'bg-[#10b981]/15 text-[#059669] hover:bg-[#10b981]/25'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'کپی شد!' : 'کپی'}
            </button>
          </div>
          
          <div className={`rounded-xl p-4 border max-h-96 overflow-y-auto ${
            isDark ? 'bg-[#0d0d1a] border-gray-700' : 'bg-[#f0fdfa] border-[#14b8a6]/30'
          }`}>
            <pre className={`text-sm whitespace-pre-wrap leading-7 font-vazir ${
              isDark ? 'text-gray-300' : 'text-[#134e4a]'
            }`}>
              {generatedPrompt}
            </pre>
          </div>

          <div className={`rounded-xl p-4 border ${
            isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15'
          }`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}`}>
              💡 <strong>راهنما:</strong> پرامپت بالا را کپی کنید و در ChatGPT، Gemini یا Claude پیست کنید. 
              خروجی JSON دریافتی را می‌توانید در بخش «ورود برنامه» وارد کنید.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
