import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | REHVO',
  description: 'Create your REHVO account using Google or email.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
