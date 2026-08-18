export type UserRole = 'RENTER' | 'OWNER';
export type UserType = 'student' | 'working_professional' | 'family' | 'other';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  role: UserRole;
  onboarding_completed?: boolean;
  city: string;
  locality: string;
  occupation: string;
  user_type: UserType;
  budget_min: number;
  budget_max: number;
  move_in_date: string;
  verification_status: VerificationStatus;
  is_blocked?: boolean;
  created_at: string;
  updated_at: string;
}

/** Raw Supabase `profiles` table row shape (DB column names) */
export interface SupabaseProfile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  profile_photo: string | null;
  city: string | null;
  state: string | null;
  locality: string | null;
  bio: string | null;
  occupation: string | null;
  user_type: 'student' | 'working_professional' | 'family' | 'other' | null;
  role: 'renter' | 'owner';
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
}

/** Raw Supabase `properties` table row shape (DB column names) */
export interface SupabaseProperty {
  id: string;
  owner_id: string;
  type: 'flat' | 'room' | 'pg' | 'studio';
  title: string;
  description: string;
  price: number;
  deposit: number;
  maintenance: number;
  brokerage: number;
  city: string;
  state: string;
  locality: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  bedrooms: string;
  bathrooms: number;
  area: number;
  furnishing: 'fully_furnished' | 'semi_furnished' | 'unfurnished';
  parking: string | null;
  availability: string | null;
  status: 'draft' | 'published' | 'paused' | 'removed';
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  amenities: string[];
  tenant_preferences: string[];
  views_count: number;
  saves_count: number;
  enquiries_count: number;
  created_at: string;
  updated_at: string;
}

/** Raw Supabase `property_images` table row shape (DB column names) */
export interface SupabasePropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  storage_path: string | null;
  is_cover: boolean;
  sort_order: number;
  created_at: string;
}

/** Raw Supabase `flatmate_profiles` table row shape (DB column names) */
export interface SupabaseFlatmateProfile {
  id: string;
  user_id: string;
  photo: string | null;
  age: number | null;
  gender: 'male' | 'female' | 'any' | 'other' | null;
  profession: string;
  city: string;
  locality: string;
  preferred_locations: string[];
  bio: string | null;
  budget_min: number;
  budget_max: number;
  room_preference: 'private_room' | 'shared_room' | 'any';
  move_in_date: string;
  lifestyle_preferences: string[];
  status: 'draft' | 'published' | 'paused';
  created_at: string;
  updated_at: string;
}

/** Raw Supabase `saved_properties` table row shape */
export interface SupabaseSavedProperty {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

/** Raw Supabase `saved_flatmates` table row shape */
export interface SupabaseSavedFlatmate {
  id: string;
  user_id: string;
  flatmate_profile_id: string;
  created_at: string;
}

/** Raw Supabase `enquiries` table row shape */
export interface SupabaseEnquiry {
  id: string;
  user_id: string;
  property_id: string;
  owner_id: string;
  message: string;
  status: 'pending' | 'replied' | 'scheduled' | 'closed';
  created_at: string;
  updated_at: string;
}

/** Raw Supabase `visits` table row shape */
export interface SupabaseVisit {
  id: string;
  property_id: string;
  user_id: string;
  owner_id: string;
  scheduled_date: string;
  scheduled_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** Raw Supabase `conversations` table row shape */
export interface SupabaseConversation {
  id: string;
  property_id: string | null;
  enquiry_id: string | null;
  flatmate_profile_id: string | null;
  last_message_text: string | null;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Raw Supabase `conversation_participants` table row shape */
export interface SupabaseConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  unread_count: number;
  last_read_at: string | null;
  created_at: string;
}

/** Raw Supabase `messages` table row shape */
export interface SupabaseMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  message_type: 'text' | 'image' | 'system' | 'visit_request';
  read_at: string | null;
  created_at: string;
}

export type AppMode = 'RENTER' | 'FLATMATE' | 'LISTER';

export type PropertyType =
  | 'FLAT'
  | 'APARTMENT'
  | 'PRIVATE_ROOM'
  | 'SHARED_ROOM'
  | 'CO_LIVING'
  | 'PG'
  | 'STUDIO';
export type FurnishingType = 'FULLY_FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED';
export type PropertyListingStatus = 'DRAFT' | 'PENDING_REVIEW' | 'ACTIVE' | 'PAUSED' | 'RENTED' | 'REJECTED' | 'EXPIRED';

export interface PropertyImage {
  id: string;
  property_id?: string;
  url: string;
  is_cover: boolean;
  sort_order: number;
}

export interface Property {
  id: string;
  owner_id: string;
  owner_name: string;
  owner_avatar: string;
  owner_phone?: string;
  title: string;
  description: string;
  property_type: PropertyType;
  listing_type: 'RENT'; // Strict rental marketplace constraint
  city: string;
  locality: string;
  address: string;
  latitude: number;
  longitude: number;
  rent: number;
  deposit: number;
  maintenance: number;
  brokerage: number; // 0 for No Brokerage
  bhk: string; // e.g. "1 BHK", "2 BHK", "Studio", "1 RK"
  bathrooms: number;
  area_sqft: number;
  floor: number;
  total_floors: number;
  furnishing: FurnishingType;
  parking: string; // "Car & Bike", "2 Wheeler Only", "None"
  available_from: string;
  status: PropertyListingStatus;
  verification_status: VerificationStatus;
  images: PropertyImage[];
  amenities: string[];
  tenant_preferences: string[]; // e.g. "Bachelors Allowed", "Family Preferred", "Vegetarian Preferred"
  is_sponsored?: boolean;
  sponsor_priority?: number;
  views_count: number;
  saves_count: number;
  enquiries_count: number;
  price_changed?: boolean;
  previous_rent?: number;
  // Type-Specific Attributes
  plot_area_sqft?: number;
  floors?: number;
  has_pool?: boolean;
  has_garden?: boolean;
  pg_food_included?: boolean;
  pg_gender_allowed?: 'Gents' | 'Ladies' | 'Unisex' | 'Any';
  pg_occupancy?: string;
  created_at: string;
  updated_at: string;
}

export type VisitStatus = 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

export interface Visit {
  id: string;
  property_id: string;
  property_title: string;
  property_image: string;
  property_locality: string;
  rent: number;
  renter_id: string;
  renter_name: string;
  renter_phone: string;
  owner_id: string;
  owner_name: string;
  date: string;
  time: string;
  status: VisitStatus;
  notes?: string;
  created_at: string;
}

export type ApplicationStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'DECLINED' | 'WITHDRAWN';

export interface Application {
  id: string;
  property_id: string;
  property_title: string;
  property_image: string;
  locality: string;
  rent: number;
  renter_id: string;
  renter_name: string;
  renter_occupation: string;
  renter_phone: string;
  status: ApplicationStatus;
  message: string;
  move_in_date: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name?: string;
  sender_avatar?: string;
  text: string;
  message_type?: 'text' | 'image' | 'system' | 'visit_request';
  created_at: string;
  is_read: boolean;
}

export interface Conversation {
  id: string;
  property_id?: string;
  property_title?: string;
  property_image?: string;
  property_locality?: string;
  rent?: number;
  enquiry_id?: string;
  flatmate_profile_id?: string;
  flatmate_name?: string;
  flatmate_avatar?: string;
  renter_id: string;
  renter_name: string;
  renter_avatar: string;
  owner_id: string;
  owner_name: string;
  owner_avatar: string;
  last_message: string;
  updated_at: string;
  unread_count: number;
  messages: Message[];
}

export interface FlatmateProfile {
  id: string;
  user_id?: string;
  name: string;
  display_name?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Any' | 'Other';
  occupation: string;
  city: string;
  locality: string;
  preferred_locations?: string[];
  budget_min: number;
  budget_max: number;
  looking_for?: string; // e.g. "Need a flatmate", "Need a roommate", "Looking for a shared room"
  room_preference: 'Private Room' | 'Shared Room' | 'Any';
  property_types?: string[]; // e.g. ['1 BHK', '2 BHK', '3 BHK']
  furnishing?: string; // 'Any' | 'Fully Furnished' | 'Semi Furnished' | 'Unfurnished'
  move_in_date: string;
  move_in_timing?: string; // 'Immediately' | 'Within 2 weeks' | 'Within 1 month' | 'In 2–3 months'
  bio: string;
  avatar: string;
  lifestyle_preferences: string[]; // "Non-Smoker", "Early Riser", "Clean & Tidy", "Gym Enthusiast", "Pet Friendly", "Work from home", "Near Metro"
  match_score?: number;
  match_reasons?: string[];
  is_published?: boolean;
  is_paused?: boolean;
  user_type?: UserType;
  phone?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export type PGSharingType = 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'FOUR_SHARING';

export interface PGBed {
  id: string;
  bed_number: string;
  tenant_name?: string;
  tenant_phone?: string;
  status: 'VACANT' | 'OCCUPIED' | 'RESERVED';
}

export interface PGRoom {
  id: string;
  pg_id: string;
  room_number: string;
  sharing_type: PGSharingType;
  rent: number;
  deposit: number;
  capacity: number;
  available_beds: number;
  amenities: string[];
  beds: PGBed[];
}

export interface PG {
  id: string;
  owner_id: string;
  owner_name: string;
  name: string;
  description: string;
  city: string;
  locality: string;
  address: string;
  latitude: number;
  longitude: number;
  gender_allowed: 'Gents' | 'Ladies' | 'Unisex';
  verification_status: VerificationStatus;
  status: 'ACTIVE' | 'PAUSED' | 'FULL';
  rooms: PGRoom[];
  images: string[];
  amenities: string[];
  food_provided: boolean;
  near_landmarks: string[];
}

export interface Enquiry {
  id: string;
  property_id: string;
  property_title: string;
  renter_id: string;
  renter_name: string;
  renter_phone: string;
  owner_id: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'VISIT_SCHEDULED' | 'APPLIED' | 'CLOSED';
  created_at: string;
}

/** Raw Supabase `notifications` table row shape */
export interface SupabaseNotification {
  id: string;
  user_id: string;
  type: 'visit' | 'message' | 'application' | 'price' | 'system' | 'verification';
  title: string;
  body: string;
  data: Record<string, any> | null;
  read_at: string | null;
  created_at: string;
}

/** Raw Supabase `user_push_tokens` table row shape */
export interface SupabaseUserPushToken {
  id: string;
  user_id: string;
  push_token: string;
  device_os: 'ios' | 'android' | 'web' | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  body: string;
  message?: string; // backwards compatibility
  type: 'visit' | 'message' | 'application' | 'price' | 'system' | 'verification';
  data?: Record<string, any>;
  read: boolean;
  read_at?: string | null;
  created_at: string;
  link_id?: string;
}

export interface NotificationPreferences {
  messages: boolean;
  visits: boolean;
  property_updates: boolean;
  price_changes: boolean;
  applications: boolean;
  marketing: boolean;
}

export interface SafetyReport {
  id: string;
  reporter_id: string;
  reporter_name: string;
  property_id?: string;
  property_title?: string;
  reason: 'Fake Listing' | 'Wrong Information' | 'Already Rented' | 'Scam / Fraud' | 'Inappropriate Content' | 'Other';
  description: string;
  status: 'NEW' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  created_at: string;
}

export interface PropertyFilter {
  query: string;
  city: string;
  locality: string;
  property_type: PropertyType | 'ALL';
  bhk: string | 'ALL';
  rent_min: number;
  rent_max: number;
  furnishing: FurnishingType | 'ALL';
  brokerage_free_only: boolean;
  verified_only: boolean;
  amenities: string[];
  sort_by: 'recommended' | 'newest' | 'price_low' | 'price_high' | 'most_saved';
}
