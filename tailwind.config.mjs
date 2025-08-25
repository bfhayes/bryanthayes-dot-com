/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'space-cadet': {
          DEFAULT: '#22223b',
          100: '#07070c',
          200: '#0d0d17',
          300: '#141423',
          400: '#1b1b2f',
          500: '#22223b',
          600: '#40406f',
          700: '#6060a3',
          800: '#9595c2',
          900: '#cacae0'
        },
        'ultra-violet': {
          DEFAULT: '#4a4e69',
          100: '#0f1015',
          200: '#1e1f2a',
          300: '#2c2f3f',
          400: '#3b3e54',
          500: '#4a4e69',
          600: '#666b8f',
          700: '#8b8fac',
          800: '#b1b4c8',
          900: '#d8dae3'
        },
        'rose-quartz': {
          DEFAULT: '#9a8c98',
          100: '#1f1c1f',
          200: '#3f383e',
          300: '#5e535c',
          400: '#7d6f7b',
          500: '#9a8c98',
          600: '#aea4ad',
          700: '#c3bbc1',
          800: '#d7d2d6',
          900: '#ebe8ea'
        },
        'pale-dogwood': {
          DEFAULT: '#c9ada7',
          100: '#2e1f1c',
          200: '#5b3e38',
          300: '#895d54',
          400: '#ad8279',
          500: '#c9ada7',
          600: '#d4bdb8',
          700: '#dececa',
          800: '#e9dedc',
          900: '#f4efed'
        },
        'isabelline': {
          DEFAULT: '#f2e9e4',
          100: '#3f2a1e',
          200: '#7f543d',
          300: '#b58165',
          400: '#d3b5a4',
          500: '#f2e9e4',
          600: '#f4ede9',
          700: '#f7f1ee',
          800: '#faf6f4',
          900: '#fcfaf9'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Crimson Text', 'Georgia', 'serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}