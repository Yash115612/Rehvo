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
export const MUMBAI_LOCALITIES: Record<string, { name: string; zone: string; pincode?: string }> = {
  'andheri-west': { name: 'Andheri West', zone: 'Western Suburbs' },
  'andheri-east': { name: 'Andheri East', zone: 'Western Suburbs' },
  'bandra-west': { name: 'Bandra West', zone: 'Western Suburbs' },
  'bandra-east': { name: 'Bandra East', zone: 'Western Suburbs' },
  'juhu': { name: 'Juhu', zone: 'Western Suburbs' },
  'khar-west': { name: 'Khar West', zone: 'Western Suburbs' },
  'santacruz-west': { name: 'Santacruz West', zone: 'Western Suburbs' },
  'powai': { name: 'Powai', zone: 'Central Suburbs' },
  'goregaon-west': { name: 'Goregaon West', zone: 'Western Suburbs' },
  'goregaon-east': { name: 'Goregaon East', zone: 'Western Suburbs' },
  'malad-west': { name: 'Malad West', zone: 'Western Suburbs' },
  'kandivali-west': { name: 'Kandivali West', zone: 'Western Suburbs' },
  'borivali-west': { name: 'Borivali West', zone: 'Western Suburbs' },
  'worli': { name: 'Worli', zone: 'South Mumbai' },
  'lower-parel': { name: 'Lower Parel', zone: 'South Mumbai' },
  'dadar-west': { name: 'Dadar West', zone: 'South Mumbai' },
  'chembur': { name: 'Chembur', zone: 'Eastern Suburbs' },
  'ghatkopar-east': { name: 'Ghatkopar East', zone: 'Eastern Suburbs' },
  'thane-west': { name: 'Thane West', zone: 'Thane' },
  'navi-mumbai': { name: 'Navi Mumbai', zone: 'Navi Mumbai' },
};

/** Normalize any locality string into a URL slug */
export function normalizeLocalitySlug(locality: string): string {
  const clean = slugify(locality);
  if (MUMBAI_LOCALITIES[clean]) {
    return clean;
  }
  return clean;
}
