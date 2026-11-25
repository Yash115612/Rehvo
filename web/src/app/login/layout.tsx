import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | REHVO',
  description: 'Sign into your REHVO account using Google or email.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
