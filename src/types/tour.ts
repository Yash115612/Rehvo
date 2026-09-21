/**
 * REHVO AI Tour™ Type Definitions
 * Complete type specifications for 3D spatial tour engine, AI processing pipeline,
 * floorplans, hotspots, object detection, and analytics.
 */

export type TourStatus =
  | 'Pending'
  | 'Uploading'
  | 'Analyzing'
  | 'Depth Generation'
  | 'Mesh Building'
  | 'Texture Mapping'
  | 'Compressing'
  | 'Completed'
  | 'Failed';

export type RoomType =
  | 'living'
  | 'kitchen'
  | 'master_bedroom'
  | 'bedroom_2'
  | 'bedroom_3'
  | 'bathroom'
  | 'balcony'
  | 'dining'
  | 'pooja'
  | 'study'
  | 'terrace'
  | 'parking';

export type DetectedObjectName =
  | 'Sofa'
  | 'TV'
  | 'Bed'
  | 'Cupboard'
  | 'Dining Table'
  | 'Fridge'
  | 'Washing Machine'
  | 'AC'
  | 'Fan'
  | 'Gas Stove'
  | 'Sink'
  | 'Mirror'
  | 'Wardrobe'
  | 'Balcony Door'
  | 'Windows';

export type SunlightTime = 'morning' | 'afternoon' | 'golden_hour' | 'night';

export interface RoomDimensions {
  length_ft: number;
  width_ft: number;
  height_ft: number;
  carpet_area_sqft: number;
  builtup_area_sqft: number;
  window_size_sqft?: number;
}

export interface DetectedObject3D {
  id: string;
  name: DetectedObjectName;
  category: 'furniture' | 'appliance' | 'fixture' | 'opening';
  position_3d: [number, number, number]; // [x, y, z] normalized coordinates
  dimensions_ft: [number, number, number]; // [width, height, depth]
  confidence: number;
  removable: boolean;
  color_hex?: string;
}

export interface Hotspot3D {
  id: string;
  target_room_id: string;
  target_room_name: string;
  position_3d: [number, number, number]; // coordinates in parent room space
  label: string;
  color?: string; // Default glowing orange: #FF6B35
  distance_ft?: number;
}

export interface RoomWallColorOption {
  name: string;
  hex: string;
  finish: 'matte' | 'satin' | 'gloss';
}

export interface Room3D {
  id: string;
  name: string;
  type: RoomType;
  dimensions: RoomDimensions;
  panorama_url: string;
  unfurnished_panorama_url?: string;
  depth_map_url?: string;
  mesh_gltf_url?: string;
  detected_objects: DetectedObject3D[];
  hotspots: Hotspot3D[];
  wall_color: string;
  available_wall_colors?: RoomWallColorOption[];
  sunlight_factors: {
    morning: number;
    afternoon: number;
    golden_hour: number;
    night: number;
  };
  floorplan_position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface FloorPlanDoor {
  from_room_id: string;
  to_room_id: string;
  position: [number, number];
}

export interface FloorPlanWindow {
  room_id: string;
  position: [number, number];
  width_px: number;
}

export interface FloorPlanRoomPolygon {
  room_id: string;
  name: string;
  points: [number, number][];
  center: [number, number];
  area_sqft: number;
}

export interface FloorPlan2D {
  id: string;
  total_area_sqft: number;
  total_carpet_sqft: number;
  width: number;
  height: number;
  rooms: FloorPlanRoomPolygon[];
  doors: FloorPlanDoor[];
  windows: FloorPlanWindow[];
}

export interface StoredMeasurement {
  id: string;
  room_id: string;
  start_point: [number, number, number];
  end_point: [number, number, number];
  distance_ft: number;
  distance_meters: number;
  label?: string;
  created_at: string;
}

export interface VideoQualityReport {
  overall_score: number; // 0 - 100
  camera_stability: number; // 0 - 100
  brightness: number; // 0 - 100
  blur: number; // 0 - 100
  coverage: number; // 0 - 100
  missing_rooms: string[];
  warnings?: string[];
  is_acceptable: boolean;
  feedback_message: string;
  resolution?: string;
  duration_seconds?: number;
}

export interface TourAnalytics {
  opens: number;
  avg_watch_time_sec: number;
  rooms_visited: number;
  hotspots_clicked: number;
  completion_rate: number;
  shares: number;
  measurements_made?: number;
  color_previews?: number;
}

export interface TourMeta {
  property_size_bhk: string;
  floor: string;
  facing: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
  furnished_status: 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished';
  parking: string;
  lift: boolean;
  age_of_building_years: number;
  society_name: string;
  is_verified: boolean;
  locality: string;
  city: string;
}

export interface PropertyTour3D {
  id: string;
  property_id: string;
  title: string;
  status: TourStatus;
  progress: number; // 0 - 100
  current_pipeline_step?: string;
  estimated_remaining_seconds: number;
  created_at: string;
  updated_at: string;
  video_url?: string;
  thumbnail_url: string;
  quality_score: VideoQualityReport;
  rooms: Room3D[];
  initial_room_id: string;
  floorplan: FloorPlan2D;
  measurements: StoredMeasurement[];
  meta: TourMeta;
  analytics: TourAnalytics;
  is_premium?: boolean;
}

export interface ProcessingJob {
  id: string;
  property_id: string;
  propertyId?: string;
  video_file_name: string;
  video_file_size_bytes: number;
  video_url?: string;
  videoUrl?: string;
  status: TourStatus;
  progress: number;
  progress_percent: number;
  current_step_index: number;
  total_steps: number;
  step_name: string;
  estimated_seconds_left: number;
  estimatedCompletion?: string;
  error_message?: string;
  started_at: string;
  createdAt?: string;
  completed_at?: string;
}

export interface VoiceCommandResult {
  action: 'teleport' | 'sunlight' | 'furniture_toggle' | 'measure' | 'info' | 'unknown';
  target_room_id?: string;
  target_room_name?: string;
  sunlight_mode?: SunlightTime;
  speech_reply: string;
  confidence: number;
}
