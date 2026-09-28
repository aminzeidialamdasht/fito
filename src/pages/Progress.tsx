import { useMemo, useState } from 'react';
import { BarChart3, Plus, Trophy, TrendingUp, Save, Dumbbell, Scale, Activity, Calendar as CalendarIcon, Clock, Bell, Brain } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { ProgressEntry } from '../types';
import { formatDateJalali, toPersianNumber, getProgramTimelineDetails } from '../utils/jalali';

type MeasurementKey = 'weight' | 'chest' | 'waist' | 'hips' | 'arms' | 'thighs' | 'calves' | 'shoulders';

const MEASUREMENT_LABELS: Record<MeasurementKey, { label: string; unit: string }> = {
  weight: { label: 'وزن', unit: 'kg' },
  chest: { label: 'دور سینه', unit: 'cm' },
  waist: { label: 'دور کمر', unit: 'cm' },
  hips: { label: 'دور باسن', unit: 'cm' },
  arms: { label: 'دور بازو', unit: 'cm' },
  thighs: { label: 'دور ران', unit: 'cm' },
  calves: { label: 'دور ساق', unit: 'cm' },
  shoulders: { label: 'دور شانه', unit: 'cm' },
};

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
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [selectedMetric, setSelectedMetric] = useState<MeasurementKey>('weight');
  const [form, setForm] = useState({ weight: 0, chest: 0, waist: 0, hips: 0, arms: 0, thighs: 0, calves: 0, shoulders: 0, notes: '' });

  const completedSessions = useMemo(() => sessions.filter(s => s.completed), [sessions]);
  const totalVolume = completedSessions.reduce((sum, s) => sum + s.totalVolume, 0);
  const avgVolume = completedSessions.length ? Math.round(totalVolume / completedSessions.length) : 0;
  const weightChange = progress.length >= 2 ? progress[progress.length - 1].weight - progress[0].weight : 0;

  // List of all exercises recorded in sessions
  const availableExercises = useMemo(() => {
    const set = new Set<string>();
    completedSessions.forEach(s => s.sets.filter(x => x.completed).forEach(x => set.add(x.exerciseName)));
    const list = Array.from(set);
    if (list.length === 0) {
      return ['پرس سینه', 'اسکوات با هالتر', 'ددلیفت', 'پرس سرشانه', 'بارفیکس'];
    }
    return list;
  }, [completedSessions]);

  // Set default exercise if not set
  const currentExercise = selectedExercise || (availableExercises.includes('پرس سینه') ? 'پرس سینه' : availableExercises[0]);

  // Max PR per exercise overall
  const exercisePRs = useMemo(() => {
    const map = new Map<string, { weight: number; reps: number; volume: number; date: string }>();
    completedSessions.forEach(session => session.sets.filter(s => s.completed).forEach(set => {
      const volume = set.weight * set.actualReps;
      const current = map.get(set.exerciseName);
      if (!current || set.weight > current.weight || (set.weight === current.weight && set.actualReps > current.reps)) {
        map.set(set.exerciseName, { weight: set.weight, reps: set.actualReps, volume, date: session.date });
      }
    }));
    return Array.from(map.entries()).sort((a, b) => b[1].weight - a[1].weight);
  }, [completedSessions]);

  // Bar chart data for the selected exercise over sessions/dates
  const exerciseChartData = useMemo(() => {
    const history: { date: string; weight: number; reps: number; volume: number }[] = [];
    const sortedSessions = [...completedSessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedSessions.forEach(session => {
      const sets = session.sets.filter(s => s.completed && s.exerciseName === currentExercise);
      if (sets.length > 0) {
        // Find best set for this exercise in this session
        const maxSet = sets.reduce((prev, curr) => (curr.weight > prev.weight ? curr : curr.weight === prev.weight && curr.actualReps > prev.actualReps ? curr : prev), sets[0]);
        history.push({
          date: formatDateJalali(session.date),
          weight: maxSet.weight,
          reps: maxSet.actualReps,
          volume: maxSet.weight * maxSet.actualReps,
        });
      }
    });

    return history;
  }, [completedSessions, currentExercise]);

  const volumeData = completedSessions.slice(-12).map(s => ({ date: formatDateJalali(s.date), volume: Math.round(s.totalVolume) }));

  // Processed progress data for body weight and measurements chart
  const sortedProgress = useMemo(() => {
    return [...progress].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [progress]);

  const bodyMeasurementChartData = useMemo(() => {
    return sortedProgress.map(entry => {
      let val: number | undefined;
      if (selectedMetric === 'weight') {
        val = entry.weight;
      } else if (entry.measurements) {
        val = entry.measurements[selectedMetric];
      }
      return {
        date: formatDateJalali(entry.date),
        value: val || 0,
      };
    }).filter(d => d.value > 0);
  }, [sortedProgress, selectedMetric]);

  const metricStats = useMemo(() => {
    if (bodyMeasurementChartData.length === 0) return null;
    const values = bodyMeasurementChartData.map(d => d.value);
    const initial = values[0];
    const latest = values[values.length - 1];
    const delta = latest - initial;
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { initial, latest, delta, min, max };
  }, [bodyMeasurementChartData]);

  const save = () => {
    if (!activeProfile) return;
    const entry: ProgressEntry = {
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
      },
      notes: form.notes,
    };
    addProgress(entry);
    setShowForm(false);
    setForm({ weight: 0, chest: 0, waist: 0, hips: 0, arms: 0, thighs: 0, calves: 0, shoulders: 0, notes: '' });
  };

  const card = isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Trophy size={22} className="text-[#14b8a6]" /> پیشرفت و عملکرد
        </h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-3 py-2 rounded-xl font-bold text-sm bg-[#14b8a6] text-black">
          <Plus size={16} /> ثبت اندازه‌گیری
        </button>
      </div>

      {/* Active Workout Program Timeline & Expiration Alarm */}
      {activeProgram && activeProgramTimeline && (
        <div className={`rounded-2xl p-5 border theme-transition ${card}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isDark ? 'bg-[#14b8a6]/20 text-[#14b8a6]' : 'bg-[#14b8a6]/15 text-[#0d9488]'}`}>
                <Clock size={22} />
              </div>
              <div>
                <span className="text-xs font-bold text-[#14b8a6]">برنامه تمرینی فعال</span>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#134e4a]'}`}>
                  {activeProgram.name}
                </h3>
              </div>
            </div>

            <button
              onClick={() => navigate('/import')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-teal-200 text-[#0d9488] hover:bg-[#f0fdfa]'
              }`}
            >
              تغییر برنامه
            </button>
          </div>

          {activeProgramTimeline.isAlarmRequired && (
            <div className={`mb-4 rounded-xl p-4 border flex flex-col sm:flex-row items-center justify-between gap-3 ${
              isDark ? 'bg-amber-500/15 border-amber-500/40 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              <div className="flex items-center gap-3">
                <Bell size={22} className="text-amber-500 animate-bounce shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-sm">
                    🚨 هشدار پایان برنامه تمرینی (تنها {toPersianNumber(Math.max(0, activeProgramTimeline.daysRemaining))} روز باقی مانده)
                  </p>
                  <p className="opacity-90 mt-0.5">
                    برنامه فعلی شما به انتهای مدت تعیین شده رسیده است. برای حفظ روند پیشرفت، نسبت به تهیه برنامه جدید اقدام فرمایید.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/prompt')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 shrink-0 flex items-center gap-1.5 shadow"
              >
                <Brain size={16} />
                تولید پرامپت جدید
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
            <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
              <span className="text-gray-400">تاریخ شروع:</span>
              <p className="font-bold mt-1">{activeProgramTimeline.startDateJalali}</p>
            </div>
            <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
              <span className="text-gray-400">تاریخ پایان:</span>
              <p className="font-bold mt-1">{activeProgramTimeline.endDateJalali}</p>
            </div>
            <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
              <span className="text-gray-400">مدت کل برنامه:</span>
              <p className="font-bold mt-1">{activeProgram.duration} ({toPersianNumber(activeProgramTimeline.totalDays)} روز)</p>
            </div>
            <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-[#f0fdfa]'}`}>
              <span className="text-gray-400">زمان باقی‌مانده:</span>
              <p className={`font-bold mt-1 ${activeProgramTimeline.isAlarmRequired ? 'text-amber-500 font-black' : ''}`}>
                {activeProgramTimeline.daysRemaining >= 0
                  ? `${toPersianNumber(activeProgramTimeline.daysRemaining)} روز باقی مانده`
                  : 'پایان یافته'}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-400">درصد سپری شده از زمان برنامه:</span>
              <span className="text-[#14b8a6]">{toPersianNumber(activeProgramTimeline.progressPercent)}٪</span>
            </div>
            <div className={`w-full h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  activeProgramTimeline.isAlarmRequired ? 'bg-amber-500' : 'bg-[#14b8a6]'
                }`}
                style={{ width: `${activeProgramTimeline.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['جلسات کامل', completedSessions.length, 'text-[#4a90d9]'],
          ['میانگین حجم', `${avgVolume} kg`, 'text-green-500'],
          ['تغییر وزن', `${weightChange >= 0 ? '+' : ''}${weightChange.toFixed(1)} kg`, weightChange >= 0 ? 'text-amber-500' : 'text-blue-500'],
          ['حرکات ثبت‌شده', availableExercises.length, 'text-[#14b8a6]'],
        ].map(([label, value, color]) => (
          <div key={String(label)} className={`rounded-xl p-4 border ${card}`}>
            <p className="text-gray-400 text-xs mb-1">{label}</p>
            <p className={`text-2xl font-black ${color}`}>{toPersianNumber(String(value))}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className={`rounded-2xl p-5 border ${card}`}>
          <h3 className="font-bold text-[#14b8a6] mb-4">ثبت اندازه‌گیری جدید</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([
              ['weight', 'وزن', 'kg'],
              ['chest', 'سینه', 'cm'],
              ['waist', 'کمر', 'cm'],
              ['hips', 'باسن', 'cm'],
              ['arms', 'بازو', 'cm'],
              ['thighs', 'ران', 'cm'],
              ['calves', 'ساق', 'cm'],
              ['shoulders', 'شانه', 'cm'],
            ] as const).map(([key, label, unit]) => (
              <label key={key} className="text-xs text-gray-400">
                {label} ({unit})
                <input
                  type="number"
                  value={form[key] || ''}
                  onChange={e => setForm({ ...form, [key]: Number(e.target.value) })}
                  className={`mt-1 w-full rounded-lg px-3 py-2 ${isDark ? 'bg-[#0d0d1a] text-white' : 'bg-gray-50 border text-gray-900'}`}
                />
              </label>
            ))}
          </div>
          <input
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            placeholder="یادداشت اختیاری"
            className={`mt-3 w-full rounded-lg px-3 py-2 ${isDark ? 'bg-[#0d0d1a] text-white' : 'bg-gray-50 border'}`}
          />
          <button onClick={save} className="mt-4 px-4 py-2 rounded-xl font-bold bg-green-500 text-white flex items-center gap-2">
            <Save size={16} /> ذخیره
          </button>
        </div>
      )}

      {/* Exercise Records Bar Chart Card */}
      <div className={`rounded-2xl p-5 border ${card}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-bold text-[#14b8a6] flex items-center gap-2">
            <Dumbbell size={18} /> نمودار میله‌ای رکوردهای حرکات (PR)
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">انتخاب حرکت:</span>
            <select
              value={currentExercise}
              onChange={e => setSelectedExercise(e.target.value)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold ${isDark ? 'bg-[#0d0d1a] text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`}
            >
              {availableExercises.map(ex => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
          </div>
        </div>

        {exerciseChartData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Dumbbell size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">هیچ سابقه یا رکوردی برای حرکت «{currentExercise}» ثبت نشده است.</p>
            <p className="text-xs mt-1 text-gray-400">با اجرای تمرین و ثبت وزنه در صفحه «تمرین»، روند تغییر رکورد شما در اینجا به صورت نمودار میله‌ای نمایش داده می‌شود.</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-gray-50'}`}>
                <p className="text-xs text-gray-400">بیشترین وزنه ثبت‌شده</p>
                <p className="text-lg font-black text-[#14b8a6] mt-0.5">
                  {toPersianNumber(Math.max(...exerciseChartData.map(d => d.weight)))} kg
                </p>
              </div>
              <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-gray-50'}`}>
                <p className="text-xs text-gray-400">آخرین رکورد ثبت‌شده</p>
                <p className="text-lg font-bold mt-0.5">
                  {toPersianNumber(exerciseChartData[exerciseChartData.length - 1].weight)} kg
                </p>
              </div>
              <div className={`col-span-2 sm:col-span-1 rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-gray-50'}`}>
                <p className="text-xs text-gray-400">تغییر روند رکورد</p>
                {(() => {
                  const first = exerciseChartData[0].weight;
                  const last = exerciseChartData[exerciseChartData.length - 1].weight;
                  const diff = last - first;
                  return (
                    <p className={`text-lg font-bold mt-0.5 ${diff >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                      {diff >= 0 ? '+' : ''}{toPersianNumber(diff.toFixed(1))} kg
                    </p>
                  );
                })()}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={exerciseChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#e5e7eb'} />
                <XAxis dataKey="date" stroke={isDark ? '#888' : '#6b7280'} fontSize={10} />
                <YAxis stroke={isDark ? '#888' : '#6b7280'} fontSize={10} unit=" kg" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className={`p-3 rounded-xl border text-xs shadow-lg ${isDark ? 'bg-[#1a1a2e] border-[#14b8a6] text-white' : 'bg-white border-[#14b8a6] text-gray-900'}`}>
                          <p className="font-bold text-[#14b8a6] mb-1">{label}</p>
                          <p className="font-bold">حداکثر وزنه: {toPersianNumber(data.weight)} kg</p>
                          <p className="text-gray-400 mt-0.5">تکرار: {toPersianNumber(data.reps)} | حجم: {toPersianNumber(data.volume)} kg</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="weight" name="وزنه (kg)" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Dedicated Body Weight & Measurements Trend Chart Card */}
      <div className={`rounded-2xl p-5 border ${card}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-bold text-[#14b8a6] flex items-center gap-2">
            <Scale size={18} /> نمودار تغییرات وزن و سایز بدن
          </h3>
        </div>

        {/* Metric selection pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {(Object.keys(MEASUREMENT_LABELS) as MeasurementKey[]).map(key => {
            const { label } = MEASUREMENT_LABELS[key];
            const isSelected = selectedMetric === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedMetric(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#14b8a6] text-black'
                    : isDark
                    ? 'bg-[#0d0d1a] text-gray-400 hover:text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {bodyMeasurementChartData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">اطلاعاتی برای «{MEASUREMENT_LABELS[selectedMetric].label}» ثبت نشده است.</p>
            <p className="text-xs mt-1 text-gray-400">با کلیک روی «ثبت اندازه‌گیری» در بالای صفحه، مقادیر جدید را اضافه کنید.</p>
          </div>
        ) : (
          <div>
            {metricStats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-gray-50'}`}>
                  <p className="text-xs text-gray-400">آخرین مقدار</p>
                  <p className="text-lg font-black text-[#14b8a6] mt-0.5">
                    {toPersianNumber(metricStats.latest)} {MEASUREMENT_LABELS[selectedMetric].unit}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-gray-50'}`}>
                  <p className="text-xs text-gray-400">تغییر کل</p>
                  <p className={`text-lg font-bold mt-0.5 ${metricStats.delta >= 0 ? 'text-amber-500' : 'text-blue-500'}`}>
                    {metricStats.delta >= 0 ? '+' : ''}{toPersianNumber(metricStats.delta.toFixed(1))} {MEASUREMENT_LABELS[selectedMetric].unit}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-gray-50'}`}>
                  <p className="text-xs text-gray-400">حداقل</p>
                  <p className="text-lg font-bold mt-0.5">
                    {toPersianNumber(metricStats.min)} {MEASUREMENT_LABELS[selectedMetric].unit}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${isDark ? 'bg-[#0d0d1a]' : 'bg-gray-50'}`}>
                  <p className="text-xs text-gray-400">حداکثر</p>
                  <p className="text-lg font-bold mt-0.5">
                    {toPersianNumber(metricStats.max)} {MEASUREMENT_LABELS[selectedMetric].unit}
                  </p>
                </div>
              </div>
            )}

            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={bodyMeasurementChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="bodyMetricGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#e5e7eb'} />
                <XAxis dataKey="date" stroke={isDark ? '#888' : '#6b7280'} fontSize={10} />
                <YAxis stroke={isDark ? '#888' : '#6b7280'} fontSize={10} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className={`p-3 rounded-xl border text-xs shadow-lg ${isDark ? 'bg-[#1a1a2e] border-[#14b8a6] text-white' : 'bg-white border-[#14b8a6] text-gray-900'}`}>
                          <p className="font-bold text-[#14b8a6] mb-1">{label}</p>
                          <p className="font-bold">
                            {MEASUREMENT_LABELS[selectedMetric].label}: {toPersianNumber(String(payload[0].value ?? 0))} {MEASUREMENT_LABELS[selectedMetric].unit}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} fill="url(#bodyMetricGrad)" dot={{ r: 4, fill: '#14b8a6' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {volumeData.length > 0 && (
        <div className={`rounded-2xl p-5 border ${card}`}>
          <h3 className="font-bold text-[#14b8a6] mb-4 flex items-center gap-2">
            <TrendingUp size={18} /> روند حجم تمرین
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#333' : '#e5e7eb'} />
              <XAxis dataKey="date" stroke={isDark ? '#888' : '#6b7280'} fontSize={10} />
              <YAxis stroke={isDark ? '#888' : '#6b7280'} fontSize={10} />
              <Tooltip contentStyle={{ background: isDark ? '#1a1a2e' : '#fff', border: '1px solid #14b8a6', borderRadius: 8 }} />
              <Line type="monotone" dataKey="volume" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Measurement history list */}
      <div className={`rounded-2xl p-5 border ${card}`}>
        <h3 className="font-bold text-[#14b8a6] mb-4 flex items-center gap-2">
          <BarChart3 size={18} /> تاریخچه اندازه‌گیری
        </h3>
        {progress.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">هنوز اندازه‌گیری ثبت نشده است.</p>
        ) : (
          <div className="space-y-2">
            {progress.slice().reverse().map(entry => (
              <div key={entry.id} className={`rounded-xl p-4 ${isDark ? 'bg-[#0d0d1a]' : 'bg-gray-50'}`}>
                <div className="flex justify-between">
                  <span className="font-bold">{formatDateJalali(entry.date)}</span>
                  <span className="font-bold text-[#14b8a6]">{toPersianNumber(String(entry.weight))} kg</span>
                </div>
                {entry.measurements && (
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                    {Object.entries(entry.measurements)
                      .filter(([, v]) => v)
                      .map(([k, v]) => {
                        const metricLabel = MEASUREMENT_LABELS[k as MeasurementKey]?.label || k;
                        return (
                          <span key={k}>
                            {metricLabel}: {toPersianNumber(String(v))} cm
                          </span>
                        );
                      })}
                  </div>
                )}
                {entry.notes && <p className="text-xs text-gray-500 mt-2">{entry.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
