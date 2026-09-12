import { Property } from '../types';

export interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  image: string;
  filterType: string;
}

export interface LifestyleCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  image: string;
  tag: string;
  filterKey: string;
}

export interface LocationItem {
  id: string;
  name: string;
  startingRent: string;
  image: string;
  popularFor: string;
  propertyCount: number;
}

/**
 * Empty fallback array.
 * All property listings are strictly loaded in real-time from Supabase PostgreSQL `properties` table.
 */
export const CURATED_FALLBACK_PROPERTIES: Property[] = [];
