'use client';

import React, { useState } from 'react';
import { Mail, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EnvelopeScreenProps {
  coupleNames: string;
  onOpen: () => void;
  isOpen: boolean;
  primaryColor?: string;
  themeSlug?: string;
}

export function EnvelopeScreen({
  coupleNames,
  onOpen,
  isOpen,
  primaryColor = '#720925',
  themeSlug = 'royal-burgundy',
}: EnvelopeScreenProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  if (isOpen) return null;

  const handleOpenClick = () => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      onOpen();
      return;
    }

    setIsAnimating(true);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#720925', '#FAF7F2'],
      });
    } catch (e) {
      // safe fallback
    }

    setTimeout(() => {
      onOpen();
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#FAF7F2] transition-opacity duration-500 motion-reduce:transition-none ${
        isAnimating ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: 'radial-gradient(#d4af37 0.75px, #FAF7F2 0.75px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="relative w-full max-w-md mx-auto text-center space-y-8">
        {/* Top welcome text */}
        <div className="space-y-2 animate-fade-in-up motion-reduce:animate-none">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            إلى من يهمهم فرحتنا ❤️
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 font-cairo">
            دعوة خاصة لحضور فرحتنا
          </h2>
          <p className="text-stone-600 text-base font-amiri font-bold">{coupleNames || 'العروسين'}</p>
        </div>

        {/* Realistic Envelope Graphic */}
        <div className="relative mx-auto w-72 sm:w-80 h-48 sm:h-52 bg-[#F3ECE1] border-2 border-stone-300 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Envelope Flap Triangles */}
          <div
            className="absolute inset-x-0 top-0 h-28 bg-[#EAE1D3] border-b border-stone-300 transition-transform origin-top duration-500 motion-reduce:transition-none"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              transform: isAnimating ? 'rotateX(180deg)' : 'none',
            }}
          />

          {/* Central Wax Seal / Heart Stamp */}
          <div className="relative z-10">
            <button
              type="button"
              onClick={handleOpenClick}
              disabled={isAnimating}
              className="group w-20 h-20 rounded-full shadow-xl flex flex-col items-center justify-center text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer motion-reduce:hover:scale-100"
              style={{ backgroundColor: primaryColor }}
              aria-label="افتح الدعوة"
            >
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-300/80 flex flex-col items-center justify-center">
                <Heart className="w-6 h-6 fill-amber-300 text-amber-300 group-hover:scale-125 transition-transform motion-reduce:group-hover:scale-100" />
                <span className="text-[10px] font-black tracking-wider text-amber-200 mt-0.5">افتح</span>
              </div>
            </button>
          </div>

          {/* Bottom Envelope Shadows */}
          <div
            className="absolute inset-x-0 bottom-0 h-28 bg-[#E6DDD0] pointer-events-none"
            style={{
              clipPath: 'polygon(0 100%, 100% 100%, 50% 20%)',
            }}
          />
        </div>

        {/* CTA prompt button */}
        <div className="pt-2 animate-bounce motion-reduce:animate-none">
          <button
            type="button"
            onClick={handleOpenClick}
            disabled={isAnimating}
            className="px-8 py-3.5 rounded-full font-black text-sm text-white shadow-xl hover:opacity-95 transition-all cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
            انقر هنا لفتح الدعوة 💌
          </button>
          <p className="text-[11px] text-stone-500 mt-2 font-medium">
            (يمكنك الاستماع للموسيقى الهادئة فور فتح الظرف)
          </p>
        </div>
      </div>
    </div>
  );
}
