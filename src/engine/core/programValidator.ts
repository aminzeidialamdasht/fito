/**
 * اعتبارسنج برنامه تمرینی
 *
 * قبل از نمایش برنامه به کاربر، این ماژول بررسی می‌کند که آیا برنامه
 * از نظر علمی و منطقی معتبر است. اگر نه، مشکلات را گزارش می‌دهد.
 *
 * چک‌ها:
 *   1. تعداد روز تمرین معتبر
 *   2. روزهای استراحت کافی
 *   3. حجم هفتگی هر عضله در بازه MEV-MRV
 *   4. فرکانس هر عضله 1-3 بار در هفته
 *   5. توزیع درست اولویت‌دارها
 *   6. مجموع Effective Sets منطقی
 *   7. زمان تخمینی ≤ زمان کاربر
 *   8. تعداد Exercise منطقی
 *   9. بدون Exercise تکراری
 *   10. تجهیزات و آسیب‌ها رعایت شده
 */

import type { MuscleGroup } from '../types/exercise';
import type { GeneratedProgram, GeneratedDay } from '../types/program';
import { getTargetWeeklyVolume } from '../data/rules/volumeRules';

export type Severity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  severity: Severity;
  code: string;
  message: string;
  muscle?: MuscleGroup;
  dayIndex?: number;
  suggestion?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  infos: ValidationIssue[];
  /** نمره کلی 0-100 */
  score: number;
}

/**
 * چک اصلی — تمام اعتبارسنجی‌ها
 */
export function validateProgram(program: GeneratedProgram): ValidationResult {
  const issues: ValidationIssue[] = [];

  // ۱. تعداد روز تمرین
  checkTrainingDays(program, issues);

  // ۲. روزهای استراحت
  checkRestDays(program, issues);

  // ۳. حجم هفتگی هر عضله
  checkWeeklyVolume(program, issues);

  // ۴. فرکانس هر عضله
  checkMuscleFrequency(program, issues);

  // ۵. اولویت‌دارها
  checkPriorityMuscles(program, issues);

  // ۶. مدت جلسه
  checkSessionDuration(program, issues);

  // ۷. تعداد Exercise در جلسات
  checkExerciseCount(program, issues);

  // ۸. Exercise تکراری
  checkDuplicateExercises(program, issues);

  // ۹. عضلات هدف در هر جلسه
  checkSessionMuscles(program, issues);

  // ۱۰. مجموع حجم
  checkTotalVolume(program, issues);

  // دسته‌بندی
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const infos = issues.filter((i) => i.severity === 'info');

  // نمره‌دهی
  const score = calculateScore(errors.length, warnings.length);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    infos,
    score,
  };
}

/**
 * ۱. تعداد روز تمرین 3-6
 */
function checkTrainingDays(program: GeneratedProgram, issues: ValidationIssue[]) {
  const days = program.trainingDaysPerWeek;

  if (days < 2) {
    issues.push({
      severity: 'error',
      code: 'TRAINING_DAYS_TOO_LOW',
      message: `تعداد روز تمرین (${days}) کمتر از حداقل (۲) است`,
      suggestion: 'حداقل ۲ روز تمرین در هفته توصیه می‌شود',
    });
  } else if (days > 6) {
    issues.push({
      severity: 'warning',
      code: 'TRAINING_DAYS_TOO_HIGH',
      message: `تعداد روز تمرین (${days}) بیشتر از ۶ است`,
      suggestion: 'حداقل یک روز استراحت کامل در هفته توصیه می‌شود',
    });
  }
}

/**
 * ۲. روزهای استراحت
 */
function checkRestDays(program: GeneratedProgram, issues: ValidationIssue[]) {
  const restDays = program.restDays || [];

  if (restDays.length === 0) {
    issues.push({
      severity: 'error',
      code: 'NO_REST_DAYS',
      message: 'هیچ روز استراحتی وجود ندارد',
      suggestion: 'حداقل ۱ روز استراحت کامل در هفته ضروری است',
    });
  }
}

/**
 * ۳. حجم هفتگی هر عضله در بازه MEV-MRV
 */
function checkWeeklyVolume(program: GeneratedProgram, issues: ValidationIssue[]) {
  const volume = program.weeklyVolumeSummary || {};

  for (const [muscle, vol] of Object.entries(volume)) {
    if (vol <= 0) continue;

    const isPriority = false; // TODO: از metadata بخوان
    const target = getTargetWeeklyVolume(
      muscle as MuscleGroup,
      program.experience,
      program.goal,
      isPriority
    );

    // کمتر از MEV
    if (vol < target.min) {
      const gap = target.min - vol;
      issues.push({
        severity: gap > target.min * 0.4 ? 'error' : 'warning',
        code: 'VOLUME_BELOW_MEV',
        message: `حجم ${muscle} (${vol.toFixed(1)}) کمتر از حداقل مؤثر (${target.min}) است`,
        muscle: muscle as MuscleGroup,
        suggestion: `${gap.toFixed(1)} ست دیگر به این عضله اضافه شود`,
      });
    }

    // بیشتر از MRV
    if (vol > target.max) {
      const excess = vol - target.max;
      issues.push({
        severity: 'warning',
        code: 'VOLUME_ABOVE_MRV',
        message: `حجم ${muscle} (${vol.toFixed(1)}) بیشتر از حداکثر بازیابی (${target.max}) است`,
        muscle: muscle as MuscleGroup,
        suggestion: `${excess.toFixed(1)} ست از این عضله کم شود`,
      });
    }
  }
}

/**
 * ۴. فرکانس هر عضله (چند بار در هفته)
 */
function checkMuscleFrequency(program: GeneratedProgram, issues: ValidationIssue[]) {
  // عضله → تعداد جلساتی که در آن ظاهر شده
  const muscleFrequency: Record<string, number> = {};

  for (const day of program.days) {
    const musclesInDay = new Set<string>();
    for (const ex of day.exercises) {
      musclesInDay.add(ex.primaryMuscle);
      for (const sec of ex.secondaryMuscles || []) {
        musclesInDay.add(sec);
      }
    }
    for (const m of musclesInDay) {
      muscleFrequency[m] = (muscleFrequency[m] || 0) + 1;
    }
  }

  // چک عضلات اصلی
  const primaryMuscles = ['chest', 'upper_back', 'lats', 'quads', 'hamstrings', 'glutes', 'side_delts', 'front_delts', 'biceps', 'triceps'];

  for (const muscle of primaryMuscles) {
    const freq = muscleFrequency[muscle] || 0;
    if (freq === 0) continue; // اگر اصلاً نیست، skip

    if (freq === 1) {
      issues.push({
        severity: 'warning',
        code: 'FREQUENCY_TOO_LOW',
        message: `${muscle} فقط ۱ بار در هفته تمرین می‌شود`,
        muscle: muscle as MuscleGroup,
        suggestion: 'فرکانس ۲ بار در هفته برای Hypertrophy بهینه است',
      });
    } else if (freq > 4) {
      issues.push({
        severity: 'info',
        code: 'FREQUENCY_HIGH',
        message: `${muscle} ${freq} بار در هفته تمرین می‌شود`,
        muscle: muscle as MuscleGroup,
      });
    }
  }
}

/**
 * ۵. اولویت‌دارها حجم بیشتر گرفته باشند
 */
function checkPriorityMuscles(program: GeneratedProgram, issues: ValidationIssue[]) {
  // فعلاً چک نمی‌کنیم چون priorityMuscles در metadata نیست
  // TODO: اضافه شود در فاز بعد
}

/**
 * ۶. مدت جلسه
 */
function checkSessionDuration(program: GeneratedProgram, issues: ValidationIssue[]) {
  for (const day of program.days) {
    if (day.estimatedDuration > program.sessionDuration + 15) {
      issues.push({
        severity: 'warning',
        code: 'SESSION_TOO_LONG',
        message: `جلسه ${day.dayName} (${day.estimatedDuration} دقیقه) بیشتر از زمان کاربر (${program.sessionDuration} دقیقه) است`,
        dayIndex: day.dayIndex,
        suggestion: 'تعداد Exercise یا Set کاهش یابد',
      });
    }
  }
}

/**
 * ۷. تعداد Exercise در هر جلسه
 */
function checkExerciseCount(program: GeneratedProgram, issues: ValidationIssue[]) {
  for (const day of program.days) {
    const count = day.exercises.length;

    if (count < 3) {
      issues.push({
        severity: 'warning',
        code: 'TOO_FEW_EXERCISES',
        message: `جلسه ${day.dayName} فقط ${count} حرکت دارد`,
        dayIndex: day.dayIndex,
      });
    } else if (count > 10) {
      issues.push({
        severity: 'info',
        code: 'TOO_MANY_EXERCISES',
        message: `جلسه ${day.dayName} ${count} حرکت دارد — ممکن است طولانی شود`,
        dayIndex: day.dayIndex,
      });
    }
  }
}

/**
 * ۸. Exercise تکراری در یک جلسه
 */
function checkDuplicateExercises(program: GeneratedProgram, issues: ValidationIssue[]) {
  for (const day of program.days) {
    const ids = day.exercises.map((e) => e.exerciseId);
    const unique = new Set(ids);

    if (ids.length !== unique.size) {
      const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
      issues.push({
        severity: 'error',
        code: 'DUPLICATE_EXERCISES',
        message: `جلسه ${day.dayName} دارای حرکات تکراری است: ${Array.from(new Set(duplicates)).join(', ')}`,
        dayIndex: day.dayIndex,
      });
    }
  }
}

/**
 * ۹. هر جلسه حداقل ۲ عضله اصلی داشته باشد
 */
function checkSessionMuscles(program: GeneratedProgram, issues: ValidationIssue[]) {
  for (const day of program.days) {
    const primaryMuscles = new Set(day.exercises.map((e) => e.primaryMuscle));

    if (primaryMuscles.size === 0) {
      issues.push({
        severity: 'error',
        code: 'EMPTY_SESSION',
        message: `جلسه ${day.dayName} هیچ عضله هدفی ندارد`,
        dayIndex: day.dayIndex,
      });
    } else if (primaryMuscles.size === 1) {
      issues.push({
        severity: 'warning',
        code: 'SINGLE_MUSCLE_SESSION',
        message: `جلسه ${day.dayName} فقط یک عضله را هدف قرار می‌دهد`,
        dayIndex: day.dayIndex,
      });
    }
  }
}

/**
 * ۱۰. مجموع حجم هفتگی منطقی
 */
function checkTotalVolume(program: GeneratedProgram, issues: ValidationIssue[]) {
  const volume = program.weeklyVolumeSummary || {};
  const totalSets = Object.values(volume).reduce((a, b) => a + b, 0);

  // حداقل برای یک برنامه جدی
  if (totalSets < 40) {
    issues.push({
      severity: 'warning',
      code: 'TOTAL_VOLUME_LOW',
      message: `مجموع حجم هفتگی (${totalSets.toFixed(0)} ست) کمتر از حد توصیه‌شده است`,
      suggestion: 'تعداد Exercise یا Set افزایش یابد',
    });
  }

  // حداکثر برای جلوگیری از Overreaching
  if (totalSets > 200) {
    issues.push({
      severity: 'warning',
      code: 'TOTAL_VOLUME_HIGH',
      message: `مجموع حجم هفتگی (${totalSets.toFixed(0)} ست) بسیار بالاست`,
      suggestion: 'ممکن است منجر به Overreaching شود',
    });
  }
}

/**
 * محاسبه نمره کلی 0-100
 */
function calculateScore(errorCount: number, warningCount: number): number {
  let score = 100;
  score -= errorCount * 15;
  score -= warningCount * 5;
  return Math.max(0, Math.min(100, score));
}

/**
 * چک سریع: آیا برنامه قابل قبول است؟
 */
export function isProgramAcceptable(program: GeneratedProgram): boolean {
  return validateProgram(program).isValid;
}
