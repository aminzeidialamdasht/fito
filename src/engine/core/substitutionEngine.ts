/**
 * موتور جایگزینی هوشمند حرکات
 *
 * هدف: وقتی کاربر می‌گوید «این دستگاه را ندارم» یا تجهیزاتش محدود است،
 * نزدیک‌ترین حرکت جایگزین را بر اساس:
 *   1. عضله هدف یکسان
 *   2. الگوی حرکتی یکسان
 *   3. تجهیزات موجود
 *   4. عدم تضاد با آسیب‌ها
 *   5. شباهت نوع (compound/isolation)
 * پیدا کند.
 */

import type {
  Exercise,
  EquipmentType,
  SubstituteOptions,
  SubstituteCandidate,
  InjuryRiskLevel,
} from '../types/exercise';

/**
 * وزن امتیازدهی هر معیار
 */
const SCORE_WEIGHTS = {
  sameMovementPattern: 30,
  samePrimaryMuscle: 25,
  sharedSecondaryMuscles: 5, // به ازای هر عضله مشترک، حداکثر 15
  sameType: 15,
  sameDifficulty: 10,
  sameEquipmentPrimary: 5,
  sameMachineType: 5,
  manualSubstitute: 20,
};

/**
 * نگاشت سطح آسیب‌ریسک به عدد برای فیلتر
 */
const RISK_ORDER: Record<InjuryRiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

/**
 * بررسی می‌کند که آیا حرکت با آسیب‌های کاربر تضاد دارد یا خیر
 * قاعده: اگر injuryRisk حرکت 'high' باشد و کاربر آن آسیب را داشته باشد → رد
 *        اگر 'medium' باشد و کاربر آسیب داشته باشد → رد (محافظه‌کارانه)
 *        اگر 'low' باشد → قابل قبول
 */
function hasInjuryConflict(
  exercise: Exercise,
  injuries: Partial<Record<string, InjuryRiskLevel>> | undefined
): boolean {
  if (!injuries) return false;

  const riskKeys: (keyof typeof exercise.injuryRisk)[] = [
    'shoulder',
    'lowerBack',
    'knee',
    'hip',
    'elbow',
    'wrist',
    'ankle',
  ];

  for (const key of riskKeys) {
    const userInjury = injuries[key];
    if (!userInjury) continue;

    const exerciseRisk = exercise.injuryRisk[key];
    if (!exerciseRisk) continue;

    // اگر حرکت برای این ناحیه medium یا high باشد، و کاربر آسیب دارد → رد
    if (RISK_ORDER[exerciseRisk] >= RISK_ORDER['medium']) {
      return true;
    }
  }

  return false;
}

/**
 * بررسی می‌کند که آیا تجهیزات مورد نیاز حرکت در دسترس کاربر هست یا خیر
 * اگر equipmentDetails وجود دارد، primary و support را چک می‌کند
 * در غیر این صورت، equipment array را چک می‌کند
 */
function isEquipmentAvailable(
  exercise: Exercise,
  availableEquipment: EquipmentType[]
): boolean {
  const available = new Set(availableEquipment);

  // اگر equipmentDetails هست، دقیق‌تر چک کن
  if (exercise.equipmentDetails) {
    const { primary, support } = exercise.equipmentDetails;

    if (!available.has(primary)) return false;

    if (support && support.length > 0) {
      // اگر support دارد، حداقل یکی از آن‌ها باید موجود باشد
      // (چون بعضی حرکات چند گزینه support دارند)
      const hasAnySupport = support.some((s) => available.has(s));
      if (!hasAnySupport) return false;
    }

    return true;
  }

  // fallback: همه equipment باید موجود باشند
  if (exercise.equipment.length === 0) return true; // bodyweight
  return exercise.equipment.every((eq) => available.has(eq));
}

/**
 * محاسبه امتیاز شباهت بین دو حرکت
 */
function scoreCandidate(
  source: Exercise,
  candidate: Exercise,
  options: SubstituteOptions
): SubstituteCandidate {
  let score = 0;
  const reasons: string[] = [];

  // ۱. الگوی حرکتی یکسان
  if (candidate.movementPattern === source.movementPattern) {
    score += SCORE_WEIGHTS.sameMovementPattern;
    reasons.push('الگوی حرکتی یکسان');
  }

  // ۲. عضله اصلی یکسان
  if (candidate.primaryMuscle === source.primaryMuscle) {
    score += SCORE_WEIGHTS.samePrimaryMuscle;
    reasons.push('عضله هدف یکسان');
  }

  // ۳. عضلات ثانویه مشترک
  const sharedSecondary = candidate.secondaryMuscles.filter((m) =>
    source.secondaryMuscles.includes(m)
  );
  if (sharedSecondary.length > 0) {
    const bonus = Math.min(
      sharedSecondary.length * SCORE_WEIGHTS.sharedSecondaryMuscles,
      15
    );
    score += bonus;
    reasons.push(`${sharedSecondary.length} عضله ثانویه مشترک`);
  }

  // ۴. نوع یکسان (compound / isolation)
  if (candidate.type === source.type) {
    score += SCORE_WEIGHTS.sameType;
    reasons.push('نوع یکسان');
  }

  // ۵. سطح دشواری یکسان
  if (candidate.difficulty === source.difficulty) {
    score += SCORE_WEIGHTS.sameDifficulty;
  } else if (Math.abs(candidate.difficulty - source.difficulty) === 1) {
    score += SCORE_WEIGHTS.sameDifficulty / 2;
  }

  // ۶. تجهیز اصلی یکسان
  if (
    source.equipmentDetails &&
    candidate.equipmentDetails &&
    source.equipmentDetails.primary === candidate.equipmentDetails.primary
  ) {
    score += SCORE_WEIGHTS.sameEquipmentPrimary;
    reasons.push('تجهیز اصلی یکسان');
  }

  // ۷. نوع دستگاه یکسان
  if (
    source.equipmentDetails?.machineType &&
    candidate.equipmentDetails?.machineType &&
    source.equipmentDetails.machineType === candidate.equipmentDetails.machineType
  ) {
    score += SCORE_WEIGHTS.sameMachineType;
  }

  // ۸. اگر در لیست substitutes دستی source باشد
  if (source.substitutes.includes(candidate.id)) {
    score += SCORE_WEIGHTS.manualSubstitute;
    reasons.push('جایگزین دستی تعیین‌شده');
  }

  return { exercise: candidate, score, reasons };
}

/**
 * تابع اصلی: پیدا کردن جایگزین‌های هوشمند برای یک حرکت
 */
export function findSubstitutes(
  source: Exercise,
  allExercises: Exercise[],
  options: SubstituteOptions
): SubstituteCandidate[] {
  const {
    availableEquipment,
    injuries,
    maxResults = 5,
    excludeIds = [],
    sameDifficultyOnly = false,
  } = options;

  const excludeSet = new Set([source.id, ...excludeIds]);

  const candidates: SubstituteCandidate[] = [];

  for (const ex of allExercises) {
    // رد کردن خود حرکت و موارد مستثنی
    if (excludeSet.has(ex.id)) continue;

    // فیلتر عضله اصلی
    if (ex.primaryMuscle !== source.primaryMuscle) continue;

    // فیلتر الگوی حرکتی (اجباری — نباید پرس سینه را با اسکوات جایگزین کرد)
    if (ex.movementPattern !== source.movementPattern) continue;

    // فیلتر تجهیزات موجود
    if (!isEquipmentAvailable(ex, availableEquipment)) continue;

    // فیلتر آسیب
    if (hasInjuryConflict(ex, injuries)) continue;

    // فیلتر سطح دشواری
    if (
      sameDifficultyOnly &&
      Math.abs(ex.difficulty - source.difficulty) > 1
    ) {
      continue;
    }

    // امتیازدهی
    const scored = scoreCandidate(source, ex, options);
    candidates.push(scored);
  }

  // مرتب‌سازی نزولی بر اساس امتیاز
  candidates.sort((a, b) => b.score - a.score);

  return candidates.slice(0, maxResults);
}

/**
 * نسخه ساده: فقط لیست حرکات را برگردان (بدون امتیاز)
 */
export function findSubstituteExercises(
  source: Exercise,
  allExercises: Exercise[],
  options: SubstituteOptions
): Exercise[] {
  return findSubstitutes(source, allExercises, options).map((c) => c.exercise);
}

/**
 * بررسی سریع: آیا این حرکت برای کاربر قابل انجام است؟
 */
export function isExerciseAvailable(
  exercise: Exercise,
  availableEquipment: EquipmentType[],
  injuries?: Partial<Record<string, InjuryRiskLevel>>
): boolean {
  return (
    isEquipmentAvailable(exercise, availableEquipment) &&
    !hasInjuryConflict(exercise, injuries)
  );
}

/**
 * فیلتر کردن کل دیتابیس بر اساس تجهیزات و آسیب‌های کاربر
 */
export function filterAvailableExercises(
  exercises: Exercise[],
  availableEquipment: EquipmentType[],
  injuries?: Partial<Record<string, InjuryRiskLevel>>
): Exercise[] {
  return exercises.filter((ex) =>
    isExerciseAvailable(ex, availableEquipment, injuries)
  );
}
