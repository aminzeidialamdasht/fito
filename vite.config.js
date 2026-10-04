import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "fs";
import { execSync } from "child_process";

// خواندن نسخه از package.json (fallback)
const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

// تلاش برای خواندن tag گیت
let appVersion = pkg.version;
try {
  // VERSION_OVERRIDE از CI (GitHub Actions) — اگر ست شده باشد
  if (process.env.VERSION_OVERRIDE) {
    appVersion = process.env.VERSION_OVERRIDE;
    console.log(`📌 Version from VERSION_OVERRIDE: ${appVersion}`);
  } else {
    // تلاش برای خواندن از git tag (local build)
    const tag = execSync('git describe --tags --abbrev=0', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    // حذف پیشوند v و پسوند -flavor
    appVersion = tag.replace(/^v/, '').replace(/-(myket|bazaar|personal)$/, '');
    console.log(`📌 Version from git tag: ${tag} → ${appVersion}`);
  }
} catch (e) {
  console.log(`📌 Version from package.json: ${appVersion}`);
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // تزریق نسخه به کد به‌عنوان __APP_VERSION__
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
