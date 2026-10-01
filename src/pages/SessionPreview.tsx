import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Clock, Layers, Repeat } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { toPersianNumber } from '../utils/jalali';

export default function SessionPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { programs, sessions } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // پیدا کردن جلسه بر اساس ID
  const session = sessions.find(s => s.id === id);
  
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        جلسه تمرینی یافت نشد!
      </div>
    );
  }

  const completedSets = session.sets.filter(s => s.completed).length;
  const totalSets = session.sets.length;
  const estimatedTime = Math.ceil(totalSets * 1.5); // تخمین 1.5 دقیقه برای هر ست

  const handleStart = () => {
    navigate(`/tracker/${id}`);
  };

  return (
    <div className={`min-h-screen pb-24 ${isDark ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      {/* هدر */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-opacity-90 border-b px-4 py-3 flex items-center gap-3"
           style={{ backgroundColor: isDark ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.9)', borderColor: isDark ? '#334155' : '#e2e8f0' }}>
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5">
          <ChevronLeft size={24} className={isDark ? 'text-white' : 'text-gray-800'} />
        </button>
        <h1 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {session.name || 'جلسه تمرینی'}
        </h1>
      </div>

      <div className="p-4 space-y-4">
        {/* کارت خلاصه جلسه */}
        <div className={`rounded-2xl p-5 border ${isDark ? 'bg-[#1e293b] border-white/5' : 'bg-white border-teal-100'}`}>
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <div className="flex items-center justify-center gap-1 mb-1 text-teal-500">
                <Layers size={16} />
                <span className="text-xs font-bold">حرکات</span>
              </div>
              <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {toPersianNumber(new Set(session.sets.map(s => s.exerciseName)).size)}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1 text-amber-500">
                <Repeat size={16} />
                <span className="text-xs font-bold">ست‌ها</span>
              </div>
              <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {toPersianNumber(totalSets)}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1 text-blue-500">
                <Clock size={16} />
                <span className="text-xs font-bold">زمان</span>
              </div>
              <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ~{toPersianNumber(estimatedTime)} د
              </p>
            </div>
          </div>
          
          {completedSets > 0 && (
            <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
              <div 
                className="h-full bg-teal-500 transition-all duration-500"
                style={{ width: `${(completedSets / totalSets) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* لیست حرکات */}
        <div className="space-y-3">
          <h3 className={`font-bold text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>برنامه امروز:</h3>
          {[...new Map(session.sets.map(s => [s.exerciseName, s])).values()].map((set, idx) => (
            <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border ${
              isDark ? 'bg-[#1e293b] border-white/5' : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-50 text-teal-700'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {set.exerciseName}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {set.targetReps ? `${toPersianNumber(set.targetReps)} تکرار` : 'تکرار آزاد'}
                  </p>
                </div>
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded-md ${
                isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                {session.sets.filter(s => s.exerciseName === set.exerciseName).length} ست
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* دکمه شروع شناور */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t backdrop-blur-md"
           style={{ backgroundColor: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)', borderColor: isDark ? '#334155' : '#e2e8f0' }}>
        <button 
          onClick={handleStart}
          className="w-full py-4 rounded-2xl font-black text-lg text-white shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' }}
        >
          <Play size={20} fill="currentColor" />
          شروع جلسه تمرینی
        </button>
      </div>
    </div>
  );
}
