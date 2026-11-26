'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { PublicProperty } from '@/lib/seo/types';
import { BreadcrumbItem } from '@/components/seo/Breadcrumbs';
import { RentHero } from './RentHero';
import { RentResultsHeader } from './RentResultsHeader';
import { RentFilterDrawer, RentFiltersState } from './RentFilterDrawer';
import { RentPropertyGrid } from './RentPropertyGrid';
import { RentPropertyMap } from './RentPropertyMap';
import { RentPagination } from './RentPagination';
import { RentEmptyState } from './RentEmptyState';
import { RentTrustSection } from './RentTrustSection';
import { VERIFIED_MUMBAI_FALLBACKS } from '@/lib/seo/fallbackProperties';

const ITEMS_PER_PAGE = 12;

interface RentPageClientProps {
  initialProperties: PublicProperty[];
  initialTotalCount: number;
  breadcrumbs?: BreadcrumbItem[];
}

export const RentPageClient: React.FC<RentPageClientProps> = ({
  initialProperties,
  initialTotalCount,
  breadcrumbs,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL search params
  const paramLocality = searchParams.get('locality') || '';
  const paramBhk = searchParams.get('bhk') || '';
  const paramMinPrice = searchParams.get('min_rent') || searchParams.get('minPrice') || '';
  const paramMaxPrice = searchParams.get('max_rent') || searchParams.get('maxPrice') || '';
  const paramType = searchParams.get('type') || '';
  const paramFurnishing = searchParams.get('furnishing') || '';
  const paramTenant = searchParams.get('tenant') || '';
  const paramVerified = searchParams.get('verified') === 'true';
  const paramOwnerOnly = searchParams.get('owner_only') === 'true';
  const paramSort = searchParams.get('sort') || 'recommended';
  const paramView = (searchParams.get('view') as 'grid' | 'list') || 'grid';
  const paramMap = searchParams.get('map') === 'true';
  const paramPage = parseInt(searchParams.get('page') || '1', 10);

  // Core Marketplace Filters State
  const [filters, setFilters] = useState<RentFiltersState>({
    locality: paramLocality,
    bhk: paramBhk,
    minPrice: paramMinPrice,
    maxPrice: paramMaxPrice,
    furnishing: paramFurnishing,
    propertyType: paramType,
    tenantPreference: paramTenant,
    amenities: [],
    verifiedOnly: paramVerified,
    ownerOnly: paramOwnerOnly,
  });

  const [currentSort, setCurrentSort] = useState<string>(paramSort);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(paramView);
  const [showMap, setShowMap] = useState<boolean>(paramMap);
  const [currentPage, setCurrentPage] = useState<number>(paramPage > 0 ? paramPage : 1);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  // Combine server properties with fallbacks so marketplace always has rich content
  const allProperties = useMemo(() => {
    if (initialProperties && initialProperties.length > 0) {
      // Merge unique properties
      const idMap = new Set(initialProperties.map((p) => p.id));
      const additional = VERIFIED_MUMBAI_FALLBACKS.filter((p) => !idMap.has(p.id));
      return [...initialProperties, ...additional];
    }
    return VERIFIED_MUMBAI_FALLBACKS;
  }, [initialProperties]);

  // Synchronize state with URL parameters
  const syncToUrl = useCallback(
    (
      newFilters: RentFiltersState,
      newSort: string,
      newView: 'grid' | 'list',
      newMap: boolean,
      newPage: number
    ) => {
      const params = new URLSearchParams();
      if (newFilters.locality) params.set('locality', newFilters.locality);
      if (newFilters.bhk) params.set('bhk', newFilters.bhk);
      if (newFilters.minPrice) params.set('min_rent', newFilters.minPrice);
      if (newFilters.maxPrice) params.set('max_rent', newFilters.maxPrice);
      if (newFilters.furnishing) params.set('furnishing', newFilters.furnishing);
      if (newFilters.propertyType) params.set('type', newFilters.propertyType);
      if (newFilters.tenantPreference) params.set('tenant', newFilters.tenantPreference);
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

  // Client-Side Multi-Filter Computation
  const filteredProperties = useMemo(() => {
    let result = [...allProperties];

    // 1. Locality Filter (Fuzzy search matching locality, title, or address)
    if (filters.locality.trim()) {
      const q = filters.locality.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.locality?.toLowerCase().includes(q) ||
          p.title?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q)
      );
    }

    // 2. BHK Filter
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

    // 3. Min Price Filter
    if (filters.minPrice) {
      const min = parseInt(filters.minPrice, 10);
      if (!isNaN(min)) {
        result = result.filter((p) => (p.price || 0) >= min);
      }
    }

    // 4. Max Price Filter
    if (filters.maxPrice) {
      const max = parseInt(filters.maxPrice, 10);
      if (!isNaN(max)) {
        result = result.filter((p) => (p.price || 0) <= max);
      }
    }

    // 5. Property Type Filter
    if (filters.propertyType) {
      result = result.filter((p) => p.type === filters.propertyType);
    }

    // 6. Furnishing Filter
    if (filters.furnishing) {
      result = result.filter((p) => p.furnishing === filters.furnishing);
    }

    // 7. Tenant Preference Filter
    if (filters.tenantPreference) {
      result = result.filter((p) => {
        if (!p.tenant_preferences || p.tenant_preferences.length === 0) return true;
        return p.tenant_preferences.includes(filters.tenantPreference);
      });
    }

    // 8. Amenities Filter (Must match all selected)
    if (filters.amenities && filters.amenities.length > 0) {
      result = result.filter((p) => {
        const pAmenities = p.amenities || [];
        return filters.amenities.every((a) => pAmenities.includes(a));
      });
    }

    // 9. 100% Verified Only
    if (filters.verifiedOnly) {
      result = result.filter((p) => p.verification_status === 'verified');
    }

    // 10. Zero Commission / Owner Only
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
      // 'recommended': Prioritize verified listings with rich photos
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
    if (filters.locality) count++;
    if (filters.bhk) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.furnishing) count++;
    if (filters.propertyType) count++;
    if (filters.tenantPreference) count++;
    if (filters.amenities.length > 0) count += filters.amenities.length;
    if (filters.verifiedOnly) count++;
    if (filters.ownerOnly) count++;
    return count;
  }, [filters]);

  // Handlers
  const handleUpdateFilter = <K extends keyof RentFiltersState>(key: K, value: RentFiltersState[K]) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      syncToUrl(next, currentSort, viewMode, showMap, 1);
      return next;
    });
    setCurrentPage(1);
  };

  const handleRemoveFilter = <K extends keyof RentFiltersState>(key: K) => {
    setFilters((prev) => {
      const next = {
        ...prev,
        [key]: key === 'verifiedOnly' || key === 'ownerOnly' ? false : key === 'amenities' ? [] : '',
      };
      syncToUrl(next, currentSort, viewMode, showMap, 1);
      return next;
    });
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    const cleared: RentFiltersState = {
      locality: '',
      bhk: '',
      minPrice: '',
      maxPrice: '',
      furnishing: '',
      propertyType: '',
      tenantPreference: '',
      amenities: [],
      verifiedOnly: false,
      ownerOnly: false,
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
    window.scrollTo({ top: 480, behavior: 'smooth' });
  };

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    syncToUrl(filters, currentSort, viewMode, showMap, 1);
    setCurrentPage(1);
  };

  return (
    <div className="w-full bg-[#F7F9FC] text-[#101828] min-h-screen">
      {/* 1. Rent Page Hero Section */}
      <RentHero
        locationValue={filters.locality}
        onLocationChange={(val) => handleUpdateFilter('locality', val)}
        bhkValue={filters.bhk}
        onBhkChange={(val) => handleUpdateFilter('bhk', val)}
        propertyTypeValue={filters.propertyType}
        onPropertyTypeChange={(val) => handleUpdateFilter('propertyType', val)}
        budgetMaxValue={filters.maxPrice}
        onBudgetMaxChange={(val) => handleUpdateFilter('maxPrice', val)}
        onSearchSubmit={handleHeroSearchSubmit}
        onSelectPopularLocation={(loc) => handleUpdateFilter('locality', loc)}
        breadcrumbs={breadcrumbs}
      />

      {/* 2. Main Marketplace Body Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Results Header (View Toggles, Sort, Active Chips) */}
        <RentResultsHeader
          totalCount={totalCount}
          currentSort={currentSort}
          onSortChange={handleSortChange}
          onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
          activeFilterCount={activeFilterCount}
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAllFilters={handleClearAllFilters}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          showMap={showMap}
          onToggleMap={handleToggleMap}
          localityQuery={filters.locality}
        />

        {/* Content Layout (Split Map Layout or Full Listings Grid) */}
        {totalCount === 0 ? (
          <RentEmptyState
            onClearFilters={handleClearAllFilters}
            onSelectLocality={(loc) => handleUpdateFilter('locality', loc)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Property Cards Column */}
            <div className={showMap ? 'lg:col-span-7 space-y-6' : 'lg:col-span-12 space-y-6'}>
              <RentPropertyGrid
                properties={paginatedProperties}
                viewMode={viewMode}
                isSplitView={showMap}
                selectedPropertyId={selectedPropertyId}
                onHoverProperty={(id) => setSelectedPropertyId(id)}
              />

              {/* Pagination */}
              <RentPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalCount={totalCount}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </div>

            {/* Desktop Sticky Map Column (when map toggle is active) */}
            {showMap && (
              <div className="hidden lg:block lg:col-span-5 sticky top-20 h-[calc(100vh-100px)]">
                <RentPropertyMap
                  properties={filteredProperties}
                  selectedPropertyId={selectedPropertyId}
                  onSelectProperty={(id) => setSelectedPropertyId(id)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Mobile Full-Screen Map Modal (when showMap is active on small screens) */}
      {showMap && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col">
          <RentPropertyMap
            properties={filteredProperties}
            selectedPropertyId={selectedPropertyId}
            onSelectProperty={(id) => setSelectedPropertyId(id)}
            onCloseMobileMap={() => setShowMap(false)}
            isMobileModal={true}
          />
        </div>
      )}

      {/* 4. REHVO Trust & Verification Section */}
      <RentTrustSection />

      {/* 5. Advanced Slide-Over Filter Drawer */}
      <RentFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onUpdateFilter={handleUpdateFilter}
        onApplyFilters={() => syncToUrl(filters, currentSort, viewMode, showMap, 1)}
        onResetFilters={handleClearAllFilters}
        totalMatchingCount={totalCount}
      />
    </div>
  );
};
