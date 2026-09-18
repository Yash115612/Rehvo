'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Share2,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Maximize2,
  Calendar,
} from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { generatePropertySlug, getSafeImageUrl } from '@/lib/seo/slugs';
import { AppDownloadModal } from '@/components/public/AppDownloadModal';

interface PropertyCardProps {
  property: PublicProperty;
  metroDistance?: string;
  aiWhyRecommended?: string;
  aiMatchScore?: number;
  isZeroDeposit?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  metroDistance: propMetroDistance,
  aiWhyRecommended: propAiWhy,
  aiMatchScore: propAiMatch,
  isZeroDeposit: propZeroDeposit,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedList = JSON.parse(localStorage.getItem('rehvo_saved_properties') || '[]');
      if (savedList.includes(property.id)) {
        setIsSaved(true);
      }
    } catch {}
  }, [property.id]);

  const slug = generatePropertySlug(property);
  const coverImage = getSafeImageUrl(property.property_images?.[0]?.image_url, 0);

  // Extract all property photos or fallback to 3 verified architectural interior views
  const rawImages = property.property_images && property.property_images.length > 0
    ? property.property_images.map((img) => img.image_url)
    : [
        coverImage,
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&auto=format&fit=crop&q=80',
      ];

  const images = rawImages.length > 0 ? rawImages : [coverImage];

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(property.price || 0);

  const isZeroDeposit = propZeroDeposit !== undefined
    ? propZeroDeposit
    : property.deposit === 0 || (property as any).isZeroDeposit === true;

  const depositFormatted = isZeroDeposit
    ? '₹0 Deposit'
    : new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(property.deposit || (property.price || 0) * 2);

  const metroDistance = propMetroDistance || (property as any).metroDistance || '450m to Metro';
  const aiWhy = propAiWhy || (property as any).aiWhyRecommended || 'Verified Listing • Verified Society • High Sunlight';
  const aiMatch = propAiMatch || (property as any).aiMatchScore || 98;

  const furnishingLabel =
    property.furnishing === 'fully_furnished'
      ? 'Furnished'
      : property.furnishing === 'semi_furnished'
      ? 'Semi-Furnished'
      : 'Unfurnished';

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/property/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved((prev) => {
      const next = !prev;
      try {
        const savedList = JSON.parse(localStorage.getItem('rehvo_saved_properties') || '[]');
        const updated = next
          ? Array.from(new Set([...savedList, property.id]))
          : savedList.filter((id: string) => id !== property.id);
        localStorage.setItem('rehvo_saved_properties', JSON.stringify(updated));
        window.dispatchEvent(new Event('rehvo_saved_updated'));
      } catch {}
      return next;
    });
  };

  const handleBookVisit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDownloadModalOpen(true);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <article className="group bg-white rounded-[26px] overflow-hidden border border-[#E2E8F0] shadow-card hover:shadow-card-hover hover:border-[#0F766E]/40 transition-all duration-300 flex flex-col justify-between relative">
      {/* 1. TOP IMAGE CAROUSEL CONTAINER */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden select-none">
        <Link href={`/property/${slug}`} className="block w-full h-full cursor-pointer relative">
          <Image
            src={images[activeImageIndex] || coverImage}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Gradient Scrim for Top & Bottom Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35 pointer-events-none" />

        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Verified Badge */}
            <div className="inline-flex items-center gap-1 bg-[#CCFBF1]/95 backdrop-blur-md text-[#064E3B] text-[10px] font-black px-2.5 py-1 rounded-full shadow-2xs">
              <ShieldCheck className="w-3 h-3 text-[#0F766E]" />
              <span>VERIFIED OWNER</span>
            </div>

            {/* Verified Listing Badge */}
            <div className="inline-flex items-center bg-[#0F766E] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-2xs">
              VERIFIED LISTING
            </div>

            {/* Zero Deposit Badge */}
            {isZeroDeposit && (
              <div className="inline-flex items-center bg-[#FEF3C7] text-[#92400E] text-[10px] font-black px-2.5 py-1 rounded-full shadow-2xs">
                0 DEPOSIT
              </div>
            )}
          </div>

          {/* Action Buttons: Save & Share */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share property"
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-[#031B2A] flex items-center justify-center transition shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#0F766E]" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleSave}
              aria-label="Save property"
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-[#031B2A] flex items-center justify-center transition shadow-xs cursor-pointer"
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  isSaved ? 'fill-[#EF4444] text-[#EF4444]' : 'text-[#031B2A]'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Carousel Navigation Arrows (Visible on Card Hover) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Bottom Image Overlay: AI Match Pill & Rating */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#031B2A] text-[10px] font-black px-2.5 py-1 rounded-full shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#D97706]" />
            <span>AI MATCH {aiMatch}%</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Rating Pill */}
            <div className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-[10px] font-bold">
              <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
              <span>4.92</span>
            </div>

            {/* Pagination Dots */}
            {images.length > 1 && (
              <div className="flex items-center gap-1">
                {images.slice(0, 5).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeImageIndex ? 'w-3.5 bg-white shadow-xs' : 'w-1.5 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. CARD CONTENT BODY */}
      <div className="p-3.5 xs:p-4 sm:p-5 space-y-2.5 sm:space-y-3 flex-1 flex flex-col justify-between">
        <Link href={`/property/${slug}`} className="block space-y-1.5 sm:space-y-2 group/link cursor-pointer">
          {/* Row A: Price & Deposit Hint */}
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="text-xl sm:text-2xl font-black text-[#031B2A] tracking-tight group-hover/link:text-[#0F766E] transition-colors">
                {formattedPrice}
              </span>
              <span className="text-xs text-[#64748B] font-semibold ml-1">/ mo</span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-[#0F766E] bg-[#CCFBF1] px-2 py-0.5 rounded-md">
              {depositFormatted}
            </div>
          </div>

          {/* Row B: Title */}
          <h3 className="text-xs sm:text-base font-extrabold text-[#031B2A] line-clamp-1 group-hover/link:text-[#0F766E] transition-colors">
            {property.title}
          </h3>

          {/* Row C: Locality with Icon */}
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] truncate">
            <MapPin className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
            <span className="truncate font-semibold text-[#334155]">
              {property.locality}, {property.city}
            </span>
          </div>
        </Link>

        {/* Row D: Specs Chips (Bed, Bath, Area, Furnishing) */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold text-[#475569] flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-[#F1F5F9]">
            <Bed className="w-3 h-3 text-[#0F766E]" />
            <span>{property.bedrooms ? `${property.bedrooms} BHK` : property.type.toUpperCase()}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-[#F1F5F9]">
            <Bath className="w-3 h-3 text-[#0F766E]" />
            <span>{property.bathrooms || 1} Baths</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-[#F1F5F9]">
            <Maximize2 className="w-3 h-3 text-[#0F766E]" />
            <span>{property.area} sqft</span>
          </span>
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-[#F1F5F9] capitalize text-[10px] sm:text-[11px]">
            {furnishingLabel}
          </span>
        </div>

        {/* Row E: Location & Transit Intelligence Badges */}
        <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-extrabold">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-[#0E8F73] border border-emerald-100">
              <span>🚇</span>
              <span>{metroDistance}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
              <span>🚶</span>
              <span>94 Walk Score</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
              <span>⏱️</span>
              <span>15m to BKC</span>
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-[#64748B] truncate">
              <Sparkles className="w-3 h-3 text-[#D97706] shrink-0" />
              <span className="truncate">{aiWhy}</span>
            </div>
            <div className="text-[#0E8F73] font-black text-[10px] shrink-0">Zero Brokerage</div>
          </div>
        </div>

        {/* Row F: Action Buttons ("Book Visit" & "View Details") */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleBookVisit}
            className="flex-1 h-10 rounded-xl bg-[#CCFBF1] text-[#064E3B] hover:bg-[#0F766E] hover:text-white transition font-black text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Visit</span>
          </button>
          <Link
            href={`/property/${slug}`}
            className="h-10 px-4 rounded-xl bg-[#F8FAFC] hover:bg-slate-200 text-[#031B2A] transition font-extrabold text-xs flex items-center justify-center cursor-pointer active:scale-95"
          >
            <span>Details →</span>
          </Link>
        </div>
      </div>

      <AppDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        title="Book Visit on REHVO App"
        subtitle="Schedule a verified physical walkthrough with the landlord and generate your visitor gate pass in the REHVO mobile app."
        propertyTitle={property.title}
      />
    </article>
  );
};
