'use client';

import React from 'react';

interface SaveThemeModalProps {
  show: boolean;
  onClose: () => void;
  newThemeNameAr: string;
  setNewThemeNameAr: (val: string) => void;
  newThemeSlug: string;
  setNewThemeSlug: (val: string) => void;
  handleSaveAsNewTheme: (e: React.FormEvent) => Promise<void>;
  savingNewTheme: boolean;
}

export function SaveThemeModal({
  show,
  onClose,
  newThemeNameAr,
  setNewThemeNameAr,
  newThemeSlug,
  setNewThemeSlug,
  handleSaveAsNewTheme,
  savingNewTheme,
}: SaveThemeModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-cairo">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200 text-right">
        <h3 className="font-black text-sm text-stone-900">
          حفظ هذا التنسيق كثيم جديد في النظام للأبد 🎨
        </h3>
        <p className="text-xs text-stone-500">
          سيتم حفظ الألوان الحالية للعروسين في قاعدة البيانات ليصبح ثيماً معتمداً يمكن استخدامه في أي فرح آخر!
        </p>

        <form onSubmit={handleSaveAsNewTheme} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-stone-700 block">اسم الثيم بالعربي: *</label>
            <input
              type="text"
              required
              value={newThemeNameAr}
              onChange={(e) => setNewThemeNameAr(e.target.value)}
              placeholder="مثال: الذهبي العاجي الفاخر"
              className="w-full p-2.5 rounded-xl border border-stone-300"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-stone-700 block">الاسم المختصر بالإنجليزية (Slug): *</label>
            <input
              type="text"
              required
              value={newThemeSlug}
              onChange={(e) => setNewThemeSlug(e.target.value)}
              placeholder="ivory-gold"
              className="w-full p-2.5 rounded-xl border border-stone-300 font-mono text-left dir-ltr"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={savingNewTheme}
              className="px-5 py-2 rounded-xl burgundy-gradient-bg text-white font-bold shadow-md cursor-pointer disabled:opacity-50"
            >
              {savingNewTheme ? 'جاري الحفظ...' : 'حفظ الثيم للأبد 💾'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
