'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Eye,
  MessageCircle,
  Sparkles,
  Check,
  Music,
  Volume2,
  Heart,
  Crown,
  Moon,
  Feather,
  Flower2,
  Scroll,
  Maximize2,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getWhatsAppUrl, createInquiryWhatsAppMessage } from '@/lib/whatsapp';
import { playThemeMelody } from '@/lib/themeAudio';

interface ThemesGalleryProps {
  whatsappNumber?: string;
}

type ThemeSlug =
  | 'royal-burgundy'
  | 'elegant-gold'
  | 'minimal-white'
  | 'romantic-floral'
  | 'egyptian-oriental'
  | 'emerald-palace';

interface ThemeItem {
  name: string;
  nameAr: string;
  slug: ThemeSlug;
  demoUrl: string;
  badge: string;
  description: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  musicVibe: string;
  fontName: string;
  accentColor: string;
  primaryColor: string;
  palette: { name: string; hex: string }[];
  cardHeaderBg: string;
  sealClass: string;
  envelopeFlapColor: string;
  envelopeBodyColor: string;
  sampleCouple: string;
  atmosphereTag: string;
}

const THEMES_DATA: ThemeItem[] = [
  {
    name: 'Royal Burgundy',
    nameAr: 'الملكي البورجوندي',
    slug: 'royal-burgundy',
    demoUrl: '/invitation/wedding/ahmed-sara-royal-burgundy',
    badge: 'الأكثر شهرة 👑',
    description:
      'أفخم ألوان الأعراس الملكية بتناغم العنابي الداكن مع خطوط الذهب وختم الشمع التفاعلي.',
    features: ['ختم شمع عنابي', 'زخارف ذهبية بارزة', 'مثالي لقصور الأفراح والفنادق'],
    icon: Crown,
    musicVibe: 'أوركسترا ملكية كلاسيكية 🎻',
    fontName: 'خط ديواني وأميري ملكي',
    accentColor: '#D4AF37',
    primaryColor: '#720925',
    palette: [
      { name: 'عنابي ملكي', hex: '#720925' },
      { name: 'ذهب إمبراطوري', hex: '#D4AF37' },
      { name: 'خمري عميق', hex: '#4A0E17' },
      { name: 'عاجي فاخر', hex: '#FAF7F2' },
    ],
    cardHeaderBg: 'from-[#5A061D] via-[#720925] to-[#3E0413]',
    sealClass: 'wax-seal-burgundy',
    envelopeFlapColor: '#53071b',
    envelopeBodyColor: '#650921',
    sampleCouple: 'أحمد محمود & سارة إبراهيم',
    atmosphereTag: 'مثالي لقصور الأفراح والفنادق',
  },
  {
    name: 'Elegant Gold',
    nameAr: 'الذهبي الفاخر Dark Mode',
    slug: 'elegant-gold',
    demoUrl: '/invitation/engagement/omar-salma',
    badge: 'عصري وفاخر ✨',
    description:
      'طابع ليلي درامي ساحر بخلفية فحمية عميقة وتفاصيل من رقائق الذهب الإيطالي.',
    features: ['خلفية دارك مود', 'خط عربي حديث', 'تأثير لمعان الذهب'],
    icon: Moon,
    musicVibe: 'بيانو رومانسي ليلي ساحر 🎹',
    fontName: 'خط تجوال عصري فاخر',
    accentColor: '#D4AF37',
    primaryColor: '#B8860B',
    palette: [
      { name: 'أسود فحمي', hex: '#0F0F10' },
      { name: 'ذهب إيطالي', hex: '#B8860B' },
      { name: 'بريق ذهبي', hex: '#D4AF37' },
      { name: 'شمبانيا ناعم', hex: '#F5E6C8' },
    ],
    cardHeaderBg: 'from-[#0A0A0C] via-[#151518] to-[#0D0D10]',
    sealClass: 'wax-seal-gold',
    envelopeFlapColor: '#121214',
    envelopeBodyColor: '#18181C',
    sampleCouple: 'عمر شريف & سلمى طارق',
    atmosphereTag: 'سهرات ليلية وأضواء درامية',
  },
  {
    name: 'Minimal White',
    nameAr: 'الأبيض الهادئ النقي',
    slug: 'minimal-white',
    demoUrl: '/invitation/wedding/ahmed-sara-minimal-white',
    badge: 'بساطة أوروبية 🕊️',
    description:
      'بساطة راقية تناسب عشاق الهدوء والفخامة غير المتكلفة بحواف ناعمة وظلال دافئة.',
    features: ['تصميم مريح للعين', 'خط كوفي حديث', 'سريع جداً في الفتح'],
    icon: Feather,
    musicVibe: 'سيلو وكمان هادئ نقي 🕊️',
    fontName: 'خط كوفي حديث نقي',
    accentColor: '#8C8C8C',
    primaryColor: '#2B2B2B',
    palette: [
      { name: 'أبيض لؤلؤي', hex: '#FFFFFF' },
      { name: 'فحمي ناعم', hex: '#2B2B2B' },
      { name: 'رمادي هادئ', hex: '#8C8C8C' },
      { name: 'عاجي أوروبي', hex: '#E0D7CE' },
    ],
    cardHeaderBg: 'from-[#FFFFFF] via-[#FAF8F5] to-[#F1ECE3]',
    sealClass: 'wax-seal-white',
    envelopeFlapColor: '#EFEAE1',
    envelopeBodyColor: '#F5F1E9',
    sampleCouple: 'فرحتنا بحضوركم تكتمل',
    atmosphereTag: 'فخامة هادئة بدون تكلف',
  },
  {
    name: 'Romantic Floral',
    nameAr: 'الزهري الرومانسي',
    slug: 'romantic-floral',
    demoUrl: '/invitation/wedding/ahmed-sara-romantic-floral',
    badge: 'رومانسي مبهج 🌸',
    description:
      'ألوان رقيقة مستوحاة من بتلات الورد الطبيعي، مخصصة للأفراح النهارية والمفتوحة Open-Air.',
    features: ['ألوان باستيل ناعمة', 'زخارف ورود مائية', 'ممتاز للأفراح المفتوحة'],
    icon: Flower2,
    musicVibe: 'ألحان قيثارة وبتلات ورد 🌸',
    fontName: 'خط كاليغرافي شاعري',
    accentColor: '#E8CCD7',
    primaryColor: '#9C5162',
    palette: [
      { name: 'وردي رومانسي', hex: '#9C5162' },
      { name: 'بتلات ناعمة', hex: '#C48B9F' },
      { name: 'باستيل زهري', hex: '#E8CCD7' },
      { name: 'سحاب وردي', hex: '#FFF8F9' },
    ],
    cardHeaderBg: 'from-[#FFF0F4] via-[#FCE4EC] to-[#F8D2DC]',
    sealClass: 'wax-seal-floral',
    envelopeFlapColor: '#ECD2DC',
    envelopeBodyColor: '#F6E1E9',
    sampleCouple: 'نور & يوسف — حديقة الزهور',
    atmosphereTag: 'أفراح نهارية وأماكن مفتوحة',
  },
  {
    name: 'Egyptian Oriental',
    nameAr: 'الشرقي التراثي الأصيل',
    slug: 'egyptian-oriental',
    demoUrl: '/invitation/wedding/ahmed-sara-egyptian-oriental',
    badge: 'أصالة مصرية 📜',
    description:
      'طابع مصري تراثي يجمع بين الزخارف الهندسية الإسلامية وأصالة تقاليد الفرح المصري.',
    features: ['زخارف أرابيسك هندسية', 'طابع كتب الكتاب التاريخي', 'خط كوفي أصيل'],
    icon: Scroll,
    musicVibe: 'تقاسيم عود وقانون مصري 🪕',
    fontName: 'خط كوفي أصيل وتاريخي',
    accentColor: '#C69214',
    primaryColor: '#1A365D',
    palette: [
      { name: 'أزرق ملكي', hex: '#1A365D' },
      { name: 'ذهب أرابيسك', hex: '#C69214' },
      { name: 'خشب شرقي', hex: '#8B4513' },
      { name: 'مخطوطة عتيقة', hex: '#FBF8F1' },
    ],
    cardHeaderBg: 'from-[#0F2238] via-[#1A365D] to-[#0A1624]',
    sealClass: 'wax-seal-oriental',
    envelopeFlapColor: '#142C4C',
    envelopeBodyColor: '#1C3E69',
    sampleCouple: 'عقد قران مبارك — مسجد الشرطة',
    atmosphereTag: 'كتب الكتاب والمناسبات التاريخية',
  },
  {
    name: 'Emerald Palace',
    nameAr: 'الزمردي وقصر الرخام',
    slug: 'emerald-palace',
    demoUrl: '/invitation/wedding/ahmed-sara-emerald-palace',
    badge: 'فخامة القصور 🏛️',
    description:
      'طابع ملكي استثنائي يجمع بين الأخضر الزمردي العميق، عروق الرخام الإيطالي، وبوابات القصر المزدوجة.',
    features: ['بوابات القصر المزدوجة Gatefold', 'خلفية رخام كرارا فاخرة', 'تدرجات الزمرد والذهب الملكي'],
    icon: Crown,
    musicVibe: 'أجراس القصر والهارب الإمبراطوري 🏛️',
    fontName: 'خط ديواني جلي فخم',
    accentColor: '#D4AF37',
    primaryColor: '#0C4A34',
    palette: [
      { name: 'زمردي ملكي', hex: '#0C4A34' },
      { name: 'ذهب إمبراطوري', hex: '#D4AF37' },
      { name: 'رخام كرارا', hex: '#F7FBF9' },
      { name: 'غابات عميقة', hex: '#06291D' },
    ],
    cardHeaderBg: 'from-[#041A12] via-[#0C4A34] to-[#03150E]',
    sealClass: 'wax-seal-emerald',
    envelopeFlapColor: '#06291D',
    envelopeBodyColor: '#093B2A',
    sampleCouple: 'زياد خليل & فريدة المنشاوي',
    atmosphereTag: 'قصور الأفراح والفلل الخاصة الفاخرة',
  },
];

const resolveThemeEnvelopePalette = (slug: ThemeSlug) => {
  switch (slug) {
    case 'elegant-gold':
      return {
        envelopeBody: '#131317',
        envelopeBodyGradient: 'linear-gradient(145deg, #1A1A22 0%, #121216 55%, #0B0B0E 100%)',
        envelopeBorder: '#D4AF37',
        flapColor: '#1A1A20',
        flapBorder: '#D4AF37',
        flapLiningBg: 'linear-gradient(135deg, #222018 0%, #151512 100%)',
        sealBg: 'radial-gradient(circle at 35% 35%, #FFF0B8 0%, #E6C25E 30%, #B88E28 70%, #7D5D0D 100%)',
        sealBorder: '#FFE28A',
        sealShadow: '0 8px 20px rgba(0,0,0,0.8), 0 0 15px rgba(212,175,55,0.6)',
        sealIconColor: '#261C02',
        ribbonBg: 'linear-gradient(180deg, #D4AF37 0%, #997A15 100%)',
      };
    case 'royal-burgundy':
      return {
        envelopeBody: '#54081B',
        envelopeBodyGradient: 'linear-gradient(145deg, #6E0D25 0%, #500619 55%, #35030F 100%)',
        envelopeBorder: '#D4AF37',
        flapColor: '#630B21',
        flapBorder: '#E5C05E',
        flapLiningBg: 'linear-gradient(135deg, #38030F 0%, #1F0108 100%)',
        sealBg: 'radial-gradient(circle at 35% 35%, #B5183F 0%, #800A25 50%, #4D0313 100%)',
        sealBorder: '#F5D77F',
        sealShadow: '0 8px 20px rgba(0,0,0,0.6), 0 0 15px rgba(212,175,55,0.5)',
        sealIconColor: '#FDF3D6',
        ribbonBg: 'linear-gradient(180deg, #8C0B2A 0%, #540619 100%)',
      };
    case 'minimal-white':
      return {
        envelopeBody: '#F7F3EB',
        envelopeBodyGradient: 'linear-gradient(145deg, #FFFFFF 0%, #F5F0E6 60%, #EAE2D2 100%)',
        envelopeBorder: '#D4AF37',
        flapColor: '#F5EFE4',
        flapBorder: '#D4AF37',
        flapLiningBg: 'linear-gradient(135deg, #FAF7F2 0%, #E8DFD0 100%)',
        sealBg: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #F2EADB 45%, #C8B99D 100%)',
        sealBorder: '#D4AF37',
        sealShadow: '0 6px 16px rgba(0,0,0,0.2), 0 0 12px rgba(212,175,55,0.3)',
        sealIconColor: '#7A622A',
        ribbonBg: 'linear-gradient(180deg, #D4AF37 0%, #A8862A 100%)',
      };
    case 'romantic-floral':
      return {
        envelopeBody: '#682637',
        envelopeBodyGradient: 'linear-gradient(145deg, #843247 0%, #682637 55%, #461421 100%)',
        envelopeBorder: '#F5C6D6',
        flapColor: '#762B3F',
        flapBorder: '#F5C6D6',
        flapLiningBg: 'linear-gradient(135deg, #4A1523 0%, #2D0913 100%)',
        sealBg: 'radial-gradient(circle at 35% 35%, #FADCE6 0%, #C96883 45%, #7D2840 100%)',
        sealBorder: '#FFEAF2',
        sealShadow: '0 8px 20px rgba(0,0,0,0.5), 0 0 15px rgba(245,198,214,0.5)',
        sealIconColor: '#FFFFFF',
        ribbonBg: 'linear-gradient(180deg, #C96883 0%, #852C43 100%)',
      };
    case 'emerald-palace':
      return {
        envelopeBody: '#0D3528',
        envelopeBodyGradient: 'linear-gradient(145deg, #134B39 0%, #0D3528 55%, #071F17 100%)',
        envelopeBorder: '#D4AF37',
        flapColor: '#103F30',
        flapBorder: '#D4AF37',
        flapLiningBg: 'linear-gradient(135deg, #1C5542 0%, #0A291E 100%)',
        sealBg: 'radial-gradient(circle at 35% 35%, #FFE28A 0%, #D4AF37 50%, #8C6F18 100%)',
        sealBorder: '#FFF0B8',
        sealShadow: '0 8px 20px rgba(0,0,0,0.6), 0 0 15px rgba(212,175,55,0.6)',
        sealIconColor: '#0E382B',
        ribbonBg: 'linear-gradient(180deg, #D4AF37 0%, #8C6F18 100%)',
      };
    case 'egyptian-oriental':
    default:
      return {
        envelopeBody: '#1A365D',
        envelopeBodyGradient: 'linear-gradient(145deg, #244677 0%, #173258 55%, #0E203B 100%)',
        envelopeBorder: '#C69214',
        flapColor: '#1E3E6B',
        flapBorder: '#C69214',
        flapLiningBg: 'linear-gradient(135deg, #2C4E7C 0%, #112642 100%)',
        sealBg: 'radial-gradient(circle at 35% 35%, #F7E4A8 0%, #C69214 50%, #7E5B06 100%)',
        sealBorder: '#FFEBB0',
        sealShadow: '0 8px 20px rgba(0,0,0,0.6), 0 0 15px rgba(198,146,20,0.5)',
        sealIconColor: '#10223B',
        ribbonBg: 'linear-gradient(180deg, #C69214 0%, #7E5B06 100%)',
      };
  }
};

export function ThemesGallery({ whatsappNumber = '201019262075' }: ThemesGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | ThemeSlug>('all');
  const [playingTheme, setPlayingTheme] = useState<ThemeSlug | null>(null);
  const [previewTheme, setPreviewTheme] = useState<ThemeItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEnvelopeOpen, setIsModalEnvelopeOpen] = useState(false);

  const modalPalette = previewTheme ? resolveThemeEnvelopePalette(previewTheme.slug) : null;
  const isModalDark = previewTheme?.slug === 'elegant-gold';

  // Play audio synthesizer motif for a specific theme
  const handlePlayMusic = (slug: ThemeSlug, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (playingTheme === slug) {
      setPlayingTheme(null);
      return;
    }

    setPlayingTheme(slug);
    playThemeMelody(slug, () => {
      setPlayingTheme((current) => (current === slug ? null : current));
    });
  };

  // Open interactive envelope modal
  const openEnvelopeModal = (theme: ThemeItem) => {
    setPreviewTheme(theme);
    setIsModalEnvelopeOpen(false);
    setIsModalOpen(true);
  };

  const handleModalSealClick = () => {
    setIsModalEnvelopeOpen(true);
    if (previewTheme) {
      handlePlayMusic(previewTheme.slug);
      try {
        confetti({
          particleCount: 50,
          spread: 65,
          origin: { y: 0.6 },
          colors: [
            previewTheme.accentColor,
            previewTheme.primaryColor,
            '#FFFFFF',
            '#D4AF37',
          ],
        });
      } catch {}
    }
  };

  const filteredThemes =
    activeFilter === 'all'
      ? THEMES_DATA
      : THEMES_DATA.filter((t) => t.slug === activeFilter);

  return (
    <section
      id="themes"
      className="py-24 lg:py-32 bg-[#FAF7F2] relative overflow-hidden selection:bg-rose-100 selection:text-[#720925]"
    >
      {/* Ambient background glows */}
      <div className="absolute top-10 right-0 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-100/20 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading & Copy */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-[#720925] border border-rose-200/90 shadow-xs text-xs font-bold font-cairo">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>٦ تجارب بصرية وموسيقية فاخرة جاهزة للتخصيص</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight font-cairo leading-snug">
            اختار الثيم اللي يليق بذوقكم <br />
            <span className="bg-gradient-to-r from-[#720925] via-amber-700 to-[#720925] bg-clip-text text-transparent">
              وإحنا نصممه مخصوص بأسماءكم
            </span>
          </h2>

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            كل ثيم مش مجرد لون، ده تجربة بصرية كاملة تشمل أنماط فتح الظرف التفاعلي (بوابة القصر، ختم الشمع، السحاب، البتلات)، الخطوط، وباترنات الرخام والداماسك الفاخرة.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#720925] text-white shadow-md shadow-rose-950/20 scale-105'
                : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200 shadow-xs'
            }`}
          >
            جميع الثيمات (٦)
          </button>
          {THEMES_DATA.map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => setActiveFilter(t.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeFilter === t.slug
                  ? 'bg-[#720925] text-white shadow-md shadow-rose-950/20 scale-105'
                  : 'bg-white/80 hover:bg-white text-stone-700 border border-stone-200 shadow-xs'
              }`}
            >
              <span>{t.badge.split(' ').slice(0, 1).join(' ')}</span>
              <span>{t.nameAr}</span>
            </button>
          ))}
        </div>

        {/* Themes Showcase Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filteredThemes.map((theme) => {
            const isPlaying = playingTheme === theme.slug;
            const isMinimal = theme.slug === 'minimal-white';
            const isFloral = theme.slug === 'romantic-floral';
            const isDark = theme.slug === 'elegant-gold';
            const isBurgundy = theme.slug === 'royal-burgundy';
            const isOriental = theme.slug === 'egyptian-oriental';
            const isEmerald = theme.slug === 'emerald-palace';
            const themePalette = resolveThemeEnvelopePalette(theme.slug);

            const whatsappOrderUrl = getWhatsAppUrl(
              whatsappNumber,
              createInquiryWhatsAppMessage(theme.nameAr)
            );

            return (
              <div
                key={theme.slug}
                className="group rounded-3xl bg-white border border-stone-200 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 relative"
              >
                <div>
                  {/* Visual Envelope & Invitation Preview Header */}
                  <div
                    className={`h-56 bg-gradient-to-br ${theme.cardHeaderBg} relative overflow-hidden p-5 flex flex-col justify-between text-white border-b ${
                      isMinimal
                        ? 'border-stone-200 text-stone-900'
                        : isFloral
                        ? 'border-pink-200 text-[#4A202A]'
                        : 'border-white/10 text-white'
                    }`}
                  >
                    {/* Background Pattern / Watermark Details */}
                    {isBurgundy && (
                      <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                          backgroundImage:
                            'radial-gradient(#d4af37 1px, transparent 1px)',
                          backgroundSize: '16px 16px',
                        }}
                      />
                    )}
                    {isDark && (
                      <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                          backgroundImage:
                            'radial-gradient(#d4af37 1px, transparent 1px)',
                          backgroundSize: '20px 20px',
                        }}
                      />
                    )}
                    {isFloral && (
                      <div
                        className="absolute inset-0 opacity-25 pointer-events-none"
                        style={{
                          backgroundImage:
                            'radial-gradient(#c48b9f 1.5px, transparent 1.5px)',
                          backgroundSize: '22px 22px',
                        }}
                      />
                    )}
                    {isOriental && (
                      <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(45deg, #c69214 0, #c69214 1px, transparent 0, transparent 16px)',
                        }}
                      />
                    )}
                    {isEmerald && (
                      <div className="absolute inset-0 opacity-20 pointer-events-none pattern-marble" />
                    )}

                    {/* Top Row: Badge & Audio Preview Button */}
                    <div className="flex items-center justify-between relative z-10">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-xs border ${
                          isMinimal
                            ? 'bg-stone-900/10 text-stone-900 border-stone-300'
                            : isFloral
                            ? 'bg-white/70 text-[#9C5162] border-pink-300/80'
                            : 'bg-white/15 text-white border-white/20'
                        }`}
                      >
                        {theme.badge}
                      </span>

                      {/* Interactive Music Button ("زي المزيكة") */}
                      <button
                        type="button"
                        onClick={(e) => handlePlayMusic(theme.slug, e)}
                        title="اسمع النغمة الموسيقية للثيم"
                        className={`group/music inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shadow-xs cursor-pointer ${
                          isPlaying
                            ? 'bg-amber-400 text-stone-950 scale-105 shadow-amber-400/30'
                            : isMinimal
                            ? 'bg-white/90 text-stone-800 border border-stone-300 hover:bg-stone-100'
                            : isFloral
                            ? 'bg-white/80 text-[#9C5162] border border-pink-200 hover:bg-white'
                            : 'bg-black/30 text-amber-200 border border-amber-400/30 hover:bg-black/50'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <div className="flex items-center gap-0.5 h-3">
                              <span className="w-0.5 bg-current rounded-full sound-bar-1" />
                              <span className="w-0.5 bg-current rounded-full sound-bar-2" />
                              <span className="w-0.5 bg-current rounded-full sound-bar-3" />
                              <span className="w-0.5 bg-current rounded-full sound-bar-4" />
                            </div>
                            <span className="text-[10px]">يعزف الآن...</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-amber-500 group-hover/music:scale-110 transition-transform" />
                            <span>اسمع اللحن 🎵</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Central 3D Royal Envelope Miniature (Matches EnvelopeScreen) */}
                    <div
                      onClick={() => openEnvelopeModal(theme)}
                      className="relative my-auto cursor-pointer group/seal flex items-center justify-center py-0.5"
                      title="اضغط لمعاينة الظرف والختم الملكي"
                    >
                      {/* Envelope Silhouette Container */}
                      <div
                        className="w-52 sm:w-60 h-22 rounded-xl relative shadow-lg flex items-center justify-center transition-all duration-300 group-hover/seal:scale-105 select-none"
                        style={{ perspective: '800px' }}
                      >
                        {/* 1. Envelope Back Wall */}
                        <div
                          className="absolute inset-0 rounded-xl border shadow-xs overflow-hidden"
                          style={{
                            borderColor: themePalette.envelopeBorder,
                            background: themePalette.envelopeBodyGradient,
                          }}
                        />

                        {/* 2. Peeking Inner Card (Inside pocket, peeking out without white gaps) */}
                        <div
                          className="absolute inset-x-3 -top-1.5 h-14 rounded-t-lg shadow-xs flex flex-col items-center justify-start pt-1.5 px-2 border border-b-0 transition-transform duration-300 group-hover/seal:-translate-y-2.5 z-10"
                          style={{
                            backgroundColor: isDark ? '#1C1C22' : '#FFFDF9',
                            borderColor: themePalette.envelopeBorder,
                            color: isDark ? '#F5E6C8' : themePalette.flapColor,
                          }}
                        >
                          <div className="flex items-center gap-1 opacity-90 scale-95">
                            <Crown className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                            <span className="text-[9px] font-bold font-cairo truncate max-w-[145px]">
                              {theme.sampleCouple}
                            </span>
                          </div>
                        </div>

                        {/* 3. Main Envelope Pocket Body with layered triangular folds (Covers card sides) */}
                        <div
                          className="absolute inset-0 rounded-xl border overflow-hidden z-20 pointer-events-none"
                          style={{
                            borderColor: themePalette.envelopeBorder,
                            background: themePalette.envelopeBodyGradient,
                          }}
                        >
                          {/* Corner Filigree Accents */}
                          <div className="absolute top-1 left-1 w-3 h-3 border-t border-l rounded-tl pointer-events-none opacity-80" style={{ borderColor: themePalette.envelopeBorder }} />
                          <div className="absolute top-1 right-1 w-3 h-3 border-t border-r rounded-tr pointer-events-none opacity-80" style={{ borderColor: themePalette.envelopeBorder }} />
                          <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l rounded-bl pointer-events-none opacity-80" style={{ borderColor: themePalette.envelopeBorder }} />
                          <div className="absolute bottom-1 right-1 w-3 h-3 border-b border-r rounded-br pointer-events-none opacity-80" style={{ borderColor: themePalette.envelopeBorder }} />

                          {/* Pocket Triangle Folds */}
                          <div
                            className="absolute inset-x-0 bottom-0 h-14"
                            style={{
                              clipPath: 'polygon(0 100%, 100% 100%, 50% 20%)',
                              background: themePalette.envelopeBodyGradient,
                              filter: 'brightness(0.92)',
                            }}
                          />
                          <div
                            className="absolute inset-y-0 left-0 w-20"
                            style={{
                              clipPath: 'polygon(0 0, 0 100%, 100% 50%)',
                              background: themePalette.envelopeBodyGradient,
                              filter: 'brightness(0.96)',
                            }}
                          />
                          <div
                            className="absolute inset-y-0 right-0 w-20"
                            style={{
                              clipPath: 'polygon(100% 0, 100% 100%, 0 50%)',
                              background: themePalette.envelopeBodyGradient,
                              filter: 'brightness(0.96)',
                            }}
                          />
                        </div>

                        {/* 4. Top Flap with curved royal SVG and gold border (identical to EnvelopeScreen) */}
                        <div
                          className="absolute inset-x-0 top-0 h-13 pointer-events-none z-30 transition-transform duration-300 origin-top group-hover/seal:-rotate-x-12"
                          style={{
                            filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.35))',
                          }}
                        >
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 130" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id={`thumbFlapGrad-${theme.slug}`} x1="0%" y1="0%" x2="50%" y2="100%">
                                <stop offset="0%" stopColor={themePalette.flapColor} />
                                <stop offset="100%" stopColor={themePalette.envelopeBody} />
                              </linearGradient>
                            </defs>
                            <path
                              d="M 1,1 L 299,1 C 299,10 295,16 288,22 L 156,122 Q 150,128 144,122 L 12,22 C 5,16 1,10 1,1 Z"
                              fill={`url(#thumbFlapGrad-${theme.slug})`}
                              stroke={themePalette.flapBorder}
                              strokeWidth="2.5"
                              vectorEffect="non-scaling-stroke"
                            />
                          </svg>
                        </div>

                        {/* 5. 3D Wax Seal Stamp with V-cut Satin Ribbon Tails */}
                        <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-transform duration-300 group-hover/seal:scale-110 active:scale-95">
                          {/* Satin Ribbon Tails */}
                          <div className="absolute top-[75%] left-1/2 -translate-x-1/2 flex items-center justify-center gap-0.5 pointer-events-none -z-10">
                            <div
                              className="w-1.5 h-5 shadow-xs transform -rotate-12 origin-top"
                              style={{
                                background: themePalette.ribbonBg,
                                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
                              }}
                            />
                            <div
                              className="w-1.5 h-5 shadow-xs transform rotate-12 origin-top"
                              style={{
                                background: themePalette.ribbonBg,
                                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
                              }}
                            />
                          </div>

                          {/* Wax Seal Circle */}
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border"
                            style={{
                              background: themePalette.sealBg,
                              borderColor: themePalette.sealBorder,
                              boxShadow: themePalette.sealShadow,
                            }}
                          >
                            <div className="w-6 h-6 rounded-full border border-dashed flex items-center justify-center" style={{ borderColor: `${themePalette.sealBorder}90` }}>
                              {isBurgundy && <Crown className="w-3 h-3 drop-shadow-xs" style={{ color: themePalette.sealIconColor }} />}
                              {isDark && <Sparkles className="w-3 h-3 drop-shadow-xs" style={{ color: themePalette.sealIconColor }} />}
                              {isMinimal && <Feather className="w-3 h-3 drop-shadow-xs" style={{ color: themePalette.sealIconColor }} />}
                              {isFloral && <Heart className="w-3 h-3 drop-shadow-xs fill-current" style={{ color: themePalette.sealIconColor }} />}
                              {isOriental && <Scroll className="w-3.5 h-3.5 drop-shadow-xs" style={{ color: themePalette.sealIconColor }} />}
                              {isEmerald && <Crown className="w-3 h-3 drop-shadow-xs" style={{ color: themePalette.sealIconColor }} />}
                            </div>
                          </div>
                        </div>

                        {/* Quick Preview Hint */}
                        <span className="absolute bottom-1 right-2 text-[8px] font-bold text-amber-200/90 z-40 flex items-center gap-0.5 drop-shadow-xs pointer-events-none">
                          <Maximize2 className="w-2.5 h-2.5" />
                          <span>معاينة الظرف</span>
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Theme Arabic & English Title */}
                    <div className="relative z-10 flex items-end justify-between">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black font-cairo tracking-tight">
                          {theme.nameAr}
                        </h3>
                        <p
                          className={`text-[11px] font-mono ${
                            isMinimal
                              ? 'text-stone-600'
                              : isFloral
                              ? 'text-[#7D3F50]'
                              : 'text-stone-300'
                          }`}
                        >
                          {theme.name}
                        </p>
                      </div>

                      {/* Music vibe badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isMinimal
                            ? 'bg-stone-200 text-stone-800'
                            : isFloral
                            ? 'bg-pink-100/90 text-[#9C5162]'
                            : 'bg-black/40 text-amber-200'
                        }`}
                      >
                        {theme.musicVibe.split(' ').slice(0, 2).join(' ')}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    {/* Typography & Aesthetic Identity pill */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#720925]" />
                        {theme.fontName}
                      </span>
                      <span className="text-[11px] text-stone-500 font-medium">
                        {theme.atmosphereTag}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal min-h-[44px]">
                      {theme.description}
                    </p>

                    {/* 4-Color Swatches Palette Ribbon ("جمال الألوان") */}
                    <div className="pt-2 border-t border-stone-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-stone-500">
                          تناغم باليتة الألوان:
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {theme.palette.map((p) => p.name).join(' • ')}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-xl bg-stone-50 border border-stone-200/60">
                        {theme.palette.map((color, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center gap-1 text-center"
                            title={`${color.name}: ${color.hex}`}
                          >
                            <div
                              className="w-full h-6 rounded-lg border border-stone-300/70 shadow-2xs transition-transform hover:scale-105"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-[9px] font-mono text-stone-500 truncate w-full">
                              {color.hex}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bullet features */}
                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      {theme.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs font-semibold text-stone-700"
                        >
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: `${theme.primaryColor}15`,
                              color: theme.primaryColor,
                            }}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons (Direct Studio Create + Live Demo + WhatsApp) */}
                <div className="p-6 pt-0 space-y-2 mt-2">
                  <Link
                    href={`/create?theme=${theme.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95 border border-amber-400 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-stone-950" />
                    <span>صمّم دعوتك بهذا الثيم 🪄</span>
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={theme.demoUrl}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs transition-all active:scale-95 border border-stone-200 shadow-2xs group/btn"
                    >
                      <Eye className="w-4 h-4 text-amber-600 group-hover/btn:scale-110 transition-transform" />
                      <span>معاينة النموذج</span>
                    </Link>

                    <a
                      href={whatsappOrderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl burgundy-gradient-bg text-white font-bold text-xs shadow-md shadow-rose-950/20 hover:opacity-95 transition-all active:scale-95 group/wa"
                    >
                      <MessageCircle className="w-4 h-4 fill-current group-wa:scale-110 transition-transform" />
                      <span>واتساب</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Reassurance Banner */}
        <div className="mt-16 max-w-4xl mx-auto rounded-3xl bg-white border border-stone-200/90 p-6 sm:p-8 shadow-sm text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-amber-700 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>حرية كاملة في تخصيص كل تفصيلة</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-cairo">
            جاهز لتصميم دعوة فرحتك بنفسك الآن؟
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            استوديو فرحنا يتيح لك تعديل الأسماء، المواعيد، مكان القاعة، الموسيقى، ورسالة الفرح مع معاينة مباشرة وحية لهاتفك خطوة بخطوة 💍
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4.5 h-4.5 text-stone-950" />
              <span>ابدأ تصميم دعوتك الآن في الاستوديو 🪄</span>
            </Link>

            <a
              href={getWhatsAppUrl(
                whatsappNumber,
                'السلام عليكم، حابب أستفسر عن تصميم ثيم مخصص بالكامل لفرحنا بألوان خاصة ❤️'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold text-xs sm:text-sm shadow-xs transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current text-emerald-600" />
              <span>طلب ثيم خاص عبر واتساب</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Envelope Quick Preview Modal */}
      {isModalOpen && previewTheme && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 text-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors cursor-pointer"
              aria-label="إغلاق المعاينة"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Heading */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-700">
                {previewTheme.badge}
              </span>
              <h3 className="text-2xl font-black text-stone-900 font-cairo">
                {previewTheme.nameAr}
              </h3>
              <p className="text-xs text-stone-500 font-amiri font-bold">
                {previewTheme.musicVibe}
              </p>
            </div>

            {/* Interactive Simulated Royal Envelope Container (Matches EnvelopeScreen) */}
            <div
              className="relative mx-auto w-72 sm:w-84 h-48 sm:h-52 rounded-2xl flex items-center justify-center select-none"
              style={{ perspective: '1200px' }}
            >
              {/* Golden Glow Emitter */}
              <div
                className={`absolute inset-x-6 top-4 h-28 rounded-full blur-xl pointer-events-none z-10 transition-opacity duration-700 ${
                  isModalEnvelopeOpen ? 'opacity-80' : 'opacity-0'
                }`}
                style={{
                  background: 'radial-gradient(circle, rgba(255, 230, 140, 0.7) 0%, rgba(212, 175, 55, 0.35) 60%, transparent 100%)',
                }}
              />

              {/* 1. Inner Luxury Card (Slides UP out of the pocket) */}
              <div
                className={`absolute inset-x-3 bottom-2 h-40 sm:h-44 rounded-xl transition-all z-25 p-3 flex flex-col justify-between text-center border-2 shadow-2xl ${
                  isModalEnvelopeOpen
                    ? '-translate-y-20 sm:-translate-y-24 scale-[1.02] shadow-[0_20px_45px_rgba(0,0,0,0.5),0_0_30px_rgba(212,175,55,0.4)]'
                    : 'translate-y-0 opacity-95'
                }`}
                style={{
                  backgroundColor: isModalDark ? '#1C1C22' : '#FFFDF8',
                  borderColor: modalPalette?.envelopeBorder || '#D4AF37',
                  transitionDuration: '700ms',
                  transitionTimingFunction: 'cubic-bezier(0.2, 0.9, 0.3, 1)',
                }}
              >
                <div>
                  <span className="text-[10px] text-amber-800 font-amiri font-bold block">
                    ﷽
                  </span>
                  <span className="text-[9px] text-amber-900 font-amiri font-bold block opacity-85">
                    «وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا»
                  </span>
                </div>

                <div className="py-1 border-y my-auto" style={{ borderColor: `${modalPalette?.envelopeBorder || '#D4AF37'}50` }}>
                  <p className="text-sm sm:text-base font-black font-cairo" style={{ color: modalPalette?.flapColor || '#720925' }}>
                    {previewTheme.sampleCouple}
                  </p>
                  <p className="text-[10px] text-stone-600 font-amiri font-bold mt-0.5">
                    نتشرف بحضوركم ومشاركتنا فرحة العمر ❤️
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-stone-500 font-cairo">
                  <span>📅</span>
                  <span>الجمعة، 15 أكتوبر 2026</span>
                </div>
              </div>

              {/* 2. Main Envelope Pocket Body */}
              <div
                className="absolute inset-0 rounded-2xl border-2 shadow-2xl overflow-hidden z-30 pointer-events-none transition-all"
                style={{
                  borderColor: modalPalette?.envelopeBorder || '#D4AF37',
                  background: modalPalette?.envelopeBodyGradient || 'linear-gradient(145deg, #6E0D25 0%, #500619 55%, #35030F 100%)',
                  boxShadow: isModalDark
                    ? '0 20px 45px rgba(0,0,0,0.85), inset 0 1px 2px rgba(255,255,255,0.1)'
                    : '0 20px 40px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.6)',
                }}
              >
                {/* Corner Filigrees */}
                <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 rounded-tl pointer-events-none opacity-80" style={{ borderColor: modalPalette?.envelopeBorder || '#D4AF37' }} />
                <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 rounded-tr pointer-events-none opacity-80" style={{ borderColor: modalPalette?.envelopeBorder || '#D4AF37' }} />
                <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 rounded-bl pointer-events-none opacity-80" style={{ borderColor: modalPalette?.envelopeBorder || '#D4AF37' }} />
                <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 rounded-br pointer-events-none opacity-80" style={{ borderColor: modalPalette?.envelopeBorder || '#D4AF37' }} />

                {/* Pocket Triangle Folds */}
                <div
                  className="absolute inset-x-0 bottom-0 h-28 sm:h-32"
                  style={{
                    clipPath: 'polygon(0 100%, 100% 100%, 50% 22%)',
                    background: modalPalette?.envelopeBodyGradient || 'linear-gradient(145deg, #6E0D25 0%, #500619 55%, #35030F 100%)',
                    filter: 'brightness(0.92)',
                  }}
                />
                <div
                  className="absolute inset-y-0 left-0 w-28 sm:w-34"
                  style={{
                    clipPath: 'polygon(0 0, 0 100%, 100% 50%)',
                    background: modalPalette?.envelopeBodyGradient || 'linear-gradient(145deg, #6E0D25 0%, #500619 55%, #35030F 100%)',
                    filter: 'brightness(0.96)',
                  }}
                />
                <div
                  className="absolute inset-y-0 right-0 w-28 sm:w-34"
                  style={{
                    clipPath: 'polygon(100% 0, 100% 100%, 0 50%)',
                    background: modalPalette?.envelopeBodyGradient || 'linear-gradient(145deg, #6E0D25 0%, #500619 55%, #35030F 100%)',
                    filter: 'brightness(0.96)',
                  }}
                />
              </div>

              {/* 3. Envelope Top Flap with 3D Flip (Matching EnvelopeScreen) */}
              <div
                className="absolute inset-x-0 top-0 h-26 sm:h-28 pointer-events-none"
                style={{
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                  WebkitTransformStyle: 'preserve-3d',
                  transform: isModalEnvelopeOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
                  transition: 'transform 750ms cubic-bezier(0.25, 1, 0.35, 1)',
                  zIndex: isModalEnvelopeOpen ? 20 : 40,
                }}
              >
                {/* Front of Flap */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'translateZ(1px)',
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.35))',
                  }}
                >
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 130" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`modalFlapGrad-${previewTheme.slug}`} x1="0%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor={modalPalette?.flapColor || '#630B21'} />
                        <stop offset="100%" stopColor={modalPalette?.envelopeBody || '#54081B'} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 1,1 L 299,1 C 299,10 295,16 288,22 L 156,122 Q 150,128 144,122 L 12,22 C 5,16 1,10 1,1 Z"
                      fill={`url(#modalFlapGrad-${previewTheme.slug})`}
                      stroke={modalPalette?.flapBorder || '#D4AF37'}
                      strokeWidth="2.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>

                {/* Back of Flap (Revealed pointing UPWARDS when open) */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg) translateZ(1px)',
                    filter: 'drop-shadow(0 -4px 6px rgba(0,0,0,0.25))',
                  }}
                >
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 130" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`modalFlapBackGrad-${previewTheme.slug}`} x1="0%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor={modalPalette?.flapColor || '#630B21'} />
                        <stop offset="100%" stopColor={modalPalette?.envelopeBody || '#54081B'} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 1,1 L 299,1 C 299,10 295,16 288,22 L 156,122 Q 150,128 144,122 L 12,22 C 5,16 1,10 1,1 Z"
                      fill={`url(#modalFlapBackGrad-${previewTheme.slug})`}
                      stroke={modalPalette?.flapBorder || '#D4AF37'}
                      strokeWidth="2.5"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d="M 16,5 L 284,5 C 284,12 280,18 274,23 L 155,114 Q 150,118 145,114 L 26,23 C 20,18 16,12 16,5 Z"
                      fill="none"
                      stroke={modalPalette?.flapBorder || '#D4AF37'}
                      strokeWidth="1.2"
                      strokeDasharray="4 3"
                      opacity="0.65"
                    />
                  </svg>
                </div>
              </div>

              {/* 4. Luxury 3D Wax Seal Stamp with Ribbon Tails */}
              <div
                className={`absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 cursor-pointer transition-all duration-300 ${
                  isModalEnvelopeOpen
                    ? 'opacity-0 scale-50 -translate-y-6 pointer-events-none'
                    : 'opacity-100 scale-100 hover:scale-105 active:scale-95 animate-seal-glow'
                }`}
                onClick={handleModalSealClick}
              >
                {/* Ribbon Tails */}
                <div className="absolute top-[80%] left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 pointer-events-none -z-10">
                  <div
                    className="w-2.5 h-8 shadow-xs transform -rotate-12 origin-top"
                    style={{
                      background: modalPalette?.ribbonBg || '#D4AF37',
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
                    }}
                  />
                  <div
                    className="w-2.5 h-8 shadow-xs transform rotate-12 origin-top"
                    style={{
                      background: modalPalette?.ribbonBg || '#D4AF37',
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
                    }}
                  />
                </div>

                {/* Wax Seal Circle Stamp */}
                <div
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-full flex flex-col items-center justify-center shadow-2xl border-2"
                  style={{
                    background: modalPalette?.sealBg || '#B5183F',
                    borderColor: modalPalette?.sealBorder || '#F5D77F',
                    boxShadow: modalPalette?.sealShadow,
                  }}
                >
                  <div className="flex flex-col items-center justify-center space-y-0.5">
                    {previewTheme.slug === 'royal-burgundy' && <Crown className="w-5 h-5 drop-shadow-sm" style={{ color: modalPalette?.sealIconColor }} />}
                    {previewTheme.slug === 'elegant-gold' && <Sparkles className="w-5 h-5 drop-shadow-sm" style={{ color: modalPalette?.sealIconColor }} />}
                    {previewTheme.slug === 'minimal-white' && <Feather className="w-5 h-5 drop-shadow-sm" style={{ color: modalPalette?.sealIconColor }} />}
                    {previewTheme.slug === 'romantic-floral' && <Heart className="w-5 h-5 drop-shadow-sm fill-current" style={{ color: modalPalette?.sealIconColor }} />}
                    {previewTheme.slug === 'egyptian-oriental' && <Scroll className="w-5 h-5 drop-shadow-sm" style={{ color: modalPalette?.sealIconColor }} />}
                    {previewTheme.slug === 'emerald-palace' && <Crown className="w-5 h-5 drop-shadow-sm" style={{ color: modalPalette?.sealIconColor }} />}
                    <span className="text-[9px] font-black font-cairo" style={{ color: modalPalette?.sealIconColor }}>
                      فرحنا
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Audio & Action Prompts */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleModalSealClick()}
                  className="relative group overflow-hidden px-7 py-3 rounded-full text-xs font-black bg-gradient-to-r from-[#D4AF37] via-[#FFF1B8] to-[#BF953F] text-stone-950 border border-amber-300/80 shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-gold-shimmer pointer-events-none" />
                  {isModalEnvelopeOpen ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                      <span>إعادة تشغيل النغمة ↺</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                      <span>اضغط لفض الختم وفتح الظرف 💌</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2.5 pt-2">
                <Link
                  href={`/create?theme=${previewTheme.slug}`}
                  onClick={() => setIsModalOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95 border border-amber-400 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>صمّم دعوتك بهذا الثيم الآن 🪄</span>
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={previewTheme.demoUrl}
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs transition-colors"
                  >
                    <Eye className="w-4 h-4 text-amber-600" />
                    <span>معاينة الدعوة</span>
                  </Link>

                  <a
                    href={getWhatsAppUrl(
                      whatsappNumber,
                      createInquiryWhatsAppMessage(previewTheme.nameAr)
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl burgundy-gradient-bg text-white font-bold text-xs shadow-md hover:opacity-95 transition-opacity"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>واتساب</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
