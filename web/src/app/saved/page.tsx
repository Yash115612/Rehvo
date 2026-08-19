'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Building, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { PropertyCard } from '@/components/public/PropertyCard';
import { PublicProperty, sanitizePropertyImages } from '@/lib/seo/types';
import { AppDownloadBanner } from '@/components/public/AppDownloadBanner';
import { Breadcrumb } from '@/components/public/Breadcrumb';

export default function SavedPropertiesPage() {
  const { user, isAuthenticated, isLoading: authLoading, savedPropertyIds } = useAuth();
  const [supabase] = useState(() => createClient());
  const [properties, setProperties] = useState<PublicProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSavedProperties() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      if (savedPropertyIds.length === 0) {
        setProperties([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('properties')
          .select(
            `
            id,
            title,
            type,
            description,
            price,
            deposit,
            maintenance,
            brokerage,
            city,
            state,
            locality,
            address,
            latitude,
            longitude,
            bedrooms,
            bathrooms,
            area,
            furnishing,
            parking,
            availability,
            status,
            verification_status,
            amenities,
            tenant_preferences,
            views_count,
            created_at,
            updated_at,
            property_images (id, image_url, is_cover, sort_order)
          `
          )
          .in('id', savedPropertyIds)
          .eq('status', 'published');

        if (error) throw error;

        if (isMounted && data) {
          const sanitized = data.map((prop: any) => ({
            ...prop,
            property_images: sanitizePropertyImages(prop.property_images),
          })) as PublicProperty[];
          setProperties(sanitized);
        }
      } catch (err) {
        console.error('[SavedPropertiesPage] Error loading saved properties:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSavedProperties();

    return () => {
      isMounted = false;
    };
  }, [user, savedPropertyIds, supabase]);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Saved Properties', url: '/saved' },
  ];

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl p-10 sm:p-14 border border-stone-200 shadow-sm text-center max-w-xl mx-auto my-12 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900">Sign in to view saved homes</h1>
          <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            Save verified flats and rooms to review later, schedule visits, and compare rental options across devices.
          </p>
          <div className="pt-4 flex items-center justify-center gap-3">
            <Link
              href="/login?next=/saved"
              className="bg-stone-900 hover:bg-black text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup?next=/saved"
              className="bg-purple-50 text-purple-700 font-bold text-xs px-6 py-3.5 rounded-xl hover:bg-purple-100 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumb items={breadcrumbs} />

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm mt-4 mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-wider mb-2 w-fit">
          <Heart className="w-3.5 h-3.5 fill-current" />
          Saved Collection
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Your Saved Properties
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          {savedPropertyIds.length} {savedPropertyIds.length === 1 ? 'home' : 'homes'} saved in your account
        </p>
      </div>

      {/* Grid */}
      <section className="mb-16">
        {isLoading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-xl mx-auto my-8">
            <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-stone-800">You haven&apos;t saved any properties yet</h2>
            <p className="text-xs text-stone-500 mt-1.5 mb-6">
              Tap the heart icon on any property card while browsing to save homes here.
            </p>
            <Link
              href="/mumbai"
              className="inline-block bg-stone-900 hover:bg-black text-white font-bold text-xs px-6 py-3 rounded-xl transition"
            >
              Browse Mumbai Rentals
            </Link>
          </div>
        )}
      </section>

      <AppDownloadBanner />
    </div>
  );
}
