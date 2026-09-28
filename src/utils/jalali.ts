import { toJalaali, toGregorian, isLeapJalaaliYear, jalaaliMonthLength } from 'jalaali-js';

const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const PERSIAN_WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];

export function toPersianNumber(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
}

export function getTodayJalali(): { year: number; month: number; day: number } {
  const today = new Date();
  const j = toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
  return { year: j.jy, month: j.jm, day: j.jd };
}

export function getTodayJalaliString(): string {
  const { year, month, day } = getTodayJalali();
  return `${toPersianNumber(year)}/${toPersianNumber(String(month).padStart(2, '0'))}/${toPersianNumber(String(day).padStart(2, '0'))}`;
}

export function getMonthName(month: number): string {
  return PERSIAN_MONTHS[month - 1];
}

export function getWeekdayName(date: Date): string {
  const day = date.getDay();
  const persianDay = (day + 1) % 7;
  return PERSIAN_WEEKDAYS[persianDay];
}

export function getJalaliMonthDays(year: number, month: number): number {
  return jalaaliMonthLength(year, month);
}

export function getMonthStartWeekday(year: number, month: number): number {
  const gDate = toGregorian(year, month, 1);
  const date = new Date(gDate.gy, gDate.gm - 1, gDate.gd);
  const day = date.getDay();
  return (day + 1) % 7;
}

export function getJalaliCalendarDays(year: number, month: number): (number | null)[] {
  const days: (number | null)[] = [];
  const startWeekday = getMonthStartWeekday(year, month);
  const totalDays = getJalaliMonthDays(year, month);
  
  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }
  return days;
}

export function formatDateJalali(dateStr: string): string {
  const date = new Date(dateStr);
  const jalali = toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return `${toPersianNumber(jalali.jd)} ${getMonthName(jalali.jm)} ${toPersianNumber(jalali.jy)}`;
}

export function getPersianDate(): string {
  const { year, month, day } = getTodayJalali();
  return `${toPersianNumber(day)} ${getMonthName(month)} ${toPersianNumber(year)}`;
}

export function isLeapYear(year: number): boolean {
  return isLeapJalaaliYear(year);
}

export function parseDurationInDays(durationStr: string): number {
  if (!durationStr) return 28;
  const normalized = String(durationStr)
    .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
    .toLowerCase()
    .trim();

  if (normalized.includes('یک ماه') || normalized.includes('یک‌ماه')) return 30;
  if (normalized.includes('دو ماه') || normalized.includes('دو‌ماه')) return 60;
  if (normalized.includes('سه ماه') || normalized.includes('سه‌ماه')) return 90;
  if (normalized.includes('یک هفته') || normalized.includes('یک‌هفته')) return 7;
  if (normalized.includes('دو هفته') || normalized.includes('دو‌هفته')) return 14;

  const matchNum = normalized.match(/\d+/);
  const num = matchNum ? parseInt(matchNum[0], 10) : null;

  if (normalized.includes('ماه') || normalized.includes('month')) {
    return (num || 1) * 30;
  }
  if (normalized.includes('هفته') || normalized.includes('week')) {
    return (num || 4) * 7;
  }
  if (normalized.includes('روز') || normalized.includes('day')) {
    return num || 30;
  }

  return num ? num * 7 : 28;
}

export interface ProgramTimelineDetails {
  startDate: Date;
  startDateIso: string;
  startDateJalali: string;
  endDate: Date;
  endDateIso: string;
  endDateJalali: string;
  totalDays: number;
  daysPassed: number;
  daysRemaining: number;
  progressPercent: number;
  isAlarmRequired: boolean;
  isExpired: boolean;
}

export function getProgramTimelineDetails(
  startDateStr?: string,
  durationStr?: string,
  createdAtStr?: string
): ProgramTimelineDetails {
  const rawStart = startDateStr || createdAtStr || new Date().toISOString();
  const startDate = new Date(rawStart);
  if (isNaN(startDate.getTime())) {
    startDate.setTime(Date.now());
  }

  const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const today = new Date();
  const currentDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const totalDays = parseDurationInDays(durationStr || '4 هفته');
  const endDate = new Date(startDay.getTime() + totalDays * 24 * 60 * 60 * 1000);

  const diffTime = currentDay.getTime() - startDay.getTime();
  const daysPassed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.ceil((endDate.getTime() - currentDay.getTime()) / (1000 * 60 * 60 * 24));

  const progressPercent = Math.min(100, Math.max(0, Math.round((daysPassed / totalDays) * 100)));

  const isAlarmRequired = daysRemaining <= 1 && daysRemaining >= -7;
  const isExpired = daysRemaining < 0;

  return {
    startDate: startDay,
    startDateIso: startDay.toISOString().split('T')[0],
    startDateJalali: formatDateJalali(startDay.toISOString()),
    endDate,
    endDateIso: endDate.toISOString().split('T')[0],
    endDateJalali: formatDateJalali(endDate.toISOString()),
    totalDays,
    daysPassed,
    daysRemaining,
    progressPercent,
    isAlarmRequired,
    isExpired,
  };
}

export { PERSIAN_MONTHS, PERSIAN_WEEKDAYS };
