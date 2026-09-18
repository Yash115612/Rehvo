export const dynamic = 'force-dynamic';

const BASE_URL = 'https://rehvo.in';

const VIDEOS = [
  {
    loc: `${BASE_URL}/showreels`,
    videoLoc: `${BASE_URL}/videos/modern-apartment-interior.mp4`,
    thumbnailLoc: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    title: 'Modern 2 BHK Sea-Facing Walkthrough in Bandra West | REHVO',
    description: 'High-definition video tour of fully-furnished 2 BHK apartment on Carter Road, Bandra West.',
    duration: 75,
    publicationDate: '2026-02-15',
  },
  {
    loc: `${BASE_URL}/showreels`,
    videoLoc: `${BASE_URL}/videos/modern-apartment-living-room.mp4`,
    thumbnailLoc: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    title: 'Luxury 3 BHK Lake-View Apartment in Hiranandani Powai | REHVO',
    description: 'Walkthrough of neoclassical 3 BHK flat overlooking Powai Lake in Mumbai.',
    duration: 105,
    publicationDate: '2026-02-20',
  },
  {
    loc: `${BASE_URL}/showreels`,
    videoLoc: `${BASE_URL}/videos/modern-kitchen-living-room.mp4`,
    thumbnailLoc: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
    title: 'Compact Furnished Studio Near DN Nagar Metro, Andheri West | REHVO',
    description: 'Walkthrough of a bright modern studio apartment 2 minutes from Metro Line 2A station.',
    duration: 50,
    publicationDate: '2026-03-01',
  },
];

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${VIDEOS.map(
  (v) => `  <url>
    <loc>${v.loc}</loc>
    <video:video>
      <video:thumbnail_loc>${v.thumbnailLoc}</video:thumbnail_loc>
      <video:title><![CDATA[${v.title}]]></video:title>
      <video:description><![CDATA[${v.description}]]></video:description>
      <video:content_loc>${v.videoLoc}</video:content_loc>
      <video:duration>${v.duration}</video:duration>
      <video:publication_date>${v.publicationDate}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
    </video:video>
  </url>`
).join('\n')}
</urlset>`.trim();

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
