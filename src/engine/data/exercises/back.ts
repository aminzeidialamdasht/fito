import type { Exercise } from '../../types/exercise';

/**
 * دیتابیس حرکات پشت — ۲۲ حرکت
 * پوشش: هالتر، دمبل، دستگاه (پین‌لود و پیج‌لود)، سیم‌کش، اسمیت، وزن بدن
 * اولویت: تجهیزات موجود در اکثر باشگاه‌های ایران
 *
 * گروه‌بندی:
 *   - لت و بارفیکس (vertical_pull) — lats
 *   - قایقی و نشر خم (horizontal_pull) — upper_back
 *   - پایین پشت (hinge/extension) — lower_back
 *   - سرشانه پشتی (horizontal_pull) — rear_delts
 *   - کول (horizontal_pull) — traps
 */
export const BACK_EXERCISES: Exercise[] = [
  // ═══════════════════════════════════════════════════════════
  // ۱. زیربغل سیم‌کش از جلو (پهن)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_001',
    name: 'زیربغل سیم‌کش از جلو (پهن)',
    englishName: 'Lat Pulldown (Wide Grip)',
    aliases: ['لت پول‌داون', 'زیربغل سیم‌کش', 'لت سیم‌کش'],
    primaryMuscle: 'lats',
    secondaryMuscles: ['biceps', 'upper_back'],
    type: 'compound',
    movementPattern: 'vertical_pull',
    equipment: ['cable'],
    equipmentDetails: {
      primary: 'cable',
      machineType: 'cable',
      variant: 'wide',
    },
    difficulty: 1,
    injuryRisk: { shoulder: 'low', elbow: 'low' },
    substitutes: ['back_002', 'back_004', 'back_013'],
    cues: [
      'میله را با دست‌های بازتر از عرض شانه بگیرید',
      'سینه را به جلو بدهید و کمی به عقب خم شوید',
      'میله را تا سطح بالای سینه پایین بیاورید',
      'کتف‌ها را در پایین جمع کنید',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 12 },
      strength: { min: 6, max: 10 },
      endurance: { min: 12, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 120 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['پایه', 'لت', 'سیم‌کش', 'مبتدی'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۲. زیربغل سیم‌کش از جلو (باریک)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_002',
    name: 'زیربغل سیم‌کش از جلو (باریک)',
    englishName: 'Lat Pulldown (Close Grip)',
    aliases: ['لت پول‌داون باریک', 'زیربغل دسته V'],
    primaryMuscle: 'lats',
    secondaryMuscles: ['biceps', 'upper_back'],
    type: 'compound',
    movementPattern: 'vertical_pull',
    equipment: ['cable'],
    equipmentDetails: {
      primary: 'cable',
      machineType: 'cable',
      variant: 'close',
    },
    difficulty: 1,
    injuryRisk: { shoulder: 'low', elbow: 'low' },
    substitutes: ['back_001', 'back_004', 'back_013'],
    cues: [
      'دسته V را با دو دست بگیرید',
      'آرنج‌ها را نزدیک بدن نگه دارید',
      'میله را تا سطح بالای سینه پایین بیاورید',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 12 },
      strength: { min: 6, max: 10 },
      endurance: { min: 12, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 120 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['لت', 'سیم‌کش', 'مبتدی'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۳. زیربغل سیم‌کش از پشت گردن
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_003',
    name: 'زیربغل سیم‌کش از پشت گردن',
    englishName: 'Behind-the-Neck Lat Pulldown',
    aliases: ['لت پول‌داون پشت گردن'],
    primaryMuscle: 'lats',
    secondaryMuscles: ['biceps', 'upper_back'],
    type: 'compound',
    movementPattern: 'vertical_pull',
    equipment: ['cable'],
    equipmentDetails: {
      primary: 'cable',
      machineType: 'cable',
      variant: 'wide',
    },
    difficulty: 3,
    injuryRisk: { shoulder: 'high' },
    substitutes: ['back_001', 'back_002'],
    cues: [
      'این حرکت برای شانه‌های حساس توصیه نمی‌شود',
      'میله را به آرامی پایین بیاورید',
      'اگر درد شانه دارید، این حرکت را انجام ندهید',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 12 },
      strength: { min: 6, max: 10 },
      endurance: { min: 12, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 120 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['لت', 'سیم‌کش', 'پیشرفته', 'پرریسک'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۴. بارفیکس (پهن)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_004',
    name: 'بارفیکس',
    englishName: 'Pull-up',
    aliases: ['پول آپ', 'بارفیکس پهن'],
    primaryMuscle: 'lats',
    secondaryMuscles: ['biceps', 'upper_back', 'forearms'],
    type: 'compound',
    movementPattern: 'vertical_pull',
    equipment: ['bodyweight', 'pull_up_bar'],
    equipmentDetails: {
      primary: 'bodyweight',
      support: ['pull_up_bar'],
      variant: 'wide',
    },
    difficulty: 3,
    injuryRisk: { shoulder: 'medium', elbow: 'low', wrist: 'low' },
    substitutes: ['back_001', 'back_002', 'back_005', 'back_006'],
    cues: [
      'میله را با دست‌های بازتر از عرض شانه بگیرید',
      'سینه را به میله نزدیک کنید',
      'بدن را بدون تاب دادن بالا بکشید',
      'در پایین کامل آویزان شوید',
    ],
    repRanges: {
      hypertrophy: { min: 6, max: 12 },
      strength: { min: 4, max: 8 },
      endurance: { min: 10, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 180 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['وزن بدن', 'لت', 'پیشرفته'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۵. بارفیکس باریک (چین‌آپ)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_005',
    name: 'بارفیکس باریک (چین‌آپ)',
    englishName: 'Chin-up',
    aliases: ['چین آپ', 'بارفیکس باریک'],
    primaryMuscle: 'lats',
    secondaryMuscles: ['biceps', 'upper_back', 'forearms'],
    type: 'compound',
    movementPattern: 'vertical_pull',
    equipment: ['bodyweight', 'pull_up_bar'],
    equipmentDetails: {
      primary: 'bodyweight',
      support: ['pull_up_bar'],
      variant: 'close',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low', elbow: 'low' },
    substitutes: ['back_004', 'back_001', 'back_002'],
    cues: [
      'میله را با دست‌های به عرض شانه و کف دست به سمت خود بگیرید',
      'بیشتر از بازوها کمک بگیرید',
      'سینه را به میله برسانید',
    ],
    repRanges: {
      hypertrophy: { min: 6, max: 12 },
      strength: { min: 5, max: 10 },
      endurance: { min: 10, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 150 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['وزن بدن', 'لت', 'بازو'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۶. بارفیکس وزنه‌دار
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_006',
    name: 'بارفیکس وزنه‌دار',
    englishName: 'Weighted Pull-up',
    aliases: ['بارفیکس با وزنه', 'پول آپ وزنه‌دار'],
    primaryMuscle: 'lats',
    secondaryMuscles: ['biceps', 'upper_back', 'forearms'],
    type: 'compound',
    movementPattern: 'vertical_pull',
    equipment: ['bodyweight', 'pull_up_bar'],
    equipmentDetails: {
      primary: 'bodyweight',
      support: ['pull_up_bar'],
      variant: 'wide',
    },
    difficulty: 3,
    injuryRisk: { shoulder: 'medium', elbow: 'medium' },
    substitutes: ['back_004', 'back_005'],
    cues: [
      'از کمربند وزنه یا دمبل بین پاها استفاده کنید',
      'حرکت را کنترل‌شده انجام دهید',
      'برای قدرت و هایپرتروفی مناسب است',
    ],
    repRanges: {
      hypertrophy: { min: 5, max: 8 },
      strength: { min: 3, max: 6 },
      endurance: { min: 8, max: 15 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 120, max: 180 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['وزن بدن', 'لت', 'قدرتی', 'پیشرفته'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۷. پول‌اور سیم‌کش (ایستاده)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_007',
    name: 'پول‌اور سیم‌کش',
    englishName: 'Cable Pullover',
    aliases: ['پول اور سیم‌کش', 'پول‌اور ایستاده'],
    primaryMuscle: 'lats',
    secondaryMuscles: ['chest', 'triceps'],
    type: 'isolation',
    movementPattern: 'vertical_pull',
    equipment: ['cable'],
    equipmentDetails: {
      primary: 'cable',
      machineType: 'cable',
      variant: 'standing',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low' },
    substitutes: ['back_001', 'back_002'],
    cues: [
      'میله را با دو دست بگیرید',
      'آرنج‌ها را کمی خم نگه دارید',
      'میله را تا ران پایین بیاورید',
      'بر کشش لت تمرکز کنید',
    ],
    repRanges: {
      hypertrophy: { min: 10, max: 15 },
      strength: { min: 8, max: 12 },
      endurance: { min: 12, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '2-1-1-0',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['لت', 'سیم‌کش', 'ایزوله'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۸. نشر خم هالتر (قایقی هالتر)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_008',
    name: 'نشر خم هالتر',
    englishName: 'Barbell Bent-over Row',
    aliases: ['قایقی هالتر', 'نشر خم', 'پندلی رو'],
    primaryMuscle: 'upper_back',
    secondaryMuscles: ['lats', 'biceps', 'rear_delts', 'lower_back'],
    type: 'compound',
    movementPattern: 'horizontal_pull',
    equipment: ['barbell'],
    equipmentDetails: {
      primary: 'barbell',
      variant: 'bent_over',
    },
    difficulty: 2,
    injuryRisk: { lowerBack: 'medium', shoulder: 'low', elbow: 'low' },
    substitutes: ['back_009', 'back_010', 'back_011', 'back_016'],
    cues: [
      'پاها به عرض شانه، زانوها کمی خم',
      'تنه را تا حدود ۴۵ درجه به جلو خم کنید',
      'میله را به سمت ناف بکشید',
      'کتف‌ها را در انتها جمع کنید',
    ],
    repRanges: {
      hypertrophy: { min: 6, max: 12 },
      strength: { min: 4, max: 8 },
      endurance: { min: 10, max: 18 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 150 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: true,
    tags: ['پایه', 'پشت', 'هالتر', 'قدرتی'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۹. نشر خم دمبل (تک‌دست)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_009',
    name: 'نشر خم دمبل (تک‌دست)',
    englishName: 'One-arm Dumbbell Row',
    aliases: ['قایقی دمبل تک‌دست', 'نشر خم دمبل تک'],
    primaryMuscle: 'upper_back',
    secondaryMuscles: ['lats', 'biceps', 'rear_delts'],
    type: 'compound',
    movementPattern: 'horizontal_pull',
    equipment: ['dumbbell', 'bench'],
    equipmentDetails: {
      primary: 'dumbbell',
      support: ['bench'],
      variant: 'unilateral',
    },
    difficulty: 1,
    injuryRisk: { lowerBack: 'low', shoulder: 'low', elbow: 'low' },
    substitutes: ['back_010', 'back_008', 'back_012'],
    cues: [
      'یک دست و یک زانو روی نیمکت',
      'کمر را صاف نگه دارید',
      'دمبل را به سمت پهلو بکشید',
      'کتف را در انتها جمع کنید',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 12 },
      strength: { min: 6, max: 10 },
      endurance: { min: 12, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 120 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['پشت', 'دمبل', 'تک‌دست', 'مبتدی'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۰. نشر خم دمبل جفت
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_010',
    name: 'نشر خم دمبل جفت',
    englishName: 'Bent-over Dumbbell Row',
    aliases: ['قایقی دمبل جفت', 'نشر خم دمبل'],
    primaryMuscle: 'upper_back',
    secondaryMuscles: ['lats', 'biceps', 'rear_delts', 'lower_back'],
    type: 'compound',
    movementPattern: 'horizontal_pull',
    equipment: ['dumbbell'],
    equipmentDetails: {
      primary: 'dumbbell',
      variant: 'bent_over',
    },
    difficulty: 2,
    injuryRisk: { lowerBack: 'medium', shoulder: 'low' },
    substitutes: ['back_009', 'back_008'],
    cues: [
      'پاها به عرض شانه، زانوها کمی خم',
      'تنه را به جلو خم کنید',
      'هر دو دمبل را به سمت پهلو بکشید',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 12 },
      strength: { min: 6, max: 10 },
      endurance: { min: 12, max: 18 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 120 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: true,
    tags: ['پشت', 'دمبل', 'جفت'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۱. زیربغل T-بار
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_011',
    name: 'زیربغل T-بار',
    englishName: 'T-Bar Row',
    aliases: ['تی بار رو', 'قایقی T'],
    primaryMuscle: 'upper_back',
    secondaryMuscles: ['lats', 'biceps', 'rear_delts', 'lower_back'],
    type: 'compound',
    movementPattern: 'horizontal_pull',
    equipment: ['barbell'],
    equipmentDetails: {
      primary: 'barbell',
      variant: 'bent_over',
    },
    difficulty: 2,
    injuryRisk: { lowerBack: 'medium', shoulder: 'low' },
    substitutes: ['back_008', 'back_012', 'back_013'],
    cues: [
      'میله را بین پاها قرار دهید',
      'تنه را به جلو خم کنید',
      'دسته V را به سمت سینه بکشید',
      'کمر را صاف نگه دارید',
    ],
    repRanges: {
      hypertrophy: { min: 6, max: 12 },
      strength: { min: 5, max: 8 },
      endurance: { min: 10, max: 18 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 150 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: true,
    tags: ['پشت', 'هالتر', 'حجمی'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۲. قایقی سیم‌کش نشسته
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_012',
    name: 'قایقی سیم‌کش نشسته',
    englishName: 'Seated Cable Row',
    aliases: ['قایقی نشسته', 'کابل رو'],
    primaryMuscle: 'upper_back',
    secondaryMuscles: ['lats', 'biceps', 'rear_delts'],
    type: 'compound',
    movementPattern: 'horizontal_pull',
    equipment: ['cable'],
    equipmentDetails: {
      primary: 'cable',
      machineType: 'cable',
      variant: 'seated',
    },
    difficulty: 1,
    injuryRisk: { lowerBack: 'low', shoulder: 'low' },
    substitutes: ['back_013', 'back_014', 'back_009'],
    cues: [
      'زانوها را کمی خم کنید',
      'کمر را صاف نگه دارید',
      'دسته را به سمت ناف بکشید',
      'کتف‌ها را در انتها جمع کنید',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 12 },
      strength: { min: 6, max: 10 },
      endurance: { min: 12, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 120 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['پشت', 'سیم‌کش', 'امن', 'مبتدی'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۳. قایقی دستگاه (پین‌لود)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_013',
    name: 'قایقی دستگاه',
    englishName: 'Machine Row',
    aliases: ['قایقی ماشین', 'دستگاه قایقی'],
    primaryMuscle: 'upper_back',
    secondaryMuscles: ['lats', 'biceps', 'rear_delts'],
    type: 'compound',
    movementPattern: 'horizontal_pull',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'pin_loaded',
      variant: 'seated',
    },
    difficulty: 1,
    injuryRisk: { lowerBack: 'low', shoulder: 'low' },
    substitutes: ['back_012', 'back_014', 'back_001'],
    cues: [
      'سینه را به پد بچسبانید',
      'دسته‌ها را به سمت خود بکشید',
      'کتف‌ها را در انتها جمع کنید',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 12 },
      strength: { min: 6, max: 10 },
      endurance: { min: 12, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 120 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['پشت', 'ماشین', 'امن', 'پین‌لود', 'مبتدی'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۴. زیربغل دستگاه H (هامر)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_014',
    name: 'زیربغل دستگاه H',
    englishName: 'Hammer Strength High Row',
    aliases: ['زیربغل H', 'دستگاه H', 'هامر های رو'],
    primaryMuscle: 'upper_back',
    secondaryMuscles: ['lats', 'biceps', 'rear_delts'],
    type: 'compound',
    movementPattern: 'horizontal_pull',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'plate_loaded',
      variant: 'seated',
    },
    difficulty: 2,
    injuryRisk: { lowerBack: 'low', shoulder: 'low' },
    substitutes: ['back_013', 'back_012', 'back_001'],
    cues: [
      'سینه را به پد بچسبانید',
      'دسته‌ها را به سمت پایین و عقب بکشید',
      'کتف‌ها را در انتها جمع کنید',
      'حرکت را کنترل‌شده انجام دهید',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 12 },
      strength: { min: 6, max: 10 },
      endurance: { min: 12, max: 18 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 120 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['پشت', 'هامر', 'پیج‌لود', 'امن'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۵. سیم‌کش تک‌دست (قایقی تک‌دست)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_015',
    name: 'سیم‌کش تک‌دست',
    englishName: 'Single-arm Cable Row',
    aliases: ['قایقی سیم‌کش تک‌دست', 'کابل رو تک‌دست'],
    primaryMuscle: 'upper_back',
    secondaryMuscles: ['lats', 'biceps', 'rear_delts'],
    type: 'compound',
    movementPattern: 'horizontal_pull',
    equipment: ['cable'],
    equipmentDetails: {
      primary: 'cable',
      machineType: 'cable',
      variant: 'unilateral',
    },
    difficulty: 2,
    injuryRisk: { lowerBack: 'low', shoulder: 'low' },
    substitutes: ['back_009', 'back_012', 'back_013'],
    cues: [
      'با یک دست دسته را بگیرید',
      'تنه را ثابت نگه دارید',
      'دسته را به سمت پهلو بکشید',
      'کتف را در انتها جمع کنید',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 12 },
      strength: { min: 6, max: 10 },
      endurance: { min: 12, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['پشت', 'سیم‌کش', 'تک‌دست'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۶. قایقی هالتر دست‌معکوس
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_016',
    name: 'قایقی هالتر دست‌معکوس',
    englishName: 'Reverse Grip Barbell Row',
    aliases: ['قایقی معکوس', 'نشر خم معکوس'],
    primaryMuscle: 'upper_back',
    secondaryMuscles: ['lats', 'biceps', 'lower_back'],
    type: 'compound',
    movementPattern: 'horizontal_pull',
    equipment: ['barbell'],
    equipmentDetails: {
      primary: 'barbell',
      variant: 'bent_over',
    },
    difficulty: 2,
    injuryRisk: { lowerBack: 'medium', elbow: 'medium', wrist: 'low' },
    substitutes: ['back_008', 'back_011'],
    cues: [
      'میله را با کف دست به سمت خود بگیرید',
      'تنه را به جلو خم کنید',
      'میله را به سمت ناف بکشید',
      'بیشتر روی لت تمرکز کنید',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 12 },
      strength: { min: 6, max: 10 },
      endurance: { min: 12, max: 18 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 150 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: true,
    tags: ['پشت', 'هالتر', 'لت'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۷. ددلیفت رومانیایی
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_017',
    name: 'ددلیفت رومانیایی',
    englishName: 'Romanian Deadlift',
    aliases: ['RDL', 'ددلیفت رومانی', 'پشت پا هالتر'],
    primaryMuscle: 'lower_back',
    secondaryMuscles: ['hamstrings', 'glutes', 'traps'],
    type: 'compound',
    movementPattern: 'hinge',
    equipment: ['barbell'],
    equipmentDetails: {
      primary: 'barbell',
      variant: 'standing',
    },
    difficulty: 3,
    injuryRisk: { lowerBack: 'high', hamstring: 'medium', knee: 'low' },
    substitutes: ['back_018'],
    cues: [
      'میله را با دست‌های به عرض شانه بگیرید',
      'کمر را صاف نگه دارید',
      'میله را نزدیک پاها نگه دارید',
      'تا حس کشش در پشت پا پایین بروید',
    ],
    repRanges: {
      hypertrophy: { min: 6, max: 12 },
      strength: { min: 4, max: 8 },
      endurance: { min: 10, max: 15 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 120, max: 180 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: true,
    tags: ['پشت', 'هالتر', 'پایین پشت', 'پیشرفته'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۸. هایپراکستنشن
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_018',
    name: 'هایپراکستنشن',
    englishName: 'Back Extension',
    aliases: ['هایپر', 'پشت دستگاه'],
    primaryMuscle: 'lower_back',
    secondaryMuscles: ['glutes', 'hamstrings'],
    type: 'isolation',
    movementPattern: 'extension',
    equipment: ['bodyweight'],
    equipmentDetails: {
      primary: 'bodyweight',
      variant: 'lying',
    },
    difficulty: 1,
    injuryRisk: { lowerBack: 'low' },
    substitutes: ['back_017'],
    cues: [
      'پاها را ثابت کنید',
      'بدن را از کمر به بالا بیاورید',
      'در بالا کمی توقف کنید',
      'به آرامی پایین بیایید',
    ],
    repRanges: {
      hypertrophy: { min: 10, max: 15 },
      strength: { min: 8, max: 12 },
      endurance: { min: 15, max: 25 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '2-1-1-1',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['پایین پشت', 'وزن بدن', 'مبتدی'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۹. فلای بک (دستگاه معکوس)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_019',
    name: 'فلای بک',
    englishName: 'Reverse Pec Deck / Rear Delt Machine',
    aliases: ['فلای بک', 'دستگاه سرشانه پشتی', 'پک دک معکوس'],
    primaryMuscle: 'rear_delts',
    secondaryMuscles: ['upper_back', 'traps'],
    type: 'isolation',
    movementPattern: 'horizontal_pull',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'pin_loaded',
      variant: 'seated',
    },
    difficulty: 1,
    injuryRisk: { shoulder: 'low' },
    substitutes: ['back_020', 'back_013'],
    cues: [
      'سینه را به پد بچسبانید',
      'دستگیره‌ها را بگیرید',
      'دست‌ها را به عقب باز کنید',
      'بر سرشانه پشتی تمرکز کنید',
    ],
    repRanges: {
      hypertrophy: { min: 12, max: 15 },
      strength: { min: 10, max: 12 },
      endurance: { min: 15, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 0, max: 2 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '2-1-1-0',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['سرشانه پشتی', 'ماشین', 'پین‌لود', 'ایزوله'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۲۰. فیس پول
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_020',
    name: 'فیس پول',
    englishName: 'Face Pull',
    aliases: ['فیس پول', 'فیس‌پول', 'کشش صورت'],
    primaryMuscle: 'rear_delts',
    secondaryMuscles: ['traps', 'upper_back'],
    type: 'isolation',
    movementPattern: 'horizontal_pull',
    equipment: ['cable'],
    equipmentDetails: {
      primary: 'cable',
      machineType: 'cable',
      variant: 'standing',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low' },
    substitutes: ['back_019', 'back_012'],
    cues: [
      'طناب را با دو دست بگیرید',
      'طناب را به سمت صورت بکشید',
      'آرنج‌ها را بالا نگه دارید',
      'در انتها کتف‌ها را جمع کنید',
    ],
    repRanges: {
      hypertrophy: { min: 12, max: 20 },
      strength: { min: 10, max: 15 },
      endurance: { min: 15, max: 25 },
    },
    rirRange: {
      hypertrophy: { min: 0, max: 2 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '2-1-1-0',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['سرشانه پشتی', 'سیم‌کش', 'سلامت شانه'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۲۱. شراگ هالتر
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_021',
    name: 'شراگ هالتر',
    englishName: 'Barbell Shrug',
    aliases: ['شراگ', 'کول هالتر'],
    primaryMuscle: 'traps',
    secondaryMuscles: ['upper_back'],
    type: 'isolation',
    movementPattern: 'horizontal_pull',
    equipment: ['barbell'],
    equipmentDetails: {
      primary: 'barbell',
      variant: 'standing',
    },
    difficulty: 1,
    injuryRisk: { shoulder: 'low', lowerBack: 'low' },
    substitutes: ['back_022'],
    cues: [
      'میله را با دست‌های به عرض شانه بگیرید',
      'شانه‌ها را به سمت گوش‌ها بالا بکشید',
      'در بالا کمی توقف کنید',
      'آرنج‌ها را صاف نگه دارید',
    ],
    repRanges: {
      hypertrophy: { min: 10, max: 15 },
      strength: { min: 8, max: 12 },
      endurance: { min: 15, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '2-1-2-1',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['کول', 'هالتر', 'ایزوله'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۲۲. شراگ دمبل
  // ═══════════════════════════════════════════════════════════
  {
    id: 'back_022',
    name: 'شراگ دمبل',
    englishName: 'Dumbbell Shrug',
    aliases: ['شراگ دمبل', 'کول دمبل'],
    primaryMuscle: 'traps',
    secondaryMuscles: ['upper_back'],
    type: 'isolation',
    movementPattern: 'horizontal_pull',
    equipment: ['dumbbell'],
    equipmentDetails: {
      primary: 'dumbbell',
      variant: 'standing',
    },
    difficulty: 1,
    injuryRisk: { shoulder: 'low' },
    substitutes: ['back_021'],
    cues: [
      'دمبل‌ها را در دو طرف بدن بگیرید',
      'شانه‌ها را به سمت گوش‌ها بالا بکشید',
      'در بالا کمی توقف کنید',
      'به آرامی پایین بیاورید',
    ],
    repRanges: {
      hypertrophy: { min: 10, max: 15 },
      strength: { min: 8, max: 12 },
      endurance: { min: 15, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '2-1-2-1',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['کول', 'دمبل', 'ایزوله'],
  },
];
