# 🏋️ Fito | فیتو — AI-Powered Offline Fitness Coach

<div align="center">

![Version](https://img.shields.io/badge/version-1.3.0-D4AF37?style=for-the-badge)
![Platform](https://img.shields.io/badge/platform-Android-14B8A6?style=for-the-badge)
![Min Android](https://img.shields.io/badge/min%20android-7.0-0D9488?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-22C55E?style=for-the-badge)
![Flavors](https://img.shields.io/badge/flavors-myket%20%7C%20bazaar%20%7C%20personal-8B5CF6?style=for-the-badge)

**AI-Powered Offline Fitness Coach**
**دستیار هوشمند بدنسازی کاملاً آفلاین**

*An intelligent app for coaches and athletes*

[📥 Download APK](../../releases) • [📖 Documentation](#-documentation) • [🇮🇷 مستندات فارسی](README_FA.md)

</div>

---

## 🎯 Overview | معرفی

**Fito** is a professional bodybuilding app with a fully offline, scientifically-grounded workout engine that generates personalized training programs for athletes.

Unlike previous versions that relied on online AI, **Fito v1.3.0** works completely offline using **16 engine modules** based on research by Schoenfeld, Helms, and Israetel.

---

## ✨ Features | ویژگی‌ها

### 🧠 Offline Engine (موتور آفلاین)
- **16 Scientific Modules**: profileAnalyzer, splitSelector, volumeAllocator, progressionEngine, deloadEngine, injurySafetyEngine, substitutionEngine and more
- **Database of 58 Exercises** across 6 muscle groups
- **Zero Internet Required**
- **Auto-Regeneration**: automatically rebuilds program based on current week (v1.3.0)
- **Periodization + Deload**: automatic deload weeks
- **Injury Safety Engine**: injury-aware workout generation

### 📅 Week-Based System (v1.3.0)
- **Week Calculator**: advanced training week calculator
- **Auto-Regeneration**: program adapts to current week automatically
- **Week Indicator**: week display in ProgramDetail
- **Progressive Overload**: automatic gradual overload

### 🤖 AI Prompt Generator
- **Professional Prompt Generation** for ChatGPT, Gemini, Claude
- **JSON Output** for all AI models
- **Import AI-generated programs**

### 👥 Multi-Profile Management
- Unlimited profiles per athlete
- One-click profile switching
- Fully independent data per profile

### 🏋️ Professional Workout Tracker
- **TodaySession**: automatic daily workout display
- **Rest Timer**: auto-start after each set
- **WorkoutTracker**: live weight/rep logging
- **SessionPreview**: preview before starting
- **StrengthRecords**: strength record tracking

### 📊 Professional Dashboard
- **DashboardHero**: hero card with weekly progress
- **Complete Stats**: sessions, volume, streak, weekly goal
- **Weight Chart** and **Muscle Radar**
- **SafetyReportCard**: training safety report

### 🥗 Nutrition & Supplements
- **Nutrition**: nutrition management
- **NutritionImport**: nutrition data import
- **Supplements**: supplement management
- **SupplementImport**: supplement data import

### 💳 Subscription System (v1.2+)
- **3 Plans**: Monthly / Yearly / Lifetime
- **3 Stores**: Cafe Bazaar, Myket, Personal
- **30-day Free Trial**
- **PremiumGate** for premium features

### 🎨 Professional Design
- **Dark Theme**: navy + purple (#0f172a + #a78bfa)
- **Light Theme**: white + purple (#f8fafc + #8b5cf6)
- **Glassmorphism Cards**
- **Framer Motion** animations
- **Full RTL** + **Vazirmatn Font**

---

## 📥 Download | دانلود

| Store | Flavor | Link |
|---|---|---|
| **GitHub Releases** | myket / personal | [Releases](../../releases) |
| **Cafe Bazaar** | bazaar | Coming soon |
| **Myket** | myket | Coming soon |

### Latest Version: **v1.3.0**
- VersionCode: 10300
- App ID: com.fito.app
- APK Size: ~15 MB

---

## 🛠 Build from Source

### Prerequisites
- Node.js 18+
- npm 9+
- Java JDK 21
- Android Studio (for local build)

### Build for Different Stores

    # Clone
    git clone https://github.com/aminzeidialamdasht/fito.git
    cd fito

    # Install dependencies
    npm install

    # Build for Myket
    npm run android:myket
    cd android && ./gradlew assembleRelease

    # Build for Cafe Bazaar
    npm run android:bazaar
    cd android && ./gradlew assembleRelease

    # Build Personal Version
    npm run android:personal
    cd android && ./gradlew assembleRelease

### APK Location

    android/app/build/outputs/apk/release/app-release.apk

---

## 🚀 Release Process

This project uses **GitHub Actions** for automated APK builds:

    # 1. Create tags for myket and personal
    git tag v1.3.1-myket
    git tag v1.3.1-personal
    git push origin v1.3.1-myket v1.3.1-personal

    # 2. GitHub Actions automatically builds APKs
    # 3. Release is created and APK is attached

**Important**: Version is read from **git tag**, not from package.json (see vite.config.js).

---

## 🏗 Tech Stack

### Frontend
- **React 18** + **TypeScript 5.7**
- **Vite 6.3.5** — Build tool
- **Tailwind CSS 4.1.7** — Styling
- **Framer Motion 11** — Animations
- **React Router 6** — Navigation
- **Recharts 2.10** — Charts
- **Lucide React** — Icons
- **jalaali-js** — Persian Calendar
- **@dnd-kit** — Drag & Drop
- **canvas-confetti** — Effects

### Backend & Services
- **Supabase 2.98** — Cloud Sync (future)

### Billing
- **@salarizadi/capacitor-cafebazaar-poolakey** — Cafe Bazaar
- **@salarizadi/capacitor-myket** — Myket

### Android
- **Capacitor 8.5.2** — Native bridge
- **Kotlin** — Native code
- **Material Design 3** — UI
- **Android SDK 34** — Target
- **Min SDK 24** (Android 7.0)

### Build & CI/CD
- **GitHub Actions** — Automated builds
- **Gradle 8.13**
- **Java 21**

---

## 📊 Technical Information

| Item | Value |
|---|---|
| **Current Version** | v1.3.0 |
| Min Android | 7.0 (API 24) |
| Target Android | 14 (API 34) |
| APK Size | ~15 MB |
| Architecture | Universal |
| Language | Persian (RTL) |
| Font | Vazirmatn |
| App ID | com.fito.app |
| Storage Key | fito_state_v2 |
| Engine Version | 1.0.0 |
| Total Exercises | 58 |

---

## 🎨 Design System

### Real Colors (based on designTokens.ts)

**Dark Theme:**

    bg: #0f172a
    surface: #1e1b4b
    surfaceElevated: #292554
    accent: #a78bfa
    accentSoft: rgba(167,139,250,0.16)
    gold: #d4af37
    success: #34d399
    warning: #fbbf24
    danger: #f87171
    info: #60a5fa

**Light Theme:**

    bg: #f8fafc
    surface: #ffffff
    surfaceElevated: #f5f3ff
    accent: #8b5cf6
    accentSoft: rgba(139,92,246,0.1)
    gold: #f59e0b
    success: #16a34a
    warning: #d97706
    danger: #dc2626
    info: #2563eb

### Design Tokens
- Central file: src/styles/designTokens.ts
- Function: getTokens(isDark) → all colors
- Font: **Vazirmatn** (full RTL)

---

## 🤝 Contributing

Contributions are welcome!

### How to Contribute
1. Fork the repository
2. Create a branch (git checkout -b feature/amazing-feature)
3. Commit changes (git commit -m 'Add amazing feature')
4. Push to branch (git push origin feature/amazing-feature)
5. Open a Pull Request

### Report Issues
- Use [Issues](../../issues)
- Write a detailed description
- Add screenshots

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Contact

- 🐙 GitHub: [@aminzeidialamdasht](https://github.com/aminzeidialamdasht)

---

## 🙏 Acknowledgments

- **Vazirmatn Font** — Saber Rastikerdar
- **Lucide Icons** — Lucide Contributors
- **Capacitor** — Ionic Team
- **React** — Meta
- **Recharts** — Recharts Team
- **Framer Motion** — Framer

---

<div align="center">

**Made with ❤️ for the Iranian bodybuilding community**
**ساخته شده با ❤️ برای جامعه بدنسازی ایران**

⭐ If this project is useful to you, give it a star!

[⬆ Back to Top](#-fito--فیتو--ai-powered-offline-fitness-coach)

</div>
