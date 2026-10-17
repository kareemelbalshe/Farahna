'use client';

import React from 'react';
import { Music, Trash2, Play, Pause, Sparkles, Crown, Check, Loader2, Upload } from 'lucide-react';
import { WEDDING_MUSIC_PRESETS } from '@farahna/shared';
import { PackageTier } from './studioConstants';

interface MusicStepProps {
  isBasic: boolean;
  isVip: boolean;
  journeyPlan: PackageTier;
  vipPlan: PackageTier;
  selectedMusicId: string;
  setSelectedMusicId: (id: string) => void;
  customMusicUrl: string;
  setCustomMusicUrl: (url: string) => void;
  customMusicTitle: string;
  setCustomMusicTitle: (title: string) => void;
  audioPreviewing: string | null;
  toggleAudioPreview: (url: string) => void;
  sectionsVisibility: Record<string, boolean>;
  setSectionsVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  handleUpgradeToPackage: (pkgId: 'basic' | 'wedding-journey' | 'luxury-vip', featureName: string) => void;
  triggerTierNotice: (params: {
    featureTitle: string;
    featureDescription: string;
    requiredPackageId: 'basic' | 'wedding-journey' | 'luxury-vip';
    onUpgradeAction?: () => void;
  }) => void;
  isUploadingAudio: boolean;
  audioUploadSuccess: string | null;
  handleAudioFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMusicSelect: (musicId: string) => void;
}

export function MusicStep({
  isBasic,
  isVip,
  journeyPlan,
  vipPlan,
  selectedMusicId,
  setSelectedMusicId,
  customMusicUrl,
  setCustomMusicUrl,
  customMusicTitle,
  setCustomMusicTitle,
  audioPreviewing,
  toggleAudioPreview,
  sectionsVisibility,
  setSectionsVisibility,
  handleUpgradeToPackage,
  triggerTierNotice,
  isUploadingAudio,
  audioUploadSuccess,
  handleAudioFileUpload,
  handleMusicSelect,
}: MusicStepProps) {
  const isMusicEnabled = Boolean(sectionsVisibility.music && customMusicUrl);

  return (
    <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-4 shadow-2xs text-right">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-sm font-black text-stone-900 flex items-center gap-2">
          <Music className="w-4.5 h-4.5 text-[#720925]" />
          <span>٤. الموسيقى أو الأغنية الرومانسية المرافقة:</span>
        </label>
        <div className="flex items-center gap-2">
          {isMusicEnabled ? (
            <button
              type="button"
              onClick={() => {
                setSectionsVisibility((prev) => ({ ...prev, music: false }));
                if (audioPreviewing) toggleAudioPreview(audioPreviewing);
              }}
              className="text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-xl border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>دعوة صامتة (بدون موسيقى) 🔇</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setSectionsVisibility((prev) => ({ ...prev, music: true }));
                if (!customMusicUrl) setCustomMusicUrl(WEDDING_MUSIC_PRESETS[0].url);
              }}
              className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Music className="w-3.5 h-3.5" />
              <span>تفعيل الموسيقى 🎵</span>
            </button>
          )}
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              isMusicEnabled
                ? 'text-rose-800 bg-rose-50 border-rose-200'
                : 'text-stone-700 bg-stone-100 border-stone-200'
            }`}
          >
            {isMusicEnabled ? 'تعزف تلقائياً عند فتح الظرف' : 'دعوة صامتة (بدون صوت)'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {isBasic ? (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
            <div className="space-y-1">
              <p className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <Music className="w-4 h-4 text-amber-700" />
                <span>
                  الموسيقى والخلفية الصوتية متاحة في باقة رحلة الفرح ({journeyPlan.priceLabel}) وباقة VIP
                </span>
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                باقة الـ 50 ج.م تعمل كدعوة صامتة راقية وسريعة بدون موسيقى. لإضافة مقطوعات رومانسية أو وضع أغنيتكم الخاصة، قم بالترقية لباقة رحلة الفرح.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleUpgradeToPackage('wedding-journey', 'الموسيقى والخلفية الصوتية')}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-[#720925] text-white font-bold text-xs hover:bg-rose-900 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>ترقية لرحلة الفرح ({journeyPlan.priceLabel}) 👑</span>
            </button>
          </div>
        ) : !sectionsVisibility.music ? (
          <div className="p-3.5 rounded-2xl bg-stone-100/80 border border-stone-200 text-xs text-stone-600 leading-relaxed">
            💡 تم كتم الصوت وحذف الموسيقى — الدعوة ستعمل كـ (دعوة صامتة هادئة). يمكنك تفعيل الموسيقى في أي وقت باختيار مقطع من أدناه.
          </div>
        ) : (
          <p className="text-xs text-stone-500 leading-relaxed">
            اختر من المقاطع الجاهزة أدناه، أو ضع رابط الأغنية المباشر بنفسك بحرية تامة:
          </p>
        )}

        {/* Preset Music Cards Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${isBasic ? 'opacity-70' : ''}`}>
          {WEDDING_MUSIC_PRESETS.map((m) => {
            const isSelected = selectedMusicId === m.id || (m.url && customMusicUrl === m.url);
            const isPlaying = audioPreviewing === m.url;
            return (
              <div
                key={m.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-[#720925] bg-rose-50/80 text-[#720925] shadow-xs'
                    : 'border-stone-200 bg-stone-50/60 hover:bg-stone-100/70 text-stone-800'
                }`}
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    if (isBasic) {
                      triggerTierNotice({
                        featureTitle: `تشغيل مقطع (${m.title})`,
                        featureDescription: `تشغيل الموسيقى الرومانسية المرافقة متاح بدءاً من باقة رحلة الفرح (${journeyPlan.priceLabel}) وباقة VIP.`,
                        requiredPackageId: 'wedding-journey',
                        onUpgradeAction: () => handleMusicSelect(m.id),
                      });
                      return;
                    }
                    handleMusicSelect(m.id);
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black">{m.title}</h4>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    {isBasic && (
                      <span className="text-[9px] text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded-md font-bold">
                        باقة {journeyPlan.priceLabel}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    {m.artist} • {m.durationHint}
                  </span>
                </div>

                {/* Listen Preview Button */}
                {m.url && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAudioPreview(m.url);
                    }}
                    className={`p-2 rounded-xl transition-transform active:scale-90 cursor-pointer ${
                      isPlaying
                        ? 'bg-[#720925] text-white shadow-sm animate-pulse'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                    title={isPlaying ? 'إيقاف الاستماع' : 'استمع للمقطع'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Always-visible Direct Custom Link & Upload Box */}
        <div className="p-4.5 rounded-2xl bg-[#FAF7F2] border-2 border-amber-300/80 shadow-xs space-y-3 mt-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-black text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>أو أدخل رابط الأغنية المباشر بنفسك (MP3 URL) أو ارفع ملف صوتي:</span>
            </label>
            {customMusicUrl && (
              <button
                type="button"
                onClick={() => toggleAudioPreview(customMusicUrl)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  audioPreviewing === customMusicUrl
                    ? 'bg-[#720925] text-white animate-pulse shadow-sm'
                    : 'bg-white border border-stone-200 text-stone-800 hover:bg-stone-50'
                }`}
              >
                {audioPreviewing === customMusicUrl ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{audioPreviewing === customMusicUrl ? 'إيقاف التجربة' : 'استمع للرابط الحالي 🎧'}</span>
              </button>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="url"
              value={customMusicUrl}
              onChange={(e) => {
                if (isBasic) {
                  triggerTierNotice({
                    featureTitle: 'إدخال رابط أغنية مخصص',
                    featureDescription: `تضمين روابط الموسيقى MP3 متاح بدءاً من باقة رحلة الفرح (${journeyPlan.priceLabel}).`,
                    requiredPackageId: 'wedding-journey',
                    onUpgradeAction: () => {
                      setCustomMusicUrl(e.target.value);
                      setSelectedMusicId('custom-link');
                    },
                  });
                  return;
                }
                setCustomMusicUrl(e.target.value);
                setSelectedMusicId('custom-link');
              }}
              placeholder="https://example.com/song.mp3 (ضع أي رابط MP3 للأغنية التي تحبها)"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-mono text-left dir-ltr focus:ring-2 focus:ring-[#720925] focus:outline-hidden bg-white"
            />
            <p className="text-[10px] text-stone-500">
              💡 يمكنك وضع رابط أي أغنية بصيغة MP3 مباشرة هنا، أو اختيار مقطع من المقترحات أعلاه وتعديل رابطه بحرية.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-700 block">عنوان الأغنية المعروض في الدعوة:</label>
              <input
                type="text"
                value={customMusicTitle}
                onChange={(e) => setCustomMusicTitle(e.target.value)}
                placeholder="مثال: أغنية زفتنا الخاصة"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-stone-700 block">أو رفع ملف MP3 من هاتفك/جهازك:</label>
                <span className="text-[9px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-600" /> حصري VIP 💎
                </span>
              </div>
              <label
                onClick={(e) => {
                  if (!isVip) {
                    e.preventDefault();
                    triggerTierNotice({
                      featureTitle: 'رفع ملف صوتي MP3 من جهازك مباشرة للسيرفر',
                      featureDescription: `رفع الملفات الصوتية مباشرة من هاتفك وحفظها على السيرفر متاح حصرياً في باقة VIP (${vipPlan.priceLabel}). يمكنك في باقة ${journeyPlan.priceLabel} وضع رابط MP3 مباشر.`,
                      requiredPackageId: 'luxury-vip',
                    });
                  }
                }}
                className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-dashed text-xs font-bold transition-colors ${
                  isUploadingAudio
                    ? 'border-amber-400 bg-amber-50 text-amber-800 cursor-wait'
                    : 'border-stone-300 hover:border-amber-500 text-stone-700 hover:text-stone-900 cursor-pointer'
                }`}
              >
                {isUploadingAudio ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                    <span>جاري حفظ الصوت على السيرفر...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-amber-600" />
                    <span>اختر ملف صوتي من الجهاز 📁</span>
                  </>
                )}
                <input
                  type="file"
                  accept="audio/*,.mp3"
                  onChange={handleAudioFileUpload}
                  disabled={isUploadingAudio || !isVip}
                  className="hidden"
                />
              </label>
              {audioUploadSuccess && (
                <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                  <span>{audioUploadSuccess}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
