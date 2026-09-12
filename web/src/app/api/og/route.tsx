import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'Verified Marketplace Rentals in Mumbai';
    const subtitle = searchParams.get('subtitle') || 'Rent flats, rooms & flatmates directly from owners';
    const badge = searchParams.get('badge') || '100% Verified Marketplace';
    const price = searchParams.get('price');

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
          {/* Top Header Row */}
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
                gap: '2px',
              }}
            >
              <span
                style={{
                  fontSize: '40px',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '-0.03em',
                }}
              >
                re<span style={{ color: '#00875A' }}>h</span>vo
              </span>
            </div>

            {/* Badge */}
            <div
              style={{
                backgroundColor: 'rgba(15, 118, 110, 0.25)',
                border: '1px solid rgba(45, 212, 191, 0.4)',
                color: '#5EEAD4',
                fontSize: '18px',
                fontWeight: 700,
                padding: '8px 20px',
                borderRadius: '100px',
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
