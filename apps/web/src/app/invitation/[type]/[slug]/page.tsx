import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPublicInvitation } from '@/lib/api';
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer';
import {
  MOCK_AHMED_SARA,
  MOCK_AHMED_SARA_ELEGANT_GOLD,
  MOCK_AHMED_SARA_MINIMAL_WHITE,
  MOCK_AHMED_SARA_ROMANTIC_FLORAL,
  MOCK_AHMED_SARA_EGYPTIAN_ORIENTAL,
  MOCK_AHMED_SARA_EMERALD_PALACE,
  MOCK_AHMED_SARA_THEME_OVERRIDE,
  MOCK_OMAR_SALMA,
  MOCK_MARIAM_YOUSSEF,
  MOCK_KARIM_NADA,
  createAhmedSaraWithTheme,
} from '@/lib/mockInvitationData';
import { Heart, Clock, Lock, FileEdit } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: {
    type: string;
    slug: string;
  };
  searchParams?: {
    hideEvent?: string;
    theme?: string;
    themeOverride?: string;
    primary?: string;
    secondary?: string;
    bg?: string;
    text?: string;
    font?: string;
    envelope?: string;
  };
}

function getMockData(slug: string, searchParams?: PageProps['searchParams']) {
  const overrides = searchParams
    ? {
        ...(searchParams.primary ? { primaryColor: searchParams.primary } : {}),
        ...(searchParams.secondary ? { secondaryColor: searchParams.secondary } : {}),
        ...(searchParams.bg ? { backgroundColor: searchParams.bg } : {}),
        ...(searchParams.text ? { textColor: searchParams.text } : {}),
        ...(searchParams.font ? { fontFamily: searchParams.font } : {}),
        ...(searchParams.envelope ? { envelopeStyle: searchParams.envelope } : {}),
      }
    : undefined;

  // If specific theme is queried via URL param ?theme=...
  if (searchParams?.theme) {
    return createAhmedSaraWithTheme(searchParams.theme, overrides);
  }

  // If themeOverride is explicitly tested
  if (slug === 'ahmed-sara-theme-override' || searchParams?.themeOverride === '1') {
    return MOCK_AHMED_SARA_THEME_OVERRIDE;
  }

  // Explicit theme slugs
  if (slug === 'ahmed-sara-royal-burgundy') return MOCK_AHMED_SARA;
  if (slug === 'ahmed-sara-elegant-gold') return MOCK_AHMED_SARA_ELEGANT_GOLD;
  if (slug === 'ahmed-sara-minimal-white') return MOCK_AHMED_SARA_MINIMAL_WHITE;
  if (slug === 'ahmed-sara-romantic-floral') return MOCK_AHMED_SARA_ROMANTIC_FLORAL;
  if (slug === 'ahmed-sara-egyptian-oriental') return MOCK_AHMED_SARA_EGYPTIAN_ORIENTAL;
  if (slug === 'ahmed-sara-emerald-palace') return MOCK_AHMED_SARA_EMERALD_PALACE;

  // If custom theme slug like ahmed-sara-[any-slug]
  if (
    slug.startsWith('ahmed-sara-') &&
    slug !== 'ahmed-sara-4events' &&
    slug !== 'ahmed-sara-hidden-engagement'
  ) {
    const customThemeSlug = slug.replace('ahmed-sara-', '');
    return createAhmedSaraWithTheme(customThemeSlug, overrides);
  }

  // Multi-event test slugs
  if (slug === 'ahmed-sara' || slug === 'ahmed-sara-4events') {
    if (searchParams?.hideEvent === 'engagement') {
      return {
        ...MOCK_AHMED_SARA,
        events: MOCK_AHMED_SARA.events.map((e) =>
          e.type === 'engagement' ? { ...e, isVisible: false } : e
        ),
      };
    }
    return overrides ? createAhmedSaraWithTheme('royal-burgundy', overrides) : MOCK_AHMED_SARA;
  }

  if (slug === 'ahmed-sara-hidden-engagement') {
    return {
      ...MOCK_AHMED_SARA,
      events: MOCK_AHMED_SARA.events.map((e) =>
        e.type === 'engagement' ? { ...e, isVisible: false } : e
      ),
    };
  }

  if (slug === 'omar-salma') return MOCK_OMAR_SALMA;
  if (slug === 'mariam-youssef') return MOCK_MARIAM_YOUSSEF;
  if (slug === 'karim-nada') return MOCK_KARIM_NADA;
  return null;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { type, slug } = params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://farahna.menuflowx.com';
  const mock = getMockData(slug, searchParams);
  const res = await fetchPublicInvitation(type, slug);

  const inv = res?.data?.invitation || res?.data || mock?.invitation;

  if (!inv) {
    return {
      title: 'دعوة فرحنا',
      description: 'دعوة زفاف إلكترونية خاصة',
      robots: { index: false, follow: false },
    };
  }

  const couple = `${inv.coupleGroomAr || 'العروسين'} & ${inv.coupleBrideAr || ''}`;
  const title = `دعوة فرح ${couple} ❤️ | فرحنا`;
  const description = `يسعدنا ويشرفنا حضوركم ومشاركتنا فرحتنا (${couple}). اضغط لمشاهدة تفاصيل الفرح، المواعيد، موقع القاعة، وتأكيد الحضور.`;
  const canonicalUrl = `${baseUrl}/invitation/${type}/${slug}`;
  
  // Resolve WhatsApp & Social Sharing Image:
  // Prioritize custom link preview image chosen by client or admin, then cover image, then dynamic generator
  const rawOgImage =
    inv.customOgImageUrl?.trim() ||
    inv.themeConfig?.customOgImageUrl?.trim() ||
    inv.coverImageUrl?.trim();

  const ogImageUrl = rawOgImage
    ? rawOgImage.startsWith('http')
      ? rawOgImage
      : `${baseUrl}${rawOgImage.startsWith('/') ? '' : '/'}${rawOgImage}`
    : `${baseUrl}/api/og/invitation/${slug}`;

  // Privacy Indexing Rules:
  // - public + published -> indexable
  // - unlisted (default) -> noindex
  // - private -> noindex
  // - draft / paused / expired / archived -> noindex
  const isIndexable = inv.status === 'published' && inv.privacy === 'public';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: isIndexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
          },
        }
      : {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        },
    openGraph: {
      title: `دعوة فرح ${couple} ❤️`,
      description: `فرحتنا قربت ويسعدنا حضوركم لتشاركونا أجمل لحظات حياتنا (${couple}). التفاصيل وتأكيد الحضور في الرابط.`,
      url: canonicalUrl,
      siteName: 'فرحنا — Farahna',
      locale: 'ar_EG',
      type: 'article',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `دعوة فرح ${couple}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `دعوة فرح ${couple} ❤️`,
      description: `فرحتنا قربت ويسعدنا حضوركم لتشاركونا أجمل لحظات حياتنا (${couple}).`,
      images: [ogImageUrl],
    },
  };
}

export default async function PublicInvitationPage({ params, searchParams }: PageProps) {
  const { type, slug } = params;
  const mock = getMockData(slug, searchParams);

  // If a mock-specific testing slug or searchParam is set, prioritize mock
  const isMockOnlyTest =
    slug.startsWith('ahmed-sara') ||
    slug === 'omar-salma' ||
    slug === 'mariam-youssef' ||
    slug === 'karim-nada' ||
    Boolean(searchParams?.hideEvent) ||
    Boolean(searchParams?.theme) ||
    Boolean(searchParams?.themeOverride) ||
    Boolean(searchParams?.primary);

  let data = null;
  let res = null;

  if (isMockOnlyTest) {
    data = mock;
  } else {
    res = await fetchPublicInvitation(type, slug);
    data = res?.success && res.data ? res.data : mock;
  }

  if (!data) {
    if (res?.status === 'paused') {
      return (
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 text-center font-cairo">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-stone-200 shadow-xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-stone-900">الدعوة متوقفة مؤقتاً</h1>
            <p className="text-sm text-stone-600 leading-relaxed">
              تم إيقاف هذه الدعوة مؤقتاً بواسطة أصحاب المناسبة لتحديث بعض المواعيد أو التفاصيل. يرجى مراجعة الرابط لاحقاً.
            </p>
            <div className="pt-4 border-t border-stone-100">
              <Link href="/" className="text-xs font-bold text-[#720925] hover:underline">
                العودة للرئيسية منصة فرحنا
              </Link>
            </div>
          </div>
        </div>
      );
    }

    if (res?.status === 'expired') {
      return (
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 text-center font-cairo">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-stone-200 shadow-xl space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-[#720925] flex items-center justify-center mx-auto">
              <Heart className="w-7 h-7 fill-[#720925]" />
            </div>
            <h1 className="text-2xl font-black text-stone-900">انتهت صلاحية هذه الدعوة</h1>
            <p className="text-sm text-stone-600 leading-relaxed">
              انقضى موعد هذا الفرح المبارك بحمد الله ❤️ نتمنى للعروسين حياة سعيدة ملؤها المودة والرحمة.
            </p>
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <p className="text-xs text-stone-500 font-bold">عايز تعمل دعوة إلكترونية فاخرة لفرحك؟</p>
              <Link
                href="/"
                className="inline-block px-6 py-2.5 rounded-full burgundy-gradient-bg text-white text-xs font-bold shadow-md hover:opacity-95"
              >
                اعمل دعوتك دلوقتي من فرحنا ❤️
              </Link>
            </div>
          </div>
        </div>
      );
    }

    if (res?.status === 'draft') {
      return (
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 text-center font-cairo">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-stone-200 shadow-xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center mx-auto">
              <FileEdit className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-stone-900">الدعوة قيد التجهيز</h1>
            <p className="text-sm text-stone-600 leading-relaxed">
              هذه الدعوة ما زالت قيد الإعداد والتحضير بواسطة العروسين ولم يتم نشرها رسمياً بعد. يرجى الانتظار لحين الانتهاء ومشاركة الرابط.
            </p>
            <div className="pt-4 border-t border-stone-100">
              <Link href="/" className="text-xs font-bold text-[#720925] hover:underline">
                العودة للرئيسية منصة فرحنا
              </Link>
            </div>
          </div>
        </div>
      );
    }

    if (res?.status === 'private') {
      return (
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 text-center font-cairo">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-stone-200 shadow-xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-[#720925] flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-stone-900">دعوة خاصة ومحمية</h1>
            <p className="text-sm text-stone-600 leading-relaxed">
              هذه الدعوة مخصصة لضيوف محددين بروابط خاصة، ولا يمكن الوصول إليها من هذا الرابط العام.
            </p>
            <div className="pt-4 border-t border-stone-100">
              <Link href="/" className="text-xs font-bold text-[#720925] hover:underline">
                العودة للرئيسية منصة فرحنا
              </Link>
            </div>
          </div>
        </div>
      );
    }

    notFound();
  }

  const invitation = data.invitation || data;
  const events = data.events || [];
  const theme = data.theme;
  const sections = data.sections || [];
  const isThemeOverrideDemo =
    params.slug === 'ahmed-sara-theme-override' || searchParams?.themeOverride === '1';

  return (
    <InvitationRenderer
      invitation={invitation}
      events={events}
      theme={theme}
      sections={sections}
      isPreview={false}
      initialEventId={isThemeOverrideDemo ? 'evt-henna-02' : undefined}
    />
  );
}
