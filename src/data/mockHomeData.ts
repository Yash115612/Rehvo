import { Property, PG, FlatmateProfile } from '../types';

export interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  image: string;
  filterType: string;
}

export interface LifestyleCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  image: string;
  tag: string;
  filterKey: string;
}

export interface LocationItem {
  id: string;
  name: string;
  startingRent: string;
  image: string;
  popularFor: string;
  propertyCount: number;
}

export const HOME_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat_flats',
    title: 'Flats',
    subtitle: 'Entire homes',
    icon: '🏠',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    filterType: 'FLAT',
  },
  {
    id: 'cat_pg',
    title: 'PG',
    subtitle: 'Move-in ready',
    icon: '🛏️',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
    filterType: 'PG',
  },
  {
    id: 'cat_rooms',
    title: 'Rooms',
    subtitle: 'Private & shared',
    icon: '🚪',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
    filterType: 'PRIVATE_ROOM',
  },
  {
    id: 'cat_flatmates',
    title: 'Flatmates',
    subtitle: 'Find your match',
    icon: '👥',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
    filterType: 'FLATMATES',
  },
  {
    id: 'cat_coliving',
    title: 'Co-living',
    subtitle: 'Live together',
    icon: '🏢',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    filterType: 'CO_LIVING',
  },
  {
    id: 'cat_student',
    title: 'Student',
    subtitle: 'Near campus',
    icon: '🎓',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    filterType: 'STUDENT',
  },
  {
    id: 'cat_pro',
    title: 'Working Pro',
    subtitle: 'Near work',
    icon: '💼',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    filterType: 'WORKING_PRO',
  },
];

export const LIFESTYLE_CARDS: LifestyleCard[] = [
  {
    id: 'life_student',
    title: 'Student Life',
    subtitle: 'Affordable places near top campuses like IIT Bombay, NMIMS, & St. Xavier’s.',
    icon: '🎓',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    tag: 'Campus Ready',
    filterKey: 'student',
  },
  {
    id: 'life_pro',
    title: 'Working Professional',
    subtitle: 'Live closer to work in BKC, Lower Parel, NESCO & Mindspace.',
    icon: '💼',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    tag: 'Near Tech Parks',
    filterKey: 'working_professional',
  },
  {
    id: 'life_shared',
    title: 'Shared Living',
    subtitle: 'Find compatible flatmates and verified rooms to split rent easily.',
    icon: '👥',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
    tag: 'Budget Friendly',
    filterKey: 'shared',
  },
  {
    id: 'life_coliving',
    title: 'Co-living Stays',
    subtitle: 'Fully furnished move-in ready spaces with Wi-Fi, food, & housekeeping.',
    icon: '🏢',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    tag: 'Zero Hassle',
    filterKey: 'coliving',
  },
];

export const POPULAR_LOCATIONS: LocationItem[] = [
  {
    id: 'loc_andheri',
    name: 'Andheri West',
    startingRent: '₹18,000 / mo',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800',
    popularFor: 'Metro, Cafes & Studios',
    propertyCount: 142,
  },
  {
    id: 'loc_powai',
    name: 'Powai',
    startingRent: '₹16,000 / mo',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    popularFor: 'IIT, Tech Parks & Lake',
    propertyCount: 98,
  },
  {
    id: 'loc_bandra',
    name: 'Bandra West',
    startingRent: '₹28,000 / mo',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    popularFor: 'Sea Promenade & Nightlife',
    propertyCount: 115,
  },
  {
    id: 'loc_ghatkopar',
    name: 'Ghatkopar East',
    startingRent: '₹14,000 / mo',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
    popularFor: 'Metro Hub & Peaceful',
    propertyCount: 76,
  },
  {
    id: 'loc_thane',
    name: 'Thane West',
    startingRent: '₹12,000 / mo',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    popularFor: 'Gated Societies & Lakes',
    propertyCount: 130,
  },
  {
    id: 'loc_navi',
    name: 'Navi Mumbai',
    startingRent: '₹10,000 / mo',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    popularFor: 'Wide Roads & IT Parks',
    propertyCount: 88,
  },
];

export const SPONSORED_PROPERTY: Property = {
  id: 'sponsored_prop_01',
  owner_id: 'user_owner_sp_01',
  owner_name: 'Oberoi Sky Heights',
  owner_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  owner_phone: '+91 98200 99887',
  title: 'Modern 1 BHK Luxury Suite in Andheri West',
  description: 'Exclusive sponsored 1 BHK flat with sea view balcony, smart lighting, biometric locks, and club access. Zero brokerage for REHVO verified members.',
  property_type: 'FLAT',
  listing_type: 'RENT',
  city: 'Mumbai',
  locality: 'Andheri West',
  address: 'S.V. Road, Near Infinity Mall, Andheri West, Mumbai 400053',
  latitude: 19.1350,
  longitude: 72.8290,
  rent: 24000,
  deposit: 48000,
  maintenance: 2000,
  brokerage: 0,
  bhk: '1 BHK',
  bathrooms: 1,
  area_sqft: 610,
  floor: 8,
  total_floors: 18,
  furnishing: 'FULLY_FURNISHED',
  parking: 'Car & Bike',
  available_from: 'Immediate',
  status: 'ACTIVE',
  verification_status: 'VERIFIED',
  is_sponsored: true,
  sponsor_priority: 1,
  views_count: 520,
  saves_count: 142,
  enquiries_count: 24,
  images: [
    {
      id: 'sp_img_1',
      url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80',
      is_cover: true,
      sort_order: 0,
    },
    {
      id: 'sp_img_2',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      is_cover: false,
      sort_order: 1,
    },
  ],
  amenities: ['Wi-Fi', 'AC', 'Parking', 'Lift', 'Balcony', 'Power Backup', 'Gym', 'Swimming Pool', 'Security 24/7'],
  tenant_preferences: ['Bachelors Allowed', 'Working Professionals Preferred'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
