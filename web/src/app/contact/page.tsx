import React from 'react';
import { Metadata } from 'next';
import { Mail, Phone, MapPin, ShieldCheck, HelpCircle } from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateOrganizationSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { AppDownloadBanner } from '@/components/public/AppDownloadBanner';

export const metadata: Metadata = constructSeoMetadata({
  title: 'Contact & Support | REHVO Mumbai',
  description:
    'Need help with your rental search, listing verification, or scheduled visits? Get in touch with the REHVO team in Mumbai.',
  canonicalUrl: 'https://rehvo.com/contact',
});

export default function ContactPage() {
  const breadcrumbs = [{ name: 'Contact & Support', url: '/contact' }];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const orgSchema = generateOrganizationSchema();

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={orgSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={breadcrumbs} />

        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-stone-200 shadow-sm mt-4 mb-12 max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              We&apos;re Here to Help
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Contact REHVO Support
            </h1>
            <p className="text-sm text-stone-600 mt-2">
              Have questions about listing a property, verifying your identity, or reporting an issue? Reach out to our dedicated operations team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-stone-100">
            <div className="bg-stone-50 p-6 rounded-2xl text-center space-y-2">
              <Mail className="w-6 h-6 text-purple-600 mx-auto" />
              <h2 className="text-sm font-bold text-stone-900">Email Inquiries</h2>
              <p className="text-xs text-stone-500">support@rehvo.com</p>
              <p className="text-[11px] text-stone-400">Response within 24 hours</p>
            </div>

            <div className="bg-stone-50 p-6 rounded-2xl text-center space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto" />
              <h2 className="text-sm font-bold text-stone-900">Listing Verification</h2>
              <p className="text-xs text-stone-500">verify@rehvo.com</p>
              <p className="text-[11px] text-stone-400">For homeowners & hosts</p>
            </div>

            <div className="bg-stone-50 p-6 rounded-2xl text-center space-y-2">
              <MapPin className="w-6 h-6 text-blue-600 mx-auto" />
              <h2 className="text-sm font-bold text-stone-900">Headquarters</h2>
              <p className="text-xs text-stone-500">Mumbai, Maharashtra</p>
              <p className="text-[11px] text-stone-400">India</p>
            </div>
          </div>
        </div>

        <AppDownloadBanner />
      </div>
    </>
  );
}
