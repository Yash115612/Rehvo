import { Image, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  value: T;
  expiresAt?: number;
}

export class LRUCache<T> {
  private capacity: number;
  private cache: Map<string, CacheEntry<T>>;

  constructor(capacity = 100) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: string): T | null {
    if (!this.cache.has(key)) return null;

    const entry = this.cache.get(key)!;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Refresh position for LRU
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  set(key: string, value: T, ttlMs?: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    const expiresAt = ttlMs ? Date.now() + ttlMs : undefined;
    this.cache.set(key, { value, expiresAt });
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const globalLRUCache = new LRUCache<any>(200);

const SYNC_QUEUE_STORAGE_KEY = '@rehvo_bg_sync_queue_v72';

export interface QueuedSyncAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  retryCount: number;
}

export const prefetchImages = async (urls: string[]): Promise<void> => {
  if (!urls || urls.length === 0) return;
  const validUrls = urls.filter((u) => typeof u === 'string' && u.startsWith('http'));
  await Promise.allSettled(
    validUrls.map((url) => {
      if (Platform.OS === 'web') {
        const globalScope = typeof globalThis !== 'undefined' ? (globalThis as any) : null;
        const win = globalScope && globalScope.window ? globalScope.window : null;
        if (win && win.Image) {
          return new Promise<void>((resolve) => {
            const img = new win.Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = url;
          });
        }
        return Promise.resolve();
      }
      return Image.prefetch(url);
    })
  );
};

export const runMemoryCleanup = async (): Promise<{ freedKeys: number; status: string }> => {
  const initialSize = globalLRUCache.size();
  globalLRUCache.clear();
  return {
    freedKeys: initialSize,
    status: 'success',
  };
};

export const queueBackgroundSyncAction = async (action: { type: string; payload: any }): Promise<void> => {
  try {
    const raw = await AsyncStorage.getItem(SYNC_QUEUE_STORAGE_KEY);
    const queue: QueuedSyncAction[] = raw ? JSON.parse(raw) : [];
    const newAction: QueuedSyncAction = {
      id: `sync_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type: action.type,
      payload: action.payload,
      timestamp: Date.now(),
      retryCount: 0,
    };
    queue.push(newAction);
    await AsyncStorage.setItem(SYNC_QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // Silent failover for performance safety
  }
};

export const getPendingSyncQueue = async (): Promise<QueuedSyncAction[]> => {
  try {
    const raw = await AsyncStorage.getItem(SYNC_QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const processBackgroundSyncQueue = async (
  executor: (action: QueuedSyncAction) => Promise<boolean>
): Promise<{ processed: number; remaining: number }> => {
  try {
    const queue = await getPendingSyncQueue();
    if (queue.length === 0) return { processed: 0, remaining: 0 };

    const remaining: QueuedSyncAction[] = [];
    let processed = 0;

    for (const item of queue) {
      try {
        const success = await executor(item);
        if (success) {
          processed += 1;
        } else {
          item.retryCount += 1;
          if (item.retryCount < 5) {
            remaining.push(item);
          }
        }
      } catch {
        item.retryCount += 1;
        if (item.retryCount < 5) {
          remaining.push(item);
        }
      }
    }

    await AsyncStorage.setItem(SYNC_QUEUE_STORAGE_KEY, JSON.stringify(remaining));
    return { processed, remaining: remaining.length };
  } catch {
    return { processed: 0, remaining: 0 };
  }
};

export const getStorageMetrics = async (): Promise<{
  cacheItems: number;
  pendingSyncActions: number;
  estimatedKb: number;
}> => {
  try {
    const queue = await getPendingSyncQueue();
    const cacheSize = globalLRUCache.size();
    const allKeys = await AsyncStorage.getAllKeys();
    const estimatedKb = Math.round((allKeys.length * 1.5) + (cacheSize * 0.5));
    return {
      cacheItems: cacheSize,
      pendingSyncActions: queue.length,
      estimatedKb,
    };
  } catch {
    return {
      cacheItems: 0,
      pendingSyncActions: 0,
      estimatedKb: 0,
    };
  }
};
