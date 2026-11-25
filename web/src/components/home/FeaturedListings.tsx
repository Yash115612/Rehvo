import React from 'react';
import { PublicProperty } from '@/lib/seo/types';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PropertyPreviewCard } from '@/components/ui/PropertyPreviewCard';
import { Button } from '@/components/ui/Button';

interface FeaturedListingsProps {
  properties: PublicProperty[];
}

export function FeaturedListings({ properties }: FeaturedListingsProps) {
  const displayProperties = properties.slice(0, 6);

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-rehvo-border-subtle">
      <Container size="wide">
        <SectionHeading
          eyebrow="Direct Owner Listings"
          title="Verified rentals in Mumbai"
          subtitle="Genuine property photographs, confirmed ownership deeds, and zero brokerage fees."
          actionLabel="Search All Homes"
          actionHref="/search?category=residential"
        />

        {displayProperties.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayProperties.map((property) => (
              <PropertyPreviewCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-rehvo-border p-12 text-center bg-rehvo-surface-subtle">
            <h3 className="text-base font-bold text-rehvo-navy">
              No live listings available in this view right now
            </h3>
            <p className="mt-1.5 max-w-md text-sm text-rehvo-secondary">
              Explore our full rental search to browse available apartments, rooms and commercial spaces across Mumbai.
            </p>
            <Button href="/search" variant="primary" size="md" className="mt-5">
              Browse All Rentals
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
