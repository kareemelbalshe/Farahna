import React from 'react';
import { Users } from 'lucide-react';

interface ParentsSectionProps {
  parentsGroomAr?: string | null;
  parentsBrideAr?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
}

export function ParentsSection({
  parentsGroomAr,
  parentsBrideAr,
  primaryColor = '#720925',
  secondaryColor = '#D4AF37',
}: ParentsSectionProps) {
  if (!parentsGroomAr && !parentsBrideAr) return null;

  return (
    <section className="py-8 px-4 max-w-2xl mx-auto text-center">
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-800">
          <Users className="w-4 h-4 text-amber-600" />
          <span>دعوة كريمة من عائلتي العروسين</span>
        </div>

        <div className="space-y-2 text-stone-800 font-amiri font-bold text-base sm:text-lg leading-relaxed">
          {parentsGroomAr && <p>{parentsGroomAr}</p>}
          {parentsGroomAr && parentsBrideAr && (
            <span className="block text-sm text-stone-400 font-normal">و</span>
          )}
          {parentsBrideAr && <p>{parentsBrideAr}</p>}
        </div>

        <div className="pt-2 border-t border-stone-100">
          <p
            className="text-xs sm:text-sm font-black font-cairo"
            style={{ color: primaryColor }}
          >
            يتشرفون بدعوة سيادتكم لمشاركتهم فرحتهم الكبرى ❤️
          </p>
        </div>
      </div>
    </section>
  );
}
