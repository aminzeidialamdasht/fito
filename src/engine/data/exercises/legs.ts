import type { Exercise } from '../../types/exercise';

/**
 * دیتابیس حرکات پا — ۲۲ حرکت
 * پوشش: هالتر، دمبل، دستگاه (پین‌لود و پیج‌لود)، سیم‌کش، اسمیت، وزن بدن
 * اولویت: تجهیزات موجود در اکثر باشگاه‌های ایران
 *
 * گروه‌بندی:
 *   - چهارسر (quads) — 7 حرکت
 *   - همسترینگ (hamstrings) — 5 حرکت
 *   - باسن/سرینی (glutes) — 6 حرکت
 *   - ساق (calves) — 4 حرکت
 */
export const LEG_EXERCISES: Exercise[] = [
  // ═══════════════════════════════════════════════════════════
  // گروه ۱: چهارسر (quads) — ۷ حرکت
  // ═══════════════════════════════════════════════════════════

  // ۱. اسکوات پشت هالتر
  {
    id: 'quads_001',
    name: 'اسکوات پشت هالتر',
    englishName: 'Barbell Back Squat',
    aliases: ['اسکوات', 'اسکوات هالتر', 'بک اسکوات'],
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings', 'lower_back'],
    type: 'compound',
    movementPattern: 'squat',
    equipment: ['barbell'],
    equipmentDetails: {
      primary: 'barbell',
      variant: 'standing',
    },
    difficulty: 3,
    injuryRisk: { knee: 'medium', lowerBack: 'high', hip: 'medium' },
    substitutes: ['quads_002', 'quads_003', 'quads_005', 'quads_006'],
    cues: [
      'پاها به عرض شانه',
      'تا عمق مناسب پایین بروید',
      'زانوها هم‌راستا با پنجه',
      'کمر صاف باشد',
    ],
    repRanges: {
      hypertrophy: { min: 6, max: 10 },
      strength: { min: 3, max: 6 },
      endurance: { min: 12, max: 20 },
    },
    rirRange: {
      hypertrophy: { min: 1, max: 3 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 180, max: 300 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: true,
    tags: ['پایه', 'قدرتی', 'چهارسر', 'هالتر'],
  },

  // ۲. اسکوات جلو هالتر
  {
    id: 'quads_002',
    name: 'اسکوات جلو هالتر',
    englishName: 'Front Squat',
    aliases: ['فرانت اسکوات', 'اسکوات جلو'],
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'upper_back'],
    type: 'compound',
    movementPattern: 'squat',
    equipment: ['barbell'],
    equipmentDetails: {
      primary: 'barbell',
      variant: 'standing',
    },
    difficulty: 3,
    injuryRisk: { knee: 'medium', lowerBack: 'medium' },
    substitutes: ['quads_001', 'quads_005', 'quads_003'],
    cues: [
      'هالتر روی جلوی شانه',
      'آرنج‌ها بالا',
      'تنه صاف بماند',
      'عمق مناسب حفظ شود',
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
    restSeconds: { min: 180, max: 240 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['چهارسر', 'پیشرفته', 'هالتر'],
  },

  // ۳. پرس پا دستگاه
  {
    id: 'quads_003',
    name: 'پرس پا دستگاه',
    englishName: 'Leg Press',
    aliases: ['پرس پا', 'لگ پرس', 'دستگاه پرس پا'],
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    type: 'compound',
    movementPattern: 'squat',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'plate_loaded',
      variant: 'seated',
    },
    difficulty: 1,
    injuryRisk: { knee: 'low', lowerBack: 'low' },
    substitutes: ['quads_006', 'quads_001', 'quads_004'],
    cues: [
      'پاها به عرض شانه روی صفحه',
      'دامنه کامل بدون قفل کردن زانو',
      'کمر به پد چسبیده باشد',
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
    restSeconds: { min: 120, max: 180 },
    tempo: '2-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['امن', 'مبتدی', 'چهارسر', 'پیج‌لود'],
  },

  // ۴. جلو پا دستگاه
  {
    id: 'quads_004',
    name: 'جلو پا دستگاه',
    englishName: 'Leg Extension',
    aliases: ['جلو پا', 'لگ اکستنشن', 'دستگاه جلو پا'],
    primaryMuscle: 'quads',
    secondaryMuscles: [],
    type: 'isolation',
    movementPattern: 'extension',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'pin_loaded',
      variant: 'seated',
    },
    difficulty: 1,
    injuryRisk: { knee: 'medium' },
    substitutes: ['quads_003', 'quads_005', 'quads_001'],
    cues: [
      'در بالا انقباض کامل',
      'در پایین بازگشت کنترل‌شده',
      'از تاب دادن خودداری کنید',
    ],
    repRanges: {
      hypertrophy: { min: 12, max: 15 },
      strength: { min: 10, max: 12 },
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
    tags: ['ایزوله', 'چهارسر', 'پین‌لود'],
  },

  // ۵. اسکوات اسمیت
  {
    id: 'quads_005',
    name: 'اسکوات اسمیت',
    englishName: 'Smith Machine Squat',
    aliases: ['اسمیت اسکوات', 'اسکوات ماشین اسمیت'],
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    type: 'compound',
    movementPattern: 'squat',
    equipment: ['smith_machine'],
    equipmentDetails: {
      primary: 'smith_machine',
      machineType: 'smith',
      variant: 'standing',
    },
    difficulty: 2,
    injuryRisk: { knee: 'low', lowerBack: 'low' },
    substitutes: ['quads_001', 'quads_003', 'quads_006'],
    cues: [
      'پاها کمی جلوتر از میله',
      'میله در مسیر ثابت حرکت می‌کند',
      'کمر صاف، شکم سفت',
      'تا عمق مناسب پایین بروید',
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
    restSeconds: { min: 120, max: 180 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['چهارسر', 'اسمیت', 'امن'],
  },

  // ۶. هاک اسکات دستگاه
  {
    id: 'quads_006',
    name: 'هاک اسکات دستگاه',
    englishName: 'Hack Squat Machine',
    aliases: ['هاک اسکات', 'دستگاه هاک'],
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes'],
    type: 'compound',
    movementPattern: 'squat',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'plate_loaded',
      variant: 'standing',
    },
    difficulty: 2,
    injuryRisk: { knee: 'low', lowerBack: 'low' },
    substitutes: ['quads_003', 'quads_005', 'quads_001'],
    cues: [
      'پشت و شانه به پد چسبیده باشد',
      'پاها به عرض شانه روی صفحه',
      'تا عمق مناسب پایین بروید',
      'زانوها را قفل نکنید',
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
    restSeconds: { min: 120, max: 180 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['چهارسر', 'ماشین', 'پیج‌لود'],
  },

  // ۷. اسکات بلغاری دمبل
  {
    id: 'quads_007',
    name: 'اسکات بلغاری دمبل',
    englishName: 'Bulgarian Split Squat',
    aliases: ['بلغاری', 'اسکوات بلغاری', 'تک‌پا بلغاری'],
    primaryMuscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    type: 'compound',
    movementPattern: 'lunge',
    equipment: ['dumbbell', 'bench'],
    equipmentDetails: {
      primary: 'dumbbell',
      support: ['bench'],
      variant: 'unilateral',
    },
    difficulty: 3,
    injuryRisk: { knee: 'medium', hip: 'low' },
    substitutes: ['quads_001', 'glutes_002', 'quads_003'],
    cues: [
      'یک پا روی نیمکت عقب',
      'پای جلو را کامل خم کنید',
      'تنه صاف بماند',
      'دمبل‌ها در دو طرف بدن',
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
    tags: ['چهارسر', 'تک‌پا', 'تعادلی', 'دمبل'],
  },

  // ═══════════════════════════════════════════════════════════
  // گروه ۲: همسترینگ (hamstrings) — ۵ حرکت
  // ═══════════════════════════════════════════════════════════

  // ۸. ددلیفت رومانیایی هالتر
  {
    id: 'hams_001',
    name: 'ددلیفت رومانیایی هالتر',
    englishName: 'Romanian Deadlift (Barbell)',
    aliases: ['RDL', 'ددلیفت رومانیایی', 'RDL هالتر'],
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['glutes', 'lower_back'],
    type: 'compound',
    movementPattern: 'hinge',
    equipment: ['barbell'],
    equipmentDetails: {
      primary: 'barbell',
      variant: 'standing',
    },
    difficulty: 3,
    injuryRisk: { lowerBack: 'high', hamstring: 'medium', knee: 'low' },
    substitutes: ['hams_002', 'hams_005', 'glutes_001'],
    cues: [
      'هالتر را نزدیک بدن نگه دارید',
      'لگن را به عقب ببرید',
      'همسترینگ را کشش دهید',
      'کمر صاف باشد',
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
    restSeconds: { min: 120, max: 180 },
    tempo: '3-1-1-0',
    isCompound: true,
    isSpineSensitive: true,
    tags: ['پایه', 'همسترینگ', 'سرینی', 'هالتر'],
  },

  // ۹. پشت پا خوابیده دستگاه
  {
    id: 'hams_002',
    name: 'پشت پا خوابیده دستگاه',
    englishName: 'Lying Leg Curl',
    aliases: ['پشت پا', 'همسترینگ ماشین', 'پشت پا خوابیده'],
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['calves'],
    type: 'isolation',
    movementPattern: 'flexion',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'pin_loaded',
      variant: 'lying',
    },
    difficulty: 1,
    injuryRisk: { knee: 'low' },
    substitutes: ['hams_003', 'hams_004', 'hams_001'],
    cues: [
      'از حرکت دادن لگن خودداری کنید',
      'فقط زانو را خم کنید',
      'در بالا انقباض کامل',
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
    tempo: '3-1-1-0',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['همسترینگ', 'ایزوله', 'پین‌لود'],
  },

  // ۱۰. پشت پا ایستاده دستگاه (تک‌پا)
  {
    id: 'hams_003',
    name: 'پشت پا ایستاده دستگاه (تک‌پا)',
    englishName: 'Standing Single-Leg Curl',
    aliases: ['پشت پا ایستاده', 'تک پا همسترینگ'],
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['glutes'],
    type: 'isolation',
    movementPattern: 'flexion',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'pin_loaded',
      variant: 'standing',
    },
    difficulty: 2,
    injuryRisk: { knee: 'low' },
    substitutes: ['hams_002', 'hams_004', 'hams_001'],
    cues: [
      'پا را کامل خم کنید',
      'در بالا انقباض کامل',
      'لگن ثابت بماند',
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
    tempo: '3-1-1-0',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['همسترینگ', 'تک‌پا', 'پین‌لود'],
  },

  // ۱۱. پشت پا نشسته دستگاه
  {
    id: 'hams_004',
    name: 'پشت پا نشسته دستگاه',
    englishName: 'Seated Leg Curl',
    aliases: ['پشت پا نشسته', 'همسترینگ نشسته'],
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['calves'],
    type: 'isolation',
    movementPattern: 'flexion',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'pin_loaded',
      variant: 'seated',
    },
    difficulty: 1,
    injuryRisk: { knee: 'low' },
    substitutes: ['hams_002', 'hams_003', 'hams_001'],
    cues: [
      'پشت به پد چسبیده باشد',
      'زانو را کامل خم کنید',
      'در بالا انقباض کامل',
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
    tempo: '3-1-1-0',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['همسترینگ', 'ایزوله', 'پین‌لود', 'نشسته'],
  },

  // ۱۲. ددلیفت رومانیایی دمبل
  {
    id: 'hams_005',
    name: 'ددلیفت رومانیایی دمبل',
    englishName: 'Romanian Deadlift (Dumbbell)',
    aliases: ['RDL دمبل', 'ددلیفت رومانیایی دمبل'],
    primaryMuscle: 'hamstrings',
    secondaryMuscles: ['glutes', 'lower_back'],
    type: 'compound',
    movementPattern: 'hinge',
    equipment: ['dumbbell'],
    equipmentDetails: {
      primary: 'dumbbell',
      variant: 'standing',
    },
    difficulty: 2,
    injuryRisk: { lowerBack: 'medium', hamstring: 'medium' },
    substitutes: ['hams_001', 'hams_002', 'glutes_001'],
    cues: [
      'دمبل‌ها را در دو طرف بدن بگیرید',
      'لگن را به عقب ببرید',
      'همسترینگ را کشش دهید',
      'کمر صاف باشد',
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
    tags: ['همسترینگ', 'سرینی', 'دمبل'],
  },

  // ═══════════════════════════════════════════════════════════
  // گروه ۳: باسن/سرینی (glutes) — ۶ حرکت
  // ═══════════════════════════════════════════════════════════

  // ۱۳. هیپ تراست هالتر
  {
    id: 'glutes_001',
    name: 'هیپ تراست هالتر',
    englishName: 'Barbell Hip Thrust',
    aliases: ['هیپ تراست', 'سرینی هالتر', 'هیپ تراست هالتر'],
    primaryMuscle: 'glutes',
    secondaryMuscles: ['hamstrings', 'quads'],
    type: 'compound',
    movementPattern: 'hinge',
    equipment: ['barbell', 'bench'],
    equipmentDetails: {
      primary: 'barbell',
      support: ['bench'],
      variant: 'seated',
    },
    difficulty: 2,
    injuryRisk: { hip: 'low', lowerBack: 'medium' },
    substitutes: ['glutes_004', 'glutes_006', 'hams_001'],
    cues: [
      'پشت به نیمکت',
      'هالتر روی لگن',
      'در بالا سرینی را فشرده کنید',
      'کمر صاف باشد',
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
    tempo: '3-1-1-1',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['سرینی', 'پایه', 'هالتر'],
  },

  // ۱۴. لانگز دمبل راه‌رونده
  {
    id: 'glutes_002',
    name: 'لانگز دمبل راه‌رونده',
    englishName: 'Walking Dumbbell Lunge',
    aliases: ['لانگز', 'لانگ راه‌رونده', 'لانگز دمبل'],
    primaryMuscle: 'glutes',
    secondaryMuscles: ['quads', 'hamstrings'],
    type: 'compound',
    movementPattern: 'lunge',
    equipment: ['dumbbell'],
    equipmentDetails: {
      primary: 'dumbbell',
      variant: 'unilateral',
    },
    difficulty: 2,
    injuryRisk: { knee: 'medium', hip: 'low' },
    substitutes: ['quads_007', 'glutes_003', 'quads_003'],
    cues: [
      'قدم بلند بردارید',
      'زانوی عقب را نزدیک زمین بیاورید',
      'تنه صاف بماند',
    ],
    repRanges: {
      hypertrophy: { min: 10, max: 12 },
      strength: { min: 8, max: 10 },
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
    tags: ['سرینی', 'چهارسر', 'تعادلی', 'دمبل'],
  },

  // ۱۵. کیک بک سیم‌کش
  {
    id: 'glutes_003',
    name: 'کیک بک سیم‌کش',
    englishName: 'Cable Glute Kickback',
    aliases: ['کیک بک', 'سرینی سیم‌کش', 'کیک بک سیم'],
    primaryMuscle: 'glutes',
    secondaryMuscles: ['hamstrings'],
    type: 'isolation',
    movementPattern: 'extension',
    equipment: ['cable'],
    equipmentDetails: {
      primary: 'cable',
      machineType: 'cable',
      variant: 'unilateral',
    },
    difficulty: 1,
    injuryRisk: { hip: 'low' },
    substitutes: ['glutes_004', 'glutes_005', 'glutes_001'],
    cues: [
      'بدن را ثابت نگه دارید',
      'پا را به عقب ببرید',
      'در بالا سرینی را فشرده کنید',
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
    tempo: '2-1-1-1',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['سرینی', 'ایزوله', 'سیم‌کش'],
  },

  // ۱۶. ابداکشن دستگاه (خارج ران)
  {
    id: 'glutes_004',
    name: 'ابداکشن دستگاه (خارج ران)',
    englishName: 'Hip Abduction Machine',
    aliases: ['ابداکشن', 'خارج ران', 'دستگاه خارج ران'],
    primaryMuscle: 'glutes',
    secondaryMuscles: [],
    type: 'isolation',
    movementPattern: 'extension',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'pin_loaded',
      variant: 'seated',
    },
    difficulty: 1,
    injuryRisk: { hip: 'low' },
    substitutes: ['glutes_005', 'glutes_003', 'glutes_006'],
    cues: [
      'پشت به پد چسبیده باشد',
      'پاها را به سمت بیرون باز کنید',
      'در انتها انقباض کامل',
      'به آرامی برگردید',
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
    tempo: '2-1-1-1',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['سرینی', 'خارج ران', 'ماشین', 'پین‌لود'],
  },

  // ۱۷. اداکشن دستگاه (داخل ران)
  {
    id: 'glutes_005',
    name: 'اداکشن دستگاه (داخل ران)',
    englishName: 'Hip Adduction Machine',
    aliases: ['اداکشن', 'داخل ران', 'دستگاه داخل ران'],
    primaryMuscle: 'glutes',
    secondaryMuscles: ['quads'],
    type: 'isolation',
    movementPattern: 'flexion',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'pin_loaded',
      variant: 'seated',
    },
    difficulty: 1,
    injuryRisk: { hip: 'low' },
    substitutes: ['glutes_004', 'glutes_003'],
    cues: [
      'پشت به پد چسبیده باشد',
      'پاها را به سمت داخل جمع کنید',
      'در انتها انقباض کامل',
      'به آرامی برگردید',
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
    tempo: '2-1-1-1',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['داخل ران', 'ماشین', 'پین‌لود'],
  },

  // ۱۸. هیپ تراست سیم‌کش
  {
    id: 'glutes_006',
    name: 'هیپ تراست سیم‌کش',
    englishName: 'Cable Hip Thrust',
    aliases: ['هیپ تراست سیم', 'سرینی سیم‌کش'],
    primaryMuscle: 'glutes',
    secondaryMuscles: ['hamstrings'],
    type: 'compound',
    movementPattern: 'hinge',
    equipment: ['cable'],
    equipmentDetails: {
      primary: 'cable',
      machineType: 'cable',
      variant: 'standing',
    },
    difficulty: 2,
    injuryRisk: { hip: 'low', lowerBack: 'low' },
    substitutes: ['glutes_001', 'glutes_003'],
    cues: [
      'پشت به دستگاه سیم‌کش',
      'سیم را روی لگن قرار دهید',
      'لگن را به جلو پرس کنید',
      'در بالا سرینی را فشرده کنید',
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
    tempo: '3-1-1-1',
    isCompound: true,
    isSpineSensitive: false,
    tags: ['سرینی', 'سیم‌کش'],
  },

  // ═══════════════════════════════════════════════════════════
  // گروه ۴: ساق (calves) — ۴ حرکت
  // ═══════════════════════════════════════════════════════════

  // ۱۹. ساق ایستاده دستگاه
  {
    id: 'calves_001',
    name: 'ساق ایستاده دستگاه',
    englishName: 'Standing Calf Raise',
    aliases: ['ساق ایستاده', 'ساق پا', 'دستگاه ساق ایستاده'],
    primaryMuscle: 'calves',
    secondaryMuscles: [],
    type: 'isolation',
    movementPattern: 'extension',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'pin_loaded',
      variant: 'standing',
    },
    difficulty: 1,
    injuryRisk: { ankle: 'low' },
    substitutes: ['calves_002', 'calves_003', 'calves_004'],
    cues: [
      'دامنه کامل حرکت',
      'در پایین کشش و در بالا انقباض شدید',
      'از فنر زدن پرهیز کنید',
    ],
    repRanges: {
      hypertrophy: { min: 12, max: 15 },
      strength: { min: 10, max: 12 },
      endurance: { min: 15, max: 25 },
    },
    rirRange: {
      hypertrophy: { min: 0, max: 2 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '3-2-1-0',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['ساق', 'ایزوله', 'پین‌لود'],
  },

  // ۲۰. ساق نشسته دستگاه
  {
    id: 'calves_002',
    name: 'ساق نشسته دستگاه',
    englishName: 'Seated Calf Raise',
    aliases: ['ساق نشسته', 'دستگاه ساق نشسته', 'ساق سولئوس'],
    primaryMuscle: 'calves',
    secondaryMuscles: [],
    type: 'isolation',
    movementPattern: 'extension',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'pin_loaded',
      variant: 'seated',
    },
    difficulty: 1,
    injuryRisk: { ankle: 'low' },
    substitutes: ['calves_001', 'calves_003', 'calves_004'],
    cues: [
      'دامنه کامل حرکت',
      'در پایین کشش و در بالا انقباض شدید',
      'زمان توقف در بالا',
    ],
    repRanges: {
      hypertrophy: { min: 12, max: 15 },
      strength: { min: 10, max: 12 },
      endurance: { min: 15, max: 25 },
    },
    rirRange: {
      hypertrophy: { min: 0, max: 2 },
      strength: { min: 1, max: 2 },
    },
    restSeconds: { min: 60, max: 90 },
    tempo: '3-2-1-0',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['ساق', 'ساق سولئوس', 'پین‌لود'],
  },

  // ۲۱. ساق پرس پا
  {
    id: 'calves_003',
    name: 'ساق پرس پا',
    englishName: 'Leg Press Calf Raise',
    aliases: ['ساق پرس پا', 'ساق روی پرس'],
    primaryMuscle: 'calves',
    secondaryMuscles: [],
    type: 'isolation',
    movementPattern: 'extension',
    equipment: ['machine'],
    equipmentDetails: {
      primary: 'machine',
      machineType: 'plate_loaded',
      variant: 'seated',
    },
    difficulty: 1,
    injuryRisk: { ankle: 'low', knee: 'low' },
    substitutes: ['calves_001', 'calves_002', 'calves_004'],
    cues: [
      'پاها روی لبه صفحه پرس',
      'فقط مچ پا را حرکت دهید',
      'در پایین کشش کامل',
      'در بالا انقباض شدید',
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
    tempo: '3-2-1-0',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['ساق', 'پرس پا', 'پیج‌لود'],
  },

  // ۲۲. ساق تک‌پا دمبل
  {
    id: 'calves_004',
    name: 'ساق تک‌پا دمبل',
    englishName: 'Single-leg Dumbbell Calf Raise',
    aliases: ['ساق تک‌پا', 'ساق دمبل'],
    primaryMuscle: 'calves',
    secondaryMuscles: [],
    type: 'isolation',
    movementPattern: 'extension',
    equipment: ['dumbbell'],
    equipmentDetails: {
      primary: 'dumbbell',
      variant: 'unilateral',
    },
    difficulty: 2,
    injuryRisk: { ankle: 'low' },
    substitutes: ['calves_001', 'calves_002', 'calves_003'],
    cues: [
      'روی یک پا بایستید',
      'دمبل را در دست مخالف بگیرید',
      'روی پنجه بلند شوید',
      'در بالا توقف کنید',
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
    tempo: '3-2-1-0',
    isCompound: false,
    isSpineSensitive: false,
    tags: ['ساق', 'تک‌پا', 'دمبل'],
  },
];
