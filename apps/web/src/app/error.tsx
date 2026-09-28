'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client error to console in production
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 text-center font-cairo">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Error icon */}
        <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-[#720925] shadow-inner">
          <AlertTriangle className="w-8 h-8 text-[#720925]" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-stone-900">
            حدث خطأ غير متوقع
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            نعتذر بشدة، واجه النظام مشكلة مؤقتة في تحميل هذه الصفحة. يمكنك محاولة إعادة المحاولة أو العودة للصفحة الرئيسية.
          </p>
        </div>

        {/* Action buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#720925] hover:bg-[#5b071e] text-white text-sm font-bold shadow-lg shadow-[#720925]/20 transition-all duration-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </button>

          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-bold border border-stone-200 transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
