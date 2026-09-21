/**
 * REHVO AI Tour™ — Supabase Storage & Database Service
 * Handles property 3D tours, processing jobs, video upload buckets,
 * and analytics logging.
 */

import { supabase } from '../supabase';
import {
  PropertyTour3D,
  ProcessingJob,
  TourAnalytics,
  StoredMeasurement,
  Room3D,
  FloorPlan2D,
} from '../../types/tour';

export const TOUR_STORAGE_BUCKETS = {
  VIDEOS: 'tour-videos',
  MESHES: 'tour-meshes',
  TEXTURES: 'tour-textures',
  THUMBNAILS: 'tour-thumbnails',
  FLOORPLANS: 'tour-floorplans',
} as const;

// High-fidelity fallback tour data for demo / offline experience
const MOCK_MUMBAI_LUXURY_TOUR: PropertyTour3D = {
  id: 'tour-bandra-luxury-01',
  property_id: 'prop-1',
  title: 'Palais Royale 2.5 BHK Sea-Facing Suite',
  status: 'Completed',
  progress: 100,
  current_pipeline_step: 'Published & Synced with Listing',
  estimated_remaining_seconds: 0,
  created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  updated_at: new Date().toISOString(),
  thumbnail_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  quality_score: {
    overall_score: 96,
    camera_stability: 94,
    brightness: 92,
    blur: 98,
    coverage: 97,
    missing_rooms: [],
    is_acceptable: true,
    feedback_message: 'Outstanding video quality. Full 360 spatial depth mapped across all 4 rooms.',
    resolution: '1080p 60fps',
    duration_seconds: 74,
  },
  initial_room_id: 'room-living',
  rooms: [
    {
      id: 'room-living',
      name: 'Grand Living & Dining Room',
      type: 'living',
      dimensions: {
        length_ft: 22,
        width_ft: 16,
        height_ft: 10.5,
        carpet_area_sqft: 352,
        builtup_area_sqft: 410,
        window_size_sqft: 72,
      },
      panorama_url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=80',
      unfurnished_panorama_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=80',
      wall_color: '#F8F9FA',
      available_wall_colors: [
        { name: 'Warm Ivory', hex: '#FAF7F2', finish: 'matte' },
        { name: 'Emerald Mist', hex: '#E8F5E9', finish: 'satin' },
        { name: 'Slate Whisper', hex: '#ECEFF1', finish: 'matte' },
        { name: 'Coastal Navy', hex: '#E1E7EE', finish: 'satin' },
        { name: 'Sage Green', hex: '#EAEFE9', finish: 'matte' },
      ],
      sunlight_factors: {
        morning: 0.95,
        afternoon: 0.85,
        golden_hour: 0.98,
        night: 0.25,
      },
      floorplan_position: { x: 20, y: 20, width: 140, height: 110 },
      detected_objects: [
        {
          id: 'obj-sofa',
          name: 'Sofa',
          category: 'furniture',
          position_3d: [0, -0.4, -1.8],
          dimensions_ft: [7.2, 2.8, 3.2],
          confidence: 0.98,
          removable: true,
          color_hex: '#334155',
        },
        {
          id: 'obj-tv',
          name: 'TV',
          category: 'appliance',
          position_3d: [0, 0.2, 2.1],
          dimensions_ft: [5.1, 3.0, 0.4],
          confidence: 0.99,
          removable: true,
          color_hex: '#0F172A',
        },
        {
          id: 'obj-fan',
          name: 'Fan',
          category: 'appliance',
          position_3d: [0, 1.2, 0],
          dimensions_ft: [4.0, 1.2, 4.0],
          confidence: 0.95,
          removable: false,
        },
        {
          id: 'obj-dining',
          name: 'Dining Table',
          category: 'furniture',
          position_3d: [1.8, -0.4, 0.2],
          dimensions_ft: [5.5, 2.6, 3.2],
          confidence: 0.94,
          removable: true,
          color_hex: '#854D0E',
        },
      ],
      hotspots: [
        {
          id: 'hs-to-kitchen',
          target_room_id: 'room-kitchen',
          target_room_name: 'Modular Italian Kitchen',
          position_3d: [1.9, -0.1, -1.2],
          label: 'Modular Kitchen',
          color: '#FF6B35',
          distance_ft: 12,
        },
        {
          id: 'hs-to-master',
          target_room_id: 'room-master',
          target_room_name: 'Master Suite & Walk-In',
          position_3d: [-1.9, 0.0, -0.8],
          label: 'Master Bedroom',
          color: '#FF6B35',
          distance_ft: 16,
        },
        {
          id: 'hs-to-balcony',
          target_room_id: 'room-balcony',
          target_room_name: 'Sea-Facing Deck Balcony',
          position_3d: [0.0, 0.1, -2.4],
          label: 'Sea-Facing Balcony',
          color: '#FF6B35',
          distance_ft: 9,
        },
      ],
    },
    {
      id: 'room-kitchen',
      name: 'Modular Italian Kitchen',
      type: 'kitchen',
      dimensions: {
        length_ft: 14,
        width_ft: 11,
        height_ft: 10.5,
        carpet_area_sqft: 154,
        builtup_area_sqft: 180,
        window_size_sqft: 24,
      },
      panorama_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1920&q=80',
      wall_color: '#FAFAFA',
      sunlight_factors: {
        morning: 0.7,
        afternoon: 0.9,
        golden_hour: 0.6,
        night: 0.3,
      },
      floorplan_position: { x: 170, y: 20, width: 90, height: 110 },
      detected_objects: [
        {
          id: 'obj-fridge',
          name: 'Fridge',
          category: 'appliance',
          position_3d: [1.5, 0.1, 0.4],
          dimensions_ft: [3.0, 6.2, 2.8],
          confidence: 0.97,
          removable: true,
          color_hex: '#64748B',
        },
        {
          id: 'obj-stove',
          name: 'Gas Stove',
          category: 'appliance',
          position_3d: [-0.8, -0.3, -1.2],
          dimensions_ft: [2.5, 1.0, 1.8],
          confidence: 0.96,
          removable: false,
        },
        {
          id: 'obj-sink',
          name: 'Sink',
          category: 'fixture',
          position_3d: [0.2, -0.3, -1.4],
          dimensions_ft: [2.4, 0.9, 1.6],
          confidence: 0.95,
          removable: false,
        },
      ],
      hotspots: [
        {
          id: 'hs-kitchen-to-living',
          target_room_id: 'room-living',
          target_room_name: 'Grand Living & Dining Room',
          position_3d: [-1.8, 0, 1.2],
          label: 'Back to Living Room',
          color: '#FF6B35',
          distance_ft: 12,
        },
      ],
    },
    {
      id: 'room-master',
      name: 'Master Suite & Walk-In',
      type: 'master_bedroom',
      dimensions: {
        length_ft: 18,
        width_ft: 14,
        height_ft: 10.5,
        carpet_area_sqft: 252,
        builtup_area_sqft: 300,
        window_size_sqft: 54,
      },
      panorama_url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1920&q=80',
      unfurnished_panorama_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=80',
      wall_color: '#F4F5F7',
      sunlight_factors: {
        morning: 0.9,
        afternoon: 0.8,
        golden_hour: 0.85,
        night: 0.2,
      },
      floorplan_position: { x: 20, y: 140, width: 130, height: 120 },
      detected_objects: [
        {
          id: 'obj-bed',
          name: 'Bed',
          category: 'furniture',
          position_3d: [0, -0.4, -1.6],
          dimensions_ft: [6.5, 3.2, 6.8],
          confidence: 0.99,
          removable: true,
          color_hex: '#475569',
        },
        {
          id: 'obj-wardrobe',
          name: 'Wardrobe',
          category: 'furniture',
          position_3d: [-1.7, 0.2, 0.4],
          dimensions_ft: [7.0, 7.5, 2.2],
          confidence: 0.96,
          removable: false,
          color_hex: '#1E293B',
        },
        {
          id: 'obj-ac',
          name: 'AC',
          category: 'appliance',
          position_3d: [0, 1.1, -1.8],
          dimensions_ft: [3.4, 1.1, 0.8],
          confidence: 0.97,
          removable: false,
          color_hex: '#FFFFFF',
        },
      ],
      hotspots: [
        {
          id: 'hs-master-to-living',
          target_room_id: 'room-living',
          target_room_name: 'Grand Living & Dining Room',
          position_3d: [1.8, 0, 1.0],
          label: 'Living Room',
          color: '#FF6B35',
          distance_ft: 16,
        },
        {
          id: 'hs-master-to-bath',
          target_room_id: 'room-bath',
          target_room_name: 'Attached Spa Bath',
          position_3d: [-1.6, -0.1, -1.2],
          label: 'Ensuite Bathroom',
          color: '#FF6B35',
          distance_ft: 7,
        },
      ],
    },
    {
      id: 'room-bath',
      name: 'Attached Spa Bath',
      type: 'bathroom',
      dimensions: {
        length_ft: 9,
        width_ft: 7,
        height_ft: 9.5,
        carpet_area_sqft: 63,
        builtup_area_sqft: 78,
      },
      panorama_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1920&q=80',
      wall_color: '#F1F5F9',
      sunlight_factors: {
        morning: 0.5,
        afternoon: 0.5,
        golden_hour: 0.4,
        night: 0.1,
      },
      floorplan_position: { x: 160, y: 140, width: 70, height: 70 },
      detected_objects: [
        {
          id: 'obj-mirror',
          name: 'Mirror',
          category: 'fixture',
          position_3d: [0, 0.3, -1.3],
          dimensions_ft: [3.0, 2.5, 0.2],
          confidence: 0.95,
          removable: false,
        },
        {
          id: 'obj-sink-bath',
          name: 'Sink',
          category: 'fixture',
          position_3d: [0, -0.3, -1.3],
          dimensions_ft: [2.5, 1.0, 1.8],
          confidence: 0.94,
          removable: false,
        },
      ],
      hotspots: [
        {
          id: 'hs-bath-to-master',
          target_room_id: 'room-master',
          target_room_name: 'Master Suite & Walk-In',
          position_3d: [1.4, 0, 1.2],
          label: 'Master Bedroom',
          color: '#FF6B35',
          distance_ft: 7,
        },
      ],
    },
    {
      id: 'room-balcony',
      name: 'Sea-Facing Deck Balcony',
      type: 'balcony',
      dimensions: {
        length_ft: 16,
        width_ft: 6,
        height_ft: 10.5,
        carpet_area_sqft: 96,
        builtup_area_sqft: 110,
      },
      panorama_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80',
      wall_color: '#E2E8F0',
      sunlight_factors: {
        morning: 1.0,
        afternoon: 0.95,
        golden_hour: 1.0,
        night: 0.1,
      },
      floorplan_position: { x: 20, y: 260, width: 140, height: 50 },
      detected_objects: [
        {
          id: 'obj-balcony-door',
          name: 'Balcony Door',
          category: 'opening',
          position_3d: [0, 0, 1.8],
          dimensions_ft: [7.5, 8.0, 0.4],
          confidence: 0.98,
          removable: false,
        },
      ],
      hotspots: [
        {
          id: 'hs-balcony-to-living',
          target_room_id: 'room-living',
          target_room_name: 'Grand Living & Dining Room',
          position_3d: [0, 0, 1.8],
          label: 'Step into Living Room',
          color: '#FF6B35',
          distance_ft: 9,
        },
      ],
    },
  ],
  floorplan: {
    id: 'fp-bandra-01',
    total_area_sqft: 1078,
    total_carpet_sqft: 917,
    width: 280,
    height: 330,
    rooms: [
      {
        room_id: 'room-living',
        name: 'Living & Dining',
        points: [
          [20, 20],
          [160, 20],
          [160, 130],
          [20, 130],
        ],
        center: [90, 75],
        area_sqft: 352,
      },
      {
        room_id: 'room-kitchen',
        name: 'Kitchen',
        points: [
          [170, 20],
          [260, 20],
          [260, 130],
          [170, 130],
        ],
        center: [215, 75],
        area_sqft: 154,
      },
      {
        room_id: 'room-master',
        name: 'Master Bed',
        points: [
          [20, 140],
          [150, 140],
          [150, 250],
          [20, 250],
        ],
        center: [85, 195],
        area_sqft: 252,
      },
      {
        room_id: 'room-bath',
        name: 'Ensuite Bath',
        points: [
          [160, 140],
          [230, 140],
          [230, 210],
          [160, 210],
        ],
        center: [195, 175],
        area_sqft: 63,
      },
      {
        room_id: 'room-balcony',
        name: 'Sea Balcony',
        points: [
          [20, 260],
          [160, 260],
          [160, 310],
          [20, 310],
        ],
        center: [90, 285],
        area_sqft: 96,
      },
    ],
    doors: [
      { from_room_id: 'room-living', to_room_id: 'room-kitchen', position: [165, 75] },
      { from_room_id: 'room-living', to_room_id: 'room-master', position: [85, 135] },
      { from_room_id: 'room-master', to_room_id: 'room-bath', position: [155, 175] },
      { from_room_id: 'room-living', to_room_id: 'room-balcony', position: [90, 255] },
    ],
    windows: [
      { room_id: 'room-living', position: [90, 20], width_px: 40 },
      { room_id: 'room-master', position: [20, 195], width_px: 36 },
      { room_id: 'room-kitchen', position: [260, 75], width_px: 24 },
    ],
  },
  measurements: [
    {
      id: 'meas-1',
      room_id: 'room-living',
      start_point: [-1.8, -0.4, 0],
      end_point: [1.8, -0.4, 0],
      distance_ft: 16.0,
      distance_meters: 4.88,
      label: 'Living Room Width',
      created_at: new Date().toISOString(),
    },
  ],
  meta: {
    property_size_bhk: '2.5 BHK Luxury',
    floor: '14th Floor of 22',
    facing: 'West',
    furnished_status: 'Fully Furnished',
    parking: '2 Covered Reserved',
    lift: true,
    age_of_building_years: 2,
    society_name: 'Sea View Heights CHS',
    is_verified: true,
    locality: 'Bandra West, Mumbai',
    city: 'Mumbai',
  },
  analytics: {
    opens: 482,
    avg_watch_time_sec: 184,
    rooms_visited: 4.2,
    hotspots_clicked: 12.8,
    completion_rate: 92,
    shares: 47,
  },
  is_premium: true,
};

// In-memory jobs store for real-time progress simulation
const activeProcessingJobs = new Map<string, ProcessingJob>();

/**
 * Fetch 3D tour for a given property ID
 */
export async function getTourByPropertyId(propertyId: string): Promise<PropertyTour3D> {
  try {
    const { data, error } = await supabase
      .from('property_3d_tours')
      .select('*')
      .eq('property_id', propertyId)
      .single();

    if (!error && data) {
      return data as PropertyTour3D;
    }
  } catch (err) {
    // Network or table missing -> gracefully fallback to mock
  }

  // Fallback high-fidelity tour
  return {
    ...MOCK_MUMBAI_LUXURY_TOUR,
    property_id: propertyId,
  };
}

/**
 * Fetch 3D tour by tour ID
 */
export async function getTourById(tourId: string): Promise<PropertyTour3D> {
  try {
    const { data, error } = await supabase
      .from('property_3d_tours')
      .select('*')
      .eq('id', tourId)
      .single();

    if (!error && data) {
      return data as PropertyTour3D;
    }
  } catch (err) {
    // Graceful fallback
  }

  return {
    ...MOCK_MUMBAI_LUXURY_TOUR,
    id: tourId,
  };
}

/**
 * Record user interactions for tour analytics
 */
export async function logTourEvent(
  tourId: string,
  event: 'open' | 'room_change' | 'hotspot_click' | 'measure' | 'share' | 'sunlight_change'
): Promise<void> {
  try {
    await supabase.from('tour_events').insert({
      tour_id: tourId,
      event_type: event,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    // Non-blocking telemetry
  }
}

/**
 * Save user custom AR measurement
 */
export async function saveTourMeasurement(measurement: StoredMeasurement): Promise<boolean> {
  try {
    const { error } = await supabase.from('tour_measurements').insert(measurement);
    return !error;
  } catch {
    return true; // client optimistic
  }
}

/**
 * Initiate an AI 3D tour processing job for an uploaded walkthrough video
 */
export async function createTourProcessingJob(
  propertyId: string,
  fileName: string,
  fileSizeBytes: number
): Promise<ProcessingJob> {
  const jobId = `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const newJob: ProcessingJob = {
    id: jobId,
    property_id: propertyId,
    video_file_name: fileName,
    video_file_size_bytes: fileSizeBytes,
    status: 'Analyzing',
    current_step_index: 1,
    total_steps: 12,
    step_name: 'Extracting High-Fidelity Frames...',
    progress_percent: 12,
    estimated_seconds_left: 150,
    started_at: new Date().toISOString(),
  };

  activeProcessingJobs.set(jobId, newJob);

  try {
    await supabase.from('tour_processing_jobs').insert(newJob);
  } catch {
    // In-memory fallback
  }

  return newJob;
}

/**
 * Get live processing status of an active tour job
 */
export async function getProcessingJobStatus(jobId: string): Promise<ProcessingJob | null> {
  if (activeProcessingJobs.has(jobId)) {
    return activeProcessingJobs.get(jobId)!;
  }

  try {
    const { data } = await supabase
      .from('tour_processing_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (data) return data as ProcessingJob;
  } catch {}

  return null;
}

/**
 * Update processing progress
 */
export function updateInMemoryJobProgress(
  jobId: string,
  progress: number,
  stepName: string,
  stepIndex: number,
  status: ProcessingJob['status']
): ProcessingJob | undefined {
  const job = activeProcessingJobs.get(jobId);
  if (!job) return undefined;

  job.progress_percent = progress;
  job.step_name = stepName;
  job.current_step_index = stepIndex;
  job.status = status;
  job.estimated_seconds_left = Math.max(0, Math.round(((100 - progress) / 100) * 160));

  if (progress >= 100) {
    job.status = 'Completed';
    job.completed_at = new Date().toISOString();
  }

  return job;
}
