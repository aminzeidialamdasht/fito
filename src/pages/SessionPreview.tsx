import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Clock, Layers, Repeat } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { toPersianNumber } from '../utils/jalali';
import {
  estimateWorkoutMinutes,
  getExerciseSetCount,
} from '../utils/programHelpers';

interface SessionSet {
  exerciseId?: string;
  exerciseName: string;
  setNumber: number;
  targetReps?: number | string;
  actualReps?: number;
  weight?: number;
  completed: boolean;
}

interface ExerciseGroup {
  exerciseId: string;
  exerciseName: string;
  sets: SessionSet[];
  targetReps?: number | string;
}

export default function SessionPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sessions } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const session = sessions.find((item) => item.id === id);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        جلسه تمرینی یافت نشد!
      </div>
    );
  }

  const sessionSets = (session.sets || []) as SessionSet[];
  const completedSets = sessionSets.filter((set) => set.completed).length;
  const totalSets = sessionSets.length;
  const exerciseGroups = sessionSets.reduce<ExerciseGroup[]>((groups, set) => {
    const groupId = String(set.exerciseId || `name:${set.exerciseName}`);
    let group = groups.find((item) => item.exerciseId === groupId);

    if (!group) {
      group = {
        exerciseId: groupId,
        exerciseName: set.exerciseName,
        sets: [],
        targetReps: set.targetReps,
      };
      groups.push(group);
    }

    group.sets.push(set);
    return groups;
  }, []);

  const estimatedTime = estimateWorkoutMinutes(
    totalSets,
    90,
    exerciseGroups.length,
  );
  const progressPercent = totalSets > 0
    ? Math.min(100, (completedSets / totalSets) * 100)
    : 0;

  return (
    <div className={`min-h-screen pb-24 ${isDark ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <div
        className="sticky top-0 z-40 backdrop-blur-md bg-opacity-90 border-b px-4 py-3 flex items-center gap-3"
        style={{
          backgroundColor: isDark ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.9)',
          borderColor: isDark ? '#334155' : '#e2e8f0',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="min-h-[44px] min-w-[44px] p-2 rounded-full hover:bg-black/5"
          aria-label="بازگشت"
        >
          <ChevronLeft size={24} className={isDark ? 'text-white' : 'text-gray-800'} />
        </button>
        <h1 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {session.name || 'جلسه تمرینی'}
        </h1>
      </div>

      <div className="p-4 space-y-4">
        <div className={`rounded-2xl p-5 border ${
          isDark ? 'bg-[#1e293b] border-white/5' : 'bg-white border-violet-100'
        }`}>
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <div className="flex items-center justify-center gap-1 mb-1 text-violet-500">
                <Layers size={16} />
                <span className="text-xs font-bold">حرکات</span>
              </div>
              <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {toPersianNumber(exerciseGroups.length)}
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

          {totalSets > 0 && (
            <div
              className="w-full h-2 rounded-full bg-gray-200 overflow-hidden"
              aria-label={`${completedSets} ست از ${totalSets} ست تکمیل شده`}
            >
              <div
                className="h-full bg-violet-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className={`font-bold text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            برنامه امروز:
          </h3>

          {exerciseGroups.map((group, index) => {
            const groupCompleted = group.sets.filter((set) => set.completed).length;
            const groupSetCount = getExerciseSetCount(group.sets);

            return (
              <div
                key={group.exerciseId}
                className={`p-4 rounded-xl border ${
                  isDark ? 'bg-[#1e293b] border-white/5' : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isDark ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-50 text-violet-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className={`font-bold text-sm truncate ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {group.exerciseName}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {group.targetReps
                          ? `${toPersianNumber(group.targetReps)} تکرار`
                          : 'تکرار آزاد'}
                      </p>
                    </div>
                  </div>
                  <div className={`shrink-0 text-xs font-bold px-2 py-1 rounded-md ${
                    isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {toPersianNumber(groupSetCount)} ست
                  </div>
                </div>

                {groupCompleted > 0 && (
                  <div className={`mt-3 text-xs ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>
                    {toPersianNumber(groupCompleted)} از {toPersianNumber(groupSetCount)} ست تکمیل شد
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 p-4 border-t backdrop-blur-md"
        style={{
          backgroundColor: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
          borderColor: isDark ? '#334155' : '#e2e8f0',
        }}
      >
        <button
          onClick={() => navigate(`/tracker/${id}`)}
          className="min-h-[44px] w-full py-4 rounded-2xl font-black text-lg text-white shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)' }}
          aria-label="شروع جلسه تمرینی"
        >
          <Play size={20} fill="currentColor" />
          شروع جلسه تمرینی
        </button>
      </div>
    </div>
  );
}
