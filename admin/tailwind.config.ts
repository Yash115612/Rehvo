import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#171522',
          primary: '#6C4DFF',
          'primary-hover': '#5B3EE0',
          'primary-light': '#F0ECFF',
          canvas: '#F8F7F4',
          surface: '#FFFFFF',
          border: '#E8E5EC',
          'border-light': '#F3F0EA',
          muted: '#777482',
          success: '#32B768',
          'success-light': '#EAF8F0',
          danger: '#E5484D',
          'danger-light': '#FEE2E2',
          warning: '#F59E0B',
          'warning-light': '#FEF3C7',
          info: '#0EA5E9',
          'info-light': '#E0F2FE',
        },
        background: '#F8F7F4',
        foreground: '#171522',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(23, 21, 34, 0.04), 0 1px 2px -1px rgba(23, 21, 34, 0.02)',
        'card-hover': '0 4px 6px -1px rgba(23, 21, 34, 0.08), 0 2px 4px -2px rgba(23, 21, 34, 0.04)',
        popover: '0 10px 25px -5px rgba(23, 21, 34, 0.1), 0 8px 10px -6px rgba(23, 21, 34, 0.05)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
