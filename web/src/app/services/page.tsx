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
            Move-in essentials, financial freedom, digital tenancy agreements, and premium home maintenance across Mumbai.
          </p>
        </div>

        {/* Flagship Fintech & Compliance Solutions */}
        <div className="mb-16 space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#031B2A] tracking-tight">
              REHVO Financial &amp; Rental Ecosystem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Zero Deposit */}
            <div
              id="zero-deposit"
              className="scroll-mt-24 rounded-[28px] p-6 sm:p-7 bg-gradient-to-br from-[#0F766E]/5 to-[#10B981]/10 border border-[#0F766E]/20 shadow-card flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E] text-[11px] font-black uppercase tracking-wider">
                  <span>Zero Deposit Pass</span>
                </div>
                <h3 className="text-lg font-black text-[#031B2A]">Zero Cash Deposit</h3>
                <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                  Move into verified rental homes without locking in 6 to 10 months of heavy cash deposit. Low monthly guarantee fee backed by institutional surety.
                </p>
                <div className="pt-2 space-y-1 text-xs font-bold text-[#031B2A]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>0 upfront security lock-in</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Instant eligibility check</span>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <Link
                  href="/download"
                  className="h-11 w-full rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-black flex items-center justify-center gap-2 transition"
                >
                  <span>Apply on Mobile App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Rent Pay */}
            <div
              id="rent-pay"
              className="scroll-mt-24 rounded-[28px] p-6 sm:p-7 bg-gradient-to-br from-[#0284C7]/5 to-[#38BDF8]/10 border border-[#0284C7]/20 shadow-card flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0284C7] text-[11px] font-black uppercase tracking-wider">
                  <span>1% R-Cash Rewards</span>
                </div>
                <h3 className="text-lg font-black text-[#031B2A]">Pay Rent Online</h3>
                <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                  Pay your house rent using Credit Cards, UPI, or Net Banking. Enjoy 45-day interest-free credit cycles and earn guaranteed 1% R-Cash on every transfer.
                </p>
                <div className="pt-2 space-y-1 text-xs font-bold text-[#031B2A]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>All major credit cards accepted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Instant landlord bank credit</span>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <Link
                  href="/download"
                  className="h-11 w-full rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-black flex items-center justify-center gap-2 transition"
                >
                  <span>Pay Rent via App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* KYC Verification */}
            <div
              id="kyc"
              className="scroll-mt-24 rounded-[28px] p-6 sm:p-7 bg-gradient-to-br from-[#8B5CF6]/5 to-[#A78BFA]/10 border border-[#8B5CF6]/20 shadow-card flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3E8FF] text-[#7C3AED] text-[11px] font-black uppercase tracking-wider">
                  <span>100% Govt Compliant</span>
                </div>
                <h3 className="text-lg font-black text-[#031B2A]">KYC &amp; Digital Lease</h3>
                <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                  Doorstep Aadhaar e-sign, digital stamp duty, and Mumbai Police tenant intimation. Zero queues, legally enforceable rental contracts in 15 minutes.
                </p>
                <div className="pt-2 space-y-1 text-xs font-bold text-[#031B2A]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Aadhaar OTP e-signature</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Digital Police NOC acknowledgment</span>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <Link
                  href="/contact"
                  className="h-11 w-full rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-black flex items-center justify-center gap-2 transition"
                >
                  <span>Request Digital Agreement</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Section Title for Home Maintenance */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#031B2A] tracking-tight">
            Move-In &amp; Home Maintenance Catalog
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] font-medium">
            On-demand verified professionals for deep cleaning, shifting, painting, and repairs.
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
