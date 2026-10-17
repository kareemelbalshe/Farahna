'use client';

import React from 'react';
import { FileImage, Sparkles, Upload, Camera, Plus, Trash2, Lock, Shield } from 'lucide-react';

interface PhotosStepProps {
  selectedPackage: string;
  setSelectedPackage: (pkgId: string) => void;
  setIsMultiEvent: (val: boolean) => void;
  setSectionsVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  galleryImages: string[];
  setGalleryImages: React.Dispatch<React.SetStateAction<string[]>>;
  customGalleryUrlInput: string;
  setCustomGalleryUrlInput: (url: string) => void;
  hennaPasscode: string;
  setHennaPasscode: (code: string) => void;
  hennaFemaleOnly: boolean;
  setHennaFemaleOnly: (femaleOnly: boolean) => void;
  hennaMessage: string;
  setHennaMessage: (msg: string) => void;
  enableRoyalShimmer: boolean;
  setEnableRoyalShimmer: (shimmer: boolean) => void;
  waxSealMonogram: string;
  setWaxSealMonogram: (mono: string) => void;
  customOgImageUrl: string;
  setCustomOgImageUrl: (url: string) => void;
  coverImageUrl: string;
  setCoverImageUrl: (url: string) => void;
  coupleImageUrl: string;
  setCoupleImageUrl: (url: string) => void;
  coupleGroomAr: string;
  coupleBrideAr: string;
  handleImageFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    uploadCategory: 'og' | 'cover' | 'couple'
  ) => void;
}

export function PhotosStep({
  selectedPackage,
  setSelectedPackage,
  setIsMultiEvent,
  setSectionsVisibility,
  galleryImages,
  setGalleryImages,
  customGalleryUrlInput,
  setCustomGalleryUrlInput,
  hennaPasscode,
  setHennaPasscode,
  hennaFemaleOnly,
  setHennaFemaleOnly,
  hennaMessage,
  setHennaMessage,
  enableRoyalShimmer,
  setEnableRoyalShimmer,
  waxSealMonogram,
  setWaxSealMonogram,
  customOgImageUrl,
  setCustomOgImageUrl,
  coverImageUrl,
  setCoverImageUrl,
  coupleImageUrl,
  setCoupleImageUrl,
  coupleGroomAr,
  coupleBrideAr,
  handleImageFileUpload,
}: PhotosStepProps) {
  const isVip = selectedPackage === 'luxury-vip';

  const handleAddGalleryImage = (url: string) => {
    if (!url.trim()) return;
    setGalleryImages((prev) => [...prev, url.trim()]);
    setCustomGalleryUrlInput('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 text-right">
      {/* VIP Luxury Suite (متاح ومفعل حصرياً في باقة VIP) */}
      {isVip ? (
        <section className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-amber-50/90 via-white to-amber-50/60 border-2 border-amber-300 shadow-md space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-amber-200">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">💎</span>
              <div>
                <h3 className="text-base font-black text-amber-950 flex items-center gap-2">
                  <span>جناح التخصيص الملكي الحصري (VIP Luxury Suite)</span>
                  <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                    مفعل بالكامل VIP
                  </span>
                </h3>
                <p className="text-xs text-amber-800">
                  ميزات خاصة وحصرية لأصحاب باقة التصميم الخاص VIP تمنح دعوتكم فخامة استثنائية.
                </p>
              </div>
            </div>
          </div>

          {/* VIP Feature 1: Photo Album Gallery */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-600" />
                  <span>١. ألبوم وجاليري صور الذكريات (Photo Session Album):</span>
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  معرض صور تفاعلي للعروسين يظهر في الدعوة مع تكبير الصور (Lightbox).
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {galleryImages.length} صور في الألبوم
              </span>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {galleryImages.map((imgUrl, gIdx) => (
                <div
                  key={gIdx}
                  className="relative group rounded-xl overflow-hidden aspect-square border border-stone-200 bg-stone-100 shadow-2xs"
                >
                  <img src={imgUrl} alt={`صورة ${gIdx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(gIdx)}
                    className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                    title="حذف هذه الصورة"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Add New Gallery Image Box */}
              <div className="rounded-xl border-2 border-dashed border-amber-300 p-2 flex flex-col items-center justify-center text-center gap-1.5 bg-amber-50/40 aspect-square">
                <input
                  type="url"
                  value={customGalleryUrlInput}
                  onChange={(e) => setCustomGalleryUrlInput(e.target.value)}
                  placeholder="رابط صورة جديدة"
                  className="w-full text-[10px] px-2 py-1 rounded-lg border border-amber-200 bg-white text-left font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleAddGalleryImage(customGalleryUrlInput)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>إضافة</span>
                </button>
              </div>
            </div>
          </div>

          {/* VIP Feature 2: Secret Henna Night with Passcode */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span>٢. قسم ليلة الحنة الخاص بالسيدات مع رمز سري (Secret Henna Night):</span>
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  قسم منفصل وخاص لليلة الحنة لا يفتح إلا للضيوف المدعوين عبر إدخال رمز الحماية السري!
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                <input
                  type="checkbox"
                  checked={hennaFemaleOnly}
                  onChange={(e) => setHennaFemaleOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600"
                />
                <span className="text-xs font-bold text-amber-900">تفعيل حماية الرمز السري</span>
              </label>
            </div>

            {hennaFemaleOnly && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 block">
                    الرمز السري لفتح قسم الحنة (Passcode):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={hennaPasscode}
                      onChange={(e) => setHennaPasscode(e.target.value)}
                      placeholder="2026"
                      maxLength={6}
                      className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono font-bold tracking-widest text-center w-28 bg-stone-50"
                    />
                    <span className="text-[10px] text-stone-400">شاركي هذا الرمز مع الصديقات فقط 🔒</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 block">
                    رسالة ترحيب خاصة بليلة الحنة:
                  </label>
                  <input
                    type="text"
                    value={hennaMessage}
                    onChange={(e) => setHennaMessage(e.target.value)}
                    placeholder="يسعدنا تشريفكم في ليلة الحنة المبهجة..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* VIP Feature 3: Royal Shimmer & Monogram Seal */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200 space-y-3.5 shadow-xs">
            <h4 className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>٣. التأثيرات الملكية الفاخرة وختم الحروف Monogram:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/70 border border-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableRoyalShimmer}
                  onChange={(e) => setEnableRoyalShimmer(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600"
                />
                <div>
                  <span className="text-xs font-bold text-amber-950 block">بريق وشيمر ذهبي ملكي متحرك ✨</span>
                  <span className="text-[10px] text-amber-800">جزيئات ذهبية تطفو بنعومة في خلفية الدعوة</span>
                </div>
              </label>

              <div className="space-y-1 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <label className="text-[11px] font-bold text-stone-700 block">
                  حروف ختم الشمع (Monogram Seal):
                </label>
                <input
                  type="text"
                  value={waxSealMonogram}
                  onChange={(e) => setWaxSealMonogram(e.target.value)}
                  placeholder={`${coupleGroomAr?.charAt(0) || 'أ'} & ${coupleBrideAr?.charAt(0) || 'س'}`}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-bold text-center font-cairo"
                />
                <span className="text-[10px] text-stone-400 block text-center">تُنقش في منتصف ختم الشمع الملكي 💌</span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* VIP Teaser Card if Basic or Wedding Journey is selected */
        <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white space-y-3 shadow-md border border-stone-700">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">💎</span>
              <div>
                <h4 className="text-xs sm:text-sm font-black flex items-center gap-2">
                  <span>ميزات باقة التصميم الخاص VIP الملكية</span>
                  <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full">
                    +55 ج.م فقط
                  </span>
                </h4>
                <p className="text-[11px] text-stone-300 mt-0.5">
                  افتح ألبوم صور العروسين (Photo Session) + قسم ليلة الحنة للسيدات مع قفل سري + الشيمر والبريق الذهبي الملكي.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedPackage('luxury-vip');
                setIsMultiEvent(true);
                setSectionsVisibility((prev) => ({
                  ...prev,
                  events: true,
                  envelope: true,
                  rsvp: true,
                  gallery: true,
                  henna_special: true,
                }));
              }}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs transition-colors shadow-xs cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ترقية لباقة VIP الآن 💎</span>
            </button>
          </div>
        </section>
      )}

      {/* Step 7: Photos & WhatsApp Link Preview Image */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-sm font-black text-stone-900 flex items-center gap-2">
            <FileImage className="w-4.5 h-4.5 text-[#720925]" />
            <span>٧. صور الدعوة وصورة معاينة الرابط في رسائل واتساب:</span>
          </label>
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            تظهر كغلاف مصغر للرابط في شات الواتس 💬
          </span>
        </div>

        {/* 7.1: Dedicated WhatsApp Link Preview Image Customizer */}
        <div className="p-5 rounded-2xl bg-[#FAF7F2] border-2 border-amber-300/90 space-y-4 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>صورة كارت الرابط على واتساب (WhatsApp Link Preview Image):</span>
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5">
                هذه الصورة هي التي ستظهر كغلاف مصغر للرابط عند مشاركته في رسائل ومحادثات واتساب ومواقع التواصل.
              </p>
            </div>
            {customOgImageUrl && (
              <button
                type="button"
                onClick={() => setCustomOgImageUrl('')}
                className="text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors cursor-pointer"
              >
                استعادة الصورة الافتراضية
              </button>
            )}
          </div>

          {/* WhatsApp Chat Balloon Simulation Live Preview */}
          <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-[#EFEAE2] border border-stone-300 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-[10px] text-stone-500 font-bold px-1">
              <span>📱 كيف سيظهر الرابط في محادثة واتساب للضيوف:</span>
              <span>10:30 ص</span>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs text-right">
              {/* Simulated OG Image */}
              <div className="h-44 sm:h-48 w-full bg-stone-900 relative overflow-hidden flex items-center justify-center">
                {customOgImageUrl || coverImageUrl || coupleImageUrl ? (
                  <img
                    src={customOgImageUrl || coverImageUrl || coupleImageUrl}
                    alt="معاينة رابط واتساب"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#2C050E] to-[#150206] p-4 flex flex-col items-center justify-center text-center text-white border-4 border-amber-400/40">
                    <span className="text-xs text-amber-300 font-bold mb-1">💍 دعوة زفاف إلكترونية خاصة</span>
                    <span className="text-lg font-black text-white">
                      {coupleGroomAr || coupleBrideAr
                        ? `${coupleGroomAr || 'العريس'} & ${coupleBrideAr || 'العروس'}`
                        : 'أحمد & سارة'}
                    </span>
                    <span className="text-[10px] text-stone-300 mt-2">منصة فرحنا — Farahna</span>
                  </div>
                )}
              </div>

              {/* Simulated OG Title & Description */}
              <div className="p-3 bg-stone-50 space-y-1">
                <p className="font-bold text-xs text-stone-900 truncate">
                  دعوة فرح {coupleGroomAr || 'العريس'} & {coupleBrideAr || 'العروس'} ❤️
                </p>
                <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                  فرحتنا قربت ويسعدنا حضوركم لتشاركونا أجمل لحظات حياتنا. اضغط لمشاهدة تفاصيل الفرح وموقع القاعة وتأكيد الحضور.
                </p>
                <span className="text-[10px] font-mono text-stone-400 block pt-1">
                  farahna.menuflowx.com
                </span>
              </div>
            </div>
          </div>

          {/* Controls to upload or set WhatsApp preview image */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={customOgImageUrl}
                onChange={(e) => setCustomOgImageUrl(e.target.value)}
                placeholder="ضع رابط صورة مخصصة للواتساب (أو ارفع صورة من هاتفك)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white text-left dir-ltr font-mono"
              />
              <label className="shrink-0 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs">
                <Upload className="w-4 h-4 text-stone-950" />
                <span>رفع صورة 🖼️</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFileUpload(e, 'og')}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick Shortcut Buttons */}
            <div className="flex items-center gap-2 flex-wrap text-[11px]">
              <span className="text-stone-500 font-bold">اختيارات سريعة:</span>
              {coverImageUrl && (
                <button
                  type="button"
                  onClick={() => setCustomOgImageUrl(coverImageUrl)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 font-bold cursor-pointer"
                >
                  استخدام صورة الغلاف
                </button>
              )}
              {coupleImageUrl && (
                <button
                  type="button"
                  onClick={() => setCustomOgImageUrl(coupleImageUrl)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 font-bold cursor-pointer"
                >
                  استخدام صورة العروسين
                </button>
              )}
              <button
                type="button"
                onClick={() => setCustomOgImageUrl('')}
                className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-amber-900 font-bold cursor-pointer"
              >
                كارت فرحنا الملكي التلقائي
              </button>
            </div>
          </div>
        </div>

        {/* 7.2: Cover Image & Couple Portrait Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Cover Image */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800">
                صورة غلاف الدعوة (Cover Photo):
              </label>
              {coverImageUrl && (
                <button
                  type="button"
                  onClick={() => setCoverImageUrl('')}
                  className="text-[10px] text-rose-600 font-bold hover:underline"
                >
                  حذف
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => {
                  setCoverImageUrl(e.target.value);
                  if (e.target.value) setSectionsVisibility((p) => ({ ...p, cover: true }));
                }}
                placeholder="رابط صورة الغلاف أو ارفعها"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-left dir-ltr font-mono"
              />
              <label className="shrink-0 px-3 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>رفع</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFileUpload(e, 'cover')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Couple Portrait Photo */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800">
                صورة العروسين الشخصية (Couple Photo):
              </label>
              {coupleImageUrl && (
                <button
                  type="button"
                  onClick={() => setCoupleImageUrl('')}
                  className="text-[10px] text-rose-600 font-bold hover:underline"
                >
                  حذف
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={coupleImageUrl}
                onChange={(e) => {
                  setCoupleImageUrl(e.target.value);
                  if (e.target.value) setSectionsVisibility((p) => ({ ...p, couple_photo: true }));
                }}
                placeholder="رابط صورة العروسين أو ارفعها"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-left dir-ltr font-mono"
              />
              <label className="shrink-0 px-3 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>رفع</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageFileUpload(e, 'couple')}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
