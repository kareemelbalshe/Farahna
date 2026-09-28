'use client';

import React from 'react';
import { WifiOff, RefreshCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminOfflinePage() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 font-cairo text-right" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200 shadow-xl p-8 text-center space-y-6">
        {/* Offline Icon */}
        <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-2xs">
          <WifiOff className="w-8 h-8" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-bold border border-stone-200">
            وضع عدم الاتصال (Offline Mode)
          </span>
          <h1 className="text-2xl font-black text-stone-900">
            لا يوجد اتصال بالإنترنت حالياً
          </h1>
          <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
            تعذر الاتصال بخوادم منصة <strong>فرحنا</strong>. يرجى التحقق من اتصال شبكة الـ Wi-Fi أو باقة الهاتف المحمول ثم إعادة المحاولة.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleReload}
            className="w-full py-3 px-6 rounded-2xl bg-[#720925] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#5a071d] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة المحاولة والاتصال</span>
          </button>

          <Link
            href="/admin"
            className="w-full py-2.5 px-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-all flex items-center justify-center gap-1.5"
          >
            <span>محاولة فتح لوحة التحكم</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Brand Note */}
        <div className="pt-4 border-t border-stone-100">
          <p className="text-[11px] text-stone-400">
            تطبيق إدارة فرحنا — Farahna Admin PWA
          </p>
        </div>
      </div>
    </div>
  );
}
