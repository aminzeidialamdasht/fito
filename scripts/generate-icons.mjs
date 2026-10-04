import sharp from 'sharp';
import fs from 'fs';

const SRC = 'fito-icon.png';
const PUBLIC = 'public';
const NATIVE = 'native-assets/android';

if (!fs.existsSync(SRC)) {
  console.error('❌ فایل fito-icon.png پیدا نشد!');
  process.exit(1);
}

console.log('🎨 شروع تولید آیکون‌ها با padding...\n');

/**
 * PNG با ابعاد size×size و آیکون در مرکز با padding مشخص
 */
async function makeIconWithPadding(size, out, paddingRatio = 0.15) {
  const inner = Math.round(size * (1 - paddingRatio * 2));
  const padded = await sharp(SRC)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: padded, gravity: 'center' }])
    .png()
    .toFile(out);
}

// favicon
await sharp(SRC).resize(64, 64, { fit: 'cover' }).png().toFile(`${PUBLIC}/favicon.png`);
console.log('✅ favicon.png (64x64)');

// icon عمومی 512x512
await makeIconWithPadding(512, `${PUBLIC}/fito-icon.png`, 0.08);
console.log('✅ public/fito-icon.png (512 با padding)');

// logo 512x512
await makeIconWithPadding(512, `${PUBLIC}/logo.png`, 0.08);
console.log('✅ public/logo.png (512 با padding)');

// mipmap Android (legacy) — با padding ملایم
const mipmaps = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
for (const [density, size] of Object.entries(mipmaps)) {
  const dir = `${NATIVE}/mipmap-${density}`;
  fs.mkdirSync(dir, { recursive: true });
  await makeIconWithPadding(size, `${dir}/ic_launcher.png`, 0.12);
  await makeIconWithPadding(size, `${dir}/ic_launcher_round.png`, 0.12);
  console.log(`✅ mipmap-${density}: ${size} (padding 12%)`);
}

// drawable Android (adaptive foreground) — با padding 15%
const drawableSizes = { mdpi: 108, hdpi: 162, xhdpi: 216, xxhdpi: 324, xxxhdpi: 432 };
for (const [density, size] of Object.entries(drawableSizes)) {
  const dir = `${NATIVE}/drawable-${density}`;
  fs.mkdirSync(dir, { recursive: true });
  await makeIconWithPadding(size, `${dir}/ic_launcher_foreground.png`, 0.15);
  await makeIconWithPadding(size, `${dir}/ic_launcher_monochrome.png`, 0.15);
  console.log(`✅ drawable-${density}: ${size} (padding 15%)`);
}

console.log('\n🎉 همه آیکون‌ها با padding ساخته شدند!');
