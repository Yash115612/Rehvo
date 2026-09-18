import { Metadata } from 'next';
import { constructSeoMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = constructSeoMetadata({
  title: 'Contact REHVO — 24/7 Renter & Owner Support',
  description:
    'Contact the REHVO support team for rental inquiries, listing verifications, flatmate support, and technical assistance.',
  canonicalUrl: 'https://rehvo.in/contact',
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
