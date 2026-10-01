import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import frontImg from '../assets/front-anatomy.png';
import backImg from '../assets/back-anatomy.png';

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
  const gold = isDark ? '#d4af37' : '#f59e0b';

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
    <div className="relative w-full max-w-[300px] mx-auto aspect-[1/2.2] select-none">
      <img 
        src={view === 'front' ? frontImg : backImg} 
        alt={`${view} anatomy`}
        className="w-full h-full object-contain drop-shadow-lg"
      />

      <div className="absolute inset-0 mix-blend-multiply opacity-80 pointer-events-none">
        {currentZones.map(zone => {
          const vol = muscleStats[zone.id] || 0;
          if (vol === 0) return null;
          
          const intensity = Math.min(1, vol / (maxVol * 0.6));
          
          return (
            <div
              key={zone.id}
              className="absolute rounded-full blur-md transition-all duration-700"
              style={{
                top: `${zone.top}%`,
                left: `${zone.left}%`,
                width: `${zone.w}%`,
                height: `${zone.h}%`,
                background: `radial-gradient(circle, ${gold} ${intensity * 100}%, transparent 70%)`,
              }}
              title={`${zone.label}: ${vol} ست`}
            />
          );
        })}
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
        <button 
          onClick={() => setView('front')}
          className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors ${view === 'front' ? 'bg-white text-black' : 'text-white/70'}`}
        >
          روبرو
        </button>
        <button 
          onClick={() => setView('back')}
          className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors ${view === 'back' ? 'bg-white text-black' : 'text-white/70'}`}
        >
          پشت
        </button>
      </div>
    </div>
  );
}
