'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Save,
  Eye,
  Send,
  Share2,
  Check,
  Sparkles,
  ArrowRight,
  Music,
  Calendar,
  MapPin,
  Heart,
  Palette,
  ExternalLink,
  Crown,
  UploadCloud,
  Image as ImageIcon,
  Info,
  PlusCircle,
  Clock,
  Layers,
  Copy,
  FolderOpen,
  Type,
  Play,
  Pause,
  Upload,
  Trash2,
  Loader2,
  MessageCircle,
  Users,
} from 'lucide-react';
import {
  ARABIC_WEDDING_FONTS,
  WeddingFontOption,
  isValidSafeUrl,
  normalizeWebUrl,
  WEDDING_MUSIC_PRESETS,
  DEFAULT_SECTIONS,
  QURANIC_VERSES_PRESETS,
} from '@farahna/shared';
import { adminFetch } from '@/lib/api';
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer';

// Robust color normalizer accepting Hex (with/without #, trailing #), RGB/RGBA, bare numbers, Arabic numerals & named colors
function normalizeColor(input: string): string | null {
  if (!input || typeof input !== 'string') return null;
  let clean = input.trim();
  clean = clean.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
  clean = clean.replace(/،/g, ',');
  clean = clean.toLowerCase();
  clean = clean.replace(/#+$/, '').trim();
  const hexPart = clean.startsWith('#') ? clean.slice(1) : clean;
  if (/^[0-9a-f]{3}$/i.test(hexPart)) {
    return `#${hexPart[0]}${hexPart[0]}${hexPart[1]}${hexPart[1]}${hexPart[2]}${hexPart[2]}`.toLowerCase();
  }
  if (/^[0-9a-f]{6}$/i.test(hexPart)) {
    return `#${hexPart}`.toLowerCase();
  }
  if (/^[0-9a-f]{8}$/i.test(hexPart)) {
    return `#${hexPart.slice(0, 6)}`.toLowerCase();
  }
  const rgbMatch = clean.match(/^rgba?\s*\(\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})/i);
  if (rgbMatch) {
    const r = Math.min(255, Math.max(0, parseInt(rgbMatch[1], 10))).toString(16).padStart(2, '0');
    const g = Math.min(255, Math.max(0, parseInt(rgbMatch[2], 10))).toString(16).padStart(2, '0');
    const b = Math.min(255, Math.max(0, parseInt(rgbMatch[3], 10))).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toLowerCase();
  }
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
  const NAMED_COLORS: Record<string, string> = {
    white: '#ffffff', black: '#000000', gold: '#d4af37', silver: '#c0c0c0',
    bronze: '#cd7f32', burgundy: '#720925', maroon: '#800000', navy: '#0f172a',
    cream: '#faf7f2', beige: '#fffbeb', emerald: '#064e3b', purple: '#4a044e',
    rose: '#9f1239', pink: '#fda4af', champagne: '#f59e0b', red: '#dc2626',
    blue: '#2563eb', green: '#16a34a', yellow: '#eab308', gray: '#6b7280',
    'عنابي': '#720925', 'ذهبي': '#d4af37', 'ذهب': '#d4af37', 'ابيض': '#ffffff',
    'أبيض': '#ffffff', 'اسود': '#000000', 'أسود': '#000000', 'كحلي': '#0f172a',
    'زمردي': '#064e3b', 'وردي': '#fda4af', 'كريمي': '#faf7f2', 'بيج': '#fffbeb',
  };
  return NAMED_COLORS[clean] || null;
}

export default function VisualInvitationBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const invitationId = params.id as string;

  const [invitation, setInvitation] = useState<any>(null);
  const [themes, setThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'couple' | 'events' | 'theme' | 'sections' | 'media'>('couple');
  const [adminMobileView, setAdminMobileView] = useState<'editor' | 'preview'>('editor');
  const [previewTokenCopied, setPreviewTokenCopied] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');
  const [envelopeResetKey, setEnvelopeResetKey] = useState(0);

  // Audio Preview State
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudioPlay = (url?: string) => {
    if (!url) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => setAudioPlaying(false);
    }
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.src = url;
      audioRef.current
        .play()
        .then(() => setAudioPlaying(true))
        .catch(() => setAudioPlaying(false));
    }
  };

  const [uploadingAudio, setUploadingAudio] = useState(false);

  const handleAdminAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('حجم الملف الصوتي كبير جداً، الحد الأقصى 15 ميجابايت');
      return;
    }

    setUploadingAudio(true);
    const songTitle = file.name.replace(/\.[^/.]+$/, '');
    handleChange('musicTitle', songTitle);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'music');
      if (invitation.id) {
        formData.append('invitationId', invitation.id);
      }

      const res = await adminFetch('/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.success && res.data?.url) {
        handleChange('musicUrl', res.data.url);
      } else {
        // Fallback to DataURL
        const reader = new FileReader();
        reader.onload = () => {
          handleChange('musicUrl', reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        handleChange('musicUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingAudio(false);
      if (audioRef.current) {
        audioRef.current.pause();
        setAudioPlaying(false);
      }
    }
  };

  // Media upload & library state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [mediaUploadSuccess, setMediaUploadSuccess] = useState('');
  const [mediaUploadError, setMediaUploadError] = useState('');
  const [savedMediaList, setSavedMediaList] = useState<any[]>([]);

  // Custom Theme Save Modal
  const [showSaveThemeModal, setShowSaveThemeModal] = useState(false);
  const [newThemeNameAr, setNewThemeNameAr] = useState('');
  const [newThemeSlug, setNewThemeSlug] = useState('');
  const [savingNewTheme, setSavingNewTheme] = useState(false);

  // VIP Font Custom Input
  const [customFontInput, setCustomFontInput] = useState('');

  const fetchInvitationData = async () => {
    try {
      const [invRes, themesRes, mediaRes] = await Promise.all([
        adminFetch(`/invitations/${invitationId}`),
        adminFetch('/themes'),
        adminFetch('/media'),
      ]);
      if (invRes.success) {
        setInvitation(invRes.data);
        const savedFont = invRes.data.themeConfig?.fontFamily;
        if (savedFont) {
          const cleanName = savedFont.split(',')[0].replace(/['"]/g, '').trim();
          setCustomFontInput(cleanName);
        }
      }
      if (themesRes.success) {
        setThemes(themesRes.data);
      }
      if (mediaRes?.success && Array.isArray(mediaRes.data?.media)) {
        setSavedMediaList(mediaRes.data.media);
      }
    } catch (e) {
      // error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitationData();
  }, [invitationId]);

  if (loading || !invitation) {
    return (
      <div className="py-20 text-center text-xs font-bold text-stone-500 font-cairo">
        جاري تحميل المحرر المرئي للدعوة...
      </div>
    );
  }

  // Handle form changes inline
  const handleChange = (field: string, value: any) => {
    setInvitation((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedThemeConfigChange = (key: string, value: any) => {
    setInvitation((prev: any) => ({
      ...prev,
      themeConfig: {
        ...(prev.themeConfig || {}),
        [key]: value,
      },
    }));
  };

  const handleColorChange = (key: 'primaryColor' | 'secondaryColor' | 'backgroundColor' | 'textColor', val: string) => {
    handleNestedThemeConfigChange(key, val);
  };

  const handleColorBlur = (key: 'primaryColor' | 'secondaryColor' | 'backgroundColor' | 'textColor', rawVal: string) => {
    const trimmed = rawVal.trim();
    const normalized = normalizeColor(trimmed);
    if (!normalized) {
      const fallback =
        key === 'primaryColor'
          ? (invitation.theme?.config?.primaryColor || '#720925')
          : key === 'secondaryColor'
          ? (invitation.theme?.config?.secondaryColor || '#D4AF37')
          : key === 'backgroundColor'
          ? (invitation.theme?.config?.backgroundColor || '#FAF7F2')
          : (invitation.theme?.config?.textColor || '#1A1819');
      handleNestedThemeConfigChange(key, fallback);
    } else {
      const cleanDigits = trimmed.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString()).replace(/،/g, ',');
      const bareRgb = cleanDigits.match(/^(\d{1,3})\s*[\s,.-]\s*(\d{1,3})\s*[\s,.-]\s*(\d{1,3})$/);
      if (bareRgb) {
        handleNestedThemeConfigChange(key, `rgb(${bareRgb[1]}, ${bareRgb[2]}, ${bareRgb[3]})`);
      } else if (trimmed.startsWith('#') || /^[0-9a-f]{3,8}#?$/i.test(trimmed)) {
        handleNestedThemeConfigChange(key, normalized.toUpperCase());
      }
    }
  };

  const handleToggleSection = (sectionKey: string, isEnabled: boolean) => {
    const existingSections = Array.isArray(invitation.sections)
      ? [...invitation.sections]
      : DEFAULT_SECTIONS.map((s, idx) => ({
          sectionKey: s.key,
          isEnabled: s.defaultEnabled,
          sortOrder: idx,
        }));

    const index = existingSections.findIndex((s: any) => s.sectionKey === sectionKey);
    if (index >= 0) {
      existingSections[index] = { ...existingSections[index], isEnabled };
    } else {
      existingSections.push({
        sectionKey,
        isEnabled,
        sortOrder: existingSections.length,
      });
    }

    setInvitation((prev: any) => ({
      ...prev,
      sections: existingSections,
      ...(sectionKey === 'envelope' ? { envelopeAnimationEnabled: isEnabled } : {}),
      ...(sectionKey === 'countdown' ? { countdownEnabled: isEnabled } : {}),
      ...(sectionKey === 'rsvp' ? { rsvpEnabled: isEnabled } : {}),
    }));
  };

  const handleSave = async () => {
    if (invitation.slug) {
      const cleanSlug = invitation.slug.toLowerCase().trim();
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug)) {
        alert('الرابط المختصر يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشُرط فقط وبدون تكرار للشُرط');
        return;
      }
      if (['admin', 'api', 'auth', 'login', 'preview', 'settings', 'static', 'storage', 'health', 'media'].includes(cleanSlug)) {
        alert('هذا الرابط المختصر محجوز لصفحات النظام، يرجى اختيار اسم آخر');
        return;
      }
    }

    // Normalize and validate URLs
    const sanitizedInv = { ...invitation };
    if (sanitizedInv.musicUrl) sanitizedInv.musicUrl = normalizeWebUrl(sanitizedInv.musicUrl);
    if (sanitizedInv.coverImageUrl) sanitizedInv.coverImageUrl = normalizeWebUrl(sanitizedInv.coverImageUrl);
    if (sanitizedInv.coupleImageUrl) sanitizedInv.coupleImageUrl = normalizeWebUrl(sanitizedInv.coupleImageUrl);
    if (Array.isArray(sanitizedInv.galleryImages)) {
      sanitizedInv.galleryImages = sanitizedInv.galleryImages
        .map((img: string) => normalizeWebUrl(img))
        .filter((img: string | null) => Boolean(img));
    }

    if (
      (invitation.musicUrl && !isValidSafeUrl(invitation.musicUrl)) ||
      (invitation.coverImageUrl && !isValidSafeUrl(invitation.coverImageUrl)) ||
      (invitation.coupleImageUrl && !isValidSafeUrl(invitation.coupleImageUrl))
    ) {
      alert('أحد الروابط المدخلة في الدعوة غير صالح أو غير آمن');
      return;
    }

    setSaving(true);
    try {
      const res = await adminFetch(`/invitations/${invitationId}`, {
        method: 'PATCH',
        body: JSON.stringify(sanitizedInv),
      });

      if (res.success) {
        setSuccessNotice('تم حفظ التعديلات بنجاح! ✨');
        setTimeout(() => setSuccessNotice(''), 3000);
      } else {
        alert(res.message || 'حدث خطأ أثناء الحفظ');
      }
    } catch (e) {
      alert('خطأ في الاتصال بالخادم');
    } finally {
      setSaving(false);
    }
  };

  // Upload an image directly into local media storage & update invitation
  const handleDirectImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetType: 'cover' | 'couple' | 'gallery' | 'customOg'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setMediaUploadSuccess('');
    setMediaUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', targetType === 'customOg' ? 'cover' : targetType);
      formData.append('invitationId', invitationId);

      const token = typeof window !== 'undefined' ? localStorage.getItem('farahna_token') : null;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiBase}/media/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const uploadedUrl = data.data.url;
        setMediaUploadSuccess('تم رفع وتخزين الصورة محلياً بنجاح!');
        setSavedMediaList((prev) => [data.data, ...prev]);

        if (targetType === 'cover') {
          handleChange('coverImageUrl', uploadedUrl);
        } else if (targetType === 'couple') {
          handleChange('coupleImageUrl', uploadedUrl);
        } else if (targetType === 'customOg') {
          handleNestedThemeConfigChange('customOgImageUrl', uploadedUrl);
          handleChange('customOgImageUrl', uploadedUrl);
        } else if (targetType === 'gallery') {
          const currentGallery = Array.isArray(invitation.galleryImages)
            ? invitation.galleryImages
            : [];
          handleChange('galleryImages', [...currentGallery, uploadedUrl]);
        }
      } else {
        setMediaUploadError(data.message || 'فشل رفع الملف');
      }
    } catch (err: any) {
      setMediaUploadError(err.message || 'حدث خطأ في رفع الصورة');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save current colors as a new system theme permanently
  const handleSaveAsNewTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThemeNameAr || !newThemeSlug) return;
    setSavingNewTheme(true);

    try {
      const pColor = invitation.themeConfig?.primaryColor || invitation.theme?.config?.primaryColor || '#720925';
      const sColor = invitation.themeConfig?.secondaryColor || invitation.theme?.config?.secondaryColor || '#D4AF37';
      const bColor = invitation.themeConfig?.backgroundColor || invitation.theme?.config?.backgroundColor || '#FAF7F2';
      const tColor = invitation.themeConfig?.textColor || invitation.theme?.config?.textColor || '#1A1819';

      const payload = {
        name: newThemeSlug,
        nameAr: newThemeNameAr,
        slug: newThemeSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-'),
        config: {
          primaryColor: pColor,
          secondaryColor: sColor,
          backgroundColor: bColor,
          textColor: tColor,
          fontFamily:
            invitation.themeConfig?.fontFamily ||
            invitation.theme?.config?.fontFamily ||
            "'Cairo', sans-serif",
          envelopeStyle: 'wax-seal',
        },
      };

      const res = await adminFetch('/themes', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        alert('تم حفظ الثيم الجديد في النظام للأبد! 🎨 أصبح متاحاً الآن في قائمة الثيمات لجميع الدعوات.');
        setShowSaveThemeModal(false);
        // Refresh themes
        const themesRes = await adminFetch('/themes');
        if (themesRes.success) setThemes(themesRes.data);
      } else {
        alert(res.message || 'فشل حفظ الثيم');
      }
    } catch (e) {
      alert('خطأ أثناء حفظ الثيم');
    } finally {
      setSavingNewTheme(false);
    }
  };

  const previewUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/preview/${invitation.previewToken}`;

  const [guestListCopied, setGuestListCopied] = useState(false);
  const guestListUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/guests/${invitation.previewToken || invitation.id}`;

  const copyGuestListLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(guestListUrl);
      setGuestListCopied(true);
      setTimeout(() => setGuestListCopied(false), 2500);
    }
  };

  const copyPreviewLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(previewUrl);
      setPreviewTokenCopied(true);
      setTimeout(() => setPreviewTokenCopied(false), 2500);
    }
  };

  // Derive package display badge
  const pkgId = invitation.themeConfig?.selectedPackage || invitation.order?.packageId || (invitation.isMultiEvent ? 'wedding-journey' : 'basic');
  const packageLabel =
    pkgId === 'luxury-vip'
      ? { label: 'باقة VIP (150 ج.م) 💎', badgeBg: 'bg-amber-100 text-amber-900 border-amber-300' }
      : pkgId === 'wedding-journey'
      ? { label: 'باقة رحلة الفرح (95 ج.م) 👑', badgeBg: 'bg-rose-100 text-[#720925] border-rose-200' }
      : { label: 'باقة المناسبة الواحدة (50 ج.م) 🌸', badgeBg: 'bg-stone-100 text-stone-800 border-stone-300' };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-[#FAF8F5] font-cairo">
      {/* Top Builder Bar */}
      <header className="h-16 bg-white border-b border-stone-200/90 px-3 sm:px-6 flex items-center justify-between gap-2 shrink-0 shadow-2xs z-20">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => router.push('/admin/invitations')}
            className="p-2 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer shrink-0 border border-stone-200/60"
            title="العودة لقائمة الدعوات"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xs sm:text-sm font-black text-stone-900 truncate max-w-[150px] sm:max-w-xs">
                محرر: {invitation.title}
              </h2>
              {/* Package Badge */}
              <span className={`text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-full border truncate shadow-2xs flex items-center gap-1 ${packageLabel.badgeBg}`}>
                <Crown className="w-3 h-3 text-amber-600" />
                <span>{packageLabel.label}</span>
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
            {previewTokenCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-amber-700" />}
            <span>{previewTokenCopied ? 'تم النسخ!' : 'نسخ رابط العميل'}</span>
          </button>

          <button
            type="button"
            onClick={copyGuestListLink}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-300 font-bold text-xs transition-colors shadow-2xs cursor-pointer"
            title="نسخ رابط كشف المعازيم الخاص بالعروسين لمتابعة الضيوف"
          >
            {guestListCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Users className="w-4 h-4 text-teal-700" />}
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
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl burgundy-gradient-bg text-white font-black text-xs sm:text-sm shadow-md shadow-rose-950/20 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4 text-white" />}
            <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات 💾'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace (Editor Panel on Right, Live Mobile on Center/Left) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Sidebar (Right in RTL) */}
        <div className={`w-full md:w-[480px] lg:w-[500px] xl:w-[540px] bg-white border-l border-stone-200 flex flex-col shrink-0 overflow-hidden shadow-xs z-10 ${
          adminMobileView === 'preview' ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Segmented Tab Navigation with Icons */}
          <div className="p-1.5 bg-stone-100/90 rounded-2xl grid grid-cols-5 gap-1 m-4 sm:m-5 mb-0 shrink-0 border border-stone-200/60">
            {[
              { id: 'couple', label: 'العروسين', icon: Heart },
              { id: 'theme', label: 'الثيم والألوان', icon: Palette },
              { id: 'events', label: 'المناسبات', icon: Calendar },
              { id: 'sections', label: 'الأقسام', icon: Layers },
              { id: 'media', label: 'الميديا', icon: ImageIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 rounded-xl text-xs font-black flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#720925]' : 'text-stone-400'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scrollable Tab Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 custom-scrollbar">

          {/* Tab 1: Couple Names & Message */}
          {activeTab === 'couple' && (
            <div className="space-y-4 text-right">
              {/* Admin Tip */}
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-[11px] flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  💡 نصيحة الأدمن: تأكد من كتابة أسماء العائلتين والآية الكريمة بدقة، وضع رابط موسيقى MP3 هادئة لتبدأ بعد فتح الظرف.
                </span>
              </div>

              {/* Invitation Type & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block flex items-center justify-between">
                    <span>نوع المناسبة والدعوة:</span>
                    <span className="text-[10px] font-mono text-[#720925] font-bold">
                      /invitation/{invitation.type || 'wedding'}/
                    </span>
                  </label>
                  <select
                    value={invitation.type || 'wedding'}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white font-bold"
                  >
                    <option value="wedding">👑 دعوة زفاف وفرح (Wedding)</option>
                    <option value="engagement">💍 دعوة خطوبة (Engagement)</option>
                    <option value="katb_ketab">📜 دعوة كتب كتاب وعقد قران (Katb Ketab)</option>
                    <option value="henna">🌿 دعوة ليلة حنة (Henna)</option>
                    <option value="custom">✨ دعوة مناسبة خاصة / احتفال (Custom)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    الرابط المختصر الفريد (Slug):
                  </label>
                  <input
                    type="text"
                    value={invitation.slug || ''}
                    onChange={(e) =>
                      handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono text-left dir-ltr"
                    placeholder="ahmed-sara"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">عنوان الدعوة الرئيسي:</label>
                <input
                  type="text"
                  value={invitation.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">اسم العريس (عربي):</label>
                  <input
                    type="text"
                    value={invitation.coupleGroomAr}
                    onChange={(e) => handleChange('coupleGroomAr', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">اسم العروسة (عربي):</label>
                  <input
                    type="text"
                    value={invitation.coupleBrideAr}
                    onChange={(e) => handleChange('coupleBrideAr', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">اسم العريس (English):</label>
                  <input
                    type="text"
                    value={invitation.coupleGroomEn || ''}
                    onChange={(e) => handleChange('coupleGroomEn', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-left dir-ltr"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">اسم العروسة (English):</label>
                  <input
                    type="text"
                    value={invitation.coupleBrideEn || ''}
                    onChange={(e) => handleChange('coupleBrideEn', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-left dir-ltr"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">أولياء الأمور / إهداء العائلة:</label>
                <input
                  type="text"
                  value={invitation.parentsGroomAr || ''}
                  onChange={(e) => handleChange('parentsGroomAr', e.target.value)}
                  placeholder="نجل الأستاذ ... وكريمة المهندس ..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 block flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>رسالة الدعوة والآية الكريمة:</span>
                  </label>
                  {invitation.weddingMessageAr ? (
                    <button
                      type="button"
                      onClick={() => handleChange('weddingMessageAr', '')}
                      className="text-[11px] font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>حذف / إفراغ الآية ❌</span>
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                      محذوفة (لن تظهر بالدعوة ولا بالظرف)
                    </span>
                  )}
                </div>

                {/* Quick Presets Chips */}
                <div className="space-y-1">
                  <span className="text-[10px] text-stone-400 block font-bold">
                    اختر نموذج سريع أو اكتب كلام مخصص:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {QURANIC_VERSES_PRESETS.map((vp) => (
                      <button
                        key={vp.id}
                        type="button"
                        onClick={() => handleChange('weddingMessageAr', vp.verse)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
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
                  rows={4}
                  value={invitation.weddingMessageAr || ''}
                  onChange={(e) => handleChange('weddingMessageAr', e.target.value)}
                  placeholder="اكتب الآية الكريمة أو الكلمات الخاصة بكم هنا، أو اتركها فارغة لحذف القسم تماماً..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-amiri leading-relaxed"
                />
              </div>

              {/* Music & Audio Settings */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                    <Music className="w-4 h-4 text-[#720925]" />
                    <span>موسيقى الدعوة والخلفية الصوتية:</span>
                  </label>
                  {invitation.musicUrl && (
                    <button
                      type="button"
                      onClick={() => toggleAudioPlay(invitation.musicUrl)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#720925] border border-rose-200 text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      {audioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{audioPlaying ? 'إيقاف' : 'تجربة الصوت'}</span>
                    </button>
                  )}
                </div>

                {/* Preset Chips */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-stone-500 block">اختر مقطع جاهز أو أدخل رابطك المباشر:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {WEDDING_MUSIC_PRESETS.map((m) => {
                      const isSelected = invitation.musicUrl === m.url;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            handleChange('musicUrl', m.url);
                            handleChange('musicTitle', m.title);
                            if (audioRef.current) audioRef.current.pause();
                            setAudioPlaying(false);
                          }}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#720925] text-white border-[#720925]'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                          }`}
                        >
                          {m.title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Direct Custom URL Input */}
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-bold text-stone-700 block">
                    رابط ملف الموسيقى المباشر (MP3 URL) — يمكنك كتابة أو تعديل أي رابط بنفسك:
                  </label>
                  <input
                    type="url"
                    value={invitation.musicUrl || ''}
                    onChange={(e) => handleChange('musicUrl', e.target.value)}
                    placeholder="https://example.com/audio.mp3"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-left dir-ltr font-mono"
                  />
                </div>

                {/* Song Title & File Upload Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 block">عنوان المقطع الصوتي المعروض:</label>
                    <input
                      type="text"
                      value={invitation.musicTitle || ''}
                      onChange={(e) => handleChange('musicTitle', e.target.value)}
                      placeholder="مثال: بيانو رومانسي - ليلة العمر"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 block">أو رفع ملف MP3 من جهازك:</label>
                    <label className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-dashed text-xs font-bold transition-colors ${
                      uploadingAudio
                        ? 'border-amber-400 bg-amber-50 text-amber-800 cursor-wait'
                        : 'border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 cursor-pointer'
                    }`}>
                      {uploadingAudio ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                          <span>جاري رفع وحفظ الملف على السيرفر...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 text-amber-600" />
                          <span>اختر ملف صوتي من الكمبيوتر 📁</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="audio/*,.mp3"
                        onChange={handleAdminAudioUpload}
                        disabled={uploadingAudio}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* WhatsApp Contact with Couple Settings */}
              {(() => {
                const currentWhatsapp =
                  invitation.themeConfig?.whatsappPhone !== undefined
                    ? invitation.themeConfig.whatsappPhone
                    : invitation.whatsappPhone !== undefined
                    ? invitation.whatsappPhone
                    : invitation.customer?.whatsapp || invitation.customer?.phone || '';

                const isWhatsappSectionEnabled =
                  invitation.sections?.find((s: any) => s.sectionKey === 'whatsapp')?.isEnabled !== false;
                const isWhatsappContactEnabled =
                  invitation.themeConfig?.whatsappContactEnabled !== false &&
                  isWhatsappSectionEnabled &&
                  Boolean(currentWhatsapp && currentWhatsapp.trim());

                const cleanPhone = (currentWhatsapp || '').replace(/[^0-9]/g, '');

                return (
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <label className="text-xs font-black text-stone-900 block">
                            تواصل المعازيم عبر واتساب مع أصحاب الفرح:
                          </label>
                          <span className="text-[10px] text-stone-500">
                            الزر الأخضر أسفل الدعوة لمراسلة أصحاب الفرح مباشرة
                          </span>
                        </div>
                      </div>

                      {/* Enable/Disable Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isWhatsappContactEnabled}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            handleToggleSection('whatsapp', checked);
                            handleNestedThemeConfigChange('whatsappContactEnabled', checked);
                            if (checked && !currentWhatsapp) {
                              const fallback =
                                invitation.customer?.whatsapp ||
                                invitation.customer?.phone ||
                                '201019262075';
                              handleNestedThemeConfigChange('whatsappPhone', fallback);
                              handleChange('whatsappPhone', fallback);
                            }
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                      </label>
                    </div>

                    {isWhatsappContactEnabled ? (
                      <div className="space-y-3 pt-1">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-stone-700 block">
                              رقم الواتساب (يمكنك كتابة أو تعديل أي رقم بمزاجك):
                            </label>
                            <div className="flex items-center gap-1.5">
                              {invitation.customer?.phone &&
                                invitation.customer.phone !== currentWhatsapp && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleNestedThemeConfigChange(
                                        'whatsappPhone',
                                        invitation.customer.phone
                                      );
                                      handleChange('whatsappPhone', invitation.customer.phone);
                                    }}
                                    className="text-[10px] font-bold text-amber-800 hover:text-amber-950 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                                  >
                                    استخدام رقم العميل ({invitation.customer.phone})
                                  </button>
                                )}
                              <button
                                type="button"
                                onClick={() => {
                                  handleNestedThemeConfigChange('whatsappPhone', null);
                                  handleNestedThemeConfigChange('whatsappContactEnabled', false);
                                  handleChange('whatsappPhone', null);
                                  handleToggleSection('whatsapp', false);
                                }}
                                className="text-[10px] font-bold text-rose-700 hover:text-rose-900 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                              >
                                مسح وإلغاء الزر ❌
                              </button>
                            </div>
                          </div>

                          <input
                            type="tel"
                            value={currentWhatsapp || ''}
                            onChange={(e) => {
                              handleNestedThemeConfigChange('whatsappPhone', e.target.value);
                              handleChange('whatsappPhone', e.target.value);
                            }}
                            placeholder="مثال: 201019262075 أو +9665..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono text-left dir-ltr bg-stone-50 focus:bg-white focus:border-emerald-500 focus:outline-none"
                          />
                        </div>

                        {cleanPhone.length >= 5 && (
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
                            <span className="text-[11px] font-bold text-emerald-900">
                              💬 تجربة رابط واتساب العروسين:
                            </span>
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                            >
                              <span>فتح المحادثة ({cleanPhone})</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-stone-100 text-stone-600 text-xs flex items-center justify-between">
                        <span>🔒 زر تواصل الواتساب ملغي ومخفي تماماً من الدعوة.</span>
                        <button
                          type="button"
                          onClick={() => {
                            const fallback =
                              invitation.customer?.whatsapp ||
                              invitation.customer?.phone ||
                              '201019262075';
                            handleToggleSection('whatsapp', true);
                            handleNestedThemeConfigChange('whatsappContactEnabled', true);
                            handleNestedThemeConfigChange('whatsappPhone', fallback);
                            handleChange('whatsappPhone', fallback);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                        >
                          إعادة التفعيل ➕
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Tab 2: Theme & Colors */}
          {activeTab === 'theme' && (
            <div className="space-y-5 text-right">
              {/* Admin Tip */}
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-[11px] flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  💡 نصيحة الأدمن: يمكنك اختيار ثيم معتمد، أو تعديل الألوان بحرية تامة لباقة VIP. بعد التعديل، يمكنك حفظها كثيم دائم في النظام بنقرة واحدة!
                </span>
              </div>

              {/* Theme Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 block">اختر ثيم الدعوة الأساسي:</label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {themes.map((th) => {
                    const isSelected = invitation.themeId === th.id;
                    return (
                      <div
                        key={th.id}
                        onClick={() => {
                          handleChange('themeId', th.id);
                          handleChange('theme', th);
                        }}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-rose-50 border-[#720925] shadow-xs'
                            : 'bg-white border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded-full shadow-xs border border-white"
                            style={{ backgroundColor: th.config?.primaryColor || '#720925' }}
                          />
                          <div>
                            <p className="text-xs font-bold text-stone-900">{th.nameAr}</p>
                            <p className="text-[10px] text-stone-400">{th.name}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#720925]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Overrides for VIP & Journey */}
              {(() => {
                const primaryColor =
                  invitation.themeConfig?.primaryColor ||
                  invitation.theme?.config?.primaryColor ||
                  '#720925';
                const secondaryColor =
                  invitation.themeConfig?.secondaryColor ||
                  invitation.theme?.config?.secondaryColor ||
                  '#D4AF37';
                const backgroundColor =
                  invitation.themeConfig?.backgroundColor ||
                  invitation.theme?.config?.backgroundColor ||
                  '#FAF7F2';
                const textColor =
                  invitation.themeConfig?.textColor ||
                  invitation.theme?.config?.textColor ||
                  '#1A1819';

                const safePrimary = normalizeColor(primaryColor) || '#720925';
                const safeSecondary = normalizeColor(secondaryColor) || '#d4af37';
                const safeBackground = normalizeColor(backgroundColor) || '#faf7f2';
                const safeTextColor = normalizeColor(textColor) || '#1a1819';

                return (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-amber-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-black text-stone-900">
                          تحكّم بدرجات الألوان بحرية كاملة (باقة VIP 💎):
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (invitation.theme?.config) {
                            handleNestedThemeConfigChange('primaryColor', invitation.theme.config.primaryColor || '#720925');
                            handleNestedThemeConfigChange('secondaryColor', invitation.theme.config.secondaryColor || '#D4AF37');
                            handleNestedThemeConfigChange('backgroundColor', invitation.theme.config.backgroundColor || '#FAF7F2');
                            handleNestedThemeConfigChange('textColor', invitation.theme.config.textColor || '#1A1819');
                          }
                        }}
                        className="text-[11px] font-bold text-stone-600 hover:text-stone-950 bg-white px-2.5 py-1 rounded-xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                        title="استعادة ألوان القالب الأصلية"
                      >
                        ↺ استعادة ألوان الثيم
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {/* Card 1: Primary Color */}
                      <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-stone-900">
                            اللون الرئيسي (الثيم والظرف):
                          </label>
                          <span className="text-[11px] font-mono font-semibold text-stone-400">
                            {primaryColor.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-2xs hover:border-stone-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200/40 transition-all">
                          <input
                            type="text"
                            value={primaryColor}
                            onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                            onBlur={(e) => handleColorBlur('primaryColor', e.target.value)}
                            className="flex-1 bg-transparent text-center font-mono font-bold text-xs sm:text-sm text-stone-900 focus:outline-hidden dir-ltr placeholder:text-stone-300"
                            placeholder="#9C5162 أو 156, 81, 98"
                          />
                          <div className="w-px h-6 bg-stone-200 mx-2.5 shrink-0" />
                          <div
                            className="relative w-3.5 h-6.5 rounded-full border border-stone-300/90 shadow-2xs shrink-0 cursor-pointer overflow-hidden hover:scale-110 active:scale-95 transition-transform"
                            style={{ backgroundColor: safePrimary }}
                            title="انقر لفتح عجلة الألوان واختيار أي درجة بحرية"
                          >
                            <input
                              type="color"
                              value={safePrimary}
                              onChange={(e) => handleColorChange('primaryColor', e.target.value.toUpperCase())}
                              className="absolute -inset-4 w-[250%] h-[250%] opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="space-y-1 pt-0.5">
                          <span className="text-[10px] text-stone-400 font-bold block">درجات ملكية مقترحة:</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {[
                              { name: 'شوكولاتة', hex: '#3B1E08' },
                              { name: 'أسود', hex: '#18181B' },
                              { name: 'موف', hex: '#4A044E' },
                              { name: 'كحلي', hex: '#0F172A' },
                              { name: 'زمردي', hex: '#064E3B' },
                              { name: 'عنابي', hex: '#720925' },
                              { name: 'وردي', hex: '#9C5162' },
                            ].map((swatch) => (
                              <button
                                key={swatch.hex}
                                type="button"
                                onClick={() => handleColorChange('primaryColor', swatch.hex)}
                                className="w-5 h-5 rounded-full border border-stone-300/80 shadow-2xs cursor-pointer hover:scale-120 active:scale-95 transition-all"
                                style={{ backgroundColor: swatch.hex }}
                                title={`${swatch.name} (${swatch.hex})`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Secondary / Gold Accent */}
                      <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-stone-900">
                            الذهب والتفاصيل (الختم والزخارف):
                          </label>
                          <span className="text-[11px] font-mono font-semibold text-stone-400">
                            {secondaryColor.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-2xs hover:border-stone-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200/40 transition-all">
                          <input
                            type="text"
                            value={secondaryColor}
                            onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                            onBlur={(e) => handleColorBlur('secondaryColor', e.target.value)}
                            className="flex-1 bg-transparent text-center font-mono font-bold text-xs sm:text-sm text-stone-900 focus:outline-hidden dir-ltr placeholder:text-stone-300"
                            placeholder="#D4AF37 أو 212, 175, 55"
                          />
                          <div className="w-px h-6 bg-stone-200 mx-2.5 shrink-0" />
                          <div
                            className="relative w-3.5 h-6.5 rounded-full border border-stone-300/90 shadow-2xs shrink-0 cursor-pointer overflow-hidden hover:scale-110 active:scale-95 transition-transform"
                            style={{ backgroundColor: safeSecondary }}
                            title="انقر لفتح عجلة الألوان واختيار أي درجة بحرية"
                          >
                            <input
                              type="color"
                              value={safeSecondary}
                              onChange={(e) => handleColorChange('secondaryColor', e.target.value.toUpperCase())}
                              className="absolute -inset-4 w-[250%] h-[250%] opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="space-y-1 pt-0.5">
                          <span className="text-[10px] text-stone-400 font-bold block">درجات الذهب المقترحة:</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {[
                              { name: 'وردي ذهبي', hex: '#FDA4AF' },
                              { name: 'بلاتينيوم', hex: '#94A3B8' },
                              { name: 'كهرماني', hex: '#F59E0B' },
                              { name: 'برونز', hex: '#E0A96D' },
                              { name: 'ذهب ملكي', hex: '#D4AF37' },
                            ].map((swatch) => (
                              <button
                                key={swatch.hex}
                                type="button"
                                onClick={() => handleColorChange('secondaryColor', swatch.hex)}
                                className="w-5 h-5 rounded-full border border-stone-300/80 shadow-2xs cursor-pointer hover:scale-120 active:scale-95 transition-all"
                                style={{ backgroundColor: swatch.hex }}
                                title={`${swatch.name} (${swatch.hex})`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card 3: Background Color */}
                      <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-stone-900">
                            لون الخلفية (بطاقة الدعوة):
                          </label>
                          <span className="text-[11px] font-mono font-semibold text-stone-400">
                            {backgroundColor.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-2xs hover:border-stone-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200/40 transition-all">
                          <input
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                            onBlur={(e) => handleColorBlur('backgroundColor', e.target.value)}
                            className="flex-1 bg-transparent text-center font-mono font-bold text-xs sm:text-sm text-stone-900 focus:outline-hidden dir-ltr placeholder:text-stone-300"
                            placeholder="#FAF7F2 أو 250, 247, 242"
                          />
                          <div className="w-px h-6 bg-stone-200 mx-2.5 shrink-0" />
                          <div
                            className="relative w-3.5 h-6.5 rounded-full border border-stone-300/90 shadow-2xs shrink-0 cursor-pointer overflow-hidden hover:scale-110 active:scale-95 transition-transform"
                            style={{ backgroundColor: safeBackground }}
                            title="انقر لفتح عجلة الألوان واختيار أي درجة بحرية"
                          >
                            <input
                              type="color"
                              value={safeBackground}
                              onChange={(e) => handleColorChange('backgroundColor', e.target.value.toUpperCase())}
                              className="absolute -inset-4 w-[250%] h-[250%] opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="space-y-1 pt-0.5">
                          <span className="text-[10px] text-stone-400 font-bold block">خلفيات راقية مقترحة:</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {[
                              { name: 'أبيض نقي', hex: '#FFFFFF' },
                              { name: 'دارك مود', hex: '#18181B' },
                              { name: 'كريمي', hex: '#FAF7F2' },
                              { name: 'وردي ناعم', hex: '#FFF8F9' },
                              { name: 'لؤلؤي', hex: '#F8FAFC' },
                            ].map((swatch) => (
                              <button
                                key={swatch.hex}
                                type="button"
                                onClick={() => handleColorChange('backgroundColor', swatch.hex)}
                                className="w-5 h-5 rounded-full border border-stone-300/80 shadow-2xs cursor-pointer hover:scale-120 active:scale-95 transition-all"
                                style={{ backgroundColor: swatch.hex }}
                                title={`${swatch.name} (${swatch.hex})`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card 4: Text Color */}
                      <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black text-stone-900">
                            لون النصوص الرئيسية:
                          </label>
                          <span className="text-[11px] font-mono font-semibold text-stone-400">
                            {textColor.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-2xs hover:border-stone-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200/40 transition-all">
                          <input
                            type="text"
                            value={textColor}
                            onChange={(e) => handleColorChange('textColor', e.target.value)}
                            onBlur={(e) => handleColorBlur('textColor', e.target.value)}
                            className="flex-1 bg-transparent text-center font-mono font-bold text-xs sm:text-sm text-stone-900 focus:outline-hidden dir-ltr placeholder:text-stone-300"
                            placeholder="#1A1819 أو #F8FAFC"
                          />
                          <div className="w-px h-6 bg-stone-200 mx-2.5 shrink-0" />
                          <div
                            className="relative w-3.5 h-6.5 rounded-full border border-stone-300/90 shadow-2xs shrink-0 cursor-pointer overflow-hidden hover:scale-110 active:scale-95 transition-transform"
                            style={{ backgroundColor: safeTextColor }}
                          >
                            <input
                              type="color"
                              value={safeTextColor}
                              onChange={(e) => handleColorChange('textColor', e.target.value.toUpperCase())}
                              className="absolute -inset-4 w-[250%] h-[250%] opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Save Theme as Permanent System Theme */}
                    <div className="pt-2 border-t border-amber-200/70">
                      <button
                        type="button"
                        onClick={() => setShowSaveThemeModal(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-white border border-stone-300 text-stone-800 font-bold text-xs hover:bg-stone-50 flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                      >
                        <Palette className="w-4 h-4 text-[#720925]" />
                        <span>حفظ هذه الألوان كثيم دائم في النظام للأبد 💾</span>
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* VIP Wedding Typography (Font Selection & Custom Input) */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/90 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-black text-stone-900">
                      خط الدعوة والأعراس (Wedding Fonts):
                    </span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-200 to-amber-300 text-amber-950 font-black shadow-2xs">
                    ميزة VIP 👑
                  </span>
                </div>

                <p className="text-[11px] text-stone-600 leading-relaxed">
                  اختر من بين أشهر الخطوط العربية الفاخرة المعتمدة للأفراح ومصممة خصيصاً للمناسبات الراقية، أو اكتب اسم أي خط طلبه العميل ليتم تطبيقه فوراً.
                </p>

                {/* Active Font Status Pill */}
                <div className="p-2.5 rounded-xl bg-white border border-stone-200/90 flex items-center justify-between shadow-2xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-stone-400 block font-bold">الخط المطبق حالياً:</span>
                    <span
                      className="text-xs font-black text-[#720925]"
                      style={{
                        fontFamily:
                          invitation.themeConfig?.fontFamily ||
                          invitation.theme?.config?.fontFamily ||
                          "'Cairo', sans-serif",
                      }}
                    >
                      {ARABIC_WEDDING_FONTS.find(
                        (f: WeddingFontOption) =>
                          (invitation.themeConfig?.fontFamily || invitation.theme?.config?.fontFamily) === f.fontFamily ||
                          (invitation.themeConfig?.fontFamily || invitation.theme?.config?.fontFamily || '').includes(f.name)
                      )?.nameAr ||
                        invitation.themeConfig?.fontFamily ||
                        invitation.theme?.config?.fontFamily ||
                        'خط كايرو الحديث ✨'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-400 max-w-[130px] truncate" dir="ltr">
                    {invitation.themeConfig?.fontFamily || invitation.theme?.config?.fontFamily || 'Cairo'}
                  </span>
                </div>

                {/* Curated Wedding Fonts List */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {ARABIC_WEDDING_FONTS.map((font: WeddingFontOption) => {
                    const currentVal =
                      invitation.themeConfig?.fontFamily ||
                      invitation.theme?.config?.fontFamily ||
                      "'Cairo', sans-serif";
                    const isSelected =
                      currentVal === font.fontFamily ||
                      currentVal.toLowerCase().includes(font.name.toLowerCase());

                    return (
                      <div
                        key={font.id}
                        onClick={() => handleNestedThemeConfigChange('fontFamily', font.fontFamily)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-white border-[#720925] ring-2 ring-[#720925]/20 shadow-xs'
                            : 'bg-white/80 border-stone-200 hover:bg-white hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-stone-900">{font.nameAr}</span>
                            <span className="text-[9px] font-mono text-stone-400">({font.name})</span>
                          </div>
                          {isSelected ? (
                            <span className="text-[10px] font-bold text-[#720925] flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              مُعتمد
                            </span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-500 font-medium">
                              {font.category === 'royal'
                                ? 'ملكي'
                                : font.category === 'heritage'
                                ? 'تراثي'
                                : font.category === 'soft'
                                ? 'ناعم'
                                : 'عصري'}
                            </span>
                          )}
                        </div>

                        {/* Live Calligraphy Preview Sample */}
                        <div
                          className="text-xs sm:text-sm text-stone-800 leading-snug py-1.5 px-2.5 rounded-xl bg-stone-50/80 border border-stone-100"
                          style={{ fontFamily: font.fontFamily }}
                        >
                          بارك الله لهما وبارك عليهما وجمع بينهما في خير
                        </div>

                        <p className="text-[10px] text-stone-500 mt-1 leading-snug">
                          {font.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Font Text Input for Client Choice */}
                <div className="pt-2 border-t border-amber-200/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-stone-800 block">
                      أو اكتب اسم خط مخصص يطلبه العميل (Google Font):
                    </label>
                    <span className="text-[9px] text-stone-400">مثال: Reem Kufi, Lateef</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customFontInput}
                      onChange={(e) => setCustomFontInput(e.target.value)}
                      placeholder="اسم الخط (مثال: Reem Kufi أو Changa)"
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs text-left dir-ltr bg-white focus:outline-none focus:ring-1 focus:ring-[#720925]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!customFontInput.trim()) return;
                        const cleanName = customFontInput.trim().replace(/['"]/g, '');
                        handleNestedThemeConfigChange('fontFamily', `'${cleanName}', sans-serif`);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
                    >
                      تطبيق الخط ✨
                    </button>
                  </div>
                  <p className="text-[10px] text-stone-500">
                    💡 يتم تحميل أي خط من Google Fonts تلقائياً وبأقصى سرعة فور كتابة اسمه وتطبيقه.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Events list & Henna Ladies Only */}
          {activeTab === 'events' && (
            <div className="space-y-4 text-right">
              {/* Admin Tip */}
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-[11px] flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  💡 نصيحة الأدمن: في باقة رحلة الفرح أو VIP، يمكنك إضافة مناسبات منفصلة، وتفعيل خيار "ليلة الحنة للسيدات فقط" لإظهار شارة الخصوصية المصرية.
                </span>
              </div>

              <div className="flex items-center justify-between pb-1">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    مواعيد ومناسبات الفرح (رحلة الفرح والتبويبات):
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {invitation.events?.length || 0} مناسبات مسجلة
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newEvt = {
                      id: `evt-custom-${Date.now()}`,
                      type: 'custom',
                      titleAr: 'مناسبة جديدة',
                      date: invitation.eventDate || new Date().toISOString(),
                      startTime: '08:00 م',
                      endTime: '01:00 ص',
                      venueNameAr: 'قاعة الحفل',
                      addressAr: 'القاهرة، مصر',
                      googleMapsUrl: '',
                      isVisible: true,
                      isHennaFemaleOnly: false,
                      sortOrder: (invitation.events || []).length,
                    };
                    handleChange('events', [...(invitation.events || []), newEvt]);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>إضافة مناسبة ➕</span>
                </button>
              </div>

              <div className="space-y-4">
                {(!invitation.events || invitation.events.length === 0) ? (
                  <div className="p-6 rounded-2xl bg-stone-50 border border-dashed border-stone-300 text-center space-y-3">
                    <p className="text-xs text-stone-500">لا توجد مناسبات منفصلة مسجلة بعد في هذه الدعوة.</p>
                    <button
                      type="button"
                      onClick={() => {
                        const defaultEvt = {
                          id: `evt-main-${Date.now()}`,
                          type: 'wedding',
                          titleAr: invitation.title || 'حفل الزفاف المبارك',
                          date: invitation.eventDate || new Date().toISOString(),
                          startTime: '08:00 م',
                          endTime: '01:00 ص',
                          venueNameAr: 'قاعة الحفل الملكية',
                          addressAr: 'القاهرة، مصر',
                          googleMapsUrl: '',
                          isVisible: true,
                          isHennaFemaleOnly: false,
                          sortOrder: 0,
                        };
                        handleChange('events', [defaultEvt]);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#720925] text-white text-xs font-bold hover:bg-rose-900 transition-colors cursor-pointer"
                    >
                      إضافة مناسبة الفرح الأساسية 💍
                    </button>
                  </div>
                ) : (
                  invitation.events.map((ev: any, idx: number) => {
                    const formattedDateInput = ev.date
                      ? new Date(ev.date).toISOString().slice(0, 16)
                      : '';

                    return (
                      <div
                        key={ev.id || idx}
                        className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-100">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-[10px]">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={ev.titleAr || ''}
                              onChange={(e) => {
                                const updated = [...(invitation.events || [])];
                                updated[idx] = { ...updated[idx], titleAr: e.target.value };
                                handleChange('events', updated);
                              }}
                              placeholder="عنوان المناسبة (مثال: حفل الزفاف)"
                              className="font-black text-stone-900 text-xs px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white flex-1"
                            />
                          </div>

                          <div className="flex items-center gap-1.5">
                            <select
                              value={ev.type || 'wedding'}
                              onChange={(e) => {
                                const updated = [...(invitation.events || [])];
                                updated[idx] = { ...updated[idx], type: e.target.value };
                                handleChange('events', updated);
                              }}
                              className="text-[10px] font-bold px-2 py-1 rounded-lg border border-stone-200 bg-stone-50"
                            >
                              <option value="wedding">زفاف</option>
                              <option value="engagement">خطوبة</option>
                              <option value="katb_ketab">عقد قران</option>
                              <option value="henna">حنة</option>
                              <option value="reception">استقبال</option>
                              <option value="custom">مخصصة</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من حذف مناسبة "${ev.titleAr}"؟`)) {
                                  const updated = (invitation.events || []).filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  handleChange('events', updated);
                                }
                              }}
                              className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                              title="حذف المناسبة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Event Date & Time Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-600 block">
                              التاريخ والموعد:
                            </label>
                            <input
                              type="datetime-local"
                              value={formattedDateInput}
                              onChange={(e) => {
                                const updated = [...(invitation.events || [])];
                                updated[idx] = { ...updated[idx], date: e.target.value };
                                handleChange('events', updated);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs text-left font-mono dir-ltr bg-stone-50"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-600 block">
                              وقت البدء:
                            </label>
                            <input
                              type="text"
                              value={ev.startTime || ''}
                              onChange={(e) => {
                                const updated = [...(invitation.events || [])];
                                updated[idx] = { ...updated[idx], startTime: e.target.value };
                                handleChange('events', updated);
                              }}
                              placeholder="08:00 م"
                              className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs text-left dir-ltr bg-stone-50"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-600 block">
                              وقت الانتهاء:
                            </label>
                            <input
                              type="text"
                              value={ev.endTime || ''}
                              onChange={(e) => {
                                const updated = [...(invitation.events || [])];
                                updated[idx] = { ...updated[idx], endTime: e.target.value };
                                handleChange('events', updated);
                              }}
                              placeholder="01:00 ص"
                              className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs text-left dir-ltr bg-stone-50"
                            />
                          </div>
                        </div>

                        {/* Venue & Address Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-600 block">
                              اسم القاعة / المكان:
                            </label>
                            <input
                              type="text"
                              value={ev.venueNameAr || ''}
                              onChange={(e) => {
                                const updated = [...(invitation.events || [])];
                                updated[idx] = { ...updated[idx], venueNameAr: e.target.value };
                                handleChange('events', updated);
                              }}
                              placeholder="فندق فورسيزونز نايل بلازا"
                              className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs bg-stone-50"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-stone-600 block">
                              العنوان أو المحافظة:
                            </label>
                            <input
                              type="text"
                              value={ev.addressAr || ''}
                              onChange={(e) => {
                                const updated = [...(invitation.events || [])];
                                updated[idx] = { ...updated[idx], addressAr: e.target.value };
                                handleChange('events', updated);
                              }}
                              placeholder="جاردن سيتي، القاهرة"
                              className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs bg-stone-50"
                            />
                          </div>
                        </div>

                        {/* Google Maps URL */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-600 block">
                            رابط موقع القاعة على Google Maps:
                          </label>
                          <input
                            type="url"
                            value={ev.googleMapsUrl || ''}
                            onChange={(e) => {
                              const updated = [...(invitation.events || [])];
                              updated[idx] = { ...updated[idx], googleMapsUrl: e.target.value };
                              handleChange('events', updated);
                            }}
                            placeholder="https://maps.google.com/?q=..."
                            className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs font-mono text-left dir-ltr bg-stone-50"
                          />
                        </div>

                        {/* Henna Privacy Checkbox for this event */}
                        {ev.type === 'henna' && (
                          <label className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-[11px] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ev.isHennaFemaleOnly || false}
                              onChange={(e) => {
                                const updated = [...(invitation.events || [])];
                                updated[idx] = { ...updated[idx], isHennaFemaleOnly: e.target.checked };
                                handleChange('events', updated);
                              }}
                              className="w-4 h-4 rounded text-emerald-700"
                            />
                            <span>🌿 مناسبة مخصصة للسيدات فقط (تنبيه الخصوصية وعدم التصوير)</span>
                          </label>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Sections Toggles */}
          {activeTab === 'sections' && (
            <div className="space-y-4 text-right">
              {/* Admin Tip */}
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-[11px] flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  💡 تحكم كامل بالأقسام: يمكنك تفعيل أو حذف أي سكشن بالكامل من الدعوة، أو إخفاؤه حسب رغبة العميل بنقرة زر واحدة.
                </span>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-stone-700">قائمة أقسام الدعوة:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const allEnabled = DEFAULT_SECTIONS.map((s, idx) => ({
                        sectionKey: s.key,
                        isEnabled: true,
                        sortOrder: idx,
                      }));
                      setInvitation((prev: any) => ({
                        ...prev,
                        sections: allEnabled,
                        envelopeAnimationEnabled: true,
                        countdownEnabled: true,
                        rsvpEnabled: true,
                      }));
                    }}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer transition-colors"
                  >
                    تفعيل الكل ✨
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const minimal = DEFAULT_SECTIONS.map((s, idx) => ({
                        sectionKey: s.key,
                        isEnabled: ['cover', 'couple', 'venue'].includes(s.key),
                        sortOrder: idx,
                      }));
                      setInvitation((prev: any) => ({
                        ...prev,
                        sections: minimal,
                        envelopeAnimationEnabled: false,
                        countdownEnabled: false,
                        rsvpEnabled: false,
                      }));
                    }}
                    className="text-[10px] font-bold text-stone-600 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg border border-stone-200 cursor-pointer transition-colors"
                  >
                    الأساسي فقط ⚡
                  </button>
                </div>
              </div>

              {/* Dynamic Sections List */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {DEFAULT_SECTIONS.map((sec) => {
                  const currentSec = invitation.sections?.find((s: any) => s.sectionKey === sec.key);
                  let isEnabled = currentSec !== undefined ? currentSec.isEnabled : sec.defaultEnabled;

                  if (sec.key === 'envelope' && invitation.envelopeAnimationEnabled !== undefined) {
                    isEnabled = invitation.envelopeAnimationEnabled;
                  } else if (sec.key === 'countdown' && invitation.countdownEnabled !== undefined) {
                    isEnabled = invitation.countdownEnabled;
                  } else if (sec.key === 'rsvp' && invitation.rsvpEnabled !== undefined) {
                    isEnabled = invitation.rsvpEnabled;
                  }

                  return (
                    <div
                      key={sec.key}
                      className={`p-3 rounded-2xl border transition-all ${
                        isEnabled
                          ? 'bg-white border-stone-200 shadow-2xs hover:border-amber-400'
                          : 'bg-stone-100/70 border-dashed border-stone-300 opacity-60 hover:opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-900">{sec.labelAr}</span>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.2 rounded-full ${
                                isEnabled
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {isEnabled ? 'ظاهر للضيوف' : 'محذوف / مخفي'}
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono" dir="ltr">
                            sectionKey: {sec.key}
                          </span>
                        </div>

                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={(e) => {
                            handleToggleSection(sec.key, e.target.checked);
                            if (sec.key === 'whatsapp') {
                              handleNestedThemeConfigChange('whatsappContactEnabled', e.target.checked);
                            }
                          }}
                          className="w-4 h-4 rounded text-[#720925] cursor-pointer"
                        />
                      </div>

                      {sec.key === 'whatsapp' && isEnabled && (
                        <div className="pt-2 mt-2 border-t border-stone-100 flex items-center gap-2">
                          <input
                            type="tel"
                            value={
                              invitation.themeConfig?.whatsappPhone !== undefined
                                ? invitation.themeConfig.whatsappPhone || ''
                                : invitation.whatsappPhone || ''
                            }
                            onChange={(e) => {
                              handleNestedThemeConfigChange('whatsappPhone', e.target.value);
                              handleChange('whatsappPhone', e.target.value);
                            }}
                            placeholder="رقم واتساب العروسين (مثال: 201019262075)"
                            className="flex-1 px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs font-mono text-left dir-ltr bg-stone-50"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              handleNestedThemeConfigChange('whatsappPhone', null);
                              handleNestedThemeConfigChange('whatsappContactEnabled', false);
                              handleChange('whatsappPhone', null);
                              handleToggleSection('whatsapp', false);
                            }}
                            className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold whitespace-nowrap cursor-pointer"
                          >
                            مسح وإلغاء ❌
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Multi-Event Journey Switch */}
                <label className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/80 border border-amber-200 cursor-pointer mt-3">
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">
                      تبويبات رحلة الفرح المتعددة (Multi-Event Tabs)
                    </span>
                    <span className="text-[10px] text-amber-800">
                      تنقل ذكي بين مناسبات الفرح (باقة رحلة الفرح 95 ج.م أو VIP)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={invitation.isMultiEvent || false}
                    onChange={(e) => handleChange('isMultiEvent', e.target.checked)}
                    className="w-4 h-4 rounded text-[#720925] cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Tab 5: Media & Photos Management */}
          {activeTab === 'media' && (
            <div className="space-y-5 text-right text-xs">
              {/* Admin Tip */}
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-[11px] flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  💡 نصيحة الأدمن: ارفع الصور هنا لتخزينها محلياً في مجلد المشروع الآمن (/storage/)، وستظل محفوظة في المكتبة لتستدعيها في أي دعوة أخرى!
                </span>
              </div>

              {mediaUploadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                  {mediaUploadSuccess}
                </div>
              )}
              {mediaUploadError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold">
                  {mediaUploadError}
                </div>
              )}

              {/* WhatsApp & Social Media Link Preview Customization */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-300/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 block text-xs">
                    💬 صورة معاينة الرابط على واتساب ومواقع التواصل (WhatsApp Link Preview Image):
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    تظهر كغلاف في محادثات الواتس
                  </span>
                </div>

                <p className="text-[11px] text-amber-900 leading-relaxed">
                  هذه الصورة تظهر تلقائياً عندما يقوم العريس أو العروس بمشاركة رابط الدعوة مع المدعوين في واتساب وفيسبوك.
                </p>

                {/* Live simulated WhatsApp preview card */}
                <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-2">
                  <div className="h-32 w-full rounded-lg bg-stone-900 overflow-hidden relative flex items-center justify-center">
                    {invitation.themeConfig?.customOgImageUrl || invitation.customOgImageUrl || invitation.coverImageUrl ? (
                      <img
                        src={invitation.themeConfig?.customOgImageUrl || invitation.customOgImageUrl || invitation.coverImageUrl}
                        alt="معاينة واتساب"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white text-xs font-bold text-center p-2">
                        كارت الدعوة الرسمي التلقائي من المنصة
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] font-bold text-stone-900">
                    دعوة فرح {invitation.coupleGroomAr} & {invitation.coupleBrideAr} ❤️
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono">
                    farahna.menuflowx.com
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={invitation.themeConfig?.customOgImageUrl || invitation.customOgImageUrl || ''}
                    onChange={(e) => {
                      handleNestedThemeConfigChange('customOgImageUrl', e.target.value);
                      handleChange('customOgImageUrl', e.target.value);
                    }}
                    placeholder="رابط الصورة أو اضغط رفع صورة جديدة"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-left dir-ltr bg-white"
                  />
                  <label className="shrink-0 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-2xs">
                    <UploadCloud className="w-4 h-4" />
                    <span>{uploadingImage ? 'جاري الرفع...' : 'رفع صورة'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleDirectImageUpload(e, 'customOg')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px]">
                  <span className="text-stone-500 font-bold">اختصار سريع:</span>
                  {invitation.coverImageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        handleNestedThemeConfigChange('customOgImageUrl', invitation.coverImageUrl);
                        handleChange('customOgImageUrl', invitation.coverImageUrl);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                    >
                      استخدام صورة الغلاف
                    </button>
                  )}
                  {invitation.coupleImageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        handleNestedThemeConfigChange('customOgImageUrl', invitation.coupleImageUrl);
                        handleChange('customOgImageUrl', invitation.coupleImageUrl);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                    >
                      استخدام صورة العروسين
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      handleNestedThemeConfigChange('customOgImageUrl', '');
                      handleChange('customOgImageUrl', '');
                    }}
                    className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-rose-700 font-bold cursor-pointer"
                  >
                    حذف وتطبيق التلقائي
                  </button>
                </div>
              </div>

              {/* 1. Cover Image Upload */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="font-bold text-stone-800 block">١. صورة غلاف الدعوة (Cover Image):</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={invitation.coverImageUrl || ''}
                    onChange={(e) => handleChange('coverImageUrl', e.target.value)}
                    placeholder="رابط الصورة أو اضغط رفع صورة جديدة"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-left dir-ltr bg-white"
                  />
                  <label className="shrink-0 px-3 py-2 rounded-xl bg-[#720925] text-white font-bold cursor-pointer hover:opacity-90 flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4" />
                    <span>{uploadingImage ? 'جاري الرفع...' : 'رفع'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleDirectImageUpload(e, 'cover')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* 2. Couple Portrait Photo */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="font-bold text-stone-800 block">٢. صورة العروسين الدائرية (Couple Portrait):</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={invitation.coupleImageUrl || ''}
                    onChange={(e) => handleChange('coupleImageUrl', e.target.value)}
                    placeholder="رابط صورة العروسين أو اضغط رفع"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-left dir-ltr bg-white"
                  />
                  <label className="shrink-0 px-3 py-2 rounded-xl bg-[#720925] text-white font-bold cursor-pointer hover:opacity-90 flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4" />
                    <span>{uploadingImage ? 'جاري الرفع...' : 'رفع'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleDirectImageUpload(e, 'couple')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* 3. Gallery Images (VIP & Journey) */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800">٣. ألبوم صور جلسة التصوير (Gallery):</span>
                  <label className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold cursor-pointer hover:opacity-90 flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>إضافة صورة للألبوم</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleDirectImageUpload(e, 'gallery')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  {(invitation.galleryImages || []).map((imgUrl: string, idx: number) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-stone-200 h-20 bg-white">
                      <img src={imgUrl} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...invitation.galleryImages];
                          updated.splice(idx, 1);
                          handleChange('galleryImages', updated);
                        }}
                        className="absolute inset-0 bg-red-950/70 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold text-[10px] transition-opacity cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Reusable Media from Project Library */}
              {savedMediaList.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <span className="font-bold text-stone-700 block">
                    صور سابقة محفوظة في مكتبة السيرفر (يمكن استدعاؤها بنقرة زر):
                  </span>
                  <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 bg-stone-100 rounded-2xl">
                    {savedMediaList.map((m: any) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          handleChange('coverImageUrl', m.url);
                          alert('تم اختيار الصورة كغلاف للدعوة بنجاح!');
                        }}
                        className="h-16 rounded-xl overflow-hidden border border-stone-300 relative group cursor-pointer hover:scale-105 transition-transform"
                        title="انقر لتعيينها كغلاف للدعوة"
                      >
                        <img src={m.url} alt={m.originalName || 'media'} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] text-center truncate px-1">
                          اختر
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </div>

        {/* Live Mobile Preview Frame (Center/Left) */}
        <div className={`flex-1 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 overflow-y-auto bg-gradient-to-br from-stone-100/90 via-[#FDFBF7] to-amber-50/30 relative ${
          adminMobileView === 'editor' ? 'hidden md:flex' : 'flex'
        }`}>
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
              className="flex-1 overflow-y-auto no-scrollbar"
              style={{
                backgroundColor:
                  invitation.themeConfig?.backgroundColor ||
                  invitation.theme?.config?.backgroundColor ||
                  '#FAF7F2',
              }}
            >
              <InvitationRenderer
                invitation={invitation}
                events={invitation.events || []}
                theme={invitation.theme}
                sections={invitation.sections || []}
                isPreview={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Theme Modal */}
      {showSaveThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
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
                  onClick={() => setShowSaveThemeModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={savingNewTheme}
                  className="px-5 py-2 rounded-xl burgundy-gradient-bg text-white font-bold shadow-md"
                >
                  {savingNewTheme ? 'جاري الحفظ...' : 'حفظ الثيم للأبد 💾'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
