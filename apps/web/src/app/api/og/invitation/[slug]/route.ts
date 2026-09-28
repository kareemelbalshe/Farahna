import { NextRequest } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

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

    const coupleGroom = inv?.coupleGroomAr || 'أحمد';
    const coupleBride = inv?.coupleBrideAr || 'سارة';
    const coupleNames = escapeXml(`${coupleGroom} & ${coupleBride}`);
    const invitationTitle = escapeXml(inv?.title || `دعوة زفاف ${coupleGroom} & ${coupleBride}`);
    const venueName = escapeXml(primaryEvent?.venueNameAr || 'قاعة الفرح الملكية');
    const eventDate = escapeXml(
      primaryEvent?.date
        ? new Date(primaryEvent.date).toLocaleDateString('ar-EG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'الخميس، 15 أكتوبر 2026'
    );

    const primaryColor = theme?.primaryColor || '#720925';
    const secondaryColor = theme?.secondaryColor || '#D4AF37';

    // High-resolution SVG Template with luxury styling
    const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4A0515" />
      <stop offset="50%" stop-color="#28030B" />
      <stop offset="100%" stop-color="#120105" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F7EAC7" />
      <stop offset="50%" stop-color="#D4AF37" />
      <stop offset="100%" stop-color="#9C7709" />
    </linearGradient>
  </defs>

  <!-- Deep Royal Background -->
  <rect width="100%" height="100%" fill="url(#bg)" />

  <!-- Outer Luxury Gold Border -->
  <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="url(#gold)" stroke-width="4" />
  <rect x="36" y="36" width="1128" height="558" rx="14" fill="none" stroke="rgba(212,175,55,0.3)" stroke-width="1.5" />

  <!-- Header Pill Badge -->
  <rect x="380" y="68" width="440" height="50" rx="25" fill="rgba(212,175,55,0.12)" stroke="#D4AF37" stroke-width="1.5" />
  <text x="600" y="100" font-size="20" font-weight="bold" fill="#D4AF37" text-anchor="middle" font-family="Segoe UI, Tahoma, Cairo, Arial, sans-serif">
    💍 دعوة زفاف إلكترونية خاصة — منصة فرحنا
  </text>

  <!-- Welcoming Subtext -->
  <text x="600" y="210" font-size="26" fill="#E5D0A1" text-anchor="middle" font-family="Segoe UI, Tahoma, Cairo, Arial, sans-serif">
    يسعدنا ويشرفنا دعوتكم لحضور حفل زفاف
  </text>

  <!-- Stylized Couple Names -->
  <text x="600" y="315" font-size="64" font-weight="900" fill="#FFFFFF" text-anchor="middle" font-family="Segoe UI, Tahoma, Cairo, Arial, sans-serif">
    ${coupleNames}
  </text>

  <!-- Slogan -->
  <text x="600" y="385" font-size="28" font-weight="bold" fill="#D4AF37" text-anchor="middle" font-family="Segoe UI, Tahoma, Cairo, Arial, sans-serif">
    دعوتنا ❤️ فرحتكم تهمنا
  </text>

  <!-- Bottom Info Bar -->
  <rect x="80" y="470" width="1040" height="84" rx="24" fill="rgba(0,0,0,0.45)" stroke="rgba(212,175,55,0.25)" stroke-width="1.5" />
  
  <text x="260" y="522" font-size="21" font-weight="bold" fill="#FFFFFF" text-anchor="middle" font-family="Segoe UI, Tahoma, Cairo, Arial, sans-serif">
    📅 ${eventDate}
  </text>

  <text x="620" y="522" font-size="21" font-weight="bold" fill="#E5D0A1" text-anchor="middle" font-family="Segoe UI, Tahoma, Cairo, Arial, sans-serif">
    📍 ${venueName}
  </text>

  <text x="970" y="522" font-size="20" font-weight="bold" fill="#D4AF37" text-anchor="middle" font-family="Segoe UI, Tahoma, Cairo, Arial, sans-serif">
    فرحنا — Farahna
  </text>
</svg>
`;

    // Render crisp 1200x630 PNG via sharp
    const pngBuffer = await sharp(Buffer.from(svg))
      .png({ quality: 90 })
      .toBuffer();

    return new Response(pngBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error: any) {
    return new Response(`Failed to generate OG image: ${error?.message}`, { status: 500 });
  }
}
