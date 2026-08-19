import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'Zero-Brokerage Rentals in Mumbai';
    const subtitle = searchParams.get('subtitle') || 'Direct Verified Owner Connections';
    const price = searchParams.get('price');
    const badge = searchParams.get('badge') || '100% Zero Brokerage';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#0c0a09', // stone-950
            padding: '60px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: '#9333ea', // purple-600
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '28px',
                  fontWeight: 900,
                }}
              >
                R
              </div>
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                REHVO<span style={{ color: '#a855f7' }}>.</span>
              </span>
            </div>

            {/* Badge */}
            <div
              style={{
                backgroundColor: 'rgba(147, 51, 234, 0.2)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                color: '#d8b4fe',
                fontSize: '18px',
                fontWeight: 700,
                padding: '10px 22px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {badge}
            </div>
          </div>

          {/* Center Title Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <h1
              style={{
                fontSize: title.length > 40 ? '50px' : '62px',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              {title}
            </h1>

            <p
              style={{
                fontSize: '24px',
                color: '#a8a29e', // stone-400
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Bottom Footer Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #292524',
              paddingTop: '28px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                color: '#78716c',
                fontSize: '20px',
                fontWeight: 600,
              }}
            >
              <span>Mumbai</span>
              <span>•</span>
              <span>Verified Listings</span>
              <span>•</span>
              <span>Direct Chat & Visits</span>
            </div>

            {price && (
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: '#34d399', // emerald-400
                }}
              >
                {price}
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
