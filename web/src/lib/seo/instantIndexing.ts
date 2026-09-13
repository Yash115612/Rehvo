/**
 * REHVO Instant Indexing Engine
 * Dispatches real-time URL submissions to search engines
 * Supports IndexNow (Bing, Yandex, Seznam, Naver) and Google Search Console
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.in';
const INDEXNOW_KEY = 'e58f2d5930b847849e71e7d890538a7c';
const INDEXNOW_KEY_LOCATION = `${BASE_URL}/e58f2d5930b847849e71e7d890538a7c.txt`;

export interface IndexingResult {
  engine: 'indexnow' | 'bing' | 'google';
  success: boolean;
  status: number;
  message: string;
}

/**
 * Submit URLs to IndexNow (instantly updates Bing, Yandex, Naver, Seznam)
 */
export async function pingIndexNow(urls: string[]): Promise<IndexingResult> {
  if (!urls || urls.length === 0) {
    return { engine: 'indexnow', success: false, status: 400, message: 'No URLs provided' };
  }

  const hostname = new URL(BASE_URL).hostname;
  const fullUrls = urls.map((u) => (u.startsWith('http') ? u : `${BASE_URL}${u.startsWith('/') ? u : `/${u}`}`));

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host: hostname,
        key: INDEXNOW_KEY,
        keyLocation: INDEXNOW_KEY_LOCATION,
        urlList: fullUrls,
      }),
    });

    return {
      engine: 'indexnow',
      success: res.ok || res.status === 200 || res.status === 202,
      status: res.status,
      message: res.ok ? `Successfully notified IndexNow for ${fullUrls.length} URLs` : `IndexNow responded with status ${res.status}`,
    };
  } catch (err: any) {
    return {
      engine: 'indexnow',
      success: false,
      status: 500,
      message: err?.message || 'IndexNow ping failed',
    };
  }
}

/**
 * Ping Google Search Console with sitemap notification
 */
export async function pingGoogleSearchConsole(urls?: string[]): Promise<IndexingResult> {
  try {
    const sitemapUrl = `${BASE_URL}/sitemap.xml`;
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const res = await fetch(pingUrl, { method: 'GET' });

    return {
      engine: 'google',
      success: res.ok,
      status: res.status,
      message: res.ok ? 'Google Search Console sitemap ping succeeded' : `Google ping returned ${res.status}`,
    };
  } catch (err: any) {
    return {
      engine: 'google',
      success: false,
      status: 500,
      message: err?.message || 'Google ping failed',
    };
  }
}

/**
 * Ping Bing Webmaster with sitemap notification
 */
export async function pingBingWebmaster(urls?: string[]): Promise<IndexingResult> {
  try {
    const sitemapUrl = `${BASE_URL}/sitemap.xml`;
    const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const res = await fetch(pingUrl, { method: 'GET' });

    return {
      engine: 'bing',
      success: res.ok,
      status: res.status,
      message: res.ok ? 'Bing Webmaster sitemap ping succeeded' : `Bing ping returned ${res.status}`,
    };
  } catch (err: any) {
    return {
      engine: 'bing',
      success: false,
      status: 500,
      message: err?.message || 'Bing ping failed',
    };
  }
}

/**
 * Dispatch batch instant indexing across all search engines
 */
export async function instantIndexBatch(urls: string[]): Promise<IndexingResult[]> {
  const [indexNowRes, googleRes, bingRes] = await Promise.allSettled([
    pingIndexNow(urls),
    pingGoogleSearchConsole(urls),
    pingBingWebmaster(urls),
  ]);

  return [
    indexNowRes.status === 'fulfilled' ? indexNowRes.value : { engine: 'indexnow', success: false, status: 500, message: 'Failed' },
    googleRes.status === 'fulfilled' ? googleRes.value : { engine: 'google', success: false, status: 500, message: 'Failed' },
    bingRes.status === 'fulfilled' ? bingRes.value : { engine: 'bing', success: false, status: 500, message: 'Failed' },
  ];
}
