import { notFound, permanentRedirect } from 'next/navigation';
import { getPropertyBySlug } from '@/lib/seo/queries';
import { generatePropertySlug, slugify } from '@/lib/seo/slugs';

export const revalidate = 60;

interface PropertyDetailPageProps {
  params: { slug: string };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = await getPropertyBySlug(params.slug);
  if (!property) {
    notFound();
  }

  const cleanCity = slugify(property.city || 'mumbai');
  const cleanLocality = slugify(property.locality || 'andheri-west');
  const fullSlug = generatePropertySlug(property);

  permanentRedirect(`/${cleanCity}/${cleanLocality}/${fullSlug}`);
}

