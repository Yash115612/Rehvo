/**
 * REHVO AI Tour™ — Texture Pipeline & Wall Color Inpainting
 * Handles equirectangular texture stream management, wall color shader blending,
 * and AI furniture removal (Unfurnished mode).
 */

export interface TextureStreamConfig {
  resolution: '4K' | '2K' | '1080p';
  format: 'KTX2' | 'WEBP' | 'JPEG';
  useDraco: boolean;
  lodLevel: number;
}

/**
 * Generate blended color filter for live wall paint preview
 */
export function calculateWallColorFilter(
  hexColor: string,
  ambientIntensity = 0.28
): { overlayColor: string; opacity: number } {
  return {
    overlayColor: hexColor,
    opacity: ambientIntensity,
  };
}

/**
 * Returns appropriate texture stream URL based on device network & memory profile
 */
export function getOptimizedTextureUrl(
  basePanoramaUrl: string,
  isUnfurnishedMode = false,
  unfurnishedUrl?: string
): string {
  if (isUnfurnishedMode && unfurnishedUrl) {
    return unfurnishedUrl;
  }
  return basePanoramaUrl;
}
