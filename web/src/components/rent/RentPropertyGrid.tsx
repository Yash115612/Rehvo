'use client';

import React from 'react';
import { PublicProperty } from '@/lib/seo/types';
import { PropertyCard } from '@/components/public/PropertyCard';
import { RentPropertySkeleton } from './RentPropertySkeleton';

interface RentPropertyGridProps {
  properties: PublicProperty[];
  isLoading: boolean;
}

export const RentPropertyGrid: React.FC<RentPropertyGridProps> = ({
  properties,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <RentPropertySkeleton key={`skeleton-${idx}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {properties.map((prop, idx) => (
        <PropertyCard key={prop.id} property={prop} priority={idx < 3} />
      ))}
    </div>
  );
};
