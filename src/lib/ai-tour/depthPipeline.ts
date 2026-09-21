/**
 * REHVO AI Tour™ — Spatial Depth Pipeline & Room Segmentation
 * Simulates monocular depth estimation, planar RANSAC wall/floor/ceiling fitting,
 * and 3D furniture bounding box estimation.
 */

import { DetectedObject3D, RoomDimensions } from '../../types/tour';

export interface SpatialPlane {
  type: 'wall' | 'floor' | 'ceiling';
  normal: [number, number, number];
  distance_from_origin: number;
  confidence: number;
}

export interface RoomDepthResult {
  roomId: string;
  planes: SpatialPlane[];
  dimensions: RoomDimensions;
  detectedObjects: DetectedObject3D[];
  depthMapResolution: { width: number; height: number };
}

/**
 * AI Depth Estimation & Surface Boundary Extractor
 */
export function estimateRoomSurfaces(
  roomType: string,
  baseLengthFt = 16,
  baseWidthFt = 14,
  baseHeightFt = 10.5
): RoomDepthResult {
  const planes: SpatialPlane[] = [
    { type: 'floor', normal: [0, 1, 0], distance_from_origin: 0, confidence: 0.99 },
    { type: 'ceiling', normal: [0, -1, 0], distance_from_origin: baseHeightFt * 0.3048, confidence: 0.98 },
    { type: 'wall', normal: [0, 0, 1], distance_from_origin: (baseLengthFt / 2) * 0.3048, confidence: 0.96 },
    { type: 'wall', normal: [0, 0, -1], distance_from_origin: (baseLengthFt / 2) * 0.3048, confidence: 0.95 },
    { type: 'wall', normal: [1, 0, 0], distance_from_origin: (baseWidthFt / 2) * 0.3048, confidence: 0.97 },
    { type: 'wall', normal: [-1, 0, 0], distance_from_origin: (baseWidthFt / 2) * 0.3048, confidence: 0.96 },
  ];

  const carpetArea = Math.round(baseLengthFt * baseWidthFt);
  const builtupArea = Math.round(carpetArea * 1.18);

  return {
    roomId: `room-${roomType}`,
    planes,
    dimensions: {
      length_ft: baseLengthFt,
      width_ft: baseWidthFt,
      height_ft: baseHeightFt,
      carpet_area_sqft: carpetArea,
      builtup_area_sqft: builtupArea,
    },
    detectedObjects: [],
    depthMapResolution: { width: 1024, height: 512 },
  };
}

/**
 * 3D Distance calculation between two spatial coordinates
 */
export function calculateSpatialDistance(
  pointA: [number, number, number],
  pointB: [number, number, number],
  scaleFactor = 8.5 // scaling factor from normalized 3D room coordinates to real-world feet
): { distanceFt: number; distanceMeters: number } {
  const dx = pointA[0] - pointB[0];
  const dy = pointA[1] - pointB[1];
  const dz = pointA[2] - pointB[2];

  const euclideanDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const distanceFt = Number((euclideanDistance * scaleFactor).toFixed(1));
  const distanceMeters = Number((distanceFt * 0.3048).toFixed(2));

  return { distanceFt, distanceMeters };
}
