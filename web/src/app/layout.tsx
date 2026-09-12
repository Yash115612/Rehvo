import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import '@/styles/theme.css';
import { Navbar } from '@/components/v10/Navbar';
import { Footer } from '@/components/v10/Footer';
import { Providers } from '@/components/Providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.in'),
  title: {
    default: 'REHVO — Verified Rental Marketplace in India',
    template: '%s | REHVO',
  },
  description:
    'Find verified rental homes, PGs, commercial properties, flatmates and trusted brokers with AI-powered search and neighbourhood insights.',
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    title: "REHVO — India's Verified Rental Marketplace",
    description: 'Discover verified properties from direct homeowners, trusted brokers, and developers with AI-powered search, maps, and instant chat.',
    url: 'https://rehvo.in',
    siteName: 'REHVO',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preload" href="/rehvo-logo.png" as="image" type="image/png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-[#F8FAFB] text-[#031B2A] selection:bg-[#0F766E] selection:text-white antialiased overflow-x-hidden">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
