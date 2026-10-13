'use client';

import React, { useState } from 'react';
import { Sparkles, Heart, Crown, Music } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatArabicDate } from '@/lib/date';

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
    backgroundColor &&
      ['#0', '#1', '#2', 'black'].some((p) => backgroundColor.toLowerCase().startsWith(p))
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

    // Multi-stage golden celebratory confetti burst
    try {
      // 1. Initial burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: [secondaryColor || '#D4AF37', '#FFD700', primaryColor || '#720925', '#FFFFFF'],
      });

      // 2. Secondary wider shower after 300ms
      setTimeout(() => {
        confetti({
          particleCount: 70,
          angle: 60,
          spread: 80,
          origin: { x: 0.2, y: 0.6 },
          colors: [secondaryColor || '#D4AF37', '#FFF8DC', primaryColor || '#720925'],
        });
        confetti({
          particleCount: 70,
          angle: 120,
          spread: 80,
          origin: { x: 0.8, y: 0.6 },
          colors: [secondaryColor || '#D4AF37', '#FFF8DC', primaryColor || '#720925'],
        });
      }, 350);
    } catch (e) {
      // safe fallback
    }

    // Give time for letter to slide upward gracefully before unveiling full page
    setTimeout(() => {
      onOpen();
    }, 1100);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 transition-all duration-700 select-none ${
        isOpening ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundColor: backgroundColor || '#FAF7F2',
        backgroundImage: `radial-gradient(${secondaryColor || '#d4af37'} 1px, transparent 1px), radial-gradient(${secondaryColor || '#d4af37'} 1px, ${backgroundColor || '#FAF7F2'} 1px)`,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 20px 20px',
      }}
    >
      {/* Background Royal Ambient Glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none -z-10 animate-pulse"
        style={{ backgroundColor: primaryColor }}
      />
      <div
        className="absolute w-[350px] h-[350px] rounded-full blur-2xl opacity-25 pointer-events-none -z-10"
        style={{ backgroundColor: secondaryColor }}
      />

      <div className="relative w-full max-w-lg mx-auto text-center space-y-6 sm:space-y-8">
        {/* Header Ribbon / Greetings */}
        <div className="space-y-2 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span
              className="text-xs sm:text-sm font-black font-cairo"
              style={{ color: isDark ? '#F5E6C8' : '#78350F' }}
            >
              دعوة خاصة وفرحة لا تكتمل إلا بوجودكم ❤️
            </span>
            <Crown className="w-3.5 h-3.5 text-amber-500" />
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-black font-cairo tracking-tight"
            style={{ color: isDark ? '#FFFFFF' : '#1A1819' }}
          >
            {coupleNames || 'العروسين'}
          </h1>

          <p
            className="text-xs sm:text-sm font-amiri font-bold text-amber-800/90 dark:text-amber-200"
            style={{ color: secondaryColor }}
          >
            {invitationTitle || 'يسعدنا ويشرفنا حضوركم ومشاركتنا ليلة العمر'}
          </p>
        </div>

        {/* 3D Envelope Perspective Container */}
        <div
          className="relative mx-auto w-[310px] sm:w-[380px] h-[220px] sm:h-[260px] perspective-[1200px] cursor-pointer group"
          onClick={handleOpenClick}
          role="button"
          tabIndex={0}
          aria-label="افتح الظرف الملكي"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleOpenClick();
          }}
        >
          {/* 1. Inner Card / Letter that SLIDES UP out of envelope when opened */}
          <div
            className={`absolute inset-x-3 bottom-2 h-[200px] sm:h-[235px] rounded-2xl bg-[#FCFAF6] border border-amber-300/80 shadow-lg p-5 sm:p-6 flex flex-col justify-between text-center transition-all duration-700 ease-out z-20 ${
              isFlipped ? '-translate-y-28 sm:-translate-y-36 scale-105 shadow-2xl rotate-0' : 'translate-y-0 opacity-95'
            }`}
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(253,248,237,0.85))',
            }}
          >
            {/* Top Ornamental Bismillah / Verse Excerpt */}
            {verseExcerpt ? (
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs text-amber-800 font-amiri font-bold tracking-widest block opacity-75">
                  ﷽
                </span>
                <p className="text-[11px] sm:text-xs text-stone-700 font-amiri font-bold leading-relaxed line-clamp-2 px-1">
                  «{verseExcerpt}»
                </p>
              </div>
            ) : (
              <div className="py-1">
                <span className="text-xs text-amber-800/80 font-amiri font-bold tracking-widest block">
                  ✨ دعوة خاصة لحضور حفل الزفاف ✨
                </span>
              </div>
            )}

            {/* Couple names on the card */}
            <div className="py-1 border-y border-amber-200/60 my-auto">
              <span className="text-base sm:text-lg font-black font-cairo text-[#720925]">
                {coupleNames}
              </span>
            </div>

            {/* Bottom event date */}
            {formattedDate && (
              <span className="text-[10px] sm:text-[11px] text-stone-500 font-cairo font-bold">
                📅 {formattedDate}
              </span>
            )}
          </div>

          {/* 2. Main Envelope Pocket Body */}
          <div className="absolute inset-0 rounded-3xl bg-[#F5EFEB] border-2 border-stone-300/90 shadow-2xl overflow-hidden z-30 pointer-events-none">
            {/* Fine luxury linen texture background */}
            <div className="absolute inset-0 bg-linear-to-b from-stone-100/50 via-[#F3ECE1] to-[#EAE1D3]" />

            {/* Subtle Gold Foil Corner Arabesque Lines */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/60 rounded-tl-xl pointer-events-none" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/60 rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/60 rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/60 rounded-br-xl pointer-events-none" />

            {/* Envelope Bottom Pocket Triangle Folds */}
            <div
              className="absolute inset-x-0 bottom-0 h-36 sm:h-40 bg-[#E8DFCFA0] border-t border-stone-300/60"
              style={{
                clipPath: 'polygon(0 100%, 100% 100%, 50% 20%)',
              }}
            />
            <div
              className="absolute inset-y-0 left-0 w-36 sm:w-44 bg-[#E2D8C780]"
              style={{
                clipPath: 'polygon(0 0, 0 100%, 100% 50%)',
              }}
            />
            <div
              className="absolute inset-y-0 right-0 w-36 sm:w-44 bg-[#E2D8C780]"
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 0 50%)',
              }}
            />
          </div>

          {/* 3. Envelope Top Flap with 3D Flip Action */}
          <div
            className={`absolute inset-x-0 top-0 h-32 sm:h-36 transition-transform duration-700 ease-in-out origin-top z-40 ${
              isFlipped ? 'rotate-x-180 -translate-y-2' : 'rotate-x-0'
            }`}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Front of Flap (Face shown when closed) */}
            <div
              className="absolute inset-0 bg-[#EAE0D1] border-b-2 border-stone-300/90 shadow-md"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
            >
              {/* Flap gold foil trim line */}
              <div
                className="absolute inset-x-4 top-2 h-24"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.25))',
                }}
              />
            </div>
          </div>

          {/* 4. Luxury 3D Wax Seal Stamp (ختم الشمع الملكي) */}
          <div
            className={`absolute top-[48%] sm:top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
              isFlipped ? 'opacity-0 scale-50 -translate-y-16 pointer-events-none' : 'opacity-100 scale-100 group-hover:scale-110'
            }`}
          >
            <div
              className="relative w-22 h-22 sm:w-26 sm:h-26 rounded-full flex items-center justify-center shadow-2xl transition-transform"
              style={{
                backgroundColor: primaryColor || '#720925',
                boxShadow: `0 12px 28px -4px rgba(0,0,0,0.5), 0 0 20px ${secondaryColor || '#D4AF37'}60, inset 0 3px 6px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(0,0,0,0.6)`,
              }}
            >
              {/* Organic Melted Wax Outer Rings */}
              <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-amber-300/70" />
              <div className="absolute inset-3 rounded-full border border-amber-400/40" />

              {/* Wax Seal Center Embossed Icon */}
              <div className="flex flex-col items-center justify-center space-y-0.5">
                <Heart className="w-7 h-7 sm:w-8 sm:h-8 fill-amber-300 text-amber-200 drop-shadow-md animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-black text-amber-200 tracking-wider font-cairo">
                  افتح الدعوة
                </span>
              </div>

              {/* Shimmer Sparkle Indicator on the Wax Seal */}
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center shadow-md animate-bounce">
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
            className="group inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-full font-black text-sm sm:text-base text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 10px 25px -5px ${primaryColor}60`,
            }}
          >
            <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-45 transition-transform" />
            <span>اضغط لفض الختم وفتح الدعوة الملكية 💌</span>
          </button>

          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-stone-500">
            <Music className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            <span>(يبدأ عزف الموسيقى الهادئة فور فتح الظرف)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
