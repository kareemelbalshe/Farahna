'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Save, Sliders, Eye, Sparkles } from 'lucide-react';

interface StudioHeaderProps {
  lastSavedTime: string | null;
  activeTab: 'editor' | 'preview';
  setActiveTab: (tab: 'editor' | 'preview') => void;
  onOpenCheckout: () => void;
}

export function StudioHeader({
  lastSavedTime,
  activeTab,
  setActiveTab,
  onOpenCheckout,
}: StudioHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo & Studio Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/"
            className="p-1.5 sm:p-2 text-stone-400 hover:text-stone-800 rounded-xl hover:bg-stone-100 transition-colors shrink-0"
            title="العودة للرئيسية"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm min-[390px]:text-base sm:text-2xl font-black text-[#720925] truncate">
                <span className="sm:hidden">استوديو صمم دعوتك 🪄</span>
                <span className="hidden sm:inline">استوديو صمم دعوتك بنفسك 🪄</span>
              </span>
              <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-[#720925] border border-rose-200 shrink-0">
                بدون تسجيل دخول
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block truncate">
              صمم كل تفاصيل فرحتك بالكامل، وشاهد المعاينة الحية خطوة بخطوة 💍
            </p>
          </div>
        </div>

        {/* Actions & Auto-Save Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {lastSavedTime && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Save className="w-3.5 h-3.5 text-emerald-600" />
              <span>محفوظ في جهازك ({lastSavedTime})</span>
            </span>
          )}

          {/* Mobile Tabs Switcher */}
          <div className="flex lg:hidden bg-stone-100 p-1 rounded-xl text-xs font-bold border border-stone-200">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all ${
                activeTab === 'editor' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              المحرر
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'preview' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>المعاينة</span>
            </button>
          </div>

          {/* Save & Activate CTA */}
          <button
            type="button"
            onClick={onOpenCheckout}
            className="px-3 sm:px-7 py-2 sm:py-3 rounded-xl burgundy-gradient-bg text-white font-black text-xs sm:text-sm shadow-md shadow-rose-950/20 hover:opacity-95 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
            <span className="hidden sm:inline">حفظ وتفعيل الدعوة 🚀</span>
            <span className="inline sm:hidden">حفظ 🚀</span>
          </button>
        </div>
      </div>
    </header>
  );
}
