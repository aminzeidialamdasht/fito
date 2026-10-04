import type { Exercise } from '../../types/exercise';

/**
 * دیتابیس حرکات سرشانه — ۱۵ حرکت
 * پوشش: هالتر، دمبل، دستگاه (پین‌لود)، سیم‌کش، اسمیت
 * اولویت: تجهیزات موجود در اکثر باشگاه‌های ایران
 *
 * توجه: rear delts (سرشانه پشتی) در back.ts قرار دارند:
 *   - back_019 (فلای بک / پک دک معکوس)
 *   - back_020 (فیس پول)
 */
export const SHOULDER_EXERCISES: Exercise[] = [
  // ═══════════════════════════════════════════════════════════
  // گروه ۱: سرشانه جلو (front_delts) — پرس‌ها
  // ═══════════════════════════════════════════════════════════

  // ۱. پرس سرشانه هالتر ایستاده
  {
    id: 'shoulder_001',
    name: 'پرس سرشانه هالتر ایستاده',
    englishName: 'Standing Barbell Overhead Press',
    aliases: ['پرس نظامی', 'OHP', 'پرس سرشانه'],
    primaryMuscle: 'front_delts',
    secondaryMuscles: ['side_delts', 'triceps', 'upper_back'],
    type: 'compound',
    movementPattern: 'vertical_push',
    equipment: ['barbell'],
    equipmentDetails: {
      primary: 'barbell',
      variant: 'standing',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'medium', lowerBack: 'medium' },
    substitutes: ['shoulder_002', 'shoulder_003', 'shoulder_005'],
    cues: [
      'هالتر را از روی سینه پرس کنید',
      'در بالا سر را کمی جلو ببرید',
      'کمر صاف، شکم سفت',
      'پاها را محکم روی زمین فشار دهید',
    ],
    repRanges: {
      hypertrophy: { min: 6, max: 10 },
      strength: { min: 3, max: 6 },
      endurance: { min: 10, max: 15 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 120, max: 180 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['پایه', 'قدرتی', 'سرشانه جلو', 'هالتر'],
  },

  // ۲. پرس سرشانه دمبل نشسته
  {
    id: 'shoulder_002',
    name: 'پرس سرشانه دمبل نشسته',
    englishName: 'Seated Dumbbell Shoulder Press',
    aliases: ['پرس سرشانه دمبل', 'پرس دمبل سرشانه'],
    primaryMuscle: 'front_delts',
    secondaryMuscles: ['side_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'vertical_push',
    equipment: ['dumbbell', 'bench'],
    equipmentDetails: {
      primary: 'dumbbell',
      support: ['bench'],
      variant: 'seated',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low', elbow: 'low' },
    substitutes: ['shoulder_001', 'shoulder_003', 'shoulder_006'],
    cues: [
      'دمبل‌ها را از کنار گوش به بالا پرس کنید',
      'آرنج‌ها کمی جلو باشند',
      'کمر به نیمکت چسبیده باشد',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 12 },
      strength: { min: 6, max: 10 },
      endurance: { min: 12, max: 15 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 150 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['سرشانه جلو', 'پایه', 'دمبل'],
  },

  // ۳. نشر جانب دمبل ایستاده
  {
    id: 'shoulder_003',
    name: 'نشر جانب دمبل ایستاده',
    englishName: 'Standing Dumbbell Lateral Raise',
    aliases: ['نشر جانب', 'لترال ریز', 'نشر از جانب'],
    primaryMuscle: 'side_delts',
    secondaryMuscles: ['front_delts'],
    type: 'isolation',
    movementPattern: 'vertical_push',
    equipment: ['dumbbell'],
    equipmentDetails: {
      primary: 'dumbbell',
      variant: 'standing',
    },
    difficulty: 1,
    injuryRisk: { shoulder: 'medium' },
    substitutes: ['shoulder_004', 'shoulder_010', 'shoulder_011'],
    cues: [
      'آرنج‌ها کمی خم',
      'دمبل‌ها را تا سطح شانه بالا ببرید',
      'از تاب دادن بدن خودداری کنید',
      'در بالا کمی توقف کنید',
    ],
    repRanges: {
      hypertrophy: { min: 12, max: 20 },
      strength: { min: 8, max: 12 },
      endurance: { min: 15, max: 25 },
    },
    rirRange: {
      hypertrophy: { min: 0, max: 2 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '2-0-1-1',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['سرشانه میانی', 'ایزوله', 'دمبل'],
  },

  // ۴. نشر جانب سیم‌کش (ایستاده)
  {
    id: 'shoulder_004',
    name: 'نشر جانب سیم‌کش',
    englishName: 'Cable Lateral Raise',
    aliases: ['نشر سیم‌کش'],
    primaryMuscle: 'side_delts',
    secondaryMuscles: ['front_delts'],
    type: 'isolation',
    movementPattern: 'vertical_push',
    equipment: ['cable'],
    equipmentDetails: {
      primary: 'cable',
      machineType: 'cable',
      variant: 'standing',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low' },
    substitutes: ['shoulder_003', 'shoulder_012', 'shoulder_013'],
    cues: [
      'سیم را از پشت بدن بکشید',
      'کشش مداوم در تمام دامنه',
      'بدن ثابت بماند',
    ],
    repRanges: {
      hypertrophy: { min: 12, max: 20 },
      strength: { min: 8, max: 12 },
      endurance: { min: 15, max: 25 },
    },
    rirRange: {
      hypertrophy: { min: 0, max: 2 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '2-0-1-1',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['سرشانه میانی', 'کشش مداوم', 'سیم‌کش'],
  },

  // ۵. پرس سرشانه دستگاه (نشسته)
  {
    id: 'shoulder_005',
    name: 'پرس سرشانه دستگاه',
    englishName: 'Machine Shoulder Press',
    aliases: ['پرس سرشانه ماشین', 'دستگاه پرس سرشانه'],
    primaryMuscle: 'front_delts',
    secondaryMuscles: ['side_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'vertical_push',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'pin_loaded',
      variant: 'seated',
    },
    difficulty: 1,
    injuryRisk: { shoulder: 'low' },
    substitutes: ['shoulder_001', 'shoulder_002', 'shoulder_014'],
    cues: [
      'پشت کامل به پد چسبیده باشد',
      'دسته‌ها را به بالا پرس کنید',
      'در بالا آرنج‌ها را کامل صاف نکنید',
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
    tags: ['سرشانه جلو', 'ماشین', 'امن', 'پین‌لود', 'مبتدی'],
  },

  // ۶. نشر از جلو دمبل
  {
    id: 'shoulder_006',
    name: 'نشر از جلو دمبل',
    englishName: 'Dumbbell Front Raise',
    aliases: ['نشر جلو', 'فرانت ریز'],
    primaryMuscle: 'front_delts',
    secondaryMuscles: ['side_delts'],
    type: 'isolation',
    movementPattern: 'vertical_push',
    equipment: ['dumbbell'],
    equipmentDetails: {
      primary: 'dumbbell',
      variant: 'standing',
    },
    difficulty: 1,
    injuryRisk: { shoulder: 'medium' },
    substitutes: ['shoulder_007', 'shoulder_009'],
    cues: [
      'دمبل‌ها را تا سطح شانه بالا ببرید',
      'بدن ثابت بماند',
      'حرکت را کنترل‌شده انجام دهید',
    ],
    repRanges: {
      hypertrophy: { min: 12, max: 15 },
      strength: { min: 8, max: 12 },
      endurance: { min: 15, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 0, max: 2 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '2-0-1-1',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['سرشانه جلو', 'ایزوله', 'دمبل'],
  },

  // ۷. نشر از جلو سیم‌کش
  {
    id: 'shoulder_007',
    name: 'نشر از جلو سیم‌کش',
    englishName: 'Cable Front Raise',
    aliases: ['نشر جلو سیم'],
    primaryMuscle: 'front_delts',
    secondaryMuscles: [],
    type: 'isolation',
    movementPattern: 'vertical_push',
    equipment: ['cable'],
    equipmentDetails: {
      primary: 'cable',
      machineType: 'cable',
      variant: 'standing',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low' },
    substitutes: ['shoulder_006', 'shoulder_009'],
    cues: [
      'کشش مداوم در تمام دامنه',
      'بدن ثابت بماند',
      'در بالا انقباض کامل',
    ],
    repRanges: {
      hypertrophy: { min: 12, max: 15 },
      strength: { min: 8, max: 12 },
      endurance: { min: 15, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 0, max: 2 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '2-0-1-1',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['سرشانه جلو', 'کشش مداوم', 'سیم‌کش'],
  },

  // ۸. پرس سرشانه هالتر نشسته
  {
    id: 'shoulder_008',
    name: 'پرس سرشانه هالتر نشسته',
    englishName: 'Seated Barbell Shoulder Press',
    aliases: ['پرس نظامی نشسته', 'OHP نشسته'],
    primaryMuscle: 'front_delts',
    secondaryMuscles: ['side_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'vertical_push',
    equipment: ['barbell', 'bench'],
    equipmentDetails: {
      primary: 'barbell',
      support: ['bench'],
      variant: 'seated',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'medium', lowerBack: 'low' },
    substitutes: ['shoulder_001', 'shoulder_002', 'shoulder_005'],
    cues: [
      'پشت به نیمکت عمودی چسبیده باشد',
      'هالتر را از سطح چانه به بالا پرس کنید',
      'آرنج‌ها کمی جلو باشند',
    ],
    repRanges: {
      hypertrophy: { min: 6, max: 10 },
      strength: { min: 4, max: 8 },
      endurance: { min: 10, max: 15 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 150 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['سرشانه جلو', 'هالتر', 'نشسته'],
  },

  // ۹. پرس سرشانه دمبل ایستاده
  {
    id: 'shoulder_009',
    name: 'پرس سرشانه دمبل ایستاده',
    englishName: 'Standing Dumbbell Shoulder Press',
    aliases: ['پرس دمبل ایستاده'],
    primaryMuscle: 'front_delts',
    secondaryMuscles: ['side_delts', 'triceps', 'abs'],
    type: 'compound',
    movementPattern: 'vertical_push',
    equipment: ['dumbbell'],
    equipmentDetails: {
      primary: 'dumbbell',
      variant: 'standing',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low', lowerBack: 'low' },
    substitutes: ['shoulder_002', 'shoulder_001', 'shoulder_011'],
    cues: [
      'پاها به عرض شانه',
      'شکم را سفت نگه دارید',
      'دمبل‌ها را از کنار گوش بالا ببرید',
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
    isSpineSensitive: false,
    tags: ['سرشانه جلو', 'دمبل', 'ایستاده'],
  },

  // ۱۰. پرس سرشانه آرنولد
  {
    id: 'shoulder_010',
    name: 'پرس سرشانه آرنولد',
    englishName: 'Arnold Press',
    aliases: ['آرنولد پرس', 'پرس چرخشی'],
    primaryMuscle: 'front_delts',
    secondaryMuscles: ['side_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'vertical_push',
    equipment: ['dumbbell', 'bench'],
    equipmentDetails: {
      primary: 'dumbbell',
      support: ['bench'],
      variant: 'seated',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'medium', wrist: 'low' },
    substitutes: ['shoulder_002', 'shoulder_009'],
    cues: [
      'دمبل‌ها را با کف دست به سمت خود بگیرید',
      'در حین بالا بردن، مچ را بچرخانید',
      'در بالا کف دست به سمت جلو',
      'بر انقباض سرشانه جلو تمرکز کنید',
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
    tags: ['سرشانه جلو', 'دمبل', 'چرخشی'],
  },

  // ۱۱. پرس سرشانه اسمیت
  {
    id: 'shoulder_011',
    name: 'پرس سرشانه اسمیت',
    englishName: 'Smith Machine Shoulder Press',
    aliases: ['اسمیت پرس سرشانه', 'پرس اسمیت'],
    primaryMuscle: 'front_delts',
    secondaryMuscles: ['side_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'vertical_push',
    equipment: ['smith_machine', 'bench'],
    equipmentDetails: {
      primary: 'smith_machine',
      support: ['bench'],
      machineType: 'smith',
      variant: 'seated',
    },
    difficulty: 1,
    injuryRisk: { shoulder: 'low', wrist: 'low' },
    substitutes: ['shoulder_001', 'shoulder_005', 'shoulder_002'],
    cues: [
      'میله در مسیر ثابت حرکت می‌کند',
      'پشت به نیمکت عمودی',
      'آرنج‌ها کمی جلو باشند',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 12 },
      strength: { min: 5, max: 8 },
      endurance: { min: 12, max: 18 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 150 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['سرشانه جلو', 'اسمیت', 'امن'],
  },

  // ═══════════════════════════════════════════════════════════
  // گروه ۲: سرشانه کنار (side_delts) — ادامه
  // ═══════════════════════════════════════════════════════════

  // ۱۲. نشر جانب دمبل نشسته
  {
    id: 'shoulder_012',
    name: 'نشر جانب دمبل نشسته',
    englishName: 'Seated Dumbbell Lateral Raise',
    aliases: ['نشر جانب نشسته'],
    primaryMuscle: 'side_delts',
    secondaryMuscles: ['front_delts'],
    type: 'isolation',
    movementPattern: 'vertical_push',
    equipment: ['dumbbell', 'bench'],
    equipmentDetails: {
      primary: 'dumbbell',
      support: ['bench'],
      variant: 'seated',
    },
    difficulty: 1,
    injuryRisk: { shoulder: 'medium' },
    substitutes: ['shoulder_003', 'shoulder_004', 'shoulder_013'],
    cues: [
      'پشت به نیمکت، کمر صاف',
      'دمبل‌ها را تا سطح شانه بالا ببرید',
      'بدن ثابت، بدون تاب',
    ],
    repRanges: {
      hypertrophy: { min: 12, max: 20 },
      strength: { min: 8, max: 12 },
      endurance: { min: 15, max: 25 },
    },
    rirRange: {
      hypertrophy: { min: 0, max: 2 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '2-0-1-1',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['سرشانه میانی', 'ایزوله', 'دمبل', 'نشسته'],
  },

  // ۱۳. نشر جانب دستگاه
  {
    id: 'shoulder_013',
    name: 'نشر جانب دستگاه',
    englishName: 'Machine Lateral Raise',
    aliases: ['نشر جانب ماشین', 'دستگاه نشر جانب'],
    primaryMuscle: 'side_delts',
    secondaryMuscles: [],
    type: 'isolation',
    movementPattern: 'vertical_push',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'pin_loaded',
      variant: 'seated',
    },
    difficulty: 1,
    injuryRisk: { shoulder: 'low' },
    substitutes: ['shoulder_003', 'shoulder_004', 'shoulder_012'],
    cues: [
      'پشت به پد چسبیده باشد',
      'دسته‌ها را با آرنج بگیرید',
      'به آرامی بالا ببرید و کنترل‌شده پایین بیاورید',
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
    tempo: '2-0-1-1',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['سرشانه میانی', 'ماشین', 'پین‌لود', 'امن'],
  },

  // ۱۴. نشر جانب سیم‌کش تک‌دست
  {
    id: 'shoulder_014',
    name: 'نشر جانب سیم‌کش تک‌دست',
    englishName: 'Single-arm Cable Lateral Raise',
    aliases: ['نشر تک‌دست', 'نشر سیم‌کش تک'],
    primaryMuscle: 'side_delts',
    secondaryMuscles: ['front_delts'],
    type: 'isolation',
    movementPattern: 'vertical_push',
    equipment: ['cable'],
    equipmentDetails: {
      primary: 'cable',
      machineType: 'cable',
      variant: 'unilateral',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low' },
    substitutes: ['shoulder_004', 'shoulder_003', 'shoulder_013'],
    cues: [
      'سیم را از پایین بکشید',
      'بدن را کمی به سمت مخالف خم کنید',
      'دست را تا سطح شانه بالا ببرید',
      'کشش مداوم در تمام دامنه',
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
    tempo: '2-0-1-1',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['سرشانه میانی', 'سیم‌کش', 'تک‌دست'],
  },

  // ۱۵. نشر جانب خم
  {
    id: 'shoulder_015',
    name: 'نشر جانب خم',
    englishName: 'Bent-over Lateral Raise',
    aliases: ['نشر خم جانب', 'نشر کنار خم'],
    primaryMuscle: 'side_delts',
    secondaryMuscles: ['rear_delts'],
    type: 'isolation',
    movementPattern: 'vertical_push',
    equipment: ['dumbbell'],
    equipmentDetails: {
      primary: 'dumbbell',
      variant: 'bent_over',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low', lowerBack: 'low' },
    substitutes: ['shoulder_003', 'shoulder_004'],
    cues: [
      'تنه را به جلو خم کنید',
      'دمبل‌ها را از کنار بدن بالا ببرید',
      'آرنج‌ها کمی خم',
      'در بالا کمی توقف کنید',
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
    tempo: '2-0-1-1',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['سرشانه میانی', 'دمبل', 'خم'],
  },
];
