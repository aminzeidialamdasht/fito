import type { CapacitorConfig } from '@capacitor/cli';

// خواندن متغیر محیطی (پیش‌فرض: myket)
const flavor = process.env.VITE_APP_FLAVOR || 'myket';

const APP_CONFIG: Record<string, { appId: string; appName: string }> = {
  personal: {
    appId: 'com.amin.aifitness.personal',
    appName: 'Coachino Personal',
  },
  bazaar: {
    appId: 'com.aifitness.coach',
    appName: 'Coachino',
  },
  myket: {
    appId: 'com.coachino.myket',
    appName: 'Coachino',
  },
};

const current = APP_CONFIG[flavor] || APP_CONFIG.myket;

const config: CapacitorConfig = {
  appId: current.appId,
  appName: current.appName,
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
    overrideUserAgent: 'Coachino-Android',
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
