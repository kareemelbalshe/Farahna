'use client';

import React, { useEffect, useState } from 'react';
import { Palette, CheckCircle2, Sparkles, ExternalLink, PlusCircle, X, Check } from 'lucide-react';
import { DEFAULT_THEMES } from '@farahna/shared';
import { adminFetch } from '@/lib/api';

export default function AdminThemesPage() {
  const [themes, setThemes] = useState<any[]>(DEFAULT_THEMES);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // New Theme Form State
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#720925');
  const [secondaryColor, setSecondaryColor] = useState('#D4AF37');
  const [backgroundColor, setBackgroundColor] = useState('#FAF7F2');
  const [textColor, setTextColor] = useState('#1A1819');
  const [fontFamily, setFontFamily] = useState('Cairo');
  const [envelopeStyle, setEnvelopeStyle] = useState('wax-seal');

  const fetchThemesList = async () => {
    try {
      const res = await adminFetch('/themes');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setThemes(res.data);
      }
    } catch (e) {
      // safe fallback to DEFAULT_THEMES
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemesList();
  }, []);

  const handleCreateTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !slug) {
      setErrorMsg('يرجى ملء اسم الثيم بالعربي والرابط المختصر');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        name: nameEn || nameAr,
        nameAr,
        slug: slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-'),
        config: {
          primaryColor,
          secondaryColor,
          backgroundColor,
          textColor,
          fontFamily,
          envelopeStyle,
          cardStyle: 'فاخر مخصص',
        },
      };

      const res = await adminFetch('/themes', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setToastMsg('تم حفظ الثيم الجديد في النظام بنجاح وأصبح متاحاً فوراً لكافة الدعوات! 🎨');
        setShowAddModal(false);
        // Reset form
        setNameAr('');
        setNameEn('');
        setSlug('');
        fetchThemesList();
      } else {
        setErrorMsg(res.message || 'فشل حفظ الثيم');
      }
    } catch (err: any) {
      setErrorMsg('حدث خطأ أثناء حفظ الثيم');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-right font-cairo">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-stone-900">الثيمات والتصاميم (Themes)</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-[#720925] font-bold border border-rose-200">
              {themes.length} ثيمات معتمدة
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            إدارة النماذج البصرية، الألوان، الخطوط العربية، وتصميم المظاريف لدعوات فرحنا (جميع الثيمات الجديدة تحفظ في قاعدة البيانات وتظل متاحة دائماً)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl burgundy-gradient-bg text-white font-bold text-xs shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إضافة ثيم جديد مخصص 🎨</span>
        </button>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => {
          const cfg = (theme.config || {}) as Record<string, any>;
          return (
            <div
              key={theme.slug || theme.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden flex flex-col justify-between p-6 space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Theme Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎨</span>
                    <div>
                      <h3 className="font-black text-stone-900 text-base">{theme.nameAr}</h3>
                      <p className="text-[11px] text-stone-400">{theme.name}</p>
                    </div>
                  </div>
                  {theme.isDefault && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      افتراضي
                    </span>
                  )}
                </div>

                {/* Color Palette Preview */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-stone-500">لوحة الألوان الأساسية:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-xl border border-black/10 shadow-xs"
                      style={{ backgroundColor: cfg.primaryColor || '#720925' }}
                      title={`Primary: ${cfg.primaryColor}`}
                    />
                    <div
                      className="w-7 h-7 rounded-xl border border-black/10 shadow-xs"
                      style={{ backgroundColor: cfg.secondaryColor || '#D4AF37' }}
                      title={`Secondary: ${cfg.secondaryColor}`}
                    />
                    <div
                      className="w-7 h-7 rounded-xl border border-black/10 shadow-xs"
                      style={{ backgroundColor: cfg.backgroundColor || '#FAF7F2' }}
                      title={`Background: ${cfg.backgroundColor}`}
                    />
                    <div
                      className="w-7 h-7 rounded-xl border border-black/10 shadow-xs"
                      style={{ backgroundColor: cfg.textColor || '#1A1819' }}
                      title={`Text: ${cfg.textColor}`}
                    />
                  </div>
                </div>

                {/* Typography info */}
                <div className="pt-2 border-t border-stone-100 text-xs text-stone-600 space-y-1">
                  <p><strong>الخط والتنسيق:</strong> {cfg.fontFamily || 'Cairo'}</p>
                  <p><strong>طراز المظروف:</strong> {cfg.envelopeStyle || 'wax-seal'}</p>
                  <p><strong>طراز البطاقة:</strong> {cfg.cardStyle || 'فاخر'}</p>
                </div>
              </div>

              {/* Action Preview */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <a
                  href={`/invitation/wedding/ahmed-sara`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#720925] hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>معاينة حية للدعوة</span>
                </a>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                  محفوظ ومتاح دائماً ✅
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add New Custom Theme */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎨</span>
                <h3 className="text-lg font-black text-stone-900">إضافة ثيم جديد إلى النظام</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateTheme} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">اسم الثيم بالعربي: *</label>
                  <input
                    type="text"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: الفيروزي الملكي"
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">اسم الثيم بالإنجليزي:</label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Royal Turquoise"
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">الرابط المختصر الفريد (Slug بالإنجليزية): *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="royal-turquoise"
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-mono text-left dir-ltr"
                />
              </div>

              {/* Color pickers */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <span className="font-bold text-stone-800 block">لوحة ألوان الثيم المخصصة:</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0"
                    />
                    <div>
                      <span className="font-bold block text-stone-700">اللون الرئيسي (Primary)</span>
                      <span className="font-mono text-[10px] text-stone-400">{primaryColor}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0"
                    />
                    <div>
                      <span className="font-bold block text-stone-700">اللون الثانوي (الذهب/الزخارف)</span>
                      <span className="font-mono text-[10px] text-stone-400">{secondaryColor}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0"
                    />
                    <div>
                      <span className="font-bold block text-stone-700">لون الخلفية (Background)</span>
                      <span className="font-mono text-[10px] text-stone-400">{backgroundColor}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0"
                    />
                    <div>
                      <span className="font-bold block text-stone-700">لون النصوص (Text)</span>
                      <span className="font-mono text-[10px] text-stone-400">{textColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography & Envelope style */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">نوع الخط العربي:</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Cairo">خط كايرو الحديث (Cairo)</option>
                    <option value="Amiri">خط أميري الملكي (Amiri)</option>
                    <option value="Tajawal">خط تجوال (Tajawal)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">طراز المظروف وختم الشمع:</label>
                  <select
                    value={envelopeStyle}
                    onChange={(e) => setEnvelopeStyle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="wax-seal">ختم الشمع التفاعلي الفاخر</option>
                    <option value="vintage-crest">إطار كلاسيكي ملكي</option>
                    <option value="floral-border">زخارف نباتية هادئة</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl burgundy-gradient-bg text-white font-bold shadow-md shadow-rose-950/20 hover:opacity-95 disabled:opacity-50"
                >
                  {submitting ? 'جاري الحفظ في النظام...' : 'حفظ الثيم في النظام للأبد 💾'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
