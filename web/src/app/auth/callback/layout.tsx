import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify Email | REHVO',
  description: 'Complete your REHVO account email verification.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
