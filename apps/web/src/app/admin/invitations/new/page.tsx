'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch } from '@/lib/api';
import { ArrowRight, PlusCircle, Sparkles } from 'lucide-react';

export default function NewInvitationPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [customerId, setCustomerId] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState('wedding');
  const [coupleGroomAr, setCoupleGroomAr] = useState('');
  const [coupleBrideAr, setCoupleBrideAr] = useState('');
  const [eventDate, setEventDate] = useState('2026-11-20T19:00:00');
  const [themeId, setThemeId] = useState('');
  const [isMultiEvent, setIsMultiEvent] = useState(true);

  useEffect(() => {
    Promise.all([adminFetch('/customers'), adminFetch('/themes')]).then(
      ([custRes, themeRes]) => {
        if (custRes.success && custRes.data.customers?.length > 0) {
          setCustomers(custRes.data.customers);
          setCustomerId(custRes.data.customers[0].id);
        }
        if (themeRes.success && themeRes.data?.length > 0) {
          setThemes(themeRes.data);
          setThemeId(themeRes.data[0].id);
        }
        setLoading(false);
      }
    );
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await adminFetch('/invitations', {
        method: 'POST',
        body: JSON.stringify({
          customerId,
          title,
          slug: slug.toLowerCase().trim(),
          type,
          coupleGroomAr,
          coupleBrideAr,
          eventDate: new Date(eventDate).toISOString(),
          themeId,
          isMultiEvent,
          status: 'draft',
        }),
      });

      if (res.success && res.data?.id) {
        router.push(`/admin/invitations/${res.data.id}/builder`);
      } else {
        setErrorMsg(res.message || 'فشل إنشاء الدعوة');
      }
    } catch (e) {
      setErrorMsg('حدث خطأ في الاتصال');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-right font-cairo">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push('/admin/invitations')}
          className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-stone-900">إنشاء دعوة جديدة 🪄</h1>
          <p className="text-xs text-stone-500">
            أدخل البيانات الأساسية للعروسين وسيتم فتح المحرر المرئي فوراً
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs p-6 sm:p-8 space-y-6">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4">
          {/* Customer */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">ربط بالعميل: *</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">عنوان الدعوة: *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: دعوة زفاف أحمد وسارة ❤️"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">
              الرابط المختصر الفريد (Slug بالإنجليزية والأرقام): *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-mono">
                /invitation/wedding/
              </span>
              <input
                type="text"
                required
                pattern="^[a-z0-9-]+$"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="ahmed-sara"
                className="w-full pl-44 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs font-mono text-left dir-ltr"
              />
            </div>
          </div>

          {/* Couple Names */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">اسم العريس: *</label>
              <input
                type="text"
                required
                value={coupleGroomAr}
                onChange={(e) => setCoupleGroomAr(e.target.value)}
                placeholder="أحمد محمود"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">اسم العروسة: *</label>
              <input
                type="text"
                required
                value={coupleBrideAr}
                onChange={(e) => setCoupleBrideAr(e.target.value)}
                placeholder="سارة إبراهيم"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs"
              />
            </div>
          </div>

          {/* Type & Theme */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">نوع الدعوة:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white"
              >
                <option value="wedding">زفاف وفرح (Wedding)</option>
                <option value="engagement">خطوبة (Engagement)</option>
                <option value="henna">ليلة حنة (Henna)</option>
                <option value="katb_ketab">كتب كتاب (Katb Ketab)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">ثيم التصميم:</label>
              <select
                value={themeId}
                onChange={(e) => setThemeId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white"
              >
                {themes.map((th) => (
                  <option key={th.id} value={th.id}>
                    {th.nameAr} ({th.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Event Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">تاريخ ووقت المناسبة:</label>
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-left dir-ltr"
            />
          </div>

          {/* Multi-event toggle */}
          <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 cursor-pointer">
            <input
              type="checkbox"
              checked={isMultiEvent}
              onChange={(e) => setIsMultiEvent(e.target.checked)}
              className="w-4 h-4 rounded text-[#720925]"
            />
            <div>
              <span className="text-xs font-bold text-amber-900 block">
                تفعيل رحلة الفرح المتعددة (Multi-Event Journey)
              </span>
              <span className="text-[11px] text-amber-800">
                يتيح إضافة الخطوبة والحنة وكتب الكتاب والفرح في نفس الدعوة برابط موحد
              </span>
            </div>
          </label>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl burgundy-gradient-bg text-white font-bold text-xs shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity"
            >
              {submitting ? 'جاري الإنشاء وتجهيز المحرر...' : 'إنشاء والانتقال إلى المحرر المرئي 🪄'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
