'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch } from '@/lib/api';
import {
  ArrowRight,
  PlusCircle,
  Sparkles,
  Crown,
  Heart,
  Check,
  UserCheck,
  Zap,
  HelpCircle,
  Info,
  Type,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  ARABIC_WEDDING_FONTS,
  WeddingFontOption,
  generateInvitationSlug,
  transliterateArabicToSlug,
} from '@farahna/shared';

export interface InvitationTypeOption {
  id: 'wedding' | 'engagement' | 'katb_ketab' | 'henna' | 'custom';
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  slugPrefix: string;
  defaultTitlePrefix: string;
  person1Label: string;
  person2Label: string;
  person1Placeholder: string;
  person2Placeholder: string;
  isCouple: boolean;
  guidance: string;
}

const INVITATION_TYPES: InvitationTypeOption[] = [
  {
    id: 'wedding',
    title: 'دعوة زفاف وفرح',
    subtitle: 'ليلة العمر وحفل الزفاف الرسمي',
    icon: '👑',
    badge: 'الأكثر طلباً',
    slugPrefix: '/invitation/wedding/',
    defaultTitlePrefix: 'دعوة زفاف',
    person1Label: 'اسم العريس (عربي): *',
    person2Label: 'اسم العروسة (عربي): *',
    person1Placeholder: 'أحمد محمود',
    person2Placeholder: 'سارة إبراهيم',
    isCouple: true,
    guidance: 'حفل الزفاف الرسمي يشمل تفاصيل الزفة، القاعة، عداد تنازلي، وخريطة الموقع وتأكيد الحضور.',
  },
  {
    id: 'engagement',
    title: 'دعوة خطوبة',
    subtitle: 'حفل خطوبة مبارك وقراءة فاتحة',
    icon: '💍',
    badge: 'خطوبة مباركة',
    slugPrefix: '/invitation/engagement/',
    defaultTitlePrefix: 'دعوة خطوبة مباركة',
    person1Label: 'اسم العريس (عربي): *',
    person2Label: 'اسم العروسة (عربي): *',
    person1Placeholder: 'أحمد محمود',
    person2Placeholder: 'سارة إبراهيم',
    isCouple: true,
    guidance: 'دعوة خطوبة أنيقة ومميزة لمشاركة فرحة الخطوبة وتلبيس الدبل مع الأهل والأصدقاء.',
  },
  {
    id: 'katb_ketab',
    title: 'دعوة كتب كتاب',
    subtitle: 'عقد قران ومباركة دينية',
    icon: '📜',
    badge: 'عقد قران',
    slugPrefix: '/invitation/katb_ketab/',
    defaultTitlePrefix: 'دعوة عقد قران مبارك',
    person1Label: 'اسم العريس (عربي): *',
    person2Label: 'اسم العروسة (عربي): *',
    person1Placeholder: 'أحمد محمود',
    person2Placeholder: 'سارة إبراهيم',
    isCouple: true,
    guidance: 'دعوة عقد القران بآيات قرآنية وتفاصيل المسجد أو القاعة، وتهاني الأهل والأحباب.',
  },
  {
    id: 'henna',
    title: 'دعوة ليلة حنة',
    subtitle: 'ليلة حنة خاصة بالسيدات',
    icon: '🌿',
    badge: 'حنة العروسة',
    slugPrefix: '/invitation/henna/',
    defaultTitlePrefix: 'دعوة ليلة حنة',
    person1Label: 'اسم العروسة (عربي): *',
    person2Label: 'اسم العريس (اختياري):',
    person1Placeholder: 'سارة إبراهيم',
    person2Placeholder: 'أحمد محمود (اختياري)',
    isCouple: false,
    guidance: 'تتضمن خيار خصوصية السيدات التامة لمنع تداول الموقع أو الصور إلا للمدعوات فقط.',
  },
  {
    id: 'custom',
    title: 'مناسبة خاصة / احتفال',
    subtitle: 'تخرج، استقبال، عقيقة وسبوع، تكريم، عيد ميلاد',
    icon: '✨',
    badge: 'مناسبة مخصصة',
    slugPrefix: '/invitation/custom/',
    defaultTitlePrefix: 'دعوة حفل واحتفال خاص',
    person1Label: 'اسم صاحب المناسبة / المحتفى به: *',
    person2Label: 'الاسم الثاني أو الجهة المنظمة (اختياري):',
    person1Placeholder: 'د. أحمد محمود',
    person2Placeholder: 'عائلة محمود / كلية الهندسة',
    isCouple: false,
    guidance: 'مناسبة خاصة مرنة لأي فعالية عائلية أو رسمية (حفل تخرج، استقبال، سبوع مولود، عيد ميلاد، إيفنت VIP).',
  },
];

const PACKAGES_CONFIG = [
  {
    id: 'basic',
    name: 'باقة المناسبة الفردية',
    price: '50 ج.م',
    icon: '🌸',
    color: 'border-stone-300 text-stone-800',
    activeColor: 'border-amber-600 bg-amber-50/70 text-amber-950 shadow-md',
    badge: 'مناسبة واحدة فقط',
    summary: 'حدث واحد محدد (فرح، أو خطوبة، أو كتب كتاب، أو حنة، أو احتفال خاص) برابط مستقل وسريع',
    defaultMultiEvent: false,
    guidance: '💡 نصيحة الأدمن: مناسبة واحدة مستقلة ومباشرة بدون تبويبات متعددة حتى تظل الدعوة بسيطة وسريعة.',
  },
  {
    id: 'wedding-journey',
    name: 'باقة الفعاليات المتعددة (الرحلة الشاملة)',
    price: '95 ج.م',
    icon: '👑',
    color: 'border-stone-300 text-stone-800',
    activeColor: 'border-rose-900 bg-rose-50/70 text-[#720925] shadow-md',
    badge: 'الأكثر طلباً والأفضل قيمة 👑',
    summary: 'حتى 4 فعاليات ومناسبات مختلفة (مثل خطوبة + حنة + كتب كتاب + فرح، أو استقبال + حفل رئيسي) برابط موحد',
    defaultMultiEvent: true,
    guidance: '💡 نصيحة الأدمن: تتيح تفعيل تبويبات رحلة الفعاليات، وإضافة مواعيد مختلفة لكل حدث، وتأكيد الحضور (RSVP) لكل فقرة.',
  },
  {
    id: 'luxury-vip',
    name: 'باقة التصميم الخاص الملكي VIP',
    price: '150 ج.م',
    icon: '💎',
    color: 'border-stone-300 text-stone-800',
    activeColor: 'border-amber-500 bg-amber-50/70 text-stone-900 shadow-md',
    badge: 'فخامة ملكية وتخصيص كامل 💎',
    summary: 'تخصيص كامل لكافة الألوان، خطوط عربية ملكية، خصوصية تامة، وألبوم صور احترافي مفتوح لأي مناسبة',
    defaultMultiEvent: true,
    guidance: '💡 نصيحة الأدمن: باقة VIP تتيح لك تخصيص كامل للألوان والأصول، ورفع ألبوم صور عالي الدقة لجلسة التصوير.',
  },
];

export default function NewInvitationPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Occasion / Invitation Type State (Defaults to 'wedding' but fully selectable at top)
  const [type, setType] = useState<'wedding' | 'engagement' | 'katb_ketab' | 'henna' | 'custom'>('wedding');

  // 2. Selected Package State
  const [selectedPackage, setSelectedPackage] = useState<string>('wedding-journey');

  // 3. Customer Mode State: 'quick' (no customer required) | 'existing' | 'new'
  const [customerMode, setCustomerMode] = useState<'quick' | 'existing' | 'new'>('quick');
  const [customerId, setCustomerId] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');

  // 4. Invitation Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugSuffix, setSlugSuffix] = useState<string>(() =>
    Math.random().toString(36).substring(2, 6).toLowerCase()
  );
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const [coupleGroomAr, setCoupleGroomAr] = useState('');
  const [coupleBrideAr, setCoupleBrideAr] = useState('');
  const [eventDate, setEventDate] = useState('2026-11-20T19:00:00');
  const [themeId, setThemeId] = useState('');
  const [isMultiEvent, setIsMultiEvent] = useState(true);
  const [selectedFont, setSelectedFont] = useState("'Cairo', sans-serif");

  const currentTypeConfig = INVITATION_TYPES.find((t) => t.id === type) || INVITATION_TYPES[0];
  const currentPkg = PACKAGES_CONFIG.find((p) => p.id === selectedPackage) || PACKAGES_CONFIG[1];

  const randomizeSuffix = () => {
    setSlugSuffix(Math.random().toString(36).substring(2, 6).toLowerCase());
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([
      adminFetch('/customers').catch(() => ({ success: false, data: { customers: [] } })),
      adminFetch('/themes').catch(() => ({ success: false, data: [] })),
    ])
      .then(([custRes, themeRes]) => {
        if (!mounted) return;
        if (custRes?.success && custRes.data?.customers?.length > 0) {
          setCustomers(custRes.data.customers);
          setCustomerId(custRes.data.customers[0].id);
        }
        if (themeRes?.success && Array.isArray(themeRes.data) && themeRes.data.length > 0) {
          setThemes(themeRes.data);
          setThemeId(themeRes.data[0].id);
        }
      })
      .catch((err) => {
        console.warn('Error loading admin new page data:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // When changing invitation type
  const handleTypeSelect = (selectedType: 'wedding' | 'engagement' | 'katb_ketab' | 'henna' | 'custom') => {
    setType(selectedType);
    const newConfig = INVITATION_TYPES.find((t) => t.id === selectedType);
    if (!newConfig) return;

    // Update suggested title if not heavily customized
    if (coupleGroomAr || coupleBrideAr) {
      if (selectedType === 'henna') {
        setTitle(`${newConfig.defaultTitlePrefix} ${coupleBrideAr || coupleGroomAr} 🌿`);
      } else if (selectedType === 'custom') {
        setTitle(`${newConfig.defaultTitlePrefix} - ${coupleGroomAr || coupleBrideAr} ✨`);
      } else {
        setTitle(`${newConfig.defaultTitlePrefix} ${coupleGroomAr} & ${coupleBrideAr} ❤️`);
      }
    }
  };

  const handlePackageSelect = (pkgId: string) => {
    setSelectedPackage(pkgId);
    const target = PACKAGES_CONFIG.find((p) => p.id === pkgId);
    if (target) {
      setIsMultiEvent(target.defaultMultiEvent);
    }
  };

  // Auto-fill suggested slug & title from names
  const handleNameChange = (val1: string, val2: string) => {
    setCoupleGroomAr(val1);
    setCoupleBrideAr(val2);

    if (!title && (val1 || val2)) {
      if (type === 'henna') {
        setTitle(`${currentTypeConfig.defaultTitlePrefix} ${val2 || val1} 🌿`);
      } else if (type === 'custom') {
        setTitle(`${currentTypeConfig.defaultTitlePrefix} - ${val1 || val2} ✨`);
      } else {
        setTitle(`${currentTypeConfig.defaultTitlePrefix} ${val1} & ${val2} ❤️`);
      }
    }

    if (!isSlugCustomized) {
      const part1 = transliterateArabicToSlug(val1.trim().split(/\s+/)[0]);
      const part2 = transliterateArabicToSlug(val2.trim().split(/\s+/)[0]);
      const combined = [part1, part2].filter(Boolean).join('-');
      if (combined) {
        setSlug(combined);
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      let resolvedCustomerId = '';

      // 1. Resolve Customer by selected mode
      if (customerMode === 'existing') {
        if (!customerId) {
          setErrorMsg('يرجى اختيار عميل مسجل من القائمة، أو التبديل إلى الوضع السريع ⚡');
          setSubmitting(false);
          return;
        }
        resolvedCustomerId = customerId;
      } else if (customerMode === 'new') {
        if (!newCustomerName.trim() || !newCustomerPhone.trim()) {
          setErrorMsg('يرجى إدخال اسم العميل ورقم هاتفه لتسجيله أولاً');
          setSubmitting(false);
          return;
        }

        // Fast create customer
        const custRes = await adminFetch('/customers', {
          method: 'POST',
          body: JSON.stringify({
            name: newCustomerName.trim(),
            phone: newCustomerPhone.trim(),
            whatsapp: newCustomerPhone.trim(),
            notes: `تم إنشاؤه تلقائياً أثناء إنشاء دعوة ${title || currentTypeConfig.title}`,
            source: 'website',
          }),
        });

        if (custRes.success && custRes.data?.id) {
          resolvedCustomerId = custRes.data.id;
        } else {
          setErrorMsg(custRes.message || 'فشل تسجيل العميل الجديد، يرجى مراجعة رقم الهاتف والبيانات');
          setSubmitting(false);
          return;
        }
      }

      // 2. Sanitize and combine user's slug with the random suffix
      const userBaseSlug = (slug || transliterateArabicToSlug(`${coupleGroomAr}-${coupleBrideAr}`) || 'farah')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, '')
        .replace(/^-+|-+$/g, '');

      // Ensure random characters are appended to the user's slug
      const finalSlug = userBaseSlug.endsWith(`-${slugSuffix}`)
        ? userBaseSlug
        : `${userBaseSlug}-${slugSuffix}`;

      const payload = {
        customerId: resolvedCustomerId || undefined,
        title:
          title ||
          `${currentTypeConfig.title} - ${coupleGroomAr || 'العروسين'}${coupleBrideAr ? ' & ' + coupleBrideAr : ''}`,
        slug: finalSlug || `farah-${Date.now().toString().slice(-6)}-${slugSuffix}`,
        type,
        coupleGroomAr: coupleGroomAr || (type === 'custom' ? 'المحتفى به' : 'العريس'),
        coupleBrideAr: coupleBrideAr || (type === 'custom' ? 'المناسبة' : 'العروس'),
        eventDate: new Date(eventDate).toISOString(),
        themeId: themeId || (themes[0]?.id || 'theme-royal-burgundy'),
        isMultiEvent,
        status: 'draft',
        themeConfig: {
          selectedPackage,
          fontFamily: selectedFont,
        },
      };

      const res = await adminFetch('/invitations', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success && res.data?.id) {
        router.push(`/admin/invitations/${res.data.id}/builder`);
      } else {
        const errorDetail = res.errors?.map((err: any) => `${err.field}: ${err.message}`).join(' - ');
        setErrorMsg(errorDetail ? `${res.message}: ${errorDetail}` : (res.message || 'فشل إنشاء الدعوة'));
      }
    } catch (e: any) {
      setErrorMsg(e?.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right font-cairo">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push('/admin/invitations')}
          className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 cursor-pointer"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">إنشاء وتجهيز دعوة جديدة 🪄</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            اختر نوع المناسبة بدقة (زفاف، خطوبة، كتب كتاب، حنة، أو مناسبة خاصة) وحدد الباقة المناسبة للعميل
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs p-6 sm:p-8 space-y-8">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Occasion & Invitation Type Selection (Crucial!) */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs sm:text-sm font-black text-stone-900 block flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#720925]" />
              <span>١. حدد نوع المناسبة والدعوة: *</span>
            </label>
            <span className="text-xs font-black text-white bg-[#720925] px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
              <span>{currentTypeConfig.icon}</span>
              <span>النوع المحدد: {currentTypeConfig.title}</span>
            </span>
          </div>
          <p className="text-[11px] text-stone-500">
            حدد نوع الحدث بدقة ليتم تهيئة رابط الدعوة ({currentTypeConfig.slugPrefix}) والكلمات والنصوص المخصصة تلقائياً
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
            {INVITATION_TYPES.map((t) => {
              const isSelected = type === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => handleTypeSelect(t.id)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 relative text-right ${
                    isSelected
                      ? 'border-[#720925] bg-rose-50/70 text-[#720925] shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{t.icon}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#720925] text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {t.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-xs text-stone-900 leading-tight">
                      {t.title}
                    </h3>
                    <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-2 leading-tight">
                      {t.subtitle}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-stone-200/60 font-mono text-[10px] text-stone-400 dir-ltr text-right truncate">
                    {t.slugPrefix}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-700 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 text-[#720925] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>توجيه النظام:</strong> {currentTypeConfig.guidance} رابط الدعوة سيبدأ تلقائياً بـ{' '}
              <code className="font-mono text-[#720925] font-bold dir-ltr inline-block">
                {currentTypeConfig.slugPrefix}
              </code>
            </span>
          </div>
        </div>

        {/* STEP 2: Package Selection Cards */}
        <div className="space-y-3 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs sm:text-sm font-black text-stone-900 block flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#720925]" />
              <span>٢. حدد باقة الدعوة والتسعير: *</span>
            </label>
            <span className="text-[11px] font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              الباقة: {currentPkg.name} ({currentPkg.price})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PACKAGES_CONFIG.map((pkg) => {
              const isSelected = selectedPackage === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => handlePackageSelect(pkg.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    isSelected ? pkg.activeColor : 'bg-white border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{pkg.icon}</span>
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white/80 border border-stone-200 shadow-2xs">
                        {pkg.price}
                      </span>
                    </div>
                    <h3 className="font-black text-xs sm:text-sm">{pkg.name}</h3>
                    <p className="text-[11px] text-stone-500 leading-snug">{pkg.summary}</p>
                  </div>

                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] font-bold">
                    <span>{pkg.badge}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Admin Guidance Alert for Selected Package */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-medium flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{currentPkg.guidance}</p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="space-y-6">
          {/* STEP 3: Customer Assignment */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-black text-stone-900 block flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#720925]" />
                <span>٣. ربط الدعوة بالعميل (اختياري لسرعة الإنجاز):</span>
              </label>
              <span className="text-[10px] text-stone-400">
                يمكنك إنشاء الدعوة فوراً بدون عميل مسبق
              </span>
            </div>

            {/* Mode Selector */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 rounded-2xl text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => setCustomerMode('quick')}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  customerMode === 'quick' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>إنشاء سريع ومباشر ⚡</span>
              </button>

              <button
                type="button"
                onClick={() => setCustomerMode('existing')}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  customerMode === 'existing' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>عميل مسجل حالياً</span>
              </button>

              <button
                type="button"
                onClick={() => setCustomerMode('new')}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  customerMode === 'new' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>تسجيل عميل جديد</span>
              </button>
            </div>

            {/* Existing Customer Dropdown */}
            {customerMode === 'existing' && (
              <div className="space-y-1">
                {customers.length === 0 ? (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs font-medium">
                    ⚠️ لا يوجد عملاء مسجلون حالياً. يمكنك اختيار &quot;إنشاء سريع ومباشر ⚡&quot; أو &quot;تسجيل عميل جديد&quot;.
                  </div>
                ) : (
                  <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.phone} {c.notes ? `(${c.notes})` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* New Customer Inline Fields */}
            {customerMode === 'new' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 block">اسم العميل بالكامل: *</label>
                  <input
                    type="text"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="مثال: محمد صلاح"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 block">رقم هاتف / واتساب: *</label>
                  <input
                    type="tel"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white text-left dir-ltr"
                  />
                </div>
              </div>
            )}

            {customerMode === 'quick' && (
              <p className="text-[11px] text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                ⚡ وضع السرعة: سيتم إنشاء الدعوة فوراً برابط مستقل ويمكن ربطها بأي عميل أو طلب لاحقاً من لوحة التحكم في أي وقت.
              </p>
            )}
          </div>

          {/* STEP 4: Names & Title & Slug */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <label className="text-xs sm:text-sm font-black text-stone-900 block flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#720925]" />
                <span>٤. بيانات أصحاب المناسبة وعنوان الدعوة: *</span>
              </span>
              <span className="text-[11px] text-stone-500 font-normal">
                (المناسبة الحالية: <strong>{currentTypeConfig.title}</strong>)
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  {currentTypeConfig.person1Label}
                </label>
                <input
                  type="text"
                  required
                  value={coupleGroomAr}
                  onChange={(e) => handleNameChange(e.target.value, coupleBrideAr)}
                  placeholder={currentTypeConfig.person1Placeholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  {currentTypeConfig.person2Label}
                </label>
                <input
                  type="text"
                  required={currentTypeConfig.isCouple}
                  value={coupleBrideAr}
                  onChange={(e) => handleNameChange(coupleGroomAr, e.target.value)}
                  placeholder={currentTypeConfig.person2Placeholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">عنوان الدعوة الرئيسي: *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`مثال: ${currentTypeConfig.defaultTitlePrefix} أحمد وسارة ❤️`}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs"
              />
            </div>

            {/* Slug with DYNAMIC Prefix matching the chosen type + User's slug + Random Suffix */}
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold text-stone-700 block flex items-center gap-1.5">
                  <span>الرابط المخصص للدعوة (مع حروف عشوائية فريدة): *</span>
                </label>
                <button
                  type="button"
                  onClick={randomizeSuffix}
                  className="text-[11px] font-bold text-[#720925] hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                  title="تغيير الحروف العشوائية"
                >
                  <span>🎲 تغيير الحروف العشوائية ({slugSuffix})</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                {/* Prefix Label */}
                <div className="flex items-center px-3 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-mono text-stone-600 dir-ltr select-none shrink-0 font-bold">
                  {currentTypeConfig.slugPrefix}
                </div>

                {/* User Base Slug Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    required
                    pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                    minLength={2}
                    maxLength={50}
                    value={slug}
                    onChange={(e) => {
                      setIsSlugCustomized(true);
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                    }}
                    placeholder={
                      type === 'custom'
                        ? 'dr-ahmed-graduation'
                        : type === 'henna'
                        ? 'sara-henna-night'
                        : 'ahmed-sara'
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-mono text-left dir-ltr bg-white focus:border-[#720925] focus:ring-1 focus:ring-[#720925]"
                  />
                </div>

                {/* Random Characters Badge */}
                <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 font-mono text-xs font-bold shrink-0 dir-ltr select-none">
                  <span className="text-amber-500 font-bold">-</span>
                  <span className="text-amber-900 font-black">{slugSuffix}</span>
                </div>
              </div>

              {/* Live Link Result Preview */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono flex items-center justify-between gap-2 flex-wrap">
                <div className="text-stone-700 truncate dir-ltr text-left">
                  <span className="text-stone-400">https://farahna.menuflowx.com{currentTypeConfig.slugPrefix}</span>
                  <span className="text-[#720925] font-black">{slug ? slug.replace(/^-+|-+$/g, '') : 'link'}-{slugSuffix}</span>
                </div>
                <span className="text-[10px] font-sans font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shrink-0">
                  الرابط النهائي الناتج ✅
                </span>
              </div>

              <p className="text-[11px] text-stone-500">
                💡 يتم أخذ الرابط منك وإضافة حروف عشوائية تلقائياً (<code className="font-mono text-[#720925] font-bold">-{slugSuffix}</code>) لضمان الخصوصية وعدم تكرار الرابط مع أي دعوة أخرى.
              </p>

              {slug && slug.length < 2 && (
                <span className="text-[10px] text-amber-700 block">⚠️ الرابط يجب أن يكون حرفين على الأقل</span>
              )}
              {['admin', 'api', 'auth', 'login', 'preview', 'settings', 'static', 'storage', 'health', 'media'].includes(slug) && (
                <span className="text-[10px] text-rose-700 font-bold block">❌ هذا الاسم محجوز لصفحات النظام، يرجى اختيار اسم آخر</span>
              )}
            </div>
          </div>

          {/* STEP 5: Design Theme & Date */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">ثيم التصميم الأولي:</label>
                <select
                  value={themeId}
                  onChange={(e) => setThemeId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white"
                >
                  {themes.map((th) => (
                    <option key={th.id} value={th.id}>
                      {th.nameAr} ({th.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block flex items-center justify-between">
                  <span>خط الدعوة (Font):</span>
                  <span className="text-[10px] text-amber-700 font-bold">VIP 👑</span>
                </label>
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white"
                >
                  {ARABIC_WEDDING_FONTS.map((f: WeddingFontOption) => (
                    <option key={f.id} value={f.fontFamily}>
                      {f.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">تاريخ ووقت المناسبة:</label>
                <input
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs text-left dir-ltr"
                />
              </div>
            </div>

            {/* Multi-event toggle */}
            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 cursor-pointer">
              <input
                type="checkbox"
                checked={isMultiEvent}
                onChange={(e) => setIsMultiEvent(e.target.checked)}
                className="w-4 h-4 rounded text-[#720925]"
              />
              <div>
                <span className="text-xs font-bold text-amber-950 block">
                  تفعيل رحلة الفعاليات المتعددة (Multi-Event Tabs)
                </span>
                <span className="text-[11px] text-amber-800">
                  {selectedPackage === 'basic'
                    ? '⚠️ ملحوظة: باقة المناسبة الواحدة (50 ج.م) لا تدعم تبويبات متعددة، ويفضل تركها غير مفعلة.'
                    : 'يتيح إضافة أكثر من فعالية (مثل كتب كتاب + حنة + فرح، أو حفل استقبال + عشاء) برابط موحد'}
                </span>
              </div>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl burgundy-gradient-bg text-white font-black text-xs sm:text-sm shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'جاري تجهيز الدعوة والمحرر...' : `إنشاء ${currentTypeConfig.title} والانتقال إلى المحرر المرئي التفاعلي 🪄`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
