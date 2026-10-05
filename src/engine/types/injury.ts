/**
 * تایپ‌های Injury Safety Engine — فاز 4
 *
 * هدف: شناسایی حرکات پرخطر برای آسیب‌های کاربر، پیشنهاد جایگزین،
 * و تولید گزارش فارسی قابل نمایش در ProgramDetail.
 */

import type { Exercise, InjuryRiskLevel } from './exercise';

/** نواحی آسیب پشتیبانی‌شده (هم‌راستا با InjuryRisk در exercise.ts) */
export type InjuryArea =
  | 'shoulder'
  | 'lowerBack'
  | 'upperBack'
  | 'neck'
  | 'knee'
  | 'hip'
  | 'hamstring'
  | 'quad'
  | 'glute'
  | 'elbow'
  | 'wrist'
  | 'ankle'
  | 'biceps'
  | 'triceps';

/** سطح ایمنی یک حرکت برای کاربر */
export type SafetyLevel = 'forbidden' | 'caution' | 'safe';

/** یک هشدار ایمنی */
export interface SafetyWarning {
  code: string;
  injury: InjuryArea;
  severity: 'error' | 'warning' | 'info';
  messageFa: string;
  messageEn: string;
  exerciseIds: string[];
}

/** پیشنهاد جایگزین */
export interface Substitution {
  originalId: string;
  originalName: string;
  alternativeId: string;
  alternativeName: string;
  injury: InjuryArea;
  reasonFa: string;
}

/** گزارش کامل ایمنی برنامه */
export interface SafetyReport {
  /** نمره 0-100 — هر چه بالاتر، ایمن‌تر */
  score: number;
  /** حرکات ممنوعه (high risk + آسیب کاربر) */
  forbidden: Exercise[];
  /** حرکات با احتیاط (medium risk + آسیب کاربر) */
  caution: Exercise[];
  /** هشدارهای فارسی برای نمایش */
  warnings: SafetyWarning[];
  /** جایگزین‌های پیشنهادی */
  substitutions: Substitution[];
  /** آسیب‌های فعال کاربر */
  activeInjuries: InjuryArea[];
}

/** نگاشت آسیب انگلیسی به فارسی */
export const INJURY_FA: Record<InjuryArea, string> = {
  shoulder: 'شانه',
  lowerBack: 'کمر',
  upperBack: 'پشت بالایی',
  neck: 'گردن',
  knee: 'زانو',
  hip: 'لگن',
  hamstring: 'همسترینگ',
  quad: 'چهارسر',
  glute: 'سرینی',
  elbow: 'آرنج',
  wrist: 'مچ دست',
  ankle: 'مچ پا',
  biceps: 'جلوبازو',
  triceps: 'پشت‌بازو',
};

/** سطح ریسک به عدد — برای مقایسه */
export const RISK_LEVEL_NUM: Record<InjuryRiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
};
