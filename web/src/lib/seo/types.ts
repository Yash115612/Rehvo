import { PropertyType, FurnishingType, PropertyCategory } from '../types';

export interface PublicPropertyImage {
  id: string;
  image_url: string;
  is_cover: boolean;
  sort_order: number;
}

export interface PublicProperty {
  id: string;
  owner_id?: string;
  owner?: {
    id: string;
    full_name?: string;
    profile_photo?: string;
    created_at?: string;
    verification_status?: string;
  };
  title: string;
  category?: PropertyCategory;
  type: PropertyType;
  description: string;
  price: number;
  deposit: number;
  maintenance: number;
  brokerage: number;
  city: string;
  state: string;
  locality: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  bedrooms?: string | null;
  bathrooms: number;
  area: number;
  furnishing: FurnishingType;
  parking: string | null;
  availability: string | null;
  status: 'published';
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  amenities: string[];
  tenant_preferences: string[];
  views_count: number;
  // Commercial attributes
  commercial_type?: string | null;
  floor_number?: string | null;
  total_floors?: number | null;
  washrooms?: number | null;
  parking_spaces?: string | null;
  power_backup?: boolean | null;
  lift?: boolean | null;
  carpet_area?: number | null;
  possession_status?: string | null;
  lease_type?: string | null;
  road_width?: number | null;
  created_at: string;
  updated_at: string;
  property_images: PublicPropertyImage[];
}

export interface PublicFlatmate {
  id: string;
  user_id?: string;
  name: string;
  photo: string | null;
  age: number | null;
  gender: string | null;
  profession: string;
  city: string;
  locality: string;
  bio?: string | null;
  budget_min: number;
  budget_max: number;
  room_preference: string;
  move_in_date: string;
  lifestyle_preferences: string[];
  created_at: string;
}

export interface LocalityStats {
  locality: string;
  city: string;
  totalListings: number;
  total_properties?: number;
  minRent: number;
  maxRent: number;
  avgRent: number;
  typesBreakdown?: Record<string, number>;
  avg_price_1bhk?: number;
  avg_price_2bhk?: number;
  avg_price_3bhk?: number;
  min_price?: number;
  max_price?: number;
  verified_count?: number;
  popular_amenities?: string[];
}

/** Fallback safe image if an image URL is broken or invalid */
export const FALLBACK_PROPERTY_IMAGE =
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80';

export function sanitizeImageUrl(url: string | undefined | null): string {
  if (!url || typeof url !== 'string') return FALLBACK_PROPERTY_IMAGE;
  const trimmed = url.trim();
  if (
    trimmed.startsWith('file://') ||
    trimmed.startsWith('content://') ||
    trimmed.startsWith('ph://') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:')
  ) {
    return FALLBACK_PROPERTY_IMAGE;
  }
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return FALLBACK_PROPERTY_IMAGE;
  }
  return trimmed;
}

export function sanitizePropertyImages(images: any[] | undefined | null): PublicPropertyImage[] {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return [
      {
        id: 'fallback_0',
        image_url: FALLBACK_PROPERTY_IMAGE,
        is_cover: true,
        sort_order: 0,
      },
    ];
  }

  const valid = images
    .filter((img) => img && (img.image_url || img.url))
    .map((img, idx) => ({
      id: String(img.id || `img_${idx}`),
      image_url: sanitizeImageUrl(img.image_url || img.url),
      is_cover: Boolean(img.is_cover || idx === 0),
      sort_order: typeof img.sort_order === 'number' ? img.sort_order : idx,
    }));

  return valid.length > 0
    ? valid
    : [
        {
          id: 'fallback_0',
          image_url: FALLBACK_PROPERTY_IMAGE,
          is_cover: true,
          sort_order: 0,
        },
      ];
}
