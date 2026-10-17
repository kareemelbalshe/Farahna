'use client';

import React from 'react';
import {
  Info,
  UploadCloud,
  PlusCircle,
  Music,
  Play,
  Pause,
  Upload,
  Loader2,
  Trash2,
  Image as ImageIcon,
  Share2,
} from 'lucide-react';
import { WEDDING_MUSIC_PRESETS } from '@farahna/shared';

interface BuilderMediaTabProps {
  invitation: any;
  handleChange: (field: string, value: any) => void;
  handleNestedThemeConfigChange: (key: string, value: any) => void;
  handleDirectImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    targetType: 'cover' | 'couple' | 'gallery' | 'customOg'
  ) => Promise<void>;
  uploadingImage: boolean;
  mediaUploadSuccess: string;
  mediaUploadError: string;
  savedMediaList: any[];
  audioPlaying?: boolean;
  toggleAudioPlay?: (url?: string) => void;
  handleAdminAudioUpload?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploadingAudio?: boolean;
}

export function BuilderMediaTab({
  invitation,
  handleChange,
  handleNestedThemeConfigChange,
  handleDirectImageUpload,
  uploadingImage,
  mediaUploadSuccess,
  mediaUploadError,
  savedMediaList,
  audioPlaying = false,
  toggleAudioPlay,
  handleAdminAudioUpload,
  uploadingAudio = false,
}: BuilderMediaTabProps) {
  const currentOgImage =
    invitation.themeConfig?.customOgImageUrl || invitation.customOgImageUrl || '';

  return (
    <div className="space-y-4 text-right font-cairo">
      {/* Admin Tip */}
      <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5 shadow-2xs">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          💡 نصيحة الإدارة: يمكنك إدخال روابط الصور المباشرة أو رفع الملفات من جهازك لتخزينها على السيرفر فورياً. كما يمكنك تحديد المقطع الموسيقي الذي يبدأ بعد فتح الظرف.
        </span>
      </div>

      {mediaUploadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 font-bold">
          {mediaUploadSuccess}
        </div>
      )}

      {mediaUploadError && (
        <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200 font-bold">
          {mediaUploadError}
        </div>
      )}

      {/* 1. Cover Image Upload */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#720925]" />
            <span className="text-xs font-black text-stone-900">
              ١. صورة غلاف الدعوة الرئيسية (Cover Image):
            </span>
          </div>
          {invitation.coverImageUrl && (
            <button
              type="button"
              onClick={() => handleChange('coverImageUrl', '')}
              className="text-[10px] font-bold text-rose-700 hover:underline"
            >
              حذف الصورة
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={invitation.coverImageUrl || ''}
            onChange={(e) => handleChange('coverImageUrl', e.target.value)}
            placeholder="أدخل رابط الصورة أو اضغط رفع من جهازك"
            className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs text-left dir-ltr bg-stone-50 focus:bg-white"
          />
          <label className="shrink-0 px-3.5 py-2 rounded-xl bg-[#720925] text-white font-bold text-xs cursor-pointer hover:opacity-95 flex items-center gap-1.5 shadow-2xs">
            <UploadCloud className="w-4 h-4" />
            <span>{uploadingImage ? 'جاري الرفع...' : 'رفع صورة'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleDirectImageUpload(e, 'cover')}
              className="hidden"
            />
          </label>
        </div>

        {invitation.coverImageUrl && (
          <div className="w-full h-32 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
            <img
              src={invitation.coverImageUrl}
              alt="Cover Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* 2. Couple Portrait Photo */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-black text-stone-900">
              ٢. صورة العروسين الدائرية (Couple Portrait):
            </span>
          </div>
          {invitation.coupleImageUrl && (
            <button
              type="button"
              onClick={() => handleChange('coupleImageUrl', '')}
              className="text-[10px] font-bold text-rose-700 hover:underline"
            >
              حذف الصورة
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {invitation.coupleImageUrl ? (
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 shadow-2xs">
              <img
                src={invitation.coupleImageUrl}
                alt="Couple Portrait"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-stone-100 border border-dashed border-stone-300 flex items-center justify-center text-[9px] text-stone-400 text-center p-1 shrink-0">
              بدون صورة
            </div>
          )}

          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={invitation.coupleImageUrl || ''}
              onChange={(e) => handleChange('coupleImageUrl', e.target.value)}
              placeholder="رابط صورة العروسين أو رفع"
              className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs text-left dir-ltr bg-stone-50 focus:bg-white"
            />
            <label className="shrink-0 px-3.5 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs cursor-pointer hover:bg-stone-800 flex items-center gap-1.5 shadow-2xs">
              <UploadCloud className="w-4 h-4" />
              <span>رفع</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleDirectImageUpload(e, 'couple')}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* 3. VIP Photo Session Gallery */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-black text-stone-900">
              ٣. ألبوم صور جلسة التصوير (Gallery):
            </span>
          </div>
          <label className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer hover:bg-emerald-700 flex items-center gap-1.5 shadow-2xs">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>إضافة صورة للألبوم</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleDirectImageUpload(e, 'gallery')}
              className="hidden"
            />
          </label>
        </div>

        {Array.isArray(invitation.galleryImages) && invitation.galleryImages.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
            {invitation.galleryImages.map((imgUrl: string, idx: number) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden border border-stone-200 h-20 bg-stone-100">
                <img src={imgUrl} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...invitation.galleryImages];
                    updated.splice(idx, 1);
                    handleChange('galleryImages', updated);
                  }}
                  className="absolute inset-0 bg-red-950/70 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold text-[10px] transition-opacity cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-stone-400 text-xs py-1">لا توجد صور في المعرض حالياً.</p>
        )}
      </div>

      {/* 4. WhatsApp Share Preview Card (Custom OG Image) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-black text-stone-900">
              ٤. صورة المعاينة عند إرسال الرابط في واتساب (WhatsApp Link Preview):
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={currentOgImage}
            onChange={(e) => {
              handleNestedThemeConfigChange('customOgImageUrl', e.target.value);
              handleChange('customOgImageUrl', e.target.value);
            }}
            placeholder="رابط الصورة أو اضغط رفع"
            className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs text-left dir-ltr bg-stone-50 focus:bg-white"
          />
          <label className="shrink-0 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-2xs">
            <UploadCloud className="w-4 h-4" />
            <span>رفع</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleDirectImageUpload(e, 'customOg')}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex items-center gap-2 pt-1 text-[10px]">
          <span className="text-stone-400 font-bold">اختصار سريع:</span>
          {invitation.coverImageUrl && (
            <button
              type="button"
              onClick={() => {
                handleNestedThemeConfigChange('customOgImageUrl', invitation.coverImageUrl);
                handleChange('customOgImageUrl', invitation.coverImageUrl);
              }}
              className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
            >
              استخدام صورة الغلاف
            </button>
          )}
          {invitation.coupleImageUrl && (
            <button
              type="button"
              onClick={() => {
                handleNestedThemeConfigChange('customOgImageUrl', invitation.coupleImageUrl);
                handleChange('customOgImageUrl', invitation.coupleImageUrl);
              }}
              className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
            >
              استخدام صورة العروسين
            </button>
          )}
        </div>
      </div>

      {/* 5. Background Wedding Music */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-[#720925]" />
            <span className="text-xs font-black text-stone-900">
              ٥. موسيقى الدعوة والخلفية الصوتية:
            </span>
          </div>
          {invitation.musicUrl && toggleAudioPlay && (
            <button
              type="button"
              onClick={() => toggleAudioPlay(invitation.musicUrl)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#720925] border border-rose-200 text-xs font-bold cursor-pointer transition-colors"
            >
              {audioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{audioPlaying ? 'إيقاف الموسيقى' : 'تجربة الصوت ▶'}</span>
            </button>
          )}
        </div>

        {/* Music Presets */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-stone-500 block font-bold">مقاطع هادئة مقترحة:</span>
          <div className="flex flex-wrap gap-1.5">
            {WEDDING_MUSIC_PRESETS.map((m) => {
              const isSelected = invitation.musicUrl === m.url;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    handleChange('musicUrl', m.url);
                    handleChange('musicTitle', m.title);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#720925] text-white border-[#720925] shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {m.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Music URL & Upload */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-700 block">
              رابط ملف الموسيقى (MP3 URL):
            </label>
            <input
              type="url"
              value={invitation.musicUrl || ''}
              onChange={(e) => handleChange('musicUrl', e.target.value)}
              placeholder="https://.../music.mp3"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-left dir-ltr font-mono bg-stone-50 focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-700 block">
              أو رفع ملف MP3 من جهازك:
            </label>
            {handleAdminAudioUpload && (
              <label
                className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-dashed text-xs font-bold transition-colors ${
                  uploadingAudio
                    ? 'border-amber-400 bg-amber-50 text-amber-800 cursor-wait'
                    : 'border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 cursor-pointer'
                }`}
              >
                {uploadingAudio ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                    <span>جاري رفع الملف...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-amber-600" />
                    <span>اختيار ملف MP3 من الكمبيوتر 📁</span>
                  </>
                )}
                <input
                  type="file"
                  accept="audio/*,.mp3"
                  onChange={handleAdminAudioUpload}
                  disabled={uploadingAudio}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
