export type UserRole = 'RENTER' | 'OWNER' | 'BROKER' | 'renter' | 'owner' | 'broker';
export type UserType = 'student' | 'working_professional' | 'family' | 'other';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface BrokerProfile {
  id: string;
  user_id: string;
  agency_name: string;
  company_name?: string;
  owner_name?: string;
  company_logo?: string;
  rera_number?: string;
  office_address?: string;
  operating_city?: string;
  years_experience?: number;
  languages?: string[];
  specializations?: string[];
  verified?: boolean;
  is_rera_verified?: boolean;
  rating?: number;
  properties_count?: number;
  clients_count?: number;
  response_time?: string;
  subscription_plan?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseBrokerProfile {
  id: string;
  user_id: string;
  agency_name: string;
  company_name?: string | null;
  owner_name: string | null;
  company_logo: string | null;
  rera_number: string | null;
  office_address: string | null;
  operating_city: string;
  years_experience: number;
  languages: string[];
  specializations: string[];
  verified: boolean;
  rating: number;
  properties_count: number;
  clients_count: number;
  response_time: string;
  subscription_plan: string;
  created_at: string;
  updated_at: string;
}

export interface BrokerClientLead {
  id: string;
  broker_id: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  client_avatar?: string;
  avatar?: string;
  requirement: string;
  requirement_bhk?: string;
  budget_min: number;
  budget_max: number;
  budget_range?: string;
  preferred_locations: string[];
  preferred_locality?: string;
  stage: 'NEW' | 'VIEWING_SCHEDULED' | 'OFFER_SUBMITTED' | 'CLOSED' | 'DROPPED' | 'CONTACTED' | 'NEGOTIATION' | 'CLOSED_WON' | 'LOST' | 'DEAL_CLOSED';
  is_verified: boolean;
  notes?: string;
  created_at: string;
}

export interface BrokerDashboardMetrics {
  active_inventory_count: number;
  total_clients_count: number;
  active_deals_count: number;
  visits_this_week: number;
  commission_earned: number;
  pipeline_value: number;
  average_closing_days: number;
  total_properties?: number;
  total_clients?: number;
  active_deals?: number;
  closed_deals?: number;
  monthly_commission?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  avatar_url?: string;
  profile_photo?: string;
  phone: string;
  email: string;
  bio?: string;
  role: UserRole;
  account_type?: 'renter' | 'owner' | 'broker';
  company_name?: string;
  company_logo?: string;
  is_broker_verified?: boolean;
  rera_number?: string;
  business_phone?: string;
  office_address?: string;
  operating_city?: string;
  broker_profile?: BrokerProfile;
  onboarding_completed?: boolean;
  city: string;
  locality: string;
  occupation: string;
  user_type: UserType;
  budget_min: number;
  budget_max: number;
  move_in_date: string;
  verification_status: VerificationStatus;
  kyc_verified?: boolean;
  kyc_status?: 'unverified' | 'pending' | 'verified' | 'rejected';
  aadhaar_last4?: string;
  pan_number?: string;
  digilocker_verified?: boolean;
  digilocker_verified_at?: string;
  kycData?: {
    isAadhaarVerified?: boolean;
    aadhaarNumber?: string;
    panNumber?: string;
    isPanVerified?: boolean;
    verificationStatus?: string;
  };
  is_blocked?: boolean;
  wallet_balance?: number;
  walletBalance?: number;
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
  role: 'renter' | 'owner' | 'broker';
  account_type?: 'renter' | 'owner' | 'broker' | null;
  company_name?: string | null;
  company_logo?: string | null;
  is_broker_verified?: boolean;
  rera_number?: string | null;
  business_phone?: string | null;
  office_address?: string | null;
  operating_city?: string | null;
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  kyc_verified?: boolean;
  kyc_status?: 'unverified' | 'pending' | 'verified' | 'rejected';
  aadhaar_last4?: string | null;
  pan_number?: string | null;
  digilocker_verified?: boolean;
  digilocker_verified_at?: string | null;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
}

export type PropertyCategory = 'residential' | 'commercial';

export type ResidentialType = 'flat' | 'room' | 'pg' | 'studio';

export type CommercialType =
  | 'office'
  | 'shop'
  | 'showroom'
  | 'warehouse'
  | 'commercial_building'
  | 'coworking'
  | 'commercial_plot'
  | 'other_commercial';

export type SupabasePropertyType = ResidentialType | CommercialType;

export type CommercialFurnishing = 'fully_furnished' | 'semi_furnished' | 'unfurnished' | 'bare_shell' | 'warm_shell';

/** Raw Supabase `properties` table row shape (DB column names) */
export interface SupabaseProperty {
  id: string;
  owner_id: string;
  category?: PropertyCategory;
  type: SupabasePropertyType;
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
  bedrooms?: string | null;
  bathrooms: number;
  area: number;
  furnishing: CommercialFurnishing;
  parking: string | null;
  availability: string | null;
  status: 'draft' | 'published' | 'paused' | 'removed';
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  amenities: string[];
  tenant_preferences: string[];
  views_count: number;
  saves_count: number;
  enquiries_count: number;
  floor_plan_url?: string | null;
  virtual_tour_url?: string | null;
  // Commercial-Specific DB Columns
  commercial_type?: CommercialType | null;
  floor_number?: string | null;
  total_floors?: number | null;
  washrooms?: number | null;
  parking_spaces?: string | null;
  power_backup?: boolean | null;
  lift?: boolean | null;
  carpet_area?: number | null;
  possession_status?: string | null;
  lease_type?: string | null;
  road_width?: number | null;
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
  display_name?: string | null;
  age: number | null;
  gender: 'male' | 'female' | 'any' | 'other' | null;
  profession: string;
  company?: string | null;
  college?: string | null;
  work_mode?: string | null;
  city: string;
  locality: string;
  preferred_locations: string[];
  bio: string | null;
  budget_min: number;
  budget_max: number;
  room_preference: 'private_room' | 'shared_room' | 'any';
  move_in_date: string;
  food_preference?: string | null;
  smoking?: string | null;
  drinking?: string | null;
  pet_friendly?: string | null;
  guest_policy?: string | null;
  cleanliness?: string | null;
  sleep_schedule?: string | null;
  languages?: string[];
  interests?: string[];
  music_preferences?: string[];
  photos?: string[];
  lifestyle_preferences: string[];
  trust_score?: number;
  is_kyc_verified?: boolean;
  verification_badges?: any;
  latitude?: number | null;
  longitude?: number | null;
  near_metro?: boolean;
  near_it_park?: boolean;
  near_college?: boolean;
  views_count?: number;
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

export type AppMode = 'renter' | 'owner' | 'broker' | 'RENTER' | 'FLATMATE' | 'LISTER' | 'OWNER' | 'BROKER';

export type PropertyType =
  // Residential
  | 'FLAT'
  | 'APARTMENT'
  | 'PRIVATE_ROOM'
  | 'SHARED_ROOM'
  | 'CO_LIVING'
  | 'PG'
  | 'STUDIO'
  // Commercial
  | 'OFFICE'
  | 'SHOP'
  | 'SHOWROOM'
  | 'WAREHOUSE'
  | 'COMMERCIAL_BUILDING'
  | 'COWORKING'
  | 'COMMERCIAL_PLOT'
  | 'OTHER_COMMERCIAL';

export type FurnishingType =
  | 'FULLY_FURNISHED'
  | 'SEMI_FURNISHED'
  | 'UNFURNISHED'
  | 'BARE_SHELL'
  | 'WARM_SHELL';

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
  category?: PropertyCategory;
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
  bhk: string; // e.g. "1 BHK", "2 BHK", "Studio", "Office", "Retail"
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
  tenant_preferences: string[];
  is_sponsored?: boolean;
  sponsor_priority?: number;
  views_count: number;
  saves_count: number;
  enquiries_count: number;
  visits_count?: number;
  price_changed?: boolean;
  previous_rent?: number;
  floor_plan_url?: string;
  virtual_tour_url?: string;
  
  // Commercial-Specific Attributes
  commercial_type?: string;
  floor_number?: string;
  washrooms?: number;
  parking_spaces?: string;
  power_backup?: boolean;
  lift?: boolean;
  carpet_area?: number;
  possession_status?: string;
  lease_type?: string;
  road_width?: number;
  society_name?: string;
  unit_number?: string;

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

export type ChatMessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'document'
  | 'property'
  | 'property_share'
  | 'visit'
  | 'visit_invite'
  | 'visit_request'
  | 'agreement'
  | 'rent_reminder'
  | 'payment_request'
  | 'system'
  | 'location'
  | 'audio'
  | 'voice_note';

export interface PropertyMessageMeta {
  property_id: string;
  title: string;
  image: string;
  rent: number;
  deposit?: number;
  locality: string;
  city?: string;
  bhk?: string;
  furnishing?: string;
}

export interface VisitMessageMeta {
  visit_id?: string;
  property_id?: string;
  property_title?: string;
  date: string;
  time: string;
  location: string;
  status: 'requested' | 'confirmed' | 'rescheduled' | 'declined' | 'completed';
  qr_pass_url?: string;
}

export interface AgreementMessageMeta {
  agreement_id?: string;
  title?: string;
  property_id?: string;
  property_title?: string;
  lease_term?: string;
  monthly_rent?: number;
  security_deposit?: number;
  status: 'draft' | 'pending_signature' | 'signed' | 'active';
  stamp_duty_verified?: boolean;
  document_url?: string;
}

export interface RentReminderMeta {
  rent_id?: string;
  amount: number;
  due_date: string;
  month_year: string;
  status: 'pending' | 'paid' | 'overdue';
  upi_autopay?: boolean;
}

export interface PaymentRequestMeta {
  amount: number;
  title: string;
  dueDate?: string;
  purpose?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  transaction_id?: string;
}

export interface ChatReplyTo {
  id: string;
  sender_name: string;
  text: string;
}

export interface MessageReactionMap {
  [emoji: string]: string[]; // array of userIds
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name?: string;
  sender_avatar?: string;
  text: string;
  message_type?: ChatMessageType;
  image_url?: string;
  video_url?: string;
  audio_url?: string;
  document_url?: string;
  document_name?: string;
  location?: { latitude: number; longitude: number; name?: string };
  metadata?: {
    property?: PropertyMessageMeta;
    visit?: VisitMessageMeta;
    agreement?: AgreementMessageMeta;
    rent_reminder?: RentReminderMeta;
    payment_request?: PaymentRequestMeta;
    [key: string]: any;
  };
  reply_to?: ChatReplyTo;
  reply_to_id?: string;
  reactions?: MessageReactionMap;
  is_starred?: boolean;
  is_edited?: boolean;
  edited_at?: string;
  is_deleted?: boolean;
  deleted_for?: string[];
  deleted_for_sender?: boolean;
  deleted_for_everyone?: boolean;
  seen_at?: string;
  delivered_at?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  created_at: string;
  is_read: boolean;
}

export type ConversationType = 'property' | 'flatmate' | 'owner' | 'lead' | 'system' | 'support';

export type UserPresenceStatus = 'online' | 'offline' | 'away';

export interface Conversation {
  id: string;
  type?: ConversationType;
  property_id?: string;
  property_title?: string;
  property_image?: string;
  property_locality?: string;
  property_rent?: number;
  rent?: number;
  enquiry_id?: string;
  flatmate_profile_id?: string;
  flatmate_name?: string;
  flatmate_avatar?: string;
  flatmate_locality?: string;
  flatmate_budget?: number;
  match_score?: number;
  other_user_id?: string;
  other_user_name?: string;
  other_user_avatar?: string;
  other_user_role?: string;
  is_verified?: boolean;
  is_pinned?: boolean;
  is_archived?: boolean;
  is_muted?: boolean;
  is_online?: boolean;
  last_seen?: string;
  is_typing?: boolean;
  typing_user_name?: string;
  metadata?: any;
  last_message_at?: string;
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

export interface FlatmateVerification {
  aadhaar?: boolean;
  phone?: boolean;
  selfie?: boolean;
  college?: boolean;
  work?: boolean;
  is_identity_verified?: boolean;
  is_phone_verified?: boolean;
  is_work_verified?: boolean;
  is_student_verified?: boolean;
  is_selfie_verified?: boolean;
}

export interface FlatmateCompatibilityBreakdown {
  title: string;
  category: 'budget' | 'location' | 'lifestyle' | 'habits';
  score: number;
  detail: string;
  matchType: 'perfect' | 'good' | 'neutral' | 'warning';
}

export interface FlatmateCompatibility {
  overall?: number;
  overall_score?: number;
  budgetScore?: number;
  budget_match?: number;
  locationScore?: number;
  location_match?: number;
  lifestyleScore?: number;
  lifestyle_match?: number;
  habitsScore?: number;
  habit_match?: number;
  explanation?: string;
  reason_summary?: string;
  differences?: string[];
  breakdown?: FlatmateCompatibilityBreakdown[];
}

export interface FlatmateFilter {
  gender?: 'All' | 'Male' | 'Female' | 'Co-ed' | 'male' | 'female' | 'any' | 'other';
  ageMin?: number;
  ageMax?: number;
  budgetMin?: number;
  budgetMax?: number;
  budget_min?: number;
  budget_max?: number;
  occupations?: string[];
  foodPreference?: 'All' | 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan' | 'veg' | 'non_veg' | 'eggetarian' | 'any';
  food_preference?: 'All' | 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan' | 'veg' | 'non_veg' | 'eggetarian' | 'any';
  smoking?: 'All' | 'Non-smoker' | 'Social' | 'Regular' | 'never' | 'outside_only' | 'occasional' | 'regular' | 'any';
  drinking?: 'All' | 'Non-drinker' | 'Social' | 'Regular' | 'never' | 'social' | 'occasional' | 'regular' | 'any';
  pets?: 'All' | 'Pet Friendly' | 'No Pets' | 'pet_friendly' | 'has_pets' | 'not_allowed' | 'any';
  languages?: string[];
  moveInTiming?: 'All' | 'Immediate' | 'Within 15 Days' | 'Next Month' | 'Flexible';
  verifiedOnly?: boolean;
  verified_only?: boolean;
  city?: string;
  locality?: string;
}

export interface FlatmateGalleryItem {
  id: string;
  flatmate_profile_id: string;
  user_id?: string;
  image_url: string;
  caption?: string;
  category?: 'lifestyle' | 'space' | 'hobbies' | 'pets' | string;
  sort_order?: number;
  created_at?: string;
}

export interface FlatmatePrompt {
  id: string;
  flatmate_profile_id?: string;
  prompt_question: string;
  prompt_answer: string;
  sort_order?: number;
  created_at?: string;
}

export interface FlatmateVerificationBadges {
  aadhaar?: boolean;
  work?: boolean;
  college?: boolean;
  phone?: boolean;
  email?: boolean;
  linkedin?: boolean;
  selfie?: boolean;
  company_name?: string;
  college_name?: string;
  verified_since?: string;
}

export interface FlatmateWaveRecord {
  id: string;
  sender_id: string;
  receiver_id: string;
  sender_profile_id?: string;
  sender_name: string;
  sender_avatar?: string;
  sender_locality?: string;
  target_profile_id: string;
  message?: string;
  is_super_wave: boolean;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  created_at: string;
  expires_at: string;
  accepted_at?: string;
}

export interface FlatmateMatchRecord {
  id: string;
  user_1_id: string;
  user_2_id: string;
  flatmate_1_profile_id?: string;
  flatmate_2_profile_id?: string;
  conversation_id?: string;
  match_score: number;
  status: 'active' | 'unmatched' | 'archived';
  created_at: string;
  other_profile?: FlatmateProfile;
}

export interface FlatmateProfile {
  id: string;
  user_id?: string;
  name: string;
  display_name?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Any' | 'Other' | 'male' | 'female' | 'any' | 'other';
  occupation?: string;
  profession?: string;
  user_type?: UserType;
  company_or_college?: string;
  company?: string;
  college?: string;
  work_mode?: 'wfh' | 'office' | 'hybrid' | string;
  city: string;
  locality: string;
  preferred_locations?: string[];
  preferred_localities?: string[];
  budget_min: number;
  budget_max: number;
  looking_for?: string;
  room_preference?: 'Private Room' | 'Shared Room' | 'Any' | 'private_room' | 'shared_room' | 'any';
  room_type_preference?: 'Private Room' | 'Shared Room' | 'Any' | 'private_room' | 'shared_room' | 'any';
  property_types?: string[];
  furnishing?: string;
  move_in_date: string;
  move_in_timing?: string;
  bio: string;
  avatar?: string;
  avatar_url?: string;
  photos?: string[];
  food_preference?: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Vegan' | 'veg' | 'non_veg' | 'eggetarian' | 'any' | string;
  smoking?: 'Non-smoker' | 'Social Smoker' | 'Regular Smoker' | 'never' | 'outside_only' | 'occasional' | 'regular' | 'any' | string;
  drinking?: 'Non-drinker' | 'Social Drinker' | 'Regular Drinker' | 'never' | 'social' | 'occasional' | 'regular' | 'any' | string;
  pets?: 'Pet Friendly' | 'No Pets' | 'Have Pets' | 'pet_friendly' | 'has_pets' | 'not_allowed' | 'any' | string;
  pet_friendly?: 'yes' | 'no' | 'has_pets' | 'pet_friendly' | string;
  guest_policy?: 'flexible' | 'day_only' | 'weekends_only' | 'no_guests' | string;
  cleanliness?: 'tidy' | 'moderate' | 'relaxed' | string;
  sleep_schedule?: 'early_bird' | 'night_owl' | 'flexible' | string;
  sleep_habit?: 'Early Riser' | 'Night Owl' | 'Flexible' | 'early_bird' | 'night_owl' | 'flexible' | string;
  work_style?: 'Work From Home' | 'Office Goer' | 'Hybrid' | 'wfh' | 'office' | 'hybrid' | string;
  languages?: string[];
  interests?: string[];
  music_preferences?: string[];
  lifestyle_preferences?: string[];
  lifestyle_tags?: string[];
  trust_score?: number;
  is_kyc_verified?: boolean;
  kyc_status?: 'verified' | 'pending' | 'unverified';
  verification_badges?: FlatmateVerificationBadges;
  verifications?: FlatmateVerification;
  compatibility?: FlatmateCompatibility;
  match_score?: number;
  match_reasons?: string[];
  is_published?: boolean;
  is_paused?: boolean;
  followers_count?: number;
  following_count?: number;
  waves_count?: number;
  social_handle?: string;
  phone?: string;
  email?: string;
  status?: string;
  latitude?: number;
  longitude?: number;
  near_metro?: boolean;
  near_it_park?: boolean;
  near_college?: boolean;
  views_count?: number;
  gallery?: FlatmateGalleryItem[];
  prompts?: FlatmatePrompt[];
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
  message?: string;
  type:
    | 'visit'
    | 'message'
    | 'application'
    | 'price'
    | 'system'
    | 'verification'
    | 'flatmate_wave'
    | 'property_saved'
    | 'enquiry'
    | 'reward'
    | 'rental_update'
    | 'payment'
    | 'lead'
    | 'wallet'
    | 'maintenance';
  data?: Record<string, any>;
  read: boolean;
  read_at?: string | null;
  created_at: string;
  link_id?: string;
}

export type NotificationCategoryType =
  | 'chat_message'
  | 'property_saved'
  | 'visit_booking'
  | 'visit_reminder'
  | 'cashback'
  | 'withdrawal'
  | 'flatmate_wave'
  | 'flatmate_match'
  | 'maintenance_due'
  | 'utility_due'
  | 'delivery_arrived'
  | 'visitor_arrived'
  | 'owner_lead'
  | 'price_drop'
  | 'system';

export interface RichNotificationPayload {
  title: string;
  body: string;
  image?: string;
  deepLink?: string;
  priority?: 'low' | 'default' | 'high' | 'urgent';
  sound?: string;
  badge?: number;
  data?: Record<string, any>;
  category?: string;
}

export interface NotificationPreferences {
  user_id?: string;
  chat_enabled?: boolean;
  property_enabled?: boolean;
  visit_enabled?: boolean;
  wallet_enabled?: boolean;
  rewards_enabled?: boolean;
  society_enabled?: boolean;
  marketing_enabled?: boolean;
  email_enabled?: boolean;
  sms_enabled?: boolean;
  quiet_hours_enabled: boolean;
  quiet_start?: string;
  quiet_end?: string;
  // Backward compatibility fields
  messages: boolean;
  visits: boolean;
  property_updates: boolean;
  price_changes: boolean;
  wallet_rewards: boolean;
  flatmates: boolean;
  owner_leads: boolean;
  rent_due: boolean;
  marketing: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  sound_enabled: boolean;
  sound_name: string;
  vibration_enabled: boolean;
  lock_screen_previews: boolean;
  badge_enabled: boolean;
  updated_at?: string;
}

export interface PushTokenRecord {
  id: string;
  user_id: string;
  push_token: string;
  expo_push_token?: string;
  platform?: 'ios' | 'android' | 'web';
  device_os: 'ios' | 'android' | 'web';
  device_model?: string;
  device_name?: string;
  app_version?: string;
  last_seen_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationLogRecord {
  id: string;
  user_id: string;
  notification_id?: string;
  push_token?: string;
  title: string;
  body: string;
  category: string;
  data?: Record<string, any>;
  status: 'sent' | 'failed' | 'suppressed_quiet_hours' | 'suppressed_preference';
  error_message?: string;
  ticket_id?: string;
  created_at: string;
}

export interface ScheduledNotificationRecord {
  id: string;
  user_id: string;
  title: string;
  body: string;
  category: string;
  data?: Record<string, any>;
  scheduled_for: string;
  status: 'pending' | 'sent' | 'cancelled';
  created_at: string;
  sent_at?: string;
}

export interface IncomingWave {
  id: string;
  flatmate_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  flatmate_name?: string;
  flatmate_avatar?: string;
  locality?: string;
  occupation?: string;
  budget?: string;
  intro?: string;
  message?: string;
  is_super_wave?: boolean;
  created_at: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface SafetyReport {
  id: string;
  reporter_id: string;
  reporter_name?: string;
  property_id?: string;
  property_title?: string;
  reason: 'Fake Listing' | 'Wrong Information' | 'Already Rented' | 'Scam / Fraud' | 'Inappropriate Content' | 'Other';
  description: string;
  details?: string;
  status: 'NEW' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  created_at: string;
}

export interface PropertyFilter {
  query: string;
  category?: PropertyCategory | 'ALL';
  city: string;
  locality: string;
  property_type: PropertyType | 'ALL';
  bhk: string | 'ALL';
  rent_min: number;
  rent_max: number;
  area_min?: number;
  area_max?: number;
  furnishing: FurnishingType | 'ALL';
  power_backup?: boolean;
  washrooms?: number;
  brokerage_free_only: boolean;
  verified_only: boolean;
  amenities: string[];
  sort_by: 'recommended' | 'newest' | 'price_low' | 'price_high' | 'most_saved';
}

export interface OwnerDashboardMetrics {
  total_properties: number;
  residential_properties?: number;
  commercial_properties?: number;
  active_properties: number;
  paused_properties: number;
  draft_properties: number;
  rented_properties: number;
  total_views: number;
  views_this_week: number;
  views_last_week: number;
  total_enquiries: number;
  pending_enquiries: number;
  contacted_enquiries: number;
  scheduled_enquiries: number;
  closed_enquiries: number;
  total_visits: number;
  pending_visits: number;
  confirmed_visits: number;
  completed_visits: number;
  cancelled_visits: number;
  total_saves: number;
}

export interface SavedSearch {
  id: string;
  user_id: string;
  title: string;
  category: string;
  locality?: string;
  city: string;
  budget_min?: number;
  budget_max?: number;
  bhk?: string[];
  furnishing?: string[];
  property_types?: string[];
  notify_email: boolean;
  notify_push: boolean;
  created_at: string;
}

export interface RecentSearch {
  id: string;
  user_id: string;
  query_text: string;
  filter_payload: Partial<PropertyFilter>;
  created_at: string;
}

export interface FlatmatePost {
  id: string;
  author_id: string;
  author_name?: string;
  author_avatar?: string;
  content: string;
  media_urls: string[];
  locality?: string;
  city?: string;
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
  is_pinned?: boolean;
  created_at: string;
  updated_at: string;
}

export interface FlatmateComment {
  id: string;
  post_id: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string;
  content: string;
  created_at: string;
}

export interface KycVerificationRecord {
  id: string;
  user_id: string;
  full_legal_name: string;
  aadhaar_number_masked?: string;
  aadhaar_front_url?: string;
  aadhaar_back_url?: string;
  pan_number_masked?: string;
  pan_doc_url?: string;
  selfie_url?: string;
  status: 'unverified' | 'pending' | 'verified' | 'rejected';
  rejection_reason?: string;
  admin_notes?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

// ==============================================================================
// REHVO WALLET, R-CASH & REWARDS TYPES
// ==============================================================================

export interface WalletRecord {
  id: string;
  user_id: string;
  balance: number;
  pending_cashback: number;
  lifetime_earned: number;
  lifetime_redeemed: number;
  referral_code: string;
  created_at: string;
  updated_at: string;
}

export type WalletTransactionType = 'credit' | 'debit';

export type WalletTransactionCategory =
  | 'rent_cashback'
  | 'referral'
  | 'reward_redemption'
  | 'welcome_bonus'
  | 'listing_bonus'
  | 'flatmate_bonus'
  | 'kyc_bonus'
  | 'zero_deposit_bonus'
  | 'bank_transfer'
  | 'withdrawal'
  | 'refund'
  | 'other';

export type WalletTransactionStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'expired'
  | 'reversed';

export interface WalletTransactionRecord {
  id: string;
  wallet_id: string;
  user_id: string;
  title: string;
  description?: string;
  amount: number;
  type: WalletTransactionType;
  category: WalletTransactionCategory;
  status: WalletTransactionStatus;
  reference_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export type RewardCategoryType =
  | 'food'
  | 'shopping'
  | 'travel'
  | 'furniture'
  | 'cleaning'
  | 'packers'
  | 'rent_cashback'
  | 'exclusive';

export interface RewardCampaignRecord {
  id: string;
  title: string;
  brand: string;
  category: RewardCategoryType;
  description: string;
  discount_badge: string;
  required_points: number;
  promo_code: string;
  terms: string;
  image_url: string;
  brand_logo?: string;
  stock_count: number;
  is_active: boolean;
  is_exclusive: boolean;
  expires_at?: string;
  created_at: string;
}

export interface RewardRedemptionRecord {
  id: string;
  user_id: string;
  campaign_id: string;
  campaign?: RewardCampaignRecord;
  points_spent: number;
  promo_code: string;
  status: 'active' | 'redeemed' | 'expired' | 'cancelled';
  redeemed_at: string;
  expires_at?: string;
}

export interface ReferralRecord {
  id: string;
  referrer_id: string;
  referee_id?: string;
  referral_code: string;
  friend_name: string;
  friend_phone?: string;
  friend_email?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  reward_status: 'pending' | 'credited' | 'expired' | 'cancelled';
  reward_amount: number;
  created_at: string;
  updated_at: string;
}

export type ChallengePeriod = 'daily' | 'weekly' | 'monthly';

export interface ChallengeRecord {
  id: string;
  user_id: string;
  challenge_id: string;
  title: string;
  description: string;
  period: ChallengePeriod;
  current_progress: number;
  target_progress: number;
  reward_amount: number;
  is_completed: boolean;
  is_claimed: boolean;
  claimed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CashbackSummary {
  available_balance: number;
  pending_cashback: number;
  lifetime_earned: number;
  lifetime_redeemed: number;
  this_month_earned: number;
  referral_earnings: number;
  rent_cashback_earned: number;
  rewards_redeemed_value: number;
  upcoming_cashback: number;
  breakdown: {
    rent_cashback: number;
    referral_cashback: number;
    rewards_cashback: number;
    welcome_bonus: number;
    listing_bonus: number;
    flatmate_bonus: number;
  };
}

// ==============================================================================
// RENTAL OPERATIONS ECOSYSTEM (V4.5)
// ==============================================================================

export type RentPaymentMethod = 'upi' | 'credit_card' | 'debit_card' | 'netbanking' | 'wallet';
export type RentPaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface SplitRentMember {
  name: string;
  phone: string;
  amount: number;
  status: 'paid' | 'pending';
  share_percent: number;
}

export interface PaymentMethodRecord {
  id: string;
  user_id: string;
  type: RentPaymentMethod;
  provider: string;
  label: string;
  last4?: string;
  upi_id?: string;
  expiry_month?: number;
  expiry_year?: number;
  card_network?: 'visa' | 'mastercard' | 'rupay' | 'amex' | 'other';
  is_default: boolean;
  token_reference?: string;
  created_at: string;
  updated_at: string;
}

export type AutoPayStatus = 'pending_auth' | 'active' | 'paused' | 'revoked' | 'expired';

export interface AutoPayMandateRecord {
  id: string;
  user_id: string;
  property_id?: string;
  payment_method_id?: string;
  mandate_ref: string;
  max_amount: number;
  deduction_day: number;
  frequency: 'monthly' | 'quarterly' | 'biannual' | 'annual';
  status: AutoPayStatus;
  next_deduction_date?: string;
  last_deduction_date?: string;
  bank_mandate_id?: string;
  created_at: string;
  updated_at: string;
}

export interface RentReceiptRecord {
  id: string;
  payment_id?: string;
  user_id: string;
  receipt_number: string;
  month_year: string;
  rent_amount: number;
  maintenance_amount: number;
  tenant_name: string;
  tenant_email?: string;
  tenant_pan?: string;
  landlord_name: string;
  landlord_pan?: string;
  landlord_signature_url?: string;
  property_address: string;
  hra_eligible: boolean;
  qr_code_payload: string;
  pdf_url?: string;
  created_at: string;
}

export interface PaymentFailureRecord {
  id: string;
  user_id: string;
  payment_ref: string;
  amount: number;
  payment_method: string;
  error_code: string;
  error_message: string;
  retry_count: number;
  resolved: boolean;
  created_at: string;
}

export interface LateFeeRuleRecord {
  id: string;
  property_id: string;
  grace_period_days: number;
  daily_late_fee: number;
  max_late_fee: number;
  interest_rate_percent: number;
  is_active: boolean;
  created_at: string;
}

export interface RentPaymentRecord {
  id: string;
  user_id: string;
  property_id?: string;
  property_name: string;
  locality: string;
  landlord_name: string;
  landlord_upi?: string;
  amount: number;
  base_rent: number;
  maintenance: number;
  platform_fee: number;
  discount: number;
  payment_method: RentPaymentMethod;
  payment_method_detail?: string;
  status: RentPaymentStatus;
  transaction_ref: string;
  cashback_earned: number;
  receipt_url?: string;
  due_date?: string;
  paid_at: string;
  split_rent_enabled?: boolean;
  split_with?: SplitRentMember[];
  emi_eligible?: boolean;
  emi_months?: number;
  emi_interest?: number;
  autopay_mandate_id?: string;
  late_fee_applied?: number;
  hra_receipt_id?: string;
  created_at: string;
  updated_at: string;
}

export type LeaseAgreementStatus =
  | 'draft'
  | 'pending_signatures'
  | 'biometrics_pending'
  | 'registered'
  | 'active'
  | 'expired'
  | 'cancelled';

export type LeaseDocType =
  | 'draft_contract'
  | 'estamp_certificate'
  | 'signed_pdf'
  | 'annexure'
  | 'biometric_slip'
  | 'police_noc'
  | 'termination_notice';

export interface LeaseDocumentRecord {
  id: string;
  lease_id: string;
  title: string;
  document_type: LeaseDocType;
  file_url: string;
  file_size_kb?: number;
  version: number;
  uploaded_by?: string;
  created_at: string;
}

export type LeaseEventType =
  | 'draft_created'
  | 'details_updated'
  | 'tenant_esign_requested'
  | 'tenant_signed'
  | 'owner_esign_requested'
  | 'owner_signed'
  | 'biometric_scheduled'
  | 'biometric_completed'
  | 'govt_registered'
  | 'renewal_requested'
  | 'renewal_approved'
  | 'termination_initiated'
  | 'lease_terminated'
  | 'deposit_refunded';

export interface LeaseEventRecord {
  id: string;
  lease_id: string;
  event_type: LeaseEventType;
  description: string;
  performed_by?: string;
  performed_by_name?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface LeaseSignatureRecord {
  id: string;
  lease_id: string;
  signer_role: 'tenant' | 'landlord' | 'witness' | 'executive';
  signer_name: string;
  signer_email?: string;
  signer_phone?: string;
  signature_type: 'aadhaar_otp' | 'biometric' | 'drawn' | 'uploaded';
  signature_image_url?: string;
  certificate_id?: string;
  aadhaar_masked?: string;
  ip_address?: string;
  signed_at: string;
  created_at: string;
}

export interface LeaseAgreementRecord {
  id: string;
  user_id: string;
  property_id?: string;
  property_title: string;
  property_locality: string;
  property_image?: string;
  landlord_name: string;
  landlord_phone: string;
  landlord_aadhaar_last4?: string;
  tenant_name: string;
  tenant_phone: string;
  tenant_aadhaar_last4?: string;
  monthly_rent: number;
  security_deposit: number;
  notice_period_days: number;
  lockin_months: number;
  duration_months: number;
  start_date: string;
  end_date: string;
  status: LeaseAgreementStatus;
  stamp_duty_amount: number;
  govt_registration_fee: number;
  registration_id?: string;
  biometric_status: 'not_scheduled' | 'scheduled' | 'completed';
  biometric_date?: string;
  biometric_slot?: string;
  biometric_executive?: string;
  estamp_number?: string;
  tenant_signed: boolean;
  owner_signed: boolean;
  tenant_signed_at?: string;
  owner_signed_at?: string;
  signed_pdf_url?: string;
  maintenance_fee?: number;
  renewal_eligible?: boolean;
  renewal_status?: 'none' | 'requested' | 'in_progress' | 'renewed' | 'declined';
  renewal_requested_at?: string;
  termination_requested_at?: string;
  termination_reason?: string;
  termination_status?: 'active' | 'notice_period' | 'terminated' | 'refund_pending';
  documents?: LeaseDocumentRecord[];
  events?: LeaseEventRecord[];
  signatures?: LeaseSignatureRecord[];
  created_at: string;
  updated_at: string;
}

export interface ZeroDepositPassRecord {
  id: string;
  user_id: string;
  credit_score: number;
  coverage_amount: number;
  monthly_fee: number;
  status: 'pending' | 'active' | 'expired' | 'revoked';
  certificate_id: string;
  valid_from: string;
  valid_until: string;
  landlord_protected: boolean;
  created_at: string;
  updated_at: string;
}

export interface TenantVerificationRecord {
  id: string;
  user_id: string;
  aadhaar_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  aadhaar_last4?: string;
  pan_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  pan_number?: string;
  face_match_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  employment_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  employer_name?: string;
  student_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  college_name?: string;
  police_verification_status: 'not_requested' | 'in_progress' | 'verified';
  background_check_status: 'pending' | 'clean' | 'flagged';
  overall_status: 'unverified' | 'in_progress' | 'verified';
  progress_percent: number;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface VisitSlotRecord {
  id: string;
  property_id: string;
  host_id?: string;
  day_of_week: number;
  slot_period: 'morning' | 'afternoon' | 'evening';
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export interface VisitBookingRecord {
  id: string;
  user_id: string;
  property_id?: string;
  property_title: string;
  property_locality: string;
  property_image?: string;
  host_name: string;
  host_phone?: string;
  visit_date: string;
  time_slot: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';
  qr_code_payload: string;
  special_notes?: string;
  slot_period?: 'morning' | 'afternoon' | 'evening' | 'custom';
  slot_start_time?: string;
  slot_end_time?: string;
  society_gate_code?: string;
  visitor_pass_number?: string;
  pass_expires_at?: string;
  calendar_synced?: boolean;
  calendar_event_id?: string;
  checkin_status?: 'pending' | 'checked_in' | 'no_show' | 'cancelled';
  checkin_time?: string;
  directions_url?: string;
  escort_name?: string;
  escort_phone?: string;
  created_at: string;
  updated_at: string;
}

export type ServiceBookingType = 'movers' | 'cleaning' | 'painting' | 'pest_control' | 'furniture';

export type ServiceBookingStatus =
  | 'booked'
  | 'confirmed'
  | 'requested'
  | 'accepted'
  | 'technician_assigned'
  | 'on_the_way'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface ServiceBookingRecord {
  id: string;
  user_id: string;
  service_type?: ServiceBookingType | string;
  provider_name?: string;
  provider_logo?: string;
  pickup_address?: string;
  drop_address?: string;
  booking_date?: string;
  time_slot?: string;
  home_size?: string;
  package_selected?: string;
  estimated_price?: number;
  final_price?: number;
  status: ServiceBookingStatus;
  tracking_stage?: 'quote_requested' | 'survey_scheduled' | 'quote_accepted' | 'crew_assigned' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  crew_lead_name?: string;
  crew_lead_phone?: string;
  crew_vehicle_number?: string;
  otp_start?: string;
  otp_completion?: string;
  insurance_covered?: boolean;
  insurance_amount?: number;
  inventory_count?: number;
  inspection_checklist?: any[];
  property_id?: string;
  invoice_url?: string;
  cancellation_reason?: string;
  tracking_notes?: string;
  category_id?: string;
  service_name?: string;
  address?: string;
  scheduled_date?: string;
  scheduled_slot?: string;
  notes?: string;
  coupon_code?: string;
  amount?: number;
  payment_method?: string;
  technician_id?: string;
  technician?: any;
  start_otp?: string;
  end_otp?: string;
  rating?: number;
  review?: string;
  created_at: string;
  updated_at: string;
}

export type UtilityType =
  | 'electricity'
  | 'wifi'
  | 'gas'
  | 'water'
  | 'address_change'
  | 'society_reg'
  | 'furniture_rental'
  | 'cleaning'
  | 'movers';

export interface UtilityProviderRecord {
  id: string;
  category: 'electricity' | 'water' | 'gas' | 'broadband' | 'maintenance' | 'parking';
  provider_name: string;
  logo_url?: string;
  region: string;
  customer_care?: string;
  portal_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface UtilityRequestRecord {
  id: string;
  user_id: string;
  property_id?: string;
  lease_id?: string;
  utility_type: UtilityType;
  title: string;
  provider: string;
  provider_id?: string;
  status: 'pending' | 'scheduled' | 'in_progress' | 'connected' | 'completed' | 'cancelled';
  scheduled_date?: string;
  time_slot?: string;
  consumer_number?: string;
  meter_reading_initial?: number;
  reading_photo_url?: string;
  bill_pdf_url?: string;
  monthly_estimate?: number;
  auto_pay_enabled?: boolean;
  account_id?: string;
  billing_cycle?: string;
  cancellation_reason?: string;
  timeline?: Array<{ status: string; title: string; timestamp: string; description?: string }>;
  details?: Record<string, any>;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type MoveInChecklistCategory =
  | 'keys_handover'
  | 'meter_readings'
  | 'inventory_check'
  | 'deep_cleaning'
  | 'wifi_setup'
  | 'society_gatepass'
  | 'amenity_access';

export interface MoveInChecklistRecord {
  id: string;
  user_id: string;
  lease_id?: string;
  property_id?: string;
  category: MoveInChecklistCategory;
  item_name: string;
  description?: string;
  is_completed: boolean;
  completed_at?: string;
  photo_urls: string[];
  condition_notes?: string;
  priority: 'high' | 'medium' | 'low';
  created_at: string;
  updated_at: string;
}

export interface InventoryItemRecord {
  id: string;
  property_id: string;
  lease_id?: string;
  room_name: string;
  item_name: string;
  quantity: number;
  condition: 'brand_new' | 'excellent' | 'good' | 'minor_wear' | 'needs_repair';
  photo_urls: string[];
  notes?: string;
  verified_by_tenant: boolean;
  verified_by_owner: boolean;
  created_at: string;
  updated_at: string;
}

export type DocumentVaultCategory =
  | 'identity'
  | 'income'
  | 'employment'
  | 'lease_agreements'
  | 'rent_receipts'
  | 'property_docs'
  | 'police_noc'
  | 'medical_other';

export type DocumentVaultType =
  | 'lease_agreement'
  | 'rent_receipt'
  | 'kyc_doc'
  | 'zero_deposit'
  | 'property_deed'
  | 'society_noc'
  | 'other';

export interface DocumentVaultRecord {
  id: string;
  user_id: string;
  title: string;
  document_type: DocumentVaultType;
  category?: DocumentVaultCategory;
  file_url: string;
  file_size: string;
  mime_type: string;
  related_id?: string;
  is_verified: boolean;
  ocr_extracted_text?: string;
  ocr_metadata?: Record<string, any>;
  expiry_date?: string;
  expiry_reminder_sent?: boolean;
  is_encrypted?: boolean;
  encryption_algorithm?: string;
  storage_path?: string;
  file_checksum?: string;
  doc_number_masked?: string;
  issuing_authority?: string;
  created_at: string;
  updated_at: string;
}

export interface OwnerBankAccountRecord {
  id: string;
  owner_id: string;
  account_holder_name: string;
  bank_name: string;
  account_number_masked: string;
  ifsc_code: string;
  account_type: 'savings' | 'current';
  upi_id?: string;
  is_primary: boolean;
  is_verified: boolean;
  verification_penny_drop_status: 'pending' | 'verified' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface OwnerPayoutWalletRecord {
  id: string;
  owner_id: string;
  current_balance: number;
  pending_settlement: number;
  lifetime_collected: number;
  lifetime_paid_out: number;
  last_payout_date?: string;
  auto_payout_frequency: 'instant' | 'daily' | 'weekly' | 'monthly';
  created_at: string;
  updated_at: string;
}

export interface OwnerPayoutTransactionRecord {
  id: string;
  wallet_id: string;
  owner_id: string;
  amount: number;
  payout_type: 'rent_settlement' | 'deposit_settlement' | 'maintenance_settlement' | 'bonus_credit';
  reference_id: string;
  bank_account_id?: string;
  status: 'initiated' | 'processing' | 'completed' | 'failed' | 'reversed';
  utr_number?: string;
  settled_at: string;
  notes?: string;
  created_at: string;
}

export interface ScratchCardRecord {
  id: string;
  user_id: string;
  campaign_id?: string;
  title: string;
  subtitle: string;
  min_reward: number;
  max_reward: number;
  actual_reward: number;
  is_scratched: boolean;
  scratched_at?: string;
  expires_at?: string;
  event_ref?: string;
  created_at: string;
}

// ==============================================================================
// V4.6 OWNER & LANDLORD ECOSYSTEM DOMAIN TYPES
// ==============================================================================

export type ListingLifecycleStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'PAUSED'
  | 'UNDER_REVIEW'
  | 'RENTED'
  | 'EXPIRED'
  | 'ARCHIVED';

export type OwnerVerificationStatus = 'VERIFIED' | 'PENDING' | 'UNVERIFIED' | 'REJECTED';

export interface OwnerProfile {
  id: string;
  user_id: string;
  business_name?: string;
  profile_photo?: string;
  owner_verification: OwnerVerificationStatus;
  gst_number?: string;
  kyc_status: 'VERIFIED' | 'PENDING' | 'SUBMITTED' | 'REJECTED';
  response_rate: number;
  avg_reply_time: string;
  total_listings: number;
  years_on_rehvo: number;
  phone?: string;
  email?: string;
  office_address?: string;
  created_at?: string;
  updated_at?: string;
}

export type OwnerPlanTier = 'free' | 'starter' | 'pro' | 'premium' | 'broker' | 'enterprise';
export type OwnerPlanCycle = 'monthly' | 'annual';

export interface OwnerSubscriptionPlan {
  id: string;
  user_id: string;
  plan_tier: OwnerPlanTier;
  plan_name: string;
  price: number;
  billing_cycle: OwnerPlanCycle;
  listings_limit: number;
  featured_credits: number;
  ai_boost_enabled: boolean;
  priority_support: boolean;
  crm_enabled: boolean;
  digital_lease_included: boolean;
  zero_deposit_priority: boolean;
  status: 'active' | 'expired' | 'cancelled' | 'trial';
  starts_at: string;
  expires_at?: string;
  auto_renew: boolean;
  created_at?: string;
  updated_at?: string;
}

export type TenantLeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'INTERESTED'
  | 'VISIT_SCHEDULED'
  | 'NEGOTIATION'
  | 'CLOSED'
  | 'LOST'
  | 'APPROVED'
  | 'REJECTED';

export interface TenantLeadRecord {
  id: string;
  owner_id: string;
  property_id?: string;
  property_title: string;
  property_locality?: string;
  tenant_id?: string;
  tenant_name: string;
  tenant_photo?: string;
  tenant_phone: string;
  tenant_email?: string;
  occupation?: string;
  is_verified: boolean;
  is_phone_verified: boolean;
  budget: number;
  move_in_date?: string;
  compatibility: number;
  wave_source: string;
  status: TenantLeadStatus;
  notes?: string;
  reminder_date?: string;
  rejection_reason?: string;
  last_contacted_at?: string;
  created_at: string;
  updated_at: string;
}

export type RentCollectionStatus = 'UPCOMING' | 'COLLECTED' | 'OVERDUE' | 'PENDING';

export interface RentCollectionRecord {
  id: string;
  owner_id: string;
  property_id?: string;
  property_title: string;
  tenant_id?: string;
  tenant_name: string;
  tenant_phone?: string;
  rent_amount: number;
  due_date: string;
  paid_date?: string;
  status: RentCollectionStatus;
  autopay_enabled: boolean;
  cashback_generated: number;
  receipt_url?: string;
  payment_method?: string;
  transaction_ref?: string;
  last_reminder_sent_at?: string;
  reminder_count: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type VisitCheckinStatus =
  | 'SCHEDULED'
  | 'CHECKED_IN'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RESCHEDULED';

export interface VisitCheckinRecord {
  id: string;
  visit_id?: string;
  property_id: string;
  property_title: string;
  property_locality?: string;
  owner_id: string;
  visitor_name: string;
  visitor_phone: string;
  visitor_avatar?: string;
  scheduled_time: string;
  qr_code_hash: string;
  checkin_status: VisitCheckinStatus;
  attendance_notes?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export type OwnerNotificationCategory =
  | 'LEADS'
  | 'VISITS'
  | 'RENT'
  | 'WALLET'
  | 'VERIFICATION'
  | 'LISTINGS'
  | 'REWARDS';

export interface OwnerNotificationRecord {
  id: string;
  owner_id: string;
  category: OwnerNotificationCategory;
  title: string;
  message: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

export type OwnerDocumentType =
  | 'PROPERTY_DOC'
  | 'OWNERSHIP_PROOF'
  | 'RENTAL_AGREEMENT'
  | 'TENANT_DOC'
  | 'RECEIPT'
  | 'NOC';

export type OwnerDocumentStatus = 'VERIFIED' | 'PENDING' | 'EXPIRED';

export interface OwnerDocumentRecord {
  id: string;
  owner_id: string;
  property_id?: string;
  property_title?: string;
  doc_type: OwnerDocumentType;
  title: string;
  file_url: string;
  file_size: string;
  file_format: string;
  status: OwnerDocumentStatus;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface OwnerPropertyAnalyticsRecord {
  id: string;
  property_id?: string;
  owner_id: string;
  date: string;
  views: number;
  saves: number;
  leads: number;
  visit_requests: number;
  chat_requests: number;
  rent_collected: number;
  occupancy_rate: number;
  interest_score: number;
  search_impressions: number;
}

export interface OwnerDashboardSummary {
  totalProperties: number;
  activeListings: number;
  monthlyEarnings: number;
  occupancyRate: number;
  totalViews: number;
  savedByUsers: number;
  upcomingVisits: number;
  pendingLeads: number;
  viewsThisWeek: number;
  newLeadsThisWeek: number;
  savedHomesThisWeek: number;
  visitRequestsThisWeek: number;
  rentedPropertiesCount: number;
  cancelledVisitsCount: number;
}

export type AnalyticsTimeFilter = '7d' | '30d' | '90d' | '1y';

export interface PropertySpecificAnalytics {
  propertyId: string;
  views: number;
  saves: number;
  chatsStarted: number;
  visitRequests: number;
  conversionRate: number;
  trend7d: { date: string; views: number; saves: number }[];
}

// ==============================================================================
// V5.4 BATCH 2: WALLET, REWARDS, RENTPAY & GAMIFICATION ECOSYSTEM
// ==============================================================================

export interface UserBankAccountRecord {
  id: string;
  user_id: string;
  account_holder_name: string;
  bank_name: string;
  account_number_masked: string;
  account_number_encrypted?: string;
  ifsc_code: string;
  account_type: 'savings' | 'current';
  upi_id?: string;
  is_primary: boolean;
  is_verified: boolean;
  penny_drop_status: 'pending' | 'verified' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface WalletWithdrawalRecord {
  id: string;
  user_id: string;
  wallet_id?: string;
  bank_account_id?: string;
  amount: number;
  fee: number;
  net_amount: number;
  status: 'initiated' | 'processing' | 'completed' | 'failed' | 'reversed';
  reference_id: string;
  utr_number?: string;
  failure_reason?: string;
  processed_at: string;
  created_at: string;
}

export interface CashbackRewardRecord {
  id: string;
  user_id: string;
  amount: number;
  category: 'rent_payment' | 'referral' | 'kyc_verification' | 'challenge_completion' | 'scratch_card' | 'bonus';
  status: 'pending' | 'credited' | 'expired' | 'reversed';
  title: string;
  description?: string;
  reference_id?: string;
  expires_at?: string;
  created_at: string;
}

export interface AutopaySettingRecord {
  id: string;
  user_id: string;
  lease_id?: string;
  utility_account_id?: string;
  account_id?: string;
  is_enabled?: boolean;
  is_active?: boolean;
  payment_method?: 'upi' | 'card' | 'netbanking' | string;
  payment_source?: 'wallet' | 'upi_autopay' | 'card';
  upi_id?: string;
  card_last4?: string;
  deduction_day?: number;
  max_amount?: number;
  max_limit?: number;
  mandate_reference?: string;
  status?: 'active' | 'paused' | 'revoked' | 'failed';
  last_deduction_date?: string;
  next_deduction_date?: string;
  last_executed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentReceiptRecord {
  id: string;
  payment_id: string;
  user_id: string;
  receipt_number: string;
  receipt_type: 'hra' | 'tax_invoice' | 'standard';
  receipt_url?: string;
  total_amount: number;
  rent_amount: number;
  maintenance_amount: number;
  tax_amount: number;
  landlord_name: string;
  landlord_pan?: string;
  tenant_name: string;
  property_title: string;
  property_address: string;
  period_start: string;
  period_end: string;
  qr_code_payload: string;
  created_at: string;
}

export interface CouponRecord {
  id: string;
  code: string;
  brand_name: string;
  brand_logo?: string;
  title: string;
  description: string;
  category: 'food' | 'shopping' | 'travel' | 'furniture' | 'cleaning' | 'packers' | 'rent_discount' | 'exclusive';
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  min_order_amount?: number;
  max_discount_cap?: number;
  points_required: number;
  terms_conditions?: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

export interface ReferralMilestoneRecord {
  id: string;
  milestone_tier: string;
  name: string;
  required_referrals: number;
  bonus_cashback: number;
  perk_description: string;
  badge_name: string;
  is_active: boolean;
}

export interface UserGamificationRecord {
  id: string;
  user_id: string;
  current_xp: number;
  current_level: number;
  current_streak: number;
  highest_streak: number;
  last_active_date: string;
  total_challenges_completed: number;
  total_rewards_claimed: number;
  created_at: string;
  updated_at: string;
}

export interface AchievementBadgeRecord {
  id: string;
  badge_code: string;
  title: string;
  description: string;
  icon_name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'emerald';
  xp_reward: number;
  is_active: boolean;
  is_unlocked?: boolean;
  unlocked_at?: string;
  created_at: string;
}

export interface FriendLeaderboardItem {
  id: string;
  name: string;
  avatar?: string;
  rank: number;
  xp: number;
  streak_days: number;
  is_user?: boolean;
}

// ==============================================================================
// V5.5 UTILITIES & TRUST & SAFETY DOMAIN TYPES
// ==============================================================================

export interface ElectricityBillRecord {
  id: string;
  user_id: string;
  property_id?: string;
  consumer_number: string;
  provider: string;
  billing_month: string;
  units_consumed: number;
  amount: number;
  due_date: string;
  status: 'due' | 'paid' | 'overdue';
  paid_at?: string;
  payment_ref?: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ElectricityProviderRecord {
  id: string;
  name: string;
  short_code: string;
  state: string;
  support_phone: string;
  consumer_number_format: string;
  consumer_number_digits: number;
  logo_url?: string;
}

export interface BroadbandPlanRecord {
  id: string;
  provider: string;
  plan_name: string;
  speed_mbps: number;
  price_monthly: number;
  ott_benefits: string[];
  installation_fee: number;
  rating: number;
  badge?: string;
  is_active: boolean;
}

export interface BroadbandBookingRecord {
  id: string;
  user_id: string;
  property_id?: string;
  plan_id: string;
  provider: string;
  plan_name: string;
  installation_address: string;
  appointment_date: string;
  appointment_slot: string;
  status: 'confirmed' | 'technician_assigned' | 'installed' | 'cancelled';
  technician_name?: string;
  technician_phone?: string;
  monthly_price: number;
  created_at: string;
  updated_at: string;
}

export interface WaterTankerBookingRecord {
  id: string;
  user_id: string;
  property_id?: string;
  capacity_litres: number;
  water_type: 'potable' | 'domestic';
  delivery_address: string;
  delivery_date: string;
  delivery_slot: string;
  vendor_name: string;
  vendor_phone: string;
  amount: number;
  status: 'scheduled' | 'dispatched' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface PngGasBookingRecord {
  id: string;
  user_id: string;
  property_id?: string;
  provider: string;
  consumer_bp_number?: string;
  connection_type: 'new' | 'transfer' | 'meter_reading';
  initial_meter_reading?: number;
  meter_photo_url?: string;
  status: 'under_review' | 'verified' | 'connected' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface EmergencyContactRecord {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  relationship: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface SosAlertRecord {
  id: string;
  user_id: string;
  latitude?: number;
  longitude?: number;
  location_address?: string;
  alert_type: 'general' | 'medical' | 'police' | 'fire' | 'women_safety';
  status: 'triggered' | 'acknowledged' | 'resolved' | 'false_alarm';
  dispatched_services: string[];
  triggered_at: string;
  resolved_at?: string;
}

export interface SafetyFacilityRecord {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'fire' | 'women_center';
  distance_km: number;
  address: string;
  phone: string;
  is_24x7: boolean;
  rating: number;
}

export type SocietyPassType = 'guest' | 'delivery' | 'cab' | 'service';

export interface SocietyEntryPassRecord {
  id: string;
  user_id: string;
  property_id?: string;
  pass_type: SocietyPassType;
  visitor_name: string;
  visitor_phone?: string;
  company_name?: string;
  vehicle_number?: string;
  access_code: string;
  qr_payload: string;
  valid_from: string;
  valid_to: string;
  status: 'active' | 'used' | 'expired' | 'revoked';
  checked_in_at?: string;
  created_at: string;
  updated_at: string;
}

export type MaintenanceCategory =
  | 'plumbing'
  | 'electrical'
  | 'carpentry'
  | 'appliance'
  | 'painting'
  | 'society_common'
  | 'other';

export type MaintenanceUrgency = 'low' | 'medium' | 'high' | 'emergency';

export interface MaintenanceTicketRecord {
  id: string;
  user_id: string;
  property_id?: string;
  category: MaintenanceCategory;
  urgency: MaintenanceUrgency;
  title: string;
  description: string;
  photos: string[];
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  assigned_technician?: string;
  technician_phone?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceTicketMessageRecord {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'tenant' | 'technician' | 'society_manager';
  message: string;
  created_at: string;
}

export interface MoveIn30ChecklistRecord {
  id: string;
  title: string;
  subtitle: string;
  category: 'pre_move' | 'day_of_move' | 'home_inspection' | 'utility_setup' | 'settling_in';
  completed: boolean;
  action_text?: string;
  route_target?: string;
}

// ==============================================================================
// V5.4.1 RESIDENT SERVICES DOMAIN TYPES
// ==============================================================================

export type UtilityAccountType =
  | 'electricity'
  | 'water'
  | 'gas'
  | 'broadband'
  | 'mobile'
  | 'dth'
  | 'maintenance';

export interface UtilityAccountRecord {
  id: string;
  user_id: string;
  property_id?: string;
  utility_type: UtilityAccountType;
  category?: UtilityAccountType;
  provider: string;
  biller_name?: string;
  consumer_number: string;
  nickname?: string;
  autopay_enabled: boolean;
  last_bill_amount?: number;
  last_bill_date?: string;
  next_due_date?: string;
  status: 'active' | 'inactive' | 'pending_verification';
  created_at: string;
  updated_at: string;
}

export interface UtilityTransactionRecord {
  id: string;
  user_id: string;
  utility_account_id?: string;
  utility_type: UtilityAccountType;
  provider: string;
  consumer_number: string;
  amount: number;
  payment_method: 'wallet' | 'upi' | 'card' | 'netbanking';
  wallet_deduction: number;
  upi_ref?: string;
  status: 'success' | 'pending' | 'failed';
  receipt_url?: string;
  created_at: string;
}

export type UtilityAutopayRecord = AutopaySettingRecord;

export interface MaintenancePaymentRecord {
  id: string;
  user_id: string;
  property_id?: string;
  society_name: string;
  flat_number: string;
  unit_number?: string;
  billing_month: string;
  bill_month?: string;
  amount: number;
  breakdown?: Record<string, number>;
  due_date: string;
  status: 'due' | 'paid' | 'overdue';
  payment_status?: 'pending' | 'paid' | 'overdue' | 'failed';
  paid_at?: string;
  payment_ref?: string;
  transaction_ref?: string;
  payment_method?: string;
  receipt_url?: string;
  created_at: string;
}

export interface ServiceCategoryRecord {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
  color: string;
  starting_price: number;
  duration: string;
  rating: number;
  technician_count: number;
  description?: string;
  faqs?: Array<{ q: string; a: string }>;
  badge?: string;
  is_active: boolean;
  created_at?: string;
}

export interface TechnicianRecord {
  id: string;
  name: string;
  phone: string;
  photo_url?: string;
  rating: number;
  total_jobs: number;
  specialization: string;
  is_verified: boolean;
  is_available: boolean;
  created_at?: string;
}

export type HomeServiceBookingRecord = ServiceBookingRecord;

export interface TechnicianReviewRecord {
  id: string;
  booking_id: string;
  technician_id: string;
  user_id: string;
  rating: number;
  tags?: string[];
  comment?: string;
  review?: string;
  created_at: string;
}

export type SocietyComplaintCategory =
  | 'water_leakage'
  | 'plumbing'
  | 'lift'
  | 'security'
  | 'cleaning'
  | 'cleanliness'
  | 'electricity'
  | 'parking'
  | 'noise'
  | 'other';

export type SocietyComplaintPriority = 'low' | 'medium' | 'high' | 'critical';

export type SocietyComplaintStatus =
  | 'registered'
  | 'investigating'
  | 'action_taken'
  | 'resolved'
  | 'closed'
  | 'pending'
  | 'in_progress';

export interface SocietyComplaintRecord {
  id: string;
  user_id: string;
  property_id?: string;
  category: SocietyComplaintCategory;
  priority: SocietyComplaintPriority;
  title: string;
  description: string;
  photos?: string[];
  status: SocietyComplaintStatus;
  timeline?: Array<{ status: string; label: string; timestamp: string }>;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SocietyNoticeRecord {
  id: string;
  society_name: string;
  property_id?: string;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  attachments?: string[];
  published_by: string;
  created_at: string;
}

export interface VisitorPassRecord {
  id: string;
  user_id: string;
  visitor_name: string;
  phone?: string;
  visitor_phone?: string;
  vehicle_number?: string;
  flat_number: string;
  unit_number?: string;
  society_name?: string;
  visit_date: string;
  time_slot: string;
  access_code: string;
  pass_code?: string;
  qr_payload: string;
  status: 'active' | 'used' | 'expired' | 'cancelled' | 'approved' | 'checked_in' | 'checked_out' | 'rejected';
  checked_in_at?: string;
  expires_at: string;
  purpose?: string;
  visitor_type?: 'guest' | 'cab' | 'delivery' | 'service' | 'visiting';
  valid_from?: string;
  valid_until?: string;
  created_at: string;
}

export interface DeliveryPassRecord {
  id: string;
  user_id: string;
  company: 'Amazon' | 'Blinkit' | 'Swiggy' | 'Zomato' | 'Flipkart' | 'Other';
  company_name?: string;
  delivery_person_name?: string;
  delivery_person_phone?: string;
  order_id?: string;
  unit_number?: string;
  society_name?: string;
  valid_until?: string;
  flat_number: string;
  access_code: string;
  pass_code?: string;
  qr_payload: string;
  status: 'active' | 'used' | 'expired' | 'cancelled' | 'approved' | 'delivered';
  expires_at: string;
  created_at: string;
}

export type AmenityType =
  | 'gym'
  | 'pool'
  | 'clubhouse'
  | 'tennis_court'
  | 'badminton_court'
  | 'party_hall';

export interface AmenityBookingRecord {
  id: string;
  user_id: string;
  property_id?: string;
  society_name: string;
  amenity_type: AmenityType;
  amenity_name?: string;
  booking_date: string;
  slot_time: string;
  time_slot?: string;
  unit_number?: string;
  participants_count: number;
  guest_count?: number;
  amount?: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  qr_code: string;
  pass_code?: string;
  created_at: string;
}

// ==============================================================================
// REHVO V6.2 — AI PROPERTY RECOMMENDATION ENGINE TYPES
// ==============================================================================
export type RecommendationCategory =
  | 'recommended'
  | 'similar_saved'
  | 'near_office'
  | 'trending'
  | 'zero_deposit'
  | 'luxury'
  | 'weekend';

export interface PropertyRecommendation {
  id: string;
  user_id: string;
  property_id: string;
  score: number; // 0 - 100
  match_reasons: string[];
  category: RecommendationCategory;
  is_dismissed: boolean;
  created_at?: string;
  updated_at?: string;
  property?: Property;
}

export interface RecommendedPropertyItem {
  property: Property;
  score: number; // 0 - 100
  matchReasons: string[];
  category: RecommendationCategory;
  isZeroDeposit?: boolean;
}

export interface RecommendationFeedback {
  id: string;
  user_id: string;
  property_id: string;
  interested: boolean;
  feedback_reason?: string;
  created_at?: string;
}

export interface SavedSearchRecord {
  id: string;
  user_id: string;
  name?: string;
  city?: string;
  locality?: string;
  min_price?: number;
  max_price?: number;
  bhk_types?: string[];
  furnishing?: string;
  office_address?: string;
  office_lat?: number;
  office_lng?: number;
  max_commute_minutes?: number;
  filters?: Record<string, any>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserPropertyViewRecord {
  id: string;
  user_id: string;
  property_id: string;
  duration_seconds: number;
  view_count: number;
  last_viewed_at: string;
  created_at: string;
}

// =============================================================================
// REHVO V6.2 STEP 2 — AI SEARCH + SMART MAPS 2.0 TYPES
// =============================================================================

export interface SearchHistoryRecord {
  id: string;
  user_id?: string;
  query_text: string;
  parsed_filters?: Record<string, any>;
  results_count: number;
  device_type?: string;
  created_at: string;
}

export interface LocalityScoreRecord {
  id: string;
  locality: string;
  city: string;
  latitude: number;
  longitude: number;
  walk_score: number; // 0-100
  safety_score: number; // 0-100
  noise_score: number; // 0-100
  greenery_score: number; // 0-100
  nightlife_score: number; // 0-100
  family_friendly_score: number; // 0-100
  internet_quality_score: number; // 0-100
  water_supply_score: number; // 0-100
  average_rent_1bhk: number;
  average_rent_2bhk: number;
  average_rent_3bhk: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export type CommuteHubType =
  | 'office'
  | 'metro'
  | 'airport'
  | 'railway'
  | 'college'
  | 'hospital'
  | 'gym'
  | 'restaurant'
  | 'grocery';

export interface CommuteHubRecord {
  id: string;
  name: string;
  hub_type: CommuteHubType;
  city: string;
  locality?: string;
  latitude: number;
  longitude: number;
  icon_name?: string;
  distanceKm?: number;
  created_at?: string;
}

export interface CommuteEstimate {
  hubName: string;
  hubType: CommuteHubType;
  distanceKm: number;
  walkingMinutes: number;
  bikeMinutes: number;
  carMinutes: number;
  metroMinutes?: number;
}

export type SearchSuggestionCategory =
  | 'locality'
  | 'society'
  | 'metro'
  | 'college'
  | 'tech_park'
  | 'landmark';

export interface SearchSuggestionItem {
  id: string;
  title: string;
  subtitle: string;
  category: SearchSuggestionCategory;
  locality?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  bhkHint?: string;
  budgetHint?: number;
}

export type MapOverlayType =
  | 'heat_map'
  | 'metro'
  | 'office'
  | 'college'
  | 'hospital'
  | 'grocery'
  | 'gym'
  | 'restaurant';

export interface AdvancedFilterPayload {
  // 1. Budget & Economics (6)
  rent_min?: number;
  rent_max?: number;
  deposit_min_months?: number;
  deposit_max_months?: number;
  zero_deposit_only?: boolean;
  zero_brokerage_only?: boolean;

  // 2. Unit Configuration (9)
  bhk?: string[]; // '1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'
  bathrooms?: number[]; // 1, 2, 3, 4+
  balconies?: number[]; // 1, 2, 3+
  property_types?: string[]; // 'apartment', 'villa', 'studio', 'penthouse', 'independent_floor'

  // 3. Furnishing & Interior (7)
  furnishing?: string; // 'ALL' | 'FULLY_FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED'
  has_ac?: boolean;
  modular_kitchen?: boolean;
  wardrobes?: boolean;
  gas_pipeline?: boolean;
  power_backup?: boolean;
  water_purifier?: boolean;

  // 4. Tenant & Lifestyle Preferences (8)
  tenant_types?: string[]; // 'FAMILY', 'BACHELOR', 'WORKING_PROFESSIONALS', 'GIRLS', 'BOYS'
  pet_friendly?: boolean;
  flatmate_compatible?: boolean;
  pure_veg_only?: boolean;
  non_veg_allowed?: boolean;
  smoking_allowed?: boolean;
  alcohol_allowed?: boolean;
  visitors_allowed?: boolean;

  // 5. Society & Infrastructure (13)
  gated_society?: boolean;
  security_24x7?: boolean;
  cctv?: boolean;
  lift?: boolean;
  covered_car_parking?: boolean;
  bike_parking?: boolean;
  ev_charging?: boolean;
  gym?: boolean;
  swimming_pool?: boolean;
  clubhouse?: boolean;
  children_play_area?: boolean;
  jogging_track?: boolean;
  intercom?: boolean;

  // 6. Availability, Trust & Location (6)
  move_in_timeline?: 'IMMEDIATE' | 'WITHIN_15_DAYS' | 'WITHIN_30_DAYS' | 'ANY';
  owner_verified_only?: boolean;
  video_tour_available?: boolean;
  floor_preference?: 'GROUND' | 'LOW' | 'MID' | 'HIGH' | 'ANY';
  facing?: 'EAST' | 'NORTH' | 'SEA_FACING' | 'GARDEN_FACING' | 'ANY';
  near_metro_only?: boolean;
}

// ==============================================================================
// REHVO V6.3 — AI PROPERTY COMPARE & NEIGHBORHOOD INTELLIGENCE TYPES
// ==============================================================================

export interface PropertyCompareSession {
  id: string;
  user_id?: string;
  property_ids: string[];
  winner_property_id?: string;
  notes?: string;
  created_at: string;
}

export interface ComparisonMatrixRow {
  category: string;
  label: string;
  values: Record<string, string | number | boolean>;
  highlightBest?: 'min' | 'max' | 'boolean_true';
  unit?: string;
}

export interface PropertyProsCons {
  propertyId: string;
  pros: string[];
  cons: string[];
}

export interface ComparisonWinner {
  category: 'best_value' | 'best_family' | 'best_bachelor' | 'best_investment';
  title: string;
  propertyId: string;
  score: number;
  badge: string;
  rationale: string;
}

export interface ComparisonMatrix {
  properties: Property[];
  rows: ComparisonMatrixRow[];
  winners: ComparisonWinner[];
  prosCons: Record<string, PropertyProsCons>;
  overallRecommendedPropertyId: string;
}

export interface HiddenCostBreakdown {
  propertyId: string;
  monthlyRent: number;
  securityDeposit: number;
  brokerageFee: number; // 0 for REHVO Direct
  agreementAndStampDuty: number;
  societyMoveInCharges: number;
  movingAndPacking: number;
  deepCleaningAndSanitization: number;
  utilitySecurityDeposits: number;
  initialHouseholdSetup: number;
  furnitureRentalMonthly: number;
  monthlyMaintenance: number;
  monthlyElectricityEst: number;
  monthlyWaterAndGasEst: number;
  monthlyWifiEst: number;
  totalInitialMoveInCost: number;
  totalFirstYearCost: number;
}

export interface RentVsBuyInput {
  homePrice: number;
  currentRent: number;
  downPaymentPercent: number;
  loanTenureYears: number;
  interestRatePercent: number;
  annualRentIncreasePercent: number;
  propertyAppreciationPercent: number;
  equityReturnPercent: number;
  monthlyMaintenance: number;
}

export interface RentVsBuyOutput {
  loanAmount: number;
  downPaymentAmount: number;
  monthlyEmi: number;
  totalInterestPaid: number;
  totalRentPaidOverTenure: number;
  propertyValueAtTenure: number;
  renterInvestmentValueAtTenure: number;
  breakEvenYear: number;
  recommendation: 'BUY' | 'RENT' | 'NEUTRAL';
  verdictTitle: string;
  verdictDescription: string;
  savingsOrGainDelta: number;
}

export interface InvestmentScoreData {
  propertyId: string;
  rentalYieldPercent: number;
  capitalAppreciationScore: number; // 0-10
  tenantDemandScore: number; // 0-10
  liquidityScore: number; // 0-10
  overallInvestmentScore: number; // 0-100
  recommendationGrade: 'Strong Buy' | 'Moderate Buy' | 'Hold';
}

export interface NeighborhoodScoresRecord {
  id: string;
  locality: string;
  city: string;
  walk_score: number;
  safety_score: number;
  nightlife_score: number;
  greenery_score: number;
  internet_score: number;
  water_score: number;
  traffic_score: number;
  family_score: number;
  pollution_score: number;
  overall_grade: string;
  description?: string;
  created_at: string;
}

export interface LocalityCrimeStatsRecord {
  id: string;
  locality: string;
  crime_index: number;
  safety_grade: string;
  women_safety: string;
  police_station: string;
  police_distance_km: number;
  cctv_coverage: string;
  emergency_numbers: string[];
  created_at: string;
}

export interface LocalityAirQualityRecord {
  id: string;
  locality: string;
  aqi: number;
  pm25: number;
  pm10: number;
  humidity: number;
  temperature: number;
  noise_level_db: number;
  status: string;
  updated_at: string;
  created_at: string;
}

export interface InternetProviderRecord {
  id: string;
  locality: string;
  provider: string;
  speed_mbps: number;
  latency: number;
  reliability: number;
  rating: number;
  plan_starting_price: number;
  created_at?: string;
}

export interface WaterSupplyScheduleRecord {
  id: string;
  locality: string;
  tanker_frequency: string;
  municipal_supply_hours: string;
  borewell_available: boolean;
  tds_level: number;
  pressure_rating: string;
  created_at?: string;
}

export interface PlaceItem {
  name: string;
  distance_km: number;
  rating?: number;
  time_mins?: number;
}

export interface LocalityPlacesRecord {
  id: string;
  locality: string;
  schools: PlaceItem[];
  hospitals: PlaceItem[];
  malls: PlaceItem[];
  cafes: PlaceItem[];
  gyms: PlaceItem[];
  metro: PlaceItem[];
  grocery: PlaceItem[];
  parks: PlaceItem[];
  pet_clinics?: PlaceItem[];
  coworking?: PlaceItem[];
  temples?: PlaceItem[];
  created_at?: string;
}

export type CommuteModeType = 'walk' | 'bike' | 'car' | 'metro' | 'bus' | 'auto';

export interface CommuteEstimateV2 {
  mode: CommuteModeType;
  label: string;
  durationMinutes: number;
  distanceKm: number;
  fareEstimateRupees: number;
  isPeakHour: boolean;
  transitLineName?: string;
}

export interface AIDecisionSummary {
  primaryRecommendedPropertyId: string;
  confidencePercent: number;
  headline: string;
  keyReason: string;
  dimensionFits: {
    budgetFit: number;
    commuteFit: number;
    amenitiesFit: number;
    lifestyleFit: number;
    familyFit: number;
    investmentFit: number;
  };
}

// =============================================================================
// REHVO V6.4: AI ASSISTANT OPERATING SYSTEM TYPES
// =============================================================================

export type AIMessageSender = 'user' | 'assistant' | 'system';

export type AIMessageType =
  | 'text'
  | 'property_card'
  | 'map_card'
  | 'negotiation_card'
  | 'agreement_card'
  | 'wallet_card'
  | 'checklist_card'
  | 'voice_note';

export type AIConversationContext =
  | 'general'
  | 'property'
  | 'neighborhood'
  | 'negotiation'
  | 'agreement'
  | 'flatmate'
  | 'budget'
  | 'movein';

export interface AIConversationRecord {
  id: string;
  user_id?: string;
  title: string;
  summary?: string;
  is_pinned: boolean;
  context_type: AIConversationContext;
  context_id?: string;
  last_message_preview?: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface AIMessageRecord {
  id: string;
  conversation_id: string;
  sender: AIMessageSender;
  content: string;
  message_type: AIMessageType;
  metadata: Record<string, any>;
  audio_url?: string;
  tokens_used: number;
  created_at: string;
}

export interface AISavedChatRecord {
  id: string;
  user_id?: string;
  conversation_id: string;
  tag: string;
  note?: string;
  created_at: string;
}

export type PropertyAIQueryType =
  | 'overpriced_check'
  | 'safety_check'
  | 'bachelor_fit'
  | 'family_fit'
  | 'commute_analysis'
  | 'investment_analysis'
  | 'hidden_costs'
  | 'schools'
  | 'metro'
  | 'custom';

export interface AIPropertyQueryRecord {
  id: string;
  user_id?: string;
  property_id: string;
  query_type: PropertyAIQueryType;
  user_question: string;
  ai_response: string;
  metrics: Record<string, any>;
  created_at: string;
}

export interface AIBudgetProfileRecord {
  id: string;
  user_id?: string;
  monthly_take_home: number;
  target_rent: number;
  max_rent: number;
  target_deposit: number;
  preferred_localities: string[];
  work_location: string;
  lifestyle_preferences: {
    petFriendly?: boolean;
    cooksDaily?: boolean;
    gymEnthusiast?: boolean;
    wfhDays?: number;
    parkingNeeded?: boolean;
  };
  estimated_monthly_bills: {
    electricity?: number;
    gas?: number;
    wifi?: number;
    maintenance?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface AINegotiationSessionRecord {
  id: string;
  user_id?: string;
  property_id: string;
  asking_rent: number;
  target_rent: number;
  recommended_counter_rent: number;
  confidence_score: number;
  strategy: string;
  whatsapp_script_en: string;
  whatsapp_script_hi: string;
  call_script_en: string;
  call_script_hi: string;
  status: 'active' | 'accepted' | 'rejected' | 'countered';
  created_at: string;
  updated_at: string;
}

export interface AIRecommendationHistoryRecord {
  id: string;
  user_id?: string;
  query_context: string;
  recommended_property_ids: string[];
  reasoning: string;
  created_at: string;
}

export interface AIUsageMetricRecord {
  id: string;
  user_id?: string;
  feature_name: string;
  tokens_prompt: number;
  tokens_completion: number;
  latency_ms: number;
  status: string;
  created_at: string;
}

// Client UI & Service Contracts
export interface AIChatMessage {
  id: string;
  conversationId: string;
  sender: AIMessageSender;
  content: string;
  messageType: AIMessageType;
  metadata?: Record<string, any>;
  audioUrl?: string;
  isStreaming?: boolean;
  createdAt: string;
}

export interface UserAIMemory {
  monthlyIncome: number;
  targetRent: number;
  maxRent: number;
  targetDeposit: number;
  preferredLocalities: string[];
  officeLocation: string;
  commuteMode: string;
  lifestyle: string[];
  flatmatePreferences?: {
    foodPreference?: string;
    smoking?: boolean;
    drinking?: boolean;
    sleepSchedule?: string;
    workSchedule?: string;
  };
}

export interface PropertyAIExplanation {
  propertyId: string;
  queryType: PropertyAIQueryType;
  headline: string;
  verdict: 'Excellent' | 'Good' | 'Fair' | 'Caution';
  scoreOutOf100: number;
  detailedAnalysis: string;
  bulletPoints: string[];
  suggestedAction: string;
  confidenceScore: number;
  metricsBadge?: string;
}

export interface AIBudgetPlan {
  monthlyIncome: number;
  recommendedRent: number;
  maxRentLimit: number;
  recommendedDeposit: number;
  rentToIncomeRatio: number;
  categoryBreakdown: {
    rent: number;
    livingAndUtilities: number;
    investmentsAndSavings: number;
    discretionary: number;
  };
  monthlyBillsEstimate: {
    electricity: number;
    maintenance: number;
    gasAndWater: number;
    broadbandWifi: number;
    totalBills: number;
  };
  adviceNotes: string[];
}

export interface AgreementAISummary {
  rentAmount: number;
  securityDeposit: number;
  lockInPeriodMonths: number;
  noticePeriodDays: number;
  annualRentEscalationPercent: number;
  keyClausesExplained: {
    clauseName: string;
    plainEnglish: string;
    plainHindi: string;
    riskLevel: 'safe' | 'caution' | 'risky';
    warningNote?: string;
  }[];
  questionsForLandlord: string[];
  overallAgreementHealthGrade: 'A+' | 'A' | 'B' | 'High Risk';
}

export interface SocietyAISummary {
  societyName: string;
  locality: string;
  overallVibe: string;
  petPolicy: {
    allowed: boolean;
    rules: string;
  };
  bachelorPolicy: {
    allowed: boolean;
    restrictions: string;
  };
  moveInPolicy: {
    chargesRupees: number;
    permittedDays: string;
    gatePassRequired: boolean;
  };
  visitorRules: string;
  pros: string[];
  cons: string[];
}

export interface LocalityRecommendation {
  locality: string;
  rank: number;
  matchScore: number;
  commuteTimeMinutes: number;
  estimated1BHKRent: number;
  estimated2BHKRent: number;
  vibe: string;
  topReasons: string[];
}

export interface FlatmateAIAdvice {
  compatibilityScore: number;
  verdict: 'Super Match' | 'Great Match' | 'Moderate Match' | 'Proceed With Caution';
  summary: string;
  icebreakers: string[];
  redFlagsToCheck: string[];
  choresAndScheduleAdvice: string;
  budgetSplitRecommendation: {
    roomTypeA: string;
    sharePercentA: number;
    roomTypeB: string;
    sharePercentB: number;
    rationale: string;
  };
}

export interface NegotiationAIResult {
  propertyId: string;
  askingRent: number;
  desiredRent: number;
  aiTargetRent: number;
  estimatedSavingsAnnual: number;
  negotiationConfidencePercent: number;
  bestAngle: string;
  whatsappMessageEnglish: string;
  whatsappMessageHindi: string;
  phoneCallScriptEnglish: string;
  phoneCallScriptHindi: string;
  counterOfferSteps: {
    step: number;
    offerRent: number;
    scriptPointers: string;
  }[];
}

export interface MovingChecklist {
  moveInDate: string;
  isFurnished: boolean;
  weeksOutChecklist: {
    timeframe: string;
    tasks: {
      id: string;
      title: string;
      category: 'packing' | 'utilities' | 'paperwork' | 'shopping' | 'society';
      priority: 'high' | 'medium' | 'low';
      completed: boolean;
    }[];
  }[];
  essentialGroceriesStarter: string[];
  furnitureRecommendations: string[];
  addressChangeAgencies: string[];
}

export interface LegalAnswer {
  question: string;
  answerEnglish: string;
  answerHindi: string;
  relevantLawOrPrecedent: string;
  practicalTips: string[];
}

export interface VisitQuestions {
  propertyId?: string;
  questionsForOwner: string[];
  questionsForSecurityOrWatchman: string[];
  thingsToInspectInUnit: string[];
}

export interface EstimatedBills {
  monthlyRent: number;
  electricityRange: { min: number; max: number };
  pipedGasOrCylinder: number;
  societyMaintenance: number;
  highSpeedWifi: number;
  waterSupplyCharges: number;
  maidAndCookRange: { min: number; max: number };
  totalMonthlyUtilityMin: number;
  totalMonthlyUtilityMax: number;
}

// =============================================================================
// REHVO V7.1: REAL MAPS + CAMERA + VOICE AI OPERATING SYSTEM TYPES
// =============================================================================

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export type SavedPlaceType = 'home' | 'office' | 'college' | 'gym' | 'favorite' | 'custom';

export interface LocationHistoryRecord {
  id: string;
  user_id?: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  address?: string;
  locality: string;
  city: string;
  recorded_at: string;
}

export interface SavedPlaceRecord {
  id: string;
  user_id?: string;
  place_type: SavedPlaceType;
  label: string;
  address: string;
  locality: string;
  latitude: number;
  longitude: number;
  icon_name: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyRouteHistoryRecord {
  id: string;
  user_id?: string;
  property_id: string;
  origin_lat: number;
  origin_lng: number;
  origin_address?: string;
  destination_lat: number;
  destination_lng: number;
  destination_address?: string;
  transit_mode: CommuteModeType;
  eta_minutes: number;
  distance_km: number;
  fare_estimate: number;
  co2_grams: number;
  is_peak_hour: boolean;
  navigated_at: string;
}

export type VoiceLanguage = 'en' | 'hi' | 'hinglish';

export type VoiceCommandIntent =
  | 'search_property'
  | 'check_safety'
  | 'negotiate'
  | 'explain_agreement'
  | 'directions'
  | 'general_chat';

export interface VoiceQueryRecord {
  id: string;
  user_id?: string;
  audio_duration_ms: number;
  language: VoiceLanguage;
  raw_transcript: string;
  detected_intent: string;
  confidence_score: number;
  response_text?: string;
  executed_action?: string;
  created_at: string;
}

export type OCRDocumentType =
  | 'aadhaar'
  | 'pan'
  | 'driving_license'
  | 'passport'
  | 'rent_agreement'
  | 'electricity_bill'
  | 'water_bill'
  | 'gas_bill';

export interface OCRExtractedData {
  name?: string;
  dob?: string;
  gender?: string;
  address?: string;
  locality?: string;
  pincode?: string;
  documentNumberRaw?: string;
  documentNumberMasked: string;
  expiryDate?: string;
  consumerNumber?: string;
  billAmount?: number;
  billingMonth?: string;
  issueDate?: string;
  landlordName?: string;
  tenantName?: string;
  monthlyRent?: number;
  depositAmount?: number;
}

export interface OCRDocumentRecord {
  id: string;
  user_id?: string;
  document_type: OCRDocumentType;
  document_number_masked: string;
  extracted_data: OCRExtractedData;
  ocr_raw_text?: string;
  confidence_score: number;
  verification_status: 'VERIFIED' | 'REVIEW_NEEDED' | 'REJECTED';
  file_url: string;
  thumbnail_url?: string;
  created_at: string;
}

export type MediaUploadStatus = 'pending' | 'uploading' | 'completed' | 'failed';

export interface MediaUploadRecord {
  id: string;
  user_id?: string;
  bucket_name: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  file_size_bytes: number;
  upload_status: MediaUploadStatus;
  progress_percent: number;
  public_url?: string;
  thumbnail_url?: string;
  retry_count: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export type PropertyMediaCategory =
  | 'living_room'
  | 'master_bedroom'
  | 'bedroom'
  | 'kitchen'
  | 'balcony'
  | 'bathroom'
  | 'exterior'
  | 'amenity'
  | 'floorplan'
  | 'other';

export interface PropertyMediaMetadataRecord {
  id: string;
  property_id: string;
  media_type: 'photo' | 'video' | '360' | 'floorplan';
  media_url: string;
  thumbnail_url?: string;
  title?: string;
  category: PropertyMediaCategory;
  sort_order: number;
  ai_quality_score: number;
  is_cover: boolean;
  width?: number;
  height?: number;
  created_at: string;
}

export interface CameraSessionRecord {
  id: string;
  user_id?: string;
  session_type:
    | 'property_listing'
    | 'kyc_verification'
    | 'movein_inspection'
    | 'flatmate_profile'
    | 'document_scan';
  photos_captured_count: number;
  metadata: Record<string, any>;
  created_at: string;
}

// Client Contracts & UI State
export interface PlaceSearchResult {
  id: string;
  name: string;
  address: string;
  locality: string;
  latitude: number;
  longitude: number;
  placeType?: SavedPlaceType;
  distanceKm?: number;
}

export interface TransitDirections {
  origin: GeoPoint;
  destination: GeoPoint;
  originAddress: string;
  destinationAddress: string;
  mode: CommuteModeType;
  durationMinutes: number;
  distanceKm: number;
  estimatedFareRupees: number;
  co2Grams: number;
  isPeakHour: boolean;
  steps: {
    instruction: string;
    distanceMeters: number;
    durationMinutes: number;
  }[];
}

export interface MediaCaptureResult {
  uri: string;
  width: number;
  height: number;
  type: 'image' | 'video';
  base64?: string;
  fileSize?: number;
  category?: PropertyMediaCategory;
}

export interface OCRScanResult {
  success: boolean;
  documentType: OCRDocumentType;
  extractedData: OCRExtractedData;
  rawText: string;
  confidenceScore: number;
  verificationStatus: 'VERIFIED' | 'REVIEW_NEEDED' | 'REJECTED';
}

export type VoiceAIState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

// ==============================================================================
// REHVO V7.2: FINAL LAUNCH ENTERPRISE TYPES
// ==============================================================================

// 1. Security Center Pro Types
export interface UserSessionRecord {
  id: string;
  user_id?: string;
  device_name: string;
  device_id: string;
  ip_address: string;
  platform: 'ios' | 'android' | 'web';
  last_active_at: string;
  is_current: boolean;
  is_trusted: boolean;
  created_at: string;
}

export interface LoginHistoryRecord {
  id: string;
  user_id?: string;
  ip_address: string;
  device_name: string;
  location: string;
  status: 'success' | 'failed' | 'blocked';
  login_method: 'biometric' | 'otp' | 'pin' | 'password';
  attempted_at: string;
}

export interface UserSecuritySettings {
  id: string;
  user_id?: string;
  biometric_enabled: boolean;
  app_lock_enabled: boolean;
  pin_hash?: string;
  auto_lock_duration: number; // 0 (immediately), 30, 60, 300
  two_factor_enabled: boolean;
  incognito_mode: boolean;
  dpdp_consent_given: boolean;
  created_at?: string;
  updated_at: string;
}

// 2. Analytics Engine Types
export interface AnalyticsEvent {
  id?: string;
  user_id?: string;
  event_name: string;
  properties: Record<string, any>;
  session_id?: string;
  platform: string;
  screen_name?: string;
  created_at?: string;
}

export interface AnalyticsFunnelStep {
  step_name: string;
  count: number;
  dropoff_percentage: number;
}

export interface AnalyticsDashboardData {
  daily_active_users: number;
  total_page_views: number;
  searches_today: number;
  conversion_rate: number;
  top_properties: Array<{ id: string; title: string; views: number }>;
  live_visitors: number;
}

// 3. Admin CMS & Feature Flags Types
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description?: string;
  rollout_percentage: number;
  created_at?: string;
  updated_at?: string;
}

export interface CmsAnnouncement {
  id: string;
  title: string;
  body: string;
  audience: 'all' | 'renter' | 'owner' | 'broker';
  priority: 'low' | 'medium' | 'high' | 'critical';
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
}

export interface CmsBanner {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  cta_text?: string;
  cta_link?: string;
  placement: 'home' | 'search' | 'wallet' | 'owner';
  display_order: number;
  is_active: boolean;
  created_at: string;
}

// 4. Support System Types
export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  sender_id?: string;
  sender_role: 'user' | 'agent' | 'bot' | 'system';
  message: string;
  attachments?: string[];
  created_at: string;
}

export interface SupportFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful_count: number;
}

// 5. Payment Gateway Production Types
export type PaymentMethodV72 = 'upi' | 'card' | 'netbanking' | 'rcash' | 'autopay';
export type PaymentStatusV72 = 'initiated' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface PaymentTransactionV72 {
  id: string;
  user_id?: string;
  order_id: string;
  payment_method: PaymentMethodV72;
  amount: number;
  currency: string;
  status: PaymentStatusV72;
  purpose: string;
  metadata?: Record<string, any>;
  invoice_url?: string;
  created_at: string;
}

export interface PaymentGatewayOrder {
  order_id: string;
  amount: number;
  currency: string;
  status: PaymentStatusV72;
  checkout_url?: string;
  qr_code?: string;
}

// 6. Referral Streaks Types
export interface ReferralStreakRecord {
  id: string;
  user_id: string;
  streak_count: number;
  last_invite_at?: string;
  milestones_completed: string[];
  total_earned: number;
  created_at: string;
  updated_at: string;
}

// 7. App Updates & Campaigns
export interface AppVersionRecord {
  id: string;
  platform: 'ios' | 'android' | 'web';
  latest_version: string;
  min_supported_version: string;
  force_update: boolean;
  release_notes?: string;
  store_url?: string;
  created_at: string;
}

export interface CampaignPopup {
  id: string;
  title: string;
  message: string;
  image_url?: string;
  cta_label: string;
  cta_action: string;
  is_active: boolean;
}

// 8. Rental Document Center Types
export type RentalDocumentType =
  | 'agreement'
  | 'receipt'
  | 'noc'
  | 'id_proof'
  | 'tax_certificate'
  | 'police_verification';

export interface RentalDocument {
  id: string;
  title: string;
  doc_type: RentalDocumentType;
  file_url: string;
  size_bytes: number;
  date_created: string;
  is_verified: boolean;
  download_count: number;
}

// 9. Owner Business Suite Types
export interface OwnerPropertyPerformance {
  property_id: string;
  title: string;
  locality: string;
  rent: number;
  occupancy_rate: number;
  gross_yield: number;
  net_yield: number;
  total_revenue_ytd: number;
  maintenance_expenses: number;
  vacancy_days_predicted: number;
  status: 'occupied' | 'vacant' | 'under_maintenance';
}

