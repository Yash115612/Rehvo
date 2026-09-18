import { getPublishedProperties } from '@/lib/seo/queries';
import { generatePropertySlug } from '@/lib/seo/slugs';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://rehvo.in';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

export async function GET() {
  let properties: any[] = [];
  try {
    const res = await getPublishedProperties({ category: 'all', limit: 100 });
    properties = res.properties || [];
  } catch {
    properties = [];
  }

  const xmlUrls = properties
    .map((p) => {
      const slug = generatePropertySlug({
        id: p.id,
        title: p.title,
        locality: p.locality,
        city: p.city,
      });
      const pageLoc = `${BASE_URL}/property/${slug}`;

      const images = (p.property_images || []).filter(
        (img: any) =>
          img &&
          typeof img.image_url === 'string' &&
          img.image_url.startsWith('https://')
      );

      if (images.length === 0) {
        return '';
      }

      const imageXmlBlocks = images
        .map((img: any, idx: number) => {
          const imgLoc = escapeXml(img.image_url);
          const title = escapeXml(
            `${p.title} - ${p.locality}, ${p.city} (Photo ${idx + 1})`
          );
          const caption = escapeXml(
            `Verified ${p.bedrooms || 1} BHK rental property in ${p.locality}, ${p.city} on REHVO`
          );

          return `    <image:image>
      <image:loc>${imgLoc}</image:loc>
      <image:title>${title}</image:title>
      <image:caption>${caption}</image:caption>
    </image:image>`;
        })
        .join('\n');

      return `  <url>
    <loc>${pageLoc}</loc>
${imageXmlBlocks}
  </url>`;
    })
    .filter(Boolean)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${xmlUrls}
</urlset>`.trim();

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
