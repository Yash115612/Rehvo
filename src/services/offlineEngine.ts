import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Property } from '../types';

const OFFLINE_PROPERTIES_KEY = '@rehvo_offline_properties_v80';
const OFFLINE_SAVED_IDS_KEY = '@rehvo_offline_saved_ids_v80';
const OFFLINE_MUTATION_QUEUE_KEY = '@rehvo_offline_mutation_queue_v80';

export interface QueuedOfflineMutation {
  id: string;
  user_id?: string;
  action_type: 'SAVE_PROPERTY' | 'UNSAVE_PROPERTY' | 'SUBMIT_INQUIRY' | 'SCHEDULE_VISIT';
  payload: any;
  timestamp: number;
  retry_count: number;
}

let isOnlineState = true;
const connectivityListeners: Set<(isOnline: boolean) => void> = new Set();

export const setNetworkOnlineState = (online: boolean) => {
  if (isOnlineState !== online) {
    isOnlineState = online;
    connectivityListeners.forEach((listener) => listener(online));
    if (online) {
      flushOfflineMutationQueue();
    }
  }
};

export const isAppOnline = (): boolean => isOnlineState;

export const addConnectivityListener = (listener: (isOnline: boolean) => void): (() => void) => {
  connectivityListeners.add(listener);
  listener(isOnlineState);
  return () => {
    connectivityListeners.delete(listener);
  };
};

/**
 * 1. Cache Property Listings for Offline Retrieval
 */
export const cacheProperties = async (properties: Property[]): Promise<void> => {
  if (!properties || properties.length === 0) return;
  try {
    const subset = properties.slice(0, 100);
    await AsyncStorage.setItem(OFFLINE_PROPERTIES_KEY, JSON.stringify(subset));
  } catch {
    // Silent catch
  }
};

export const getCachedProperties = async (): Promise<Property[]> => {
  try {
    const raw = await AsyncStorage.getItem(OFFLINE_PROPERTIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const getCachedPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const list = await getCachedProperties();
    return list.find((p) => p.id === id) || null;
  } catch {
    return null;
  }
};

/**
 * 2. Cached Saved Listings
 */
export const cacheSavedPropertyIds = async (ids: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(OFFLINE_SAVED_IDS_KEY, JSON.stringify(ids));
  } catch {
    // Silent catch
  }
};

export const getCachedSavedPropertyIds = async (): Promise<string[]> => {
  try {
    const raw = await AsyncStorage.getItem(OFFLINE_SAVED_IDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * 3. Optimistic Mutations
 */
export const savePropertyOptimistically = async (
  propertyId: string,
  userId?: string
): Promise<{ success: boolean; isSaved: boolean }> => {
  try {
    const current = await getCachedSavedPropertyIds();
    const updated = Array.from(new Set([...current, propertyId]));
    await cacheSavedPropertyIds(updated);

    // Queue mutation for backend sync
    await queueOfflineMutation({
      user_id: userId,
      action_type: 'SAVE_PROPERTY',
      payload: { propertyId, userId },
    });

    return { success: true, isSaved: true };
  } catch {
    return { success: false, isSaved: false };
  }
};

export const unsavePropertyOptimistically = async (
  propertyId: string,
  userId?: string
): Promise<{ success: boolean; isSaved: boolean }> => {
  try {
    const current = await getCachedSavedPropertyIds();
    const updated = current.filter((id) => id !== propertyId);
    await cacheSavedPropertyIds(updated);

    await queueOfflineMutation({
      user_id: userId,
      action_type: 'UNSAVE_PROPERTY',
      payload: { propertyId, userId },
    });

    return { success: true, isSaved: false };
  } catch {
    return { success: false, isSaved: true };
  }
};

/**
 * 4. Queue Offline Mutation
 */
export const queueOfflineMutation = async (mutation: {
  user_id?: string;
  action_type: QueuedOfflineMutation['action_type'];
  payload: any;
}): Promise<void> => {
  try {
    const raw = await AsyncStorage.getItem(OFFLINE_MUTATION_QUEUE_KEY);
    const queue: QueuedOfflineMutation[] = raw ? JSON.parse(raw) : [];

    const item: QueuedOfflineMutation = {
      id: `mut_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      user_id: mutation.user_id,
      action_type: mutation.action_type,
      payload: mutation.payload,
      timestamp: Date.now(),
      retry_count: 0,
    };

    queue.push(item);
    await AsyncStorage.setItem(OFFLINE_MUTATION_QUEUE_KEY, JSON.stringify(queue));

    if (isOnlineState) {
      flushOfflineMutationQueue();
    }
  } catch {
    // Silent catch
  }
};

/**
 * 5. Flush Mutation Queue with Cloud Sync
 */
export const flushOfflineMutationQueue = async (): Promise<{
  synced: number;
  remaining: number;
}> => {
  try {
    const raw = await AsyncStorage.getItem(OFFLINE_MUTATION_QUEUE_KEY);
    if (!raw) return { synced: 0, remaining: 0 };

    const queue: QueuedOfflineMutation[] = JSON.parse(raw);
    if (queue.length === 0) return { synced: 0, remaining: 0 };

    const remaining: QueuedOfflineMutation[] = [];
    let synced = 0;

    for (const item of queue) {
      try {
        let success = true;

        if (isSupabaseConfigured() && item.user_id) {
          if (item.action_type === 'SAVE_PROPERTY') {
            const { error } = await supabase
              .from('saved_properties')
              .upsert({ user_id: item.user_id, property_id: item.payload.propertyId });
            success = !error;
          } else if (item.action_type === 'UNSAVE_PROPERTY') {
            const { error } = await supabase
              .from('saved_properties')
              .delete()
              .eq('user_id', item.user_id)
              .eq('property_id', item.payload.propertyId);
            success = !error;
          }

          // Record sync in offline_sync_queue table
          if (success) {
            await supabase.from('offline_sync_queue').insert({
              user_id: item.user_id,
              action_type: item.action_type,
              payload: item.payload,
              status: 'synced',
              synced_at: new Date().toISOString(),
            });
          }
        }

        if (success) {
          synced += 1;
        } else {
          item.retry_count += 1;
          if (item.retry_count < 5) {
            remaining.push(item);
          }
        }
      } catch {
        item.retry_count += 1;
        if (item.retry_count < 5) {
          remaining.push(item);
        }
      }
    }

    await AsyncStorage.setItem(OFFLINE_MUTATION_QUEUE_KEY, JSON.stringify(remaining));
    return { synced, remaining: remaining.length };
  } catch {
    return { synced: 0, remaining: 0 };
  }
};
