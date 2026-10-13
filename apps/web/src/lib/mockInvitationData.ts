import {
  InvitationDTO,
  InvitationEventDTO,
  ThemeDTO,
  InvitationSectionDTO,
  DEFAULT_THEMES,
} from '@farahna/shared';
import { getAutoRenewingDemoDate } from './date';

export interface FullInvitationMock {
  invitation: InvitationDTO;
  events: InvitationEventDTO[];
  theme: ThemeDTO;
  sections: InvitationSectionDTO[];
}

/**
 * Helper to generate a full ThemeDTO from DEFAULT_THEMES
 */
export function getThemeBySlug(slug: string): ThemeDTO {
  const found = DEFAULT_THEMES.find((t) => t.slug === slug);
  if (found) {
    return {
      id: `theme-${found.slug}`,
      name: found.name,
      nameAr: found.nameAr,
      slug: found.slug,
      isActive: true,
      isDefault: found.slug === 'royal-burgundy',
      sortOrder: found.sortOrder,
      config: found.config,
    };
  }
  // Default to Royal Burgundy
  return {
    id: 'theme-royal-burgundy',
    name: 'Royal Burgundy',
    nameAr: 'الملكي البورجوندي',
    slug: 'royal-burgundy',
    isActive: true,
    isDefault: true,
    sortOrder: 1,
    config: DEFAULT_THEMES[0].config,
  };
}

const BASE_EVENTS: InvitationEventDTO[] = [
  {
    id: 'evt-wedding-01',
    invitationId: 'inv-ahmed-sara-001',
    type: 'wedding',
    titleAr: 'حفل الزفاف والزفة الكبرى 👑',
    subtitleAr: 'الليلة الملكية في قاعة عايدة',
    date: getAutoRenewingDemoDate('2026-11-20T18:00:00.000Z', 30).toISOString(),
    startTime: '٨:٠٠ م',
    endTime: '٢:٠٠ ص',
    venueNameAr: 'فندق ماريوت الزمالك — قاعة عايدة الملكية',
    addressAr: '١٦ شارع سراي الجزيرة، حي الزمالك، القاهرة',
    googleMapsUrl: 'https://maps.google.com/?q=Cairo+Marriott+Hotel+Zamalek',
    descriptionAr: 'تتوفر خدمة صف السيارات الفاخرة (Valet Parking) عند بوابة الجزيرة الرئيسية المطلة على النيل.',
    dressCodeAr: 'Black Tie / بدلة رسمية كاملة وفستان سواريه فاخر 🎩👗',
    sortOrder: 1,
    isVisible: true,
    isHennaFemaleOnly: false,
  },
  {
    id: 'evt-henna-02',
    invitationId: 'inv-ahmed-sara-001',
    type: 'henna',
    titleAr: 'ليلة الحنة وسهرة البنات 🌿',
    subtitleAr: 'أجواء شعبية مصرية دافئة وزغاريد',
    date: getAutoRenewingDemoDate('2026-11-18T16:00:00.000Z', 28).toISOString(),
    startTime: '٥:٠٠ م',
    endTime: '١٠:٠٠ م',
    venueNameAr: 'فيلا النرجس للمناسبات الخاصة',
    addressAr: 'الحي الرابع، التجمع الخامس، القاهرة الجديدة',
    googleMapsUrl: 'https://maps.google.com/?q=New+Cairo+Villa',
    descriptionAr: 'سهرة مبهجة مع رسم الحنة والدفوف والزغاريد. خاص بالسيدات فقط.',
    dressCodeAr: 'جلابيب شرقية وملابس تراثية مبهجة 💃',
    sortOrder: 2,
    isVisible: true,
    isHennaFemaleOnly: true,
  },
  {
    id: 'evt-katb-03',
    invitationId: 'inv-ahmed-sara-001',
    type: 'katb_ketab',
    titleAr: 'عقد القران وكتب الكتاب 📜',
    subtitleAr: 'اللحظة الشرعية المباركة',
    date: getAutoRenewingDemoDate('2026-11-06T14:00:00.000Z', 25).toISOString(),
    startTime: '٣:٠٠ م',
    endTime: '٥:٠٠ م',
    venueNameAr: 'قاعة الماسة — مسجد المشير طنطاوي',
    addressAr: 'محور المشير، التجمع الخامس، القاهرة',
    googleMapsUrl: 'https://maps.google.com/?q=Mosheer+Tantawy+Mosque',
    descriptionAr: 'بارك الله لهما وبارك عليهما وجمع بينهما في خير.',
    dressCodeAr: 'ملابس رسمية محتشمة ومريحة',
    sortOrder: 3,
    isVisible: true,
    isHennaFemaleOnly: false,
  },
  {
    id: 'evt-eng-04',
    invitationId: 'inv-ahmed-sara-001',
    type: 'engagement',
    titleAr: 'حفل الخطوبة الرسمي 💍',
    subtitleAr: 'بداية الرحلة والارتباط',
    date: getAutoRenewingDemoDate('2026-10-15T17:00:00.000Z', 15).toISOString(),
    startTime: '٦:٠٠ م',
    endTime: '١١:٠٠ م',
    venueNameAr: 'فندق رويال توليب — التراس المفتوح',
    addressAr: 'كورنيش الإسكندرية، سيدي جابر',
    googleMapsUrl: 'https://maps.google.com/?q=Tolip+Hotel+Alexandria',
    descriptionAr: 'أجمل ليلة بحرية مع غروب شمس الإسكندرية الرائع.',
    dressCodeAr: 'فورمال صيفي أنيق',
    sortOrder: 4,
    isVisible: true,
    isHennaFemaleOnly: false,
  },
];

const BASE_SECTIONS: InvitationSectionDTO[] = [
  { id: 's1', invitationId: 'inv-ahmed-sara-001', sectionKey: 'envelope', isEnabled: true, sortOrder: 1 },
  { id: 's2', invitationId: 'inv-ahmed-sara-001', sectionKey: 'cover', isEnabled: true, sortOrder: 2 },
  { id: 's3', invitationId: 'inv-ahmed-sara-001', sectionKey: 'couple', isEnabled: true, sortOrder: 3 },
  { id: 's4', invitationId: 'inv-ahmed-sara-001', sectionKey: 'message', isEnabled: true, sortOrder: 4 },
  { id: 's5', invitationId: 'inv-ahmed-sara-001', sectionKey: 'countdown', isEnabled: true, sortOrder: 5 },
  { id: 's6', invitationId: 'inv-ahmed-sara-001', sectionKey: 'events', isEnabled: true, sortOrder: 6 },
  { id: 's7', invitationId: 'inv-ahmed-sara-001', sectionKey: 'timeline', isEnabled: true, sortOrder: 7 },
  { id: 's8', invitationId: 'inv-ahmed-sara-001', sectionKey: 'parents', isEnabled: true, sortOrder: 8 },
  { id: 's9', invitationId: 'inv-ahmed-sara-001', sectionKey: 'couple_photo', isEnabled: true, sortOrder: 9 },
  { id: 's10', invitationId: 'inv-ahmed-sara-001', sectionKey: 'gallery', isEnabled: true, sortOrder: 10 },
  { id: 's11', invitationId: 'inv-ahmed-sara-001', sectionKey: 'venue', isEnabled: true, sortOrder: 11 },
  { id: 's12', invitationId: 'inv-ahmed-sara-001', sectionKey: 'map', isEnabled: true, sortOrder: 12 },
  { id: 's13', invitationId: 'inv-ahmed-sara-001', sectionKey: 'dresscode', isEnabled: true, sortOrder: 13 },
  { id: 's14', invitationId: 'inv-ahmed-sara-001', sectionKey: 'rsvp', isEnabled: true, sortOrder: 14 },
  { id: 's15', invitationId: 'inv-ahmed-sara-001', sectionKey: 'calendar', isEnabled: true, sortOrder: 15 },
  { id: 's16', invitationId: 'inv-ahmed-sara-001', sectionKey: 'share', isEnabled: true, sortOrder: 16 },
  { id: 's17', invitationId: 'inv-ahmed-sara-001', sectionKey: 'whatsapp', isEnabled: true, sortOrder: 17 },
  { id: 's18', invitationId: 'inv-ahmed-sara-001', sectionKey: 'footer', isEnabled: true, sortOrder: 18 },
];

export interface ThemeConfigOverrides {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  envelopeStyle?: string;
  cardStyle?: string;
}

/**
 * Creates Ahmed & Sara invitation with any specified theme slug and optional custom overrides
 */
export function createAhmedSaraWithTheme(
  themeSlug: string,
  overrides?: ThemeConfigOverrides
): FullInvitationMock {
  const baseTheme = getThemeBySlug(themeSlug);

  const mergedConfig = {
    ...baseTheme.config,
    ...(overrides?.primaryColor ? { primaryColor: overrides.primaryColor } : {}),
    ...(overrides?.secondaryColor ? { secondaryColor: overrides.secondaryColor } : {}),
    ...(overrides?.backgroundColor ? { backgroundColor: overrides.backgroundColor } : {}),
    ...(overrides?.textColor ? { textColor: overrides.textColor } : {}),
    ...(overrides?.fontFamily ? { fontFamily: overrides.fontFamily } : {}),
    ...(overrides?.envelopeStyle ? { envelopeStyle: overrides.envelopeStyle } : {}),
    ...(overrides?.cardStyle ? { cardStyle: overrides.cardStyle } : {}),
  };

  const theme: ThemeDTO = {
    ...baseTheme,
    nameAr: baseTheme.nameAr || themeSlug,
    config: mergedConfig,
  };

  return {
    theme,
    invitation: {
      id: 'inv-ahmed-sara-001',
      customerId: 'cust-demo-001',
      slug: `ahmed-sara-${themeSlug}`,
      title: `زفاف أحمد وسارة (${theme.nameAr})`,
      type: 'wedding',
      status: 'published',
      privacy: 'public',
      previewToken: `preview-token-${themeSlug}`,

      coupleGroomAr: 'أحمد محمود إبراهيم',
      coupleBrideAr: 'سارة حسن الشريف',
      coupleGroomEn: 'Ahmed Mahmoud',
      coupleBrideEn: 'Sara El-Sherif',

      parentsGroomAr: 'يتشرف المستشار محمود إبراهيم وحرمه',
      parentsBrideAr: 'والأستاذ الدكتور حسن الشريف وحرمه',

      weddingMessageAr: `بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
"وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"

يسعدنا ويشرفنا دعوتكم لمشاركتنا فرحتنا وابتداء أجمل فصول حياتنا معاً. حضوركم يملأ قلوبنا بهجة وفرحاً ❤️`,

      coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      coupleImageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
      ],

      musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-113337.mp3',
      musicTitle: 'موسيقى ليلة العمر الهادئة',

      themeId: theme.id,
      themeConfig: mergedConfig,

      isMultiEvent: true,
      rsvpEnabled: true,
      countdownEnabled: true,
      envelopeAnimationEnabled: true,

      eventDate: getAutoRenewingDemoDate('2026-11-20T18:00:00.000Z', 30).toISOString(),
      startDate: '2026-10-15T16:00:00.000Z',
      viewsCount: 1420,
      uniqueVisitorsCount: 890,

      createdAt: '2026-09-01T12:00:00.000Z',
      updatedAt: '2026-09-20T12:00:00.000Z',
    },
    events: BASE_EVENTS,
    sections: BASE_SECTIONS,
  };
}

/**
 * 🎨 1. Theme: Royal Burgundy
 */
export const MOCK_AHMED_SARA = createAhmedSaraWithTheme('royal-burgundy');

/**
 * 🎨 2. Theme: Elegant Gold
 */
export const MOCK_AHMED_SARA_ELEGANT_GOLD = createAhmedSaraWithTheme('elegant-gold');

/**
 * 🎨 3. Theme: Minimal White
 */
export const MOCK_AHMED_SARA_MINIMAL_WHITE = createAhmedSaraWithTheme('minimal-white');

/**
 * 🎨 4. Theme: Romantic Floral
 */
export const MOCK_AHMED_SARA_ROMANTIC_FLORAL = createAhmedSaraWithTheme('romantic-floral');

/**
 * 🎨 5. Theme: Egyptian Oriental
 */
export const MOCK_AHMED_SARA_EGYPTIAN_ORIENTAL = createAhmedSaraWithTheme('egyptian-oriental');

/**
 * 🌿 Special: Ahmed & Sara with Henna event having an independent themeOverride!
 * The main wedding is Royal Burgundy, but Henna night has themeOverride for Romantic Floral!
 */
export const MOCK_AHMED_SARA_THEME_OVERRIDE: FullInvitationMock = {
  ...MOCK_AHMED_SARA,
  invitation: {
    ...MOCK_AHMED_SARA.invitation,
    title: 'زفاف أحمد وسارة مع تخصيص ثيم الحنة 🌿',
  },
  events: MOCK_AHMED_SARA.events.map((ev) => {
    if (ev.type === 'henna') {
      return {
        ...ev,
        themeOverride: {
          primaryColor: '#9C5162',
          secondaryColor: '#E8CCD7',
          backgroundColor: '#FFF8F9',
          textColor: '#3A2228',
          cardStyle: 'soft-floral-border',
        },
      };
    }
    return ev;
  }),
};

/**
 * ✨ Invitation #2: عمر وسلمى (Single event, Elegant Gold Dark Mode)
 */
export const MOCK_OMAR_SALMA: FullInvitationMock = {
  theme: getThemeBySlug('elegant-gold'),
  invitation: {
    id: 'inv-omar-salma-002',
    customerId: 'cust-demo-002',
    slug: 'omar-salma',
    title: 'حفل خطوبة عمر وسلمى 💍',
    type: 'engagement',
    status: 'published',
    privacy: 'public',
    previewToken: 'preview-token-omar-salma',

    coupleGroomAr: 'عمر خالد',
    coupleBrideAr: 'سلمى الشريف',
    coupleGroomEn: 'Omar Khaled',
    coupleBrideEn: 'Salma El-Sherif',

    parentsGroomAr: 'يتشرف المستشار خالد عبد الرحمن وحرمه',
    parentsBrideAr: 'والأستاذ الدكتور طارق الشريف وحرمه',

    weddingMessageAr: `يسرّنا أن نعلن عن خطوبتنا السعيدة، ونتشرف بمشاركتكم هذه الليلة المميزة على ضفاف عروس البحر الأبيض المتوسط ✨

"وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"

حضوركم يكتمل به سرورنا ويزيد ليلتنا بهجة وتألقاً ❤️`,

    coverImageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
    coupleImageUrl: 'https://images.unsplash.com/photo-1621621667797-e06afc21b56a?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1621621667797-e06afc21b56a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    ],

    musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-113337.mp3',
    musicTitle: 'موسيقى رومانسي ليلة الخطوبة 💎',

    themeId: 'theme-elegant-gold',
    themeConfig: getThemeBySlug('elegant-gold').config,

    isMultiEvent: false,
    rsvpEnabled: true,
    countdownEnabled: true,
    envelopeAnimationEnabled: true,

    eventDate: getAutoRenewingDemoDate('2026-10-15T18:00:00.000Z', 15).toISOString(),
    startDate: '2026-10-15T18:00:00.000Z',
    viewsCount: 680,
    uniqueVisitorsCount: 420,

    createdAt: '2026-09-10T12:00:00.000Z',
    updatedAt: '2026-09-22T12:00:00.000Z',
  },
  events: [
    {
      id: 'evt-eng-omar-01',
      invitationId: 'inv-omar-salma-002',
      type: 'engagement',
      titleAr: 'حفل الخطوبة الرسمي 💎',
      subtitleAr: 'سهرة مسائية ساحرة على الكورنيش',
      date: getAutoRenewingDemoDate('2026-10-15T18:00:00.000Z', 15).toISOString(),
      startTime: '٧:٠٠ م',
      endTime: '١٢:٠٠ ص',
      venueNameAr: 'فندق سيسل التاريخي — قاعة فيردي المطلة على البحر',
      addressAr: 'ميدان سعد زغلول، محطة الرمل، الإسكندرية',
      googleMapsUrl: 'https://maps.google.com/?q=Steigenberger+Cecil+Hotel+Alexandria',
      descriptionAr: 'استقبال الضيوف يبدأ من السابعة مساءً، مع بوفيه عشاء مفتوح وإطلالة بانورامية على قلعة قايتباي.',
      dressCodeAr: 'Semi-Formal / كوكتيل شيك ✨',
      sortOrder: 1,
      isVisible: true,
      isHennaFemaleOnly: false,
    },
  ],
  sections: [
    { id: 'os-1', invitationId: 'inv-omar-salma-002', sectionKey: 'envelope', isEnabled: true, sortOrder: 1 },
    { id: 'os-2', invitationId: 'inv-omar-salma-002', sectionKey: 'cover', isEnabled: true, sortOrder: 2 },
    { id: 'os-3', invitationId: 'inv-omar-salma-002', sectionKey: 'couple', isEnabled: true, sortOrder: 3 },
    { id: 'os-4', invitationId: 'inv-omar-salma-002', sectionKey: 'message', isEnabled: true, sortOrder: 4 },
    { id: 'os-5', invitationId: 'inv-omar-salma-002', sectionKey: 'countdown', isEnabled: true, sortOrder: 5 },
    { id: 'os-6', invitationId: 'inv-omar-salma-002', sectionKey: 'events', isEnabled: false, sortOrder: 6 },
    { id: 'os-7', invitationId: 'inv-omar-salma-002', sectionKey: 'timeline', isEnabled: false, sortOrder: 7 },
    { id: 'os-8', invitationId: 'inv-omar-salma-002', sectionKey: 'parents', isEnabled: true, sortOrder: 8 },
    { id: 'os-9', invitationId: 'inv-omar-salma-002', sectionKey: 'couple_photo', isEnabled: true, sortOrder: 9 },
    { id: 'os-10', invitationId: 'inv-omar-salma-002', sectionKey: 'gallery', isEnabled: true, sortOrder: 10 },
    { id: 'os-11', invitationId: 'inv-omar-salma-002', sectionKey: 'venue', isEnabled: true, sortOrder: 11 },
    { id: 'os-12', invitationId: 'inv-omar-salma-002', sectionKey: 'map', isEnabled: true, sortOrder: 12 },
    { id: 'os-13', invitationId: 'inv-omar-salma-002', sectionKey: 'dresscode', isEnabled: true, sortOrder: 13 },
    { id: 'os-14', invitationId: 'inv-omar-salma-002', sectionKey: 'rsvp', isEnabled: true, sortOrder: 14 },
    { id: 'os-15', invitationId: 'inv-omar-salma-002', sectionKey: 'calendar', isEnabled: true, sortOrder: 15 },
    { id: 'os-16', invitationId: 'inv-omar-salma-002', sectionKey: 'share', isEnabled: true, sortOrder: 16 },
    { id: 'os-17', invitationId: 'inv-omar-salma-002', sectionKey: 'whatsapp', isEnabled: true, sortOrder: 17 },
    { id: 'os-18', invitationId: 'inv-omar-salma-002', sectionKey: 'footer', isEnabled: true, sortOrder: 18 },
  ],
};

/**
 * 🌿 Invitation #3: حنة مريم (Mariam Youssef - Henna Party)
 */
export const MOCK_MARIAM_YOUSSEF: FullInvitationMock = {
  theme: getThemeBySlug('romantic-floral'),
  invitation: {
    id: 'inv-mariam-youssef-003',
    customerId: 'cust-demo-003',
    slug: 'mariam-youssef',
    title: 'سهرة الحنة المصرية — حنة مريم 🌿',
    type: 'henna',
    status: 'published',
    privacy: 'public',
    previewToken: 'preview-token-mariam-youssef',

    coupleGroomAr: '',
    coupleBrideAr: 'حنة مريم 🌸',
    coupleGroomEn: null,
    coupleBrideEn: 'Mariam Henna Night',

    parentsGroomAr: null,
    parentsBrideAr: 'تتشرف والدة العروس بدعوة حضراتكم',

    weddingMessageAr: `يسعدنا ويشرفنا دعوتكم لحضور سهرة حنة ابنتنا مريم 🌸\nليلة نسائية خاصة مليئة بالفرح والبهجة والأغاني التراثية الأصيلة.\nحضوركم يسعدنا ويكمل فرحتنا ❤️`,

    coverImageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    coupleImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    galleryImages: [],

    musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-113337.mp3',
    musicTitle: 'موسيقى الحنة والبهجة الهادئة',

    themeId: 'theme-romantic-floral',
    themeConfig: getThemeBySlug('romantic-floral').config,

    isMultiEvent: false,
    rsvpEnabled: true,
    countdownEnabled: true,
    envelopeAnimationEnabled: true,

    eventDate: getAutoRenewingDemoDate('2026-11-18T18:00:00.000Z', 20).toISOString(),
    startDate: '2026-11-18T18:00:00.000Z',
    viewsCount: 520,
    uniqueVisitorsCount: 340,

    createdAt: '2026-09-15T12:00:00.000Z',
    updatedAt: '2026-09-25T12:00:00.000Z',
  },
  events: [
    {
      id: 'evt-henna-mariam-01',
      invitationId: 'inv-mariam-youssef-003',
      type: 'henna',
      titleAr: 'سهرة الحنة المصرية 🌿',
      subtitleAr: 'أمسية احتفالية نسائية مميزة',
      date: getAutoRenewingDemoDate('2026-11-18T18:00:00.000Z', 20).toISOString(),
      startTime: '٦:٠٠ م',
      endTime: '١١:٠٠ م',
      venueNameAr: 'فيلا النرجس للمناسبات الخاصة',
      addressAr: 'التجمع الخامس، القاهرة الجديدة',
      googleMapsUrl: 'https://maps.google.com/?q=New+Cairo+Egypt',
      descriptionAr: 'حفل حناء خاص بالسيدات فقط. نرجو عدم اصطحاب الأطفال أو التصوير حرصاً على الخصوصية التامة.',
      dressCodeAr: 'جلابيات حنة / فساتين سهرة نسائية أنيقة 🌸',
      sortOrder: 1,
      isVisible: true,
      isHennaFemaleOnly: true,
    },
  ],
  sections: [
    { id: 'my-1', invitationId: 'inv-mariam-youssef-003', sectionKey: 'envelope', isEnabled: true, sortOrder: 1 },
    { id: 'my-2', invitationId: 'inv-mariam-youssef-003', sectionKey: 'cover', isEnabled: true, sortOrder: 2 },
    { id: 'my-3', invitationId: 'inv-mariam-youssef-003', sectionKey: 'couple', isEnabled: true, sortOrder: 3 },
    { id: 'my-4', invitationId: 'inv-mariam-youssef-003', sectionKey: 'message', isEnabled: true, sortOrder: 4 },
    { id: 'my-5', invitationId: 'inv-mariam-youssef-003', sectionKey: 'countdown', isEnabled: true, sortOrder: 5 },
    { id: 'my-6', invitationId: 'inv-mariam-youssef-003', sectionKey: 'events', isEnabled: false, sortOrder: 6 },
    { id: 'my-7', invitationId: 'inv-mariam-youssef-003', sectionKey: 'timeline', isEnabled: false, sortOrder: 7 },
    { id: 'my-8', invitationId: 'inv-mariam-youssef-003', sectionKey: 'parents', isEnabled: true, sortOrder: 8 },
    { id: 'my-9', invitationId: 'inv-mariam-youssef-003', sectionKey: 'couple_photo', isEnabled: true, sortOrder: 9 },
    { id: 'my-10', invitationId: 'inv-mariam-youssef-003', sectionKey: 'gallery', isEnabled: false, sortOrder: 10 },
    { id: 'my-11', invitationId: 'inv-mariam-youssef-003', sectionKey: 'venue', isEnabled: true, sortOrder: 11 },
    { id: 'my-12', invitationId: 'inv-mariam-youssef-003', sectionKey: 'map', isEnabled: true, sortOrder: 12 },
    { id: 'my-13', invitationId: 'inv-mariam-youssef-003', sectionKey: 'dresscode', isEnabled: true, sortOrder: 13 },
    { id: 'my-14', invitationId: 'inv-mariam-youssef-003', sectionKey: 'rsvp', isEnabled: true, sortOrder: 14 },
    { id: 'my-15', invitationId: 'inv-mariam-youssef-003', sectionKey: 'calendar', isEnabled: true, sortOrder: 15 },
    { id: 'my-16', invitationId: 'inv-mariam-youssef-003', sectionKey: 'share', isEnabled: true, sortOrder: 16 },
    { id: 'my-17', invitationId: 'inv-mariam-youssef-003', sectionKey: 'whatsapp', isEnabled: true, sortOrder: 17 },
    { id: 'my-18', invitationId: 'inv-mariam-youssef-003', sectionKey: 'footer', isEnabled: true, sortOrder: 18 },
  ],
};

/**
 * 📜 Invitation #4: كريم & ندى (Karim & Nada - Katb Ketab)
 */
export const MOCK_KARIM_NADA: FullInvitationMock = {
  theme: getThemeBySlug('minimal-white'),
  invitation: {
    id: 'inv-karim-nada-004',
    customerId: 'cust-demo-004',
    slug: 'karim-nada',
    title: 'عقد قران مبارك — كريم وندى 📜',
    type: 'katb_ketab',
    status: 'published',
    privacy: 'public',
    previewToken: 'preview-token-karim-nada',

    coupleGroomAr: 'كريم',
    coupleBrideAr: 'ندى',
    coupleGroomEn: 'Karim',
    coupleBrideEn: 'Nada',

    parentsGroomAr: 'يتشرف المستشار حسام الدين وحرمه',
    parentsBrideAr: 'والمهندس طارق عبد الحميد وحرمه',

    weddingMessageAr: `بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ\n"وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"\n\nيسعدنا ويشرفنا حضوركم لمشاركتنا مراسم عقد القران المبارك. نسأل الله التوفيق والبركة ❤️`,

    coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    coupleImageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    galleryImages: [],

    musicUrl: null,
    musicTitle: null,

    themeId: 'theme-minimal-white',
    themeConfig: getThemeBySlug('minimal-white').config,

    isMultiEvent: false,
    rsvpEnabled: true,
    countdownEnabled: true,
    envelopeAnimationEnabled: true,

    eventDate: getAutoRenewingDemoDate('2026-11-06T17:00:00.000Z', 22).toISOString(),
    startDate: '2026-11-06T17:00:00.000Z',
    viewsCount: 480,
    uniqueVisitorsCount: 310,

    createdAt: '2026-09-18T12:00:00.000Z',
    updatedAt: '2026-09-28T12:00:00.000Z',
  },
  events: [
    {
      id: 'evt-katb-karim-01',
      invitationId: 'inv-karim-nada-004',
      type: 'katb_ketab',
      titleAr: 'مراسم عقد القران الرسمي 📜',
      subtitleAr: 'عقد القران في رحاب المسجد',
      date: getAutoRenewingDemoDate('2026-11-06T17:00:00.000Z', 22).toISOString(),
      startTime: '٥:٠٠ م',
      endTime: '٨:٠٠ م',
      venueNameAr: 'قاعة الماسة — مسجد المشير طنطاوي',
      addressAr: 'التجمع الخامس، محور المشير، القاهرة',
      googleMapsUrl: 'https://maps.google.com/?q=El+Mosheer+Tantawy+Mosque',
      descriptionAr: 'تبدأ مراسم عقد القران عقب صلاة المغرب مباشرة بقاعة الماسة. يسعدنا مشاركتكم فرحتنا.',
      dressCodeAr: 'Formal / بدلة كاملة وملابس محتشمة تناسب حرم المسجد 🤍',
      sortOrder: 1,
      isVisible: true,
      isHennaFemaleOnly: false,
    },
  ],
  sections: [
    { id: 'kn-1', invitationId: 'inv-karim-nada-004', sectionKey: 'envelope', isEnabled: true, sortOrder: 1 },
    { id: 'kn-2', invitationId: 'inv-karim-nada-004', sectionKey: 'cover', isEnabled: true, sortOrder: 2 },
    { id: 'kn-3', invitationId: 'inv-karim-nada-004', sectionKey: 'couple', isEnabled: true, sortOrder: 3 },
    { id: 'kn-4', invitationId: 'inv-karim-nada-004', sectionKey: 'message', isEnabled: true, sortOrder: 4 },
    { id: 'kn-5', invitationId: 'inv-karim-nada-004', sectionKey: 'countdown', isEnabled: true, sortOrder: 5 },
    { id: 'kn-6', invitationId: 'inv-karim-nada-004', sectionKey: 'events', isEnabled: false, sortOrder: 6 },
    { id: 'kn-7', invitationId: 'inv-karim-nada-004', sectionKey: 'timeline', isEnabled: false, sortOrder: 7 },
    { id: 'kn-8', invitationId: 'inv-karim-nada-004', sectionKey: 'parents', isEnabled: true, sortOrder: 8 },
    { id: 'kn-9', invitationId: 'inv-karim-nada-004', sectionKey: 'couple_photo', isEnabled: true, sortOrder: 9 },
    { id: 'kn-10', invitationId: 'inv-karim-nada-004', sectionKey: 'gallery', isEnabled: false, sortOrder: 10 },
    { id: 'kn-11', invitationId: 'inv-karim-nada-004', sectionKey: 'venue', isEnabled: true, sortOrder: 11 },
    { id: 'kn-12', invitationId: 'inv-karim-nada-004', sectionKey: 'map', isEnabled: true, sortOrder: 12 },
    { id: 'kn-13', invitationId: 'inv-karim-nada-004', sectionKey: 'dresscode', isEnabled: true, sortOrder: 13 },
    { id: 'kn-14', invitationId: 'inv-karim-nada-004', sectionKey: 'rsvp', isEnabled: true, sortOrder: 14 },
    { id: 'kn-15', invitationId: 'inv-karim-nada-004', sectionKey: 'calendar', isEnabled: true, sortOrder: 15 },
    { id: 'kn-16', invitationId: 'inv-karim-nada-004', sectionKey: 'share', isEnabled: true, sortOrder: 16 },
    { id: 'kn-17', invitationId: 'inv-karim-nada-004', sectionKey: 'whatsapp', isEnabled: true, sortOrder: 17 },
    { id: 'kn-18', invitationId: 'inv-karim-nada-004', sectionKey: 'footer', isEnabled: true, sortOrder: 18 },
  ],
};
