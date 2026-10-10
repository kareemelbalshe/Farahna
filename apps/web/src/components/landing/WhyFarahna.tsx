'use client';

import React from 'react';
import {
  Coins,
  Layers,
  RefreshCw,
  Navigation,
  UserCheck,
  ShieldCheck,
  Zap,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';
import { getWhatsAppUrl, createInquiryWhatsAppMessage } from '@/lib/whatsapp';

interface WhyFarahnaProps {
  whatsappNumber?: string;
}

const REASONS = [
  {
    icon: Coins,
    title: 'توفير أكثر من ٧٠٪ من تكلفة الطباعة',
    description:
      'طباعة ٢٠٠ كارت ورقي فاخر بتكلف ما بين ٣,٠٠٠ إلى ٧,٠٠٠ جنيه وغالباً بيترمي بعد أسبوع! في فرحنا لينك إلكتروني واحد فاخر يوصل لعدد لا نهائي من المعازيم بربع التكلفة.',
    tag: 'وفر ميزانيتك 💰',
  },
  {
    icon: Layers,
    title: 'كل مراحل فرحتك في رابط واحد متكامل',
    description:
      'بدل ما تبعت ٤ مسدجات مختلفة بروابط مشتتة، لينك فرحنا بيجمع (الخطوبة، الحنة، كتب الكتاب، والفرح) مع تبويبات ذكية مريحة للمعازيم.',
    tag: 'تنظيم بلا تشتيت ✨',
  },
  {
    icon: RefreshCw,
    title: 'تعديل فوري في أي لحظة بدون إعادة طباعة',
    description:
      'لو حصل أي تغيير في ميعاد الزفة، أو رقم بوابة القاعة، أو حتى مكان المناسبة، بنعدلهولك فوراً وبيظهر عند كل المعازيم في نفس اللحظة.',
    tag: 'مرونة كاملة 🔄',
  },
  {
    icon: Navigation,
    title: 'مفيش معازيم هيتوهوا في الطريق بعد النهاردة',
    description:
      'توجيه GPS مباشر بزرار واحد يفتح تطبيق Google Maps على موبايل الضيف ويوصله لبوابة القاعة بالظبط مع تعليمات الركنة والـ Valet.',
    tag: 'وصول سهل للقاعة 🚗',
  },
  {
    icon: UserCheck,
    title: 'تأكيد الحضور الذكي (RSVP) وتنظيم البوفيه',
    description:
      'اعرف مين هيحضر ومين هيعتذر، واحصر عدد الأفراد والمرافقين بدقة عشان تظبط أعداد الكراسي ووجبات البوفيه من غير أي هدر.',
    tag: 'تنظيم محكم 📋',
  },
  {
    icon: ShieldCheck,
    title: 'خصوصية تامة وبدون إعلانات مزعجة',
    description:
      'دعوتكم خاصة بالكامل، غير مفهرسة في محركات البحث ولا يراها إلا من يحمل اللينك، وخالية تماماً من أي إعلانات أو بنرات تشوه فخامة مناسبتكم.',
    tag: 'أمان وخصوصية 🔒',
  },
];

export function WhyFarahna({ whatsappNumber = '201019262075' }: WhyFarahnaProps) {
  const whatsappUrl = getWhatsAppUrl(
    whatsappNumber,
    createInquiryWhatsAppMessage(undefined, 'استفسار عن مميزات فرحنا')
  );

  return (
    <section id="why-farahna" className="py-20 lg:py-28 bg-[#FAF7F2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-[#720925] border border-rose-200 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            الفارق الحقيقي
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight font-cairo">
            ليه تختار <span className="text-[#720925]">فرحنا</span> <br />
            لبطاقة دعوتكم الرقمية؟
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            وداعاً لمشاكل الكروت الورقية الضائعة واللوكيشن المكتوب غلط... فرحنا صُممت خصيصاً علشان تفرحوا بدون أي قلق أو إحراج مع المعازيم.
          </p>
        </div>

        {/* 6 Reasons Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REASONS.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-stone-200/80 p-8 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 text-right flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-[#720925]">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                      {reason.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-stone-900 font-cairo leading-snug">
                    {reason.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {reason.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>مضمونة ومجربة في مئات الأفراح المصرية</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 rounded-3xl burgundy-gradient-bg text-white p-8 lg:p-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-right">
          <div className="space-y-2">
            <h3 className="text-2xl font-black font-cairo">
              عايز تعمل دعوة تشرفك قدام كل قرايبك وحبايبك؟
            </h3>
            <p className="text-rose-100 text-sm max-w-xl">
              تواصل مع فريق فرحنا على واتساب، بنجهزلك النموذج التجريبي خلال ساعات والدفع عبر InstaPay أو فودافون كاش بعد ما تطمن وتعتمد كل تفصيلة!
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-[#720925] font-black text-sm hover:bg-stone-50 shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>اعمل دعوتك دلوقتي ❤️</span>
          </a>
        </div>
      </div>
    </section>
  );
}
