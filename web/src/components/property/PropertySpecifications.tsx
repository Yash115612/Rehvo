import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';

interface PropertySpecificationsProps {
  property: PublicProperty;
}

export const PropertySpecifications: React.FC<PropertySpecificationsProps> = ({ property }) => {
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

  const isPg = property.type === 'pg' || property.type === 'room';

  const furnishingLabel =
    property.furnishing === 'fully_furnished'
      ? 'Fully Furnished'
      : property.furnishing === 'semi_furnished'
      ? 'Semi-Furnished'
      : property.furnishing === 'bare_shell'
      ? 'Bare Shell'
      : property.furnishing === 'warm_shell'
      ? 'Warm Shell'
      : 'Unfurnished';

  // Build key-value specification items
  const specs: Array<{ label: string; value: string | null }> = [];

  specs.push({
    label: 'Property Type',
    value: (property.commercial_type || property.type).replace(/_/g, ' ').toUpperCase(),
  });

  if (!isCommercial && property.bedrooms) {
    specs.push({
      label: 'Configuration',
      value: `${property.bedrooms} BHK`,
    });
  }

  if (property.area > 0) {
    specs.push({
      label: 'Super Built-up Area',
      value: `${property.area.toLocaleString('en-IN')} sq.ft`,
    });
  }

  if (property.carpet_area) {
    specs.push({
      label: 'Carpet Area',
      value: `${property.carpet_area.toLocaleString('en-IN')} sq.ft`,
    });
  }

  specs.push({
    label: isCommercial ? 'Washrooms' : 'Bathrooms',
    value: isCommercial
      ? `${property.washrooms || 0} Washrooms`
      : `${property.bathrooms || 1} Bathrooms`,
  });

  specs.push({
    label: 'Furnishing Status',
    value: furnishingLabel,
  });

  if (property.floor_number) {
    specs.push({
      label: 'Property Floor',
      value: property.total_floors
        ? `${property.floor_number} (out of ${property.total_floors} Floors)`
        : `${property.floor_number} Floor`,
    });
  }

  if (property.parking || property.parking_spaces) {
    specs.push({
      label: 'Dedicated Parking',
      value: property.parking_spaces || property.parking || 'Available',
    });
  }

  specs.push({
    label: 'Possession / Availability',
    value: property.possession_status || property.availability || 'Immediate',
  });

  if (property.lease_type) {
    specs.push({
      label: 'Lease Agreement Type',
      value: property.lease_type.toUpperCase(),
    });
  }

  if (property.road_width) {
    specs.push({
      label: 'Main Road Frontage',
      value: `${property.road_width} Feet Wide`,
    });
  }

  if (property.tenant_preferences && property.tenant_preferences.length > 0) {
    specs.push({
      label: 'Preferred Tenants',
      value: property.tenant_preferences.join(', '),
    });
  }

  specs.push({
    label: 'Brokerage Fee',
    value: '₹0 (Verified Marketplace)',
  });

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
          <SlidersHorizontal className="w-4 h-4" />
        </div>
        <h2 className="text-lg sm:text-xl font-black text-[#031B2A] tracking-tight">
          Property Details & Specifications
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs sm:text-sm divide-y sm:divide-y-0 divide-[#E2E8F0]">
        {specs.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-2.5 sm:py-3 border-b border-[#E2E8F0]/70"
          >
            <span className="font-semibold text-[#64748B]">{item.label}</span>
            <span className="font-extrabold text-[#031B2A] text-right capitalize">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
