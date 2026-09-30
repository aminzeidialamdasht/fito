import { useMemo, useState } from 'react';
import {
  BarChart3, Plus, Trophy, TrendingUp, Save, Dumbbell, Scale,
  Activity, Clock, Bell, Brain, Ruler
} from 'lucide-react';
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { ProgressEntry } from '../types';
import { formatDateJalali, toPersianNumber, getProgramTimelineDetails } from '../utils/jalali';

type MeasurementKey = 'weight' | 'chest' | 'waist' | 'hips' | 'arms' | 'thighs' | 'calves' | 'shoulders' | 'neck';

export default function Progress() {
  const { state, programs, sessions, progress, activeProfile, addProgress } = useAppContext();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const activeProgram = programs.find(p => p.id === state.activeProgram);
  const activeProgramTimeline = activeProgram
    ? getProgramTimelineDetails(activeProgram.startDate, activeProgram.duration, activeProgram.createdAt)
    : null;
  const [showForm, setShowForm] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [form, setForm] = useState({
    weight: 0, chest: 0, waist: 0, hips: 0, arms: 0, thighs: 0, calves: 0, shoulders: 0, neck: 0, notes: ''
  });

  const completedSessions = useMemo(() => sessions.filter(s => s.completed), [sessions]);
  const totalVolume = completedSessions.reduce((sum, s) => sum + s.totalVolume, 0);
  const avgVolume = completedSessions.length ? Math.round(totalVolume / completedSessions.length) : 0;
  const weightChange = progress.length >= 2 ? progress[progress.length - 1].weight - progress[0].weight : 0;

  const availableExercises = useMemo(() => {
    const set = new Set<string>();
    completedSessions.forEach(s => s.sets.filter(x => x.completed).forEach(x => set.add(x.exerciseName)));
    const list = Array.from(set);
    return list.length ? list : ['پرس سینه', 'اسکوات با هالتر', 'ددلیفت'];
  }, [completedSessions]);

  const currentExercise = selectedExercise || availableExercises[0];

  const exerciseChartData = useMemo(() => {
    const history: { date: string; weight: number }[] = [];
    [...completedSessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(session => {
      const sets = session.sets.filter(s => s.completed && s.exerciseName === currentExercise);
      if (sets.length > 0) {
        const maxSet = sets.reduce((prev, curr) => (curr.weight > prev.weight ? curr : prev), sets[0]);
        history.push({ date: formatDateJalali(session.date), weight: maxSet.weight });
      }
    });
    return history;
  }, [completedSessions, currentExercise]);

  const sortedProgress = useMemo(() =>
    [...progress].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [progress]);

  const weightChartData = useMemo(() =>
    sortedProgress.filter(e => e.weight > 0).map(e => ({
      date: formatDateJalali(e.date), weight: e.weight,
    })), [sortedProgress]);

  const radarData = useMemo(() => {
    const keys: MeasurementKey[] = ['chest', 'arms', 'thighs', 'waist', 'hips', 'neck'];
    const labels: Record<string, string> = {
      chest: 'سینه', arms: 'بازو', thighs: 'ران', waist: 'کمر', hips: 'باسن', neck: 'گردن',
    };
    const latest = sortedProgress[sortedProgress.length - 1];
    const prev = sortedProgress.length >= 2 ? sortedProgress[sortedProgress.length - 2] : null;
    if (!latest?.measurements) {
      return keys.map(k => ({ subject: labels[k], current: 0, previous: 0 }));
    }
    return keys.map(k => ({
      subject: labels[k],
      current: (latest.measurements as any)?.[k] || 0,
      previous: prev ? ((prev.measurements as any)?.[k] || 0) : 0,
    }));
  }, [sortedProgress]);

  const hasRadarData = radarData.some(d => d.current > 0);

  const save = () => {
    if (!activeProfile) return;
    addProgress({
      id: uuidv4(),
      profileId: activeProfile.id,
      date: new Date().toISOString(),
      weight: form.weight || activeProfile.weight || 0,
      measurements: {
        chest: form.chest || undefined,
        waist: form.waist || undefined,
        hips: form.hips || undefined,
        arms: form.arms || undefined,
        thighs: form.thighs || undefined,
        calves: form.calves || undefined,
        shoulders: form.shoulders || undefined,
        neck: form.neck || undefined,
      },
      notes: form.notes,
    });
    setShowForm(false);
    setForm({ weight: 0, chest: 0, waist: 0, hips: 0, arms: 0, thighs: 0, calves: 0, shoulders: 0, neck: 0, notes: '' });
  };

  const card = isDark ? 'bg-[#1a1a2e] border border-white/5' : 'bg-white border border-[#14b8a6]/15 shadow-sm';
  const accent = isDark ? 'text-[#d4af37]' : 'text-[#0d9488]';
  const accentBg = isDark ? 'bg-[#d4af37]' : 'bg-[#14b8a6]';

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
            <Trophy size={22} className={accent} /> پیگیری پیشرفت
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-teal-700/60'}`}>
            بدن‌سازی · پیشرفت مداوم، انگیزه همیشگی
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm text-black ${accentBg} shadow-lg active:scale-95 transition-transform`}
        >
          <Plus size={16} /> ثبت اندازه‌گیری
        </button>
      </div>

      {activeProgram && activeProgramTimeline && (
        <div className={`rounded-2xl p-5 ${card}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#d4af37]/15 text-[#d4af37]' : 'bg-[#14b8a6]/15 text-[#0d9488]'}`}>
                <Clock size={22} />
              </div>
              <div>
                <span className={`text-xs font-bold ${accent}`}>برنامه تمرینی فعال</span>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>{activeProgram.name}</h3>
              </div>
            </div>
            <button onClick={() => navigate('/import')} className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${isDark ? 'border-gray-700 text-gray-300' : 'border-teal-200 text-[#0d9488]'}`}>
              تغییر برنامه
            </button>
          </div>
          {activeProgramTimeline.isAlarmRequired && (
            <div className={`mb-4 rounded-xl p-4 border flex items-center justify-between gap-3 ${isDark ? 'bg-amber-500/15 border-amber-500/40 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-900'}`}>
              <div className="flex items-center gap-3">
                <Bell size={22} className="text-amber-500 shrink-0" />
                <p className="text-xs font-bold">هشدار پایان برنامه — {toPersianNumber(Math.max(0, activeProgramTimeline.daysRemaining))} روز باقی‌مانده</p>
              </div>
              <button onClick={() => navigate('/prompt')} className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 text-black flex items-center gap-1">
                <Brain size={14} /> پرامپت جدید
              </button>
            </div>
          )}
          <div className="flex justify-between text-xs font-bold mb-1">
            <span className="text-gray-400">پیشرفت برنامه</span>
            <span className={accent}>{toPersianNumber(activeProgramTimeline.progressPercent)}٪</span>
          </div>
          <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className={`h-full rounded-full ${activeProgramTimeline.isAlarmRequired ? 'bg-amber-500' : (isDark ? 'bg-[#d4af37]' : 'bg-[#14b8a6]')}`} style={{ width: `${activeProgramTimeline.progressPercent}%` }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['جلسات کامل', completedSessions.length, isDark ? 'text-[#4a90d9]' : 'text-blue-600'],
          ['میانگین حجم', `${avgVolume} kg`, 'text-green-500'],
          ['تغییر وزن', `${weightChange >= 0 ? '+' : ''}${weightChange.toFixed(1)} kg`, weightChange >= 0 ? 'text-amber-500' : 'text-blue-500'],
          ['حرکات', availableExercises.length, accent],
        ].map(([label, value, color]) => (
          <div key={String(label)} className={`rounded-xl p-4 ${card}`}>
            <p className="text-gray-400 text-xs mb-1">{label}</p>
            <p className={`text-2xl font-black ${color}`}>{toPersianNumber(String(value))}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className={`rounded-2xl p-5 ${card}`}>
          <h3 className={`font-bold mb-4 ${accent}`}>ثبت اندازه‌گیری جدید</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {([['weight','وزن','kg'],['chest','سینه','cm'],['waist','کمر','cm'],['hips','باسن','cm'],['arms','بازو','cm'],['thighs','ران','cm'],['calves','ساق','cm'],['shoulders','شانه','cm'],['neck','گردن','cm']] as const).map(([key, label, unit]) => (
              <label key={key} className="text-xs text-gray-400">
                {label} ({unit})
                <input type="number" value={(form as any)[key] || ''} onChange={e => setForm({ ...form, [key]: Number(e.target.value) })}
                  className={`mt-1 w-full rounded-lg px-3 py-2 ${isDark ? 'bg-[#0d0d1a] text-white border border-white/10' : 'bg-gray-50 border'}`} />
              </label>
            ))}
          </div>
          <button onClick={save} className="mt-4 px-5 py-2.5 rounded-xl font-bold bg-green-500 text-white flex items-center gap-2">
            <Save size={16} /> ذخیره
          </button>
        </div>
      )}

      <div className={`rounded-2xl p-5 ${card}`}>
        <h3 className={`font-bold flex items-center gap-2 mb-4 ${accent}`}><TrendingUp size={18} /> روند وزن</h3>
        {weightChartData.length < 2 ? (
          <div className="text-center py-8 text-gray-500">
            <Scale size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">حداقل دو اندازه‌گیری لازم است.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weightChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? '#d4af37' : '#14b8a6'} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={isDark ? '#d4af37' : '#14b8a6'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#e5e7eb'} />
              <XAxis dataKey="date" stroke={isDark ? '#888' : '#6b7280'} fontSize={10} />
              <YAxis stroke={isDark ? '#888' : '#6b7280'} fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip contentStyle={{ background: isDark ? '#1a1a2e' : '#fff', border: 'none', borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="weight" stroke={isDark ? '#d4af37' : '#14b8a6'} strokeWidth={2.5} fill="url(#wg)" dot={{ r: 4, fill: isDark ? '#d4af37' : '#14b8a6' }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className={`rounded-2xl p-5 ${card}`}>
        <h3 className={`font-bold flex items-center gap-2 mb-2 ${accent}`}><Ruler size={18} /> ارزیابی ابعاد بدن</h3>
        {!hasRadarData ? (
          <div className="text-center py-8 text-gray-500">
            <Activity size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">اندازه‌گیری بدنی ثبت نشده.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke={isDark ? '#333' : '#e5e7eb'} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#aaa' : '#666', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: isDark ? '#666' : '#999', fontSize: 9 }} />
              <Radar name="فعلی" dataKey="current" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.35} strokeWidth={2} />
              {sortedProgress.length >= 2 && (
                <Radar name="قبلی" dataKey="previous" stroke="#d4af37" fill="#d4af37" fillOpacity={0.15} strokeWidth={1.5} strokeDasharray="4 4" />
              )}
              <Tooltip contentStyle={{ background: isDark ? '#1a1a2e' : '#fff', border: 'none', borderRadius: 12, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className={`rounded-2xl p-5 ${card}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold flex items-center gap-2 ${accent}`}><Dumbbell size={18} /> رکورد حرکات</h3>
          <select value={currentExercise} onChange={e => setSelectedExercise(e.target.value)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold border ${isDark ? 'bg-[#0d0d1a] text-white border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
            {availableExercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}
          </select>
        </div>
        {exerciseChartData.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-6">سابقه‌ای ثبت نشده.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={exerciseChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#e5e7eb'} />
              <XAxis dataKey="date" stroke={isDark ? '#888' : '#6b7280'} fontSize={10} />
              <YAxis stroke={isDark ? '#888' : '#6b7280'} fontSize={10} unit=" kg" />
              <Tooltip contentStyle={{ background: isDark ? '#1a1a2e' : '#fff', border: 'none', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="weight" fill={isDark ? '#d4af37' : '#14b8a6'} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className={`rounded-2xl p-5 ${card}`}>
        <h3 className={`font-bold flex items-center gap-2 mb-4 ${accent}`}><BarChart3 size={18} /> آخرین اندازه‌گیری‌ها</h3>
        {sortedProgress.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-4">هنوز ثبت نشده.</p>
        ) : (
          <div className="space-y-2">
            {[...sortedProgress].reverse().slice(0, 6).map(entry => (
              <div key={entry.id} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#d4af37]/15 text-[#d4af37]' : 'bg-[#14b8a6]/15 text-[#0d9488]'}`}>
                    <Scale size={16} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>وزن: {toPersianNumber(entry.weight)} kg</p>
                    <p className="text-[10px] text-gray-500">{formatDateJalali(entry.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
