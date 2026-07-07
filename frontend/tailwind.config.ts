import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eaf2fc',
          100: '#cde2fb',
          200: '#9ec5f4',
          300: '#6da7ec',
          400: '#3987e5',
          500: '#2a78d6',
          600: '#256abf',
          700: '#184f95',
          800: '#104281',
          900: '#0d366b',
        },
        aqua: '#1baf7a',
        violet: '#4a3aa7',
        categred: '#e34948',
        ink: {
          primary: '#0b0b0b',
          secondary: '#52514e',
          muted: '#898781',
        },
        surface: {
          DEFAULT: '#fcfcfb',
          plane: '#f9f9f7',
        },
        status: {
          good: '#0ca30c',
          warning: '#fab219',
          serious: '#ec835a',
          critical: '#d03b3b',
        },
        line: {
          hairline: '#e1e0d9',
          baseline: '#c3c2b7',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,11,11,0.06), 0 1px 1px rgba(11,11,11,0.04)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
};

export default config;
