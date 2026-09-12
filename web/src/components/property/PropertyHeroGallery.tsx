'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Share2,
  Heart,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Grid,
  Check,
} from 'lucide-react';
import { PublicProperty, PublicPropertyImage } from '@/lib/seo/types';
import { RehvoImage } from '@/components/ui/RehvoImage';
import { useAuth } from '@/lib/auth/AuthContext';

interface PropertyHeroGalleryProps {
  property: PublicProperty;
}

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80';

export const PropertyHeroGallery: React.FC<PropertyHeroGalleryProps> = ({ property }) => {
  const router = useRouter();
  const { user, isAuthenticated, isSaved, toggleSaveProperty } = useAuth();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const images: PublicPropertyImage[] =
    property.property_images && property.property_images.length > 0
      ? property.property_images
      : [
          {
            id: 'fallback_0',
            image_url: DEFAULT_COVER,
            is_cover: true,
            sort_order: 0,
          },
        ];

  const totalImages = images.length;
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

  const saved = isSaved(property.id);

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev + 1) % totalImages);
      }
      if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev - 1 + totalImages) % totalImages);
      }
    },
    [lightboxOpen, totalImages]
  );

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, handleKeyDown]);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setLightboxOpen(true);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const stored = JSON.parse(localStorage.getItem('rehvo_saved_properties') || '[]');
      const isAlready = stored.includes(property.id);
      const nextStored = isAlready
        ? stored.filter((id: string) => id !== property.id)
        : [...stored, property.id];
      localStorage.setItem('rehvo_saved_properties', JSON.stringify(nextStored));
      window.dispatchEvent(new Event('rehvo_saved_updated'));
    } catch {}

    if (user) {
      if (isSaving) return;
      setIsSaving(true);
      try {
        await toggleSaveProperty(property.id);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window === 'undefined') return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Verified Rental in ${property.locality}, ${property.city}: ${property.title} for ₹${property.price.toLocaleString('en-IN')}/month`,
          url: window.location.href,
        });
        return;
      } catch {
        // user cancelled or share failed, fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      // ignore clipboard error
    }
  };

  return (
    <>
      <section className="relative w-full mb-6 sm:mb-8">
        {/* Floating Top Nav Bar (Liquid-Glass Capsules) */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push(isCommercial ? '/commercial' : '/rent');
              }
            }}
            className="rehvo-glass-subtle hover:bg-white/80 text-[#031B2A] text-xs font-extrabold px-3.5 py-2 rounded-full inline-flex items-center gap-1.5 transition active:scale-95 shadow-2xs"
            aria-label="Back to listings"
          >
            <ArrowLeft className="w-4 h-4 text-[#031B2A]" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="rehvo-glass-subtle hover:bg-white/80 text-[#031B2A] text-xs font-bold px-3 py-2 rounded-full inline-flex items-center gap-1.5 transition active:scale-95 shadow-2xs"
              aria-label="Share property"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#3C8D68]" />
                  <span className="text-[#3C8D68]">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#64748B]" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`rehvo-glass-subtle hover:bg-white/80 text-xs font-bold px-3.5 py-2 rounded-full inline-flex items-center gap-1.5 transition active:scale-95 shadow-2xs ${
                saved ? 'text-[#0F766E]' : 'text-[#031B2A]'
              }`}
              aria-label={saved ? 'Unsave property' : 'Save property'}
            >
              <Heart
                className={`w-4 h-4 transition-transform ${
                  saved ? 'fill-[#0F766E] text-[#0F766E] scale-110' : 'text-[#64748B]'
                }`}
              />
              <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* DESKTOP GALLERY (~65-70% Primary + 2-3 Stacked Right) */}
        <div className="hidden md:grid md:grid-cols-12 gap-3 h-[460px] lg:h-[520px] rounded-[28px] overflow-hidden border border-[#E2E8F0] bg-white p-2 shadow-sm">
          {/* Main Dominant Image (Left 8 Cols ~67%) */}
          <div
            onClick={() => openLightbox(0)}
            className="md:col-span-8 relative h-full w-full rounded-[22px] overflow-hidden bg-[#F1F5F9] cursor-pointer group"
          >
            <RehvoImage
              src={images[0]?.image_url || DEFAULT_COVER}
              alt={`${property.title} main picture`}
              fill
              priority
              fallbackCategory={isCommercial ? 'commercial' : 'property'}
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 70vw, 65vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Badges Over Primary Image */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 pointer-events-none">
              <span className="rehvo-glass-dark text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Verified Listing
              </span>
              {property.verification_status === 'verified' && (
                <span className="bg-[#3C8D68]/95 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
              {isCommercial && (
                <span className="bg-[#4263EB]/95 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Commercial Space
                </span>
              )}
            </div>

            {/* Expand Overlay Pill */}
            <div className="absolute bottom-4 left-4 rehvo-glass-subtle px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-[#031B2A] group-hover:bg-white transition shadow-sm">
              <Maximize2 className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Click to view fullscreen</span>
            </div>
          </div>

          {/* Secondary Stacked Images (Right 4 Cols ~33%) */}
          <div className="md:col-span-4 flex flex-col gap-3 h-full">
            {images.slice(1, 3).map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={() => openLightbox(idx + 1)}
                className="relative flex-1 w-full rounded-[20px] overflow-hidden bg-[#F1F5F9] cursor-pointer group"
              >
                <RehvoImage
                  src={img.image_url}
                  alt={`${property.title} preview ${idx + 2}`}
                  fill
                  fallbackCategory={isCommercial ? 'commercial' : 'property'}
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="30vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
            ))}

            {/* If only 1 image exists, show high-trust placeholder tiles */}
            {images.length === 1 && (
              <div
                onClick={() => openLightbox(0)}
                className="relative flex-1 w-full rounded-[20px] overflow-hidden bg-[#F8FAFC] border border-dashed border-[#CBD5E1] flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-white transition"
              >
                <CheckCircle2 className="w-6 h-6 text-[#3C8D68] mb-1.5" />
                <span className="text-xs font-extrabold text-[#031B2A]">Verified Direct Listing</span>
                <span className="text-[11px] text-[#64748B] mt-0.5">Physical photos verified by REHVO</span>
              </div>
            )}

            {/* "View All Photos" Button Tile */}
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="rehvo-glass-subtle hover:bg-white text-[#031B2A] font-extrabold text-xs py-3 px-4 rounded-[18px] flex items-center justify-center gap-2 transition active:scale-98 border border-[#E2E8F0] shadow-2xs"
            >
              <Grid className="w-4 h-4 text-[#0F766E]" />
              <span>View all {totalImages} photos</span>
            </button>
          </div>
        </div>

        {/* MOBILE GALLERY (Touch-Friendly Carousel with Active Counter) */}
        <div className="md:hidden relative rounded-[24px] overflow-hidden bg-[#F1F5F9] border border-[#E2E8F0] aspect-[4/3]">
          <div
            className="flex h-full w-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
            onScroll={(e) => {
              const target = e.currentTarget;
              const index = Math.round(target.scrollLeft / target.clientWidth);
              setMobileIndex(index);
            }}
          >
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={() => openLightbox(idx)}
                className="relative flex-shrink-0 w-full h-full snap-center bg-[#F1F5F9]"
              >
                <RehvoImage
                  src={img.image_url}
                  alt={`${property.title} picture ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  fallbackCategory={isCommercial ? 'commercial' : 'property'}
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            ))}
          </div>

          {/* Mobile Overlay Badges */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 pointer-events-none">
            <span className="rehvo-glass-dark text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Verified Listing
            </span>
            {property.verification_status === 'verified' && (
              <span className="bg-[#3C8D68]/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          {/* Mobile Photo Count Pill */}
          <div className="absolute bottom-3.5 right-3.5 rehvo-glass-dark text-white text-xs font-extrabold px-3 py-1 rounded-full pointer-events-none">
            {mobileIndex + 1} / {totalImages}
          </div>
        </div>
      </section>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-[#031B2A]/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <span className="text-sm font-extrabold tracking-wide">
                {activePhotoIndex + 1} / {totalImages}
              </span>
              <span className="text-xs text-stone-400 hidden sm:inline">•</span>
              <span className="text-xs text-stone-300 font-medium hidden sm:inline truncate max-w-md">
                {property.title}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Close fullscreen gallery"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Large Image & Navigation Arrows */}
          <div className="relative flex-1 flex items-center justify-center my-4 max-w-7xl mx-auto w-full">
            {totalImages > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActivePhotoIndex((prev) => (prev - 1 + totalImages) % totalImages)
                }
                className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition active:scale-95"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
              <RehvoImage
                src={images[activePhotoIndex]?.image_url || DEFAULT_COVER}
                alt={`${property.title} fullscreen view`}
                fill
                fallbackCategory={isCommercial ? 'commercial' : 'property'}
                className="object-contain rounded-2xl"
                sizes="100vw"
                priority
              />
            </div>

            {totalImages > 1 && (
              <button
                type="button"
                onClick={() => setActivePhotoIndex((prev) => (prev + 1) % totalImages)}
                className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition active:scale-95"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          {totalImages > 1 && (
            <div className="max-w-4xl mx-auto w-full overflow-x-auto flex items-center justify-center gap-2 py-2 no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                    idx === activePhotoIndex
                      ? 'ring-2 ring-[#0F766E] scale-105 opacity-100'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  <RehvoImage
                    src={img.image_url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    fallbackCategory={isCommercial ? 'commercial' : 'property'}
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
