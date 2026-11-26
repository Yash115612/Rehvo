'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Share2,
  MapPin,
  ShieldCheck,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { generatePropertySlug, getSafeImageUrl } from '@/lib/seo/slugs';
import { useAuth } from '@/lib/auth/AuthContext';

interface RentPropertyCardProps {
  property: PublicProperty;
  viewMode?: 'grid' | 'list';
  priority?: boolean;
  isSelected?: boolean;
  onHover?: (id: string | null) => void;
}

export const RentPropertyCard: React.FC<RentPropertyCardProps> = ({
  property,
  viewMode = 'grid',
  priority = false,
  isSelected = false,
  onHover,
}) => {
  const { isSaved, toggleSaveProperty } = useAuth();
  const [localSaved, setLocalSaved] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const savedList = JSON.parse(localStorage.getItem('rehvo_saved_properties') || '[]');
      if (savedList.includes(property.id)) {
        setLocalSaved(true);
      }
    } catch {}
  }, [property.id]);

  const slug = generatePropertySlug(property);
  const isHeartActive = localSaved || isSaved(property.id);

  // Extract photos
  const rawImages = property.property_images && property.property_images.length > 0
    ? property.property_images.map((img) => img.image_url)
    : [
        getSafeImageUrl(property.property_images?.[0]?.image_url, 0),
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&auto=format&fit=crop&q=80',
      ];

  const images = rawImages.length > 0 ? rawImages : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80'];

  const formattedRent = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(property.price || 0);

  const isZeroDeposit = property.deposit === 0 || (property as any).isZeroDeposit === true;
  const formattedDeposit = isZeroDeposit
    ? '₹0 Deposit'
    : property.deposit
    ? `₹${Number(property.deposit).toLocaleString('en-IN')} Deposit`
    : '2 Months Deposit';

  const furnishingLabel =
    property.furnishing === 'fully_furnished'
      ? 'Fully Furnished'
      : property.furnishing === 'semi_furnished'
      ? 'Semi-Furnished'
      : 'Unfurnished';

  const bhkDisplay = property.bedrooms
    ? `${property.bedrooms} BHK`
    : property.type === 'studio'
    ? 'Studio'
    : '1 BHK';

  const areaDisplay = property.area ? `${property.area} sq.ft` : '650 sq.ft';
  const bathDisplay = property.bathrooms ? `${property.bathrooms} Bath` : '1 Bath';
  const availabilityDisplay = property.availability || 'Available Immediately';

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLocalSaved((prev) => {
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

    try {
      await toggleSaveProperty(property.id);
    } catch {}
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/property/${slug}`;
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this verified rental on REHVO: ${property.title} in ${property.locality}, Mumbai`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // -------------------------------------------------------------
  // LIST VIEW LAYOUT
  // -------------------------------------------------------------
  if (viewMode === 'list') {
    return (
      <article
        onMouseEnter={() => onHover?.(property.id)}
        onMouseLeave={() => onHover?.(null)}
        className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden hover:shadow-md flex flex-col md:flex-row ${
          isSelected ? 'border-[#001741] ring-2 ring-[#001741]/20' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        {/* Photo Container */}
        <div className="relative w-full md:w-80 h-56 md:h-auto bg-slate-100 shrink-0 overflow-hidden">
          <Link href={`/property/${slug}`} className="block w-full h-full">
            <Image
              src={images[activeImageIndex] || images[0]}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              priority={priority}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
            {property.verification_status === 'verified' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#001741]/90 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
                <ShieldCheck size={12} className="text-[#F97316]" />
                <span>100% Verified</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
              Zero Commission
            </span>
          </div>

          {/* Save & Share */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              onClick={handleShare}
              aria-label="Share property"
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:bg-white hover:text-[#001741] transition shadow-xs"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            </button>
            <button
              onClick={handleSave}
              aria-label={isHeartActive ? 'Remove from saved' : 'Save property'}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:bg-white transition shadow-xs"
            >
              <Heart
                size={16}
                className={isHeartActive ? 'fill-rose-500 text-rose-500' : 'text-slate-600 hover:text-rose-500'}
              />
            </button>
          </div>

          {/* Photo Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextImage}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <ChevronRight size={16} />
              </button>
              <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
                {activeImageIndex + 1}/{images.length}
              </div>
            </>
          )}
        </div>

        {/* Content Container */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            {/* Rent & Deposit */}
            <div className="flex items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-[#001741] tracking-tight">
                  {formattedRent}
                </span>
                <span className="text-xs font-semibold text-slate-500">/ month</span>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                {formattedDeposit}
              </span>
            </div>

            {/* Title */}
            <Link href={`/property/${slug}`} className="block">
              <h3 className="text-base font-bold text-[#101828] group-hover:text-[#F97316] transition line-clamp-1">
                {property.title}
              </h3>
            </Link>

            {/* Locality & Address */}
            <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
              <MapPin size={13} className="text-[#F97316] shrink-0" />
              <span className="truncate">{property.locality}, {property.city}</span>
            </p>

            {/* Specs Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                <Bed size={14} className="text-[#001741]" />
                <span className="font-semibold text-slate-800">{bhkDisplay}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                <Maximize2 size={13} className="text-[#001741]" />
                <span>{areaDisplay}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                <Bath size={13} className="text-[#001741]" />
                <span>{bathDisplay}</span>
              </span>
              <span className="bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 text-slate-700">
                {furnishingLabel}
              </span>
            </div>
          </div>

          {/* Footer CTA & Details */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
            <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
              <Calendar size={13} className="text-slate-400" />
              <span>{availabilityDisplay}</span>
            </span>

            <Link
              href={`/property/${slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#001741] hover:bg-[#0B1F3A] text-white text-xs font-bold transition shadow-xs"
            >
              <span>View Details</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // -------------------------------------------------------------
  // GRID VIEW LAYOUT (Default)
  // -------------------------------------------------------------
  return (
    <article
      onMouseEnter={() => onHover?.(property.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden hover:shadow-lg flex flex-col justify-between ${
        isSelected ? 'border-[#001741] ring-2 ring-[#001741]/20' : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Photo Container */}
        <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden block">
          <Link href={`/property/${slug}`} className="block w-full h-full">
            <Image
              src={images[activeImageIndex] || images[0]}
              alt={property.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
            {property.verification_status === 'verified' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#001741]/90 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
                <ShieldCheck size={12} className="text-[#F97316]" />
                <span>100% Verified</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
              Zero Commission
            </span>
          </div>

          {/* Action Buttons Overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              onClick={handleShare}
              aria-label="Share property"
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:bg-white hover:text-[#001741] transition shadow-xs"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            </button>
            <button
              onClick={handleSave}
              aria-label={isHeartActive ? 'Remove from saved' : 'Save property'}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:bg-white transition shadow-xs"
            >
              <Heart
                size={16}
                className={isHeartActive ? 'fill-rose-500 text-rose-500' : 'text-slate-600 hover:text-rose-500'}
              />
            </button>
          </div>

          {/* Photo Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                aria-label="Previous photo"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextImage}
                aria-label="Next photo"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <ChevronRight size={16} />
              </button>
              <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
                {activeImageIndex + 1}/{images.length}
              </div>
            </>
          )}
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Price & Deposit */}
          <div className="flex flex-wrap items-baseline justify-between gap-1.5">
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-[#001741] tracking-tight">
                {formattedRent}
              </span>
              <span className="text-xs font-semibold text-slate-500">/mo</span>
            </div>
            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md whitespace-nowrap">
              {formattedDeposit}
            </span>
          </div>

          {/* Title */}
          <Link href={`/property/${slug}`} className="block">
            <h3 className="text-sm font-bold text-[#101828] group-hover:text-[#F97316] transition line-clamp-1">
              {property.title}
            </h3>
          </Link>

          {/* Locality */}
          <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
            <MapPin size={12} className="text-[#F97316] shrink-0" />
            <span className="truncate">{property.locality}, {property.city}</span>
          </p>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px] font-semibold text-slate-700 text-center">
            <div className="bg-slate-50 border border-slate-100 py-1.5 px-1 rounded-lg truncate">
              {bhkDisplay}
            </div>
            <div className="bg-slate-50 border border-slate-100 py-1.5 px-1 rounded-lg truncate">
              {areaDisplay}
            </div>
            <div className="bg-slate-50 border border-slate-100 py-1.5 px-1 rounded-lg truncate">
              {furnishingLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-500 font-medium truncate">
          {availabilityDisplay}
        </span>

        <Link
          href={`/property/${slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#001741] group-hover:text-[#F97316] transition shrink-0"
        >
          <span>View Details</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </article>
  );
};
