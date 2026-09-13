import { MetadataRoute } from 'next';
import { getAllPublishedPropertySlugs } from '@/lib/seo/queries';
import { generatePropertySlug, slugify } from '@/lib/seo/slugs';
import { CITIES_DATA, LOCALITIES_DATA } from '@/lib/seo/localityData';
import { BLOG_POSTS } from '@/lib/seo/blogData';
import { REHVO_STORIES } from '@/lib/seo/storiesData';
import { MARKET_REPORTS } from '@/lib/seo/marketReportsData';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publishedProperties = await getAllPublishedPropertySlugs();

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
      url: `${BASE_URL}/zero-brokerage`,
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
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 2. City Hub Pages
  Object.keys(CITIES_DATA).forEach((cityKey) => {
    routes.push({
      url: `${BASE_URL}/${cityKey}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });
  });

  // 3. Locality Landing Pages
  Object.values(LOCALITIES_DATA).forEach((loc) => {
    routes.push({
      url: `${BASE_URL}/${loc.citySlug}/${loc.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });
  });

  // 4. Curated Search Landing Pages
  const searchSlugs = [
    '2-bhk-for-rent-in-mumbai',
    '1-bhk-for-rent-in-mumbai',
    '3-bhk-in-bandra',
    'affordable-flats-in-powai',
    'gated-societies-in-andheri-west',
    'luxury-apartments-in-worli',
    'flats-near-metro-station-in-mumbai',
    'pet-friendly-apartments-in-mumbai',
    'luxury-apartments-for-rent-in-mumbai',
    'budget-flats-under-25k-in-mumbai',
    'gated-family-apartments-in-mumbai',
    'fully-furnished-flats-in-mumbai',
    'zero-deposit-flats-in-mumbai',
  ];
  searchSlugs.forEach((slug) => {
    routes.push({
      url: `${BASE_URL}/rent/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    });
  });

  // Dedicated Niche Intent Pages (Student PG, Female Flatmates)
  routes.push({
    url: `${BASE_URL}/pg/student-hostels-in-mumbai`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  });
  routes.push({
    url: `${BASE_URL}/flatmates/female-flatmates-in-mumbai`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  });

  // 5. Discover Web Stories
  routes.push({
    url: `${BASE_URL}/stories`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  });
  Object.keys(REHVO_STORIES).forEach((storySlug) => {
    routes.push({
      url: `${BASE_URL}/stories/${storySlug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    });
  });

  // 6. Blog Articles
  Object.keys(BLOG_POSTS).forEach((blogSlug) => {
    routes.push({
      url: `${BASE_URL}/blog/${blogSlug}`,
      lastModified: new Date(BLOG_POSTS[blogSlug].modifiedDate || BLOG_POSTS[blogSlug].publishDate),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 7. Research & Market Reports
  routes.push({
    url: `${BASE_URL}/reports`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  });
  Object.keys(MARKET_REPORTS).forEach((reportSlug) => {
    routes.push({
      url: `${BASE_URL}/reports/${reportSlug}`,
      lastModified: new Date(MARKET_REPORTS[reportSlug].publishDate),
      changeFrequency: 'monthly',
      priority: 0.85,
    });
  });

  // 6. Verified Properties (both /property/[slug] and /[city]/[locality]/[slug])
  if (Array.isArray(publishedProperties)) {
    publishedProperties.forEach((property) => {
      const slug = generatePropertySlug(property);
      const citySlug = slugify(property.city || 'mumbai');
      const localitySlug = slugify(property.locality || 'andheri-west');

      // Canonical property URL
      routes.push({
        url: `${BASE_URL}/property/${slug}`,
        lastModified: property.updated_at ? new Date(property.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });

      // Hierarchical SEO URL
      routes.push({
        url: `${BASE_URL}/${citySlug}/${localitySlug}/${slug}`,
        lastModified: property.updated_at ? new Date(property.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    });
  }

  return routes;
}
