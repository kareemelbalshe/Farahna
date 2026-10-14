'use client';

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Heart,
  Music,
  Crown,
  Check,
  Copy,
  Upload,
  Play,
  Pause,
  Calendar,
  MapPin,
  Eye,
  Save,
  MessageCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  FileImage,
  X,
  Smartphone,
  Layers,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Sliders,
  Trash2,
  Palette,
  Maximize2,
  Camera,
  Shield,
  Lock,
  ChevronDown,
  Image as ImageIcon,
  Star,
  Plus,
  Loader2,
  Pipette,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  QURANIC_VERSES_PRESETS,
  WEDDING_MUSIC_PRESETS,
  DEFAULT_THEMES,
  DEFAULT_SECTIONS,
  ARABIC_WEDDING_FONTS,
  WeddingFontOption,
  generateInvitationSlug,
  extractCoordinatesFromUrl,
  resolveCityCoordinates,
  getOpenStreetMapUrl,
} from '@farahna/shared';
import { submitPublicDesign } from '@/lib/api';
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer';
import { DEFAULT_DEMOS } from '@/components/landing/DemoGallery';
import {
  MOCK_OMAR_SALMA,
  MOCK_AHMED_SARA,
  MOCK_MARIAM_YOUSSEF,
  MOCK_KARIM_NADA,
} from '@/lib/mockInvitationData';

const PACKAGES = [
  {
    id: 'basic',
    name: 'باقة المناسبة الواحدة',
    price: 50,
    priceLabel: '50 ج.م',
    icon: '🌸',
    badge: 'اقتصادية لمناسبة واحدة 🌸',
    tagline: 'مناسبة واحدة رئيسية بتصميم أنيق',
    summary: 'فرح أو خطوبة أو كتب كتاب واحد — تصميم متكامل ومباشر بدون تبويبات أو ألبوم صور',
    defaultMultiEvent: false,
    colorTheme: 'stone',
    features: [
      { text: 'مناسبة واحدة رئيسية (فرح أو خطوبة أو كتب كتاب)', included: true },
      { text: 'تصميم مخصص بأسماء العروسين وصورة الغلاف', included: true },
      { text: 'عداد تنازلي لموعد الحفل وموقع القاعة على خرائط جوجل', included: true },
      { text: 'آية قرآنية أو رسالة الفرح الافتتاحية المخصصة', included: true },
      { text: 'رابط مباشر ومخصص للمشاركة عبر واتساب ومسنجر', included: true },
      { text: 'تبويبات رحلة الفرح الـ 4 برابط واحد', included: false },
      { text: 'فتح الظرف التفاعلي الفاخر ثلاثي الأبعاد', included: false },
      { text: 'ألبوم صور وجاليري الذكريات VIP', included: false },
      { text: 'قسم ليلة الحنة المخصص للسيدات مع قفل سري', included: false },
    ],
  },
  {
    id: 'wedding-journey',
    name: 'باقة رحلة الفرح الشاملة',
    price: 95,
    priceLabel: '95 ج.م',
    icon: '👑',
    badge: 'الأكثر طلباً والأفضل قيمة 👑',
    tagline: 'كل مناسبات الفرح برابط واحد متكامل',
    summary: 'حتى 4 مناسبات (خطوبة + حنة + كتب كتاب + فرح) برابط واحد مع الظرف الملكي والموسيقى وRSVP',
    defaultMultiEvent: true,
    colorTheme: 'burgundy',
    features: [
      { text: 'كل مميزات الباقة الأساسية', included: true },
      { text: 'تبويبات رحلة الفرح الـ 4 برابط واحد (خطوبة + حنة + كتب كتاب + فرح)', included: true, highlight: true },
      { text: 'فتح الظرف التفاعلي الفاخر ثلاثي الأبعاد مع موسيقى', included: true, highlight: true },
      { text: 'مشغل أغاني وموسيقى تصويرية هادئة مع خيار رفع أغنيتكم', included: true },
      { text: 'تأكيد الحضور الذكي (RSVP) وحصر المعازيم إلكترونياً', included: true },
      { text: 'إضافة الموعد لتقويم هواتف المعازيم (Google & Apple)', included: true },
      { text: 'ألبوم صور وجاليري الذكريات VIP', included: false },
      { text: 'قسم ليلة الحنة المخصص للسيدات مع قفل سري', included: false },
      { text: 'البريق واللمعان الذهبي الملكي وشارة VIP', included: false },
    ],
  },
  {
    id: 'luxury-vip',
    name: 'باقة التصميم الخاص VIP',
    price: 150,
    priceLabel: '150 ج.م',
    icon: '💎',
    badge: 'فخامة ملكية وتخصيص كامل 💎',
    tagline: 'التجربة الملكية الأرقى لأصحاب الذوق الرفيع',
    summary: 'كامل مميزات المنصة + ألبوم صور الذكريات + قسم الحنة للسيدات مع قفل سري + بريق ذهبي وشارة VIP',
    defaultMultiEvent: true,
    colorTheme: 'gold',
    features: [
      { text: 'كل مميزات باقة رحلة الفرح الشاملة كاملةً', included: true },
      { text: 'ألبوم صور وجاليري الذكريات (Photo Session Gallery) مع Lightbox', included: true, highlight: true },
      { text: 'قسم ليلة الحنة المخصص للسيدات مع رمز خصوصية سري وقفل الدخول', included: true, highlight: true },
      { text: 'تأثيرات البريق والشيمر الذهبي الملكي المتحرك (Gold Sparkles)', included: true, highlight: true },
      { text: 'ختم شمعي مخصص بحروف العروسين للظرف التفاعلي (Monogram Seal)', included: true, highlight: true },
      { text: 'شارة ملكية فاخرة (VIP Crown Badge) وإزالة أي علامة ترويجية', included: true, highlight: true },
      { text: 'تخصيص كامل للألوان الملكية والخطوط الفاخرة', included: true },
    ],
  },
];

const LOCAL_STORAGE_KEY = 'farahna_draft_invitation_v2';
const LOCAL_STORAGE_ORDER_KEY = 'farahna_submitted_order_v2';

// Robust color normalizer accepting:
// - Hex with or without #, 3/6/8-char, and trailing # (common typing bug in RTL e.g. "FFF8F9#", "C48B9F#")
// - rgb(...) or rgba(...) with any spacing
// - Bare RGB numbers: "156, 81, 98" or "156,81,98" or "156 81 98" or "156 - 81 - 98"
// - Arabic-Indic numerals: "١٥٦, ٨١, ٩٨" and Arabic commas "،"
// - Common named colors in English & Arabic
function normalizeColor(input: string): string | null {
  if (!input || typeof input !== 'string') return null;
  let clean = input.trim();

  // Convert Arabic-Indic numerals (٠-٩) to standard ASCII digits
  clean = clean.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());

  // Convert Arabic comma (،) to standard comma (,)
  clean = clean.replace(/،/g, ',');

  clean = clean.toLowerCase();

  // Strip all trailing '#' (common typing bug when pasting/editing in RTL e.g. "FFF8F9#", "C48B9F#")
  clean = clean.replace(/#+$/, '').trim();

  // If input was e.g. "ffffff#" or "720925#", clean is now "ffffff" or "720925"
  const hexPart = clean.startsWith('#') ? clean.slice(1) : clean;

  // 3-digit hex (e.g. fff, 720)
  if (/^[0-9a-f]{3}$/i.test(hexPart)) {
    return `#${hexPart[0]}${hexPart[0]}${hexPart[1]}${hexPart[1]}${hexPart[2]}${hexPart[2]}`.toLowerCase();
  }

  // 6-digit hex (e.g. ffffff, 720925)
  if (/^[0-9a-f]{6}$/i.test(hexPart)) {
    return `#${hexPart}`.toLowerCase();
  }

  // 8-digit hex (with alpha)
  if (/^[0-9a-f]{8}$/i.test(hexPart)) {
    return `#${hexPart.slice(0, 6)}`.toLowerCase();
  }

  // rgb(...) or rgba(...)
  const rgbMatch = clean.match(/^rgba?\s*\(\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})/i);
  if (rgbMatch) {
    const r = Math.min(255, Math.max(0, parseInt(rgbMatch[1], 10))).toString(16).padStart(2, '0');
    const g = Math.min(255, Math.max(0, parseInt(rgbMatch[2], 10))).toString(16).padStart(2, '0');
    const b = Math.min(255, Math.max(0, parseInt(rgbMatch[3], 10))).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toLowerCase();
  }

  // Bare RGB numbers: e.g. "156, 81, 98" or "156,81,98" or "156 81 98" or "156 - 81 - 98"
  const bareRgb = clean.match(/^(\d{1,3})\s*[\s,.-]\s*(\d{1,3})\s*[\s,.-]\s*(\d{1,3})$/);
  if (bareRgb) {
    const rNum = parseInt(bareRgb[1], 10);
    const gNum = parseInt(bareRgb[2], 10);
    const bNum = parseInt(bareRgb[3], 10);
    if (rNum <= 255 && gNum <= 255 && bNum <= 255) {
      const r = rNum.toString(16).padStart(2, '0');
      const g = gNum.toString(16).padStart(2, '0');
      const b = bNum.toString(16).padStart(2, '0');
      return `#${r}${g}${b}`.toLowerCase();
    }
  }

  // Common named CSS colors & Arabic color names
  const NAMED_COLORS: Record<string, string> = {
    white: '#ffffff',
    black: '#000000',
    gold: '#d4af37',
    silver: '#c0c0c0',
    bronze: '#cd7f32',
    burgundy: '#720925',
    maroon: '#800000',
    navy: '#0f172a',
    cream: '#faf7f2',
    beige: '#fffbeb',
    emerald: '#064e3b',
    purple: '#4a044e',
    rose: '#9f1239',
    pink: '#fda4af',
    champagne: '#f59e0b',
    red: '#dc2626',
    blue: '#2563eb',
    green: '#16a34a',
    yellow: '#eab308',
    gray: '#6b7280',
    grey: '#6b7280',
    'عنابي': '#720925',
    'ذهبي': '#d4af37',
    'ذهب': '#d4af37',
    'ابيض': '#ffffff',
    'أبيض': '#ffffff',
    'اسود': '#000000',
    'أسود': '#000000',
    'كحلي': '#0f172a',
    'زمردي': '#064e3b',
    'وردي': '#fda4af',
    'كريمي': '#faf7f2',
    'بيج': '#fffbeb',
    'فضي': '#c0c0c0',
    'برونزي': '#cd7f32',
  };

  if (NAMED_COLORS[clean]) {
    return NAMED_COLORS[clean];
  }

  return null;
}

function StudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Package & Theme
  const [selectedPackage, setSelectedPackage] = useState('wedding-journey');
  const [selectedThemeId, setSelectedThemeId] = useState('theme-royal-burgundy');
  const [selectedFont, setSelectedFont] = useState("'Cairo', sans-serif");

  // Custom Colors Override (Live Real-Time Editing)
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string>('#720925');
  const [customSecondaryColor, setCustomSecondaryColor] = useState<string>('#D4AF37');
  const [customBackgroundColor, setCustomBackgroundColor] = useState<string>('#FAF7F2');

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
  const [journeyEvents, setJourneyEvents] = useState([
    {
      id: 'evt-wedding',
      type: 'wedding',
      titleAr: 'حفل الزفاف الرسمي',
      date: '2026-11-20T20:00',
      time: '08:00 م',
      venueNameAr: 'قاعة الحفل الملكية',
      addressAr: 'فندق فورسيزونز نايل بلازا، القاهرة',
      googleMapsUrl: 'https://maps.google.com/?q=Four+Seasons+Hotel+Cairo',
      enabled: true,
      dressCodeAr: 'بدلة رسمية وفستان سواريه',
    },
    {
      id: 'evt-engagement',
      type: 'engagement',
      titleAr: 'حفل الخطوبة المبارك',
      date: '2026-09-15T19:00',
      time: '07:00 م',
      venueNameAr: 'فيلا جاردينيا سيتي',
      addressAr: 'التجمع الخامس، القاهرة الجديدة',
      googleMapsUrl: 'https://maps.google.com/?q=New+Cairo',
      enabled: true,
      dressCodeAr: 'أنيق ومبهج',
    },
    {
      id: 'evt-katbketab',
      type: 'katbketab',
      titleAr: 'عقد القران وكتب الكتاب',
      date: '2026-11-10T18:00',
      time: '06:00 م',
      venueNameAr: 'مسجد الشرطة - قاعة الروضة',
      addressAr: 'الشيخ زايد، 6 أكتوبر',
      googleMapsUrl: 'https://maps.google.com/?q=Police+Mosque+Zayed',
      enabled: true,
      dressCodeAr: 'ملابس محتشمة وأنيقة',
    },
    {
      id: 'evt-henna',
      type: 'henna',
      titleAr: 'ليلة الحنة',
      date: '2026-11-18T18:30',
      time: '06:30 م',
      venueNameAr: 'حفل خاص بالسيدات',
      addressAr: 'منزل العروس، المعادي',
      googleMapsUrl: '',
      enabled: true,
      isHennaFemaleOnly: true,
      dressCodeAr: 'جلابيات وقفاطين بلدي مبهجة',
    },
  ]);

  const [activeJourneyEventIndex, setActiveJourneyEventIndex] = useState(0);

  // VIP Exclusive State (ألبوم صور الذكريات، ليلة الحنة السرية، والبريق الملكي)
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

  // WhatsApp Couple Direct Contact (Can set custom number, edit or cancel completely!)
  const [whatsappContactPhone, setWhatsappContactPhone] = useState('201019262075');
  const [whatsappContactEnabled, setWhatsappContactEnabled] = useState(true);

  // Section Visibility Toggles (Can edit, toggle or completely delete any section!)
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

  // Payment / Checkout Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
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

    // Stop current preview
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
        // Fallback to DataURL
        const reader = new FileReader();
        reader.onload = () => {
          setCustomMusicUrl(reader.result as string);
          setAudioUploadSuccess('تم تجهيز الملف الصوتي بنجاح ✅');
        };
        reader.readAsDataURL(file);
      }
    } catch {
      // Fallback to DataURL
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
      const venueParam = searchParams.get('venue');
      const cityParam = searchParams.get('city');

      if (templateParam || packageParam || themeParam || typeParam || groomParam) {
        // Find matching demo template if available (flexible prefix matching)
        const matchedDemo = DEFAULT_DEMOS.find(
          (d) => d.slug === templateParam || (templateParam && templateParam.startsWith(d.slug))
        );

        const MOCK_MAP: Record<string, any> = {
          'omar-salma': MOCK_OMAR_SALMA,
          'ahmed-sara': MOCK_AHMED_SARA,
          'mariam-youssef': MOCK_MARIAM_YOUSSEF,
          'karim-nada': MOCK_KARIM_NADA,
        };
        const matchedMockKey = templateParam
          ? Object.keys(MOCK_MAP).find((k) => templateParam === k || templateParam.startsWith(k))
          : null;
        const matchedMock = matchedMockKey ? MOCK_MAP[matchedMockKey] : null;

        const targetPackage =
          packageParam ||
          (matchedMock?.invitation?.isMultiEvent ? 'wedding-journey' : 'basic') ||
          matchedDemo?.packageId;
        if (targetPackage) {
          setSelectedPackage(targetPackage);
          if (targetPackage === 'basic') {
            setIsMultiEvent(false);
          } else {
            setIsMultiEvent(true);
          }
        }

        const targetTheme =
          themeParam ||
          matchedMock?.invitation?.themeId?.replace(/^theme-/, '') ||
          matchedDemo?.themeSlug;
        if (targetTheme) {
          const formattedThemeId = targetTheme.startsWith('theme-') ? targetTheme : `theme-${targetTheme}`;
          setSelectedThemeId(formattedThemeId);
          const themeObj = DEFAULT_THEMES.find(
            (t) => t.slug === targetTheme || `theme-${t.slug}` === targetTheme
          );
          if (themeObj?.config) {
            setCustomPrimaryColor(themeObj.config.primaryColor || '#720925');
            setCustomSecondaryColor(themeObj.config.secondaryColor || '#D4AF37');
            setCustomBackgroundColor(themeObj.config.backgroundColor || '#FAF7F2');
          }
        }

        const targetType = typeParam || matchedMock?.invitation?.type || matchedDemo?.type || 'wedding';
        setType(targetType);

        const targetGroom = groomParam || matchedMock?.invitation?.coupleGroomAr || matchedDemo?.groomName || '';
        const targetBride = brideParam || matchedMock?.invitation?.coupleBrideAr || matchedDemo?.brideName || '';
        if (targetGroom) setCoupleGroomAr(targetGroom);
        if (targetBride) setCoupleBrideAr(targetBride);

        if (matchedMock?.invitation?.coupleGroomEn) setCoupleGroomEn(matchedMock.invitation.coupleGroomEn);
        if (matchedMock?.invitation?.coupleBrideEn) setCoupleBrideEn(matchedMock.invitation.coupleBrideEn);
        if (matchedMock?.invitation?.parentsGroomAr) setParentsGroomAr(matchedMock.invitation.parentsGroomAr);
        if (matchedMock?.invitation?.parentsBrideAr) setParentsBrideAr(matchedMock.invitation.parentsBrideAr);
        if (matchedMock?.invitation?.weddingMessageAr) setCustomWeddingMessage(matchedMock.invitation.weddingMessageAr);
        if (matchedMock?.invitation?.musicUrl) {
          setCustomMusicUrl(matchedMock.invitation.musicUrl);
          setCustomMusicTitle(matchedMock.invitation.musicTitle || 'موسيقى رومانسية');
          setSelectedMusicId('custom-link');
        }
        if (matchedMock?.invitation?.coverImageUrl) setCoverImageUrl(matchedMock.invitation.coverImageUrl);
        if (matchedMock?.invitation?.coupleImageUrl) setCoupleImageUrl(matchedMock.invitation.coupleImageUrl);
        const matchedOg =
          (matchedMock?.invitation?.themeConfig as any)?.customOgImageUrl ||
          (matchedMock?.invitation as any)?.customOgImageUrl;
        if (matchedOg) setCustomOgImageUrl(matchedOg);
        if (matchedMock?.invitation?.eventDate) {
          try {
            setEventDate(new Date(matchedMock.invitation.eventDate).toISOString().slice(0, 16));
          } catch {}
        }

        const primaryEvt = matchedMock?.events?.[0];
        const targetVenue = venueParam || primaryEvt?.venueNameAr || matchedDemo?.venue || '';
        if (targetVenue) setVenueNameAr(targetVenue);

        const targetCity = cityParam || primaryEvt?.addressAr || matchedDemo?.city || '';
        if (targetCity) setAddressAr(targetCity);

        if (primaryEvt?.googleMapsUrl) setGoogleMapsUrl(primaryEvt.googleMapsUrl);

        if (matchedMock?.sections && Array.isArray(matchedMock.sections)) {
          const newVis: Record<string, boolean> = {
            envelope: true,
            cover: true,
            couple: true,
            message: true,
            countdown: true,
            venue: true,
            map: true,
            parents: !!(matchedMock.invitation.parentsGroomAr || matchedMock.invitation.parentsBrideAr),
            couple_photo: !!matchedMock.invitation.coupleImageUrl,
            gallery: !!(matchedMock.invitation.galleryImages && matchedMock.invitation.galleryImages.length > 0),
            music: !!matchedMock.invitation.musicUrl,
            rsvp: matchedMock.invitation.rsvpEnabled !== false,
            calendar: true,
            share: true,
            whatsapp: true,
          };
          matchedMock.sections.forEach((s: any) => {
            newVis[s.sectionKey] = s.isEnabled;
          });
          setSectionsVisibility(newVis);
        }

        if (targetGroom && targetBride) {
          const typeLabel =
            targetType === 'engagement'
              ? 'خطوبة'
              : targetType === 'henna'
              ? 'حنة'
              : targetType === 'katb_ketab'
              ? 'عقد قران'
              : 'زفاف';
          setTitle(`دعوة ${typeLabel} ${targetGroom} & ${targetBride} ❤️`);
        } else if (targetGroom) {
          setTitle(`دعوة ${targetGroom} ❤️`);
        }

        const templateName = matchedDemo
          ? matchedDemo.coupleNames
          : targetGroom
          ? `${targetGroom} & ${targetBride}`
          : 'النموذج المختار';

        setTemplateNotice(
          `تم استيراد نموذج "${templateName}" بنجاح! هذه دعوتك المبدئية، عدّل الأسماء، موعد المناسبة، القاعة، والألوان، وستظهر كل تعديلاتك فوراً وبشكل حي في الهاتف المقابل 📱`
        );
      } else {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.coupleGroomAr) setCoupleGroomAr(parsed.coupleGroomAr);
          if (parsed.coupleBrideAr) setCoupleBrideAr(parsed.coupleBrideAr);
          if (parsed.coupleGroomEn) setCoupleGroomEn(parsed.coupleGroomEn);
          if (parsed.coupleBrideEn) setCoupleBrideEn(parsed.coupleBrideEn);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.type) setType(parsed.type);
          if (parsed.selectedPackage) setSelectedPackage(parsed.selectedPackage);
          if (parsed.selectedThemeId) setSelectedThemeId(parsed.selectedThemeId);
          if (parsed.selectedFont) setSelectedFont(parsed.selectedFont);
          if (parsed.customPrimaryColor) setCustomPrimaryColor(parsed.customPrimaryColor);
          if (parsed.customSecondaryColor) setCustomSecondaryColor(parsed.customSecondaryColor);
          if (parsed.customBackgroundColor) setCustomBackgroundColor(parsed.customBackgroundColor);
          if (parsed.selectedVerseId) setSelectedVerseId(parsed.selectedVerseId);
          if (parsed.customWeddingMessage !== undefined) setCustomWeddingMessage(parsed.customWeddingMessage);
          if (parsed.sectionsVisibility) setSectionsVisibility(parsed.sectionsVisibility);
          if (parsed.parentsGroomAr) setParentsGroomAr(parsed.parentsGroomAr);
          if (parsed.parentsBrideAr) setParentsBrideAr(parsed.parentsBrideAr);
          if (parsed.selectedMusicId) setSelectedMusicId(parsed.selectedMusicId);
          if (parsed.customMusicUrl) setCustomMusicUrl(parsed.customMusicUrl);
          if (parsed.customMusicTitle) setCustomMusicTitle(parsed.customMusicTitle);
          if (parsed.eventDate) setEventDate(parsed.eventDate);
          if (parsed.venueNameAr) setVenueNameAr(parsed.venueNameAr);
          if (parsed.addressAr) setAddressAr(parsed.addressAr);
          if (parsed.googleMapsUrl) setGoogleMapsUrl(parsed.googleMapsUrl);
          if (parsed.isMultiEvent !== undefined) setIsMultiEvent(parsed.isMultiEvent);
          if (parsed.coverImageUrl) setCoverImageUrl(parsed.coverImageUrl);
          if (parsed.coupleImageUrl) setCoupleImageUrl(parsed.coupleImageUrl);
          if (parsed.customOgImageUrl) setCustomOgImageUrl(parsed.customOgImageUrl);
          if (parsed.customerName) setCustomerName(parsed.customerName);
          if (parsed.customerPhone) setCustomerPhone(parsed.customerPhone);
          if (parsed.whatsappContactPhone !== undefined) setWhatsappContactPhone(parsed.whatsappContactPhone);
          if (parsed.whatsappContactEnabled !== undefined) setWhatsappContactEnabled(parsed.whatsappContactEnabled);
          if (Array.isArray(parsed.journeyEvents) && parsed.journeyEvents.length > 0) setJourneyEvents(parsed.journeyEvents);
          if (parsed.slugSuffix) setSlugSuffix(parsed.slugSuffix);
          setLastSavedTime('تم استرجاع مسودتك المحفوظة');
        }
      }

      const activeOrder = localStorage.getItem(LOCAL_STORAGE_ORDER_KEY);
      if (activeOrder) {
        setSubmittedOrder(JSON.parse(activeOrder));
      }
    } catch (e) {
      // LocalStorage unavailable
    }
  }, [searchParams]);

  // 2. Auto-save Draft to LocalStorage whenever state changes
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
    } catch (e) {
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

  // Submit Self-Service Design
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!customerPhone || customerPhone.trim().length < 10) {
      setSubmitError('يرجى كتابة رقم هاتف / واتساب صالح للتواصل وتأكيد التفعيل');
      return;
    }

    if (!paymentProofBase64) {
      setSubmitError('يرجى رفع لقطة شاشة (Screenshot) لرسالة تحويل الدفع عبر InstaPay أو فودافون كاش');
      return;
    }

    setSubmitting(true);

    try {
      const currentPkg = PACKAGES.find((p) => p.id === selectedPackage) || PACKAGES[1];

      const res = await submitPublicDesign({
        customerName: customerName.trim() || coupleGroomAr || 'العروسين',
        customerPhone: customerPhone.trim(),
        packageId: selectedPackage,
        amount: currentPkg.price,
        paymentMethod,
        referenceNumber: referenceNumber.trim() || undefined,
        paymentProofImage: paymentProofBase64,
        invitation: {
          slug: generatedSlug,
          title: title || `دعوة فرح ${coupleGroomAr || 'العروسين'}`,
          type,
          coupleGroomAr: coupleGroomAr || 'العريس',
          coupleBrideAr: coupleBrideAr || 'العروس',
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
          fontFamily: selectedFont,
          whatsappPhone:
            sectionsVisibility.whatsapp && whatsappContactEnabled && whatsappContactPhone.trim()
              ? whatsappContactPhone.trim()
              : null,
          themeConfig: {
            primaryColor,
            secondaryColor,
            backgroundColor,
            textColor,
            fontFamily: selectedFont,
            selectedPackage,
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
          eventDate: new Date(eventDate).toISOString(),
          venueNameAr: sectionsVisibility.venue ? venueNameAr || 'قاعة الحفل' : 'قاعة الحفل',
          addressAr: sectionsVisibility.venue ? addressAr || 'القاهرة، مصر' : 'القاهرة، مصر',
          googleMapsUrl: sectionsVisibility.map ? googleMapsUrl || null : null,
          latitude: livePreviewEvents[0]?.latitude ?? null,
          longitude: livePreviewEvents[0]?.longitude ?? null,
          openStreetMapUrl: livePreviewEvents[0]?.openStreetMapUrl ?? null,
          isMultiEvent: selectedPackage !== 'basic' && isMultiEvent,
          isVip: selectedPackage === 'luxury-vip',
          envelopeAnimationEnabled: sectionsVisibility.envelope !== false,
          countdownEnabled: sectionsVisibility.countdown !== false,
          rsvpEnabled: sectionsVisibility.rsvp !== false,
          sections: DEFAULT_SECTIONS.map((sec, idx) => ({
            sectionKey: sec.key,
            isEnabled:
              sectionsVisibility[sec.key] !== undefined
                ? sectionsVisibility[sec.key]
                : sec.defaultEnabled,
            sortOrder: idx,
          })),
          events: livePreviewEvents,
        },
      });

      if (res.success && res.data) {
        setSubmittedOrder(res.data);
        localStorage.setItem(LOCAL_STORAGE_ORDER_KEY, JSON.stringify(res.data));
        setShowCheckoutModal(false);

        // Burst celebratory confetti
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#720925', '#FFD700', '#22C55E'],
        });
      } else {
        setSubmitError(res.message || 'فشل إرسال الطلب، يرجى مراجعة البيانات');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'حدث خطأ في الاتصال بالخادم، يرجى المحاولة مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  // Reset Draft Helper
  const handleResetDraft = () => {
    if (confirm('هل أنت متأكد من رغبتك في مسح كل البيانات والبدء من جديد؟')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(LOCAL_STORAGE_ORDER_KEY);
      window.location.reload();
    }
  };

  // Find active theme object for preview & calculate effective real-time colors
  const activeTheme =
    DEFAULT_THEMES.find((t) => t.slug === selectedThemeId || `theme-${t.slug}` === selectedThemeId) ||
    DEFAULT_THEMES[0];

  const isVip = selectedPackage === 'luxury-vip';

  // Strict VIP Rule: Custom colors are only active if VIP package is selected
  const primaryColor = isVip && normalizeColor(customPrimaryColor)
    ? normalizeColor(customPrimaryColor)!
    : (activeTheme.config?.primaryColor || '#720925');

  const secondaryColor = isVip && normalizeColor(customSecondaryColor)
    ? normalizeColor(customSecondaryColor)!
    : (activeTheme.config?.secondaryColor || '#D4AF37');

  const backgroundColor = isVip && normalizeColor(customBackgroundColor)
    ? normalizeColor(customBackgroundColor)!
    : (activeTheme.config?.backgroundColor || '#FAF7F2');

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

  const handleColorInputBlur = (
    field: 'primary' | 'secondary' | 'background',
    rawVal: string
  ) => {
    const trimmed = rawVal.trim();
    const normalized = normalizeColor(trimmed);
    if (!normalized) {
      // Revert invalid value to theme default
      if (field === 'primary') setCustomPrimaryColor(activeTheme.config?.primaryColor || '#720925');
      else if (field === 'secondary') setCustomSecondaryColor(activeTheme.config?.secondaryColor || '#D4AF37');
      else if (field === 'background') setCustomBackgroundColor(activeTheme.config?.backgroundColor || '#FAF7F2');
    } else {
      // If user typed bare RGB like "156, 81, 98", format nicely as "rgb(156, 81, 98)"
      const cleanDigits = trimmed.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString()).replace(/،/g, ',');
      const bareRgb = cleanDigits.match(/^(\d{1,3})\s*[\s,.-]\s*(\d{1,3})\s*[\s,.-]\s*(\d{1,3})$/);
      if (bareRgb) {
        const formattedRgb = `rgb(${bareRgb[1]}, ${bareRgb[2]}, ${bareRgb[3]})`;
        if (field === 'primary') setCustomPrimaryColor(formattedRgb);
        else if (field === 'secondary') setCustomSecondaryColor(formattedRgb);
        else if (field === 'background') setCustomBackgroundColor(formattedRgb);
      } else if (trimmed.startsWith('#') || /^[0-9a-f]{3,8}#?$/i.test(trimmed)) {
        // Clean up hex to uppercase
        const cleanHex = normalized.toUpperCase();
        if (field === 'primary') setCustomPrimaryColor(cleanHex);
        else if (field === 'secondary') setCustomSecondaryColor(cleanHex);
        else if (field === 'background') setCustomBackgroundColor(cleanHex);
      }
    }
  };

  const handleSelectTheme = (themeKey: string) => {
    setSelectedThemeId(themeKey);
    const matched = DEFAULT_THEMES.find((t) => t.slug === themeKey || `theme-${t.slug}` === themeKey);
    if (matched?.config) {
      setCustomPrimaryColor(matched.config.primaryColor || '#720925');
      setCustomSecondaryColor(matched.config.secondaryColor || '#D4AF37');
      setCustomBackgroundColor(matched.config.backgroundColor || '#FAF7F2');
    }
  };

  const handleResetColorsToTheme = () => {
    setCustomPrimaryColor(activeTheme.config?.primaryColor || '#720925');
    setCustomSecondaryColor(activeTheme.config?.secondaryColor || '#D4AF37');
    setCustomBackgroundColor(activeTheme.config?.backgroundColor || '#FAF7F2');
  };

  const currentPkg = PACKAGES.find((p) => p.id === selectedPackage) || PACKAGES[1];

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
    coupleBrideAr: coupleBrideAr || 'اسم العروسة',
    coupleGroomEn: coupleGroomEn || '',
    coupleBrideEn: coupleBrideEn || '',
    parentsGroomAr: sectionsVisibility.parents ? parentsGroomAr || '' : '',
    parentsBrideAr: sectionsVisibility.parents ? parentsBrideAr || '' : '',
    weddingMessageAr:
      sectionsVisibility.message && customWeddingMessage?.trim()
        ? customWeddingMessage.trim()
        : '',
    musicUrl: sectionsVisibility.music ? customMusicUrl : '',
    musicTitle: customMusicTitle,
    coverImageUrl: sectionsVisibility.cover ? coverImageUrl || undefined : undefined,
    coupleImageUrl: sectionsVisibility.couple_photo ? coupleImageUrl || undefined : undefined,
    galleryImages:
      sectionsVisibility.gallery && (selectedPackage === 'luxury-vip' || galleryImages.length > 0)
        ? galleryImages
        : [],
    customOgImageUrl: customOgImageUrl || undefined,
    themeId: selectedThemeId,
    themeConfig: {
      ...(activeTheme.config || {}),
      primaryColor,
      secondaryColor,
      backgroundColor,
      textColor,
      fontFamily: selectedFont,
      selectedPackage,
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
    whatsappPhone:
      sectionsVisibility.whatsapp && whatsappContactEnabled && whatsappContactPhone.trim()
        ? whatsappContactPhone.trim()
        : null,
    isMultiEvent: selectedPackage !== 'basic' && isMultiEvent,
    isVip: selectedPackage === 'luxury-vip',
    enableRoyalShimmer: selectedPackage === 'luxury-vip' ? enableRoyalShimmer : false,
    waxSealMonogram:
      waxSealMonogram ||
      `${coupleGroomAr?.trim()?.charAt(0) || 'أ'} & ${coupleBrideAr?.trim()?.charAt(0) || 'س'}`,
    rsvpEnabled: sectionsVisibility.rsvp !== false,
    countdownEnabled: sectionsVisibility.countdown !== false,
    envelopeAnimationEnabled: sectionsVisibility.envelope !== false,
    eventDate,
    sections: livePreviewSections,
  };

  const detectedWeddingCoords = useMemo(() => {
    if (googleMapsUrl) {
      const fromUrl = extractCoordinatesFromUrl(googleMapsUrl);
      if (fromUrl) return fromUrl;
    }
    return resolveCityCoordinates(`${venueNameAr} ${addressAr}`);
  }, [googleMapsUrl, venueNameAr, addressAr]);

  const livePreviewEvents: any[] = useMemo(() => {
    const weddingUrl = sectionsVisibility.map ? googleMapsUrl : '';
    const weddingExtracted = weddingUrl ? extractCoordinatesFromUrl(weddingUrl) : null;
    const weddingCity = !weddingExtracted
      ? resolveCityCoordinates(`${venueNameAr} ${addressAr}`)
      : null;
    const weddingLat = weddingExtracted?.latitude ?? weddingCity?.latitude ?? null;
    const weddingLng = weddingExtracted?.longitude ?? weddingCity?.longitude ?? null;
    const weddingOsmUrl =
      weddingLat && weddingLng ? getOpenStreetMapUrl(weddingLat, weddingLng) : null;

    if (selectedPackage === 'basic') {
      return [
        {
          id: 'evt-1',
          type,
          titleAr: title || 'حفل الزفاف الرسمي',
          date: eventDate,
          startTime: '08:00 م',
          venueNameAr: sectionsVisibility.venue ? venueNameAr || 'قاعة الحفل الملكية' : '',
          addressAr: sectionsVisibility.venue ? addressAr || 'القاهرة، مصر' : '',
          googleMapsUrl: weddingUrl,
          latitude: weddingLat,
          longitude: weddingLng,
          openStreetMapUrl: weddingOsmUrl,
          isVisible: sectionsVisibility.venue !== false,
        },
      ];
    }

    // For wedding-journey and luxury-vip: Return enabled journey events with resolved location
    return journeyEvents
      .filter((ev) => ev.enabled)
      .map((ev) => {
        const evMapUrl =
          ev.type === 'wedding' ? (googleMapsUrl || ev.googleMapsUrl) : ev.googleMapsUrl;
        const evVenue =
          ev.type === 'wedding' ? (venueNameAr || ev.venueNameAr) : ev.venueNameAr;
        const evAddr =
          ev.type === 'wedding' ? (addressAr || ev.addressAr) : ev.addressAr;
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
      {/* 1. Studio Sticky Topbar */}
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

            {/* Mobile View Toggle */}
            <div className="flex lg:hidden bg-stone-100 p-0.5 sm:p-1 rounded-xl text-[11px] sm:text-xs font-bold shrink-0">
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
              onClick={() => setShowCheckoutModal(true)}
              className="px-3 sm:px-7 py-2 sm:py-3 rounded-xl burgundy-gradient-bg text-white font-black text-xs sm:text-sm shadow-md shadow-rose-950/20 hover:opacity-95 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              <span className="hidden sm:inline">حفظ وتفعيل الدعوة 🚀</span>
              <span className="inline sm:hidden">حفظ 🚀</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Studio Grid: Editor (Left) & Live Phone Preview (Right) */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-6 pb-24 lg:pb-12">
        {/* Template Import Notice */}
        {templateNotice && (
          <div className="mb-6 p-4 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                🪄
              </div>
              <div>
                <h4 className="font-black text-amber-950 text-xs sm:text-sm">
                  {templateNotice}
                </h4>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  تم استيراد بيانات النموذج بنجاح. يمكنك الآن تعديل أي عنصر (الأسماء، التاريخ، الآية القرآنية، الأغنية، والقاعة) حسب رغبتكم بالكامل!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTemplateNotice(null)}
              className="p-1 rounded-lg text-amber-700 hover:text-amber-950 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Banner if already submitted order exists */}
        {submittedOrder && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <p className="font-black text-sm">
                  طلبك السابق (#{submittedOrder.orderNumber}) قيد المراجعة والاعتماد!
                </p>
                <p className="text-xs text-amber-800">
                  يمكنك معاينة دعوتك الحالية برابط المعاينة الخاص أو تعديل بياناتها هنا.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/preview/${submittedOrder.previewToken}`}
                target="_blank"
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>معاينة الرابط الخاص</span>
              </Link>
              <button
                type="button"
                onClick={handleResetDraft}
                className="px-3 py-2 rounded-xl border border-amber-300 text-amber-800 font-bold text-xs hover:bg-amber-100 transition-colors"
                title="البدء في تصميم دعوة جديدة تماماً"
              >
                تصميم جديد
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Editor Form Column */}
          <div
            className={`lg:col-span-7 space-y-8 ${
              activeTab === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Step 1: Package Selection (مقارنة وتمييز باقات فرحنا بوضوح تام) */}
            <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-sm font-black text-stone-900 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-[#720925]" />
                  <span>١. اختر خطة وباقة الدعوة (معاينة الفروق والمميزات المفتوحة):</span>
                </label>
                <span className="text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  الباقة المحددة: {currentPkg.name} ({currentPkg.priceLabel})
                </span>
              </div>

              {/* Package Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {PACKAGES.map((pkg) => {
                  const isSelected = selectedPackage === pkg.id;
                  const isVipTier = pkg.id === 'luxury-vip';
                  const isPopularTier = pkg.id === 'wedding-journey';

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => {
                        setSelectedPackage(pkg.id);
                        setIsMultiEvent(pkg.defaultMultiEvent);
                        if (pkg.id === 'luxury-vip') {
                          setSectionsVisibility((prev) => ({
                            ...prev,
                            events: true,
                            envelope: true,
                            rsvp: true,
                            gallery: true,
                            henna_special: true,
                          }));
                        } else if (pkg.id === 'wedding-journey') {
                          setSectionsVisibility((prev) => ({
                            ...prev,
                            events: true,
                            envelope: true,
                            rsvp: true,
                            henna_special: false,
                          }));
                        } else {
                          // Basic
                          setSectionsVisibility((prev) => ({
                            ...prev,
                            events: false,
                            gallery: false,
                            henna_special: false,
                          }));
                        }
                      }}
                      className={`relative p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? isVipTier
                            ? 'border-amber-400 bg-gradient-to-b from-amber-50/90 via-white to-amber-50/40 text-stone-950 shadow-md ring-2 ring-amber-300'
                            : isPopularTier
                            ? 'border-[#720925] bg-rose-50/80 text-[#720925] shadow-md ring-2 ring-rose-200'
                            : 'border-stone-800 bg-stone-50 text-stone-900 shadow-md ring-2 ring-stone-200'
                          : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/60 text-stone-800 opacity-90'
                      }`}
                    >
                      {/* Top Badge */}
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shadow-2xs ${
                            isVipTier
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : isPopularTier
                              ? 'bg-rose-100 text-rose-900 border-rose-300'
                              : 'bg-stone-100 text-stone-700 border-stone-200'
                          }`}
                        >
                          {pkg.badge}
                        </span>
                        <span className="text-2xl">{pkg.icon}</span>
                      </div>

                      {/* Header & Price */}
                      <div className="space-y-1">
                        <h3 className="font-black text-sm sm:text-base text-stone-950 flex items-center justify-between">
                          <span>{pkg.name}</span>
                          <span className="text-sm font-black font-mono text-[#720925]">
                            {pkg.priceLabel}
                          </span>
                        </h3>
                        <p className="text-[11px] text-stone-500 font-medium leading-snug">
                          {pkg.tagline}
                        </p>
                      </div>

                      {/* Features List */}
                      <div className="pt-2 border-t border-stone-200/80 space-y-1.5 flex-1">
                        <span className="text-[10px] font-bold text-stone-400 block mb-1">
                          الميزات والخصائص:
                        </span>
                        {pkg.features.map((feat, fIdx) => (
                          <div
                            key={fIdx}
                            className={`flex items-start gap-1.5 text-[11px] leading-tight ${
                              feat.included
                                ? feat.highlight
                                  ? 'font-bold text-[#720925]'
                                  : 'text-stone-700 font-medium'
                                : 'text-stone-300 line-through'
                            }`}
                          >
                            {feat.included ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-stone-300 shrink-0 mt-0.5" />
                            )}
                            <span>{feat.text}</span>
                          </div>
                        ))}
                      </div>

                      {/* Select CTA Button */}
                      <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl w-full text-center transition-all ${
                            isSelected
                              ? isVipTier
                                ? 'bg-amber-400 text-stone-950 font-black shadow-xs'
                                : isPopularTier
                                ? 'bg-[#720925] text-white font-black shadow-xs'
                                : 'bg-stone-900 text-white font-black shadow-xs'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {isSelected ? '✓ الباقة المفعلة الآن' : 'اختيار هذه الباقة'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Active Spotlight Bar */}
              <div
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
                  selectedPackage === 'luxury-vip'
                    ? 'bg-gradient-to-r from-amber-100/90 via-amber-50 to-rose-50 border-amber-300 text-amber-950'
                    : selectedPackage === 'wedding-journey'
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : 'bg-stone-100 border-stone-200 text-stone-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center text-lg shrink-0">
                    {currentPkg.icon}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black flex items-center gap-1.5">
                      <span>الباقة المفعلة في التصميم: {currentPkg.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-stone-200 font-bold">
                        {currentPkg.priceLabel}
                      </span>
                    </h4>
                    <p className="text-[11px] opacity-80 mt-0.5">
                      {selectedPackage === 'luxury-vip'
                        ? 'مفتوح لك كامل إمكانيات فرحنا: ألبوم وجاليري صور الذكريات + قسم الحنة للسيدات مع قفل سري + البريق والشيمر الذهبي الملكي + ختم شمعي مخصص بحروفكم.'
                        : selectedPackage === 'wedding-journey'
                        ? 'مفتوح لك: تبويبات الـ 4 مناسبات كاملة برابط واحد + الظرف التفاعلي ثلاثي الأبعاد + مشغل الأغاني الرومانسية + حصر الحضور (RSVP)!'
                        : 'أنت تصمم باقة مناسبة واحدة (فرح أو خطوبة). بدون تبويبات رحلة الفرح أو ألبوم صور الذكريات.'}
                    </p>
                  </div>
                </div>

                {/* Instant Upgrade CTA button if not VIP */}
                {selectedPackage === 'basic' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPackage('wedding-journey');
                      setIsMultiEvent(true);
                      setSectionsVisibility((prev) => ({
                        ...prev,
                        events: true,
                        envelope: true,
                        rsvp: true,
                      }));
                    }}
                    className="shrink-0 px-4 py-2 rounded-xl bg-[#720925] text-white font-black text-xs hover:bg-rose-900 transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <span>ترقية لرحلة الفرح (+45 ج.م) 👑</span>
                  </button>
                )}

                {selectedPackage === 'wedding-journey' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPackage('luxury-vip');
                      setIsMultiEvent(true);
                      setSectionsVisibility((prev) => ({
                        ...prev,
                        events: true,
                        envelope: true,
                        rsvp: true,
                        gallery: true,
                        henna_special: true,
                      }));
                    }}
                    className="shrink-0 px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-black text-xs hover:bg-amber-300 transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <span>ترقية لباقة VIP (+55 ج.م) 💎</span>
                  </button>
                )}

                {selectedPackage === 'luxury-vip' && (
                  <span className="shrink-0 text-xs font-black text-amber-900 bg-white/80 px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs">
                    ✨ أعلى باقة ملكية مفعلة
                  </span>
                )}
              </div>
            </section>

            {/* Step 2: Couple Names & Title */}
            <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-5 shadow-2xs">
              <label className="text-sm font-black text-stone-900 flex items-center gap-2">
                <Heart className="w-4.5 h-4.5 text-[#720925]" />
                <span>٢. أسماء العروسين وعنوان الدعوة:</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">اسم العريس (عربي): *</label>
                  <input
                    type="text"
                    required
                    value={coupleGroomAr}
                    onChange={(e) => handleCoupleNameChange(e.target.value, coupleBrideAr)}
                    placeholder="مثال: أحمد محمود"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#720925] focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">اسم العروسة (عربي): *</label>
                  <input
                    type="text"
                    required
                    value={coupleBrideAr}
                    onChange={(e) => handleCoupleNameChange(coupleGroomAr, e.target.value)}
                    placeholder="مثال: سارة إبراهيم"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#720925] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">عنوان الدعوة الرئيسي:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="دعوة زفاف أحمد & سارة ❤️"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#720925] focus:outline-hidden"
                />
              </div>

              {/* Event Type */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">نوع المناسبة الرئيسية:</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white"
                >
                  <option value="wedding">زفاف وفرح (Wedding)</option>
                  <option value="engagement">حفل خطوبة (Engagement)</option>
                  <option value="henna">ليلة حنة (Henna Night)</option>
                  <option value="katb_ketab">عقد قران وكتب كتاب (Katb Ketab)</option>
                  <option value="custom">مناسبة خاصة مخصصة</option>
                </select>
              </div>

              {/* Unique Generated Slug / Link Preview with Collision-Proof Random Suffix */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>رابط دعوتك الفريد والخاص لمنع أي تكرار:</span>
                  </span>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    رابط حصري ومميز 🔒
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 bg-white px-3 py-2.5 rounded-xl border border-amber-200 text-xs font-mono text-stone-800 shadow-2xs">
                  <div className="truncate text-left dir-ltr flex-1 font-semibold">
                    <span className="text-stone-400">https://farahna.menuflowx.com/invitation/{type}/</span>
                    <span className="text-[#720925] font-black">{generatedSlug}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        `https://farahna.menuflowx.com/invitation/${type}/${generatedSlug}`,
                        'slug'
                      )
                    }
                    className="shrink-0 p-1.5 rounded-lg text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                    title="نسخ الرابط المبدئي"
                  >
                    {copySuccess === 'slug' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-stone-600 leading-relaxed">
                  💡 يتم توليد الرابط تلقائياً بأسماء العروسين مع كود عشوائي فريد (<code className="font-mono text-amber-800 font-bold">-{slugSuffix}</code>) لضمان عدم حدوث أي تكرار أو تعارض مع أي دعوة أخرى، ويتحدث الرابط فوراً مع كتابة الأسماء!
                </p>
              </div>
            </section>

            {/* Section Controls Manager: تفعيل أو تعديل أو حذف أي سكشن في الدعوة بالكامل */}
            <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                    <Sliders className="w-4.5 h-4.5 text-[#720925]" />
                    <span>التحكم الشامل في أقسام الدعوة (تفعيل أو حذف أي سكشن) 🎛️</span>
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    يمكنك حذف أو إخفاء أي قسم لا تريده في دعوتك بنقرة واحدة، لتظهر الدعوة وتفاصيلها على مزاجك تماماً:
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const allVisible: Record<string, boolean> = {};
                      Object.keys(sectionsVisibility).forEach((k) => {
                        allVisible[k] = true;
                      });
                      setSectionsVisibility(allVisible);
                    }}
                    className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-200 cursor-pointer transition-colors"
                  >
                    تفعيل كافة الأقسام ✨
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSectionsVisibility({
                        envelope: true,
                        cover: true,
                        couple: true,
                        message: false,
                        countdown: false,
                        venue: true,
                        map: false,
                        parents: false,
                        couple_photo: false,
                        gallery: false,
                        music: false,
                        rsvp: false,
                        calendar: false,
                        share: true,
                        whatsapp: true,
                      });
                    }}
                    className="text-xs font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 px-3 py-1 rounded-xl border border-stone-200 cursor-pointer transition-colors"
                  >
                    الوضع الهادئ المختصر ⚡
                  </button>
                </div>
              </div>

              {/* Grid of Section Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 pt-1">
                {[
                  {
                    key: 'envelope',
                    title: 'الظرف الملكي التفاعلي 💌',
                    desc: 'فتح الظرف بختم الشمع وصوت الاحتفال (حذفه يجعل الدعوة تفتح مباشرة)',
                  },
                  {
                    key: 'message',
                    title: 'الآية القرآنية أو رسالة الفرح 📜',
                    desc: 'عرض الآية الكريمة أو كلمات الترحيب بالمدعوين في بداية الكارت والظرف',
                  },
                  {
                    key: 'countdown',
                    title: 'العداد التنازلي لموعد الزفاف ⏳',
                    desc: 'عرض الأيام والساعات والدقائق المتبقية حتى ليلة العمر',
                  },
                  {
                    key: 'venue',
                    title: 'مكان القاعة وعنوان الحفل 📍',
                    desc: 'اسم الفندق أو القاعة والتاريخ والعنوان بالتفصيل',
                  },
                  {
                    key: 'map',
                    title: 'الخريطة التفاعلية ورابط Maps 🗺️',
                    desc: 'زر التوجيه المباشر عبر Google Maps وخريطة الموقع',
                  },
                  {
                    key: 'music',
                    title: 'الموسيقى والخلفية الصوتية 🎵',
                    desc: 'تشغيل مقطع رومانسي تلقائياً (حذفه يجعل الدعوة صامتة تماماً)',
                  },
                  {
                    key: 'rsvp',
                    title: 'نموذج تأكيد الحضور (RSVP) 📝',
                    desc: 'استقبال تأكيدات الحضور وحصر عدد الضيوف القادمين واعتذاراتهم',
                  },
                  {
                    key: 'parents',
                    title: 'إهداء أولياء الأمور والعائلات 👨‍👩‍👧‍👦',
                    desc: 'أسماء آباء العروسين والعائلات الكريمة في الدعوة',
                  },
                  {
                    key: 'couple_photo',
                    title: 'صورة العروسين الشخصية (Portrait) 📸',
                    desc: 'صورة العريس والعروسة الرسمية في قلب الدعوة',
                  },
                  {
                    key: 'gallery',
                    title: 'معرض ألبوم الصور والذكريات 🖼️',
                    desc: 'ألبوم صور جلسة التصوير وفوتوسيشن الخطوبة',
                  },
                  {
                    key: 'calendar',
                    title: 'إضافة الموعد لتقويم الهاتف 📅',
                    desc: 'زر حفظ الموعد في Google Calendar و Apple Calendar',
                  },
                  {
                    key: 'whatsapp',
                    title: 'زر التواصل السريع عبر واتساب 💬',
                    desc: 'تمكين الضيوف من تهنئتكم أو الاستفسار مباشرة عبر واتساب',
                  },
                  {
                    key: 'share',
                    title: 'أزرار مشاركة الدعوة 🔗',
                    desc: 'نسخ رابط الدعوة ومشاركته عبر واتساب وتطبيقات التواصل',
                  },
                ].map((sec) => {
                  const isEnabled = sectionsVisibility[sec.key] !== false;
                  return (
                    <div
                      key={sec.key}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 overflow-hidden ${
                        isEnabled
                          ? 'bg-stone-50/70 border-stone-200 hover:border-amber-300'
                          : 'bg-rose-50/30 border-dashed border-rose-200 opacity-75'
                      }`}
                    >
                      {/* Top Header: Title, Status Badge, and Toggle Action */}
                      <div className="flex items-start justify-between gap-2 w-full">
                        <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                          <span className="text-xs font-black text-stone-900 leading-snug">{sec.title}</span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              isEnabled
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {isEnabled ? 'مُفعّل' : 'محذوف من الدعوة'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleSection(sec.key)}
                          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold shrink-0 transition-all cursor-pointer whitespace-nowrap self-start ${
                            isEnabled
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
                          }`}
                        >
                          {isEnabled ? 'حذف السكشن ❌' : 'استعادة السكشن ➕'}
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-stone-500 leading-snug break-words">{sec.desc}</p>

                      {/* Inline editor inputs if parents section is enabled */}
                      {sec.key === 'parents' && isEnabled && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-200/60 w-full">
                          <input
                            type="text"
                            value={parentsGroomAr}
                            onChange={(e) => setParentsGroomAr(e.target.value)}
                            placeholder="أهل العريس: نجل الأستاذ..."
                            className="w-full min-w-0 px-2.5 py-1.5 rounded-xl border border-stone-300 text-xs bg-white"
                          />
                          <input
                            type="text"
                            value={parentsBrideAr}
                            onChange={(e) => setParentsBrideAr(e.target.value)}
                            placeholder="أهل العروسة: كريمة المهندس..."
                            className="w-full min-w-0 px-2.5 py-1.5 rounded-xl border border-stone-300 text-xs bg-white"
                          />
                        </div>
                      )}

                      {/* Inline editor inputs if whatsapp section is enabled */}
                      {sec.key === 'whatsapp' && isEnabled && (
                        <div className="space-y-1.5 pt-2 border-t border-stone-200/60 w-full">
                          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 w-full">
                            <input
                              type="tel"
                              value={whatsappContactPhone}
                              onChange={(e) => setWhatsappContactPhone(e.target.value)}
                              placeholder="رقم الواتساب (مثال: 201019262075)"
                              className="min-w-0 flex-1 px-2.5 py-1.5 rounded-xl border border-stone-300 text-xs bg-white text-left font-mono dir-ltr"
                            />
                            <div className="flex items-center gap-1 shrink-0">
                              {customerPhone && customerPhone !== whatsappContactPhone && (
                                <button
                                  type="button"
                                  onClick={() => setWhatsappContactPhone(customerPhone)}
                                  className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold transition-colors cursor-pointer whitespace-nowrap"
                                >
                                  رقم الحجز
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setWhatsappContactPhone('');
                                  setSectionsVisibility((p) => ({ ...p, whatsapp: false }));
                                  setWhatsappContactEnabled(false);
                                }}
                                className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200 transition-colors cursor-pointer whitespace-nowrap"
                              >
                                مسح وإلغاء ❌
                              </button>
                            </div>
                          </div>
                          <p className="text-[10px] text-stone-500 leading-tight">
                            💡 يمكنك كتابة أي رقم بمزاجك، أو مسحه بالكامل لإلغاء زر التواصل نهائياً من الدعوة.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Step 3: Quranic Verse & Islamic Blessing Customization (تعديل أو كتابة أو حذف الآية تماماً) */}
            <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-sm font-black text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-amber-600" />
                  <span>٣. الآية القرآنية أو رسالة الفرح الافتتاحية:</span>
                </label>
                <div className="flex items-center gap-2">
                  {sectionsVisibility.message && customWeddingMessage ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomWeddingMessage('');
                        setSelectedVerseId('none');
                        setSectionsVisibility((prev) => ({ ...prev, message: false }));
                      }}
                      className="text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-xl border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف أو إخفاء الآية تماماً ❌</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomWeddingMessage(QURANIC_VERSES_PRESETS[0].verse);
                        setSelectedVerseId(QURANIC_VERSES_PRESETS[0].id);
                        setSectionsVisibility((prev) => ({ ...prev, message: true }));
                      }}
                      className="text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-xl border border-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>استعادة آية المودة والرحمة 🌸</span>
                    </button>
                  )}
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      sectionsVisibility.message && customWeddingMessage
                        ? 'text-amber-800 bg-amber-50 border-amber-200'
                        : 'text-rose-800 bg-rose-50 border-rose-200'
                    }`}
                  >
                    {sectionsVisibility.message && customWeddingMessage
                      ? 'ظاهرة في الكارت والظرف الملكي'
                      : 'محذوفة (لن تظهر بالدعوة)'}
                  </span>
                </div>
              </div>

              {!sectionsVisibility.message || !customWeddingMessage ? (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-stone-700 text-xs leading-relaxed space-y-2">
                  <p className="font-bold text-amber-950 flex items-center gap-1.5">
                    <span>✨ الآية محذوفة حالياً بناءً على رغبتك:</span>
                  </p>
                  <p className="text-stone-600">
                    لن تظهر أي آية قرآنية أو أقواس اقتباس على الظرف الملكي ولا بداخل الدعوة. ستظهر أسماء العروسين وتاريخ المناسبة بشكل فخم وموجز. يمكنك في أي وقت كتابة كلامك الخاص أو اختيار أحد النماذج أدناه.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {QURANIC_VERSES_PRESETS.map((vp) => (
                      <button
                        key={vp.id}
                        type="button"
                        onClick={() => {
                          setCustomWeddingMessage(vp.verse);
                          setSelectedVerseId(vp.id);
                          setSectionsVisibility((prev) => ({ ...prev, message: true }));
                        }}
                        className="px-2.5 py-1 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-stone-800 text-[11px] font-bold cursor-pointer transition-all"
                      >
                        {vp.title}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-stone-600 block">
                    اختر من النماذج القرآنية الجاهزة، أو اكتب كلامك الخاص:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {QURANIC_VERSES_PRESETS.map((verseItem) => {
                      const isSelected = selectedVerseId === verseItem.id;
                      return (
                        <div
                          key={verseItem.id}
                          onClick={() => {
                            handleVerseSelect(verseItem.id);
                            setSectionsVisibility((prev) => ({ ...prev, message: true }));
                          }}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-bold shadow-xs'
                              : 'border-stone-200 bg-stone-50/60 hover:bg-stone-100/70 text-stone-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black">{verseItem.title}</span>
                            {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                          </div>
                          {verseItem.surahInfo && (
                            <span className="text-[10px] text-stone-500 block mt-0.5">
                              {verseItem.surahInfo}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Textarea for custom or customized verse */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-bold text-stone-700 block flex items-center justify-between">
                      <span>نص الآية أو الرسالة المكتوبة في دعوتكم (يمكنك كتابة أي كلام أو تعديله بحرية):</span>
                      <span className="text-[10px] text-stone-400">حرية كتابة وتعديل مطلقة</span>
                    </label>
                    <textarea
                      rows={4}
                      value={customWeddingMessage}
                      onChange={(e) => {
                        setCustomWeddingMessage(e.target.value);
                        setSelectedVerseId('custom');
                        if (!e.target.value.trim()) {
                          setSectionsVisibility((prev) => ({ ...prev, message: false }));
                        } else {
                          setSectionsVisibility((prev) => ({ ...prev, message: true }));
                        }
                      }}
                      placeholder="اكتب الآية الكريمة أو الكلمات الخاصة بكم هنا، أو امسح النص لحذف القسم..."
                      className="w-full p-3.5 rounded-2xl border border-stone-200 text-xs sm:text-sm font-amiri leading-relaxed focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-stone-50/50"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Step 4: Music & Songs Selection (الميزة المطلوبة: تغيير أو حذف الأغنية) */}
            <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-sm font-black text-stone-900 flex items-center gap-2">
                  <Music className="w-4.5 h-4.5 text-[#720925]" />
                  <span>٤. الموسيقى أو الأغنية الرومانسية المرافقة:</span>
                </label>
                <div className="flex items-center gap-2">
                  {sectionsVisibility.music && customMusicUrl ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSectionsVisibility((prev) => ({ ...prev, music: false }));
                        if (audioPreviewRef.current) audioPreviewRef.current.pause();
                        setAudioPreviewing(null);
                      }}
                      className="text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-xl border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>دعوة صامتة (بدون موسيقى) 🔇</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSectionsVisibility((prev) => ({ ...prev, music: true }));
                        if (!customMusicUrl) setCustomMusicUrl(WEDDING_MUSIC_PRESETS[0].url);
                      }}
                      className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Music className="w-3.5 h-3.5" />
                      <span>تفعيل الموسيقى 🎵</span>
                    </button>
                  )}
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      sectionsVisibility.music && customMusicUrl
                        ? 'text-rose-800 bg-rose-50 border-rose-200'
                        : 'text-stone-700 bg-stone-100 border-stone-200'
                    }`}
                  >
                    {sectionsVisibility.music && customMusicUrl
                      ? 'تعزف تلقائياً عند فتح الظرف'
                      : 'دعوة صامتة (بدون صوت)'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {!sectionsVisibility.music ? (
                  <div className="p-3.5 rounded-2xl bg-stone-100/80 border border-stone-200 text-xs text-stone-600 leading-relaxed">
                    💡 تم كتم الصوت وحذف الموسيقى — الدعوة ستعمل كـ (دعوة صامتة هادئة). يمكنك تفعيل الموسيقى في أي وقت باختيار مقطع من أدناه.
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 leading-relaxed">
                    اختر من المقاطع الجاهزة أدناه، أو ضع رابط الأغنية المباشر بنفسك بحرية تامة:
                  </p>
                )}

                {/* Preset Music Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {WEDDING_MUSIC_PRESETS.map((m) => {
                    const isSelected = selectedMusicId === m.id || (m.url && customMusicUrl === m.url);
                    const isPlaying = audioPreviewing === m.url;
                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-[#720925] bg-rose-50/80 text-[#720925] shadow-xs'
                            : 'border-stone-200 bg-stone-50/60 hover:bg-stone-100/70 text-stone-800'
                        }`}
                      >
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleMusicSelect(m.id)}
                        >
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-black">{m.title}</h4>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                          <span className="text-[10px] text-stone-500 block mt-0.5">
                            {m.artist} • {m.durationHint}
                          </span>
                        </div>

                        {/* Listen Preview Button */}
                        {m.url && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAudioPreview(m.url);
                            }}
                            className={`p-2 rounded-xl transition-transform active:scale-90 cursor-pointer ${
                              isPlaying
                                ? 'bg-[#720925] text-white shadow-sm animate-pulse'
                                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                            }`}
                            title={isPlaying ? 'إيقاف الاستماع' : 'استمع للمقطع'}
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Always-visible Direct Custom Link & Upload Box */}
                <div className="p-4.5 rounded-2xl bg-[#FAF7F2] border-2 border-amber-300/80 shadow-xs space-y-3 mt-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>أو أدخل رابط الأغنية المباشر بنفسك (MP3 URL) أو ارفع ملف صوتي:</span>
                    </label>
                    {customMusicUrl && (
                      <button
                        type="button"
                        onClick={() => toggleAudioPreview(customMusicUrl)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          audioPreviewing === customMusicUrl
                            ? 'bg-[#720925] text-white animate-pulse shadow-sm'
                            : 'bg-white border border-stone-200 text-stone-800 hover:bg-stone-50'
                        }`}
                      >
                        {audioPreviewing === customMusicUrl ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{audioPreviewing === customMusicUrl ? 'إيقاف التجربة' : 'استمع للرابط الحالي 🎧'}</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <input
                      type="url"
                      value={customMusicUrl}
                      onChange={(e) => {
                        setCustomMusicUrl(e.target.value);
                        setSelectedMusicId('custom-link');
                      }}
                      placeholder="https://example.com/song.mp3 (ضع أي رابط MP3 للأغنية التي تحبها)"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-mono text-left dir-ltr focus:ring-2 focus:ring-[#720925] focus:outline-hidden bg-white"
                    />
                    <p className="text-[10px] text-stone-500">
                      💡 يمكنك وضع رابط أي أغنية بصيغة MP3 مباشرة هنا، أو اختيار مقطع من المقترحات أعلاه وتعديل رابطه بحرية.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-700 block">عنوان الأغنية المعروض في الدعوة:</label>
                      <input
                        type="text"
                        value={customMusicTitle}
                        onChange={(e) => setCustomMusicTitle(e.target.value)}
                        placeholder="مثال: أغنية زفتنا الخاصة"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-stone-700 block">أو رفع ملف MP3 من هاتفك/جهازك:</label>
                      <label className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-dashed text-xs font-bold transition-colors ${
                        isUploadingAudio
                          ? 'border-amber-400 bg-amber-50 text-amber-800 cursor-wait'
                          : 'border-stone-300 hover:border-amber-500 text-stone-700 hover:text-stone-900 cursor-pointer'
                      }`}>
                        {isUploadingAudio ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                            <span>جاري حفظ الصوت على السيرفر...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 text-amber-600" />
                            <span>اختر ملف صوتي من الجهاز 📁</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="audio/*,.mp3"
                          onChange={handleAudioFileUpload}
                          disabled={isUploadingAudio}
                          className="hidden"
                        />
                      </label>
                      {audioUploadSuccess && (
                        <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                          <span>{audioUploadSuccess}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Step 5: Theme & Royal Arabic Typography & Color Customization */}
            <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-6 shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-sm font-black text-stone-900 flex items-center gap-2">
                  <Palette className="w-4.5 h-4.5 text-[#720925]" />
                  <span>٥. قالب التصميم وتخصيص الألوان والخط العربي الملكي:</span>
                </label>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ⚡ التعديلات تظهر فوراً في المعاينة
                </span>
              </div>

              {/* 5.1: Curated Theme Cards */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 block">
                  أ. اختر قالب التصميم العام (Thème):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {DEFAULT_THEMES.map((th) => {
                    const themeKey = `theme-${th.slug}`;
                    const isSelected =
                      selectedThemeId === themeKey || selectedThemeId === th.slug;
                    return (
                      <button
                        key={th.slug}
                        type="button"
                        onClick={() => handleSelectTheme(themeKey)}
                        className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-[#720925] bg-rose-50/80 shadow-xs scale-102 ring-2 ring-[#720925]/20'
                            : 'border-stone-200 bg-white hover:bg-stone-50'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white shadow-md flex items-center justify-center text-xs"
                          style={{ backgroundColor: th.config?.primaryColor || '#720925' }}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                        </div>
                        <span className="text-[11px] font-black text-stone-900 block truncate w-full">
                          {th.nameAr}
                        </span>
                        <span className="text-[9px] text-stone-400 block truncate w-full">
                          {th.config?.primaryColor}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5.2: Real-time Color Customizer (Gated to VIP Only) */}
              {!isVip ? (
                <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-50/80 via-stone-50 to-amber-50/50 border-2 border-amber-300 shadow-xs space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4.5 h-4.5 text-amber-600" />
                      <h4 className="text-xs sm:text-sm font-black text-stone-900">
                        ب. تحكّم بدرجات الألوان بحرية كاملة (خاص بباقة VIP 👑):
                      </h4>
                    </div>
                    <span className="text-[11px] font-extrabold text-amber-900 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                      <Lock className="w-3.5 h-3.5 text-amber-700" /> ميزة حصرية لباقة VIP 👑
                    </span>
                  </div>

                  {/* Explanatory Lock Banner */}
                  <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-stone-800">
                        🔒 تخصيص درجات الألوان الحرة (عجلة الألوان / كود Hex) متاح حصرياً مع باقة VIP
                      </p>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        تتيح لك باقة VIP حرية اختيار أي درجة لون لثيم الدعوة، الزخارف والختم، ولون بطاقة الدعوة بكل حرية لتناسب ثيم قاعتكم أو فستان العروسة مع انعكاس فوري على المعاينة.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPackage('luxury-vip');
                        setIsMultiEvent(true);
                      }}
                      className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:brightness-110 text-white font-black text-xs shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      <Crown className="w-4 h-4 text-amber-200" />
                      <span>الترقية لباقة VIP وتفعيل الألوان (150 ج.م) ✨</span>
                    </button>
                  </div>

                  {/* Dimmed Preview of color pickers */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-40 pointer-events-none select-none filter blur-[0.3px]">
                    <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-2.5">
                      <span className="text-xs font-bold text-stone-800 block">اللون الرئيسي (الثيم والظرف)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-[#720925] border border-stone-300 shrink-0" />
                        <div className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-mono text-center font-bold bg-stone-50 text-stone-400">#720925</div>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-2.5">
                      <span className="text-xs font-bold text-stone-800 block">الذهب والتفاصيل (الختم والزخارف)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-[#D4AF37] border border-stone-300 shrink-0" />
                        <div className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-mono text-center font-bold bg-stone-50 text-stone-400">#D4AF37</div>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-2.5">
                      <span className="text-xs font-bold text-stone-800 block">لون الخلفية (بطاقة الدعوة)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-stone-300 shrink-0" />
                        <div className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-mono text-center font-bold bg-stone-50 text-stone-400">#FAF7F2</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-amber-200/70 shadow-xs space-y-4">
                  {/* VIP Header Bar */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                      <h4 className="text-xs sm:text-sm font-black text-stone-900">
                        ب. تحكّم بدرجات الألوان بحرية كاملة (تتغير وقتياً في الهاتف المقابل 📱):
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetColorsToTheme}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-950 bg-white px-3 py-1.5 rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                      title="استعادة ألوان القالب الأصلية"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                      <span>استعادة ألوان القالب الأصلية</span>
                    </button>
                  </div>

                  {/* 3 VIP Color Cards matching screenshot */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card 1: اللون الرئيسي (الثيم والظرف) */}
                    <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-stone-900">
                          اللون الرئيسي (الثيم والظرف):
                        </label>
                        <span className="text-[11px] font-mono font-semibold text-stone-400">
                          {(customPrimaryColor || primaryColor).toUpperCase()}
                        </span>
                      </div>

                      {/* Unified Input Container: Text RGB/HEX + Color Picker Swatch */}
                      <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-2xs hover:border-stone-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200/40 transition-all">
                        <input
                          type="text"
                          value={customPrimaryColor}
                          onChange={(e) => handleColorInputChange('primary', e.target.value)}
                          onBlur={(e) => handleColorInputBlur('primary', e.target.value)}
                          className="flex-1 bg-transparent text-center font-mono font-bold text-xs sm:text-sm text-stone-900 focus:outline-hidden dir-ltr placeholder:text-stone-300"
                          placeholder="#9C5162 أو 156, 81, 98"
                          title="اكتب أي كود HEX أو قيمة RGB مثل: rgb(156, 81, 98) أو 156, 81, 98"
                        />
                        <div className="w-px h-6 bg-stone-200 mx-2.5 shrink-0" />
                        <div
                          className="relative w-3.5 h-6.5 rounded-full border border-stone-300/90 shadow-2xs shrink-0 cursor-pointer overflow-hidden hover:scale-110 active:scale-95 transition-transform"
                          style={{ backgroundColor: safePickerPrimary }}
                          title="انقر لفتح عجلة الألوان واختيار أي درجة بحرية"
                        >
                          <input
                            type="color"
                            value={safePickerPrimary}
                            onChange={(e) => handleColorInputChange('primary', e.target.value.toUpperCase())}
                            className="absolute -inset-4 w-[250%] h-[250%] opacity-0 cursor-pointer"
                            title="انقر لفتح عجلة الألوان"
                          />
                        </div>
                      </div>

                      {/* Suggested Royal Swatches */}
                      <div className="space-y-1.5 pt-0.5">
                        <span className="text-[11px] text-stone-400 font-bold block">درجات ملكية مقترحة:</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          {[
                            { name: 'شوكولاتة ملكية', hex: '#3B1E08' },
                            { name: 'أسود فاخر', hex: '#18181B' },
                            { name: 'موف ملكي', hex: '#4A044E' },
                            { name: 'كحلي داكن', hex: '#0F172A' },
                            { name: 'زمردي ملكي', hex: '#064E3B' },
                            { name: 'عنابي ملكي', hex: '#720925' },
                            { name: 'وردي ملكي', hex: '#9C5162' },
                          ].map((swatch) => (
                            <button
                              key={swatch.hex}
                              type="button"
                              onClick={() => handleColorInputChange('primary', swatch.hex)}
                              className="w-5.5 h-5.5 rounded-full border border-stone-300/80 shadow-2xs cursor-pointer hover:scale-120 active:scale-95 transition-all"
                              style={{ backgroundColor: swatch.hex }}
                              title={`${swatch.name} (${swatch.hex})`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card 2: الذهب والتفاصيل (الختم والزخارف) */}
                    <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-stone-900">
                          الذهب والتفاصيل (الختم والزخارف):
                        </label>
                        <span className="text-[11px] font-mono font-semibold text-stone-400">
                          {(customSecondaryColor || secondaryColor).toUpperCase()}
                        </span>
                      </div>

                      {/* Unified Input Container: Text RGB/HEX + Color Picker Swatch */}
                      <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-2xs hover:border-stone-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200/40 transition-all">
                        <input
                          type="text"
                          value={customSecondaryColor}
                          onChange={(e) => handleColorInputChange('secondary', e.target.value)}
                          onBlur={(e) => handleColorInputBlur('secondary', e.target.value)}
                          className="flex-1 bg-transparent text-center font-mono font-bold text-xs sm:text-sm text-stone-900 focus:outline-hidden dir-ltr placeholder:text-stone-300"
                          placeholder="#D4AF37 أو 212, 175, 55"
                          title="اكتب أي كود HEX أو قيمة RGB مثل: rgb(212, 175, 55) أو 212, 175, 55"
                        />
                        <div className="w-px h-6 bg-stone-200 mx-2.5 shrink-0" />
                        <div
                          className="relative w-3.5 h-6.5 rounded-full border border-stone-300/90 shadow-2xs shrink-0 cursor-pointer overflow-hidden hover:scale-110 active:scale-95 transition-transform"
                          style={{ backgroundColor: safePickerSecondary }}
                          title="انقر لفتح عجلة الألوان واختيار أي درجة بحرية"
                        >
                          <input
                            type="color"
                            value={safePickerSecondary}
                            onChange={(e) => handleColorInputChange('secondary', e.target.value.toUpperCase())}
                            className="absolute -inset-4 w-[250%] h-[250%] opacity-0 cursor-pointer"
                            title="انقر لفتح عجلة الألوان"
                          />
                        </div>
                      </div>

                      {/* Suggested Gold Swatches */}
                      <div className="space-y-1.5 pt-0.5">
                        <span className="text-[11px] text-stone-400 font-bold block">درجات الذهب المقترحة:</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          {[
                            { name: 'وردي ذهبي', hex: '#FDA4AF' },
                            { name: 'بلاتينيوم فضي', hex: '#94A3B8' },
                            { name: 'ذهب كهرماني', hex: '#F59E0B' },
                            { name: 'برونز دافئ', hex: '#E0A96D' },
                            { name: 'ذهب ملكي', hex: '#D4AF37' },
                          ].map((swatch) => (
                            <button
                              key={swatch.hex}
                              type="button"
                              onClick={() => handleColorInputChange('secondary', swatch.hex)}
                              className="w-5.5 h-5.5 rounded-full border border-stone-300/80 shadow-2xs cursor-pointer hover:scale-120 active:scale-95 transition-all"
                              style={{ backgroundColor: swatch.hex }}
                              title={`${swatch.name} (${swatch.hex})`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card 3: لون الخلفية (بطاقة الدعوة) */}
                    <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-stone-900">
                          لون الخلفية (بطاقة الدعوة):
                        </label>
                        <span className="text-[11px] font-mono font-semibold text-stone-400">
                          {(customBackgroundColor || backgroundColor).toUpperCase()}
                        </span>
                      </div>

                      {/* Unified Input Container: Text RGB/HEX + Color Picker Swatch */}
                      <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-2xs hover:border-stone-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200/40 transition-all">
                        <input
                          type="text"
                          value={customBackgroundColor}
                          onChange={(e) => handleColorInputChange('background', e.target.value)}
                          onBlur={(e) => handleColorInputBlur('background', e.target.value)}
                          className="flex-1 bg-transparent text-center font-mono font-bold text-xs sm:text-sm text-stone-900 focus:outline-hidden dir-ltr placeholder:text-stone-300"
                          placeholder="#FAF7F2 أو 250, 247, 242"
                          title="اكتب أي كود HEX أو قيمة RGB مثل: rgb(250, 247, 242) أو 250, 247, 242"
                        />
                        <div className="w-px h-6 bg-stone-200 mx-2.5 shrink-0" />
                        <div
                          className="relative w-3.5 h-6.5 rounded-full border border-stone-300/90 shadow-2xs shrink-0 cursor-pointer overflow-hidden hover:scale-110 active:scale-95 transition-transform"
                          style={{ backgroundColor: safePickerBackground }}
                          title="انقر لفتح عجلة الألوان واختيار أي درجة بحرية"
                        >
                          <input
                            type="color"
                            value={safePickerBackground}
                            onChange={(e) => handleColorInputChange('background', e.target.value.toUpperCase())}
                            className="absolute -inset-4 w-[250%] h-[250%] opacity-0 cursor-pointer"
                            title="انقر لفتح عجلة الألوان"
                          />
                        </div>
                      </div>

                      {/* Suggested Background Swatches */}
                      <div className="space-y-1.5 pt-0.5">
                        <span className="text-[11px] text-stone-400 font-bold block">خلفيات راقية مقترحة:</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          {[
                            { name: 'أبيض نقي', hex: '#FFFFFF' },
                            { name: 'دارك مود فاخر', hex: '#18181B' },
                            { name: 'كريمي عاجي', hex: '#FAF7F2' },
                            { name: 'أبيض ناعم', hex: '#FFF8F9' },
                            { name: 'رمادي لؤلؤي', hex: '#F8FAFC' },
                          ].map((swatch) => (
                            <button
                              key={swatch.hex}
                              type="button"
                              onClick={() => handleColorInputChange('background', swatch.hex)}
                              className="w-5.5 h-5.5 rounded-full border border-stone-300/80 shadow-2xs cursor-pointer hover:scale-120 active:scale-95 transition-all"
                              style={{ backgroundColor: swatch.hex }}
                              title={`${swatch.name} (${swatch.hex})`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5.3: Arabic Wedding Typography with Live Preview */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 block">
                    ج. نوع الخط العربي الملكي (Calligraphy & Typography):
                  </label>
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    خطوط أفراح عربية أصيلة 👑
                  </span>
                </div>

                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-xs sm:text-sm bg-white font-bold cursor-pointer"
                >
                  {ARABIC_WEDDING_FONTS.map((f: WeddingFontOption) => (
                    <option key={f.id} value={f.fontFamily}>
                      {f.nameAr} — {f.description}
                    </option>
                  ))}
                </select>

                {/* Instant Calligraphy Visual Preview Card */}
                <div
                  className="p-4 rounded-2xl border border-stone-200/90 text-center space-y-1 transition-all shadow-2xs"
                  style={{
                    backgroundColor: backgroundColor,
                    color: textColor,
                    fontFamily: selectedFont,
                  }}
                >
                  <span className="text-[10px] uppercase tracking-widest block opacity-60 font-mono">
                    معاينة حية لشكل الخط:
                  </span>
                  <h3
                    className="text-lg sm:text-2xl font-black transition-colors"
                    style={{ color: primaryColor }}
                  >
                    {coupleGroomAr || coupleBrideAr
                      ? `${coupleGroomAr || 'العريس'} & ${coupleBrideAr || 'العروس'}`
                      : 'أحمد & سارة'}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold opacity-85">
                    بارك الله لهما وبارك عليهما وجمع بينهما في خير ✨
                  </p>
                </div>
              </div>
            </section>

            {/* Step 6: Event Date, Time & Venue (إدارة مواعيد ومواقع مناسبات الفرح) */}
            <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-sm font-black text-stone-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#720925]" />
                  <span>٦. موعد ومكان الحفل وجدول رحلة الفرح:</span>
                </label>
                <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                  {selectedPackage === 'basic' ? 'مناسبة واحدة فقط' : 'رحلة الفرح (حتى 4 مناسبات)'}
                </span>
              </div>

              {/* Primary Wedding Details */}
              <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                    <span>👑 موعد وقاعة حفل الزفاف الرئيسي: *</span>
                  </h4>
                  <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md font-bold">
                    المناسبة الأساسية
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">تاريخ وتوقيت المناسبة: *</label>
                    <input
                      type="datetime-local"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-left dir-ltr bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">اسم القاعة / الفندق / المكان: *</label>
                    <input
                      type="text"
                      value={venueNameAr}
                      onChange={(e) => setVenueNameAr(e.target.value)}
                      placeholder="مثال: قاعة الماسة - فندق فورسيزونز"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">العنوان بالتفصيل:</label>
                    <input
                      type="text"
                      value={addressAr}
                      onChange={(e) => setAddressAr(e.target.value)}
                      placeholder="مثال: كورنيش النيل، جاردن سيتي، القاهرة"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">
                      رابط خرائط جوجل (Google Maps Link):
                    </label>
                    <input
                      type="url"
                      value={googleMapsUrl}
                      onChange={(e) => setGoogleMapsUrl(e.target.value)}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-left dir-ltr font-mono bg-white"
                    />
                    {detectedWeddingCoords ? (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl mt-1.5 font-bold">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>تم ضبط الموقع على خرائط جوجل والخريطة التفاعلية بدقة 📍</span>
                      </div>
                    ) : (
                      <p className="text-[10px] text-stone-400 mt-1">
                        💡 يمكنك وضع رابط خرائط جوجل أو الإحداثيات مباشرة لفتح اتجاهات الملاحة بدقة لضيوفك.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Journey Events Multi-Tabs Manager (متاح في رحلة الفرح و VIP) */}
              {selectedPackage !== 'basic' ? (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-amber-950 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>جدول ومواعيد باقي مناسبات رحلة الفرح (تظهر في تبويبات الدعوة):</span>
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        يمكنك تفعيل أو تعديل مواعيد وقاعات كل مناسبة من مناسباتكم بشكل منفصل:
                      </p>
                    </div>
                  </div>

                  {/* Sub-events selector tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {journeyEvents.map((jev, jIdx) => (
                      <button
                        key={jev.id}
                        type="button"
                        onClick={() => setActiveJourneyEventIndex(jIdx)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-right cursor-pointer flex flex-col justify-between gap-1.5 ${
                          activeJourneyEventIndex === jIdx
                            ? 'border-[#720925] bg-rose-50 text-[#720925] shadow-xs'
                            : jev.enabled
                            ? 'border-stone-200 bg-white text-stone-800 hover:bg-stone-50'
                            : 'border-dashed border-stone-300 bg-stone-50 text-stone-400'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs">{jev.titleAr}</span>
                          <span className={`w-2 h-2 rounded-full ${jev.enabled ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                        </div>
                        <span className="text-[10px] text-stone-500 font-mono" dir="ltr">
                          {jev.time}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Active Sub-Event Editor Card */}
                  {journeyEvents[activeJourneyEventIndex] && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-950">
                          تعديل تفاصيل: {journeyEvents[activeJourneyEventIndex].titleAr}
                        </span>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={journeyEvents[activeJourneyEventIndex].enabled}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setJourneyEvents((prev) =>
                                prev.map((ev, idx) =>
                                  idx === activeJourneyEventIndex ? { ...ev, enabled: checked } : ev
                                )
                              );
                            }}
                            className="w-4 h-4 rounded text-[#720925]"
                          />
                          <span className="text-xs font-bold text-amber-900">تضمين في الدعوة</span>
                        </label>
                      </div>

                      {journeyEvents[activeJourneyEventIndex].enabled && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-stone-700 block">اسم المكان / القاعة:</label>
                            <input
                              type="text"
                              value={journeyEvents[activeJourneyEventIndex].venueNameAr}
                              onChange={(e) => {
                                const val = e.target.value;
                                setJourneyEvents((prev) =>
                                  prev.map((ev, idx) =>
                                    idx === activeJourneyEventIndex ? { ...ev, venueNameAr: val } : ev
                                  )
                                );
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-stone-700 block">تاريخ المناسبة:</label>
                            <input
                              type="date"
                              value={
                                journeyEvents[activeJourneyEventIndex].date
                                  ? journeyEvents[activeJourneyEventIndex].date.slice(0, 10)
                                  : ''
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                setJourneyEvents((prev) =>
                                  prev.map((ev, idx) =>
                                    idx === activeJourneyEventIndex
                                      ? { ...ev, date: val ? `${val}T19:00` : ev.date }
                                      : ev
                                  )
                                );
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-left font-mono dir-ltr"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-stone-700 block">التوقيت والساعة:</label>
                            <input
                              type="text"
                              value={journeyEvents[activeJourneyEventIndex].time}
                              onChange={(e) => {
                                const val = e.target.value;
                                setJourneyEvents((prev) =>
                                  prev.map((ev, idx) =>
                                    idx === activeJourneyEventIndex ? { ...ev, time: val } : ev
                                  )
                                );
                              }}
                              placeholder="08:00 م"
                              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-left dir-ltr"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-stone-700 block">العنوان أو الحي:</label>
                            <input
                              type="text"
                              value={journeyEvents[activeJourneyEventIndex].addressAr}
                              onChange={(e) => {
                                const val = e.target.value;
                                setJourneyEvents((prev) =>
                                  prev.map((ev, idx) =>
                                    idx === activeJourneyEventIndex ? { ...ev, addressAr: val } : ev
                                  )
                                );
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white"
                            />
                          </div>

                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[11px] font-bold text-stone-700 block">رابط خريطة Google Maps (اختياري):</label>
                            <input
                              type="url"
                              value={journeyEvents[activeJourneyEventIndex].googleMapsUrl || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setJourneyEvents((prev) =>
                                  prev.map((ev, idx) =>
                                    idx === activeJourneyEventIndex ? { ...ev, googleMapsUrl: val } : ev
                                  )
                                );
                              }}
                              placeholder="https://maps.google.com/?q=..."
                              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-left font-mono dir-ltr"
                            />
                            {journeyEvents[activeJourneyEventIndex].googleMapsUrl ? (
                              <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg mt-1 font-bold">
                                <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>جاهز للربط مع جوجل ماب وخريطة OpenStreetMap 🗺️</span>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Journey Locked Notice for Basic Package */
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">💡</span>
                    <div>
                      <p className="text-xs font-black text-amber-950">
                        هل لديك مناسبات أخرى (حفل خطوبة، حنة، أو كتب كتاب)؟
                      </p>
                      <p className="text-[11px] text-amber-800">
                        باقة رحلة الفرح الشاملة تتيح لك حتى 4 مناسبات كاملة برابط واحد مع تبويبات تنقل أنيقة.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPackage('wedding-journey');
                      setIsMultiEvent(true);
                      setSectionsVisibility((prev) => ({
                        ...prev,
                        events: true,
                        envelope: true,
                        rsvp: true,
                      }));
                    }}
                    className="shrink-0 px-4 py-2 rounded-xl bg-[#720925] text-white font-bold text-xs hover:bg-rose-900 transition-colors cursor-pointer"
                  >
                    ترقية لرحلة الفرح (+45 ج.م) 👑
                  </button>
                </div>
              )}
            </section>

            {/* Step 6.1: VIP Luxury Suite (متاح ومفعل حصرياً في باقة VIP) */}
            {selectedPackage === 'luxury-vip' ? (
              <section className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-amber-50/90 via-white to-amber-50/60 border-2 border-amber-300 shadow-md space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-amber-200">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">💎</span>
                    <div>
                      <h3 className="text-base font-black text-amber-950 flex items-center gap-2">
                        <span>جناح التخصيص الملكي الحصري (VIP Luxury Suite)</span>
                        <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                          مفعل بالكامل VIP
                        </span>
                      </h3>
                      <p className="text-xs text-amber-800">
                        ميزات خاصة وحصرية لأصحاب باقة التصميم الخاص VIP تمنح دعوتكم فخامة استثنائية.
                      </p>
                    </div>
                  </div>
                </div>

                {/* VIP Feature 1: Photo Album Gallery */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-amber-600" />
                        <span>١. ألبوم وجاليري صور الذكريات (Photo Session Album):</span>
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        معرض صور تفاعلي للعروسين يظهر في الدعوة مع تكبير الصور (Lightbox).
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {galleryImages.length} صور في الألبوم
                    </span>
                  </div>

                  {/* Photo thumbnails grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {galleryImages.map((imgUrl, gIdx) => (
                      <div key={gIdx} className="group relative aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-2xs">
                        <img src={imgUrl} alt={`صورة ${gIdx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <button
                          type="button"
                          onClick={() => setGalleryImages((prev) => prev.filter((_, idx) => idx !== gIdx))}
                          className="absolute top-1 left-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                          title="حذف هذه الصورة"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Image Controls */}
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={customGalleryUrlInput}
                      onChange={(e) => setCustomGalleryUrlInput(e.target.value)}
                      placeholder="أدخل رابط صورة لإضافتها للجاليري..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50 font-mono text-left dir-ltr"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customGalleryUrlInput.trim()) {
                          setGalleryImages((prev) => [...prev, customGalleryUrlInput.trim()]);
                          setCustomGalleryUrlInput('');
                        }
                      }}
                      className="shrink-0 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة</span>
                    </button>
                  </div>
                </div>

                {/* VIP Feature 2: Ladies-only Henna Party with Passcode */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200 space-y-3.5 shadow-xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-rose-600" />
                        <span>٢. قسم ليلة الحنة المخصص للسيدات مع رمز خصوصية سري:</span>
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        بطاقة خاصة لليلة الحنة للسيدات مع تنبيه ممنوع التصوير ورمز دخول خاص.
                      </p>
                    </div>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hennaFemaleOnly}
                        onChange={(e) => {
                          setHennaFemaleOnly(e.target.checked);
                          setSectionsVisibility((p) => ({ ...p, henna_special: e.target.checked }));
                        }}
                        className="w-4 h-4 rounded text-[#720925]"
                      />
                      <span className="text-xs font-bold text-stone-700">تفعيل القسم</span>
                    </label>
                  </div>

                  {hennaFemaleOnly && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-stone-600 block">
                          رمز الدخول السري للقاعة (Passcode):
                        </label>
                        <input
                          type="text"
                          value={hennaPasscode}
                          onChange={(e) => setHennaPasscode(e.target.value)}
                          placeholder="مثال: 2026"
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-mono font-bold text-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-stone-600 block">
                          رسالة الخصوصية للمدعوات:
                        </label>
                        <input
                          type="text"
                          value={hennaMessage}
                          onChange={(e) => setHennaMessage(e.target.value)}
                          placeholder="يسعدنا تشريفكم..."
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* VIP Feature 3: Royal Shimmer & Monogram Seal */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200 space-y-3.5 shadow-xs">
                  <h4 className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>٣. التأثيرات الملكية الفاخرة وختم الحروف Monogram:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 p-3 rounded-xl bg-amber-50/70 border border-amber-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableRoyalShimmer}
                        onChange={(e) => setEnableRoyalShimmer(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600"
                      />
                      <div>
                        <span className="text-xs font-bold text-amber-950 block">بريق وشيمر ذهبي ملكي متحرك ✨</span>
                        <span className="text-[10px] text-amber-800">جزيئات ذهبية تطفو بنعومة في خلفية الدعوة</span>
                      </div>
                    </label>

                    <div className="space-y-1 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                      <label className="text-[11px] font-bold text-stone-700 block">
                        حروف ختم الشمع (Monogram Seal):
                      </label>
                      <input
                        type="text"
                        value={waxSealMonogram}
                        onChange={(e) => setWaxSealMonogram(e.target.value)}
                        placeholder={`${coupleGroomAr?.charAt(0) || 'أ'} & ${coupleBrideAr?.charAt(0) || 'س'}`}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-bold text-center font-cairo"
                      />
                      <span className="text-[10px] text-stone-400 block text-center">تُنقش في منتصف ختم الشمع الملكي 💌</span>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              /* VIP Teaser Card if Basic or Wedding Journey is selected */
              <section className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white space-y-3 shadow-md border border-stone-700">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">💎</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black flex items-center gap-2">
                        <span>ميزات باقة التصميم الخاص VIP الملكية</span>
                        <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full">
                          +55 ج.م فقط
                        </span>
                      </h4>
                      <p className="text-[11px] text-stone-300 mt-0.5">
                        افتح ألبوم صور العروسين (Photo Session) + قسم ليلة الحنة للسيدات مع قفل سري + الشيمر والبريق الذهبي الملكي.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPackage('luxury-vip');
                      setIsMultiEvent(true);
                      setSectionsVisibility((prev) => ({
                        ...prev,
                        events: true,
                        envelope: true,
                        rsvp: true,
                        gallery: true,
                        henna_special: true,
                      }));
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ترقية لباقة VIP الآن 💎</span>
                  </button>
                </div>
              </section>
            )}

            {/* Step 7: Photos & WhatsApp Link Preview Image (الميزة المطلوبة: صورة معاينة الرابط على واتساب ومواقع التواصل) */}
            <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-6 shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-sm font-black text-stone-900 flex items-center gap-2">
                  <FileImage className="w-4.5 h-4.5 text-[#720925]" />
                  <span>٧. صور الدعوة وصورة معاينة الرابط في رسائل واتساب:</span>
                </label>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  تظهر كغلاف مصغر للرابط في شات الواتس 💬
                </span>
              </div>

              {/* 7.1: Dedicated WhatsApp Link Preview Image Customizer */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border-2 border-amber-300/90 space-y-4 shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>صورة كارت الرابط على واتساب (WhatsApp Link Preview Image):</span>
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      هذه الصورة هي التي ستظهر كغلاف مصغر للرابط عند مشاركته في رسائل ومحادثات واتساب ومواقع التواصل.
                    </p>
                  </div>
                  {customOgImageUrl && (
                    <button
                      type="button"
                      onClick={() => setCustomOgImageUrl('')}
                      className="text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                    >
                      استعادة الصورة الافتراضية
                    </button>
                  )}
                </div>

                {/* WhatsApp Chat Balloon Simulation Live Preview */}
                <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-[#EFEAE2] border border-stone-300 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-stone-500 font-bold px-1">
                    <span>📱 كيف سيظهر الرابط في محادثة واتساب للضيوف:</span>
                    <span>10:30 ص</span>
                  </div>

                  <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs text-right">
                    {/* Simulated OG Image */}
                    <div className="h-44 sm:h-48 w-full bg-stone-900 relative overflow-hidden flex items-center justify-center">
                      {customOgImageUrl || coverImageUrl || coupleImageUrl ? (
                        <img
                          src={customOgImageUrl || coverImageUrl || coupleImageUrl}
                          alt="معاينة رابط واتساب"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#2C050E] to-[#150206] p-4 flex flex-col items-center justify-center text-center text-white border-4 border-amber-400/40">
                          <span className="text-xs text-amber-300 font-bold mb-1">💍 دعوة زفاف إلكترونية خاصة</span>
                          <span className="text-lg font-black text-white">
                            {coupleGroomAr || coupleBrideAr
                              ? `${coupleGroomAr || 'العريس'} & ${coupleBrideAr || 'العروس'}`
                              : 'أحمد & سارة'}
                          </span>
                          <span className="text-[10px] text-stone-300 mt-2">منصة فرحنا — Farahna</span>
                        </div>
                      )}
                    </div>

                    {/* Simulated OG Title & Description */}
                    <div className="p-3 bg-stone-50 space-y-1">
                      <p className="font-bold text-xs text-stone-900 truncate">
                        دعوة فرح {coupleGroomAr || 'العريس'} & {coupleBrideAr || 'العروس'} ❤️
                      </p>
                      <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                        فرحتنا قربت ويسعدنا حضوركم لتشاركونا أجمل لحظات حياتنا. اضغط لمشاهدة تفاصيل الفرح وموقع القاعة وتأكيد الحضور.
                      </p>
                      <span className="text-[10px] font-mono text-stone-400 block pt-1">
                        farahna.menuflowx.com
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls to upload or set WhatsApp preview image */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={customOgImageUrl}
                      onChange={(e) => setCustomOgImageUrl(e.target.value)}
                      placeholder="ضع رابط صورة مخصصة للواتساب (أو ارفع صورة من هاتفك)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white text-left dir-ltr font-mono"
                    />
                    <label className="shrink-0 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs">
                      <Upload className="w-4 h-4 text-stone-950" />
                      <span>رفع صورة 🖼️</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, 'og')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Quick Shortcut Buttons */}
                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    <span className="text-stone-500 font-bold">اختيارات سريعة:</span>
                    {coverImageUrl && (
                      <button
                        type="button"
                        onClick={() => setCustomOgImageUrl(coverImageUrl)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 font-bold cursor-pointer"
                      >
                        استخدام صورة الغلاف
                      </button>
                    )}
                    {coupleImageUrl && (
                      <button
                        type="button"
                        onClick={() => setCustomOgImageUrl(coupleImageUrl)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 font-bold cursor-pointer"
                      >
                        استخدام صورة العروسين
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setCustomOgImageUrl('')}
                      className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-amber-900 font-bold cursor-pointer"
                    >
                      كارت فرحنا الملكي التلقائي
                    </button>
                  </div>
                </div>
              </div>

              {/* 7.2: Cover Image & Couple Portrait Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Cover Image */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800">
                      صورة غلاف الدعوة (Cover Photo):
                    </label>
                    {coverImageUrl && (
                      <button
                        type="button"
                        onClick={() => setCoverImageUrl('')}
                        className="text-[10px] text-rose-600 font-bold hover:underline"
                      >
                        حذف
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={coverImageUrl}
                      onChange={(e) => {
                        setCoverImageUrl(e.target.value);
                        if (e.target.value) setSectionsVisibility((p) => ({ ...p, cover: true }));
                      }}
                      placeholder="رابط صورة الغلاف أو ارفعها"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-left dir-ltr font-mono"
                    />
                    <label className="shrink-0 px-3 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>رفع</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, 'cover')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Couple Portrait Photo */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800">
                      صورة العروسين الشخصية (Couple Photo):
                    </label>
                    {coupleImageUrl && (
                      <button
                        type="button"
                        onClick={() => setCoupleImageUrl('')}
                        className="text-[10px] text-rose-600 font-bold hover:underline"
                      >
                        حذف
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={coupleImageUrl}
                      onChange={(e) => {
                        setCoupleImageUrl(e.target.value);
                        if (e.target.value) setSectionsVisibility((p) => ({ ...p, couple_photo: true }));
                      }}
                      placeholder="رابط صورة العروسين أو ارفعها"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-left dir-ltr font-mono"
                    />
                    <label className="shrink-0 px-3 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs cursor-pointer flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>رفع</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, 'couple')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* 8. زر تواصل المعازيم عبر واتساب مع أصحاب الدعوة (WhatsApp Direct Contact Settings) */}
            <section className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/80 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
                      <span>زر تواصل المعازيم عبر واتساب مع أصحاب الفرح</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        مباشر 💬
                      </span>
                    </h2>
                    <p className="text-xs text-stone-500">
                      حدد رقم هاتف بمزاجك، عدّله بأي وقت، أو ألغه بالكامل لحفظ خصوصيتكم
                    </p>
                  </div>
                </div>

                {/* Main Enable / Disable Toggle */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-bold text-stone-700">
                    {sectionsVisibility.whatsapp && whatsappContactEnabled && whatsappContactPhone.trim()
                      ? 'الزر مفعل بالدعوة'
                      : 'الزر ملغي / محذوف'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(
                        sectionsVisibility.whatsapp &&
                        whatsappContactEnabled &&
                        whatsappContactPhone.trim()
                      )}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setWhatsappContactEnabled(checked);
                        setSectionsVisibility((prev) => ({ ...prev, whatsapp: checked }));
                        if (checked && !whatsappContactPhone.trim()) {
                          setWhatsappContactPhone(customerPhone || '201019262075');
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                  </label>
                </div>
              </div>

              {/* Status explanation & controls */}
              {sectionsVisibility.whatsapp && whatsappContactEnabled && whatsappContactPhone.trim() ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-800 block">
                        رقم الواتساب لاستقبال رسائل المعازيم (WhatsApp Number):
                      </label>
                      <div className="flex items-center gap-2">
                        {customerPhone && customerPhone !== whatsappContactPhone && (
                          <button
                            type="button"
                            onClick={() => setWhatsappContactPhone(customerPhone)}
                            className="text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                          >
                            استخدام رقم الحجز ({customerPhone})
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setWhatsappContactPhone('');
                            setWhatsappContactEnabled(false);
                            setSectionsVisibility((p) => ({ ...p, whatsapp: false }));
                          }}
                          className="text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                        >
                          مسح وإلغاء الزر ❌
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="tel"
                        value={whatsappContactPhone}
                        onChange={(e) => setWhatsappContactPhone(e.target.value)}
                        placeholder="مثال: 201019262075 أو 01019262075 أو +9665..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-mono text-left dir-ltr bg-stone-50 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      💡 اكتب كود الدولة بدون مسافات (مثال لمصر: <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-800">201019262075</code> أو <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-800">01019262075</code>).
                    </p>
                  </div>

                  {/* Live preview badge matching the user's screenshot */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-stone-700">معاينة شكل الزر في أسفل الدعوة:</span>
                      {whatsappContactPhone.replace(/[^0-9]/g, '').length >= 5 && (
                        <a
                          href={`https://wa.me/${whatsappContactPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <span>تجربة فتح المحادثة</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="text-center py-2">
                      <p className="text-[11px] text-stone-500 mb-2">لأي استفسار أو تواصل مباشر مع أصحاب الفرح</p>
                      <div className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#25D366] text-white font-black text-sm shadow-md shadow-emerald-500/20 max-w-sm w-full mx-auto">
                        <MessageCircle className="w-5 h-5 fill-current" />
                        <span>تواصل عبر واتساب مع أصحاب الدعوة 💬</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <Info className="w-4 h-4 text-amber-700" />
                    <span>زر واتساب التواصل ملغي ومخفي تماماً من دعوتك! 🔒</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    لن يظهر أي زر اتصال أو مراسلة في أسفل دعوتك لحفظ خصوصيتكم التامة. لن يتمكن الضيوف إلا من مشاهدة تفاصيل الحفل وتأكيد الحضور فقط.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setWhatsappContactPhone(customerPhone || '201019262075');
                      setWhatsappContactEnabled(true);
                      setSectionsVisibility((p) => ({ ...p, whatsapp: true }));
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    إعادة تفعيل زر الواتساب ➕
                  </button>
                </div>
              )}
            </section>

            {/* Bottom Actions Card (High-Contrast Burgundy Gold Luxury Styling) */}
            <div
              className="relative overflow-hidden p-6 sm:p-8 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl border-2 border-amber-400/50 bg-gradient-to-r from-[#4A0E17] via-[#720925] to-[#3B0712]"
              style={{
                background: 'linear-gradient(135deg, #4A0E17 0%, #720925 50%, #35060F 100%)',
              }}
            >
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 rounded-full bg-rose-500/20 blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-2 text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>خطوتك الأخيرة لتفعيل الرابط الملكي</span>
                </span>
                <h3 className="font-black text-xl sm:text-2xl text-white font-cairo drop-shadow-xs">
                  جاهز لاعتماد ونشر دعوتك؟ 💍
                </h3>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-xl font-medium">
                  كل تعديلاتك محفوظة في متصفحك. اضغط حفظ لمتابعة الدفع عبر InstaPay وتفعيل الرابط فوراً.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCheckoutModal(true)}
                className="relative z-10 w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-sm sm:text-base shadow-xl shadow-amber-950/40 hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 border border-amber-200"
              >
                <Sparkles className="w-5 h-5 text-stone-950" />
                <span>حفظ وتفعيل الدعوة 🚀</span>
              </button>
            </div>
          </div>

          {/* Live Mobile Device Mockup Column (Right on Desktop) */}
          <div
            className={`lg:col-span-5 lg:sticky lg:top-24 space-y-4 ${
              activeTab === 'editor' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Device Mockup Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-white/90 backdrop-blur-xs rounded-2xl border border-stone-200/90 shadow-xs">
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
                <button
                  type="button"
                  onClick={() => setEnvelopePreviewOpen((prev) => !prev)}
                  className="text-xs font-bold text-[#720925] hover:underline cursor-pointer"
                >
                  {envelopePreviewOpen ? 'إعادة إغلاق الظرف 💌' : 'فتح المظرف الملكي 🪄'}
                </button>
              ) : (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  الظرف محذوف ⚡
                </span>
              )}
            </div>

            {/* Frame Container */}
            {previewViewMode === 'phone' ? (
              <div className="relative mx-auto w-full max-w-[min(345px,calc(100vw-24px))] sm:max-w-[370px] h-[600px] min-[390px]:h-[660px] sm:h-[720px] bg-stone-900 rounded-[40px] sm:rounded-[46px] p-2.5 sm:p-3 shadow-2xl border-4 border-stone-800 ring-2 sm:ring-4 ring-stone-950/15 overflow-hidden flex flex-col">
                {/* Speaker & Camera Notch */}
                <div className="w-24 sm:w-32 h-3.5 sm:h-4 bg-stone-950 rounded-b-xl mx-auto mb-2 shrink-0 z-50 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-stone-900 mr-1.5 sm:mr-2" />
                  <div className="w-7 sm:w-10 h-1 bg-stone-800 rounded-full" />
                </div>

                {/* Inner Smartphone Screen Content */}
                <div
                  className="relative flex-1 rounded-[28px] sm:rounded-[36px] overflow-hidden border border-stone-800/40 flex flex-col"
                  style={{
                    backgroundColor,
                  }}
                >
                  <div className="relative w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar overscroll-contain flex-1 flex flex-col">
                    {/* Main Rendered Invitation Body (Controls Envelope inside) */}
                    <InvitationRenderer
                      invitation={livePreviewInvitation}
                      events={livePreviewEvents}
                      theme={activeTheme as any}
                      sections={livePreviewSections}
                      isPreview={true}
                      hidePreviewBanner={true}
                      isEnvelopeOpen={envelopePreviewOpen}
                      onEnvelopeOpen={() => setEnvelopePreviewOpen(true)}
                    />
                  </div>
                </div>

                {/* Home Indicator Bar */}
                <div className="w-28 sm:w-32 h-1 bg-stone-700/60 rounded-full mx-auto mt-2 shrink-0 pointer-events-none" />
              </div>
            ) : (
              /* Fluid edge-to-edge frame */
              <div
                className="relative w-full h-[580px] min-[390px]:h-[640px] sm:h-[700px] rounded-2xl sm:rounded-3xl shadow-xl border-2 border-stone-300 overflow-hidden flex flex-col"
                style={{
                  backgroundColor,
                }}
              >
                <div className="relative w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar flex-1 flex flex-col">
                  {/* Main Rendered Invitation Body (Controls Envelope inside) */}
                  <InvitationRenderer
                    invitation={livePreviewInvitation}
                    events={livePreviewEvents}
                    theme={activeTheme as any}
                    sections={livePreviewSections}
                    isPreview={true}
                    hidePreviewBanner={true}
                    isEnvelopeOpen={envelopePreviewOpen}
                    onEnvelopeOpen={() => setEnvelopePreviewOpen(true)}
                  />
                </div>
              </div>
            )}

            <p className="text-center text-[11px] text-stone-500 font-medium">
              💡 اضغط على ختم الشمع في المظرف لتجربة حركة الفتح الملكية الفاخرة!
            </p>
          </div>
        </div>
      </main>

      {/* Floating Mobile Studio Quick Bar (for phone users) */}
      <div className="lg:hidden fixed bottom-3 sm:bottom-4 inset-x-2.5 sm:inset-x-6 z-40 animate-fade-in-up">
        <div className="bg-stone-950/95 backdrop-blur-xl border border-amber-400/40 rounded-2xl p-1.5 sm:p-2.5 shadow-2xl flex items-center justify-between gap-2">
          {/* Toggle Tab */}
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

          {/* Quick Activate */}
          <button
            type="button"
            onClick={() => setShowCheckoutModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-stone-950 text-xs font-black shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-950" />
            <span>حفظ وتفعيل 🚀</span>
          </button>
        </div>
      </div>

      {/* 3. Checkout & Payment Proof Upload Modal (الميزة المركزية للدفع والإيصال) */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 text-right">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>تأكيد الحفظ وتفعيل دعوتكم 💍</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  التحويل آمن ومباشر عبر InstaPay أو فودافون كاش
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold leading-relaxed">
                {submitError}
              </div>
            )}

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">الباقة المختارة:</span>
                <span className="font-bold text-stone-900">{currentPkg.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 font-medium">إجمالي التكلفة:</span>
                <span className="text-base font-black text-[#720925]">{currentPkg.priceLabel}</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-200/60">
                <span className="text-stone-500 font-medium">حالة الرابط:</span>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  يتم التفعيل الفوري بمجرد مراجعة الإيصال
                </span>
              </div>
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-5">
              {/* Step 1: Customer Contact Info */}
              <div className="space-y-3">
                <label className="text-xs font-black text-stone-900 block">
                  ١. بيانات التواصل مع العروسين: *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 block">
                      اسم صاحب الطلب / العريس: *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={coupleGroomAr || 'أحمد محمود'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#720925] focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 block">
                      رقم واتساب للتفعيل وإرسال الرابط: *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="01012345678"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-left dir-ltr focus:ring-2 focus:ring-[#720925] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Instructions & Copy Handles */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <label className="text-xs font-black text-stone-900 block">
                  ٢. طريقة وبيانات التحويل: *
                </label>

                {/* Method Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-2xl text-xs font-bold text-center">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('instapay')}
                    className={`py-2 px-3 rounded-xl transition-all ${
                      paymentMethod === 'instapay'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500'
                    }`}
                  >
                    InstaPay (إنستاباي) ⚡
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vodafone_cash')}
                    className={`py-2 px-3 rounded-xl transition-all ${
                      paymentMethod === 'vodafone_cash'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500'
                    }`}
                  >
                    فودافون كاش 📱
                  </button>
                </div>

                {/* Handle display with 1-click copy */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-amber-900 font-bold block">
                        {paymentMethod === 'instapay'
                          ? 'رقم تحويل إنستاباي (InstaPay):'
                          : 'رقم محفظة فودافون كاش (Vodafone Cash):'}
                      </span>
                      <span className="text-base font-black text-amber-950 font-mono tracking-wider" dir="ltr">
                        01064906723
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard('01064906723', paymentMethod)
                      }
                      className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copySuccess === paymentMethod ? 'تم النسخ ✅' : 'نسخ الرقم'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    قم بتحويل مبلغ <strong className="font-bold">{currentPkg.priceLabel}</strong> إلى الرقم <strong className="font-mono font-bold" dir="ltr">01064906723</strong> عبر {paymentMethod === 'instapay' ? 'تطبيق InstaPay' : 'فودافون كاش'} ثم
                    التقط لقطة شاشة (Screenshot) لرسالة التأكيد وارفعها بالأسفل.
                  </p>
                </div>
              </div>

              {/* Step 3: Payment Screenshot Upload (الميزة المطلوبة: رفع السكرين شوت) */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="text-xs font-black text-stone-900 block flex items-center justify-between">
                  <span>٣. ارفع لقطة شاشة إيصال التحويل (Screenshot): *</span>
                  <span className="text-[10px] text-emerald-700 font-bold">ضروري للاعتماد</span>
                </label>

                <div className="relative border-2 border-dashed border-stone-300 hover:border-[#720925] rounded-2xl p-5 text-center transition-all bg-stone-50/60 hover:bg-stone-50">
                  <input
                    type="file"
                    required={!paymentProofBase64}
                    accept="image/*"
                    onChange={handleProofFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />

                  {paymentProofBase64 ? (
                    <div className="space-y-2 flex flex-col items-center">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-300 shadow-sm">
                        <img
                          src={paymentProofBase64}
                          alt="إيصال التحويل"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>تم تجهيز الإيصال بنجاح ({proofFileName || 'صورة'})</span>
                      </span>
                      <span className="text-[10px] text-stone-400">انقر لتغيير الصورة</span>
                    </div>
                  ) : (
                    <div className="space-y-2 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-rose-100 text-[#720925] flex items-center justify-center shadow-2xs">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-stone-800">
                          اضغط هنا لاختيار لقطة الشاشة أو اسحبها هنا
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          صيغ الصور المدعومة: JPG, PNG, WEBP حتى 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Reference Number */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-600 block">
                  رقم المعاملة / المرجع (اختياري إن وُجد):
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="مثال: Ref #12345678"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-mono"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl burgundy-gradient-bg text-white font-black text-sm shadow-lg shadow-rose-950/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span>جاري إرسال الطلب وحفظ الإيصال...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>تأكيد الإرسال وتفعيل دعوتي 🚀</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Post-Submission Success Celebration Modal */}
      {submittedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-amber-300 text-center">
            {/* Celebration Icon */}
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-md animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-stone-900 font-cairo">
                ألف مبروك! تم استلام تصميم دعوتك بنجاح 🎉
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                رقم طلبك: <strong className="font-mono text-stone-900">#{submittedOrder.orderNumber}</strong>
                <br />
                تم إرسال إيصال الدفع إلى لوحة الإدارة لمطابقته وتفعيل الرابط الرسمي لحضرتك فوراً خلال دقائق!
              </p>
            </div>

            {/* Private Preview Link Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-right space-y-2">
              <span className="text-xs font-black text-amber-950 block">
                👀 يمكنك الآن رؤية ومعاينة دعوتك برابطك الخاص:
              </span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                هذا الرابط مخصص لمعاينتك للتأكد من كل التفاصيل، وسيتفعل الرابط العام للضيوف فور اعتماد الأدمن.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <Link
                  href={`/preview/${submittedOrder.previewToken}`}
                  target="_blank"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 text-white font-black text-xs hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>معاينة دعوتي برابط المعاينة 💌</span>
                </Link>
              </div>
            </div>

            {/* Official Link preview with collision-proof random suffix */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-right space-y-1.5">
              <span className="text-xs font-bold text-stone-700 block">
                🔗 رابط دعوتك المخصص للضيوف (سيتفعل رسمياً فور الاعتماد):
              </span>
              <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono text-stone-800">
                <span className="truncate text-left dir-ltr flex-1 font-semibold text-[#720925]">
                  https://farahna.menuflowx.com/invitation/{submittedOrder.invitation?.type || type}/{submittedOrder.invitation?.slug || generatedSlug}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `https://farahna.menuflowx.com/invitation/${submittedOrder.invitation?.type || type}/${submittedOrder.invitation?.slug || generatedSlug}`,
                      'final-slug'
                    )
                  }
                  className="p-1 rounded-lg text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                  title="نسخ الرابط"
                >
                  {copySuccess === 'final-slug' ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Direct WhatsApp Contact button */}
            <div className="pt-2 space-y-2">
              <a
                href={`https://wa.me/201019262075?text=${encodeURIComponent(
                  `السلام عليكم، قمت بتصميم دعوتي على موقع فرحنا برقم طلب #${submittedOrder.orderNumber} ورفعت إيصال التحويل لتأكيد التفعيل.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>تواصل معنا على واتساب للتفعيل السريع 📲</span>
              </a>

              <button
                type="button"
                onClick={() => setSubmittedOrder(null)}
                className="text-xs text-stone-400 hover:text-stone-700 font-bold block mx-auto pt-2"
              >
                إغلاق هذه النافذة والعودة للتعديل
              </button>
            </div>
          </div>
        </div>
      )}
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
