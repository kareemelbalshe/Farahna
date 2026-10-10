'use client';

import React from 'react';
import { MessageCircle, Heart, Sparkles, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { getWhatsAppUrl, createInquiryWhatsAppMessage } from '@/lib/whatsapp';

interface WhatsAppCallToActionProps {
  whatsappNumber?: string;
}

export function WhatsAppCallToAction({
  whatsappNumber = '201019262075',
}: WhatsAppCallToActionProps) {
  const whatsappUrl = getWhatsAppUrl(
    whatsappNumber,
    createInquiryWhatsAppMessage(undefined, 'طلب تصميم دعوة فرح جديدة')
  );

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-white via-rose-50/50 to-[#FAF7F2]">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-rose-200/40 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[40px] burgundy-gradient-bg text-white p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden text-center space-y-8">
          {/* Subtle gold ornamentation */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-rose-400/10 blur-2xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold text-amber-200 mx-auto">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>فريق فرحنا بانتظاركم بكل حب ❤️</span>
          </div>

          {/* Headlines */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-cairo tracking-tight text-white leading-tight">
              اعمل دعوتك دلوقتي ❤️
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-amber-200 font-amiri">
              "دعوتك مش مجرد لينك... دي بداية فرحتكم ❤️"
            </p>
            <p className="text-sm sm:text-base text-rose-100 max-w-2xl mx-auto leading-relaxed pt-2">
              تواصل مع مصممي فرحنا مباشرة على واتساب. شاركنا أسماءكم ومواعيد وموقع فرحكم، واستلم رابط المعاينة السري خلال ساعات لتجربته وتعديله براحتكم. لا يوجد أي دفع إلا بعد موافقتكم واعتمادكم النهائي بنسبة ١٠٠٪!
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-white text-[#720925] font-black text-base sm:text-lg shadow-2xl hover:bg-stone-50 hover:scale-105 active:scale-95 transition-all"
            >
              <MessageCircle className="w-6 h-6 fill-current text-[#720925]" />
              <span>تواصل معنا عبر واتساب الآن</span>
            </a>

            <a
              href="#pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-base transition-all"
            >
              <span>عرض باقات الأسعار المتاحة</span>
            </a>
          </div>

          {/* Reassurance Grid */}
          <div className="pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <Clock className="w-5 h-5 mx-auto text-amber-300" />
              <p className="text-xs sm:text-sm font-bold text-white">معاينة خلال ساعات</p>
              <p className="text-[10px] text-rose-200">سرعة وإتقان في التنفيذ</p>
            </div>
            <div className="space-y-1">
              <ShieldCheck className="w-5 h-5 mx-auto text-amber-300" />
              <p className="text-xs sm:text-sm font-bold text-white">دفع آمن InstaPay</p>
              <p className="text-[10px] text-rose-200">الدفع بعد اعتماد المعاينة</p>
            </div>
            <div className="space-y-1">
              <CheckCircle2 className="w-5 h-5 mx-auto text-amber-300" />
              <p className="text-xs sm:text-sm font-bold text-white">تعديلات مجانية</p>
              <p className="text-[10px] text-rose-200">نعدل حتى ترضوا تماماً</p>
            </div>
            <div className="space-y-1">
              <Heart className="w-5 h-5 mx-auto text-amber-300 fill-amber-300" />
              <p className="text-xs sm:text-sm font-bold text-white">دعم مصري ٢٤/٧</p>
              <p className="text-[10px] text-rose-200">معاكم خطوة بخطوة</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
