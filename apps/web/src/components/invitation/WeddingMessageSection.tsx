import React from 'react';
import { Quote } from 'lucide-react';

interface WeddingMessageSectionProps {
  weddingMessageAr?: string | null;
  secondaryColor?: string;
}

export function WeddingMessageSection({
  weddingMessageAr,
  secondaryColor = '#D4AF37',
}: WeddingMessageSectionProps) {
  if (!weddingMessageAr) return null;

  return (
    <section className="py-6 px-4 max-w-2xl mx-auto text-center">
      <div className="relative p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-stone-200/80 shadow-sm space-y-3">
        <Quote
          className="w-8 h-8 mx-auto opacity-30"
          style={{ color: secondaryColor }}
        />
        <p className="text-sm sm:text-base lg:text-lg text-stone-700 leading-relaxed font-amiri whitespace-pre-line font-medium">
          {weddingMessageAr}
        </p>
      </div>
    </section>
  );
}
