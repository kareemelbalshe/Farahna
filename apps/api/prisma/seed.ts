import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DEFAULT_THEMES, DEFAULT_SECTIONS } from '@farahna/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Farahna Egyptian Wedding Database Seeding...');

  // 1. Create Super Admin, Admin, and Editor Users
  const adminPasswordHash = await bcrypt.hash('Farahna@2026!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@farahna.com' },
    update: {},
    create: {
      email: 'admin@farahna.com',
      password: adminPasswordHash,
      name: 'كريم مدير منصة فرحنا',
      role: 'super_admin',
      isActive: true,
    },
  });

  const moderatorPasswordHash = await bcrypt.hash('Moderator@2026!', 10);
  const moderatorUser = await prisma.user.upsert({
    where: { email: 'moderator@farahna.com' },
    update: {},
    create: {
      email: 'moderator@farahna.com',
      password: moderatorPasswordHash,
      name: 'سارة مديرة العمليات',
      role: 'admin',
      isActive: true,
    },
  });

  const editorPasswordHash = await bcrypt.hash('Editor@2026!', 10);
  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@farahna.com' },
    update: {},
    create: {
      email: 'editor@farahna.com',
      password: editorPasswordHash,
      name: 'محمود مصمم الدعوات',
      role: 'editor',
      isActive: true,
    },
  });
  console.log('👤 Users created for RBAC: super_admin, admin, editor');

  // 2. Settings (Singleton)
  const settings = await prisma.settings.upsert({
    where: { id: 'singleton' },
    update: {
      supportPhone: '+201019262075',
      whatsappNumber: '201019262075',
    },
    create: {
      id: 'singleton',
      siteName: 'Farahna',
      siteNameAr: 'فرحنا',
      supportPhone: '+201019262075',
      whatsappNumber: '201019262075',
      paymentInstructionsAr:
        'الدفع متاح عبر InstaPay أو فودافون كاش — سيتم إرسال تفاصيل الدفع لحضرتك على واتساب',
      defaultTimezone: 'Africa/Cairo',
      defaultDurationDays: 60,
    },
  });
  console.log('⚙️ System settings seeded.');

  // 3. Create 5 Egyptian Themes
  const themesMap: Record<string, string> = {};
  for (const themeData of DEFAULT_THEMES) {
    const theme = await prisma.theme.upsert({
      where: { slug: themeData.slug },
      update: {
        name: themeData.name,
        nameAr: themeData.nameAr,
        config: themeData.config,
        sortOrder: themeData.sortOrder,
      },
      create: {
        name: themeData.name,
        nameAr: themeData.nameAr,
        slug: themeData.slug,
        config: themeData.config,
        isActive: true,
        isDefault: themeData.slug === 'royal-burgundy',
        sortOrder: themeData.sortOrder,
      },
    });
    themesMap[theme.slug] = theme.id;
  }
  console.log('🎨 5 Wedding themes seeded.');

  // 4. Create Pricing Plans
  const plans = [
    {
      name: 'Basic Event',
      nameAr: 'باقة المناسبة الواحدة',
      slug: 'basic',
      price: 50.0,
      currency: 'EGP',
      durationDays: 30,
      features: ['One Main Event', 'Custom Couple Names', 'Location & Map', 'WhatsApp Direct Sharing', 'Countdown Timer'],
      featuresAr: [
        'مناسبة واحدة (فرح أو خطوبة أو كتب كتاب)',
        'تصميم أنيق بأسماء العروسين وصورهم',
        'موقع القاعة وخريطة تفاعلية',
        'مشاركة مباشرة عبر واتساب ومسنجر',
        'عداد تنازلي لموعد المناسبة',
      ],
      badge: 'الأكثر طلباً للخطوبة',
      isPopular: false,
      sortOrder: 1,
    },
    {
      name: 'Wedding Journey',
      nameAr: 'باقة رحلة الفرح الشاملة',
      slug: 'wedding-journey',
      price: 95.0,
      currency: 'EGP',
      durationDays: 90,
      features: [
        'Multi-Event Journey (Engagement, Henna, Katb Ketab, Wedding)',
        'Interactive Envelope Opening Animation',
        'Background Romantic Music Player',
        'Interactive Guest RSVP Attendance Form',
        'Add Each Event to Calendar (Google/Apple)',
        'QR Code for Entrance & Print Cards',
      ],
      featuresAr: [
        'رحلة الفرح كاملة برابط واحد (خطوبة + حنة + كتب كتاب + فرح)',
        'تجربة فتح الظرف التفاعلي الفاخر',
        'مشغل موسيقى هادئة بنقرة واحدة',
        'نموذج تأكيد الحضور (RSVP) وحصر عدد الضيوف',
        'إضافة كل موعد لتقويم الهاتف بشكل مستقل',
        'رمز QR Code عالي الجودة للطباعة والقاعة',
      ],
      badge: 'الأفضل قيمة للعرسان 👑',
      isPopular: true,
      sortOrder: 2,
    },
    {
      name: 'Luxury Custom VIP',
      nameAr: 'باقة التصميم الخاص VIP',
      slug: 'luxury-vip',
      price: 150.0,
      currency: 'EGP',
      durationDays: 180,
      features: [
        'Everything in Wedding Journey',
        'Fully Custom Colors & Arabic Typography',
        'Dedicated Female-Only Henna Page with Instructions',
        'Unlimited Photo Gallery',
        'Custom Domain or Subdomain support',
        'Priority 24/7 WhatsApp Support',
      ],
      featuresAr: [
        'كل مميزات باقة رحلة الفرح الشاملة',
        'تخصيص كامل للألوان والخطوط والزخارف',
        'قسم ليلة الحنة المخصص للسيدات بخصوصية تامة',
        'معرض صور غير محدود لجلسة التصوير (Photo Session)',
        'تجهيز للربط بنطاق خاص باسم العروسين',
        'دعم وتعديلات فورية عبر واتساب',
      ],
      badge: 'فخامة ملكية',
      isPopular: false,
      sortOrder: 3,
    },
  ];

  for (const plan of plans) {
    await prisma.pricingPlan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
  }
  console.log('💳 3 Pricing packages seeded.');

  // 5. Seed Demo Customers
  const customer1 = await prisma.customer.upsert({
    where: { id: 'a1111111-1111-1111-1111-111111111111' },
    update: {},
    create: {
      id: 'a1111111-1111-1111-1111-111111111111',
      name: 'أحمد محمود وسارة إبراهيم',
      phone: '01012345671',
      whatsapp: '201012345671',
      email: 'ahmed.sara@example.com',
      source: 'whatsapp',
      notes: 'عرسان حفل الزفاف في فندق ماريوت الزمالك - رحلة الفرح الشاملة',
      status: 'active',
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { id: 'b2222222-2222-2222-2222-222222222222' },
    update: {},
    create: {
      id: 'b2222222-2222-2222-2222-222222222222',
      name: 'عمر خالد وسلمى الشريف',
      phone: '01098765432',
      whatsapp: '201098765432',
      email: 'omar.salma@example.com',
      source: 'instagram',
      notes: 'دعوة خطوبة أنيقة في فيلا المعادي',
      status: 'active',
    },
  });

  const customer3 = await prisma.customer.upsert({
    where: { id: 'c3333333-3333-3333-3333-333333333333' },
    update: {},
    create: {
      id: 'c3333333-3333-3333-3333-333333333333',
      name: 'يوسف العطار ومريم حسني',
      phone: '01122334455',
      whatsapp: '201122334455',
      email: 'youssef.mariam@example.com',
      source: 'facebook',
      notes: 'دعوة ليلة حنة مخصصة للسيدات',
      status: 'active',
    },
  });
  console.log('👥 Demo Egyptian customers seeded.');

  // 6. Seed Demo Invitations
  // A. Flagship Multi-Event Invitation: Ahmed & Sara (Wedding Journey)
  const ahmedSaraDate = new Date('2026-11-20T19:00:00.000Z');
  const inv1 = await prisma.invitation.upsert({
    where: { slug: 'ahmed-sara' },
    update: {},
    create: {
      customerId: customer1.id,
      slug: 'ahmed-sara',
      title: 'دعوة زفاف أحمد وسارة ❤️',
      type: 'wedding',
      status: 'published',
      privacy: 'unlisted',
      previewToken: 'preview-token-ahmed-sara-2026',
      coupleGroomAr: 'أحمد محمود',
      coupleBrideAr: 'سارة إبراهيم',
      coupleGroomEn: 'Ahmed Mahmoud',
      coupleBrideEn: 'Sara Ibrahim',
      parentsGroomAr: 'نجل الأستاذ محمود عبد الرحمن وحرمه',
      parentsBrideAr: 'كريمة المهندس إبراهيم الفقي وحرمه',
      weddingMessageAr:
        'بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ\n"وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"\n\nيسعدنا ويشرفنا دعوتكم لمشاركتنا فرحتنا وشهود عقد قراننا وتتويج قصة حبنا في ليلة العمر، لتكتمل سعادتنا بوجودكم إلى جانبنا ❤️',
      coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      coupleImageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80',
      ],
      musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-113264.mp3',
      musicTitle: 'موسيقى ليلة العمر الهادئة',
      themeId: themesMap['royal-burgundy'],
      isMultiEvent: true,
      rsvpEnabled: true,
      countdownEnabled: true,
      envelopeAnimationEnabled: true,
      eventDate: ahmedSaraDate,
      startDate: new Date('2026-09-01'),
      expiresAt: new Date('2026-12-31'),
      viewsCount: 284,
      uniqueVisitorsCount: 198,
    },
  });

  // Seed Sections for Ahmed & Sara
  await prisma.invitationSection.deleteMany({ where: { invitationId: inv1.id } });
  await prisma.invitationSection.createMany({
    data: DEFAULT_SECTIONS.map((sec, idx) => ({
      invitationId: inv1.id,
      sectionKey: sec.key,
      isEnabled: true,
      sortOrder: idx,
    })),
  });

  // Seed Multi-Events for Ahmed & Sara: 4 events in ONE link!
  await prisma.invitationEvent.deleteMany({ where: { invitationId: inv1.id } });
  await prisma.invitationEvent.createMany({
    data: [
      {
        invitationId: inv1.id,
        type: 'engagement',
        titleAr: 'حفل الخطوبة الرسمي',
        titleEn: 'Engagement Party',
        subtitleAr: 'أولى خطواتنا معاً في رحلة العمر',
        date: new Date('2026-10-15T18:00:00.000Z'),
        startTime: '06:00 م',
        endTime: '11:00 م',
        venueNameAr: 'فيلا جاردينيا - المعادي',
        addressAr: 'شارع النصر، المعادي، القاهرة',
        latitude: 29.9602,
        longitude: 31.2569,
        googleMapsUrl: 'https://maps.google.com/?q=Maadi+Cairo',
        descriptionAr: 'حفل استقبال عائلي أنيق بحضور الأهل والأصدقاء المقربين.',
        dressCodeAr: 'Formal / Semi-Formal',
        sortOrder: 1,
        isVisible: true,
      },
      {
        invitationId: inv1.id,
        type: 'henna',
        titleAr: 'ليلة الحنة المصرية 🌿',
        titleEn: 'Henna Night',
        subtitleAr: 'فرحة البنات وأجواء الحنة التراثية والزغاريد',
        date: new Date('2026-11-17T17:00:00.000Z'),
        startTime: '05:00 م',
        endTime: '11:00 م',
        venueNameAr: 'قاعة اللوتس - مصر الجديدة',
        addressAr: 'ميدان روكسي، مصر الجديدة، القاهرة',
        latitude: 30.0931,
        longitude: 31.3195,
        googleMapsUrl: 'https://maps.google.com/?q=Heliopolis+Cairo',
        descriptionAr: 'السهرة مخصصة تماماً للسيدات مع فريق دي جي نسائي وأجواء حنة مصرية مبهجة.',
        dressCodeAr: 'جلابيات حنة / فساتين سهرة ملونة',
        sortOrder: 2,
        isVisible: true,
        isHennaFemaleOnly: true,
      },
      {
        invitationId: inv1.id,
        type: 'katb_ketab',
        titleAr: 'عقد القران المبارك (كتب الكتاب) 📜',
        titleEn: 'Katb Ketab Ceremony',
        subtitleAr: 'على كتاب الله وسنة رسوله الكريم',
        date: new Date('2026-11-19T16:30:00.000Z'),
        startTime: '04:30 م',
        endTime: '07:00 م',
        venueNameAr: 'مسجد الشرطة - قاعة الكوثر - التجمع الخامس',
        addressAr: 'محور المشير طنطاوي، التجمع الخامس، القاهرة الجديدة',
        latitude: 30.0131,
        longitude: 31.4287,
        googleMapsUrl: 'https://maps.google.com/?q=Police+Mosque+New+Cairo',
        descriptionAr: 'عقد القران بمشيئة الله تعالى وتوزيع الحلوى والمشروبات.',
        dressCodeAr: 'Elegant Formal',
        sortOrder: 3,
        isVisible: true,
      },
      {
        invitationId: inv1.id,
        type: 'wedding',
        titleAr: 'ليلة العمر وحفل الزفاف الكبير 👑',
        titleEn: 'Wedding Reception',
        subtitleAr: 'الزفة الكبرى وحفل العشاء الملكي',
        date: new Date('2026-11-20T19:00:00.000Z'),
        startTime: '07:00 م',
        endTime: '02:00 ص',
        venueNameAr: 'فندق ماريوت الزمالك - قاعة عايدة الملكية',
        addressAr: '١٦ شارع سراي الجزيرة، الزمالك، القاهرة',
        latitude: 30.0571,
        longitude: 31.2248,
        googleMapsUrl: 'https://maps.google.com/?q=Cairo+Marriott+Hotel+Zamalek',
        descriptionAr: 'الزفة الكبرى في تمام الساعة الثامنة مساءً يليها حفل العشاء الملكي والفقرات الموسيقية.',
        dressCodeAr: 'Black Tie / Evening Gowns',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        sortOrder: 4,
        isVisible: true,
      },
      {
        invitationId: inv1.id,
        type: 'reception',
        titleAr: 'حفل الاستقبال الصباحي العائلي ☀️',
        titleEn: 'Morning Family Reception',
        subtitleAr: 'لقاء عائلي دافئ على ضفاف النيل لتوديع العروسين',
        date: new Date('2026-11-21T10:00:00.000Z'),
        startTime: '10:00 ص',
        endTime: '02:00 م',
        venueNameAr: 'مركب الباشا ع النيل - صالون البانوراما',
        addressAr: 'شارع النيل، الدقي، الجيزة، مصر',
        latitude: null,
        longitude: null,
        googleMapsUrl: null,
        descriptionAr: 'فطور واستقبال عائلي هادئ لتوديع العروسين بحضور الأهل والمقربين.',
        dressCodeAr: 'Smart Casual',
        sortOrder: 5,
        isVisible: true,
      },
    ],
  });

  // Create Order & Verified InstaPay Payment for Ahmed & Sara
  const order1 = await prisma.order.upsert({
    where: { orderNumber: 'FARAH-100201' },
    update: {},
    create: {
      orderNumber: 'FARAH-100201',
      customerId: customer1.id,
      invitationId: inv1.id,
      amount: 95.0,
      currency: 'EGP',
      status: 'published',
      notes: 'تم الدفع عبر إنستاباي بنجاح واعتماد نشر الدعوة مباشرة',
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order1.id,
      customerId: customer1.id,
      amount: 95.0,
      currency: 'EGP',
      method: 'instapay',
      status: 'verified',
      referenceNumber: 'INSTA-EG-99882211',
      paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
      notes: 'تمت مراجعة التحويل ومطابقته على حساب فرحنا إنستاباي',
      verifiedAt: new Date(),
      verifiedById: adminUser.id,
    },
  });

  // Seed sample RSVPs for Ahmed & Sara
  await prisma.rSVP.createMany({
    data: [
      {
        invitationId: inv1.id,
        name: 'د. حسام الشافعي',
        phone: '01055554433',
        attendanceStatus: 'attending',
        guestCount: 2,
        message: 'ألف مليون مبروك لأجمل عريسين، إن شاء الله نكون أول الحاضرين في ليلة العمر!',
      },
      {
        invitationId: inv1.id,
        name: 'م. ندى الكردي',
        phone: '01233445566',
        attendanceStatus: 'attending',
        guestCount: 1,
        message: 'مبروك يا سارة يا قمر، فرحتلك من كل قلبي وراجعة مخصوص من السفر لحضور الحنة والفرح ❤️',
      },
    ],
  });

  // B. Single Event Demo: Omar & Salma (Engagement)
  const omarSalmaDate = new Date('2026-10-30T18:00:00.000Z');
  const inv2 = await prisma.invitation.upsert({
    where: { slug: 'omar-salma' },
    update: {},
    create: {
      customerId: customer2.id,
      slug: 'omar-salma',
      title: 'دعوة خطوبة عمر وسلمى 💍',
      type: 'engagement',
      status: 'published',
      privacy: 'public',
      previewToken: 'preview-token-omar-salma-2026',
      coupleGroomAr: 'عمر خالد',
      coupleBrideAr: 'سلمى الشريف',
      weddingMessageAr:
        'يسعدنا أن نشارككم فرحة خطوبتنا في أمسية عائلية هادئة تسعدنا برؤيتكم ❤️',
      coverImageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
      coupleImageUrl: 'https://images.unsplash.com/photo-1621621667797-e06afc21b56a?auto=format&fit=crop&w=800&q=80',
      themeId: themesMap['elegant-gold'],
      isMultiEvent: false,
      rsvpEnabled: true,
      countdownEnabled: true,
      envelopeAnimationEnabled: true,
      eventDate: omarSalmaDate,
      viewsCount: 142,
      uniqueVisitorsCount: 95,
    },
  });

  await prisma.invitationSection.deleteMany({ where: { invitationId: inv2.id } });
  await prisma.invitationSection.createMany({
    data: DEFAULT_SECTIONS.map((sec, idx) => ({
      invitationId: inv2.id,
      sectionKey: sec.key,
      isEnabled: sec.key !== 'henna_special',
      sortOrder: idx,
    })),
  });

  await prisma.invitationEvent.deleteMany({ where: { invitationId: inv2.id } });
  await prisma.invitationEvent.create({
    data: {
      invitationId: inv2.id,
      type: 'engagement',
      titleAr: 'حفل خطوبة عمر وسلمى',
      date: omarSalmaDate,
      startTime: '06:00 م',
      endTime: '11:00 م',
      venueNameAr: 'سكاي إكزيكتيف لاونج - التجمع الخامس',
      addressAr: 'شارع التسعين الشمالي، التجمع الخامس، القاهرة',
      latitude: 30.0279,
      longitude: 31.4721,
      googleMapsUrl: 'https://maps.google.com/?q=New+Cairo+90th',
      descriptionAr: 'نحتفل معاً بمناسبة خطوبتنا في أجواء ساحرة تطل على القاهرة الجديدة.',
      dressCodeAr: 'Cocktail Attire',
      sortOrder: 1,
      isVisible: true,
    },
  });

  // 7. Seed Media records for Ahmed & Sara
  await prisma.media.deleteMany({ where: { invitationId: inv1.id } });
  await prisma.media.createMany({
    data: [
      {
        invitationId: inv1.id,
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        publicId: 'farahna/ahmed-sara/cover',
        type: 'image',
        caption: 'صورة الغلاف الرسمية لزفاف أحمد وسارة',
        sortOrder: 1,
      },
      {
        invitationId: inv1.id,
        url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
        publicId: 'farahna/ahmed-sara/couple-main',
        type: 'image',
        caption: 'جلسة التصوير في حديقة الأندلس بالزمالك',
        sortOrder: 2,
      },
      {
        invitationId: inv1.id,
        url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-113264.mp3',
        publicId: 'farahna/ahmed-sara/background-audio',
        type: 'audio',
        caption: 'موسيقى ليلة العمر الهادئة',
        sortOrder: 3,
      },
    ],
  });

  // 8. Seed Guest list for Ahmed & Sara
  await prisma.guest.deleteMany({ where: { invitationId: inv1.id } });
  await prisma.guest.createMany({
    data: [
      {
        invitationId: inv1.id,
        name: 'د. حسام الشافعي',
        phone: '01055554433',
        inviteCode: 'GUEST-HOSSAM-01',
        isAttending: true,
        guestCount: 2,
        tableNumber: 'VIP-01',
        checkInStatus: 'pending',
      },
      {
        invitationId: inv1.id,
        name: 'م. ندى الكردي',
        phone: '01233445566',
        inviteCode: 'GUEST-NADA-02',
        isAttending: true,
        guestCount: 1,
        tableNumber: 'Table-04',
        checkInStatus: 'pending',
      },
      {
        invitationId: inv1.id,
        name: 'أ. طارق علام',
        phone: '01000000000',
        inviteCode: 'GUEST-TAREK-03',
        isAttending: true,
        guestCount: 2,
        tableNumber: 'Table-05',
        checkInStatus: 'pending',
      },
    ],
  });

  // 9. Seed Leads Pipeline
  await prisma.lead.createMany({
    data: [
      {
        name: 'مروان إبراهيم',
        phone: '01022334455',
        whatsapp: '201022334455',
        source: 'whatsapp',
        eventType: 'wedding',
        selectedTheme: 'royal-burgundy',
        status: 'awaiting_payment',
        notes: 'تم إرسال رابط المعاينة وينتظر تحويل إنستاباي',
      },
      {
        name: 'دينا سمير',
        phone: '01199887766',
        whatsapp: '201199887766',
        source: 'instagram',
        eventType: 'henna',
        selectedTheme: 'romantic-floral',
        status: 'details_received',
        notes: 'استلمنا بيانات القاعة وجاري إعداد التصميم',
      },
    ],
  });

  console.log('🎉 Database seeding completed successfully with all Egyptian demo invitations, media, guests & multi-event journeys!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
