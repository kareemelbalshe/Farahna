'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, ShieldCheck, Zap, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

interface CityHub {
  id: string;
  name: string;
  badge: string;
  areas: string[];
  famousVenues: string[];
  description: string;
}

const HUBS: CityHub[] = [
  {
    id: 'cairo',
    name: 'القاهرة الكبرى والتجمع',
    badge: 'الأكثر طلباً 👑',
    areas: ['التجمع الخامس', 'القاهرة الجديدة', 'مصر الجديدة', 'الزمالك', 'المعادي', 'مدينة نصر'],
    famousVenues: [
      'فندق ماريوت الزمالك (قاعة عايدة)',
      'فندق فورسيزونز نايل بلازا',
      'قاعة الماسة — مسجد المشير طنطاوي',
      'دار الهيئة الهندسية',
      'فنادق التجمع وكمبوندات القاهرة الجديدة',
    ],
    description: 'تغطية شاملة لأفراح الفنادق الكبرى وقاعات التجمع الخامس ومحور المشير مع توجيه GPS لبوابات القاعات الدقيقة.',
  },
  {
    id: 'giza',
    name: 'الجيزة والشيخ زايد و٦ أكتوبر',
    badge: 'فيلات وأفراح مفتوحة ✨',
    areas: ['الشيخ زايد', 'مدينة ٦ أكتوبر', 'المهندسين', 'الدقي', 'طريق مصر إسكندرية الصحراوي'],
    famousVenues: [
      'فيلات وأفراح طريق مصر إسكندرية الصحراوي',
      'فندق كونكورد بلازا وموفنبيك أكتوبر',
      'قاعات بيفرلي هيلز وزايد ديونز',
      'فنادق ومنتجعات هضبة الأهرامات',
    ],
    description: 'مثالية للأفراح المفتوحة (Open Air) في الشيخ زايد وفيلات أكتوبر، مع توجيه دقيق لأماكن الركنة والـ Valet.',
  },
  {
    id: 'alex',
    name: 'الإسكندرية وعروس البحر',
    badge: 'إطلالات بحرية 🌊',
    areas: ['سان ستيفانو', 'المنتزه', 'كورنيش الإسكندرية', 'كفر عبده', 'سموحة', 'الساحل الشمالي'],
    famousVenues: [
      'فندق فورسيزونز سان ستيفانو',
      'فندق توليب رويال الإسكندرية',
      'قاعات حدائق وقصر المنتزه',
      'قاعات الكورنيش ونادي المعلمين والسيارات',
    ],
    description: 'دعوات أنيقة بنكهة إسكندرانية للأفراح المطلة على البحر المتوسط، مع إحداثيات دقيقة لقاعات الكورنيش.',
  },
  {
    id: 'delta-upper',
    name: 'الدلتا والقناة والصعيد',
    badge: 'أصالة مصرية 🌾',
    areas: ['المنصورة', 'طنطا', 'الزقازيق', 'بورسعيد', 'الإسماعيلية', 'السويس', 'أسيوط', 'سوهاج'],
    famousVenues: [
      'أفخم فنادق وقاعات المنصورة على المشاية',
      'قاعات طنطا والعروبة مول',
      'دور مناسبات وأندية القوات المسلحة والشرطة',
      'قاعات الكورنيش في بورسعيد والإسماعيلية',
    ],
    description: 'خدمة عائلاتنا الكريمة في كل ربوع مصر مع توفير روابط خفيفة وسريعة التحميل لجميع شبكات الاتصالات.',
  },
  {
    id: 'gulf',
    name: 'الخليج والمغتربين',
    badge: 'تواصل بلا حدود ✈️',
    areas: ['السعودية (الرياض، جدة)', 'الإمارات (دبي، أبوظبي)', 'الكويت', 'قطر'],
    famousVenues: [
      'دعوات إلكترونية تصل لأحبابكم في ثانية واحدة',
      'توقيتات مخصصة بتوقيت مصر وتوقيت دول الخليج',
      'حفظ الموعد في التقويم الدولي بنقرة زر',
    ],
    description: 'شاركوا فرحتكم مع أهلكم وأصدقائكم المغتربين في الخارج بسهولة فائقة دون أي تكاليف شحن أو تأخير.',
  },
];

export function LocalGeoSeoSection() {
  const [activeHubId, setActiveHubId] = useState<string>('cairo');
  const activeHub = HUBS.find((h) => h.id === activeHubId) || HUBS[0];

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-white to-[#FAF7F2] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            تغطية شاملة لجميع محافظات مصر والوطن العربي 🇪🇬
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight font-cairo">
            المنصة الأولى لتصميم دعوات الأفراح الإلكترونية <br />
            <span className="text-[#720925]">في القاهرة، الجيزة، الإسكندرية وجميع المحافظات</span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            سواء كان فرحكم في فندق ٥ نجوم على نيل القاهرة، أو فيلا مفتوحة في الشيخ زايد، أو قاعة على بحر الإسكندرية... 
            فرحنا تضمن لمعازيمكم تجربة وصول سلسة وحضوراً مبهجاً.
          </p>
        </div>

        {/* Hub Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {HUBS.map((hub) => (
            <button
              key={hub.id}
              type="button"
              onClick={() => setActiveHubId(hub.id)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeHubId === hub.id
                  ? 'burgundy-gradient-bg text-white shadow-md scale-105'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {hub.name}
            </button>
          ))}
        </div>

        {/* Active Hub Details Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6 text-right">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-[#720925] border border-rose-200 inline-block mb-1">
                {activeHub.badge}
              </span>
              <h3 className="text-2xl font-black text-stone-900 font-cairo">
                دعوات أفراح ومناسبات في {activeHub.name}
              </h3>
            </div>
            <p className="text-xs text-stone-500 font-medium max-w-sm">
              {activeHub.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            {/* Areas Covered */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/80">
              <div className="flex items-center gap-2 text-stone-900 font-bold">
                <Navigation className="w-4 h-4 text-[#720925]" />
                <span>المناطق والأحياء المغطاة:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeHub.areas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 font-medium"
                  >
                    📍 {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Famous Venues */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/80">
              <div className="flex items-center gap-2 text-stone-900 font-bold">
                <Building2 className="w-4 h-4 text-amber-700" />
                <span>أبرز القاعات والفنادق المتوافقة:</span>
              </div>
              <ul className="space-y-1.5 text-stone-600">
                {activeHub.famousVenues.map((venue, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{venue}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Local Excellence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 text-right space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#720925] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm font-cairo">تحميل فوري في ثانية واحدة</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              سريعة جداً على شبكات المحمول المصرية (Vodafone, Orange, Etisalat, WE) وتفتح بدون أي انتظار.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 text-right space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Navigation className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm font-cairo">توجيه GPS دقيق للبوابة</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              زر مباشر يفتح تطبيق Google Maps على هاتف المعازيم ليقودهم لبوابة القاعة وموقف السيارات بالظبط.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 text-right space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm font-cairo">خصوصية تامة للسيدات</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              وسم خاص لليلة الحنة، وتنبيهات منع التصوير والدريس كود لضمان راحة العائلات التامة.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 text-right space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm font-cairo">دفع مريح عبر InstaPay</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              لا نطلب أي بطاقات ائتمان أونلاين؛ التحويل يتم عبر إنستاباي أو فودافون كاش بعد رضاكم واعتماد الدعوة بنسبة ١٠٠٪.
            </p>
          </div>
        </div>

        {/* Natural SEO Rich Keyword Editorial Paragraph */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/80 border border-stone-200 text-center space-y-3 font-cairo max-w-4xl mx-auto">
          <h3 className="text-base font-black text-stone-800">
            فرحنا — الخيار الأول لطلب وتصميم دعوة فرح إلكترونية وبطاقات زفاف واتساب في مصر
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            نقدم أفضل خدمة <strong>تصميم دعوة فرح إلكترونية</strong> و<strong>دعوة زفاف رقمية</strong> في مصر. نوفر باقات متكاملة تشمل <strong>دعوة خطوبة</strong>، <strong>دعوة حنة نسائية</strong>، <strong>دعوة كتب كتاب</strong>، و<strong>دعوة فرح واتساب</strong>. نوفر لك رابطاً تفاعلياً واحداً يجمع المناسبات الأربع مع ميزة <strong>تأكيد الحضور الذكي (RSVP)</strong>، وخريطة القاعة عبر GPS، ومشغل الموسيقى الرومانسية، والعد التنازلي. نخدم أرقى قاعات التجمع الخامس، الشيخ زايد، مصر الجديدة، الزمالك، المعادي، والإسكندرية، وجميع المحافظات.
          </p>
        </div>
      </div>
    </section>
  );
}
