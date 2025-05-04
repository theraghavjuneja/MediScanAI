/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef5ff',
          100: '#d9e8ff',
          200: '#bcdbff',
          300: '#8fc5ff',
          400: '#5aa5ff',
          500: '#3B82F6', // Primary blue
          600: '#2565eb',
          700: '#1c4fd8',
          800: '#1c42af',
          900: '#1d3a8a',
        },
        secondary: {
          50: '#edfcf9',
          100: '#d4f7f1',
          200: '#aeefe4',
          300: '#76e1d2',
          400: '#39c9b9',
          500: '#14B8A6', // Secondary teal
          600: '#0d8f83',
          700: '#0e736a',
          800: '#115c55',
          900: '#124b47',
        },
        accent: {
          50: '#fff8ed',
          100: '#ffefd3',
          200: '#ffdca6',
          300: '#ffc26d',
          400: '#fd9c33',
          500: '#F97316', // Accent orange
          600: '#ea4f0e',
          700: '#c13a0e',
          800: '#9a3013',
          900: '#7d2b13',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#783c12',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};