/**
 * Design System Utilities
 * 
 * Helper functions and utilities for working with the design system
 */

import { colors, typography, spacing, borderRadius, shadows, animation, breakpoints, gradients, zIndex } from './design-tokens';

/**
 * Combine class names with conditional logic
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Type definitions for better TypeScript support
export type ColorToken = keyof typeof colors;
export type PrimaryColorToken = keyof typeof colors.primary;
export type SurfaceColorToken = keyof typeof colors.surface;
export type SemanticColorToken = keyof typeof colors.success | keyof typeof colors.warning | keyof typeof colors.error | keyof typeof colors.info;
export type SpacingToken = keyof typeof spacing;
export type BorderRadiusToken = keyof typeof borderRadius;
export type ShadowToken = keyof typeof shadows;
export type AnimationDurationToken = keyof typeof animation.duration;
export type AnimationEasingToken = keyof typeof animation.easing;
export type BreakpointToken = keyof typeof breakpoints;
export type ZIndexToken = keyof typeof zIndex;

/**
 * Get a color value from the design system
 */
export function getColor(category: string, shade: string): string {
  if (category === 'base') {
    return (colors as any)[shade] || '#000000';
  }
  return (colors as any)[category]?.[shade] || '#000000';
}

/**
 * Get a spacing value from the design system
 */
export function getSpacing(token: SpacingToken): string {
  return spacing[token];
}

/**
 * Get a border radius value from the design system
 */
export function getBorderRadius(token: BorderRadiusToken): string {
  return borderRadius[token];
}

/**
 * Get a shadow value from the design system
 */
export function getShadow(token: ShadowToken): string {
  return shadows[token];
}

/**
 * Get an animation duration value from the design system
 */
export function getAnimationDuration(token: AnimationDurationToken): string {
  return animation.duration[token];
}

/**
 * Get an animation easing value from the design system
 */
export function getAnimationEasing(token: AnimationEasingToken): string {
  return animation.easing[token];
}

/**
 * Get a breakpoint value from the design system
 */
export function getBreakpoint(token: BreakpointToken): string {
  return breakpoints[token];
}

/**
 * Get a z-index value from the design system
 */
export function getZIndex(token: ZIndexToken): number | string {
  return zIndex[token];
}

/**
 * Get a gradient value from the design system
 */
export function getGradient(token: keyof typeof gradients): string {
  return gradients[token];
}

/**
 * Generate Tailwind classes for common component patterns
 */
export const componentClasses = {
  // Button variants
  button: {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200',
    secondary: 'bg-surface-100 text-surface-900 font-semibold px-6 py-3 rounded-xl hover:bg-surface-200 transition-colors duration-200',
    outline: 'border-2 border-primary-500 text-primary-500 font-semibold px-6 py-3 rounded-xl hover:bg-primary-500 hover:text-white transition-all duration-200',
  },
  
  // Card variants
  card: {
    default: 'bg-white rounded-2xl p-8 shadow-lg border border-surface-200',
    elevated: 'bg-white rounded-2xl p-8 shadow-xl border border-surface-200 hover:shadow-2xl transition-shadow duration-300',
    glass: 'bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20',
  },
  
  // Input variants
  input: {
    default: 'w-full px-4 py-3 rounded-lg border border-surface-300 bg-white text-surface-900 placeholder-surface-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all',
    error: 'w-full px-4 py-3 rounded-lg border border-error-500 bg-white text-surface-900 placeholder-surface-600 focus:border-error-500 focus:ring-2 focus:ring-error-200 transition-all',
  },
  
  // Text variants
  text: {
    heading: {
      h1: 'text-4xl sm:text-5xl lg:text-6xl font-bold text-surface-900',
      h2: 'text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900',
      h3: 'text-2xl font-bold text-surface-900',
      h4: 'text-xl font-semibold text-surface-900',
    },
    body: {
      large: 'text-lg text-surface-600',
      default: 'text-base text-surface-600',
      small: 'text-sm text-surface-600',
    },
    gradient: 'bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent',
  },
  
  // Layout variants
  layout: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-20',
    grid: {
      '2': 'grid grid-cols-1 md:grid-cols-2 gap-8',
      '3': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
      '4': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8',
    },
  },
} as const;

/**
 * Generate responsive classes based on breakpoints
 */
export function responsive(classes: Record<BreakpointToken, string>): string {
  return Object.entries(classes)
    .map(([breakpoint, className]) => {
      if (breakpoint === 'sm') return className;
      return `${breakpoint}:${className}`;
    })
    .join(' ');
}

/**
 * Generate hover and focus states
 */
export function interactive(baseClass: string, options?: {
  hover?: string;
  focus?: string;
  active?: string;
}): string {
  const classes = [baseClass];
  
  if (options?.hover) classes.push(`hover:${options.hover}`);
  if (options?.focus) classes.push(`focus:${options.focus}`);
  if (options?.active) classes.push(`active:${options.active}`);
  
  return classes.join(' ');
}

/**
 * Generate animation classes
 */
export function animate(
  animation: string,
  duration: AnimationDurationToken = '300' as unknown as AnimationDurationToken,
  easing: AnimationEasingToken = 'out'
): string {
  return `transition-${animation} duration-${duration} ease-${easing}`;
}

/**
 * Generate focus ring classes
 */
export function focusRing(color: 'primary' | 'error' | 'warning' | 'success' = 'primary'): string {
  const colorMap = {
    primary: 'ring-primary-500',
    error: 'ring-error-500',
    warning: 'ring-warning-500',
    success: 'ring-success-500',
  };
  
  return `focus:outline-none focus:ring-2 ${colorMap[color]} focus:ring-offset-2`;
}

export default {
  getColor,
  getSpacing,
  getBorderRadius,
  getShadow,
  getAnimationDuration,
  getAnimationEasing,
  getBreakpoint,
  getZIndex,
  getGradient,
  componentClasses,
  responsive,
  interactive,
  animate,
  focusRing,
}; 