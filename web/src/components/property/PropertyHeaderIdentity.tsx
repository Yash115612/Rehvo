import React from 'react';
import { MapPin, CheckCircle2, ShieldCheck, Sparkles, Building2, Home } from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';

interface PropertyHeaderIdentityProps {
  property: PublicProperty;
}

export const PropertyHeaderIdentity: React.FC<PropertyHeaderIdentityProps> = ({ property }) => {
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

  const displayLocation = [
    property.address,
    property.locality,
    property.city,
  ]
    .filter(Boolean)
    .join(', ');

  const typeLabel = property.type.replace(/_/g, ' ');

  return (
    <div className="space-y-3 pb-6 border-b border-[#E2E8F0]">
      {/* Category & Status Pill Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rehvo-glass-dark text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
          Verified Listing
        </span>

        {isCommercial ? (
          <span className="bg-[#4263EB]/10 text-[#4263EB] border border-[#4263EB]/20 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            Commercial Space
          </span>
        ) : (
          <span className="bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20 text-[11px] font-extrabold px-3 py-1 rounded-full capitalize flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            {typeLabel} for rent
          </span>
        )}

        {property.verification_status === 'verified' && (
          <span className="bg-[#3C8D68]/10 text-[#3C8D68] border border-[#3C8D68]/20 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified by REHVO
          </span>
        )}

        <span className="rehvo-glass-subtle text-[#64748B] text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#3C8D68]" />
          Direct Owner
        </span>
      </div>

      {/* Property Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#031B2A] tracking-tight leading-tight">
        {property.title}
      </h1>

      {/* Location Bar */}
      <div className="flex items-center gap-2 text-sm text-[#64748B] font-medium pt-0.5">
        <MapPin className="w-4 h-4 text-[#0F766E] flex-shrink-0" />
        <span className="text-[#031B2A] font-semibold">
          {property.locality}, {property.city}
        </span>
        {property.address && property.address !== property.locality && (
          <span className="text-[#64748B] hidden sm:inline">• {property.address}</span>
        )}
      </div>
    </div>
  );
};
