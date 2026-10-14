import React from 'react';
import { Quote } from 'lucide-react';

interface WeddingMessageSectionProps {
  weddingMessageAr?: string | null;
  secondaryColor?: string;
  isPreview?: boolean;
}

export function WeddingMessageSection({
  weddingMessageAr,
  secondaryColor = '#D4AF37',
  isPreview = false,
}: WeddingMessageSectionProps) {
  if (!weddingMessageAr) return null;

  return (
    <section className={`mx-auto text-center ${isPreview ? 'py-3 px-2 max-w-full' : 'py-6 px-4 max-w-2xl'}`}>
      <div
        className={`relative bg-white/80 backdrop-blur-md border border-stone-200/80 shadow-sm theme-card ${
          isPreview
            ? 'p-3.5 rounded-2xl space-y-2'
            : 'p-6 sm:p-8 rounded-3xl space-y-3'
        }`}
      >
        <Quote
          className={`mx-auto opacity-30 ${isPreview ? 'w-6 h-6' : 'w-8 h-8'}`}
          style={{ color: secondaryColor }}
        />
        <p
          className={`text-stone-700 leading-relaxed font-amiri whitespace-pre-line font-medium theme-heading ${
            isPreview
              ? 'text-xs min-[360px]:text-sm'
              : 'text-sm sm:text-base lg:text-lg'
          }`}
        >
          {weddingMessageAr}
        </p>
      </div>
    </section>
  );
}
