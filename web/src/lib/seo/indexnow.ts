/**
 * REHVO IndexNow & Search Engine Automation Engine
 * Supports Bing, Yandex, Seznam, Naver, IndexNow API, and Google/Bing Sitemap Pings
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.in';
export const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'e58f2d5930b847849e71e7d890538a7c';
export const INDEXNOW_KEY_LOCATION = `${BASE_URL}/e58f2d5930b847849e71e7d890538a7c.txt`;

export interface IndexNowEndpointResult {
  endpoint: string;
  engine: 'bing' | 'yandex' | 'seznam' | 'naver' | 'indexnow' | 'google';
  success: boolean;
  status: number;
  message: string;
}

export const INDEXNOW_ENDPOINTS = [
  { engine: 'indexnow' as const, url: 'https://api.indexnow.org/indexnow' },
  { engine: 'bing' as const, url: 'https://www.bing.com/indexnow' },
  { engine: 'yandex' as const, url: 'https://yandex.com/indexnow' },
  { engine: 'seznam' as const, url: 'https://search.seznam.cz/indexnow' },
  { engine: 'naver' as const, url: 'https://searchadvisor.naver.com/indexnow' },
];

/**
 * Submit an array of URLs to all IndexNow participating search engines
 */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowEndpointResult[]> {
  if (!urls || urls.length === 0) {
    return [
      {
        endpoint: 'all',
        engine: 'indexnow',
        success: false,
        status: 400,
        message: 'No URLs provided for indexing',
      },
    ];
  }

  const hostname = new URL(BASE_URL).hostname;
  const fullUrls = urls.map((u) =>
    u.startsWith('http') ? u : `${BASE_URL}${u.startsWith('/') ? u : `/${u}`}`
  );

  const payload = {
    host: hostname,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: fullUrls,
  };

  const results = await Promise.allSettled(
    INDEXNOW_ENDPOINTS.map(async (ep) => {
      try {
        const res = await fetch(ep.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify(payload),
        });

        const isOk = res.ok || res.status === 200 || res.status === 202;
        return {
          endpoint: ep.url,
          engine: ep.engine,
          success: isOk,
          status: res.status,
          message: isOk
            ? `Successfully notified ${ep.engine} for ${fullUrls.length} URLs`
            : `Failed with status ${res.status}`,
        };
      } catch (err: any) {
        return {
          endpoint: ep.url,
          engine: ep.engine,
          success: false,
          status: 500,
          message: err?.message || 'Network request failed',
        };
      }
    })
  );

  return results.map((r, idx) => {
    if (r.status === 'fulfilled') return r.value;
    const ep = INDEXNOW_ENDPOINTS[idx];
    return {
      endpoint: ep.url,
      engine: ep.engine,
      success: false,
      status: 500,
      message: 'Promise rejected',
    };
  });
}

/**
 * Submit a newly published property URL to IndexNow
 */
export async function submitPropertyToIndexNow(propertySlugOrObject: string | { slug?: string; id?: string }) {
  const slug =
    typeof propertySlugOrObject === 'string'
      ? propertySlugOrObject
      : propertySlugOrObject.slug || propertySlugOrObject.id;

  if (!slug) return [];

  const propertyUrl = `/property/${slug}`;
  console.log(`[REHVO IndexNow] Auto-submitting newly published property: ${propertyUrl}`);
  return submitToIndexNow([propertyUrl]);
}

/**
 * Ping Google and Bing with the primary sitemap index
 */
export async function pingSearchEnginesSitemap(
  customSitemapUrl?: string
): Promise<{ google: IndexNowEndpointResult; bing: IndexNowEndpointResult }> {
  const sitemapUrl = customSitemapUrl || `${BASE_URL}/sitemap-index.xml`;

  // 1. Google Sitemap Ping
  let googleResult: IndexNowEndpointResult;
  try {
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const res = await fetch(googlePingUrl, { method: 'GET' });
    googleResult = {
      endpoint: googlePingUrl,
      engine: 'google',
      success: res.ok,
      status: res.status,
      message: res.ok
        ? 'Google Search Console sitemap ping succeeded'
        : `Google ping returned status ${res.status}`,
    };
  } catch (err: any) {
    googleResult = {
      endpoint: 'https://www.google.com/ping',
      engine: 'google',
      success: false,
      status: 500,
      message: err?.message || 'Google ping network failure',
    };
  }

  // 2. Bing Sitemap Ping
  let bingResult: IndexNowEndpointResult;
  try {
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const res = await fetch(bingPingUrl, { method: 'GET' });
    bingResult = {
      endpoint: bingPingUrl,
      engine: 'bing',
      success: res.ok,
      status: res.status,
      message: res.ok
        ? 'Bing Webmaster sitemap ping succeeded'
        : `Bing ping returned status ${res.status}`,
    };
  } catch (err: any) {
    bingResult = {
      endpoint: 'https://www.bing.com/ping',
      engine: 'bing',
      success: false,
      status: 500,
      message: err?.message || 'Bing ping network failure',
    };
  }

  console.log('[REHVO Sitemap Ping] Google:', googleResult.message);
  console.log('[REHVO Sitemap Ping] Bing:', bingResult.message);

  return { google: googleResult, bing: bingResult };
}
