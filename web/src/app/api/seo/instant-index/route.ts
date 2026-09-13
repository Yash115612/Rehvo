import { NextRequest, NextResponse } from 'next/server';
import { instantIndexBatch, pingIndexNow } from '@/lib/seo/instantIndexing';

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
