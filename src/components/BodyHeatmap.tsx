import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import frontImg from '../assets/front-anatomy.png';
import backImg from '../assets/back-anatomy.png';

// رنگ‌های اختصاصی و زنده برای هر عضله
const MUSCLE_COLORS: Record<string, string> = {
  chest: '#3b82f6',        // آبی روشن
  shoulders_front: '#ef4444', // قرمز
  biceps: '#f59e0b',       // نارنجی
  abs: '#10b981',          // سبز زمردی
  quads: '#8b5cf6',        // بنفش
  traps: '#ec4899',        // صورتی
  lats: '#06b6d4',         // فیروزه‌ای
  rear_delts: '#f97316',   // نارنجی پررنگ
  glutes: '#d946ef',       // ارغوانی
  hamstrings: '#6366f1',   // نیلی
  calves: '#14b8a6',       // سبزآبی
};

const MUSCLE_ZONES = {
  front: [
    { id: 'chest', label: 'سینه', top: 18, left: 22, w: 56, h: 12 },
    { id: 'abs', label: 'شکم', top: 32, left: 38, w: 24, h: 18 },
    { id: 'quads', label: 'چهارسر', top: 52, left: 25, w: 50, h: 25 },
    { id: 'shoulders_front', label: 'سرشانه', top: 12, left: 15, w: 70, h: 10 },
    { id: 'biceps', label: 'جلوبازو', top: 25, left: 5, w: 15, h: 15 },
  ],
  back: [
    { id: 'traps', label: 'کول', top: 8, left: 30, w: 40, h: 12 },
    { id: 'lats', label: 'زیربغل', top: 20, left: 20, w: 60, h: 20 },
    { id: 'glutes', label: 'باسن', top: 42, left: 25, w: 50, h: 12 },
    { id: 'hamstrings', label: 'همسترینگ', top: 55, left: 25, w: 50, h: 20 },
    { id: 'calves', label: 'ساق', top: 78, left: 30, w: 40, h: 15 },
    { id: 'rear_delts', label: 'پشت سرشانه', top: 12, left: 15, w: 70, h: 8 },
  ]
};

export default function BodyHeatmap() {
  const { sessions } = useAppContext();
  const { theme } = useTheme();
  const [view, setView] = useState<'front' | 'back'>('front');
  const isDark = theme === 'dark';

  const muscleStats = useMemo(() => {
    const stats: Record<string, number> = {};
    const completedSessions = sessions.filter(s => s.completed);

    completedSessions.forEach(session => {
      session.sets.filter(s => s.completed).forEach(set => {
        const name = set.exerciseName.toLowerCase();
        if (name.includes('پرس سینه') || name.includes('فلای') || name.includes('قفسه')) stats['chest'] = (stats['chest'] || 0) + 1;
        else if (name.includes('کرانچ') || name.includes('شکم') || name.includes('پلانک')) stats['abs'] = (stats['abs'] || 0) + 1;
        else if (name.includes('اسکوات') || name.includes('پرس پا') || name.includes('لانژ') || name.includes('جلوران')) stats['quads'] = (stats['quads'] || 0) + 1;
        else if (name.includes('پرس سرشانه') || name.includes('نشر جلو')) stats['shoulders_front'] = (stats['shoulders_front'] || 0) + 1;
        else if (name.includes('جلوبازو')) stats['biceps'] = (stats['biceps'] || 0) + 1;
        else if (name.includes('شراگ') || name.includes('کول')) stats['traps'] = (stats['traps'] || 0) + 1;
        else if (name.includes('لت') || name.includes('بارفیکس') || name.includes('زیربغل')) stats['lats'] = (stats['lats'] || 0) + 1;
        else if (name.includes('هیپ') || name.includes('باسن') || name.includes('گلوت')) stats['glutes'] = (stats['glutes'] || 0) + 1;
        else if (name.includes('پشت ران') || name.includes('ددلیفت') || name.includes('همسترینگ')) stats['hamstrings'] = (stats['hamstrings'] || 0) + 1;
        else if (name.includes('ساق')) stats['calves'] = (stats['calves'] || 0) + 1;
        else if (name.includes('نشر خم') || name.includes('فیس پول')) stats['rear_delts'] = (stats['rear_delts'] || 0) + 1;
      });
    });
    return stats;
  }, [sessions]);

  const maxVol = Math.max(...Object.values(muscleStats), 1);
  const currentZones = view === 'front' ? MUSCLE_ZONES.front : MUSCLE_ZONES.back;

  return (
    <div className="flex flex-col h-full">
      {/* هدر کارت: عنوان + دکمه‌های Toggle */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className={`font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          نقشه حرارتی بدن
        </h3>
        <div className={`flex p-1 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
          <button
            onClick={() => setView('front')}
            className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${
              view === 'front' ? 'bg-teal-500 text-white shadow-sm' : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            روبرو
          </button>
          <button
            onClick={() => setView('back')}
            className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${
              view === 'back' ? 'bg-teal-500 text-white shadow-sm' : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            پشت
          </button>
        </div>
      </div>

      {/* بدنه اصلی: تصویر + لایه‌های رنگی */}
      <div className="relative flex-1 flex items-center justify-center min-h-[300px]">
        <div className="relative w-full max-w-[240px] aspect-[1/2.2] select-none">
          <img
            src={view === 'front' ? frontImg : backImg}
            alt="anatomy"
            className="w-full h-full object-contain drop-shadow-xl"
            style={{ filter: isDark ? 'brightness(0.9)' : 'none' }}
          />

          {/* لایه‌های رنگی عضلات - تکنیک Radial Gradient داخلی */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            {currentZones.map(zone => {
              const vol = muscleStats[zone.id] || 0;
              if (vol === 0) return null;

              const intensity = Math.min(1, vol / (maxVol * 0.5));
              const color = MUSCLE_COLORS[zone.id] || '#14b8a6';

              return (
                <div
                  key={zone.id}
                  className="absolute transition-all duration-700 ease-out"
                  style={{
                    top: `${zone.top}%`,
                    left: `${zone.left}%`,
                    width: `${zone.w}%`,
                    height: `${zone.h}%`,
                    // استفاده از گرادینت شعاعی برای محو شدن لبه‌ها به سمت خارج
                    background: `radial-gradient(circle at center, ${color}${Math.round(intensity * 90).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
                    mixBlendMode: 'multiply', // فقط برای ترکیب بهتر با بافت عضله (روی سفید کار نمی‌کند اما روی خاکستری بله)
                    opacity: 0.9,
                  }}
                  title={`${zone.label}: ${vol} ست`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* فوتر: راهنمای رنگ‌ها (فقط عضلات فعال) */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 px-2">
        {currentZones
          .filter(z => muscleStats[z.id] > 0)
          .slice(0, 3)
          .map(zone => (
            <div 
              key={zone.id} 
              className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-lg border ${
                isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white border-gray-200 text-gray-700'
              }`}
            >
              <div 
                className="w-2 h-2 rounded-full shadow-sm" 
                style={{ backgroundColor: MUSCLE_COLORS[zone.id] }} 
              />
              <span>{zone.label}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
