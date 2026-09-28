'use client';

import React from 'react';
import { Palette, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import { DEFAULT_THEMES } from '@farahna/shared';

export default function AdminThemesPage() {
  return (
    <div className="space-y-6 text-right font-cairo">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-stone-900">الثيمات والتصاميم (Themes)</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-[#720925] font-bold border border-rose-200">
              {DEFAULT_THEMES.length} ثيمات معتمدة
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            إدارة النماذج البصرية، الألوان، الخطوط العربية، وتصميم المظاريف لدعوات فرحنا
          </p>
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEFAULT_THEMES.map((theme) => {
          const cfg = theme.config;
          return (
            <div
              key={theme.slug}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden flex flex-col justify-between p-6 space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Theme Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎨</span>
                    <div>
                      <h3 className="font-black text-stone-900 text-base">{theme.nameAr}</h3>
                      <p className="text-[11px] text-stone-400">{theme.name}</p>
                    </div>
                  </div>
                  {theme.sortOrder === 1 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      افتراضي
                    </span>
                  )}
                </div>

                {/* Color Palette Preview */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-stone-500">لوحة الألوان الأساسية:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-xl border border-black/10 shadow-xs"
                      style={{ backgroundColor: cfg.primaryColor }}
                      title={`Primary: ${cfg.primaryColor}`}
                    />
                    <div
                      className="w-7 h-7 rounded-xl border border-black/10 shadow-xs"
                      style={{ backgroundColor: cfg.secondaryColor }}
                      title={`Secondary: ${cfg.secondaryColor}`}
                    />
                    <div
                      className="w-7 h-7 rounded-xl border border-black/10 shadow-xs"
                      style={{ backgroundColor: cfg.backgroundColor }}
                      title={`Background: ${cfg.backgroundColor}`}
                    />
                    <div
                      className="w-7 h-7 rounded-xl border border-black/10 shadow-xs"
                      style={{ backgroundColor: cfg.textColor }}
                      title={`Text: ${cfg.textColor}`}
                    />
                  </div>
                </div>

                {/* Typography info */}
                <div className="pt-2 border-t border-stone-100 text-xs text-stone-600 space-y-1">
                  <p><strong>الخط والتنسيق:</strong> {cfg.fontFamily}</p>
                  <p><strong>طراز المظروف:</strong> {cfg.envelopeStyle}</p>
                  <p><strong>طراز البطاقة:</strong> {cfg.cardStyle || 'فاخر'}</p>
                </div>
              </div>

              {/* Action Preview */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <a
                  href={`/invitation/wedding/ahmed-sara-${theme.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#720925] hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>معاينة حية للثيم</span>
                </a>
                <span className="text-[10px] text-stone-400 font-bold">نشط في النظام ✅</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
