import sharp from 'sharp';
import fs from 'fs';

const SRC = 'fito-icon.png';
const PUBLIC = 'public';
const NATIVE = 'native-assets/android';

if (!fs.existsSync(SRC)) {
  console.error('❌ فایل fito-icon.png پیدا نشد!');
  process.exit(1);
}

console.log('🎨 شروع تولید آیکون‌ها...\n');

// ۱. favicon 64x64
await sharp(SRC).resize(64, 64).png().toFile(`${PUBLIC}/favicon.png`);
console.log('✅ favicon.png (64x64)');

// ۲. icon عمومی 512x512
await sharp(SRC).resize(512, 512).png().toFile(`${PUBLIC}/fito-icon.png`);
console.log('✅ public/fito-icon.png (512x512)');

// ۳. logo 512x512
await sharp(SRC).resize(512, 512).png().toFile(`${PUBLIC}/logo.png`);
console.log('✅ public/logo.png (512x512)');

// ۴. آیکون‌های Android (mipmap)
const mipmaps = {
  'mdpi': 48,
  'hdpi': 72,
  'xhdpi': 96,
  'xxhdpi': 144,
  'xxxhdpi': 192,
};

for (const [density, size] of Object.entries(mipmaps)) {
  const dir = `${NATIVE}/mipmap-${density}`;
  fs.mkdirSync(dir, { recursive: true });
  await sharp(SRC).resize(size, size).png().toFile(`${dir}/ic_launcher.png`);
  await sharp(SRC).resize(size, size).png().toFile(`${dir}/ic_launcher_round.png`);
  console.log(`✅ mipmap-${density}: ${size}x${size}`);
}

// ۵. آیکون‌های foreground
const drawableSizes = {
  'mdpi': 108,
  'hdpi': 162,
  'xhdpi': 216,
  'xxhdpi': 324,
  'xxxhdpi': 432,
};

for (const [density, size] of Object.entries(drawableSizes)) {
  const dir = `${NATIVE}/drawable-${density}`;
  fs.mkdirSync(dir, { recursive: true });
  await sharp(SRC).resize(size, size).png().toFile(`${dir}/ic_launcher_foreground.png`);
  await sharp(SRC).resize(size, size).png().toFile(`${dir}/ic_launcher_monochrome.png`);
  console.log(`✅ drawable-${density}: ${size}x${size}`);
}

console.log('\n🎉 همه آیکون‌ها ساخته شدند!');
