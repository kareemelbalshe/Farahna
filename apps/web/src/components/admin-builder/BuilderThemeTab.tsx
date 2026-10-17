'use client';

import React, { useState } from 'react';
import {
  Info,
  Palette,
  Sparkles,
  Check,
  Type,
  Mail,
  Layers,
  Stamp,
  RotateCcw,
} from 'lucide-react';
import {
  ARABIC_WEDDING_FONTS,
  WeddingFontOption,
  OPENING_STYLE_PRESETS,
  BACKGROUND_PATTERN_PRESETS,
  INNER_CARD_STYLE_PRESETS,
  FLOATING_PARTICLES_PRESETS,
} from '@farahna/shared';
import { normalizeColor } from './builderConstants';

interface BuilderThemeTabProps {
  invitation: any;
  themes: any[];
  handleChange: (field: string, value: any) => void;
  handleNestedThemeConfigChange: (key: string, value: any) => void;
  handleColorChange: (
    key: 'primaryColor' | 'secondaryColor' | 'backgroundColor' | 'textColor',
    val: string
  ) => void;
  handleColorBlur: (
    key: 'primaryColor' | 'secondaryColor' | 'backgroundColor' | 'textColor',
    val: string
  ) => void;
  onOpenSaveThemeModal: () => void;
  setEnvelopeResetKey?: React.Dispatch<React.SetStateAction<number>>;
}

export function BuilderThemeTab({
  invitation,
  themes,
  handleChange,
  handleNestedThemeConfigChange,
  handleColorChange,
  handleColorBlur,
  onOpenSaveThemeModal,
  setEnvelopeResetKey,
}: BuilderThemeTabProps) {
  const [customFontInput, setCustomFontInput] = useState('');

  const primaryColor =
    invitation.themeConfig?.primaryColor ||
    invitation.theme?.config?.primaryColor ||
    '#720925';
  const secondaryColor =
    invitation.themeConfig?.secondaryColor ||
    invitation.theme?.config?.secondaryColor ||
    '#D4AF37';
  const backgroundColor =
    invitation.themeConfig?.backgroundColor ||
    invitation.theme?.config?.backgroundColor ||
    '#FAF7F2';
  const textColor =
    invitation.themeConfig?.textColor ||
    invitation.theme?.config?.textColor ||
    '#1A1819';

  const safePrimary = normalizeColor(primaryColor) || '#720925';
  const safeSecondary = normalizeColor(secondaryColor) || '#d4af37';
  const safeBackground = normalizeColor(backgroundColor) || '#faf7f2';
  const safeTextColor = normalizeColor(textColor) || '#1a1819';

  const currentOpeningStyle =
    invitation.themeConfig?.openingStyle ||
    invitation.theme?.config?.openingStyle ||
    'wax-seal';

  const currentPattern =
    invitation.themeConfig?.backgroundPattern ||
    invitation.theme?.config?.backgroundPattern ||
    'damask';

  const currentCardStyle =
    invitation.themeConfig?.innerCardStyle ||
    invitation.theme?.config?.innerCardStyle ||
    'arched';

  const currentParticles =
    invitation.themeConfig?.floatingParticles ||
    invitation.theme?.config?.floatingParticles ||
    'golden-dust';

  const currentMonogram =
    invitation.themeConfig?.waxSealMonogram ||
    invitation.waxSealMonogram ||
    `${invitation.coupleGroomAr?.trim()?.charAt(0) || 'أ'} & ${invitation.coupleBrideAr?.trim()?.charAt(0) || 'س'}`;

  // Select a Theme Preset and immediately update all colors & styles in themeConfig
  const handleSelectThemePreset = (th: any) => {
    handleChange('themeId', th.id);
    handleChange('theme', th);
    if (th.config) {
      handleNestedThemeConfigChange('primaryColor', th.config.primaryColor || '#720925');
      handleNestedThemeConfigChange('secondaryColor', th.config.secondaryColor || '#D4AF37');
      handleNestedThemeConfigChange('backgroundColor', th.config.backgroundColor || '#FAF7F2');
      handleNestedThemeConfigChange('textColor', th.config.textColor || '#1A1819');
      if (th.config.fontFamily) {
        handleNestedThemeConfigChange('fontFamily', th.config.fontFamily);
      }
      if (th.config.openingStyle || th.config.envelopeStyle) {
        handleNestedThemeConfigChange('openingStyle', th.config.openingStyle || th.config.envelopeStyle);
      }
      if (th.config.backgroundPattern) {
        handleNestedThemeConfigChange('backgroundPattern', th.config.backgroundPattern);
      }
      if (th.config.innerCardStyle) {
        handleNestedThemeConfigChange('innerCardStyle', th.config.innerCardStyle);
      }
      if (th.config.floatingParticles) {
        handleNestedThemeConfigChange('floatingParticles', th.config.floatingParticles);
      }
    }
    if (setEnvelopeResetKey) {
      setEnvelopeResetKey((k) => k + 1);
    }
  };

  return (
    <div className="space-y-5 text-right font-cairo">
      {/* Admin Tip */}
      <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5 shadow-2xs">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          💡 نصيحة الإدارة: اختيار أي ثيم يُحدث درجات الألوان ونمط الظرف فورياً في المحاكي. كما يمكنك تخصيص الألوان والخطوط والختم الشمعي بحرية تامة بنقرة واحدة!
        </span>
      </div>

      {/* 1. Theme Presets Grid */}
      <div className="space-y-2.5">
        <label className="text-xs font-black text-stone-900 block flex items-center justify-between">
          <span>قوالب وثيمات الدعوة المعتمدة:</span>
          <span className="text-[10px] text-stone-400 font-normal">اختر ثيم جاهز بنقرة واحدة</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
          {themes.map((th) => {
            const isSelected = invitation.themeId === th.id;
            const pCol = th.config?.primaryColor || '#720925';
            const sCol = th.config?.secondaryColor || '#D4AF37';
            const bCol = th.config?.backgroundColor || '#FAF7F2';

            return (
              <div
                key={th.id}
                onClick={() => handleSelectThemePreset(th)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-rose-50/80 border-[#720925] ring-2 ring-[#720925]/20 shadow-xs'
                    : 'bg-white border-stone-200 hover:border-amber-400 hover:bg-stone-50/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex items-center -space-x-2 shrink-0">
                    <div
                      className="w-5 h-5 rounded-full shadow-2xs border border-white"
                      style={{ backgroundColor: pCol }}
                    />
                    <div
                      className="w-5 h-5 rounded-full shadow-2xs border border-white"
                      style={{ backgroundColor: sCol }}
                    />
                    <div
                      className="w-5 h-5 rounded-full shadow-2xs border border-white"
                      style={{ backgroundColor: bCol }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">{th.nameAr}</p>
                    <p className="text-[10px] text-stone-400 truncate">{th.name}</p>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#720925] shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Custom Color Pickers */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-black text-stone-900">
              تعديل ألوان الثيم يدوياً (تسمع فوراً في المحاكي):
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (invitation.theme?.config) {
                handleColorChange('primaryColor', invitation.theme.config.primaryColor || '#720925');
                handleColorChange('secondaryColor', invitation.theme.config.secondaryColor || '#D4AF37');
                handleColorChange('backgroundColor', invitation.theme.config.backgroundColor || '#FAF7F2');
                handleColorChange('textColor', invitation.theme.config.textColor || '#1A1819');
              }
            }}
            className="text-[10px] font-bold text-stone-600 hover:text-stone-950 bg-stone-50 hover:bg-stone-100 px-2.5 py-1 rounded-xl border border-stone-200 transition-all cursor-pointer flex items-center gap-1"
            title="استعادة ألوان القالب الأصلية"
          >
            <RotateCcw className="w-3 h-3 text-stone-400" />
            <span>استعادة ألوان القالب</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card 1: Primary Color */}
          <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-stone-800">
                اللون الرئيسي (الثيم والظرف):
              </label>
              <span className="text-[10px] font-mono text-stone-400">{primaryColor.toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 shadow-2xs">
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                onBlur={(e) => handleColorBlur('primaryColor', e.target.value)}
                className="flex-1 bg-transparent text-center font-mono font-bold text-xs text-stone-900 focus:outline-none dir-ltr"
              />
              <div
                className="w-6 h-6 rounded-full border border-stone-300 shadow-2xs shrink-0 cursor-pointer overflow-hidden relative"
                style={{ backgroundColor: safePrimary }}
              >
                <input
                  type="color"
                  value={safePrimary}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value.toUpperCase())}
                  className="absolute -inset-2 w-[200%] h-[200%] opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Secondary / Gold Accent */}
          <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-stone-800">
                الذهب والتفاصيل (الختم والزخارف):
              </label>
              <span className="text-[10px] font-mono text-stone-400">{secondaryColor.toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 shadow-2xs">
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                onBlur={(e) => handleColorBlur('secondaryColor', e.target.value)}
                className="flex-1 bg-transparent text-center font-mono font-bold text-xs text-stone-900 focus:outline-none dir-ltr"
              />
              <div
                className="w-6 h-6 rounded-full border border-stone-300 shadow-2xs shrink-0 cursor-pointer overflow-hidden relative"
                style={{ backgroundColor: safeSecondary }}
              >
                <input
                  type="color"
                  value={safeSecondary}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value.toUpperCase())}
                  className="absolute -inset-2 w-[200%] h-[200%] opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Background Color */}
          <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-stone-800">
                لون الخلفية (الكارت الداخلي):
              </label>
              <span className="text-[10px] font-mono text-stone-400">{backgroundColor.toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 shadow-2xs">
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                onBlur={(e) => handleColorBlur('backgroundColor', e.target.value)}
                className="flex-1 bg-transparent text-center font-mono font-bold text-xs text-stone-900 focus:outline-none dir-ltr"
              />
              <div
                className="w-6 h-6 rounded-full border border-stone-300 shadow-2xs shrink-0 cursor-pointer overflow-hidden relative"
                style={{ backgroundColor: safeBackground }}
              >
                <input
                  type="color"
                  value={safeBackground}
                  onChange={(e) => handleColorChange('backgroundColor', e.target.value.toUpperCase())}
                  className="absolute -inset-2 w-[200%] h-[200%] opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Text Color */}
          <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-stone-800">
                لون النصوص الرئيسية:
              </label>
              <span className="text-[10px] font-mono text-stone-400">{textColor.toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 shadow-2xs">
              <input
                type="text"
                value={textColor}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                onBlur={(e) => handleColorBlur('textColor', e.target.value)}
                className="flex-1 bg-transparent text-center font-mono font-bold text-xs text-stone-900 focus:outline-none dir-ltr"
              />
              <div
                className="w-6 h-6 rounded-full border border-stone-300 shadow-2xs shrink-0 cursor-pointer overflow-hidden relative"
                style={{ backgroundColor: safeTextColor }}
              >
                <input
                  type="color"
                  value={safeTextColor}
                  onChange={(e) => handleColorChange('textColor', e.target.value.toUpperCase())}
                  className="absolute -inset-2 w-[200%] h-[200%] opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSaveThemeModal}
          className="w-full py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-2 border border-stone-200 transition-colors cursor-pointer"
        >
          <Palette className="w-4 h-4 text-[#720925]" />
          <span>حفظ التعديلات الحالية كثيم جديد دائم في النظام 💾</span>
        </button>
      </div>

      {/* 3. Opening Animation Style & Wax Seal Monogram */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#720925]" />
            <span className="text-xs font-black text-stone-900">
              حركة وطريقة فتح الظرف (Opening Style):
            </span>
          </div>
          <span className="text-[10px] text-stone-400 font-bold">تظهر للضيوف في بداية الدعوة</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {OPENING_STYLE_PRESETS.map((op) => {
            const isSelected = currentOpeningStyle === op.id;
            return (
              <div
                key={op.id}
                onClick={() => {
                  handleNestedThemeConfigChange('openingStyle', op.id);
                  if (setEnvelopeResetKey) setEnvelopeResetKey((k) => k + 1);
                }}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-rose-50/80 border-[#720925] ring-2 ring-[#720925]/20 shadow-xs'
                    : 'bg-stone-50/60 border-stone-200 hover:border-amber-400 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{op.icon}</span>
                    <span className="text-xs font-bold text-stone-900">{op.nameAr}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#720925] shrink-0" />}
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed pr-6">{op.descriptionAr}</p>
              </div>
            );
          })}
        </div>

        {/* Wax Seal Monogram Input */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Stamp className="w-3.5 h-3.5 text-amber-600" />
              <span>مونوغرام ختم الشمع (الحروف المحفورة على الختم):</span>
            </label>
            <button
              type="button"
              onClick={() => {
                const g = invitation.coupleGroomAr?.trim()?.charAt(0) || 'أ';
                const b = invitation.coupleBrideAr?.trim()?.charAt(0) || 'س';
                handleNestedThemeConfigChange('waxSealMonogram', `${g} & ${b}`);
              }}
              className="text-[10px] font-bold text-[#720925] hover:underline"
            >
              توليد تلقائي من الأسماء
            </button>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={currentMonogram}
              onChange={(e) => handleNestedThemeConfigChange('waxSealMonogram', e.target.value)}
              placeholder="مثال: أ & س أو M & S"
              className="w-44 px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold text-center bg-stone-50 focus:bg-white"
            />
            <div className="text-[11px] text-stone-500">
              يظهر محفوراً بالذهب على ختم الشمع في شاشة فتح الظرف
            </div>
          </div>
        </div>
      </div>

      {/* 4. Arabic Google Wedding Fonts */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-black text-stone-900">
              خط الدعوة والأعراس (Wedding Fonts):
            </span>
          </div>
          <span className="text-[10px] text-stone-400 font-bold">خطوط Google Fonts العربية</span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {ARABIC_WEDDING_FONTS.map((font: WeddingFontOption) => {
            const currentVal =
              invitation.themeConfig?.fontFamily ||
              invitation.theme?.config?.fontFamily ||
              "'Cairo', sans-serif";
            const isSelected =
              currentVal === font.fontFamily ||
              currentVal.toLowerCase().includes(font.name.toLowerCase());

            return (
              <div
                key={font.id}
                onClick={() => handleNestedThemeConfigChange('fontFamily', font.fontFamily)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-rose-50/80 border-[#720925] ring-2 ring-[#720925]/20 shadow-xs'
                    : 'bg-stone-50/60 border-stone-200 hover:border-amber-400 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-stone-900">{font.nameAr}</span>
                    <span className="text-[9px] font-mono text-stone-400">({font.name})</span>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-bold text-[#720925] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      مُعتمد
                    </span>
                  )}
                </div>

                <div
                  className="text-xs sm:text-sm text-stone-800 leading-snug py-1 px-2 rounded-lg bg-white border border-stone-100"
                  style={{ fontFamily: font.fontFamily }}
                >
                  بارك الله لهما وبارك عليهما وجمع بينهما في خير
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Font Input */}
        <div className="pt-2 border-t border-stone-100 space-y-1.5">
          <label className="text-[11px] font-bold text-stone-700 block">
            أو اكتب اسم أي خط مخصص من Google Fonts:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customFontInput}
              onChange={(e) => setCustomFontInput(e.target.value)}
              placeholder="مثال: Reem Kufi أو Changa أو Tajawal"
              className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs text-left dir-ltr bg-stone-50 focus:bg-white"
            />
            <button
              type="button"
              onClick={() => {
                if (!customFontInput.trim()) return;
                const clean = customFontInput.trim().replace(/['"]/g, '');
                handleNestedThemeConfigChange('fontFamily', `'${clean}', sans-serif`);
              }}
              className="px-3.5 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
            >
              تطبيق ✨
            </button>
          </div>
        </div>
      </div>

      {/* 5. Background Patterns & Inner Card Style */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#720925]" />
          <span className="text-xs font-black text-stone-900">
            نقوش الخلفية وشكل الكارت (Patterns & Card Style):
          </span>
        </div>

        {/* Pattern Presets */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-stone-700 block">نقش الزخرفة في الخلفية:</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BACKGROUND_PATTERN_PRESETS.map((pat) => {
              const isSelected = currentPattern === pat.id;
              return (
                <button
                  key={pat.id}
                  type="button"
                  onClick={() => handleNestedThemeConfigChange('backgroundPattern', pat.id)}
                  className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-50/80 border-[#720925] ring-2 ring-[#720925]/20 shadow-2xs'
                      : 'bg-stone-50/60 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-sm">{pat.icon}</span>
                    <span className="text-[11px] font-bold text-stone-900 truncate">{pat.nameAr}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inner Card Style */}
        <div className="space-y-1.5 pt-2 border-t border-stone-100">
          <label className="text-[11px] font-bold text-stone-700 block">شكل إطار الكارت الداخلي:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {INNER_CARD_STYLE_PRESETS.map((card) => {
              const isSelected = currentCardStyle === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleNestedThemeConfigChange('innerCardStyle', card.id)}
                  className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-50/80 border-[#720925] ring-2 ring-[#720925]/20 shadow-2xs'
                      : 'bg-stone-50/60 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-sm">{card.icon}</span>
                    <span className="text-[11px] font-bold text-stone-900">{card.nameAr}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Floating Particles */}
        <div className="space-y-1.5 pt-2 border-t border-stone-100">
          <label className="text-[11px] font-bold text-stone-700 block">تأثير الجزيئات المتطايرة (Floating Particles):</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {FLOATING_PARTICLES_PRESETS.map((prt) => {
              const isSelected = currentParticles === prt.id;
              return (
                <button
                  key={prt.id}
                  type="button"
                  onClick={() => handleNestedThemeConfigChange('floatingParticles', prt.id)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-50/80 border-[#720925] ring-2 ring-[#720925]/20 shadow-2xs'
                      : 'bg-stone-50/60 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className="text-base block mb-0.5">{prt.icon}</span>
                  <span className="text-[10px] font-bold text-stone-900 block truncate">{prt.nameAr}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
