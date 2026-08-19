/**
 * REHVO SEO Slug Utilities
 */

export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export function unslugify(slug: string): string {
  if (!slug) return '';
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export interface SlugPropertyInput {
  id: string;
  title: string;
  locality: string;
  city: string;
  type?: string;
  bedrooms?: string | number;
}

/**
 * Generate a canonical SEO-friendly property URL slug
 * Format: 2-bhk-flat-for-rent-in-andheri-west-mumbai-<uuid>
 */
export function generatePropertySlug(property: SlugPropertyInput): string {
  const cleanTitle = slugify(property.title || 'home-for-rent');
  const cleanLocality = slugify(property.locality || 'mumbai');
  const cleanCity = slugify(property.city || 'mumbai');
  
  // Format: title-in-locality-city-id
  return `${cleanTitle}-in-${cleanLocality}-${cleanCity}-${property.id}`;
}

const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Extract the UUID from a property slug or direct ID
 */
export function extractPropertyIdFromSlug(slugOrId: string): string | null {
  if (!slugOrId) return null;
  
  // If already a clean UUID
  const directMatch = slugOrId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  if (directMatch) return directMatch[0];

  // If slug ending with UUID
  const match = slugOrId.match(UUID_REGEX);
  return match ? match[0] : null;
}

/**
 * Locality mapping for Mumbai (Canonical names)
 */
export interface LocalityInfo {
  name: string;
  zone: string;
  pincode?: string;
  metroStation: string;
  railwayStation: string;
  commercialHubs: string[];
  highlights: string[];
  avgRent: {
    bhk1: string;
    bhk2: string;
    bhk3: string;
    room: string;
  };
}

/**
 * Locality mapping for Mumbai (Canonical names with commute, rent, and connectivity info)
 */
export const MUMBAI_LOCALITIES: Record<string, LocalityInfo> = {
  'andheri-west': {
    name: 'Andheri West',
    zone: 'Western Suburbs',
    pincode: '400053',
    metroStation: 'DN Nagar, Versova, Andheri West (Line 1 & 2A)',
    railwayStation: 'Andheri Station (Western & Harbour Line)',
    commercialHubs: ['Lokhandwala Complex', 'Laxmi Industrial Estate', 'Veera Desai Road'],
    highlights: ['Premier media and entertainment district', 'Direct dual-metro interchange', 'High density of cafes & supermarkets'],
    avgRent: { bhk1: '₹35,000 - ₹48,000', bhk2: '₹55,000 - ₹85,000', bhk3: '₹90,000 - ₹1,50,000', room: '₹18,000 - ₹26,000' },
  },
  'andheri-east': {
    name: 'Andheri East',
    zone: 'Western Suburbs',
    pincode: '400069',
    metroStation: 'Chakala, Western Express Highway, Marol Naka (Line 1 & 3)',
    railwayStation: 'Andheri Station (East)',
    commercialHubs: ['SEEPZ', 'MIDC Commercial Hub', 'Solitaire Corporate Park'],
    highlights: ['Prime corporate & IT employment cluster', 'Direct access to Mumbai Airport (T2)', 'Excellent highway connectivity'],
    avgRent: { bhk1: '₹28,000 - ₹40,000', bhk2: '₹45,000 - ₹68,000', bhk3: '₹75,000 - ₹1,15,000', room: '₹14,000 - ₹22,000' },
  },
  'bandra-west': {
    name: 'Bandra West',
    zone: 'Western Suburbs',
    pincode: '400050',
    metroStation: 'Bandra Colony (Upcoming Metro Line 2B / 3)',
    railwayStation: 'Bandra Station (Western & Harbour Line)',
    commercialHubs: ['Hill Road', 'Pali Hill', 'Linking Road', 'Turner Road'],
    highlights: ['Queen of the Suburbs with iconic culinary & nightlife scene', 'Close proximity to Sea Link & BKC', 'Heritage sea-facing promenades'],
    avgRent: { bhk1: '₹50,000 - ₹75,000', bhk2: '₹85,000 - ₹1,40,000', bhk3: '₹1,50,000 - ₹2,80,000', room: '₹25,000 - ₹40,000' },
  },
  'bandra-east': {
    name: 'Bandra East',
    zone: 'Western Suburbs',
    pincode: '400051',
    metroStation: 'Bandra Kurla Complex (BKC Line 3)',
    railwayStation: 'Bandra Terminus & Bandra East Station',
    commercialHubs: ['Bandra Kurla Complex (BKC)', 'Kalanagar', 'G-Block Financial Centre'],
    highlights: ['Heart of Mumbai’s premier financial center (BKC)', 'Rapid transit via Western Express Highway', 'Modern high-rise residential gated communities'],
    avgRent: { bhk1: '₹40,000 - ₹55,000', bhk2: '₹65,000 - ₹1,05,000', bhk3: '₹1,10,000 - ₹1,90,000', room: '₹20,000 - ₹32,000' },
  },
  'juhu': {
    name: 'Juhu',
    zone: 'Western Suburbs',
    pincode: '400049',
    metroStation: 'DN Nagar / Santacruz (Line 2A/1)',
    railwayStation: 'Vile Parle Station (Western Line)',
    commercialHubs: ['JVPD Scheme', 'Juhu Tara Road Commercial', 'JW Marriott Hub'],
    highlights: ['Prestigious sea-facing neighbourhood', 'Home to leading colleges and arts venues', 'Peaceful, leafy residential lanes'],
    avgRent: { bhk1: '₹45,000 - ₹65,000', bhk2: '₹75,000 - ₹1,25,000', bhk3: '₹1,30,000 - ₹2,50,000', room: '₹22,000 - ₹35,000' },
  },
  'khar-west': {
    name: 'Khar West',
    zone: 'Western Suburbs',
    pincode: '400052',
    metroStation: 'Khar Road Metro (Upcoming 2B)',
    railwayStation: 'Khar Road Station (Western Line)',
    commercialHubs: ['14th & 17th Road Cafes', 'SVT College Hub', 'Khar Danda'],
    highlights: ['Serene upscale suburb between Bandra and Santacruz', 'Boutique fitness centers and gourmet stores', 'Excellent lifestyle appeal'],
    avgRent: { bhk1: '₹42,000 - ₹60,000', bhk2: '₹70,000 - ₹1,10,000', bhk3: '₹1,20,000 - ₹2,00,000', room: '₹22,000 - ₹32,000' },
  },
  'santacruz-west': {
    name: 'Santacruz West',
    zone: 'Western Suburbs',
    pincode: '400054',
    metroStation: 'Santacruz West Metro (Upcoming 2B)',
    railwayStation: 'Santacruz Station (Western Line)',
    commercialHubs: ['Tagore Road', 'SVT Campus', 'Juhu Road Hub'],
    highlights: ['Prime central suburb with easy airport & highway access', 'Established family residential complexes', 'Zero-brokerage rental inventory'],
    avgRent: { bhk1: '₹38,000 - ₹52,000', bhk2: '₹62,000 - ₹95,000', bhk3: '₹1,00,000 - ₹1,65,000', room: '₹18,000 - ₹28,000' },
  },
  'powai': {
    name: 'Powai',
    zone: 'Central Suburbs',
    pincode: '400076',
    metroStation: 'IIT Powai / JVLR (Line 6)',
    railwayStation: 'Kanjurmarg Station (Central Line)',
    commercialHubs: ['Hiranandani Business Park', 'Supreme Business Park', 'IIT Bombay'],
    highlights: ['Mumbai’s Silicon Valley with cosmopolitan lifestyle', 'Scenic Powai Lake promenades', 'Self-contained pedestrian-friendly township'],
    avgRent: { bhk1: '₹32,000 - ₹46,000', bhk2: '₹55,000 - ₹82,000', bhk3: '₹85,000 - ₹1,40,000', room: '₹16,000 - ₹26,000' },
  },
  'goregaon-west': {
    name: 'Goregaon West',
    zone: 'Western Suburbs',
    pincode: '400104',
    metroStation: 'Pahadi Goregaon & Bangur Nagar (Line 2A)',
    railwayStation: 'Goregaon Station (Western & Harbour Line)',
    commercialHubs: ['Oshiwara District Centre', 'Inorbit Mall Corridor', 'Link Road'],
    highlights: ['Fast-growing modern residential hub with metro access', 'Proximity to Malad commercial complexes', 'Wide selection of gated societies'],
    avgRent: { bhk1: '₹26,000 - ₹38,000', bhk2: '₹42,000 - ₹65,000', bhk3: '₹68,000 - ₹1,05,000', room: '₹13,000 - ₹20,000' },
  },
  'goregaon-east': {
    name: 'Goregaon East',
    zone: 'Western Suburbs',
    pincode: '400063',
    metroStation: 'Aarey & Mahanand (Line 7)',
    railwayStation: 'Goregaon Station (East)',
    commercialHubs: ['Nesco IT Park', 'Commerz International Tech Park', 'Oberoi Mall Hub'],
    highlights: ['Massive employment corridor with Grade-A offices', 'Lush greenery adjacent to Aarey Colony', 'Metro Line 7 along Western Express Highway'],
    avgRent: { bhk1: '₹28,000 - ₹42,000', bhk2: '₹46,000 - ₹72,000', bhk3: '₹75,000 - ₹1,20,000', room: '₹14,000 - ₹22,000' },
  },
  'malad-west': {
    name: 'Malad West',
    zone: 'Western Suburbs',
    pincode: '400064',
    metroStation: 'Malad West & Valnai (Line 2A)',
    railwayStation: 'Malad Station (Western Line)',
    commercialHubs: ['Mindspace IT Park', 'Infiniti Mall', 'Evershine Nagar'],
    highlights: ['Major tech and BPO employment zone', 'Diverse rental inventory from 1 BHK to luxury 3 BHKs', 'Metro Line 2A convenience'],
    avgRent: { bhk1: '₹24,000 - ₹35,000', bhk2: '₹38,000 - ₹60,000', bhk3: '₹62,000 - ₹95,000', room: '₹12,000 - ₹18,000' },
  },
  'kandivali-west': {
    name: 'Kandivali West',
    zone: 'Western Suburbs',
    pincode: '400067',
    metroStation: 'Dahanukarwadi & Kandivali West (Line 2A)',
    railwayStation: 'Kandivali Station (Western Line)',
    commercialHubs: ['Mahavir Nagar', 'Charkop Industrial Area', 'Link Road'],
    highlights: ['Thriving food street culture at Mahavir Nagar', 'Family-friendly gated societies with modern amenities', 'Affordable zero-brokerage rentals'],
    avgRent: { bhk1: '₹22,000 - ₹32,000', bhk2: '₹34,000 - ₹52,000', bhk3: '₹55,000 - ₹85,000', room: '₹11,000 - ₹17,000' },
  },
  'borivali-west': {
    name: 'Borivali West',
    zone: 'Western Suburbs',
    pincode: '400092',
    metroStation: 'Borivali West & Eksar (Line 2A)',
    railwayStation: 'Borivali Station (Terminal on Western Line)',
    commercialHubs: ['Shimpoli Road', 'IC Colony', 'Gorai Creek Hub'],
    highlights: ['Key Western terminal station for outstation & local trains', 'Proximity to Sanjay Gandhi National Park & Gorai beach', 'Quiet residential enclaves'],
    avgRent: { bhk1: '₹22,000 - ₹32,000', bhk2: '₹34,000 - ₹52,000', bhk3: '₹52,000 - ₹82,000', room: '₹11,000 - ₹16,000' },
  },
  'worli': {
    name: 'Worli',
    zone: 'South Mumbai',
    pincode: '400018',
    metroStation: 'Worli & Science Centre (Line 3)',
    railwayStation: 'Prabhadevi / Currey Road Station',
    commercialHubs: ['Worli Sea Face Offices', 'Peninsula Corporate Park', 'Dr. Annie Besant Road'],
    highlights: ['High-end luxury skyscraper developments', 'Direct connectivity via Bandra-Worli Sea Link & Coastal Road', 'Iconic Worli Sea Face promenade'],
    avgRent: { bhk1: '₹55,000 - ₹80,000', bhk2: '₹95,000 - ₹1,65,000', bhk3: '₹1,75,000 - ₹3,50,000', room: '₹28,000 - ₹45,000' },
  },
  'lower-parel': {
    name: 'Lower Parel',
    zone: 'South Mumbai',
    pincode: '400013',
    metroStation: 'Acharya Atre Chowk (Line 3)',
    railwayStation: 'Lower Parel Station (Western) & Currey Road (Central)',
    commercialHubs: ['One World Center', 'Kamala Mills', 'High Street Phoenix / Palladium'],
    highlights: ['Epicenter of corporate headquarters and upscale nightlife', 'Dual railway station connectivity', 'Luxury residential towers'],
    avgRent: { bhk1: '₹50,000 - ₹75,000', bhk2: '₹85,000 - ₹1,45,000', bhk3: '₹1,50,000 - ₹2,90,000', room: '₹25,000 - ₹40,000' },
  },
  'dadar-west': {
    name: 'Dadar West',
    zone: 'South Mumbai',
    pincode: '400028',
    metroStation: 'Dadar Metro (Line 3)',
    railwayStation: 'Dadar Junction (Western & Central Lines interchange)',
    commercialHubs: ['Ranade Road', 'Shivaji Park Cultural Hub', 'Gokhale Road'],
    highlights: ['Central geographic heart of Mumbai with unmatched train transit', 'Historic Shivaji Park sports & cultural heritage', 'Established Marathi culinary culture'],
    avgRent: { bhk1: '₹38,000 - ₹55,000', bhk2: '₹62,000 - ₹98,000', bhk3: '₹1,00,000 - ₹1,70,000', room: '₹18,000 - ₹28,000' },
  },
  'chembur': {
    name: 'Chembur',
    zone: 'Eastern Suburbs',
    pincode: '400071',
    metroStation: 'Chembur Monorail & Eastern Express Metro',
    railwayStation: 'Chembur Station (Harbour Line)',
    commercialHubs: ['Diamond Garden', 'RCF / BPCL Corridor', 'Collector Colony'],
    highlights: ['Crucial eastern transit node with Eastern Freeway into South Mumbai', 'Peaceful green residential pockets around Diamond Garden', 'Rapid connectivity to BKC via SCLR'],
    avgRent: { bhk1: '₹25,000 - ₹38,000', bhk2: '₹40,000 - ₹65,000', bhk3: '₹68,000 - ₹1,10,000', room: '₹13,000 - ₹20,000' },
  },
  'ghatkopar-east': {
    name: 'Ghatkopar East',
    zone: 'Eastern Suburbs',
    pincode: '400077',
    metroStation: 'Ghatkopar Station (Line 1 Terminal)',
    railwayStation: 'Ghatkopar Station (Central Line)',
    commercialHubs: ['R City Mall Hub', 'MG Road Commercial', 'Neelkanth Valley'],
    highlights: ['Terminal interchange of Metro 1 linking Versova-Ghatkopar', 'Central Line railway connectivity', 'Famous vegetarian gourmet market'],
    avgRent: { bhk1: '₹26,000 - ₹38,000', bhk2: '₹42,000 - ₹68,000', bhk3: '₹70,000 - ₹1,15,000', room: '₹13,000 - ₹21,000' },
  },
  'thane-west': {
    name: 'Thane West',
    zone: 'Thane',
    pincode: '400601',
    metroStation: 'Thane Metro (Upcoming Line 4)',
    railwayStation: 'Thane Station (Central & Trans-Harbour Line)',
    commercialHubs: ['Ghodbunder Road IT Corridor', 'Viviana Mall Hub', 'Wagle Estate'],
    highlights: ['City of Lakes with massive modern integrated townships', 'Spacious residential apartments with extensive clubhouses', 'Strong road connectivity to Mumbai & Navi Mumbai'],
    avgRent: { bhk1: '₹16,000 - ₹25,000', bhk2: '₹24,000 - ₹40,000', bhk3: '₹40,000 - ₹68,000', room: '₹8,000 - ₹14,000' },
  },
  'navi-mumbai': {
    name: 'Navi Mumbai',
    zone: 'Navi Mumbai',
    pincode: '400703',
    metroStation: 'CBD Belapur / Kharghar Metro (Line 1)',
    railwayStation: 'Vashi, Nerul & Panvel Stations (Harbour Line)',
    commercialHubs: ['Vashi Infotech Park', 'Millennium Business Park Mahape', 'CBD Belapur'],
    highlights: ['Planned city infrastructure with wide avenues & parks', 'Direct connectivity to Mumbai via Atal Setu (MTHL)', 'Cost-effective quality housing'],
    avgRent: { bhk1: '₹14,000 - ₹24,000', bhk2: '₹22,000 - ₹38,000', bhk3: '₹36,000 - ₹62,000', room: '₹7,000 - ₹13,000' },
  },
};

/** Normalize any locality string into a URL slug */
export function normalizeLocalitySlug(locality: string): string {
  const clean = slugify(locality);
  if (MUMBAI_LOCALITIES[clean]) {
    return clean;
  }
  return clean;
}
