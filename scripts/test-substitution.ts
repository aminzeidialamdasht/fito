/**
 * تست موتور جایگزینی هوشمند
 * اجرا: npx tsx scripts/test-substitution.ts
 */

import { CHEST_EXERCISES } from '../src/engine/data/exercises/chest';
import {
  findSubstitutes,
  isExerciseAvailable,
} from '../src/engine/core/substitutionEngine';
import type { EquipmentType } from '../src/engine/types/exercise';

console.log('═══════════════════════════════════════════════');
console.log('  تست موتور جایگزینی هوشمند Fito');
console.log('═══════════════════════════════════════════════\n');

const ALL = CHEST_EXERCISES;

// انتخاب حرکت مرجع
const source = ALL.find((e) => e.id === 'chest_001')!; // پرس سینه هالتر
console.log(`🎯 حرکت مرجع: ${source.name} (${source.englishName})`);
console.log(`   ID: ${source.id}`);
console.log(`   تجهیزات: ${source.equipment.join(', ')}\n`);

// ═══ سناریو ۱: باشگاه کامل ═══
console.log('📋 سناریو ۱: باشگاه کامل (همه تجهیزات)');
const fullGym: EquipmentType[] = [
  'barbell', 'dumbbell', 'machine', 'cable', 'bodyweight',
  'bench', 'pull_up_bar', 'dip_station', 'smith_machine',
];

const scenario1 = findSubstitutes(source, ALL, {
  availableEquipment: fullGym,
  maxResults: 5,
});

console.log(`   نتایج (${scenario1.length}):`);
scenario1.forEach((c, i) => {
  console.log(`   ${i + 1}. ${c.exercise.name} — امتیاز: ${c.score}`);
  console.log(`      دلایل: ${c.reasons.join(' + ')}`);
});

// ═══ سناریو ۲: فقط دمبل و میز ═══
console.log('\n📋 سناریو ۲: فقط دمبل و میز (بدون هالتر)');
const dumbbellOnly: EquipmentType[] = ['dumbbell', 'bench', 'bodyweight'];

const scenario2 = findSubstitutes(source, ALL, {
  availableEquipment: dumbbellOnly,
  maxResults: 5,
});

console.log(`   نتایج (${scenario2.length}):`);
scenario2.forEach((c, i) => {
  console.log(`   ${i + 1}. ${c.exercise.name} — امتیاز: ${c.score}`);
});

// ═══ سناریو ۳: فقط دستگاه ═══
console.log('\n📋 سناریو ۳: فقط دستگاه (بدون وزنه آزاد)');
const machineOnly: EquipmentType[] = ['machine', 'cable'];

const scenario3 = findSubstitutes(source, ALL, {
  availableEquipment: machineOnly,
  maxResults: 5,
});

console.log(`   نتایج (${scenario3.length}):`);
scenario3.forEach((c, i) => {
  console.log(`   ${i + 1}. ${c.exercise.name} — امتیاز: ${c.score}`);
});

// ═══ سناریو ۴: با آسیب شانه ═══
console.log('\n📋 سناریو ۴: باشگاه کامل ولی آسیب شانه');
const scenario4 = findSubstitutes(source, ALL, {
  availableEquipment: fullGym,
  injuries: { shoulder: 'medium' },
  maxResults: 5,
});

console.log(`   نتایج (${scenario4.length}):`);
scenario4.forEach((c, i) => {
  console.log(`   ${i + 1}. ${c.exercise.name} — امتیاز: ${c.score}`);
  const risk = c.exercise.injuryRisk.shoulder ?? 'none';
  console.log(`      ریسک شانه: ${risk}`);
});

// ═══ تست isExerciseAvailable ═══
console.log('\n📋 تست isExerciseAvailable:');
const barbellPress = ALL.find((e) => e.id === 'chest_001')!;
const dumbbellPress = ALL.find((e) => e.id === 'chest_002')!;
const machinePress = ALL.find((e) => e.id === 'chest_007')!;

console.log(`   پرس هالتر با دمبل‌فقط: ${isExerciseAvailable(barbellPress, dumbbellOnly)} (باید false)`);
console.log(`   پرس دمبل با دمبل‌فقط: ${isExerciseAvailable(dumbbellPress, dumbbellOnly)} (باید true)`);
console.log(`   پرس دستگاه با machineOnly: ${isExerciseAvailable(machinePress, machineOnly)} (باید true)`);

// ═══ شمارش کل ═══
console.log('\n═══════════════════════════════════════════════');
console.log(`📊 آمار: ${ALL.length} حرکت سینه، ${scenario1.length} جایگزین یافت شد`);
console.log('═══════════════════════════════════════════════');
