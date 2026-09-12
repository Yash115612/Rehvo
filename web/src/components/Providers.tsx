'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { HeroThemeProvider } from '@/components/v10/HeroThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <HeroThemeProvider>{children}</HeroThemeProvider>
    </AuthProvider>
  );
}
