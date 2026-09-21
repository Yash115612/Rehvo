/**
 * REHVO AI Tour™ — 3D Mesh & Geometry Builder
 * Constructs 3D room geometries, equirectangular sphere/cube projections,
 * and handles 3D spatial to 2D viewport raycasting.
 */

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface SphericalCoord {
  radius: number;
  theta: number; // azimuth (yaw)
  phi: number; // elevation (pitch)
}

/**
 * Convert spherical camera coordinates (yaw/pitch) to a 3D cartesian forward vector
 */
export function sphericalToCartesian(yawDeg: number, pitchDeg: number, radius = 1.0): Vector3D {
  const yawRad = (yawDeg * Math.PI) / 180;
  const pitchRad = (pitchDeg * Math.PI) / 180;

  return {
    x: radius * Math.cos(pitchRad) * Math.sin(yawRad),
    y: radius * Math.sin(pitchRad),
    z: -radius * Math.cos(pitchRad) * Math.cos(yawRad),
  };
}

/**
 * Project a 3D world position into 2D viewport coordinates
 * Given camera yaw, pitch, and field of view (FOV).
 */
export function project3DToViewport(
  targetPos: [number, number, number],
  cameraYawDeg: number,
  cameraPitchDeg: number,
  viewportWidth: number,
  viewportHeight: number,
  fovDeg = 75
): { x: number; y: number; isVisible: boolean } {
  const targetX = targetPos[0];
  const targetY = targetPos[1];
  const targetZ = targetPos[2];

  // Rotate point around Y axis (camera yaw)
  const yawRad = (-cameraYawDeg * Math.PI) / 180;
  const cosY = Math.cos(yawRad);
  const sinY = Math.sin(yawRad);

  const x1 = targetX * cosY - targetZ * sinY;
  const z1 = targetX * sinY + targetZ * cosY;

  // Rotate point around X axis (camera pitch)
  const pitchRad = (-cameraPitchDeg * Math.PI) / 180;
  const cosP = Math.cos(pitchRad);
  const sinP = Math.sin(pitchRad);

  const y2 = targetY * cosP - z1 * sinP;
  const z2 = targetY * sinP + z1 * cosP;

  // Behind camera check
  if (z2 <= 0.1) {
    return { x: -9999, y: -9999, isVisible: false };
  }

  // Perspective projection
  const fovRad = (fovDeg * Math.PI) / 180;
  const focalLength = (viewportHeight / 2) / Math.tan(fovRad / 2);

  const screenX = viewportWidth / 2 + (x1 / z2) * focalLength;
  const screenY = viewportHeight / 2 - (y2 / z2) * focalLength;

  const isVisible =
    screenX >= -40 &&
    screenX <= viewportWidth + 40 &&
    screenY >= -40 &&
    screenY <= viewportHeight + 40;

  return {
    x: screenX,
    y: screenY,
    isVisible,
  };
}

/**
 * Generate glTF-compatible box mesh vertices and indices for a room enclosure
 */
export function generateRoomBoxMesh(lengthFt: number, widthFt: number, heightFt: number) {
  const halfL = (lengthFt * 0.3048) / 2;
  const halfW = (widthFt * 0.3048) / 2;
  const h = heightFt * 0.3048;

  // 8 bounding vertices of room
  const vertices = [
    -halfW, 0, -halfL,
     halfW, 0, -halfL,
     halfW, h, -halfL,
    -halfW, h, -halfL,
    -halfW, 0,  halfL,
     halfW, 0,  halfL,
     halfW, h,  halfL,
    -halfW, h,  halfL,
  ];

  return {
    vertices,
    vertexCount: 8,
    triangleCount: 12,
    dimensionsMeter: { width: halfW * 2, length: halfL * 2, height: h },
  };
}
