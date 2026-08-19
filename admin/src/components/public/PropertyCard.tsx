import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bed, Bath, Maximize2, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PublicProperty } from '../../lib/seo/queries';
import { generatePropertySlug } from '../../lib/seo/slugs';

interface PropertyCardProps {
  property: PublicProperty;
  priority?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, priority = false }) => {
  const slug = generatePropertySlug(property);
  const coverImage =
    property.property_images?.find((img) => img.is_cover)?.image_url ||
    property.property_images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80';

  const formattedPrice = `₹${property.price.toLocaleString('en-IN')}`;
  const furnishingLabel =
    property.furnishing === 'fully_furnished'
      ? 'Furnished'
      : property.furnishing === 'semi_furnished'
      ? 'Semi-Furnished'
      : 'Unfurnished';

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <Link href={`/property/${slug}`} className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden block">
        <Image
          src={coverImage}
          alt={`${property.title} in ${property.locality}, ${property.city}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={priority}
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-stone-900/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Zero Brokerage
          </span>
          {property.verification_status === 'verified' && (
            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        {/* Furnishing Tag */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-white/90 backdrop-blur-md text-stone-800 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm">
            {furnishingLabel}
          </span>
        </div>
      </Link>

      {/* Details Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Deposit */}
          <div className="flex items-baseline justify-between mb-1.5">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-stone-900">{formattedPrice}</span>
              <span className="text-xs text-stone-500 font-medium">/ month</span>
            </div>
            {property.deposit > 0 && (
              <span className="text-[11px] font-medium text-stone-500">
                Dep: ₹{property.deposit.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-stone-900 group-hover:text-purple-600 transition line-clamp-1 mb-1.5">
            <Link href={`/property/${slug}`}>{property.title}</Link>
          </h3>

          {/* Locality */}
          <p className="text-xs text-stone-600 flex items-center gap-1 mb-3 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            <span>
              {property.locality}, {property.city}
            </span>
          </p>

          {/* Specs Row */}
          <div className="flex items-center gap-4 py-2 border-t border-stone-100 text-xs text-stone-600">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-purple-600" />
              <span>{property.bedrooms} BHK</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-stone-400" />
              <span>{property.bathrooms} Bath</span>
            </div>
            {property.area > 0 && (
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
                <span>{property.area} sq.ft</span>
              </div>
            )}
          </div>
        </div>

        {/* View Details CTA */}
        <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Direct Owner Listing
          </span>
          <Link
            href={`/property/${slug}`}
            className="text-xs font-bold text-purple-600 hover:text-purple-800 transition"
          >
            View Details →
          </Link>
        </div>
      </div>
    </article>
  );
};
