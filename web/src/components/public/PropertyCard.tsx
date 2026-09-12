'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bed, Bath, Maximize2, MapPin, Heart, CheckCircle2, ShieldCheck, Building } from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { generatePropertySlug } from '@/lib/seo/slugs';
import { useAuth } from '@/lib/auth/AuthContext';
import { RehvoImage } from '@/components/ui/RehvoImage';

interface PropertyCardProps {
  property: PublicProperty;
  priority?: boolean;
}

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80';

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, priority = false }) => {
  const router = useRouter();
  const { isSaved } = useAuth();
  const [localSaved, setLocalSaved] = useState(false);

  useEffect(() => {
    try {
      const savedList = JSON.parse(localStorage.getItem('rehvo_saved_properties') || '[]');
      if (savedList.includes(property.id)) {
        setLocalSaved(true);
      }
    } catch {}
  }, [property.id]);

  const slug = generatePropertySlug(property);
  const saved = localSaved || isSaved(property.id);

  const rawCover =
    property.property_images?.find((img) => img.is_cover && img.image_url?.startsWith('https://'))?.image_url ||
    property.property_images?.find((img) => img.image_url?.startsWith('https://'))?.image_url;

  const coverImage = rawCover && rawCover.startsWith('https://') ? rawCover : DEFAULT_FALLBACK_IMAGE;

  const isCommercial =
    property.category === 'commercial' ||
    [
      'office',
      'shop',
      'showroom',
      'warehouse',
      'commercial_building',
      'coworking',
      'commercial_plot',
      'other_commercial',
    ].includes(property.type);

  const formattedPrice = `₹${property.price.toLocaleString('en-IN')}`;
  const furnishingLabel =
    property.furnishing === 'fully_furnished'
      ? 'Furnished'
      : property.furnishing === 'semi_furnished'
      ? 'Semi-Furnished'
      : property.furnishing === 'bare_shell'
      ? 'Bare Shell'
      : property.furnishing === 'warm_shell'
      ? 'Warm Shell'
      : 'Unfurnished';

  const handleHeartClick = (e: React.MouseEvent) => {
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
  };

  return (
    <article className="group rehvo-glass-card rounded-[24px] overflow-hidden transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image & Badges Container */}
        <div className="relative aspect-[16/10] w-full bg-[#F1F5F9] overflow-hidden block">
          <Link href={`/property/${slug}`} className="block w-full h-full">
            <RehvoImage
              src={coverImage}
              alt={`${property.title} in ${property.locality}, ${property.city}`}
              fill
              fallbackCategory={isCommercial ? 'commercial' : 'property'}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              priority={priority}
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
            <span className="rehvo-glass-subtle text-[#031B2A] text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
              Verified Listing
            </span>
            {property.verification_status === 'verified' && (
              <span className="bg-[#16A34A]/90 backdrop-blur-md border border-white/40 text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          {/* Save / Heart Button */}
          <button
            type="button"
            onClick={handleHeartClick}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-2xs ${
              saved
                ? 'rehvo-glass-coral text-white scale-105'
                : 'rehvo-glass-subtle text-[#031B2A] hover:text-[#0F766E] hover:scale-105'
            }`}
            aria-label={saved ? 'Remove from saved' : 'Save property'}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>

          {/* Furnishing Tag */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 pointer-events-none">
            <span className="rehvo-glass-subtle text-[#031B2A] text-[10.5px] font-bold px-2.5 py-0.5 rounded-md shadow-2xs">
              {furnishingLabel}
            </span>
          </div>
        </div>

        {/* Property Info Content */}
        <div className="p-4 sm:p-5 space-y-3">
          <div>
            {/* Price Row */}
            <div className="flex items-baseline justify-between mb-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#031B2A] tracking-tight">
                  {formattedPrice}
                </span>
                <span className="text-xs text-[#64748B] font-medium">/month</span>
              </div>
              {property.area > 0 && isCommercial && (
                <span className="text-xs font-semibold text-[#64748B]">
                  ₹{Math.round(property.price / property.area)}/sq.ft
                </span>
              )}
              {!isCommercial && property.deposit > 0 && (
                <span className="text-xs font-semibold text-[#64748B]">
                  Dep: ₹{property.deposit.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-bold text-base text-[#031B2A] group-hover:text-[#0F766E] transition line-clamp-1">
              <Link href={`/property/${slug}`}>{property.title}</Link>
            </h3>

            {/* Location */}
            <p className="text-xs text-[#64748B] flex items-center gap-1 mt-1 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-[#0F766E] flex-shrink-0" />
              <span>
                {property.locality}, {property.city}
              </span>
            </p>
          </div>

          {/* Specs Bar */}
          <div className="grid grid-cols-3 gap-2 py-2 px-3 rehvo-glass-subtle rounded-xl text-xs text-[#031B2A]">
            {isCommercial ? (
              <>
                <div className="flex items-center gap-1.5 truncate">
                  <Building className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                  <span className="font-bold capitalize truncate">
                    {property.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                  <span>{property.washrooms || 0} Wash</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                  <span>{property.area > 0 ? `${property.area} sq.ft` : 'Standard'}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span className="font-bold">{property.bedrooms} BHK</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>{property.bathrooms} Bath</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>{property.area > 0 ? `${property.area} sq.ft` : 'Standard'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-4 sm:px-5 pb-4 pt-2.5 flex items-center justify-between border-t border-white/60 text-xs">
        <span className="text-[11px] font-semibold text-[#16A34A] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Direct Owner
        </span>
        <Link
          href={`/property/${slug}`}
          className="font-bold text-[#0F766E] hover:text-[#064E3B] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Details</span>
          <span>→</span>
        </Link>
      </div>
    </article>
  );
};
