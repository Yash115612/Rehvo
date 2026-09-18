import type { MetadataRoute } from 'next';
import { getAllPublishedPropertySlugs } from '@/lib/seo/queries';
import { generatePropertySlug, slugify } from '@/lib/seo/slugs';
import { CITIES_DATA, LOCALITIES_DATA } from '@/lib/seo/localityData';
import { BLOG_POSTS } from '@/lib/seo/blogData';
import { REHVO_STORIES } from '@/lib/seo/storiesData';
import { MARKET_REPORTS } from '@/lib/seo/marketReportsData';
import { SEARCH_LANDING_PAGES } from '@/lib/seo/rentData';

const BASE_URL = 'https://rehvo.in';

const FALLBACK_PROPERTIES = [
  {
    id: 'prop-sea-facing-bandra',
    title: 'Sea-Facing 2 BHK in Bandra West',
    locality: 'Bandra West',
    city: 'Mumbai',
    updated_at: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'prop-luxury-powai-lake',
    title: 'Luxury 3 BHK Lake-View Apartment in Powai',
    locality: 'Powai',
    city: 'Mumbai',
    updated_at: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'prop-compact-studio-andheri',
    title: 'Furnished Studio Near DN Nagar Metro, Andheri West',
    locality: 'Andheri West',
    city: 'Mumbai',
    updated_at: '2026-03-01T00:00:00.000Z',
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let publishedProperties: any[] = [];
  try {
    const data = await getAllPublishedPropertySlugs();
    if (Array.isArray(data) && data.length > 0) {
      publishedProperties = data;
    } else {
      publishedProperties = FALLBACK_PROPERTIES;
    }
  } catch (err) {
    publishedProperties = FALLBACK_PROPERTIES;
  }

  const routes: MetadataRoute.Sitemap = [
    // 1. Core High-Priority Pages
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/rent`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/flatmates`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pg`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/commercial`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/society-services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/showreels`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/ai-concierge`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/reports`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/stories`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/safety`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/download`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/careers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // 2. Rent Landing Pages
  Object.keys(SEARCH_LANDING_PAGES || {}).forEach((slug) => {
    routes.push({
      url: `${BASE_URL}/rent/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.92,
    });
  });

  // 3. City Hub Pages
  Object.keys(CITIES_DATA || {}).forEach((citySlug) => {
    routes.push({
      url: `${BASE_URL}/${citySlug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });
  });

  // 4. Locality Landing Pages
  Object.values(LOCALITIES_DATA || {}).forEach((locality) => {
    routes.push({
      url: `${BASE_URL}/${locality.citySlug}/${locality.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.88,
    });
  });

  // 5. Web Stories
  Object.keys(REHVO_STORIES || {}).forEach((storySlug) => {
    routes.push({
      url: `${BASE_URL}/stories/${storySlug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.83,
    });
  });

  // 6. Research & Market Reports
  Object.keys(MARKET_REPORTS || {}).forEach((reportSlug) => {
    routes.push({
      url: `${BASE_URL}/reports/${reportSlug}`,
      lastModified: new Date(MARKET_REPORTS[reportSlug].publishDate),
      changeFrequency: 'monthly',
      priority: 0.82,
    });
  });

  // 7. Blog Articles
  Object.keys(BLOG_POSTS || {}).forEach((blogSlug) => {
    routes.push({
      url: `${BASE_URL}/blog/${blogSlug}`,
      lastModified: new Date(BLOG_POSTS[blogSlug].modifiedDate || BLOG_POSTS[blogSlug].publishDate),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 8. Verified Properties (Primary Canonical URLs)
  publishedProperties.forEach((property) => {
    const slug = generatePropertySlug(property);
    const lastMod = property.updated_at ? new Date(property.updated_at) : new Date();

    routes.push({
      url: `${BASE_URL}/property/${slug}`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.95,
    });
  });

  return routes;
}
