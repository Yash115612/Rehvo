import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'List Your Property',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ListPropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
