import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Video, Play, ShieldCheck, MapPin, Eye, Clock, ArrowRight } from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';
import { generateVideoObjectSchema } from '@/lib/seo/schema';
import { ImmersiveShowReelsClient } from '@/components/showreels/ImmersiveShowReelsClient';

export const revalidate = 3600;

export const metadata: Metadata = constructSeoMetadata({
  title: 'ShowReels — Video Property Walkthroughs & Locality Tours',
  description:
    'Watch high-definition 4K video walkthroughs and neighbourhood tours of verified rental flats, luxury penthouses, and PGs across Mumbai. See real room dimensions before booking physical visits.',
  canonicalUrl: 'https://rehvo.in/showreels',
  keywords: [
    'property videos mumbai',
    'flat walkthrough videos',
    'showreels rehvo',
    'virtual apartment tour mumbai',
    'real estate video tour',
  ],
});

interface ShowReelItem {
  id: string;
  slug: string;
  title: string;
  locality: string;
  city: string;
  price: string;
  bhk: string;
  duration: string;
  uploadDate: string;
  thumbnailUrl: string;
  videoUrl: string;
  description: string;
}

const SHOWREELS_DATA = [
  {
    id: 'sr_01',
    slug: 'sea-facing-2bhk-bandra-west-walkthrough',
    propertySlug: 'sea-facing-2bhk-bandra-west',
    title: 'Modern 2 BHK Sea-Facing Walkthrough in Bandra West',
    locality: 'Bandra West',
    city: 'Mumbai',
    price: '₹1,25,000/mo',
    bhk: '2 BHK',
    views: '14.2K',
    likes: 428,
    duration: 'PT1M15S',
    uploadDate: '2026-02-15T10:00:00+05:30',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    videoUrl: '/videos/modern-apartment-interior.mp4',
    description: 'High-definition video tour of fully-furnished 2 BHK apartment on Carter Road, Bandra West. Modern modular kitchen, sea-facing balcony, and Italian marble flooring.',
  },
  {
    id: 'sr_02',
    slug: 'luxury-3bhk-hiranandani-powai-lake-view',
    propertySlug: 'luxury-3bhk-hiranandani-powai',
    title: 'Luxury 3 BHK Lake-View Apartment in Hiranandani Powai',
    locality: 'Powai',
    city: 'Mumbai',
    price: '₹95,000/mo',
    bhk: '3 BHK',
    views: '9.8K',
    likes: 312,
    duration: 'PT1M45S',
    uploadDate: '2026-02-20T14:30:00+05:30',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    videoUrl: '/videos/modern-apartment-living-room.mp4',
    description: 'Walkthrough of neoclassical 3 BHK flat overlooking Powai Lake. Gated township amenities, dedicated clubhouse, and private basement parking.',
  },
  {
    id: 'sr_03',
    slug: 'furnished-studio-andheri-west-metro',
    propertySlug: 'furnished-studio-andheri-west',
    title: 'Compact Furnished Studio Near DN Nagar Metro, Andheri West',
    locality: 'Andheri West',
    city: 'Mumbai',
    price: '₹38,000/mo',
    bhk: '1 RK / Studio',
    views: '18.6K',
    likes: 685,
    duration: 'PT0M50S',
    uploadDate: '2026-03-01T09:15:00+05:30',
    thumbnailUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
    videoUrl: '/videos/modern-kitchen-living-room.mp4',
    description: 'Walkthrough of a bright modern studio apartment 2 minutes from Metro Line 2A station. Fully furnished with high-speed WiFi and biometric security.',
  },
];

export default function ShowReelsHubPage() {
  const breadcrumbs = [{ name: 'ShowReels Video Tours', url: '/showreels' }];

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-16">
      {/* Inject VideoObject Schema for each video */}
      {SHOWREELS_DATA.map((reel) => {
        const schema = generateVideoObjectSchema({
          title: reel.title,
          description: reel.description,
          thumbnailUrl: reel.thumbnailUrl,
          uploadDate: reel.uploadDate,
          duration: reel.duration,
          contentUrl: reel.videoUrl,
        });
        return (
          <script
            key={reel.id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        );
      })}

      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Hero Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0E8F73] border border-emerald-200 text-xs font-bold">
            <Video size={14} />
            <span>4K Verified Video Walkthroughs</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#031B2A] tracking-tight">
            REHVO ShowReels — Live Property Video Experience
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Experience unedited room-by-room walkthroughs of verified flats, PGs, and penthouses. Inspect layout flow, natural sunlight, and neighborhood streetscapes before booking in-person visits.
          </p>
        </div>
      </header>

      {/* Interactive Immersive ShowReels Player */}
      <ImmersiveShowReelsClient reels={SHOWREELS_DATA} />

      {/* Internal Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InternalLinksGrid currentCity="mumbai" />
      </div>
    </div>
  );
}
