import { useMemo } from 'react';
import { Property, PropertyFilter } from '../../types';
import { CATEGORY_TYPE_MAP, METRO_AMENITIES, SearchPropertyCategory } from './searchConstants';

export type AvailabilityFilter = 'ALL' | 'IMMEDIATE' | 'WITHIN_MONTH';

export interface ExtendedSearchFilters {
  category: SearchPropertyCategory;
  nearMetro: boolean;
  availability: AvailabilityFilter;
}

interface UseSearchResultsParams {
  properties: Property[];
  query: string;
  activeFilter: PropertyFilter;
  extended: ExtendedSearchFilters;
}

function matchesCategory(property: Property, category: SearchPropertyCategory): boolean {
  const mapping = CATEGORY_TYPE_MAP[category];
  if (mapping === 'ALL') return true;
  return mapping.includes(property.property_type);
}

function matchesAvailability(property: Property, availability: AvailabilityFilter): boolean {
  if (availability === 'ALL') return true;
  const availableFrom = property.available_from.toLowerCase();
  if (availability === 'IMMEDIATE') {
    return availableFrom.includes('immediate') || availableFrom.includes('now');
  }
  return true;
}

function matchesNearMetro(property: Property): boolean {
  const haystack = [
    property.address,
    property.locality,
    property.description,
    ...property.amenities,
  ]
    .join(' ')
    .toLowerCase();
  return METRO_AMENITIES.some((term) => haystack.includes(term.toLowerCase()));
}

export function filterProperties(
  properties: Property[],
  query: string,
  activeFilter: PropertyFilter,
  extended: ExtendedSearchFilters,
): Property[] {
  let list = [...properties];

  if (query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.bhk.toLowerCase().includes(q) ||
        p.property_type.toLowerCase().replace('_', ' ').includes(q),
    );
  }

  if (activeFilter.locality && activeFilter.locality !== 'ALL') {
    list = list.filter((p) =>
      p.locality.toLowerCase().includes(activeFilter.locality.toLowerCase()),
    );
  }

  list = list.filter((p) => matchesCategory(p, extended.category));

  if (activeFilter.bhk !== 'ALL') {
    list = list.filter((p) => {
      if (activeFilter.bhk === '4+ BHK') return ['4 BHK', '5 BHK'].includes(p.bhk);
      return p.bhk === activeFilter.bhk;
    });
  }

  if (activeFilter.furnishing !== 'ALL') {
    list = list.filter((p) => p.furnishing === activeFilter.furnishing);
  }

  list = list.filter((p) => p.rent >= activeFilter.rent_min && p.rent <= activeFilter.rent_max);

  if (activeFilter.brokerage_free_only) {
    list = list.filter((p) => p.brokerage === 0);
  }

  if (activeFilter.verified_only) {
    list = list.filter((p) => p.verification_status === 'VERIFIED');
  }

  if (activeFilter.amenities.length > 0) {
    list = list.filter((p) =>
      activeFilter.amenities.every((amenity) => p.amenities.includes(amenity)),
    );
  }

  if (extended.nearMetro) {
    list = list.filter(matchesNearMetro);
  }

  if (extended.availability !== 'ALL') {
    list = list.filter((p) => matchesAvailability(p, extended.availability));
  }

  switch (activeFilter.sort_by) {
    case 'price_low':
      list.sort((a, b) => a.rent - b.rent);
      break;
    case 'price_high':
      list.sort((a, b) => b.rent - a.rent);
      break;
    case 'newest':
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case 'most_saved':
      list.sort((a, b) => (b.saves_count || 0) - (a.saves_count || 0));
      break;
    default:
      list.sort((a, b) => {
        if (a.is_sponsored && !b.is_sponsored) return -1;
        if (!a.is_sponsored && b.is_sponsored) return 1;
        return (b.sponsor_priority || 0) - (a.sponsor_priority || 0);
      });
      break;
  }

  return list;
}

export function useSearchResults({
  properties,
  query,
  activeFilter,
  extended,
}: UseSearchResultsParams) {
  return useMemo(
    () => filterProperties(properties, query, activeFilter, extended),
    [properties, query, activeFilter, extended],
  );
}

export function formatBudgetLabel(rentMin: number, rentMax: number): string {
  if (rentMin === 0 && rentMax >= 200000) return '';
  if (rentMin === 0) return `Up to ₹${(rentMax / 1000).toFixed(0)}K`;
  if (rentMax >= 200000) return `₹${(rentMin / 1000).toFixed(0)}K+`;
  return `₹${(rentMin / 1000).toFixed(0)}K–₹${(rentMax / 1000).toFixed(0)}K`;
}
