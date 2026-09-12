/**
 * Client-side Browser Geolocation & Locality Detection Service for REHVO
 */

export interface DetectedLocation {
  success: boolean;
  locality: string;
  suburb: string;
  city: string;
  formattedAddress: string;
  latitude?: number;
  longitude?: number;
  isGps: boolean;
  error?: string;
}

export interface MumbaiLocalityCoordinate {
  name: string;
  suburb: string;
  latitude: number;
  longitude: number;
}

export const MUMBAI_COORDINATE_MAP: MumbaiLocalityCoordinate[] = [
  { name: 'Bandra West, Mumbai', suburb: 'Bandra West', latitude: 19.0596, longitude: 72.8295 },
  { name: 'Bandra East, Mumbai', suburb: 'Bandra East', latitude: 19.0607, longitude: 72.8515 },
  { name: 'BKC, Mumbai', suburb: 'BKC', latitude: 19.0657, longitude: 72.8687 },
  { name: 'Khar West, Mumbai', suburb: 'Khar West', latitude: 19.0700, longitude: 72.8338 },
  { name: 'Santacruz West, Mumbai', suburb: 'Santacruz West', latitude: 19.0833, longitude: 72.8397 },
  { name: 'Santacruz East, Mumbai', suburb: 'Santacruz East', latitude: 19.0818, longitude: 72.8530 },
  { name: 'Juhu, Mumbai', suburb: 'Juhu', latitude: 19.1025, longitude: 72.8260 },
  { name: 'Andheri West, Mumbai', suburb: 'Andheri West', latitude: 19.1363, longitude: 72.8277 },
  { name: 'Andheri East, Mumbai', suburb: 'Andheri East', latitude: 19.1136, longitude: 72.8697 },
  { name: 'Powai, Mumbai', suburb: 'Powai', latitude: 19.1197, longitude: 72.9051 },
  { name: 'Worli & Lower Parel, Mumbai', suburb: 'Worli', latitude: 19.0178, longitude: 72.8180 },
  { name: 'Lower Parel, Mumbai', suburb: 'Lower Parel', latitude: 18.9953, longitude: 72.8306 },
  { name: 'Prabhadevi & Dadar, Mumbai', suburb: 'Dadar', latitude: 19.0178, longitude: 72.8478 },
  { name: 'Goregaon West, Mumbai', suburb: 'Goregaon West', latitude: 19.1663, longitude: 72.8428 },
  { name: 'Goregaon East, Mumbai', suburb: 'Goregaon East', latitude: 19.1688, longitude: 72.8611 },
  { name: 'Malad West, Mumbai', suburb: 'Malad West', latitude: 19.1874, longitude: 72.8427 },
  { name: 'Kandivali West, Mumbai', suburb: 'Kandivali West', latitude: 19.2064, longitude: 72.8465 },
  { name: 'Borivali West, Mumbai', suburb: 'Borivali West', latitude: 19.2312, longitude: 72.8567 },
  { name: 'Ghatkopar, Mumbai', suburb: 'Ghatkopar', latitude: 19.0860, longitude: 72.9090 },
  { name: 'Chembur, Mumbai', suburb: 'Chembur', latitude: 19.0622, longitude: 72.8997 },
  { name: 'Mulund West, Mumbai', suburb: 'Mulund West', latitude: 19.1726, longitude: 72.9565 },
  { name: 'Thane West, Mumbai', suburb: 'Thane West', latitude: 19.2183, longitude: 72.9781 },
  { name: 'Vashi, Navi Mumbai', suburb: 'Vashi', latitude: 19.0771, longitude: 72.9986 },
  { name: 'South Mumbai, Mumbai', suburb: 'South Mumbai', latitude: 18.9260, longitude: 72.8230 },
];

/**
 * Calculate distance in km between two lat/lon points
 */
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find closest registered Mumbai locality by coordinates
 */
export function findClosestMumbaiLocality(latitude: number, longitude: number): MumbaiLocalityCoordinate {
  let closest = MUMBAI_COORDINATE_MAP[0];
  let minDistance = Infinity;

  for (const loc of MUMBAI_COORDINATE_MAP) {
    const dist = getDistanceFromLatLonInKm(latitude, longitude, loc.latitude, loc.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closest = loc;
    }
  }

  return closest;
}

const LOCAL_STORAGE_KEY = 'rehvo_user_locality';

/**
 * Get stored locality from localStorage if available
 */
export function getSavedUserLocality(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Save user locality to localStorage
 */
export function saveUserLocality(locality: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, locality);
    // Broadcast to all listening components
    window.dispatchEvent(
      new CustomEvent('rehvo-locality-change', { detail: { locality } })
    );
  } catch {
    // Ignore storage errors
  }
}

/**
 * Auto-detect location on page load if no saved locality exists.
 * Uses a flag to prevent multiple simultaneous auto-detections.
 * Returns the detected locality or null if skipped/failed.
 */
let autoDetectInProgress = false;
let autoDetectDone = false;

export async function autoDetectOnLoad(): Promise<DetectedLocation | null> {
  if (typeof window === 'undefined') return null;

  // Already auto-detected this session or in progress
  if (autoDetectDone || autoDetectInProgress) return null;

  // If user already has a saved locality, skip auto-detect
  const saved = getSavedUserLocality();
  if (saved) {
    autoDetectDone = true;
    return null;
  }

  autoDetectInProgress = true;

  try {
    // Check if geolocation permission is already granted (no prompt)
    if (navigator.permissions) {
      const permResult = await navigator.permissions.query({ name: 'geolocation' });
      if (permResult.state === 'granted') {
        // Permission already granted — detect silently
        const result = await detectCurrentBrowserLocation();
        autoDetectDone = true;
        autoDetectInProgress = false;
        return result;
      } else if (permResult.state === 'prompt') {
        // Permission not yet granted — still auto-detect (browser will show its native prompt)
        const result = await detectCurrentBrowserLocation();
        autoDetectDone = true;
        autoDetectInProgress = false;
        return result;
      } else {
        // Permission denied — skip
        autoDetectDone = true;
        autoDetectInProgress = false;
        return null;
      }
    } else {
      // Permissions API not available — try detecting anyway
      const result = await detectCurrentBrowserLocation();
      autoDetectDone = true;
      autoDetectInProgress = false;
      return result;
    }
  } catch {
    autoDetectInProgress = false;
    autoDetectDone = true;
    return null;
  }
}

/**
 * Detect current live browser location via GPS and reverse geocode
 */
export async function detectCurrentBrowserLocation(): Promise<DetectedLocation> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return {
      success: false,
      locality: 'Bandra West',
      suburb: 'Bandra West',
      city: 'Mumbai',
      formattedAddress: 'Bandra West, Mumbai',
      isGps: false,
      error: 'Geolocation is not supported by your browser.',
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Try reverse geocode with 2.5s timeout
        let suburbName = '';
        let cityName = 'Mumbai';

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2500);

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`,
            {
              signal: controller.signal,
              headers: { 'Accept-Language': 'en' },
            }
          );
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            const addr = data.address || {};
            suburbName =
              addr.suburb ||
              addr.neighbourhood ||
              addr.residential ||
              addr.city_district ||
              addr.town ||
              '';
            cityName = addr.city || addr.state_district || addr.state || 'Mumbai';
          }
        } catch {
          // Fallback to nearest coordinate calculation
        }

        // If in or near Mumbai or suburb not cleanly resolved, map to closest known Mumbai hub
        const closestHub = findClosestMumbaiLocality(latitude, longitude);
        const distanceToHub = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          closestHub.latitude,
          closestHub.longitude
        );

        let finalLocality = closestHub.suburb;
        let finalFormatted = closestHub.name;

        if (distanceToHub < 15) {
          // Inside Mumbai Metropolitan Area
          finalLocality = suburbName || closestHub.suburb;
          finalFormatted = `${finalLocality}, Mumbai`;
        } else if (suburbName) {
          // Outside Mumbai, use real detected area
          finalLocality = suburbName;
          finalFormatted = `${suburbName}, ${cityName}`;
        }

        saveUserLocality(finalFormatted);

        resolve({
          success: true,
          locality: finalLocality,
          suburb: finalLocality,
          city: cityName,
          formattedAddress: finalFormatted,
          latitude,
          longitude,
          isGps: true,
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Location permission denied. Please allow location access in your browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location unavailable. Please select your area manually.';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'Location request timed out. Please try again.';
        }

        resolve({
          success: false,
          locality: 'Bandra West',
          suburb: 'Bandra West',
          city: 'Mumbai',
          formattedAddress: 'Bandra West, Mumbai',
          isGps: false,
          error: errorMessage,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}
