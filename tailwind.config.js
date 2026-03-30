/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f1',
          100: '#dce8e2',
          200: '#b8d1c5',
          300: '#7ab3a0',
          400: '#52B788',
          500: '#2D6A4F',
          600: '#246347',
          700: '#1d523b',
          800: '#1a4539',
          900: '#0f2818',
        },
        secondary: '#52B788',
        danger: '#E63946',
        warning: '#F4A261',
        success: '#06D6A0',
        background: '#F8F9FA',
        surface: '#FFFFFF',
        'surface-light': '#F5F5F5',
      },
      fontFamily: {
        'inter': ['var(--font-inter)', 'sans-serif'],
        'cairo': ['var(--font-cairo)', 'sans-serif'],
      },
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '88': '22rem',
        '96': '24rem',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
