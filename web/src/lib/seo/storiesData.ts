/**
 * REHVO Web Stories Data Model
 * Visual card-based stories optimized for Google Discover
 */

export interface StorySlide {
  title: string;
  subtitle: string;
  image: string;
  stat?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface WebStory {
  slug: string;
  title: string;
  coverImage: string;
  summary: string;
  category: string;
  publishDate: string;
  slides: StorySlide[];
}

export const REHVO_STORIES: Record<string, WebStory> = {
  'andheri-west-rental-guide-2026': {
    slug: 'andheri-west-rental-guide-2026',
    title: 'Andheri West Rental Guide 2026: Rents, Metro & Lifestyle',
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80',
    summary: 'A visual walkthrough of living in Lokhandwala, Versova, and DN Nagar.',
    category: 'Locality Story',
    publishDate: '2026-03-01',
    slides: [
      {
        title: 'Mumbai’s Vibrant Entertainment Epicenter',
        subtitle: 'Andheri West is home to premier media houses, upscale cafes, and Bollywood production studios.',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80',
        stat: 'Rental Yield: 3.8%',
      },
      {
        title: 'Dual Metro Connectivity',
        subtitle: 'Interchange hub for Metro Line 1 (Versova-Ghatkopar) and Line 2A (Dahisar-DN Nagar).',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80',
        stat: '15 min to Airport',
      },
      {
        title: '2 BHK Price Benchmarks',
        subtitle: 'Average monthly rent in gated societies in Lokhandwala ranges from ₹55,000 to ₹85,000.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
        stat: 'Avg ₹65,000/mo',
        ctaText: 'Browse Andheri West Flats',
        ctaLink: '/mumbai/andheri-west',
      },
    ],
  },
  'bandra-west-coastal-living': {
    slug: 'bandra-west-coastal-living',
    title: 'Bandra West Coastal Living: Pali Hill, Carter Road & BKC Proximity',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80',
    summary: 'Explore the Queen of Suburbs with historic promenades and gourmet dining.',
    category: 'Luxury Story',
    publishDate: '2026-03-05',
    slides: [
      {
        title: 'Queen of the Mumbai Suburbs',
        subtitle: 'Bandra West combines heritage Portuguese architecture with celebrity seaside penthouses.',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80',
        stat: 'Top Coastal Enclave',
      },
      {
        title: '10 Minutes to Bandra-Worli Sea Link',
        subtitle: 'Fast vehicular access to South Mumbai and rapid transit straight into BKC financial towers.',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&auto=format&fit=crop&q=80',
        stat: 'Direct BKC Connector',
      },
      {
        title: 'Sea-Facing Residences',
        subtitle: 'Spacious sea-view 2 and 3 BHK flats on Carter Road and Bandstand directly verified by REHVO.',
        image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1000&auto=format&fit=crop&q=80',
        stat: 'Zero Commission',
        ctaText: 'Explore Bandra West Rentals',
        ctaLink: '/mumbai/bandra-west',
      },
    ],
  },
  'powai-tech-corridor-guide': {
    slug: 'powai-tech-corridor-guide',
    title: 'Powai Tech Corridor: Lakefront Apartments & European Architecture',
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=80',
    summary: 'Modern pedestrian township living near IIT Bombay and Hiranandani Business Park.',
    category: 'Tech Co-Living',
    publishDate: '2026-03-08',
    slides: [
      {
        title: 'Mumbai’s Pedestrian Paradise',
        subtitle: 'Hiranandani Gardens offers tree-lined boulevards, European neoclassical towers, and lakeside gardens.',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=80',
        stat: 'Walk-to-Work Town',
      },
      {
        title: 'Tech Headquarters Hub',
        subtitle: 'Supreme Business Park and leading fintech and startup accelerators within walking distance.',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80',
        stat: '500+ Tech Employers',
      },
      {
        title: 'Verified Gated Communities',
        subtitle: 'Premium 1, 2 & 3 BHK flats with clubhouse, pool, and biometric security on REHVO.',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80',
        stat: 'From ₹36,000/mo',
        ctaText: 'View Powai Flats',
        ctaLink: '/mumbai/powai',
      },
    ],
  },
};
