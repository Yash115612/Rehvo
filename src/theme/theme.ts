export const colors = {
  // PRIMARY INK
  ink: '#17151F',
  // WARM IVORY
  warmIvory: '#F7F5F0',
  // SIGNATURE VIOLET
  signatureViolet: '#6C4DFF',
  // SOFT VIOLET
  softViolet: '#EEE9FF',
  // CORAL
  coral: '#FF6B4A',
  // SOFT CORAL
  softCoral: '#FFF0EB',
  // SUCCESS GREEN
  successGreen: '#32B768',
  // SOFT GREEN
  softGreen: '#EAF8F0',
  // WHITE
  white: '#FFFFFF',
  // NEUTRALS
  gray100: '#F0EEE9',
  gray200: '#E4E2DD',
  gray300: '#C9C5CC',
  gray500: '#86828F',
  gray700: '#48464B',
  gray800: '#2C2A33',
} as const;

export const radii = {
  xlarge: '32px', // Large visual cards (24-32px)
  large: '24px',  // Medium cards (18-24px)
  medium: '18px', // Inputs & Buttons (16-18px)
  small: '12px',
  pill: '9999px',
} as const;

export const shadows = {
  subtle: '0 4px 20px rgba(23, 21, 31, 0.05)',
  medium: '0 8px 30px rgba(23, 21, 31, 0.08)',
  elevated: '0 16px 40px rgba(108, 77, 255, 0.12)',
} as const;
