'use client';

import React, { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/api';
import { Settings, Save, Check, ShieldCheck, Smartphone } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    siteNameAr: 'فرحنا',
    whatsappNumber: '201012345678',
    supportPhone: '+201012345678',
    paymentInstructionsAr: 'الدفع متاح عبر InstaPay أو فودافون كاش — سيتم إرسال تفاصيل الدفع لحضرتك على واتساب',
    defaultTimezone: 'Africa/Cairo',
    defaultDurationDays: 60,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    adminFetch('/settings').then((res) => {
      if (res.success && res.data) {
        setSettings(res.data);
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const res = await adminFetch('/settings', {
        method: 'PATCH',
        body: JSON.stringify(settings),
      });
      if (res.success) {
        setMsg('تم حفظ وتحديث إعدادات المنصة بنجاح!');
        setTimeout(() => setMsg(''), 3000);
      } else {
        alert(res.message || 'حدث خطأ');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs font-bold text-stone-500">جاري تحميل الإعدادات...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-right font-cairo">
      <div>
        <h1 className="text-2xl font-black text-stone-900">إعدادات منصة فرحنا ⚙️</h1>
        <p className="text-xs text-stone-500 mt-1">
          إدارة بيانات المنصة العامة، طرق الدفع المتاحة، والتعليمات الموجهة للعملاء.
        </p>
      </div>

      {msg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg('')} className="text-emerald-700 font-bold">×</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
        {/* Site Name & Support */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-stone-900 pb-2 border-b border-stone-100">
            بيانات المنصة والتواصل
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">اسم المنصة بالعربية:</label>
            <input
              type="text"
              value={settings.siteNameAr || ''}
              onChange={(e) => setSettings({ ...settings, siteNameAr: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">رقم واتساب المعتمد (لإرسال تفاصيل الدفع والتواصل):</label>
              <input
                type="text"
                value={settings.whatsappNumber || ''}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="201012345678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-left dir-ltr"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">هاتف الدعم الفني المباشر:</label>
              <input
                type="text"
                value={settings.supportPhone || ''}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                placeholder="+201012345678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-left dir-ltr"
              />
            </div>
          </div>
        </div>

        {/* Payment Methods & Instructions (Strict Privacy - Zero Personal Accounts Stored) */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#720925]" />
              <span>طرق الدفع المتاحة وتعليمات التحويل اليدوي</span>
            </h3>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
              يدوي بالكامل
            </span>
          </div>

          {/* Privacy & Zero-Storage Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">قاعدة الخصوصية والأمان المالي:</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                طرق الدفع المعتمدة هي <strong>InstaPay</strong> و <strong>فودافون كاش</strong> فقط.
                لا يتم حفظ أي أرقام حسابات أو محافظ شخصية داخل النظام مطلقاً؛ بل يتم إرسال بيانات التحويل يدوياً ومباشرة للعميل عبر واتساب من قبل الإدارة بعد اعتماد معاينة الدعوة.
              </p>
            </div>
          </div>

          {/* Supported Methods Badges */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 block">طرق التحويل المدعومة في المنصة:</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-center gap-3">
                <span className="text-2xl">📲</span>
                <div>
                  <h4 className="text-xs font-black text-emerald-950">InstaPay (إنستاباي)</h4>
                  <p className="text-[10px] text-emerald-800">تحويل لحظي بين البنوك المصرية</p>
                </div>
              </div>
              <div className="p-3 rounded-2xl border border-rose-200 bg-rose-50/40 flex items-center gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <h4 className="text-xs font-black text-rose-950">فودافون كاش (Vodafone Cash)</h4>
                  <p className="text-[10px] text-rose-800">تحويل المحافظ الذكية في مصر</p>
                </div>
              </div>
            </div>
          </div>

          {/* General Customer Instructions (NO NUMBERS) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">
              نص التعليمات العامة الموجه للعميل (خالٍ تماماً من أي أرقام حسابات أو محافظ):
            </label>
            <textarea
              rows={3}
              value={settings.paymentInstructionsAr || ''}
              onChange={(e) => setSettings({ ...settings, paymentInstructionsAr: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs leading-relaxed focus:border-[#720925] focus:outline-hidden"
              placeholder="الدفع متاح عبر InstaPay أو فودافون كاش — سيتم إرسال تفاصيل الدفع لحضرتك على واتساب"
            />
            <p className="text-[10px] text-stone-400">
              * هذا النص يظهر للعميل في شاشات المتابعة كتعليمات عامة، ويؤكد له أن تفاصيل التحويل ستصله مباشرة على واتساب.
            </p>
          </div>
        </div>

        {/* Defaults */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">المنطقة الزمنية الافتراضية:</label>
              <input
                type="text"
                disabled
                value={settings.defaultTimezone || 'Africa/Cairo'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-100 text-stone-500 dir-ltr text-left"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">مدة صلاحية الدعوة بالأيام:</label>
              <input
                type="number"
                value={settings.defaultDurationDays || 60}
                onChange={(e) => setSettings({ ...settings, defaultDurationDays: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-stone-100">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ التغييرات 💾'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
