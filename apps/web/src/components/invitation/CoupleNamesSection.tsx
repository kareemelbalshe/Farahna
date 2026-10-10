import React from 'react';

interface CoupleNamesSectionProps {
  coupleGroomAr?: string | null;
  coupleBrideAr?: string | null;
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
  const groom = coupleGroomAr?.trim() || '';
  const bride = coupleBrideAr?.trim() || '';

  // Fallback if both empty
  const displayGroom = groom || (!bride ? 'العروسين' : '');
  const displayBride = bride;
  const hasBoth = Boolean(displayGroom && displayBride);

  const groomEn = coupleGroomEn?.trim() || '';
  const brideEn = coupleBrideEn?.trim() || '';
  const hasEn = Boolean(groomEn || brideEn);

  return (
    <section className="text-center py-6 px-4 max-w-4xl mx-auto space-y-4 font-cairo">
      <div className="space-y-3">
        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight"
          style={{ color: primaryColor }}
        >
          {displayGroom && <span>{displayGroom}</span>}
          {hasBoth && (
            <span
              className="block my-2 text-2xl sm:text-4xl font-amiri font-normal"
              style={{ color: secondaryColor }}
            >
              &amp;
            </span>
          )}
          {displayBride && <span>{displayBride}</span>}
        </h1>

        {hasEn && (
          <p className="text-xs sm:text-sm font-serif tracking-widest text-stone-500 uppercase">
            {groomEn && <span>{groomEn}</span>}
            {groomEn && brideEn && <span className="mx-1.5">&</span>}
            {brideEn && <span>{brideEn}</span>}
          </p>
        )}
      </div>
    </section>
  );
}
