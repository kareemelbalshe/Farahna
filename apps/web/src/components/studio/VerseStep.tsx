'use client';

import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { QURANIC_VERSES_PRESETS } from '@farahna/shared';

interface VerseStepProps {
  selectedVerseId: string;
  customWeddingMessage: string;
  onVerseSelect: (verseId: string) => void;
  setCustomWeddingMessage: (val: string) => void;
  setSectionsVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export function VerseStep({
  selectedVerseId,
  customWeddingMessage,
  onVerseSelect,
  setCustomWeddingMessage,
  setSectionsVisibility,
}: VerseStepProps) {
  return (
    <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-5 shadow-2xs">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-sm font-black text-stone-900 block flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#720925]" />
          <span>٣. الآية القرآنية ورسالة حفل الزفاف:</span>
        </label>
        <div className="flex items-center gap-2">
          {customWeddingMessage?.trim() && (
            <button
              type="button"
              onClick={() => {
                setCustomWeddingMessage('');
                setSectionsVisibility((prev) => ({ ...prev, message: false }));
              }}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors cursor-pointer"
            >
              حذف الآية بالكامل ❌
            </button>
          )}
          <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
            اختياري
          </span>
        </div>
      </div>

      {/* Preset Pills */}
      <div className="flex flex-wrap gap-2">
        {QURANIC_VERSES_PRESETS.map((vp) => (
          <button
            key={vp.id}
            type="button"
            onClick={() => onVerseSelect(vp.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedVerseId === vp.id
                ? 'bg-[#720925] text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {vp.title}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <div className="space-y-1.5">
        <textarea
          rows={3}
          value={customWeddingMessage}
          onChange={(e) => {
            setCustomWeddingMessage(e.target.value);
            if (e.target.value.trim()) {
              setSectionsVisibility((prev) => ({ ...prev, message: true }));
            }
          }}
          placeholder="اكتب آية قرآنية أو رسالة ترحيبية خاصة لمعازيمكم..."
          className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-xs sm:text-sm font-amiri leading-relaxed focus:ring-2 focus:ring-[#720925] focus:outline-hidden"
        />
        <div className="flex items-center justify-between text-[11px] text-stone-500">
          <span>💡 تظهر هذه الرسالة أو الآية القرآنية بأعلى الكارت بخط أميري أنيق.</span>
          <span>{customWeddingMessage?.length || 0} حرف</span>
        </div>
      </div>
    </section>
  );
}
