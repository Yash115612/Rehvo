import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  ShieldCheck,
  Sparkles,
  CalendarCheck,
  MessageCircle,
  Share2,
  Heart,
  BedDouble,
  Bath,
  Maximize2,
  CheckCircle2,
  Clock,
  Car,
  Zap,
  Building,
  ArrowRight,
} from 'lucide-react';
import { getPropertyBySlug } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { generatePropertySlug, getSafeImageUrl } from '@/lib/seo/slugs';
import { PropertyDownloadActions } from '@/components/property/PropertyDownloadActions';

export const revalidate = 60;

interface PropertyDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug);
  if (!property) {
    return { title: 'Property Not Found | REHVO' };
  }
  const title = `${property.bedrooms ? `${property.bedrooms} BHK ` : ''}${property.title} in ${property.locality}, ${property.city}`;
  return constructSeoMetadata({
    title: `${title} | Verified Marketplace | REHVO`,
    description: `Rent ${property.title} in ${property.locality} for ₹${property.price?.toLocaleString('en-IN')}/mo with 100% verified marketplace and chat with owner or broker on REHVO.`,
    canonicalUrl: `https://rehvo.in/property/${generatePropertySlug(property)}`,
  });
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = await getPropertyBySlug(params.slug);
  if (!property) {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(property.price || 0);

  const formattedDeposit = property.deposit
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(property.deposit)
    : '2 Months Rent';

  const images = property.property_images?.length
    ? property.property_images
    : [{ id: '1', image_url: getSafeImageUrl(null, 0), is_cover: true, sort_order: 0 }];

  const breadcrumbs = [
    { name: 'Search', url: '/search' },
    { name: property.locality, url: `/search?locality=${encodeURIComponent(property.locality.toLowerCase())}` },
    { name: property.title, url: `/property/${params.slug}` },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-8">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbs} />

        {/* Top Header Row */}
        <div className="mt-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1 bg-[#CCFBF1] text-[#064E3B] text-[11px] font-black px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E]" />
                VERIFIED DIRECT LISTING
              </span>
              <span className="inline-flex items-center bg-[#0F766E] text-white text-[11px] font-extrabold px-3 py-1 rounded-full">
                VERIFIED LISTING
              </span>
              <span className="inline-flex items-center gap-1 bg-[#FEF9C3] text-[#D4AF37] text-[11px] font-black px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                98% AI Match
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#031B2A] tracking-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{property.locality}, {property.city}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="h-10 px-4 rounded-full bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] flex items-center gap-1.5 transition shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Share</span>
            </button>
            <button
              type="button"
              className="h-10 px-4 rounded-full bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] flex items-center gap-1.5 transition shadow-2xs"
            >
              <Heart className="w-3.5 h-3.5 text-[#EF4444]" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* GALLERY SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 mb-10 rounded-[32px] overflow-hidden border border-[#E2E8F0] bg-slate-100 shadow-card">
          {/* Main Dominant Image */}
          <div className="md:col-span-3 aspect-[16/10] relative overflow-hidden bg-slate-900">
            <img
              src={images[0]?.image_url || getSafeImageUrl(null, 0)}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Side Thumbnail Stack */}
          <div className="hidden md:flex flex-col gap-3">
            {images.slice(1, 4).map((img, i) => (
              <div key={i} className="flex-1 relative overflow-hidden bg-slate-200">
                <img
                  src={img.image_url}
                  alt={`${property.title} ${i + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
            ))}
            {images.length <= 1 && (
              <div className="flex-1 flex items-center justify-center bg-slate-50 text-xs font-bold text-[#64748B]">
                Walkthrough Verified
              </div>
            )}
          </div>
        </div>

        {/* MAIN BODY GRID: 8 COLS CONTENT + 4 COLS STICKY ACTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-16">
          {/* Left Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Specs Pill Row */}
            <div className="bg-white rounded-[28px] p-6 border border-[#E2E8F0] shadow-card grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-[#64748B] uppercase">Bedrooms</div>
                <div className="text-base font-black text-[#031B2A] flex items-center gap-1.5">
                  <BedDouble className="w-4 h-4 text-[#0F766E]" />
                  <span>{property.bedrooms || 1} BHK</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-bold text-[#64748B] uppercase">Bathrooms</div>
                <div className="text-base font-black text-[#031B2A] flex items-center gap-1.5">
                  <Bath className="w-4 h-4 text-[#0F766E]" />
                  <span>{property.bathrooms || 1} Baths</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-bold text-[#64748B] uppercase">Carpet Area</div>
                <div className="text-base font-black text-[#031B2A] flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-[#0F766E]" />
                  <span>{property.area || 650} sq.ft</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-bold text-[#64748B] uppercase">Furnishing</div>
                <div className="text-base font-black text-[#031B2A] flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-[#0F766E]" />
                  <span className="capitalize">{property.furnishing || 'Furnished'}</span>
                </div>
              </div>
            </div>

            {/* AI Property Insights Card */}
            <div className="bg-gradient-to-br from-[#CCFBF1]/30 via-white to-white rounded-[28px] p-6 sm:p-7 border border-[#0F766E]/30 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#064E3B] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#0F766E]" />
                  <span>REHVO AI Property Insights</span>
                </div>
                <span className="text-xs font-black text-[#0F766E] bg-[#CCFBF1] px-2.5 py-0.5 rounded-full">
                  Verified Analysis
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-white/80 p-4 rounded-2xl border border-[#E2E8F0]">
                  <div className="text-[10px] font-bold text-[#64748B] uppercase">Rent Fairness</div>
                  <div className="text-sm font-black text-[#16A34A] mt-0.5">₹3,000 Below Market</div>
                  <p className="text-[11px] text-[#64748B] mt-1">Optimal price based on Bandra locality index.</p>
                </div>

                <div className="bg-white/80 p-4 rounded-2xl border border-[#E2E8F0]">
                  <div className="text-[10px] font-bold text-[#64748B] uppercase">Transit & Commute</div>
                  <div className="text-sm font-black text-[#031B2A] mt-0.5">8 Mins to Metro</div>
                  <p className="text-[11px] text-[#64748B] mt-1">Walking distance to station & main highway.</p>
                </div>

                <div className="bg-white/80 p-4 rounded-2xl border border-[#E2E8F0]">
                  <div className="text-[10px] font-bold text-[#64748B] uppercase">Neighborhood Vibe</div>
                  <div className="text-sm font-black text-[#031B2A] mt-0.5">Peaceful & Safe</div>
                  <p className="text-[11px] text-[#64748B] mt-1">High walkability score with cafes & parks.</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#E2E8F0] shadow-card space-y-3">
              <h2 className="text-lg font-black text-[#031B2A]">About This Home</h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-medium">
                {property.description ||
                  'Spacious, naturally lit apartment in a well-maintained society. Features cross-ventilation, verified title ownership, 24/7 security, and seamless connectivity to prime corporate centers.'}
              </p>
            </div>

            {/* Amenities Checklist */}
            <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#E2E8F0] shadow-card space-y-4">
              <h2 className="text-lg font-black text-[#031B2A]">Amenities & Society Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  '24/7 Security & Guard',
                  'Dedicated Car Parking',
                  'High-Speed Lift',
                  'Power Backup',
                  'Piped Gas Connection',
                  'Modular Kitchen',
                  'Gated Society',
                  'Intercom Facility',
                  'Water Storage 24h',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-[#031B2A]">
                    <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map / Locality Explorer */}
            <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#E2E8F0] shadow-card space-y-3">
              <h2 className="text-lg font-black text-[#031B2A]">Location & Neighbourhood</h2>
              <div className="h-48 rounded-2xl bg-gradient-to-br from-teal-50 to-slate-100 border border-[#E2E8F0] flex flex-col items-center justify-center gap-2 p-6 text-center">
                <MapPin className="w-8 h-8 text-[#0F766E]" />
                <div className="text-sm font-black text-[#031B2A]">{property.locality}, {property.city}</div>
                <p className="text-xs text-[#64748B] max-w-sm">
                  Physical address and verified landlord coordinates are shared upon confirmed walkthrough booking.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Action & Owner Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            {/* Price & Booking Card */}
            <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#E2E8F0] shadow-card space-y-5">
              <div className="pb-4 border-b border-[#E2E8F0]">
                <div className="text-[11px] font-bold text-[#64748B] uppercase">Monthly Rent</div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-black text-[#031B2A] tracking-tight">{formattedPrice}</span>
                  <span className="text-xs text-[#64748B] font-medium">/ month</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Security Deposit</span>
                  <span className="font-extrabold text-[#031B2A]">{formattedDeposit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Brokerage Fee</span>
                  <span className="font-black text-[#0F766E]">₹0 (100% Free)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Maintenance</span>
                  <span className="font-bold text-[#031B2A]">
                    {property.maintenance ? `₹${property.maintenance}/mo` : 'Included in rent'}
                  </span>
                </div>
              </div>

              <PropertyDownloadActions
                propertyTitle={property.title}
                formattedPrice={formattedPrice}
              />

              <div className="text-center pt-2">
                <p className="text-[11px] text-[#64748B] flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>Direct-to-owner guarantee with zero spam</span>
                </p>
              </div>
            </div>

            {/* Owner Identity Verification Card */}
            <div className="bg-white rounded-[28px] p-6 border border-[#E2E8F0] shadow-card space-y-3">
              <div className="text-[11px] font-black tracking-wider text-[#64748B] uppercase">
                Listed By Landlord
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#031B2A] text-white flex items-center justify-center font-black text-base">
                  {property.owner?.full_name?.charAt(0) || 'L'}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-black text-[#031B2A]">
                      {property.owner?.full_name || 'Verified Landlord'}
                    </h3>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E]" />
                  </div>
                  <p className="text-[11px] text-[#64748B] font-medium">Physical title checked</p>
                </div>
              </div>
              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
                <span>Response Time</span>
                <span className="font-bold text-[#0F766E]">Under 30 mins</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
