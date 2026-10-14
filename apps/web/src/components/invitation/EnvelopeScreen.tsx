'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, Heart, Crown, Music } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatArabicDate } from '@/lib/date';
import { playThemeMelody } from '@/lib/themeAudio';

interface EnvelopeScreenProps {
  coupleNames: string;
  coupleGroomAr?: string | null;
  coupleBrideAr?: string | null;
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
  isPreview?: boolean;
}

type OpenStage = 'closed' | 'unsealing' | 'flap_open' | 'card_up' | 'revealing';

export function EnvelopeScreen({
  coupleNames,
  coupleGroomAr,
  coupleBrideAr,
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
  isPreview = false,
}: EnvelopeScreenProps) {
  const [openStage, setOpenStage] = useState<OpenStage>('closed');

  if (isOpen) return null;

  const hasTriggeredRef = useRef(false);

  const isDark = Boolean(
    (backgroundColor &&
      ['#0', '#1', '#2', 'black'].some((p) => backgroundColor.toLowerCase().startsWith(p))) ||
      themeSlug === 'elegant-gold' ||
      themeSlug === 'egyptian-oriental'
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
    // If user taps again while opening, immediately complete and reveal
    if (hasTriggeredRef.current || openStage !== 'closed') {
      onOpen();
      return;
    }

    hasTriggeredRef.current = true;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      onOpen();
      return;
    }

    // Step 1: Immediate unseal sound & flap flip start (instant feedback on click 1)
    setOpenStage('flap_open');

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

    // Initial golden sparkle burst on seal break
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: [palette.envelopeBorder, '#FFD700', '#FFF8DC', '#FFFFFF'],
      });
    } catch (e) {}

    // Step 2: Flap completes 180deg flip (480ms) -> now Inner Card slides up
    setTimeout(() => {
      setOpenStage('card_up');
    }, 480);

    // Step 3: Festive confetti burst from both sides once card is elevated (880ms)
    setTimeout(() => {
      try {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 60,
          origin: { x: 0.25, y: 0.55 },
          colors: [palette.envelopeBorder, '#FFD700', '#F5D77F', '#FFFFFF'],
        });
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 60,
          origin: { x: 0.75, y: 0.55 },
          colors: [palette.envelopeBorder, '#FFD700', '#F5D77F', '#FFFFFF'],
        });
      } catch (e) {}
    }, 880);

    // Step 4: Smoothly fade & scale envelope to reveal full page (1400ms)
    setTimeout(() => {
      setOpenStage('revealing');
    }, 1400);

    // Step 5: Transition complete -> unmount and hand over to page (1850ms)
    setTimeout(() => {
      onOpen();
    }, 1850);
  };

  const handleUserAction = (e?: React.SyntheticEvent) => {
    if (e && 'stopPropagation' in e) {
      e.stopPropagation();
    }
    handleOpenClick();
  };

  const isFlapOpen = openStage === 'flap_open' || openStage === 'card_up' || openStage === 'revealing';
  const isCardUp = openStage === 'card_up' || openStage === 'revealing';
  const isRevealing = openStage === 'revealing';

  const groom = coupleGroomAr?.trim() || '';
  const bride = coupleBrideAr?.trim() || '';
  const hasSplitNames = Boolean(groom && bride);

  // Clean any accidental trailing ellipsis from inputs/mock data
  const cleanGroom = groom.replace(/(\.{2,}|…)$/, '').trim();
  const cleanBride = bride.replace(/(\.{2,}|…)$/, '').trim();
  const cleanCoupleNames = (coupleNames || '').replace(/(\.{2,}|…)$/, '').trim();

  // Dynamic font sizing based on length & preview mode
  const getCoupleNamesClass = () => {
    const totalLen = hasSplitNames
      ? `${cleanGroom} & ${cleanBride}`.length
      : cleanCoupleNames.length;

    if (isPreview) {
      if (totalLen > 30) return 'text-xs min-[360px]:text-sm leading-snug';
      if (totalLen > 18) return 'text-sm min-[360px]:text-base leading-snug';
      return 'text-base min-[360px]:text-lg leading-snug';
    }
    // Full standalone view
    if (totalLen > 30) return 'text-base sm:text-2xl md:text-3xl leading-snug';
    if (totalLen > 18) return 'text-lg sm:text-3xl md:text-4xl leading-snug';
    return 'text-xl sm:text-4xl md:text-5xl leading-snug';
  };

  return (
    <div
      className={`${
        isPreview ? 'absolute inset-0' : 'fixed inset-0'
      } z-50 flex flex-col items-center justify-between p-3 select-none overflow-y-auto no-scrollbar transition-all duration-450 ease-out ${
        isPreview ? 'py-3.5 px-2.5 sm:px-3' : 'sm:p-6'
      } ${
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
        className={`absolute rounded-full blur-3xl opacity-30 pointer-events-none -z-10 animate-pulse ${
          isPreview ? 'w-64 h-64' : 'w-[520px] h-[520px]'
        }`}
        style={{ backgroundColor: palette.glowOrb }}
      />
      <div
        className={`absolute rounded-full blur-2xl opacity-25 pointer-events-none -z-10 ${
          isPreview ? 'w-44 h-44' : 'w-[320px] h-[320px]'
        }`}
        style={{ backgroundColor: palette.envelopeBorder }}
      />

      <div
        className={`relative w-full mx-auto my-auto text-center flex flex-col items-center justify-center transition-all ${
          isPreview
            ? 'max-w-[320px] space-y-2 min-[360px]:space-y-3'
            : 'max-w-lg space-y-4 sm:space-y-6 max-h-[96vh]'
        }`}
      >
        {/* Header Ribbon / Greetings */}
        <div
          className={`w-full transition-all duration-300 ease-out px-2 ${
            isPreview ? 'space-y-1' : 'space-y-1.5 sm:space-y-2'
          } ${
            openStage !== 'closed'
              ? 'opacity-0 -translate-y-3 pointer-events-none'
              : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Top Royal Badge */}
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border shadow-md backdrop-blur-md transition-all max-w-[96%] ${
              isPreview ? 'px-2.5 py-0.5' : 'px-3 sm:px-5 py-1 sm:py-1.5 shadow-lg'
            } ${palette.badgeBg}`}
          >
            <Sparkles className={`${isPreview ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'} text-amber-400 shrink-0`} />
            <span className={`${isPreview ? 'text-[10px]' : 'text-[11px] sm:text-sm'} font-black font-cairo truncate`}>
              دعوة خاصة وفرحة لا تكتمل إلا بوجودكم ❤️
            </span>
            <Crown className={`${isPreview ? 'w-2.5 h-2.5' : 'w-3 h-3 sm:w-3.5 sm:h-3.5'} text-amber-400 shrink-0`} />
          </div>

          {/* Couple Names */}
          <h1
            className={`font-black font-cairo tracking-tight drop-shadow-md pt-0.5 px-2 break-words max-w-full ${getCoupleNamesClass()}`}
            style={{
              color: isDark ? '#FFFFFF' : '#1A1819',
              textShadow: isDark ? '0 2px 14px rgba(212,175,55,0.35)' : undefined,
            }}
          >
            {hasSplitNames ? (
              <span className="inline-flex items-center justify-center flex-wrap gap-x-1.5 gap-y-0.5">
                <span>{cleanGroom}</span>
                <span className="font-amiri font-normal text-amber-500 text-[1.1em] px-0.5">&amp;</span>
                <span>{cleanBride}</span>
              </span>
            ) : (
              <span>{cleanCoupleNames || 'العروسين'}</span>
            )}
          </h1>

          {/* Subtitle / Occasion */}
          <p
            className={`${
              isPreview ? 'text-[10px] min-[360px]:text-[11px] line-clamp-1' : 'text-[11px] sm:text-sm'
            } font-amiri font-bold tracking-wide px-2 break-words`}
            style={{ color: isDark ? '#F5D77F' : secondaryColor || '#D4AF37' }}
          >
            {invitationTitle || 'يسعدنا ويشرفنا حضوركم ومشاركتنا ليلة العمر ❖'}
          </p>
        </div>

        {/* 3D Envelope Perspective Container */}
        <div
          className={`relative mx-auto max-w-full cursor-pointer group shrink-0 transition-all ${
            isPreview
              ? 'w-[260px] min-[360px]:w-[280px] h-[160px] min-[360px]:h-[175px]'
              : 'w-[min(92vw,290px)] min-[380px]:w-[320px] sm:w-[390px] h-[190px] min-[380px]:h-[210px] sm:h-[245px]'
          }`}
          style={{ perspective: '1200px' }}
          onClick={handleUserAction}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleUserAction(e);
          }}
          role="button"
          tabIndex={0}
          aria-label="افتح الظرف الملكي"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleUserAction(e);
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
            className={`absolute inset-x-2.5 sm:inset-x-3 bottom-2 rounded-2xl border-2 shadow-2xl p-2.5 sm:p-5 flex flex-col justify-between text-center transition-all z-25 ${
              isPreview
                ? 'h-[145px] min-[360px]:h-[155px]'
                : 'h-[170px] min-[360px]:h-[195px] sm:h-[225px]'
            } ${
              isCardUp
                ? isPreview
                  ? '-translate-y-14 min-[360px]:-translate-y-16 scale-[1.02] shadow-[0_15px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.4)]'
                  : '-translate-y-16 min-[360px]:-translate-y-20 sm:-translate-y-28 scale-[1.02] shadow-[0_20px_45px_rgba(0,0,0,0.5),0_0_30px_rgba(212,175,55,0.4)]'
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
                <span className="text-[10px] sm:text-xs text-amber-900 font-amiri font-bold tracking-widest block opacity-85">
                  ﷽
                </span>
                <p className="text-[9px] min-[360px]:text-[10px] sm:text-[11px] text-stone-800 font-amiri font-bold leading-relaxed line-clamp-2 px-1">
                  «{verseExcerpt}»
                </p>
              </div>
            ) : (
              <div className="py-0.5">
                <span className="text-[10px] sm:text-[11px] text-amber-900 font-amiri font-bold tracking-widest block">
                  ✨ دعوة خاصة ومباركة لحضور الحفل ✨
                </span>
              </div>
            )}

            {/* Couple names on card */}
            <div className="py-0.5 sm:py-1 border-y border-amber-300/80 my-auto">
              <span
                className={`font-black font-cairo block leading-snug px-1 break-words ${
                  isPreview ? 'text-xs min-[360px]:text-sm' : 'text-sm min-[360px]:text-base sm:text-xl'
                }`}
                style={{ color: '#720925' }}
              >
                {coupleNames}
              </span>
              <span className="text-[9px] min-[360px]:text-[10px] sm:text-[11px] font-amiri font-bold text-amber-800 block mt-0.5 truncate">
                {invitationTitle || 'نتشرف بحضوركم ومشاركتنا فرحتنا'}
              </span>
            </div>

            {/* Bottom event date */}
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
              className="absolute top-2 left-2 w-6 h-6 sm:w-7 sm:h-7 border-t-2 border-l-2 rounded-tl-lg pointer-events-none"
              style={{ borderColor: palette.envelopeBorder }}
            />
            <div
              className="absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 border-t-2 border-r-2 rounded-tr-lg pointer-events-none"
              style={{ borderColor: palette.envelopeBorder }}
            />
            <div
              className="absolute bottom-2 left-2 w-6 h-6 sm:w-7 sm:h-7 border-b-2 border-l-2 rounded-bl-lg pointer-events-none"
              style={{ borderColor: palette.envelopeBorder }}
            />
            <div
              className="absolute bottom-2 right-2 w-6 h-6 sm:w-7 sm:h-7 border-b-2 border-r-2 rounded-br-lg pointer-events-none"
              style={{ borderColor: palette.envelopeBorder }}
            />

            {/* Envelope Bottom Pocket Triangle Fold */}
            <div
              className={`absolute inset-x-0 bottom-0 border-t ${
                isPreview ? 'h-26 min-[360px]:h-28' : 'h-32 sm:h-38'
              }`}
              style={{
                clipPath: 'polygon(0 100%, 100% 100%, 50% 22%)',
                background: palette.envelopeBodyGradient,
                borderColor: `${palette.envelopeBorder}50`,
                filter: 'brightness(0.92)',
              }}
            />
            {/* Left Pocket Triangle */}
            <div
              className="absolute inset-y-0 left-0 w-28 sm:w-40"
              style={{
                clipPath: 'polygon(0 0, 0 100%, 100% 50%)',
                background: palette.envelopeBodyGradient,
                filter: 'brightness(0.96)',
              }}
            />
            {/* Right Pocket Triangle */}
            <div
              className="absolute inset-y-0 right-0 w-28 sm:w-40"
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 0 50%)',
                background: palette.envelopeBodyGradient,
                filter: 'brightness(0.96)',
              }}
            />
          </div>

          {/* 3. Envelope Top Flap with 3D Flip Action */}
          <div
            className={`absolute inset-x-0 top-0 pointer-events-none ${
              isPreview ? 'h-[92px] min-[360px]:h-[100px]' : 'h-[110px] sm:h-[135px]'
            }`}
            style={{
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              WebkitTransformStyle: 'preserve-3d',
              transform: isFlapOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
              transition: 'transform 480ms cubic-bezier(0.25, 1, 0.5, 1)',
              zIndex: openStage === 'closed' || openStage === 'flap_open' ? 40 : 20,
            }}
          >
            {/* Front of Flap (Face shown when closed) */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(1px)',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.35))',
              }}
            >
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 300 130"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="envelopeFlapFrontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={palette.flapColor} />
                    <stop offset="65%" stopColor={palette.envelopeBody} />
                    <stop offset="100%" stopColor={palette.flapLiningBg} />
                  </linearGradient>
                </defs>
                {/* Main Flap Body with Smooth Rounded Corners and Gold Border */}
                <path
                  d="M 1,16 C 1,7.5 7.5,1 16,1 L 284,1 C 292.5,1 299,7.5 299,16 L 156,122 Q 150,128 144,122 L 1,16 Z"
                  fill="url(#envelopeFlapFrontGrad)"
                  stroke={palette.envelopeBorder}
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Luxury Gold Foil Accent Stitching */}
                <path
                  d="M 16,10 L 284,10 L 154,113 Q 150,117 146,113 L 16,10"
                  fill="none"
                  stroke={palette.envelopeBorder}
                  strokeWidth="1.2"
                  strokeOpacity="0.5"
                  strokeDasharray="4 3"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            {/* Inside of Flap (Revealed when opened 180deg) */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg) translateZ(1px)',
                filter: 'drop-shadow(0 -4px 6px rgba(0,0,0,0.3))',
              }}
            >
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 300 130"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="envelopeFlapBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={palette.flapLiningBg} />
                    <stop offset="100%" stopColor={palette.envelopeBody} />
                  </linearGradient>
                </defs>
                {/* Inside Flap Surface */}
                <path
                  d="M 1,16 C 1,7.5 7.5,1 16,1 L 284,1 C 292.5,1 299,7.5 299,16 L 156,122 Q 150,128 144,122 L 1,16 Z"
                  fill="url(#envelopeFlapBackGrad)"
                  stroke={palette.envelopeBorder}
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Luxury Royal Lining Inlay */}
                <path
                  d="M 18,12 L 282,12 L 154,112 Q 150,116 146,112 L 18,12 Z"
                  fill={`${palette.envelopeBorder}14`}
                  stroke={palette.envelopeBorder}
                  strokeWidth="1.2"
                  strokeOpacity="0.55"
                  strokeDasharray="4 2"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Symmetrical Royal Wedding Crest Motif at Center */}
                <path
                  d="M 150,40 L 154,48 L 163,49 L 156,55 L 158,64 L 150,59 L 142,64 L 144,55 L 137,49 L 146,48 Z"
                  fill={palette.envelopeBorder}
                  opacity="0.75"
                />
              </svg>
            </div>
          </div>

          {/* 4. Luxury 3D Wax Seal Stamp (ختم الشمع الملكي) */}
          <div
            role="button"
            tabIndex={0}
            aria-label="ختم الشمع الملكي"
            onClick={handleUserAction}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleUserAction(e);
            }}
            className={`absolute top-[48%] sm:top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 cursor-pointer transition-all ${
              isFlapOpen
                ? 'opacity-0 scale-50 -translate-y-6 pointer-events-none'
                : 'opacity-100 scale-100 hover:scale-105 active:scale-95'
            }`}
            style={{ transitionDuration: '300ms' }}
          >
            {/* Satin Ribbon Tails cascading down */}
            <div className="absolute top-[80%] left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 pointer-events-none -z-10">
              <div
                className={`shadow-md transform -rotate-12 origin-top ${
                  isPreview ? 'w-2 h-6 min-[360px]:h-7' : 'w-2.5 sm:w-3 h-8 sm:h-10'
                }`}
                style={{
                  background: palette.ribbonBg,
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
                }}
              />
              <div
                className={`shadow-md transform rotate-12 origin-top ${
                  isPreview ? 'w-2 h-6 min-[360px]:h-7' : 'w-2.5 sm:w-3 h-8 sm:h-10'
                }`}
                style={{
                  background: palette.ribbonBg,
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
                }}
              />
            </div>

            {/* Wax Seal Circle Stamp */}
            <div
              className={`relative rounded-full flex items-center justify-center transition-transform shadow-xl ${
                isPreview
                  ? 'w-14 h-14 min-[360px]:w-16 min-[360px]:h-16'
                  : 'w-18 h-18 sm:w-24 sm:h-24'
              }`}
              style={{
                background: palette.sealBg,
                border: `2px solid ${palette.sealBorder}`,
                boxShadow: palette.sealShadow,
              }}
            >
              {/* Organic Melted Wax Outer Rings */}
              <div
                className="absolute inset-1 rounded-full border border-dashed opacity-75"
                style={{ borderColor: palette.sealIconColor }}
              />
              <div
                className="absolute inset-2 rounded-full border opacity-50"
                style={{ borderColor: palette.sealIconColor }}
              />

              {/* Wax Seal Center Embossed Icon & Monogram */}
              <div className="flex flex-col items-center justify-center space-y-0.5">
                {waxSealMonogram ? (
                  <span
                    className={`font-black font-cairo tracking-widest drop-shadow-md ${
                      isPreview ? 'text-xs min-[360px]:text-sm' : 'text-sm sm:text-xl'
                    }`}
                    style={{ color: palette.sealIconColor }}
                  >
                    {waxSealMonogram}
                  </span>
                ) : (
                  <>
                    <Crown
                      className={`${isPreview ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-5 sm:h-5'} drop-shadow-sm`}
                      style={{ color: palette.sealIconColor }}
                    />
                    <Heart
                      className={`${isPreview ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-4.5 sm:h-4.5'} drop-shadow-sm fill-current`}
                      style={{ color: palette.sealIconColor }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Open Button with Gold Shimmer & Music Cue */}
        <div
          className={`w-full mx-auto px-2 ${
            isPreview
              ? 'max-w-[280px] min-[360px]:max-w-[300px] space-y-1.5 pt-0.5'
              : 'max-w-[min(92vw,360px)] sm:max-w-md space-y-2 pt-1'
          }`}
        >
          {/* Main Luxury "اضغط" Button */}
          <button
            type="button"
            onClick={handleUserAction}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleUserAction(e);
            }}
            disabled={openStage === 'revealing'}
            className={`relative group overflow-hidden w-full rounded-full font-black flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 transform active:scale-[0.98] cursor-pointer ring-2 ring-amber-400/60 ring-offset-2 ring-offset-black/50 ${
              isPreview
                ? 'py-2.5 px-3 text-xs'
                : 'py-3 sm:py-3.5 px-4 sm:px-8 text-xs min-[360px]:text-sm sm:text-base'
            }`}
            style={{
              background: palette.buttonBg,
              color: palette.buttonText,
              border: `1.5px solid ${palette.buttonBorder}`,
              boxShadow: palette.buttonShadow,
            }}
          >
            {/* Continuous Shimmer Light Sweep Effect */}
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-gold-shimmer pointer-events-none" />

            <Crown className={`${isPreview ? 'w-3.5 h-3.5' : 'w-4 h-4 sm:w-5 sm:h-5'} shrink-0 drop-shadow-sm`} />
            <span className="tracking-wide">
              {openStage === 'closed'
                ? 'اضغط لفض الختم وفتح الدعوة الملكية 💌'
                : 'جاري فتح الدعوة الملكية... ✨'}
            </span>
            <Heart className={`${isPreview ? 'w-3 h-3' : 'w-3.5 h-3.5'} shrink-0 fill-current opacity-80`} />
          </button>

          {/* Calming Music Cue Hint (NO SPINNING/BOUNCING) */}
          <div
            className={`flex items-center justify-center gap-1 font-semibold ${
              isPreview ? 'text-[10px]' : 'text-[11px] sm:text-xs'
            } ${isDark ? 'text-amber-300/80' : 'text-stone-600'}`}
          >
            <Music className={`${isPreview ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-amber-500 shrink-0`} />
            <span>(يبدأ عزف الموسيقى الهادئة فور فض الختم ✨)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
