'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MapPin, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';
import { useAuth } from '@/lib/auth/AuthContext';
import { PublicProperty } from '@/lib/seo/types';
import { generatePropertySlug } from '@/lib/seo/slugs';

interface ResidentialRentSectionProps {
  properties: PublicProperty[];
}

export const ResidentialRentSection: React.FC<ResidentialRentSectionProps> = ({ properties }) => {
  const { savedPropertyIds, toggleSaveProperty } = useAuth();
  const displayProperties = properties.slice(0, 3);
  const spotlight = displayProperties[0];
  const supporting = displayProperties.slice(1, 3);

  if (!spotlight) return null;

  const spotlightSlug = generatePropertySlug(spotlight);
  const spotlightCover =
    spotlight.property_images?.find((img) => img.is_cover)?.image_url ||
    spotlight.property_images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80';

  const spotlightBhk = spotlight.bedrooms ? `${spotlight.bedrooms} BHK` : spotlight.type ? `${spotlight.type} Flat` : '2 BHK';
  const spotlightArea = spotlight.area ? `${spotlight.area} sq ft` : '950 sq ft';
  const spotlightFurnishing = spotlight.furnishing ? spotlight.furnishing.replace('_', ' ') : 'Semi-Furnished';
  const isSpotlightSaved = savedPropertyIds.includes(spotlight.id);

  return (
    <section className="py-14 sm:py-20 bg-[#FFFFFF] border-b border-[#E2E8F0]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CURATED RESIDENCES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#031B2A] tracking-tight">
              Places worth seeing
            </h2>
            <p className="text-sm sm:text-base font-medium text-[#64748B] mt-2 max-w-xl">
              Hand-picked verified homes across Mumbai with authentic photos, transparent pricing, and verified marketplace.
            </p>
          </div>

          <Link
            href="/rent"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#0F766E] hover:text-[#064E3B] group"
          >
            <span>Explore all homes</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Editorial Composition: 1 Large Spotlight (7 cols) + 2 Supporting (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 1. Spotlight Feature Card */}
          <article className="lg:col-span-7 group bg-[#F8FAFC] rounded-[28px] overflow-hidden border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between p-5 sm:p-7">
            <div>
              {/* Photo Area */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#F1F5F9] mb-5">
                <Link href={`/property/${spotlightSlug}`} className="block w-full h-full">
                  <RehvoImage
                    src={spotlightCover}
                    alt={spotlight.title}
                    fill
                    fallbackCategory="property"
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                </Link>

                <div className="absolute top-3.5 left-3.5 flex items-center gap-2 pointer-events-none">
                  <span className="bg-[#031B2A]/90 backdrop-blur-xs text-white text-[10.5px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>VERIFIED LISTING</span>
                  </span>
                  <span className="bg-[#FFFFFF]/90 backdrop-blur-xs text-[#031B2A] text-[10.5px] font-bold px-2.5 py-1 rounded-full hidden sm:inline-block">
                    Featured
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSaveProperty(spotlight.id);
                  }}
                  aria-label={isSpotlightSaved ? 'Unsave property' : 'Save property'}
                  className={`absolute top-3.5 right-3.5 w-10 h-10 rounded-full flex items-center justify-center transition shadow-sm ${
                    isSpotlightSaved
                      ? 'bg-[#0F766E] text-white'
                      : 'bg-white/90 text-[#031B2A] hover:bg-white hover:text-[#0F766E]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSpotlightSaved ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Spotlight Info */}
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-black text-[#031B2A]">
                    ₹{spotlight.price?.toLocaleString('en-IN')}
                    <span className="text-xs text-[#64748B] font-semibold ml-1">/month</span>
                  </span>
                  <span className="text-xs text-[#64748B] font-bold bg-[#FFFFFF] px-3 py-1 rounded-full border border-[#E2E8F0]">
                    Deposit: ₹{(spotlight.price ? spotlight.price * 2 : 50000).toLocaleString('en-IN')}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-[#031B2A] group-hover:text-[#0F766E] transition-colors">
                  <Link href={`/property/${spotlightSlug}`}>{spotlight.title}</Link>
                </h3>

                <p className="text-xs sm:text-sm text-[#64748B] font-medium flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#0F766E] shrink-0" />
                  <span>{spotlight.locality}, Mumbai</span>
                </p>

                {/* Specs Bar */}
                <div className="py-2.5 px-4 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs text-[#031B2A] font-bold">
                  <span>{spotlightBhk}</span>
                  <span className="text-[#E2E8F0]">•</span>
                  <span>{spotlightArea}</span>
                  <span className="text-[#E2E8F0]">•</span>
                  <span className="capitalize">{spotlightFurnishing}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 mt-4 border-t border-[#E2E8F0]">
              <Link
                href={`/property/${spotlightSlug}`}
                className="w-full py-3 rounded-xl bg-[#031B2A] hover:bg-[#0F766E] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>View Featured Residence</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>

          {/* 2. Supporting Curated Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {supporting.map((prop) => {
              const propSlug = generatePropertySlug(prop);
              const propCover =
                prop.property_images?.find((img) => img.is_cover)?.image_url ||
                prop.property_images?.[0]?.image_url ||
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80';
              const propBhk = prop.bedrooms ? `${prop.bedrooms} BHK` : prop.type ? `${prop.type} Flat` : '2 BHK';
              const propArea = prop.area ? `${prop.area} sq ft` : '850 sq ft';
              const isPropSaved = savedPropertyIds.includes(prop.id);

              return (
                <article
                  key={prop.id}
                  className="group bg-[#F8FAFC] rounded-[24px] p-4 sm:p-5 border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between flex-1"
                >
                  <div className="flex gap-4 items-center">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-[#F1F5F9] shrink-0">
                      <Link href={`/property/${propSlug}`} className="block w-full h-full">
                        <RehvoImage
                          src={propCover}
                          alt={prop.title}
                          fill
                          fallbackCategory="property"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="128px"
                        />
                      </Link>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-[#031B2A]">
                          ₹{prop.price?.toLocaleString('en-IN')}
                          <span className="text-[11px] text-[#64748B] font-semibold">/mo</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSaveProperty(prop.id);
                          }}
                          aria-label="Save property"
                          className="p-1.5 text-[#64748B] hover:text-[#0F766E] transition"
                        >
                          <Heart className={`w-4 h-4 ${isPropSaved ? 'fill-[#0F766E] text-[#0F766E]' : ''}`} />
                        </button>
                      </div>

                      <h4 className="text-sm font-bold text-[#031B2A] group-hover:text-[#0F766E] transition-colors truncate">
                        <Link href={`/property/${propSlug}`}>{prop.title}</Link>
                      </h4>

                      <p className="text-xs text-[#64748B] flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-[#0F766E] shrink-0" />
                        <span>{prop.locality}, Mumbai</span>
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748B] pt-1">
                        <span className="bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E2E8F0]">{propBhk}</span>
                        <span className="bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E2E8F0]">{propArea}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-bold text-[#031B2A] group-hover:text-[#0F766E] transition-colors">
                    <span>View Property Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
