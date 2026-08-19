import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { PublicNavbar } from '../components/public/PublicNavbar';
import { PublicFooter } from '../components/public/PublicFooter';

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
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900 selection:bg-purple-500 selection:text-white antialiased">
        <PublicNavbar />
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </body>
    </html>
  );
}
