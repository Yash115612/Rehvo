import { createClient } from '@/lib/supabase/client';
import { OwnerMetrics } from '@/lib/types';

const supabase = createClient();

export interface OwnerServiceResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Get real-time owner metrics from Supabase */
export async function getOwnerMetrics(
  ownerId: string
): Promise<OwnerServiceResult<OwnerMetrics>> {
  try {
    // 1. Fetch properties
    const { data: properties, error: propError } = await supabase
      .from('properties')
      .select('id, status, views_count, saves_count, enquiries_count')
      .eq('owner_id', ownerId);

    if (propError) {
      return {
        success: false,
        error: propError.message,
        data: {
          totalListings: 0,
          activeListings: 0,
          pausedListings: 0,
          totalViews: 0,
          totalEnquiries: 0,
          totalVisits: 0,
          pendingVisits: 0,
        },
      };
    }

    const totalListings = properties?.length || 0;
    const activeListings = properties?.filter((p) => p.status === 'published').length || 0;
    const pausedListings = properties?.filter((p) => p.status === 'paused').length || 0;
    const totalViews = properties?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0;
    const totalEnquiries = properties?.reduce((sum, p) => sum + (p.enquiries_count || 0), 0) || 0;

    // 2. Fetch visits for owner's properties
    const { data: visits, error: visitError } = await supabase
      .from('visits')
      .select('id, status')
      .eq('owner_id', ownerId);

    const totalVisits = visits?.length || 0;
    const pendingVisits = visits?.filter((v) => v.status === 'pending').length || 0;

    return {
      success: true,
      data: {
        totalListings,
        activeListings,
        pausedListings,
        totalViews,
        totalEnquiries,
        totalVisits,
        pendingVisits,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
      data: {
        totalListings: 0,
        activeListings: 0,
        pausedListings: 0,
        totalViews: 0,
        totalEnquiries: 0,
        totalVisits: 0,
        pendingVisits: 0,
      },
    };
  }
}
