import { NextRequest, NextResponse } from 'next/server';
import { instantIndexBatch, pingGoogleSearchConsole, pingBingWebmaster, pingIndexNow } from '@/lib/seo/instantIndexing';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Default ping for root and key sitemaps
    const results = await instantIndexBatch(['/', '/rent', '/search', '/flatmates', '/pg', '/commercial']);
    return NextResponse.json({
      status: 'healthy',
      engine: 'REHVO Instant Indexing Engine v2.0',
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Indexing ping failed' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'Invalid payload: array of urls required' },
        { status: 400 }
      );
    }

    const results = await instantIndexBatch(urls);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      submittedCount: urls.length,
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to trigger instant indexing' },
      { status: 500 }
    );
  }
}
