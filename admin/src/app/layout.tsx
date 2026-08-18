import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'REHVO Control Panel | Operations & Admin',
  description: 'Enterprise Administrative Control Panel for REHVO Platform',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-brand-canvas text-brand-dark antialiased selection:bg-brand-primary-light selection:text-brand-primary">
        {children}
      </body>
    </html>
  );
}
