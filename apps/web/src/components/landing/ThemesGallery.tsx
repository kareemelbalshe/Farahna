'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, MessageCircle, Sparkles, Check } from 'lucide-react';
import { getWhatsAppUrl, createInquiryWhatsAppMessage } from '@/lib/whatsapp';

interface ThemesGalleryProps {
  whatsappNumber?: string;
}

const THEMES_DATA = [
  {
    name: 'Royal Burgundy',
    nameAr: 'الملكي البورجوندي',
    slug: 'royal-burgundy',
    demoUrl: '/invitation/wedding/ahmed-sara',
    description: 'أفخم ألوان الأعراس الملكية بتناغم العنابي الداكن مع خطوط الذهب وختم الشمع التفاعلي.',
    bgClass: 'bg-[#720925]',
    accentColor: '#D4AF37',
    badge: 'الأكثر شهرة 👑',
    features: ['ختم شمع عنابي', 'زخارف ذهبية بارزة', 'مثالي لقصور الأفراح والفنادق'],
  },
  {
    name: 'Elegant Gold',
    nameAr: 'الذهبي الفاخر Dark Mode',
    slug: 'elegant-gold',
    demoUrl: '/invitation/engagement/omar-salma',
    description: 'طابع ليلي درامي ساحر بخلفية فحمية عميقة وتفاصيل من رقائق الذهب الإيطالي.',
    bgClass: 'bg-[#151516]',
    accentColor: '#B8860B',
    badge: 'عصري وفاخر ✨',
    features: ['خلفية دارك مود', 'خط عربي حديث', 'تأثير لمعان الذهب'],
  },
  {
    name: 'Minimal White',
    nameAr: 'الأبيض الهادئ النقي',
    slug: 'minimal-white',
    demoUrl: '/invitation/wedding/ahmed-sara',
    description: 'بساطة راقية تناسب عشاق الهدوء والفخامة غير المتكلفة بحواف ناعمة وظلال دافئة.',
    bgClass: 'bg-[#FFFFFF] border-2 border-stone-200 text-stone-900',
    accentColor: '#8C8C8C',
    badge: 'بساطة أوروبية 🕊️',
    features: ['تصميم مريح للعين', 'خط كوفي حديث', 'سريع جداً في الفتح'],
  },
  {
    name: 'Romantic Floral',
    nameAr: 'الزهري الرومانسي',
    slug: 'romantic-floral',
    demoUrl: '/invitation/wedding/ahmed-sara',
    description: 'ألوان رقيقة مستوحاة من بتلات الورد الطبيعي، مخصصة للأفراح النهارية والمفتوحة Open-Air.',
    bgClass: 'bg-[#9C5162]',
    accentColor: '#E8CCD7',
    badge: 'رومانسي مبهج 🌸',
    features: ['ألوان باستيل ناعمة', 'زخارف ورود مائية', 'ممتاز للأفراح المفتوحة'],
  },
  {
    name: 'Egyptian Oriental',
    nameAr: 'الشرقي التراثي الأصيل',
    slug: 'egyptian-oriental',
    demoUrl: '/invitation/wedding/ahmed-sara',
    description: 'طابع مصري تراثي يجمع بين الزخارف الهندسية الإسلامية وأصالة تقاليد الفرح المصري.',
    bgClass: 'bg-[#1A365D]',
    accentColor: '#C69214',
    badge: 'أصالة مصرية 📜',
    features: ['زخارف أرابيسك هندسية', 'طابع كتب الكتاب التاريخي', 'خط كوفي أصيل'],
  },
];

export function ThemesGallery({ whatsappNumber = '201012345678' }: ThemesGalleryProps) {
  return (
    <section id="themes" className="py-20 lg:py-28 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-[#720925] border border-rose-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            ٥ تصاميم فاخرة جاهزة للتخصيص
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight font-cairo">
            اختار الثيم اللي يليق بذوقكم <br />
            <span className="text-[#720925]">وإحنا نصممه مخصوص بأسماءكم</span>
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            كل ثيم مش مجرد لون، ده تجربة بصرية كاملة تشمل الظرف التفاعلي، الخطوط، الأزرار، وحركات الظهور.
          </p>
        </div>

        {/* Themes Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {THEMES_DATA.map((theme) => {
            const whatsappOrderUrl = getWhatsAppUrl(
              whatsappNumber,
              createInquiryWhatsAppMessage(theme.nameAr)
            );

            return (
              <div
                key={theme.slug}
                className="group rounded-3xl bg-white border border-stone-200/80 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Color Banner Header */}
                  <div className={`h-40 ${theme.bgClass} p-6 relative flex flex-col justify-between text-white`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
                        {theme.badge}
                      </span>
                      <div
                        className="w-5 h-5 rounded-full border-2 border-white shadow-xs"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black font-cairo tracking-tight">
                        {theme.nameAr}
                      </h3>
                      <p className="text-xs opacity-80 font-mono">{theme.name}</p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-stone-600 leading-relaxed font-normal">
                      {theme.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      {theme.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-stone-700">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-6 pt-0 grid grid-cols-2 gap-3">
                  <Link
                    href={theme.demoUrl}
                    className="inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
                  >
                    <Eye className="w-4 h-4 text-amber-600" />
                    <span>شوف الدعوة</span>
                  </Link>

                  <a
                    href={whatsappOrderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-3 rounded-xl burgundy-gradient-bg text-white font-bold text-xs shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>اطلب التصميم</span>
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
