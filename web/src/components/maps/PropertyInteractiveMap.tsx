'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  School,
  Hospital,
  Coffee,
  Trees,
  ShoppingBag,
  Clock,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Train,
  Car,
  Footprints,
} from 'lucide-react';

interface PoiItem {
  name: string;
  category: 'metro' | 'school' | 'hospital' | 'food' | 'park' | 'grocery';
  distance: string;
  time: string;
  type: string;
}

interface PropertyInteractiveMapProps {
  propertyTitle: string;
  locality: string;
  city: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

const DEFAULT_POIS: PoiItem[] = [
  // Metro & Railway
  { name: 'DN Nagar Metro Station (Line 1 & 2A)', category: 'metro', distance: '450m', time: '5 min walk', type: 'Metro Station' },
  { name: 'Andheri Railway Station (Western & Harbour)', category: 'metro', distance: '1.2 km', time: '12 min walk', type: 'Suburban Railway' },
  { name: 'Versova Metro Station (Line 1)', category: 'metro', distance: '1.4 km', time: '6 min drive', type: 'Metro Station' },

  // Schools
  { name: 'Ryan International School', category: 'school', distance: '850m', time: '10 min walk', type: 'CBSE School' },
  { name: 'Bhavan’s College & Campus', category: 'school', distance: '1.1 km', time: '12 min walk', type: 'Degree College' },
  { name: 'St. Mary’s High School', category: 'school', distance: '1.6 km', time: '7 min drive', type: 'ICSE School' },

  // Hospitals
  { name: 'Kokilaben Dhirubhai Ambani Hospital', category: 'hospital', distance: '1.2 km', time: '5 min drive', type: 'Quaternary Care' },
  { name: 'CritCare Asia Multispeciality Hospital', category: 'hospital', distance: '750m', time: '8 min walk', type: 'Hospital' },

  // Food & Dining
  { name: 'Lokhandwala Food Street & Cafes', category: 'food', distance: '600m', time: '7 min walk', type: 'Dining Hub' },
  { name: 'Blue Tokai Coffee Roasters', category: 'food', distance: '900m', time: '10 min walk', type: 'Artisan Cafe' },

  // Parks
  { name: 'Lokhandwala Joggers Park', category: 'park', distance: '500m', time: '6 min walk', type: 'Public Garden' },
  { name: 'Versova Beach Promenade', category: 'park', distance: '2.1 km', time: '8 min drive', type: 'Seaside Promenade' },

  // Groceries
  { name: 'Nature’s Basket Gourmet Store', category: 'grocery', distance: '400m', time: '5 min walk', type: 'Supermarket' },
  { name: 'Reliance Smart Superstore', category: 'grocery', distance: '800m', time: '9 min walk', type: 'Hypermarket' },
];

export const PropertyInteractiveMap: React.FC<PropertyInteractiveMapProps> = ({
  propertyTitle,
  locality,
  city,
  latitude = 19.1363,
  longitude = 72.8277,
  address,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'metro' | 'school' | 'hospital' | 'food' | 'park' | 'grocery'>('metro');

  const filteredPois = activeCategory === 'all'
    ? DEFAULT_POIS
    : DEFAULT_POIS.filter((p) => p.category === activeCategory);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${propertyTitle}, ${locality}, ${city}`)}`;
  const embedMapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=15&output=embed`;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-6 p-6 sm:p-8">
      {/* Header with Walk Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0E8F73]" />
            <h2 className="text-lg sm:text-xl font-black text-[#031B2A]">
              Location &amp; Neighborhood Intelligence
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {address || `${locality}, ${city}`} &bull; Verified GPS Coordinates ({latitude.toFixed(4)}, {longitude.toFixed(4)})
          </p>
        </div>

        {/* Walkability Score Badge */}
        <div className="flex items-center gap-3 bg-emerald-50/70 border border-emerald-200/80 px-4 py-2.5 rounded-2xl self-start sm:self-auto">
          <div className="w-10 h-10 rounded-xl bg-[#0E8F73] text-white flex items-center justify-center font-black text-sm shadow-xs">
            94
          </div>
          <div className="text-left">
            <div className="text-xs font-black text-[#031B2A] flex items-center gap-1">
              <span>Walker&apos;s Paradise</span>
              <Sparkles className="w-3 h-3 text-[#0E8F73]" />
            </div>
            <div className="text-[11px] text-emerald-700 font-medium">Daily errands do not require a car</div>
          </div>
        </div>
      </div>

      {/* Interactive Map Embed Container */}
      <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
        <iframe
          title={`Map view for ${propertyTitle}`}
          src={embedMapUrl}
          className="w-full h-full border-0 filter saturate-105"
          loading="lazy"
          allowFullScreen
        />

        {/* Floating Controls Overlay */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs font-black text-[#031B2A] flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#0E8F73]" />
          <span>{locality}, {city}</span>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-3 bg-[#031B2A] hover:bg-[#0E8F73] text-white px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg transition active:scale-95"
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Transit & Major Commute Times Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Train className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-[#031B2A]">Metro Line 1 &amp; 2A</div>
            <div className="text-[11px] text-slate-500 font-medium">450m &bull; 5 min walk</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Car className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-[#031B2A]">Bandra Kurla Complex (BKC)</div>
            <div className="text-[11px] text-slate-500 font-medium">8.5 km &bull; 18 min drive</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#0E8F73] flex items-center justify-center shrink-0">
            <Navigation className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-[#031B2A]">Mumbai Airport (BOM T2)</div>
            <div className="text-[11px] text-slate-500 font-medium">6.2 km &bull; 15 min drive</div>
          </div>
        </div>
      </div>

      {/* Points of Interest (POI) Filters */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Points of Interest Within 2 KM
          </h3>
          <span className="text-xs font-bold text-[#0E8F73]">{filteredPois.length} Places Found</span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Places', icon: MapPin },
            { id: 'metro', label: 'Metro & Train', icon: Train },
            { id: 'school', label: 'Schools', icon: School },
            { id: 'hospital', label: 'Hospitals', icon: Hospital },
            { id: 'food', label: 'Cafes & Dining', icon: Coffee },
            { id: 'park', label: 'Parks', icon: Trees },
            { id: 'grocery', label: 'Groceries', icon: ShoppingBag },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                className={`h-8 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 shrink-0 transition cursor-pointer ${
                  isActive
                    ? 'bg-[#0E8F73] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* POI List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {filteredPois.map((poi, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#0E8F73]/40 transition flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="min-w-0 space-y-0.5">
                <div className="text-xs font-bold text-[#031B2A] truncate">{poi.name}</div>
                <div className="text-[11px] text-slate-400 font-medium">{poi.type}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-black text-[#0E8F73]">{poi.distance}</div>
                <div className="text-[10px] text-slate-400">{poi.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
