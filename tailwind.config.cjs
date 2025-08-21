/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef7f0',
          100: '#feeee0',
          200: '#fddcc1',
          300: '#fbc397',
          400: '#f8a06b',
          500: '#CB997E', // Primary brand color
          600: '#b8825a',
          700: '#6B705C', // Button/link color
          800: '#5a5f4e',
          900: '#4a4f42',
          bg: '#FFE8D6', // Subtle section backgrounds
        },
        neutral: {
          50: '#f8f8f6',
          100: '#f0f0ec',
          200: '#e2e2db',
          300: '#d1d1c5',
          400: '#B7B7A4',
          500: '#A5A58D',
          600: '#93937a',
          700: '#6B705C',
          800: '#58604e',
          900: '#484f41',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#4a4f42',
            a: {
              color: '#6B705C',
              '&:hover': {
                color: '#5a5f4e',
              },
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};