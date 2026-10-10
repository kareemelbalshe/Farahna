'use client';

import React from 'react';
import { Crown, Sparkles, BookOpen, Gem, ArrowLeft, Check, Layers } from 'lucide-react';
import { getWhatsAppUrl, createInquiryWhatsAppMessage } from '@/lib/whatsapp';

interface InvitationTypesProps {
  whatsappNumber?: string;
}

const TYPES = [
  {
    id: 'wedding',
    title: 'دعوة زفاف ملكية',
    sub: 'ليلة العمر الكبرى 👑',
    category: 'فرح / زفاف',
    icon: Crown,
    badge: 'الاحتفال الرئيسي',
    badgeColor: 'bg-rose-100 text-[#720925] border-rose-200',
    description:
      'التفاصيل الفاخرة للزفاف، قاعة الأفراح، الزفة، البوفيه، كود الملابس (Dress Code)، وأزرار تأكيد الحضور وخريطة الوصول الدقيقة.',
    points: [
      'تأكيد الحضور الذكي وحصر المعازيم (RSVP)',
      'خريطة قاعة الفرح وتوجيه GPS بنقرة واحدة',
      'مشغل موسيقى هادئة بدون تشغيل تلقائي',
      'معرض صور فوتوسيشن العروسين',
    ],
    ctaText: 'اطلب دعوة زفاف ❤️',
  },
  {
    id: 'henna',
    title: 'ليلة الحنة المصرية',
    sub: 'سهرة البنات والزغاريد 🌿',
    category: 'ليلة الحنة',
    icon: Sparkles,
    badge: 'خصوصية تامة للسيدات',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description:
      'تصميم مبهج مستوحى من طقوس الحنة المصرية الأصيلة، مع وسم خاص بالسيدات فقط وتنبيهات منع التصوير أو كود اللباس التراثي.',
    points: [
      'وسم بارز "خاص بالسيدات فقط"',
      'تنبيهات احترام الخصوصية ومنع التصوير',
      'تفاصيل الدريس كود وطقوس الحنة',
      'خريطة مكان الحنة بدقة وسرية',
    ],
    ctaText: 'اطلب دعوة حنة 🌿',
  },
  {
    id: 'katb_ketab',
    title: 'عقد قران وكتب كتاب',
    sub: 'اللحظة الشرعية المباركة 📜',
    category: 'كتب كتاب / عقد قران',
    icon: BookOpen,
    badge: 'طابع إسلامي مهيب',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    description:
      'طابع روحاني وإسلامي أنيق ومريح للعين، يناسب المساجد ودور المناسبات الكبرى، مع الآيات القرآنية والأدعية والتوقيت الدقيق.',
    points: [
      'آيات قرآنية وأدعية مباركة بخط عربي أصيل',
      'موقع المسجد / دار المناسبات مع بوابات الدخول',
      'زر إضافة للتقويم للتذكير قبل الموعد',
      'مشاركة سريعة عبر رسائل واتساب العائلية',
    ],
    ctaText: 'اطلب دعوة كتب كتاب 📜',
  },
  {
    id: 'engagement',
    title: 'حفل خطوبة رومانسي',
    sub: 'بداية رحلة الحب والعمر 💍',
    category: 'حفل خطوبة',
    icon: Gem,
    badge: 'رومانسي وشيك',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
    description:
      'دعوة عصرية ناعمة تعلن بداية الخطوبة والارتباط السعيد، مخصصة للقاعات المفتوحة والفيلات والاحتفالات العائلية الراقية.',
    points: [
      'ألوان رومانسية ناعمة وتنسيق فوتوغرافي',
      'مواعيد الحفل وبداية استقبال الضيوف',
      'صور فوتوسيشن الخطوبة بجودة عالية',
      'رابط خفيف وسريع الفتح لجميع المعازيم',
    ],
    ctaText: 'اطلب دعوة خطوبة 💍',
  },
];

export function InvitationTypes({ whatsappNumber = '201019262075' }: InvitationTypesProps) {
  return (
    <section id="types" className="py-20 lg:py-28 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-[#720925] border border-rose-200 text-xs font-bold">
            <Layers className="w-3.5 h-3.5 text-[#720925]" />
            أنواع الدعوات المتاحة
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight font-cairo">
            دعوات مخصصة لكل <br />
            <span className="text-[#720925]">مناسبات الفرح المصرية ❤️</span>
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            سواء كنت حابب تعمل دعوة لمناسبة واحدة، أو تجمع كل مراحل فرحتكم في رابط موحد، فرحنا بتقدملك التصميم والتجربة اللي تليق بيكم.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TYPES.map((t) => {
            const Icon = t.icon;
            const waUrl = getWhatsAppUrl(
              whatsappNumber,
              createInquiryWhatsAppMessage(undefined, t.category)
            );

            return (
              <div
                key={t.id}
                className="group relative rounded-3xl bg-white border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-[#720925] group-hover:bg-[#720925] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${t.badgeColor}`}
                    >
                      {t.badge}
                    </span>
                  </div>

                  {/* Title & Sub */}
                  <div>
                    <h3 className="text-xl font-black text-stone-900 font-cairo group-hover:text-[#720925] transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-xs font-bold text-amber-700 mt-0.5">{t.sub}</p>
                  </div>

                  <p className="text-stone-600 text-xs leading-relaxed">{t.description}</p>

                  {/* Points */}
                  <div className="pt-2 space-y-2 border-t border-stone-100">
                    {t.points.map((p, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[12px] text-stone-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-6">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl burgundy-gradient-bg text-white font-bold text-xs shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity"
                  >
                    <span>{t.ctaText}</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Multi-event callout pill */}
        <div className="mt-10 p-4 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-black text-stone-900">
                مش لازم تختار مناسبة واحدة بس!
              </p>
              <p className="text-xs text-stone-600">
                تقدر تجمع (الخطوبة + الحنة + كتب الكتاب + الفرح) في رابط موحد وبسعر باقة واحدة موفرة.
              </p>
            </div>
          </div>

          <a
            href={getWhatsAppUrl(whatsappNumber, createInquiryWhatsAppMessage('باقة رحلة الفرح الشاملة'))}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all"
          >
            استفسر عن باقة رحلة الفرح 👑
          </a>
        </div>
      </div>
    </section>
  );
}
