// colors.js - Color Theme Configuration
// Based on your UI design with purple/pink accents

export const colors = {
  // Primary colors (Purple/Pink theme)
  primary: {
    DEFAULT: '#5B4FC6', // Purple from the button
    light: '#7B6FE6',
    dark: '#4A3FB5',
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },

  // Secondary colors (Pink accents)
  secondary: {
    DEFAULT: '#EC4899',
    light: '#F472B6',
    dark: '#DB2777',
    50: '#FDF2F8',
    100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F9A8D4',
    400: '#F472B6',
    500: '#EC4899',
    600: '#DB2777',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843',
  },

  // Accent colors (Lighter purple/pink)
  accent: {
    DEFAULT: '#A78BFA',
    light: '#C4B5FD',
    dark: '#8B5CF6',
  },

  // Success (Green)
  success: {
    DEFAULT: '#10B981',
    light: '#34D399',
    dark: '#059669',
  },

  // Warning (Amber)
  warning: {
    DEFAULT: '#F59E0B',
    light: '#FCD34D',
    dark: '#D97706',
  },

  // Destructive/Error (Red)
  destructive: {
    DEFAULT: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
  },

  // Background colors
  background: {
    DEFAULT: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
  },

  // Foreground/Text colors
  foreground: {
    DEFAULT: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
  },

  // Border colors
  border: {
    DEFAULT: '#E5E7EB',
    light: '#F3F4F6',
    dark: '#D1D5DB',
  },

  // Card/Surface colors
  card: {
    DEFAULT: '#FFFFFF',
    hover: '#F9FAFB',
  },

  // Muted colors
  muted: {
    DEFAULT: '#F3F4F6',
    foreground: '#6B7280',
  },

  // Input colors
  input: {
    DEFAULT: '#E5E7EB',
    focus: '#5B4FC6',
  },
};

// Utility function to get Tailwind-compatible color classes
export const getColorClass = (color, shade = 'DEFAULT', type = 'bg') => {
  const colorMap = {
    primary: colors.primary[shade],
    secondary: colors.secondary[shade],
    accent: colors.accent[shade],
    success: colors.success[shade],
    warning: colors.warning[shade],
    destructive: colors.destructive[shade],
  };

  return colorMap[color] || colors.primary.DEFAULT;
};

export default colors;