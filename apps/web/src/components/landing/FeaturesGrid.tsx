'use client';

import React from 'react';
import {
  MailOpen,
  CalendarDays,
  MapPin,
  CheckCircle,
  Music2,
  Image as ImageIcon,
  Sparkles,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

const FEATURES = [
  {
    icon: MailOpen,
    title: 'حركات فتح 3D تفاعلية متنوعة',
    description: 'تجربة استقبال مبهرة للضيف بـ ٤ أنماط فتح: بوابات القصر المزدوجة (Gatefold)، ختم الشمع الملكي، الجراب المنزلق، وتفتح بتلات الورد.',
  },
  {
    icon: CalendarDays,
    title: 'إضافة الموعد لتقويم الهاتف',
    description: 'بنقرة واحدة الضيف يحفظ موعد الفرح أو الحنة في Google Calendar أو Apple Calendar بتوقيت القاهرة.',
  },
  {
    icon: MapPin,
    title: 'خريطة تفاعلية واتجاهات GPS',
    description: 'خريطة حية دقيقة بدون اعتماد معقد، مع زر "احصل على الاتجاهات" يفتح Google Maps مباشرة.',
  },
  {
    icon: CheckCircle,
    title: 'تأكيد الحضور الذكي (RSVP)',
    description: 'حصر دقيق لعدد الضيوف والمرافقين مع إمكانية كتابة رسائل تهنئة خاصة للعروسين.',
  },
  {
    icon: Music2,
    title: 'موسيقى رومانسية بنقرة واحدة',
    description: 'مشغل صوتي أنيق لا يعمل تلقائياً احتراماً للخصوصية، مع تحكم كامل بالصوت والإيقاف.',
  },
  {
    icon: Sparkles,
    title: 'قسم ليلة الحنة المخصص 🌿',
    description: 'تصميم خاص للسيدات فقط مع تنبيهات اللباس وتعليمات الفرح بخصوصية تامة.',
  },
  {
    icon: ImageIcon,
    title: 'معرض صور جلسة التصوير',
    description: 'استعراض فوتوغرافي عالي الدقة لصور الخطوبة والـ Photo Session متوافق مع الموبايل.',
  },
  {
    icon: QrCode,
    title: 'رمز QR Code جاهز للطباعة',
    description: 'كود QR فوري عالي الدقة لوضعه على كروت الفرح المطبوعة أو عند مدخل قاعة الفرح.',
  },
  {
    icon: ShieldCheck,
    title: 'خصوصية وأمان كامل',
    description: 'رابط دعوتك غير مفهرس لمحركات البحث ويبقى سرياً وخاصاً بك وبعائلتك فقط.',
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-white border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
            كل ما تحتاجه دعوتكم
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight font-cairo">
            مميزات مصممة خصيصاً <br />
            <span className="text-[#720925]">لتبهر ضيوفكم وتريح بالكم</span>
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            كل تفصيلة في دعوة فرحنا محسوبة لتجمع بين الذوق المصري الراقي وسهولة الاستخدام للجميع.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#FAF7F2] border border-stone-200/80 hover:border-amber-300 hover:shadow-xl transition-all duration-300 space-y-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-[#720925] shadow-xs group-hover:bg-[#720925] group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 font-cairo">{feature.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed font-normal">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
