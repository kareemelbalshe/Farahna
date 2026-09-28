'use client';

import React from 'react';
import { Tag, Check, Sparkles } from 'lucide-react';

const PACKAGES = [
  {
    name: 'باقة المناسبة الواحدة',
    slug: 'basic',
    price: 350,
    currency: 'ج.م',
    duration: 'صلاحية شهر كامل',
    badge: 'مثالية للخطوبة أو كتب الكتاب',
    isPopular: false,
    maxEvents: 1,
    features: [
      'مناسبة واحدة (فرح أو خطوبة أو كتب كتاب)',
      'تصميم مخصص بأسماء العروسين وصورهم',
      'خريطة تفاعلية للموقع والاتجاهات',
      'عداد تنازلي لموعد المناسبة',
      'مشاركة سريعة عبر واتساب ومسنجر',
      'تعديلات مجانية حتى الاعتماد',
    ],
  },
  {
    name: 'باقة رحلة الفرح الشاملة',
    slug: 'wedding-journey',
    price: 650,
    currency: 'ج.م',
    duration: 'صلاحية ٣ شهور',
    badge: 'الأكثر طلباً والأفضل قيمة 👑',
    isPopular: true,
    maxEvents: 5,
    features: [
      'رحلة الفرح كاملة برابط واحد (خطوبة + حنة + كتب كتاب + فرح)',
      'تبويبات تنقل ذكية بين المناسبات',
      'فتح الظرف التفاعلي الفاخر',
      'مشغل موسيقى هادئة بنقرة واحدة',
      'تأكيد الحضور (RSVP) وحصر الضيوف',
      'إضافة الموعد لتقويم Google و Apple',
      'رمز QR Code عالي الدقة للطباعة',
      'دعم تعديل أي موعد في أي وقت',
    ],
  },
  {
    name: 'باقة التصميم الخاص VIP',
    slug: 'luxury-vip',
    price: 1100,
    currency: 'ج.م',
    duration: 'صلاحية ٦ شهور',
    badge: 'فخامة ملكية وتخصيص كامل',
    isPopular: false,
    maxEvents: 10,
    features: [
      'كل مميزات باقة رحلة الفرح الشاملة',
      'تخصيص كامل للألوان والخطوط والزخارف',
      'قسم ليلة الحنة المخصص للسيدات بخصوصية تامة',
      'معرض صور غير محدود لجلسة التصوير',
      'إمكانية حجز اسم نطاق خاص (Custom Domain)',
      'أولوية تصميم وتسليم خلال ساعات',
    ],
  },
];

export default function AdminPricingPage() {
  return (
    <div className="space-y-6 text-right font-cairo">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-stone-900">باقات الأسعار والخدمات (Pricing Plans)</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-200">
              3 باقات رئيسية
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            إدارة خطط الأسعار المعروضة على الموقع للجمهور بالجنيه المصري (EGP)
          </p>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PACKAGES.map((plan) => (
          <div
            key={plan.slug}
            className={`rounded-3xl p-6 bg-white border ${
              plan.isPopular ? 'border-amber-400 shadow-md ring-2 ring-amber-400/20' : 'border-stone-200 shadow-2xs'
            } space-y-5 flex flex-col justify-between`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-stone-900 text-lg">{plan.name}</h3>
                  <p className="text-xs text-stone-400">{plan.badge}</p>
                </div>
                {plan.isPopular && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                    الأكثر طلباً ⭐
                  </span>
                )}
              </div>

              <div>
                <span className="text-3xl font-black text-stone-900">{plan.price}</span>
                <span className="text-xs text-stone-500 mr-1.5 font-bold">{plan.currency}</span>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-2">
                <span className="text-xs font-bold text-stone-700 block">المميزات المضمنة:</span>
                <ul className="space-y-2 text-xs text-stone-600">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
              <span>أقصى عدد مناسبات: {plan.maxEvents}</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">نشطة</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
