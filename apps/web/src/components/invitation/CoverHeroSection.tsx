'use client';

import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface CoverHeroSectionProps {
  coverImageUrl?: string | null;
  invitationTitle?: string;
  invitationType?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export function CoverHeroSection({
  coverImageUrl,
  invitationTitle,
  invitationType = 'wedding',
  primaryColor = '#720925',
  secondaryColor = '#D4AF37',
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
    <section className="relative text-center pt-8 pb-4 px-4 max-w-4xl mx-auto space-y-6">
      {/* Cover Image banner if provided and loaded successfully */}
      {hasValidCover && (
        <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-3xl overflow-hidden shadow-xl mb-6">
          <img
            src={coverImageUrl!}
            alt={invitationTitle || 'غلاف الدعوة'}
            className="w-full h-full object-cover"
            loading="eager"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 inset-x-0 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-bold shadow-lg">
              {getBadgeText(invitationType)}
            </span>
          </div>
        </div>
      )}

      {/* Bismillah & Ornamentation */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <span className="text-xl sm:text-2xl lg:text-3xl text-stone-800 font-amiri font-bold tracking-wider">
          بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
        </span>

        {!hasValidCover && (
          <span className="inline-block px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold shadow-xs">
            {getBadgeText(invitationType)}
          </span>
        )}

        <div className="flex items-center gap-3 pt-1">
          <div className="w-12 sm:w-16 h-px" style={{ backgroundColor: secondaryColor }} />
          <Heart className="w-4 h-4 animate-pulse" style={{ fill: primaryColor, color: primaryColor }} />
          <div className="w-12 sm:w-16 h-px" style={{ backgroundColor: secondaryColor }} />
        </div>
      </div>
    </section>
  );
}
