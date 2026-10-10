import React from 'react';

export function LandingJsonLd({
  siteUrl = 'https://farahna.menuflowx.com',
  whatsappNumber = '201019262075',
}: {
  siteUrl?: string;
  whatsappNumber?: string;
}) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'فرحنا — Farahna',
    alternateName: 'منصة فرحنا لدعوات الأفراح الإلكترونية',
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    description:
      'المنصة المصرية الأولى لتصميم دعوات الأفراح والمناسبات الرقمية الفاخرة. دعوة تفاعلية تجمع كل محطات فرحتكم في رابط واحد أنيق.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${whatsappNumber}`,
      contactType: 'customer service',
      areaServed: 'EG',
      availableLanguage: ['Arabic', 'English'],
    },
    sameAs: ['https://instagram.com/farahna_eg', 'https://facebook.com/farahna.eg'],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'تصميم دعوات الأفراح والمناسبات الإلكترونية التفاعلية',
    serviceType: 'Digital Wedding Invitations & Multi-Event RSVP',
    provider: {
      '@type': 'Organization',
      name: 'فرحنا — Farahna',
    },
    areaServed: {
      '@type': 'Country',
      name: 'مصر (Egypt)',
    },
    description:
      'دعوات زفاف وخطوبة وحنة وكتب كتاب تفاعلية فاخرة تشمل: نظام المناسبات المتعددة برابط واحد، خريطة تفاعلية بنقرة واحدة، تأكيد الحضور RSVP، موسيقى مخصصة، وحفظ الموعد في تقويم الهاتف.',
    offers: {
      '@type': 'Offer',
      price: '500',
      priceCurrency: 'EGP',
      availability: 'https://schema.org/InStock',
      description: 'الدفع متاح عبر InstaPay أو فودافون كاش بعد المعاينة والاعتماد التام بنسبة ١٠٠٪.',
    },
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
          text: 'دعوات فرحنا مبنية بأحدث تقنيات الويب العالمية، والصور بتنزل بجودة عالية ومضغوطة تلقائياً بتقنية WebP عشان تفتح بسرعة البرق حتى على شبكات 3G وباقات النت الضعيفة.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
