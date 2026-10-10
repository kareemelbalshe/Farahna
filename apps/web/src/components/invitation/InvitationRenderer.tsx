'use client';

import React, { useState, useEffect } from 'react';
import {
  InvitationDTO,
  InvitationEventDTO,
  ThemeDTO,
  InvitationSectionDTO,
} from '@farahna/shared';
import { EnvelopeScreen } from './EnvelopeScreen';
import { MusicPlayer } from './MusicPlayer';
import { CoverHeroSection } from './CoverHeroSection';
import { CoupleNamesSection } from './CoupleNamesSection';
import { WeddingMessageSection } from './WeddingMessageSection';
import { CountdownTimer } from './CountdownTimer';
import { MultiEventTabs } from './MultiEventTabs';
import { EventTimeline } from './EventTimeline';
import { ParentsSection } from './ParentsSection';
import { CouplePhotoSection } from './CouplePhotoSection';
import { PhotoGallery } from './PhotoGallery';
import { VenueLocationSection } from './VenueLocationSection';
import { InteractiveMapSection } from './InteractiveMapSection';
import { DressCodeSection } from './DressCodeSection';
import { RsvpModal } from './RsvpModal';
import { AddToCalendar } from './AddToCalendar';
import { ShareSheet } from './ShareSheet';
import { WhatsAppContactSection } from './WhatsAppContactSection';
import { ClosingMessageSection } from './ClosingMessageSection';
import { Sparkles, X } from 'lucide-react';
import { recordPublicAnalytics } from '@/lib/api';

export interface InvitationRendererProps {
  invitation: InvitationDTO;
  events: InvitationEventDTO[];
  theme: ThemeDTO;
  sections?: InvitationSectionDTO[];
  isPreview?: boolean;
  initialEventId?: string;
}

export function InvitationRenderer({
  invitation,
  events = [],
  theme,
  sections = [],
  isPreview = false,
  initialEventId,
}: InvitationRendererProps) {
  // Safe invitation reference
  const safeInv = invitation || ({} as InvitationDTO);

  // If envelopeAnimationEnabled is true, start closed
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(!safeInv.envelopeAnimationEnabled);
  const [audioTriggered, setAudioTriggered] = useState(false);
  const [isBadgeDismissed, setIsBadgeDismissed] = useState(false);

  // Extract theme colors with fallback to theme config or sensible defaults
  const primaryColor =
    safeInv.themeConfig?.primaryColor || theme?.config?.primaryColor || '#720925';
  const secondaryColor =
    safeInv.themeConfig?.secondaryColor || theme?.config?.secondaryColor || '#D4AF37';
  const backgroundColor =
    safeInv.themeConfig?.backgroundColor || theme?.config?.backgroundColor || '#FAF7F2';
  const textColor =
    safeInv.themeConfig?.textColor || theme?.config?.textColor || '#1A1819';
  const fontFamily =
    safeInv.themeConfig?.fontFamily || theme?.config?.fontFamily || "'Cairo', sans-serif";

  // If a custom or curated Google Font is selected, ensure it's loaded
  const primaryFontName = fontFamily.split(',')[0].replace(/['"]/g, '').trim();
  const shouldLoadGoogleFont =
    primaryFontName &&
    !['sans-serif', 'serif', 'monospace', 'cursive', 'system-ui', 'arial', 'tahoma'].includes(
      primaryFontName.toLowerCase()
    );

  const groom = safeInv.coupleGroomAr?.trim() || '';
  const bride = safeInv.coupleBrideAr?.trim() || '';
  const coupleNames =
    groom && bride
      ? `${groom} & ${bride}`
      : groom || bride || 'العروسين';

  const visibleEvents = (events || []).filter((e) => e && e.isVisible !== false);
  const primaryEvent = visibleEvents[0] || (events && events[0]) || null;

  // Resolve effective event date
  const effectiveEventDate = safeInv.eventDate || primaryEvent?.date || null;
  const hasValidEventDate = Boolean(
    effectiveEventDate && !isNaN(new Date(effectiveEventDate).getTime())
  );

  // Check if primary event has meaningful location details
  const hasLocationDetails = Boolean(
    primaryEvent &&
      (Boolean(primaryEvent.latitude && primaryEvent.longitude) ||
        Boolean(primaryEvent.googleMapsUrl?.trim()) ||
        Boolean(primaryEvent.venueNameAr?.trim()) ||
        Boolean(primaryEvent.addressAr?.trim()))
  );

  // Helper function to check if a section is enabled
  const isSectionEnabled = (key: string): boolean => {
    if (!sections || sections.length === 0) return true;
    const match = sections.find((s) => s.sectionKey === key);
    return match ? match.isEnabled : true;
  };

  // Record page view analytics
  useEffect(() => {
    if (!isPreview && safeInv.id) {
      recordPublicAnalytics({
        invitationId: safeInv.id,
        eventType: 'page_view',
        deviceType:
          typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      });
    }
  }, [safeInv.id, isPreview]);

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpen(true);
    setAudioTriggered(true);

    if (!isPreview && safeInv.id) {
      recordPublicAnalytics({
        invitationId: safeInv.id,
        eventType: 'envelope_open',
      });
    }
  };

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `https://farahna.menuflowx.com/invitation/${safeInv.type || 'wedding'}/${safeInv.slug || ''}`;

  return (
    <div
      className="min-h-screen transition-colors selection:bg-[#720925] selection:text-white"
      style={{
        backgroundColor,
        color: textColor,
        fontFamily,
        ['--font-cairo' as any]: fontFamily,
        ['--font-tajawal' as any]: fontFamily,
      }}
    >
      {shouldLoadGoogleFont && (
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(
            primaryFontName
          )}:wght@300;400;600;700;800&display=swap`}
        />
      )}
      {/* 👑 Preview Banner if in admin preview mode */}
      {isPreview && (
        <div className="sticky top-0 z-50 bg-amber-500 text-stone-950 px-4 py-2 text-center text-xs font-black shadow-md flex items-center justify-center gap-2">
          <span>👑 وضع المعاينة الآمنة — هذه النسخة غير معتمدة أو منشورة رسمياً بعد</span>
        </div>
      )}

      {/* 💌 Envelope Opening Overlay */}
      {safeInv.envelopeAnimationEnabled && !isEnvelopeOpen && (
        <EnvelopeScreen
          coupleNames={coupleNames}
          onOpen={handleOpenEnvelope}
          isOpen={isEnvelopeOpen}
          primaryColor={primaryColor}
          themeSlug={theme?.slug}
        />
      )}

      {/* 🎵 Music Player (plays safely if url is provided) */}
      {safeInv.musicUrl && typeof safeInv.musicUrl === 'string' && safeInv.musicUrl.trim() && (
        <MusicPlayer
          musicUrl={safeInv.musicUrl.trim()}
          musicTitle={safeInv.musicTitle?.trim() || 'موسيقى ليلة العمر'}
          shouldAutoTrigger={audioTriggered}
        />
      )}

      {/* Main Invitation Layout Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-14 animate-fade-in-up">
        {/* 1. الغلاف (Cover / Hero) */}
        {isSectionEnabled('cover') && (
          <CoverHeroSection
            coverImageUrl={safeInv.coverImageUrl}
            invitationTitle={safeInv.title}
            invitationType={safeInv.type}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        )}

        {/* 2. أسماء العروسين (Couple Names) */}
        {isSectionEnabled('couple') && (
          <CoupleNamesSection
            coupleGroomAr={safeInv.coupleGroomAr}
            coupleBrideAr={safeInv.coupleBrideAr}
            coupleGroomEn={safeInv.coupleGroomEn}
            coupleBrideEn={safeInv.coupleBrideEn}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        )}

        {/* 3. رسالة الفرح (Wedding Message / Verse) */}
        {isSectionEnabled('message') && safeInv.weddingMessageAr?.trim() && (
          <WeddingMessageSection
            weddingMessageAr={safeInv.weddingMessageAr}
            secondaryColor={secondaryColor}
          />
        )}

        {/* 4. العداد التنازلي (Countdown Timer - Only if valid date exists) */}
        {isSectionEnabled('countdown') && safeInv.countdownEnabled && hasValidEventDate && (
          <CountdownTimer
            eventDate={effectiveEventDate!}
            primaryColor={primaryColor}
          />
        )}

        {/* 5. التنقل بين المناسبات (Multi-Event Navigation Tabs - if multiple events) */}
        {isSectionEnabled('events') && visibleEvents.length > 1 && (
          <MultiEventTabs
            invitationId={safeInv.id}
            events={visibleEvents}
            coupleNames={coupleNames}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            initialEventId={initialEventId}
          />
        )}

        {/* 6. Timeline المناسبات (Events Timeline - if multiple events) */}
        {isSectionEnabled('timeline') && visibleEvents.length > 1 && (
          <EventTimeline
            invitationId={safeInv.id}
            events={visibleEvents}
            coupleNames={coupleNames}
            primaryColor={primaryColor}
          />
        )}

        {/* 7. الأهل (Parents & Family Greetings - Only if at least one parent name exists) */}
        {isSectionEnabled('parents') &&
          (safeInv.parentsGroomAr?.trim() || safeInv.parentsBrideAr?.trim()) && (
            <ParentsSection
              parentsGroomAr={safeInv.parentsGroomAr}
              parentsBrideAr={safeInv.parentsBrideAr}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          )}

        {/* 8. صورة العروسين (Couple Portrait Photo - Only if valid image URL exists) */}
        {isSectionEnabled('couple_photo') &&
          safeInv.coupleImageUrl &&
          typeof safeInv.coupleImageUrl === 'string' &&
          safeInv.coupleImageUrl.trim() && (
            <CouplePhotoSection
              coupleImageUrl={safeInv.coupleImageUrl.trim()}
              coupleNames={coupleNames}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          )}

        {/* 9. الجاليري (Photo Session Gallery - Only if displayable images exist) */}
        {isSectionEnabled('gallery') &&
          Array.isArray(safeInv.galleryImages) &&
          safeInv.galleryImages.filter((img) => typeof img === 'string' && img.trim().length > 0).length > 0 && (
            <PhotoGallery
              images={safeInv.galleryImages.filter((img) => typeof img === 'string' && img.trim().length > 0)}
              coupleName={coupleNames}
            />
          )}

        {/* 10. مكان المناسبة (Venue & Location Details) */}
        {isSectionEnabled('venue') &&
          primaryEvent &&
          (primaryEvent.venueNameAr?.trim() || primaryEvent.addressAr?.trim() || primaryEvent.date) && (
            <VenueLocationSection
              primaryEvent={primaryEvent}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          )}

        {/* 11. الخريطة (Interactive Map & Directions - Only if meaningful location info exists) */}
        {isSectionEnabled('map') && primaryEvent && hasLocationDetails && (
          <InteractiveMapSection
            venueName={primaryEvent.venueNameAr || undefined}
            address={primaryEvent.addressAr || undefined}
            latitude={primaryEvent.latitude}
            longitude={primaryEvent.longitude}
            googleMapsUrl={primaryEvent.googleMapsUrl}
            openStreetMapUrl={primaryEvent.openStreetMapUrl}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            invitationId={safeInv.id}
          />
        )}

        {/* 12. الزي Dress Code (Dress Code & Henna Notes - Only if dresscode or henna note exists) */}
        {isSectionEnabled('dresscode') &&
          primaryEvent &&
          (primaryEvent.dressCodeAr?.trim() || primaryEvent.isHennaFemaleOnly) && (
            <DressCodeSection
              dressCodeAr={primaryEvent.dressCodeAr}
              isHennaFemaleOnly={primaryEvent.isHennaFemaleOnly}
              secondaryColor={secondaryColor}
            />
          )}

        {/* 13. RSVP (Attendance Form) */}
        {isSectionEnabled('rsvp') && safeInv.rsvpEnabled && (
          <RsvpModal
            invitationId={safeInv.id}
            primaryColor={primaryColor}
          />
        )}

        {/* 14. إضافة للتقويم (Add to Calendar - Only if a valid event date exists) */}
        {isSectionEnabled('calendar') &&
          primaryEvent &&
          primaryEvent.date &&
          !isNaN(new Date(primaryEvent.date).getTime()) && (
            <section className="py-6 px-4 max-w-xl mx-auto text-center space-y-3">
              <h4 className="text-sm font-bold text-stone-800 font-cairo">
                احفظ موعد الفرح في تقويم هاتفك 📅
              </h4>
              <div className="flex justify-center">
                <AddToCalendar
                  invitationId={safeInv.id}
                  eventTitle={`حفل زفاف ${coupleNames}`}
                  eventDate={primaryEvent.date}
                  startTime={primaryEvent.startTime}
                  endTime={primaryEvent.endTime}
                  venueName={primaryEvent.venueNameAr}
                  address={primaryEvent.addressAr}
                />
              </div>
            </section>
          )}

        {/* 15. مشاركة الدعوة (Share Invitation) */}
        {isSectionEnabled('share') && (
          <ShareSheet
            coupleNames={coupleNames}
            invitationUrl={currentUrl}
            primaryColor={primaryColor}
            invitationId={safeInv.id}
          />
        )}

        {/* 16. تواصل واتساب (WhatsApp Direct Contact) */}
        {isSectionEnabled('whatsapp') && (
          <WhatsAppContactSection
            coupleNames={coupleNames}
            whatsappPhone={
              (safeInv as any).whatsappPhone ||
              (safeInv.themeConfig as any)?.whatsappPhone ||
              (safeInv as any).customer?.whatsapp ||
              (safeInv as any).customer?.phone ||
              '201019262075'
            }
            primaryColor={primaryColor}
            invitationId={safeInv.id}
          />
        )}

        {/* 17. رسالة الختام (Closing Message & Farahna Stamp) */}
        {isSectionEnabled('footer') && (
          <ClosingMessageSection
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            supportPhone={(safeInv as any)?.settings?.whatsappNumber || '201019262075'}
          />
        )}
      </main>

      {/* ✨ Discreet Floating Luxury CTA Pill (Quick reach-out without disrupting page beauty) */}
      {isEnvelopeOpen && !isBadgeDismissed && (
        <div className="fixed bottom-5 left-4 z-40 flex items-center gap-1 group animate-fade-in-up">
          <a
            href={`https://wa.me/${((safeInv as any)?.settings?.whatsappNumber || '201019262075').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              'السلام عليكم ورحمة الله وبركاته ❤️\nعجبني تصميم بطاقة الدعوة على منصة فرحنا وحابب استفسر وأصمم بطاقة خاصة لمناسبتي القادمة 💍'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-stone-950/85 hover:bg-stone-900 text-white shadow-xl backdrop-blur-md border border-amber-400/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="صمّم بطاقة دعوتك الخاصة مع فرحنا"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[11px] font-bold tracking-tight">صمّم دعوتك الخاصة ✨</span>
          </a>

          <button
            type="button"
            onClick={() => setIsBadgeDismissed(true)}
            className="w-6 h-6 rounded-full bg-stone-900/60 hover:bg-stone-900 text-stone-300 hover:text-white flex items-center justify-center text-xs backdrop-blur-md transition-all shadow-md opacity-0 group-hover:opacity-100 sm:opacity-75 cursor-pointer"
            title="إغلاق التنبيه"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
