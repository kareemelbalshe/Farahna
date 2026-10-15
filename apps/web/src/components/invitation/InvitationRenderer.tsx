'use client';

import React, { useState, useEffect } from 'react';
import {
  InvitationDTO,
  InvitationEventDTO,
  ThemeDTO,
  InvitationSectionDTO,
} from '@farahna/shared';
import { EnvelopeScreen } from './EnvelopeScreen';
import { FloatingParticles } from './FloatingParticles';
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
import { getAutoRenewingDemoDate } from '@/lib/date';
import Link from 'next/link';
import { Sparkles, CameraOff, Edit3, X } from 'lucide-react';

export interface InvitationRendererProps {
  invitation: InvitationDTO;
  events: InvitationEventDTO[];
  theme: ThemeDTO;
  sections?: InvitationSectionDTO[];
  isPreview?: boolean;
  hidePreviewBanner?: boolean;
  initialEventId?: string;
  isEnvelopeOpen?: boolean;
  onEnvelopeOpen?: () => void;
  isMobileFrame?: boolean;
}

export function InvitationRenderer({
  invitation,
  events = [],
  theme,
  sections = [],
  isPreview = false,
  hidePreviewBanner = false,
  initialEventId,
  isEnvelopeOpen: controlledEnvelopeOpen,
  onEnvelopeOpen,
  isMobileFrame = false,
}: InvitationRendererProps) {
  // Safe invitation reference
  const safeInv = invitation || ({} as InvitationDTO);

  // If envelopeAnimationEnabled is true, start closed
  const [internalEnvelopeOpen, setInternalEnvelopeOpen] = useState(
    !safeInv.envelopeAnimationEnabled
  );
  const isEnvelopeOpen =
    controlledEnvelopeOpen !== undefined ? controlledEnvelopeOpen : internalEnvelopeOpen;

  const [audioTriggered, setAudioTriggered] = useState(false);
  const [showStickyDesignBar, setShowStickyDesignBar] = useState(true);

  // Distinguish compact simulator frame in admin from full standalone preview
  const isCompact = Boolean(isMobileFrame);

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

  // Check if invitation is a default / demo invitation that should auto-renew
  const isDemo = Boolean(
    (safeInv as any).isDemo ||
      (safeInv as any).isMock ||
      safeInv.id?.startsWith('inv-') ||
      safeInv.id?.startsWith('demo-') ||
      safeInv.id === 'studio-preview' ||
      ['ahmed-sara', 'omar-salma', 'mariam-youssef', 'karim-nada'].some((s) =>
        safeInv.slug?.includes(s)
      )
  );

  // Resolve effective event date (auto-renew for demo invitations if expired/passed)
  const rawEventDate = safeInv.eventDate || primaryEvent?.date || null;
  const effectiveEventDate =
    isDemo && rawEventDate
      ? getAutoRenewingDemoDate(rawEventDate).toISOString()
      : rawEventDate;

  const hasValidEventDate = Boolean(
    effectiveEventDate && !isNaN(new Date(effectiveEventDate).getTime())
  );

  // Robust fallback primary event so newly created / draft invitations never appear empty or broken
  const fallbackEvent: InvitationEventDTO = {
    id: `evt-auto-${safeInv.id || 'default'}`,
    invitationId: safeInv.id || 'default',
    type: (safeInv.type as any) || 'wedding',
    titleAr:
      safeInv.type === 'henna'
        ? 'ليلة الحنة وسهرة العروس 🌿'
        : safeInv.type === 'engagement'
        ? 'حفل الخطوبة المبارك 💍'
        : safeInv.type === 'katb_ketab'
        ? 'عقد القران وكتب الكتاب 📜'
        : 'حفل الزفاف والزفة الكبرى 👑',
    date: effectiveEventDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    startTime: '08:00 م',
    endTime: '01:00 ص',
    venueNameAr: (safeInv as any).venueNameAr?.trim() || 'قاعة الحفل الملكية',
    addressAr: (safeInv as any).addressAr?.trim() || 'القاهرة، مصر',
    googleMapsUrl: (safeInv as any).googleMapsUrl?.trim() || 'https://maps.google.com/?q=Cairo',
    dressCodeAr:
      (safeInv as any).dressCodeAr?.trim() ||
      (safeInv as any).themeConfig?.dressCode ||
      'ملابس رسمية فاخرة وفستان سواريه أنيق 🎩👗',
    descriptionAr: (safeInv as any).descriptionAr?.trim() || 'يسعدنا ويشرفنا حضوركم ومشاركتنا أجمل لحظات العمر.',
    isVisible: true,
    sortOrder: 1,
    isHennaFemaleOnly: safeInv.type === 'henna',
  };

  const effectivePrimaryEvent = primaryEvent || fallbackEvent;

  // Effective location fields with fallback to root invitation attributes or fallback event
  const effectiveVenueName =
    primaryEvent?.venueNameAr?.trim() ||
    (safeInv as any).venueNameAr?.trim() ||
    (safeInv as any).venueAddressAr?.trim() ||
    effectivePrimaryEvent.venueNameAr ||
    '';
  const effectiveAddress =
    primaryEvent?.addressAr?.trim() ||
    (safeInv as any).addressAr?.trim() ||
    effectivePrimaryEvent.addressAr ||
    '';
  const effectiveGoogleMapsUrl =
    primaryEvent?.googleMapsUrl?.trim() ||
    (safeInv as any).googleMapsUrl?.trim() ||
    effectivePrimaryEvent.googleMapsUrl ||
    '';
  const effectiveLatitude =
    primaryEvent?.latitude ?? (safeInv as any).latitude ?? 30.0571;
  const effectiveLongitude =
    primaryEvent?.longitude ?? (safeInv as any).longitude ?? 31.2246;
  const effectiveOpenStreetMapUrl =
    primaryEvent?.openStreetMapUrl?.trim() || (safeInv as any).openStreetMapUrl?.trim() || '';

  // Check if primary event or root invitation has meaningful location details
  const hasLocationDetails = Boolean(
    effectiveVenueName ||
      effectiveAddress ||
      effectiveGoogleMapsUrl ||
      Boolean(effectiveLatitude && effectiveLongitude) ||
      effectivePrimaryEvent.venueNameAr
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
    setInternalEnvelopeOpen(true);
    setAudioTriggered(true);
    if (onEnvelopeOpen) {
      onEnvelopeOpen();
    }

    if (!isPreview && safeInv.id) {
      recordPublicAnalytics({
        invitationId: safeInv.id,
        eventType: 'envelope_open',
      });
    }
  };

  const defaultUrl = `https://farahna.menuflowx.com/invitation/${safeInv.type || 'wedding'}/${safeInv.slug || ''}`;
  const [currentUrl, setCurrentUrl] = useState(defaultUrl);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const isDark = Boolean(
    (backgroundColor &&
      ['#0', '#1', '#2', 'black'].some((p) => backgroundColor.toLowerCase().startsWith(p))) ||
      theme?.slug === 'elegant-gold'
  );

  const isVip = Boolean(
    (safeInv as any).isVip ||
    (safeInv as any).themeConfig?.selectedPackage === 'luxury-vip' ||
    (safeInv as any).selectedPackage === 'luxury-vip'
  );
  const enableRoyalShimmer = Boolean(
    (safeInv as any).enableRoyalShimmer ||
    (safeInv as any).themeConfig?.enableRoyalShimmer ||
    isVip
  );
  const waxSealMonogram =
    (safeInv as any).waxSealMonogram ||
    (safeInv as any).themeConfig?.waxSealMonogram ||
    null;

  const openingStyle =
    safeInv.themeConfig?.openingStyle ||
    (theme?.config as any)?.openingStyle ||
    'wax-seal';

  const backgroundPattern =
    safeInv.themeConfig?.backgroundPattern ||
    (theme?.config as any)?.backgroundPattern ||
    (isDark ? 'stars' : 'damask');

  const innerCardStyle =
    safeInv.themeConfig?.innerCardStyle ||
    (theme?.config as any)?.innerCardStyle ||
    'arched';

  const floatingParticles =
    safeInv.themeConfig?.floatingParticles ||
    (theme?.config as any)?.floatingParticles ||
    (isVip ? 'golden-dust' : 'none');

  const isEnvelopeActive = Boolean(
    safeInv.envelopeAnimationEnabled && isSectionEnabled('envelope') && !isEnvelopeOpen
  );

  return (
    <div
      className={`${
        isMobileFrame && isEnvelopeActive
          ? 'h-full max-h-full overflow-hidden'
          : 'min-h-full'
      } flex flex-col transition-colors selection:bg-[#720925] selection:text-white relative overflow-x-hidden pattern-${backgroundPattern} ${
        isDark ? 'invitation-dark-theme dark' : ''
      }`}
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

      {/* Floating Particles Effect (Gold Dust or Rose Petals) */}
      <FloatingParticles type={floatingParticles} />

      {/* Floating Royal Gold Shimmer Effect for VIP */}
      {enableRoyalShimmer && (
        <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
          <div className="absolute top-12 right-[12%] w-2.5 h-2.5 rounded-full bg-amber-400/80 blur-2xs animate-ping" />
          <div className="absolute top-36 left-[8%] w-3 h-3 rounded-full bg-amber-300/90 blur-2xs animate-pulse" />
          <div className="absolute top-[55%] right-[10%] w-2 h-2 rounded-full bg-amber-400/70 blur-2xs animate-ping" />
          <div className="absolute top-[75%] left-[15%] w-3 h-3 rounded-full bg-amber-300/80 blur-2xs animate-pulse" />
        </div>
      )}

      {/* 👑 Preview Banner if in admin preview mode */}
      {isPreview && !hidePreviewBanner && (
        <div className="sticky top-0 z-50 bg-amber-500 text-stone-950 px-4 py-2 text-center text-xs font-black shadow-md flex items-center justify-center gap-2">
          <span>👑 وضع المعاينة الآمنة — هذه النسخة غير معتمدة أو منشورة رسمياً بعد</span>
        </div>
      )}

      {/* 💌 Envelope / Opening Screen Overlay */}
      {safeInv.envelopeAnimationEnabled && isSectionEnabled('envelope') && !isEnvelopeOpen && (
        <EnvelopeScreen
          coupleNames={coupleNames}
          coupleGroomAr={safeInv.coupleGroomAr}
          coupleBrideAr={safeInv.coupleBrideAr}
          onOpen={handleOpenEnvelope}
          isOpen={isEnvelopeOpen}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          backgroundColor={backgroundColor}
          textColor={textColor}
          themeSlug={theme?.slug}
          weddingMessageAr={safeInv.weddingMessageAr}
          eventDate={effectiveEventDate}
          invitationTitle={safeInv.title}
          waxSealMonogram={waxSealMonogram}
          openingStyle={openingStyle}
          backgroundPattern={backgroundPattern}
          innerCardStyle={innerCardStyle}
          isPreview={isPreview}
        />
      )}

      {/* Main Invitation Layout Container */}
      <main
        className={`${
          isMobileFrame && isEnvelopeActive ? 'hidden' : ''
        } ${
          isMobileFrame
            ? 'w-full mx-auto px-2 py-3 space-y-4 max-w-full'
            : 'max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-14 animate-fade-in-up'
        }`}
      >
        {/* VIP Crown Badge */}
        {isVip && (
          <div className="text-center pt-1 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-300/30 via-amber-100/50 to-amber-300/30 text-amber-950 border border-amber-400 text-xs font-black shadow-xs tracking-wider backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>دعوة ملكية خاصة VIP 💎</span>
            </span>
          </div>
        )}
        {/* 1. الغلاف (Cover / Hero) */}
        {isSectionEnabled('cover') && (
          <CoverHeroSection
            coverImageUrl={safeInv.coverImageUrl}
            invitationTitle={safeInv.title}
            invitationType={safeInv.type}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            isPreview={isPreview}
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
            isPreview={isPreview}
          />
        )}

        {/* 3. رسالة الفرح (Wedding Message / Verse) */}
        {isSectionEnabled('message') && safeInv.weddingMessageAr?.trim() && (
          <WeddingMessageSection
            weddingMessageAr={safeInv.weddingMessageAr}
            secondaryColor={secondaryColor}
            isPreview={isPreview}
          />
        )}

        {/* 4. العداد التنازلي (Countdown Timer - Only if valid date exists) */}
        {isSectionEnabled('countdown') && safeInv.countdownEnabled && hasValidEventDate && (
          <CountdownTimer
            eventDate={effectiveEventDate!}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            isDark={isDark}
            autoRenew={isDemo}
            isPreview={isPreview}
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
            isPreview={isPreview}
          />
        )}

        {/* 6. Timeline المناسبات (Events Timeline - if multiple events) */}
        {isSectionEnabled('timeline') && visibleEvents.length > 1 && (
          <EventTimeline
            invitationId={safeInv.id}
            events={visibleEvents}
            coupleNames={coupleNames}
            primaryColor={primaryColor}
            isPreview={isPreview}
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
              isPreview={isPreview}
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
              isPreview={isPreview}
            />
          )}

        {/* 9. الجاليري (Photo Session Gallery - Only if displayable images exist) */}
        {isSectionEnabled('gallery') &&
          Array.isArray(safeInv.galleryImages) &&
          safeInv.galleryImages.filter((img) => typeof img === 'string' && img.trim().length > 0).length > 0 && (
            <PhotoGallery
              images={safeInv.galleryImages.filter((img) => typeof img === 'string' && img.trim().length > 0)}
              coupleName={coupleNames}
              isPreview={isPreview}
            />
          )}

        {/* 10. مكان المناسبة (Venue & Location Details) */}
        {isSectionEnabled('venue') &&
          effectivePrimaryEvent &&
          (effectivePrimaryEvent.venueNameAr?.trim() || effectivePrimaryEvent.addressAr?.trim() || effectivePrimaryEvent.date) && (
            <VenueLocationSection
              primaryEvent={effectivePrimaryEvent}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              isPreview={isPreview}
            />
          )}

        {/* 11. الخريطة (Interactive Map & Directions - Only if meaningful location info exists) */}
        {isSectionEnabled('map') && hasLocationDetails && (
          <InteractiveMapSection
            venueName={effectiveVenueName || undefined}
            address={effectiveAddress || undefined}
            latitude={effectiveLatitude}
            longitude={effectiveLongitude}
            googleMapsUrl={effectiveGoogleMapsUrl || undefined}
            openStreetMapUrl={effectiveOpenStreetMapUrl || undefined}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            invitationId={safeInv.id}
            isPreview={isPreview}
          />
        )}

        {/* 12. الزي Dress Code (Dress Code & Henna Notes - Only if dresscode or henna note exists) */}
        {isSectionEnabled('dresscode') &&
          effectivePrimaryEvent &&
          (effectivePrimaryEvent.dressCodeAr?.trim() || effectivePrimaryEvent.isHennaFemaleOnly) && (
            <DressCodeSection
              dressCodeAr={effectivePrimaryEvent.dressCodeAr}
              isHennaFemaleOnly={effectivePrimaryEvent.isHennaFemaleOnly}
              secondaryColor={secondaryColor}
              isPreview={isPreview}
            />
          )}

        {/* 12.1. قسم ليلة الحنة المخصص للسيدات (VIP Henna Special Section) */}
        {(isSectionEnabled('henna_special') ||
          (isVip && ((safeInv.themeConfig as any)?.hennaSpecialEnabled || (safeInv as any).hennaSpecialEnabled))) && (
          <section className="py-6 px-3 sm:px-4 max-w-2xl mx-auto space-y-4 text-center font-cairo">
            <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-rose-50/90 via-white to-amber-50/70 border-2 border-rose-300/80 shadow-md space-y-4">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-100 text-[#720925] border border-rose-300 text-xs font-black shadow-2xs">
                <Sparkles className="w-4 h-4 text-rose-600" />
                <span>ليلة الحنة — حفل خاص بالسيدات فقط 🌸</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-rose-950">
                أهلاً بكم في ليلة حنة العروس 🌿
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
                {(safeInv.themeConfig as any)?.hennaMessage ||
                  (safeInv as any).hennaMessage ||
                  'يسعدنا تشريفكم في ليلة الحنة المبهجة في أجواء راقية ومخصصة للسيدات فقط للاحتفال بالعروس.'}
              </p>
              {((safeInv.themeConfig as any)?.hennaPasscode || (safeInv as any).hennaPasscode) && (
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white border border-rose-200 shadow-2xs">
                  <span className="text-xs font-bold text-stone-700">رمز الدخول الخاص:</span>
                  <span className="font-mono text-base font-black text-[#720925] tracking-widest" dir="ltr">
                    {(safeInv.themeConfig as any)?.hennaPasscode || (safeInv as any).hennaPasscode}
                  </span>
                </div>
              )}
              <div className="pt-1 flex items-center justify-center gap-2 text-xs font-bold text-rose-800">
                <CameraOff className="w-4 h-4 text-rose-600 shrink-0" />
                <span>نرجو عدم التصوير احتراماً لخصوصية العروس والمعازيم ❤️</span>
              </div>
            </div>
          </section>
        )}

        {/* 13. RSVP (Attendance Form) */}
        {isSectionEnabled('rsvp') && safeInv.rsvpEnabled && (
          <RsvpModal
            invitationId={safeInv.id}
            primaryColor={primaryColor}
          />
        )}

        {/* 14. إضافة للتقويم (Add to Calendar - Only if a valid event date exists) */}
        {isSectionEnabled('calendar') && hasValidEventDate && (
          <section className="py-6 px-4 max-w-xl mx-auto text-center space-y-3">
            <h4 className="text-sm font-bold text-stone-800 font-cairo theme-heading">
              احفظ موعد الفرح في تقويم هاتفك 📅
            </h4>
            <div className="flex justify-center">
              <AddToCalendar
                invitationId={safeInv.id}
                eventTitle={
                  primaryEvent?.titleAr
                    ? `${primaryEvent.titleAr} - ${coupleNames}`
                    : `حفل زفاف ${coupleNames}`
                }
                eventDate={effectiveEventDate!}
                startTime={primaryEvent?.startTime || (safeInv as any).startTime || '08:00 م'}
                endTime={primaryEvent?.endTime || (safeInv as any).endTime || '01:00 ص'}
                venueName={
                  primaryEvent?.venueNameAr ||
                  (safeInv as any).venueNameAr ||
                  'قاعة الفرح'
                }
                address={
                  primaryEvent?.addressAr ||
                  (safeInv as any).addressAr ||
                  'القاهرة، مصر'
                }
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

        {/* 16. تواصل واتساب (WhatsApp Direct Contact with Couple) */}
        {(() => {
          const rawWhatsapp =
            (safeInv.themeConfig as any)?.whatsappPhone !== undefined
              ? (safeInv.themeConfig as any)?.whatsappPhone
              : (safeInv as any).whatsappPhone !== undefined
              ? (safeInv as any).whatsappPhone
              : (safeInv as any).customer?.whatsapp ||
                (safeInv as any).customer?.phone ||
                (isDemo ? '201019262075' : null);

          const isWhatsappContactEnabled =
            (safeInv.themeConfig as any)?.whatsappContactEnabled !== false;

          const finalPhone =
            typeof rawWhatsapp === 'string' && rawWhatsapp.trim().length > 0
              ? rawWhatsapp.trim()
              : null;

          if (!isSectionEnabled('whatsapp') || !isWhatsappContactEnabled || !finalPhone) {
            return null;
          }

          return (
            <WhatsAppContactSection
              coupleNames={coupleNames}
              whatsappPhone={finalPhone}
              primaryColor={primaryColor}
              invitationId={safeInv.id}
            />
          );
        })()}

        {/* 17. رسالة الختام (Closing Message & Farahna Stamp) */}
        {isSectionEnabled('footer') && (
          <ClosingMessageSection
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            supportPhone={(safeInv as any)?.settings?.whatsappNumber || '201019262075'}
            templateSlug={safeInv.slug}
            themeSlug={theme?.slug}
            invitationType={safeInv.type}
            groomName={safeInv.coupleGroomAr}
            brideName={safeInv.coupleBrideAr}
            isPreview={isPreview}
          />
        )}
      </main>

      {/* 🎵 Music Player (Sticky Floating Dock in Preview, Fixed in Live) */}
      {safeInv.musicUrl && typeof safeInv.musicUrl === 'string' && safeInv.musicUrl.trim() && isEnvelopeOpen && (
        <MusicPlayer
          musicUrl={safeInv.musicUrl.trim()}
          musicTitle={safeInv.musicTitle?.trim() || 'موسيقى ليلة العمر'}
          shouldAutoTrigger={audioTriggered}
          isPreview={isPreview}
        />
      )}

      {/* 🪄 Floating Studio CTA dock for Demo Visitors */}
      {!isPreview && isEnvelopeOpen && showStickyDesignBar && (
        <aside
          aria-label="صمم دعوتك بنفسك"
          className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-50 animate-fade-in-up"
        >
          <div className="relative bg-stone-950/90 text-white backdrop-blur-xl border border-amber-400/40 shadow-2xl rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-amber-300 truncate">
                  عجبك ستايل هذا النموذج؟ 💍
                </p>
                <p className="text-[11px] text-stone-300 truncate">
                  عدّل كل حاجة مكتوبة وصمّم دعوتك بنفسك
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/create?template=${safeInv.slug || ''}&theme=${theme?.slug || ''}&type=${safeInv.type || 'wedding'}&groom=${encodeURIComponent(safeInv.coupleGroomAr || '')}&bride=${encodeURIComponent(safeInv.coupleBrideAr || '')}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-stone-950 text-xs font-black shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>صمّم الآن</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowStickyDesignBar(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                title="إغلاق الشريط"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
