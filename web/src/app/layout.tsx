import React from 'react';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { RehvoHeader } from '@/components/home/RehvoHeader';
import { RehvoFooter } from '@/components/home/RehvoFooter';
import { AuthProvider } from '@/lib/auth/AuthContext';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.com'),
  title: {
    default: 'REHVO | Zero-Brokerage Flats & Flatmates in Mumbai',
    template: '%s | REHVO',
  },
  description:
    'Discover verified 1, 2, 3 BHK flats, private rooms, PGs & flatmates for rent in Mumbai with zero brokerage. Direct owner chat and scheduled visits on REHVO.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className={`${plusJakarta.className} min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-orange-500 selection:text-white antialiased`}>
        <AuthProvider>
          <RehvoHeader />
          <main className="flex-1">{children}</main>
          <RehvoFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
