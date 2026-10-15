import React from 'react';

export function LandingJsonLd({
  siteUrl = 'https://farahna.menuflowx.com',
  whatsappNumber = '201019262075',
}: {
  siteUrl?: string;
  whatsappNumber?: string;
}) {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#organization`,
    name: 'فرحنا — Farahna',
    alternateName: [
      'منصة فرحنا لدعوات الأفراح الإلكترونية',
      'فرحنا لتصميم كروت الأفراح الرقمية في مصر',
      'Farahna Digital Wedding Invitations Egypt',
    ],
    url: siteUrl,
    logo: `${siteUrl}/favicon.png`,
    image: `${siteUrl}/favicon.png`,
    description:
      'المنصة المصرية الأولى لتصميم دعوات الأفراح والمناسبات الرقمية الفاخرة. دعوة تفاعلية تجمع كل محطات فرحتكم (الخطوبة، الحنة، كتب الكتاب، والفرح) في رابط واحد أنيق مع تأكيد الحضور الذكي وخريطة القاعة.',
    telephone: `+${whatsappNumber}`,
    priceRange: '350 - 950 EGP',
    currenciesAccepted: 'EGP, SAR, AED, USD',
    paymentAccepted: 'InstaPay, Vodafone Cash, Bank Transfer',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'شارع التسعين الجنوبي، التجمع الخامس',
      addressLocality: 'القاهرة',
      addressRegion: 'محافظة القاهرة',
      postalCode: '11835',
      addressCountry: 'EG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 30.0444,
      longitude: 31.2357,
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'القاهرة' },
      { '@type': 'AdministrativeArea', name: 'الجيزة' },
      { '@type': 'AdministrativeArea', name: 'الإسكندرية' },
      { '@type': 'AdministrativeArea', name: 'التجمع الخامس' },
      { '@type': 'AdministrativeArea', name: 'الشيخ زايد' },
      { '@type': 'AdministrativeArea', name: 'مدينة ٦ أكتوبر' },
      { '@type': 'AdministrativeArea', name: 'المنصورة' },
      { '@type': 'AdministrativeArea', name: 'طنطا' },
      { '@type': 'AdministrativeArea', name: 'بورسعيد' },
      { '@type': 'Country', name: 'مصر (Egypt)' },
      { '@type': 'Country', name: 'المملكة العربية السعودية' },
      { '@type': 'Country', name: 'الإمارات العربية المتحدة' },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '09:00',
      closes: '23:59',
    },
    sameAs: [
      'https://www.facebook.com/profile.php?id=61595083454281',
      'https://www.instagram.com/farahna.10/',
    ],
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'فرحنا — دعوة فرحك الإلكترونية الفاخرة | Farahna',
    description: 'المنصة المصرية المتخصصة في كروت ودعوات الأفراح الرقمية التفاعلية مع نظام تأكيد الحضور وخريطة القاعة.',
    inLanguage: 'ar-EG',
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteUrl}/#service`,
    name: 'تصميم دعوات الأفراح والمناسبات الإلكترونية التفاعلية',
    serviceType: 'Digital Wedding Invitations & Multi-Event RSVP',
    provider: {
      '@id': `${siteUrl}/#organization`,
    },
    areaServed: {
      '@type': 'Country',
      name: 'مصر (Egypt)',
    },
    description:
      'خدمة تصميم دعوات زفاف وخطوبة وحنة وكتب كتاب تفاعلية فاخرة تشمل: نظام المناسبات المتعددة برابط واحد، خريطة تفاعلية بنقرة واحدة عبر GPS، تأكيد الحضور RSVP، موسيقى مخصصة، وحفظ الموعد في تقويم الهاتف.',
    offers: {
      '@type': 'Offer',
      price: '500',
      priceCurrency: 'EGP',
      availability: 'https://schema.org/InStock',
      description: 'الدفع متاح عبر InstaPay أو فودافون كاش بعد المعاينة والاعتماد التام بنسبة ١٠٠٪.',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'باقات دعوات فرحنا',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'دعوة زفاف أساسية — مناسبة واحدة',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'دعوة زفاف VIP — ثيمات فاخرة وتخصيص كامل',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'باقة الرحلة الشاملة — الخطوبة والحنة وكتب الكتاب والفرح في رابط واحد',
          },
        },
      ],
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'نماذج الدعوات الحية',
        item: `${siteUrl}/#demos`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'باقات الأسعار',
        item: `${siteUrl}/#pricing`,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'إزاي بيتم الدفع؟ وهل فيه دفع أونلاين؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'لا نطلب أي دفع أونلاين بالفيزا أو كروت بنكية. الدفع متاح عبر InstaPay أو فودافون كاش — التحويل يتم يدوياً بعد أن نصمم دعوتك بالكامل وتراجعها عبر رابط المعاينة وتعتمدها بنسبة ١٠٠٪، وسيتم إرسال تفاصيل الدفع لحضرتك على واتساب مباشرة.',
        },
      },
      {
        '@type': 'Question',
        name: 'هل ضيوفي محتاجين ينزلوا تطبيق أو يسجلوا حساب لفتح الدعوة؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'إطلاقاً! الضيف بيستلم منك اللينك على واتساب أو ماسنجر، ويضغط عليه يفتح فوراً في متصفح الموبايل خلال ثانية واحدة بدون أي تسجيل أو تنزيل تطبيقات.',
        },
      },
      {
        '@type': 'Question',
        name: 'إيه فايدة تجميع المناسبات (الخطوبة، الحنة، كتب الكتاب، الفرح) في لينك واحد؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'بدل تشتيت المعازيم بـ ٤ لينكات مختلفة ورسائل تضيع وسط الشات، ضيوفك بيلاقوا كل محطات فرحتكم منظمة في مكان واحد، وكل مناسبة ليها معادها ومكانها بالخريطة وزرار التقويم الخاص بيها.',
        },
      },
      {
        '@type': 'Question',
        name: 'لو ميعاد أو مكان قاعة اتغير، هل ينفع أعدل في الدعوة بعد ما نشرتها؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'نعم بكل تأكيد! فريق فرحنا بيحدث بيانات القاعة أو الميعاد فوراً، واللينك اللي عند ضيوفك بيظهر فيه التعديل فوراً بدون الحاجة لإنشاء أو إرسال لينك جديد.',
        },
      },
      {
        '@type': 'Question',
        name: 'هل ليلة الحنة ليها خصوصية لو هي خاصة بالسيدات فقط؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'نعم، نوفر قسماً مخصصاً لليلة الحنة نقدر نحدد فيه وسم خاص بالسيدات فقط، ونضيف فيه إرشادات الدريس كود وممنوع اصطحاب الأطفال أو التصوير حسب رغبتكم.',
        },
      },
      {
        '@type': 'Question',
        name: 'هل الدعوة سريعة وما بتسحبش باقة الموبايل؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'دعوات فرحنا مبنية بأحدث تقنيات الويب العالمية، والصور بتنزل بجودة عالية ومضغوطة تلقائياً بتقنية WebP عشان تفتح بسرعة البرق حتى على شبكات 3G وباقات النت الضعيفة في مصر.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
