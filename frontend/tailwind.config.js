/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep black / navy backgrounds
        base: {
          950: '#04060d',
          900: '#070b16',
          850: '#0a0f1d',
          800: '#0d1426',
          750: '#111a33',
        },
        // Electric blue / cyan accents
        accent: {
          50: '#e6fbff',
          100: '#c2f3ff',
          200: '#8ae8ff',
          300: '#45d6ff',
          400: '#1bc4f5',
          500: '#08a6e0',
          600: '#0386c4',
          700: '#066a9e',
          800: '#0b5880',
          900: '#11486a',
        },
        success: {
          400: '#34e0a1',
          500: '#16c784',
          600: '#0fa56b',
        },
        warning: {
          400: '#ffce45',
          500: '#ffb020',
        },
        danger: {
          400: '#ff6b6b',
          500: '#f43f5e',
          600: '#e11d48',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(2, 8, 20, 0.55)',
        glow: '0 0 24px 0 rgba(27, 196, 245, 0.35)',
        'glow-sm': '0 0 12px 0 rgba(27, 196, 245, 0.25)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(27,196,245,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(27,196,245,0.04) 1px, transparent 1px)',
        'radial-glow':
          'radial-gradient(circle at 50% 0%, rgba(27,196,245,0.12), transparent 60%)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 16px 0 rgba(27,196,245,0.2)' },
          '50%': { boxShadow: '0 0 28px 0 rgba(27,196,245,0.45)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'scale-in': 'scale-in 0.25s ease-out',
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
