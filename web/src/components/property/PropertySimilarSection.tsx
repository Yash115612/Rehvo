import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { PropertyCard } from '@/components/public/PropertyCard';
import { normalizeLocalitySlug } from '@/lib/seo/slugs';

interface PropertySimilarSectionProps {
  currentProperty: PublicProperty;
  similarProperties: PublicProperty[];
}

export const PropertySimilarSection: React.FC<PropertySimilarSectionProps> = ({
  currentProperty,
  similarProperties,
}) => {
  const filtered = similarProperties.filter((p) => p.id !== currentProperty.id);

  if (filtered.length === 0) {
    return null;
  }

  const localitySlug = normalizeLocalitySlug(currentProperty.locality);

  return (
    <section className="pt-12 pb-6 border-t border-[#E2E8F0] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0F766E]" />
            <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-wider">
              Explore Neighborhood
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#031B2A] tracking-tight mt-1">
            More Verified Properties in {currentProperty.locality}
          </h2>
          <p className="text-xs text-[#64748B] font-medium mt-0.5">
            Compare verified homes and spaces in the same area.
          </p>
        </div>

        <Link
          href={`/mumbai/${localitySlug}`}
          className="text-xs font-black text-[#0F766E] hover:text-[#064E3B] inline-flex items-center gap-1 group flex-shrink-0"
        >
          <span>View all in {currentProperty.locality}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.slice(0, 3).map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
};
