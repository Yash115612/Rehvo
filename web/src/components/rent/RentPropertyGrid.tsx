'use client';

import React from 'react';
import { PublicProperty } from '@/lib/seo/types';
import { RentPropertyCard } from './RentPropertyCard';
import { RentPropertySkeleton } from './RentPropertySkeleton';

interface RentPropertyGridProps {
  properties: PublicProperty[];
  isLoading?: boolean;
  viewMode?: 'grid' | 'list';
  isSplitView?: boolean;
  selectedPropertyId?: string | null;
  onHoverProperty?: (id: string | null) => void;
}

export const RentPropertyGrid: React.FC<RentPropertyGridProps> = ({
  properties,
  isLoading = false,
  viewMode = 'grid',
  isSplitView = false,
  selectedPropertyId = null,
  onHoverProperty,
}) => {
  const containerClasses =
    viewMode === 'grid'
      ? isSplitView
        ? 'grid grid-cols-1 sm:grid-cols-2 gap-5'
        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
      : 'space-y-4';

  if (isLoading) {
    return (
      <div className={containerClasses}>
        {Array.from({ length: 6 }).map((_, i) => (
          <RentPropertySkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {properties.map((property, idx) => (
        <RentPropertyCard
          key={property.id}
          property={property}
          viewMode={viewMode}
          priority={idx < 3}
          isSelected={selectedPropertyId === property.id}
          onHover={onHoverProperty}
        />
      ))}
    </div>
  );
};
