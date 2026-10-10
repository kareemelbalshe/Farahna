// Egyptian Wedding Constants & Culture Definitions for Farahna

import { EventType, InvitationType, OrderStatus, PaymentMethod, PaymentStatus, SectionKey } from './types';

export const EGYPTIAN_TIMEZONE = 'Africa/Cairo';

export const EVENT_TYPE_LABELS: Record<EventType, { ar: string; en: string; icon: string }> = {
  engagement: { ar: 'الخطوبة', en: 'Engagement', icon: '💍' },
  henna: { ar: 'ليلة الحنة', en: 'Henna Night', icon: '🌿' },
  katb_ketab: { ar: 'كتب الكتاب', en: 'Katb Ketab', icon: '📜' },
  wedding: { ar: 'ليلة العمر / الفرح', en: 'Wedding / Zaffah', icon: '👑' },
  reception: { ar: 'حفل الاستقبال', en: 'Reception', icon: '🥂' },
  custom: { ar: 'مناسبة خاصة', en: 'Special Event', icon: '✨' },
};

export const INVITATION_TYPE_LABELS: Record<InvitationType, { ar: string; en: string }> = {
  wedding: { ar: 'دعوة زفاف وفرح', en: 'Wedding' },
  engagement: { ar: 'دعوة خطوبة', en: 'Engagement' },
  henna: { ar: 'دعوة ليلة حنة', en: 'Henna' },
  katb_ketab: { ar: 'دعوة كتب كتاب', en: 'Katb Ketab' },
  custom: { ar: 'دعوة مناسبة خاصة', en: 'Custom' },
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, { ar: string; color: string }> = {
  new: { ar: 'طلب جديد', color: 'blue' },
  contacted: { ar: 'تم التواصل', color: 'indigo' },
  details_received: { ar: 'استلام التفاصيل', color: 'cyan' },
  designing: { ar: 'جاري التصميم', color: 'amber' },
  preview_sent: { ar: 'تم إرسال المعاينة', color: 'purple' },
  awaiting_payment: { ar: 'بانتظار الدفع (InstaPay / فودافون كاش)', color: 'orange' },
  payment_proof_received: { ar: 'تم استلام إيصال التحويل', color: 'teal' },
  paid: { ar: 'تم الدفع والتحقق', color: 'emerald' },
  published: { ar: 'الدعوة منشورة لايف', color: 'green' },
  completed: { ar: 'مكتمل بنجاح', color: 'slate' },
  cancelled: { ar: 'ملغي', color: 'rose' },
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, { ar: string; en: string; icon: string }> = {
  instapay: { ar: 'إنستاباي (InstaPay)', en: 'InstaPay', icon: '📲' },
  vodafone_cash: { ar: 'فودافون كاش (Vodafone Cash)', en: 'Vodafone Cash', icon: '📱' },
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, { ar: string; color: string }> = {
  pending: { ar: 'قيد الانتظار', color: 'amber' },
  proof_received: { ar: 'الإيصال قيد المراجعة', color: 'blue' },
  verified: { ar: 'معتمد ومؤكد', color: 'emerald' },
  rejected: { ar: 'مرفوض', color: 'rose' },
  refunded: { ar: 'مسترد', color: 'slate' },
};

export const DEFAULT_THEMES = [
  {
    name: 'Royal Burgundy',
    nameAr: 'الملكي البورجوندي',
    slug: 'royal-burgundy',
    config: {
      primaryColor: '#720925',
      secondaryColor: '#D4AF37',
      accentColor: '#4A0E17',
      backgroundColor: '#FAF7F2',
      textColor: '#2D1B1E',
      fontFamily: 'Cairo, sans-serif',
      envelopeStyle: 'wax-seal-burgundy',
      cardStyle: 'bordered-gold',
      animationStyle: 'smooth-reveal',
      decorations: ['gold-leaves', 'ornate-border'],
    },
    sortOrder: 1,
  },
  {
    name: 'Elegant Gold',
    nameAr: 'الذهبي الفاخر',
    slug: 'elegant-gold',
    config: {
      primaryColor: '#B8860B',
      secondaryColor: '#1A1A1A',
      accentColor: '#D4AF37',
      backgroundColor: '#0F0F10',
      textColor: '#F5E6C8',
      fontFamily: 'Tajawal, sans-serif',
      envelopeStyle: 'gold-foil',
      cardStyle: 'glass-dark-gold',
      animationStyle: 'luxurious-fade',
      decorations: ['sparkle', 'geometric-gold'],
    },
    sortOrder: 2,
  },
  {
    name: 'Minimal White',
    nameAr: 'الأبيض الهادئ',
    slug: 'minimal-white',
    config: {
      primaryColor: '#2B2B2B',
      secondaryColor: '#8C8C8C',
      accentColor: '#E0D7CE',
      backgroundColor: '#FFFFFF',
      textColor: '#1A1A1A',
      fontFamily: 'IBM Plex Sans Arabic, sans-serif',
      envelopeStyle: 'clean-ribbon',
      cardStyle: 'shadow-minimal',
      animationStyle: 'gentle-slide',
      decorations: ['minimal-line'],
    },
    sortOrder: 3,
  },
  {
    name: 'Romantic Floral',
    nameAr: 'الزهري الرومانسي',
    slug: 'romantic-floral',
    config: {
      primaryColor: '#9C5162',
      secondaryColor: '#C48B9F',
      accentColor: '#E8CCD7',
      backgroundColor: '#FFF8F9',
      textColor: '#3A2228',
      fontFamily: 'Cairo, sans-serif',
      envelopeStyle: 'floral-seal',
      cardStyle: 'soft-floral-border',
      animationStyle: 'petal-float',
      decorations: ['watercolor-roses', 'eucalyptus'],
    },
    sortOrder: 4,
  },
  {
    name: 'Egyptian Oriental',
    nameAr: 'الشرقي التراثي الأصيل',
    slug: 'egyptian-oriental',
    config: {
      primaryColor: '#1A365D',
      secondaryColor: '#C69214',
      accentColor: '#8B4513',
      backgroundColor: '#FBF8F1',
      textColor: '#1A202C',
      fontFamily: 'Noto Kufi Arabic, sans-serif',
      envelopeStyle: 'arabesque-stamp',
      cardStyle: 'islamic-geometric',
      animationStyle: 'fade-scale',
      decorations: ['arabesque-corners', 'mashrabiya-pattern'],
    },
    sortOrder: 5,
  },
];

export const DEFAULT_SECTIONS: { key: SectionKey; labelAr: string; defaultEnabled: boolean }[] = [
  { key: 'envelope', labelAr: 'الظرف الافتتاحي التفاعلي', defaultEnabled: true },
  { key: 'couple', labelAr: 'أسماء العروسين وصورهم', defaultEnabled: true },
  { key: 'message', labelAr: 'الرسالة الافتتاحية والآية الكريمة', defaultEnabled: true },
  { key: 'countdown', labelAr: 'العد التنازلي لموعد الفرح', defaultEnabled: true },
  { key: 'events', labelAr: 'تبويبات رحلة الفرح (المناسبات المتعددة)', defaultEnabled: true },
  { key: 'timeline', labelAr: 'الخط الزمني الشامل للمواعيد', defaultEnabled: true },
  { key: 'parents', labelAr: 'إهداء أولياء الأمور والعائلات', defaultEnabled: true },
  { key: 'henna_special', labelAr: 'قسم ليلة الحنة المخصص (للسيدات)', defaultEnabled: false },
  { key: 'gallery', labelAr: 'معرض صور العروسين', defaultEnabled: true },
  { key: 'venue', labelAr: 'معلومات القاعة ومكان الحفل', defaultEnabled: true },
  { key: 'map', labelAr: 'الخريطة التفاعلية والاتجاهات', defaultEnabled: true },
  { key: 'dresscode', labelAr: 'إرشادات اللباس (Dress Code)', defaultEnabled: true },
  { key: 'rsvp', labelAr: 'تأكيد الحضور (RSVP)', defaultEnabled: true },
  { key: 'calendar', labelAr: 'إضافة الموعد لتقويم الهاتف', defaultEnabled: true },
  { key: 'share', labelAr: 'أزرار مشاركة الدعوة (واتساب، فيسبوك)', defaultEnabled: true },
  { key: 'whatsapp', labelAr: 'زر التواصل مع أصحاب الفرح', defaultEnabled: true },
  { key: 'footer', labelAr: 'خاتمة الدعوة وشعار فرحنا', defaultEnabled: true },
];

export const WHATSAPP_TEMPLATES = {
  landingInquiry: (theme?: string, eventType?: string) => `السلام عليكم ورحمة الله ❤️
حابب استفسر وأعمل دعوة إلكترونية من فرحنا.
نوع المناسبة: ${eventType || 'فرح / زفاف'}
${theme ? `الثيم اللي عجبني: ${theme}` : ''}
ياريت تفاصيل الأسعار والخطوات.`,

  themeOrder: (themeName: string) => `مرحباً، عجبني تصميم [${themeName}] على منصة فرحنا ❤️
وعايز أعمل دعوة مشابهة لفرحنا.
اسم العريس: 
اسم العروسة: 
تاريخ الفرح: `,

  shareGuest: (coupleNames: string, invitationUrl: string) => `فرحتنا قربت وعقبال عندكم جميعاً ❤️
يسعدنا ويشرفنا حضوركم لتشاركونا أجمل لحظات حياتنا.
تفاصيل وموقع الفرح بالكامل في الرابط التالي:
${invitationUrl}
مستنيينكم تنورونا ✨`,
};

export interface WeddingFontOption {
  id: string;
  name: string;
  nameAr: string;
  fontFamily: string;
  description: string;
  category: 'royal' | 'modern' | 'heritage' | 'soft' | 'custom';
}

export const ARABIC_WEDDING_FONTS: WeddingFontOption[] = [
  {
    id: 'amiri',
    name: 'Amiri',
    nameAr: 'خط أميري الملكي 👑',
    fontFamily: "'Amiri', serif",
    description: 'خط كلاسيكي ملكي عريق بأسلوب النسخ والقصور الفاخرة',
    category: 'royal',
  },
  {
    id: 'aref-ruqaa',
    name: 'Aref Ruqaa',
    nameAr: 'خط رقعة تراثي (عارف رقعة) 📜',
    fontFamily: "'Aref Ruqaa', serif",
    description: 'خط رقعة عربي أصيل ذو طابع فني مميز لكتب الكتاب والأعراس التراثية',
    category: 'heritage',
  },
  {
    id: 'cairo',
    name: 'Cairo',
    nameAr: 'خط كايرو الحديث ✨',
    fontFamily: "'Cairo', sans-serif",
    description: 'خط عصري أنيق وفائق الوضوح ومثالي لجميع شاشات الهواتف',
    category: 'modern',
  },
  {
    id: 'tajawal',
    name: 'Tajawal',
    nameAr: 'خط تجوال الانسيابي 🕊️',
    fontFamily: "'Tajawal', sans-serif",
    description: 'خط انسيابي هادئ وناعم للمناسبات العصرية وحفلات الخطوبة',
    category: 'soft',
  },
  {
    id: 'almarai',
    name: 'Almarai',
    nameAr: 'خط المراعي المعاصر 🌿',
    fontFamily: "'Almarai', sans-serif",
    description: 'خط عربي حديث بهندسة متزنة ومريحة جداً للقراءة السريعة',
    category: 'modern',
  },
  {
    id: 'scheherazade',
    name: 'Scheherazade New',
    nameAr: 'خط شهرزاد الملكي 🏰',
    fontFamily: "'Scheherazade New', serif",
    description: 'طابع المخطوطات والزخارف الشرقية وأجواء الليالي العربية الكبرى',
    category: 'royal',
  },
  {
    id: 'noto-naskh',
    name: 'Noto Naskh Arabic',
    nameAr: 'خط النسخ الملكي المتقن 🖋️',
    fontFamily: "'Noto Naskh Arabic', serif",
    description: 'قمة الرصانة والوقار لحفلات كتب الكتاب والزفاف الكلاسيكي',
    category: 'royal',
  },
  {
    id: 'marhey',
    name: 'Marhey',
    nameAr: 'خط مَرحي المبهج 🎉',
    fontFamily: "'Marhey', cursive",
    description: 'طابع شبابي مرح واحتفالي مبهج للخطوبة وليالي الحنة والأفراح المعاصرة',
    category: 'soft',
  },
  {
    id: 'ibm-plex',
    name: 'IBM Plex Sans Arabic',
    nameAr: 'خط آي بي إم الأنيق 💎',
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    description: 'تصميم راقٍ بطابع تقني رفيع ومحترف',
    category: 'modern',
  },
  {
    id: 'noto-kufi',
    name: 'Noto Kufi Arabic',
    nameAr: 'خط كوفي حديث 🏛️',
    fontFamily: "'Noto Kufi Arabic', sans-serif",
    description: 'هندسة كوفية واضحة ومميزة للعناوين البارزة',
    category: 'heritage',
  },
];

