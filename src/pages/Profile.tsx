import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { AthleteProfile, EXPERIENCE_LABELS, getGoalLabel } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { User, Save, ChevronLeft, ChevronRight, Check, Plus, Trash2, Edit, Download, Upload, Copy } from 'lucide-react';
import { toPersianNumber } from '../utils/jalali';
import { StepBasic, StepTraining, StepNutrition, StepSupplements, StepGoals } from './profileSteps';

const steps = ['اطلاعات پایه', 'اطلاعات تمرینی', 'تغذیه', 'مکمل‌ها', 'اهداف'];

export default function Profile() {
  const { profiles, activeProfile, saveProfile, deleteProfile, setActiveProfile } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [showNewProfileForm, setShowNewProfileForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState('');
  const [importOk, setImportOk] = useState(false);
  const [exportMsg, setExportMsg] = useState('');

  const emptyForm = (): Partial<AthleteProfile> => ({
    name: '', age: 25, gender: 'male', height: 175, weight: 75,
    targetWeight: undefined, activityLevel: 'moderate', experience: 'intermediate',
    trainingDays: 4, sessionDuration: 60, location: 'gym', equipmentType: 'full_gym',
    customEquipment: [], equipment: [], injuries: [], limitations: [], avoidedExercises: [],
    primaryGoal: 'hypertrophy', secondaryGoal: undefined, targetMuscles: [],
    programType: 'full_body', timeline: '', trainingHistory: '', strengthRecords: {},
    bodyMeasurements: {}, dietaryGoal: '', dietType: '', foodAllergies: [],
    favoriteFoods: [], dislikedFoods: [], mealsPerDay: 3, calorieTarget: undefined,
    cookingSkill: 'basic', supplementGoal: '', currentSupplements: [],
    supplementBudget: '', healthConditions: [],
    bodyFatPercent: undefined, bodyComposition: '', sleepHours: undefined,
    recoveryQuality: '', jobStress: '', workShift: '', injuryDetails: '',
    preferredExercises: [], exercisePreferences: '', hormoneMedNotes: '',
    competitionDate: '',
  });

  const [form, setForm] = useState<Partial<AthleteProfile>>(emptyForm());

  useEffect(() => {
    if (activeProfile && !editingProfileId) setForm(activeProfile);
  }, [activeProfile, editingProfileId]);

  const buildProfile = (id: string, keepCreatedAt?: string): AthleteProfile => ({
    id,
    name: form.name || 'ورزشکار',
    age: form.age || 25,
    gender: form.gender || 'male',
    height: form.height || 175,
    weight: form.weight || 75,
    targetWeight: form.targetWeight,
    activityLevel: form.activityLevel || 'moderate',
    experience: form.experience || 'intermediate',
    trainingDays: form.trainingDays || 4,
    sessionDuration: form.sessionDuration || 60,
    location: form.location || 'gym',
    equipmentType: form.equipmentType || 'full_gym',
    customEquipment: form.customEquipment || [],
    equipment: form.equipment || [],
    injuries: form.injuries || [],
    limitations: form.limitations || [],
    avoidedExercises: form.avoidedExercises || [],
    primaryGoal: form.primaryGoal || 'hypertrophy',
    secondaryGoal: form.secondaryGoal,
    targetMuscles: form.targetMuscles || [],
    programType: form.programType || 'full_body',
    timeline: form.timeline || '',
    trainingHistory: form.trainingHistory || '',
    strengthRecords: form.strengthRecords || {},
    bodyMeasurements: form.bodyMeasurements || {},
    dietaryGoal: form.dietaryGoal || '',
    dietType: form.dietType || '',
    foodAllergies: form.foodAllergies || [],
    favoriteFoods: form.favoriteFoods || [],
    dislikedFoods: form.dislikedFoods || [],
    mealsPerDay: form.mealsPerDay || 3,
    calorieTarget: form.calorieTarget,
    cookingSkill: form.cookingSkill || 'basic',
    supplementGoal: form.supplementGoal || '',
    currentSupplements: form.currentSupplements || [],
    supplementBudget: form.supplementBudget || '',
    healthConditions: form.healthConditions || [],
    bodyFatPercent: form.bodyFatPercent,
    bodyComposition: form.bodyComposition || '',
    sleepHours: form.sleepHours,
    recoveryQuality: form.recoveryQuality || '',
    jobStress: form.jobStress || '',
    workShift: form.workShift || '',
    injuryDetails: form.injuryDetails || '',
    preferredExercises: form.preferredExercises || [],
    exercisePreferences: form.exercisePreferences || '',
    hormoneMedNotes: form.hormoneMedNotes || '',
    competitionDate: form.competitionDate || '',
    createdAt: keepCreatedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleSave = () => {
    const profile = buildProfile(editingProfileId || uuidv4(), activeProfile?.createdAt);
    saveProfile(profile);
    setSaved(true);
    setEditingProfileId(profile.id);
    setShowNewProfileForm(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleNewProfile = () => {
    setForm(emptyForm());
    setEditingProfileId(null);
    setShowNewProfileForm(true);
    setStep(0);
  };

  const handleEditProfile = (profile: AthleteProfile) => {
    setForm(profile);
    setEditingProfileId(profile.id);
    setShowNewProfileForm(true);
    setStep(0);
  };

  const handleDeleteProfile = (id: string) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این پروفایل را حذف کنید؟')) {
      deleteProfile(id);
      if (editingProfileId === id) {
        setEditingProfileId(null);
        setShowNewProfileForm(false);
      }
    }
  };

  const toggleEquipment = (item: string) => {
    const current = form.equipment || [];
    setForm({ ...form, equipment: current.includes(item) ? current.filter(e => e !== item) : [...current, item] });
  };
  const toggleTargetMuscle = (muscle: string) => {
    const current = form.targetMuscles || [];
    setForm({ ...form, targetMuscles: current.includes(muscle) ? current.filter(m => m !== muscle) : [...current, muscle] });
  };
  const toggleFood = (food: string, field: 'favoriteFoods' | 'dislikedFoods') => {
    const current = form[field] || [];
    setForm({ ...form, [field]: current.includes(food) ? current.filter(f => f !== food) : [...current, food] });
  };
  const toggleSupplement = (supp: string) => {
    const current = form.currentSupplements || [];
    setForm({ ...form, currentSupplements: current.includes(supp) ? current.filter(s => s !== supp) : [...current, supp] });
  };

  const handleExportProfile = (profile: AthleteProfile) => {
    try {
      const json = JSON.stringify(profile, null, 2);
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `profile-${(profile.name || 'athlete').replace(/\s+/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportMsg('دانلود شد');
      setTimeout(() => setExportMsg(''), 2000);
    } catch {
      alert('خطا در خروجی JSON');
    }
  };

  const handleCopyProfile = async (profile: AthleteProfile) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(profile, null, 2));
      setExportMsg('کپی شد');
      setTimeout(() => setExportMsg(''), 2000);
    } catch {
      alert('کپی به کلیپ‌بورد ممکن نشد');
    }
  };

  const handleImportProfile = () => {
    setImportError('');
    setImportOk(false);
    const raw = importJson.trim();
    if (!raw) { setImportError('متن JSON خالی است'); return; }
    try {
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        setImportError('JSON باید یک آبجکت پروفایل باشد');
        return;
      }
      const profile: AthleteProfile = {
        id: uuidv4(),
        name: data.name || 'ورزشکار واردشده',
        age: Number(data.age) || 25,
        gender: data.gender === 'female' ? 'female' : 'male',
        height: Number(data.height) || 175,
        weight: Number(data.weight) || 75,
        targetWeight: data.targetWeight != null ? Number(data.targetWeight) : undefined,
        activityLevel: data.activityLevel || 'moderate',
        experience: data.experience || 'intermediate',
        trainingDays: Number(data.trainingDays) || 4,
        sessionDuration: Number(data.sessionDuration) || 60,
        location: data.location || 'gym',
        equipmentType: data.equipmentType || 'full_gym',
        customEquipment: Array.isArray(data.customEquipment) ? data.customEquipment : [],
        equipment: Array.isArray(data.equipment) ? data.equipment : [],
        injuries: Array.isArray(data.injuries) ? data.injuries : [],
        limitations: Array.isArray(data.limitations) ? data.limitations : [],
        avoidedExercises: Array.isArray(data.avoidedExercises) ? data.avoidedExercises : [],
        primaryGoal: data.primaryGoal || 'hypertrophy',
        secondaryGoal: data.secondaryGoal,
        targetMuscles: Array.isArray(data.targetMuscles) ? data.targetMuscles : [],
        programType: data.programType || 'full_body',
        timeline: data.timeline || '',
        trainingHistory: data.trainingHistory || '',
        strengthRecords: data.strengthRecords && typeof data.strengthRecords === 'object' ? data.strengthRecords : {},
        bodyMeasurements: data.bodyMeasurements && typeof data.bodyMeasurements === 'object' ? data.bodyMeasurements : {},
        dietaryGoal: data.dietaryGoal || '',
        dietType: data.dietType || '',
        foodAllergies: Array.isArray(data.foodAllergies) ? data.foodAllergies : [],
        favoriteFoods: Array.isArray(data.favoriteFoods) ? data.favoriteFoods : [],
        dislikedFoods: Array.isArray(data.dislikedFoods) ? data.dislikedFoods : [],
        mealsPerDay: Number(data.mealsPerDay) || 3,
        calorieTarget: data.calorieTarget != null ? Number(data.calorieTarget) : undefined,
        cookingSkill: data.cookingSkill || 'basic',
        supplementGoal: data.supplementGoal || '',
        currentSupplements: Array.isArray(data.currentSupplements) ? data.currentSupplements : [],
        supplementBudget: data.supplementBudget || '',
        healthConditions: Array.isArray(data.healthConditions) ? data.healthConditions : [],
        bodyFatPercent: data.bodyFatPercent != null ? Number(data.bodyFatPercent) : undefined,
        bodyComposition: data.bodyComposition || '',
        sleepHours: data.sleepHours != null ? Number(data.sleepHours) : undefined,
        recoveryQuality: data.recoveryQuality || '',
        jobStress: data.jobStress || '',
        workShift: data.workShift || '',
        injuryDetails: data.injuryDetails || '',
        preferredExercises: Array.isArray(data.preferredExercises) ? data.preferredExercises : [],
        exercisePreferences: data.exercisePreferences || '',
        hormoneMedNotes: data.hormoneMedNotes || '',
        competitionDate: data.competitionDate || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveProfile(profile);
      setActiveProfile(profile.id);
      setImportOk(true);
      setImportJson('');
      setTimeout(() => { setImportOk(false); setShowImport(false); }, 1500);
    } catch (e: any) {
      setImportError('JSON نامعتبر است: ' + (e?.message || 'خطای پارس'));
    }
  };

  if (!showNewProfileForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={'text-xl font-bold flex items-center gap-2 ' + (isDark ? 'text-white' : 'text-[#134e4a]')}>
            <User size={22} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
            مدیریت پروفایل شاگردان
          </h2>
          <div className="flex items-center gap-2">
            {exportMsg && <span className={'text-xs ' + (isDark ? 'text-[#22c55e]' : 'text-[#059669]')}>{exportMsg}</span>}
            <button onClick={() => { setShowImport(!showImport); setImportError(''); setImportOk(false); }} className={'flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-sm transition-all border ' + (isDark ? 'border-[#14b8a6]/40 text-[#14b8a6] hover:bg-[#14b8a6]/10' : 'border-[#14b8a6]/40 text-[#0d9488] hover:bg-[#f0fdfa]')}>
              <Upload size={16} />
              ورود JSON
            </button>
            <button onClick={handleNewProfile} className={'flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg ' + (isDark ? 'bg-gradient-to-l from-[#14b8a6] to-[#2dd4bf] text-[#0d0d1a] shadow-[#14b8a6]/20 hover:opacity-90' : 'bg-gradient-to-l from-[#14b8a6] to-[#0d9488] text-white shadow-[#14b8a6]/20 hover:opacity-90')}>
              <Plus size={16} />
              پروفایل جدید
            </button>
          </div>
        </div>
        {showImport && (
          <div className={'rounded-2xl p-5 border theme-transition ' + (isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/20' : 'bg-white border-[#14b8a6]/20')}>
            <h3 className={'font-bold mb-2 text-sm ' + (isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]')}>ورود پروفایل از JSON</h3>
            <p className={'text-xs mb-3 ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>خروجی JSON پروفایل را اینجا بچسبانید. یک پروفایل جدید ساخته می‌شود.</p>
            <textarea value={importJson} onChange={e => setImportJson(e.target.value)} rows={8} placeholder='{"name":"...","age":25,"gender":"male",...}' className={'w-full border rounded-xl px-4 py-3 text-xs font-mono focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#14b8a6]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} dir="ltr" />
            {importError && <p className="text-xs text-red-500 mt-2">{importError}</p>}
            {importOk && <p className={'text-xs mt-2 ' + (isDark ? 'text-[#22c55e]' : 'text-[#059669]')}>پروفایل با موفقیت وارد شد</p>}
            <div className="flex gap-2 mt-3">
              <button onClick={handleImportProfile} className={'flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ' + (isDark ? 'bg-gradient-to-l from-[#14b8a6] to-[#2dd4bf] text-[#0d0d1a]' : 'bg-gradient-to-l from-[#14b8a6] to-[#0d9488] text-white')}><Upload size={14} />وارد کردن</button>
              <button onClick={() => { setShowImport(false); setImportJson(''); setImportError(''); }} className={'px-4 py-2 rounded-xl text-sm ' + (isDark ? 'text-gray-400 hover:text-white' : 'text-[#0f766e]/70 hover:text-[#0d9488]')}>انصراف</button>
            </div>
          </div>
        )}
        {profiles.length === 0 ? (
          <div className={'rounded-2xl p-10 border text-center theme-transition ' + (isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/20')}>
            <div className={'w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ' + (isDark ? 'bg-[#14b8a6]/10' : 'bg-[#14b8a6]/10')}><User size={40} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} /></div>
            <h3 className={'text-lg font-bold mb-2 ' + (isDark ? 'text-white' : 'text-[#134e4a]')}>هنوز پروفایلی ایجاد نشده</h3>
            <p className={'text-sm mb-4 ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>برای شروع، اولین پروفایل شاگرد خود را ایجاد کنید</p>
            <button onClick={handleNewProfile} className={'px-6 py-2.5 rounded-xl font-bold text-sm transition-all ' + (isDark ? 'bg-gradient-to-l from-[#14b8a6] to-[#2dd4bf] text-[#0d0d1a] hover:opacity-90' : 'bg-gradient-to-l from-[#14b8a6] to-[#0d9488] text-white hover:opacity-90')}>ایجاد پروفایل جدید</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles.map(profile => (
              <div key={profile.id} className={'rounded-2xl p-5 border theme-transition ' + (profile.id === activeProfile?.id ? (isDark ? 'bg-gradient-to-l from-[#14b8a6]/10 to-transparent border-[#14b8a6]/50 shadow-lg shadow-[#14b8a6]/10' : 'bg-gradient-to-l from-[#14b8a6]/10 to-white border-[#14b8a6]/50 shadow-lg shadow-[#14b8a6]/10') : (isDark ? 'bg-[#1a1a2e] border-gray-800 hover:border-gray-600' : 'bg-white border-[#14b8a6]/20 hover:border-[#14b8a6]/40'))}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ' + (profile.id === activeProfile?.id ? (isDark ? 'bg-gradient-to-br from-[#14b8a6] to-[#2dd4bf] text-[#0d0d1a]' : 'bg-gradient-to-br from-[#14b8a6] to-[#0d9488] text-white') : (isDark ? 'bg-gray-800 text-gray-400' : 'bg-[#f0fdfa] text-[#0d9488]'))}>{profile.name.charAt(0)}</div>
                    <div>
                      <h3 className={'font-bold ' + (isDark ? 'text-white' : 'text-[#134e4a]')}>{profile.name}</h3>
                      <p className={'text-xs ' + (isDark ? 'text-gray-400' : 'text-[#0f766e]/70')}>{toPersianNumber(profile.age)} سال • {profile.gender === 'male' ? 'مرد' : 'زن'}</p>
                    </div>
                  </div>
                  {profile.id === activeProfile?.id && (<span className={'text-xs px-2 py-1 rounded-full font-bold ' + (isDark ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#10b981]/15 text-[#059669]')}>فعال</span>)}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>قد: <span className={'font-medium ' + (isDark ? 'text-white' : 'text-[#134e4a]')}>{toPersianNumber(profile.height)} cm</span></div>
                  <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>وزن: <span className={'font-medium ' + (isDark ? 'text-white' : 'text-[#134e4a]')}>{toPersianNumber(profile.weight)} kg</span></div>
                  <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>هدف: <span className={'font-medium ' + (isDark ? 'text-white' : 'text-[#134e4a]')}>{getGoalLabel(profile.primaryGoal)}</span></div>
                  <div className={isDark ? 'text-gray-400' : 'text-[#0f766e]/70'}>سطح: <span className={'font-medium ' + (isDark ? 'text-white' : 'text-[#134e4a]')}>{EXPERIENCE_LABELS[profile.experience]}</span></div>
                </div>
                <div className="flex gap-2">
                  {profile.id !== activeProfile?.id && (<button onClick={() => setActiveProfile(profile.id)} className={'flex-1 py-2 rounded-lg text-xs font-bold transition-all ' + (isDark ? 'bg-[#4a90d9]/20 text-[#4a90d9] hover:bg-[#4a90d9]/30' : 'bg-[#14b8a6]/15 text-[#0d9488] hover:bg-[#14b8a6]/25')}>فعال‌سازی</button>)}
                  <button onClick={() => handleExportProfile(profile)} title="خروجی JSON" className={'flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ' + (isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-[#f0fdfa] text-[#0d9488] hover:bg-[#ccfbf1]')}><Download size={12} /></button>
                  <button onClick={() => handleCopyProfile(profile)} title="کپی JSON" className={'flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ' + (isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-[#f0fdfa] text-[#0d9488] hover:bg-[#ccfbf1]')}><Copy size={12} /></button>
                  <button onClick={() => handleEditProfile(profile)} className={'flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ' + (isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-[#f0fdfa] text-[#0d9488] hover:bg-[#ccfbf1]')}><Edit size={12} />ویرایش</button>
                  <button onClick={() => handleDeleteProfile(profile.id)} className={'flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ' + (isDark ? 'bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20' : 'bg-red-50 text-red-700 hover:bg-red-100')}><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowNewProfileForm(false)} className={'p-2 rounded-lg transition-all ' + (isDark ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-[#f0fdfa] text-[#0f766e]/70')}><ChevronRight size={20} /></button>
          <h2 className={'text-xl font-bold flex items-center gap-2 ' + (isDark ? 'text-white' : 'text-[#134e4a]')}>
            <User size={22} className={isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]'} />
            {editingProfileId ? 'ویرایش پروفایل' : 'پروفایل جدید'}
          </h2>
        </div>
        <button onClick={handleSave} className={'flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-lg ' + (isDark ? 'bg-gradient-to-l from-[#14b8a6] to-[#2dd4bf] text-[#0d0d1a] shadow-[#14b8a6]/20 hover:opacity-90' : 'bg-gradient-to-l from-[#14b8a6] to-[#0d9488] text-white shadow-[#14b8a6]/20 hover:opacity-90')}>
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? 'ذخیره شد' : 'ذخیره'}
        </button>
      </div>
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className={'h-1.5 w-full rounded-full ' + (i <= step ? (isDark ? 'bg-[#14b8a6]' : 'bg-[#14b8a6]') : (isDark ? 'bg-gray-700' : 'bg-[#f0fdfa]'))} />
            <span className={'text-[10px] mt-1 ' + (i <= step ? (isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]') : (isDark ? 'text-gray-500' : 'text-[#0f766e]/50'))}>{s}</span>
          </div>
        ))}
      </div>
      <div className={'rounded-2xl p-5 border theme-transition ' + (isDark ? 'bg-[#1a1a2e] border-[#14b8a6]/10' : 'bg-white border-[#14b8a6]/15')}>
        {step === 0 && <StepBasic form={form} setForm={setForm} isDark={isDark} />}
        {step === 1 && <StepTraining form={form} setForm={setForm} toggleEquipment={toggleEquipment} isDark={isDark} />}
        {step === 2 && <StepNutrition form={form} setForm={setForm} toggleFood={toggleFood} isDark={isDark} />}
        {step === 3 && <StepSupplements form={form} setForm={setForm} toggleSupplement={toggleSupplement} isDark={isDark} />}
        {step === 4 && <StepGoals form={form} setForm={setForm} toggleTargetMuscle={toggleTargetMuscle} isDark={isDark} />}
      </div>
      <div className="flex justify-between">
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className={'flex items-center gap-1 disabled:opacity-30 transition-all ' + (isDark ? 'text-gray-400 hover:text-white' : 'text-[#0f766e]/70 hover:text-[#0d9488]')}><ChevronRight size={18} />قبلی</button>
        <span className={isDark ? 'text-gray-500 text-sm' : 'text-[#0f766e]/50 text-sm'}>{toPersianNumber(step + 1)} از {toPersianNumber(5)}</span>
        <button onClick={() => setStep(Math.min(4, step + 1))} disabled={step === 4} className={'flex items-center gap-1 disabled:opacity-30 transition-all ' + (isDark ? 'text-[#14b8a6] hover:text-[#2dd4bf]' : 'text-[#0d9488] hover:text-[#14b8a6]')}>بعدی<ChevronLeft size={18} /></button>
      </div>
    </div>
  );
}
