/**
 * تست موتور جایگزینی هوشمند Fito
 * اجرا: npm run test:engine
 */

import { ALL_EXERCISES, EXERCISE_DB_STATS } from '../src/engine/data/exercises/index';
import {
  findSubstitutes,
  isExerciseAvailable,
} from '../src/engine/core/substitutionEngine';
import type { EquipmentType, Exercise } from '../src/engine/types/exercise';

// ═══════════════════════════════════════════════════════════
//  ابزار نمایش
// ═══════════════════════════════════════════════════════════

function printHeader(title: string): void {
  console.log('\n═══════════════════════════════════════════════');
  console.log(`  ${title}`);
  console.log('═══════════════════════════════════════════════');
}

function printScenario(
  name: string,
  source: Exercise,
  options: Parameters<typeof findSubstitutes>[2]
): void {
  console.log(`\n📋 ${name}`);
  const results = findSubstitutes(source, ALL_EXERCISES, options);

  if (results.length === 0) {
    console.log('   ⚠️  هیچ جایگزینی یافت نشد');
    return;
  }

  console.log(`   نتایج (${results.length}):`);
  results.forEach((c, i) => {
    const eq = c.exercise.equipmentDetails?.primary ?? c.exercise.equipment[0];
    console.log(`   ${i + 1}. ${c.exercise.name} [${eq}] — امتیاز: ${c.score}`);
    console.log(`      ${c.reasons.join(' + ')}`);
  });
}

function findOrFail(id: string): Exercise {
  const ex = ALL_EXERCISES.find((e) => e.id === id);
  if (!ex) throw new Error(`Exercise not found: ${id}`);
  return ex;
}

// ═══════════════════════════════════════════════════════════
//  شروع
// ═══════════════════════════════════════════════════════════

printHeader('تست موتور جایگزینی هوشمند Fito');

console.log(`\n📊 دیتابیس فعلی:`);
console.log(`   کل حرکات: ${EXERCISE_DB_STATS.total}`);
console.log(`   ترکیبی: ${EXERCISE_DB_STATS.compound}`);
console.log(`   ایزوله: ${EXERCISE_DB_STATS.isolation}`);
console.log(`\n   به تفکیک عضله:`);
Object.entries(EXERCISE_DB_STATS.byMuscle)
  .sort(([, a], [, b]) => b - a)
  .forEach(([muscle, count]) => {
    console.log(`     ${muscle}: ${count}`);
  });

// ═══════════════════════════════════════════════════════════
//  تنظیمات تجهیزات
// ═══════════════════════════════════════════════════════════

const fullGym: EquipmentType[] = [
  'barbell', 'dumbbell', 'machine', 'cable', 'bodyweight',
  'bench', 'pull_up_bar', 'dip_station', 'smith_machine',
];

const dumbbellOnly: EquipmentType[] = ['dumbbell', 'bench', 'bodyweight'];
const machineOnly: EquipmentType[] = ['machine', 'cable'];
const homeGym: EquipmentType[] = ['dumbbell', 'bench', 'bodyweight', 'pull_up_bar'];

// ═══════════════════════════════════════════════════════════
//  سناریوهای سینه
// ═══════════════════════════════════════════════════════════

printHeader('سینه — حرکت مرجع: پرس سینه هالتر');
const chestSource = findOrFail('chest_001');
console.log(`🎯 ${chestSource.name} (${chestSource.englishName})`);

printScenario('سناریو ۱: باشگاه کامل', chestSource, {
  availableEquipment: fullGym, maxResults: 5,
});
printScenario('سناریو ۲: فقط دمبل و میز', chestSource, {
  availableEquipment: dumbbellOnly, maxResults: 5,
});
printScenario('سناریو ۳: فقط دستگاه', chestSource, {
  availableEquipment: machineOnly, maxResults: 5,
});
printScenario('سناریو ۴: آسیب شانه', chestSource, {
  availableEquipment: fullGym, injuries: { shoulder: 'medium' }, maxResults: 5,
});

// ═══════════════════════════════════════════════════════════
//  سناریوهای پشت
// ═══════════════════════════════════════════════════════════

printHeader('پشت — حرکت مرجع: نشر خم هالتر');
const rowSource = findOrFail('back_008');
console.log(`🎯 ${rowSource.name} (${rowSource.englishName})`);

printScenario('سناریو ۱: باشگاه کامل', rowSource, {
  availableEquipment: fullGym, maxResults: 5,
});
printScenario('سناریو ۲: فقط دمبل و میز (بدون هالتر)', rowSource, {
  availableEquipment: dumbbellOnly, maxResults: 5,
});
printScenario('سناریو ۳: فقط دستگاه و سیم‌کش', rowSource, {
  availableEquipment: machineOnly, maxResults: 5,
});
printScenario('سناریو ۴: آسیب کمر', rowSource, {
  availableEquipment: fullGym, injuries: { lowerBack: 'medium' }, maxResults: 5,
});

// ═══════════════════════════════════════════════════════════
//  سناریوهای لت
// ═══════════════════════════════════════════════════════════

printHeader('لت — حرکت مرجع: زیربغل سیم‌کش پهن');
const latSource = findOrFail('back_001');
console.log(`🎯 ${latSource.name} (${latSource.englishName})`);

printScenario('سناریو ۱: باشگاه کامل', latSource, {
  availableEquipment: fullGym, maxResults: 5,
});
printScenario('سناریو ۲: باشگاه خانگی (دمبل + بارفیکس)', latSource, {
  availableEquipment: homeGym, maxResults: 5,
});

// ═══════════════════════════════════════════════════════════
//  سناریوهای سرشانه
// ═══════════════════════════════════════════════════════════

printHeader('سرشانه — حرکت مرجع: پرس سرشانه هالتر ایستاده');
const ohpSource = findOrFail('shoulder_001');
console.log(`🎯 ${ohpSource.name} (${ohpSource.englishName})`);

printScenario('سناریو ۱: باشگاه کامل', ohpSource, {
  availableEquipment: fullGym, maxResults: 5,
});
printScenario('سناریو ۲: فقط دمبل و میز', ohpSource, {
  availableEquipment: dumbbellOnly, maxResults: 5,
});
printScenario('سناریو ۳: فقط دستگاه', ohpSource, {
  availableEquipment: machineOnly, maxResults: 5,
});
printScenario('سناریو ۴: آسیب شانه', ohpSource, {
  availableEquipment: fullGym, injuries: { shoulder: 'medium' }, maxResults: 5,
});

printHeader('نشر جانب — حرکت مرجع: نشر جانب دمبل ایستاده');
const lateralSource = findOrFail('shoulder_003');
console.log(`🎯 ${lateralSource.name} (${lateralSource.englishName})`);

printScenario('سناریو ۱: باشگاه کامل', lateralSource, {
  availableEquipment: fullGym, maxResults: 5,
});
printScenario('سناریو ۲: فقط دستگاه و سیم‌کش', lateralSource, {
  availableEquipment: machineOnly, maxResults: 5,
});

// ═══════════════════════════════════════════════════════════
//  تست isExerciseAvailable
// ═══════════════════════════════════════════════════════════

printHeader('تست isExerciseAvailable');

const barRow = findOrFail('back_008');
const dbRow = findOrFail('back_009');
const machineRow = findOrFail('back_013');

console.log(`   نشر خم هالتر با دمبل‌فقط: ${isExerciseAvailable(barRow, dumbbellOnly)} (باید false)`);
console.log(`   نشر خم دمبل با دمبل‌فقط: ${isExerciseAvailable(dbRow, dumbbellOnly)} (باید true)`);
console.log(`   قایقی دستگاه با machineOnly: ${isExerciseAvailable(machineRow, machineOnly)} (باید true)`);

// ═══════════════════════════════════════════════════════════
//  آمار نهایی
// ═══════════════════════════════════════════════════════════

printHeader('خلاصه');

console.log(`📊 کل دیتابیس: ${ALL_EXERCISES.length} حرکت`);
console.log(`   سینه: ${EXERCISE_DB_STATS.byMuscle['chest'] ?? 0}`);
console.log(`   لت: ${EXERCISE_DB_STATS.byMuscle['lats'] ?? 0}`);
console.log(`   پشت میانی: ${EXERCISE_DB_STATS.byMuscle['upper_back'] ?? 0}`);
console.log(`   پایین پشت: ${EXERCISE_DB_STATS.byMuscle['lower_back'] ?? 0}`);
console.log(`   سرشانه پشتی: ${EXERCISE_DB_STATS.byMuscle['rear_delts'] ?? 0}`);
console.log(`   کول: ${EXERCISE_DB_STATS.byMuscle['traps'] ?? 0}`);
console.log(`   سرشانه جلو: ${EXERCISE_DB_STATS.byMuscle['front_delts'] ?? 0}`);
console.log(`   سرشانه کنار: ${EXERCISE_DB_STATS.byMuscle['side_delts'] ?? 0}`);

console.log('\n✅ تست کامل شد');
