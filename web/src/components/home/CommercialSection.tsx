'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, MapPin, Maximize2 } from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { RehvoImage } from '@/components/ui/RehvoImage';

interface CommercialSectionProps {
  commercialProperties?: PublicProperty[];
}

export const CommercialSection: React.FC<CommercialSectionProps> = ({
  commercialProperties = [],
}) => {
  const featured = commercialProperties[0] || null;
  const supporting = commercialProperties.slice(1, 4);

  const fallbackCommercials = [
    {
      id: 'comm-1',
      title: 'Plug & Play Tech Office in Powai',
      locality: 'Powai',
      price: 85000,
      area: '1,200',
      image:
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'comm-2',
      title: 'Boutique Retail Showroom in Bandra West',
      locality: 'Bandra West',
      price: 120000,
      area: '850',
      image:
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'comm-3',
      title: 'Managed Coworking Desks in Andheri East',
      locality: 'Andheri East',
      price: 9500,
      area: 'Dedicated Desk',
      image:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F766E] bg-[#CCFBF1] px-2.5 py-0.5 rounded-md border border-[#99F6E4]/60 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-[#0F766E]" />
                FOR BUSINESS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Commercial Spaces
            </h2>
            <p className="text-sm font-medium text-stone-500 mt-1">
              Offices, retail shops, showrooms and coworking spaces across Mumbai's prime commercial zones.
            </p>
          </div>

          <Link
            href="/commercial"
            className="text-xs font-bold text-[#0F766E] hover:text-[#064E3B] flex items-center gap-1 transition"
          >
            <span>Explore Commercial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 1 Large Dominant + 3 Stacked Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Large Featured Commercial Tile (Takes 7 cols) */}
          <Link
            href={featured ? `/property/${featured.id}` : '/commercial'}
            className="lg:col-span-7 group relative h-[360px] sm:h-[400px] rounded-3xl overflow-hidden bg-stone-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6 sm:p-8"
          >
            <RehvoImage
              src={
                featured?.property_images?.[0]?.image_url ||
                'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80'
              }
              alt={featured?.title || 'Commercial Office in BKC Mumbai'}
              fill
              fallbackCategory="commercial"
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 z-10 pointer-events-none" />

            <div className="relative z-20 flex items-center justify-between">
              <span className="bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
                Grade-A Workspace
              </span>
              <span className="bg-[#0F766E] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                Verified Listing
              </span>
            </div>

            <div className="relative z-20">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ₹{featured ? featured.price.toLocaleString('en-IN') : '1,50,000'}
                </span>
                <span className="text-xs text-stone-300 font-semibold">/month</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-1">
                {featured?.title || 'Modern Fitted Corporate Office in BKC'}
              </h3>

              <div className="flex items-center gap-4 text-xs font-semibold text-stone-200">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>{featured?.locality || 'Bandra Kurla Complex'}, Mumbai</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>{featured?.carpet_area || featured?.area || '1,850'} sq ft</span>
                </div>
              </div>
            </div>
          </Link>

          {/* 3 Smaller Commercial Cards (Takes 5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            {(supporting.length > 0 ? supporting : fallbackCommercials).map((comm, idx) => {
              const commTitle = 'title' in comm ? comm.title : 'Commercial Space';
              const commPrice = 'price' in comm ? comm.price : 50000;
              const commLoc = 'locality' in comm ? comm.locality : 'Mumbai';
              const commArea =
                'carpet_area' in comm
                  ? comm.carpet_area
                  : 'area' in comm
                  ? comm.area
                  : '1,000';
              const commImg =
                'property_images' in comm && comm.property_images?.[0]?.image_url
                  ? comm.property_images[0].image_url
                  : 'image' in comm
                  ? (comm as any).image
                  : fallbackCommercials[idx % fallbackCommercials.length].image;
              const commHref = 'id' in comm && !comm.id.startsWith('comm-') ? `/property/${comm.id}` : '/commercial';

              return (
                <Link
                  key={idx}
                  href={commHref}
                  className="group bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                    <RehvoImage
                      src={commImg}
                      alt={commTitle}
                      fill
                      fallbackCategory="commercial"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="96px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-black text-stone-900">
                        ₹{commPrice?.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-stone-500 font-semibold">/mo</span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#0F766E] transition line-clamp-1 mb-1">
                      {commTitle}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span className="truncate">{commLoc}</span>
                      <span>•</span>
                      <span>{commArea} sq ft</span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#0F766E] group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
