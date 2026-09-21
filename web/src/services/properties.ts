import { createClient } from '@/lib/supabase/client';
import {
  Property,
  PropertyImage,
  PropertyStatus,
  PropertyType,
  FurnishingType,
  PropertyCategory,
  CommercialType,
} from '@/lib/types';
import { sanitizeImageUrl } from '@/lib/seo/types';

const supabase = createClient();

export interface PropertyServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PropertyInput {
  category?: PropertyCategory;
  type: PropertyType;
  title: string;
  description: string;
  price: number;
  deposit: number;
  maintenance?: number;
  commission?: number;
  city: string;
  state?: string;
  locality: string;
  address: string;
  bedrooms?: string | null;
  bathrooms?: number;
  area: number;
  furnishing: FurnishingType;
  parking?: string;
  availability?: string;
  amenities?: string[];
  tenant_preferences?: string[];

  // Commercial attributes
  commercial_type?: CommercialType | null;
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
  status?: PropertyStatus;
}

const COMMERCIAL_TYPES = [
  'office',
  'shop',
  'showroom',
  'warehouse',
  'commercial_building',
  'coworking',
  'commercial_plot',
  'other_commercial',
];

/** Upload a browser file to Supabase storage bucket 'property-images' */
export async function uploadPropertyImage(
  userId: string,
  propertyId: string,
  file: File
): Promise<{ url: string; path: string } | null> {
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const storagePath = `${userId}/${propertyId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error || !data) {
      console.error('[uploadPropertyImage] Storage upload error:', error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('property-images')
      .getPublicUrl(data.path);

    if (!publicUrlData?.publicUrl || !publicUrlData.publicUrl.startsWith('https://')) {
      console.error('[uploadPropertyImage] Generated invalid public URL:', publicUrlData);
      return null;
    }

    return {
      url: publicUrlData.publicUrl,
      path: data.path,
    };
  } catch (err) {
    console.error('[uploadPropertyImage] Exception:', err);
    return null;
  }
}

function normalizeFurnishing(furnishing?: string): 'fully_furnished' | 'semi_furnished' | 'unfurnished' {
  if (!furnishing) return 'semi_furnished';
  const f = furnishing.toLowerCase();
  if (f === 'fully_furnished' || f === 'furnished') return 'fully_furnished';
  if (f === 'semi_furnished') return 'semi_furnished';
  return 'unfurnished';
}

function normalizePropertyType(type?: string): string {
  if (!type) return 'flat';
  const t = type.toLowerCase();
  if (['flat', 'room', 'pg', 'studio'].includes(t)) return t;
  return 'flat';
}

/** Canonical Database Insert Payload (Strictly matching properties table schema) */
export interface CanonicalDbPropertyPayload {
  owner_id: string;
  type: string;
  title: string;
  description: string;
  price: number;
  deposit: number;
  maintenance: number;
  commission: number;
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
  parking: string;
  availability: string;
  amenities: string[];
  tenant_preferences: string[];
  status: PropertyStatus;
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
}

/** Explicitly map UI form input to supported Supabase DB columns */
export function mapListingFormToPropertyInsert(
  ownerId: string,
  input: PropertyInput,
  status: PropertyStatus = 'published'
): CanonicalDbPropertyPayload {
  // Consolidate amenities
  const amenitiesSet = new Set<string>(input.amenities || []);
  if (input.lift) amenitiesSet.add('lift');
  if (input.power_backup) amenitiesSet.add('power_backup');
  if (input.parking && input.parking !== 'None') amenitiesSet.add('parking');

  // Consolidate tenant preferences
  const tenantPrefsSet = new Set<string>(input.tenant_preferences || []);

  // Canonical Area: sq ft from area or carpet_area
  const canonicalArea = Number(
    input.area ||
    (input as any).carpet_area ||
    (input as any).carpetArea ||
    0
  );

  // Canonical Bathrooms / Washrooms
  const canonicalBathrooms = Number(
    input.bathrooms ||
    (input as any).washrooms ||
    1
  );

  // Canonical Parking
  const canonicalParking =
    input.parking ||
    (input as any).parking_spaces ||
    'None';

  // Canonical Availability
  const canonicalAvailability =
    input.availability ||
    (input as any).possession_status ||
    'Immediate';

  return {
    owner_id: ownerId,
    type: normalizePropertyType(input.type),
    title: (input.title || '').trim(),
    description: (input.description || '').trim(),
    price: Number(input.price || 0),
    deposit: Number(input.deposit || 0),
    maintenance: Number(input.maintenance || 0),
    commission: 0, // Strictly 100% Verified Marketplace on REHVO
    city: (input.city || 'Mumbai').trim(),
    state: (input.state || 'Maharashtra').trim(),
    locality: (input.locality || 'Andheri East').trim(),
    address: (input.address || '').trim(),
    latitude: null,
    longitude: null,
    bedrooms: input.bedrooms ? String(input.bedrooms) : '0',
    bathrooms: canonicalBathrooms,
    area: canonicalArea,
    furnishing: normalizeFurnishing(input.furnishing),
    parking: canonicalParking,
    availability: canonicalAvailability,
    amenities: Array.from(amenitiesSet),
    tenant_preferences: Array.from(tenantPrefsSet),
    status: status,
    verification_status: 'unverified',
  };
}

/** Explicitly map partial form updates to supported DB columns */
export function mapListingFormToPropertyUpdate(
  input: Partial<PropertyInput>
): Record<string, any> {
  const payload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) payload.title = input.title.trim();
  if (input.description !== undefined) payload.description = input.description.trim();
  if (input.type !== undefined) payload.type = normalizePropertyType(input.type);
  if (input.price !== undefined) payload.price = Number(input.price);
  if (input.deposit !== undefined) payload.deposit = Number(input.deposit);
  if (input.maintenance !== undefined) payload.maintenance = Number(input.maintenance);
  if (input.city !== undefined) payload.city = input.city.trim();
  if (input.state !== undefined) payload.state = input.state.trim();
  if (input.locality !== undefined) payload.locality = input.locality.trim();
  if (input.address !== undefined) payload.address = input.address.trim();
  if (input.bedrooms !== undefined) payload.bedrooms = String(input.bedrooms);
  if (input.bathrooms !== undefined || (input as any).washrooms !== undefined) {
    payload.bathrooms = Number(input.bathrooms || (input as any).washrooms || 1);
  }
  if (input.area !== undefined || (input as any).carpet_area !== undefined || (input as any).carpetArea !== undefined) {
    payload.area = Number(input.area || (input as any).carpet_area || (input as any).carpetArea || 0);
  }
  if (input.furnishing !== undefined) payload.furnishing = normalizeFurnishing(input.furnishing);
  if (input.parking !== undefined || (input as any).parking_spaces !== undefined) {
    payload.parking = input.parking || (input as any).parking_spaces || 'None';
  }
  if (input.availability !== undefined || (input as any).possession_status !== undefined) {
    payload.availability = input.availability || (input as any).possession_status || 'Immediate';
  }
  if (input.amenities !== undefined) payload.amenities = input.amenities;
  if (input.tenant_preferences !== undefined) payload.tenant_preferences = input.tenant_preferences;
  if (input.status !== undefined) payload.status = input.status;

  return payload;
}

/** Create a new Property Listing with images */
export async function createProperty(
  ownerId: string,
  input: PropertyInput,
  imageFiles: File[],
  status: PropertyStatus = 'published'
): Promise<PropertyServiceResult<Property>> {
  try {
    // 1. Build canonical payload with ONLY supported DB columns
    const dbPayload = mapListingFormToPropertyInsert(ownerId, input, status);

    const { data: propData, error: propError } = await supabase
      .from('properties')
      .insert(dbPayload)
      .select()
      .single();

    if (propError || !propData) {
      return {
        success: false,
        error: propError?.message || 'Failed to save property listing details.',
      };
    }

    const propertyId = propData.id;

    // 2. Upload images if any
    const propertyImages: PropertyImage[] = [];
    if (imageFiles && imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const uploadResult = await uploadPropertyImage(ownerId, propertyId, file);

        if (uploadResult) {
          const { data: imgRow, error: imgError } = await supabase
            .from('property_images')
            .insert({
              property_id: propertyId,
              image_url: uploadResult.url,
              storage_path: uploadResult.path,
              is_cover: i === 0,
              sort_order: i,
            })
            .select()
            .single();

          if (!imgError && imgRow) {
            propertyImages.push({
              id: imgRow.id,
              property_id: propertyId,
              image_url: uploadResult.url,
              is_cover: i === 0,
              sort_order: i,
            });
          }
        }
      }
    }

    return {
      success: true,
      data: {
        ...propData,
        property_images: propertyImages,
      } as Property,
    };
  } catch (err: any) {
    console.error('[createProperty] Exception:', err);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred while creating property.',
    };
  }
}

/** Update an existing Property Listing */
export async function updateProperty(
  propertyId: string,
  ownerId: string,
  input: Partial<PropertyInput>
): Promise<PropertyServiceResult<Property>> {
  try {
    // Build canonical update payload with ONLY supported DB columns
    const payload = mapListingFormToPropertyUpdate(input);

    const { data, error } = await supabase
      .from('properties')
      .update(payload)
      .eq('id', propertyId)
      .eq('owner_id', ownerId)
      .select(`
        *,
        property_images (*)
      `)
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || 'Failed to update property.' };
    }

    return { success: true, data: data as Property };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update property.' };
  }
}

/** Update property status (e.g. pause, publish, remove) */
export async function updatePropertyStatus(
  propertyId: string,
  ownerId: string,
  status: PropertyStatus
): Promise<PropertyServiceResult> {
  try {
    const { error } = await supabase
      .from('properties')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', propertyId)
      .eq('owner_id', ownerId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Delete property listing */
export async function deleteProperty(
  propertyId: string,
  ownerId: string
): Promise<PropertyServiceResult> {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId)
      .eq('owner_id', ownerId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/** Get properties owned by specific user */
export async function getMyProperties(
  ownerId: string,
  category?: PropertyCategory
): Promise<PropertyServiceResult<Property[]>> {
  try {
    let query = supabase
      .from('properties')
      .select(`
        *,
        property_images (*)
      `)
      .eq('owner_id', ownerId);

    if (category) {
      if (category === 'commercial') {
        query = query.in('type', COMMERCIAL_TYPES);
      } else if (category === 'residential') {
        query = query.in('type', ['flat', 'room', 'pg', 'studio']);
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: (data || []) as Property[] };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}

/** Get single property by ID */
export async function getPropertyById(
  id: string
): Promise<PropertyServiceResult<Property>> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (*),
        owner:profiles!properties_owner_id_fkey (id, full_name, phone, email, profile_photo, verification_status)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || 'Property not found.' };
    }

    return { success: true, data: data as Property };
  } catch (err: any) {
    return { success: false, error: err.message || 'Property not found.' };
  }
}

/** Search & Filter Properties with Category Support */
export async function searchProperties(params: {
  category?: PropertyCategory | 'all';
  type?: string;
  city?: string;
  locality?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  furnishing?: string;
  limit?: number;
}): Promise<PropertyServiceResult<Property[]>> {
  try {
    let query = supabase
      .from('properties')
      .select(`
        *,
        property_images (*),
        owner:profiles!properties_owner_id_fkey (id, full_name, phone, email, profile_photo, verification_status)
      `)
      .eq('status', 'published');

    if (params.category && params.category !== 'all') {
      if (params.category === 'commercial') {
        query = query.in('type', COMMERCIAL_TYPES);
      } else if (params.category === 'residential') {
        query = query.in('type', ['flat', 'room', 'pg', 'studio']);
      }
    }

    if (params.type && params.type !== 'all') {
      query = query.eq('type', params.type.toLowerCase());
    }

    if (params.city) {
      query = query.ilike('city', `%${params.city}%`);
    }

    if (params.locality) {
      query = query.ilike('locality', `%${params.locality}%`);
    }

    if (params.minPrice !== undefined) {
      query = query.gte('price', params.minPrice);
    }

    if (params.maxPrice !== undefined) {
      query = query.lte('price', params.maxPrice);
    }

    if (params.minArea !== undefined) {
      query = query.gte('area', params.minArea);
    }

    if (params.maxArea !== undefined) {
      query = query.lte('area', params.maxArea);
    }

    if (params.furnishing && params.furnishing !== 'all') {
      query = query.eq('furnishing', params.furnishing);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(params.limit || 50);

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: (data || []) as Property[] };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}
