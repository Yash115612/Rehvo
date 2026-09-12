'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PublicProperty } from '@/lib/seo/types';
import { RentSearchHeader } from './RentSearchHeader';
import { RentQuickBhkRail } from './RentQuickBhkRail';
import { RentResultsHeader } from './RentResultsHeader';
import { RentFilterDrawer, RentFiltersState } from './RentFilterDrawer';
import { RentPropertyGrid } from './RentPropertyGrid';
import { RentPagination } from './RentPagination';
import { RentEmptyState } from './RentEmptyState';
import { RentErrorState } from './RentErrorState';
import { RentOwnerCta } from './RentOwnerCta';

const ITEMS_PER_PAGE = 12;

interface RentMarketplaceProps {
  initialProperties: PublicProperty[];
  initialTotalCount: number;
}

export const RentMarketplace: React.FC<RentMarketplaceProps> = ({
  initialProperties,
  initialTotalCount,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL state initialization
  const initialLocality = searchParams.get('locality') || '';
  const initialBhk = searchParams.get('bhk') || '';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || searchParams.get('max_rent') || '';
  const initialFurnishing = searchParams.get('furnishing') || '';
  const initialType = searchParams.get('type') || '';
  const initialSort = searchParams.get('sort') || 'recommended';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  // Core Marketplace State
  const [filters, setFilters] = useState<RentFiltersState>({
    locality: initialLocality,
    bhk: initialBhk,
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    furnishing: initialFurnishing,
    type: initialType,
    verifiedOnly: false,
  });

  const [currentSort, setCurrentSort] = useState<string>(initialSort);
  const [currentPage, setCurrentPage] = useState<number>(initialPage > 0 ? initialPage : 1);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Sync state to URL search parameters smoothly
  const syncToUrl = useCallback(
    (newFilters: RentFiltersState, newSort: string, newPage: number) => {
      const params = new URLSearchParams();
      if (newFilters.locality) params.set('locality', newFilters.locality);
      if (newFilters.bhk) params.set('bhk', newFilters.bhk);
      if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
      if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
      if (newFilters.furnishing) params.set('furnishing', newFilters.furnishing);
      if (newFilters.type) params.set('type', newFilters.type);
      if (newFilters.verifiedOnly) params.set('verified', 'true');
      if (newSort && newSort !== 'recommended') params.set('sort', newSort);
      if (newPage > 1) params.set('page', newPage.toString());

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router]
  );

  // Client-Side Multi-Filter Computation over the inventory
  const filteredProperties = useMemo(() => {
    let result = [...initialProperties];

    // 1. Locality Filter (Fuzzy case-insensitive search)
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
        result = result.filter((p) => p.type === 'studio' || Number(p.bedrooms) === 0);
      } else if (filters.bhk === '4+ BHK') {
        result = result.filter((p) => Number(p.bedrooms) >= 4);
      } else {
        const bhkNum = parseInt(filters.bhk.replace(/\D/g, ''), 10);
        if (!isNaN(bhkNum)) {
          result = result.filter((p) => Number(p.bedrooms) === bhkNum);
        }
      }
    }

    // 3. Min Price Filter
    if (filters.minPrice) {
      const min = parseInt(filters.minPrice, 10);
      if (!isNaN(min)) {
        result = result.filter((p) => p.price >= min);
      }
    }

    // 4. Max Price Filter
    if (filters.maxPrice) {
      const max = parseInt(filters.maxPrice, 10);
      if (!isNaN(max)) {
        result = result.filter((p) => p.price <= max);
      }
    }

    // 5. Furnishing Filter
    if (filters.furnishing) {
      result = result.filter((p) => p.furnishing === filters.furnishing);
    }

    // 6. Property Type Filter
    if (filters.type) {
      result = result.filter((p) => p.type === filters.type);
    }

    // 7. Verified Only Filter
    if (filters.verifiedOnly) {
      result = result.filter((p) => p.verification_status === 'verified');
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
    }

    return result;
  }, [initialProperties, filters, currentSort]);

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
    if (filters.type) count++;
    if (filters.verifiedOnly) count++;
    return count;
  }, [filters]);

  // Handlers
  const handleUpdateFilter = <K extends keyof RentFiltersState>(key: K, value: RentFiltersState[K]) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      syncToUrl(next, currentSort, 1);
      return next;
    });
    setCurrentPage(1);
  };

  const handleRemoveFilter = <K extends keyof RentFiltersState>(key: K) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: key === 'verifiedOnly' ? false : '' };
      syncToUrl(next, currentSort, 1);
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
      type: '',
      verifiedOnly: false,
    };
    setFilters(cleared);
    setCurrentPage(1);
    syncToUrl(cleared, currentSort, 1);
  };

  const handleBhkSelect = (bhkVal: string) => {
    handleUpdateFilter('bhk', bhkVal);
  };

  const handleSortChange = (sortVal: string) => {
    setCurrentSort(sortVal);
    syncToUrl(filters, sortVal, currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    syncToUrl(filters, currentSort, page);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    syncToUrl(filters, currentSort, 1);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* 1. Primary Residential Hero & Search Dock */}
      <RentSearchHeader
        localityInput={filters.locality}
        onLocalityChange={(val) => handleUpdateFilter('locality', val)}
        bhkInput={filters.bhk}
        onBhkChange={(val) => handleUpdateFilter('bhk', val)}
        maxBudgetInput={filters.maxPrice}
        onMaxBudgetChange={(val) => handleUpdateFilter('maxPrice', val)}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={() => handleRemoveFilter('locality')}
      />

      {/* 2. Quick Configuration BHK Rail */}
      <RentQuickBhkRail selectedBhk={filters.bhk} onSelectBhk={handleBhkSelect} />

      {/* 3. Results Summary & Sort Header */}
      <RentResultsHeader
        totalCount={totalCount}
        currentSort={currentSort}
        onSortChange={handleSortChange}
        onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
        activeFilterCount={activeFilterCount}
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAllFilters={handleClearAllFilters}
      />

      {/* 4. Residential Property Feed */}
      {hasError ? (
        <RentErrorState onRetry={() => setHasError(false)} />
      ) : totalCount === 0 ? (
        <RentEmptyState
          onClearFilters={handleClearAllFilters}
          onSelectLocality={(loc) => handleUpdateFilter('locality', loc)}
        />
      ) : (
        <>
          <RentPropertyGrid properties={paginatedProperties} isLoading={isLoading} />

          {/* 5. Pagination */}
          <RentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* 6. Advanced Filter Drawer (Desktop / Mobile Bottom Sheet) */}
      <RentFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onUpdateFilter={handleUpdateFilter}
        onApplyFilters={() => syncToUrl(filters, currentSort, 1)}
        onResetFilters={handleClearAllFilters}
        totalMatchingCount={totalCount}
      />

      {/* 7. Property Owner Conversion CTA */}
      <RentOwnerCta />
    </div>
  );
};
