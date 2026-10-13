'use client';

import React from 'react';
import Link from 'next/link';
import { Check, MessageCircle, Sparkles } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface PricingSectionProps {
  whatsappNumber?: string;
}

const PACKAGES = [
  {
    name: 'باقة المناسبة الواحدة',
    slug: 'basic',
    price: 50,
    currency: 'ج.م',
    duration: 'صلاحية شهر كامل',
    badge: 'مثالية للخطوبة أو كتب الكتاب',
    isPopular: false,
    features: [
      'مناسبة واحدة (فرح أو خطوبة أو كتب كتاب)',
      'تصميم مخصص بأسماء العروسين وصورهم',
      'خريطة تفاعلية للموقع والاتجاهات',
      'عداد تنازلي لموعد المناسبة',
      'مشاركة سريعة عبر واتساب ومسنجر',
      'تعديلات مجانية حتى الاعتماد',
    ],
  },
  {
    name: 'باقة رحلة الفرح الشاملة',
    slug: 'wedding-journey',
    price: 95,
    currency: 'ج.م',
    duration: 'صلاحية ٣ شهور',
    badge: 'الأكثر طلباً والأفضل قيمة 👑',
    isPopular: true,
    features: [
      'رحلة الفرح كاملة برابط واحد (خطوبة + حنة + كتب كتاب + فرح)',
      'تبويبات تنقل ذكية بين المناسبات',
      'فتح الظرف التفاعلي الفاخر',
      'مشغل موسيقى هادئة بنقرة واحدة',
      'تأكيد الحضور (RSVP) وحصر الضيوف',
      'إضافة الموعد لتقويم Google و Apple',
      'رمز QR Code عالي الدقة للطباعة',
      'دعم تعديل أي موعد في أي وقت',
    ],
  },
  {
    name: 'باقة التصميم الخاص VIP',
    slug: 'luxury-vip',
    price: 150,
    currency: 'ج.م',
    duration: 'صلاحية ٦ شهور',
    badge: 'فخامة ملكية وتخصيص كامل',
    isPopular: false,
    features: [
      'كل مميزات باقة رحلة الفرح الشاملة',
      'تخصيص كامل للألوان والخطوط والزخارف',
      'قسم ليلة الحنة المخصص للسيدات بخصوصية تامة',
      'معرض صور غير محدود لجلسة التصوير',
      'إمكانية حجز اسم نطاق خاص (Custom Domain)',
      'أولوية تصميم وتسليم خلال ساعات',
    ],
  },
];

export function PricingSection({ whatsappNumber = '201019262075' }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
            أسعار واضحة ومناسبة
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight font-cairo">
            باقات فرحنا <br />
            <span className="text-[#720925]">استثمار بسيط لذكرى تدوم طول العمر</span>
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            لا توجد مصاريف خفية، والتعديلات مجانية حتى ينال التصميم رضاكم التام. الدفع متاح عبر إنستاباي أو فودافون كاش بعد اعتماد المعاينة.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PACKAGES.map((pkg) => {
            const message = `مرحباً، حابب أطلب [${pkg.name}] بسعر ${pkg.price} ج.م من منصة فرحنا ❤️`;
            const whatsappUrl = getWhatsAppUrl(whatsappNumber, message);

            return (
              <div
                key={pkg.slug}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  pkg.isPopular
                    ? 'bg-gradient-to-b from-[#FAF7F2] to-amber-50/40 border-2 border-amber-500 shadow-2xl scale-[1.02]'
                    : 'bg-white border border-stone-200/80 shadow-md hover:shadow-xl'
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-4 right-1/2 translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-white font-black text-xs shadow-md">
                    الباقة المفضلة للعرسان ✨
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold text-[#720925] bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                      {pkg.badge}
                    </span>
                    <h3 className="text-2xl font-black text-stone-900 font-cairo mt-3">{pkg.name}</h3>
                    <p className="text-xs text-stone-500 mt-1">{pkg.duration}</p>
                  </div>

                  {/* Price display */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-stone-900 font-cairo">{pkg.price}</span>
                    <span className="text-lg font-bold text-stone-600">{pkg.currency}</span>
                    <span className="text-xs text-stone-400 mr-2">/ تدفع مرة واحدة فقط</span>
                  </div>

                  {/* Features list */}
                  <div className="space-y-3 pt-4 border-t border-stone-100">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-stone-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-8 space-y-2.5">
                  <Link
                    href={`/create?package=${pkg.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 shadow-md shadow-amber-500/20 transition-all active:scale-95 border border-amber-400 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-stone-950" />
                    <span>صمم دعوتك بهذه الباقة فوراً 🪄</span>
                  </Link>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-xs shadow-xs transition-all active:scale-95 ${
                      pkg.isPopular
                        ? 'burgundy-gradient-bg text-white shadow-rose-950/20 hover:opacity-95'
                        : 'bg-stone-900 text-white hover:bg-stone-800'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>أو اطلب من المصمم عبر واتساب</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
