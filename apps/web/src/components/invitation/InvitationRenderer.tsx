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
  // If envelopeAnimationEnabled is true, start closed
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(!invitation.envelopeAnimationEnabled);
  const [audioTriggered, setAudioTriggered] = useState(false);

  // Extract theme colors with fallback to theme config or sensible defaults
  const primaryColor =
    invitation.themeConfig?.primaryColor || theme?.config?.primaryColor || '#720925';
  const secondaryColor =
    invitation.themeConfig?.secondaryColor || theme?.config?.secondaryColor || '#D4AF37';
  const backgroundColor =
    invitation.themeConfig?.backgroundColor || theme?.config?.backgroundColor || '#FAF7F2';
  const textColor =
    invitation.themeConfig?.textColor || theme?.config?.textColor || '#1A1819';

  const coupleNames = `${invitation.coupleGroomAr} & ${invitation.coupleBrideAr}`;
  const visibleEvents = (events || []).filter((e) => e.isVisible !== false);
  const primaryEvent = visibleEvents[0] || events[0];

  // Helper function to check if a section is enabled
  const isSectionEnabled = (key: string): boolean => {
    if (!sections || sections.length === 0) return true;
    const match = sections.find((s) => s.sectionKey === key);
    return match ? match.isEnabled : true;
  };

  // Record page view analytics
  useEffect(() => {
    if (!isPreview && invitation.id) {
      recordPublicAnalytics({
        invitationId: invitation.id,
        eventType: 'page_view',
        deviceType:
          typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      });
    }
  }, [invitation.id, isPreview]);

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpen(true);
    setAudioTriggered(true);

    if (!isPreview && invitation.id) {
      recordPublicAnalytics({
        invitationId: invitation.id,
        eventType: 'envelope_open',
      });
    }
  };

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `https://farahna.menuflowx.com/invitation/${invitation.type}/${invitation.slug}`;

  return (
    <div
      className="min-h-screen transition-colors selection:bg-[#720925] selection:text-white"
      style={{ backgroundColor, color: textColor }}
    >
      {/* ⚠️ Preview Banner if in admin preview mode */}
      {isPreview && (
        <div className="sticky top-0 z-50 bg-amber-500 text-stone-950 px-4 py-2 text-center text-xs font-black shadow-md flex items-center justify-center gap-2">
          <span>⚠️ وضع المعاينة الآمنة — هذه النسخة غير معتمدة أو منشورة رسمياً بعد</span>
        </div>
      )}

      {/* 💌 Envelope Opening Overlay */}
      {invitation.envelopeAnimationEnabled && !isEnvelopeOpen && (
        <EnvelopeScreen
          coupleNames={coupleNames}
          onOpen={handleOpenEnvelope}
          isOpen={isEnvelopeOpen}
          primaryColor={primaryColor}
          themeSlug={theme?.slug}
        />
      )}

      {/* 🎵 Music Player (strictly plays only after user envelope interaction or manual click) */}
      {invitation.musicUrl && (
        <MusicPlayer
          musicUrl={invitation.musicUrl}
          musicTitle={invitation.musicTitle || 'موسيقى ليلة العمر'}
          shouldAutoTrigger={audioTriggered}
        />
      )}

      {/* Main Invitation Layout Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-14 animate-fade-in-up">
        {/* 1. الغلاف (Cover / Hero) */}
        {isSectionEnabled('cover') && (
          <CoverHeroSection
            coverImageUrl={invitation.coverImageUrl}
            invitationTitle={invitation.title}
            invitationType={invitation.type}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        )}

        {/* 2. أسماء العروسين (Couple Names) */}
        {isSectionEnabled('couple') && (
          <CoupleNamesSection
            coupleGroomAr={invitation.coupleGroomAr}
            coupleBrideAr={invitation.coupleBrideAr}
            coupleGroomEn={invitation.coupleGroomEn}
            coupleBrideEn={invitation.coupleBrideEn}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        )}

        {/* 3. رسالة الفرح (Wedding Message / Verse) */}
        {isSectionEnabled('message') && invitation.weddingMessageAr && (
          <WeddingMessageSection
            weddingMessageAr={invitation.weddingMessageAr}
            secondaryColor={secondaryColor}
          />
        )}

        {/* 4. Countdown Timer */}
        {isSectionEnabled('countdown') && invitation.countdownEnabled && (
          <CountdownTimer
            eventDate={invitation.eventDate}
            primaryColor={primaryColor}
          />
        )}

        {/* 5. تنقل بين المناسبات (Multi-Event Navigation Tabs - if multiple events) */}
        {isSectionEnabled('events') && visibleEvents.length > 1 && (
          <MultiEventTabs
            invitationId={invitation.id}
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
            invitationId={invitation.id}
            events={visibleEvents}
            coupleNames={coupleNames}
            primaryColor={primaryColor}
          />
        )}

        {/* 7. الأهل (Parents & Family Greetings) */}
        {isSectionEnabled('parents') && (
          <ParentsSection
            parentsGroomAr={invitation.parentsGroomAr}
            parentsBrideAr={invitation.parentsBrideAr}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        )}

        {/* 8. صور العروسين (Couple Portrait Photo) */}
        {isSectionEnabled('couple_photo') && invitation.coupleImageUrl && (
          <CouplePhotoSection
            coupleImageUrl={invitation.coupleImageUrl}
            coupleNames={coupleNames}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        )}

        {/* 9. الجاليري (Photo Session Gallery) */}
        {isSectionEnabled('gallery') &&
          invitation.galleryImages &&
          invitation.galleryImages.length > 0 && (
            <PhotoGallery
              images={invitation.galleryImages}
              coupleName={coupleNames}
            />
          )}

        {/* 10. مكان المناسبة (Venue & Location Details) */}
        {isSectionEnabled('venue') && primaryEvent && (
          <VenueLocationSection
            primaryEvent={primaryEvent}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        )}

        {/* 11. الخريطة (Interactive Map & Directions) */}
        {isSectionEnabled('map') && primaryEvent && (
          <InteractiveMapSection
            venueName={primaryEvent.venueNameAr}
            address={primaryEvent.addressAr}
            latitude={primaryEvent.latitude}
            longitude={primaryEvent.longitude}
            googleMapsUrl={primaryEvent.googleMapsUrl}
            openStreetMapUrl={primaryEvent.openStreetMapUrl}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            invitationId={invitation.id}
          />
        )}

        {/* 12. الـ Dress Code (Dress Code & Henna Notes) */}
        {isSectionEnabled('dresscode') && primaryEvent && (
          <DressCodeSection
            dressCodeAr={primaryEvent.dressCodeAr}
            isHennaFemaleOnly={primaryEvent.isHennaFemaleOnly}
            secondaryColor={secondaryColor}
          />
        )}

        {/* 13. RSVP (Attendance Form) */}
        {isSectionEnabled('rsvp') && invitation.rsvpEnabled && (
          <RsvpModal
            invitationId={invitation.id}
            primaryColor={primaryColor}
          />
        )}

        {/* 14. إضافة للتقويم (Add to Calendar) */}
        {isSectionEnabled('calendar') && primaryEvent && (
          <section className="py-6 px-4 max-w-xl mx-auto text-center space-y-3">
            <h4 className="text-sm font-bold text-stone-800 font-cairo">
              احفظ موعد الفرح في تقويم هاتفك 📅
            </h4>
            <div className="flex justify-center">
              <AddToCalendar
                invitationId={invitation.id}
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
            invitationId={invitation.id}
          />
        )}

        {/* 16. زرار واتساب (WhatsApp Direct Contact) */}
        {isSectionEnabled('whatsapp') && (
          <WhatsAppContactSection
            coupleNames={coupleNames}
            primaryColor={primaryColor}
            invitationId={invitation.id}
          />
        )}

        {/* 17. رسالة الختام (Closing Message & Farahna Stamp) */}
        {isSectionEnabled('footer') && (
          <ClosingMessageSection
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        )}
      </main>
    </div>
  );
}
