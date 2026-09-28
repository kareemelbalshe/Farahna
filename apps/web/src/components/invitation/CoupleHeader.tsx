'use client';

import React from 'react';
import { Heart } from 'lucide-react';

interface CoupleHeaderProps {
  coupleGroomAr: string;
  coupleBrideAr: string;
  coupleGroomEn?: string | null;
  coupleBrideEn?: string | null;
  parentsGroomAr?: string | null;
  parentsBrideAr?: string | null;
  weddingMessageAr?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  coverImageUrl?: string | null;
}

export function CoupleHeader({
  coupleGroomAr,
  coupleBrideAr,
  coupleGroomEn,
  coupleBrideEn,
  parentsGroomAr,
  parentsBrideAr,
  weddingMessageAr,
  primaryColor = '#720925',
  secondaryColor = '#D4AF37',
  coverImageUrl,
}: CoupleHeaderProps) {
  return (
    <section className="relative text-center py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      {/* Decorative Top Bismillah or Heart */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <span className="text-xl sm:text-2xl text-stone-700 font-amiri tracking-wider">
          بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
        </span>
        <div className="flex items-center gap-3">
          <div className="w-12 h-px bg-amber-400" />
          <Heart className="w-5 h-5 fill-amber-400 text-amber-400 animate-pulse" />
          <div className="w-12 h-px bg-amber-400" />
        </div>
      </div>

      {/* Parents Honor Greeting (if provided) */}
      {(parentsGroomAr || parentsBrideAr) && (
        <div className="space-y-1.5 text-xs sm:text-sm text-stone-600 font-semibold max-w-xl mx-auto">
          {parentsGroomAr && <p>{parentsGroomAr}</p>}
          {parentsBrideAr && <p>{parentsBrideAr}</p>}
          <p className="text-[#720925] font-bold pt-1">يتشرفون بدعوة سيادتكم لحضور حفل زفاف</p>
        </div>
      )}

      {/* Couple Names (Arabic Calligraphy style) */}
      <div className="space-y-3">
        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-black font-cairo tracking-tight"
          style={{ color: primaryColor }}
        >
          {coupleGroomAr}
          <span className="block my-2 text-2xl sm:text-4xl text-amber-600 font-amiri font-normal">
            &amp;
          </span>
          {coupleBrideAr}
        </h1>

        {(coupleGroomEn || coupleBrideEn) && (
          <p className="text-xs sm:text-sm font-serif tracking-widest text-stone-400 uppercase">
            {coupleGroomEn} &amp; {coupleBrideEn}
          </p>
        )}
      </div>

      {/* Wedding Message / Verse */}
      {weddingMessageAr && (
        <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-white/70 backdrop-blur-md border border-amber-300/40 shadow-xs">
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-amiri whitespace-pre-line font-medium">
            {weddingMessageAr}
          </p>
        </div>
      )}
    </section>
  );
}
