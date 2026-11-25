import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { PublicProperty, sanitizePropertyImages } from '@/lib/seo/types';
import { generatePropertySlug } from '@/lib/seo/slugs';
import { RehvoImage } from './RehvoImage';
import { Badge } from './Badge';

interface PropertyPreviewCardProps {
  property: PublicProperty;
}

function formatInr(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return 'Price on request';
  return `₹${amount.toLocaleString('en-IN')}`;
}

function formatTypeLabel(type: string): string {
  const map: Record<string, string> = {
    flat: 'Apartment',
    room: 'Private Room',
    pg: 'PG / Co-Living',
    studio: 'Studio',
    office: 'Office Space',
    shop: 'Retail Shop',
    showroom: 'Showroom',
    warehouse: 'Warehouse',
    commercial_building: 'Commercial Building',
    coworking: 'Co-working',
  };
  return map[type] || type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function PropertyPreviewCard({ property }: PropertyPreviewCardProps) {
  const images = sanitizePropertyImages(property.property_images);
  const coverImage = images.find((img) => img.is_cover) || images[0];
  const propertyHref = `/property/${generatePropertySlug({
    id: property.id,
    title: property.title,
    locality: property.locality,
    city: property.city,
    type: property.type,
    bedrooms: property.bedrooms,
  })}`;

  const isVerified = property.verification_status === 'verified';
  const specs: string[] = [];
  if (property.bedrooms) specs.push(property.bedrooms);
  if (property.area > 0) specs.push(`${property.area} sq.ft`);
  if (property.furnishing) {
    specs.push(
      property.furnishing
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
    );
  }

  return (
    <Link
      href={propertyHref}
      className="group flex flex-col overflow-hidden rounded-2xl border border-rehvo-border bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-rehvo-border-focus hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rehvo-orange"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-rehvo-surface-muted">
        <RehvoImage
          src={coverImage?.image_url}
          alt={`${property.title} in ${property.locality}, ${property.city}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
          <Badge variant="navy">{formatTypeLabel(property.type)}</Badge>
          {isVerified && (
            <Badge variant="success">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Verified
            </Badge>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-lg font-bold text-rehvo-navy">
              {formatInr(property.price)}
              <span className="text-xs font-medium text-rehvo-muted">/month</span>
            </p>
            <span className="text-xs font-semibold text-rehvo-orange-active">
              Zero Brokerage
            </span>
          </div>

          <h3 className="mt-2 line-clamp-1 text-base font-bold text-rehvo-navy transition-colors group-hover:text-rehvo-orange-hover">
            {property.title}
          </h3>

          <p className="mt-1 flex items-center gap-1 text-sm text-rehvo-secondary">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-rehvo-muted" aria-hidden="true" />
            <span className="line-clamp-1">
              {property.locality}, {property.city}
            </span>
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-rehvo-border-subtle pt-3.5">
          <p className="line-clamp-1 text-xs font-medium text-rehvo-muted">
            {specs.length > 0 ? specs.join(' • ') : formatTypeLabel(property.type)}
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rehvo-navy group-hover:text-rehvo-orange-hover">
            Details
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
