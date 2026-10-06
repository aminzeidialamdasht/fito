/**
 * تست End-to-End فاز ۶ — Advanced Training Systems
 * اجرا: npm run test:systems
 */

import {
  generateOfflineWorkout,
  getProgramSystem,
  selectSplit,
} from '../src/engine';
import { SAMPLE_PROFILE } from '../src/data/defaultPlans';
import type { AthleteProfile, Goal, WorkoutSession } from '../src/types';
import type { GeneratedProgram, GeneratedSet } from '../src/engine/types/program';

// ═══════════════════════════════════════════════════════════
//  ابزار نمایش
// ═══════════════════════════════════════════════════════════

function printHeader(title: string): void {
  console.log('\n' + '═'.repeat(60));
  console.log(`🧪 ${title}`);
  console.log('═'.repeat(60));
}

function check(label: string, condition: boolean, detail = ''): void {
  if (condition) {
    console.log(`✅ ${label}`);
  } else {
    console.log(`❌ ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function findFirstSet(program: GeneratedProgram): GeneratedSet | undefined {
  for (const day of program.days) {
    for (const exercise of day.exercises) {
      if (exercise.sets.length > 0) {
        return exercise.sets[0];
      }
    }
  }
  return undefined;
}

// ═══════════════════════════════════════════════════════════
//  Fixture
// ═══════════════════════════════════════════════════════════

const SYSTEMS_TEST_PROFILE: AthleteProfile = {
  ...SAMPLE_PROFILE,
  id: 'systems-test-profile',
  name: 'پروفایل تست سیستم‌های پیشرفته',
  experience: 'advanced',
  trainingDays: 4,
  sessionDuration: 60,
  equipmentType: 'full_gym',
  equipment: [],
  customEquipment: [],
  injuries: [],
  limitations: [],
  avoidedExercises: [],
  primaryGoal: 'hypertrophy',
  secondaryGoal: '',
  bodyMeasurements: {
    ...SAMPLE_PROFILE.bodyMeasurements,
    bodyFrame: 'mesomorph',
  },
};

// ═══════════════════════════════════════════════════════════
//  شروع تست
// ═══════════════════════════════════════════════════════════

printHeader('Phase 6 — Advanced Training Systems E2E');

console.log('👤 پروفایل:', SYSTEMS_TEST_PROFILE.name);
console.log('🎯 هدف:', SYSTEMS_TEST_PROFILE.primaryGoal);
console.log('📅 روزهای تمرین:', SYSTEMS_TEST_PROFILE.trainingDays);
console.log('🏋️ سطح:', SYSTEMS_TEST_PROFILE.experience);

const program = generateOfflineWorkout(SYSTEMS_TEST_PROFILE);

const systemId = program.metadata.systemName;
const system = systemId ? getProgramSystem(systemId as any) : undefined;
const firstSet = findFirstSet(program);

check(
  'systemName در metadata موجود است',
  Boolean(systemId),
  String(systemId)
);

check(
  'systemNameFa در metadata موجود است',
  Boolean(program.metadata.systemNameFa),
  String(program.metadata.systemNameFa)
);

check(
  'periodizationPhase در metadata موجود است',
  Boolean(program.metadata.periodizationPhase),
  String(program.metadata.periodizationPhase)
);

check(
  'weeklyProgression در metadata پر شده است',
  Boolean(
    program.metadata.weeklyProgression &&
    program.metadata.weeklyProgression.length > 0
  ),
  String(program.metadata.weeklyProgression?.length || 0)
);

check(
  'ProgramSystemRule پیدا شد',
  Boolean(system),
  String(systemId)
);

if (system) {
  check(
    'durationWeeks با system.weeks برابر است',
    program.durationWeeks === system.weeks,
    `${program.durationWeeks} !== ${system.weeks}`
  );
}

check('حداقل یک ست در برنامه وجود دارد', Boolean(firstSet));

if (firstSet && system?.weeklyScheme[0]) {
  const weekOne = system.weeklyScheme[0];

  check(
    'firstSet.week برابر 1 است',
    firstSet.week === 1,
    String(firstSet.week)
  );

  check(
    'reps هفته اول روی firstSet اعمال شده است',
    firstSet.targetReps === weekOne.reps,
    `${firstSet.targetReps} !== ${weekOne.reps}`
  );

  check(
    'RIR هفته اول روی firstSet اعمال شده است',
    firstSet.targetRIR === weekOne.rir,
    `${firstSet.targetRIR} !== ${weekOne.rir}`
  );
}

const allSets = program.days
  .flatMap((day) => day.exercises)
  .flatMap((exercise) => exercise.sets);

const techniqueSets = allSets.filter(
  (set) => set.technique && set.technique !== 'straight'
);

console.log(`\n🔧 ست‌های تکنیک‌دار: ${techniqueSets.length}`);
check(
  'حداقل یک ست تکنیک‌دار وجود دارد',
  techniqueSets.length > 0
);

const missingTechniqueNames = techniqueSets.filter(
  (set) => !set.techniqueNameFa
);

check(
  'تمام ست‌های تکنیک‌دار نام فارسی تکنیک دارند',
  missingTechniqueNames.length === 0,
  `${missingTechniqueNames.length} ست بدون techniqueNameFa`
);

console.log(`\n📌 سیستم انتخاب‌شده: ${program.metadata.systemName}`);
console.log(`📌 نام فارسی: ${program.metadata.systemNameFa}`);
console.log(`📌 مدت برنامه: ${program.durationWeeks} هفته`);
console.log(`📌 تعداد کل ست‌ها: ${allSets.length}`);
console.log('✅ تست کامل شد');

// ═══════════════════════════════════════════════════════════
//  Phase 8 — Deload Test
// ═══════════════════════════════════════════════════════════

printHeader('Phase 8 — Adaptive Deload E2E');

function makeFakeSessions(count: number, daysAgo: number): WorkoutSession[] {
  const sessions: WorkoutSession[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (i % daysAgo));

    sessions.push({
      id: `session-${i}`,
      profileId: 'systems-test-profile',
      programId: 'test-program',
      dayId: `day-${i}`,
      date: date.toISOString(),
      startTime: '10:00',
      duration: 60,
      sets: [],
      totalVolume: 15000,  // volume بالا برای trigger fatigue
      completed: true,
    });
  }

  return sessions;
}

// ۷ سشن در ۷ روز اخیر → fatigue بالا
const heavySessions = makeFakeSessions(7, 7);
const deloadProgram = generateOfflineWorkout(
  SYSTEMS_TEST_PROFILE,
  heavySessions
);

console.log('👥 سشن‌های شبیه‌سازی: 7 جلسه در 7 روز اخیر');
console.log('📊 سیستم انتخابی:', deloadProgram.metadata.systemName);
console.log('📊 نام فارسی:', deloadProgram.metadata.systemNameFa);
console.log('📊 فاز:', deloadProgram.metadata.periodizationPhase);

check(
  'deload level heavy تشخیص داده شد',
  deloadProgram.metadata.systemName === 'deload'
);

check(
  'systemNameFa بازیابی (دیلود)',
  deloadProgram.metadata.systemNameFa === 'بازیابی (دیلود)'
);

check(
  'periodizationPhase دیلود',
  deloadProgram.metadata.periodizationPhase === 'دیلود'
);

const deloadSets = deloadProgram.days
  .flatMap((day) => day.exercises)
  .flatMap((exercise) => exercise.sets);

const regularSets = program.days
  .flatMap((day) => day.exercises)
  .flatMap((exercise) => exercise.sets);

check(
  `حجم deload (${deloadSets.length}) کمتر از عادی (${regularSets.length})`,
  deloadSets.length < regularSets.length
);

console.log(`\n📌 حجم deload: ${deloadSets.length} ست`);
console.log(`📌 حجم عادی: ${regularSets.length} ست`);
console.log(`📌 کاهش: ${Math.round((1 - deloadSets.length / regularSets.length) * 100)}%`);
console.log('✅ تست Deload کامل شد');

// ═══════════════════════════════════════════════════════════
//  Phase 9 — Split Selection E2E
// ═══════════════════════════════════════════════════════════

type SplitCase = {
  name: string;
  days: number;
  experience: AthleteProfile['experience'];
  goal: AthleteProfile['primaryGoal'];
  expected: string;
};

function testSplitSelection(): void {
  printHeader('Phase 9 — Split Selection E2E');

  const cases: SplitCase[] = [
    { name: 'beginner 3 rooz', days: 3, experience: 'beginner', goal: 'general_fitness', expected: 'full_body' },
    { name: 'beginner 4 rooz', days: 4, experience: 'beginner', goal: 'general_fitness', expected: 'upper_lower' },
    { name: 'intermediate 4 strength', days: 4, experience: 'intermediate', goal: 'strength', expected: 'push_pull' },
    { name: 'intermediate 4 hypo', days: 4, experience: 'intermediate', goal: 'hypertrophy', expected: 'torso_limbs' },
    { name: 'advanced 4', days: 4, experience: 'advanced', goal: 'hypertrophy', expected: 'torso_limbs' },
    { name: 'advanced 5 hypo', days: 5, experience: 'advanced', goal: 'hypertrophy', expected: 'arnold_split' },
    { name: 'advanced 5 strength', days: 5, experience: 'advanced', goal: 'strength', expected: 'bro_split' },
    { name: 'advanced 6 hypo', days: 6, experience: 'advanced', goal: 'hypertrophy', expected: 'arnold_split' },
    { name: 'advanced 6 strength', days: 6, experience: 'advanced', goal: 'strength', expected: 'ppl_ul_hybrid' },
  ];

  for (const testCase of cases) {
    const profile: AthleteProfile = {
      ...SYSTEMS_TEST_PROFILE,
      name: 'Split E2E - ' + testCase.name,
      experience: testCase.experience,
      trainingDays: testCase.days,
      primaryGoal: testCase.goal,
    };
    const plan = selectSplit(testCase.days, testCase.experience, testCase.goal as Goal);
    const generated = generateOfflineWorkout(profile);

    check(testCase.name + ': plan.type', plan.type === testCase.expected, plan.type + ' != ' + testCase.expected);
    check(testCase.name + ': metadata.splitType', generated.splitType === testCase.expected, String(generated.splitType) + ' != ' + testCase.expected);
    check(testCase.name + ': days', generated.days.length === testCase.days, generated.days.length + ' != ' + testCase.days);
    check(testCase.name + ': sessions', plan.sessions.length === testCase.days, plan.sessions.length + ' != ' + testCase.days);
    check(testCase.name + ': valid', plan.sessions.every((s) => Boolean(s.focus) && Boolean(s.title) && s.muscleGroups.length > 0));
  }
}

testSplitSelection();
