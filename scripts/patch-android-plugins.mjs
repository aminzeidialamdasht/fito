/**
 * حذف پلاگین‌های غیرضروری از build بر اساس flavor
 *
 * چرا؟ myket-billing-client و poolakey کلاس‌های مشترک دارند
 * (com.android.vending.billing.IInAppBillingService) و در یک build تداخل می‌کنند.
 *
 * اجرا: FLAVOR=myket node scripts/patch-android-plugins.mjs
 */

import fs from 'fs';
import path from 'path';

const FLAVOR = process.env.FLAVOR || 'myket';

// پلاگین‌های غیرضروری برای هر flavor (باید حذف شوند)
const PLUGINS_TO_REMOVE = {
  myket: ['salarizadi-capacitor-cafebazaar-poolakey'],
  bazaar: ['salarizadi-capacitor-myket'],
  personal: ['salarizadi-capacitor-myket', 'salarizadi-capacitor-cafebazaar-poolakey'],
};

const toRemove = PLUGINS_TO_REMOVE[FLAVOR] || [];
if (toRemove.length === 0) {
  console.log(`ℹ️  Flavor "${FLAVOR}" — no plugins to remove`);
  process.exit(0);
}

console.log(`🎯 Flavor: ${FLAVOR}`);
console.log(`📦 پلاگین‌های غیرضروری: ${toRemove.join(', ')}`);

// === 1. حذف از capacitor.build.gradle ===
const CAP_BUILD_GRADLE = path.join('android', 'app', 'capacitor.build.gradle');
if (fs.existsSync(CAP_BUILD_GRADLE)) {
  let content = fs.readFileSync(CAP_BUILD_GRADLE, 'utf8');
  for (const plugin of toRemove) {
    // حذف خط: implementation project(':plugin-name')
    const escaped = plugin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\s*implementation\\s+project\\(':${escaped}'\\)\\r?\\n?`, 'g');
    content = content.replace(pattern, '');
  }
  fs.writeFileSync(CAP_BUILD_GRADLE, content);
  console.log('✅ capacitor.build.gradle پاک‌سازی شد');
}

// === 2. حذف از capacitor.settings.gradle ===
const CAP_SETTINGS_GRADLE = path.join('android', 'capacitor.settings.gradle');
if (fs.existsSync(CAP_SETTINGS_GRADLE)) {
  let content = fs.readFileSync(CAP_SETTINGS_GRADLE, 'utf8');
  for (const plugin of toRemove) {
    const escaped = plugin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // حذف include ':plugin-name' و project(':plugin-name').projectDir = ...
    const includePattern = new RegExp(
      `include\\s+['"]:${escaped}['"]\\s*\\r?\\n?[^\\n]*projectDir[^\\n]*\\r?\\n?`,
      'g'
    );
    content = content.replace(includePattern, '');
    
    // fallback: فقط include را حذف کن
    const simplePattern = new RegExp(`include\\s+['"]:${escaped}['"]\\s*\\r?\\n?`, 'g');
    content = content.replace(simplePattern, '');
  }
  fs.writeFileSync(CAP_SETTINGS_GRADLE, content);
  console.log('✅ capacitor.settings.gradle پاک‌سازی شد');
}

// === 3. حذف از capacitor.plugins.json ===
const PLUGINS_JSON = path.join('android', 'app', 'src', 'main', 'assets', 'capacitor.plugins.json');
if (fs.existsSync(PLUGINS_JSON)) {
  let plugins = JSON.parse(fs.readFileSync(PLUGINS_JSON, 'utf8'));
  const before = plugins.length;
  plugins = plugins.filter(p => !toRemove.includes(p.pkg));
  fs.writeFileSync(PLUGINS_JSON, JSON.stringify(plugins, null, 2));
  console.log(`✅ capacitor.plugins.json: ${before} → ${plugins.length}`);
}

console.log('\n🎉 پاک‌سازی تمام شد');
