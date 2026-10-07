export interface Tokens {
  bg: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  textMain: string;
  textSub: string;
  accent: string;
  accentSoft: string;
  gold: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  priority: string;
  accessory: string;
}

export function getTokens(isDark: boolean): Tokens {
  return isDark
    ? {
        bg: '#0f172a',
        surface: '#1e1b4b',
        surfaceElevated: '#292554',
        border: 'rgba(255,255,255,0.1)',
        textMain: '#ffffff',
        textSub: '#94a3b8',
        accent: '#a78bfa',
        accentSoft: 'rgba(167,139,250,0.16)',
        gold: '#d4af37',
        success: '#34d399',
        warning: '#fbbf24',
        danger: '#f87171',
        info: '#60a5fa',
        priority: '#c084fc',
        accessory: '#38bdf8',
      }
    : {
        bg: '#f8fafc',
        surface: '#ffffff',
        surfaceElevated: '#f5f3ff',
        border: 'rgba(139,92,246,0.2)',
        textMain: '#0f172a',
        textSub: '#64748b',
        accent: '#8b5cf6',
        accentSoft: 'rgba(139,92,246,0.1)',
        gold: '#f59e0b',
        success: '#16a34a',
        warning: '#d97706',
        danger: '#dc2626',
        info: '#2563eb',
        priority: '#9333ea',
        accessory: '#0284c7',
      };
}
