'use client';

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  Eye,
  Sparkles,
  Heart,
  Palette,
  Calendar,
  Layers,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  QURANIC_VERSES_PRESETS,
  WEDDING_MUSIC_PRESETS,
  DEFAULT_THEMES,
  DEFAULT_SECTIONS,
  generateInvitationSlug,
  extractCoordinatesFromUrl,
  resolveCityCoordinates,
  getOpenStreetMapUrl,
} from '@farahna/shared';
import { submitPublicDesign, fetchPricingPlans, fetchSiteSettings } from '@/lib/api';
import {
  validateMapUrl,
  validatePhoneNumber,
} from '@/lib/validation';
import { DEFAULT_DEMOS } from '@/components/landing/DemoGallery';
import {
  MOCK_OMAR_SALMA,
  MOCK_AHMED_SARA,
  MOCK_MARIAM_YOUSSEF,
  MOCK_KARIM_NADA,
} from '@/lib/mockInvitationData';

// Modular Studio Components & Constants
import {
  PACKAGES,
  FONT_TIERS,
  INITIAL_JOURNEY_EVENTS,
  LOCAL_STORAGE_KEY,
  LOCAL_STORAGE_ORDER_KEY,
  normalizeColor,
  PackageTier,
  JourneyEvent,
} from '@/components/studio/studioConstants';
import { StudioHeader } from '@/components/studio/StudioHeader';
import { PackageStep } from '@/components/studio/PackageStep';
import { CoupleDetailsStep } from '@/components/studio/CoupleDetailsStep';
import { SectionsManagerStep } from '@/components/studio/SectionsManagerStep';
import { VerseStep } from '@/components/studio/VerseStep';
import { MusicStep } from '@/components/studio/MusicStep';
import { ThemeCustomizerStep } from '@/components/studio/ThemeCustomizerStep';
import { EventVenueStep } from '@/components/studio/EventVenueStep';
import { PhotosStep } from '@/components/studio/PhotosStep';
import { WhatsAppContactStep } from '@/components/studio/WhatsAppContactStep';
import { StudioMobileSimulator } from '@/components/studio/StudioMobileSimulator';
import { CheckoutModal } from '@/components/studio/CheckoutModal';
import { TierNoticeModal } from '@/components/studio/TierNoticeModal';

function StudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Package & Theme (with live dynamic pricing from backend)
  const [packagesList, setPackagesList] = useState<PackageTier[]>(PACKAGES);
  const [selectedPackage, setSelectedPackage] = useState('wedding-journey');
  const [selectedThemeId, setSelectedThemeId] = useState('theme-royal-burgundy');
  const [selectedFont, setSelectedFont] = useState("'Cairo', sans-serif");
  const [paymentPhone, setPaymentPhone] = useState('01064906723');
  const [studioTab, setStudioTab] = useState<'couple' | 'theme' | 'events' | 'media' | 'sections'>('couple');

  // Load dynamic pricing and site settings from backend database
  useEffect(() => {
    let isMounted = true;
    fetchPricingPlans()
      .then((plans) => {
        if (!isMounted || !plans || plans.length === 0) return;
        setPackagesList((prev) =>
          prev.map((pkg) => {
            const match = plans.find((p) => p.slug === pkg.id || p.id === pkg.id);
            if (!match) return pkg;
            return {
              ...pkg,
              name: match.nameAr || pkg.name,
              price: Number(match.price),
              priceLabel: match.priceLabel || `${match.price} ج.م`,
              badge: match.badge || pkg.badge,
            };
          })
        );
      })
      .catch((err) => {
        console.error('Failed to load dynamic pricing in studio', err);
      });

    fetchSiteSettings()
      .then((settings) => {
        if (!isMounted || !settings) return;
        if (settings.paymentPhone) {
          setPaymentPhone(settings.paymentPhone);
        }
      })
      .catch((err) => {
        console.error('Failed to load payment settings in studio', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const basicPlan = packagesList.find((p) => p.id === 'basic') || packagesList[0];
  const journeyPlan = packagesList.find((p) => p.id === 'wedding-journey') || packagesList[1];
  const vipPlan = packagesList.find((p) => p.id === 'luxury-vip') || packagesList[2];

  const basicPrice = basicPlan?.price || 50;
  const journeyPrice = journeyPlan?.price || 95;
  const vipPrice = vipPlan?.price || 150;

  const basicToJourneyDiff = Math.max(0, journeyPrice - basicPrice);
  const journeyToVipDiff = Math.max(0, vipPrice - journeyPrice);
  const basicToVipDiff = Math.max(0, vipPrice - basicPrice);

  const getTierBadgeText = (tier: 'basic' | 'wedding-journey' | 'luxury-vip') => {
    if (tier === 'luxury-vip') return `حصري VIP (${vipPlan.priceLabel}) 💎`;
    if (tier === 'wedding-journey') return `باقة ${journeyPlan.priceLabel} و VIP 👑`;
    return 'متاح للجميع';
  };

  // Custom Colors Override (Live Real-Time Editing)
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string>('#720925');
  const [customSecondaryColor, setCustomSecondaryColor] = useState<string>('#D4AF37');
  const [customBackgroundColor, setCustomBackgroundColor] = useState<string>('#FAF7F2');

  // Diverse Animations, Patterns & Inner Card Styles
  const [openingStyle, setOpeningStyle] = useState('wax-seal');
  const [backgroundPattern, setBackgroundPattern] = useState('damask');
  const [innerCardStyle, setInnerCardStyle] = useState('arched');
  const [previewCardInspectMode, setPreviewCardInspectMode] = useState(false);
  const [floatingParticles, setFloatingParticles] = useState('golden-dust');

  // Couple Details
  const [coupleGroomAr, setCoupleGroomAr] = useState('');
  const [coupleBrideAr, setCoupleBrideAr] = useState('');
  const [coupleGroomEn, setCoupleGroomEn] = useState('');
  const [coupleBrideEn, setCoupleBrideEn] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('wedding');

  // Unique random slug suffix per session to prevent duplicates
  const [slugSuffix, setSlugSuffix] = useState<string>(() =>
    Math.random().toString(36).substring(2, 6).toLowerCase()
  );

  const generatedSlug = useMemo(() => {
    return generateInvitationSlug(coupleGroomAr || 'العريس', coupleBrideAr || 'العروس', slugSuffix);
  }, [coupleGroomAr, coupleBrideAr, slugSuffix]);

  // Quranic Verse / Wedding Message
  const [selectedVerseId, setSelectedVerseId] = useState('mawaddah');
  const [customWeddingMessage, setCustomWeddingMessage] = useState(
    QURANIC_VERSES_PRESETS[0].verse
  );

  // Music Selection
  const [selectedMusicId, setSelectedMusicId] = useState('piano-romance');
  const [customMusicUrl, setCustomMusicUrl] = useState(WEDDING_MUSIC_PRESETS[0].url);
  const [customMusicTitle, setCustomMusicTitle] = useState(WEDDING_MUSIC_PRESETS[0].title);
  const [audioPreviewing, setAudioPreviewing] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Event & Venue
  const [eventDate, setEventDate] = useState('2026-11-20T19:00:00');
  const [venueNameAr, setVenueNameAr] = useState('');
  const [addressAr, setAddressAr] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [isMultiEvent, setIsMultiEvent] = useState(true);

  // Media & Social Link Preview
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coupleImageUrl, setCoupleImageUrl] = useState('');
  const [customOgImageUrl, setCustomOgImageUrl] = useState('');

  // Family / Parents details
  const [parentsGroomAr, setParentsGroomAr] = useState('');
  const [parentsBrideAr, setParentsBrideAr] = useState('');

  // Journey Multi-Events State (الخطوبة، الحنة، كتب الكتاب، الفرح)
  const [journeyEvents, setJourneyEvents] = useState<JourneyEvent[]>(INITIAL_JOURNEY_EVENTS);
  const [activeJourneyEventIndex, setActiveJourneyEventIndex] = useState(0);

  // VIP Exclusive State
  const [galleryImages, setGalleryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
  ]);
  const [customGalleryUrlInput, setCustomGalleryUrlInput] = useState('');
  const [hennaPasscode, setHennaPasscode] = useState('2026');
  const [hennaFemaleOnly, setHennaFemaleOnly] = useState(true);
  const [hennaMessage, setHennaMessage] = useState(
    'يسعدنا تشريفكم في ليلة الحنة المبهجة في أجواء راقية وخاصة بالسيدات فقط للاحتفال بالعروس.'
  );
  const [enableRoyalShimmer, setEnableRoyalShimmer] = useState(true);
  const [waxSealMonogram, setWaxSealMonogram] = useState('');

  // WhatsApp Couple Direct Contact
  const [whatsappContactPhone, setWhatsappContactPhone] = useState('201019262075');
  const [whatsappContactEnabled, setWhatsappContactEnabled] = useState(true);

  // Section Visibility Toggles
  const [sectionsVisibility, setSectionsVisibility] = useState<Record<string, boolean>>({
    envelope: true,
    cover: true,
    couple: true,
    message: true,
    countdown: true,
    venue: true,
    map: true,
    parents: false,
    couple_photo: true,
    gallery: true,
    henna_special: false,
    music: true,
    rsvp: true,
    calendar: true,
    share: true,
    whatsapp: true,
  });

  const toggleSection = (key: string) => {
    setSectionsVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // UI state
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [previewViewMode, setPreviewViewMode] = useState<'phone' | 'full'>('phone');
  const [envelopePreviewOpen, setEnvelopePreviewOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [templateNotice, setTemplateNotice] = useState<string | null>(null);

  // Studio Design Validation Error State
  const [designValidationError, setDesignValidationError] = useState<string | null>(null);

  // Interactive Tier Gating Notice Modal & Feedback Toast
  const [tierNoticeModal, setTierNoticeModal] = useState<{
    isOpen: boolean;
    featureTitle: string;
    featureDescription: string;
    requiredPackageId: 'basic' | 'wedding-journey' | 'luxury-vip';
    onUpgradeAction?: () => void;
  } | null>(null);
  const [tierFeedbackToast, setTierFeedbackToast] = useState<string | null>(null);

  // Helper to check if a feature tier is permitted for current package
  const isTierAllowed = (requiredTier: 'basic' | 'wedding-journey' | 'luxury-vip'): boolean => {
    if (requiredTier === 'basic') return true;
    if (requiredTier === 'wedding-journey') {
      return selectedPackage === 'wedding-journey' || selectedPackage === 'luxury-vip';
    }
    if (requiredTier === 'luxury-vip') {
      return selectedPackage === 'luxury-vip';
    }
    return false;
  };

  const triggerTierNotice = (params: {
    featureTitle: string;
    featureDescription: string;
    requiredPackageId: 'basic' | 'wedding-journey' | 'luxury-vip';
    onUpgradeAction?: () => void;
  }) => {
    setTierNoticeModal({
      isOpen: true,
      featureTitle: params.featureTitle,
      featureDescription: params.featureDescription,
      requiredPackageId: params.requiredPackageId,
      onUpgradeAction: params.onUpgradeAction,
    });
  };

  const handleUpgradeToPackage = (
    targetPkgId: 'basic' | 'wedding-journey' | 'luxury-vip',
    featureName?: string
  ) => {
    setSelectedPackage(targetPkgId);
    if (targetPkgId !== 'basic') {
      setIsMultiEvent(true);
      setSectionsVisibility((prev) => ({
        ...prev,
        events: true,
        envelope: true,
        music: true,
        rsvp: true,
      }));
    }
    if (targetPkgId === 'luxury-vip') {
      setSectionsVisibility((prev) => ({
        ...prev,
        events: true,
        envelope: true,
        music: true,
        rsvp: true,
        gallery: true,
        henna_special: true,
      }));
    }

    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: targetPkgId === 'luxury-vip' ? ['#D4AF37', '#FFD700', '#F59E0B'] : ['#720925', '#D4AF37', '#E11D48'],
      });
    } catch {
      // ignore
    }

    const targetPkg = packagesList.find((p) => p.id === targetPkgId);
    setTierFeedbackToast(
      `تمت ترقية باقتك إلى [${targetPkg?.name}] بنجاح! ${featureName ? `وتم تفعيل ميزة (${featureName}) 🪄` : ''}`
    );
    setTimeout(() => setTierFeedbackToast(null), 5000);
    setTierNoticeModal(null);
  };

  // Payment / Checkout Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'vodafone_cash'>('instapay');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentProofBase64, setPaymentProofBase64] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Post-submission Success State
  const [submittedOrder, setSubmittedOrder] = useState<any>(null);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [audioUploadSuccess, setAudioUploadSuccess] = useState<string | null>(null);

  // Handle local audio file upload (MP3) to server storage
  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('حجم الملف الصوتي كبير جداً، الحد الأقصى المسموح به 15 ميجابايت');
      return;
    }

    const songTitle = file.name.replace(/\.[^/.]+$/, '');
    setCustomMusicTitle(songTitle);
    setSelectedMusicId('custom-link');
    setIsUploadingAudio(true);
    setAudioUploadSuccess(null);

    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      setAudioPreviewing(null);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'music');

      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const uploadUrl = `${apiBase.replace(/\/+$/, '')}/public/upload-audio`;

      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.data?.url) {
        setCustomMusicUrl(data.data.url);
        setAudioUploadSuccess('تم حفظ الصوت على السيرفر بنجاح ✅');
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setCustomMusicUrl(reader.result as string);
          setAudioUploadSuccess('تم تجهيز الملف الصوتي بنجاح ✅');
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomMusicUrl(reader.result as string);
        setAudioUploadSuccess('تم تجهيز الملف الصوتي بنجاح ✅');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingAudio(false);
    }
  };

  // Handle local image file upload (Cover / Portrait / WhatsApp Preview)
  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    uploadCategory: 'og' | 'cover' | 'couple'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 10 ميجابايت');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (uploadCategory === 'og') {
        setCustomOgImageUrl(dataUrl);
      } else if (uploadCategory === 'cover') {
        setCoverImageUrl(dataUrl);
        setSectionsVisibility((prev) => ({ ...prev, cover: true }));
      } else if (uploadCategory === 'couple') {
        setCoupleImageUrl(dataUrl);
        setSectionsVisibility((prev) => ({ ...prev, couple_photo: true }));
      }
    };
    reader.readAsDataURL(file);
  };

  // 1. Load Draft from LocalStorage or Query Parameters on mount
  useEffect(() => {
    try {
      const templateParam = searchParams.get('template');
      const packageParam = searchParams.get('package');
      const themeParam = searchParams.get('theme');
      const typeParam = searchParams.get('type');
      const groomParam = searchParams.get('groom');
      const brideParam = searchParams.get('bride');
      const groomEnParam = searchParams.get('groomEn');
      const brideEnParam = searchParams.get('brideEn');
      const venueParam = searchParams.get('venue');
      const cityParam = searchParams.get('city');

      if (templateParam || packageParam || themeParam || typeParam || groomParam) {
        const matchedDemo = DEFAULT_DEMOS.find(
          (d) =>
            d.id === templateParam ||
            d.slug === templateParam ||
            (templateParam && d.id.includes(templateParam)) ||
            (templateParam && d.slug.includes(templateParam))
        );

        const mockDataMap: Record<string, any> = {
          'demo-1': MOCK_OMAR_SALMA,
          'demo-2': MOCK_AHMED_SARA,
          'demo-3': MOCK_MARIAM_YOUSSEF,
          'demo-4': MOCK_KARIM_NADA,
          'demo-5': MOCK_OMAR_SALMA,
          'demo-6': MOCK_AHMED_SARA,
          'demo-7': MOCK_MARIAM_YOUSSEF,
          'demo-8': MOCK_KARIM_NADA,
        };

        const mockSource = matchedDemo ? mockDataMap[matchedDemo.id] : null;

        if (templateParam && matchedDemo) {
          setTemplateNotice(
            `تم تجهيز وتطبيق قالب (${matchedDemo.coupleNames || matchedDemo.themeName}) في الاستوديو بالكامل! يمكنك الآن تعديل الأسماء والبيانات بحرية 🪄`
          );
          setTimeout(() => setTemplateNotice(null), 8000);
        }

        if (packageParam) setSelectedPackage(packageParam);
        else if (matchedDemo?.packageId) setSelectedPackage(matchedDemo.packageId);

        if (themeParam) {
          setSelectedThemeId(themeParam.startsWith('theme-') ? themeParam : `theme-${themeParam}`);
        } else if (matchedDemo?.themeSlug) {
          setSelectedThemeId(`theme-${matchedDemo.themeSlug}`);
        }

        if (typeParam) setType(typeParam);
        if (groomParam) setCoupleGroomAr(groomParam);
        else if (mockSource?.invitation?.coupleGroomAr) setCoupleGroomAr(mockSource.invitation.coupleGroomAr);

        if (brideParam) setCoupleBrideAr(brideParam);
        else if (mockSource?.invitation?.coupleBrideAr) setCoupleBrideAr(mockSource.invitation.coupleBrideAr);

        if (groomEnParam) setCoupleGroomEn(groomEnParam);
        else if (mockSource?.invitation?.coupleGroomEn) setCoupleGroomEn(mockSource.invitation.coupleGroomEn);

        if (brideEnParam) setCoupleBrideEn(brideEnParam);
        else if (mockSource?.invitation?.coupleBrideEn) setCoupleBrideEn(mockSource.invitation.coupleBrideEn);

        if (venueParam) setVenueNameAr(venueParam);
        else if (mockSource?.events?.[0]?.venueNameAr) setVenueNameAr(mockSource.events[0].venueNameAr);

        if (cityParam) setAddressAr(cityParam);
        else if (mockSource?.events?.[0]?.addressAr) setAddressAr(mockSource.events[0].addressAr);

        if (mockSource?.invitation?.weddingMessageAr) {
          setCustomWeddingMessage(mockSource.invitation.weddingMessageAr);
          setSelectedVerseId('custom');
        }

        if (mockSource?.invitation?.coverImageUrl) setCoverImageUrl(mockSource.invitation.coverImageUrl);
        if (mockSource?.invitation?.coupleImageUrl) setCoupleImageUrl(mockSource.invitation.coupleImageUrl);
        if (mockSource?.invitation?.musicUrl) setCustomMusicUrl(mockSource.invitation.musicUrl);
        if (mockSource?.invitation?.musicTitle) setCustomMusicTitle(mockSource.invitation.musicTitle);

        if (mockSource?.invitation?.themeConfig) {
          const cfg = mockSource.invitation.themeConfig;
          if (cfg.primaryColor) setCustomPrimaryColor(cfg.primaryColor);
          if (cfg.secondaryColor) setCustomSecondaryColor(cfg.secondaryColor);
          if (cfg.backgroundColor) setCustomBackgroundColor(cfg.backgroundColor);
          if (cfg.openingStyle) setOpeningStyle(cfg.openingStyle);
          if (cfg.backgroundPattern) setBackgroundPattern(cfg.backgroundPattern);
          if (cfg.innerCardStyle) setInnerCardStyle(cfg.innerCardStyle);
          if (cfg.floatingParticles) setFloatingParticles(cfg.floatingParticles);
          if (cfg.fontFamily) setSelectedFont(cfg.fontFamily);
        }

        if (mockSource?.events && mockSource.events.length > 0) {
          const mapped = mockSource.events.map((ev: any, idx: number) => ({
            id: ev.id || `evt-${idx}`,
            type: ev.type || 'wedding',
            titleAr: ev.titleAr || 'المناسبة',
            date: ev.date || '2026-11-20T20:00',
            time: ev.startTime || '08:00 م',
            venueNameAr: ev.venueNameAr || 'قاعة الحفل',
            addressAr: ev.addressAr || '',
            googleMapsUrl: ev.googleMapsUrl || '',
            enabled: ev.isVisible !== false,
            dressCodeAr: ev.dressCodeAr || '',
            isHennaFemaleOnly: ev.isHennaFemaleOnly || false,
          }));
          setJourneyEvents(mapped);
          if (mapped[0]?.date) setEventDate(mapped[0].date);
        }

        return;
      }

      const savedDraft = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedDraft) {
        const d = JSON.parse(savedDraft);
        if (d.coupleGroomAr) setCoupleGroomAr(d.coupleGroomAr);
        if (d.coupleBrideAr) setCoupleBrideAr(d.coupleBrideAr);
        if (d.coupleGroomEn) setCoupleGroomEn(d.coupleGroomEn);
        if (d.coupleBrideEn) setCoupleBrideEn(d.coupleBrideEn);
        if (d.parentsGroomAr) setParentsGroomAr(d.parentsGroomAr);
        if (d.parentsBrideAr) setParentsBrideAr(d.parentsBrideAr);
        if (d.title) setTitle(d.title);
        if (d.type) setType(d.type);
        if (d.selectedPackage) setSelectedPackage(d.selectedPackage);
        if (d.selectedThemeId) setSelectedThemeId(d.selectedThemeId);
        if (d.selectedFont) setSelectedFont(d.selectedFont);
        if (d.customPrimaryColor) setCustomPrimaryColor(d.customPrimaryColor);
        if (d.customSecondaryColor) setCustomSecondaryColor(d.customSecondaryColor);
        if (d.customBackgroundColor) setCustomBackgroundColor(d.customBackgroundColor);
        if (d.selectedVerseId) setSelectedVerseId(d.selectedVerseId);
        if (d.customWeddingMessage) setCustomWeddingMessage(d.customWeddingMessage);
        if (d.sectionsVisibility) setSectionsVisibility(d.sectionsVisibility);
        if (d.whatsappContactPhone) setWhatsappContactPhone(d.whatsappContactPhone);
        if (d.whatsappContactEnabled !== undefined) setWhatsappContactEnabled(d.whatsappContactEnabled);
        if (d.journeyEvents) setJourneyEvents(d.journeyEvents);
        if (d.selectedMusicId) setSelectedMusicId(d.selectedMusicId);
        if (d.customMusicUrl) setCustomMusicUrl(d.customMusicUrl);
        if (d.customMusicTitle) setCustomMusicTitle(d.customMusicTitle);
        if (d.eventDate) setEventDate(d.eventDate);
        if (d.venueNameAr) setVenueNameAr(d.venueNameAr);
        if (d.addressAr) setAddressAr(d.addressAr);
        if (d.googleMapsUrl) setGoogleMapsUrl(d.googleMapsUrl);
        if (d.isMultiEvent !== undefined) setIsMultiEvent(d.isMultiEvent);
        if (d.coverImageUrl) setCoverImageUrl(d.coverImageUrl);
        if (d.coupleImageUrl) setCoupleImageUrl(d.coupleImageUrl);
        if (d.customOgImageUrl) setCustomOgImageUrl(d.customOgImageUrl);
        if (d.customerName) setCustomerName(d.customerName);
        if (d.customerPhone) setCustomerPhone(d.customerPhone);
        if (d.slugSuffix) setSlugSuffix(d.slugSuffix);
      }
    } catch (e) {
      console.warn('Failed to parse local draft:', e);
    }
  }, [searchParams]);

  // 2. Auto-save Draft to LocalStorage whenever critical fields change
  useEffect(() => {
    const draft = {
      coupleGroomAr,
      coupleBrideAr,
      coupleGroomEn,
      coupleBrideEn,
      parentsGroomAr,
      parentsBrideAr,
      title,
      type,
      selectedPackage,
      selectedThemeId,
      selectedFont,
      customPrimaryColor,
      customSecondaryColor,
      customBackgroundColor,
      selectedVerseId,
      customWeddingMessage,
      sectionsVisibility,
      whatsappContactPhone,
      whatsappContactEnabled,
      journeyEvents,
      selectedMusicId,
      customMusicUrl,
      customMusicTitle,
      eventDate,
      venueNameAr,
      addressAr,
      googleMapsUrl,
      isMultiEvent,
      coverImageUrl,
      coupleImageUrl,
      customOgImageUrl,
      customerName,
      customerPhone,
      slugSuffix,
      slug: generatedSlug,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
      const now = new Date();
      setLastSavedTime(
        `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}`
      );
    } catch {
      // ignore
    }
  }, [
    coupleGroomAr,
    coupleBrideAr,
    coupleGroomEn,
    coupleBrideEn,
    parentsGroomAr,
    parentsBrideAr,
    title,
    type,
    selectedPackage,
    selectedThemeId,
    selectedFont,
    customPrimaryColor,
    customSecondaryColor,
    customBackgroundColor,
    selectedVerseId,
    customWeddingMessage,
    sectionsVisibility,
    whatsappContactPhone,
    whatsappContactEnabled,
    journeyEvents,
    selectedMusicId,
    customMusicUrl,
    customMusicTitle,
    eventDate,
    venueNameAr,
    addressAr,
    googleMapsUrl,
    isMultiEvent,
    coverImageUrl,
    coupleImageUrl,
    customOgImageUrl,
    customerName,
    customerPhone,
    slugSuffix,
    generatedSlug,
  ]);

  // Handle Groom & Bride names auto title
  const handleCoupleNameChange = (groom: string, bride: string) => {
    setCoupleGroomAr(groom);
    setCoupleBrideAr(bride);
    if (!title || title.startsWith('دعوة زفاف')) {
      if (groom && bride) {
        setTitle(`دعوة زفاف ${groom} & ${bride} ❤️`);
      } else if (groom) {
        setTitle(`دعوة زفاف ${groom}`);
      }
    }
    const legacyMockGrooms = ['Ahmed Mahmoud', 'Omar Khaled', 'Tarek Fahmy', 'Ziad Khalil', 'Karim'];
    const legacyMockBrides = ['Sara El-Sherif', 'Salma El-Sherif', 'Nour El-Shennawy', 'Farida Assem', 'Nada'];
    if (coupleGroomEn && legacyMockGrooms.includes(coupleGroomEn)) {
      setCoupleGroomEn('');
    }
    if (coupleBrideEn && legacyMockBrides.includes(coupleBrideEn)) {
      setCoupleBrideEn('');
    }
  };

  // Handle Verse Selection
  const handleVerseSelect = (verseId: string) => {
    setSelectedVerseId(verseId);
    const found = QURANIC_VERSES_PRESETS.find((v) => v.id === verseId);
    if (found && found.id !== 'custom') {
      setCustomWeddingMessage(found.verse);
    }
  };

  // Handle Music Selection
  const handleMusicSelect = (musicId: string) => {
    setSelectedMusicId(musicId);
    const found = WEDDING_MUSIC_PRESETS.find((m) => m.id === musicId);
    if (found) {
      setCustomMusicUrl(found.url);
      setCustomMusicTitle(found.title);
    }
  };

  // Play/Stop Music Preview in Studio
  const toggleAudioPreview = (url: string) => {
    if (!url) return;
    if (audioPreviewing === url) {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
      setAudioPreviewing(null);
    } else {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      const audio = new Audio(url);
      audio.play().catch(() => {});
      audio.onended = () => setAudioPreviewing(null);
      audioPreviewRef.current = audio;
      setAudioPreviewing(url);
    }
  };

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
    };
  }, []);

  // Handle File Upload for Payment Screenshot
  const handleProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('حجم لقطة الشاشة كبير للغاية، يرجى اختيار صورة أقل من 10 ميجابايت');
      return;
    }

    setProofFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPaymentProofBase64(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Copy to clipboard helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(label);
    setTimeout(() => setCopySuccess(null), 2500);
  };

  // Primary event update handlers
  const handlePrimaryVenueChange = (val: string) => {
    setVenueNameAr(val);
    setJourneyEvents((prev) =>
      prev.map((ev) =>
        ev.type === 'wedding' || ev.id === 'evt-wedding' ? { ...ev, venueNameAr: val } : ev
      )
    );
    setDesignValidationError(null);
  };

  const handlePrimaryAddressChange = (val: string) => {
    setAddressAr(val);
    setJourneyEvents((prev) =>
      prev.map((ev) =>
        ev.type === 'wedding' || ev.id === 'evt-wedding' ? { ...ev, addressAr: val } : ev
      )
    );
    setDesignValidationError(null);
  };

  const handlePrimaryMapUrlChange = (val: string) => {
    setGoogleMapsUrl(val);
    setJourneyEvents((prev) =>
      prev.map((ev) =>
        ev.type === 'wedding' || ev.id === 'evt-wedding' ? { ...ev, googleMapsUrl: val } : ev
      )
    );
    setDesignValidationError(null);
  };

  const handlePrimaryDateChange = (val: string) => {
    setEventDate(val);
    setJourneyEvents((prev) =>
      prev.map((ev) =>
        ev.type === 'wedding' || ev.id === 'evt-wedding' ? { ...ev, date: val } : ev
      )
    );
    setDesignValidationError(null);
  };

  const updateJourneyEvent = (
    index: number,
    updates: Partial<JourneyEvent>
  ) => {
    setJourneyEvents((prev) => {
      const next = prev.map((ev, idx) => (idx === index ? { ...ev, ...updates } : ev));
      return next;
    });
    setDesignValidationError(null);

    const target = journeyEvents[index];
    if (target && (target.type === 'wedding' || target.id === 'evt-wedding')) {
      if (updates.venueNameAr !== undefined) setVenueNameAr(updates.venueNameAr);
      if (updates.addressAr !== undefined) setAddressAr(updates.addressAr);
      if (updates.googleMapsUrl !== undefined) setGoogleMapsUrl(updates.googleMapsUrl);
      if (updates.date !== undefined && updates.date) {
        setEventDate(updates.date);
      }
    }
  };

  const handleToggleEventEnabled = (index: number, checked: boolean) => {
    if (!checked) {
      const enabledCount = journeyEvents.filter((ev) => ev.enabled).length;
      if (enabledCount <= 1) {
        setDesignValidationError('يجب الإبقاء على مناسبة واحدة على الأقل مفعلة في الدعوة');
        return;
      }
    }
    updateJourneyEvent(index, { enabled: checked });
  };

  // Studio Form Pre-validation before Opening Checkout Modal
  const validateDesignForm = (): { isValid: boolean; error?: string } => {
    if (!coupleGroomAr || !coupleGroomAr.trim()) {
      return { isValid: false, error: 'يرجى كتابة اسم العريس بالعربية في الخطوة الثانية للمتابعة.' };
    }
    if (!coupleBrideAr || !coupleBrideAr.trim()) {
      return { isValid: false, error: 'يرجى كتابة اسم العروسة بالعربية في الخطوة الثانية للمتابعة.' };
    }
    if (!eventDate || isNaN(new Date(eventDate).getTime())) {
      return { isValid: false, error: 'يرجى تحديد تاريخ وتوقيت حفل الزفاف في الخطوة السادسة.' };
    }
    if (sectionsVisibility.venue !== false && (!venueNameAr || !venueNameAr.trim())) {
      return { isValid: false, error: 'يرجى إدخال اسم قاعة أو مكان حفل الزفاف في الخطوة السادسة.' };
    }
    if (googleMapsUrl && googleMapsUrl.trim()) {
      const check = validateMapUrl(googleMapsUrl);
      if (check.status === 'invalid') {
        return {
          isValid: false,
          error: 'رابط خرائط جوجل لحفل الزفاف غير صالح، يرجى كتابة رابط صحيح أو تركه فارغاً.',
        };
      }
    }

    if (selectedPackage !== 'basic') {
      const enabledEvents = journeyEvents.filter((ev) => ev.enabled);
      if (enabledEvents.length === 0) {
        return { isValid: false, error: 'يجب تفعيل وتضمين مناسبة واحدة على الأقل في جدول رحلة الفرح.' };
      }
      for (const ev of enabledEvents) {
        if (!ev.venueNameAr || !ev.venueNameAr.trim()) {
          return { isValid: false, error: `يرجى إدخال اسم المكان لمناسبة (${ev.titleAr}) في جدول رحلة الفرح.` };
        }
        if (!ev.date || isNaN(new Date(ev.date).getTime())) {
          return { isValid: false, error: `يرجى تحديد تاريخ صالح لمناسبة (${ev.titleAr}) في جدول رحلة الفرح.` };
        }
        if (!ev.time || !ev.time.trim()) {
          return { isValid: false, error: `يرجى كتابة توقيت وساعة مناسبة (${ev.titleAr}) في جدول رحلة الفرح.` };
        }
        if (ev.googleMapsUrl && ev.googleMapsUrl.trim()) {
          const evCheck = validateMapUrl(ev.googleMapsUrl);
          if (evCheck.status === 'invalid') {
            return {
              isValid: false,
              error: `رابط خرائط جوجل لمناسبة (${ev.titleAr}) غير صالح، يرجى كتابة رابط صحيح أو تركه فارغاً.`,
            };
          }
        }
      }
    }

    if (sectionsVisibility.whatsapp && whatsappContactEnabled && whatsappContactPhone) {
      const phoneCheck = validatePhoneNumber(whatsappContactPhone);
      if (!phoneCheck.isValid) {
        return {
          isValid: false,
          error: 'يرجى إدخال رقم واتساب صحيح للتواصل السريع في الخطوة السادسة أو تعطيل الزر.',
        };
      }
    }

    return { isValid: true };
  };

  const handleOpenCheckoutModal = () => {
    const val = validateDesignForm();
    if (!val.isValid) {
      setDesignValidationError(val.error || 'يرجى استكمال البيانات المطلوبة');
      window.scrollTo({ top: 350, behavior: 'smooth' });
      return;
    }
    setDesignValidationError(null);
    setShowCheckoutModal(true);
  };

  // Submit Self-Service Design
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const phoneValidation = validatePhoneNumber(customerPhone);
    if (!phoneValidation.isValid) {
      setSubmitError(phoneValidation.error || 'يرجى كتابة رقم هاتف / واتساب صالح للتواصل وتأكيد التفعيل');
      return;
    }

    if (!paymentProofBase64) {
      setSubmitError('يرجى رفع لقطة شاشة (Screenshot) لرسالة تحويل الدفع عبر InstaPay أو فودافون كاش للاعتماد');
      return;
    }

    setSubmitting(true);

    try {
      const currentPkg = packagesList.find((p) => p.id === selectedPackage) || packagesList[1];

      const res = await submitPublicDesign({
        customerName: customerName.trim() || coupleGroomAr?.trim() || 'العروسين',
        customerPhone: phoneValidation.normalized,
        customerEmail: customerEmail.trim() || undefined,
        packageId: selectedPackage,
        amount: currentPkg.price,
        paymentMethod,
        referenceNumber: referenceNumber.trim() || undefined,
        paymentProofImage: paymentProofBase64,
        invitation: {
          slug: generatedSlug,
          title: title || `دعوة فرح ${coupleGroomAr || 'العروسين'}`,
          type,
          envelopeAnimationEnabled: Boolean(sectionsVisibility.envelope),
          countdownEnabled: Boolean(sectionsVisibility.countdown),
          rsvpEnabled: Boolean(sectionsVisibility.rsvp),
          isMultiEvent: selectedPackage !== 'basic',
          sections: Object.entries(sectionsVisibility).map(([sectionKey, isEnabled], idx) => ({
            sectionKey,
            isEnabled: Boolean(isEnabled),
            sortOrder: idx,
          })),
          coupleGroomAr: coupleGroomAr?.trim() || 'العريس',
          coupleBrideAr: coupleBrideAr?.trim() || 'العروس',
          coupleGroomEn: coupleGroomEn || null,
          coupleBrideEn: coupleBrideEn || null,
          parentsGroomAr: sectionsVisibility.parents ? parentsGroomAr || null : null,
          parentsBrideAr: sectionsVisibility.parents ? parentsBrideAr || null : null,
          weddingMessageAr:
            sectionsVisibility.message && customWeddingMessage?.trim()
              ? customWeddingMessage.trim()
              : null,
          musicUrl:
            sectionsVisibility.music && customMusicUrl?.trim() ? customMusicUrl.trim() : null,
          musicTitle: customMusicTitle || null,
          coverImageUrl: sectionsVisibility.cover ? coverImageUrl || null : null,
          coupleImageUrl: sectionsVisibility.couple_photo ? coupleImageUrl || null : null,
          galleryImages: selectedPackage === 'luxury-vip' ? galleryImages : [],
          customOgImageUrl: customOgImageUrl || coverImageUrl || coupleImageUrl || null,
          themeId: selectedThemeId,
          fontFamily: effectiveFont,
          whatsappPhone:
            sectionsVisibility.whatsapp && whatsappContactEnabled && whatsappContactPhone.trim()
              ? whatsappContactPhone.trim()
              : null,
          themeConfig: {
            primaryColor,
            secondaryColor,
            backgroundColor,
            textColor,
            fontFamily: effectiveFont,
            selectedPackage,
            openingStyle: effectiveOpeningStyle,
            backgroundPattern: effectiveBackgroundPattern,
            innerCardStyle: effectiveInnerCardStyle,
            floatingParticles: effectiveFloatingParticles,
            customOgImageUrl: customOgImageUrl || coverImageUrl || coupleImageUrl || null,
            hennaPasscode: hennaFemaleOnly ? hennaPasscode : undefined,
            hennaMessage,
            hennaSpecialEnabled:
              sectionsVisibility.henna_special || (selectedPackage === 'luxury-vip' && hennaFemaleOnly),
            enableRoyalShimmer: selectedPackage === 'luxury-vip' ? enableRoyalShimmer : false,
            waxSealMonogram:
              waxSealMonogram ||
              `${coupleGroomAr?.trim()?.charAt(0) || 'أ'} & ${coupleBrideAr?.trim()?.charAt(0) || 'س'}`,
            whatsappPhone:
              sectionsVisibility.whatsapp && whatsappContactEnabled && whatsappContactPhone.trim()
                ? whatsappContactPhone.trim()
                : null,
            whatsappContactEnabled: sectionsVisibility.whatsapp && whatsappContactEnabled,
          },
          events:
            selectedPackage === 'basic'
              ? [
                  {
                    type: type || 'wedding',
                    titleAr: title || 'حفل الزفاف المبارك',
                    date: eventDate,
                    startTime: '08:00 م',
                    venueNameAr: venueNameAr || 'قاعة الحفل الملكية',
                    addressAr: addressAr || '',
                    googleMapsUrl: googleMapsUrl || '',
                    isVisible: true,
                  },
                ]
              : journeyEvents
                  .filter((ev) => ev.enabled)
                  .map((ev) => ({
                    type: ev.type,
                    titleAr: ev.titleAr,
                    date: ev.type === 'wedding' ? eventDate : ev.date,
                    startTime: ev.time,
                    venueNameAr:
                      ev.type === 'wedding' ? venueNameAr || ev.venueNameAr : ev.venueNameAr,
                    addressAr: ev.type === 'wedding' ? addressAr || ev.addressAr : ev.addressAr,
                    googleMapsUrl:
                      ev.type === 'wedding' ? googleMapsUrl || ev.googleMapsUrl : ev.googleMapsUrl,
                    isVisible: true,
                    dressCodeAr: ev.dressCodeAr,
                    isHennaFemaleOnly: ev.isHennaFemaleOnly,
                  })),
        },
      });

      if (res.success && res.data) {
        setSubmittedOrder(res.data);
        setShowCheckoutModal(false);
        try {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          localStorage.setItem(LOCAL_STORAGE_ORDER_KEY, JSON.stringify(res.data));
        } catch {
          // ignore
        }
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#720925', '#D4AF37', '#FAF7F2'],
          });
        } catch {
          // ignore
        }
      } else {
        setSubmitError(res.error || 'حدث خطأ أثناء حفظ التصميم، يرجى المحاولة ثانية');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'فشل الاتصال بالخادم، يرجى التأكد من اتصال الإنترنت');
    } finally {
      setSubmitting(false);
    }
  };

  // Find theme and normalized color computations
  const activeTheme = useMemo(() => {
    return (
      DEFAULT_THEMES.find(
        (t) => t.slug === selectedThemeId || `theme-${t.slug}` === selectedThemeId
      ) || DEFAULT_THEMES[0]
    );
  }, [selectedThemeId]);

  const primaryColor = useMemo(() => {
    return (
      normalizeColor(customPrimaryColor) ||
      activeTheme.config?.primaryColor ||
      '#720925'
    );
  }, [customPrimaryColor, activeTheme]);

  const secondaryColor = useMemo(() => {
    return (
      normalizeColor(customSecondaryColor) ||
      activeTheme.config?.secondaryColor ||
      '#D4AF37'
    );
  }, [customSecondaryColor, activeTheme]);

  const backgroundColor = useMemo(() => {
    return (
      normalizeColor(customBackgroundColor) ||
      activeTheme.config?.backgroundColor ||
      '#FAF7F2'
    );
  }, [customBackgroundColor, activeTheme]);

  const isBasic = selectedPackage === 'basic';
  const isJourney = selectedPackage === 'wedding-journey';
  const isVip = selectedPackage === 'luxury-vip';

  // Effective typography normalized to active tier
  const effectiveFont = useMemo(() => {
    if (isBasic) {
      const basicFonts = ["'Cairo', sans-serif", "'Amiri', serif"];
      if (basicFonts.includes(selectedFont)) {
        return selectedFont;
      }
      return "'Cairo', sans-serif";
    }
    if (isJourney) {
      const journeyFonts = [
        "'Cairo', sans-serif",
        "'Amiri', serif",
        "'Tajawal', sans-serif",
        "'Alexandria', sans-serif",
        "'Almarai', sans-serif",
      ];
      if (journeyFonts.includes(selectedFont)) {
        return selectedFont;
      }
      return "'Cairo', sans-serif";
    }
    return selectedFont;
  }, [isBasic, isJourney, selectedFont]);

  // Effective opening style: Basic has no 3D envelope (direct reveal)
  const effectiveOpeningStyle = useMemo(() => {
    if (isBasic) {
      return 'direct';
    }
    return openingStyle;
  }, [isBasic, openingStyle]);

  // Effective background pattern normalized to active tier
  const effectiveBackgroundPattern = useMemo(() => {
    if (isBasic) {
      if (['dots', 'parchment'].includes(backgroundPattern)) return backgroundPattern;
      return 'dots';
    }
    if (isJourney) {
      if (['dots', 'parchment', 'damask', 'zellige', 'geometric'].includes(backgroundPattern)) {
        return backgroundPattern;
      }
      return 'damask';
    }
    return backgroundPattern;
  }, [isBasic, isJourney, backgroundPattern]);

  // Effective inner card style normalized to active tier
  const effectiveInnerCardStyle = useMemo(() => {
    if (isBasic) return 'arched';
    if (isJourney) {
      if (['arched', 'double-gold', 'deckle'].includes(innerCardStyle)) return innerCardStyle;
      return 'double-gold';
    }
    return innerCardStyle;
  }, [isBasic, isJourney, innerCardStyle]);

  // Effective particles normalized to active tier
  const effectiveFloatingParticles = useMemo(() => {
    if (isBasic) {
      if (['none', 'golden-dust'].includes(floatingParticles)) return floatingParticles;
      return 'golden-dust';
    }
    if (isJourney) {
      if (['none', 'golden-dust', 'rose-petals'].includes(floatingParticles)) return floatingParticles;
      return 'golden-dust';
    }
    return floatingParticles;
  }, [isBasic, isJourney, floatingParticles]);

  const safePickerPrimary = normalizeColor(primaryColor) || '#720925';
  const safePickerSecondary = normalizeColor(secondaryColor) || '#d4af37';
  const safePickerBackground = normalizeColor(backgroundColor) || '#faf7f2';

  const isDarkBackground =
    backgroundColor.toLowerCase() === '#0f0f11' ||
    backgroundColor.toLowerCase() === '#1e1e22' ||
    backgroundColor.toLowerCase() === '#18181b' ||
    backgroundColor.toLowerCase() === '#0a0a0c' ||
    backgroundColor.toLowerCase() === '#000000' ||
    backgroundColor.toLowerCase() === '#000';
  const textColor = isDarkBackground ? '#F8FAFC' : (activeTheme.config?.textColor || '#1A1819');

  const handleColorInputChange = (
    field: 'primary' | 'secondary' | 'background',
    val: string
  ) => {
    if (field === 'primary') setCustomPrimaryColor(val);
    else if (field === 'secondary') setCustomSecondaryColor(val);
    else if (field === 'background') setCustomBackgroundColor(val);
  };

  const handleSelectTheme = (themeKey: string) => {
    setSelectedThemeId(themeKey);
    const matched = DEFAULT_THEMES.find((t) => t.slug === themeKey || `theme-${t.slug}` === themeKey);
    if (matched?.config) {
      setCustomPrimaryColor(matched.config.primaryColor || '#720925');
      setCustomSecondaryColor(matched.config.secondaryColor || '#D4AF37');
      setCustomBackgroundColor(matched.config.backgroundColor || '#FAF7F2');
      if (matched.config.openingStyle) setOpeningStyle(matched.config.openingStyle);
      if (matched.config.backgroundPattern) setBackgroundPattern(matched.config.backgroundPattern);
      if (matched.config.innerCardStyle) setInnerCardStyle(matched.config.innerCardStyle);
      if (matched.config.floatingParticles) setFloatingParticles(matched.config.floatingParticles);
      setEnvelopePreviewOpen(false);
    }
  };

  const handleResetColorsToTheme = () => {
    setCustomPrimaryColor(activeTheme.config?.primaryColor || '#720925');
    setCustomSecondaryColor(activeTheme.config?.secondaryColor || '#D4AF37');
    setCustomBackgroundColor(activeTheme.config?.backgroundColor || '#FAF7F2');
  };

  const currentPkg = packagesList.find((p) => p.id === selectedPackage) || packagesList[1];

  const livePreviewSections = DEFAULT_SECTIONS.map((sec, idx) => ({
    id: `sec-${sec.key}`,
    invitationId: 'studio-preview',
    sectionKey: sec.key,
    isEnabled:
      sectionsVisibility[sec.key] !== undefined
        ? sectionsVisibility[sec.key]
        : sec.defaultEnabled,
    sortOrder: idx,
  }));

  // Mock invitation object for live preview
  const livePreviewInvitation: any = {
    id: 'studio-preview',
    slug: generatedSlug,
    title: title || `دعوة فرح ${coupleGroomAr || 'العريس'} & ${coupleBrideAr || 'العروس'}`,
    type,
    status: 'preview',
    privacy: 'unlisted',
    coupleGroomAr: coupleGroomAr || 'اسم العريس',
    coupleBrideAr: coupleBrideAr || 'اسم العروس',
    coupleGroomEn: coupleGroomEn || null,
    coupleBrideEn: coupleBrideEn || null,
    parentsGroomAr: sectionsVisibility.parents ? parentsGroomAr || null : null,
    parentsBrideAr: sectionsVisibility.parents ? parentsBrideAr || null : null,
    eventDate,
    venueNameAr: venueNameAr || 'قاعة الحفل الملكية',
    addressAr: addressAr || 'القاهرة، مصر',
    googleMapsUrl,
    weddingMessageAr:
      sectionsVisibility.message && customWeddingMessage?.trim()
        ? customWeddingMessage.trim()
        : null,
    musicUrl:
      sectionsVisibility.music && customMusicUrl?.trim() ? customMusicUrl.trim() : null,
    musicTitle: customMusicTitle || null,
    coverImageUrl: sectionsVisibility.cover ? coverImageUrl || null : null,
    coupleImageUrl: sectionsVisibility.couple_photo ? coupleImageUrl || null : null,
    galleryImages: selectedPackage === 'luxury-vip' ? galleryImages : [],
    customOgImageUrl: customOgImageUrl || coverImageUrl || coupleImageUrl || null,
    whatsappPhone:
      sectionsVisibility.whatsapp && whatsappContactEnabled && whatsappContactPhone.trim()
        ? whatsappContactPhone.trim()
        : null,
    whatsappContactEnabled: sectionsVisibility.whatsapp && whatsappContactEnabled,
    themeConfig: {
      primaryColor,
      secondaryColor,
      backgroundColor,
      textColor,
      fontFamily: effectiveFont,
      selectedPackage,
      openingStyle: effectiveOpeningStyle,
      backgroundPattern: effectiveBackgroundPattern,
      innerCardStyle: effectiveInnerCardStyle,
      floatingParticles: effectiveFloatingParticles,
      customOgImageUrl: customOgImageUrl || coverImageUrl || coupleImageUrl || null,
      hennaPasscode: hennaFemaleOnly ? hennaPasscode : undefined,
      hennaMessage,
      hennaSpecialEnabled:
        sectionsVisibility.henna_special || (selectedPackage === 'luxury-vip' && hennaFemaleOnly),
      enableRoyalShimmer: selectedPackage === 'luxury-vip' ? enableRoyalShimmer : false,
      waxSealMonogram:
        waxSealMonogram ||
        `${coupleGroomAr?.trim()?.charAt(0) || 'أ'} & ${coupleBrideAr?.trim()?.charAt(0) || 'س'}`,
      whatsappPhone:
        sectionsVisibility.whatsapp && whatsappContactEnabled && whatsappContactPhone.trim()
          ? whatsappContactPhone.trim()
          : null,
      whatsappContactEnabled: sectionsVisibility.whatsapp && whatsappContactEnabled,
    },
  };

  const livePreviewEvents = useMemo(() => {
    if (selectedPackage === 'basic') {
      const mapUrl = googleMapsUrl;
      const extracted = mapUrl ? extractCoordinatesFromUrl(mapUrl) : null;
      const city = !extracted
        ? resolveCityCoordinates(`${venueNameAr} ${addressAr}`)
        : null;
      const lat = extracted?.latitude ?? city?.latitude ?? null;
      const lng = extracted?.longitude ?? city?.longitude ?? null;
      const osmUrl = lat && lng ? getOpenStreetMapUrl(lat, lng) : null;

      return [
        {
          id: 'primary-event',
          type: type || 'wedding',
          titleAr: title || 'حفل الزفاف المبارك',
          date: eventDate,
          startTime: '08:00 م',
          venueNameAr: venueNameAr || 'قاعة الحفل الملكية',
          addressAr: addressAr || 'القاهرة، مصر',
          googleMapsUrl: mapUrl || '',
          latitude: lat,
          longitude: lng,
          openStreetMapUrl: osmUrl,
          isVisible: sectionsVisibility.venue !== false,
        },
      ];
    }

    return journeyEvents
      .filter((ev) => ev.enabled)
      .map((ev) => {
        const evVenue =
          ev.type === 'wedding' ? (venueNameAr || ev.venueNameAr) : ev.venueNameAr;
        const evAddr =
          ev.type === 'wedding' ? (addressAr || ev.addressAr) : ev.addressAr;
        const evMapUrl =
          ev.type === 'wedding' ? (googleMapsUrl || ev.googleMapsUrl) : ev.googleMapsUrl;
        const evExtracted = evMapUrl ? extractCoordinatesFromUrl(evMapUrl) : null;
        const evCity = !evExtracted
          ? resolveCityCoordinates(`${evVenue} ${evAddr}`)
          : null;
        const evLat = evExtracted?.latitude ?? evCity?.latitude ?? null;
        const evLng = evExtracted?.longitude ?? evCity?.longitude ?? null;
        const evOsmUrl =
          evLat && evLng ? getOpenStreetMapUrl(evLat, evLng) : null;

        return {
          id: ev.id,
          type: ev.type,
          titleAr: ev.titleAr,
          date: ev.type === 'wedding' ? eventDate : ev.date,
          startTime: ev.time,
          venueNameAr: evVenue,
          addressAr: evAddr,
          googleMapsUrl: evMapUrl,
          latitude: evLat,
          longitude: evLng,
          openStreetMapUrl: evOsmUrl,
          isVisible: true,
          isHennaFemaleOnly: ev.isHennaFemaleOnly,
          dressCodeAr: ev.dressCodeAr,
        };
      });
  }, [
    selectedPackage,
    type,
    title,
    eventDate,
    venueNameAr,
    addressAr,
    googleMapsUrl,
    sectionsVisibility,
    journeyEvents,
  ]);

  const primaryFontName = selectedFont.split(',')[0].replace(/['"]/g, '').trim();
  const shouldLoadGoogleFont =
    primaryFontName &&
    !['sans-serif', 'serif', 'monospace', 'cursive', 'system-ui', 'arial', 'tahoma'].includes(
      primaryFontName.toLowerCase()
    );

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-cairo text-right text-stone-900 pb-20">
      {shouldLoadGoogleFont && (
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(
            primaryFontName
          )}:wght@300;400;600;700;800&display=swap`}
        />
      )}

      {/* 1. Sticky Header Topbar */}
      <StudioHeader
        lastSavedTime={lastSavedTime}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCheckout={handleOpenCheckoutModal}
      />

      {/* Template Loaded Notice Banner */}
      {templateNotice && (
        <div className="bg-amber-500 text-stone-950 font-black text-xs sm:text-sm py-2 px-4 text-center shadow-xs">
          {templateNotice}
        </div>
      )}

      {/* Main Studio 2-Column Grid */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Editor Sections */}
          <div
            className={`lg:col-span-7 space-y-6 sm:space-y-8 ${
              activeTab === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Design Validation Error Banner */}
            {designValidationError && (
              <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-sm animate-shake">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{designValidationError}</span>
              </div>
            )}

            {/* Step 1: Package Selection */}
            <PackageStep
              packagesList={packagesList}
              selectedPackage={selectedPackage}
              currentPkg={currentPkg}
              onSelectPackage={(pkgId) => {
                setSelectedPackage(pkgId);
                const pkg = packagesList.find((p) => p.id === pkgId);
                setIsMultiEvent(pkg?.defaultMultiEvent ?? true);
                if (pkgId === 'luxury-vip') {
                  setSectionsVisibility((prev) => ({
                    ...prev,
                    events: true,
                    envelope: true,
                    rsvp: true,
                    gallery: true,
                    henna_special: true,
                  }));
                } else if (pkgId === 'wedding-journey') {
                  setSectionsVisibility((prev) => ({
                    ...prev,
                    events: true,
                    envelope: true,
                    rsvp: true,
                    henna_special: false,
                  }));
                } else {
                  setSectionsVisibility((prev) => ({
                    ...prev,
                    events: false,
                    gallery: false,
                    henna_special: false,
                  }));
                }
              }}
            />

            {/* 5-Step Segmented Navigation Matching Admin Builder */}
            <div className="p-1.5 bg-stone-200/80 rounded-2xl grid grid-cols-5 gap-1 border border-stone-300/70 shadow-2xs">
              {[
                { id: 'couple', label: 'العروسين', icon: Heart },
                { id: 'theme', label: 'الثيم والألوان', icon: Palette },
                { id: 'events', label: 'المناسبات', icon: Calendar },
                { id: 'media', label: 'الميديا', icon: ImageIcon },
                { id: 'sections', label: 'الأقسام', icon: Layers },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = studioTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStudioTab(tab.id as any)}
                    className={`py-2.5 px-1 rounded-xl text-xs font-black flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#720925]' : 'text-stone-400'}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Couple Details & Quranic Verses */}
            {studioTab === 'couple' && (
              <div className="space-y-6 sm:space-y-8 animate-fade-in">
                <CoupleDetailsStep
                  coupleGroomAr={coupleGroomAr}
                  coupleBrideAr={coupleBrideAr}
                  coupleGroomEn={coupleGroomEn}
                  setCoupleGroomEn={setCoupleGroomEn}
                  coupleBrideEn={coupleBrideEn}
                  setCoupleBrideEn={setCoupleBrideEn}
                  onCoupleNameChange={handleCoupleNameChange}
                  title={title}
                  setTitle={setTitle}
                  type={type}
                  setType={setType}
                  generatedSlug={generatedSlug}
                  designValidationError={designValidationError}
                  copySuccess={copySuccess}
                  onCopySlug={() =>
                    copyToClipboard(
                      `https://farahna.menuflowx.com/invitation/${type}/${generatedSlug}`,
                      'slug'
                    )
                  }
                />

                <VerseStep
                  selectedVerseId={selectedVerseId}
                  customWeddingMessage={customWeddingMessage}
                  onVerseSelect={handleVerseSelect}
                  setCustomWeddingMessage={setCustomWeddingMessage}
                  setSectionsVisibility={setSectionsVisibility}
                />
              </div>
            )}

            {/* Tab 2: Theme, Colors, Fonts & Opening Style */}
            {studioTab === 'theme' && (
              <div className="space-y-6 sm:space-y-8 animate-fade-in">
                <ThemeCustomizerStep
                  isBasic={isBasic}
                  isJourney={isJourney}
                  isVip={isVip}
                  basicPlan={basicPlan}
                  journeyPlan={journeyPlan}
                  vipPlan={vipPlan}
                  basicToJourneyDiff={basicToJourneyDiff}
                  journeyToVipDiff={journeyToVipDiff}
                  packagesList={packagesList}
                  selectedPackage={selectedPackage}
                  selectedThemeId={selectedThemeId}
                  handleSelectTheme={handleSelectTheme}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  backgroundColor={backgroundColor}
                  textColor={textColor}
                  customPrimaryColor={customPrimaryColor}
                  customSecondaryColor={customSecondaryColor}
                  customBackgroundColor={customBackgroundColor}
                  safePickerPrimary={safePickerPrimary}
                  safePickerSecondary={safePickerSecondary}
                  safePickerBackground={safePickerBackground}
                  handleColorInputChange={handleColorInputChange}
                  handleResetColorsToTheme={handleResetColorsToTheme}
                  activeTheme={activeTheme}
                  selectedFont={selectedFont}
                  setSelectedFont={setSelectedFont}
                  effectiveFont={effectiveFont}
                  openingStyle={openingStyle}
                  setOpeningStyle={setOpeningStyle}
                  effectiveOpeningStyle={effectiveOpeningStyle}
                  waxSealMonogram={waxSealMonogram}
                  setWaxSealMonogram={setWaxSealMonogram}
                  backgroundPattern={backgroundPattern}
                  setBackgroundPattern={setBackgroundPattern}
                  effectiveBackgroundPattern={effectiveBackgroundPattern}
                  innerCardStyle={innerCardStyle}
                  setInnerCardStyle={setInnerCardStyle}
                  effectiveInnerCardStyle={effectiveInnerCardStyle}
                  setPreviewCardInspectMode={setPreviewCardInspectMode}
                  floatingParticles={floatingParticles}
                  setFloatingParticles={setFloatingParticles}
                  effectiveFloatingParticles={effectiveFloatingParticles}
                  coupleGroomAr={coupleGroomAr}
                  coupleBrideAr={coupleBrideAr}
                  title={title}
                  eventDate={eventDate}
                  customWeddingMessage={customWeddingMessage}
                  setEnvelopePreviewOpen={setEnvelopePreviewOpen}
                  isTierAllowed={isTierAllowed}
                  triggerTierNotice={triggerTierNotice}
                  handleUpgradeToPackage={handleUpgradeToPackage}
                  getTierBadgeText={getTierBadgeText}
                />
              </div>
            )}

            {/* Tab 3: Events, Venue & Journey Timeline */}
            {studioTab === 'events' && (
              <div className="space-y-6 sm:space-y-8 animate-fade-in">
                <EventVenueStep
                  eventDate={eventDate}
                  venueNameAr={venueNameAr}
                  addressAr={addressAr}
                  googleMapsUrl={googleMapsUrl}
                  handlePrimaryDateChange={handlePrimaryDateChange}
                  handlePrimaryVenueChange={handlePrimaryVenueChange}
                  handlePrimaryAddressChange={handlePrimaryAddressChange}
                  handlePrimaryMapUrlChange={handlePrimaryMapUrlChange}
                  designValidationError={designValidationError}
                  selectedPackage={selectedPackage}
                  journeyEvents={journeyEvents}
                  activeJourneyEventIndex={activeJourneyEventIndex}
                  setActiveJourneyEventIndex={setActiveJourneyEventIndex}
                  updateJourneyEvent={updateJourneyEvent}
                  handleToggleEventEnabled={handleToggleEventEnabled}
                  setSelectedPackage={setSelectedPackage}
                  setIsMultiEvent={setIsMultiEvent}
                  setSectionsVisibility={setSectionsVisibility}
                />
              </div>
            )}

            {/* Tab 4: Photos, VIP Gallery & Wedding Music */}
            {studioTab === 'media' && (
              <div className="space-y-6 sm:space-y-8 animate-fade-in">
                <PhotosStep
                  selectedPackage={selectedPackage}
                  setSelectedPackage={setSelectedPackage}
                  setIsMultiEvent={setIsMultiEvent}
                  setSectionsVisibility={setSectionsVisibility}
                  galleryImages={galleryImages}
                  setGalleryImages={setGalleryImages}
                  customGalleryUrlInput={customGalleryUrlInput}
                  setCustomGalleryUrlInput={setCustomGalleryUrlInput}
                  hennaPasscode={hennaPasscode}
                  setHennaPasscode={setHennaPasscode}
                  hennaFemaleOnly={hennaFemaleOnly}
                  setHennaFemaleOnly={setHennaFemaleOnly}
                  hennaMessage={hennaMessage}
                  setHennaMessage={setHennaMessage}
                  enableRoyalShimmer={enableRoyalShimmer}
                  setEnableRoyalShimmer={setEnableRoyalShimmer}
                  waxSealMonogram={waxSealMonogram}
                  setWaxSealMonogram={setWaxSealMonogram}
                  customOgImageUrl={customOgImageUrl}
                  setCustomOgImageUrl={setCustomOgImageUrl}
                  coverImageUrl={coverImageUrl}
                  setCoverImageUrl={setCoverImageUrl}
                  coupleImageUrl={coupleImageUrl}
                  setCoupleImageUrl={setCoupleImageUrl}
                  coupleGroomAr={coupleGroomAr}
                  coupleBrideAr={coupleBrideAr}
                  handleImageFileUpload={handleImageFileUpload}
                />

                <MusicStep
                  isBasic={isBasic}
                  isVip={isVip}
                  journeyPlan={journeyPlan}
                  vipPlan={vipPlan}
                  selectedMusicId={selectedMusicId}
                  setSelectedMusicId={setSelectedMusicId}
                  customMusicUrl={customMusicUrl}
                  setCustomMusicUrl={setCustomMusicUrl}
                  customMusicTitle={customMusicTitle}
                  setCustomMusicTitle={setCustomMusicTitle}
                  audioPreviewing={audioPreviewing}
                  toggleAudioPreview={toggleAudioPreview}
                  sectionsVisibility={sectionsVisibility}
                  setSectionsVisibility={setSectionsVisibility}
                  handleUpgradeToPackage={handleUpgradeToPackage}
                  triggerTierNotice={triggerTierNotice}
                  isUploadingAudio={isUploadingAudio}
                  audioUploadSuccess={audioUploadSuccess}
                  handleAudioFileUpload={handleAudioFileUpload}
                  handleMusicSelect={handleMusicSelect}
                />
              </div>
            )}

            {/* Tab 5: Sections Manager & WhatsApp Direct Contact */}
            {studioTab === 'sections' && (
              <div className="space-y-6 sm:space-y-8 animate-fade-in">
                <SectionsManagerStep
                  sectionsVisibility={sectionsVisibility}
                  toggleSection={toggleSection}
                  setSectionsVisibility={setSectionsVisibility}
                  parentsGroomAr={parentsGroomAr}
                  setParentsGroomAr={setParentsGroomAr}
                  parentsBrideAr={parentsBrideAr}
                  setParentsBrideAr={setParentsBrideAr}
                  whatsappContactPhone={whatsappContactPhone}
                  setWhatsappContactPhone={setWhatsappContactPhone}
                  customerPhone={customerPhone}
                />

                <WhatsAppContactStep
                  sectionsVisibility={sectionsVisibility}
                  setSectionsVisibility={setSectionsVisibility}
                  whatsappContactPhone={whatsappContactPhone}
                  setWhatsappContactPhone={setWhatsappContactPhone}
                  whatsappContactEnabled={whatsappContactEnabled}
                  setWhatsappContactEnabled={setWhatsappContactEnabled}
                  customerPhone={customerPhone}
                  handleOpenCheckoutModal={handleOpenCheckoutModal}
                />
              </div>
            )}

            {/* Tab Navigation Footer Bar */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={studioTab === 'couple'}
                onClick={() => {
                  const tabs = ['couple', 'theme', 'events', 'media', 'sections'];
                  const idx = tabs.indexOf(studioTab);
                  if (idx > 0) setStudioTab(tabs[idx - 1] as any);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>القسم السابق</span>
              </button>

              {studioTab !== 'sections' ? (
                <button
                  type="button"
                  onClick={() => {
                    const tabs = ['couple', 'theme', 'events', 'media', 'sections'];
                    const idx = tabs.indexOf(studioTab);
                    if (idx < tabs.length - 1) setStudioTab(tabs[idx + 1] as any);
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <span>
                    التالي:{' '}
                    {studioTab === 'couple'
                      ? 'الثيم والألوان'
                      : studioTab === 'theme'
                      ? 'المناسبات والمكان'
                      : studioTab === 'events'
                      ? 'الميديا والموسيقى'
                      : 'الأقسام والتواصل'}
                  </span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenCheckoutModal}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#720925] to-[#9C1C3F] hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer animate-pulse"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>تأكيد التصميم والمتابعة للحجز 🚀</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Live Mobile Device Mockup */}
          <StudioMobileSimulator
            activeTab={activeTab}
            previewViewMode={previewViewMode}
            setPreviewViewMode={setPreviewViewMode}
            previewCardInspectMode={previewCardInspectMode}
            setPreviewCardInspectMode={setPreviewCardInspectMode}
            envelopePreviewOpen={envelopePreviewOpen}
            setEnvelopePreviewOpen={setEnvelopePreviewOpen}
            sectionsVisibility={sectionsVisibility}
            backgroundColor={backgroundColor}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            innerCardStyle={innerCardStyle}
            coupleGroomAr={coupleGroomAr}
            coupleBrideAr={coupleBrideAr}
            title={title}
            eventDate={eventDate}
            customWeddingMessage={customWeddingMessage}
            waxSealMonogram={waxSealMonogram}
            livePreviewInvitation={livePreviewInvitation}
            livePreviewEvents={livePreviewEvents}
            activeTheme={activeTheme}
            livePreviewSections={livePreviewSections}
          />
        </div>
      </main>

      {/* Floating Mobile Studio Quick Bar (for phone users) */}
      <div className="lg:hidden fixed bottom-3 sm:bottom-4 inset-x-2.5 sm:inset-x-6 z-40 animate-fade-in-up">
        <div className="bg-stone-950/95 backdrop-blur-xl border border-amber-400/40 rounded-2xl p-1.5 sm:p-2.5 shadow-2xl flex items-center justify-between gap-2">
          <div className="flex items-center bg-stone-900 p-0.5 sm:p-1 rounded-xl text-xs font-bold border border-stone-800 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'editor' ? 'bg-amber-400 text-stone-950 font-black shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              المحرر ✍️
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'preview' ? 'bg-amber-400 text-stone-950 font-black shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>المعاينة 📱</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenCheckoutModal}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-stone-950 text-xs font-black shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-950" />
            <span>حفظ وتفعيل 🚀</span>
          </button>
        </div>
      </div>

      {/* Checkout & Payment Modal */}
      <CheckoutModal
        showCheckoutModal={showCheckoutModal}
        setShowCheckoutModal={setShowCheckoutModal}
        currentPkg={currentPkg}
        submitError={submitError}
        customerName={customerName}
        setCustomerName={setCustomerName}
        coupleGroomAr={coupleGroomAr}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
        customerEmail={customerEmail}
        setCustomerEmail={setCustomerEmail}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentPhone={paymentPhone}
        copySuccess={copySuccess}
        copyToClipboard={copyToClipboard}
        paymentProofBase64={paymentProofBase64}
        proofFileName={proofFileName}
        handleProofFileChange={handleProofFileChange}
        referenceNumber={referenceNumber}
        setReferenceNumber={setReferenceNumber}
        submitting={submitting}
        handleFinalSubmit={handleFinalSubmit}
      />

      {/* Tier Upgrade Notice Modal & Feedback Toast */}
      <TierNoticeModal
        tierNoticeModal={tierNoticeModal}
        setTierNoticeModal={setTierNoticeModal}
        selectedPackage={selectedPackage}
        packagesList={packagesList}
        vipPlan={vipPlan}
        journeyPlan={journeyPlan}
        handleUpgradeToPackage={handleUpgradeToPackage}
        tierFeedbackToast={tierFeedbackToast}
        setTierFeedbackToast={setTierFeedbackToast}
        submittedOrder={submittedOrder}
        setSubmittedOrder={setSubmittedOrder}
        type={type}
        generatedSlug={generatedSlug}
        copySuccess={copySuccess}
        copyToClipboard={copyToClipboard}
      />
    </div>
  );
}

export default function CreateInvitationStudioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-cairo text-sm font-bold text-stone-600">
          جاري تحميل استوديو تصميم الدعوات... 🪄
        </div>
      }
    >
      <StudioContent />
    </Suspense>
  );
}
