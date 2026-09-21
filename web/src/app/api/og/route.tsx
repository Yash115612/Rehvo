import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const type = searchParams.get('type') || 'default';
    const title = searchParams.get('title') || 'Verified Rental Marketplace in India';
    const subtitle = searchParams.get('subtitle') || 'Rent flats, flatmates, and PGs directly from verified homeowners';
    const badge = searchParams.get('badge') || '100% Verified Marketplace';
    const price = searchParams.get('price');
    const locality = searchParams.get('locality') || 'Mumbai';
    const metric1 = searchParams.get('m1');
    const metric2 = searchParams.get('m2');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#031B2A', // Deep navy brand canvas
            padding: '60px 70px',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-120px',
              right: '-120px',
              width: '500px',
              height: '500px',
              borderRadius: '500px',
              background: 'radial-gradient(circle, rgba(14, 143, 115, 0.35) 0%, rgba(3, 27, 42, 0) 70%)',
            }}
          />

          {/* Top Header Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 10,
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '4px',
              }}
            >
              <span
                style={{
                  fontSize: '44px',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '-0.04em',
                }}
              >
                REHVO
              </span>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '10px',
                  backgroundColor: '#0E8F73',
                  display: 'inline-block',
                  marginLeft: '4px',
                }}
              />
            </div>

            {/* Dynamic Context Badge */}
            <div
              style={{
                backgroundColor: 'rgba(14, 143, 115, 0.22)',
                border: '1.5px solid rgba(45, 212, 191, 0.45)',
                color: '#5EEAD4',
                fontSize: '17px',
                fontWeight: 800,
                padding: '9px 24px',
                borderRadius: '100px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{badge}</span>
            </div>
          </div>

          {/* Center Content Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              zIndex: 10,
              maxWidth: '920px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '18px',
                fontWeight: 700,
                color: '#0E8F73',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              <span>{type === 'locality' ? `Locality Benchmark • ${locality}` : type === 'blog' ? 'Editorial Guide' : type === 'showreel' ? 'HD Video Walkthrough' : 'Direct Homeowner Marketplace'}</span>
            </div>

            <h1
              style={{
                fontSize: title.length > 50 ? '48px' : title.length > 30 ? '56px' : '64px',
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
                fontSize: '22px',
                color: '#94A3B8',
                lineHeight: 1.4,
                margin: 0,
                fontWeight: 500,
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Bottom Footer Info Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              paddingTop: '26px',
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                color: '#94A3B8',
                fontSize: '19px',
                fontWeight: 600,
              }}
            >
              <span>{locality}</span>
              <span style={{ color: '#0E8F73' }}>•</span>
              <span>Zero Commission</span>
              <span style={{ color: '#0E8F73' }}>•</span>
              <span>Government Deed Verified</span>
              {metric1 && (
                <>
                  <span style={{ color: '#0E8F73' }}>•</span>
                  <span style={{ color: '#34D399' }}>{metric1}</span>
                </>
              )}
            </div>

            {price ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '4px',
                  fontSize: '36px',
                  fontWeight: 900,
                  color: '#34D399',
                }}
              >
                <span>{price}</span>
                <span style={{ fontSize: '18px', color: '#94A3B8', fontWeight: 600 }}>/mo</span>
              </div>
            ) : metric2 ? (
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#5EEAD4',
                }}
              >
                {metric2}
              </div>
            ) : (
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#5EEAD4',
                }}
              >
                rehvo.in
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
