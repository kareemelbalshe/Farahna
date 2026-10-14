import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#720925',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://farahna.menuflowx.com'),
  title: 'فرحنا — دعوة فرحك الإلكترونية الفاخرة في مصر | كروت زفاف رقمية وRSVP',
  description:
    'المنصة المصرية الأولى لتصميم دعوات أفراح وزفاف إلكترونية تفاعلية فاخرة. رابط واحد يجمع الزفاف، الخطوبة، الحنة، وكتب الكتاب مع الخريطة التفاعلية GPS، تأكيد الحضور الذكي RSVP، ومشاركة فورية على واتساب.',
  keywords: [
    'دعوة فرح إلكترونية',
    'دعوة زفاف إلكترونية مصر',
    'تصميم كروت أفراح ديجيتال القاهرة',
    'دعوة فرح واتساب مصر',
    'دعوة خطوبة إلكترونية',
    'دعوة حنة نسائية خاصة',
    'دعوة كتب كتاب إلكترونية',
    'تأكيد حضور المعازيم RSVP مصر',
    'دعوة زفاف التجمع الخامس',
    'دعوة فرح الشيخ زايد',
    'دعوات أفراح الإسكندرية',
    'بطاقة دعوة زواج الكترونية',
    'كروت زفاف رقمية',
    'فرحنا',
    'Farahna',
  ],
  alternates: {
    canonical: 'https://farahna.menuflowx.com',
  },
  openGraph: {
    title: 'فرحنا — دعوة فرحك الإلكترونية الفاخرة | Farahna',
    description: 'دعوتك مش مجرد لينك... دي بداية فرحتكم ❤️ رابط واحد ذكي يجمع كل مناسباتكم بموقع القاعة وتأكيد الحضور.',
    url: 'https://farahna.menuflowx.com',
    siteName: 'فرحنا — Farahna',
    locale: 'ar_EG',
    type: 'website',
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'فرحنا — دعوات أفراح إلكترونية فاخرة في مصر',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'فرحنا — دعوة فرحك الإلكترونية الفاخرة',
    description: 'دعوتك مش مجرد لينك... دي بداية فرحتكم ❤️',
    images: ['/favicon.png'],
  },
  other: {
    'geo.region': 'EG-C',
    'geo.placename': 'Cairo, Egypt',
    'geo.position': '30.0444;31.2357',
    'ICBM': '30.0444, 31.2357',
    'target-country': 'EG',
    'coverage': 'Egypt, Saudi Arabia, UAE, MENA',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="64x64" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#720925" />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen w-full max-w-full overflow-x-hidden relative bg-[#FAF7F2] text-[#1A1819] antialiased selection:bg-[#720925] selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
