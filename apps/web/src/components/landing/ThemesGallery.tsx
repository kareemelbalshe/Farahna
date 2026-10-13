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
  | 'egyptian-oriental';

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
];

export function ThemesGallery({ whatsappNumber = '201019262075' }: ThemesGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | ThemeSlug>('all');
  const [playingTheme, setPlayingTheme] = useState<ThemeSlug | null>(null);
  const [previewTheme, setPreviewTheme] = useState<ThemeItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEnvelopeOpen, setIsModalEnvelopeOpen] = useState(false);

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
            <span>٥ تجارب بصرية وموسيقية فاخرة جاهزة للتخصيص</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight font-cairo leading-snug">
            اختار الثيم اللي يليق بذوقكم <br />
            <span className="bg-gradient-to-r from-[#720925] via-amber-700 to-[#720925] bg-clip-text text-transparent">
              وإحنا نصممه مخصوص بأسماءكم
            </span>
          </h2>

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            كل ثيم مش مجرد لون، ده تجربة بصرية كاملة تشمل الظرف التفاعلي، الخطوط، الأزرار، وحركات الظهور.
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
            جميع الثيمات (٥)
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
                    className={`h-52 bg-gradient-to-br ${theme.cardHeaderBg} relative overflow-hidden p-5 flex flex-col justify-between text-white border-b ${
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

                    {/* Central 3D Interactive Envelope Flap & Wax Seal Miniature */}
                    <div
                      onClick={() => openEnvelopeModal(theme)}
                      className="relative my-auto cursor-pointer group/seal flex items-center justify-center"
                      title="اضغط لمعاينة الظرف والختم"
                    >
                      {/* Envelope Silhouette Container */}
                      <div
                        className="w-48 sm:w-56 h-20 rounded-xl relative shadow-md flex items-center justify-center transition-transform group-hover/seal:scale-105 overflow-hidden"
                        style={{
                          backgroundColor: theme.envelopeBodyColor,
                          border: isMinimal
                            ? '1px solid #DCD4C7'
                            : '1px solid rgba(255,255,255,0.2)',
                        }}
                      >
                        {/* Peeking Letter Card Inside */}
                        <div
                          className="absolute -top-1 w-40 sm:w-48 h-8 rounded-t-md shadow-xs flex items-center justify-center px-2 transition-transform group-hover/seal:-translate-y-2"
                          style={{
                            backgroundColor: isDark ? '#1C1C20' : '#FFFFFF',
                            color: isDark ? '#F5E6C8' : '#2D1B1E',
                            border: '1px solid rgba(212,175,55,0.4)',
                          }}
                        >
                          <span className="text-[10px] font-bold font-cairo truncate">
                            {theme.sampleCouple}
                          </span>
                        </div>

                        {/* Top Envelope Flap Triangle */}
                        <div
                          className="absolute inset-x-0 top-0 h-10 transition-all origin-top"
                          style={{
                            backgroundColor: theme.envelopeFlapColor,
                            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                          }}
                        />

                        {/* 3D Wax Seal Badge */}
                        <div
                          className={`relative z-10 w-9 h-9 rounded-full ${theme.sealClass} wax-seal-3d flex items-center justify-center transition-transform group-hover/seal:scale-115 active:scale-90`}
                        >
                          <div className="w-7 h-7 rounded-full border border-dashed border-amber-300/80 flex items-center justify-center text-amber-200">
                            {isBurgundy && <Crown className="w-3.5 h-3.5" />}
                            {isDark && <Sparkles className="w-3.5 h-3.5" />}
                            {isMinimal && <Feather className="w-3.5 h-3.5 text-stone-700" />}
                            {isFloral && <Heart className="w-3.5 h-3.5 fill-pink-200" />}
                            {isOriental && <Scroll className="w-3.5 h-3.5" />}
                          </div>
                        </div>

                        {/* Quick Preview Hint */}
                        <span className="absolute bottom-1 right-2 text-[8px] font-bold opacity-75 flex items-center gap-0.5">
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

            {/* Interactive Simulated Envelope Container */}
            <div
              className="relative mx-auto w-72 sm:w-80 h-48 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden transition-all duration-500"
              style={{
                backgroundColor: previewTheme.envelopeBodyColor,
                border: '2px solid rgba(212,175,55,0.4)',
              }}
            >
              {/* Envelope Flap Triangles */}
              <div
                className="absolute inset-x-0 top-0 h-28 border-b border-black/10 transition-transform origin-top duration-500"
                style={{
                  backgroundColor: previewTheme.envelopeFlapColor,
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  transform: isModalEnvelopeOpen ? 'rotateX(180deg)' : 'none',
                }}
              />

              {/* Central Wax Seal */}
              <div className="relative z-10">
                <button
                  type="button"
                  onClick={handleModalSealClick}
                  className={`w-20 h-20 rounded-full ${previewTheme.sealClass} wax-seal-3d flex flex-col items-center justify-center text-white cursor-pointer hover:scale-110 active:scale-95 transition-all`}
                  title="اضغط لفتح الظرف"
                >
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-300/80 flex flex-col items-center justify-center text-amber-200">
                    <Heart className="w-5 h-5 fill-amber-300 text-amber-300 animate-pulse" />
                    <span className="text-[10px] font-black tracking-wider mt-0.5">
                      {isModalEnvelopeOpen ? 'مفتوح ✨' : 'افتح'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Peeking Invitation Card when opened */}
              {isModalEnvelopeOpen && (
                <div className="absolute inset-x-4 bottom-3 bg-white p-3 rounded-xl shadow-lg border border-amber-300/40 text-stone-900 animate-fade-in-up">
                  <p className="text-xs font-black text-[#720925] font-cairo">
                    {previewTheme.sampleCouple}
                  </p>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    يسعدنا ويشرفنا حضوركم لتشاركونا أجمل لحظات حياتنا ❤️
                  </p>
                </div>
              )}
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
