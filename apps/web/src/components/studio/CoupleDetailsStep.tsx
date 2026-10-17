'use client';

import React from 'react';
import { Heart, AlertCircle, Sparkles, Copy, Check } from 'lucide-react';

interface CoupleDetailsStepProps {
  coupleGroomAr: string;
  coupleBrideAr: string;
  coupleGroomEn: string;
  coupleBrideEn: string;
  title: string;
  type: string;
  generatedSlug: string;
  designValidationError: string | null;
  copySuccess: string | null;
  onCoupleNameChange: (groom: string, bride: string) => void;
  setCoupleGroomEn: (val: string) => void;
  setCoupleBrideEn: (val: string) => void;
  setTitle: (val: string) => void;
  setType: (val: string) => void;
  onCopySlug: () => void;
}

export function CoupleDetailsStep({
  coupleGroomAr,
  coupleBrideAr,
  coupleGroomEn,
  coupleBrideEn,
  title,
  type,
  generatedSlug,
  designValidationError,
  copySuccess,
  onCoupleNameChange,
  setCoupleGroomEn,
  setCoupleBrideEn,
  setTitle,
  setType,
  onCopySlug,
}: CoupleDetailsStepProps) {
  return (
    <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-6 shadow-2xs">
      <div className="space-y-4">
        <label className="text-sm font-black text-stone-900 block flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#720925] fill-[#720925]" />
          <span>٢. أسماء العروسين وعنوان الدعوة:</span>
        </label>

        {/* Arabic Names Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
              <span>اسم العريس (عربي): <span className="text-rose-600">*</span></span>
              {!coupleGroomAr.trim() && (
                <span className="text-[10px] text-rose-600 font-bold">مطلوب</span>
              )}
            </label>
            <input
              type="text"
              required
              value={coupleGroomAr}
              onChange={(e) => onCoupleNameChange(e.target.value, coupleBrideAr)}
              placeholder="مثال: كامل أحمد جابر"
              className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#720925] focus:outline-hidden transition-all ${
                !coupleGroomAr.trim() && designValidationError
                  ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                  : 'border-stone-200'
              }`}
            />
            {!coupleGroomAr.trim() && designValidationError && (
              <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>يرجى كتابة اسم العريس بالعربية</span>
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
              <span>اسم العروسة (عربي): <span className="text-rose-600">*</span></span>
              {!coupleBrideAr.trim() && (
                <span className="text-[10px] text-rose-600 font-bold">مطلوب</span>
              )}
            </label>
            <input
              type="text"
              required
              value={coupleBrideAr}
              onChange={(e) => onCoupleNameChange(coupleGroomAr, e.target.value)}
              placeholder="مثال: فاطمة حسن"
              className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-[#720925] focus:outline-hidden transition-all ${
                !coupleBrideAr.trim() && designValidationError
                  ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                  : 'border-stone-200'
              }`}
            />
            {!coupleBrideAr.trim() && designValidationError && (
              <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>يرجى كتابة اسم العروسة بالعربية</span>
              </p>
            )}
          </div>
        </div>

        {/* English Couple Names (Optional - أسماء العروسين باللغة الإنجليزية) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
              <span>اسم العريس (English): <span className="text-[10px] text-stone-400 font-normal">(اختياري)</span></span>
            </label>
            <input
              type="text"
              value={coupleGroomEn}
              onChange={(e) => setCoupleGroomEn(e.target.value)}
              placeholder="مثال: Kamel Ahmed"
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#720925] focus:outline-hidden transition-all text-left font-serif"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
              <span>اسم العروسة (English): <span className="text-[10px] text-stone-400 font-normal">(اختياري)</span></span>
            </label>
            <input
              type="text"
              value={coupleBrideEn}
              onChange={(e) => setCoupleBrideEn(e.target.value)}
              placeholder="مثال: Fatima Hassan"
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#720925] focus:outline-hidden transition-all text-left font-serif"
            />
          </div>
        </div>

        {/* تنبيه توضيحي للعميل عن الأسماء بالإنجليزية */}
        <div className="text-[11px] text-stone-600 bg-stone-50/90 border border-stone-200/80 rounded-xl px-3.5 py-2.5 flex items-start gap-2">
          <span className="text-xs leading-none mt-0.5">💡</span>
          <span className="leading-relaxed">
            <strong>الأسماء بالإنجليزية اختيارية:</strong> إذا أدخلتها ستظهر بخط إنجليزي أنيق أسفل أسمائكم العربية في بطاقة الدعوة، وإذا تركتها فارغة ستظهر دعوتك باللغة العربية فقط ولن يظهر أي نص إنجليزي.
          </span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 block">عنوان الدعوة الرئيسي:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="دعوة زفاف أحمد & سارة ❤️"
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#720925] focus:outline-hidden"
          />
        </div>

        {/* Event Type */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 block">نوع المناسبة الرئيسية:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white"
          >
            <option value="wedding">زفاف وفرح (Wedding)</option>
            <option value="engagement">حفل خطوبة (Engagement)</option>
            <option value="henna">ليلة حنة (Henna Night)</option>
            <option value="katb_ketab">عقد قران وكتب كتاب (Katb Ketab)</option>
            <option value="custom">مناسبة خاصة مخصصة</option>
          </select>
        </div>

        {/* Unique Generated Slug / Link Preview with Collision-Proof Random Suffix */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>رابط دعوتك الفريد والخاص لمنع أي تكرار:</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
              رابط حصري ومميز 🔒
            </span>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-white/95 rounded-xl border border-amber-200 text-xs font-mono text-stone-800 shadow-2xs">
            <button
              type="button"
              onClick={onCopySlug}
              className="p-1 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors shrink-0 cursor-pointer"
              title="نسخ الرابط"
            >
              {copySuccess ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <span className="truncate flex-1 text-left" dir="ltr">
              https://farahna.menuflowx.com/invitation/{type}/{generatedSlug}
            </span>
          </div>

          <p className="text-[10px] text-amber-900/80 leading-relaxed font-medium">
            💡 يتم توليد الرابط تلقائياً بأسماء العروسين مع كود عشوائي فريد لضمان عدم حدوث أي تكرار أو تعارض مع أي دعوة أخرى، ويتحدث الرابط فوراً مع كتابة الأسماء!
          </p>
        </div>
      </div>
    </section>
  );
}
