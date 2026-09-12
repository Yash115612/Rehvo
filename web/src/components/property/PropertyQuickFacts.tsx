import React from 'react';
import {
  Bed,
  Bath,
  Maximize2,
  Zap,
  Calendar,
  Layers,
  Car,
  Building2,
  Users,
  Compass,
} from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';

interface PropertyQuickFactsProps {
  property: PublicProperty;
}

export const PropertyQuickFacts: React.FC<PropertyQuickFactsProps> = ({ property }) => {
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

  const availabilityLabel = property.availability || 'Immediate';

  // Build category-aware fact items
  const facts: Array<{
    icon: React.ElementType;
    label: string;
    value: string;
  }> = [];

  if (isCommercial) {
    facts.push({
      icon: Building2,
      label: 'Space Type',
      value: (property.commercial_type || property.type).replace(/_/g, ' '),
    });
    facts.push({
      icon: Maximize2,
      label: 'Super Area',
      value: property.area > 0 ? `${property.area.toLocaleString('en-IN')} sq.ft` : 'Standard',
    });
    if (property.carpet_area) {
      facts.push({
        icon: Maximize2,
        label: 'Carpet Area',
        value: `${property.carpet_area.toLocaleString('en-IN')} sq.ft`,
      });
    }
    facts.push({
      icon: Bath,
      label: 'Washrooms',
      value: property.washrooms ? `${property.washrooms} Washrooms` : 'Available',
    });
    facts.push({
      icon: Zap,
      label: 'Fit-out Condition',
      value: furnishingLabel,
    });
    if (property.floor_number) {
      facts.push({
        icon: Layers,
        label: 'Floor',
        value: property.total_floors
          ? `${property.floor_number} of ${property.total_floors}`
          : property.floor_number,
      });
    }
    facts.push({
      icon: Calendar,
      label: 'Possession',
      value: property.possession_status || availabilityLabel,
    });
  } else if (isPg) {
    facts.push({
      icon: Bed,
      label: 'Stay Type',
      value: property.type === 'pg' ? 'Managed PG / Co-living' : 'Private Room',
    });
    facts.push({
      icon: Maximize2,
      label: 'Room Size',
      value: property.area > 0 ? `${property.area} sq.ft` : 'Standard Room',
    });
    facts.push({
      icon: Bath,
      label: 'Washroom',
      value: property.bathrooms > 0 ? `${property.bathrooms} Attached` : 'Shared / Common',
    });
    facts.push({
      icon: Zap,
      label: 'Furnishing',
      value: furnishingLabel,
    });
    facts.push({
      icon: Calendar,
      label: 'Available From',
      value: availabilityLabel,
    });
    if (property.tenant_preferences && property.tenant_preferences.length > 0) {
      facts.push({
        icon: Users,
        label: 'Ideal For',
        value: property.tenant_preferences.join(', '),
      });
    }
  } else {
    // Residential standard
    facts.push({
      icon: Bed,
      label: 'Configuration',
      value: property.bedrooms ? `${property.bedrooms} BHK` : 'Residential',
    });
    facts.push({
      icon: Maximize2,
      label: 'Super Area',
      value: property.area > 0 ? `${property.area.toLocaleString('en-IN')} sq.ft` : 'Standard',
    });
    facts.push({
      icon: Bath,
      label: 'Bathrooms',
      value: `${property.bathrooms || 1} Bathrooms`,
    });
    facts.push({
      icon: Zap,
      label: 'Furnishing',
      value: furnishingLabel,
    });
    if (property.floor_number) {
      facts.push({
        icon: Layers,
        label: 'Floor',
        value: property.total_floors
          ? `${property.floor_number} of ${property.total_floors}`
          : property.floor_number,
      });
    }
    facts.push({
      icon: Calendar,
      label: 'Available From',
      value: availabilityLabel,
    });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-black text-[#031B2A] tracking-tight">
        Quick Facts
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {facts.map((fact, idx) => {
          const Icon = fact.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-[20px] p-4 border border-[#E2E8F0] shadow-2xs flex flex-col justify-between space-y-2 hover:border-[#0F766E]/30 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#64748B] block truncate">
                  {fact.label}
                </span>
                <span className="text-sm font-black text-[#031B2A] block capitalize truncate mt-0.5">
                  {fact.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
