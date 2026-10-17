'use client';

import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface CoverHeroSectionProps {
  coverImageUrl?: string | null;
  invitationTitle?: string;
  invitationType?: string;
  primaryColor?: string;
  secondaryColor?: string;
  isPreview?: boolean;
}

export function CoverHeroSection({
  coverImageUrl,
  invitationTitle,
  invitationType = 'wedding',
  primaryColor = '#720925',
  secondaryColor = '#D4AF37',
  isPreview = false,
}: CoverHeroSectionProps) {
  const [imageError, setImageError] = useState(false);

  const getBadgeText = (type: string) => {
    switch (type) {
      case 'wedding':
        return '💍 دعوة زفاف ملكية';
      case 'henna':
        return '🌿 ليلة الحنة المصرية';
      case 'katb_ketab':
        return '📜 عقد قران وكتب كتاب';
      case 'engagement':
        return '💎 حفل خطوبة مبارك';
      default:
        return '❤️ دعوة فرح خاصة';
    }
  };

  const hasValidCover = Boolean(coverImageUrl && !imageError);

  return (
    <section
      className={`relative text-center mx-auto w-full overflow-hidden ${
        isPreview
          ? 'pt-2 pb-1 px-1.5 max-w-full space-y-2'
          : 'pt-8 pb-4 px-4 max-w-4xl space-y-6'
      }`}
    >
      {/* Cover Image banner if provided and loaded successfully */}
      {hasValidCover && (
        <div
          className={`relative w-full rounded-2xl overflow-hidden shadow-md ${
            isPreview
              ? 'h-36 min-[360px]:h-40 mb-2'
              : 'h-48 sm:h-64 md:h-80 rounded-3xl shadow-xl mb-6'
          }`}
        >
          <img
            src={coverImageUrl!}
            alt={invitationTitle || 'غلاف الدعوة'}
            className="w-full h-full object-cover"
            loading="eager"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-2.5 inset-x-0 text-center">
            <span className="inline-block px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-bold shadow-lg">
              {getBadgeText(invitationType)}
            </span>
          </div>
        </div>
      )}

      {/* Bismillah & Ornamentation */}
      <div className="flex flex-col items-center justify-center space-y-1.5 w-full">
        <span
          className={`text-stone-800 font-amiri font-bold tracking-wider theme-heading break-words px-1 ${
            isPreview ? 'text-base min-[360px]:text-lg' : 'text-xl sm:text-2xl lg:text-3xl'
          }`}
        >
          بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
        </span>

        {!hasValidCover && (
          <span className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold shadow-xs theme-badge">
            {getBadgeText(invitationType)}
          </span>
        )}

        <div className="flex items-center gap-2 pt-0.5 justify-center w-full">
          <div className={isPreview ? "w-8 h-px" : "w-12 sm:w-16 h-px"} style={{ backgroundColor: secondaryColor }} />
          <Heart className={`${isPreview ? 'w-3.5 h-3.5' : 'w-4 h-4'} animate-pulse`} style={{ fill: primaryColor, color: primaryColor }} />
          <div className={isPreview ? "w-8 h-px" : "w-12 sm:w-16 h-px"} style={{ backgroundColor: secondaryColor }} />
        </div>
      </div>
    </section>
  );
}
