import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getPropertyBySlug } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generatePropertySlug } from '@/lib/seo/slugs';

export const revalidate = 60;

interface HierarchicalPropertyPageProps {
  params: { city: string; locality: string; slug: string };
}

export async function generateMetadata({ params }: HierarchicalPropertyPageProps): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug);
  if (!property) {
    return { title: 'Property Not Found | REHVO' };
  }

  const fullSlug = generatePropertySlug(property);
  const canonicalUrl = `https://rehvo.in/property/${fullSlug}`;

  const title = `${property.bedrooms ? `${property.bedrooms} BHK ` : ''}${property.title} for Rent in ${property.locality}, ${property.city}`;
  const description = `Verified ${property.bedrooms ? `${property.bedrooms} BHK ` : ''}apartment for rent in ${property.locality}, ${property.city}. Monthly rent ₹${property.price?.toLocaleString('en-IN')}. 100% verified title deed, Zero Commission, instant visit booking on REHVO.`;

  return constructSeoMetadata({
    title,
    description,
    canonicalUrl,
    imageUrl: property.property_images?.[0]?.image_url,
  });
}

export default async function HierarchicalPropertyPage({ params }: HierarchicalPropertyPageProps) {
  const property = await getPropertyBySlug(params.slug);
  if (!property) {
    notFound();
  }

  const fullSlug = generatePropertySlug(property);
  permanentRedirect(`/property/${fullSlug}`);
}

