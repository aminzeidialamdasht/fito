import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aifitness.coach',
  appName: 'کوچینو (Coachino)',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: { androidScheme: 'https', cleartext: false },
  android: { allowMixedContent: false, captureInput: true, webContentsDebuggingEnabled: false, backgroundColor: '#0D0D1A', overrideUserAgent: 'Coachino-Android' },
  ios: { backgroundColor: '#0D0D1A', scrollEnabled: true },
  plugins: {
    SplashScreen: { launchShowDuration: 2000, backgroundColor: '#0D0D1A', showSpinner: false, androidSplashResourceName: 'splash', androidScaleType: 'CENTER_CROP' },
    StatusBar: { style: 'DARK', backgroundColor: '#1A1A2E', overlaysWebView: true },
    Keyboard: { resize: 'body', resizeOnFullScreen: true },
    LocalNotifications: { smallIcon: 'ic_stat_icon_config_sample', iconColor: '#14B8A6' },
  },
};

export default config;
