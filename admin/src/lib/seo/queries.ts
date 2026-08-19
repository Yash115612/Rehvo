import { createPublicClient } from '../supabase/server';
import { extractPropertyIdFromSlug } from './slugs';

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
  name: string;
  photo: string | null;
  age: number | null;
  gender: string | null;
  profession: string;
  city: string;
  locality: string;
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

/** Get published properties with optional filters */
export async function getPublishedProperties(options?: {
  city?: string;
  locality?: string;
  type?: 'flat' | 'room' | 'pg' | 'studio';
  limit?: number;
  offset?: number;
}): Promise<{ properties: PublicProperty[]; totalCount: number }> {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from('properties')
      .select(
        `
        id,
        title,
        type,
        description,
        price,
        deposit,
        maintenance,
        brokerage,
        city,
        state,
        locality,
        address,
        latitude,
        longitude,
        bedrooms,
        bathrooms,
        area,
        furnishing,
        parking,
        availability,
        status,
        verification_status,
        amenities,
        tenant_preferences,
        views_count,
        created_at,
        updated_at,
        property_images (id, image_url, is_cover, sort_order)
      `,
        { count: 'exact' }
      )
      .eq('status', 'published');

    if (options?.city) {
      query = query.ilike('city', `%${options.city}%`);
    }

    if (options?.locality) {
      query = query.ilike('locality', `%${options.locality}%`);
    }

    if (options?.type) {
      query = query.eq('type', options.type);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(options?.offset || 0, (options?.offset || 0) + (options?.limit || 20) - 1);

    const { data, count, error } = await query;

    if (error || !data) {
      console.warn('[REHVO SEO] Error fetching published properties:', error);
      return { properties: [], totalCount: 0 };
    }

    return {
      properties: data as unknown as PublicProperty[],
      totalCount: count || data.length,
    };
  } catch (err) {
    console.warn('[REHVO SEO] Unexpected error fetching properties:', err);
    return { properties: [], totalCount: 0 };
  }
}

/** Get a single published property by its slug or ID */
export async function getPropertyBySlug(slugOrId: string): Promise<PublicProperty | null> {
  const propertyId = extractPropertyIdFromSlug(slugOrId);
  if (!propertyId) return null;

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('properties')
      .select(
        `
        id,
        title,
        type,
        description,
        price,
        deposit,
        maintenance,
        brokerage,
        city,
        state,
        locality,
        address,
        latitude,
        longitude,
        bedrooms,
        bathrooms,
        area,
        furnishing,
        parking,
        availability,
        status,
        verification_status,
        amenities,
        tenant_preferences,
        views_count,
        created_at,
        updated_at,
        property_images (id, image_url, is_cover, sort_order)
      `
      )
      .eq('id', propertyId)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      return null;
    }

    return data as unknown as PublicProperty;
  } catch (err) {
    console.warn('[REHVO SEO] Error loading property by slug:', err);
    return null;
  }
}

/** Get statistics and metrics for a specific locality */
export async function getLocalityStats(city: string, locality: string): Promise<LocalityStats> {
  const { properties } = await getPublishedProperties({ city, locality, limit: 100 });

  const total = properties.length;
  if (total === 0) {
    return {
      locality,
      city,
      totalListings: 0,
      minRent: 0,
      maxRent: 0,
      avgRent: 0,
      typesBreakdown: { flat: 0, room: 0, pg: 0, studio: 0 },
    };
  }

  const prices = properties.map((p) => p.price).filter((p) => p > 0);
  const minRent = Math.min(...prices);
  const maxRent = Math.max(...prices);
  const avgRent = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

  const typesBreakdown = {
    flat: properties.filter((p) => (p as any).type === 'flat').length,
    room: properties.filter((p) => (p as any).type === 'room').length,
    pg: properties.filter((p) => (p as any).type === 'pg').length,
    studio: properties.filter((p) => (p as any).type === 'studio').length,
  };

  return {
    locality,
    city,
    totalListings: total,
    minRent,
    maxRent,
    avgRent,
    typesBreakdown,
  };
}

/** Get published flatmate profiles in a city */
export async function getPublishedFlatmates(city: string = 'Mumbai'): Promise<PublicFlatmate[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('flatmate_profiles')
      .select(`
        id,
        photo,
        age,
        gender,
        profession,
        city,
        locality,
        budget_min,
        budget_max,
        room_preference,
        move_in_date,
        lifestyle_preferences,
        created_at,
        profiles:profiles!flatmate_profiles_user_id_fkey (full_name, profile_photo)
      `)
      .eq('status', 'published')
      .ilike('city', `%${city}%`)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error || !data) {
      console.warn('[REHVO SEO] Error fetching flatmates:', error);
      return [];
    }

    return data.map((row: any) => ({
      id: row.id,
      name: row.profiles?.full_name || 'Verified Flatmate',
      photo: row.photo || row.profiles?.profile_photo,
      age: row.age,
      gender: row.gender,
      profession: row.profession,
      city: row.city,
      locality: row.locality,
      budget_min: row.budget_min,
      budget_max: row.budget_max,
      room_preference: row.room_preference,
      move_in_date: row.move_in_date,
      lifestyle_preferences: row.lifestyle_preferences || [],
      created_at: row.created_at,
    }));
  } catch (err) {
    console.warn('[REHVO SEO] Error in getPublishedFlatmates:', err);
    return [];
  }
}

/** Get all published property slugs for sitemap generation */
export async function getAllPublishedPropertySlugs(): Promise<
  Array<{ id: string; title: string; locality: string; city: string; updated_at: string }>
> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('properties')
      .select('id, title, locality, city, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}
