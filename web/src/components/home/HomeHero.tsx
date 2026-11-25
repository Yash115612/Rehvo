'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  MapPin,
  ShieldCheck,
  CheckCircle,
  Building,
  Users,
  Briefcase,
  Home as HomeIcon,
  Sparkles,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

const POPULAR_LOCALITIES = [
  'Bandra West',
  'Andheri West',
  'Powai',
  'Worli',
  'BKC',
  'Juhu',
];

type CategoryTab = 'all' | 'residential' | 'pg' | 'flatmates' | 'commercial';

interface TabItem {
  id: CategoryTab;
  label: string;
  icon: React.ElementType;
}

const CATEGORY_TABS: TabItem[] = [
  { id: 'all', label: 'All Rentals', icon: Search },
  { id: 'residential', label: 'Apartments', icon: HomeIcon },
  { id: 'pg', label: 'PG & Hostels', icon: Building },
  { id: 'flatmates', label: 'Flatmates', icon: Users },
  { id: 'commercial', label: 'Commercial', icon: Briefcase },
];

export function HomeHero() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [locality, setLocality] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'pg') {
      const params = new URLSearchParams();
      if (locality.trim()) params.set('locality', locality.trim());
      router.push(`/pg${params.toString() ? `?${params.toString()}` : ''}`);
      return;
    }

    if (activeTab === 'flatmates') {
      const params = new URLSearchParams();
      if (locality.trim()) params.set('locality', locality.trim());
      router.push(`/flatmates${params.toString() ? `?${params.toString()}` : ''}`);
      return;
    }

    if (activeTab === 'commercial') {
      const params = new URLSearchParams();
      params.set('category', 'commercial');
      if (locality.trim()) params.set('locality', locality.trim());
      if (maxPrice) params.set('maxPrice', maxPrice);
      router.push(`/search?${params.toString()}`);
      return;
    }

    // Default residential / all search
    const params = new URLSearchParams();
    if (activeTab === 'residential') params.set('category', 'residential');
    if (locality.trim()) params.set('locality', locality.trim());
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (maxPrice) params.set('maxPrice', maxPrice);

    router.push(`/search?${params.toString()}`);
  };

  const handleQuickLocality = (loc: string) => {
    setLocality(loc);
    const params = new URLSearchParams();
    params.set('locality', loc);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-14 sm:pt-12 sm:pb-20 border-b border-rehvo-border-subtle">
      {/* Subtle brand tint gradient in background */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[480px] w-[480px] rounded-full bg-rehvo-orange-soft blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-[360px] w-[360px] rounded-full bg-rehvo-surface-muted blur-3xl opacity-70" />

      <Container size="wide">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Column: Editorial Headline & Search Interface */}
          <div className="flex flex-col lg:col-span-7 xl:col-span-7">
            
            {/* Pill Eyebrow */}
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rehvo-orange-border bg-rehvo-orange-soft px-3 py-1 text-xs font-bold text-rehvo-orange-active">
                <Sparkles className="h-3.5 w-3.5 text-rehvo-orange" aria-hidden="true" />
                Zero Brokerage • Verified Handover
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold text-rehvo-muted">
                Direct to Owners in Mumbai
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl font-extrabold tracking-tight text-rehvo-navy sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
              Find your place.{' '}
              <span className="block text-rehvo-orange">Without brokerage.</span>
            </h1>

            {/* Subcopy */}
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-rehvo-secondary sm:text-lg">
              Direct homeowner rentals with room-by-room move-in condition baselines, digital agreements, and security deposit protection.
            </p>

            {/* Search Box Card */}
            <div className="mt-8 rounded-2xl border border-rehvo-border bg-white p-4 sm:p-5 shadow-card">
              
              {/* Category Segmented Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-3 border-b border-rehvo-border-subtle scrollbar-none" role="tablist">
                {CATEGORY_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors select-none',
                        isSelected
                          ? 'bg-rehvo-navy text-white'
                          : 'text-rehvo-secondary hover:bg-rehvo-surface-subtle hover:text-rehvo-navy'
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Form Fields */}
              <form onSubmit={handleSearchSubmit} className="mt-4 flex flex-col gap-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                  
                  {/* Location Input */}
                  <div className="sm:col-span-5 relative">
                    <label htmlFor="search-locality" className="sr-only">
                      Locality or Landmark
                    </label>
                    <div className="relative flex items-center">
                      <MapPin className="pointer-events-none absolute left-3.5 h-4 w-4 text-rehvo-muted" aria-hidden="true" />
                      <input
                        id="search-locality"
                        type="text"
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        placeholder="Locality (e.g. Bandra, Powai)"
                        className="h-11 w-full rounded-xl border border-rehvo-border bg-white pl-10 pr-3.5 text-sm font-medium text-rehvo-navy placeholder:text-rehvo-muted focus:border-rehvo-navy focus:outline-none focus:ring-2 focus:ring-rehvo-navy/10"
                      />
                    </div>
                  </div>

                  {/* BHK Selector (if not PG / Commercial) */}
                  <div className={cn('sm:col-span-3', (activeTab === 'commercial' || activeTab === 'pg') && 'hidden sm:block sm:opacity-50 pointer-events-none')}>
                    <label htmlFor="search-bedrooms" className="sr-only">
                      BHK Configuration
                    </label>
                    <select
                      id="search-bedrooms"
                      aria-label="BHK Configuration"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      disabled={activeTab === 'commercial' || activeTab === 'pg'}
                      className="h-11 w-full rounded-xl border border-rehvo-border bg-white px-3 py-2 text-sm font-medium text-rehvo-navy leading-normal focus:border-rehvo-navy focus:outline-none focus:ring-2 focus:ring-rehvo-navy/10"
                    >
                      <option value="">Any BHK</option>
                      <option value="1">1 BHK</option>
                      <option value="2">2 BHK</option>
                      <option value="3">3 BHK</option>
                      <option value="4">4+ BHK</option>
                    </select>
                  </div>

                  {/* Budget Selector */}
                  <div className={cn('sm:col-span-4', (activeTab === 'commercial' || activeTab === 'pg') ? 'sm:col-span-7' : 'sm:col-span-4')}>
                    <label htmlFor="search-maxprice" className="sr-only">
                      Max Monthly Rent
                    </label>
                    <select
                      id="search-maxprice"
                      aria-label="Max Monthly Rent"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="h-11 w-full rounded-xl border border-rehvo-border bg-white px-3 py-2 text-sm font-medium text-rehvo-navy leading-normal focus:border-rehvo-navy focus:outline-none focus:ring-2 focus:ring-rehvo-navy/10"
                    >
                      <option value="">Any Budget</option>
                      <option value="20000">Up to ₹20,000</option>
                      <option value="35000">Up to ₹35,000</option>
                      <option value="50000">Up to ₹50,000</option>
                      <option value="75000">Up to ₹75,000</option>
                      <option value="100000">Up to ₹1,00,000</option>
                      <option value="150000">Up to ₹1,50,000+</option>
                    </select>
                  </div>
                </div>

                {/* Submit Row & Quick Links */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-rehvo-muted">
                    <span className="font-semibold text-rehvo-secondary">Popular:</span>
                    {POPULAR_LOCALITIES.slice(0, 4).map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleQuickLocality(loc)}
                        className="rounded-md bg-rehvo-surface-muted px-2 py-0.5 font-medium text-rehvo-navy transition-colors hover:bg-rehvo-orange-soft hover:text-rehvo-orange-active"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>

                  <Button type="submit" variant="primary" size="md" className="shrink-0 font-bold">
                    <Search className="h-4 w-4" aria-hidden="true" />
                    <span>Search Rentals</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* Micro Trust Bullets */}
            <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-semibold text-rehvo-secondary">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-rehvo-success" aria-hidden="true" />
                Zero Brokerage Guaranteed
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-rehvo-success" aria-hidden="true" />
                Direct Owner Contact
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-rehvo-success" aria-hidden="true" />
                Move-In Condition Protection
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Visual Showcase Card */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 flex-col gap-4">
            <div className="relative overflow-hidden rounded-3xl border border-rehvo-border bg-white shadow-card">
              
              {/* Visual Showcase Media */}
              <div className="relative aspect-[4/3] w-full bg-rehvo-navy overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                  alt="Verified Rental Home in Mumbai"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                
                {/* Overlay Badge */}
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <Badge variant="navy">Direct Owner</Badge>
                  <Badge variant="success">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Deed Verified
                  </Badge>
                </div>

                {/* Bottom Overlay Info Pill */}
                <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-3.5 backdrop-blur-md border border-white/40 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-rehvo-muted">
                        Featured in Bandra West
                      </p>
                      <p className="text-base font-extrabold text-rehvo-navy">
                        ₹65,000 <span className="text-xs font-semibold text-rehvo-muted">/month</span>
                      </p>
                    </div>
                    <span className="rounded-xl bg-rehvo-orange-soft px-2.5 py-1 text-xs font-bold text-rehvo-orange-active">
                      0% Brokerage
                    </span>
                  </div>
                </div>
              </div>

              {/* Handover & Condition Baseline Card */}
              <div className="p-5 border-t border-rehvo-border-subtle bg-rehvo-surface-subtle">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rehvo-navy text-rehvo-orange">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-rehvo-navy">
                      REHVO Verified Handover Baseline
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-rehvo-secondary">
                      Pre-existing condition is recorded room-by-room before keys are handed over, ensuring security deposits are protected from unfair blame at move-out.
                    </p>
                    <Link
                      href="/safety"
                      className="mt-2 inline-flex items-center text-xs font-bold text-rehvo-orange-active hover:underline"
                    >
                      Learn how Damage Protection works &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
