'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Copy,
  Check,
  Share2,
  Compass,
  Car,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { getWhatsAppUrl, createInquiryWhatsAppMessage } from '@/lib/whatsapp';

interface MapLocationPreviewProps {
  whatsappNumber?: string;
}

export function MapLocationPreview({
  whatsappNumber = '201019262075',
}: MapLocationPreviewProps) {
  const [copied, setCopied] = useState(false);

  const venueAddress = 'فندق ماريوت الزمالك — قاعة عايدة، ١٦ شارع سراي الجزيرة، الزمالك، القاهرة';
  const googleMapsUrl =
    'https://maps.google.com/?q=Cairo+Marriott+Hotel+Omar+Khayyam+Casino+Zamalek';

  const handleCopy = () => {
    navigator.clipboard.writeText(venueAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = getWhatsAppUrl(
    whatsappNumber,
    createInquiryWhatsAppMessage(undefined, 'استفسار عن تجهيز خريطة القاعة')
  );

  return (
    <section id="map-preview" className="py-20 lg:py-28 bg-[#FAF7F2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-[#720925] border border-rose-200 text-xs font-bold">
            <Compass className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            معاينة موقع القاعة والوصول
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight font-cairo">
            مفيش ضيف هيتوه بعد النهاردة <br />
            <span className="text-[#720925]">توجيه مباشر لباب القاعة بنقرة واحدة 🚗</span>
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            أكتر مشكلة بتعطل المعازيم هي البحث عن مكان القاعة أو مواقف السيارات. مع دعوة فرحنا، ضيوفك بيوصلوا بسهولة تامة وفي ميعادهم.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Right Column (RTL): Live Location Card Interactive Simulation */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-stone-200 shadow-xl overflow-hidden text-right">
              {/* Card Top Banner with Simulated Map View */}
              <div className="relative h-64 sm:h-72 bg-stone-800 overflow-hidden flex items-center justify-center">
                {/* Stylized Map Vector Pattern */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Simulated Roads & Blocks */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-1/3 left-0 right-0 h-4 bg-stone-500 transform -rotate-6" />
                  <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-stone-500 transform rotate-12" />
                  <div className="absolute bottom-1/4 left-0 right-0 h-6 bg-stone-600" />
                </div>

                {/* Glowing Venue Pin Marker */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-rose-500/30 animate-ping absolute -inset-0" />
                    <div className="w-16 h-16 rounded-full burgundy-gradient-bg border-4 border-amber-300 shadow-2xl flex items-center justify-center text-white relative">
                      <MapPin className="w-8 h-8 fill-current text-white" />
                    </div>
                  </div>
                  <div className="mt-2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-bold shadow-lg border border-white/20">
                    💍 قاعة عايدة — فندق ماريوت الزمالك
                  </div>
                </div>

                {/* Map Controls Simulation Overlay */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-stone-700 shadow-xs">
                  📍 30.0583° N, 31.2223° E
                </div>
              </div>

              {/* Card Information Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      قاعة مؤكدة ومحدثة
                    </span>
                    <span className="text-xs text-stone-500 font-medium">الزمالك — القاهرة</span>
                  </div>
                  <h3 className="text-2xl font-black text-stone-900 font-cairo">
                    فندق ماريوت الزمالك — قاعة عايدة الملكية
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    ١٦ شارع سراي الجزيرة، حي الزمالك، القاهرة. الدخول من بوابة الجزيرة الرئيسية المطلة على النيل.
                  </p>
                </div>

                {/* Venue Perks / Parking Info */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Car className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>تعليمات الركنة ومواقف السيارات:</span>
                  </div>
                  <p className="text-xs text-amber-950/80 leading-relaxed pr-6">
                    تتوفر خدمة صف السيارات الفاخرة (Valet Parking) عند مدخل الفندق، وموقف سيارات خاص لضيوف حفل الزفاف مجاناً.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl burgundy-gradient-bg text-white font-bold text-sm shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>فتح في Google Maps 🚗</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700">تم نسخ العنوان بنجاح!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-stone-500" />
                        <span>نسخ العنوان بالكامل</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column: Why Guests Love this Feature */}
          <div className="lg:col-span-5 space-y-6 text-right">
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 font-cairo">
                تجربة وصول استثنائية لكل ضيف
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                بدل ما حد من أهلك يقعد يرد على التليفونات يوم الفرح يشرح السكة، كل التفاصيل واضحة ومباشرة بضغطة زر واحدة.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'توجيه بنقرة واحدة (One-Tap Navigation)',
                  desc: 'الضيف يضغط على الزرار يفتح تطبيق GPS المفضل عنده (Google Maps أو Apple Maps أو Waze) مع حساب وقت الرحلة.',
                },
                {
                  title: 'تفاصيل دقيقة للبوابات والركنة',
                  desc: 'تحديد بوابة الدخول الصحيحة (خصوصاً في الفنادق والنوادي الكبيرة) وتفاصيل باركينج المعازيم.',
                },
                {
                  title: 'تحديث فوري لو تغير المكان',
                  desc: 'لو تم نقل المناسبة لقاعة أخرى أو حديقة مفتوحة، بنعدل اللوكيشن فوراً ويتحول لكل الضيوف.',
                },
                {
                  title: 'خريطة مستقلة لكل مناسبة',
                  desc: 'لو عندك كتب كتاب في مسجد، وحنة في فيلا، وفرح في فندق، كل مناسبة ليها خريطتها وزرار توجيهها المنفصل.',
                },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-1">
                  <h4 className="text-sm font-bold text-[#720925] font-cairo">{item.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#720925] hover:text-[#52061a] transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>عايز تضيف موقع قاعتك لدعوتك؟ كلمنا على واتساب ←</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
