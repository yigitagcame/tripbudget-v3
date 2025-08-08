/**
 * Design Tokens - Single Source of Truth
 * 
 * This file contains all design tokens used throughout the application.
 * All colors, spacing, typography, and other design values should be referenced from here.
 */

// Color System
export const colors = {
  // Base colors
  background: '#ffffff',
  foreground: '#111827',
  
  // Primary Colors - Trust & Professionalism (Blue to Purple Gradient)
  primary: {
    500: '#2563EB', // Blue-600
    600: '#7C3AED', // Purple-600
    700: '#5B21B6', // Purple-700
  },
  
  // Secondary Colors - Warmth & Travel
  secondary: {
    500: '#E5C07B',
    600: '#CFA76E',
  },
  
  // Accent Colors - Energy & Action
  accent: {
    500: '#F97316',
    600: '#DB6414',
  },
  
  // Feature Colors
  feature: {
    blue: '#3B82F6',    // Blue-500
    green: '#10B981',   // Emerald-500
    orange: '#F59E0B',  // Amber-500
    teal: '#14B8A6',    // Teal-500
  },
  
  // Surface Colors
  surface: {
    0: '#FFFFFF',
    50: '#F9FAFB',      // gray-50
    100: '#F3F4F6',     // gray-100
    200: '#E5E7EB',     // gray-200
    300: '#D1D5DB',     // gray-300
    600: '#6B7280',     // gray-500
    900: '#111827',     // gray-900
  },
  
  // Semantic Colors
  success: {
    100: '#D1FAE5',
    500: '#10B981',
    800: '#065F46',
  },
  warning: {
    100: '#FEF3C7',
    500: '#F59E0B',
    800: '#92400E',
  },
  error: {
    100: '#FEE2E2',
    500: '#EF4444',
    800: '#991B1B',
  },
  info: {
    100: '#DBEAFE',
    500: '#3B82F6',
    800: '#1E40AF',
  },
} as const;

// Typography
export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Spacing Scale
export const spacing = {
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
} as const;

// Border Radius
export const borderRadius = {
  sm: '0.25rem',   // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  full: '9999px',
} as const;

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

// Animation
export const animation = {
  duration: {
    75: '75ms',
    100: '100ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Gradients
export const gradients = {
  primary: `linear-gradient(to right, ${colors.primary[500]}, ${colors.primary[600]})`,
  featureBlue: `linear-gradient(to right, ${colors.feature.blue}, #1D4ED8)`,
  featureGreen: `linear-gradient(to right, ${colors.feature.green}, #059669)`,
  featureOrange: `linear-gradient(to right, ${colors.feature.orange}, #D97706)`,
  featureTeal: `linear-gradient(to right, ${colors.feature.teal}, #0D9488)`,
} as const;

// Z-Index Scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Design System Export
export const designSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation,
  breakpoints,
  gradients,
  zIndex,
} as const;

export default designSystem; 