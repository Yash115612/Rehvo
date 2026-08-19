export type PropertyType = 'flat' | 'room' | 'pg' | 'studio';
export type FurnishingType = 'fully_furnished' | 'semi_furnished' | 'unfurnished';
export type PropertyStatus = 'draft' | 'published' | 'paused' | 'removed';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface PropertyImage {
  id: string;
  property_id?: string;
  image_url: string;
  storage_path?: string | null;
  is_cover: boolean;
  sort_order: number;
  created_at?: string;
}

export interface Property {
  id: string;
  owner_id: string;
  type: PropertyType;
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
  furnishing: FurnishingType;
  parking: string | null;
  availability: string | null;
  status: PropertyStatus;
  verification_status: VerificationStatus;
  amenities: string[];
  tenant_preferences: string[];
  views_count: number;
  saves_count: number;
  enquiries_count: number;
  created_at: string;
  updated_at: string;
  property_images?: PropertyImage[];
  owner?: {
    id: string;
    full_name: string;
    phone?: string;
    email?: string;
    profile_photo?: string;
    verification_status?: VerificationStatus;
  };
}

export interface FlatmateProfile {
  id: string;
  user_id: string;
  photo?: string | null;
  age?: number | null;
  gender?: 'male' | 'female' | 'any' | 'other' | null;
  profession: string;
  city: string;
  locality: string;
  preferred_locations: string[];
  bio?: string | null;
  budget_min: number;
  budget_max: number;
  room_preference: 'private_room' | 'shared_room' | 'any';
  move_in_date: string;
  lifestyle_preferences: string[];
  status: 'draft' | 'published' | 'paused';
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    phone?: string;
    email?: string;
    profile_photo?: string;
  };
}

export interface Enquiry {
  id: string;
  user_id: string;
  property_id: string;
  owner_id: string;
  message: string;
  status: 'pending' | 'replied' | 'scheduled' | 'closed';
  created_at: string;
  updated_at: string;
  properties?: Property;
  renter_profile?: {
    id: string;
    full_name: string;
    phone?: string;
    email?: string;
    profile_photo?: string;
  };
  owner_profile?: {
    id: string;
    full_name: string;
    phone?: string;
    email?: string;
    profile_photo?: string;
  };
}

export interface Visit {
  id: string;
  property_id: string;
  user_id: string;
  owner_id: string;
  scheduled_date: string;
  scheduled_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string | null;
  created_at: string;
  updated_at: string;
  properties?: Property;
  renter_profile?: {
    id: string;
    full_name: string;
    phone?: string;
    email?: string;
    profile_photo?: string;
  };
  owner_profile?: {
    id: string;
    full_name: string;
    phone?: string;
    email?: string;
    profile_photo?: string;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name?: string;
  sender_avatar?: string;
  message: string;
  message_type: 'text' | 'image' | 'system' | 'visit_request';
  read_at?: string | null;
  created_at: string;
  is_read?: boolean;
}

export interface Conversation {
  id: string;
  property_id?: string;
  enquiry_id?: string;
  flatmate_profile_id?: string;
  last_message_text?: string | null;
  last_message_at?: string | null;
  created_at: string;
  updated_at: string;
  properties?: Property;
  flatmate_profiles?: FlatmateProfile;
  participants?: {
    id: string;
    user_id: string;
    unread_count: number;
    last_read_at?: string | null;
    profiles?: {
      id: string;
      full_name: string;
      phone?: string;
      profile_photo?: string;
    };
  }[];
  unread_count?: number;
  other_participant?: {
    id: string;
    full_name: string;
    profile_photo?: string;
    phone?: string;
  };
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'visit' | 'message' | 'application' | 'price' | 'system' | 'verification';
  title: string;
  body: string;
  data?: Record<string, any>;
  read_at?: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  profile_photo?: string | null;
  city?: string | null;
  state?: string | null;
  locality?: string | null;
  bio?: string | null;
  occupation?: string | null;
  user_type?: 'student' | 'working_professional' | 'family' | 'other' | null;
  role: 'renter' | 'owner';
  verification_status: VerificationStatus;
  is_blocked?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OwnerMetrics {
  totalListings: number;
  activeListings: number;
  pausedListings: number;
  totalViews: number;
  totalEnquiries: number;
  totalVisits: number;
  pendingVisits: number;
}
