import React from 'react';
import { Heart } from 'lucide-react';

interface CouplePhotoSectionProps {
  coupleImageUrl?: string | null;
  coupleNames: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export function CouplePhotoSection({
  coupleImageUrl,
  coupleNames,
  primaryColor = '#720925',
  secondaryColor = '#D4AF37',
}: CouplePhotoSectionProps) {
  if (!coupleImageUrl) return null;

  return (
    <section className="py-8 px-4 max-w-xl mx-auto text-center space-y-4">
      <div className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 rounded-full p-2.5 shadow-2xl border-4" style={{ borderColor: secondaryColor }}>
        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-inner">
          <img
            src={coupleImageUrl}
            alt={`صورة ${coupleNames}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Floating Heart Badge */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white"
          style={{ backgroundColor: primaryColor }}
        >
          <Heart className="w-5 h-5 fill-current" />
        </div>
      </div>

      <p className="text-xs sm:text-sm font-amiri font-bold text-stone-600">
        "بارك الله لهما وبارك عليهما وجمع بينهما في خير"
      </p>
    </section>
  );
}
