import React from 'react';

interface CoupleNamesSectionProps {
  coupleGroomAr: string;
  coupleBrideAr: string;
  coupleGroomEn?: string | null;
  coupleBrideEn?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
}

export function CoupleNamesSection({
  coupleGroomAr,
  coupleBrideAr,
  coupleGroomEn,
  coupleBrideEn,
  primaryColor = '#720925',
  secondaryColor = '#D4AF37',
}: CoupleNamesSectionProps) {
  return (
    <section className="text-center py-6 px-4 max-w-4xl mx-auto space-y-4">
      <div className="space-y-3">
        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-black font-cairo tracking-tight"
          style={{ color: primaryColor }}
        >
          {coupleGroomAr}
          <span
            className="block my-2 text-2xl sm:text-4xl font-amiri font-normal"
            style={{ color: secondaryColor }}
          >
            &amp;
          </span>
          {coupleBrideAr}
        </h1>

        {(coupleGroomEn || coupleBrideEn) && (
          <p className="text-xs sm:text-sm font-serif tracking-widest text-stone-500 uppercase">
            {coupleGroomEn} {coupleGroomEn && coupleBrideEn ? '&' : ''} {coupleBrideEn}
          </p>
        )}
      </div>
    </section>
  );
}
