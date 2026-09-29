import type { CapacitorConfig } from '@capacitor/cli';

// خواندن متغیر محیطی (پیش‌فرض: bazaar)
const flavor = process.env.VITE_APP_FLAVOR || 'bazaar';

const config: CapacitorConfig = {
  appId: flavor === 'personal' ? 'com.amin.aifitness.personal' : 'com.aifitness.coach',
  appName: flavor === 'personal' ? 'AI Fitness Personal' : 'AI Fitness Coach',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: '#0D0D1A',
    overrideUserAgent: 'AI-Fitness-Coach-Android',
  },
  ios: {
    backgroundColor: '#0D0D1A',
    scrollEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0D0D1A',
      showSpinner: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1A1A2E',
      overlaysWebView: true,
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#D4AF37',
    },
  },
};

export default config;
