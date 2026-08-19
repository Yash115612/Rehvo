'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Bed, Bath, Maximize2, MapPin, Heart, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { generatePropertySlug } from '@/lib/seo/slugs';
import { useAuth } from '@/lib/auth/AuthContext';

interface PropertyCardProps {
  property: PublicProperty;
  priority?: boolean;
}

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80';

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, priority = false }) => {
  const router = useRouter();
  const { user, isSaved, toggleSaveProperty } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const slug = generatePropertySlug(property);
  const saved = isSaved(property.id);

  const rawCover =
    property.property_images?.find((img) => img.is_cover && img.image_url?.startsWith('https://'))?.image_url ||
    property.property_images?.find((img) => img.image_url?.startsWith('https://'))?.image_url;

  const coverImage = rawCover && rawCover.startsWith('https://') ? rawCover : DEFAULT_FALLBACK_IMAGE;

  const formattedPrice = `₹${property.price.toLocaleString('en-IN')}`;
  const furnishingLabel =
    property.furnishing === 'fully_furnished'
      ? 'Furnished'
      : property.furnishing === 'semi_furnished'
      ? 'Semi-Furnished'
      : 'Unfurnished';

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/property/${slug}`)}`);
      return;
    }

    if (isSaving) return;
    setIsSaving(true);
    try {
      await toggleSaveProperty(property.id);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className="group bg-white rounded-3xl overflow-hidden border border-stone-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image & Badges Container */}
        <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden block">
          <Link href={`/property/${slug}`} className="block w-full h-full">
            <Image
              src={coverImage}
              alt={`${property.title} in ${property.locality}, ${property.city}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              priority={priority}
            />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 pointer-events-none">
            <span className="bg-stone-900/90 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              0% Brokerage
            </span>
            {property.verification_status === 'verified' && (
              <span className="bg-emerald-600/95 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          {/* Save / Heart Button */}
          <button
            type="button"
            onClick={handleHeartClick}
            disabled={isSaving}
            className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-md ${
              saved
                ? 'bg-rose-500 text-white scale-110'
                : 'bg-stone-900/40 text-white hover:bg-white hover:text-rose-500 hover:scale-105'
            }`}
            aria-label={saved ? 'Remove from saved' : 'Save property'}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>

          {/* Furnishing & Category Tag */}
          <div className="absolute bottom-3.5 right-3.5 flex items-center gap-1.5 pointer-events-none">
            <span className="bg-white/95 backdrop-blur-md text-stone-800 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
              {furnishingLabel}
            </span>
          </div>
        </div>

        {/* Property Info Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            {/* Price Row */}
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-stone-900 tracking-tight">
                  {formattedPrice}
                </span>
                <span className="text-xs text-stone-500 font-medium">/month</span>
              </div>
              {property.deposit > 0 && (
                <span className="text-xs font-semibold text-stone-500">
                  Dep: ₹{property.deposit.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-bold text-base text-stone-900 group-hover:text-purple-600 transition line-clamp-1">
              <Link href={`/property/${slug}`}>{property.title}</Link>
            </h3>

            {/* Location */}
            <p className="text-xs text-stone-500 flex items-center gap-1 mt-1 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
              <span>
                {property.locality}, {property.city}
              </span>
            </p>
          </div>

          {/* Specs Bar */}
          <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-700">
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-purple-600" />
              <span className="font-bold">{property.bedrooms} BHK</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5 text-stone-400" />
              <span>{property.bathrooms} Bath</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
              <span>{property.area > 0 ? `${property.area} sq.ft` : 'Standard'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 sm:px-6 pb-5 pt-1 flex items-center justify-between border-t border-stone-100 text-xs">
        <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Direct Owner
        </span>
        <Link
          href={`/property/${slug}`}
          className="font-bold text-purple-600 hover:text-purple-800 transition"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
};
