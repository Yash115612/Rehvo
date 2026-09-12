import path from 'path';
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    path.join(__dirname, 'src/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, 'src/app/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, 'src/components/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, 'src/lib/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, 'src/styles/**/*.{js,ts,jsx,tsx,mdx,css}'),
    path.join(__dirname, 'app/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, 'components/**/*.{js,ts,jsx,tsx,mdx}'),
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rehvo: {
          bg: '#F8FAFB',
          background: '#F8FAFB',
          surface: '#FFFFFF',
          'surface-muted': '#F1F5F9',
          primary: '#031B2A',
          secondary: '#64748B',
          border: '#E2E8F0',
          'border-focus': '#CBD5E1',
          // Master Brand Accent (Emerald Luxury)
          accent: '#0F766E',
          'accent-hover': '#064E3B',
          'accent-soft': '#CCFBF1',
          emerald: '#0F766E',
          'emerald-700': '#0F766E',
          'emerald-900': '#064E3B',
          'emerald-dark': '#064E3B',
          mint: '#CCFBF1',
          navy: '#031B2A',
          gold: '#D4AF37',
          'gold-soft': '#FEF9C3',
          // Secondary Category Accents
          commercial: '#4263EB',
          'commercial-soft': '#EEF2FF',
          pg: '#D69E2E',
          'pg-soft': '#FEF9C3',
          flatmates: '#3C8D68',
          'flatmates-soft': '#EBF5F0',
          localities: '#4C7A86',
          'localities-soft': '#EDF6F8',
          // Status
          success: '#16A34A',
          'success-soft': '#ECFDF5',
        },
        background: '#F8FAFB',
        foreground: '#031B2A',
      },
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'var(--font-plus-jakarta)',
          'Inter',
          'Plus Jakarta Sans',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        inter: [
          'var(--font-inter)',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(3, 27, 42, 0.03)',
        xs: '0 1px 2px 0 rgba(3, 27, 42, 0.05)',
        card: '0 1px 3px 0 rgba(3, 27, 42, 0.04), 0 1px 2px -1px rgba(3, 27, 42, 0.02)',
        'card-hover': '0 8px 24px -4px rgba(3, 27, 42, 0.08), 0 4px 8px -2px rgba(3, 27, 42, 0.03)',
        popover: '0 12px 32px -4px rgba(3, 27, 42, 0.08), 0 6px 12px -3px rgba(3, 27, 42, 0.04)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
