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
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        rehvo: {
          // Core V2 Brand Tokens
          navy: '#001741',
          'navy-secondary': '#0B1F3A',
          'navy-muted': '#1E3A5F',
          orange: '#F97316',
          'orange-hover': '#EA580C',
          'orange-active': '#C2410C',
          'orange-soft': '#FFF7ED',
          'orange-border': '#FED7AA',

          // Surfaces & Backgrounds
          bg: '#FFFFFF',
          background: '#FFFFFF',
          surface: '#FFFFFF',
          'surface-subtle': '#F8FAFC',
          'surface-muted': '#F1F5F9',

          // Text & Borders
          primary: '#001741',
          body: '#334155',
          secondary: '#475569',
          muted: '#64748B',
          border: '#E2E8F0',
          'border-subtle': '#F1F5F9',
          'border-focus': '#CBD5E1',

          // Accent Aliases (preserving compatibility for inner routes)
          accent: '#F97316',
          'accent-hover': '#EA580C',
          'accent-soft': '#FFF7ED',

          // Semantic Status
          success: '#15803D',
          'success-soft': '#F0FDF4',
          warning: '#B45309',
          'warning-soft': '#FFFBEB',
          error: '#B91C1C',
          'error-soft': '#FEF2F2',
          info: '#0369A1',
          'info-soft': '#F0F9FF',

          // Legacy category tokens kept for un-rebuilt vertical pages
          emerald: '#0F766E',
          'emerald-700': '#0F766E',
          'emerald-900': '#064E3B',
          'emerald-dark': '#064E3B',
          mint: '#CCFBF1',
          gold: '#D4AF37',
          'gold-soft': '#FEF9C3',
          commercial: '#4263EB',
          'commercial-soft': '#EEF2FF',
          pg: '#D69E2E',
          'pg-soft': '#FEF9C3',
          flatmates: '#3C8D68',
          'flatmates-soft': '#EBF5F0',
          localities: '#4C7A86',
          'localities-soft': '#EDF6F8',
        },
        background: '#FFFFFF',
        foreground: '#001741',
      },
      fontFamily: {
        sans: [
          'var(--font-plus-jakarta)',
          'Plus Jakarta Sans',
          'var(--font-inter)',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        jakarta: [
          'var(--font-plus-jakarta)',
          'Plus Jakarta Sans',
          '-apple-system',
          'BlinkMacSystemFont',
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
      maxWidth: {
        container: '1280px',
      },
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem',
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 23, 65, 0.03)',
        xs: '0 1px 2px 0 rgba(0, 23, 65, 0.05)',
        card: '0 2px 6px -1px rgba(0, 23, 65, 0.06), 0 1px 2px -1px rgba(0, 23, 65, 0.04)',
        'card-hover': '0 12px 28px -6px rgba(0, 23, 65, 0.10), 0 4px 10px -3px rgba(0, 23, 65, 0.04)',
        popover: '0 16px 36px -8px rgba(0, 23, 65, 0.12), 0 4px 12px -4px rgba(0, 23, 65, 0.05)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
