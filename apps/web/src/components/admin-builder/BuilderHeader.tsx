'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Eye,
  Share2,
  Users,
  ExternalLink,
  Sparkles,
  Save,
  Loader2,
  Check,
} from 'lucide-react';

interface BuilderHeaderProps {
  invitation: any;
  previewUrl: string;
  adminMobileView: 'editor' | 'preview';
  setAdminMobileView: (view: 'editor' | 'preview') => void;
  successNotice: string;
  previewTokenCopied: boolean;
  guestListCopied: boolean;
  copyPreviewLink: () => void;
  copyGuestListLink: () => void;
  handleApplyLiveTemplate: () => void;
  handleSave: () => void;
  saving: boolean;
}

export function BuilderHeader({
  invitation,
  previewUrl,
  adminMobileView,
  setAdminMobileView,
  successNotice,
  previewTokenCopied,
  guestListCopied,
  copyPreviewLink,
  copyGuestListLink,
  handleApplyLiveTemplate,
  handleSave,
  saving,
}: BuilderHeaderProps) {
  return (
    <header className="bg-white border-b border-stone-200 px-3 sm:px-6 py-2.5 flex items-center justify-between shrink-0 shadow-2xs z-30">
      {/* Title & Invitation Identifier */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link
          href="/admin/invitations"
          className="p-1.5 sm:p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors shrink-0"
          title="العودة لإدارة الدعوات"
        >
          <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
        </Link>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-xs sm:text-sm font-black text-stone-900 truncate">
              {invitation.title || 'محرر الدعوة'}
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-rose-50 text-[#720925] border border-rose-200 text-[10px] font-bold shrink-0">
              {invitation.customer?.name || 'عميل'}
            </span>
          </div>
          <p className="text-[10px] text-stone-400 font-mono truncate" dir="ltr">
            /invitation/{invitation.type}/{invitation.slug}
          </p>
        </div>
      </div>

      {/* Action Buttons & Mobile View Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        {/* Mobile View Toggle Switch */}
        <div className="flex md:hidden items-center bg-stone-100 p-0.5 rounded-xl text-xs font-bold border border-stone-200">
          <button
            type="button"
            onClick={() => setAdminMobileView('editor')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              adminMobileView === 'editor' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            المحرر
          </button>
          <button
            type="button"
            onClick={() => setAdminMobileView('preview')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              adminMobileView === 'preview' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>المعاينة</span>
          </button>
        </div>

        {successNotice && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-300 animate-pulse shadow-2xs">
            {successNotice}
          </span>
        )}

        <button
          type="button"
          onClick={copyPreviewLink}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-colors shadow-2xs cursor-pointer"
          title="نسخ رابط المعاينة السري لمشاركته مع العميل"
        >
          {previewTokenCopied ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <Share2 className="w-4 h-4 text-amber-700" />
          )}
          <span>{previewTokenCopied ? 'تم النسخ!' : 'نسخ رابط العميل'}</span>
        </button>

        <button
          type="button"
          onClick={copyGuestListLink}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 font-bold text-xs transition-colors shadow-2xs cursor-pointer"
          title="نسخ رابط كشف المعازيم الخاص بالعروسين لمتابعة الضيوف"
        >
          {guestListCopied ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <Users className="w-4 h-4 text-teal-700" />
          )}
          <span>{guestListCopied ? 'تم النسخ!' : 'كشف المعازيم للعروسين 📋'}</span>
        </button>

        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-bold text-xs transition-colors shadow-2xs"
          title="معاينة الدعوة في تبويب جديد"
        >
          <ExternalLink className="w-4 h-4 text-stone-500" />
          <span>معاينة ↗</span>
        </a>

        <button
          type="button"
          onClick={handleApplyLiveTemplate}
          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 text-white font-black text-xs transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
          title="تعبئة نموذج متكامل زي الدعوات الحية (الأقسام، المناسبات، موقع القاعة، إهداء الأهل، ليلة الحنة، الألبوم)"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          <span className="hidden md:inline">نموذج الدعوة الحية 🪄</span>
          <span className="md:hidden">نموذج كامل 🪄</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl burgundy-gradient-bg text-white font-black text-xs sm:text-sm shadow-md shadow-rose-950/20 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Save className="w-4 h-4 text-white" />
          )}
          <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات 💾'}</span>
        </button>
      </div>
    </header>
  );
}
