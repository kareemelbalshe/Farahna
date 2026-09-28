import React from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';

interface ClosingMessageSectionProps {
  closingMessageAr?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
}

export function ClosingMessageSection({
  closingMessageAr = 'عقبال عندكم جميعاً، وبحضوركم تكتمل فرحتنا ❤️',
  primaryColor = '#720925',
  secondaryColor = '#D4AF37',
}: ClosingMessageSectionProps) {
  return (
    <footer className="pt-12 pb-16 px-4 text-center space-y-5 border-t border-stone-200/80">
      {/* Decorative center icon */}
      <div className="flex items-center justify-center gap-3">
        <div className="w-12 h-px" style={{ backgroundColor: secondaryColor }} />
        <Heart className="w-5 h-5 animate-pulse" style={{ fill: primaryColor, color: primaryColor }} />
        <div className="w-12 h-px" style={{ backgroundColor: secondaryColor }} />
      </div>

      <p className="text-base sm:text-lg font-bold text-stone-800 font-amiri max-w-lg mx-auto leading-relaxed">
        {closingMessageAr}
      </p>

      {/* Farahna Brand Stamp */}
      <div className="pt-4 space-y-1">
        <p className="text-[11px] text-stone-500">
          صُنعت بكل حب عبر منصة
        </p>
        <Link
          href="/"
          className="inline-block text-xs font-black tracking-wide hover:underline transition-all"
          style={{ color: primaryColor }}
        >
          فرحنا — Farahna.menuflowx.com
        </Link>
      </div>
    </footer>
  );
}
