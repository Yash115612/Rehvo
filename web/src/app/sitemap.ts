import { MetadataRoute } from 'next';
import { getAllPublishedPropertySlugs } from '@/lib/seo/queries';
import { generatePropertySlug, MUMBAI_LOCALITIES } from '@/lib/seo/slugs';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publishedProperties = await getAllPublishedPropertySlugs();

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/mumbai`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/flatmates/mumbai`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pg/mumbai`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/list-property`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ];

  // Add all major Mumbai localities
  Object.keys(MUMBAI_LOCALITIES).forEach((localitySlug) => {
    routes.push({
      url: `${BASE_URL}/mumbai/${localitySlug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });
    routes.push({
      url: `${BASE_URL}/mumbai/${localitySlug}/flats-for-rent`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    });
    routes.push({
      url: `${BASE_URL}/mumbai/${localitySlug}/1-bhk-flats-for-rent`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.75,
    });
    routes.push({
      url: `${BASE_URL}/mumbai/${localitySlug}/2-bhk-flats-for-rent`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.75,
    });
    routes.push({
      url: `${BASE_URL}/mumbai/${localitySlug}/3-bhk-flats-for-rent`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    });
    routes.push({
      url: `${BASE_URL}/mumbai/${localitySlug}/flats-under-30000`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    });
    routes.push({
      url: `${BASE_URL}/mumbai/${localitySlug}/flats-under-50000`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    });
    routes.push({
      url: `${BASE_URL}/mumbai/${localitySlug}/fully-furnished-flats-for-rent`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    });
    routes.push({
      url: `${BASE_URL}/mumbai/${localitySlug}/rooms-for-rent`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    });
    routes.push({
      url: `${BASE_URL}/mumbai/${localitySlug}/pg`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    });
    routes.push({
      url: `${BASE_URL}/mumbai/${localitySlug}/studios-for-rent`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    });
  });

  // Add all canonical published properties
  publishedProperties.forEach((property) => {
    const slug = generatePropertySlug(property);
    routes.push({
      url: `${BASE_URL}/property/${slug}`,
      lastModified: property.updated_at ? new Date(property.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  });

  return routes;
}
