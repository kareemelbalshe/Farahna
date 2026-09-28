'use client';

import React, { useState } from 'react';
import { Camera, Sparkles, X } from 'lucide-react';

interface PhotoGalleryProps {
  images: string[];
  coupleName: string;
}

export function PhotoGallery({ images, coupleName }: PhotoGalleryProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
          <Camera className="w-3.5 h-3.5 text-amber-600" />
          أجمل الذكريات
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-cairo">
          معرض صور العروسين
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          لقطات مميزة من جلسة التصوير (Photo Session)
        </p>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setActiveImage(img)}
            className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-200 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              src={img}
              alt={`صورة ${coupleName} ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors" />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/90 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            className="absolute top-5 left-5 text-white/80 hover:text-white p-2 rounded-full bg-stone-800"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeImage}
            alt="صورة مكبرة"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </section>
  );
}
