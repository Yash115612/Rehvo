import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  Wrench,
  Truck,
  Paintbrush,
  ShieldAlert,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/public/Breadcrumb';

export const metadata: Metadata = constructSeoMetadata({
  title: 'Home Services & Move-In Solutions | REHVO Mumbai',
  description:
    'Book verified home cleaning, electrical repair, plumbing, painting, pest control, and packers & movers in Mumbai with upfront pricing.',
  canonicalUrl: 'https://rehvo.in/services',
});

const SERVICE_CATALOG = [
  {
    icon: Sparkles,
    title: 'Full Home Deep Cleaning',
    desc: 'Intensive scrubbing, degreasing of kitchen chimneys, bathroom descaling, and high-pressure steam sanitization.',
    price: 'From ₹1,499',
    features: ['Eco-friendly chemicals', 'Mechanized buffing', '3-4 hour turnaround'],
    color: '#0F766E',
    bg: '#CCFBF1',
  },
  {
    icon: Truck,
    title: 'Packers & Movers',
    desc: 'Stress-free intra-city home shifting across Mumbai, Navi Mumbai, and Thane with comprehensive transit insurance.',
    price: 'Free Quote',
    features: ['3-layer bubble packaging', 'Furniture assembly', 'Dedicated moving manager'],
    color: '#16A34A',
    bg: '#DCFCE7',
  },
  {
    icon: Zap,
    title: 'Electrical & AC Services',
    desc: 'Certified electricians for switchboard replacement, fan installation, wiring health audits, and split AC servicing.',
    price: 'From ₹299',
    features: ['Standardized rate card', '30-day post-service warranty', 'Verified technicians'],
    color: '#D97706',
    bg: '#FEF3C7',
  },
  {
    icon: Wrench,
    title: 'Plumbing & Water Solutions',
    desc: 'Rapid response for dripping taps, flush tank repairs, drain unblocking, and geyser installations.',
    price: 'From ₹299',
    features: ['Zero mess guarantee', 'Genuine spare parts', 'Available 7 days a week'],
    color: '#0284C7',
    bg: '#E0F2FE',
  },
  {
    icon: Paintbrush,
    title: 'Interior Painting & Waterproofing',
    desc: 'Dust-free express wall repainting using premium washable acrylic paints and seepage barrier coatings.',
    price: 'From ₹4,999',
    features: ['Laser wall measurements', 'Masking protection', 'Color consultation'],
    color: '#9333EA',
    bg: '#F3E8FF',
  },
  {
    icon: ShieldAlert,
    title: 'Herbal Pest Control',
    desc: '100% odorless herbal gel treatments targeting cockroaches, bedbugs, termites, and mosquitoes with long-term protection.',
    price: 'From ₹899',
    features: ['Child & pet safe', 'No kitchen evacuation', '90-day repeat guarantee'],
    color: '#E11D48',
    bg: '#FFE4E6',
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ name: 'Home Services', url: '/services' }]} />

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto my-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#CCFBF1] text-[#064E3B] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
            <span>VERIFIED SERVICE PARTNER NETWORK</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#031B2A] tracking-tight leading-tight">
            Essential Home Services, <br />
            Delivered with Perfection.
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] max-w-xl mx-auto font-medium">
            From move-in deep cleaning to insured packing and shifting — book background-verified service professionals with fixed pricing.
          </p>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SERVICE_CATALOG.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: srv.bg }}
                    >
                      <Icon className="w-6 h-6" style={{ color: srv.color }} />
                    </div>
                    <span className="text-xs font-black text-[#0F766E] bg-[#CCFBF1] px-3 py-1 rounded-full">
                      {srv.price}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-[#031B2A]">{srv.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                    {srv.desc}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                    {srv.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs font-bold text-[#031B2A]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4">
                  <Link
                    href="/download"
                    className="w-full h-11 rounded-full bg-[#F8FAFC] hover:bg-[#0F766E] text-[#031B2A] hover:text-white border border-[#E2E8F0] hover:border-[#0F766E] text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Book in REHVO App</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
