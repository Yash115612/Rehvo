'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  X,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Minimize2,
  Navigation,
  ShieldCheck,
  Bed,
  Layers,
} from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { generatePropertySlug, getSafeImageUrl } from '@/lib/seo/slugs';
import { MUMBAI_COORDINATE_MAP } from '@/services/locationService';

interface RentPropertyMapProps {
  properties: PublicProperty[];
  selectedPropertyId?: string | null;
  onSelectProperty?: (id: string | null) => void;
  onCloseMobileMap?: () => void;
  isMobileModal?: boolean;
}

// Coordinate bounding box for Mumbai (South Mumbai to Borivali/Thane)
const MUMBAI_BOUNDS = {
  minLat: 18.90, // South Mumbai / Colaba
  maxLat: 19.30, // Borivali / Thane
  minLng: 72.78, // Arabian Sea Coast / Versova
  maxLng: 73.05, // Navi Mumbai / Thane East
};

export const RentPropertyMap: React.FC<RentPropertyMapProps> = ({
  properties,
  selectedPropertyId = null,
  onSelectProperty,
  onCloseMobileMap,
  isMobileModal = false,
}) => {
  const [activePinId, setActivePinId] = useState<string | null>(selectedPropertyId);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Sync external selection
  useEffect(() => {
    if (selectedPropertyId) {
      setActivePinId(selectedPropertyId);
    }
  }, [selectedPropertyId]);

  // Resolve coordinates for all properties
  const mappedProperties = useMemo(() => {
    return properties.map((prop, idx) => {
      let lat = prop.latitude;
      let lng = prop.longitude;

      if (!lat || !lng) {
        // Resolve from locality map
        const locMatch = MUMBAI_COORDINATE_MAP.find((m) =>
          prop.locality?.toLowerCase().includes(m.suburb.toLowerCase()) ||
          m.name.toLowerCase().includes(prop.locality?.toLowerCase() || '')
        );

        if (locMatch) {
          // Add slight jitter so overlapping locality pins don't hide each other
          const jitterLat = ((idx % 5) - 2) * 0.0035;
          const jitterLng = (((idx * 3) % 5) - 2) * 0.0035;
          lat = locMatch.latitude + jitterLat;
          lng = locMatch.longitude + jitterLng;
        } else {
          // Default to Central Mumbai with offset
          lat = 19.1136 + ((idx % 6) - 3) * 0.012;
          lng = 72.8697 + (((idx * 2) % 6) - 3) * 0.012;
        }
      }

      return {
        ...prop,
        resolvedLat: lat,
        resolvedLng: lng,
      };
    });
  }, [properties]);

  const activeProperty = useMemo(() => {
    return mappedProperties.find((p) => p.id === activePinId) || null;
  }, [mappedProperties, activePinId]);

  // Project lat/lng to percentage within map container
  const getMarkerPosition = (lat: number, lng: number) => {
    const latSpan = MUMBAI_BOUNDS.maxLat - MUMBAI_BOUNDS.minLat;
    const lngSpan = MUMBAI_BOUNDS.maxLng - MUMBAI_BOUNDS.minLng;

    // Y axis is inverted (North is top = 0%)
    const top = ((MUMBAI_BOUNDS.maxLat - lat) / latSpan) * 100;
    const left = ((lng - MUMBAI_BOUNDS.minLng) / lngSpan) * 100;

    return {
      top: `${Math.max(5, Math.min(95, top))}%`,
      left: `${Math.max(5, Math.min(95, left))}%`,
    };
  };

  const formatPriceK = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${Math.round(price / 1000)}k`;
  };

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#EEF2F6] rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-xs">
      {/* Top Map Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs pointer-events-auto flex items-center gap-2 text-xs font-bold text-[#001741]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{properties.length} Homes on Mumbai Map</span>
        </div>

        {isMobileModal && (
          <button
            onClick={onCloseMobileMap}
            className="w-9 h-9 rounded-xl bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 pointer-events-auto"
            aria-label="Close Map"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Interactive Map Visual Layer */}
      <div className="relative flex-1 w-full h-full overflow-hidden select-none bg-[#E5ECF2]">
        {/* Subtle Map Grid & Vector Roads */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapGrid)" />
            {/* Coastal Outline Representation */}
            <path
              d="M 120 0 Q 140 150 160 300 T 130 500 T 90 700"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="3"
              strokeDasharray="4 2"
            />
            {/* Western Express Highway Route */}
            <path
              d="M 220 0 L 210 200 L 195 400 L 175 600"
              fill="none"
              stroke="#FDBA74"
              strokeWidth="2.5"
            />
          </svg>
        </div>

        {/* Neighborhood Ambient Labels */}
        <div className="absolute top-[20%] left-[28%] text-[11px] font-extrabold text-slate-400/80 pointer-events-none uppercase tracking-wider">
          Borivali
        </div>
        <div className="absolute top-[38%] left-[24%] text-[11px] font-extrabold text-slate-400/80 pointer-events-none uppercase tracking-wider">
          Andheri West
        </div>
        <div className="absolute top-[42%] left-[48%] text-[11px] font-extrabold text-slate-400/80 pointer-events-none uppercase tracking-wider">
          Powai
        </div>
        <div className="absolute top-[54%] left-[22%] text-[11px] font-extrabold text-slate-400/80 pointer-events-none uppercase tracking-wider">
          Bandra West
        </div>
        <div className="absolute top-[56%] left-[40%] text-[11px] font-extrabold text-slate-400/80 pointer-events-none uppercase tracking-wider">
          BKC
        </div>
        <div className="absolute top-[70%] left-[20%] text-[11px] font-extrabold text-slate-400/80 pointer-events-none uppercase tracking-wider">
          Worli
        </div>
        <div className="absolute top-[82%] left-[18%] text-[11px] font-extrabold text-slate-400/80 pointer-events-none uppercase tracking-wider">
          South Mumbai
        </div>

        {/* Property Price Pins */}
        {mappedProperties.map((prop) => {
          const isSelected = prop.id === activePinId;
          const pos = getMarkerPosition(prop.resolvedLat, prop.resolvedLng);

          return (
            <button
              key={prop.id}
              onClick={() => {
                setActivePinId(prop.id);
                onSelectProperty?.(prop.id);
              }}
              style={{ top: pos.top, left: pos.left }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-10 ${
                isSelected ? 'scale-110 z-30' : 'hover:scale-105'
              }`}
            >
              <div
                className={`px-2.5 py-1 rounded-full text-xs font-extrabold shadow-md flex items-center gap-1 transition-colors ${
                  isSelected
                    ? 'bg-[#001741] text-white ring-2 ring-[#F97316] ring-offset-1'
                    : 'bg-white text-[#001741] border border-slate-300 hover:bg-[#001741] hover:text-white'
                }`}
              >
                <span>{formatPriceK(prop.price)}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating Active Property Card (Preview) */}
      {activeProperty && (
        <div className="absolute bottom-3 left-3 right-3 z-30">
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-200">
            <div className="relative w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">
              <Image
                src={activeProperty.property_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&auto=format&fit=crop&q=80'}
                alt={activeProperty.title}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#001741]">
                <span>₹{activeProperty.price?.toLocaleString('en-IN')}/mo</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                  Zero Commission
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">
                {activeProperty.title}
              </h4>
              <p className="text-[11px] text-slate-500 truncate">
                {activeProperty.locality}, Mumbai &bull; {activeProperty.bedrooms ? `${activeProperty.bedrooms} BHK` : 'Studio'}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Link
                href={`/property/${generatePropertySlug(activeProperty)}`}
                className="p-2 rounded-xl bg-[#001741] text-white hover:bg-[#0B1F3A] transition"
                aria-label="View full details"
              >
                <ChevronRight size={16} />
              </Link>
              <button
                onClick={() => setActivePinId(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 transition"
                aria-label="Close preview"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
