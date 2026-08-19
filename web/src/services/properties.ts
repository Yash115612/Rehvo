import { createClient } from '@/lib/supabase/client';
import { Property, PropertyImage, PropertyStatus, PropertyType, FurnishingType } from '@/lib/types';
import { sanitizeImageUrl } from '@/lib/seo/types';

const supabase = createClient();

export interface PropertyServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PropertyInput {
  type: PropertyType;
  title: string;
  description: string;
  price: number;
  deposit: number;
  maintenance?: number;
  brokerage?: number;
  city: string;
  state?: string;
  locality: string;
  address: string;
  bedrooms: string;
  bathrooms: number;
  area: number;
  furnishing: FurnishingType;
  parking?: string;
  availability?: string;
  amenities?: string[];
  tenant_preferences?: string[];
}

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

/** Create a new Property Listing with images */
export async function createProperty(
  ownerId: string,
  input: PropertyInput,
  imageFiles: File[],
  status: PropertyStatus = 'published'
): Promise<PropertyServiceResult<Property>> {
  try {
    // 1. Insert property row
    const { data: propData, error: propError } = await supabase
      .from('properties')
      .insert({
        owner_id: ownerId,
        type: input.type,
        title: input.title.trim(),
        description: input.description.trim(),
        price: Number(input.price),
        deposit: Number(input.deposit || 0),
        maintenance: Number(input.maintenance || 0),
        brokerage: 0, // Strictly 100% Zero Brokerage on REHVO
        city: input.city.trim(),
        state: input.state?.trim() || 'Maharashtra',
        locality: input.locality.trim(),
        address: input.address.trim(),
        bedrooms: String(input.bedrooms),
        bathrooms: Number(input.bathrooms || 1),
        area: Number(input.area || 0),
        furnishing: input.furnishing,
        parking: input.parking || 'None',
        availability: input.availability || 'Immediate',
        amenities: input.amenities || [],
        tenant_preferences: input.tenant_preferences || [],
        status: status,
        verification_status: 'unverified',
      })
      .select()
      .single();

    if (propError || !propData) {
      return {
        success: false,
        error: propError?.message || 'Failed to save property listing details.',
      };
    }

    const propertyId = propData.id;

    // 2. Upload images to Supabase Storage and create property_images rows
    const propertyImages: PropertyImage[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const uploadRes = await uploadPropertyImage(ownerId, propertyId, file);

      if (uploadRes) {
        const { data: imgRow, error: imgError } = await supabase
          .from('property_images')
          .insert({
            property_id: propertyId,
            image_url: uploadRes.url,
            storage_path: uploadRes.path,
            is_cover: i === 0,
            sort_order: i,
          })
          .select()
          .single();

        if (imgRow && !imgError) {
          propertyImages.push(imgRow as PropertyImage);
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
    const { data, error } = await supabase
      .from('properties')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
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
  ownerId: string
): Promise<PropertyServiceResult<Property[]>> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images (*)
      `)
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

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
