/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Use CSS variables as single source of truth
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        
        // Primary Colors - Trust & Professionalism (Blue to Purple Gradient)
        primary: {
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
        },
        // Secondary Colors - Warmth & Travel
        secondary: {
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
        },
        // Accent Colors - Energy & Action
        accent: {
          500: 'var(--color-accent-500)',
          600: 'var(--color-accent-600)',
        },
        // Feature Colors
        feature: {
          blue: 'var(--color-feature-blue)',
          green: 'var(--color-feature-green)',
          orange: 'var(--color-feature-orange)',
          teal: 'var(--color-feature-teal)',
        },
        // Surface Colors
        surface: {
          0: 'var(--color-surface-0)',
          50: 'var(--color-surface-50)',
          100: 'var(--color-surface-100)',
          200: 'var(--color-surface-200)',
          300: 'var(--color-surface-300)',
          600: 'var(--color-surface-600)',
          900: 'var(--color-surface-900)',
        },
        // Semantic Colors
        success: {
          100: 'var(--color-success-100)',
          500: 'var(--color-success-500)',
          800: 'var(--color-success-800)',
        },
        warning: {
          100: 'var(--color-warning-100)',
          500: 'var(--color-warning-500)',
          800: 'var(--color-warning-800)',
        },
        error: {
          100: 'var(--color-error-100)',
          500: 'var(--color-error-500)',
          800: 'var(--color-error-800)',
        },
        info: {
          100: 'var(--color-info-100)',
          500: 'var(--color-info-500)',
          800: 'var(--color-info-800)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        'xs': ['var(--font-size-xs)', { lineHeight: '1rem' }],
        'sm': ['var(--font-size-sm)', { lineHeight: '1.25rem' }],
        'base': ['var(--font-size-base)', { lineHeight: '1.5rem' }],
        'lg': ['var(--font-size-lg)', { lineHeight: '1.75rem' }],
        'xl': ['var(--font-size-xl)', { lineHeight: '1.75rem' }],
        '2xl': ['var(--font-size-2xl)', { lineHeight: '2rem' }],
        '3xl': ['var(--font-size-3xl)', { lineHeight: '2.25rem' }],
        '4xl': ['var(--font-size-4xl)', { lineHeight: '2.5rem' }],
      },
      fontWeight: {
        light: 'var(--font-weight-light)',
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
      },
      spacing: {
        '1': 'var(--spacing-1)',
        '2': 'var(--spacing-2)',
        '3': 'var(--spacing-3)',
        '4': 'var(--spacing-4)',
        '6': 'var(--spacing-6)',
        '8': 'var(--spacing-8)',
        '12': 'var(--spacing-12)',
        '16': 'var(--spacing-16)',
      },
      borderRadius: {
        'sm': 'var(--radius)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        'full': 'var(--radius-full)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-feature-blue': 'var(--gradient-feature-blue)',
        'gradient-feature-green': 'var(--gradient-feature-green)',
        'gradient-feature-orange': 'var(--gradient-feature-orange)',
        'gradient-feature-teal': 'var(--gradient-feature-teal)',
      },
      transitionDuration: {
        '75': 'var(--duration-75)',
        '100': 'var(--duration-100)',
        '200': 'var(--duration-200)',
        '300': 'var(--duration-300)',
        '500': 'var(--duration-500)',
        '700': 'var(--duration-700)',
        '1000': 'var(--duration-1000)',
      },
      transitionTimingFunction: {
        'linear': 'var(--ease-linear)',
        'in': 'var(--ease-in)',
        'out': 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
      },
      screens: {
        'sm': 'var(--breakpoint-sm)',
        'md': 'var(--breakpoint-md)',
        'lg': 'var(--breakpoint-lg)',
        'xl': 'var(--breakpoint-xl)',
        '2xl': 'var(--breakpoint-2xl)',
      },
    },
  },
  plugins: [],
} 