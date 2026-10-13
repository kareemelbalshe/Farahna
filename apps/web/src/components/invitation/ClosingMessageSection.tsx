'use client';

import React from 'react';
import { Heart, MessageCircle, Sparkles, Crown } from 'lucide-react';
import Link from 'next/link';

interface ClosingMessageSectionProps {
  closingMessageAr?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  supportPhone?: string;
  templateSlug?: string;
  themeSlug?: string;
  invitationType?: string;
  groomName?: string;
  brideName?: string;
}

export function ClosingMessageSection({
  closingMessageAr = 'عقبال عندكم جميعاً، وبحضوركم تكتمل فرحتنا ❤️',
  primaryColor = '#720925',
  secondaryColor = '#D4AF37',
  supportPhone = '201019262075',
  templateSlug,
  themeSlug,
  invitationType = 'wedding',
  groomName,
  brideName,
}: ClosingMessageSectionProps) {
  const cleanPhone = supportPhone.replace(/[^0-9]/g, '') || '201019262075';
  const whatsappInquiryMessage = encodeURIComponent(
    'السلام عليكم ورحمة الله وبركاته ❤️\nشفت بطاقة دعوة زفاف مميزة على منصة فرحنا وعجبتني جداً، وحابب استفسر وأصمم بطاقة خاصة لمناسبتي القادمة 💍'
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappInquiryMessage}`;
  const studioCreateUrl = `/create?template=${templateSlug || ''}&theme=${themeSlug || ''}&type=${invitationType || 'wedding'}&groom=${encodeURIComponent(groomName || '')}&bride=${encodeURIComponent(brideName || '')}`;

  return (
    <footer className="pt-12 pb-20 px-4 text-center space-y-8 border-t border-stone-200/80 theme-divider">
      {/* 1. Couple's Blessing & Closing Message */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-px" style={{ backgroundColor: secondaryColor }} />
          <Heart className="w-5 h-5 animate-pulse" style={{ fill: primaryColor, color: primaryColor }} />
          <div className="w-12 h-px" style={{ backgroundColor: secondaryColor }} />
        </div>

        <p className="text-base sm:text-lg font-bold text-stone-800 font-amiri max-w-lg mx-auto leading-relaxed theme-heading">
          {closingMessageAr}
        </p>
      </div>

      {/* 2. Luxury Inquiry Card for Future Couples & Guests */}
      <div className="max-w-lg mx-auto p-5 sm:p-7 rounded-3xl bg-white/85 backdrop-blur-md border border-amber-200/90 shadow-sm text-center space-y-4 relative overflow-hidden theme-card">
        {/* Subtle decorative background gradient */}
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 pointer-events-none blur-2xl"
          style={{ backgroundColor: primaryColor }}
        />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200 text-amber-900 text-[11px] font-bold theme-badge">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>عجبتكم بطاقة الدعوة؟ شاركونا فرحتكم القادمة</span>
        </div>

        <div className="space-y-1.5">
          <h4 className="text-sm sm:text-base font-black text-stone-900 font-cairo theme-heading">
            صمّموا بطاقة دعوتكم الخاصة لليلة العمر بكل فخامة 💍
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto theme-muted">
            نوفر لكم تجربة دعوة رقمية ملكية متكاملة بأسماءكم وألوانكم المفضلة، تشمل الظرف التفاعلي، خريطة القاعة، والموسيقى الهادئة.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link
            href={studioCreateUrl}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-stone-950 font-black text-xs shadow-md shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-amber-400"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>صمّم وعدّل دعوتك بنفسك الآن 🪄</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>تواصل واطلب بالواتساب 💬</span>
          </a>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl bg-amber-50/90 hover:bg-amber-100/90 dark:bg-stone-900 dark:hover:bg-stone-800 text-amber-950 dark:text-amber-200 font-bold text-xs border border-amber-200/90 dark:border-amber-400/30 transition-all cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-amber-700" />
            <span>الباقات والأسعار</span>
          </Link>
        </div>
      </div>

      {/* 3. Farahna Official Platform Brand Stamp */}
      <div className="pt-2 space-y-1">
        <p className="text-[11px] text-stone-400 theme-muted">
          صُنعت بكل حب وفخامة بواسطة منصة
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-black tracking-wide hover:underline transition-all"
          style={{ color: primaryColor }}
        >
          <span>فرحنا — Farahna.menuflowx.com</span>
          <span className="text-[10px] text-stone-400 theme-muted font-normal">| بطاقات الأعراس الرقمية الفاخرة</span>
        </Link>
      </div>
    </footer>
  );
}
