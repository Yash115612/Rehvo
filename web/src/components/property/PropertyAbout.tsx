'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';

interface PropertyAboutProps {
  property: PublicProperty;
}

export const PropertyAbout: React.FC<PropertyAboutProps> = ({ property }) => {
  const [expanded, setExpanded] = useState(false);

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

  const defaultDescription = isCommercial
    ? `This prime ${property.type.replace(/_/g, ' ')} is conveniently located in ${property.locality}, ${property.city}. Featuring direct main road frontage, elevator connectivity, verified commercial clearance, and verified listing directly through REHVO.`
    : `Well-maintained ${property.bedrooms ? `${property.bedrooms} BHK ` : ''}${property.type.replace(/_/g, ' ')} situated in the sought-after neighborhood of ${property.locality}, ${property.city}. Features excellent cross-ventilation, natural sunlight, dedicated building security, and direct owner leasing with verified marketplace.`;

  const descriptionText = property.description || defaultDescription;
  const isLongText = descriptionText.length > 280;

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
          <FileText className="w-4 h-4" />
        </div>
        <h2 className="text-lg sm:text-xl font-black text-[#031B2A] tracking-tight">
          About this property
        </h2>
      </div>

      <div className="text-sm text-[#031B2A]/80 leading-relaxed whitespace-pre-line font-normal">
        {isLongText && !expanded ? (
          <p>
            {descriptionText.slice(0, 260).trim()}...
          </p>
        ) : (
          <p>{descriptionText}</p>
        )}
      </div>

      {isLongText && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-black text-[#0F766E] hover:text-[#064E3B] inline-flex items-center gap-1 transition"
        >
          <span>{expanded ? 'Show less' : 'Read full description'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
};
