'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { PublicProperty } from '@/lib/seo/types';
import { BreadcrumbItem } from '@/components/seo/Breadcrumbs';
import { ExploreHeader } from './ExploreHeader';
import { ExploreFilterSidebar, ExploreFiltersState } from './ExploreFilterSidebar';
import { ExploreMobileFilterDrawer } from './ExploreMobileFilterDrawer';
import { ExploreResultsToolbar } from './ExploreResultsToolbar';
import { ExplorePropertyCard } from './ExplorePropertyCard';
import { ExplorePropertyMap } from './ExplorePropertyMap';
import { ExploreEmptyState } from './ExploreEmptyState';
import { RentPagination } from '@/components/rent/RentPagination';
import { VERIFIED_MUMBAI_FALLBACKS } from '@/lib/seo/fallbackProperties';

const ITEMS_PER_PAGE = 12;

interface ExplorePageClientProps {
  initialProperties: PublicProperty[];
  serverTotalCount: number;
  initialParams?: {
    locality?: string;
    city?: string;
    bhk?: string;
    minPrice?: string;
    maxPrice?: string;
    type?: string;
    furnishing?: string;
    sort?: string;
  };
  breadcrumbs?: BreadcrumbItem[];
}

export const ExplorePageClient: React.FC<ExplorePageClientProps> = ({
  initialProperties,
  serverTotalCount,
  initialParams,
  breadcrumbs,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read URL parameters with fallbacks to initialParams
  const paramLocality = searchParams.get('locality') || initialParams?.locality || '';
  const paramCity = searchParams.get('city') || initialParams?.city || 'Mumbai';
  const paramBhk = searchParams.get('bhk') || (initialParams?.bhk ? `${initialParams.bhk} BHK` : '');
  const paramMinPrice = searchParams.get('min_rent') || searchParams.get('minPrice') || initialParams?.minPrice || '';
  const paramMaxPrice = searchParams.get('max_rent') || searchParams.get('maxPrice') || initialParams?.maxPrice || '';
  const paramType = searchParams.get('type') || initialParams?.type || '';
  const paramFurnishing = searchParams.get('furnishing') || initialParams?.furnishing || '';
  const paramTenant = searchParams.get('tenant') || '';
  const paramVerified = searchParams.get('verified') === 'true';
  const paramOwnerOnly = searchParams.get('owner_only') === 'true';
  const paramAvailability = searchParams.get('availability') || '';
  const paramSort = searchParams.get('sort') || initialParams?.sort || 'recommended';
  const paramView = (searchParams.get('view') as 'grid' | 'list') || 'grid';
  const paramMap = searchParams.get('map') === 'true';
  const paramPage = parseInt(searchParams.get('page') || '1', 10);

  // Filter State
  const [filters, setFilters] = useState<ExploreFiltersState>({
    city: paramCity,
    locality: paramLocality,
    bhk: paramBhk,
    minPrice: paramMinPrice,
    maxPrice: paramMaxPrice,
    propertyType: paramType,
    furnishing: paramFurnishing,
    tenantPreference: paramTenant,
    amenities: [],
    verifiedOnly: paramVerified,
    ownerOnly: paramOwnerOnly,
    availability: paramAvailability,
  });

  const [currentSort, setCurrentSort] = useState<string>(paramSort);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(paramView);
  const [showMap, setShowMap] = useState<boolean>(paramMap);
  const [currentPage, setCurrentPage] = useState<number>(paramPage > 0 ? paramPage : 1);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Combine server properties with verified fallbacks
  const allProperties = useMemo(() => {
    if (initialProperties && initialProperties.length > 0) {
      const idMap = new Set(initialProperties.map((p) => p.id));
      const additional = VERIFIED_MUMBAI_FALLBACKS.filter((p) => !idMap.has(p.id));
      return [...initialProperties, ...additional];
    }
    return VERIFIED_MUMBAI_FALLBACKS;
  }, [initialProperties]);

  // Synchronize state with URL parameters
  const syncToUrl = useCallback(
    (
      newFilters: ExploreFiltersState,
      newSort: string,
      newView: 'grid' | 'list',
      newMap: boolean,
      newPage: number
    ) => {
      const params = new URLSearchParams();
      if (newFilters.city && newFilters.city !== 'Mumbai') params.set('city', newFilters.city);
      if (newFilters.locality) params.set('locality', newFilters.locality);
      if (newFilters.bhk) params.set('bhk', newFilters.bhk);
      if (newFilters.minPrice) params.set('min_rent', newFilters.minPrice);
      if (newFilters.maxPrice) params.set('max_rent', newFilters.maxPrice);
      if (newFilters.furnishing) params.set('furnishing', newFilters.furnishing);
      if (newFilters.propertyType) params.set('type', newFilters.propertyType);
      if (newFilters.tenantPreference) params.set('tenant', newFilters.tenantPreference);
      if (newFilters.availability) params.set('availability', newFilters.availability);
      if (newFilters.verifiedOnly) params.set('verified', 'true');
      if (newFilters.ownerOnly) params.set('owner_only', 'true');
      if (newSort && newSort !== 'recommended') params.set('sort', newSort);
      if (newView && newView !== 'grid') params.set('view', newView);
      if (newMap) params.set('map', 'true');
      if (newPage > 1) params.set('page', newPage.toString());

      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router]
  );

  // Live Multi-Filter Computation
  const filteredProperties = useMemo(() => {
    let result = [...allProperties];

    // 1. City Filter
    if (filters.city && filters.city !== 'All') {
      result = result.filter(
        (p) => !p.city || p.city.toLowerCase() === filters.city.toLowerCase()
      );
    }

    // 2. Locality Filter (Fuzzy search matching locality, title, address)
    if (filters.locality.trim()) {
      const q = filters.locality.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.locality?.toLowerCase().includes(q) ||
          p.title?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q)
      );
    }

    // 3. BHK Filter
    if (filters.bhk) {
      if (filters.bhk === 'Studio') {
        result = result.filter((p) => p.type === 'studio' || p.bedrooms === '0');
      } else if (filters.bhk === '4+ BHK') {
        result = result.filter((p) => {
          const num = parseInt((p.bedrooms || '0').replace(/\D/g, ''), 10);
          return num >= 4;
        });
      } else if (filters.bhk === '1 RK') {
        result = result.filter(
          (p) =>
            p.type === 'room' ||
            p.bedrooms?.toLowerCase().includes('1 rk') ||
            p.title?.toLowerCase().includes('1 rk')
        );
      } else {
        const targetBhk = parseInt(filters.bhk.replace(/\D/g, ''), 10);
        if (!isNaN(targetBhk)) {
          result = result.filter((p) => {
            const num = parseInt((p.bedrooms || '0').replace(/\D/g, ''), 10);
            return num === targetBhk;
          });
        }
      }
    }

    // 4. Min Price Filter
    if (filters.minPrice) {
      const min = parseInt(filters.minPrice, 10);
      if (!isNaN(min)) {
        result = result.filter((p) => (p.price || 0) >= min);
      }
    }

    // 5. Max Price Filter
    if (filters.maxPrice) {
      const max = parseInt(filters.maxPrice, 10);
      if (!isNaN(max)) {
        result = result.filter((p) => (p.price || 0) <= max);
      }
    }

    // 6. Property Type Filter
    if (filters.propertyType) {
      result = result.filter((p) => p.type === filters.propertyType);
    }

    // 7. Furnishing Filter
    if (filters.furnishing) {
      result = result.filter((p) => p.furnishing === filters.furnishing);
    }

    // 8. Tenant Preference Filter
    if (filters.tenantPreference) {
      result = result.filter((p) => {
        if (!p.tenant_preferences || p.tenant_preferences.length === 0) return true;
        return p.tenant_preferences.includes(filters.tenantPreference);
      });
    }

    // 9. Amenities Filter (Must match all selected)
    if (filters.amenities && filters.amenities.length > 0) {
      result = result.filter((p) => {
        const pAmenities = p.amenities || [];
        return filters.amenities.every((a) => pAmenities.includes(a));
      });
    }

    // 10. Availability Filter
    if (filters.availability) {
      if (filters.availability === 'immediate') {
        result = result.filter(
          (p) =>
            !p.availability ||
            p.availability.toLowerCase().includes('immediate') ||
            p.availability.toLowerCase().includes('now')
        );
      }
    }

    // 11. 100% Verified Only
    if (filters.verifiedOnly) {
      result = result.filter((p) => p.verification_status === 'verified');
    }

    // 12. Zero Commission / Direct Owner Only
    if (filters.ownerOnly) {
      result = result.filter((p) => !p.commission || p.commission === 0);
    }

    // Sorting
    if (currentSort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (currentSort === 'area_desc') {
      result.sort((a, b) => (b.area || 0) - (a.area || 0));
    } else {
      // 'recommended'
      result.sort((a, b) => {
        const scoreA = (a.verification_status === 'verified' ? 100 : 0) + (a.property_images?.length || 0);
        const scoreB = (b.verification_status === 'verified' ? 100 : 0) + (b.property_images?.length || 0);
        return scoreB - scoreA;
      });
    }

    return result;
  }, [allProperties, filters, currentSort]);

  // Paginated Slicing
  const totalCount = filteredProperties.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  // Active Filter Count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.city && filters.city !== 'Mumbai') count++;
    if (filters.locality) count++;
    if (filters.bhk) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.furnishing) count++;
    if (filters.propertyType) count++;
    if (filters.tenantPreference) count++;
    if (filters.availability) count++;
    if (filters.amenities.length > 0) count += filters.amenities.length;
    if (filters.verifiedOnly) count++;
    if (filters.ownerOnly) count++;
    return count;
  }, [filters]);

  // Handlers
  const handleUpdateFilter = <K extends keyof ExploreFiltersState>(key: K, value: ExploreFiltersState[K]) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      syncToUrl(next, currentSort, viewMode, showMap, 1);
      return next;
    });
    setCurrentPage(1);
  };

  const handleRemoveFilter = <K extends keyof ExploreFiltersState>(key: K) => {
    setFilters((prev) => {
      const next = {
        ...prev,
        [key]:
          key === 'verifiedOnly' || key === 'ownerOnly'
            ? false
            : key === 'amenities'
            ? []
            : key === 'city'
            ? 'Mumbai'
            : '',
      };
      syncToUrl(next, currentSort, viewMode, showMap, 1);
      return next;
    });
    setCurrentPage(1);
  };

  const handleResetAll = () => {
    const cleared: ExploreFiltersState = {
      city: 'Mumbai',
      locality: '',
      bhk: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      furnishing: '',
      tenantPreference: '',
      amenities: [],
      verifiedOnly: false,
      ownerOnly: false,
      availability: '',
    };
    setFilters(cleared);
    setCurrentPage(1);
    syncToUrl(cleared, currentSort, viewMode, showMap, 1);
  };

  const handleSortChange = (sortVal: string) => {
    setCurrentSort(sortVal);
    syncToUrl(filters, sortVal, viewMode, showMap, currentPage);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    syncToUrl(filters, currentSort, mode, showMap, currentPage);
  };

  const handleToggleMap = () => {
    const nextMap = !showMap;
    setShowMap(nextMap);
    syncToUrl(filters, currentSort, viewMode, nextMap, currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    syncToUrl(filters, currentSort, viewMode, showMap, page);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    syncToUrl(filters, currentSort, viewMode, showMap, 1);
    setCurrentPage(1);
  };

  return (
    <div className="w-full bg-[#F7F9FC] text-[#101828] min-h-screen">
      {/* 1. Explore Page Header */}
      <ExploreHeader
        locationValue={filters.locality}
        onLocationChange={(val) => handleUpdateFilter('locality', val)}
        onSearchSubmit={handleHeaderSearchSubmit}
        totalCount={totalCount}
        breadcrumbs={breadcrumbs}
      />

      {/* 2. Main Layout Container: Left Sidebar + Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start gap-8">
          {/* LEFT FILTER SIDEBAR (DESKTOP - PERMANENTLY VISIBLE) */}
          <ExploreFilterSidebar
            filters={filters}
            onUpdateFilter={handleUpdateFilter}
            onResetAll={handleResetAll}
            activeFilterCount={activeFilterCount}
          />

          {/* RIGHT PROPERTY RESULTS AREA */}
          <main className="flex-1 min-w-0 space-y-6">
            {/* Results Toolbar (Counts, Sort, Grid/List, Map, Active Chips) */}
            <ExploreResultsToolbar
              totalCount={totalCount}
              currentSort={currentSort}
              onSortChange={handleSortChange}
              onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
              activeFilterCount={activeFilterCount}
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAllFilters={handleResetAll}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              showMap={showMap}
              onToggleMap={handleToggleMap}
              localityQuery={filters.locality}
            />

            {/* Results Content */}
            {totalCount === 0 ? (
              <ExploreEmptyState
                onClearFilters={handleResetAll}
                onSelectLocality={(loc) => handleUpdateFilter('locality', loc)}
              />
            ) : showMap ? (
              /* Map Split View */
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <div className="xl:col-span-7 space-y-5">
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-5' : 'space-y-4'}>
                    {paginatedProperties.map((prop) => (
                      <ExplorePropertyCard
                        key={prop.id}
                        property={prop}
                        viewMode={viewMode}
                        isSelected={selectedPropertyId === prop.id}
                        onHover={(id) => setSelectedPropertyId(id)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <RentPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalCount={totalCount}
                    itemsPerPage={ITEMS_PER_PAGE}
                  />
                </div>

                {/* Sticky Interactive Map */}
                <div className="hidden xl:block xl:col-span-5 sticky top-24 h-[calc(100vh-120px)]">
                  <ExplorePropertyMap
                    properties={filteredProperties}
                    selectedPropertyId={selectedPropertyId}
                    onSelectProperty={(id) => setSelectedPropertyId(id)}
                  />
                </div>
              </div>
            ) : (
              /* Standard Full-Width Grid / List View */
              <div className="space-y-6">
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                      : 'space-y-4'
                  }
                >
                  {paginatedProperties.map((prop) => (
                    <ExplorePropertyCard
                      key={prop.id}
                      property={prop}
                      viewMode={viewMode}
                      isSelected={selectedPropertyId === prop.id}
                      onHover={(id) => setSelectedPropertyId(id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <RentPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalCount={totalCount}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 3. Mobile Map Full-Screen Modal (when showMap is active on small screens) */}
      {showMap && (
        <div className="xl:hidden fixed inset-0 z-50 bg-white flex flex-col">
          <ExplorePropertyMap
            properties={filteredProperties}
            selectedPropertyId={selectedPropertyId}
            onSelectProperty={(id) => setSelectedPropertyId(id)}
            onCloseMobileMap={() => setShowMap(false)}
            isMobileModal={true}
          />
        </div>
      )}

      {/* 4. Mobile Slide-Over Filter Drawer */}
      <ExploreMobileFilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        filters={filters}
        onUpdateFilter={handleUpdateFilter}
        onResetAll={handleResetAll}
        onApply={() => syncToUrl(filters, currentSort, viewMode, showMap, 1)}
        totalMatchingCount={totalCount}
      />
    </div>
  );
};
