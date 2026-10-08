import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { soundEffects } from '../utils/sound';
import type { AthleteProfile } from '../types';
import { EQUIPMENT_OPTIONS, EQUIPMENT_TYPES } from '../types';
import { v4 as uuidv4 } from 'uuid';
import {
  ChevronLeft,
  ChevronRight,
  User,
  Target,
  Dumbbell,
  Apple,
  Wallet,
  Pill,
  Check,
  Save,
} from 'lucide-react';
import TrainingDaysSelector from '../components/TrainingDaysSelector';
import { InjurySelector } from '../components/forms/InjurySelector';
import {
  FormField,
  Input,
  Select,
  TextArea,
  ArrayInput,
  PrioritySelect,
} from './onboarding/components/FormFields';

type StepKey = 'basic' | 'body' | 'training' | 'nutrition' | 'budget' | 'supplements';

interface StepInfo {
  key: StepKey;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
}

const STEPS: StepInfo[] = [
  { key: 'basic', title: 'مشخصات پایه', subtitle: 'اطلاعات شخصی', icon: User, color: '#a78bfa' },
  { key: 'body', title: 'اطلاعات بدنی', subtitle: 'سایزبندی و ترکیب بدن', icon: Target, color: '#0ea5e9' },
  { key: 'training', title: 'اهداف تمرینی', subtitle: 'برنامه و تجهیزات', icon: Dumbbell, color: '#8b5cf6' },
];

const MUSCLE_OPTIONS = [
  'سینه', 'پشت', 'زیربغل', 'سرشانه', 'جلوبازو', 'پشت‌بازو',
  'چهارسر ران', 'همسترینگ', 'سرینی', 'ساق', 'شکم', 'پهلو', 'ساعد',
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profiles, saveProfile, setActiveProfile } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const type = searchParams.get('type') || 'workout';
  const mode = searchParams.get('mode') || 'new'; // 'new' | 'edit'
  const editId = searchParams.get('id');
  const isEditMode = mode === 'edit' && !!editId;

  const [stepIndex, setStepIndex] = useState(0);
  const [saved, setSaved] = useState(false);

  const currentStep = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;
  const isFirstStep = stepIndex === 0;

  const [form, setForm] = useState<Partial<AthleteProfile>>({
    name: '',
    age: 25,
    gender: 'male',
    height: 175,
    weight: 75,
    activityLevel: 'moderate',
    experience: 'intermediate',
    trainingDays: 4,
    sessionDuration: 60,
    location: 'gym',
    equipmentType: 'full_gym',
    customEquipment: [],
    equipment: [],
    injuries: [],
    limitations: [],
    avoidedExercises: [],
    primaryGoal: 'hypertrophy',
    targetMuscles: [],
    programType: 'ai_suggested',
    timeline: '۳ ماه',
    trainingHistory: '',
    strengthRecords: {},
    bodyMeasurements: {},
    healthConditions: [],
    bodyFatPercent: undefined,
    bodyComposition: '',
    sleepHours: 7,
    recoveryQuality: 'good',
    jobStress: '',
    workShift: '',
    injuryDetails: '',
    preferredExercises: [],
    exercisePreferences: '',
    hormoneMedNotes: '',
    competitionDate: '',
  });

  // اگر حالت ویرایش است، پروفایل موجود را لود کن
  useEffect(() => {
    if (isEditMode && editId) {
      const existing = profiles.find((p) => p.id === editId);
      if (existing) {
        setForm(existing);
        console.log('📝 Edit mode: loaded profile', existing.name);
      }
    }
  }, [isEditMode, editId, profiles]);


  const teal = isDark ? '#a78bfa' : '#8b5cf6';
  const gold = isDark ? '#d4af37' : '#f59e0b';
  const bgMain = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark
    ? 'bg-[#1e1b4b]/50 backdrop-blur-md'
    : 'bg-violet-50/70 backdrop-blur-md';
  const textMain = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';
  const borderCard = isDark
    ? 'border-white/10'
    : 'border-violet-200/60';

  const updateForm = (key: keyof AthleteProfile, value: any) => {
    setForm((prev) => {
      // اگه key = 'nutrition' یا 'supplement' بود، merge کن
      if (key === 'nutrition' || key === 'supplement') {
        return {
          ...prev,
          [key]: { ...(prev[key] as any || {}), ...value },
        };
      }
      return { ...prev, [key]: value };
    });
  };

  const updateBodyMeasurement = (key: string, value: number) => {
    setForm((prev) => ({
      ...prev,
      bodyMeasurements: { ...(prev.bodyMeasurements || {}), [key]: value },
    }));
  };

  const handleNext = () => {
    soundEffects.playClick();
    if (isLastStep) {
      handleSave();
      return;
    }
    setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
  };

  const handlePrev = () => {
    soundEffects.playClick();
    if (isFirstStep) {
      navigate(-1);
      return;
    }
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const handleSave = () => {
    const isEdit = isEditMode && editId;
    const existing = isEdit ? profiles.find((p) => p.id === editId) : null;

    const newProfile: AthleteProfile = {
      id: isEdit && editId ? editId : uuidv4(),
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
      programType: form.programType || 'ai_suggested',
      timeline: form.timeline || '۳ ماه',
      trainingHistory: form.trainingHistory || '',
      strengthRecords: form.strengthRecords || {},
      bodyMeasurements: form.bodyMeasurements || {},
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
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProfile(newProfile);
    setActiveProfile(newProfile.id);
    setSaved(true);
    soundEffects.playWorkoutFinish?.();

    setTimeout(() => {
      navigate(isEdit ? '/profile' : `/generate/${type}/ready`);
    }, 800);
  };

  if (saved) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${bgMain}`}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: `${teal}20` }}>
          <Check size={40} style={{ color: teal }} />
        </div>
        <h2 className={`text-xl font-black mb-2 ${textMain}`}>پروفایل ذخیره شد!</h2>
        <p className={`text-sm ${textSub}`}>در حال انتقال به صفحه تولید...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-28 ${bgMain}`}>
      <div className={`sticky top-0 z-30 backdrop-blur-md border-b ${isDark ? 'bg-[#0f172a]/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={handlePrev} className="p-2 rounded-full hover:bg-black/5">
              <ChevronLeft size={22} className={isDark ? 'text-white' : 'text-gray-800'} />
            </button>
            <div className="flex-1">
              <h1 className={`font-black text-base ${textMain} flex items-center gap-2`}>
                <currentStep.icon size={18} style={{ color: currentStep.color }} />
                {currentStep.title}
              </h1>
              <p className={`text-[10px] ${textSub}`}>{currentStep.subtitle}</p>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: `${currentStep.color}20`, color: currentStep.color }}>
              {stepIndex + 1} / {STEPS.length}
            </span>
          </div>

          <div className="flex gap-1">
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className={`flex-1 h-1 rounded-full transition-all ${i <= stepIndex ? 'opacity-100' : 'opacity-30'}`}
                style={{ background: i <= stepIndex ? currentStep.color : isDark ? '#334155' : '#e2e8f0' }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        {currentStep.key === 'basic' && (
          <>
            <FormField label="نام و نام خانوادگی">
              <Input value={form.name} onChange={(v) => updateForm('name', v)} placeholder="مثلاً: امین" isDark={isDark} />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="سن (سال)">
                <Input type="number" value={form.age} onChange={(v) => updateForm('age', Number(v))} isDark={isDark} />
              </FormField>
              <FormField label="جنسیت">
                <Select
                  value={form.gender || 'male'}
                  onChange={(v) => updateForm('gender', v)}
                  options={[
                    { value: 'male', label: 'مرد' },
                    { value: 'female', label: 'زن' },
                  ]}
                  isDark={isDark}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="قد (سانتی‌متر)">
                <Input type="number" value={form.height} onChange={(v) => updateForm('height', Number(v))} isDark={isDark} />
              </FormField>
              <FormField label="وزن فعلی (کیلوگرم)">
                <Input type="number" value={form.weight} onChange={(v) => updateForm('weight', Number(v))} isDark={isDark} />
              </FormField>
            </div>

            <FormField label="وزن هدف (کیلوگرم)" hint="اختیاری">
              <Input type="number" value={form.targetWeight} onChange={(v) => updateForm('targetWeight', Number(v))} placeholder="اختیاری" isDark={isDark} />
            </FormField>

            <FormField label="سطح فعالیت روزانه" hint="برای محاسبه کالری روزانه (TDEE)">
              <Select
                value={form.activityLevel || 'moderate'}
                onChange={(v) => updateForm('activityLevel', v)}
                options={[
                  { value: 'sedentary', label: 'بی‌تحرک (کار اداری)' },
                  { value: 'light', label: 'سبک (کمی تحرک)' },
                  { value: 'moderate', label: 'متوسط (ورزش ۳-۵ روز)' },
                  { value: 'active', label: 'فعال (ورزش ۶-۷ روز)' },
                  { value: 'very_active', label: 'خیلی فعال (کار بدنی سنگین)' },
                ]}
                isDark={isDark}
              />
            </FormField>

            <FormField label="سطح تجربه تمرینی" hint="برای تعیین نوع اسپلیت و حجم تمرین">
              <Select
                value={form.experience || 'intermediate'}
                onChange={(v) => updateForm('experience', v)}
                options={[
                  { value: 'beginner', label: 'مبتدی (کمتر از ۱ سال)' },
                  { value: 'intermediate', label: 'متوسط (۱-۳ سال)' },
                  { value: 'advanced', label: 'پیشرفته (۳-۵ سال)' },
                  { value: 'professional', label: 'حرفه‌ای (بیش از ۵ سال)' },
                ]}
                isDark={isDark}
              />
            </FormField>

            <FormField label="سابقه تمرینی" hint="برای تنظیم دقیق حجم تمرین">
              <TextArea
                value={form.trainingHistory || ''}
                onChange={(v) => updateForm('trainingHistory', v)}
                placeholder="مثلاً: ۳ سال بدنسازی، تمرکز روی پرس سینه و اسکوات..."
                rows={2}
                isDark={isDark}
              />
            </FormField>
          </>
        )}

        {currentStep.key === 'body' && (
          <>
            <p className={`text-xs ${textSub} leading-6`}>
              این اطلاعات برای انتخاب حرکات مناسب و برنامه تغذیه دقیق استفاده می‌شود. وارد کردن همه اختیاری است.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="دور سینه (cm)">
                <Input type="number" value={form.bodyMeasurements?.chest} onChange={(v) => updateBodyMeasurement('chest', Number(v))} isDark={isDark} />
              </FormField>
              <FormField label="دور کمر (cm)">
                <Input type="number" value={form.bodyMeasurements?.waist} onChange={(v) => updateBodyMeasurement('waist', Number(v))} isDark={isDark} />
              </FormField>
              <FormField label="دور باسن (cm)">
                <Input type="number" value={form.bodyMeasurements?.hips} onChange={(v) => updateBodyMeasurement('hips', Number(v))} isDark={isDark} />
              </FormField>
              <FormField label="دور بازو (cm)">
                <Input type="number" value={form.bodyMeasurements?.arms} onChange={(v) => updateBodyMeasurement('arms', Number(v))} isDark={isDark} />
              </FormField>
              <FormField label="دور ران (cm)">
                <Input type="number" value={form.bodyMeasurements?.thighs} onChange={(v) => updateBodyMeasurement('thighs', Number(v))} isDark={isDark} />
              </FormField>
              <FormField label="دور ساق (cm)">
                <Input type="number" value={form.bodyMeasurements?.calves} onChange={(v) => updateBodyMeasurement('calves', Number(v))} isDark={isDark} />
              </FormField>
              <FormField label="دور سرشانه (cm)">
                <Input type="number" value={form.bodyMeasurements?.shoulders} onChange={(v) => updateBodyMeasurement('shoulders', Number(v))} isDark={isDark} />
              </FormField>
              <FormField label="دور گردن (cm)">
                <Input type="number" value={form.bodyMeasurements?.neck} onChange={(v) => updateBodyMeasurement('neck', Number(v))} isDark={isDark} />
              </FormField>
              <FormField label="دور مچ (cm)">
                <Input type="number" value={form.bodyMeasurements?.wrist} onChange={(v) => updateBodyMeasurement('wrist', Number(v))} isDark={isDark} />
              </FormField>
              <FormField label="دور قوزک (cm)">
                <Input type="number" value={form.bodyMeasurements?.ankle} onChange={(v) => updateBodyMeasurement('ankle', Number(v))} isDark={isDark} />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="درصد چربی بدن" hint="اختیاری">
                <Input type="number" value={form.bodyFatPercent} onChange={(v) => updateForm('bodyFatPercent', Number(v))} placeholder="اختیاری" isDark={isDark} />
              </FormField>
              <FormField label="تیپ بدنی">
                <Select
                  value={form.bodyMeasurements?.bodyFrame || ''}
                  onChange={(v) => updateBodyMeasurement('bodyFrame' as any, v as any)}
                  options={[
                    { value: 'ectomorph', label: 'اکتومورف (لاغر)' },
                    { value: 'mesomorph', label: 'مزومورف (ورزشی)' },
                    { value: 'endomorph', label: 'اندومورف (پرتر)' },
                  ]}
                  placeholder="انتخاب کنید"
                  isDark={isDark}
                />
              </FormField>
            </div>

            <FormField label="سابقه آسیب‌ها" hint="برای انتخاب حرکات ایمن">
              <InjurySelector
                selectedValues={form.injuries || []}
                onChange={(v) => updateForm('injuries', v)}
                isDark={isDark}
              />
            </FormField>

            <FormField label="جزئیات آسیب‌ها" hint="اختیاری — تاریخ، شدت، وضعیت فعلی">
              <TextArea
                value={form.injuryDetails || ''}
                onChange={(v) => updateForm('injuryDetails', v)}
                placeholder="مثلاً: پارگی ACL راست ۲ سال پیش، جراحی شده..."
                rows={2}
                isDark={isDark}
              />
            </FormField>

            <FormField label="محدودیت‌ها" hint="محدودیت‌های حرکتی — با Enter یا کاما">
              <ArrayInput
                value={form.limitations || []}
                onChange={(v) => updateForm('limitations', v)}
                placeholder="مثلاً: محدودیت دامنه شانه"
                isDark={isDark}
              />
            </FormField>

            <FormField label="تمرینات ممنوع" hint="تمریناتی که نمی‌تونی انجام بدی">
              <ArrayInput
                value={form.avoidedExercises || []}
                onChange={(v) => updateForm('avoidedExercises', v)}
                placeholder="مثلاً: اسکوات پشت پا، پرس نظامی"
                isDark={isDark}
              />
            </FormField>

            <FormField label="شرایط پزشکی" hint="بیماری‌های زمینه‌ای — با Enter یا کاما">
              <ArrayInput
                value={form.healthConditions || []}
                onChange={(v) => updateForm('healthConditions', v)}
                placeholder="مثلاً: دیابت، فشار خون"
                isDark={isDark}
              />
            </FormField>

            <FormField label="یادداشت دارو / هورمون" hint="اختیاری — برای تنظیم ریکاوری">
              <TextArea
                value={form.hormoneMedNotes || ''}
                onChange={(v) => updateForm('hormoneMedNotes', v)}
                placeholder="مثلاً: مصرف مولتی‌ویتامین، تستوسترون..."
                rows={2}
                isDark={isDark}
              />
            </FormField>
          </>
        )}

        {currentStep.key === 'training' && (
          <>
            <FormField label="هدف اصلی تمرین" hint="برای تعیین نوع اسپلیت و حجم">
              <Select
                value={form.primaryGoal || 'hypertrophy'}
                onChange={(v) => updateForm('primaryGoal', v)}
                options={[
                  { value: 'hypertrophy', label: 'حجم عضلانی' },
                  { value: 'strength', label: 'قدرت' },
                  { value: 'fat_loss', label: 'کاهش چربی' },
                  { value: 'recomposition', label: 'بازترکیب بدن' },
                  { value: 'competition', label: 'آماده‌سازی مسابقه' },
                  { value: 'general_fitness', label: 'تناسب اندام' },
                ]}
                isDark={isDark}
              />
            </FormField>

            <FormField label="هدف دوم (اختیاری)" hint="برای تکمیل هدف اصلی — نمی‌تونه با هدف اول یکسان باشه">
              <Select
                value={form.secondaryGoal || ''}
                onChange={(v) => updateForm('secondaryGoal', v)}
                options={[
                  { value: '', label: 'بدون هدف دوم' },
                  ...([
                    { value: 'hypertrophy', label: 'حجم عضلانی' },
                    { value: 'strength', label: 'قدرت' },
                    { value: 'fat_loss', label: 'کاهش چربی' },
                    { value: 'recomposition', label: 'بازترکیب بدن' },
                    { value: 'general_fitness', label: 'تناسب اندام' },
                  ].filter(opt => opt.value !== (form.primaryGoal || 'hypertrophy'))),
                ]}
                isDark={isDark}
              />
            </FormField>

            <FormField label="روزهای تمرین در هفته">
              <TrainingDaysSelector
                profile={form}
                value={form.trainingDays}
                onChange={(v: number) => updateForm('trainingDays', v)}
              />
            </FormField>

            <FormField label="مدت هر جلسه (دقیقه)" hint="برای تنظیم حجم تمرین">
              <Input type="number" value={form.sessionDuration} onChange={(v) => updateForm('sessionDuration', Number(v))} isDark={isDark} />
            </FormField>

            <FormField label="محل تمرین" hint="برای انتخاب نوع حرکات">
              <Select
                value={form.location || 'gym'}
                onChange={(v) => updateForm('location', v)}
                options={[
                  { value: 'gym', label: 'باشگاه تجاری' },
                  { value: 'home', label: 'خانه' },
                  { value: 'both', label: 'هر دو' },
                  { value: 'park', label: 'پارک' },
                ]}
                isDark={isDark}
              />
            </FormField>

            <FormField label="نوع تجهیزات" hint="برای انتخاب حرکات قابل انجام">
              <Select
                value={form.equipmentType || 'full_gym'}
                onChange={(v) => updateForm('equipmentType', v)}
                options={Object.entries(EQUIPMENT_TYPES).map(([value, label]) => ({ value, label }))}
                isDark={isDark}
              />
            </FormField>

            <FormField label="تجهیزات در دسترس" hint="با کلیک انتخاب کنید — برای انتخاب دقیق‌تر حرکات">
              <div className="flex flex-wrap gap-2">
                {EQUIPMENT_OPTIONS.map((eq) => {
                  const isSelected = (form.equipment || []).includes(eq);
                  return (
                    <button
                      key={eq}
                      type="button"
                      onClick={() => {
                        const current = form.equipment || [];
                        const next = isSelected
                          ? current.filter((e: string) => e !== eq)
                          : [...current, eq];
                        updateForm('equipment', next);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isSelected
                          ? (isDark ? 'bg-violet-500 text-white' : 'bg-violet-500 text-white')
                          : (isDark ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-gray-50 text-gray-600 border border-gray-200')
                      }`}
                    >
                      {eq}
                    </button>
                  );
                })}
              </div>
            </FormField>

            <FormField label="عضلات اولویت‌دار" hint="با کلیک اضافه کنید — با فلش‌ها اولویت را تغییر دهید">
              <PrioritySelect
                value={form.targetMuscles || []}
                onChange={(v) => updateForm('targetMuscles', v)}
                options={MUSCLE_OPTIONS}
                isDark={isDark}
                maxItems={5}
              />
            </FormField>

            <FormField label="مدت برنامه (Timeline)" hint="دوره برنامه تمرینی">
              <Input value={form.timeline} onChange={(v) => updateForm('timeline', v)} placeholder="مثلاً: ۳ ماه" isDark={isDark} />
            </FormField>

            {/* ═══ بخش ریکاوری ═══ */}
            <div className={`mt-6 p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-violet-50 border-violet-100'}`}>
              <h3 className={`font-bold text-sm mb-4 ${isDark ? 'text-violet-300' : 'text-violet-700'}`}>
                🛌 اطلاعات ریکاوری
              </h3>

              <div className="space-y-3">
                <FormField label="ساعت خواب روزانه" hint="برای تنظیم حجم و ریکاوری">
                  <Input
                    type="number"
                    value={form.sleepHours || 7}
                    onChange={(v) => updateForm('sleepHours', Number(v))}
                    isDark={isDark}
                  />
                </FormField>

                <FormField label="کیفیت ریکاوری" hint="برای تنظیم حجم تمرین">
                  <Select
                    value={form.recoveryQuality || 'good'}
                    onChange={(v) => updateForm('recoveryQuality', v)}
                    options={[
                      { value: 'poor', label: 'ضعیف' },
                      { value: 'fair', label: 'متوسط' },
                      { value: 'good', label: 'خوب' },
                      { value: 'excellent', label: 'عالی' },
                    ]}
                    isDark={isDark}
                  />
                </FormField>

                <FormField label="سطح استرس روزانه" hint="برای تنظیم شدت تمرین">
                  <Select
                    value={form.jobStress || 'medium'}
                    onChange={(v) => updateForm('jobStress', v)}
                    options={[
                      { value: 'low', label: 'کم' },
                      { value: 'medium', label: 'متوسط' },
                      { value: 'high', label: 'زیاد' },
                    ]}
                    isDark={isDark}
                  />
                </FormField>

                <FormField label="شیفت کاری" hint="برای تعیین زمان تمرین">
                  <Select
                    value={form.workShift || 'day'}
                    onChange={(v) => updateForm('workShift', v)}
                    options={[
                      { value: 'day', label: 'روز' },
                      { value: 'evening', label: 'عصر' },
                      { value: 'night', label: 'شب' },
                      { value: 'rotating', label: 'شیفتی' },
                    ]}
                    isDark={isDark}
                  />
                </FormField>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={`fixed bottom-0 left-0 right-0 z-30 border-t ${isDark ? 'bg-[#0f172a]/95 border-white/10' : 'bg-white/95 border-gray-200'} backdrop-blur-xl`}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex gap-3">
          {!isFirstStep && (
            <button
              onClick={handlePrev}
              className={`px-5 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 ${isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              <ChevronRight size={18} />
              قبلی
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white shadow-lg active:scale-[0.98] transition-all"
            style={{ background: `linear-gradient(135deg, ${currentStep.color} 0%, ${teal} 100%)` }}
          >
            {isLastStep ? (
              <>
                <Save size={18} />
                ذخیره پروفایل
              </>
            ) : (
              <>
                بعدی
                <ChevronLeft size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
