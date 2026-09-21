import { Metadata } from 'next';
import { constructSeoMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = constructSeoMetadata({
  title: 'Help Center & Support FAQs',
  description:
    'Find answers to common questions about booking visits, verified title deeds, Zero Commission rentals, and direct owner chat on REHVO.',
  canonicalUrl: 'https://rehvo.in/help',
});

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
