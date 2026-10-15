'use client';

import React from 'react';
import { Crown, Sparkles, Heart } from 'lucide-react';

export interface InnerCardViewProps {
  style?: 'arched' | 'double-gold' | 'frosted' | 'deckle' | 'royal-crest' | string;
  coupleNames?: string | null;
  invitationTitle?: string | null;
  formattedDate?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  borderColor?: string | null;
  isDark?: boolean;
  verseExcerpt?: string | null;
  waxSealMonogram?: string | null;
  className?: string;
  isPreview?: boolean;
}

export function InnerCardView({
  style = 'arched',
  coupleNames,
  invitationTitle,
  formattedDate,
  primaryColor,
  secondaryColor,
  borderColor,
  isDark = false,
  verseExcerpt,
  waxSealMonogram,
  className = '',
  isPreview = false,
}: InnerCardViewProps) {
  const currentStyle = style || 'arched';
  const displayCoupleNames = coupleNames?.trim() || 'أحمد & سارة';
  const displayTitle = invitationTitle?.trim() || 'نتشرف بحضوركم ومشاركتنا فرحتنا';
  const resolvedPrimaryColor = primaryColor || '#720925';
  const resolvedSecondaryColor = secondaryColor || '#D4AF37';
  const resolvedBorderColor = borderColor || resolvedSecondaryColor;
  const gold = borderColor || secondaryColor || '#D4AF37';

  // Base background color depending on style
  const cardBg =
    currentStyle === 'frosted'
      ? 'rgba(255, 255, 255, 0.88)'
      : currentStyle === 'deckle'
      ? isDark ? '#1C1A17' : '#FAF5EC'
      : isDark ? '#FFFDF8' : '#FCFAF6';

  return (
    <div
      className={`relative w-full h-full p-3 sm:p-5 flex flex-col justify-between text-center select-none overflow-hidden transition-all duration-300 ${className} ${
        currentStyle === 'double-gold'
          ? 'inner-card-double-gold'
          : currentStyle === 'frosted'
          ? 'inner-card-frosted'
          : currentStyle === 'deckle'
          ? 'inner-card-deckle'
          : currentStyle === 'royal-crest'
          ? 'inner-card-royal-crest'
          : 'inner-card-arched'
      }`}
      style={{
        backgroundColor: cardBg,
        borderColor: gold,
      }}
    >
      {/* =====================================================================
          1. STYLE: ARCHED (القوس الملكي المقوس كبوابات القصور)
          ===================================================================== */}
      {currentStyle === 'arched' && (
        <>
          {/* Inner Arched Decorative Filigree Line */}
          <div
            className="absolute inset-x-2.5 top-2.5 h-16 pointer-events-none rounded-t-[100px] border-t-2 border-x opacity-60"
            style={{ borderColor: gold }}
          />
          {/* Crown Peak Emblem */}
          <div className="absolute top-1 inset-x-0 flex justify-center pointer-events-none z-10">
            <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center shadow-xs">
              <Crown className="w-3 h-3 text-amber-600" />
            </div>
          </div>
        </>
      )}

      {/* =====================================================================
          2. STYLE: DOUBLE GOLD (إطار مذهب مزدوج مع ٤ زوايا أرابيسك)
          ===================================================================== */}
      {currentStyle === 'double-gold' && (
        <>
          {/* Inner concentric gold line */}
          <div
            className="absolute inset-2 border pointer-events-none rounded-xl opacity-75"
            style={{ borderColor: gold }}
          />

          {/* Top-Left Arabesque Corner Filigree */}
          <svg
            className="absolute top-2 left-2 w-5 h-5 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color: gold }}
          >
            <path
              d="M3 21V10C3 6.13401 6.13401 3 10 3H21M3 3L9 9M3 9C5 9 7 7 7 5M9 3C9 5 11 7 13 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Top-Right Arabesque Corner Filigree */}
          <svg
            className="absolute top-2 right-2 w-5 h-5 pointer-events-none -scale-x-100"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color: gold }}
          >
            <path
              d="M3 21V10C3 6.13401 6.13401 3 10 3H21M3 3L9 9M3 9C5 9 7 7 7 5M9 3C9 5 11 7 13 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Bottom-Left Arabesque Corner Filigree */}
          <svg
            className="absolute bottom-2 left-2 w-5 h-5 pointer-events-none -scale-y-100"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color: gold }}
          >
            <path
              d="M3 21V10C3 6.13401 6.13401 3 10 3H21M3 3L9 9M3 9C5 9 7 7 7 5M9 3C9 5 11 7 13 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Bottom-Right Arabesque Corner Filigree */}
          <svg
            className="absolute bottom-2 right-2 w-5 h-5 pointer-events-none scale-[-1]"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color: gold }}
          >
            <path
              d="M3 21V10C3 6.13401 6.13401 3 10 3H21M3 3L9 9M3 9C5 9 7 7 7 5M9 3C9 5 11 7 13 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </>
      )}

      {/* =====================================================================
          3. STYLE: FROSTED GLASS (بلور زجاجي مشع وتأثير زجاج كريستالي)
          ===================================================================== */}
      {currentStyle === 'frosted' && (
        <>
          {/* Glass light reflection sweep */}
          <div className="absolute -top-12 -left-12 w-32 h-64 bg-gradient-to-r from-transparent via-white/50 to-transparent rotate-35 pointer-events-none" />
          <div className="absolute top-2 right-3 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          </div>
          <div className="absolute bottom-2 left-3 pointer-events-none">
            <Sparkles className="w-3 h-3 text-amber-400/80" />
          </div>
          {/* Beveled crystal border */}
          <div className="absolute inset-1 border border-white/90 rounded-2xl pointer-events-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]" />
        </>
      )}

      {/* =====================================================================
          4. STYLE: DECKLE EDGE (حواف قطنية أثرية مع ورق يدوي الصنع)
          ===================================================================== */}
      {currentStyle === 'deckle' && (
        <>
          {/* Vintage deckle edge textured perimeter */}
          <div className="absolute inset-1 border border-dashed border-amber-900/30 rounded-md pointer-events-none opacity-70" />
          {/* Antique watermarked emblem */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-8 select-none">
            <span className="font-amiri text-5xl font-bold text-amber-950">فرحنا</span>
          </div>
        </>
      )}

      {/* =====================================================================
          5. STYLE: ROYAL CREST (شارة المونوغرام والتاج الملكي)
          ===================================================================== */}
      {currentStyle === 'royal-crest' && (
        <>
          {/* Embossed Royal Shield Crest Header */}
          <div className="absolute -top-1 inset-x-0 flex justify-center pointer-events-none z-10">
            <div
              className="px-3 py-0.5 rounded-b-xl border border-t-0 shadow-sm flex items-center gap-1"
              style={{
                backgroundColor: isDark ? '#1C1C22' : '#FFFFFF',
                borderColor: gold,
              }}
            >
              <Crown className="w-3 h-3 text-amber-600" />
              <span className="text-[9px] font-black font-cairo text-amber-900" style={{ color: gold }}>
                {waxSealMonogram || 'فرحنا'}
              </span>
            </div>
          </div>
          {/* Regalia twin borders */}
          <div
            className="absolute inset-1.5 border border-amber-500/40 rounded-2xl pointer-events-none"
          />
        </>
      )}

      {/* ---------------- CARD CONTENT BODY ---------------- */}
      {/* Top Bismillah / Verse Excerpt */}
      {verseExcerpt ? (
        <div className={`space-y-0.5 z-10 ${currentStyle === 'arched' ? 'pt-2' : currentStyle === 'royal-crest' ? 'pt-2' : ''}`}>
          <span className="text-[10px] sm:text-xs text-amber-900 font-amiri font-bold tracking-widest block opacity-85">
            ﷽
          </span>
          <p className="text-[9px] min-[360px]:text-[10px] sm:text-[11px] text-stone-800 font-amiri font-bold leading-relaxed line-clamp-2 px-1">
            «{verseExcerpt}»
          </p>
        </div>
      ) : (
        <div className={`py-0.5 z-10 ${currentStyle === 'arched' ? 'pt-2' : currentStyle === 'royal-crest' ? 'pt-2' : ''}`}>
          <span className="text-[10px] sm:text-[11px] text-amber-900 font-amiri font-bold tracking-widest block">
            ✨ دعوة خاصة ومباركة لحضور الحفل ✨
          </span>
        </div>
      )}

      {/* Couple names on card */}
      <div className="py-1.5 border-y border-amber-300/80 my-auto z-10 relative">
        <span
          className={`font-black font-cairo block leading-snug px-1 break-words ${
            isPreview ? 'text-xs min-[360px]:text-sm' : 'text-sm min-[360px]:text-base sm:text-xl'
          }`}
          style={{ color: resolvedPrimaryColor }}
        >
          {displayCoupleNames}
        </span>
        <span className="text-[9px] min-[360px]:text-[10px] sm:text-[11px] font-amiri font-bold text-amber-800 block mt-0.5 truncate">
          {displayTitle}
        </span>
      </div>

      {/* Bottom event date */}
      <div className="z-10 pb-0.5">
        {formattedDate ? (
          <div className="flex items-center justify-center gap-1.5 text-[8px] min-[360px]:text-[9px] sm:text-[10px] text-stone-700 font-cairo font-bold">
            <span>📅</span>
            <span>{formattedDate}</span>
          </div>
        ) : (
          <span className="text-[8px] min-[360px]:text-[9px] text-stone-500 font-cairo font-bold">
            أهلاً وسهلاً بكم في ليلتنا المباركة
          </span>
        )}
      </div>
    </div>
  );
}
