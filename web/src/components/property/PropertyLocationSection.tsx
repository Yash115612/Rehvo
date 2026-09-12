import React from 'react';
import {
  MapPin,
  Train,
  Building,
  Navigation,
  Compass,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { MUMBAI_LOCALITIES, normalizeLocalitySlug } from '@/lib/seo/slugs';

interface PropertyLocationSectionProps {
  property: PublicProperty;
}

export const PropertyLocationSection: React.FC<PropertyLocationSectionProps> = ({ property }) => {
  const localitySlug = normalizeLocalitySlug(property.locality);
  const localityData = MUMBAI_LOCALITIES[localitySlug];

  const hasCoords = property.latitude && property.longitude;
  const mapsUrl = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${property.address ? `${property.address}, ` : ''}${property.locality}, ${property.city}`
      )}`;

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#031B2A] tracking-tight">
              Location & Neighborhood
            </h2>
            <p className="text-xs text-[#64748B] font-medium mt-0.5">
              {property.locality}, {property.city}
              {property.address ? ` • ${property.address}` : ''}
            </p>
          </div>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rehvo-glass-subtle hover:bg-white text-[#031B2A] text-xs font-extrabold px-4 py-2 rounded-full inline-flex items-center gap-1.5 transition active:scale-95 shadow-2xs w-fit"
        >
          <Navigation className="w-3.5 h-3.5 text-[#0F766E]" />
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3 h-3 text-[#64748B]" />
        </a>
      </div>

      {/* Styled Interactive Location Preview Card */}
      <div className="relative aspect-[16/7] sm:aspect-[21/9] w-full rounded-[20px] overflow-hidden border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center">
        {/* Subtle Map Background Pattern & Visual Pin */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative text-center p-6 space-y-2 z-10">
          <div className="w-12 h-12 rounded-full bg-[#0F766E] text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-800/20 animate-bounce">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-black text-[#031B2A]">
              {property.locality}
            </h4>
            <p className="text-xs text-[#64748B] font-semibold mt-0.5">
              {property.city}, Maharashtra • Verified Neighborhood
            </p>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0F766E] hover:underline pt-1"
          >
            <span>View exact street directions</span>
            <span>→</span>
          </a>
        </div>
      </div>

      {/* Genuine Locality Transit & Connectivity Information */}
      {localityData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#E2E8F0]">
          {localityData.metroStation && (
            <div className="p-4 rounded-[18px] bg-[#F8FAFC]/80 border border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-1.5">
                <Train className="w-4 h-4 text-[#0F766E]" />
                <span className="text-xs font-bold text-[#031B2A]">Metro Access</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                {localityData.metroStation}
              </p>
            </div>
          )}

          {localityData.railwayStation && (
            <div className="p-4 rounded-[18px] bg-[#F8FAFC]/80 border border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-1.5">
                <Train className="w-4 h-4 text-[#4263EB]" />
                <span className="text-xs font-bold text-[#031B2A]">Railway Station</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                {localityData.railwayStation}
              </p>
            </div>
          )}

          {localityData.commercialHubs && localityData.commercialHubs.length > 0 && (
            <div className="p-4 rounded-[18px] bg-[#F8FAFC]/80 border border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-1.5">
                <Building className="w-4 h-4 text-[#3C8D68]" />
                <span className="text-xs font-bold text-[#031B2A]">Nearby Hubs</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                {localityData.commercialHubs.slice(0, 2).join(', ')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
