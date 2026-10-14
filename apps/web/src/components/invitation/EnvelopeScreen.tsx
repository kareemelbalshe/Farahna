'use client';

import React, { useState } from 'react';
import { Sparkles, Heart, Crown, Music } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatArabicDate } from '@/lib/date';
import { playThemeMelody } from '@/lib/themeAudio';

interface EnvelopeScreenProps {
  coupleNames: string;
  onOpen: () => void;
  isOpen: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  themeSlug?: string;
  weddingMessageAr?: string | null;
  eventDate?: string | null;
  invitationTitle?: string | null;
  waxSealMonogram?: string | null;
}

type OpenStage = 'closed' | 'unsealing' | 'flap_open' | 'card_up' | 'revealing';

export function EnvelopeScreen({
  coupleNames,
  onOpen,
  isOpen,
  primaryColor = '#720925',
  secondaryColor = '#D4AF37',
  backgroundColor = '#FAF7F2',
  textColor = '#1A1819',
  themeSlug = 'royal-burgundy',
  weddingMessageAr,
  eventDate,
  invitationTitle,
  waxSealMonogram,
}: EnvelopeScreenProps) {
  const [openStage, setOpenStage] = useState<OpenStage>('closed');

  if (isOpen) return null;

  const isDark = Boolean(
    (backgroundColor &&
      ['#0', '#1', '#2', 'black'].some((p) => backgroundColor.toLowerCase().startsWith(p))) ||
      themeSlug === 'elegant-gold'
  );

  const formattedDate = eventDate ? formatArabicDate(eventDate) : '';

  // Extract first line or 100 characters of Quranic verse or message for the inner card
  const verseExcerpt =
    weddingMessageAr && weddingMessageAr.trim()
      ? weddingMessageAr.split('\n')[0].replace(/^«|»$/g, '').trim()
      : '';

  // Resolve palette per theme for maximum luxury across ALL themes
  const resolveThemePalette = () => {
    switch (themeSlug) {
      case 'elegant-gold':
        return {
          envelopeBody: '#131317',
          envelopeBodyGradient: 'linear-gradient(145deg, #1A1A22 0%, #121216 55%, #0B0B0E 100%)',
          envelopeBorder: '#D4AF37',
          flapColor: '#1A1A20',
          flapBorder: '#D4AF37',
          flapLiningBg: 'linear-gradient(135deg, #222018 0%, #151512 100%)',
          sealBg: 'radial-gradient(circle at 35% 35%, #FFF0B8 0%, #E6C25E 30%, #B88E28 70%, #7D5D0D 100%)',
          sealBorder: '#FFE28A',
          sealShadow: '0 12px 30px rgba(0,0,0,0.85), 0 0 25px rgba(212,175,55,0.7), inset 0 3px 6px rgba(255,255,255,0.7), inset 0 -4px 8px rgba(0,0,0,0.6)',
          sealIconColor: '#261C02',
          ribbonBg: 'linear-gradient(180deg, #D4AF37 0%, #997A15 100%)',
          buttonBg: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #D4AF37 55%, #AA771C 100%)',
          buttonText: '#121114',
          buttonBorder: 'rgba(255, 235, 160, 0.9)',
          buttonShadow: '0 12px 35px -5px rgba(212, 175, 55, 0.65)',
          badgeBg: 'bg-black/60 border-amber-400/50 text-amber-200',
          glowOrb: '#D4AF37',
        };
      case 'royal-burgundy':
        return {
          envelopeBody: '#54081B',
          envelopeBodyGradient: 'linear-gradient(145deg, #6E0D25 0%, #500619 55%, #35030F 100%)',
          envelopeBorder: '#D4AF37',
          flapColor: '#630B21',
          flapBorder: '#E5C05E',
          flapLiningBg: 'linear-gradient(135deg, #38030F 0%, #1F0108 100%)',
          sealBg: 'radial-gradient(circle at 35% 35%, #B5183F 0%, #800A25 50%, #4D0313 100%)',
          sealBorder: '#F5D77F',
          sealShadow: '0 12px 28px rgba(0,0,0,0.6), 0 0 25px rgba(212,175,55,0.6), inset 0 3px 6px rgba(255,255,255,0.5), inset 0 -4px 8px rgba(0,0,0,0.7)',
          sealIconColor: '#FDF3D6',
          ribbonBg: 'linear-gradient(180deg, #8C0B2A 0%, #540619 100%)',
          buttonBg: 'linear-gradient(135deg, #720925 0%, #8E1032 50%, #500619 100%)',
          buttonText: '#FFFDF9',
          buttonBorder: '#D4AF37',
          buttonShadow: '0 12px 35px -5px rgba(114, 9, 37, 0.7), 0 0 25px rgba(212,175,55,0.4)',
          badgeBg: isDark ? 'bg-black/60 border-amber-400/50 text-amber-200' : 'bg-white/85 border-amber-300 text-stone-900',
          glowOrb: '#8E1032',
        };
      case 'minimal-white':
        return {
          envelopeBody: '#F7F3EB',
          envelopeBodyGradient: 'linear-gradient(145deg, #FFFFFF 0%, #F5F0E6 60%, #EAE2D2 100%)',
          envelopeBorder: '#D4AF37',
          flapColor: '#F5EFE4',
          flapBorder: '#D4AF37',
          flapLiningBg: 'linear-gradient(135deg, #FAF7F2 0%, #E8DFD0 100%)',
          sealBg: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #F2EADB 45%, #C8B99D 100%)',
          sealBorder: '#D4AF37',
          sealShadow: '0 10px 24px rgba(0,0,0,0.25), 0 0 20px rgba(212,175,55,0.4), inset 0 3px 6px rgba(255,255,255,0.8), inset 0 -3px 6px rgba(0,0,0,0.2)',
          sealIconColor: '#7A622A',
          ribbonBg: 'linear-gradient(180deg, #D4AF37 0%, #A8862A 100%)',
          buttonBg: 'linear-gradient(135deg, #D4AF37 0%, #E8C86A 50%, #BF953F 100%)',
          buttonText: '#1F1B14',
          buttonBorder: '#F5E2A8',
          buttonShadow: '0 12px 30px -5px rgba(212, 175, 55, 0.5)',
          badgeBg: 'bg-white/90 border-amber-300 text-stone-900',
          glowOrb: '#D4AF37',
        };
      case 'romantic-floral':
        return {
          envelopeBody: '#682637',
          envelopeBodyGradient: 'linear-gradient(145deg, #843247 0%, #682637 55%, #461421 100%)',
          envelopeBorder: '#F5C6D6',
          flapColor: '#762B3F',
          flapBorder: '#F5C6D6',
          flapLiningBg: 'linear-gradient(135deg, #4A1523 0%, #2D0913 100%)',
          sealBg: 'radial-gradient(circle at 35% 35%, #FADCE6 0%, #C96883 45%, #7D2840 100%)',
          sealBorder: '#FFEAF2',
          sealShadow: '0 12px 28px rgba(0,0,0,0.5), 0 0 22px rgba(245,198,214,0.6), inset 0 3px 6px rgba(255,255,255,0.6), inset 0 -4px 8px rgba(0,0,0,0.5)',
          sealIconColor: '#FFFFFF',
          ribbonBg: 'linear-gradient(180deg, #C96883 0%, #852C43 100%)',
          buttonBg: 'linear-gradient(135deg, #8E3048 0%, #B84767 50%, #6E2135 100%)',
          buttonText: '#FFFDF9',
          buttonBorder: '#F5C6D6',
          buttonShadow: '0 12px 35px -5px rgba(142, 48, 72, 0.65)',
          badgeBg: isDark ? 'bg-black/60 border-rose-300/50 text-rose-200' : 'bg-white/85 border-rose-200 text-stone-900',
          glowOrb: '#C96883',
        };
      case 'egyptian-oriental':
        return {
          envelopeBody: '#0F213A',
          envelopeBodyGradient: 'linear-gradient(145deg, #183359 0%, #0F213A 55%, #081220 100%)',
          envelopeBorder: '#D4AF37',
          flapColor: '#142C4C',
          flapBorder: '#D4AF37',
          flapLiningBg: 'linear-gradient(135deg, #0A1626 0%, #040910 100%)',
          sealBg: 'radial-gradient(circle at 35% 35%, #FFE28A 0%, #D4AF37 40%, #8F6F16 80%, #523E07 100%)',
          sealBorder: '#FFF1B8',
          sealShadow: '0 12px 30px rgba(0,0,0,0.8), 0 0 25px rgba(212,175,55,0.7), inset 0 3px 6px rgba(255,255,255,0.6), inset 0 -4px 8px rgba(0,0,0,0.6)',
          sealIconColor: '#171306',
          ribbonBg: 'linear-gradient(180deg, #D4AF37 0%, #997A15 100%)',
          buttonBg: 'linear-gradient(135deg, #132D52 0%, #1F457D 50%, #0B1C33 100%)',
          buttonText: '#FFF6D6',
          buttonBorder: '#D4AF37',
          buttonShadow: '0 12px 35px -5px rgba(15, 33, 58, 0.75), 0 0 25px rgba(212,175,55,0.4)',
          badgeBg: 'bg-black/60 border-amber-400/50 text-amber-200',
          glowOrb: '#D4AF37',
        };
      default:
        // Generic fallback using props
        return {
          envelopeBody: isDark ? '#141418' : '#F6F0E6',
          envelopeBodyGradient: isDark
            ? 'linear-gradient(145deg, #1C1C24 0%, #121216 100%)'
            : 'linear-gradient(145deg, #FFFFFF 0%, #EDE5D5 100%)',
          envelopeBorder: secondaryColor || '#D4AF37',
          flapColor: isDark ? '#1C1C22' : '#F2E8D7',
          flapBorder: secondaryColor || '#D4AF37',
          flapLiningBg: isDark ? '#111114' : '#E8DDD0',
          sealBg: isDark
            ? 'radial-gradient(circle at 35% 35%, #F5D77F 0%, #D4AF37 50%, #997A15 100%)'
            : `radial-gradient(circle at 35% 35%, #A31C3F 0%, ${primaryColor || '#720925'} 55%, #420514 100%)`,
          sealBorder: secondaryColor || '#D4AF37',
          sealShadow: '0 12px 28px rgba(0,0,0,0.6), 0 0 22px rgba(212,175,55,0.5)',
          sealIconColor: isDark ? '#1A1608' : '#FDF4DC',
          ribbonBg: isDark
            ? 'linear-gradient(180deg, #D4AF37 0%, #997A15 100%)'
            : `linear-gradient(180deg, ${primaryColor || '#720925'} 0%, #3B0411 100%)`,
          buttonBg: isDark
            ? 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 35%, #AA771C 100%)'
            : `linear-gradient(135deg, ${primaryColor || '#720925'} 0%, #941336 50%, #4D0518 100%)`,
          buttonText: isDark ? '#121114' : '#FFFFFF',
          buttonBorder: secondaryColor || '#D4AF37',
          buttonShadow: `0 12px 35px -5px ${isDark ? 'rgba(212,175,55,0.6)' : 'rgba(114,9,37,0.6)'}`,
          badgeBg: isDark ? 'bg-black/60 border-amber-400/50 text-amber-200' : 'bg-white/85 border-amber-300 text-stone-900',
          glowOrb: secondaryColor || '#D4AF37',
        };
    }
  };

  const palette = resolveThemePalette();

  const handleOpenClick = () => {
    if (openStage !== 'closed') {
      // If user taps again while opening, immediately complete and reveal
      onOpen();
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      onOpen();
      return;
    }

    // Step 1: Start unsealing & play music immediately
    setOpenStage('unsealing');

    try {
      const slugKey = (
        themeSlug &&
        ['royal-burgundy', 'elegant-gold', 'minimal-white', 'romantic-floral', 'egyptian-oriental'].includes(themeSlug)
          ? themeSlug
          : isDark
          ? 'elegant-gold'
          : 'royal-burgundy'
      ) as 'royal-burgundy' | 'elegant-gold' | 'minimal-white' | 'romantic-floral' | 'egyptian-oriental';
      playThemeMelody(slugKey);
    } catch (e) {
      // Safe audio fallback
    }

    // Initial golden sparkle burst
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: [palette.envelopeBorder, '#FFD700', '#FFF8DC', '#FFFFFF'],
      });
    } catch (e) {}

    // Step 2: Open Flap 180deg (100ms)
    setTimeout(() => {
      setOpenStage('flap_open');
    }, 100);

    // Step 3: Card slides up smoothly (250ms)
    setTimeout(() => {
      setOpenStage('card_up');
    }, 250);

    // Festive confetti burst from both sides (350ms)
    setTimeout(() => {
      try {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 65,
          origin: { x: 0.2, y: 0.6 },
          colors: [palette.envelopeBorder, '#FFD700', '#F5D77F', '#FFFFFF'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 65,
          origin: { x: 0.8, y: 0.6 },
          colors: [palette.envelopeBorder, '#FFD700', '#F5D77F', '#FFFFFF'],
        });
      } catch (e) {}
    }, 350);

    // Step 4: Smoothly fade & scale envelope to reveal full page (850ms)
    setTimeout(() => {
      setOpenStage('revealing');
    }, 850);

    // Step 5: Transition complete -> unmount and hand over to page (1150ms)
    setTimeout(() => {
      onOpen();
    }, 1150);
  };

  const isFlapOpen = openStage === 'flap_open' || openStage === 'card_up' || openStage === 'revealing';
  const isCardUp = openStage === 'card_up' || openStage === 'revealing';
  const isRevealing = openStage === 'revealing';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none overflow-hidden transition-all duration-350 ease-out ${
        isRevealing ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: isDark ? '#0A0A0D' : backgroundColor || '#FAF7F2',
        backgroundImage: isDark
          ? 'radial-gradient(circle at 50% 38%, rgba(212, 175, 55, 0.22) 0%, rgba(10, 10, 13, 0.98) 75%)'
          : `radial-gradient(${secondaryColor || '#d4af37'} 1.2px, transparent 1.2px), radial-gradient(${secondaryColor || '#d4af37'} 1.2px, ${backgroundColor || '#FAF7F2'} 1.2px)`,
        backgroundSize: isDark ? '100% 100%' : '36px 36px',
        backgroundPosition: '0 0, 18px 18px',
      }}
    >
      {/* Royal Ambient Glow Aura Orbs */}
      <div
        className="absolute w-[520px] h-[520px] rounded-full blur-3xl opacity-30 pointer-events-none -z-10 animate-pulse"
        style={{ backgroundColor: palette.glowOrb }}
      />
      <div
        className="absolute w-[320px] h-[320px] rounded-full blur-2xl opacity-25 pointer-events-none -z-10"
        style={{ backgroundColor: palette.envelopeBorder }}
      />

      <div className="relative w-full max-w-lg mx-auto text-center flex flex-col items-center justify-center space-y-4 sm:space-y-6 max-h-[96vh]">
        {/* Header Ribbon / Greetings */}
        <div
          className={`space-y-1.5 sm:space-y-2 w-full transition-all duration-300 ease-out ${
            openStage !== 'closed'
              ? 'opacity-0 -translate-y-3 pointer-events-none'
              : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Top Royal Badge (NO SPINNING ICON) */}
          <div
            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 rounded-full border shadow-lg backdrop-blur-md transition-all ${palette.badgeBg}`}
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-black font-cairo">
              دعوة خاصة وفرحة لا تكتمل إلا بوجودكم ❤️
            </span>
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          </div>

          {/* Couple Names */}
          <h1
            className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-cairo tracking-tight drop-shadow-md pt-0.5 leading-snug px-2 break-words"
            style={{
              color: isDark ? '#FFFFFF' : '#1A1819',
              textShadow: isDark ? '0 2px 14px rgba(212,175,55,0.35)' : undefined,
            }}
          >
            {coupleNames || 'العروسين'}
          </h1>

          {/* Subtitle / Occasion */}
          <p
            className="text-xs sm:text-sm font-amiri font-bold tracking-wide"
            style={{ color: isDark ? '#F5D77F' : secondaryColor || '#D4AF37' }}
          >
            {invitationTitle || 'يسعدنا ويشرفنا حضوركم ومشاركتنا ليلة العمر ❖'}
          </p>
        </div>

        {/* 3D Envelope Perspective Container */}
        <div
          className="relative mx-auto w-[280px] min-[360px]:w-[320px] sm:w-[390px] h-[185px] min-[360px]:h-[210px] sm:h-[245px] cursor-pointer group shrink-0"
          style={{ perspective: '1200px' }}
          onClick={handleOpenClick}
          role="button"
          tabIndex={0}
          aria-label="افتح الظرف الملكي"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleOpenClick();
          }}
        >
          {/* Inner Golden Glow Emitter (Lights up when opened) */}
          <div
            className={`absolute inset-x-8 top-6 h-28 rounded-full blur-xl pointer-events-none z-20 transition-opacity duration-700 ${
              isFlapOpen ? 'opacity-90' : 'opacity-0'
            }`}
            style={{
              background: 'radial-gradient(circle, rgba(255, 230, 140, 0.8) 0%, rgba(212, 175, 55, 0.4) 60%, transparent 100%)',
            }}
          />

          {/* 1. Inner Luxury Card (Slides UP gracefully out of the pocket) */}
          <div
            className={`absolute inset-x-3 bottom-2 h-[170px] min-[360px]:h-[195px] sm:h-[225px] rounded-2xl border-2 shadow-2xl p-3 sm:p-5 flex flex-col justify-between text-center transition-all z-25 ${
              isCardUp
                ? '-translate-y-16 min-[360px]:-translate-y-20 sm:-translate-y-28 scale-[1.02] shadow-[0_20px_45px_rgba(0,0,0,0.5),0_0_30px_rgba(212,175,55,0.4)]'
                : 'translate-y-0 opacity-95'
            }`}
            style={{
              transitionDuration: '450ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              backgroundColor: isDark ? '#FFFDF8' : '#FCFAF6',
              borderColor: palette.envelopeBorder,
              backgroundImage:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(253, 248, 237, 0.94))',
            }}
          >
            {/* Top Bismillah / Verse Excerpt */}
            {verseExcerpt ? (
              <div className="space-y-0.5">
                <span className="text-[11px] sm:text-xs text-amber-900 font-amiri font-bold tracking-widest block opacity-85">
                  ﷽
                </span>
                <p className="text-[10px] sm:text-[11px] text-stone-800 font-amiri font-bold leading-relaxed line-clamp-2 px-1">
                  «{verseExcerpt}»
                </p>
              </div>
            ) : (
              <div className="py-0.5">
                <span className="text-[11px] text-amber-900 font-amiri font-bold tracking-widest block">
                  ✨ دعوة خاصة ومباركة لحضور الحفل ✨
                </span>
              </div>
            )}

            {/* Couple names on card */}
            <div className="py-1 border-y border-amber-300/80 my-auto">
              <span
                className="text-base sm:text-xl font-black font-cairo block leading-snug px-1 break-words"
                style={{ color: '#720925' }}
              >
                {coupleNames}
              </span>
              <span className="text-[10px] sm:text-[11px] font-amiri font-bold text-amber-800 block mt-0.5">
                {invitationTitle || 'نتشرف بحضوركم ومشاركتنا فرحتنا'}
              </span>
            </div>

            {/* Bottom event date */}
            {formattedDate ? (
              <div className="flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] text-stone-700 font-cairo font-bold">
                <span>📅</span>
                <span>{formattedDate}</span>
              </div>
            ) : (
              <span className="text-[9px] text-stone-500 font-cairo font-bold">
                أهلاً وسهلاً بكم في ليلتنا المباركة
              </span>
            )}
          </div>

          {/* 2. Main Envelope Pocket Body */}
          <div
            className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 shadow-2xl overflow-hidden z-30 pointer-events-none transition-all"
            style={{
              borderColor: palette.envelopeBorder,
              background: palette.envelopeBodyGradient,
              boxShadow: isDark
                ? '0 20px 50px rgba(0,0,0,0.85), inset 0 1px 2px rgba(255,255,255,0.1)'
                : '0 20px 45px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.6)',
            }}
          >
            {/* Fine Luxury Arabesque Corner Filigree */}
            <div
              className="absolute top-2 left-2 w-7 h-7 border-t-2 border-l-2 rounded-tl-lg pointer-events-none"
              style={{ borderColor: palette.envelopeBorder }}
            />
            <div
              className="absolute top-2 right-2 w-7 h-7 border-t-2 border-r-2 rounded-tr-lg pointer-events-none"
              style={{ borderColor: palette.envelopeBorder }}
            />
            <div
              className="absolute bottom-2 left-2 w-7 h-7 border-b-2 border-l-2 rounded-bl-lg pointer-events-none"
              style={{ borderColor: palette.envelopeBorder }}
            />
            <div
              className="absolute bottom-2 right-2 w-7 h-7 border-b-2 border-r-2 rounded-br-lg pointer-events-none"
              style={{ borderColor: palette.envelopeBorder }}
            />

            {/* Envelope Bottom Pocket Triangle Fold */}
            <div
              className="absolute inset-x-0 bottom-0 h-32 sm:h-38 border-t"
              style={{
                clipPath: 'polygon(0 100%, 100% 100%, 50% 22%)',
                background: palette.envelopeBodyGradient,
                borderColor: `${palette.envelopeBorder}50`,
                filter: 'brightness(0.92)',
              }}
            />
            {/* Left Pocket Triangle */}
            <div
              className="absolute inset-y-0 left-0 w-32 sm:w-40"
              style={{
                clipPath: 'polygon(0 0, 0 100%, 100% 50%)',
                background: palette.envelopeBodyGradient,
                filter: 'brightness(0.96)',
              }}
            />
            {/* Right Pocket Triangle */}
            <div
              className="absolute inset-y-0 right-0 w-32 sm:w-40"
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 0 50%)',
                background: palette.envelopeBodyGradient,
                filter: 'brightness(0.96)',
              }}
            />
          </div>

          {/* 3. Envelope Top Flap with 3D Flip Action */}
          <div
            className="absolute inset-x-0 top-0 h-28 sm:h-34 transition-transform ease-in-out pointer-events-none"
            style={{
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              transform: isFlapOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
              transitionDuration: '400ms',
              zIndex: isFlapOpen ? 15 : 40,
            }}
          >
            {/* Front of Flap (Face shown when closed) */}
            <div
              className="absolute inset-0 shadow-lg border-b-2"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                backfaceVisibility: 'hidden',
                background: palette.envelopeBodyGradient,
                borderColor: palette.envelopeBorder,
              }}
            >
              {/* Flap Gold Foil Trim Line */}
              <div
                className="absolute inset-x-3 top-1 h-24"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  background: `linear-gradient(to bottom, transparent, ${palette.envelopeBorder}40)`,
                }}
              />
            </div>

            {/* Inside of Flap (Revealed when opened 180deg) */}
            <div
              className="absolute inset-0 border-t shadow-inner"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                transform: 'rotateY(180deg) rotateZ(180deg)',
                backfaceVisibility: 'hidden',
                background: palette.flapLiningBg,
                borderColor: `${palette.envelopeBorder}60`,
              }}
            />
          </div>

          {/* 4. Luxury 3D Wax Seal Stamp (ختم الشمع الملكي) */}
          <div
            className={`absolute top-[48%] sm:top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all ${
              isFlapOpen
                ? 'opacity-0 scale-50 -translate-y-12 pointer-events-none'
                : 'opacity-100 scale-100 group-hover:scale-105'
            }`}
            style={{ transitionDuration: '450ms' }}
          >
            {/* Satin Ribbon Tails cascading down */}
            <div className="absolute top-[80%] left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 pointer-events-none -z-10">
              <div
                className="w-2.5 sm:w-3 h-8 sm:h-10 shadow-md transform -rotate-12 origin-top"
                style={{
                  background: palette.ribbonBg,
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
                }}
              />
              <div
                className="w-2.5 sm:w-3 h-8 sm:h-10 shadow-md transform rotate-12 origin-top"
                style={{
                  background: palette.ribbonBg,
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
                }}
              />
            </div>

            {/* Wax Seal Circle Stamp */}
            <div
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-transform"
              style={{
                background: palette.sealBg,
                border: `2px solid ${palette.sealBorder}`,
                boxShadow: palette.sealShadow,
              }}
            >
              {/* Organic Melted Wax Outer Rings */}
              <div
                className="absolute inset-1.5 rounded-full border border-dashed opacity-75"
                style={{ borderColor: palette.sealIconColor }}
              />
              <div
                className="absolute inset-3 rounded-full border opacity-50"
                style={{ borderColor: palette.sealIconColor }}
              />

              {/* Wax Seal Center Embossed Icon & Monogram */}
              <div className="flex flex-col items-center justify-center space-y-0.5">
                {waxSealMonogram ? (
                  <span
                    className="text-base sm:text-xl font-black font-cairo tracking-widest drop-shadow-md"
                    style={{ color: palette.sealIconColor }}
                  >
                    {waxSealMonogram}
                  </span>
                ) : (
                  <>
                    <Crown
                      className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-sm"
                      style={{ color: palette.sealIconColor }}
                    />
                    <Heart
                      className="w-4 h-4 sm:w-4.5 sm:h-4.5 drop-shadow-sm fill-current"
                      style={{ color: palette.sealIconColor }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Open Button with Gold Shimmer & Music Cue */}
        <div className="space-y-2 pt-1 w-full max-w-sm sm:max-w-md mx-auto">
          {/* Main Luxury "اضغط" Button */}
          <button
            type="button"
            onClick={handleOpenClick}
            disabled={openStage === 'revealing'}
            className="relative group overflow-hidden w-full py-3.5 sm:py-4 px-6 sm:px-8 rounded-full font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer ring-2 ring-amber-400/60 ring-offset-2 ring-offset-black/50"
            style={{
              background: palette.buttonBg,
              color: palette.buttonText,
              border: `1.5px solid ${palette.buttonBorder}`,
              boxShadow: palette.buttonShadow,
            }}
          >
            {/* Continuous Shimmer Light Sweep Effect */}
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-gold-shimmer pointer-events-none" />

            <Crown className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 drop-shadow-sm" />
            <span className="tracking-wide">
              {openStage === 'closed'
                ? 'اضغط لفض الختم وفتح الدعوة الملكية 💌'
                : 'جاري فتح الدعوة الملكية... ✨'}
            </span>
            <Heart className="w-3.5 h-3.5 shrink-0 fill-current opacity-80" />
          </button>

          {/* Calming Music Cue Hint (NO SPINNING/BOUNCING) */}
          <div
            className={`flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-semibold ${
              isDark ? 'text-amber-300/80' : 'text-stone-600'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>(يبدأ عزف الموسيقى الهادئة فور فض الختم ✨)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
