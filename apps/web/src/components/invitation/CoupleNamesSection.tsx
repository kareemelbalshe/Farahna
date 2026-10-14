import React from 'react';

interface CoupleNamesSectionProps {
  coupleGroomAr?: string | null;
  coupleBrideAr?: string | null;
  coupleGroomEn?: string | null;
  coupleBrideEn?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  isPreview?: boolean;
}

export function CoupleNamesSection({
  coupleGroomAr,
  coupleBrideAr,
  coupleGroomEn,
  coupleBrideEn,
  primaryColor = '#720925',
  secondaryColor = '#D4AF37',
  isPreview = false,
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
    <section className="text-center py-4 sm:py-6 px-3 sm:px-4 max-w-4xl mx-auto space-y-3 font-cairo">
      <div className="space-y-2">
        <h1
          className={`font-black tracking-tight break-words px-1 leading-snug ${
            isPreview
              ? 'text-2xl min-[360px]:text-3xl'
              : 'text-3xl sm:text-5xl lg:text-6xl'
          }`}
          style={{ color: primaryColor }}
        >
          {displayGroom && <span className="block">{displayGroom}</span>}
          {hasBoth && (
            <span
              className={`block font-amiri font-normal ${
                isPreview ? 'my-1 text-xl' : 'my-2 text-2xl sm:text-3xl'
              }`}
              style={{ color: secondaryColor }}
            >
              &amp;
            </span>
          )}
          {displayBride && <span className="block">{displayBride}</span>}
        </h1>

        {hasEn && (
          <p className="text-xs sm:text-sm font-serif tracking-widest text-stone-500 uppercase theme-muted">
            {groomEn && <span>{groomEn}</span>}
            {groomEn && brideEn && <span className="mx-1.5">&</span>}
            {brideEn && <span>{brideEn}</span>}
          </p>
        )}
      </div>
    </section>
  );
}
