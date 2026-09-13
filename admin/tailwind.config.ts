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
          bg: '#050505',
          canvas: '#0A0A0C',
          surface: '#121215',
          'surface-card': '#16161A',
          'surface-hover': '#1F1F24',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-strong': 'rgba(255, 255, 255, 0.16)',
          emerald: '#0E8F73',
          'emerald-light': '#10B981',
          'emerald-hover': '#09705A',
          'emerald-glow': 'rgba(14, 143, 115, 0.18)',
          text: '#FFFFFF',
          'text-secondary': '#94A3B8',
          'text-muted': '#64748B',
          'text-dim': '#475569',
          success: '#10B981',
          danger: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
          purple: '#A855F7',
        },
        background: '#050505',
        foreground: '#FFFFFF',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 25px -5px rgba(14, 143, 115, 0.3)',
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 8px 30px -4px rgba(14, 143, 115, 0.15)',
        popover: '0 12px 30px -5px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
