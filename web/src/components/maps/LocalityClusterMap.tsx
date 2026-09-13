'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  ExternalLink,
  Layers,
  Sparkles,
  Train,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { generatePropertySlug } from '@/lib/seo/slugs';

interface LocalityClusterMapProps {
  localityName: string;
  cityName: string;
  latitude: number;
  longitude: number;
  properties: PublicProperty[];
}

export const LocalityClusterMap: React.FC<LocalityClusterMapProps> = ({
  localityName,
  cityName,
  latitude,
  longitude,
  properties,
}) => {
  const [selectedProperty, setSelectedProperty] = useState<PublicProperty | null>(
    properties[0] || null
  );

  const embedMapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&output=embed`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${localityName}, ${cityName}`)}`;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0E8F73]" />
            <h2 className="text-lg sm:text-xl font-black text-[#031B2A]">
              Interactive Locality Map &amp; Verified Clusters
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {localityName}, {cityName} &bull; Verified direct-owner properties mapped with live transit connections
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#0E8F73] text-xs font-black border border-emerald-200">
            {properties.length} Verified Properties Mapped
          </span>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <span>Full Map</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Map + Selected Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Canvas (2 cols) */}
        <div className="lg:col-span-2 relative h-[340px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
          <iframe
            title={`Interactive map of ${localityName}`}
            src={embedMapUrl}
            className="w-full h-full border-0 filter saturate-105"
            loading="lazy"
            allowFullScreen
          />

          {/* Floating Locality Pill */}
          <div className="absolute top-3 left-3 bg-[#031B2A]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-white text-xs font-black flex items-center gap-1.5 shadow-md">
            <MapPin className="w-3.5 h-3.5 text-[#0E8F73]" />
            <span>{localityName} Hub</span>
          </div>

          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-bold text-slate-700 border border-slate-200">
            💡 Tap property cards below to preview locations
          </div>
        </div>

        {/* Selected Property Preview & Cluster List (1 col) */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Cluster Highlights
            </h3>

            {selectedProperty ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-200">
                  <img
                    src={selectedProperty.property_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600'}
                    alt={selectedProperty.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-base font-black text-[#031B2A]">
                    ₹{selectedProperty.price.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-500">/mo</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 line-clamp-1">
                    {selectedProperty.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {selectedProperty.bedrooms ? `${selectedProperty.bedrooms} BHK` : 'Flat'} &bull; {selectedProperty.locality}
                  </p>
                </div>

                <Link
                  href={`/property/${generatePropertySlug(selectedProperty)}`}
                  className="w-full h-9 rounded-xl bg-[#0E8F73] hover:bg-[#0B725C] text-white text-xs font-black flex items-center justify-center gap-1.5 transition"
                >
                  <span>View Full Listing &amp; Photos</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ) : null}
          </div>

          {/* Quick Property Selector Chips */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-400">Available in this zone:</div>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
              {properties.slice(0, 6).map((p) => {
                const isSelected = selectedProperty?.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProperty(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#031B2A] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    ₹{(p.price / 1000).toFixed(0)}k &bull; {p.bedrooms ? `${p.bedrooms}BHK` : p.type}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
