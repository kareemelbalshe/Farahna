'use client';

import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer';

interface BuilderLivePreviewProps {
  invitation: any;
  previewUrl: string;
  adminMobileView: 'editor' | 'preview';
  envelopeResetKey: number;
  setEnvelopeResetKey: React.Dispatch<React.SetStateAction<number>>;
}

export function BuilderLivePreview({
  invitation,
  previewUrl,
  adminMobileView,
  envelopeResetKey,
  setEnvelopeResetKey,
}: BuilderLivePreviewProps) {
  const backgroundColor =
    invitation.themeConfig?.backgroundColor ||
    invitation.theme?.config?.backgroundColor ||
    '#FAF7F2';

  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 overflow-y-auto bg-gradient-to-br from-stone-100/90 via-[#FDFBF7] to-amber-50/30 relative ${
        adminMobileView === 'editor' ? 'hidden md:flex' : 'flex'
      }`}
    >
      {/* Studio Top Control Strip */}
      <div className="mb-3.5 flex items-center justify-between gap-3 w-full max-w-[380px] text-xs font-bold text-stone-600 px-1">
        <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full border border-stone-200/90 shadow-2xs text-[11px] font-black text-stone-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>iPhone 16 Pro • محاكي الشاشة الحية</span>
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setEnvelopeResetKey((k) => k + 1)}
            className="inline-flex items-center gap-1 bg-white hover:bg-stone-50 text-stone-700 px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer text-[11px]"
            title="إعادة تشغيل حركة فتح الظرف الملكي والموسيقى"
          >
            <span>↺ إعادة فتح الظرف</span>
          </button>

          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-lg bg-white hover:bg-stone-50 border border-stone-200 text-stone-500 hover:text-stone-800 shadow-2xs"
            title="معاينة بملء الشاشة"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* iPhone 16 Pro Mockup Frame */}
      <div className="w-full max-w-[min(380px,calc(100vw-32px))] h-[640px] sm:h-[740px] bg-stone-950 border-[9px] sm:border-[11px] border-stone-900 rounded-[46px] sm:rounded-[52px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] ring-1 ring-white/10 overflow-hidden relative flex flex-col">
        {/* Dynamic Island */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>

        {/* Inner Live Screen */}
        <div
          key={envelopeResetKey}
          className="relative flex-1 overflow-y-auto no-scrollbar"
          style={{
            backgroundColor,
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
          }}
        >
          <InvitationRenderer
            invitation={invitation}
            events={invitation.events || []}
            theme={invitation.theme}
            sections={invitation.sections || []}
            isPreview={true}
            isMobileFrame={true}
          />
        </div>
      </div>
    </div>
  );
}
