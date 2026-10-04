import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { soundEffects } from '../utils/sound';
import type { AthleteProfile } from '../types';
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
  { key: 'basic', title: 'مشخصات پایه', subtitle: 'اطلاعات شخصی', icon: User, color: '#14b8a6' },
  { key: 'body', title: 'اطلاعات بدنی', subtitle: 'سایزبندی و ترکیب بدن', icon: Target, color: '#0ea5e9' },
  { key: 'training', title: 'اهداف تمرینی', subtitle: 'برنامه و تجهیزات', icon: Dumbbell, color: '#8b5cf6' },
  { key: 'nutrition', title: 'اهداف تغذیه', subtitle: 'رژیم و غذاها', icon: Apple, color: '#10b981' },
  { key: 'budget', title: 'وضعیت اقتصادی', subtitle: 'بودجه غذا و مکمل', icon: Wallet, color: '#f59e0b' },
  { key: 'supplements', title: 'مکمل‌ها', subtitle: 'هدف و سابقه', icon: Pill, color: '#ec4899' },
];

const MUSCLE_OPTIONS = [
  'سینه', 'پشت', 'زیربغل', 'سرشانه', 'جلوبازو', 'پشت‌بازو',
  'چهارسر ران', 'همسترینگ', 'سرینی', 'ساق', 'شکم', 'پهلو', 'ساعد',
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { saveProfile, setActiveProfile } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const type = searchParams.get('type') || 'workout';

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
    dietaryGoal: '',
    dietType: '',
    foodAllergies: [],
    favoriteFoods: [],
    dislikedFoods: [],
    mealsPerDay: 4,
    cookingSkill: 'basic',
    supplementGoal: '',
    currentSupplements: [],
    supplementBudget: '',
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

  const teal = isDark ? '#14b8a6' : '#0d9488';
  const gold = isDark ? '#d4af37' : '#f59e0b';
  const bgMain = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textMain = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';
  const borderCard = isDark ? 'border-white/5' : 'border-gray-200';

  const updateForm = (key: keyof AthleteProfile, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
    const newProfile: AthleteProfile = {
      id: uuidv4(),
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
      dietaryGoal: form.dietaryGoal || '',
      dietType: form.dietType || '',
      foodAllergies: form.foodAllergies || [],
      favoriteFoods: form.favoriteFoods || [],
      dislikedFoods: form.dislikedFoods || [],
      mealsPerDay: form.mealsPerDay || 4,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProfile(newProfile);
    setActiveProfile(newProfile.id);
    setSaved(true);
    soundEffects.playWorkoutFinish?.();

    setTimeout(() => {
      navigate(`/generate/${type}/ready`);
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

            <FormField label="سطح فعالیت روزانه">
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

            <FormField label="سابقه آسیب‌ها یا محدودیت‌ها" hint="با Enter یا کاما اضافه کنید">
              <ArrayInput
                value={form.injuries || []}
                onChange={(v) => updateForm('injuries', v)}
                placeholder="مثلاً: دیسک کمر، زانوی چپ"
                isDark={isDark}
              />
            </FormField>
          </>
        )}

        {currentStep.key === 'training' && (
          <>
            <FormField label="هدف اصلی تمرین">
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

            <FormField label="سطح تجربه">
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

            <div className="grid grid-cols-2 gap-3">
              <FormField label="روزهای تمرین در هفته">
                <Input type="number" value={form.trainingDays} onChange={(v) => updateForm('trainingDays', Number(v))} isDark={isDark} />
              </FormField>
              <FormField label="مدت هر جلسه (دقیقه)">
                <Input type="number" value={form.sessionDuration} onChange={(v) => updateForm('sessionDuration', Number(v))} isDark={isDark} />
              </FormField>
            </div>

            <FormField label="محل تمرین">
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

            <FormField label="عضلات اولویت‌دار" hint="با کلیک اضافه کنید — با فلش‌ها اولویت را تغییر دهید">
              <PrioritySelect
                value={form.targetMuscles || []}
                onChange={(v) => updateForm('targetMuscles', v)}
                options={MUSCLE_OPTIONS}
                isDark={isDark}
                maxItems={5}
              />
            </FormField>

            <FormField label="مدت برنامه (Timeline)">
              <Input value={form.timeline} onChange={(v) => updateForm('timeline', v)} placeholder="مثلاً: ۳ ماه" isDark={isDark} />
            </FormField>
          </>
        )}

        {currentStep.key === 'nutrition' && (
          <>
            <FormField label="هدف تغذیه">
              <Select
                value={form.dietaryGoal || ''}
                onChange={(v) => updateForm('dietaryGoal', v)}
                options={[
                  { value: 'fat_loss', label: 'کاهش چربی' },
                  { value: 'muscle_gain', label: 'افزایش عضله' },
                  { value: 'maintenance', label: 'حفظ وزن' },
                  { value: 'recomposition', label: 'بازترکیب' },
                ]}
                placeholder="انتخاب کنید"
                isDark={isDark}
              />
            </FormField>

            <FormField label="نوع رژیم">
              <Select
                value={form.dietType || ''}
                onChange={(v) => updateForm('dietType', v)}
                options={[
                  { value: 'balanced', label: 'متعادل' },
                  { value: 'high_protein', label: 'پروتئین بالا' },
                  { value: 'low_carb', label: 'کم‌کربوهیدرات' },
                  { value: 'vegetarian', label: 'گیاه‌خواری' },
                ]}
                placeholder="انتخاب کنید"
                isDark={isDark}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="تعداد وعده در روز">
                <Input type="number" value={form.mealsPerDay} onChange={(v) => updateForm('mealsPerDay', Number(v))} isDark={isDark} />
              </FormField>
              <FormField label="مهارت آشپزی">
                <Select
                  value={form.cookingSkill || 'basic'}
                  onChange={(v) => updateForm('cookingSkill', v)}
                  options={[
                    { value: 'none', label: 'ندارم' },
                    { value: 'basic', label: 'مقدماتی' },
                    { value: 'intermediate', label: 'متوسط' },
                    { value: 'advanced', label: 'پیشرفته' },
                  ]}
                  isDark={isDark}
                />
              </FormField>
            </div>

            <FormField label="غذاهای مورد علاقه" hint="با Enter یا کاما اضافه کنید">
              <ArrayInput
                value={form.favoriteFoods || []}
                onChange={(v) => updateForm('favoriteFoods', v)}
                placeholder="مثلاً: مرغ، برنج، تخم‌مرغ"
                isDark={isDark}
              />
            </FormField>

            <FormField label="غذاهای مورد تنفر" hint="با Enter یا کاما اضافه کنید">
              <ArrayInput
                value={form.dislikedFoods || []}
                onChange={(v) => updateForm('dislikedFoods', v)}
                placeholder="مثلاً: ماهی، عدس"
                isDark={isDark}
              />
            </FormField>

            <FormField label="آلرژی غذایی" hint="با Enter یا کاما اضافه کنید">
              <ArrayInput
                value={form.foodAllergies || []}
                onChange={(v) => updateForm('foodAllergies', v)}
                placeholder="مثلاً: لاکتوز، گلوتن"
                isDark={isDark}
              />
            </FormField>
          </>
        )}

        {currentStep.key === 'budget' && (
          <>
            <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
              <p className={`text-xs ${textSub} leading-6`}>
                این اطلاعات کمک می‌کند پیشنهادات تغذیه‌ای و مکملی متناسب با بودجه شما ارائه شود.
              </p>
            </div>

            <FormField label="بودجه ماهانه غذا و مکمل">
              <Select
                value={form.supplementBudget || ''}
                onChange={(v) => updateForm('supplementBudget', v)}
                options={[
                  { value: 'low', label: 'کم (اقتصادی)' },
                  { value: 'medium', label: 'متوسط' },
                  { value: 'high', label: 'بالا (بدون محدودیت)' },
                ]}
                placeholder="انتخاب کنید"
                isDark={isDark}
              />
            </FormField>
          </>
        )}

        {currentStep.key === 'supplements' && (
          <>
            <FormField label="هدف مکمل">
              <Select
                value={form.supplementGoal || ''}
                onChange={(v) => updateForm('supplementGoal', v)}
                options={[
                  { value: 'muscle_gain', label: 'افزایش عضله' },
                  { value: 'fat_loss', label: 'کاهش چربی' },
                  { value: 'recovery', label: 'ریکاوری' },
                  { value: 'general_health', label: 'سلامت عمومی' },
                ]}
                placeholder="انتخاب کنید"
                isDark={isDark}
              />
            </FormField>

            <FormField label="مکمل‌های فعلی" hint="با Enter یا کاما اضافه کنید">
              <ArrayInput
                value={form.currentSupplements || []}
                onChange={(v) => updateForm('currentSupplements', v)}
                placeholder="مثلاً: پروتئین وی، کراتین"
                isDark={isDark}
              />
            </FormField>

            <FormField label="شرایط پزشکی" hint="با Enter یا کاما اضافه کنید">
              <ArrayInput
                value={form.healthConditions || []}
                onChange={(v) => updateForm('healthConditions', v)}
                placeholder="مثلاً: دیابت، فشار خون"
                isDark={isDark}
              />
            </FormField>

            <FormField label="یادداشت دارویی">
              <TextArea
                value={form.hormoneMedNotes || ''}
                onChange={(v) => updateForm('hormoneMedNotes', v)}
                placeholder="داروهای مصرفی، هورمون‌ها"
                isDark={isDark}
              />
            </FormField>
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
