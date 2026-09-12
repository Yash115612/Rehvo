'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { PublicFlatmate } from '@/lib/seo/types';
import { FlatmatesHero } from './FlatmatesHero';
import { FlatmatesQuickFilters } from './FlatmatesQuickFilters';
import { FlatmatesFilterDrawer } from './FlatmatesFilterDrawer';
import { RecommendedMatches } from './RecommendedMatches';
import { NearbyFlatmates } from './NearbyFlatmates';
import { RoomSeekersSection } from './RoomSeekersSection';
import { FlatmateDiscoveryGrid } from './FlatmateDiscoveryGrid';
import { CreateFlatmateCta } from './CreateFlatmateCta';
import { SayHiModal } from './SayHiModal';

interface FlatmatesContainerProps {
  initialFlatmates: PublicFlatmate[];
}

export const FlatmatesContainer: React.FC<FlatmatesContainerProps> = ({ initialFlatmates }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const initialLocality = searchParams.get('locality') || searchParams.get('q') || '';
  const initialBudget = searchParams.get('budget') || searchParams.get('max_rent') || '';
  const initialRoom = searchParams.get('room') || searchParams.get('room_preference') || '';
  const initialFilter = searchParams.get('filter') || 'all';

  // Search State
  const [searchQuery, setSearchQuery] = useState(initialLocality);
  const [maxBudget, setMaxBudget] = useState(initialBudget);
  const [roomPreference, setRoomPreference] = useState(initialRoom);
  const [activeQuickFilter, setActiveQuickFilter] = useState(initialFilter);
  const [sortBy, setSortBy] = useState('recommended');

  // Filter Drawer State
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [drawerFilters, setDrawerFilters] = useState({
    roomPreference: initialRoom,
    minBudget: 0,
    maxBudget: initialBudget ? Number(initialBudget) : 60000,
    locality: initialLocality,
    moveInTiming: '',
    lifestyleTags: [] as string[],
  });

  // Modal State
  const [sayHiFlatmate, setSayHiFlatmate] = useState<PublicFlatmate | null>(null);

  // Sync state to URL params cleanly
  const updateUrlParams = useCallback(
    (paramsObj: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(paramsObj).forEach(([key, val]) => {
        if (val) {
          params.set(key, val);
        } else {
          params.delete(key);
        }
      });
      const queryString = params.toString();
      const newUrl = queryString ? (pathname + '?' + queryString) : pathname;
      window.history.replaceState(null, '', newUrl);
    },
    [pathname, searchParams]
  );

  // Handle Quick Filter Tab Click
  const handleSelectQuickFilter = (tabId: string) => {
    setActiveQuickFilter(tabId);
    if (tabId === 'all') {
      setRoomPreference('');
      setMaxBudget('');
      updateUrlParams({ filter: null, room: null, budget: null });
    } else if (tabId === 'private_room') {
      setRoomPreference('private_room');
      updateUrlParams({ filter: 'private_room', room: 'private_room' });
    } else if (tabId === 'shared_room') {
      setRoomPreference('shared_room');
      updateUrlParams({ filter: 'shared_room', room: 'shared_room' });
    } else if (tabId === 'under_15k') {
      setMaxBudget('15000');
      updateUrlParams({ filter: 'under_15k', budget: '15000' });
    } else if (tabId === 'under_25k') {
      setMaxBudget('25000');
      updateUrlParams({ filter: 'under_25k', budget: '25000' });
    } else {
      updateUrlParams({ filter: tabId });
    }
  };

  // Reset all filters
  const handleClearAllFilters = () => {
    setSearchQuery('');
    setMaxBudget('');
    setRoomPreference('');
    setActiveQuickFilter('all');
    setDrawerFilters({
      roomPreference: '',
      minBudget: 0,
      maxBudget: 60000,
      locality: '',
      moveInTiming: '',
      lifestyleTags: [],
    });
    updateUrlParams({ locality: null, q: null, budget: null, max_rent: null, room: null, filter: null });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({
      locality: searchQuery.trim() || null,
      budget: maxBudget || null,
      room: roomPreference || null,
    });
  };

  // Active filter count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (drawerFilters.roomPreference) count++;
    if (drawerFilters.locality) count++;
    if (drawerFilters.moveInTiming) count++;
    if (drawerFilters.maxBudget < 60000) count++;
    count += drawerFilters.lifestyleTags.length;
    return count;
  }, [drawerFilters]);

  // Filter and Sort Flatmates
  const filteredFlatmates = useMemo(() => {
    let result = [...initialFlatmates];

    // 1. Text Search (locality, name, profession, bio)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (f) =>
          f.locality.toLowerCase().includes(q) ||
          f.city.toLowerCase().includes(q) ||
          f.name.toLowerCase().includes(q) ||
          f.profession.toLowerCase().includes(q) ||
          (f.bio && f.bio.toLowerCase().includes(q))
      );
    }

    // 2. Room Preference
    const targetRoom = drawerFilters.roomPreference || roomPreference;
    if (targetRoom) {
      result = result.filter((f) => f.room_preference === targetRoom);
    }

    // 3. Max Budget
    const targetBudget = maxBudget ? Number(maxBudget) : drawerFilters.maxBudget;
    if (targetBudget && targetBudget < 60000) {
      result = result.filter((f) => f.budget_max <= targetBudget);
    }

    // 4. Locality
    if (drawerFilters.locality) {
      result = result.filter((f) =>
        f.locality.toLowerCase().includes(drawerFilters.locality.toLowerCase())
      );
    }

    // 5. Move in timing
    if (drawerFilters.moveInTiming) {
      result = result.filter((f) =>
        f.move_in_date.toLowerCase().includes(drawerFilters.moveInTiming.toLowerCase())
      );
    }

    // 6. Quick Filters special modes
    if (activeQuickFilter === 'move_in_soon') {
      result = result.filter((f) => f.move_in_date.toLowerCase().includes('immediate'));
    } else if (activeQuickFilter === 'wfh') {
      result = result.filter((f) => f.lifestyle_preferences?.includes('WFH'));
    } else if (activeQuickFilter === 'vegetarian') {
      result = result.filter((f) => f.lifestyle_preferences?.includes('Vegetarian'));
    }

    // 7. Lifestyle Tags from Drawer
    if (drawerFilters.lifestyleTags.length > 0) {
      result = result.filter((f) =>
        drawerFilters.lifestyleTags.every((t) => f.lifestyle_preferences?.includes(t))
      );
    }

    // 8. Sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'budget_asc') {
      result.sort((a, b) => a.budget_max - b.budget_max);
    } else if (sortBy === 'budget_desc') {
      result.sort((a, b) => b.budget_max - a.budget_max);
    } else if (sortBy === 'move_in_soon') {
      result.sort((a, b) => (a.move_in_date === 'Immediate' ? -1 : 1));
    } else {
      // Recommended default
      result.sort((a, b) => (b.lifestyle_preferences?.length || 0) - (a.lifestyle_preferences?.length || 0));
    }

    return result;
  }, [
    initialFlatmates,
    searchQuery,
    maxBudget,
    roomPreference,
    activeQuickFilter,
    drawerFilters,
    sortBy,
  ]);

  return (
    <div className="space-y-6">
      {/* Hero Section with Search Dock */}
      <FlatmatesHero
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          updateUrlParams({ locality: val.trim() || null });
        }}
        maxBudget={maxBudget}
        onMaxBudgetChange={(val) => {
          setMaxBudget(val);
          updateUrlParams({ budget: val || null });
        }}
        roomPreference={roomPreference}
        onRoomPreferenceChange={(val) => {
          setRoomPreference(val);
          updateUrlParams({ room: val || null });
        }}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={() => {
          setSearchQuery('');
          updateUrlParams({ locality: null, q: null });
        }}
      />

      {/* Quick Filter Rail */}
      <FlatmatesQuickFilters
        activeQuickFilter={activeQuickFilter}
        onSelectQuickFilter={handleSelectQuickFilter}
        onOpenFilterDrawer={() => setFilterDrawerOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* Advanced Filter Drawer */}
      <FlatmatesFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={drawerFilters}
        onFilterChange={(newFilters) => {
          setDrawerFilters(newFilters);
          if (newFilters.roomPreference) setRoomPreference(newFilters.roomPreference);
          if (newFilters.maxBudget < 60000) setMaxBudget(String(newFilters.maxBudget));
        }}
        onReset={handleClearAllFilters}
      />

      {/* Section 01: Recommended Matches */}
      <RecommendedMatches
        flatmates={filteredFlatmates}
        onSayHi={(f) => setSayHiFlatmate(f)}
      />

      {/* Section 02: Flatmates Near You */}
      <NearbyFlatmates
        flatmates={filteredFlatmates}
        onSayHi={(f) => setSayHiFlatmate(f)}
      />

      {/* Section 03: People Looking for a Room */}
      <RoomSeekersSection
        flatmates={filteredFlatmates}
        onSayHi={(f) => setSayHiFlatmate(f)}
      />

      {/* Section 04: All Flatmate Profiles Discovery Grid */}
      <FlatmateDiscoveryGrid
        flatmates={filteredFlatmates}
        onSayHi={(f) => setSayHiFlatmate(f)}
        onClearFilters={handleClearAllFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Section 05: Create Profile CTA */}
      <CreateFlatmateCta />

      {/* Say Hi & Instant Connect Modal */}
      <SayHiModal
        flatmate={sayHiFlatmate}
        isOpen={!!sayHiFlatmate}
        onClose={() => setSayHiFlatmate(null)}
      />
    </div>
  );
};
