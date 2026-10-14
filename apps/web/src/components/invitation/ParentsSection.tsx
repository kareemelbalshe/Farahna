import React from 'react';
import { Users } from 'lucide-react';

interface ParentsSectionProps {
  parentsGroomAr?: string | null;
  parentsBrideAr?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  isPreview?: boolean;
}

export function ParentsSection({
  parentsGroomAr,
  parentsBrideAr,
  primaryColor = '#720925',
  secondaryColor = '#D4AF37',
  isPreview = false,
}: ParentsSectionProps) {
  if (!parentsGroomAr && !parentsBrideAr) return null;

  return (
    <section className={`mx-auto text-center font-cairo ${isPreview ? 'py-3 px-2 max-w-full' : 'py-8 px-4 max-w-2xl'}`}>
      <div className={`bg-white/90 backdrop-blur-md border border-stone-200 shadow-sm theme-card ${isPreview ? 'p-3.5 rounded-2xl space-y-2.5' : 'p-6 sm:p-8 rounded-3xl space-y-4'}`}>
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold theme-badge mx-auto">
          <Users className="w-4 h-4 text-amber-600" />
          <span>دعوة كريمة من عائلتي العروسين</span>
        </div>

        <div className="space-y-2 text-stone-800 font-amiri font-bold text-base sm:text-lg leading-relaxed theme-heading">
          {parentsGroomAr && <p>{parentsGroomAr}</p>}
          {parentsGroomAr && parentsBrideAr && (
            <span className="block text-sm text-stone-400 font-normal theme-muted">و</span>
          )}
          {parentsBrideAr && <p>{parentsBrideAr}</p>}
        </div>

        <div className="pt-2 border-t border-stone-100 theme-divider">
          <p
            className="text-xs sm:text-sm font-black font-cairo theme-subheading"
            style={{ color: primaryColor }}
          >
            يتشرفون بدعوة سيادتكم لمشاركتهم فرحتهم الكبرى ❤️
          </p>
        </div>
      </div>
    </section>
  );
}
