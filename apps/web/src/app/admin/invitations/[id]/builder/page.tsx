'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Heart,
  Palette,
  Calendar,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import {
  DEFAULT_SECTIONS,
  isValidSafeUrl,
  normalizeWebUrl,
} from '@farahna/shared';
import { adminFetch } from '@/lib/api';
import {
  BuilderTab,
  normalizeColor,
} from '@/components/admin-builder/builderConstants';
import { BuilderHeader } from '@/components/admin-builder/BuilderHeader';
import { BuilderCoupleTab } from '@/components/admin-builder/BuilderCoupleTab';
import { BuilderThemeTab } from '@/components/admin-builder/BuilderThemeTab';
import { BuilderEventsTab } from '@/components/admin-builder/BuilderEventsTab';
import { BuilderSectionsTab } from '@/components/admin-builder/BuilderSectionsTab';
import { BuilderMediaTab } from '@/components/admin-builder/BuilderMediaTab';
import { BuilderLivePreview } from '@/components/admin-builder/BuilderLivePreview';
import { SaveThemeModal } from '@/components/admin-builder/SaveThemeModal';

export default function VisualInvitationBuilderPage() {
  const params = useParams();
  const invitationId = params.id as string;

  const [invitation, setInvitation] = useState<any>(null);
  const [themes, setThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<BuilderTab>('couple');
  const [adminMobileView, setAdminMobileView] = useState<'editor' | 'preview'>('editor');
  const [previewTokenCopied, setPreviewTokenCopied] = useState(false);
  const [guestListCopied, setGuestListCopied] = useState(false);
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

  const fetchInvitationData = async () => {
    try {
      const [invRes, themesRes, mediaRes] = await Promise.all([
        adminFetch(`/invitations/${invitationId}`),
        adminFetch('/themes'),
        adminFetch('/media'),
      ]);
      if (invRes.success) {
        setInvitation(invRes.data);
      }
      if (themesRes.success) {
        setThemes(themesRes.data);
      }
      if (mediaRes?.success && Array.isArray(mediaRes.data?.media)) {
        setSavedMediaList(mediaRes.data.media);
      }
    } catch {
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

  const handleColorChange = (
    key: 'primaryColor' | 'secondaryColor' | 'backgroundColor' | 'textColor',
    val: string
  ) => {
    handleNestedThemeConfigChange(key, val);
  };

  const handleColorBlur = (
    key: 'primaryColor' | 'secondaryColor' | 'backgroundColor' | 'textColor',
    rawVal: string
  ) => {
    const trimmed = rawVal.trim();
    const normalized = normalizeColor(trimmed);
    if (!normalized) {
      const fallback =
        key === 'primaryColor'
          ? invitation.theme?.config?.primaryColor || '#720925'
          : key === 'secondaryColor'
          ? invitation.theme?.config?.secondaryColor || '#D4AF37'
          : key === 'backgroundColor'
          ? invitation.theme?.config?.backgroundColor || '#FAF7F2'
          : invitation.theme?.config?.textColor || '#1A1819';
      handleNestedThemeConfigChange(key, fallback);
    } else {
      const cleanDigits = trimmed
        .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
        .replace(/،/g, ',');
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

  const handleApplyLiveTemplate = () => {
    if (
      !confirm(
        'هل ترغب في تعبئة هذه الدعوة بنموذج متكامل زي الدعوات الحية المنشأة؟\n\nسيتم ملء: مناسبات الفرح (الزفاف، ليلة الحنة للسيدات، كتب الكتاب)، موقع القاعة والخريطة، إهداء الأهل، كود الحنة السري، والآية الكريمة، وألبوم الصور والموسيقى.'
      )
    ) {
      return;
    }

    const baseEventDate = invitation.eventDate
      ? new Date(invitation.eventDate)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const weddingDateIso = baseEventDate.toISOString();
    const hennaDateIso = new Date(baseEventDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const katbKetabDateIso = new Date(baseEventDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

    const fullEvents = [
      {
        id: `evt-live-wedding-${Date.now()}`,
        type: 'wedding',
        titleAr: 'حفل الزفاف والزفة الكبرى 👑',
        subtitleAr: 'الليلة الملكية في قاعة عايدة',
        date: weddingDateIso,
        startTime: '08:00 م',
        endTime: '02:00 ص',
        venueNameAr: 'فندق ماريوت الزمالك — قاعة عايدة الملكية',
        addressAr: '١٦ شارع سراي الجزيرة، حي الزمالك، القاهرة',
        googleMapsUrl: 'https://maps.google.com/?q=Cairo+Marriott+Hotel+Zamalek',
        dressCodeAr: 'Black Tie / بدلة رسمية كاملة وفستان سواريه فاخر 🎩👗',
        descriptionAr: 'تتوفر خدمة صف السيارات الفاخرة (Valet Parking) عند بوابة الجزيرة المطلة على النيل.',
        isVisible: true,
        sortOrder: 1,
        isHennaFemaleOnly: false,
      },
      {
        id: `evt-live-henna-${Date.now() + 1}`,
        type: 'henna',
        titleAr: 'ليلة الحنة وسهرة البنات 🌿',
        subtitleAr: 'أجواء شعبية مصرية دافئة وزغاريد',
        date: hennaDateIso,
        startTime: '05:00 م',
        endTime: '10:00 م',
        venueNameAr: 'فيلا النرجس للمناسبات الخاصة',
        addressAr: 'الحي الرابع، التجمع الخامس، القاهرة الجديدة',
        googleMapsUrl: 'https://maps.google.com/?q=New+Cairo+Villa',
        dressCodeAr: 'جلابيب شرقية وملابس تراثية مبهجة 💃',
        descriptionAr: 'سهرة مبهجة مع رسم الحنة والدفوف والزغاريد. خاص بالسيدات فقط.',
        isVisible: true,
        sortOrder: 2,
        isHennaFemaleOnly: true,
      },
      {
        id: `evt-live-katb-${Date.now() + 2}`,
        type: 'katb_ketab',
        titleAr: 'عقد القران وكتب الكتاب 📜',
        subtitleAr: 'اللحظة الشرعية المباركة',
        date: katbKetabDateIso,
        startTime: '03:00 م',
        endTime: '05:00 م',
        venueNameAr: 'قاعة الماسة — مسجد المشير طنطاوي',
        addressAr: 'محور المشير، التجمع الخامس، القاهرة',
        googleMapsUrl: 'https://maps.google.com/?q=Mosheer+Tantawy+Mosque',
        dressCodeAr: 'ملابس رسمية محتشمة ومريحة',
        descriptionAr: 'بارك الله لهما وبارك عليهما وجمع بينهما في خير.',
        isVisible: true,
        sortOrder: 3,
        isHennaFemaleOnly: false,
      },
    ];

    const allSections = DEFAULT_SECTIONS.map((sec, idx) => ({
      sectionKey: sec.key,
      isEnabled: true,
      sortOrder: idx + 1,
    }));

    setInvitation((prev: any) => ({
      ...prev,
      parentsGroomAr: prev.parentsGroomAr?.trim() || 'يتشرف المستشار والد العريس وحرمه',
      parentsBrideAr: prev.parentsBrideAr?.trim() || 'والأستاذ الدكتور والد العروس وحرمه',
      weddingMessageAr:
        prev.weddingMessageAr?.trim() ||
        `بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ\n"وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"\n\nيسعدنا ويشرفنا دعوتكم لمشاركتنا فرحتنا وابتداء أجمل فصول حياتنا معاً. حضوركم يملأ قلوبنا بهجة وفرحاً ❤️`,
      coverImageUrl:
        prev.coverImageUrl?.trim() ||
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      coupleImageUrl:
        prev.coupleImageUrl?.trim() ||
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      galleryImages:
        Array.isArray(prev.galleryImages) && prev.galleryImages.length > 0
          ? prev.galleryImages
          : [
              'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
            ],
      musicUrl: prev.musicUrl?.trim() || '/audio/presets/piano-romance.mp3',
      musicTitle: prev.musicTitle?.trim() || 'موسيقى ليلة العمر الهادئة',
      events: fullEvents,
      sections: allSections,
      isMultiEvent: true,
      rsvpEnabled: true,
      countdownEnabled: true,
      envelopeAnimationEnabled: true,
      themeConfig: {
        ...(prev.themeConfig || {}),
        hennaSpecialEnabled: true,
        hennaPasscode: (prev.themeConfig as any)?.hennaPasscode || '2026',
        hennaMessage:
          (prev.themeConfig as any)?.hennaMessage ||
          'يسعدنا تشريفكم في ليلة الحنة المبهجة في أجواء راقية ومخصصة للسيدات فقط للاحتفال بالعروس 🌸🌿',
      },
    }));

    setSuccessNotice('تم تطبيق النموذج المتكامل بنجاح كالدعوات الحية! اضغط حفظ الآن 💾');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleSave = async () => {
    if (invitation.slug) {
      const cleanSlug = invitation.slug.toLowerCase().trim();
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug)) {
        alert('الرابط المختصر يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشُرط فقط وبدون تكرار للشُرط');
        return;
      }
      if (
        ['admin', 'api', 'auth', 'login', 'preview', 'settings', 'static', 'storage', 'health', 'media'].includes(
          cleanSlug
        )
      ) {
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
        if (res.data) {
          setInvitation(res.data);
        }
        setSuccessNotice('تم حفظ التعديلات بنجاح! ✨');
        setTimeout(() => setSuccessNotice(''), 3000);
      } else {
        alert(res.message || 'حدث خطأ أثناء الحفظ');
      }
    } catch {
      alert('خطأ في الاتصال بالخادم');
    } finally {
      setSaving(false);
    }
  };

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

  const handleSaveAsNewTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThemeNameAr || !newThemeSlug) return;
    setSavingNewTheme(true);

    try {
      const pColor =
        invitation.themeConfig?.primaryColor || invitation.theme?.config?.primaryColor || '#720925';
      const sColor =
        invitation.themeConfig?.secondaryColor || invitation.theme?.config?.secondaryColor || '#D4AF37';
      const bColor =
        invitation.themeConfig?.backgroundColor || invitation.theme?.config?.backgroundColor || '#FAF7F2';
      const tColor =
        invitation.themeConfig?.textColor || invitation.theme?.config?.textColor || '#1A1819';

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
        const themesRes = await adminFetch('/themes');
        if (themesRes.success) setThemes(themesRes.data);
      } else {
        alert(res.message || 'فشل حفظ الثيم');
      }
    } catch {
      alert('خطأ أثناء حفظ الثيم');
    } finally {
      setSavingNewTheme(false);
    }
  };

  const previewUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/preview/${invitation.previewToken}`;
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

  const pkgId =
    invitation.themeConfig?.selectedPackage ||
    invitation.order?.packageId ||
    (invitation.isMultiEvent ? 'wedding-journey' : 'basic');

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-[#FAF8F5] font-cairo">
      {/* Top Builder Header */}
      <BuilderHeader
        invitation={invitation}
        previewUrl={previewUrl}
        adminMobileView={adminMobileView}
        setAdminMobileView={setAdminMobileView}
        successNotice={successNotice}
        previewTokenCopied={previewTokenCopied}
        guestListCopied={guestListCopied}
        copyPreviewLink={copyPreviewLink}
        copyGuestListLink={copyGuestListLink}
        handleApplyLiveTemplate={handleApplyLiveTemplate}
        handleSave={handleSave}
        saving={saving}
      />

      {/* Main Workspace (Editor Panel on Right, Live Mobile on Center/Left) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Sidebar */}
        <div
          className={`w-full md:w-[480px] lg:w-[500px] xl:w-[540px] bg-white border-l border-stone-200 flex flex-col shrink-0 overflow-hidden shadow-xs z-10 ${
            adminMobileView === 'preview' ? 'hidden md:flex' : 'flex'
          }`}
        >
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
                  onClick={() => setActiveTab(tab.id as BuilderTab)}
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
            {activeTab === 'couple' && (
              <BuilderCoupleTab
                invitation={invitation}
                handleChange={handleChange}
                handleNestedThemeConfigChange={handleNestedThemeConfigChange}
                handleToggleSection={handleToggleSection}
                pkgId={pkgId}
              />
            )}

            {activeTab === 'theme' && (
              <BuilderThemeTab
                invitation={invitation}
                themes={themes}
                handleChange={handleChange}
                handleNestedThemeConfigChange={handleNestedThemeConfigChange}
                handleColorChange={handleColorChange}
                handleColorBlur={handleColorBlur}
                onOpenSaveThemeModal={() => setShowSaveThemeModal(true)}
                setEnvelopeResetKey={setEnvelopeResetKey}
              />
            )}

            {activeTab === 'events' && (
              <BuilderEventsTab
                invitation={invitation}
                handleChange={handleChange}
              />
            )}

            {activeTab === 'sections' && (
              <BuilderSectionsTab
                invitation={invitation}
                setInvitation={setInvitation}
                handleChange={handleChange}
                handleNestedThemeConfigChange={handleNestedThemeConfigChange}
                handleToggleSection={handleToggleSection}
                onNavigateToTab={(tab) => setActiveTab(tab as BuilderTab)}
              />
            )}

            {activeTab === 'media' && (
              <BuilderMediaTab
                invitation={invitation}
                handleChange={handleChange}
                handleNestedThemeConfigChange={handleNestedThemeConfigChange}
                handleDirectImageUpload={handleDirectImageUpload}
                uploadingImage={uploadingImage}
                mediaUploadSuccess={mediaUploadSuccess}
                mediaUploadError={mediaUploadError}
                savedMediaList={savedMediaList}
                audioPlaying={audioPlaying}
                toggleAudioPlay={toggleAudioPlay}
                handleAdminAudioUpload={handleAdminAudioUpload}
                uploadingAudio={uploadingAudio}
              />
            )}
          </div>
        </div>

        {/* Live Mobile Preview Frame (Center/Left) */}
        <BuilderLivePreview
          invitation={invitation}
          previewUrl={previewUrl}
          adminMobileView={adminMobileView}
          envelopeResetKey={envelopeResetKey}
          setEnvelopeResetKey={setEnvelopeResetKey}
        />
      </div>

      {/* Save Theme Modal */}
      <SaveThemeModal
        show={showSaveThemeModal}
        onClose={() => setShowSaveThemeModal(false)}
        newThemeNameAr={newThemeNameAr}
        setNewThemeNameAr={setNewThemeNameAr}
        newThemeSlug={newThemeSlug}
        setNewThemeSlug={setNewThemeSlug}
        handleSaveAsNewTheme={handleSaveAsNewTheme}
        savingNewTheme={savingNewTheme}
      />
    </div>
  );
}
