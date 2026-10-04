/**
 * اسکریپت patch repositoryها به android/build.gradle
 * برای پشتیبانی از JitPack (کافه‌بازار) و Myket repo
 *
 * اجرا: node scripts/patch-android-repos.mjs
 */

import fs from 'fs';
import path from 'path';

const BUILD_GRADLE = path.join('android', 'build.gradle');

if (!fs.existsSync(BUILD_GRADLE)) {
  console.error('❌ android/build.gradle پیدا نشد. اول npx cap add android را بزن.');
  process.exit(1);
}

let content = fs.readFileSync(BUILD_GRADLE, 'utf8');

const JITPACK_REPO = "maven { url 'https://jitpack.io' }";
const MYKET_REPO = "maven { url 'https://maven.myket.ir' }";

let modified = false;

// 1. JitPack
if (!content.includes('jitpack.io')) {
  // اضافه کردن بعد از mavenCentral() در allprojects.repositories
  const allProjectsPattern = /(allprojects\s*\{[\s\S]*?repositories\s*\{[\s\S]*?mavenCentral\(\)\s*\n)/;
  if (allProjectsPattern.test(content)) {
    content = content.replace(allProjectsPattern, `$1        ${JITPACK_REPO}\n`);
    modified = true;
  } else {
    // اگر mavenCentral نبود، فقط بعد از repositories {
    content = content.replace(
      /(allprojects\s*\{[\s\S]*?repositories\s*\{)/,
      `$1\n        ${JITPACK_REPO}`
    );
    modified = true;
  }
  console.log('✅ JitPack repository اضافه شد');
} else {
  console.log('ℹ️  JitPack از قبل موجود است');
}

// 2. Myket
if (!content.includes('maven.myket.ir')) {
  const allProjectsPattern = /(allprojects\s*\{[\s\S]*?repositories\s*\{[\s\S]*?mavenCentral\(\)\s*\n)/;
  if (allProjectsPattern.test(content)) {
    content = content.replace(allProjectsPattern, `$1        ${MYKET_REPO}\n`);
    modified = true;
  } else {
    content = content.replace(
      /(allprojects\s*\{[\s\S]*?repositories\s*\{)/,
      `$1\n        ${MYKET_REPO}`
    );
    modified = true;
  }
  console.log('✅ Myket repository اضافه شد');
} else {
  console.log('ℹ️  Myket از قبل موجود است');
}

if (modified) {
  fs.writeFileSync(BUILD_GRADLE, content);
  console.log('\n🎉 android/build.gradle به‌روز شد');
  console.log('\n--- محتوای جدید ---');
  console.log(content.split('\n').slice(0, 40).join('\n'));
} else {
  console.log('\nℹ️  هیچ تغییری لازم نبود');
}
