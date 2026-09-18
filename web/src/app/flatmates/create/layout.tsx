import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Flatmate Profile',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function FlatmatesCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
