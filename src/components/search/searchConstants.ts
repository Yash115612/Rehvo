import { PropertyType } from '../../types';

export const SEARCH_COLORS = {
  background: '#F8F7F4',
  primary: '#6C4DFF',
  darkText: '#171522',
  muted: '#777482',
  white: '#FFFFFF',
  verified: '#32B768',
  coral: '#FF735C',
  border: '#E8E5EC',
};

export const RECENT_SEARCHES = ['Andheri West', 'Powai', 'Bandra West'];

export const POPULAR_LOCATIONS = [
  'Andheri West',
  'Powai',
  'Bandra West',
  'Goregaon',
  'Thane',
  'Near Metro',
];

export type SearchPropertyCategory =
  | 'All'
  | 'Flats'
  | 'PG / Co-living'
  | 'Rooms'
  | 'Studios'
  | 'Flatmates';

export const PROPERTY_CATEGORIES: SearchPropertyCategory[] = [
  'All',
  'Flats',
  'PG / Co-living',
  'Rooms',
  'Studios',
  'Flatmates',
];

export const CATEGORY_TYPE_MAP: Record<SearchPropertyCategory, PropertyType[] | 'ALL'> = {
  All: 'ALL',
  Flats: ['FLAT', 'APARTMENT'],
  'PG / Co-living': ['PG', 'CO_LIVING'],
  Rooms: ['PRIVATE_ROOM', 'SHARED_ROOM'],
  Studios: ['STUDIO'],
  Flatmates: ['SHARED_ROOM', 'CO_LIVING'],
};

export const BUDGET_PRESETS = [
  { label: '₹0', min: 0, max: 200000 },
  { label: '₹10K', min: 0, max: 10000 },
  { label: '₹20K', min: 0, max: 20000 },
  { label: '₹30K', min: 0, max: 30000 },
  { label: '₹50K+', min: 50000, max: 200000 },
  { label: '₹1L+', min: 100000, max: 200000 },
];

export const METRO_AMENITIES = ['Metro', 'Near Metro', 'Railway', 'Station'];
