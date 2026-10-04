/**
 * اسکریپت patch placeholderهای manifest برای پلاگین‌های مایکت/بازار
 *
 * این اسکریپت به android/app/build.gradle مقداردهی placeholderها را اضافه می‌کند.
 * اجرا: FLAVOR=myket node scripts/patch-android-manifest.mjs
 */

import fs from 'fs';
import path from 'path';

const FLAVOR = process.env.FLAVOR || 'myket';
const BUILD_GRADLE = path.join('android', 'app', 'build.gradle');

if (!fs.existsSync(BUILD_GRADLE)) {
  console.error('❌ android/app/build.gradle پیدا نشد');
  process.exit(1);
}

// مقادیر placeholder بر اساس flavor
const PLACEHOLDER_VALUES = {
  myket: {
    marketApplicationId: 'ir.mservices.market',
    marketBindAddress: 'ir.mservices.market.BILLING',
    marketPermission: 'ir.mservices.market.BILLING',
    marketIntentProxy: 'com.myket.MyketIABProxyActivity',
    marketIntentService: 'com.myket.MyketIntentService',
  },
  bazaar: {
    marketApplicationId: 'com.farsitel.bazaar',
    marketBindAddress: 'com.farsitel.bazaar.BILLING',
    marketPermission: 'com.farsitel.bazaar.BILLING',
    marketIntentProxy: 'com.farsitel.bazaar.ui.purchase.payment.IPaymentActivity',
    marketIntentService: 'com.farsitel.bazaar.service.InAppBillingService',
  },
  personal: null, // نیازی نیست
};

const values = PLACEHOLDER_VALUES[FLAVOR];

if (!values) {
  console.log(`ℹ️  Flavor "${FLAVOR}" نیازی به manifest placeholders ندارد — skip`);
  process.exit(0);
}

let content = fs.readFileSync(BUILD_GRADLE, 'utf8');

if (content.includes('manifestPlaceholders')) {
  console.log('ℹ️  manifestPlaceholders از قبل موجود است — skip');
  process.exit(0);
}

// ساخت بلوک placeholder
const placeholderBlock = `        manifestPlaceholders = [
            marketApplicationId: "${values.marketApplicationId}",
            marketBindAddress: "${values.marketBindAddress}",
            marketPermission: "${values.marketPermission}",
            marketIntentProxy: "${values.marketIntentProxy}",
            marketIntentService: "${values.marketIntentService}",
        ]
`;

// پیدا کردن defaultConfig و اضافه کردن placeholder
const defaultConfigPattern = /(defaultConfig\s*\{[\s\S]*?)(\n\s*\})/;
if (defaultConfigPattern.test(content)) {
  content = content.replace(
    defaultConfigPattern,
    `$1\n${placeholderBlock}$2`
  );
} else {
  console.error('❌ defaultConfig پیدا نشد');
  process.exit(1);
}

fs.writeFileSync(BUILD_GRADLE, content);
console.log(`✅ manifestPlaceholders برای flavor "${FLAVOR}" اضافه شد`);
console.log('   marketApplicationId:', values.marketApplicationId);
