/**
 * REHVO AI Tour™ — Video Validation & AI Quality Analysis
 * Handles frame extraction requirements, motion stability detection,
 * lighting / blur checks, and room coverage analysis.
 */

import { VideoQualityReport } from '../../types/tour';

export interface VideoMetadata {
  uri: string;
  name: string;
  sizeBytes: number;
  durationSeconds?: number;
  width?: number;
  height?: number;
  mimeType?: string;
}

export const UPLOAD_CONSTRAINTS = {
  MAX_SIZE_BYTES: 2 * 1024 * 1024 * 1024, // 2GB
  MIN_DURATION_SECONDS: 30,
  MAX_DURATION_SECONDS: 120,
  MIN_WIDTH: 1280,
  MIN_HEIGHT: 720,
  SUPPORTED_FORMATS: ['mp4', 'mov', 'hevc', 'quicktime'],
} as const;

/**
 * Validate video against REHVO upload guidelines
 */
export function validateWalkthroughVideo(video: VideoMetadata): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check file size (max 2GB)
  if (video.sizeBytes > UPLOAD_CONSTRAINTS.MAX_SIZE_BYTES) {
    errors.push('Video exceeds 2GB maximum limit. Please compress or trim the recording.');
  }

  // Check duration (30-120 seconds)
  if (video.durationSeconds !== undefined) {
    if (video.durationSeconds < UPLOAD_CONSTRAINTS.MIN_DURATION_SECONDS) {
      errors.push(`Video is ${Math.round(video.durationSeconds)}s long. Minimum required is 30s to properly capture spatial depth.`);
    }
    if (video.durationSeconds > UPLOAD_CONSTRAINTS.MAX_DURATION_SECONDS) {
      errors.push(`Video is ${Math.round(video.durationSeconds)}s long. Maximum allowed is 120s.`);
    }
  }

  // Check resolution (minimum 720p)
  if (video.width && video.height) {
    const minDim = Math.min(video.width, video.height);
    if (minDim < 720) {
      errors.push(`Resolution is too low (${video.width}x${video.height}). Minimum 720p required; 1080p preferred for sharp 3D textures.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Simulate AI Computer Vision Quality Assessment
 * Evaluates optical flow stability, exposure/brightness histogram,
 * Laplacian variance for blur, and room keyframe coverage.
 */
export async function analyzeVideoQuality(video: VideoMetadata): Promise<VideoQualityReport> {
  // Simulate CV inference processing delay (800ms)
  await new Promise((resolve) => setTimeout(resolve, 800));

  const duration = video.durationSeconds || 65;
  const isHealthyDuration = duration >= 35 && duration <= 110;

  // Realistic synthetic CV metrics based on file properties
  const cameraStability = Math.min(98, Math.max(78, 90 + Math.floor(Math.random() * 8)));
  const brightness = Math.min(96, Math.max(75, 88 + Math.floor(Math.random() * 8)));
  const blurScore = Math.min(99, Math.max(80, 93 + Math.floor(Math.random() * 6)));
  const coverage = isHealthyDuration ? 95 : 78;

  const missingRooms: string[] = [];
  if (duration < 40) {
    missingRooms.push('Balcony');
  }
  if (duration < 32) {
    missingRooms.push('Ensuite Bathroom');
  }

  const overallScore = Math.round(
    cameraStability * 0.3 + brightness * 0.25 + blurScore * 0.25 + coverage * 0.2
  );

  const isAcceptable = overallScore >= 70 && missingRooms.length <= 1;

  let feedback = 'Video quality is excellent. 3D spatial reconstruction ready.';
  if (!isAcceptable) {
    feedback = `Need better video: ${missingRooms.length > 0 ? `Missing ${missingRooms.join(', ')}. ` : ''}Please walk more slowly and ensure good lighting.`;
  }

  return {
    overall_score: overallScore,
    camera_stability: cameraStability,
    brightness: brightness,
    blur: blurScore,
    coverage: coverage,
    missing_rooms: missingRooms,
    is_acceptable: isAcceptable,
    feedback_message: feedback,
    resolution: video.width && video.height ? `${video.width}x${video.height}` : '1080p 60fps',
    duration_seconds: Math.round(duration),
  };
}

/**
 * Simulated keyframe extractor
 * In production backend, this invokes FFmpeg / WebCodecs with scene detection filter
 */
export function simulateExtractKeyframes(
  totalFramesRequested = 80
): { frameIndex: number; timestampSeconds: number; sharpness: number }[] {
  const frames = [];
  for (let i = 0; i < totalFramesRequested; i++) {
    frames.push({
      frameIndex: i,
      timestampSeconds: Number(((i / totalFramesRequested) * 75).toFixed(2)),
      sharpness: Math.round(85 + Math.random() * 14),
    });
  }
  return frames;
}
