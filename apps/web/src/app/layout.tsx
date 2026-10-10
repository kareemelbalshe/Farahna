import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'فرحنا — دعوة فرحك الإلكترونية الفاخرة | Farahna',
  description:
    'دعوة إلكترونية مصممة مخصوص ليكم، تجمع كل مواعيد فرحتكم (الخطوبة، الحنة، كتب الكتاب، والفرح) في لينك واحد أنيق تشاركوه مع كل اللي بتحبوهم.',
  keywords: [
    'دعوة فرح إلكترونية',
    'دعوة زفاف إلكترونية',
    'دعوة خطوبة',
    'دعوة حنة',
    'دعوة كتب كتاب',
    'دعوات أفراح مصرية',
    'دعوة فرح واتساب',
    'دعوة زفاف رقمية',
    'فرحنا',
    'Farahna',
  ],
  openGraph: {
    title: 'فرحنا — دعوة فرحك الإلكترونية الفاخرة',
    description: 'دعوتك مش مجرد لينك... دي بداية فرحتكم ❤️',
    url: 'https://farahna.menuflowx.com',
    siteName: 'فرحنا — Farahna',
    locale: 'ar_EG',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="64x64" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#720925" />
      </head>
      <body className="min-h-screen bg-[#FAF7F2] text-[#1A1819] antialiased selection:bg-[#720925] selection:text-white">
        {children}
      </body>
    </html>
  );
}
