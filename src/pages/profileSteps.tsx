import { useState, useRef } from 'react';
import { AthleteProfile, GOAL_LABELS, EXPERIENCE_LABELS, EQUIPMENT_OPTIONS, MUSCLE_GROUPS, PROGRAM_TYPES, ACTIVITY_LEVELS, EQUIPMENT_TYPES, DIET_TYPES, IRANIAN_FOODS, SUPPLEMENT_CATEGORIES, BODY_COMPOSITION_LABELS, RECOVERY_QUALITY_LABELS, JOB_STRESS_LABELS, WORK_SHIFT_LABELS } from '../types';
import { GripVertical, ChevronUp, ChevronDown, X } from 'lucide-react';

export function StepBasic({ form, setForm, isDark }: any) {
  return (
    <div className="space-y-4">
      <h3 className={'font-bold mb-4 ' + (isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]')}>اطلاعات پایه</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="نام" value={form.name} onChange={(v: string) => setForm({ ...form, name: v })} isDark={isDark} />
        <NumberField label="سن" value={form.age} onChange={(v: number) => setForm({ ...form, age: v })} suffix="سال" isDark={isDark} />
        <SelectField label="جنسیت" value={form.gender} onChange={(v: string) => setForm({ ...form, gender: v })} options={[{ value: 'male', label: 'مرد' }, { value: 'female', label: 'زن' }]} isDark={isDark} />
        <NumberField label="قد" value={form.height} onChange={(v: number) => setForm({ ...form, height: v })} suffix="سانتی‌متر" isDark={isDark} />
        <NumberField label="وزن فعلی" value={form.weight} onChange={(v: number) => setForm({ ...form, weight: v })} suffix="کیلوگرم" isDark={isDark} />
        <NumberField label="وزن هدف" value={form.targetWeight} onChange={(v: number) => setForm({ ...form, targetWeight: v })} suffix="کیلوگرم" isDark={isDark} />
        <NumberField label="درصد چربی تقریبی" value={form.bodyFatPercent} onChange={(v: number) => setForm({ ...form, bodyFatPercent: v })} suffix="٪" isDark={isDark} />
        <SelectField label="ترکیب بدن" value={form.bodyComposition || ''} onChange={(v: string) => setForm({ ...form, bodyComposition: v })} options={[{ value: '', label: 'انتخاب کنید' }, ...Object.entries(BODY_COMPOSITION_LABELS).map(([value, label]) => ({ value, label }))]} isDark={isDark} />
        <SelectField label="سطح فعالیت" value={form.activityLevel} onChange={(v: string) => setForm({ ...form, activityLevel: v })} options={Object.entries(ACTIVITY_LEVELS).map(([value, label]) => ({ value, label }))} isDark={isDark} />
        <SelectField label="سطح تجربه" value={form.experience} onChange={(v: string) => setForm({ ...form, experience: v })} options={Object.entries(EXPERIENCE_LABELS).map(([value, label]) => ({ value, label }))} isDark={isDark} />
        <NumberField label="ساعات خواب شبانه" value={form.sleepHours} onChange={(v: number) => setForm({ ...form, sleepHours: v })} suffix="ساعت" isDark={isDark} />
        <SelectField label="کیفیت ریکاوری" value={form.recoveryQuality || ''} onChange={(v: string) => setForm({ ...form, recoveryQuality: v })} options={[{ value: '', label: 'انتخاب کنید' }, ...Object.entries(RECOVERY_QUALITY_LABELS).map(([value, label]) => ({ value, label }))]} isDark={isDark} />
        <SelectField label="استرس شغلی" value={form.jobStress || ''} onChange={(v: string) => setForm({ ...form, jobStress: v })} options={[{ value: '', label: 'انتخاب کنید' }, ...Object.entries(JOB_STRESS_LABELS).map(([value, label]) => ({ value, label }))]} isDark={isDark} />
        <SelectField label="نوع شیفت کاری" value={form.workShift || ''} onChange={(v: string) => setForm({ ...form, workShift: v })} options={[{ value: '', label: 'انتخاب کنید' }, ...Object.entries(WORK_SHIFT_LABELS).map(([value, label]) => ({ value, label }))]} isDark={isDark} />
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>آسیب‌دیدگی‌ها (با ویرگول جدا کنید)</label>
        <textarea value={(form.injuries || []).join('، ')} onChange={e => setForm({ ...form, injuries: e.target.value.split('،').map((s: string) => s.trim()).filter(Boolean) })} className={'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#14b8a6]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} rows={2} placeholder="مثلاً: آسیب زانو راست، درد شانه چپ..." />
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>جزئیات سابقه آسیب (تاریخ، شدت، وضعیت فعلی)</label>
        <textarea value={form.injuryDetails || ''} onChange={e => setForm({ ...form, injuryDetails: e.target.value })} className={'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#14b8a6]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} rows={3} placeholder="مثلاً: پارگی ACL راست ۲ سال پیش، جراحی شده، الان بدون درد اما از اسکوات عمیق اجتناب می‌کنم..." />
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>محدودیت‌ها (با ویرگول جدا کنید)</label>
        <textarea value={(form.limitations || []).join('، ')} onChange={e => setForm({ ...form, limitations: e.target.value.split('،').map((s: string) => s.trim()).filter(Boolean) })} className={'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#14b8a6]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} rows={2} placeholder="مثلاً: محدودیت دامنه حرکتی شانه، کمردرد مزمن..." />
      </div>
    </div>
  );
}

export function StepTraining({ form, setForm, toggleEquipment, isDark }: any) {
  return (
    <div className="space-y-4">
      <h3 className={'font-bold mb-4 ' + (isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]')}>اطلاعات تمرینی</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberField label="روزهای تمرین در هفته" value={form.trainingDays} onChange={(v: number) => setForm({ ...form, trainingDays: v })} suffix="روز" isDark={isDark} />
        <NumberField label="مدت هر جلسه" value={form.sessionDuration} onChange={(v: number) => setForm({ ...form, sessionDuration: v })} suffix="دقیقه" isDark={isDark} />
        <SelectField label="محل تمرین" value={form.location} onChange={(v: string) => setForm({ ...form, location: v })} options={[{ value: 'gym', label: 'باشگاه' }, { value: 'home', label: 'خانه' }, { value: 'both', label: 'هر دو' }, { value: 'park', label: 'پارک' }]} isDark={isDark} />
        <SelectField label="نوع تجهیزات" value={form.equipmentType} onChange={(v: string) => setForm({ ...form, equipmentType: v })} options={Object.entries(EQUIPMENT_TYPES).map(([value, label]) => ({ value, label }))} isDark={isDark} />
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>تجهیزات در دسترس</label>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map(eq => (
            <button key={eq} type="button" onClick={() => toggleEquipment(eq)} className={'px-3 py-1.5 rounded-lg text-xs transition-all ' + ((form.equipment || []).includes(eq) ? (isDark ? 'bg-[#14b8a6] text-[#0d0d1a] font-bold' : 'bg-[#14b8a6] text-white font-bold') : (isDark ? 'bg-[#0d0d1a] text-gray-400 border border-gray-700' : 'bg-[#f0fdfa] text-teal-700/70 border border-[#14b8a6]/30'))}>{eq}</button>
          ))}
        </div>
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>تجهیزات سفارشی (با ویرگول)</label>
        <textarea value={(form.customEquipment || []).join('، ')} onChange={e => setForm({ ...form, customEquipment: e.target.value.split('،').map((s: string) => s.trim()).filter(Boolean) })} className={'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#14b8a6]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} rows={2} placeholder="مثلاً: کش TRX، میله بارفیکس خانگی..." />
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>ترجیحات تمرینی (سبک حرکات مورد علاقه)</label>
        <textarea value={form.exercisePreferences || ''} onChange={e => setForm({ ...form, exercisePreferences: e.target.value })} className={'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#14b8a6]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} rows={2} placeholder="مثلاً: هالتر را ترجیح می‌دهم، از دستگاه اسمیت خوشم نمی‌آید، کابل را دوست دارم..." />
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>تمرینات ممنوع / مورد تنفر (با ویرگول)</label>
        <textarea value={(form.avoidedExercises || []).join('، ')} onChange={e => setForm({ ...form, avoidedExercises: e.target.value.split('،').map((s: string) => s.trim()).filter(Boolean) })} className={'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#14b8a6]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} rows={2} placeholder="مثلاً: اسکوات پشت پا، پرس نظامی ایستاده..." />
      </div>
    </div>
  );
}

export function StepNutrition({ form, setForm, toggleFood, isDark }: any) {
  return (
    <div className="space-y-4">
      <h3 className={'font-bold mb-4 ' + (isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]')}>تغذیه</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField label="نوع رژیم" value={form.dietType} onChange={(v: string) => setForm({ ...form, dietType: v })} options={DIET_TYPES.map(d => ({ value: d, label: d }))} isDark={isDark} />
        <NumberField label="تعداد وعده در روز" value={form.mealsPerDay} onChange={(v: number) => setForm({ ...form, mealsPerDay: v })} suffix="وعده" isDark={isDark} />
        <NumberField label="هدف کالری" value={form.calorieTarget} onChange={(v: number) => setForm({ ...form, calorieTarget: v })} suffix="kcal" isDark={isDark} />
        <SelectField label="مهارت آشپزی" value={form.cookingSkill} onChange={(v: string) => setForm({ ...form, cookingSkill: v })} options={[{ value: 'none', label: 'هیچ' }, { value: 'basic', label: 'پایه' }, { value: 'intermediate', label: 'متوسط' }, { value: 'advanced', label: 'پیشرفته' }]} isDark={isDark} />
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>حساسیت‌های غذایی (با ویرگول)</label>
        <textarea value={(form.foodAllergies || []).join('، ')} onChange={e => setForm({ ...form, foodAllergies: e.target.value.split('،').map((s: string) => s.trim()).filter(Boolean) })} className={'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#14b8a6]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} rows={2} placeholder="مثلاً: لبنیات، گلوتن..." />
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>غذاهای مورد علاقه</label>
        <div className="flex flex-wrap gap-2">
          {IRANIAN_FOODS.map(f => (
            <button key={f} type="button" onClick={() => toggleFood(f, 'favoriteFoods')} className={'px-3 py-1.5 rounded-lg text-xs transition-all ' + ((form.favoriteFoods || []).includes(f) ? (isDark ? 'bg-[#14b8a6] text-[#0d0d1a] font-bold' : 'bg-[#14b8a6] text-white font-bold') : (isDark ? 'bg-[#0d0d1a] text-gray-400 border border-gray-700' : 'bg-[#f0fdfa] text-teal-700/70 border border-[#14b8a6]/30'))}>{f}</button>
          ))}
        </div>
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>غذاهای مورد تنفر</label>
        <div className="flex flex-wrap gap-2">
          {IRANIAN_FOODS.map(f => (
            <button key={f} type="button" onClick={() => toggleFood(f, 'dislikedFoods')} className={'px-3 py-1.5 rounded-lg text-xs transition-all ' + ((form.dislikedFoods || []).includes(f) ? (isDark ? 'bg-[#ef4444]/30 text-[#ef4444] font-bold' : 'bg-red-100 text-red-700 font-bold') : (isDark ? 'bg-[#0d0d1a] text-gray-400 border border-gray-700' : 'bg-[#f0fdfa] text-teal-700/70 border border-[#14b8a6]/30'))}>{f}</button>
          ))}
        </div>
      </div>
      <InputField label="هدف تغذیه‌ای" value={form.dietaryGoal || ''} onChange={(v: string) => setForm({ ...form, dietaryGoal: v })} isDark={isDark} placeholder="مثلاً: کاهش چربی با حفظ عضله" />
    </div>
  );
}

export function StepSupplements({ form, setForm, toggleSupplement, isDark }: any) {
  return (
    <div className="space-y-4">
      <h3 className={'font-bold mb-4 ' + (isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]')}>مکمل‌ها</h3>
      <InputField label="هدف از مصرف مکمل" value={form.supplementGoal || ''} onChange={(v: string) => setForm({ ...form, supplementGoal: v })} isDark={isDark} placeholder="مثلاً: افزایش عضله، ریکاوری" />
      <InputField label="بودجه ماهانه مکمل" value={form.supplementBudget || ''} onChange={(v: string) => setForm({ ...form, supplementBudget: v })} isDark={isDark} placeholder="مثلاً: ۵۰۰ هزار تومان" />
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>مکمل‌های فعلی</label>
        <div className="flex flex-wrap gap-2">
          {SUPPLEMENT_CATEGORIES.map(s => (
            <button key={s} type="button" onClick={() => toggleSupplement(s)} className={'px-3 py-1.5 rounded-lg text-xs transition-all ' + ((form.currentSupplements || []).includes(s) ? (isDark ? 'bg-[#14b8a6] text-[#0d0d1a] font-bold' : 'bg-[#14b8a6] text-white font-bold') : (isDark ? 'bg-[#0d0d1a] text-gray-400 border border-gray-700' : 'bg-[#f0fdfa] text-teal-700/70 border border-[#14b8a6]/30'))}>{s}</button>
          ))}
        </div>
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>شرایط پزشکی (با ویرگول)</label>
        <textarea value={(form.healthConditions || []).join('، ')} onChange={e => setForm({ ...form, healthConditions: e.target.value.split('،').map((s: string) => s.trim()).filter(Boolean) })} className={'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#14b8a6]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} rows={2} placeholder="مثلاً: فشار خون، دیابت..." />
      </div>
      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>دارو / هورمون / نکات پزشکی مرتبط با مکمل (اختیاری)</label>
        <textarea value={form.hormoneMedNotes || ''} onChange={e => setForm({ ...form, hormoneMedNotes: e.target.value })} className={'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#14b8a6]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} rows={2} placeholder="مثلاً: مصرف لووتیروکسین، یا توضیح کوتاه در صورت نیاز..." />
      </div>
    </div>
  );
}

export function StepGoals({ form, setForm, toggleTargetMuscle, isDark }: any) {
  const dragIndex = useRef<number | null>(null);
  const muscles: string[] = form.targetMuscles || [];

  const reorder = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= muscles.length || to >= muscles.length) return;
    const next = [...muscles];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setForm({ ...form, targetMuscles: next });
  };

  const move = (index: number, dir: -1 | 1) => {
    reorder(index, index + dir);
  };

  const removeMuscle = (m: string) => {
    setForm({ ...form, targetMuscles: muscles.filter(x => x !== m) });
  };

  return (
    <div className="space-y-4">
      <h3 className={'font-bold mb-4 ' + (isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]')}>اهداف</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField label="هدف اصلی" value={form.primaryGoal} onChange={(v: string) => setForm({ ...form, primaryGoal: v })} options={Object.entries(GOAL_LABELS).map(([value, label]) => ({ value, label }))} isDark={isDark} />
        <SelectField label="نوع برنامه" value={form.programType} onChange={(v: string) => setForm({ ...form, programType: v })} options={Object.entries(PROGRAM_TYPES).map(([value, label]) => ({ value, label }))} isDark={isDark} />
      </div>
      <InputField label="هدف فرعی" value={form.secondaryGoal || ''} onChange={(v: string) => setForm({ ...form, secondaryGoal: v })} isDark={isDark} placeholder="اختیاری" />
      <InputField label="بازه زمانی" value={form.timeline || ''} onChange={(v: string) => setForm({ ...form, timeline: v })} isDark={isDark} placeholder="مثلاً: ۳ ماه" />
      <InputField label="تاریخ مسابقه / ددلاین" value={form.competitionDate || ''} onChange={(v: string) => setForm({ ...form, competitionDate: v })} isDark={isDark} placeholder="مثلاً: ۱۴۰۵/۰۶/۱۵ یا 2026-09-01" />

      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>عضلات هدف — انتخاب کنید</label>
        <div className="flex flex-wrap gap-2">
          {MUSCLE_GROUPS.map(m => {
            const selected = muscles.includes(m);
            return (
              <button key={m} type="button" onClick={() => toggleTargetMuscle(m)} className={'px-3 py-1.5 rounded-lg text-xs transition-all ' + (selected ? (isDark ? 'bg-[#14b8a6] text-[#0d0d1a] font-bold' : 'bg-[#14b8a6] text-white font-bold') : (isDark ? 'bg-[#0d0d1a] text-gray-400 border border-gray-700' : 'bg-[#f0fdfa] text-teal-700/70 border border-[#14b8a6]/30'))}>{m}</button>
            );
          })}
        </div>
      </div>

      {muscles.length > 0 && (
        <div>
          <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>اولویت عضلات (بکشید یا با دکمه‌ها جابه‌جا کنید — بالاتر = اولویت بیشتر)</label>
          <ul className="space-y-2">
            {muscles.map((m, i) => (
              <li
                key={m}
                draggable
                onDragStart={() => { dragIndex.current = i; }}
                onDragOver={e => { e.preventDefault(); }}
                onDrop={() => {
                  if (dragIndex.current === null) return;
                  reorder(dragIndex.current, i);
                  dragIndex.current = null;
                }}
                className={'flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-grab active:cursor-grabbing theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a]')}
              >
                <GripVertical size={16} className={isDark ? 'text-gray-500' : 'text-[#0f766e]/50'} />
                <span className={'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ' + (isDark ? 'bg-[#14b8a6]/20 text-[#14b8a6]' : 'bg-[#14b8a6]/15 text-[#0d9488]')}>{i + 1}</span>
                <span className="flex-1 text-sm font-medium">{m}</span>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className={'p-1 rounded disabled:opacity-30 ' + (isDark ? 'hover:bg-white/10' : 'hover:bg-[#ccfbf1]')} aria-label="بالا"><ChevronUp size={16} /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === muscles.length - 1} className={'p-1 rounded disabled:opacity-30 ' + (isDark ? 'hover:bg-white/10' : 'hover:bg-[#ccfbf1]')} aria-label="پایین"><ChevronDown size={16} /></button>
                <button type="button" onClick={() => removeMuscle(m)} className={'p-1 rounded ' + (isDark ? 'hover:bg-[#ef4444]/20 text-[#ef4444]' : 'hover:bg-red-50 text-red-600')} aria-label="حذف"><X size={14} /></button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label className={'text-sm mb-2 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>سابقه تمرینی</label>
        <textarea value={form.trainingHistory || ''} onChange={e => setForm({ ...form, trainingHistory: e.target.value })} className={'w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#14b8a6]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} rows={3} placeholder="توضیح مختصر سابقه تمرین..." />
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, isDark, placeholder }: { label: string; value: string; onChange: (v: string) => void; isDark: boolean; placeholder?: string }) {
  return (
    <div>
      <label className={'text-sm mb-1 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>{label}</label>
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={'w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#14b8a6]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} />
    </div>
  );
}

function NumberField({ label, value, onChange, suffix, isDark }: { label: string; value: number; onChange: (v: number) => void; suffix?: string; isDark: boolean }) {
  return (
    <div>
      <label className={'text-sm mb-1 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>{label}{suffix ? ' (' + suffix + ')' : ''}</label>
      <input type="number" value={value ?? ''} onChange={e => onChange(e.target.value === '' ? (undefined as any) : Number(e.target.value))} className={'w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#14b8a6]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')} />
    </div>
  );
}

function SelectField({ label, value, onChange, options, isDark }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; isDark: boolean }) {
  return (
    <div>
      <label className={'text-sm mb-1 block ' + (isDark ? 'text-gray-400' : 'text-teal-700/70')}>{label}</label>
      <select value={value || ''} onChange={e => onChange(e.target.value)} className={'w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none theme-transition ' + (isDark ? 'bg-[#0d0d1a] border-gray-700 text-white focus:border-[#14b8a6]' : 'bg-[#f0fdfa] border-[#14b8a6]/30 text-[#134e4a] focus:border-[#14b8a6]')}>
        {options.map(opt => (<option key={opt.value || '_empty'} value={opt.value}>{opt.label}</option>))}
      </select>
    </div>
  );
}
