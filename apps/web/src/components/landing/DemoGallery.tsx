'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, Heart, MessageCircle, MapPin, Calendar, Sparkles, Filter } from 'lucide-react';
import { getWhatsAppUrl, createInquiryWhatsAppMessage } from '@/lib/whatsapp';

export interface DemoItem {
  id: string;
  slug: string;
  packageId: 'basic' | 'wedding-journey' | 'luxury-vip';
  packageBadge: string;
  type: 'wedding' | 'engagement' | 'henna' | 'katb_ketab';
  typeNameAr: string;
  coupleNames: string;
  groomName: string;
  brideName: string;
  date: string;
  venue: string;
  city: string;
  themeName: string;
  themeSlug: string;
  previewUrl: string;
  eventsCount: number;
  eventsList: string[];
  coverGradient: string;
  accentColor: string;
  badge: string;
  openingStyle?: string;
  openingNameAr?: string;
  backgroundPattern?: string;
  patternNameAr?: string;
  innerCardStyle?: string;
}

export const DEFAULT_DEMOS: DemoItem[] = [
  {
    id: 'demo-1',
    slug: 'ahmed-sara',
    packageId: 'wedding-journey',
    packageBadge: 'باقة رحلة الفرح (95 ج.م) 👑',
    type: 'wedding',
    typeNameAr: 'زفاف ملكي شامل',
    coupleNames: 'أحمد & سارة',
    groomName: 'أحمد محمود',
    brideName: 'سارة إبراهيم',
    date: 'الجمعة، ٢٠ نوفمبر ٢٠٢٦',
    venue: 'فندق ماريوت — قاعة عايدة',
    city: 'الزمالك، القاهرة',
    themeName: 'الملكي البورجوندي',
    themeSlug: 'royal-burgundy',
    previewUrl: '/invitation/wedding/ahmed-sara',
    eventsCount: 4,
    eventsList: ['الخطوبة', 'الحنة', 'كتب الكتاب', 'الفرح'],
    coverGradient: 'from-[#6E0D25] via-[#500619] to-[#2B030D]',
    accentColor: '#D4AF37',
    badge: 'رحلة كاملة ٤ مناسبات 👑',
    openingStyle: 'wax-seal',
    openingNameAr: 'الظرف الملكي مع ختم الشمع 💌',
    backgroundPattern: 'damask',
    patternNameAr: 'زخارف دمشقية أرابيسك ⚜️',
    innerCardStyle: 'arched',
  },
  {
    id: 'demo-2',
    slug: 'omar-salma',
    packageId: 'basic',
    packageBadge: 'باقة المناسبة الواحدة (50 ج.م) 🌸',
    type: 'engagement',
    typeNameAr: 'حفل خطوبة رومانسي',
    coupleNames: 'عمر & سلمى',
    groomName: 'عمر شريف',
    brideName: 'سلمى كمال',
    date: 'الخميس، ١٥ أكتوبر ٢٠٢٦',
    venue: 'فندق توليب رويال — التراس المفتوح',
    city: 'الإسكندرية',
    themeName: 'الذهبي الفاخر Dark Mode',
    themeSlug: 'elegant-gold',
    previewUrl: '/invitation/engagement/omar-salma',
    eventsCount: 1,
    eventsList: ['حفل الخطوبة'],
    coverGradient: 'from-[#1A1A22] via-[#121216] to-[#0A0A0D]',
    accentColor: '#D4AF37',
    badge: 'خطوبة شيك ✨',
    openingStyle: 'gatefold',
    openingNameAr: 'بوابات القصر الفرنسي 🏛️',
    backgroundPattern: 'stars',
    patternNameAr: 'سماء ليلية مرصعة بالنجوم ✨',
    innerCardStyle: 'double-gold',
  },
  {
    id: 'demo-3',
    slug: 'mariam-youssef',
    packageId: 'basic',
    packageBadge: 'باقة المناسبة الواحدة (50 ج.م) 🌸',
    type: 'henna',
    typeNameAr: 'سهرة الحنة المصرية',
    coupleNames: 'حنة مريم',
    groomName: 'يوسف',
    brideName: 'مريم عادل',
    date: 'الأربعاء، ١٨ نوفمبر ٢٠٢٦',
    venue: 'فيلا النرجس للمناسبات الخاصة',
    city: 'التجمع الخامس، القاهرة الجديدة',
    themeName: 'الزهري الرومانسي',
    themeSlug: 'romantic-floral',
    previewUrl: '/invitation/henna/mariam-youssef',
    eventsCount: 1,
    eventsList: ['ليلة الحنة'],
    coverGradient: 'from-[#843247] via-[#682637] to-[#461421]',
    accentColor: '#F5C6D6',
    badge: 'خاص بالسيدات فقط 🌿',
    openingStyle: 'blooming',
    openingNameAr: 'تفتح بتلات الورد 🌸',
    backgroundPattern: 'floral',
    patternNameAr: 'ورود وأوراق مائية 🌸',
    innerCardStyle: 'arched',
  },
  {
    id: 'demo-4',
    slug: 'karim-nada',
    packageId: 'basic',
    packageBadge: 'باقة المناسبة الواحدة (50 ج.م) 🌸',
    type: 'katb_ketab',
    typeNameAr: 'عقد قران مبارك',
    coupleNames: 'كريم & ندى',
    groomName: 'كريم حسام',
    brideName: 'ندى طارق',
    date: 'الجمعة، ٦ نوفمبر ٢٠٢٦',
    venue: 'قاعة الماسة — مسجد المشير طنطاوي',
    city: 'التجمع الخامس، القاهرة',
    themeName: 'الأبيض الهادئ النقي',
    themeSlug: 'minimal-white',
    previewUrl: '/invitation/katb_ketab/karim-nada',
    eventsCount: 1,
    eventsList: ['عقد القران'],
    coverGradient: 'from-[#FFFFFF] via-[#F7F3EB] to-[#EAE2D2]',
    accentColor: '#D4AF37',
    badge: 'طابع إسلامي أصيل 📜',
    openingStyle: 'slider',
    openingNameAr: 'الجراب المخملي المنزلق 💎',
    backgroundPattern: 'parchment',
    patternNameAr: 'ورق قطني ملكي محبب 📜',
    innerCardStyle: 'deckle',
  },
  {
    id: 'demo-5',
    slug: 'ahmed-sara-egyptian-oriental',
    packageId: 'luxury-vip',
    packageBadge: 'باقة VIP التصميم الخاص (150 ج.م) 💎',
    type: 'wedding',
    typeNameAr: 'زفاف مصري شرقي',
    coupleNames: 'طارق & نور',
    groomName: 'طارق فهمي',
    brideName: 'نور الشناوي',
    date: 'الخميس، ٢٥ ديسمبر ٢٠٢٦',
    venue: 'فندق سوفيتيل الجزيرة — قاعة الأوبرا',
    city: 'الزمالك، كورنيش النيل',
    themeName: 'الأصيل الشرقي المصري',
    themeSlug: 'egyptian-oriental',
    previewUrl: '/invitation/wedding/ahmed-sara-egyptian-oriental',
    eventsCount: 1,
    eventsList: ['حفل الزفاف'],
    coverGradient: 'from-[#1A365D] via-[#152E52] to-[#0C1B30]',
    accentColor: '#C69214',
    badge: 'طابع مصري شرقي أصيل 🪕',
    openingStyle: 'gatefold',
    openingNameAr: 'بوابات القصر الملكي 🏛️',
    backgroundPattern: 'zellige',
    patternNameAr: 'مشربية وفسيفساء أندلسية 🪟',
    innerCardStyle: 'royal-crest',
  },
  {
    id: 'demo-6',
    slug: 'ahmed-sara-emerald-palace',
    packageId: 'luxury-vip',
    packageBadge: 'باقة VIP التصميم الخاص (150 ج.م) 💎',
    type: 'wedding',
    typeNameAr: 'قصر الزمرد والرخام الملكي',
    coupleNames: 'زياد & فريدة',
    groomName: 'زياد خليل',
    brideName: 'فريدة عاصم',
    date: 'السبت، ١٢ ديسمبر ٢٠٢٦',
    venue: 'قصر البارون إمبان — الحديقة الملكية',
    city: 'مصر الجديدة، القاهرة',
    themeName: 'الزمردي وقصر الرخام',
    themeSlug: 'emerald-palace',
    previewUrl: '/invitation/wedding/ahmed-sara-emerald-palace',
    eventsCount: 1,
    eventsList: ['حفل الزفاف'],
    coverGradient: 'from-[#0D3528] via-[#134B39] to-[#071F17]',
    accentColor: '#D4AF37',
    badge: 'رخام إيطالي وعروق ذهب 🏛️',
    openingStyle: 'gatefold',
    openingNameAr: 'بوابات القصر الملكي 🏛️',
    backgroundPattern: 'marble',
    patternNameAr: 'رخام إيطالي وعروق ذهب 🏛️',
    innerCardStyle: 'arched',
  },
];

interface DemoGalleryProps {
  demos?: DemoItem[];
  whatsappNumber?: string;
}

export function DemoGallery({
  demos = DEFAULT_DEMOS,
  whatsappNumber = '201019262075',
}: DemoGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredDemos =
    activeFilter === 'all'
      ? demos
      : demos.filter(
          (item) =>
            item.type === activeFilter ||
            item.packageId === activeFilter ||
            item.openingStyle === activeFilter ||
            item.backgroundPattern === activeFilter
        );

  return (
    <section id="demos" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-[#720925] border border-rose-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            معرض النماذج الافتراضية والأنيميشنات الحية
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight font-cairo">
            نماذج كروت تفاعلية بأنيميشنات وباترنات ساحرة <br />
            <span className="text-[#720925]">تنوع مبهر في فتح الظرف والشكل الداخلي والخلفيات ❤️</span>
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            عاين روعة الفتح في البداية (بوابات القصر، الظرف الملكي، الكارت المنزلق، تفتح الورود) مع خلفيات الرخام الإيطالي، الأرابيسك المذهب، وزخارف الزهور، وبنقرة واحدة ابدأ تصميمك!
          </p>

          {/* Filter Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'كل النماذج 🌟' },
              { id: 'gatefold', label: '🏛️ بوابات القصر (Gatefold)' },
              { id: 'wax-seal', label: '💌 الظرف الملكي بختم الشمع' },
              { id: 'slider', label: '💎 الكارت المنزلق' },
              { id: 'blooming', label: '🌸 تفتح بتلات الورد' },
              { id: 'wedding-journey', label: '👑 باقة رحلة الفرح (95 ج.م)' },
              { id: 'luxury-vip', label: '💎 باقة VIP (150 ج.م)' },
              { id: 'basic', label: '🌸 باقة المناسبة الواحدة (50 ج.م)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'burgundy-gradient-bg text-white shadow-sm ring-2 ring-amber-400/50'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDemos.map((demo) => {
            const isLight = demo.themeSlug === 'minimal-white';
            const waUrl = getWhatsAppUrl(
              whatsappNumber,
              createInquiryWhatsAppMessage(demo.themeName, demo.typeNameAr)
            );

            return (
              <div
                key={demo.id}
                className="group rounded-3xl bg-white border border-stone-200/90 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div>
                  {/* Card Visual Hero Frame */}
                  <div
                    className={`h-48 bg-gradient-to-br ${demo.coverGradient} p-5 flex flex-col justify-between relative overflow-hidden ${
                      isLight ? 'text-stone-900 border-b border-stone-200' : 'text-white'
                    }`}
                  >
                    {/* Background Texture Pattern matching inside */}
                    {demo.backgroundPattern && (
                      <div className={`absolute inset-0 opacity-15 pointer-events-none pattern-${demo.backgroundPattern}`} />
                    )}

                    {/* Corner Filigrees matching the royal envelope */}
                    <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t border-l rounded-tl pointer-events-none opacity-60" style={{ borderColor: demo.accentColor }} />
                    <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t border-r rounded-tr pointer-events-none opacity-60" style={{ borderColor: demo.accentColor }} />

                    <div className="flex items-center justify-between z-10">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md border ${
                          isLight
                            ? 'bg-stone-900/10 text-stone-900 border-stone-300'
                            : 'bg-white/20 text-white border-white/20'
                        }`}
                      >
                        {demo.badge}
                      </span>
                      <span
                        className={`text-[11px] font-medium ${
                          isLight ? 'text-stone-600' : 'text-stone-200'
                        }`}
                      >
                        {demo.themeName}
                      </span>
                    </div>

                    <div className="text-center my-auto z-10">
                      <p className={`text-xs font-amiri ${isLight ? 'text-amber-800 font-bold' : 'text-amber-300'}`}>
                        دعوة لحضور
                      </p>
                      <h3 className={`text-2xl font-black font-cairo tracking-wide ${isLight ? 'text-stone-950' : 'text-white'}`}>
                        {demo.coupleNames}
                      </h3>
                      <p className={`text-[11px] mt-0.5 ${isLight ? 'text-stone-600 font-semibold' : 'text-stone-200'}`}>
                        {demo.typeNameAr}
                      </p>
                    </div>

                    {/* Events included chips */}
                    <div className="flex flex-wrap gap-1 z-10 justify-center">
                      {demo.eventsList.map((evt, idx) => (
                        <span
                          key={idx}
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs ${
                            isLight
                              ? 'bg-stone-900/10 text-stone-800 border border-stone-300/60'
                              : 'bg-white/15 text-stone-100'
                          }`}
                        >
                          {evt}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Details Body */}
                  <div className="p-5 space-y-3 text-right">
                    {/* Package Badge */}
                    <div className="flex items-center justify-between gap-1 pb-1 border-b border-stone-100">
                      <span className="text-[10px] font-black text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {demo.packageBadge}
                      </span>
                      <span className="text-[10px] font-bold text-stone-400">
                        {demo.eventsCount > 1 ? `${demo.eventsCount} مناسبات برابط واحد` : 'مناسبة واحدة'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-700 font-bold">
                      <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{demo.date}</span>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-stone-600">
                      <MapPin className="w-4 h-4 text-[#720925] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-stone-800">{demo.venue}</p>
                        <p className="text-[11px] text-stone-500">{demo.city}</p>
                      </div>
                    </div>

                    {/* Opening Animation & Pattern Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100">
                      {demo.openingNameAr && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                          {demo.openingNameAr}
                        </span>
                      )}
                      {demo.patternNameAr && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                          {demo.patternNameAr}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 pt-0 space-y-2">
                  <Link
                    href={`/create?template=${demo.slug}&package=${demo.packageId}&theme=${demo.themeSlug}&type=${demo.type}&openingStyle=${demo.openingStyle || 'wax-seal'}&pattern=${demo.backgroundPattern || 'damask'}&cardStyle=${demo.innerCardStyle || 'arched'}&groom=${encodeURIComponent(demo.groomName)}&bride=${encodeURIComponent(demo.brideName)}&venue=${encodeURIComponent(demo.venue)}&city=${encodeURIComponent(demo.city)}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 border border-amber-400 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                    <span>ابدأ تصميم دعوتك بهذا النموذج 🪄</span>
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={demo.previewUrl}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-900 text-white font-bold text-[11px] hover:bg-stone-800 transition-colors shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>معاينة النموذج</span>
                    </Link>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 text-[#720925] hover:bg-rose-100 border border-rose-200 font-bold text-[11px] transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>واتساب</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
