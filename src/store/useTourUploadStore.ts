/**
 * REHVO AI Tour™ — Upload & Processing Zustand Store
 * Manages video selection, local AI quality scan, 5 Mbps compression pipeline,
 * Supabase bucket upload progress, and 12-step processing queue state.
 */

import { create } from 'zustand';
import { VideoQualityReport, ProcessingJob, PropertyTour3D } from '../types/tour';
import {
  validateWalkthroughVideo,
  analyzeVideoQuality,
  VideoMetadata,
} from '../lib/ai-tour/frameExtractor';
import {
  createTourProcessingJob,
  getTourByPropertyId,
  uploadVideoToStorageBucket,
} from '../lib/ai-tour/supabase';

export type TourUploadScreenState =
  | 'guide'
  | 'picker'
  | 'quality_scanner'
  | 'compressing'
  | 'uploading'
  | 'processing'
  | 'preview'
  | 'published';

export interface TourUploadStoreState {
  currentStage: TourUploadScreenState;
  video: VideoMetadata | null;
  thumbnailUri: string | null;
  qualityReport: VideoQualityReport | null;

  // Compression
  isCompressing: boolean;
  compressionProgress: number; // 0-100
  compressedSizeBytes: number;
  targetBitrate: string;

  // Upload to Supabase bucket (tour-videos)
  isUploading: boolean;
  uploadProgress: number; // 0-100
  uploadSpeedMbps: number;
  uploadRemainingSeconds: number;
  isUploadCancelled: boolean;
  uploadError: string | null;

  // Processing Queue
  activeJob: ProcessingJob | null;
  generatedTour: PropertyTour3D | null;

  // Actions
  setStage: (stage: TourUploadScreenState) => void;
  selectVideo: (video: VideoMetadata, thumbnailUri?: string) => Promise<boolean>;
  runQualityScan: () => Promise<VideoQualityReport>;
  runCompression: () => Promise<void>;
  startUpload: () => Promise<void>;
  cancelUpload: () => void;
  retryUpload: () => Promise<void>;
  start12StepProcessing: () => Promise<void>;
  resetStore: () => void;
}

export const useTourUploadStore = create<TourUploadStoreState>((set, get) => ({
  currentStage: 'picker',
  video: null,
  thumbnailUri: null,
  qualityReport: null,

  isCompressing: false,
  compressionProgress: 0,
  compressedSizeBytes: 0,
  targetBitrate: '5 Mbps',

  isUploading: false,
  uploadProgress: 0,
  uploadSpeedMbps: 4.8,
  uploadRemainingSeconds: 24,
  isUploadCancelled: false,
  uploadError: null,

  activeJob: null,
  generatedTour: null,

  setStage: (stage) => set({ currentStage: stage }),

  selectVideo: async (video, thumbnailUri) => {
    const validation = validateWalkthroughVideo(video);
    if (!validation.isValid) {
      return false;
    }

    set({
      video,
      thumbnailUri:
        thumbnailUri ||
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      currentStage: 'quality_scanner',
    });

    return true;
  },

  runQualityScan: async () => {
    const { video } = get();
    if (!video) throw new Error('No video selected');

    const report = await analyzeVideoQuality(video);
    set({ qualityReport: report });
    return report;
  },

  runCompression: async () => {
    const { video } = get();
    const originalSize = video?.sizeBytes || 85 * 1024 * 1024;

    set({
      isCompressing: true,
      currentStage: 'compressing',
      compressionProgress: 0,
    });

    // 5 Mbps compression simulation with 1080p retention
    const targetSize = Math.round(originalSize * 0.38); // ~62% reduction

    for (let p = 5; p <= 100; p += 15) {
      await new Promise((r) => setTimeout(r, 220));
      set({
        compressionProgress: Math.min(100, p),
        compressedSizeBytes: Math.round(originalSize * (1 - (p / 100) * 0.62)),
      });
    }

    set({
      isCompressing: false,
      compressionProgress: 100,
      compressedSizeBytes: targetSize,
      currentStage: 'uploading',
    });

    // Automatically trigger upload
    get().startUpload();
  },

  startUpload: async () => {
    const { video, compressedSizeBytes } = get();
    const sizeToUpload = compressedSizeBytes || video?.sizeBytes || 32 * 1024 * 1024;

    set({
      isUploading: true,
      uploadProgress: 0,
      isUploadCancelled: false,
      uploadError: null,
      currentStage: 'uploading',
    });

    const uploadResult = await uploadVideoToStorageBucket(
      'prop-1',
      video?.name || 'walkthrough_1080p.mp4',
      sizeToUpload,
      (progress, speedMbps, remainingSec) => {
        if (get().isUploadCancelled) return;
        set({
          uploadProgress: progress,
          uploadSpeedMbps: speedMbps,
          uploadRemainingSeconds: remainingSec,
        });
      }
    );

    if (get().isUploadCancelled) {
      return;
    }

    if (!uploadResult.success) {
      set({
        isUploading: false,
        uploadError: uploadResult.error || 'Upload failed. Please check network connection.',
      });
      return;
    }

    set({
      isUploading: false,
      uploadProgress: 100,
      currentStage: 'processing',
    });

    // Initiate 12-Step Processing Queue
    get().start12StepProcessing();
  },

  cancelUpload: () => {
    set({
      isUploading: false,
      isUploadCancelled: true,
      uploadError: 'Upload cancelled by user',
    });
  },

  retryUpload: async () => {
    set({ isUploadCancelled: false, uploadError: null });
    await get().startUpload();
  },

  start12StepProcessing: async () => {
    const { video } = get();
    const job = await createTourProcessingJob(
      'prop-1',
      video?.name || 'walkthrough.mp4',
      video?.sizeBytes || 42 * 1024 * 1024
    );

    set({ activeJob: job, currentStage: 'processing' });

    // 12-Step pipeline simulation
    const steps = [
      { progress: 8, name: 'Uploading' },
      { progress: 16, name: 'Frame Extraction' },
      { progress: 25, name: 'Room Detection' },
      { progress: 34, name: 'Depth Estimation' },
      { progress: 42, name: 'Wall Detection' },
      { progress: 50, name: 'Ceiling Detection' },
      { progress: 58, name: 'Mesh Generation' },
      { progress: 68, name: 'Texture Mapping' },
      { progress: 76, name: 'Compression' },
      { progress: 85, name: 'Floorplan Generation' },
      { progress: 94, name: 'Optimization' },
      { progress: 100, name: 'Completed' },
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      await new Promise((r) => setTimeout(r, 650));
      set((state) => ({
        activeJob: state.activeJob
          ? {
              ...state.activeJob,
              progress_percent: step.progress,
              progress: step.progress,
              current_step_index: i + 1,
              step_name: step.name,
              estimated_seconds_left: Math.max(0, Math.round(((100 - step.progress) / 100) * 120)),
            }
          : null,
      }));
    }

    const completedTour = await getTourByPropertyId('prop-1');
    set({
      generatedTour: completedTour,
      currentStage: 'preview',
    });
  },

  resetStore: () => {
    set({
      currentStage: 'picker',
      video: null,
      thumbnailUri: null,
      qualityReport: null,
      isCompressing: false,
      compressionProgress: 0,
      compressedSizeBytes: 0,
      isUploading: false,
      uploadProgress: 0,
      isUploadCancelled: false,
      uploadError: null,
      activeJob: null,
      generatedTour: null,
    });
  },
}));
