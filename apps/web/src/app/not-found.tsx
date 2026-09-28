import React from 'react';
import Link from 'next/link';
import { Compass, Home, MessageCircle, Heart } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 text-center font-cairo">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#720925]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Icon & 404 Badge */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-[#FAF7F2] border border-stone-200 flex items-center justify-center shadow-inner">
          <Compass className="w-10 h-10 text-[#720925] animate-pulse" />
          <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-[#720925] text-white text-[11px] font-black tracking-wider shadow">
            404
          </span>
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            الصفحة غير موجودة
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            عذراً، الرابط الذي تحاول الوصول إليه غير متاح، قد يكون تم تغييره أو أن الدعوة خاصة ومحمية.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#720925] hover:bg-[#5b071e] text-white text-sm font-bold shadow-lg shadow-[#720925]/20 transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            العودة للرئيسية — فرحنا
          </Link>

          <a
            href="https://wa.me/201012345678"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 text-sm font-bold border border-emerald-200 transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            تواصل مع الدعم الفني على واتساب
          </a>
        </div>

        {/* Brand signature */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-center gap-1.5 text-xs text-stone-500 font-medium">
          <span>صُنعت بكل</span>
          <Heart className="w-3.5 h-3.5 fill-[#720925] text-[#720925]" />
          <span className="font-bold text-stone-800">فرحنا</span>
        </div>
      </div>
    </div>
  );
}
