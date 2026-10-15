'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Check, Sparkles, Save, RotateCcw, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { fetchPricingPlans, bulkUpdatePricingPlans, DEFAULT_PRICING_PLANS } from '@/lib/api';

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<any[]>(DEFAULT_PRICING_PLANS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const data = await fetchPricingPlans();
      if (data && data.length > 0) {
        setPlans(data);
      }
    } catch (e) {
      // Keep default plans
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (slug: string, newPrice: string) => {
    const num = parseFloat(newPrice);
    setPlans((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, price: isNaN(num) ? 0 : num } : p))
    );
  };

  const handleBadgeChange = (slug: string, newBadge: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, badge: newBadge } : p))
    );
  };

  const handleDurationChange = (slug: string, newDays: string) => {
    const num = parseInt(newDays, 10);
    setPlans((prev) =>
      prev.map((p) => (p.slug === slug ? { ...p, durationDays: isNaN(num) ? 30 : num } : p))
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const payload = plans.map((p) => ({
        slug: p.slug,
        price: Number(p.price) || 0,
        badge: p.badge,
        durationDays: p.durationDays,
        isPopular: p.isPopular,
      }));

      const res = await bulkUpdatePricingPlans(payload);
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: 'تم حفظ وتحديث أسعار الباقات في الباك-إند بنجاح! تنعكس الأسعار الجديدة فوراً في صفحة الهبوط واستوديو التصميم.',
        });
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPlans(res.data);
        }
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'فشل حفظ الأسعار، يرجى المحاولة مرة أخرى.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'حدث خطأ أثناء الاتصال بالخادم.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('هل ترغب في استعادة الأسعار الأصلية (50 ج.م للباقة الأساسية، 95 ج.م لرحلة الفرح، 150 ج.م لباقة VIP)؟')) {
      setPlans(DEFAULT_PRICING_PLANS);
    }
  };

  return (
    <div className="space-y-6 text-right font-cairo">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-stone-900">إدارة أسعار الباقات (Backend Pricing)</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-200">
              3 باقات رئيسية
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            عدّل الأسعار هنا في أي وقت من الباك-إند، وستتحدث تلقائياً وفورياً في كل مكان بالسيستم (صفحة الهبوط واستوديو التصميم وحساب الفروقات والدفع).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
            <span>استعادة الأسعار الافتراضية (50 / 95 / 150)</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving || loading}
            className="px-5 py-2 rounded-xl burgundy-gradient-bg text-white font-black text-xs hover:opacity-95 shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-amber-300" />
                <span>حفظ وتحديث الأسعار في المنصة 💾</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-bold animate-fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isVip = plan.slug === 'luxury-vip';
          const isJourney = plan.slug === 'wedding-journey';
          return (
            <div
              key={plan.slug}
              className={`rounded-3xl p-6 bg-white border-2 ${
                isVip
                  ? 'border-amber-400 shadow-md ring-2 ring-amber-400/20'
                  : isJourney
                  ? 'border-rose-300 shadow-sm'
                  : 'border-stone-200 shadow-2xs'
              } space-y-5 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-stone-900 text-lg">{plan.nameAr || plan.name}</h3>
                    <span className="text-[10px] font-mono text-stone-400 block">{plan.slug}</span>
                  </div>
                  {plan.isPopular && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                      الأكثر طلباً ⭐
                    </span>
                  )}
                </div>

                {/* Editable Price Input */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                  <label className="text-xs font-black text-stone-700 block">
                    السعر المعتمد في المنصة (ج.م):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="5"
                      value={plan.price}
                      onChange={(e) => handlePriceChange(plan.slug, e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-black text-xl text-stone-900 text-left font-mono focus:ring-2 focus:ring-[#720925] focus:outline-hidden"
                    />
                    <span className="text-sm font-bold text-stone-600 shrink-0">ج.م</span>
                  </div>
                  <span className="text-[10px] text-stone-400">
                    السعر الحالي المعروض للعملاء: {plan.price} ج.م
                  </span>
                </div>

                {/* Editable Badge Text */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 block">نص الشارة الترويجية:</label>
                  <input
                    type="text"
                    value={plan.badge || ''}
                    onChange={(e) => handleBadgeChange(plan.slug, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-white text-right"
                  />
                </div>

                {/* Editable Validity Days */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 block">صلاحية الرابط (بالأيام):</label>
                  <input
                    type="number"
                    min="1"
                    value={plan.durationDays || 60}
                    onChange={(e) => handleDurationChange(plan.slug, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-white text-left font-mono"
                  />
                </div>

                {/* Included Features Summary */}
                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <span className="text-xs font-bold text-stone-700 block">المميزات الأساسية:</span>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {plan.slug === 'basic' && (
                      <>
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>مناسبة رئيسية واحدة (فرح أو خطوبة أو كتب كتاب)</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>قوالب كلاسيكية منسقة بألوانها الأصلية</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>خطوط عربية قياسية وعرض مباشر للبطاقة</span>
                        </li>
                      </>
                    )}
                    {plan.slug === 'wedding-journey' && (
                      <>
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>رحلة الفرح كاملة برابط واحد حتى 4 مناسبات</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>فتح الظرف التفاعلي ثلاثي الأبعاد بجميع حركاته</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>الباليتات الملكية المقترحة و5 خطوط و5 باترنات وموسيقى</span>
                        </li>
                      </>
                    )}
                    {plan.slug === 'luxury-vip' && (
                      <>
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>كامل المميزات مفتوحة 100% مع عجلة الألوان الحرة وكود Hex</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>ألبوم صور وجاليري الذكريات + ليلة الحنة مع قفل سري</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>ختم شمعي مونوغرام بحروف العروسين وبريق ملكي</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                <span>الحالة: نشطة على الموقع</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  مفعلة ✓
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
