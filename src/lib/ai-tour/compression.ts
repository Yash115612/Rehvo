/**
 * REHVO AI Tour™ — Draco Compression & LOD Manager
 * Optimizes 3D asset payloads for 60 FPS mobile rendering and manages
 * in-memory texture/mesh caching.
 */

export interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  sizeBytes: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();

export const COMPRESSION_STANDARDS = {
  DRACO_QUANTIZATION_BITS: {
    POSITION: 14,
    NORMAL: 10,
    TEX_COORD: 12,
  },
  TARGET_FRAME_RATE: 60,
  FALLBACK_FRAME_RATE: 30,
  MAX_CACHE_SIZE_BYTES: 150 * 1024 * 1024, // 150MB
} as const;

/**
 * Store asset in memory cache
 */
export function setTourCache<T>(key: string, data: T, sizeEstimateBytes = 1024 * 500): void {
  memoryCache.set(key, {
    data,
    cachedAt: Date.now(),
    sizeBytes: sizeEstimateBytes,
  });
}

/**
 * Retrieve cached asset
 */
export function getTourCache<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  return entry.data as T;
}

/**
 * Clear cached tour data
 */
export function clearTourCache(): void {
  memoryCache.clear();
}
