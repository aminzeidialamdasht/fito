export interface Tokens {
  bg: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  textMain: string;
  textSub: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  accentStrong: string;
  gold: string;
  goldSoft: string;
  success: string;
  successSoft: string;
  warning: string;
  danger: string;
  info: string;
  priority: string;
  accessory: string;
  // Scientific / Volume specific
  volume: string;
  intensity: string;
  recovery: string;
}

export function getTokens(isDark: boolean): Tokens {
  return isDark
    ? {
        bg: '#0B0F1A',
        surface: '#13182B',
        surfaceElevated: '#1C2438',
        border: 'rgba(255,255,255,0.08)',
        textMain: '#F1F5F9',
        textSub: '#94A3B8',
        textMuted: '#64748B',
        accent: '#8B5CF6',
        accentSoft: 'rgba(139,92,246,0.15)',
        accentStrong: '#7C3AED',
        gold: '#F59E0B',
        goldSoft: 'rgba(245,158,11,0.15)',
        success: '#10B981',
        successSoft: 'rgba(16,185,129,0.15)',
        warning: '#FBBF24',
        danger: '#F87171',
        info: '#60A5FA',
        priority: '#C084FC',
        accessory: '#38BDF8',
        volume: '#A78BFA',
        intensity: '#F59E0B',
        recovery: '#34D399',
      }
    : {
        bg: '#F8FAFC',
        surface: '#FFFFFF',
        surfaceElevated: '#F1F5F9',
        border: 'rgba(139,92,246,0.18)',
        textMain: '#0F172A',
        textSub: '#64748B',
        textMuted: '#94A3B8',
        accent: '#7C3AED',
        accentSoft: 'rgba(124,58,237,0.1)',
        accentStrong: '#6D28D9',
        gold: '#D97706',
        goldSoft: 'rgba(217,119,6,0.12)',
        success: '#059669',
        successSoft: 'rgba(5,150,105,0.1)',
        warning: '#D97706',
        danger: '#DC2626',
        info: '#2563EB',
        priority: '#9333EA',
        accessory: '#0284C7',
        volume: '#8B5CF6',
        intensity: '#D97706',
        recovery: '#10B981',
      };
}
