export interface PackageFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface PackagePlan {
  id: 'basic' | 'wedding-journey' | 'luxury-vip';
  name: string;
  price: number;
  priceLabel: string;
  icon: string;
  badge: string;
  tagline: string;
  summary: string;
  defaultMultiEvent: boolean;
  colorTheme: string;
  features: PackageFeature[];
}

export type PackageTier = PackagePlan;

export const PACKAGES: PackagePlan[] = [
  {
    id: 'basic',
    name: 'باقة المناسبة الواحدة',
    price: 50,
    priceLabel: '50 ج.م',
    icon: '🌸',
    badge: 'اقتصادية لمناسبة واحدة 🌸',
    tagline: 'مناسبة واحدة رئيسية بتصميم أنيق',
    summary: 'فرح أو خطوبة أو كتب كتاب واحد — تصميم متكامل ومباشر بدون تبويبات أو ألبوم صور',
    defaultMultiEvent: false,
    colorTheme: 'stone',
    features: [
      { text: 'مناسبة واحدة رئيسية (فرح أو خطوبة أو كتب كتاب)', included: true },
      { text: 'تصميم مخصص بأسماء العروسين وصورة الغلاف', included: true },
      { text: 'قوالب كلاسيكية منسقة بألوانها الأصلية', included: true },
      { text: 'خطوط عربية قياسية أنيقة (كايرو وأميري)', included: true },
      { text: 'خريطة تفاعلية وموقع القاعة على Google Maps', included: true },
      { text: 'عداد تنازلي لموعد الحفل ورابط مشاركة واتساب', included: true },
      { text: 'فتح الظرف التفاعلي ثلاثي الأبعاد', included: false },
      { text: 'تبويبات رحلة الفرح الـ 4 برابط واحد', included: false },
      { text: 'تخصيص حر لدرجات الألوان والباترنات الملكية', included: false },
      { text: 'ألبوم صور وجاليري الذكريات VIP', included: false },
      { text: 'قسم ليلة الحنة المخصص للسيدات مع قفل سري', included: false },
    ],
  },
  {
    id: 'wedding-journey',
    name: 'باقة رحلة الفرح الشاملة',
    price: 95,
    priceLabel: '95 ج.م',
    icon: '👑',
    badge: 'الأكثر طلباً والأفضل قيمة 👑',
    tagline: 'كل مناسبات الفرح برابط واحد متكامل',
    summary: 'حتى 4 مناسبات برابط واحد مع فتح الظرف الملكي وباليتات الألوان المقترحة والموسيقى وRSVP',
    defaultMultiEvent: true,
    colorTheme: 'burgundy',
    features: [
      { text: 'كل مميزات الباقة الأساسية', included: true },
      { text: 'تبويبات رحلة الفرح الـ 4 برابط واحد (خطوبة + حنة + كتب كتاب + فرح)', included: true, highlight: true },
      { text: 'فتح الظرف التفاعلي ثلاثي الأبعاد بجميع حركاته الفاخرة', included: true, highlight: true },
      { text: 'تخصيص الألوان من الدرجات الملكية والذهبية المقترحة', included: true, highlight: true },
      { text: '5 خطوط عربية فاخرة و5 باترنات وأشكال بطاقات مذهبة', included: true, highlight: true },
      { text: 'مشغل أغاني وموسيقى رومانسية مع وضع رابط مباشر MP3', included: true },
      { text: 'تأكيد الحضور الذكي (RSVP) وحفظ الموعد في التقويم', included: true },
      { text: 'عجلة الألوان الحرة المطلقة بالكامل (Color Wheel)', included: false },
      { text: 'ألبوم صور وجاليري الذكريات VIP', included: false },
      { text: 'قسم ليلة الحنة المخصص للسيدات مع قفل سري', included: false },
      { text: 'البريق واللمعان الذهبي الملكي وختم مونوغرام الحروف', included: false },
    ],
  },
  {
    id: 'luxury-vip',
    name: 'باقة التصميم الخاص VIP',
    price: 150,
    priceLabel: '150 ج.م',
    icon: '💎',
    badge: 'فخامة ملكية وتخصيص كامل 💎',
    tagline: 'التجربة الملكية الأرقى لأصحاب الذوق الرفيع',
    summary: 'كامل مميزات المنصة مفتوحة 100% + تخصيص حر كامل للألوان والخطوط + ألبوم صور + حنة سرية + بريق ملكي',
    defaultMultiEvent: true,
    colorTheme: 'gold',
    features: [
      { text: 'كل مميزات باقة رحلة الفرح الشاملة كاملةً', included: true },
      { text: 'تخصيص حر 100% لعجلة الألوان وكود Hex لجميع التفاصيل', included: true, highlight: true },
      { text: 'جميع الخطوط الـ 10 وكافة الباترنات والبطاقات الفاخرة', included: true, highlight: true },
      { text: 'ألبوم صور وجاليري الذكريات (Photo Session Gallery) مع Lightbox', included: true, highlight: true },
      { text: 'قسم ليلة الحنة المخصص للسيدات مع رمز خصوصية وقفل سري', included: true, highlight: true },
      { text: 'ختم شمعي مخصص بحروف العروسين للظرف الملكي (Monogram)', included: true, highlight: true },
      { text: 'تأثيرات البريق والشيمر الذهبي الملكي المتحرك (Gold Sparkles)', included: true, highlight: true },
      { text: 'رفع ملفات الصوت MP3 وصورة غلاف مخصصة للواتساب', included: true, highlight: true },
      { text: 'شارة ملكية فاخرة VIP وإزالة أي علامة ترويجية وأولوية تسليم', included: true, highlight: true },
    ],
  },
];

export const FONT_TIERS: Record<string, { minTier: 'basic' | 'wedding-journey' | 'luxury-vip'; tierBadge: string; nameAr: string }> = {
  "'Cairo', sans-serif": { minTier: 'basic', tierBadge: 'متاح للجميع', nameAr: 'خط كايرو الحديث' },
  "'Amiri', serif": { minTier: 'basic', tierBadge: 'متاح للجميع', nameAr: 'خط أميري الملكي' },
  "'Tajawal', sans-serif": { minTier: 'wedding-journey', tierBadge: 'باقة 95 ج.م و VIP 👑', nameAr: 'خط تجوال الانسيابي' },
  "'Aref Ruqaa', serif": { minTier: 'wedding-journey', tierBadge: 'باقة 95 ج.م و VIP 👑', nameAr: 'خط رقعة تراثي' },
  "'Almarai', sans-serif": { minTier: 'wedding-journey', tierBadge: 'باقة 95 ج.م و VIP 👑', nameAr: 'خط المراعي المعاصر' },
  "'Scheherazade New', serif": { minTier: 'luxury-vip', tierBadge: 'حصري VIP (150 ج.م) 💎', nameAr: 'خط شهرزاد الملكي' },
  "'Noto Naskh Arabic', serif": { minTier: 'luxury-vip', tierBadge: 'حصري VIP (150 ج.م) 💎', nameAr: 'خط النسخ الملكي' },
  "'Marhey', cursive": { minTier: 'luxury-vip', tierBadge: 'حصري VIP (150 ج.م) 💎', nameAr: 'خط مَرحي المبهج' },
  "'IBM Plex Sans Arabic', sans-serif": { minTier: 'luxury-vip', tierBadge: 'حصري VIP (150 ج.م) 💎', nameAr: 'خط آي بي إم الأنيق' },
  "'Noto Kufi Arabic', sans-serif": { minTier: 'luxury-vip', tierBadge: 'حصري VIP (150 ج.م) 💎', nameAr: 'خط كوفي حديث' },
};

export const PATTERN_TIERS: Record<string, { minTier: 'basic' | 'wedding-journey' | 'luxury-vip'; tierBadge: string }> = {
  dots: { minTier: 'basic', tierBadge: 'متاح للجميع' },
  parchment: { minTier: 'basic', tierBadge: 'متاح للجميع' },
  damask: { minTier: 'wedding-journey', tierBadge: 'باقة 95 ج.م و VIP 👑' },
  zellige: { minTier: 'wedding-journey', tierBadge: 'باقة 95 ج.م و VIP 👑' },
  geometric: { minTier: 'wedding-journey', tierBadge: 'باقة 95 ج.م و VIP 👑' },
  marble: { minTier: 'luxury-vip', tierBadge: 'حصري VIP (150 ج.م) 💎' },
  stars: { minTier: 'luxury-vip', tierBadge: 'حصري VIP (150 ج.م) 💎' },
  floral: { minTier: 'luxury-vip', tierBadge: 'حصري VIP (150 ج.م) 💎' },
};

export const CARD_STYLE_TIERS: Record<string, { minTier: 'basic' | 'wedding-journey' | 'luxury-vip'; tierBadge: string }> = {
  arched: { minTier: 'basic', tierBadge: 'متاح للجميع' },
  'double-gold': { minTier: 'wedding-journey', tierBadge: 'باقة 95 ج.م و VIP 👑' },
  deckle: { minTier: 'wedding-journey', tierBadge: 'باقة 95 ج.م و VIP 👑' },
  frosted: { minTier: 'luxury-vip', tierBadge: 'حصري VIP (150 ج.م) 💎' },
  'royal-crest': { minTier: 'luxury-vip', tierBadge: 'حصري VIP (150 ج.م) 💎' },
};

export const PARTICLE_TIERS: Record<string, { minTier: 'basic' | 'wedding-journey' | 'luxury-vip'; tierBadge: string }> = {
  none: { minTier: 'basic', tierBadge: 'متاح للجميع' },
  'golden-dust': { minTier: 'basic', tierBadge: 'متاح للجميع' },
  'rose-petals': { minTier: 'wedding-journey', tierBadge: 'باقة 95 ج.م و VIP 👑' },
  sparkles: { minTier: 'luxury-vip', tierBadge: 'حصري VIP (150 ج.م) 💎' },
};

export const LOCAL_STORAGE_KEY = 'farahna_draft_invitation_v2';
export const LOCAL_STORAGE_ORDER_KEY = 'farahna_submitted_order_v2';

export interface TierNoticeModalState {
  isOpen: boolean;
  featureTitle: string;
  featureDescription: string;
  requiredPackageId: 'basic' | 'wedding-journey' | 'luxury-vip';
  onUpgradeAction?: () => void;
}

export interface JourneyEvent {
  id: string;
  type: string;
  titleAr: string;
  date: string;
  time: string;
  venueNameAr: string;
  addressAr: string;
  googleMapsUrl: string;
  latitude?: number | null;
  longitude?: number | null;
  openStreetMapUrl?: string | null;
  enabled: boolean;
  dressCodeAr?: string;
  isHennaFemaleOnly?: boolean;
}

export const INITIAL_JOURNEY_EVENTS: JourneyEvent[] = [
  {
    id: 'evt-wedding',
    type: 'wedding',
    titleAr: 'حفل الزفاف الرسمي',
    date: '2026-11-20T20:00',
    time: '08:00 م',
    venueNameAr: 'قاعة الحفل الملكية',
    addressAr: 'فندق فورسيزونز نايل بلازا، القاهرة',
    googleMapsUrl: 'https://maps.google.com/?q=Four+Seasons+Hotel+Cairo',
    enabled: true,
    dressCodeAr: 'بدلة رسمية وفستان سواريه',
  },
  {
    id: 'evt-engagement',
    type: 'engagement',
    titleAr: 'حفل الخطوبة المبارك',
    date: '2026-09-15T19:00',
    time: '07:00 م',
    venueNameAr: 'فيلا جاردينيا سيتي',
    addressAr: 'التجمع الخامس، القاهرة الجديدة',
    googleMapsUrl: 'https://maps.google.com/?q=New+Cairo',
    enabled: true,
    dressCodeAr: 'أنيق ومبهج',
  },
  {
    id: 'evt-katbketab',
    type: 'katbketab',
    titleAr: 'عقد القران وكتب الكتاب',
    date: '2026-11-10T18:00',
    time: '06:00 م',
    venueNameAr: 'مسجد الشرطة - قاعة الروضة',
    addressAr: 'الشيخ زايد، 6 أكتوبر',
    googleMapsUrl: 'https://maps.google.com/?q=Police+Mosque+Zayed',
    enabled: true,
    dressCodeAr: 'ملابس محتشمة وأنيقة',
  },
  {
    id: 'evt-henna',
    type: 'henna',
    titleAr: 'ليلة الحنة',
    date: '2026-11-18T18:30',
    time: '06:30 م',
    venueNameAr: 'قاعة اللوتس بالمعادي',
    addressAr: 'كورنيش المعادي، القاهرة',
    googleMapsUrl: 'https://maps.google.com/?q=Maadi+Cairo',
    enabled: true,
    dressCodeAr: 'جلابية وعباية حنة مبهجة',
    isHennaFemaleOnly: true,
  },
];

export function normalizeColor(input: string): string | null {
  if (!input || typeof input !== 'string') return null;
  let clean = input.trim();

  // Convert Arabic-Indic numerals (٠-٩) to standard ASCII digits
  clean = clean.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());

  // Convert Arabic comma (،) to standard comma (,)
  clean = clean.replace(/،/g, ',');

  clean = clean.toLowerCase();

  // Strip all trailing '#' (common typing bug when pasting/editing in RTL e.g. "FFF8F9#", "C48B9F#")
  clean = clean.replace(/#+$/, '').trim();

  const hexPart = clean.startsWith('#') ? clean.slice(1) : clean;

  // 3-digit hex (e.g. fff, 720)
  if (/^[0-9a-f]{3}$/i.test(hexPart)) {
    return `#${hexPart[0]}${hexPart[0]}${hexPart[1]}${hexPart[1]}${hexPart[2]}${hexPart[2]}`.toLowerCase();
  }

  // 6-digit hex (e.g. ffffff, 720925)
  if (/^[0-9a-f]{6}$/i.test(hexPart)) {
    return `#${hexPart}`.toLowerCase();
  }

  // 8-digit hex (with alpha)
  if (/^[0-9a-f]{8}$/i.test(hexPart)) {
    return `#${hexPart.slice(0, 6)}`.toLowerCase();
  }

  // rgb(...) or rgba(...)
  const rgbMatch = clean.match(/^rgba?\s*\(\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})/i);
  if (rgbMatch) {
    const r = Math.min(255, Math.max(0, parseInt(rgbMatch[1], 10))).toString(16).padStart(2, '0');
    const g = Math.min(255, Math.max(0, parseInt(rgbMatch[2], 10))).toString(16).padStart(2, '0');
    const b = Math.min(255, Math.max(0, parseInt(rgbMatch[3], 10))).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toLowerCase();
  }

  // Bare RGB numbers: e.g. "156, 81, 98" or "156,81,98" or "156 81 98" or "156 - 81 - 98"
  const bareMatch = clean.match(/^(\d{1,3})\s*[\s,.-]\s*(\d{1,3})\s*[\s,.-]\s*(\d{1,3})$/);
  if (bareMatch) {
    const r = Math.min(255, Math.max(0, parseInt(bareMatch[1], 10))).toString(16).padStart(2, '0');
    const g = Math.min(255, Math.max(0, parseInt(bareMatch[2], 10))).toString(16).padStart(2, '0');
    const b = Math.min(255, Math.max(0, parseInt(bareMatch[3], 10))).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toLowerCase();
  }

  return null;
}
