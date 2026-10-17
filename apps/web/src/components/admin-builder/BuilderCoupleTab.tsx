'use client';

import React from 'react';
import {
  Info,
  Copy,
  Users,
  Sparkles,
  Trash2,
  Heart,
  Globe,
  Shuffle,
} from 'lucide-react';
import { QURANIC_VERSES_PRESETS } from '@farahna/shared';

interface BuilderCoupleTabProps {
  invitation: any;
  handleChange: (field: string, value: any) => void;
  handleNestedThemeConfigChange: (key: string, value: any) => void;
  handleToggleSection: (sectionKey: string, isEnabled: boolean) => void;
  pkgId?: string;
}

export function BuilderCoupleTab({
  invitation,
  handleChange,
  handleNestedThemeConfigChange,
  handleToggleSection,
  pkgId = 'wedding-journey',
}: BuilderCoupleTabProps) {
  return (
    <div className="space-y-4 text-right font-cairo">
      {/* Admin Tip */}
      <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5 shadow-2xs">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          💡 نصيحة الإدارة: اكتب أسماء العروسين بالعربية والإنجليزية بدقة، حيث ستظهر في الغلاف وكارت الدعوة وشاشة فتح الظرف تلقائياً.
        </span>
      </div>

      {/* 1. Invitation Type & Short Link (Slug) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-stone-900 block">
              نوع المناسبة والدعوة:
            </label>
            <select
              value={invitation.type || 'wedding'}
              onChange={(e) => {
                if (pkgId === 'basic' && e.target.value === 'custom') {
                  alert(
                    '⚠️ مناسبة خاصة (الكاستم) متاحة في باقات VIP ورحلة الفرح. يرجى اختيار زفاف أو خطوبة أو كتب كتاب أو حنة.'
                  );
                  return;
                }
                handleChange('type', e.target.value);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:bg-white font-bold"
            >
              <option value="wedding">👑 دعوة زفاف وفرح (Wedding)</option>
              <option value="engagement">💍 دعوة خطوبة (Engagement)</option>
              <option value="katb_ketab">📜 دعوة كتب كتاب وعقد قران (Katb Ketab)</option>
              <option value="henna">🌿 دعوة ليلة حنة (Henna)</option>
              <option value="custom">✨ دعوة مناسبة خاصة / احتفال (Custom)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-stone-900 block">
                الرابط المختصر (Slug):
              </label>
              <button
                type="button"
                onClick={() => {
                  const rand = Math.random().toString(36).substring(2, 6).toLowerCase();
                  const current = (invitation.slug || '').replace(/^-+|-+$/g, '');
                  handleChange('slug', current ? `${current}-${rand}` : `inv-${rand}`);
                }}
                className="text-[10px] font-bold text-[#720925] bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-lg border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                title="إضافة كود عشوائي للرابط"
              >
                <Shuffle className="w-3 h-3" />
                <span>كود عشوائي</span>
              </button>
            </div>
            <input
              type="text"
              value={invitation.slug || ''}
              onChange={(e) =>
                handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
              }
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono text-left dir-ltr bg-stone-50 focus:bg-white"
              placeholder="ahmed-sara"
            />
          </div>
        </div>

        {/* Live URL Link bar */}
        <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-2 text-xs font-mono flex-wrap">
          <div className="text-stone-700 truncate dir-ltr text-left text-[11px]">
            <span className="text-stone-400">/invitation/{invitation.type || 'wedding'}/</span>
            <span className="text-[#720925] font-black">{invitation.slug || 'link'}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                const full = `${typeof window !== 'undefined' ? window.location.origin : ''}/invitation/${invitation.type || 'wedding'}/${invitation.slug}`;
                if (navigator?.clipboard) {
                  navigator.clipboard.writeText(full);
                  alert('تم نسخ رابط الدعوة بنجاح! 📋');
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 text-stone-700 text-[10px] font-sans font-bold border border-stone-200 flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3 text-stone-500" />
              <span>نسخ</span>
            </button>
            <a
              href={`/invitation/${invitation.type || 'wedding'}/${invitation.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#720925] border border-rose-200 text-[10px] font-sans font-bold flex items-center gap-1"
            >
              <span>فتح الرابط ↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Title */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1.5">
        <label className="text-xs font-black text-stone-900 block">
          عنوان الدعوة الرئيسي (يظهر أعلى الغلاف):
        </label>
        <input
          type="text"
          value={invitation.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="مثال: دعوة زفاف أحمد وسارة ❤️"
          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:bg-white font-bold"
        />
      </div>

      {/* 3. Couple Names (Arabic & English) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3.5">
        <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
          <Heart className="w-4 h-4 text-[#720925]" />
          <span className="text-xs font-black text-stone-900">أسماء العروسين:</span>
        </div>

        {/* Arabic Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-700 block">اسم العريس (عربي):</label>
            <input
              type="text"
              value={invitation.coupleGroomAr || ''}
              onChange={(e) => handleChange('coupleGroomAr', e.target.value)}
              placeholder="أحمد"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold bg-stone-50 focus:bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-700 block">اسم العروسة (عربي):</label>
            <input
              type="text"
              value={invitation.coupleBrideAr || ''}
              onChange={(e) => handleChange('coupleBrideAr', e.target.value)}
              placeholder="سارة"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold bg-stone-50 focus:bg-white"
            />
          </div>
        </div>

        {/* English Names (Optional) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-500 block flex items-center justify-between">
              <span>اسم العريس (English):</span>
              <span className="text-[9px] text-stone-400">اختياري</span>
            </label>
            <input
              type="text"
              value={invitation.coupleGroomEn || ''}
              onChange={(e) => handleChange('coupleGroomEn', e.target.value)}
              placeholder="Ahmed"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-left dir-ltr bg-stone-50 focus:bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-500 block flex items-center justify-between">
              <span>اسم العروسة (English):</span>
              <span className="text-[9px] text-stone-400">اختياري</span>
            </label>
            <input
              type="text"
              value={invitation.coupleBrideEn || ''}
              onChange={(e) => handleChange('coupleBrideEn', e.target.value)}
              placeholder="Sara"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-left dir-ltr bg-stone-50 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* 4. Parents Greetings */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-black text-stone-900">
              إهداء أولياء الأمور والعائلتين (Parents Greetings):
            </span>
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => {
                handleChange('parentsGroomAr', 'يتشرف المستشار والد العريس وحرمه');
                handleChange('parentsBrideAr', 'والأستاذ الدكتور والد العروس وحرمه');
              }}
              className="text-[10px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200 cursor-pointer transition-colors"
            >
              رسمي 🏛️
            </button>
            <button
              type="button"
              onClick={() => {
                handleChange('parentsGroomAr', 'يتشرف والد العريس وعائلته الكريمة');
                handleChange('parentsBrideAr', 'ووالد العروس وعائلتها الكريمة');
              }}
              className="text-[10px] font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-lg border border-rose-200 cursor-pointer transition-colors"
            >
              عائلي ❤️
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-700 block">إهداء أهل العريس:</label>
            <input
              type="text"
              value={invitation.parentsGroomAr || ''}
              onChange={(e) => handleChange('parentsGroomAr', e.target.value)}
              placeholder="يتشرف والد العريس وحرمه..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-700 block">إهداء أهل العروسة:</label>
            <input
              type="text"
              value={invitation.parentsBrideAr || ''}
              onChange={(e) => handleChange('parentsBrideAr', e.target.value)}
              placeholder="والأستاذ الدكتور والد العروس وحرمه..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* 5. Quranic Verse & Wedding Message */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-black text-stone-900">
              الآية الكريمة ورسالة الدعوة (Verse & Message):
            </span>
          </div>
          {invitation.weddingMessageAr ? (
            <button
              type="button"
              onClick={() => handleChange('weddingMessageAr', '')}
              className="text-[10px] font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>إفراغ الآية</span>
            </button>
          ) : (
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
              القسم محذوف
            </span>
          )}
        </div>

        {/* 1-Click Verse Chips */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-stone-500 font-bold block">نماذج سريعة جاهزة:</span>
          <div className="flex flex-wrap gap-1.5">
            {QURANIC_VERSES_PRESETS.map((vp) => (
              <button
                key={vp.id}
                type="button"
                onClick={() => handleChange('weddingMessageAr', vp.verse)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${
                  invitation.weddingMessageAr === vp.verse
                    ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-2xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                {vp.title}
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={3}
          value={invitation.weddingMessageAr || ''}
          onChange={(e) => handleChange('weddingMessageAr', e.target.value)}
          placeholder="اكتب الآية الكريمة أو الكلمات الخاصة بكم هنا..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-amiri leading-relaxed bg-stone-50 focus:bg-white"
        />
      </div>
    </div>
  );
}
