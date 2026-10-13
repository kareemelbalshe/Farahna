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
}

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
}: EnvelopeScreenProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  if (isOpen) return null;

  const isDark = Boolean(
    (backgroundColor &&
      ['#0', '#1', '#2', 'black'].some((p) => backgroundColor.toLowerCase().startsWith(p))) ||
      themeSlug === 'elegant-gold'
  );

  const formattedDate = eventDate ? formatArabicDate(eventDate) : '';

  // Extract first 120 chars of Quranic verse or message for the preview card
  const verseExcerpt =
    weddingMessageAr && weddingMessageAr.trim()
      ? weddingMessageAr.split('\n')[0].replace(/^«|»$/g, '').trim()
      : '';

  const handleOpenClick = () => {
    if (isOpening) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      onOpen();
      return;
    }

    setIsOpening(true);
    setIsFlipped(true);

    // 🎵 Trigger the authentic instant Web Audio melodic signature
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
      // safe fallback
    }

    // ✨ Multi-stage golden celebratory confetti burst
    try {
      // 1. Initial burst
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 },
        colors: [secondaryColor || '#D4AF37', '#FFD700', '#F5D77F', primaryColor || '#720925', '#FFFFFF'],
      });

      // 2. Secondary wider shower after 350ms
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 85,
          origin: { x: 0.15, y: 0.6 },
          colors: [secondaryColor || '#D4AF37', '#FFD700', '#FFF8DC', primaryColor || '#720925'],
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 85,
          origin: { x: 0.85, y: 0.6 },
          colors: [secondaryColor || '#D4AF37', '#FFD700', '#FFF8DC', primaryColor || '#720925'],
        });
      }, 350);
    } catch (e) {
      // safe fallback
    }

    // Give time for envelope flap to rotate and letter to slide upward gracefully before unveiling full page
    setTimeout(() => {
      onOpen();
    }, 1300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 transition-all duration-700 select-none overflow-hidden ${
        isOpening ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: isDark ? '#0D0D10' : backgroundColor || '#FAF7F2',
        backgroundImage: isDark
          ? 'radial-gradient(circle at 50% 35%, rgba(212, 175, 55, 0.18) 0%, rgba(13, 13, 16, 0.98) 70%)'
          : `radial-gradient(${secondaryColor || '#d4af37'} 1px, transparent 1px), radial-gradient(${secondaryColor || '#d4af37'} 1px, ${backgroundColor || '#FAF7F2'} 1px)`,
        backgroundSize: isDark ? '100% 100%' : '40px 40px',
        backgroundPosition: '0 0, 20px 20px',
      }}
    >
      {/* Background Royal Ambient Glow Orbs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-25 pointer-events-none -z-10 animate-pulse"
        style={{ backgroundColor: primaryColor || '#D4AF37' }}
      />
      <div
        className="absolute w-[350px] h-[350px] rounded-full blur-2xl opacity-30 pointer-events-none -z-10"
        style={{ backgroundColor: secondaryColor || '#F5D77F' }}
      />

      <div className="relative w-full max-w-lg mx-auto text-center space-y-5 sm:space-y-7">
        {/* Header Ribbon / Greetings */}
        <div className="space-y-2 animate-fade-in-up">
          <div
            className={`inline-flex items-center gap-2 px-5 py-1.5 rounded-full border shadow-lg backdrop-blur-md ${
              isDark
                ? 'bg-black/50 border-amber-400/40 text-amber-200'
                : 'bg-white/80 border-amber-300/80 text-amber-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="text-xs sm:text-sm font-black font-cairo">
              دعوة خاصة وفرحة لا تكتمل إلا بوجودكم ❤️
            </span>
            <Crown className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <h1
            className="text-3xl sm:text-5xl font-black font-cairo tracking-tight drop-shadow-md"
            style={{ color: isDark ? '#FFFFFF' : '#1A1819' }}
          >
            {coupleNames || 'العروسين'}
          </h1>

          <p
            className="text-xs sm:text-sm font-amiri font-bold tracking-wide"
            style={{ color: secondaryColor || '#D4AF37' }}
          >
            {invitationTitle || 'يسعدنا ويشرفنا حضوركم ومشاركتنا ليلة العمر'}
          </p>
        </div>

        {/* 3D Envelope Perspective Container */}
        <div
          className="relative mx-auto w-[310px] sm:w-[400px] h-[220px] sm:h-[265px] cursor-pointer group"
          style={{ perspective: '1200px' }}
          onClick={handleOpenClick}
          role="button"
          tabIndex={0}
          aria-label="افتح الظرف الملكي"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleOpenClick();
          }}
        >
          {/* 1. Inner Card / Letter that SLIDES UP gracefully out of envelope pocket */}
          <div
            className={`absolute inset-x-3 bottom-2 h-[200px] sm:h-[240px] rounded-2xl border shadow-xl p-5 sm:p-6 flex flex-col justify-between text-center transition-all duration-800 ease-out z-25 ${
              isFlipped
                ? '-translate-y-32 sm:-translate-y-44 scale-105 shadow-2xl rotate-0'
                : 'translate-y-0 opacity-95'
            }`}
            style={{
              backgroundColor: isDark ? '#FFFDF8' : '#FCFAF6',
              borderColor: isDark ? '#D4AF37' : '#F5D77F',
              boxShadow: isFlipped
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(212, 175, 55, 0.35)'
                : '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
              backgroundImage:
                'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(253, 248, 237, 0.92))',
            }}
          >
            {/* Top Ornamental Bismillah / Verse Excerpt */}
            {verseExcerpt ? (
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs text-amber-900 font-amiri font-bold tracking-widest block opacity-80">
                  ﷽
                </span>
                <p className="text-[11px] sm:text-xs text-stone-800 font-amiri font-bold leading-relaxed line-clamp-2 px-1">
                  «{verseExcerpt}»
                </p>
              </div>
            ) : (
              <div className="py-1">
                <span className="text-xs text-amber-900 font-amiri font-bold tracking-widest block">
                  ✨ دعوة خاصة ومباركة لحضور الحفل ✨
                </span>
              </div>
            )}

            {/* Couple names on the card */}
            <div className="py-1.5 border-y border-amber-300/70 my-auto">
              <span
                className="text-lg sm:text-xl font-black font-cairo block"
                style={{ color: '#720925' }}
              >
                {coupleNames}
              </span>
              <span className="text-[10px] sm:text-[11px] font-amiri font-bold text-amber-800 block mt-0.5">
                {invitationTitle || 'نتشرف بحضوركم ومشاركتنا فرحتنا'}
              </span>
            </div>

            {/* Bottom event date */}
            {formattedDate && (
              <span className="text-[10px] sm:text-[11px] text-stone-600 font-cairo font-bold">
                📅 {formattedDate}
              </span>
            )}
          </div>

          {/* 2. Main Envelope Pocket Body */}
          <div
            className={`absolute inset-0 rounded-3xl border-2 shadow-2xl overflow-hidden z-30 pointer-events-none transition-colors ${
              isDark
                ? 'bg-[#18181D] border-amber-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
                : 'bg-[#F5EFEB] border-stone-300/90 shadow-2xl'
            }`}
          >
            {/* Background Texture */}
            <div
              className={`absolute inset-0 ${
                isDark
                  ? 'bg-gradient-to-b from-[#1C1C24] via-[#16161C] to-[#101014]'
                  : 'bg-gradient-to-b from-stone-100/50 via-[#F3ECE1] to-[#EAE1D3]'
              }`}
            />

            {/* Subtle Gold Foil Corner Arabesque Accents */}
            <div
              className={`absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 rounded-tl-xl pointer-events-none ${
                isDark ? 'border-amber-400/80' : 'border-amber-400/60'
              }`}
            />
            <div
              className={`absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 rounded-tr-xl pointer-events-none ${
                isDark ? 'border-amber-400/80' : 'border-amber-400/60'
              }`}
            />
            <div
              className={`absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 rounded-bl-xl pointer-events-none ${
                isDark ? 'border-amber-400/80' : 'border-amber-400/60'
              }`}
            />
            <div
              className={`absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 rounded-br-xl pointer-events-none ${
                isDark ? 'border-amber-400/80' : 'border-amber-400/60'
              }`}
            />

            {/* Envelope Bottom Pocket Triangle Folds */}
            <div
              className={`absolute inset-x-0 bottom-0 h-36 sm:h-40 border-t ${
                isDark
                  ? 'bg-[#121217] border-amber-400/30'
                  : 'bg-[#E8DFCFA0] border-stone-300/60'
              }`}
              style={{
                clipPath: 'polygon(0 100%, 100% 100%, 50% 20%)',
              }}
            />
            <div
              className={`absolute inset-y-0 left-0 w-36 sm:w-44 ${
                isDark ? 'bg-[#15151A]' : 'bg-[#E2D8C780]'
              }`}
              style={{
                clipPath: 'polygon(0 0, 0 100%, 100% 50%)',
              }}
            />
            <div
              className={`absolute inset-y-0 right-0 w-36 sm:w-44 ${
                isDark ? 'bg-[#15151A]' : 'bg-[#E2D8C780]'
              }`}
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 0 50%)',
              }}
            />
          </div>

          {/* 3. Envelope Top Flap with Authentic 3D Flip Action */}
          <div
            className="absolute inset-x-0 top-0 h-32 sm:h-38 transition-transform ease-in-out pointer-events-none"
            style={{
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)',
              transitionDuration: '850ms',
              zIndex: isFlipped ? 15 : 40,
            }}
          >
            {/* Front of Flap (Face shown when closed) */}
            <div
              className={`absolute inset-0 shadow-lg border-b-2 ${
                isDark
                  ? 'bg-[#1D1D24] border-amber-400/60'
                  : 'bg-[#EAE0D1] border-stone-300/90'
              }`}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Flap Gold Foil Trim Line */}
              <div
                className="absolute inset-x-4 top-2 h-26"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  background: isDark
                    ? 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.45))'
                    : 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.25))',
                }}
              />
            </div>

            {/* Inside of Flap (Face revealed when flipped open 180deg) */}
            <div
              className={`absolute inset-0 ${
                isDark ? 'bg-[#141418] border-t border-amber-400/40' : 'bg-[#E2D8C7]'
              }`}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                transform: 'rotateY(180deg) rotateZ(180deg)',
                backfaceVisibility: 'hidden',
              }}
            />
          </div>

          {/* 4. Luxury 3D Wax Seal Stamp (ختم الشمع الملكي) */}
          <div
            className={`absolute top-[48%] sm:top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
              isFlipped
                ? 'opacity-0 scale-50 -translate-y-16 pointer-events-none'
                : 'opacity-100 scale-100 group-hover:scale-110'
            }`}
          >
            <div
              className="relative w-22 h-22 sm:w-26 sm:h-26 rounded-full flex items-center justify-center shadow-2xl transition-transform"
              style={{
                backgroundColor: isDark ? '#D4AF37' : primaryColor || '#720925',
                backgroundImage: isDark
                  ? 'radial-gradient(circle at 35% 35%, #F5D77F 0%, #D4AF37 50%, #997A15 100%)'
                  : `radial-gradient(circle at 35% 35%, #9C1C3F 0%, ${primaryColor || '#720925'} 55%, #420514 100%)`,
                boxShadow: isDark
                  ? '0 12px 30px -4px rgba(0,0,0,0.8), 0 0 25px rgba(212, 175, 55, 0.7), inset 0 3px 6px rgba(255,255,255,0.6), inset 0 -4px 8px rgba(0,0,0,0.5)'
                  : `0 12px 28px -4px rgba(0,0,0,0.5), 0 0 20px ${secondaryColor || '#D4AF37'}60, inset 0 3px 6px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(0,0,0,0.6)`,
              }}
            >
              {/* Organic Melted Wax Outer Rings */}
              <div
                className={`absolute inset-1.5 rounded-full border-2 border-dashed ${
                  isDark ? 'border-stone-900/40' : 'border-amber-300/70'
                }`}
              />
              <div
                className={`absolute inset-3 rounded-full border ${
                  isDark ? 'border-amber-100/50' : 'border-amber-400/40'
                }`}
              />

              {/* Wax Seal Center Embossed Icon */}
              <div className="flex flex-col items-center justify-center space-y-0.5">
                <Heart
                  className={`w-7 h-7 sm:w-8 sm:h-8 drop-shadow-md animate-pulse ${
                    isDark ? 'fill-stone-950 text-stone-900' : 'fill-amber-300 text-amber-200'
                  }`}
                />
                <span
                  className={`text-[10px] sm:text-[11px] font-black tracking-wider font-cairo ${
                    isDark ? 'text-stone-950' : 'text-amber-200'
                  }`}
                >
                  افتح الدعوة
                </span>
              </div>

              {/* Shimmer Sparkle Indicator on the Wax Seal */}
              <div
                className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-bounce ${
                  isDark ? 'bg-amber-100 text-stone-950' : 'bg-amber-400 text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Open Button with Music Cue */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleOpenClick}
            disabled={isOpening}
            className={`group inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-full font-black text-sm sm:text-base shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer ${
              isDark
                ? 'bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#D4AF37] text-stone-950 hover:shadow-[0_0_35px_rgba(212,175,55,0.6)]'
                : 'text-white hover:shadow-2xl'
            }`}
            style={{
              backgroundColor: isDark ? undefined : primaryColor || '#720925',
              boxShadow: isDark
                ? '0 12px 30px -5px rgba(212, 175, 55, 0.4)'
                : `0 10px 25px -5px ${primaryColor || '#720925'}60`,
            }}
          >
            <Sparkles
              className={`w-5 h-5 group-hover:rotate-45 transition-transform ${
                isDark ? 'text-stone-950' : 'text-amber-300'
              }`}
            />
            <span>اضغط لفض الختم وفتح الدعوة الملكية 💌</span>
          </button>

          <div
            className={`flex items-center justify-center gap-2 text-xs font-semibold ${
              isDark ? 'text-amber-300/80' : 'text-stone-500'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
            <span>(يبدأ عزف الموسيقى الهادئة فور فض الختم ✨)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
