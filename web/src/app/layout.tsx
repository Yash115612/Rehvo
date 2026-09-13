import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import '@/styles/theme.css';
import { Navbar } from '@/components/v10/Navbar';
import { Footer } from '@/components/v10/Footer';
import { Providers } from '@/components/Providers';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/schema';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ServiceWorkerRegister } from '@/components/common/ServiceWorkerRegister';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0E8F73',
};

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.in';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'REHVO — Verified Rental Marketplace in India | Direct Owners & Zero Brokerage',
    template: '%s | REHVO',
  },
  description:
    'Find verified rental homes, flatmates, PGs, and commercial properties with AI concierge, 3D walkthroughs, verified title deeds, and zero brokerage across Mumbai, Pune, Bangalore & India.',
  keywords: [
    'rental properties mumbai',
    'verified flats for rent',
    'flatmates mumbai',
    'pg in andheri west',
    'zero brokerage apartments',
    'commercial office space rent',
    'direct owner rentals',
    'rehvo',
  ],
  authors: [{ name: 'REHVO Technologies', url: BASE_URL }],
  creator: 'REHVO',
  publisher: 'REHVO',
  applicationName: 'REHVO',
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32' },
      { url: '/rehvo-logo.png', sizes: '192x192' },
    ],
    apple: [
      { url: '/rehvo-logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-IN': BASE_URL,
      'x-default': BASE_URL,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-rehvo-production',
    yandex: 'yandex-verification-token',
    other: {
      'msvalidate.01': 'msvalidate-token-rehvo',
    },
  },
  openGraph: {
    title: "REHVO — India's Verified Rental Marketplace",
    description:
      'Discover verified properties from direct homeowners, trusted brokers, and developers with AI-powered search, maps, and instant chat.',
    url: BASE_URL,
    siteName: 'REHVO',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: `${BASE_URL}/api/og?title=India%27s%20Verified%20Rental%20Marketplace&subtitle=Direct%20Owners%20%E2%80%A2%20Zero%20Brokerage%20%E2%80%A2%20AI%20Concierge`,
        width: 1200,
        height: 630,
        alt: 'REHVO — Verified Rental Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "REHVO — India's Verified Rental Marketplace",
    description:
      'Verified rental apartments, flatmates, and PGs with AI concierge and 100% verified deeds in Mumbai.',
    creator: '@rehvoapp',
    site: '@rehvoapp',
    images: [
      `${BASE_URL}/api/og?title=India%27s%20Verified%20Rental%20Marketplace&subtitle=Direct%20Owners%20%E2%80%A2%20Zero%20Brokerage`,
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

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
        {/* Core Global Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-[#F8FAFB] text-[#031B2A] selection:bg-[#0F766E] selection:text-white antialiased overflow-x-clip">
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {clarityId && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `}
          </Script>
        )}

        <ServiceWorkerRegister />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0E8F73] focus:text-white focus:rounded-xl focus:shadow-2xl focus:outline-none font-semibold text-sm"
        >
          Skip to main content
        </a>
        <Providers>
          <ErrorBoundary>
            <Navbar />
            <main id="main-content" className="flex-1 w-full max-w-full overflow-x-clip" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
