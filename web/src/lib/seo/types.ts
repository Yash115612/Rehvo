export interface PublicPropertyImage {
  id: string;
  image_url: string;
  is_cover: boolean;
  sort_order: number;
}

export interface PublicProperty {
  id: string;
  title: string;
  type: 'flat' | 'room' | 'pg' | 'studio';
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
  bedrooms: string;
  bathrooms: number;
  area: number;
  furnishing: 'fully_furnished' | 'semi_furnished' | 'unfurnished';
  parking: string | null;
  availability: string | null;
  status: 'published';
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  amenities: string[];
  tenant_preferences: string[];
  views_count: number;
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
  minRent: number;
  maxRent: number;
  avgRent: number;
  typesBreakdown: {
    flat: number;
    room: number;
    pg: number;
    studio: number;
  };
}

/** Validates and returns a safe HTTPS image URL or null */
export function sanitizeImageUrl(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('https://')) {
    return trimmed;
  }
  return null;
}

/** Sanitizes and filters property_images to strictly valid remote HTTPS URLs */
export function sanitizePropertyImages(images?: any[]): PublicPropertyImage[] {
  if (!Array.isArray(images)) return [];
  return images
    .filter((img) => img && typeof img.image_url === 'string' && img.image_url.startsWith('https://'))
    .map((img) => ({
      id: String(img.id),
      image_url: String(img.image_url),
      is_cover: Boolean(img.is_cover),
      sort_order: Number(img.sort_order || 0),
    }));
}
