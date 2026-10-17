'use client';

import React from 'react';
import { Smartphone, RotateCcw, Crown } from 'lucide-react';
import { InnerCardView } from '@/components/invitation/InnerCardView';
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer';

interface StudioMobileSimulatorProps {
  activeTab: 'editor' | 'preview';
  previewViewMode: 'phone' | 'full';
  setPreviewViewMode: (mode: 'phone' | 'full') => void;
  previewCardInspectMode: boolean;
  setPreviewCardInspectMode: React.Dispatch<React.SetStateAction<boolean>>;
  envelopePreviewOpen: boolean;
  setEnvelopePreviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sectionsVisibility: Record<string, boolean>;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  innerCardStyle: string;
  coupleGroomAr: string;
  coupleBrideAr: string;
  title: string;
  eventDate: string;
  customWeddingMessage: string;
  waxSealMonogram: string;
  livePreviewInvitation: any;
  livePreviewEvents: any[];
  activeTheme: any;
  livePreviewSections: any[];
}

export function StudioMobileSimulator({
  activeTab,
  previewViewMode,
  setPreviewViewMode,
  previewCardInspectMode,
  setPreviewCardInspectMode,
  envelopePreviewOpen,
  setEnvelopePreviewOpen,
  sectionsVisibility,
  backgroundColor,
  primaryColor,
  secondaryColor,
  innerCardStyle,
  coupleGroomAr,
  coupleBrideAr,
  title,
  eventDate,
  customWeddingMessage,
  waxSealMonogram,
  livePreviewInvitation,
  livePreviewEvents,
  activeTheme,
  livePreviewSections,
}: StudioMobileSimulatorProps) {
  const coupleNames =
    coupleGroomAr || coupleBrideAr
      ? `${coupleGroomAr || 'العريس'} & ${coupleBrideAr || 'العروس'}`
      : 'أحمد & سارة';

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'الجمعة، ٢٠ نوفمبر ٢٠٢٦';

  const defaultMonogram = `${coupleGroomAr?.trim()?.charAt(0) || 'أ'} & ${
    coupleBrideAr?.trim()?.charAt(0) || 'س'
  }`;

  return (
    <div
      className={`lg:col-span-5 lg:sticky lg:top-[74px] space-y-2.5 ${
        activeTab === 'editor' ? 'hidden lg:block' : 'block'
      }`}
    >
      {/* Device Mockup Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/90 backdrop-blur-xs rounded-2xl border border-stone-200/90 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-stone-800 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-[#720925]" />
            <span>المعاينة المباشرة</span>
          </span>
          {/* Mode toggle: Phone frame vs Fluid canvas */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setPreviewViewMode('phone')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                previewViewMode === 'phone'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              هاتف 📱
            </button>
            <button
              type="button"
              onClick={() => setPreviewViewMode('full')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                previewViewMode === 'full'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              كامل 🔲
            </button>
          </div>
        </div>

        {sectionsVisibility.envelope ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPreviewCardInspectMode((prev) => !prev)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                previewCardInspectMode
                  ? 'bg-[#720925] text-white border-[#720925] shadow-xs ring-2 ring-[#720925]/20'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
              title="فحص شكل كارت الدعوة الداخلي"
            >
              <span>📜 {previewCardInspectMode ? 'عرض الظرف' : 'كارت الدعوة'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setPreviewCardInspectMode(false);
                setEnvelopePreviewOpen((prev) => !prev);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100 shadow-2xs transition-all cursor-pointer"
              title="إعادة تشغيل حركة الفتح الملكية"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>{envelopePreviewOpen ? 'إعادة الفتح 🔄' : 'فتح الظرف 🪄'}</span>
            </button>
          </div>
        ) : (
          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            الظرف محذوف ⚡
          </span>
        )}
      </div>

      {/* Frame Container */}
      {previewViewMode === 'phone' ? (
        <div
          className="relative mx-auto w-full max-w-[min(360px,calc(100vw-32px))] bg-stone-900 rounded-[38px] sm:rounded-[44px] p-2 sm:p-2.5 shadow-2xl border-4 border-stone-800 ring-2 sm:ring-4 ring-stone-950/15 overflow-hidden flex flex-col"
          style={{
            height: 'min(680px, calc(100dvh - 145px))',
            maxHeight: 'calc(100dvh - 145px)',
            minHeight: '480px',
          }}
        >
          {/* Speaker & Camera Notch */}
          <div className="w-24 sm:w-28 h-3 sm:h-3.5 bg-stone-950 rounded-b-xl mx-auto mb-1.5 shrink-0 z-50 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mr-1.5" />
            <div className="w-7 sm:w-9 h-1 bg-stone-800 rounded-full" />
          </div>

          {/* Inner Smartphone Screen Content */}
          <div
            className="relative flex-1 rounded-[28px] sm:rounded-[36px] overflow-hidden border border-stone-800/40 flex flex-col"
            style={{
              backgroundColor,
            }}
          >
            <div className="relative w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar overscroll-contain flex-1 flex flex-col">
              {previewCardInspectMode ? (
                <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center space-y-4 pattern-damask animate-fade-in my-auto">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 text-amber-300 text-[10px] font-bold border border-amber-400/40 backdrop-blur-md">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>معاينة حية لشكل كارت الدعوة الداخلي</span>
                  </div>
                  <div className="w-full max-w-[280px] h-[210px] shadow-2xl rounded-2xl">
                    <InnerCardView
                      style={innerCardStyle}
                      coupleNames={coupleNames}
                      invitationTitle={title || 'نتشرف بحضوركم ومشاركتنا فرحتنا'}
                      formattedDate={formattedDate}
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                      borderColor={secondaryColor || '#D4AF37'}
                      isDark={false}
                      verseExcerpt={customWeddingMessage?.slice(0, 50)}
                      waxSealMonogram={waxSealMonogram || defaultMonogram}
                      isPreview={true}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewCardInspectMode(false)}
                    className="text-[11px] font-bold text-amber-200 hover:text-white bg-black/60 px-4 py-1.5 rounded-full border border-amber-500/40 transition-colors shadow-sm cursor-pointer"
                  >
                    العودة لمعاينة الظرف 💌
                  </button>
                </div>
              ) : (
                /* Main Rendered Invitation Body */
                <InvitationRenderer
                  invitation={livePreviewInvitation}
                  events={livePreviewEvents}
                  theme={activeTheme}
                  sections={livePreviewSections}
                  isPreview={true}
                  hidePreviewBanner={true}
                  isEnvelopeOpen={envelopePreviewOpen}
                  onEnvelopeOpen={() => setEnvelopePreviewOpen(true)}
                  isMobileFrame={true}
                />
              )}
            </div>
          </div>

          {/* Home Indicator Bar */}
          <div className="w-24 sm:w-28 h-1 bg-stone-700/60 rounded-full mx-auto mt-1.5 shrink-0 pointer-events-none" />
        </div>
      ) : (
        /* Fluid edge-to-edge frame */
        <div
          className="relative w-full rounded-2xl sm:rounded-3xl shadow-xl border-2 border-stone-300 overflow-hidden flex flex-col"
          style={{
            backgroundColor,
            height: 'min(640px, calc(100dvh - 145px))',
            maxHeight: 'calc(100dvh - 145px)',
            minHeight: '440px',
          }}
        >
          <div className="relative w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar flex-1 flex flex-col">
            {previewCardInspectMode ? (
              <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center space-y-4 pattern-damask animate-fade-in my-auto">
                <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-black/60 text-amber-300 text-xs font-bold border border-amber-400/40 backdrop-blur-md">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>معاينة حية لشكل كارت الدعوة الداخلي</span>
                </div>
                <div className="w-full max-w-[320px] h-[220px] shadow-2xl rounded-2xl">
                  <InnerCardView
                    style={innerCardStyle}
                    coupleNames={coupleNames}
                    invitationTitle={title || 'نتشرف بحضوركم ومشاركتنا فرحتنا'}
                    formattedDate={formattedDate}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    borderColor={secondaryColor || '#D4AF37'}
                    isDark={false}
                    verseExcerpt={customWeddingMessage?.slice(0, 50)}
                    waxSealMonogram={waxSealMonogram || defaultMonogram}
                    isPreview={true}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewCardInspectMode(false)}
                  className="text-xs font-bold text-amber-200 hover:text-white bg-black/60 px-4 py-1.5 rounded-full border border-amber-500/40 transition-colors shadow-sm cursor-pointer"
                >
                  العودة لمعاينة الظرف 💌
                </button>
              </div>
            ) : (
              /* Main Rendered Invitation Body */
              <InvitationRenderer
                invitation={livePreviewInvitation}
                events={livePreviewEvents}
                theme={activeTheme}
                sections={livePreviewSections}
                isPreview={true}
                hidePreviewBanner={true}
                isEnvelopeOpen={envelopePreviewOpen}
                onEnvelopeOpen={() => setEnvelopePreviewOpen(true)}
                isMobileFrame={false}
              />
            )}
          </div>
        </div>
      )}

      <p className="text-center text-[11px] text-stone-500 font-medium">
        💡 اضغط على زر "كارت الدعوة" أو زر ختم الشمع في المظرف لتجربة كل أشكال الكروت والحركات الملكية!
      </p>
    </div>
  );
}
