'use client';

import React from 'react';
import { Palette, Sparkles, Crown, Check, Lock, RotateCcw, Pipette, Layers } from 'lucide-react';
import {
  DEFAULT_THEMES,
  ARABIC_WEDDING_FONTS,
  WeddingFontOption,
  OPENING_STYLE_PRESETS,
  BACKGROUND_PATTERN_PRESETS,
  INNER_CARD_STYLE_PRESETS,
  FLOATING_PARTICLES_PRESETS,
} from '@farahna/shared';
import { InnerCardView } from '@/components/invitation/InnerCardView';
import {
  FONT_TIERS,
  PATTERN_TIERS,
  CARD_STYLE_TIERS,
  PARTICLE_TIERS,
  PackageTier,
} from './studioConstants';

interface ThemeCustomizerStepProps {
  isBasic: boolean;
  isJourney: boolean;
  isVip: boolean;
  basicPlan: PackageTier;
  journeyPlan: PackageTier;
  vipPlan: PackageTier;
  basicToJourneyDiff: number;
  journeyToVipDiff: number;
  packagesList: PackageTier[];
  selectedPackage: string;
  selectedThemeId: string;
  handleSelectTheme: (themeKey: string) => void;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  customPrimaryColor: string;
  customSecondaryColor: string;
  customBackgroundColor: string;
  safePickerPrimary: string;
  safePickerSecondary: string;
  safePickerBackground: string;
  handleColorInputChange: (field: 'primary' | 'secondary' | 'background', val: string) => void;
  handleResetColorsToTheme: () => void;
  activeTheme: any;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  effectiveFont: string;
  openingStyle: string;
  setOpeningStyle: (style: string) => void;
  effectiveOpeningStyle: string;
  waxSealMonogram: string;
  setWaxSealMonogram: (mono: string) => void;
  backgroundPattern: string;
  setBackgroundPattern: (pat: string) => void;
  effectiveBackgroundPattern: string;
  innerCardStyle: string;
  setInnerCardStyle: (style: string) => void;
  effectiveInnerCardStyle: string;
  setPreviewCardInspectMode: React.Dispatch<React.SetStateAction<boolean>>;
  floatingParticles: string;
  setFloatingParticles: (val: string) => void;
  effectiveFloatingParticles: string;
  coupleGroomAr: string;
  coupleBrideAr: string;
  title: string;
  eventDate: string;
  customWeddingMessage: string;
  setEnvelopePreviewOpen: (val: boolean) => void;
  isTierAllowed: (tier: 'basic' | 'wedding-journey' | 'luxury-vip') => boolean;
  triggerTierNotice: (params: {
    featureTitle: string;
    featureDescription: string;
    requiredPackageId: 'basic' | 'wedding-journey' | 'luxury-vip';
    onUpgradeAction?: () => void;
  }) => void;
  handleUpgradeToPackage: (pkgId: 'basic' | 'wedding-journey' | 'luxury-vip', featureName: string) => void;
  getTierBadgeText: (tier: 'basic' | 'wedding-journey' | 'luxury-vip') => string;
}

export function ThemeCustomizerStep({
  isBasic,
  isJourney,
  isVip,
  basicPlan,
  journeyPlan,
  vipPlan,
  basicToJourneyDiff,
  journeyToVipDiff,
  packagesList,
  selectedPackage,
  selectedThemeId,
  handleSelectTheme,
  primaryColor,
  secondaryColor,
  backgroundColor,
  textColor,
  customPrimaryColor,
  customSecondaryColor,
  customBackgroundColor,
  safePickerPrimary,
  safePickerSecondary,
  safePickerBackground,
  handleColorInputChange,
  handleResetColorsToTheme,
  activeTheme,
  selectedFont,
  setSelectedFont,
  effectiveFont,
  openingStyle,
  setOpeningStyle,
  effectiveOpeningStyle,
  waxSealMonogram,
  setWaxSealMonogram,
  backgroundPattern,
  setBackgroundPattern,
  effectiveBackgroundPattern,
  innerCardStyle,
  setInnerCardStyle,
  effectiveInnerCardStyle,
  setPreviewCardInspectMode,
  floatingParticles,
  setFloatingParticles,
  effectiveFloatingParticles,
  coupleGroomAr,
  coupleBrideAr,
  title,
  eventDate,
  customWeddingMessage,
  setEnvelopePreviewOpen,
  isTierAllowed,
  triggerTierNotice,
  handleUpgradeToPackage,
  getTierBadgeText,
}: ThemeCustomizerStepProps) {
  const isDarkBackground =
    backgroundColor.toLowerCase() === '#0f0f11' ||
    backgroundColor.toLowerCase() === '#1e1e22' ||
    backgroundColor.toLowerCase() === '#18181b' ||
    backgroundColor.toLowerCase() === '#0a0a0c' ||
    backgroundColor.toLowerCase() === '#000000' ||
    backgroundColor.toLowerCase() === '#000';

  return (
    <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-6 shadow-2xs text-right">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-sm font-black text-stone-900 flex items-center gap-2">
          <Palette className="w-4.5 h-4.5 text-[#720925]" />
          <span>٥. قالب التصميم وتخصيص الألوان والخط العربي الملكي:</span>
        </label>
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          ⚡ التعديلات تظهر فوراً في المعاينة
        </span>
      </div>

      {/* Active Tier Capabilities Status Bar for Step 5 */}
      <div
        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-3 text-right ${
          isVip
            ? 'bg-gradient-to-r from-amber-50 via-white to-amber-50 border-amber-300 text-amber-950'
            : isJourney
            ? 'bg-rose-50/70 border-rose-200 text-rose-950'
            : 'bg-stone-50 border-stone-200 text-stone-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isVip
                ? 'bg-amber-100 text-amber-800'
                : isJourney
                ? 'bg-rose-100 text-[#720925]'
                : 'bg-stone-200 text-stone-700'
            }`}
          >
            {isVip ? (
              <Crown className="w-5 h-5 text-amber-600" />
            ) : isJourney ? (
              <Sparkles className="w-5 h-5 text-[#720925]" />
            ) : (
              <Palette className="w-5 h-5 text-stone-600" />
            )}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black flex items-center gap-2">
              <span>إمكانيات الثيم والمظهر لباقة ({packagesList.find((p) => p.id === selectedPackage)?.name}):</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-stone-200">
                {packagesList.find((p) => p.id === selectedPackage)?.priceLabel}
              </span>
            </h4>
            <p className="text-[11px] opacity-85 mt-0.5 leading-relaxed font-medium">
              {isVip
                ? '💎 كامل المميزات مفتوحة 100%: عجلة الألوان الحرة (Color Wheel) وكود Hex، كافة الخطوط الـ 10، كل الباترنات وأشكال الكروت والبريق الملكي ومونوغرام الحروف.'
                : isJourney
                ? '👑 مفتوح لك: فتح الظرف الملكي ثلاثي الأبعاد بجميع حركاته، وتخصيص الألوان من الدرجات الملكية المقترحة، و5 خطوط و5 باترنات وأشكال بطاقات مذهبة.'
                : `🌸 باقة المناسبة الواحدة تشمل ألوان الثيم الأصلية الثابتة، والخطوط العربية القياسية (كايرو وأميري)، والباترنات الناعمة. للترقية إلى فتح الظرف 3D وتخصيص الألوان اختر باقة ${journeyPlan.priceLabel} أو VIP.`}
            </p>
          </div>
        </div>

        {!isVip && (
          <button
            type="button"
            onClick={() => {
              if (isBasic) {
                triggerTierNotice({
                  featureTitle: 'ترقية إمكانيات الثيم والمظهر الملكي',
                  featureDescription:
                    'افتح حركة فتح الظرف التفاعلي ثلاثي الأبعاد وتخصيص الألوان والخطوط الملكية مع باقة رحلة الفرح أو VIP.',
                  requiredPackageId: 'wedding-journey',
                });
              } else {
                triggerTierNotice({
                  featureTitle: 'فتح عجلة الألوان الحرة وكافة الخطوط الـ 10',
                  featureDescription:
                    'تمنحك باقة VIP تحكماً مطلقاً في درجات الألوان عبر Color Wheel وختم المونوغرام المخصص بالاسمين وكافة الخطوط الملكية.',
                  requiredPackageId: 'luxury-vip',
                });
              }
            }}
            className="shrink-0 px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:border-amber-400 text-stone-900 font-black text-xs shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {isBasic
                ? `ترقية لباقة ${journeyPlan.priceLabel} (+${basicToJourneyDiff} ج.م) 👑`
                : `ترقية لـ VIP ${vipPlan.priceLabel} (+${journeyToVipDiff} ج.م) 💎`}
            </span>
          </button>
        )}
      </div>

      {/* 5.1: Curated Theme Cards */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-stone-700 block">
          أ. اختر قالب التصميم العام (Thème):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {DEFAULT_THEMES.map((th) => {
            const themeKey = `theme-${th.slug}`;
            const isSelected =
              selectedThemeId === themeKey || selectedThemeId === th.slug;
            return (
              <button
                key={th.slug}
                type="button"
                onClick={() => handleSelectTheme(themeKey)}
                className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? 'border-[#720925] bg-rose-50/80 shadow-xs scale-102 ring-2 ring-[#720925]/20'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center text-xs"
                  style={{ backgroundColor: th.config?.primaryColor || '#720925' }}
                >
                  {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                </div>
                <span className="text-[11px] font-black text-stone-900 block truncate w-full">
                  {th.nameAr}
                </span>
                <span className="text-[9px] text-stone-400 block truncate w-full">
                  {th.config?.primaryColor}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5.2: Real-time Color Customizer with Tier Logic */}
      {isBasic ? (
        /* Plan 50 EGP: Locked Theme Colors with Upgrades */
        <div className="p-5 rounded-2xl bg-gradient-to-b from-stone-50 via-white to-stone-50 border-2 border-stone-300 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-stone-600" />
              <h4 className="text-xs sm:text-sm font-black text-stone-900">
                ب. ألوان الثيم وتخصيص الدرجات (محددة في باقة {basicPlan.priceLabel} 🌸):
              </h4>
            </div>
            <span className="text-[11px] font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full border border-stone-200 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-stone-500" /> ألوان القالب الكلاسيكي الأصلي
            </span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-950">
                🔒 ألوان القالب محددة مسبقاً بعناية لتناسب الباقة الأساسية الاقتصادية
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                تتيح لك باقة رحلة الفرح ({journeyPlan.priceLabel}) التعديل من الدرجات الملكية والذهبية المقترحة، كما تتيح لك باقة VIP ({vipPlan.priceLabel}) حرية اختيار أي درجة لون على الإطلاق عبر عجلة الألوان التفاعلية.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleUpgradeToPackage('wedding-journey', 'تخصيص الألوان الملكية')}
                className="px-3.5 py-2 rounded-xl bg-[#720925] text-white font-black text-xs hover:bg-rose-900 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>فتح ألوان باقة {journeyPlan.priceLabel} (+{basicToJourneyDiff} ج.م) 👑</span>
              </button>
              <button
                type="button"
                onClick={() => handleUpgradeToPackage('luxury-vip', 'عجلة الألوان الحرة المطلقة')}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black text-xs hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Crown className="w-3.5 h-3.5 text-amber-200" />
                <span>فتح عجلة VIP ({vipPlan.priceLabel}) 💎</span>
              </button>
            </div>
          </div>

          {/* Read-only theme swatches preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-stone-700 block">اللون الرئيسي (الثيم)</span>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl border border-stone-300 shrink-0 shadow-2xs"
                  style={{ backgroundColor: activeTheme.config?.primaryColor || '#720925' }}
                />
                <div className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-mono text-center font-bold bg-stone-50 text-stone-600">
                  {activeTheme.config?.primaryColor || '#720925'}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-stone-700 block">الذهب والتفاصيل</span>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl border border-stone-300 shrink-0 shadow-2xs"
                  style={{ backgroundColor: activeTheme.config?.secondaryColor || '#D4AF37' }}
                />
                <div className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-mono text-center font-bold bg-stone-50 text-stone-600">
                  {activeTheme.config?.secondaryColor || '#D4AF37'}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-2">
              <span className="text-xs font-bold text-stone-700 block">لون الخلفية والبطاقة</span>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl border border-stone-300 shrink-0 shadow-2xs"
                  style={{ backgroundColor: activeTheme.config?.backgroundColor || '#FAF7F2' }}
                />
                <div className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-mono text-center font-bold bg-stone-50 text-stone-600">
                  {activeTheme.config?.backgroundColor || '#FAF7F2'}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isJourney ? (
        /* Plan 95 EGP: Curated Royal Swatches Unlocked + VIP Teaser for Color Wheel */
        <div className="p-5 rounded-2xl bg-gradient-to-b from-rose-50/50 via-white to-amber-50/40 border-2 border-rose-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-[#720925]" />
              <h4 className="text-xs sm:text-sm font-black text-stone-900">
                ب. تخصيص الألوان من الدرجات الملكية والذهبية (مفعلة لك مع باقة {journeyPlan.priceLabel} 👑):
              </h4>
            </div>
            <button
              type="button"
              onClick={handleResetColorsToTheme}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-950 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              title="استعادة ألوان القالب الأصلية"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>استعادة ألوان القالب الأصلية</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: اللون الرئيسي */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-stone-900">
                  اللون الرئيسي (الثيم والظرف):
                </label>
                <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                  {(customPrimaryColor || primaryColor).toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <div
                  className="w-10 h-10 rounded-xl border-2 border-white shadow-md ring-2 ring-stone-200 shrink-0"
                  style={{ backgroundColor: safePickerPrimary }}
                />
                <div className="flex-1 text-right">
                  <span className="text-xs font-bold text-stone-800 block">اللون المحدد الآن</span>
                  <span className="text-[10px] text-stone-500 font-medium">ينعكس فوراً على المعاينة</span>
                </div>
              </div>

              {/* Suggested Royal Swatches */}
              <div className="space-y-1.5 pt-0.5">
                <span className="text-[11px] text-stone-500 font-bold block">
                  اختر من الدرجات الملكية المقترحة 👑:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { name: 'شوكولاتة ملكية', hex: '#3B1E08' },
                    { name: 'أسود فاخر', hex: '#18181B' },
                    { name: 'موف ملكي', hex: '#4A044E' },
                    { name: 'كحلي داكن', hex: '#0F172A' },
                    { name: 'زمردي ملكي', hex: '#064E3B' },
                    { name: 'عنابي ملكي', hex: '#720925' },
                    { name: 'وردي ملكي', hex: '#9C5162' },
                  ].map((swatch) => (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => handleColorInputChange('primary', swatch.hex)}
                      className="w-6 h-6 rounded-full border border-stone-300 shadow-2xs cursor-pointer hover:scale-125 active:scale-95 transition-all"
                      style={{ backgroundColor: swatch.hex }}
                      title={`${swatch.name} (${swatch.hex})`}
                    />
                  ))}
                </div>
              </div>

              {/* VIP Color Wheel Teaser Button */}
              <button
                type="button"
                onClick={() =>
                  triggerTierNotice({
                    featureTitle: 'عجلة الألوان الحرة (Color Wheel)',
                    featureDescription:
                      'تتيح لك باقة VIP حرية اختيار أي درجة لون على الإطلاق من عجلة الألوان أو كود Hex المخصص.',
                    requiredPackageId: 'luxury-vip',
                  })
                }
                className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-50/80 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>عجلة الألوان الحرة وكود Hex (خاص بباقة VIP 💎)</span>
              </button>
            </div>

            {/* Card 2: الذهب والتفاصيل */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-stone-900">
                  الذهب والتفاصيل (الختم والزخارف):
                </label>
                <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                  {(customSecondaryColor || secondaryColor).toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <div
                  className="w-10 h-10 rounded-xl border-2 border-white shadow-md ring-2 ring-stone-200 shrink-0"
                  style={{ backgroundColor: safePickerSecondary }}
                />
                <div className="flex-1 text-right">
                  <span className="text-xs font-bold text-stone-800 block">درجة الذهب المختارة</span>
                  <span className="text-[10px] text-stone-500 font-medium">للختم والشريط والخطوط</span>
                </div>
              </div>

              {/* Suggested Gold Swatches */}
              <div className="space-y-1.5 pt-0.5">
                <span className="text-[11px] text-stone-500 font-bold block">
                  اختر من درجات الذهب المقترحة ✨:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { name: 'ذهب ملكي', hex: '#D4AF37' },
                    { name: 'ذهب كهرماني', hex: '#F59E0B' },
                    { name: 'برونز دافئ', hex: '#E0A96D' },
                    { name: 'وردي ذهبي', hex: '#FDA4AF' },
                    { name: 'بلاتينيوم فضي', hex: '#94A3B8' },
                  ].map((swatch) => (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => handleColorInputChange('secondary', swatch.hex)}
                      className="w-6 h-6 rounded-full border border-stone-300 shadow-2xs cursor-pointer hover:scale-125 active:scale-95 transition-all"
                      style={{ backgroundColor: swatch.hex }}
                      title={`${swatch.name} (${swatch.hex})`}
                    />
                  ))}
                </div>
              </div>

              {/* VIP Color Wheel Teaser Button */}
              <button
                type="button"
                onClick={() =>
                  triggerTierNotice({
                    featureTitle: 'عجلة الألوان الحرة (Color Wheel)',
                    featureDescription:
                      'تتيح لك باقة VIP حرية اختيار أي درجة لون على الإطلاق من عجلة الألوان أو كود Hex المخصص.',
                    requiredPackageId: 'luxury-vip',
                  })
                }
                className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-50/80 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>عجلة الألوان الحرة للذهب (خاص بباقة VIP 💎)</span>
              </button>
            </div>

            {/* Card 3: لون الخلفية والبطاقة */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-stone-900">
                  لون الخلفية (بطاقة الدعوة):
                </label>
                <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                  {(customBackgroundColor || backgroundColor).toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <div
                  className="w-10 h-10 rounded-xl border-2 border-white shadow-md ring-2 ring-stone-200 shrink-0"
                  style={{ backgroundColor: safePickerBackground }}
                />
                <div className="flex-1 text-right">
                  <span className="text-xs font-bold text-stone-800 block">لون خلفية الكارت</span>
                  <span className="text-[10px] text-stone-500 font-medium">كريمي أو أبيض أو داكن</span>
                </div>
              </div>

              {/* Suggested Background Swatches */}
              <div className="space-y-1.5 pt-0.5">
                <span className="text-[11px] text-stone-500 font-bold block">
                  اختر من الخلفيات الراقية المقترحة 🎨:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { name: 'كريمي عاجي', hex: '#FAF7F2' },
                    { name: 'أبيض نقي', hex: '#FFFFFF' },
                    { name: 'أبيض ناعم', hex: '#FFF8F9' },
                    { name: 'رمادي لؤلؤي', hex: '#F8FAFC' },
                    { name: 'دارك مود فاخر', hex: '#18181B' },
                  ].map((swatch) => (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => handleColorInputChange('background', swatch.hex)}
                      className="w-6 h-6 rounded-full border border-stone-300 shadow-2xs cursor-pointer hover:scale-125 active:scale-95 transition-all"
                      style={{ backgroundColor: swatch.hex }}
                      title={`${swatch.name} (${swatch.hex})`}
                    />
                  ))}
                </div>
              </div>

              {/* VIP Color Wheel Teaser Button */}
              <button
                type="button"
                onClick={() =>
                  triggerTierNotice({
                    featureTitle: 'عجلة الألوان الحرة (Color Wheel)',
                    featureDescription:
                      'تتيح لك باقة VIP حرية اختيار أي درجة لون على الإطلاق من عجلة الألوان أو كود Hex المخصص.',
                    requiredPackageId: 'luxury-vip',
                  })
                }
                className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-50/80 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>عجلة الألوان الحرة للخلفية (خاص بباقة VIP 💎)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Plan 150 VIP: Full Unrestricted Freedom (Native Color Wheels + Hex + Swatches) */
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-amber-200/70 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-amber-600 shrink-0" />
              <h4 className="text-xs sm:text-sm font-black text-stone-900">
                ب. تحكّم بدرجات الألوان بحرية كاملة (خاصة بباقة VIP 👑) — عجلة الألوان مفتوحة 100%:
              </h4>
            </div>
            <button
              type="button"
              onClick={handleResetColorsToTheme}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-950 bg-white px-3 py-1.5 rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              title="استعادة ألوان القالب الأصلية"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>استعادة ألوان القالب الأصلية</span>
            </button>
          </div>

          {/* 3 VIP Color Cards with Native Visual Color Pickers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: اللون الرئيسي */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-stone-900">
                  اللون الرئيسي (الثيم والظرف):
                </label>
                <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                  {(customPrimaryColor || primaryColor).toUpperCase()}
                </span>
              </div>

              {/* Interactive Visual Color Picker Trigger */}
              <label className="relative flex items-center justify-between p-3 rounded-2xl border-2 border-stone-200/90 hover:border-amber-400 bg-gradient-to-r from-stone-50 via-white to-stone-50 hover:bg-white shadow-2xs hover:shadow-xs transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl border-2 border-white shadow-md ring-2 ring-stone-200/80 group-hover:scale-105 transition-transform shrink-0"
                    style={{ backgroundColor: safePickerPrimary }}
                  />
                  <div className="text-right">
                    <span className="text-xs font-black text-stone-900 group-hover:text-amber-950 block">
                      اضغط هنا لاختيار اللون 🎨
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      انقر لفتح باليتة وعجلة الألوان
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 group-hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors">
                  <Pipette className="w-3.5 h-3.5 text-amber-700" />
                  <span>تغيير</span>
                </div>

                <input
                  type="color"
                  value={safePickerPrimary}
                  onChange={(e) => handleColorInputChange('primary', e.target.value.toUpperCase())}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  title="اضغط لاختيار اللون من عجلة الألوان"
                />
              </label>

              {/* Suggested Royal Swatches */}
              <div className="space-y-1.5 pt-0.5">
                <span className="text-[11px] text-stone-400 font-bold block">درجات ملكية مقترحة:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { name: 'شوكولاتة ملكية', hex: '#3B1E08' },
                    { name: 'أسود فاخر', hex: '#18181B' },
                    { name: 'موف ملكي', hex: '#4A044E' },
                    { name: 'كحلي داكن', hex: '#0F172A' },
                    { name: 'زمردي ملكي', hex: '#064E3B' },
                    { name: 'عنابي ملكي', hex: '#720925' },
                    { name: 'وردي ملكي', hex: '#9C5162' },
                  ].map((swatch) => (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => handleColorInputChange('primary', swatch.hex)}
                      className="w-5.5 h-5.5 rounded-full border border-stone-300/80 shadow-2xs cursor-pointer hover:scale-120 active:scale-95 transition-all"
                      style={{ backgroundColor: swatch.hex }}
                      title={`${swatch.name} (${swatch.hex})`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: الذهب والتفاصيل */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-stone-900">
                  الذهب والتفاصيل (الختم والزخارف):
                </label>
                <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                  {(customSecondaryColor || secondaryColor).toUpperCase()}
                </span>
              </div>

              <label className="relative flex items-center justify-between p-3 rounded-2xl border-2 border-stone-200/90 hover:border-amber-400 bg-gradient-to-r from-stone-50 via-white to-stone-50 hover:bg-white shadow-2xs hover:shadow-xs transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl border-2 border-white shadow-md ring-2 ring-stone-200/80 group-hover:scale-105 transition-transform shrink-0"
                    style={{ backgroundColor: safePickerSecondary }}
                  />
                  <div className="text-right">
                    <span className="text-xs font-black text-stone-900 group-hover:text-amber-950 block">
                      اضغط هنا لاختيار لون الذهب 🎨
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      انقر لفتح باليتة وعجلة الألوان
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 group-hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors">
                  <Pipette className="w-3.5 h-3.5 text-amber-700" />
                  <span>تغيير</span>
                </div>

                <input
                  type="color"
                  value={safePickerSecondary}
                  onChange={(e) => handleColorInputChange('secondary', e.target.value.toUpperCase())}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  title="اضغط لاختيار اللون من عجلة الألوان"
                />
              </label>

              {/* Suggested Gold Swatches */}
              <div className="space-y-1.5 pt-0.5">
                <span className="text-[11px] text-stone-400 font-bold block">درجات الذهب المقترحة:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { name: 'ذهب ملكي', hex: '#D4AF37' },
                    { name: 'ذهب كهرماني', hex: '#F59E0B' },
                    { name: 'برونز دافئ', hex: '#E0A96D' },
                    { name: 'وردي ذهبي', hex: '#FDA4AF' },
                    { name: 'بلاتينيوم فضي', hex: '#94A3B8' },
                  ].map((swatch) => (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => handleColorInputChange('secondary', swatch.hex)}
                      className="w-5.5 h-5.5 rounded-full border border-stone-300/80 shadow-2xs cursor-pointer hover:scale-120 active:scale-95 transition-all"
                      style={{ backgroundColor: swatch.hex }}
                      title={`${swatch.name} (${swatch.hex})`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Card 3: لون الخلفية */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-stone-900">
                  لون الخلفية (بطاقة الدعوة):
                </label>
                <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                  {(customBackgroundColor || backgroundColor).toUpperCase()}
                </span>
              </div>

              <label className="relative flex items-center justify-between p-3 rounded-2xl border-2 border-stone-200/90 hover:border-amber-400 bg-gradient-to-r from-stone-50 via-white to-stone-50 hover:bg-white shadow-2xs hover:shadow-xs transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl border-2 border-white shadow-md ring-2 ring-stone-200/80 group-hover:scale-105 transition-transform shrink-0"
                    style={{ backgroundColor: safePickerBackground }}
                  />
                  <div className="text-right">
                    <span className="text-xs font-black text-stone-900 group-hover:text-amber-950 block">
                      اضغط هنا لاختيار لون الخلفية 🎨
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      انقر لفتح باليتة وعجلة الألوان
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 group-hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors">
                  <Pipette className="w-3.5 h-3.5 text-amber-700" />
                  <span>تغيير</span>
                </div>

                <input
                  type="color"
                  value={safePickerBackground}
                  onChange={(e) => handleColorInputChange('background', e.target.value.toUpperCase())}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  title="اضغط لاختيار اللون من عجلة الألوان"
                />
              </label>

              {/* Suggested Background Swatches */}
              <div className="space-y-1.5 pt-0.5">
                <span className="text-[11px] text-stone-400 font-bold block">خلفيات راقية مقترحة:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { name: 'كريمي عاجي', hex: '#FAF7F2' },
                    { name: 'أبيض نقي', hex: '#FFFFFF' },
                    { name: 'أبيض ناعم', hex: '#FFF8F9' },
                    { name: 'رمادي لؤلؤي', hex: '#F8FAFC' },
                    { name: 'دارك مود فاخر', hex: '#18181B' },
                  ].map((swatch) => (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => handleColorInputChange('background', swatch.hex)}
                      className="w-5.5 h-5.5 rounded-full border border-stone-300/80 shadow-2xs cursor-pointer hover:scale-120 active:scale-95 transition-all"
                      style={{ backgroundColor: swatch.hex }}
                      title={`${swatch.name} (${swatch.hex})`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5.3: Arabic Wedding Typography */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-xs font-bold text-stone-700 block">
            ج. نوع الخط العربي الملكي (Calligraphy & Typography):
          </label>
          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            {isVip ? 'جميع الخطوط الـ 10 مفتوحة لك 💎' : isJourney ? '5 خطوط ملكية متاحة 👑' : 'خطوط عربية قياسية 🌸'}
          </span>
        </div>

        <select
          value={selectedFont}
          onChange={(e) => {
            const chosen = e.target.value;
            const tierMeta = FONT_TIERS[chosen];
            if (tierMeta && !isTierAllowed(tierMeta.minTier)) {
              triggerTierNotice({
                featureTitle: `خط ${tierMeta.nameAr}`,
                featureDescription: `هذا الخط العربي متاح في ${getTierBadgeText(tierMeta.minTier)}. يمكنك الترقية الآن بضغطة واحدة وتفعيله على الفور.`,
                requiredPackageId: tierMeta.minTier,
                onUpgradeAction: () => setSelectedFont(chosen),
              });
              return;
            }
            setSelectedFont(chosen);
          }}
          className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white font-bold cursor-pointer"
        >
          {ARABIC_WEDDING_FONTS.map((f: WeddingFontOption) => {
            const tierMeta = FONT_TIERS[f.fontFamily];
            const allowed = !tierMeta || isTierAllowed(tierMeta.minTier);
            return (
              <option key={f.id} value={f.fontFamily}>
                {allowed ? '✓' : '🔒'} {f.nameAr} — {f.description} {tierMeta ? `(${getTierBadgeText(tierMeta.minTier)})` : ''}
              </option>
            );
          })}
        </select>

        {/* Visual Clickable Font Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {ARABIC_WEDDING_FONTS.map((f: WeddingFontOption) => {
            const tierMeta = FONT_TIERS[f.fontFamily];
            const allowed = !tierMeta || isTierAllowed(tierMeta.minTier);
            const isSelected = selectedFont === f.fontFamily;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  if (!allowed && tierMeta) {
                    triggerTierNotice({
                      featureTitle: `خط ${tierMeta.nameAr}`,
                      featureDescription: `هذا الخط العربي متاح في ${getTierBadgeText(tierMeta.minTier)}. يمكنك الترقية الآن بضغطة واحدة وتفعيله على الفور.`,
                      requiredPackageId: tierMeta.minTier,
                      onUpgradeAction: () => setSelectedFont(f.fontFamily),
                    });
                    return;
                  }
                  setSelectedFont(f.fontFamily);
                }}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1.5 ${
                  isSelected
                    ? 'border-[#720925] bg-rose-50/80 ring-2 ring-[#720925]/20 shadow-xs'
                    : allowed
                    ? 'border-stone-200 bg-white hover:bg-stone-50'
                    : 'border-stone-200 bg-stone-50/70 opacity-75 hover:opacity-100 hover:border-amber-300'
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      allowed
                        ? isSelected
                          ? 'bg-[#720925] text-white'
                          : 'bg-stone-100 text-stone-600'
                        : 'bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-0.5'
                    }`}
                  >
                    {!allowed && <Lock className="w-2.5 h-2.5" />}
                    <span>{allowed ? (isSelected ? 'محدد' : 'متاح') : tierMeta?.minTier === 'luxury-vip' ? 'VIP' : journeyPlan.priceLabel}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#720925]" />}
                </div>
                <span
                  className="text-xs font-bold text-stone-900 block truncate w-full"
                  style={{ fontFamily: f.fontFamily }}
                >
                  {f.nameAr}
                </span>
                <span className="text-[9px] text-stone-400 block truncate w-full">
                  {f.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Instant Calligraphy Visual Preview Card */}
        <div
          className="p-4 rounded-2xl border border-stone-200/90 text-center space-y-1 transition-all shadow-2xs mt-2"
          style={{
            backgroundColor: backgroundColor,
            color: textColor,
            fontFamily: effectiveFont,
          }}
        >
          <span className="text-[10px] uppercase tracking-widest block opacity-60 font-mono">
            معاينة حية لشكل الخط المعتمد ({effectiveFont.replace(/['",]/g, '').split(' ')[0]}):
          </span>
          <h3
            className="text-lg sm:text-2xl font-black transition-colors"
            style={{ color: primaryColor }}
          >
            {coupleGroomAr || coupleBrideAr
              ? `${coupleGroomAr || 'العريس'} & ${coupleBrideAr || 'العروس'}`
              : 'أحمد & سارة'}
          </h3>
          <p className="text-xs sm:text-sm font-semibold opacity-85">
            بارك الله لهما وبارك عليهما وجمع بينهما في خير ✨
          </p>
        </div>
      </div>

      {/* 5.4: Opening Animation Style */}
      <div className="space-y-3 pt-3 border-t border-stone-100">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <label className="text-xs font-bold text-stone-800 block">
              د. حركة فتح الدعوة في البداية (Opening Animation):
            </label>
          </div>
          <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            {isBasic ? 'العرض المباشر في الباقة الأساسية 🌸' : 'حركات فتح مبهرة للأفراح ✨'}
          </span>
        </div>

        {isBasic && (
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>فتح الظرف الملكي ثلاثي الأبعاد متاح في باقة رحلة الفرح ({journeyPlan.priceLabel}) وباقة VIP</span>
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                باقة الـ 50 ج.م تعرض البطاقة مباشرة وسريعاً لضيوفك بدون حركة الظرف ثلاثي الأبعاد. للترقية والاستمتاع بتأثير الظرف الملكي:
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleUpgradeToPackage('wedding-journey', 'فتح الظرف ثلاثي الأبعاد')}
              className="shrink-0 px-3.5 py-2 rounded-xl bg-[#720925] text-white font-black text-xs hover:bg-rose-900 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>ترقية لباقة رحلة الفرح (+{basicToJourneyDiff} ج.م) 👑</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {isBasic && (
            <div className="p-3.5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 text-right flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                  <span>💌</span>
                  <span>عرض مباشر للبطاقة بدون ظرف (Direct Reveal)</span>
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  مفعل بالباقة الأساسية ✓
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                تفتح بطاقة الدعوة مباشرة للضيوف بسلاسة وسرعة فائقة دون الحاجة للضغط على ختم الظرف.
              </p>
            </div>
          )}

          {OPENING_STYLE_PRESETS.map((preset) => {
            const isSelected = openingStyle === preset.id && !isBasic;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  if (isBasic) {
                    triggerTierNotice({
                      featureTitle: `حركة ${preset.nameAr}`,
                      featureDescription:
                        `حركات فتح الظرف التفاعلي ثلاثي الأبعاد وفك الختم والشريط الحريري متاحة في باقة رحلة الفرح (${journeyPlan.priceLabel}) وباقة VIP.`,
                      requiredPackageId: 'wedding-journey',
                      onUpgradeAction: () => {
                        setOpeningStyle(preset.id);
                        setEnvelopePreviewOpen(false);
                      },
                    });
                    return;
                  }
                  setOpeningStyle(preset.id);
                  setEnvelopePreviewOpen(false);
                }}
                className={`p-3.5 rounded-2xl border-2 text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-[#720925] bg-rose-50/70 shadow-sm ring-2 ring-[#720925]/20'
                    : isBasic
                    ? 'border-stone-200 bg-stone-50/60 opacity-80 hover:opacity-100 hover:border-amber-300'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                    <span>{preset.icon}</span>
                    <span>{preset.nameAr}</span>
                  </span>
                  {isBasic ? (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-amber-700" /> باقة {journeyPlan.priceLabel} و VIP
                    </span>
                  ) : preset.badgeAr ? (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      {preset.badgeAr}
                    </span>
                  ) : null}
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  {preset.descriptionAr}
                </p>
                {isSelected && (
                  <div className="pt-1 flex items-center gap-1 text-[10px] font-bold text-[#720925]">
                    <Check className="w-3.5 h-3.5" />
                    <span>محدد ومعروض الآن في شاشة الهاتف 📱</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* VIP Wax Seal Monogram Initials Input */}
        {isVip && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-stone-50 border border-amber-300/80 space-y-2 mt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-600" />
                <span>ختم شمعي مخصص بحروف العروسين (Monogram Initial) 👑:</span>
              </label>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                ميزة VIP حصرية
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={waxSealMonogram}
                onChange={(e) => setWaxSealMonogram(e.target.value)}
                placeholder={`${coupleGroomAr?.trim()?.charAt(0) || 'أ'} & ${coupleBrideAr?.trim()?.charAt(0) || 'س'}`}
                maxLength={10}
                className="px-3.5 py-2 rounded-xl border border-amber-300 text-xs font-bold bg-white text-center w-36 shadow-2xs"
              />
              <span className="text-[11px] text-stone-500 font-medium">
                تُنقش هذه الحروف مباشرةً على الختم الشمعي المذهب في مقدمة الظرف!
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 5.5: Background Pattern & Texture */}
      <div className="space-y-3 pt-3 border-t border-stone-100">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-amber-600" />
            <label className="text-xs font-bold text-stone-800 block">
              هـ. باترن وزخرفة الخلفية (Background Patterns):
            </label>
          </div>
          <span className="text-[10px] text-stone-500 font-bold bg-stone-100 px-2.5 py-0.5 rounded-full">
            {isVip ? 'كل الـ 8 باترنات مفتوحة لك 💎' : isJourney ? '5 باترنات ملكية متاحة 👑' : 'باترنات هادئة للباقة الأساسية 🌸'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {BACKGROUND_PATTERN_PRESETS.map((p) => {
            const tierMeta = PATTERN_TIERS[p.id];
            const allowed = !tierMeta || isTierAllowed(tierMeta.minTier);
            const isSelected = backgroundPattern === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  if (!allowed && tierMeta) {
                    triggerTierNotice({
                      featureTitle: `باترن ${p.nameAr}`,
                      featureDescription: `هذا الباترن الفاخر متاح في ${getTierBadgeText(tierMeta.minTier)}. يمكنك الترقية الآن بضغطة واحدة وتفعيله على الفور.`,
                      requiredPackageId: tierMeta.minTier,
                      onUpgradeAction: () => setBackgroundPattern(p.id),
                    });
                    return;
                  }
                  setBackgroundPattern(p.id);
                }}
                className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? 'border-[#720925] bg-rose-50/80 shadow-xs ring-2 ring-[#720925]/20'
                    : allowed
                    ? 'border-stone-200 bg-white hover:bg-stone-50'
                    : 'border-stone-200 bg-stone-50/60 opacity-70 hover:opacity-100 hover:border-amber-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg border border-stone-300 shadow-2xs flex items-center justify-center text-base relative ${p.previewClass}`}
                  style={{ backgroundColor: isDarkBackground ? '#18181B' : '#FAF7F2' }}
                >
                  <span>{p.icon}</span>
                  {!allowed && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                      <Lock className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-bold text-stone-900 block truncate w-full">
                  {p.nameAr}
                </span>
                {!allowed && (
                  <span className="text-[9px] font-bold text-amber-700 block truncate w-full">
                    {tierMeta?.minTier === 'luxury-vip' ? 'حصري VIP 💎' : `باقة ${journeyPlan.priceLabel} 👑`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5.6: Inner Card Shape & Style */}
      <div className="space-y-3 pt-3 border-t border-stone-100">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-600" />
            <label className="text-xs font-bold text-stone-800 block">
              و. شكل وتصميم البطاقة الداخلية (Inner Card Style):
            </label>
          </div>
          <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            {isVip ? 'كافة أشكال الكروت الـ 5 مفتوحة 💎' : isJourney ? '3 أشكال كروت ملكية مذهبة 👑' : 'قوس القصر الكلاسيكي 🌸'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {INNER_CARD_STYLE_PRESETS.map((card) => {
            const tierMeta = CARD_STYLE_TIERS[card.id];
            const allowed = !tierMeta || isTierAllowed(tierMeta.minTier);
            const isSelected = innerCardStyle === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  if (!allowed && tierMeta) {
                    triggerTierNotice({
                      featureTitle: `شكل كارت ${card.nameAr}`,
                      featureDescription: `هذا التصميم الفاخر متاح في ${getTierBadgeText(tierMeta.minTier)}. يمكنك الترقية الآن بضغطة واحدة وتفعيله على الفور.`,
                      requiredPackageId: tierMeta.minTier,
                      onUpgradeAction: () => {
                        setInnerCardStyle(card.id);
                        setPreviewCardInspectMode(true);
                      },
                    });
                    return;
                  }
                  setInnerCardStyle(card.id);
                  setPreviewCardInspectMode(true);
                }}
                className={`p-3 rounded-xl border-2 text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-[#720925] bg-rose-50/70 shadow-xs ring-2 ring-[#720925]/20 scale-[1.01]'
                    : allowed
                    ? 'border-stone-200 bg-white hover:bg-stone-50'
                    : 'border-stone-200 bg-stone-50/60 opacity-70 hover:opacity-100 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                    <span className="text-sm">{card.icon}</span>
                    <span>{card.nameAr}</span>
                  </span>
                  {!allowed ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" />
                      <span>{tierMeta?.minTier === 'luxury-vip' ? 'VIP' : journeyPlan.priceLabel}</span>
                    </span>
                  ) : isSelected ? (
                    <Check className="w-3.5 h-3.5 text-[#720925]" />
                  ) : null}
                </div>

                {/* Mini Visual Silhouette Preview */}
                <div
                  className={`w-full h-8 rounded-lg border flex items-center justify-center text-[10px] font-bold ${
                    card.id === 'arched'
                      ? 'rounded-t-2xl border-t-2 border-amber-500 bg-amber-50/60 text-amber-900'
                      : card.id === 'double-gold'
                      ? 'border-2 border-double border-amber-500 bg-stone-50 text-amber-900'
                      : card.id === 'frosted'
                      ? 'border border-sky-300 bg-white/70 backdrop-blur-xs text-sky-900'
                      : card.id === 'deckle'
                      ? 'border border-dashed border-amber-700/60 bg-[#FAF5EC] text-amber-950 rounded-xs'
                      : 'border-2 border-amber-600 bg-amber-50 text-amber-950'
                  }`}
                >
                  {card.id === 'arched' && <span>🏛️ قمة مقوسة ملكية</span>}
                  {card.id === 'double-gold' && <span>⚜️ زوايا أرابيسك مذهبة</span>}
                  {card.id === 'frosted' && <span>✨ بلور زجاجي مشع</span>}
                  {card.id === 'deckle' && <span>📜 حواف أثرية قطنية</span>}
                  {card.id === 'royal-crest' && <span>👑 شارة التاج والمونوغرام</span>}
                </div>

                <p className="text-[10px] text-stone-500 leading-snug">
                  {card.descriptionAr}
                </p>
              </button>
            );
          })}
        </div>

        {/* Live Interactive Card Preview Showcase */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#FAF7F2] to-amber-50/50 border-2 border-amber-300/90 shadow-sm space-y-3 mt-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-black text-stone-900">
                معاينة حية ومباشرة لشكل البطاقة الداخلية المعتمدة:
              </span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
              هذا الكارت يخرج من الظرف أثناء الفتح 🪄
            </span>
          </div>

          <div className="relative mx-auto w-full max-w-[320px] h-[210px] rounded-2xl p-2 shadow-md bg-stone-900/5 border border-stone-200/80 flex items-center justify-center">
            <InnerCardView
              style={effectiveInnerCardStyle}
              coupleNames={coupleGroomAr || coupleBrideAr ? `${coupleGroomAr || 'العريس'} & ${coupleBrideAr || 'العروس'}` : 'أحمد & سارة'}
              invitationTitle={title || 'نتشرف بحضوركم ومشاركتنا فرحتنا'}
              formattedDate={eventDate ? new Date(eventDate).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'الجمعة، ٢٠ نوفمبر ٢٠٢٦'}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              borderColor={secondaryColor || '#D4AF37'}
              isDark={false}
              verseExcerpt={customWeddingMessage?.slice(0, 50)}
              waxSealMonogram={waxSealMonogram || `${coupleGroomAr?.trim()?.charAt(0) || 'أ'} & ${coupleBrideAr?.trim()?.charAt(0) || 'س'}`}
              isPreview={true}
            />
          </div>

          <p className="text-[11px] text-stone-600 text-center font-bold">
            ✨ التأثير الفعلي المعتمد في باقتك: {' '}
            <span className="text-[#720925]">
              {effectiveInnerCardStyle === 'arched' && 'قوس القصر الملكي المقوس كبوابات القصور مع تاج القمة 🏰'}
              {effectiveInnerCardStyle === 'double-gold' && 'إطار مذهب مزدوج مع ٤ زوايا أرابيسك نباتية دقيقة 🖼️'}
              {effectiveInnerCardStyle === 'frosted' && 'بلور زجاجي مشع مع لمعان كريستالي وانعكاسات زجاجية 🪞'}
              {effectiveInnerCardStyle === 'deckle' && 'حواف قطنية أثرية غير منتظمة مع ورق يدوي الصنع 📜'}
              {effectiveInnerCardStyle === 'royal-crest' && 'شارة التاج الملكي والمونوغرام البارز في القمة 👑'}
            </span>
          </p>
        </div>
      </div>

      {/* 5.7: Floating Particles */}
      <div className="space-y-3 pt-3 border-t border-stone-100">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <label className="text-xs font-bold text-stone-800 block">
              ز. الجزيئات الساحرة المتطايرة في الخلفية (Floating Atmosphere):
            </label>
          </div>
          <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            {isVip ? 'البريق الملكي مفتوح 💎' : isJourney ? 'بتلات الورد والغبار الذهبي 👑' : 'غبار ذهبي هادئ 🌸'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {FLOATING_PARTICLES_PRESETS.map((pt) => {
            const tierMeta = PARTICLE_TIERS[pt.id];
            const allowed = !tierMeta || isTierAllowed(tierMeta.minTier);
            const isSelected = floatingParticles === pt.id;
            return (
              <button
                key={pt.id}
                type="button"
                onClick={() => {
                  if (!allowed && tierMeta) {
                    triggerTierNotice({
                      featureTitle: `تأثير ${pt.nameAr}`,
                      featureDescription: `هذا التأثير متاح في ${getTierBadgeText(tierMeta.minTier)}. يمكنك الترقية الآن بضغطة واحدة وتفعيله على الفور.`,
                      requiredPackageId: tierMeta.minTier,
                      onUpgradeAction: () => setFloatingParticles(pt.id),
                    });
                    return;
                  }
                  setFloatingParticles(pt.id);
                }}
                className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'border-[#720925] bg-rose-50 text-[#720925] shadow-xs ring-2 ring-[#720925]/20'
                    : allowed
                    ? 'border-stone-200 bg-white text-stone-800 hover:bg-stone-50'
                    : 'border-stone-200 bg-stone-50/70 text-stone-400 opacity-70 hover:opacity-100 hover:border-amber-300'
                }`}
              >
                <span>{pt.icon}</span>
                <span>{pt.nameAr}</span>
                {!allowed && <Lock className="w-3 h-3 text-amber-600 mr-1" />}
                {isSelected && <Check className="w-3.5 h-3.5 text-[#720925] mr-1" />}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
