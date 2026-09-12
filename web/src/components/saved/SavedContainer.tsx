'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { PublicProperty, sanitizePropertyImages, PublicFlatmate } from '@/lib/seo/types';
import { PropertyCard } from '@/components/public/PropertyCard';
import { FlatmateProfileCard } from '@/components/flatmates/FlatmateProfileCard';
import { SayHiModal } from '@/components/flatmates/SayHiModal';
import { SavedHeader } from './SavedHeader';
import { SavedTabs, SavedCategory } from './SavedTabs';
import { SavedToolbar } from './SavedToolbar';
import { SavedEmptyState } from './SavedEmptyState';
import { Loader2 } from 'lucide-react';

interface SavedContainerProps {
  seedFlatmates?: PublicFlatmate[];
}

export const SavedContainer: React.FC<SavedContainerProps> = ({ seedFlatmates = [] }) => {
  const { user, isAuthenticated, savedPropertyIds, toggleSaveProperty } = useAuth();
  const [supabase] = useState(() => createClient());

  const [activeTab, setActiveTab] = useState<SavedCategory>('all');
  const [sortBy, setSortBy] = useState('recent');
  const [properties, setProperties] = useState<PublicProperty[]>([]);
  const [flatmates, setFlatmates] = useState<PublicFlatmate[]>([]);
  const [savedFlatmateIds, setSavedFlatmateIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sayHiFlatmate, setSayHiFlatmate] = useState<PublicFlatmate | null>(null);

  // Synchronize saved items from LocalStorage and AuthContext
  const syncData = useCallback(async () => {
    let storedFlatmateIds: string[] = [];
    let storedPropertyIds: string[] = [];

    try {
      storedFlatmateIds = JSON.parse(localStorage.getItem('rehvo_saved_flatmates') || '[]');
      storedPropertyIds = JSON.parse(localStorage.getItem('rehvo_saved_properties') || '[]');
    } catch {}

    setSavedFlatmateIds(storedFlatmateIds);

    if (storedFlatmateIds.length > 0) {
      supabase
        .from('flatmate_profiles')
        .select(`
          id, user_id, photo, age, gender, profession, city, locality,
          bio, budget_min, budget_max, room_preference, move_in_date,
          lifestyle_preferences, created_at, profiles:user_id (full_name, profile_photo)
        `)
        .in('id', storedFlatmateIds)
        .eq('status', 'published')
        .then(({ data }) => {
          if (data) {
            const mapped = (data as any[]).map((row) => ({
              id: row.id,
              user_id: row.user_id,
              name: (row.profiles as any)?.full_name || 'REHVO Member',
              photo: row.photo || (row.profiles as any)?.profile_photo,
              age: row.age,
              gender: row.gender,
              profession: row.profession || 'Professional',
              city: row.city,
              locality: row.locality,
              bio: row.bio,
              budget_min: row.budget_min,
              budget_max: row.budget_max,
              room_preference: row.room_preference,
              move_in_date: row.move_in_date,
              lifestyle_preferences: row.lifestyle_preferences || [],
              created_at: row.created_at,
            }));
            setFlatmates(mapped);
          }
        });
    } else {
      setFlatmates([]);
    }

    // Combine authenticated savedPropertyIds with localStorage
    const effectivePropIds = Array.from(new Set([...savedPropertyIds, ...storedPropertyIds]));

    if (effectivePropIds.length > 0) {
      try {
        const propPromise = supabase
          .from('properties')
          .select(`
            id, title, type, description, price, deposit, maintenance, brokerage, city, state,
            locality, address, latitude, longitude, bedrooms, bathrooms, area, furnishing, parking,
            availability, status, verification_status, amenities, tenant_preferences, views_count,
            created_at, updated_at, property_images (id, image_url, is_cover, sort_order)
          `)
          .in('id', effectivePropIds)
          .eq('status', 'published');

        const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: new Error('Timeout') }), 1000)
        );

        const { data, error } = await Promise.race([propPromise, timeoutPromise]);

        if (!error && data) {
          const loadedProps = (data as any[]).map((prop: any) => ({
            ...prop,
            property_images: sanitizePropertyImages(prop.property_images),
          })) as PublicProperty[];
          setProperties(loadedProps);
        }
      } catch (e) {
        console.warn('[SavedContainer] Fetch properties error:', e);
      }
    } else {
      setProperties([]);
    }
  }, [savedPropertyIds, seedFlatmates, supabase]);

  useEffect(() => {
    syncData();

    const handleUpdate = () => {
      syncData();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('rehvo_saved_updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('rehvo_saved_updated', handleUpdate);
    };
  }, [syncData]);

  const counts = useMemo(() => {
    const homes = properties.filter((p) => p.type === 'flat' || !p.type).length;
    const commercial = properties.filter(
      (p) =>
        p.type === 'office' ||
        p.type === 'shop' ||
        p.type === 'showroom' ||
        p.type === 'warehouse' ||
        p.type === 'commercial_building' ||
        p.type === 'coworking' ||
        p.type === 'commercial_plot' ||
        p.type === 'other_commercial'
    ).length;
    const pg = properties.filter((p) => p.type === 'pg' || p.type === 'room' || p.type === 'studio').length;
    const fCount = flatmates.length;

    return {
      all: properties.length + fCount,
      homes,
      flatmates: fCount,
      commercial,
      pg,
    };
  }, [properties, flatmates]);

  const filteredProperties = useMemo(() => {
    let list = [...properties];
    if (activeTab === 'homes') {
      list = list.filter((p) => p.type === 'flat' || !p.type);
    } else if (activeTab === 'commercial') {
      list = list.filter(
        (p) =>
          p.type === 'office' ||
          p.type === 'shop' ||
          p.type === 'showroom' ||
          p.type === 'warehouse' ||
          p.type === 'commercial_building' ||
          p.type === 'coworking' ||
          p.type === 'commercial_plot' ||
          p.type === 'other_commercial'
      );
    } else if (activeTab === 'pg') {
      list = list.filter((p) => p.type === 'pg' || p.type === 'room' || p.type === 'studio');
    } else if (activeTab === 'flatmates') {
      return [];
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [properties, activeTab, sortBy]);

  const filteredFlatmates = useMemo(() => {
    if (activeTab !== 'all' && activeTab !== 'flatmates') return [];
    let list = [...flatmates];
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.budget_max - b.budget_max);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.budget_max - a.budget_max);
    }
    return list;
  }, [flatmates, activeTab, sortBy]);

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear your saved collection?')) {
      savedPropertyIds.forEach((id) => toggleSaveProperty(id));
      localStorage.removeItem('rehvo_saved_flatmates');
      localStorage.removeItem('rehvo_saved_properties');
      setSavedFlatmateIds([]);
      setProperties([]);
      setFlatmates([]);
      window.dispatchEvent(new Event('rehvo_saved_updated'));
    }
  };

  const totalVisibleCount = filteredProperties.length + filteredFlatmates.length;

  return (
    <div className="space-y-6">
      <SavedHeader totalCount={counts.all} />
      <SavedTabs activeTab={activeTab} onSelectTab={setActiveTab} counts={counts} />
      <SavedToolbar sortBy={sortBy} onSortChange={setSortBy} onClearAll={handleClearAll} totalCount={totalVisibleCount} />

      {isLoading ? (
        <div className="py-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#0F766E] animate-spin" />
        </div>
      ) : totalVisibleCount === 0 ? (
        <SavedEmptyState category={activeTab} />
      ) : (
        <div className="space-y-8">
          {filteredProperties.length > 0 && (
            <div className="space-y-4">
              {activeTab === 'all' && filteredFlatmates.length > 0 && (
                <div className="flex items-center gap-2 text-sm font-black text-[#031B2A] pt-2">
                  <span>Saved Properties ({filteredProperties.length})</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            </div>
          )}

          {filteredFlatmates.length > 0 && (
            <div className="space-y-4">
              {activeTab === 'all' && filteredProperties.length > 0 && (
                <div className="flex items-center gap-2 text-sm font-black text-[#031B2A] pt-4 border-t border-stone-200/80">
                  <span>Saved Flatmates ({filteredFlatmates.length})</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFlatmates.map((flatmate) => (
                  <FlatmateProfileCard
                    key={flatmate.id}
                    flatmate={flatmate}
                    onSayHi={(f) => setSayHiFlatmate(f)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <SayHiModal
        flatmate={sayHiFlatmate}
        isOpen={!!sayHiFlatmate}
        onClose={() => setSayHiFlatmate(null)}
      />
    </div>
  );
};
