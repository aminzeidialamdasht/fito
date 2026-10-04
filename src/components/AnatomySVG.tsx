import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

// رنگ‌های اختصاصی و زنده برای هر گروه عضلانی
const MUSCLE_COLORS: Record<string, string> = {
  chest: '#3b82f6',        // آبی روشن
  shoulders: '#ef4444',    // قرمز
  biceps: '#f59e0b',       // نارنجی
  triceps: '#d97706',      // نارنجی تیره
  forearms: '#eab308',     // زرد
  abs: '#10b981',          // سبز زمردی
  quads: '#8b5cf6',        // بنفش
  calves: '#a78bfa',       // فیروزه‌ای
  traps: '#ec4899',        // صورتی
  lats: '#06b6d4',         // آبی آسمانی
  glutes: '#d946ef',       // ارغوانی
  hamstrings: '#6366f1',   // نیلی
};

export default function AnatomySVG() {
  const { sessions } = useAppContext();
  const { theme } = useTheme();
  const [view, setView] = useState<'front' | 'back'>('front');
  const isDark = theme === 'dark';

  // محاسبه حجم تمرین
  const muscleStats = useMemo(() => {
    const stats: Record<string, number> = {};
    const completedSessions = sessions.filter(s => s.completed);

    completedSessions.forEach(session => {
      session.sets.filter(s => s.completed).forEach(set => {
        const name = set.exerciseName.toLowerCase();
        
        if (name.includes('پرس سینه') || name.includes('فلای') || name.includes('قفسه')) stats['chest'] = (stats['chest'] || 0) + 1;
        else if (name.includes('پرس سرشانه') || name.includes('نشر')) stats['shoulders'] = (stats['shoulders'] || 0) + 1;
        else if (name.includes('جلوبازو')) stats['biceps'] = (stats['biceps'] || 0) + 1;
        else if (name.includes('پشت بازو')) stats['triceps'] = (stats['triceps'] || 0) + 1;
        else if (name.includes('ساعد') || name.includes('مچ')) stats['forearms'] = (stats['forearms'] || 0) + 1;
        else if (name.includes('کرانچ') || name.includes('شکم') || name.includes('پلانک')) stats['abs'] = (stats['abs'] || 0) + 1;
        else if (name.includes('اسکوات') || name.includes('پرس پا') || name.includes('لانژ') || name.includes('جلوران')) stats['quads'] = (stats['quads'] || 0) + 1;
        else if (name.includes('ساق')) stats['calves'] = (stats['calves'] || 0) + 1;
        else if (name.includes('شراگ') || name.includes('کول')) stats['traps'] = (stats['traps'] || 0) + 1;
        else if (name.includes('لت') || name.includes('بارفیکس') || name.includes('زیربغل') || name.includes('خم')) stats['lats'] = (stats['lats'] || 0) + 1;
        else if (name.includes('هیپ') || name.includes('باسن') || name.includes('گلوت')) stats['glutes'] = (stats['glutes'] || 0) + 1;
        else if (name.includes('پشت ران') || name.includes('ددلیفت') || name.includes('همسترینگ')) stats['hamstrings'] = (stats['hamstrings'] || 0) + 1;
      });
    });
    return stats;
  }, [sessions]);

  const maxVol = Math.max(...Object.values(muscleStats), 1);

  // تابع استایل‌دهی هوشمند
  const getMuscleStyle = (id: string) => {
    const vol = muscleStats[id] || 0;
    const baseColor = MUSCLE_COLORS[id] || '#94a3b8';
    
    if (vol === 0) return { fill: isDark ? '#334155' : '#cbd5e1', opacity: 0.4 }; 
    
    const intensity = Math.min(1, vol / (maxVol * 0.6));
    return { 
      fill: baseColor, 
      opacity: 0.5 + (intensity * 0.5),
      filter: `drop-shadow(0 0 ${2 + intensity * 4}px ${baseColor})`
    };
  };

  return (
    <div className="flex flex-col h-full">
      {/* هدر کارت */}
      <div className="flex items-center justify-between mb-2 px-1 shrink-0">
        <h3 className={`font-bold text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          نقشه حرارتی بدن
        </h3>
        <div className={`flex p-1 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
          <button
            onClick={() => setView('front')}
            className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${
              view === 'front' ? 'bg-violet-500 text-white shadow-sm' : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            روبرو
          </button>
          <button
            onClick={() => setView('back')}
            className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${
              view === 'back' ? 'bg-violet-500 text-white shadow-sm' : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            پشت
          </button>
        </div>
      </div>

      {/* ناحیه SVG - با overflow-hidden برای جلوگیری از بیرون زدگی */}
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden min-h-0 py-2">
        <svg viewBox="0 0 200 420" className="w-full h-full max-h-[380px] drop-shadow-lg">
          {view === 'front' ? (
            <g id="front-view">
              {/* سر */}
              <circle cx="100" cy="35" r="20" fill={isDark ? '#475569' : '#94a3b8'} opacity="0.6" />
              
              {/* کول (Traps) - حالت ذوزنقه‌ای پهن */}
              <path d="M 75 52 Q 100 60 125 52 L 115 72 Q 100 78 85 72 Z" style={getMuscleStyle('traps')} />
              
              {/* سرشانه‌ها (Deltoids) - گرد و برجسته */}
              <path d="M 45 58 Q 25 65 30 95 Q 50 100 65 85 L 75 65 Z" style={getMuscleStyle('shoulders')} />
              <path d="M 155 58 Q 175 65 170 95 Q 150 100 135 85 L 125 65 Z" style={getMuscleStyle('shoulders')} />
              
              {/* سینه (Pecs) - پهن و حجیم */}
              <path d="M 75 68 Q 100 75 125 68 L 120 110 Q 100 120 80 110 Z" style={getMuscleStyle('chest')} />
              
              {/* جلوبازو (Biceps) - انحنای بیرونی */}
              <path d="M 30 95 Q 15 120 25 145 Q 45 150 55 120 Z" style={getMuscleStyle('biceps')} />
              <path d="M 170 95 Q 185 120 175 145 Q 155 150 145 120 Z" style={getMuscleStyle('biceps')} />
              
              {/* ساعد (Forearms) - باریک‌تر شونده */}
              <path d="M 25 145 Q 20 180 30 195 Q 45 195 50 160 Z" style={getMuscleStyle('forearms')} />
              <path d="M 175 145 Q 180 180 170 195 Q 155 195 150 160 Z" style={getMuscleStyle('forearms')} />
              
              {/* شکم (Abs) - خط کمر مشخص */}
              <path d="M 82 112 L 118 112 L 112 170 L 88 170 Z" style={getMuscleStyle('abs')} />
              
              {/* چهارسر (Quads) - ران‌های حجیم و گرد */}
              <path d="M 80 175 Q 65 220 70 270 Q 90 275 95 220 Z" style={getMuscleStyle('quads')} />
              <path d="M 120 175 Q 135 220 130 270 Q 110 275 105 220 Z" style={getMuscleStyle('quads')} />
              
              {/* ساق (Calves) - انحنای ماهیچه ساق */}
              <path d="M 72 280 Q 60 320 75 360 Q 85 360 85 320 Z" style={getMuscleStyle('calves')} />
              <path d="M 128 280 Q 140 320 125 360 Q 115 360 115 320 Z" style={getMuscleStyle('calves')} />
            </g>
          ) : (
            <g id="back-view">
              {/* سر */}
              <circle cx="100" cy="35" r="20" fill={isDark ? '#475569' : '#94a3b8'} opacity="0.6" />
              
              {/* کول پشت - بسیار پهن */}
              <path d="M 70 52 Q 100 65 130 52 L 120 85 Q 100 95 80 85 Z" style={getMuscleStyle('traps')} />
              
              {/* پشت سرشانه */}
              <path d="M 40 58 Q 20 70 35 95 Q 55 100 70 80 Z" style={getMuscleStyle('shoulders')} />
              <path d="M 160 58 Q 180 70 165 95 Q 145 100 130 80 Z" style={getMuscleStyle('shoulders')} />
              
              {/* زیربغل (Lats) - شکل V */}
              <path d="M 70 85 Q 50 130 65 160 L 135 160 Q 150 130 130 85 Z" style={getMuscleStyle('lats')} />
              
              {/* پشت بازو (Triceps) */}
              <path d="M 35 95 Q 20 125 30 145 Q 50 150 60 120 Z" style={getMuscleStyle('triceps')} />
              <path d="M 165 95 Q 180 125 170 145 Q 150 150 140 120 Z" style={getMuscleStyle('triceps')} />
              
              {/* ساعد پشت */}
              <path d="M 30 145 Q 25 180 35 195 Q 50 195 55 160 Z" style={getMuscleStyle('forearms')} />
              <path d="M 170 145 Q 175 180 165 195 Q 150 195 145 160 Z" style={getMuscleStyle('forearms')} />
              
              {/* باسن (Glutes) - گرد و برجسته */}
              <path d="M 75 160 Q 60 190 80 200 L 120 200 Q 140 190 125 160 Z" style={getMuscleStyle('glutes')} />
              
              {/* همسترینگ */}
              <path d="M 78 205 Q 65 240 72 270 Q 90 270 92 240 Z" style={getMuscleStyle('hamstrings')} />
              <path d="M 122 205 Q 135 240 128 270 Q 110 270 108 240 Z" style={getMuscleStyle('hamstrings')} />
              
              {/* ساق پشت */}
              <path d="M 74 280 Q 62 320 76 360 Q 86 360 86 320 Z" style={getMuscleStyle('calves')} />
              <path d="M 126 280 Q 138 320 124 360 Q 114 360 114 320 Z" style={getMuscleStyle('calves')} />
            </g>
          )}
        </svg>
      </div>

      {/* راهنمای رنگ‌ها */}
      <div className="mt-auto pt-2 flex flex-wrap justify-center gap-2 px-2 shrink-0">
        {Object.entries(muscleStats)
          .filter(([_, vol]) => vol > 0)
          .slice(0, 3)
          .map(([id, vol]) => (
            <div 
              key={id} 
              className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-lg border ${
                isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white border-gray-200 text-gray-700'
              }`}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MUSCLE_COLORS[id] }} />
              <span>{vol} ست</span>
            </div>
          ))}
      </div>
    </div>
  );
}
