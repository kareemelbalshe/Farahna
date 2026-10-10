'use client';

import React, { useEffect, useState } from 'react';
import {
  Palette,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  PlusCircle,
  X,
  Eye,
  Smartphone,
  Monitor,
  RefreshCw,
  Heart,
} from 'lucide-react';
import { DEFAULT_THEMES } from '@farahna/shared';
import { adminFetch } from '@/lib/api';

export default function AdminThemesPage() {
  const [themes, setThemes] = useState<any[]>(DEFAULT_THEMES);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Interactive Live Preview Modal State
  const [previewTheme, setPreviewTheme] = useState<any | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [iframeKey, setIframeKey] = useState(0);

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

  const getThemePreviewUrl = (theme: any) => {
    if (!theme) return '/invitation/wedding/ahmed-sara';
    const cfg = (theme.config || {}) as Record<string, any>;
    const params = new URLSearchParams();
    if (theme.slug) params.set('theme', theme.slug);
    if (cfg.primaryColor) params.set('primary', cfg.primaryColor);
    if (cfg.secondaryColor) params.set('secondary', cfg.secondaryColor);
    if (cfg.backgroundColor) params.set('bg', cfg.backgroundColor);
    if (cfg.textColor) params.set('text', cfg.textColor);
    if (cfg.fontFamily) params.set('font', cfg.fontFamily);
    if (cfg.envelopeStyle) params.set('envelope', cfg.envelopeStyle);
    return `/invitation/wedding/ahmed-sara?${params.toString()}`;
  };

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
            إدارة النماذج البصرية، الألوان، الخطوط العربية، ومعاينة كل ثيم بشكل حي ومطابق تماماً للدعوة الواقعية.
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
          const previewUrl = getThemePreviewUrl(theme);
          const isDarkTheme = Boolean(
            cfg.backgroundColor &&
              ['#0', '#1', '#2', 'black'].some((p) => cfg.backgroundColor.toLowerCase().startsWith(p))
          );

          return (
            <div
              key={theme.slug || theme.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden flex flex-col justify-between p-6 space-y-4 hover:shadow-md transition-all group"
            >
              <div className="space-y-4">
                {/* Theme Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎨</span>
                    <div>
                      <h3 className="font-black text-stone-900 text-base">{theme.nameAr}</h3>
                      <p className="text-[11px] text-stone-400 font-mono">{theme.name || theme.slug}</p>
                    </div>
                  </div>
                  {theme.isDefault && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      افتراضي
                    </span>
                  )}
                </div>

                {/* 🌟 Realistic Mini Visual Showcase Banner */}
                <div
                  className="relative p-5 rounded-2xl border transition-transform duration-300 group-hover:scale-[1.01] overflow-hidden flex flex-col items-center justify-center text-center space-y-2 shadow-xs"
                  style={{
                    backgroundColor: cfg.backgroundColor || '#FAF7F2',
                    borderColor: cfg.secondaryColor || '#D4AF37',
                    color: cfg.textColor || '#1A1819',
                  }}
                >
                  <div
                    className="text-[9px] font-bold tracking-widest uppercase opacity-75"
                    style={{ color: cfg.secondaryColor || '#D4AF37' }}
                  >
                    بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
                  </div>

                  <div
                    className="text-lg font-black tracking-tight"
                    style={{
                      color: cfg.primaryColor || '#720925',
                      fontFamily: cfg.fontFamily || 'Cairo',
                    }}
                  >
                    أحمد &amp; سارة
                  </div>

                  <div
                    className="flex items-center gap-2 text-[10px] font-bold opacity-80"
                    style={{ color: cfg.textColor || '#1A1819' }}
                  >
                    <span>💍 دعوة زفاف ملكية</span>
                    <span className="opacity-40">•</span>
                    <span>٢٠ نوفمبر ٢٠٢٦</span>
                  </div>

                  {/* Wax Seal / Stamp */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shadow-xs mt-1 border border-white/20"
                    style={{ backgroundColor: cfg.primaryColor || '#720925' }}
                    title="ختم الشمع والموسيقى"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" style={{ color: cfg.secondaryColor || '#D4AF37' }} />
                  </div>
                </div>

                {/* Color Palette Preview Swatches */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-stone-500">لوحة الألوان الأساسية:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-xl border border-black/10 shadow-xs flex items-center justify-center text-[9px] font-bold text-white/90"
                      style={{ backgroundColor: cfg.primaryColor || '#720925' }}
                      title={`اللون الرئيسي: ${cfg.primaryColor}`}
                    >
                      P
                    </div>
                    <div
                      className="w-7 h-7 rounded-xl border border-black/10 shadow-xs flex items-center justify-center text-[9px] font-bold text-stone-900"
                      style={{ backgroundColor: cfg.secondaryColor || '#D4AF37' }}
                      title={`اللون الثانوي/الذهب: ${cfg.secondaryColor}`}
                    >
                      S
                    </div>
                    <div
                      className="w-7 h-7 rounded-xl border border-black/10 shadow-xs flex items-center justify-center text-[9px] font-bold text-stone-600"
                      style={{ backgroundColor: cfg.backgroundColor || '#FAF7F2' }}
                      title={`لون الخلفية: ${cfg.backgroundColor}`}
                    >
                      BG
                    </div>
                    <div
                      className="w-7 h-7 rounded-xl border border-black/10 shadow-xs flex items-center justify-center text-[9px] font-bold text-stone-300"
                      style={{ backgroundColor: cfg.textColor || '#1A1819' }}
                      title={`لون الخط: ${cfg.textColor}`}
                    >
                      T
                    </div>

                    <div className="mr-auto text-[10px] text-stone-400 font-mono">
                      {cfg.primaryColor} • {cfg.secondaryColor}
                    </div>
                  </div>
                </div>

                {/* Typography info */}
                <div className="pt-2 border-t border-stone-100 text-xs text-stone-600 space-y-1">
                  <p><strong>الخط والتنسيق:</strong> {cfg.fontFamily || 'Cairo'}</p>
                  <p><strong>طراز المظروف:</strong> {cfg.envelopeStyle || 'wax-seal'}</p>
                </div>
              </div>

              {/* Action Buttons: Live Interactive Preview Modal & Direct Tab Link */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewTheme(theme);
                    setIframeKey((prev) => prev + 1);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>معاينة حية فورية 👁️</span>
                </button>

                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs transition-all cursor-pointer active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>فتح في لسان ↗️</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* 📱 Interactive Full Live Preview Modal */}
      {previewTheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-3">
                <span className="text-xl">🎨</span>
                <div>
                  <h3 className="text-sm sm:text-base font-black">
                    معاينة حية لثيم: {previewTheme.nameAr}
                  </h3>
                  <p className="text-[11px] text-stone-400 font-mono">
                    {previewTheme.slug} • الخط: {previewTheme.config?.fontFamily || 'Cairo'}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Device Switcher */}
                <div className="hidden sm:flex items-center bg-stone-800 rounded-xl p-1 border border-stone-700">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      previewDevice === 'mobile'
                        ? 'bg-amber-500 text-stone-950 shadow-xs'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>موبايل</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      previewDevice === 'desktop'
                        ? 'bg-amber-500 text-stone-950 shadow-xs'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>كمبيوتر</span>
                  </button>
                </div>

                {/* Reload Preview */}
                <button
                  type="button"
                  onClick={() => setIframeKey((k) => k + 1)}
                  className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
                  title="إعادة تحميل المعاينة"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                {/* Open in full tab */}
                <a
                  href={getThemePreviewUrl(previewTheme)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">لسان مستقل</span>
                </a>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setPreviewTheme(null)}
                  className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white hover:bg-rose-900 transition-colors mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body with Live Iframe */}
            <div className="flex-1 bg-stone-950 flex items-center justify-center p-2 sm:p-4 overflow-hidden relative">
              <div
                className={`transition-all duration-300 h-full w-full flex items-center justify-center`}
              >
                <div
                  className={`h-full bg-white transition-all duration-300 shadow-2xl relative overflow-hidden ${
                    previewDevice === 'mobile'
                      ? 'w-[390px] rounded-[36px] border-[10px] border-stone-800 shadow-2xl'
                      : 'w-full rounded-2xl border border-stone-800'
                  }`}
                >
                  <iframe
                    key={iframeKey}
                    src={getThemePreviewUrl(previewTheme)}
                    className="w-full h-full border-0"
                    title={`Live preview of ${previewTheme.nameAr}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Custom Theme */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 overflow-y-auto max-h-[90vh]">
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

            {/* 🌟 Real-time Live Interactive Showcase of New Custom Theme */}
            <div
              className="p-5 rounded-2xl border text-center space-y-2 transition-all shadow-xs"
              style={{
                backgroundColor,
                borderColor: secondaryColor,
                color: textColor,
              }}
            >
              <span className="text-[10px] font-bold block" style={{ color: secondaryColor }}>
                معاينة حية فورية للثيم الجديد أثناء التعديل ✨
              </span>
              <h4
                className="text-xl font-black"
                style={{ color: primaryColor, fontFamily }}
              >
                {nameAr || 'أحمد & سارة'}
              </h4>
              <p className="text-xs" style={{ color: textColor }}>
                يسعدنا ويشرفنا حضوركم لمشاركتنا فرحتنا الكبرى ❤️
              </p>
              <div
                className="w-7 h-7 rounded-full mx-auto flex items-center justify-center text-xs shadow-xs"
                style={{ backgroundColor: primaryColor }}
              >
                <Heart className="w-3.5 h-3.5 fill-current" style={{ color: secondaryColor }} />
              </div>
            </div>

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
                    <option value="Marhey">خط مرحي الاحتفالي (Marhey)</option>
                    <option value="IBM Plex Sans Arabic">خط آي بي إم بليكس (IBM Plex)</option>
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
