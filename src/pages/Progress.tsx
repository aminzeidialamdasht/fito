import { useMemo, useState } from 'react';
import {
  Trophy, TrendingUp, Save, Dumbbell, Scale,
  Activity, Clock, Bell, Brain, Ruler, Plus,
  BarChart3, Target, ChevronRight, Info, ChevronLeft
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { formatDateJalali, toPersianNumber, getProgramTimelineDetails } from '../utils/jalali';
import AnatomySVG from '../components/AnatomySVG';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import PrimaryButton from '../components/ui/PrimaryButton';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import { getTokens } from '../styles/designTokens';

type MeasurementKey = 'weight' | 'chest' | 'waist' | 'hips' | 'arms' | 'thighs' | 'calves' | 'shoulders' | 'neck';

const MUSCLE_GROUPS = [
  { id: 'chest', label: 'سینه', path: 'M 70 80 Q 90 80 100 100 L 100 130 Q 90 140 70 130 Z M 130 80 Q 110 80 100 100 L 100 130 Q 110 140 130 130 Z' },
  { id: 'shoulders', label: 'سرشانه', path: 'M 60 70 Q 50 70 45 85 L 65 90 Z M 140 70 Q 150 70 155 85 L 135 90 Z' },
  { id: 'arms', label: 'بازو', path: 'M 45 85 Q 35 100 30 130 L 45 135 Q 50 110 65 90 Z M 155 85 Q 165 100 170 130 L 155 135 Q 150 110 135 90 Z' },
  { id: 'abs', label: 'شکم', path: 'M 90 135 L 110 135 L 108 180 L 92 180 Z' },
  { id: 'quads', label: 'چهارسر', path: 'M 85 185 L 98 185 L 95 250 L 80 250 Z M 102 185 L 115 185 L 120 250 L 105 250 Z' },
  { id: 'traps', label: 'کول', path: 'M 75 60 Q 100 50 125 60 L 130 75 Q 100 65 70 75 Z' },
];

export default function Progress() {
  const { state, programs, sessions, progress, activeProfile, addProgress } = useAppContext();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const tokens = getTokens(isDark);

  const gold = tokens.gold;
  const teal = tokens.accent;
  const bgMain = tokens.bg;
  const cardBg = '';
  const textMain = tokens.textMain;
  const textSub = tokens.textSub;
  const borderCard = '';

  const activeProgram = programs.find(p => p.id === state.activeProgram);
  const activeProgramTimeline = activeProgram
    ? getProgramTimelineDetails(activeProgram.startDate, activeProgram.duration, activeProgram.createdAt)
    : null;

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    weight: 0, chest: 0, waist: 0, hips: 0, arms: 0, thighs: 0, calves: 0, shoulders: 0, neck: 0, notes: ''
  });

  const completedSessions = useMemo(() => sessions.filter(s => s.completed), [sessions]);
  const sortedProgress = useMemo(() =>
    [...progress].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [progress]);

  const muscleStats = useMemo(() => {
    const stats: Record<string, number> = {};
    MUSCLE_GROUPS.forEach(m => stats[m.id] = 0);
    completedSessions.forEach(session => {
      session.sets.filter(s => s.completed).forEach(set => {
        const name = set.exerciseName.toLowerCase();
        if (name.includes('پرس سینه') || name.includes('فلای') || name.includes('قفسه')) stats['chest']++;
        else if (name.includes('سرشانه') || name.includes('نشر')) stats['shoulders']++;
        else if (name.includes('جلوبازو') || name.includes('پشت بازو')) stats['arms']++;
        else if (name.includes('کرانچ') || name.includes('شکم') || name.includes('پلانک')) stats['abs']++;
        else if (name.includes('اسکوات') || name.includes('پرس پا') || name.includes('لانژ')) stats['quads']++;
        else if (name.includes('شراگ') || name.includes('کول')) stats['traps']++;
      });
    });
    return stats;
  }, [completedSessions]);

  const maxMuscleVol = Math.max(...Object.values(muscleStats), 1);

  const balanceData = useMemo(() => {
    return MUSCLE_GROUPS.map(m => ({
      subject: m.label,
      A: muscleStats[m.id],
      fullMark: Math.max(maxMuscleVol * 1.2, 10)
    }));
  }, [muscleStats, maxMuscleVol]);

  const weightChartData = useMemo(() =>
    sortedProgress.filter(e => e.weight > 0).map(e => ({
      date: formatDateJalali(e.date), weight: e.weight,
    })), [sortedProgress]);

  const save = () => {
    if (!activeProfile) return;
    addProgress({
      id: uuidv4(),
      profileId: activeProfile.id,
      date: new Date().toISOString(),
      weight: form.weight || activeProfile.weight || 0,
      measurements: {
        chest: form.chest || undefined, waist: form.waist || undefined, hips: form.hips || undefined,
        arms: form.arms || undefined, thighs: form.thighs || undefined, calves: form.calves || undefined,
        shoulders: form.shoulders || undefined, neck: form.neck || undefined,
      },
      notes: form.notes,
    });
    setShowForm(false);
    setForm({ weight: 0, chest: 0, waist: 0, hips: 0, arms: 0, thighs: 0, calves: 0, shoulders: 0, neck: 0, notes: '' });
  };

  return (
    <div className={`min-h-screen pb-24 space-y-5 ${bgMain}`}>
      {/* Header with Back Button */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className={`p-2 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
            <ChevronLeft size={20} style={{ color: textMain }} />
          </button>
          <div>
            <h2 className={`text-xl font-black flex items-center gap-2 ${textMain}`}>
              <Trophy size={22} style={{ color: gold }} /> پیگیری پیشرفت
            </h2>
            <p className={`text-xs mt-0.5 ${textSub}`}>بدن‌سازی · پیشرفت مداوم، انگیزه همیشگی</p>
          </div>
        </div>
        <PrimaryButton
          variant="accent"
          size="md"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={16} /> ثبت اندازه‌گیری
        </PrimaryButton>
      </div>

      {/* Program Timeline Card */}
      {activeProgram && activeProgramTimeline && (
        <Card variant="elevated" className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center`} style={{ background: `${gold}15`, color: gold }}>
                <Clock size={22} />
              </div>
              <div>
                <span className={`text-xs font-bold`} style={{ color: gold }}>برنامه تمرینی فعال</span>
                <h3 className={`text-lg font-bold ${textMain}`}>{activeProgram.name}</h3>
              </div>
            </div>
            <button onClick={() => navigate('/import')} className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${isDark ? 'border-gray-700 text-gray-300' : 'border-violet-200 text-[#8b5cf6]'}`}>
              تغییر برنامه
            </button>
          </div>
          
          {activeProgramTimeline.isAlarmRequired && (
            <div className={`mb-4 rounded-xl p-4 border flex items-center justify-between gap-3 ${isDark ? 'bg-amber-500/15 border-amber-500/40 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-900'}`}>
              <div className="flex items-center gap-3">
                <Bell size={22} className="text-amber-500 shrink-0" />
                <p className="text-xs font-bold">هشدار پایان برنامه — {toPersianNumber(Math.max(0, activeProgramTimeline.daysRemaining))} روز باقی‌مانده</p>
              </div>
              <PrimaryButton
                variant="gold"
                size="sm"
                onClick={() => navigate('/prompt')}
              >
                <Brain size={14} /> پرامپت جدید
              </PrimaryButton>
            </div>
          )}
          <ProgressBar
            value={activeProgramTimeline.progressPercent}
            color={activeProgramTimeline.isAlarmRequired ? 'warning' : 'gold'}
            size="md"
            showLabel
            label="پیشرفت برنامه"
          />
        </Card>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['جلسات کامل', completedSessions.length, teal],
          ['حجم کل', `${completedSessions.reduce((s, x) => s + x.totalVolume, 0)} kg`, gold],
          ['تغییر وزن', (() => {
             const c = sortedProgress.length >= 2 ? sortedProgress[sortedProgress.length - 1].weight - sortedProgress[0].weight : 0;
             return `${c >= 0 ? '+' : ''}${c.toFixed(1)} kg`;
          })(), (v: string) => v.includes('+') ? '#f59e0b' : '#3b82f6'],
          ['تنوع حرکات', new Set(completedSessions.flatMap(s => s.sets.filter(x => x.completed).map(x => x.exerciseName))).size, teal],
        ].map(([label, value, colorFn]: any, i) => (
          <Card key={i} variant="elevated" className="p-4">
            <p className={`${textSub} text-xs mb-1`}>{label}</p>
            <p className="text-2xl font-black" style={{ color: typeof colorFn === 'function' ? colorFn(value) : colorFn }}>
              {toPersianNumber(String(value))}
            </p>
          </Card>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <Card variant="elevated" className="p-5 animate-fade-in">
          <h3 className={`font-bold mb-4 flex items-center gap-2`} style={{ color: teal }}><Save size={18}/> ثبت اندازه‌گیری جدید</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {([['weight','وزن','kg'],['chest','سینه','cm'],['waist','کمر','cm'],['hips','باسن','cm'],['arms','بازو','cm'],['thighs','ران','cm'],['calves','ساق','cm'],['shoulders','شانه','cm'],['neck','گردن','cm']] as const).map(([key, label, unit]) => (
              <Input
                key={key}
                label={`${label} (${unit})`}
                type="number"
                inputSize="sm"
                value={(form as any)[key] || ''}
                onChange={e => setForm({ ...form, [key]: Number(e.target.value) })}
              />
            ))}
          </div>
          <PrimaryButton
            variant="accent"
            size="lg"
            fullWidth
            onClick={save}
            className="mt-4"
          >
            ذخیره اطلاعات
          </PrimaryButton>
        </Card>
      )}

      {/* Weight Trend Chart */}
      <Card variant="elevated" className="p-5">
        <h3 className={`font-bold flex items-center gap-2 mb-4 ${textMain}`}><TrendingUp size={18} style={{color: teal}}/> روند وزن</h3>
        {weightChartData.length < 2 ? (
          <EmptyState
            icon={<Scale size={36} />}
            title="داده کافی نیست"
            subtitle="حداقل دو اندازه‌گیری لازم است."
          />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weightChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={teal} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={teal} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} vertical={false} />
              <XAxis dataKey="date" stroke={textSub} fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke={textSub} fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip contentStyle={{ background: cardBg, border: 'none', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="weight" stroke={teal} strokeWidth={3} fill="url(#wg)" dot={{ r: 4, fill: teal, stroke: cardBg, strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Body Heatmap & Balance Section */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Body Heatmap */}
        <Card variant="elevated" className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-bold flex items-center gap-2 ${textMain}`}><Activity size={18} style={{color: gold}}/> نقشه حرارتی بدن</h3>
            <Info size={14} className={textSub} />
          </div>
          <div className="relative h-64 flex items-center justify-center">
          <AnatomySVG />
            <div className="absolute bottom-0 right-0 flex flex-col gap-1">
              {MUSCLE_GROUPS.filter(m => muscleStats[m.id] > 0).slice(0, 4).map(m => (
                <div key={m.id} className="flex items-center gap-2 text-[10px] font-bold bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full" style={{background: gold}} />
                  <span className={textMain}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Muscle Balance Radar Chart */}
        <Card variant="elevated" className="p-5">
          <h3 className={`font-bold flex items-center gap-2 mb-4 ${textMain}`}><Target size={18} style={{color: teal}}/> بالانس عضلانی</h3>
          {balanceData.every(d => d.A === 0) ? (
            <EmptyState
              icon={<Dumbbell size={36} />}
              title="هنوز جلسه‌ای تکمیل نشده"
              subtitle="با تکمیل جلسات تمرینی، بالانس عضلانی نمایش داده می‌شود."
            />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={balanceData}>
                <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: textSub, fontSize: 11, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                <Radar name="تمرین" dataKey="A" stroke={teal} fill={teal} fillOpacity={0.4} strokeWidth={2} />
                <Tooltip contentStyle={{ background: cardBg, border: 'none', borderRadius: 12, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Recent Measurements List */}
      <Card variant="elevated" className="p-5">
        <h3 className={`font-bold flex items-center gap-2 mb-4 ${textMain}`}><BarChart3 size={18} style={{color: gold}}/> آخرین اندازه‌گیری‌ها</h3>
        {sortedProgress.length === 0 ? (
          <p className="text-center text-sm py-4" style={{color: textSub}}>هنوز ثبت نشده.</p>
        ) : (
          <div className="space-y-2">
            {[...sortedProgress].reverse().slice(0, 6).map(entry => (
              <div key={entry.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${isDark ? 'bg-[#0f172a] hover:bg-[#1e293b]' : 'bg-[#f5f3ff] hover:bg-[#ccfbf1]'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center`} style={{ background: `${gold}15`, color: gold }}>
                    <Scale size={16} />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${textMain}`}>وزن: {toPersianNumber(entry.weight)} kg</p>
                    <p className={`text-[10px] ${textSub}`}>{formatDateJalali(entry.date)}</p>
                  </div>
                </div>
                <ChevronRight size={16} className={textSub} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
