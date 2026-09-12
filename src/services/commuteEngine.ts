/**
 * REHVO Commute Engine 2.0
 * High-accuracy multi-modal transit estimates (Walking, Bike, Car, Metro, Bus, Auto)
 * with peak hour traffic multipliers and Mumbai fare structures.
 */

import { CommuteModeType, CommuteEstimateV2 } from '../types';
import { calculateDistanceKm } from './smartMaps';

export interface CommuteDestination {
  id: string;
  name: string;
  category: 'office' | 'transit' | 'education' | 'landmark';
  lat: number;
  lng: number;
}

export const PRIME_MUMBAI_DESTINATIONS: CommuteDestination[] = [
  { id: 'dest_bkc', name: 'BKC Financial Center', category: 'office', lat: 19.0657, lng: 72.8687 },
  { id: 'dest_lower_parel', name: 'Lower Parel Corporate Hub', category: 'office', lat: 18.9986, lng: 72.8311 },
  { id: 'dest_powai', name: 'Powai Hiranandani & IIT', category: 'office', lat: 19.1176, lng: 72.9060 },
  { id: 'dest_andheri_east', name: 'Andheri SEEPZ & MIDC', category: 'office', lat: 19.1197, lng: 72.8697 },
  { id: 'dest_airport', name: 'Mumbai Airport (CSMIA T2)', category: 'transit', lat: 19.0974, lng: 72.8744 },
  { id: 'dest_nariman_pt', name: 'Nariman Point / Fort', category: 'office', lat: 18.9256, lng: 72.8242 },
  { id: 'dest_goregaon', name: 'Nesco IT Park Goregaon', category: 'office', lat: 19.1551, lng: 72.8550 },
  { id: 'dest_malad', name: 'Mindspace IT Hub Malad', category: 'office', lat: 19.1860, lng: 72.8354 },
];

export const calculateCommuteMultiModal = (
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
  isPeakHour: boolean = false
): CommuteEstimateV2[] => {
  const straightDistance = calculateDistanceKm(fromLat, fromLng, toLat, toLng);
  // Real-world road curvature factor in Mumbai is ~1.32x straight line
  const roadDistanceKm = Number((straightDistance * 1.32).toFixed(1));

  // Mode 1: Walking
  // 4.5 km/h, unaffected by traffic
  const walkMinutes = Math.max(3, Math.round((roadDistanceKm / 4.5) * 60));

  // Mode 2: Two-Wheeler / Bike
  // 24 km/h base, peak hour slows to 17 km/h
  const bikeSpeed = isPeakHour ? 17 : 24;
  const bikeMinutes = Math.max(4, Math.round((roadDistanceKm / bikeSpeed) * 60));
  const bikeFare = Math.round(roadDistanceKm * 4.2); // Fuel estimate

  // Mode 3: Car / Uber / Cab
  // 20 km/h base, peak hour slows to 13 km/h
  const carSpeed = isPeakHour ? 13 : 20;
  const carMinutes = Math.max(6, Math.round((roadDistanceKm / carSpeed) * 60) + 4);
  const carFare = Math.round(75 + roadDistanceKm * 18 * (isPeakHour ? 1.25 : 1.0));

  // Mode 4: Metro (Lines 1, 2A, 3, 7)
  // Unaffected by road traffic, 32 km/h speed + 6 min station walk/boarding overhead
  const metroMinutes = Math.max(7, Math.round((roadDistanceKm / 32) * 60) + 6);
  const metroFare = roadDistanceKm < 3 ? 10 : roadDistanceKm < 12 ? 20 : 30;

  // Mode 5: Bus / AC BEST
  // 14 km/h base, peak hour slows to 9 km/h + 5 min waiting
  const busSpeed = isPeakHour ? 9 : 14;
  const busMinutes = Math.max(10, Math.round((roadDistanceKm / busSpeed) * 60) + 6);
  const busFare = roadDistanceKm < 5 ? 6 : roadDistanceKm < 15 ? 15 : 25;

  // Mode 6: Auto Rickshaw
  // 21 km/h base, peak hour slows to 15 km/h
  const autoSpeed = isPeakHour ? 15 : 21;
  const autoMinutes = Math.max(5, Math.round((roadDistanceKm / autoSpeed) * 60) + 2);
  const autoFare = Math.max(28, Math.round(28 + Math.max(0, roadDistanceKm - 1.5) * 15.3));

  return [
    {
      mode: 'metro',
      label: 'Metro Express',
      durationMinutes: metroMinutes,
      distanceKm: roadDistanceKm,
      fareEstimateRupees: metroFare,
      isPeakHour,
      transitLineName: 'Line 3 / Line 2A Express',
    },
    {
      mode: 'bike',
      label: 'Two-Wheeler / Bike',
      durationMinutes: bikeMinutes,
      distanceKm: roadDistanceKm,
      fareEstimateRupees: bikeFare,
      isPeakHour,
    },
    {
      mode: 'auto',
      label: 'Auto Rickshaw',
      durationMinutes: autoMinutes,
      distanceKm: roadDistanceKm,
      fareEstimateRupees: autoFare,
      isPeakHour,
    },
    {
      mode: 'car',
      label: 'Cab / Car',
      durationMinutes: carMinutes,
      distanceKm: roadDistanceKm,
      fareEstimateRupees: carFare,
      isPeakHour,
    },
    {
      mode: 'bus',
      label: 'BEST AC Electric Bus',
      durationMinutes: busMinutes,
      distanceKm: roadDistanceKm,
      fareEstimateRupees: busFare,
      isPeakHour,
      transitLineName: 'Route AS-332 / AS-440',
    },
    {
      mode: 'walk',
      label: 'Walking',
      durationMinutes: walkMinutes,
      distanceKm: roadDistanceKm,
      fareEstimateRupees: 0,
      isPeakHour,
    },
  ];
};
