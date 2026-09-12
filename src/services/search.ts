/**
 * REHVO Search Service
 * Advanced property & flatmate search, recent searches, and saved search alerts
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Property, PropertyFilter } from '../types';
import { mapSupabasePropertyToApp } from './properties';

export interface SavedSearch {
  id: string;
  user_id: string;
  title: string;
  category: string;
  locality?: string;
  city: string;
  budget_min?: number;
  budget_max?: number;
  bhk?: string[];
  furnishing?: string[];
  property_types?: string[];
  notify_email: boolean;
  notify_push: boolean;
  created_at: string;
}

export interface RecentSearch {
  id: string;
  user_id: string;
  query_text: string;
  filter_payload: Partial<PropertyFilter>;
  created_at: string;
}

/**
 * Execute advanced property search with full-text search, compound filters, sorting, and pagination
 */
export async function searchPropertiesAdvanced(
  filter: Partial<PropertyFilter> & { query?: string },
  limit: number = 20,
  offset: number = 0
): Promise<{ success: boolean; data: Property[]; count?: number; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true, data: [] };
  }

  try {
    let query = supabase
      .from('properties')
      .select(`
        *,
        property_images (*),
        profiles:owner_id (full_name, phone, profile_photo)
      `, { count: 'exact' })
      .eq('status', 'published');

    // Full text query across title, locality, city, address, description
    if (filter.query && filter.query.trim()) {
      const q = filter.query.trim();
      query = query.or(`title.ilike.%${q}%,locality.ilike.%${q}%,city.ilike.%${q}%,address.ilike.%${q}%,description.ilike.%${q}%`);
    }

    if (filter.locality && filter.locality !== 'ALL') {
      query = query.ilike('locality', `%${filter.locality}%`);
    }

    if (filter.city && filter.city !== 'ALL') {
      query = query.ilike('city', `%${filter.city}%`);
    }

    if (filter.bhk && filter.bhk !== 'ALL') {
      query = query.eq('bedrooms', filter.bhk);
    }

    if (filter.property_type && filter.property_type !== 'ALL') {
      query = query.eq('type', String(filter.property_type).toLowerCase());
    }

    const minPrice = filter.rent_min ?? (filter as any).budget_min;
    if (minPrice !== undefined && minPrice > 0) {
      query = query.gte('price', minPrice);
    }

    const maxPrice = filter.rent_max ?? (filter as any).budget_max;
    if (maxPrice !== undefined && maxPrice > 0 && maxPrice < 200000) {
      query = query.lte('price', maxPrice);
    }

    if (filter.category && filter.category !== 'ALL') {
      query = query.eq('category', String(filter.category).toLowerCase());
    }

    if (filter.furnishing && filter.furnishing !== 'ALL') {
      query = query.eq('furnishing', String(filter.furnishing).toLowerCase().replace(/ /g, '_'));
    }

    if (filter.brokerage_free_only) {
      query = query.eq('brokerage', 0);
    }

    if (filter.verified_only) {
      query = query.eq('verification_status', 'verified');
    }

    // Sorting
    switch (filter.sort_by) {
      case 'price_low':
        query = query.order('price', { ascending: true });
        break;
      case 'price_high':
        query = query.order('price', { ascending: false });
        break;
      case 'most_saved':
        query = query.order('saves_count', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return { success: false, data: [], error: error.message || 'Search failed' };
    }

    const properties: Property[] = (data || []).map((row: any) => {
      const images: any[] = (row.property_images || [])
        .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((img: any) => ({
          id: img.id,
          property_id: img.property_id,
          url: img.image_url,
          is_cover: img.is_cover,
          sort_order: img.sort_order,
        }));

      return mapSupabasePropertyToApp(row, images, row.profiles);
    });

    return { success: true, data: properties, count: count || properties.length };
  } catch (err: any) {
    return { success: false, data: [], error: err.message || 'Search failed' };
  }
}

/**
 * Record a search in recent searches history
 */
export async function recordRecentSearch(
  queryText: string,
  filterPayload: Partial<PropertyFilter> = {}
): Promise<void> {
  if (!isSupabaseConfigured() || !queryText.trim()) return;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('recent_searches').insert({
      user_id: user.id,
      query_text: queryText.trim(),
      filter_payload: filterPayload,
    });
  } catch {
    // Record recent search error handled silently
  }
}

/**
 * Fetch recent search history for current user
 */
export async function getRecentSearches(): Promise<RecentSearch[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('recent_searches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

/**
 * Save a search query to receive instant property alerts
 */
export async function saveSearchAlert(
  title: string,
  filter: Partial<PropertyFilter>,
  notifyPush: boolean = true,
  notifyEmail: boolean = true
): Promise<{ success: boolean; data?: SavedSearch; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'User must be authenticated to save searches.' };

    const minBudget = filter.rent_min ?? (filter as any).budget_min;
    const maxBudget = filter.rent_max ?? (filter as any).budget_max;

    const { data, error } = await supabase
      .from('saved_searches')
      .insert({
        user_id: user.id,
        title: title || `${filter.locality || 'Mumbai'} Rental Alert`,
        category: (filter.category as string) || 'residential',
        locality: filter.locality || null,
        budget_min: minBudget || null,
        budget_max: maxBudget || null,
        bhk: filter.bhk && filter.bhk !== 'ALL' ? [filter.bhk] : null,
        furnishing: filter.furnishing && filter.furnishing !== 'ALL' ? [filter.furnishing] : null,
        notify_push: notifyPush,
        notify_email: notifyEmail,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save search alert.' };
  }
}

/**
 * Fetch saved searches for current user
 */
export async function getSavedSearches(): Promise<SavedSearch[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

/**
 * Delete a saved search alert
 */
export async function deleteSavedSearch(savedSearchId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;

  try {
    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('id', savedSearchId);

    if (error) throw error;
    return true;
  } catch {
    return false;
  }
}
