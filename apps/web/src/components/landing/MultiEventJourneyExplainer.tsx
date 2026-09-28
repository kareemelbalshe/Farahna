'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, ChevronLeft, MapPin, Sparkles, XCircle } from 'lucide-react';

export function MultiEventJourneyExplainer() {
  return (
    <section id="journey" className="py-20 lg:py-28 bg-stone-900 text-white relative overflow-hidden">
      {/* Decorative background grid and glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:28px_28px] opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-900/20 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            الميزة الحصرية الأولى في مصر
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-cairo">
            رحلة فرحتكم كاملة... <br />
            <span className="gold-gradient-text">في لينك واحد يجمع كل المواعيد</span>
          </h2>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
            بدل ما تبعت للضيوف لينك للخطوبة، ولينك تاني للحنة، ولينك تالت لكتب الكتاب... فرحنا بتجمع كل محطات فرحتكم في صفحة واحدة منظمة وسهلة.
          </p>
        </div>

        {/* Comparison grid: The old way vs Farahna way */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* The Old Confusing Way */}
          <div className="lg:col-span-5 bg-stone-800/60 border border-stone-700/60 rounded-3xl p-6 sm:p-8 space-y-5 opacity-80">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <XCircle className="w-5 h-5 shrink-0" />
              <span>الطريقة التقليدية المشتتة</span>
            </div>
            <p className="text-xs text-stone-400">
              إرسال صور وروابط متفرقة على واتساب تضيع وسط الرسائل:
            </p>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-700 text-stone-300 flex items-center justify-between">
                <span>📍 لينك موقع قاعة الخطوبة...</span>
                <span className="text-[10px] text-stone-500">رسالة 1</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-700 text-stone-300 flex items-center justify-between">
                <span>🌿 صورة ورقة دعوة الحنة...</span>
                <span className="text-[10px] text-stone-500">رسالة 2</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-700 text-stone-300 flex items-center justify-between">
                <span>📜 لوكيشن كتب الكتاب في المسجد...</span>
                <span className="text-[10px] text-stone-500">رسالة 3</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-700 text-stone-300 flex items-center justify-between">
                <span>👑 تفاصيل الفرح وقاعة الزفاف...</span>
                <span className="text-[10px] text-stone-500">رسالة 4</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-400 text-center">النتيجة: ضيوف تائهين، اتصالات متكررة، ونسيان للمواعيد!</p>
          </div>

          {/* Farahna Unified Way */}
          <div className="lg:col-span-7 bg-gradient-to-br from-stone-900 via-stone-800 to-rose-950/40 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>طريقة "فرحنا" الذكية والفاخرة</span>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                farahna.menuflowx.com/.../ahmed-sara
              </span>
            </div>

            {/* The 4 Journey Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition-colors text-center space-y-2">
                <span className="text-2xl">💍</span>
                <p className="text-xs font-bold text-amber-200">الخطوبة</p>
                <p className="text-[10px] text-stone-400">تاريخ + مكان مستقل</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition-colors text-center space-y-2">
                <span className="text-2xl">🌿</span>
                <p className="text-xs font-bold text-emerald-300">ليلة الحنة</p>
                <p className="text-[10px] text-stone-400">قسم خاص بالسيدات</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition-colors text-center space-y-2">
                <span className="text-2xl">📜</span>
                <p className="text-xs font-bold text-cyan-300">كتب الكتاب</p>
                <p className="text-[10px] text-stone-400">موعد المسجد والقران</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2 shadow-inner">
                <span className="text-2xl">👑</span>
                <p className="text-xs font-bold text-amber-300">ليلة العمر</p>
                <p className="text-[10px] text-stone-400">حفل الزفاف والزفة</p>
              </div>
            </div>

            {/* What guests get */}
            <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-700/60 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-300">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#720925]" /> خريطة واتجاهات دقيقة لكل مكان
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" /> زر إضافة لتقويم الهاتف لكل موعد
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-stone-400">
                تقدر تختار عمل دعوة لفعالية واحدة، أو تجميع كل الفعاليات في دعوة واحدة!
              </p>
              <Link
                href="/invitation/wedding/ahmed-sara"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200 underline decoration-amber-500 underline-offset-4"
              >
                <span>جرب تبديل الفعاليات في نموذج أحمد وسارة</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
