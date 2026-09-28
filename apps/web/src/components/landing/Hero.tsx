'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Eye, Sparkles, MapPin, Calendar, Music, ShieldCheck } from 'lucide-react';
import { getWhatsAppUrl, createInquiryWhatsAppMessage } from '@/lib/whatsapp';

interface HeroProps {
  whatsappNumber?: string;
}

export function Hero({ whatsappNumber = '201012345678' }: HeroProps) {
  const whatsappUrl = getWhatsAppUrl(whatsappNumber, createInquiryWhatsAppMessage());

  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -left-24 w-96 h-96 rounded-full bg-amber-200/40 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Right Column: Hero Pitch (RTL) */}
          <div className="lg:col-span-7 text-center lg:text-right space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-[#720925] border border-rose-200/80 text-xs sm:text-sm font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
              <span>دعوة مصممة مخصوص ليكم — مش مجرد قالب جاهز</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 leading-[1.25] tracking-tight font-cairo">
              دعوتك مش مجرد لينك... <br />
              <span className="text-[#720925] underline decoration-amber-400 decoration-wavy decoration-2">
                دي بداية فرحتكم ❤️
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              دعوة إلكترونية فاخرة تجمع كل مناسباتكم: <strong className="text-stone-800">الخطوبة، الحنة، كتب الكتاب، والفرح</strong> في رابط واحد أنيق بصوركم وموقع القاعات والعد التنازلي وتأكيد الحضور.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl burgundy-gradient-bg text-white font-black text-base shadow-xl shadow-rose-950/25 hover:shadow-rose-950/40 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>اعمل دعوتك دلوقتي ❤️</span>
              </a>

              <Link
                href="/invitation/wedding/ahmed-sara"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white text-stone-800 border-2 border-stone-200/80 font-bold text-base hover:bg-stone-50 hover:border-stone-300 shadow-sm transition-all"
              >
                <Eye className="w-5 h-5 text-amber-600" />
                <span>شاهد نموذج زفاف أحمد وسارة</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center">
              <div>
                <p className="text-2xl font-black text-[#720925] font-cairo">٤ مناسبات</p>
                <p className="text-xs text-stone-500 font-medium">في رابط واحد متكامل</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-amber-700 font-cairo">InstaPay / كاش</p>
                <p className="text-xs text-stone-500 font-medium">تحويل يدوي آمن عبر واتساب</p>
              </div>
              <div>
                <p className="text-2xl font-black text-stone-800 font-cairo">١٠٠٪ مصري</p>
                <p className="text-xs text-stone-500 font-medium">مصمم لتقاليدنا وأفراحنا</p>
              </div>
            </div>
          </div>

          {/* Left Column: Live Interactive Demo Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Phone Frame */}
              <div className="relative mx-auto border-[10px] border-stone-800 rounded-[44px] shadow-2xl bg-[#0F0F10] overflow-hidden aspect-[9/18]">
                {/* Speaker pill */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-4 bg-stone-900 rounded-full z-20 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-stone-800 rounded-full mr-2" />
                  <div className="w-10 h-1 bg-stone-700 rounded-full" />
                </div>

                {/* Inner Preview Content */}
                <div className="relative w-full h-full bg-[#FAF7F2] p-5 pt-12 flex flex-col justify-between overflow-y-auto">
                  <div className="text-center space-y-4">
                    <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-[#720925]">
                      💍 دعوة زفاف ملكية
                    </span>
                    <h3 className="text-2xl font-black text-stone-900 font-cairo">
                      أحمد محمود <br />
                      <span className="text-[#720925] text-lg font-amiri">&amp; سارة إبراهيم</span>
                    </h3>
                    <p className="text-[12px] text-stone-600 leading-relaxed font-amiri px-2">
                      "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا"
                    </p>

                    {/* Multi-event pill preview */}
                    <div className="flex justify-center gap-1 text-[10px] font-bold">
                      <span className="bg-[#720925] text-white px-2 py-1 rounded-md shadow-xs">الفرح 👑</span>
                      <span className="bg-stone-200 text-stone-700 px-2 py-1 rounded-md">الحنة 🌿</span>
                      <span className="bg-stone-200 text-stone-700 px-2 py-1 rounded-md">كتب الكتاب 📜</span>
                    </div>

                    <div className="bg-white/80 border border-stone-200 rounded-xl p-3 shadow-xs space-y-1.5 text-right">
                      <div className="flex items-center gap-2 text-[11px] text-stone-700 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>الجمعة ٢٠ نوفمبر ٢٠٢٦ — ٨:٠٠ م</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-700 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-[#720925] shrink-0" />
                        <span>فندق ماريوت الزمالك — قاعة عايدة</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Open Button simulation */}
                  <div className="pt-4 pb-2">
                    <Link
                      href="/invitation/wedding/ahmed-sara"
                      className="block w-full text-center py-3 rounded-xl burgundy-gradient-bg text-white font-bold text-xs shadow-md shadow-rose-950/20 hover:opacity-90 transition-opacity"
                    >
                      افتح الدعوة التفاعلية الكاملة 💌
                    </Link>
                  </div>
                </div>
              </div>

              {/* Decorative floating label */}
              <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-md border border-stone-200 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                  <Music className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <p className="text-xs font-black text-stone-900">موسيقى هادئة بنقرة واحدة</p>
                  <p className="text-[10px] text-stone-500">لا تعمل تلقائياً احتراماً للضيف</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
