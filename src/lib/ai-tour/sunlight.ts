/**
 * REHVO AI Tour™ — Sunlight Simulation Engine
 * Computes solar elevation, azimuth, color temperature, and ambient shadow intensity
 * across Mumbai solar coordinates.
 */

import { SunlightTime } from '../../types/tour';

export interface SunlightSettings {
  mode: SunlightTime;
  name: string;
  timeLabel: string;
  colorTemperatureK: number;
  sunElevationDeg: number;
  sunAzimuthDeg: number;
  ambientTintHex: string;
  overlayOpacity: number;
  shadowIntensity: number;
  lightIntensity: number;
  description: string;
}

export const SUNLIGHT_PRESETS: Record<SunlightTime, SunlightSettings> = {
  morning: {
    mode: 'morning',
    name: 'Morning Sun',
    timeLabel: '08:30 AM',
    colorTemperatureK: 4800,
    sunElevationDeg: 28,
    sunAzimuthDeg: 95, // East
    ambientTintHex: '#FFF8E7',
    overlayOpacity: 0.12,
    shadowIntensity: 0.45,
    lightIntensity: 1.15,
    description: 'Soft, energizing morning sunrise with gentle east shadows.',
  },
  afternoon: {
    mode: 'afternoon',
    name: 'Midday Light',
    timeLabel: '01:15 PM',
    colorTemperatureK: 5800,
    sunElevationDeg: 78,
    sunAzimuthDeg: 180, // Overhead South
    ambientTintHex: '#FFFFFF',
    overlayOpacity: 0.05,
    shadowIntensity: 0.25,
    lightIntensity: 1.35,
    description: 'High brightness, direct natural daylight across all windows.',
  },
  golden_hour: {
    mode: 'golden_hour',
    name: 'Golden Hour',
    timeLabel: '05:45 PM',
    colorTemperatureK: 3200,
    sunElevationDeg: 14,
    sunAzimuthDeg: 260, // West
    ambientTintHex: '#FFA834',
    overlayOpacity: 0.24,
    shadowIntensity: 0.65,
    lightIntensity: 1.2,
    description: 'Warm golden amber glow, long dramatic shadows & sunset ambience.',
  },
  night: {
    mode: 'night',
    name: 'Night Lights',
    timeLabel: '09:00 PM',
    colorTemperatureK: 2700,
    sunElevationDeg: -35,
    sunAzimuthDeg: 330,
    ambientTintHex: '#081226',
    overlayOpacity: 0.45,
    shadowIntensity: 0.85,
    lightIntensity: 0.75,
    description: 'Cozy interior chandelier & recessed ceiling lamps with city skyline glow.',
  },
};

export function getSunlightSettings(time: SunlightTime): SunlightSettings {
  return SUNLIGHT_PRESETS[time] || SUNLIGHT_PRESETS.afternoon;
}
