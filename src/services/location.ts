import * as Location from "expo-location";
import { Platform } from "react-native";

export interface GeoLocationResult {
  success: boolean;
  locality?: string;
  suburb?: string;
  city?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
  error?: string;
}

/**
 * Detect current live GPS location and reverse geocode to a human-readable Mumbai locality.
 */
export async function getCurrentLiveLocation(): Promise<GeoLocationResult> {
  try {
    // 1. Request permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return {
        success: false,
        error: "Location permission denied. Please allow location access to auto-detect your area.",
      };
    }

    // 2. Fetch current GPS coordinates
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const { latitude, longitude } = position.coords;

    // 3. Reverse geocode coordinates into address components
    const geocoded = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (geocoded && geocoded.length > 0) {
      const place = geocoded[0];
      const rawSuburb =
        place.subregion ||
        place.district ||
        place.name ||
        place.street ||
        "Bandra West";
      const city = place.city || "Mumbai";

      // Clean out extraneous building numbers or comma-separated addresses
      const suburb = rawSuburb.split(',')[0].replace(/^flat\s+\d+.*?,?/i, '').trim() || "Bandra West";
      const formattedAddress = `${suburb}, ${city}`;

      return {
        success: true,
        locality: suburb,
        suburb,
        city,
        formattedAddress,
        latitude,
        longitude,
      };
    }

    return {
      success: true,
      locality: "Bandra West",
      city: "Mumbai",
      formattedAddress: "Bandra West, Mumbai",
      latitude,
      longitude,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Unable to retrieve live GPS location. Please choose your locality manually.",
    };
  }
}
