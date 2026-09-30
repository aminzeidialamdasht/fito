/**
 * Theme-aware color utilities
 * Returns appropriate colors based on current theme (dark/light)
 */

export const themeColors = {
  primary: {
    dark: '#14b8a6',
    light: '#0d9488',
  },
  primaryLight: {
    dark: '#2dd4bf',
    light: '#14b8a6',
  },
  textPrimary: {
    dark: '#ffffff',
    light: '#134e4a',
  },
  textSecondary: {
    dark: '#9ca3af',
    light: '#0f766e',
  },
  textMuted: {
    dark: '#6b7280',
    light: '#0f766e80',
  },
  card: {
    dark: '#161616',
    light: '#ffffff',
  },
  cardGradient: {
    dark: 'from-[#161616] to-[#1a1a1a]',
    light: 'from-white to-[#f0fdfa]',
  },
  border: {
    dark: 'border-[#14b8a6]/10',
    light: 'border-[#14b8a6]/15',
  },
  borderStrong: {
    dark: 'border-[#14b8a6]/30',
    light: 'border-[#14b8a6]/30',
  },
  bgSubtle: {
    dark: 'bg-[#0c0c0c]',
    light: 'bg-[#f0fdfa]',
  },
  bgInput: {
    dark: 'bg-[#0c0c0c] border-gray-700 text-white',
    light: 'bg-gray-50 border-gray-300 text-gray-900',
  },
  hoverBg: {
    dark: 'hover:bg-white/5',
    light: 'hover:bg-[#f0fdfa]',
  },
  success: {
    dark: '#22c55e',
    light: '#059669',
  },
  successBg: {
    dark: 'bg-[#22c55e]/10',
    light: 'bg-[#10b981]/10',
  },
  accent: {
    dark: '#4a90d9',
    light: '#0d9488',
  },
  accentBg: {
    dark: 'bg-[#4a90d9]/20 text-[#6bb5ff]',
    light: 'bg-[#14b8a6]/15 text-[#0d9488]',
  },
};

export function getThemeClasses(isDark: boolean) {
  return {
    textPrimary: isDark ? 'text-white' : 'text-[#134e4a]',
    textSecondary: isDark ? 'text-gray-400' : 'text-[#0f766e]/70',
    textMuted: isDark ? 'text-gray-500' : 'text-[#0f766e]/50',
    textAccent: isDark ? 'text-[#14b8a6]' : 'text-[#0d9488]',
    card: isDark
      ? 'bg-[#161616] border-[#14b8a6]/10'
      : 'bg-white border-[#14b8a6]/15',
    cardGradient: isDark
      ? 'bg-gradient-to-b from-[#161616] to-[#1a1a1a]'
      : 'bg-gradient-to-b from-white to-[#f0fdfa]',
    cardHorizontal: isDark
      ? 'bg-gradient-to-l from-[#161616] to-[#1a1a1a]'
      : 'bg-gradient-to-l from-white to-[#f0fdfa]',
    input: isDark
      ? 'bg-[#0c0c0c] border-gray-700 text-white focus:border-[#14b8a6]'
      : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-[#14b8a6]',
    buttonPrimary: isDark
      ? 'bg-gradient-to-l from-[#14b8a6] to-[#2dd4bf] text-[#0c0c0c]'
      : 'bg-gradient-to-l from-[#14b8a6] to-[#0d9488] text-white',
    buttonSecondary: isDark
      ? 'bg-gray-700 text-white hover:bg-gray-600'
      : 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    border: isDark ? 'border-[#14b8a6]/10' : 'border-[#14b8a6]/15',
    borderStrong: isDark ? 'border-[#14b8a6]/30' : 'border-[#14b8a6]/30',
    badge: isDark
      ? 'bg-[#4a90d9]/20 text-[#6bb5ff]'
      : 'bg-[#14b8a6]/15 text-[#0d9488]',
    success: isDark
      ? 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20'
      : 'bg-[#10b981]/10 text-[#059669] border-[#10b981]/20',
    error: isDark
      ? 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30'
      : 'bg-red-50 text-red-700 border-red-200',
  };
}
