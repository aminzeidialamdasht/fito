/**
 * Injury Safety Engine — فاز 4
 *
 * این موتور بر اساس آسیب‌های فعال کاربر (از profileAnalyzer.safeInjuries)
 * برنامه تولیدشده را تحلیل می‌کند و:
 *   1. حرکات ممنوعه (high risk برای آسیب کاربر) را پیدا می‌کند
 *   2. حرکات با احتیاط (medium risk) را علامت می‌زند
 *   3. برای هر حرکت ممنوعه، جایگزین ایمن پیشنهاد می‌دهد
 *   4. هشدارهای فارسی تولید می‌کند
 *   5. نمره ایمنی 0-100 می‌دهد
 *
 * قاعده طلایی: همه چیز از پروفایل کاربر جاری می‌شود، نه قواعد ثابت.
 */

import type { Exercise } from '../types/exercise';
import type { GeneratedProgram } from '../types/program';
import type {
  InjuryArea,
  SafetyLevel,
  SafetyReport,
  SafetyWarning,
  Substitution,
} from '../types/injury';
import { INJURY_FA, RISK_LEVEL_NUM } from '../types/injury';
import { ALL_EXERCISES } from '../data/exercises';

/** map exerciseId → Exercise برای lookup سریع */
const EXERCISE_MAP = new Map<string, Exercise>(
  ALL_EXERCISES.map((e) => [e.id, e])
);

/**
 * تبدیل safeInjuries (string[]) از profileAnalyzer به InjuryArea[]
 * فقط مقادیر معتبر نگه داشته می‌شوند.
 */
export function normalizeInjuries(safeInjuries: string[]): InjuryArea[] {
  const valid: InjuryArea[] = [
    'shoulder', 'lowerBack', 'upperBack', 'neck', 'knee', 'hip',
    'hamstring', 'quad', 'glute', 'elbow', 'wrist', 'ankle',
    'biceps', 'triceps',
  ];
  return safeInjuries
    .map((s) => s.toLowerCase())
    .filter((s): s is InjuryArea => valid.includes(s as InjuryArea));
}

/**
 * تعیین سطح ایمنی یک حرکت برای مجموعه‌ای از آسیب‌ها
 *
 * قاعده:
 *   - اگر exercise.isSpineSensitive و کاربر lowerBack دارد → forbidden
 *   - اگر injuryRisk[area] === 'high' → forbidden
 *   - اگر injuryRisk[area] === 'medium' → caution
 *   - اگر هیچ‌کدام → safe
 */
export function getSafetyLevel(
  exercise: Exercise,
  injuries: InjuryArea[]
): SafetyLevel {
  if (injuries.length === 0) return 'safe';

  let level: SafetyLevel = 'safe';

  for (const injury of injuries) {
    // قاعده ویژه ستون فقرات
    if (injury === 'lowerBack' && exercise.isSpineSensitive) {
      return 'forbidden';
    }

    const risk = exercise.injuryRisk?.[injury];
    if (!risk) continue;

    if (risk === 'high') return 'forbidden';
    if (risk === 'medium' && level === 'safe') level = 'caution';
  }

  return level;
}

/**
 * پیدا کردن جایگزین ایمن برای یک حرکت
 *
 * اولویت:
 *   1. exercise.substitutes[] که در برنامه نیست و برای آسیب ایمن است
 *   2. جستجو در ALL_EXERCISES با primaryMuscle یکسان + movementPattern یکسان
 */
function findSaferAlternative(
  exercise: Exercise,
  injuries: InjuryArea[],
  alreadyInProgram: Set<string>
): Exercise | null {
  // ۱. از substitutes تعریف‌شده در خود Exercise
  for (const subId of exercise.substitutes || []) {
    if (alreadyInProgram.has(subId)) continue;
    const sub = EXERCISE_MAP.get(subId);
    if (!sub) continue;
    if (getSafetyLevel(sub, injuries) === 'safe') return sub;
  }

  // ۲. جستجو در همه حرکات
  const candidates = ALL_EXERCISES.filter((e) => {
    if (e.id === exercise.id) return false;
    if (alreadyInProgram.has(e.id)) return false;
    if (e.primaryMuscle !== exercise.primaryMuscle) return false;
    if (e.movementPattern !== exercise.movementPattern) return false;
    return getSafetyLevel(e, injuries) === 'safe';
  });

  // نزدیک‌ترین از نظر isCompound
  const sameCompound = candidates.find((c) => c.isCompound === exercise.isCompound);
  return sameCompound || candidates[0] || null;
}

/**
 * تحلیل کامل ایمنی برنامه
 */
export function analyzeProgramSafety(
  program: GeneratedProgram,
  safeInjuries: string[]
): SafetyReport {
  const injuries = normalizeInjuries(safeInjuries);

  // اگر کاربر آسیب ندارد → گزارش خالی
  if (injuries.length === 0) {
    return {
      score: 100,
      forbidden: [],
      caution: [],
      warnings: [],
      substitutions: [],
      activeInjuries: [],
    };
  }

  const forbidden: Exercise[] = [];
  const caution: Exercise[] = [];
  const substitutions: Substitution[] = [];
  const warningsMap = new Map<string, SafetyWarning>();

  // شناسه همه حرکات برنامه (برای جلوگیری از جایگزین تکراری)
  const programExerciseIds = new Set<string>();
  for (const day of program.days) {
    for (const ge of day.exercises) {
      programExerciseIds.add((ge as any).exerciseId || (ge as any).id);
    }
  }

  for (const day of program.days) {
    for (const ge of day.exercises) {
      // پشتیبانی از هر دو ساختار: GeneratedExercise (exercise کامل) و WorkoutExercise (exerciseId)
      const ex = (ge as any).exercise
        || EXERCISE_MAP.get((ge as any).exerciseId || (ge as any).id);
      if (!ex) continue;
      // eslint-disable-next-line no-console
      const level = getSafetyLevel(ex, injuries);

      if (level === 'forbidden') {
        if (!forbidden.find((f) => f.id === ex.id)) forbidden.push(ex);

        // پیدا کردن جایگزین
        const alt = findSaferAlternative(ex, injuries, programExerciseIds);
        if (alt) {
          substitutions.push({
            originalId: ex.id,
            originalName: ex.name,
            alternativeId: alt.id,
            alternativeName: alt.name,
            injury: injuries[0],
            reasonFa: `${ex.name} برای ${INJURY_FA[injuries[0]]} پرخطر است؛ ${alt.name} ایمن‌تر است.`,
          });
        }

        // هشدار
        const injuredAreas = injuries.filter(
          (inj) => ex.injuryRisk?.[inj] === 'high' || (inj === 'lowerBack' && ex.isSpineSensitive)
        );
        for (const area of injuredAreas) {
          const key = `forbidden_${area}`;
          if (!warningsMap.has(key)) {
            warningsMap.set(key, {
              code: key,
              injury: area,
              severity: 'error',
              messageFa: `حرکات پرخطر برای ${INJURY_FA[area]} در برنامه وجود دارد.`,
              messageEn: `High-risk exercises for ${area} are present in the program.`,
              exerciseIds: [],
            });
          }
          warningsMap.get(key)!.exerciseIds.push(ex.id);
        }
      } else if (level === 'caution') {
        if (!caution.find((c) => c.id === ex.id)) caution.push(ex);

        const injuredAreas = injuries.filter(
          (inj) => ex.injuryRisk?.[inj] === 'medium'
        );
        for (const area of injuredAreas) {
          const key = `caution_${area}`;
          if (!warningsMap.has(key)) {
            warningsMap.set(key, {
              code: key,
              injury: area,
              severity: 'warning',
              messageFa: `حرکات با احتیاط برای ${INJURY_FA[area]} در برنامه وجود دارد. وزنه را سبک نگه دار و تکنیک را رعایت کن.`,
              messageEn: `Caution exercises for ${area} are present. Use lighter loads and strict form.`,
              exerciseIds: [],
            });
          }
          warningsMap.get(key)!.exerciseIds.push(ex.id);
        }
      }
    }
  }

  // محاسبه نمره ایمنی
  const totalExercises = program.days.reduce((sum, d) => sum + d.exercises.length, 0);
  const forbiddenPenalty = forbidden.length * 15;
  const cautionPenalty = caution.length * 5;
  const rawScore = 100 - forbiddenPenalty - cautionPenalty;
  const score = Math.max(0, Math.min(100, rawScore));

  return {
    score,
    forbidden,
    caution,
    warnings: Array.from(warningsMap.values()),
    substitutions,
    activeInjuries: injuries,
  };
}

/**
 * بررسی سریع ایمنی یک حرکت تکی — برای substitutionEngine
 */
export function isExerciseSafeFor(
  exercise: Exercise,
  safeInjuries: string[]
): boolean {
  const injuries = normalizeInjuries(safeInjuries);
  return getSafetyLevel(exercise, injuries) !== 'forbidden';
}

/**
 * تحلیل شرایط پزشکی و یادداشت دارو/هورمون
 * @returns هشدارهای ایمنی اضافی
 */
export function analyzeHealthConditions(profile: {
  healthConditions?: string[];
  hormoneMedNotes?: string;
}): SafetyWarning[] {
  const warnings: SafetyWarning[] = [];

  const healthConditions = profile.healthConditions || [];
  const hormoneNotes = (profile.hormoneMedNotes || '').toLowerCase();

  // شرایط پزشکی که روی تمرین تأثیر دارن
  const highRiskConditions = [
    { keywords: ['فشار خون', 'فشارخون'], message: 'با فشار خون بالا، از حبس نفس در حرکات سنگین اجتناب کن.' },
    { keywords: ['دیابت', 'قند'], message: 'با دیابت، قبل از تمرین قند خون رو چک کن.' },
    { keywords: ['قلب', 'قلبی'], message: 'با مشکل قلبی، شدت تمرین باید تحت نظر پزشک باشه.' },
    { keywords: ['آسم', 'تنفس'], message: 'با آسم، تمرینات هوازی طولانی باید با احتیاط انجام بشه.' },
    { keywords: ['کمردرد', 'دیسک'], message: 'با مشکل کمر، از حرکات فشاری روی ستون فقرات اجتناب کن.' },
  ];

  for (const condition of highRiskConditions) {
    if (healthConditions.some((hc: string) => condition.keywords.some((kw) => hc.includes(kw)))) {
      warnings.push({
        type: 'caution',
        message: condition.message,
      } as any);
    }
  }

  // یادداشت دارو/هورمون
  if (hormoneNotes.includes('استروئید') || hormoneNotes.includes('تستوسترون') || hormoneNotes.includes('هورمون')) {
    warnings.push({
      type: 'info',
      message: 'مصرف هورمون، ریکاوری رو تسریع می‌کنه — برنامه می‌تونه شدیدتر باشه.',
    } as any);
  }

  return warnings;
}
