import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    // Fetch invitation data from API
    let invitationData: any = null;
    try {
      const res = await fetch(`${apiUrl}/public/invitations/any/${slug}`, {
        cache: 'no-store',
      });
      const json = await res.json();
      if (json.success && json.data) {
        invitationData = json.data;
      }
    } catch (e) {
      // Ignore network errors and fallback
    }

    const inv = invitationData?.invitation || invitationData;
    const primaryEvent = invitationData?.events?.[0];
    const theme = invitationData?.theme;

    const coupleTitle = inv
      ? `${inv.coupleGroomAr || 'العروسين'} & ${inv.coupleBrideAr || ''}`
      : 'أحمد & سارة';
    const invitationTitle = inv?.title || `دعوة زفاف ${coupleTitle}`;
    const venueName = primaryEvent?.venueNameAr || 'قاعة الفرح الملكية';
    const eventDate = primaryEvent?.date
      ? new Date(primaryEvent.date).toLocaleDateString('ar-EG', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'الخميس، 15 أكتوبر 2026';

    const primaryColor = theme?.primaryColor || '#720925';
    const secondaryColor = theme?.secondaryColor || '#D4AF37';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: `radial-gradient(circle at center, #2C050E 0%, #150206 100%)`,
            border: `16px solid ${secondaryColor}`,
            padding: '48px 56px',
            fontFamily: 'sans-serif',
            direction: 'rtl',
            position: 'relative',
          }}
        >
          {/* Subtle Golden Frame Overlay */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              right: '16px',
              bottom: '16px',
              border: `2px solid rgba(212, 175, 55, 0.4)`,
              pointerEvents: 'none',
            }}
          />

          {/* Top Header Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              background: 'rgba(212, 175, 55, 0.15)',
              border: `1.5px solid ${secondaryColor}`,
              borderRadius: '999px',
              padding: '10px 28px',
            }}
          >
            <span
              style={{
                color: secondaryColor,
                fontSize: '22px',
                fontWeight: 700,
                letterSpacing: '1px',
              }}
            >
              💍 دعوة فرح إلكترونية خاصة — منصة فرحنا
            </span>
          </div>

          {/* Main Couple Display */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              margin: 'auto 0',
            }}
          >
            <span
              style={{
                color: '#E5D0A1',
                fontSize: '28px',
                marginBottom: '12px',
                fontWeight: 400,
              }}
            >
              يسعدنا ويشرفنا دعوتكم لحضور حفل زفاف
            </span>

            <h1
              style={{
                color: '#FFFFFF',
                fontSize: '72px',
                fontWeight: 900,
                margin: '8px 0',
                textShadow: '0 4px 20px rgba(0,0,0,0.6)',
              }}
            >
              {coupleTitle}
            </h1>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: secondaryColor,
                fontSize: '32px',
                fontWeight: 800,
                marginTop: '6px',
              }}
            >
              <span>دعوتنا ❤️ فرحتكم تهمنا</span>
            </div>
          </div>

          {/* Bottom Footer Info Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: 'rgba(0, 0, 0, 0.45)',
              border: `1px solid rgba(212, 175, 55, 0.3)`,
              borderRadius: '24px',
              padding: '16px 36px',
            }}
          >
            {/* Event Date */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#FFFFFF',
                fontSize: '22px',
                fontWeight: 700,
              }}
            >
              <span>📅 {eventDate}</span>
            </div>

            {/* Venue Location */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#E5D0A1',
                fontSize: '22px',
                fontWeight: 700,
              }}
            >
              <span>📍 {venueName}</span>
            </div>

            {/* Platform Branding */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: secondaryColor,
                fontSize: '20px',
                fontWeight: 800,
              }}
            >
              <span>فرحنا — Farahna</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error: any) {
    return new Response(`Failed to generate image: ${error?.message}`, { status: 500 });
  }
}
