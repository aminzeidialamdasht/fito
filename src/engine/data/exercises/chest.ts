import type { Exercise } from '../../types/exercise';

/**
 * دیتابیس حرکات سینه — ۲۰ حرکت
 * پوشش: هالتر، دمبل، دستگاه (پین‌لود و پیج‌لود)، سیم‌کش، اسمیت، وزن بدن
 * اولویت: تجهیزات موجود در اکثر باشگاه‌های ایران
 */
export const CHEST_EXERCISES: Exercise[] = [
  // ═══════════════════════════════════════════════════════════
  // ۱. پرس سینه هالتر (تخت)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_001',
    name: 'پرس سینه هالتر',
    englishName: 'Barbell Bench Press',
    aliases: ['بنچ پرس', 'پرس سینه'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'horizontal_push',
    equipment: ['barbell', 'bench'],
    equipmentDetails: {
      primary: 'barbell',
      support: ['bench'],
      variant: 'flat',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'medium', elbow: 'low', wrist: 'low' },
    substitutes: ['chest_002', 'chest_003', 'chest_007', 'chest_012', 'chest_013'],
    cues: [
      'کتف‌ها را جمع و فشرده نگه دارید',
      'میله را در راستای سینه پایین بیاورید',
      'آرنج‌ها با بدن ۴۵ تا ۷۵ درجه زاویه داشته باشند',
      'پاها را محکم روی زمین فشار دهید',
    ],
    repRanges: {
      hypertrophy: { min: 6, max: 12 },
      strength: { min: 3, max: 6 },
      endurance: { min: 12, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 120, max: 180 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['پایه', 'قدرتی', 'حجمی', 'هالتر'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۲. پرس سینه دمبل (تخت)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_002',
    name: 'پرس سینه دمبل',
    englishName: 'Dumbbell Bench Press',
    aliases: ['پرس دمبل', 'بنچ پرس دمبل'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'horizontal_push',
    equipment: ['dumbbell', 'bench'],
    equipmentDetails: {
      primary: 'dumbbell',
      support: ['bench'],
      variant: 'flat',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low', elbow: 'low' },
    substitutes: ['chest_001', 'chest_003', 'chest_004', 'chest_007'],
    cues: [
      'دامنه حرکت کامل باشد',
      'در پایین دمبل‌ها کمی پایین‌تر از سطح سینه',
      'در بالا دمبل‌ها را به هم نزدیک کنید',
      'مچ‌ها را ثابت نگه دارید',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 12 },
      strength: { min: 6, max: 8 },
      endurance: { min: 12, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 150 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['پایه', 'تعادلی', 'دمبل'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۳. پرس بالاسینه هالتر
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_003',
    name: 'پرس بالاسینه هالتر',
    englishName: 'Incline Barbell Bench Press',
    aliases: ['پرس بالاسینه', 'اینکلاین پرس'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'horizontal_push',
    equipment: ['barbell', 'bench'],
    equipmentDetails: {
      primary: 'barbell',
      support: ['bench'],
      variant: 'incline',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'medium', elbow: 'low' },
    substitutes: ['chest_004', 'chest_002', 'chest_011', 'chest_014', 'chest_001'],
    cues: [
      'زاویه نیمکت ۳۰ تا ۴۵ درجه',
      'میله را در راستای بالای سینه پایین بیاورید',
      'بر انقباض سینه فوقانی تمرکز کنید',
      'آرنج‌ها را کمی جمع نگه دارید',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 12 },
      strength: { min: 5, max: 8 },
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
    tags: ['سینه فوقانی', 'پایه', 'هالتر'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۴. پرس بالاسینه دمبل
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_004',
    name: 'پرس بالاسینه دمبل',
    englishName: 'Incline Dumbbell Press',
    aliases: ['پرس بالاسینه دمبل', 'اینکلاین دمبل'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'horizontal_push',
    equipment: ['dumbbell', 'bench'],
    equipmentDetails: {
      primary: 'dumbbell',
      support: ['bench'],
      variant: 'incline',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low', elbow: 'low' },
    substitutes: ['chest_003', 'chest_002', 'chest_011', 'chest_014'],
    cues: [
      'زاویه نیمکت ۳۰ درجه',
      'دامنه حرکت کامل',
      'بر انقباض سینه فوقانی تمرکز کنید',
      'دمبل‌ها را در بالا به هم نزدیک کنید',
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
    tags: ['سینه فوقانی', 'دمبل'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۵. قفسه سینه سیم‌کش (کراس اور ایستاده)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_005',
    name: 'قفسه سینه سیم‌کش',
    englishName: 'Cable Crossover',
    aliases: ['کراس اور', 'کراس‌اور', 'کراس اوور'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts'],
    type: 'isolation',
    movementPattern: 'horizontal_push',
    equipment: ['cable'],
    equipmentDetails: {
      primary: 'cable',
      machineType: 'cable',
      variant: 'standing',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low' },
    substitutes: ['chest_006', 'chest_015', 'chest_016', 'chest_007'],
    cues: [
      'کمی به جلو خم شوید',
      'در انتها دست‌ها را به هم برسانید',
      'حرکت را کنترل‌شده انجام دهید',
      'آرنج‌ها را کمی خم نگه دارید',
    ],
    repRanges: {
      hypertrophy: { min: 10, max: 15 },
      strength: { min: 8, max: 12 },
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
    tags: ['انقباض', 'پایانی', 'سیم‌کش'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۶. پک دک (دستگاه)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_006',
    name: 'پک دک',
    englishName: 'Pec Deck Machine',
    aliases: ['دستگاه پک', 'پک دک', 'پروانه سینه'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts'],
    type: 'isolation',
    movementPattern: 'horizontal_push',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'pin_loaded',
      variant: 'seated',
    },
    difficulty: 1,
    injuryRisk: { shoulder: 'low' },
    substitutes: ['chest_005', 'chest_015', 'chest_016'],
    cues: [
      'پشت را به پد بچسبانید',
      'آرنج‌ها کمی خم',
      'در انتها انقباض کامل',
      'به آرامی برگردید',
    ],
    repRanges: {
      hypertrophy: { min: 10, max: 15 },
      strength: { min: 8, max: 12 },
      endurance: { min: 15, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 0, max: 2 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '2-1-1-1',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['ایزوله', 'ماشین', 'مبتدی', 'پین‌لود'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۷. پرس سینه دستگاه (نشسته)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_007',
    name: 'پرس سینه دستگاه',
    englishName: 'Chest Press Machine',
    aliases: ['پرس سینه ماشین', 'دستگاه پرس سینه'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'horizontal_push',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'pin_loaded',
      variant: 'seated',
    },
    difficulty: 1,
    injuryRisk: { shoulder: 'low' },
    substitutes: ['chest_001', 'chest_002', 'chest_013', 'chest_012'],
    cues: [
      'پشت کامل به پد چسبیده باشد',
      'حرکت را کنترل‌شده انجام دهید',
      'در انتها آرنج‌ها را کامل صاف نکنید',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 15 },
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
    tags: ['ماشین', 'امن', 'مبتدی', 'پین‌لود'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۸. پول‌اور دمبل
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_008',
    name: 'پول‌اور دمبل',
    englishName: 'Dumbbell Pullover',
    aliases: ['پول اور', 'پول‌اور'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['lats', 'triceps'],
    type: 'compound',
    movementPattern: 'horizontal_push',
    equipment: ['dumbbell', 'bench'],
    equipmentDetails: {
      primary: 'dumbbell',
      support: ['bench'],
      variant: 'lying',
    },
    difficulty: 3,
    injuryRisk: { shoulder: 'medium', elbow: 'low' },
    substitutes: ['chest_005', 'chest_015'],
    cues: [
      'آرنج‌ها کمی خم باشند',
      'دمبل را تا بالای سر پایین بیاورید',
      'روی کشش سینه تمرکز کنید',
      'کمر را کمی قوس دهید',
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
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['کششی', 'سینه و زیربغل', 'پیشرفته'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۹. پرس زیرسینه هالتر
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_009',
    name: 'پرس زیرسینه هالتر',
    englishName: 'Decline Barbell Bench Press',
    aliases: ['پرس زیرسینه', 'دیکلاین پرس'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'horizontal_push',
    equipment: ['barbell', 'bench'],
    equipmentDetails: {
      primary: 'barbell',
      support: ['bench'],
      variant: 'decline',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low', elbow: 'low' },
    substitutes: ['chest_010', 'chest_001', 'chest_002'],
    cues: [
      'زاویه نیمکت ۱۵ تا ۳۰ درجه منفی',
      'پاها را زیر پد قفل کنید',
      'میله را در راستای پایین سینه پایین بیاورید',
      'بر سینه تحتانی تمرکز کنید',
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
    tags: ['سینه تحتانی', 'هالتر'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۰. پرس زیرسینه دمبل
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_010',
    name: 'پرس زیرسینه دمبل',
    englishName: 'Decline Dumbbell Press',
    aliases: ['پرس زیرسینه دمبل', 'دیکلاین دمبل'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'horizontal_push',
    equipment: ['dumbbell', 'bench'],
    equipmentDetails: {
      primary: 'dumbbell',
      support: ['bench'],
      variant: 'decline',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low', elbow: 'low' },
    substitutes: ['chest_009', 'chest_002', 'chest_004'],
    cues: [
      'زاویه نیمکت ۱۵ تا ۳۰ درجه منفی',
      'دامنه حرکت کامل',
      'دمبل‌ها را در بالا به هم نزدیک کنید',
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
    tags: ['سینه تحتانی', 'دمبل'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۱. پرس بالاسینه دستگاه
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_011',
    name: 'پرس بالاسینه دستگاه',
    englishName: 'Incline Chest Press Machine',
    aliases: ['پرس بالاسینه ماشین', 'دستگاه پرس بالاسینه'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'horizontal_push',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'pin_loaded',
      variant: 'incline',
    },
    difficulty: 1,
    injuryRisk: { shoulder: 'low' },
    substitutes: ['chest_003', 'chest_004', 'chest_007', 'chest_014'],
    cues: [
      'پشت کامل به پد چسبیده باشد',
      'زاویه دستگاه رو به بالا',
      'بر سینه فوقانی تمرکز کنید',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 15 },
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
    tags: ['سینه فوقانی', 'ماشین', 'امن', 'پین‌لود'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۲. پرس سینه اسمیت
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_012',
    name: 'پرس سینه اسمیت',
    englishName: 'Smith Machine Bench Press',
    aliases: ['اسمیت پرس', 'پرس اسمیت'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'horizontal_push',
    equipment: ['smith_machine', 'bench'],
    equipmentDetails: {
      primary: 'smith_machine',
      support: ['bench'],
      machineType: 'smith',
      variant: 'flat',
    },
    difficulty: 1,
    injuryRisk: { shoulder: 'low', wrist: 'low' },
    substitutes: ['chest_001', 'chest_007', 'chest_013'],
    cues: [
      'میله در مسیر ثابت حرکت می‌کند',
      'کتف‌ها را جمع نگه دارید',
      'پاها را محکم روی زمین فشار دهید',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 12 },
      strength: { min: 5, max: 8 },
      endurance: { min: 12, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 150 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['اسمیت', 'امن', 'مبتدی'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۳. پرس سینه هامر (اهرمی/پیج‌لود)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_013',
    name: 'پرس سینه هامر',
    englishName: 'Hammer Strength Chest Press',
    aliases: ['پرس سینه هامر', 'دستگاه هامر سینه'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'horizontal_push',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'plate_loaded',
      variant: 'seated',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low', elbow: 'low' },
    substitutes: ['chest_007', 'chest_001', 'chest_002', 'chest_012'],
    cues: [
      'دستگیره‌ها را محکم بگیرید',
      'پشت کامل به پد چسبیده باشد',
      'حرکت را کنترل‌شده انجام دهید',
    ],
    repRanges: {
      hypertrophy: { min: 8, max: 12 },
      strength: { min: 5, max: 8 },
      endurance: { min: 12, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 90, max: 150 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['ماشین', 'هامر', 'پیج‌لود', 'امن'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۴. پرس بالاسینه هامر
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_014',
    name: 'پرس بالاسینه هامر',
    englishName: 'Hammer Strength Incline Chest Press',
    aliases: ['پرس بالاسینه هامر', 'هامز اینکلاین'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'horizontal_push',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'plate_loaded',
      variant: 'incline',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low', elbow: 'low' },
    substitutes: ['chest_003', 'chest_004', 'chest_011', 'chest_013'],
    cues: [
      'دستگیره‌ها را محکم بگیرید',
      'زاویه دستگاه رو به بالا',
      'بر سینه فوقانی تمرکز کنید',
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
    tags: ['سینه فوقانی', 'هامز', 'پیج‌لود'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۵. قفسه سینه سیم‌کش بالا (High Cable Crossover)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_015',
    name: 'قفسه سینه سیم‌کش بالا',
    englishName: 'High Cable Crossover',
    aliases: ['کراس اور بالا', 'کراس اوور از بالا'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts'],
    type: 'isolation',
    movementPattern: 'horizontal_push',
    equipment: ['cable'],
    equipmentDetails: {
      primary: 'cable',
      machineType: 'cable',
      variant: 'high',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low' },
    substitutes: ['chest_005', 'chest_016', 'chest_006'],
    cues: [
      'قرقره‌ها را در بالاترین حالت قرار دهید',
      'دست‌ها را از بالا به سمت پایین بیاورید',
      'در انتها دست‌ها را به هم برسانید',
    ],
    repRanges: {
      hypertrophy: { min: 10, max: 15 },
      strength: { min: 8, max: 12 },
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
    tags: ['انقباض', 'پایانی', 'سیم‌کش', 'سینه تحتانی'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۶. قفسه سینه سیم‌کش پایین (Low Cable Crossover)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_016',
    name: 'قفسه سینه سیم‌کش پایین',
    englishName: 'Low Cable Crossover',
    aliases: ['کراس اور پایین', 'کراس اوور از پایین'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts'],
    type: 'isolation',
    movementPattern: 'horizontal_push',
    equipment: ['cable'],
    equipmentDetails: {
      primary: 'cable',
      machineType: 'cable',
      variant: 'low',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'low' },
    substitutes: ['chest_005', 'chest_015', 'chest_006'],
    cues: [
      'قرقره‌ها را در پایین‌ترین حالت قرار دهید',
      'دست‌ها را از پایین به سمت بالا بیاورید',
      'بر سینه فوقانی تمرکز کنید',
    ],
    repRanges: {
      hypertrophy: { min: 10, max: 15 },
      strength: { min: 8, max: 12 },
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
    tags: ['انقباض', 'پایانی', 'سیم‌کش', 'سینه فوقانی'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۷. قفسه سینه خوابیده دمبل
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_017',
    name: 'قفسه سینه خوابیده دمبل',
    englishName: 'Dumbbell Fly',
    aliases: ['فلای دمبل', 'قفسه سینه دمبل'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts'],
    type: 'isolation',
    movementPattern: 'horizontal_push',
    equipment: ['dumbbell', 'bench'],
    equipmentDetails: {
      primary: 'dumbbell',
      support: ['bench'],
      variant: 'lying',
    },
    difficulty: 2,
    injuryRisk: { shoulder: 'medium' },
    substitutes: ['chest_005', 'chest_006', 'chest_015', 'chest_016'],
    cues: [
      'آرنج‌ها را کمی خم نگه دارید',
      'دامنه حرکت کامل باشد',
      'در بالا دمبل‌ها را به هم نزدیک کنید',
      'وزنه را کنترل‌شده پایین بیاورید',
    ],
    repRanges: {
      hypertrophy: { min: 10, max: 15 },
      strength: { min: 8, max: 12 },
      endurance: { min: 12, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 0, max: 2 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '2-1-1-0',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['ایزوله', 'دمبل', 'کششی'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۸. شنا سوئدی
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_018',
    name: 'شنا سوئدی',
    englishName: 'Push-up',
    aliases: ['شنا', 'پوش آپ', 'شنا سوئدی'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts', 'triceps', 'abs'],
    type: 'compound',
    movementPattern: 'horizontal_push',
    equipment: ['bodyweight'],
    equipmentDetails: {
      primary: 'bodyweight',
      variant: 'flat',
    },
    difficulty: 1,
    injuryRisk: { shoulder: 'low', wrist: 'low' },
    substitutes: ['chest_019', 'chest_020', 'chest_007'],
    cues: [
      'بدن در یک خط مستقیم',
      'دست‌ها کمی بازتر از عرض شانه',
      'سینه را تا نزدیک زمین پایین بیاورید',
      'شکم را سفت نگه دارید',
    ],
    repRanges: {
      hypertrophy: { min: 10, max: 20 },
      strength: { min: 8, max: 15 },
      endurance: { min: 15, max: 30 },
    },
    rirRange: {
      hypertrophy: { min: 0, max: 2 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '2-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['وزن بدن', 'مبتدی', 'خانگی'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۱۹. شنا سوئدی شیب‌دار
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_019',
    name: 'شنا سوئدی شیب‌دار',
    englishName: 'Incline Push-up',
    aliases: ['شنا شیب‌دار', 'پوش آپ شیب‌دار'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'horizontal_push',
    equipment: ['bodyweight'],
    equipmentDetails: {
      primary: 'bodyweight',
      variant: 'incline',
    },
    difficulty: 1,
    injuryRisk: { shoulder: 'low', wrist: 'low' },
    substitutes: ['chest_018', 'chest_020'],
    cues: [
      'دست‌ها روی سطح بلندتر (مثل میز) قرار گیرند',
      'بدن در یک خط مستقیم',
      'سینه را تا نزدیک سطح پایین بیاورید',
      'برای مبتدی‌ها مناسب‌تر از شنا معمولی',
    ],
    repRanges: {
      hypertrophy: { min: 10, max: 20 },
      strength: { min: 8, max: 15 },
      endurance: { min: 15, max: 30 },
    },
    rirRange: {
      hypertrophy: { min: 0, max: 2 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '2-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['وزن بدن', 'مبتدی', 'خانگی', 'آسان'],
  },

  // ═══════════════════════════════════════════════════════════
  // ۲۰. دیپ سینه
  // ═══════════════════════════════════════════════════════════
  {
    id: 'chest_020',
    name: 'دیپ سینه',
    englishName: 'Chest Dip',
    aliases: ['دیپ', 'پارالل سینه'],
    primaryMuscle: 'chest',
    secondaryMuscles: ['front_delts', 'triceps'],
    type: 'compound',
    movementPattern: 'vertical_push',
    equipment: ['bodyweight', 'dip_station'],
    equipmentDetails: {
      primary: 'bodyweight',
      support: ['dip_station'],
      variant: 'flat',
    },
    difficulty: 3,
    injuryRisk: { shoulder: 'medium', elbow: 'low' },
    substitutes: ['chest_018', 'chest_001', 'chest_007'],
    cues: [
      'تنه را کمی به جلو خم کنید',
      'آرنج‌ها را کمی باز نگه دارید',
      'تا حس کشش در سینه پایین بروید',
      'از قفل کردن آرنج در بالا خودداری کنید',
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
    restSeconds: { min: 90, max: 120 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['وزن بدن', 'پیشرفته', 'سینه تحتانی'],
  },
];
