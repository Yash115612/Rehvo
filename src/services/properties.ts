/**
 * REHVO Property Service
 * Centralized Supabase operations for properties, property images, and storage.
 * Handles bidirectional mapping between DB columns and app-level Property models.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type {
  Property,
  PropertyImage,
  PropertyType,
  FurnishingType,
  PropertyListingStatus,
  VerificationStatus,
  PropertyFilter,
  SupabaseProperty,
  SupabasePropertyImage,
  SupabaseProfile,
} from '../types';

// ---------------------------------------------------------------------------
// Types & Response Envelopes
// ---------------------------------------------------------------------------

export interface PropertyServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export type PropertyInput = Omit<
  Property,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'views_count'
  | 'saves_count'
  | 'enquiries_count'
>;

// ---------------------------------------------------------------------------
// Error Mapping
// ---------------------------------------------------------------------------

function getUserFriendlyPropertyError(error: unknown, fallback: string): string {
  if (!error) return fallback;
  const msg = (error as { message?: string })?.message || String(error);

  if (msg.includes('fetch') || msg.includes('network') || msg.includes('ENOTFOUND')) {
    return "Couldn't connect to server. Please check your connection.";
  }
  if (msg.includes('row-level security') || msg.includes('policy') || msg.includes('42501')) {
    return 'You do not have permission to modify this property.';
  }
  if (msg.includes('foreign key') || msg.includes('violates foreign key')) {
    return 'Your profile session is invalid. Please log in again.';
  }
  if (msg.includes('not found') || msg.includes('PGRST116')) {
    return 'Property not found.';
  }

  return fallback;
}

// ---------------------------------------------------------------------------
// Bidirectional Type & Field Mappers
// ---------------------------------------------------------------------------

export function mapAppTypeToDbType(t: PropertyType): 'flat' | 'room' | 'pg' | 'studio' {
  switch (t) {
    case 'FLAT':
    case 'APARTMENT':
      return 'flat';
    case 'PRIVATE_ROOM':
    case 'SHARED_ROOM':
    case 'CO_LIVING':
      return 'room';
    case 'PG':
      return 'pg';
    case 'STUDIO':
      return 'studio';
    default:
      return 'flat';
  }
}

export function mapDbTypeToAppType(t: string): PropertyType {
  switch (t?.toLowerCase()) {
    case 'flat':
      return 'FLAT';
    case 'room':
      return 'PRIVATE_ROOM';
    case 'pg':
      return 'PG';
    case 'studio':
      return 'STUDIO';
    default:
      return 'FLAT';
  }
}

export function mapAppFurnishingToDb(f: FurnishingType): 'fully_furnished' | 'semi_furnished' | 'unfurnished' {
  switch (f) {
    case 'FULLY_FURNISHED':
      return 'fully_furnished';
    case 'SEMI_FURNISHED':
      return 'semi_furnished';
    case 'UNFURNISHED':
      return 'unfurnished';
    default:
      return 'semi_furnished';
  }
}

export function mapDbFurnishingToApp(f: string): FurnishingType {
  switch (f?.toLowerCase()) {
    case 'fully_furnished':
      return 'FULLY_FURNISHED';
    case 'semi_furnished':
      return 'SEMI_FURNISHED';
    case 'unfurnished':
      return 'UNFURNISHED';
    default:
      return 'SEMI_FURNISHED';
  }
}

export function mapAppStatusToDb(s: PropertyListingStatus): 'draft' | 'published' | 'paused' | 'removed' {
  switch (s) {
    case 'ACTIVE':
      return 'published';
    case 'DRAFT':
      return 'draft';
    case 'PAUSED':
      return 'paused';
    case 'RENTED':
    case 'EXPIRED':
    case 'REJECTED':
      return 'removed';
    default:
      return 'published';
  }
}

export function mapDbStatusToApp(s: string): PropertyListingStatus {
  switch (s?.toLowerCase()) {
    case 'published':
      return 'ACTIVE';
    case 'draft':
      return 'DRAFT';
    case 'paused':
      return 'PAUSED';
    case 'removed':
      return 'EXPIRED';
    default:
      return 'ACTIVE';
  }
}

/** Convert a raw Supabase property row and its relations into a frontend Property model */
export function mapSupabasePropertyToApp(
  dbRow: SupabaseProperty,
  images: PropertyImage[] = [],
  ownerProfile?: Partial<SupabaseProfile> | null
): Property {
  return {
    id: dbRow.id,
    owner_id: dbRow.owner_id,
    owner_name: ownerProfile?.full_name || 'Property Owner',
    owner_avatar: ownerProfile?.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    owner_phone: ownerProfile?.phone || undefined,
    title: dbRow.title,
    description: dbRow.description,
    property_type: mapDbTypeToAppType(dbRow.type),
    listing_type: 'RENT',
    city: dbRow.city,
    locality: dbRow.locality,
    address: dbRow.address,
    latitude: dbRow.latitude || 19.076,
    longitude: dbRow.longitude || 72.8777,
    rent: dbRow.price,
    deposit: dbRow.deposit,
    maintenance: dbRow.maintenance,
    brokerage: dbRow.brokerage,
    bhk: dbRow.bedrooms || '1 BHK',
    bathrooms: dbRow.bathrooms || 1,
    area_sqft: dbRow.area || 0,
    floor: 1,
    total_floors: 5,
    furnishing: mapDbFurnishingToApp(dbRow.furnishing),
    parking: dbRow.parking || 'None',
    available_from: dbRow.availability || 'Immediate',
    status: mapDbStatusToApp(dbRow.status),
    verification_status: (dbRow.verification_status?.toUpperCase() || 'UNVERIFIED') as VerificationStatus,
    images: images.length > 0 ? images : [
      {
        id: `img_fallback_${dbRow.id}`,
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
        is_cover: true,
        sort_order: 0,
      }
    ],
    amenities: dbRow.amenities || [],
    tenant_preferences: dbRow.tenant_preferences || [],
    views_count: dbRow.views_count || 0,
    saves_count: dbRow.saves_count || 0,
    enquiries_count: dbRow.enquiries_count || 0,
    created_at: dbRow.created_at,
    updated_at: dbRow.updated_at,
  };
}

/** Convert frontend PropertyInput into Supabase `properties` columns */
export function mapAppPropertyToDb(appData: Partial<PropertyInput | Property>): Partial<SupabaseProperty> {
  const mapped: Partial<SupabaseProperty> = {};

  if (appData.title !== undefined) mapped.title = appData.title;
  if (appData.description !== undefined) mapped.description = appData.description;
  if (appData.property_type !== undefined) mapped.type = mapAppTypeToDbType(appData.property_type);
  if (appData.rent !== undefined) mapped.price = appData.rent;
  if (appData.deposit !== undefined) mapped.deposit = appData.deposit;
  if (appData.maintenance !== undefined) mapped.maintenance = appData.maintenance;
  if (appData.brokerage !== undefined) mapped.brokerage = appData.brokerage;
  if (appData.city !== undefined) mapped.city = appData.city;
  if (appData.locality !== undefined) mapped.locality = appData.locality;
  if (appData.address !== undefined) mapped.address = appData.address;
  if (appData.latitude !== undefined) mapped.latitude = appData.latitude;
  if (appData.longitude !== undefined) mapped.longitude = appData.longitude;
  if (appData.bhk !== undefined) mapped.bedrooms = appData.bhk;
  if (appData.bathrooms !== undefined) mapped.bathrooms = appData.bathrooms;
  if (appData.area_sqft !== undefined) mapped.area = appData.area_sqft;
  if (appData.furnishing !== undefined) mapped.furnishing = mapAppFurnishingToDb(appData.furnishing);
  if (appData.parking !== undefined) mapped.parking = appData.parking;
  if (appData.available_from !== undefined) mapped.availability = appData.available_from;
  if (appData.status !== undefined) mapped.status = mapAppStatusToDb(appData.status);
  if (appData.amenities !== undefined) mapped.amenities = appData.amenities;
  if (appData.tenant_preferences !== undefined) mapped.tenant_preferences = appData.tenant_preferences;

  // State is required by DB schema (default to Maharashtra if in Mumbai or unspecified)
  mapped.state = (appData as { state?: string })?.state || 'Maharashtra';

  return mapped;
}

// ---------------------------------------------------------------------------
// Core Query Operations
// ---------------------------------------------------------------------------

/** Fetch all published properties for discovery/search */
export async function getPublishedProperties(
  filter?: Partial<PropertyFilter>
): Promise<PropertyServiceResult<Property[]>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected', data: [] };
  }

  try {
    let query = supabase
      .from('properties')
      .select(`
        *,
        property_images (*),
        profiles:owner_id (full_name, phone, profile_photo)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    // Apply basic SQL-level filters where applicable
    if (filter?.city && filter.city !== 'ALL') {
      query = query.ilike('city', `%${filter.city}%`);
    }
    if (filter?.locality && filter.locality !== 'ALL') {
      query = query.ilike('locality', `%${filter.locality}%`);
    }
    if (filter?.property_type && filter.property_type !== 'ALL') {
      const dbType = mapAppTypeToDbType(filter.property_type);
      query = query.eq('type', dbType);
    }
    if (filter?.rent_max && filter.rent_max < 200000) {
      query = query.lte('price', filter.rent_max);
    }
    if (filter?.rent_min && filter.rent_min > 0) {
      query = query.gte('price', filter.rent_min);
    }
    if (filter?.brokerage_free_only) {
      query = query.eq('brokerage', 0);
    }
    if (filter?.verified_only) {
      query = query.eq('verification_status', 'verified');
    }

    const { data, error } = await query;

    if (error) {
      return {
        success: false,
        error: getUserFriendlyPropertyError(error, "Couldn't load properties."),
        data: [],
      };
    }

    const properties: Property[] = (data || []).map((row: any) => {
      const images: PropertyImage[] = (row.property_images || [])
        .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((img: SupabasePropertyImage) => ({
          id: img.id,
          property_id: img.property_id,
          url: img.image_url,
          is_cover: img.is_cover,
          sort_order: img.sort_order,
        }));

      return mapSupabasePropertyToApp(row, images, row.profiles);
    });

    return { success: true, data: properties };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyPropertyError(err, "Couldn't load properties."),
      data: [],
    };
  }
}

/** Fetch a single property by its ID */
export async function getPropertyById(
  propertyId: string
): Promise<PropertyServiceResult<Property>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (*),
        profiles:owner_id (full_name, phone, profile_photo)
      `)
      .eq('id', propertyId)
      .single();

    if (error || !data) {
      return {
        success: false,
        error: getUserFriendlyPropertyError(error, 'Property not found.'),
      };
    }

    const images: PropertyImage[] = (data.property_images || [])
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((img: SupabasePropertyImage) => ({
        id: img.id,
        property_id: img.property_id,
        url: img.image_url,
        is_cover: img.is_cover,
        sort_order: img.sort_order,
      }));

    const property = mapSupabasePropertyToApp(data, images, data.profiles);
    return { success: true, data: property };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyPropertyError(err, 'Property not found.'),
    };
  }
}

/** Fetch all properties owned by a specific user (drafts, published, paused) */
export async function getMyProperties(
  userId: string
): Promise<PropertyServiceResult<Property[]>> {
  if (!isSupabaseConfigured() || !userId) {
    return { success: false, error: 'Database not connected', data: [] };
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (*),
        profiles:owner_id (full_name, phone, profile_photo)
      `)
      .eq('owner_id', userId)
      .neq('status', 'removed')
      .order('created_at', { ascending: false });

    if (error) {
      return {
        success: false,
        error: getUserFriendlyPropertyError(error, "Couldn't load your properties."),
        data: [],
      };
    }

    const properties: Property[] = (data || []).map((row: any) => {
      const images: PropertyImage[] = (row.property_images || [])
        .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((img: SupabasePropertyImage) => ({
          id: img.id,
          property_id: img.property_id,
          url: img.image_url,
          is_cover: img.is_cover,
          sort_order: img.sort_order,
        }));

      return mapSupabasePropertyToApp(row, images, row.profiles);
    });

    return { success: true, data: properties };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyPropertyError(err, "Couldn't load your properties."),
      data: [],
    };
  }
}

// ---------------------------------------------------------------------------
// Mutation Operations (Create, Update, Status, Delete)
// ---------------------------------------------------------------------------

/** Create a new property listing with optional images */
export async function createProperty(
  input: PropertyInput,
  imagesToUpload?: { uri: string; isCover?: boolean }[]
): Promise<PropertyServiceResult<Property>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    // 1. Get current authenticated user
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData?.user?.id;

    if (!currentUserId) {
      return { success: false, error: 'You must be signed in to list a property.' };
    }

    // 2. Prepare database payload
    const dbPayload = mapAppPropertyToDb(input);
    dbPayload.owner_id = currentUserId; // Strictly enforce authenticated user id

    const { data: propRow, error: propError } = await supabase
      .from('properties')
      .insert(dbPayload)
      .select(`
        *,
        profiles:owner_id (full_name, phone, profile_photo)
      `)
      .single();

    if (propError || !propRow) {
      return {
        success: false,
        error: getUserFriendlyPropertyError(propError, "Couldn't create this property."),
      };
    }

    const propertyId = propRow.id;
    const uploadedImages: PropertyImage[] = [];

    // 3. Upload images to Supabase Storage if provided
    if (imagesToUpload && imagesToUpload.length > 0) {
      for (let i = 0; i < imagesToUpload.length; i++) {
        const item = imagesToUpload[i];
        const isCover = item.isCover ?? i === 0;

        const uploadResult = await uploadPropertyImage(
          propertyId,
          item.uri,
          isCover,
          i
        );

        if (uploadResult.success && uploadResult.data) {
          uploadedImages.push(uploadResult.data);
        }
      }
    } else if (input.images && input.images.length > 0) {
      // If already pre-formatted image objects exist (e.g. from existing URLs)
      for (let i = 0; i < input.images.length; i++) {
        const img = input.images[i];
        const { data: imgRow } = await supabase
          .from('property_images')
          .insert({
            property_id: propertyId,
            image_url: img.url,
            is_cover: img.is_cover ?? i === 0,
            sort_order: i,
          })
          .select()
          .single();

        if (imgRow) {
          uploadedImages.push({
            id: imgRow.id,
            property_id: propertyId,
            url: imgRow.image_url,
            is_cover: imgRow.is_cover,
            sort_order: imgRow.sort_order,
          });
        }
      }
    }

    const createdProperty = mapSupabasePropertyToApp(
      propRow,
      uploadedImages,
      propRow.profiles
    );

    return { success: true, data: createdProperty };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyPropertyError(err, "Couldn't create this property."),
    };
  }
}

/** Update an existing property */
export async function updateProperty(
  propertyId: string,
  input: Partial<PropertyInput | Property>
): Promise<PropertyServiceResult<Property>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const dbPayload = mapAppPropertyToDb(input);

    const { data: propRow, error: updateError } = await supabase
      .from('properties')
      .update(dbPayload)
      .eq('id', propertyId)
      .select(`
        *,
        property_images (*),
        profiles:owner_id (full_name, phone, profile_photo)
      `)
      .single();

    if (updateError || !propRow) {
      return {
        success: false,
        error: getUserFriendlyPropertyError(updateError, "Couldn't update this property."),
      };
    }

    const images: PropertyImage[] = (propRow.property_images || [])
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((img: SupabasePropertyImage) => ({
        id: img.id,
        property_id: img.property_id,
        url: img.image_url,
        is_cover: img.is_cover,
        sort_order: img.sort_order,
      }));

    const updatedProperty = mapSupabasePropertyToApp(
      propRow,
      images,
      propRow.profiles
    );

    return { success: true, data: updatedProperty };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyPropertyError(err, "Couldn't update this property."),
    };
  }
}

/** Delete a property and clean up its associated storage images */
export async function deleteProperty(
  propertyId: string
): Promise<PropertyServiceResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    // 1. Retrieve any storage paths associated with this property's images
    const { data: imageRows } = await supabase
      .from('property_images')
      .select('storage_path')
      .eq('property_id', propertyId);

    if (imageRows && imageRows.length > 0) {
      const pathsToDelete = imageRows
        .map((r) => r.storage_path)
        .filter((p): p is string => Boolean(p));

      if (pathsToDelete.length > 0) {
        await supabase.storage.from('property-images').remove(pathsToDelete);
      }
    }

    // 2. Delete the property record (cascade removes property_images, saved_properties, etc.)
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      return {
        success: false,
        error: getUserFriendlyPropertyError(error, "Couldn't delete this property."),
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyPropertyError(err, "Couldn't delete this property."),
    };
  }
}

/** Publish a property (status = 'published') */
export async function publishProperty(
  propertyId: string
): Promise<PropertyServiceResult<Property>> {
  return updateProperty(propertyId, { status: 'ACTIVE' });
}

/** Pause a property (status = 'paused') */
export async function pauseProperty(
  propertyId: string
): Promise<PropertyServiceResult<Property>> {
  return updateProperty(propertyId, { status: 'PAUSED' });
}

/** Resume a paused property (status = 'published') */
export async function resumeProperty(
  propertyId: string
): Promise<PropertyServiceResult<Property>> {
  return updateProperty(propertyId, { status: 'ACTIVE' });
}

// ---------------------------------------------------------------------------
// Image Management & Storage
// ---------------------------------------------------------------------------

/** Upload an image for a property and save its record in property_images */
export async function uploadPropertyImage(
  propertyId: string,
  uri: string,
  isCover: boolean = false,
  sortOrder: number = 0
): Promise<PropertyServiceResult<PropertyImage>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const storagePath = `${propertyId}/${fileName}`;

    let publicUrl = uri;

    // Only upload to Supabase Storage if it's a local file URI (e.g. file://, blob:, ph://)
    if (uri.startsWith('file:') || uri.startsWith('blob:') || uri.startsWith('ph:') || uri.startsWith('content:')) {
      const response = await fetch(uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(storagePath, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        return {
          success: false,
          error: getUserFriendlyPropertyError(uploadError, "Couldn't upload the image."),
        };
      }

      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(storagePath);

      publicUrl = urlData.publicUrl;
    }

    // Insert record in property_images table
    const { data: imgRow, error: imgError } = await supabase
      .from('property_images')
      .insert({
        property_id: propertyId,
        image_url: publicUrl,
        storage_path: storagePath,
        is_cover: isCover,
        sort_order: sortOrder,
      })
      .select()
      .single();

    if (imgError || !imgRow) {
      return {
        success: false,
        error: getUserFriendlyPropertyError(imgError, "Couldn't save image details."),
      };
    }

    const image: PropertyImage = {
      id: imgRow.id,
      property_id: imgRow.property_id,
      url: imgRow.image_url,
      is_cover: imgRow.is_cover,
      sort_order: imgRow.sort_order,
    };

    return { success: true, data: image };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyPropertyError(err, "Couldn't upload the image."),
    };
  }
}

/** Delete a specific property image */
export async function deletePropertyImage(
  imageId: string,
  storagePath?: string
): Promise<PropertyServiceResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Database not connected' };
  }

  try {
    if (storagePath) {
      await supabase.storage.from('property-images').remove([storagePath]);
    }

    const { error } = await supabase
      .from('property_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      return {
        success: false,
        error: getUserFriendlyPropertyError(error, "Couldn't delete the image."),
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: getUserFriendlyPropertyError(err, "Couldn't delete the image."),
    };
  }
}
