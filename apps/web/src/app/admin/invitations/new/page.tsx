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
} from 'lucide-react';
import { ARABIC_WEDDING_FONTS, WeddingFontOption } from '@farahna/shared';

const PACKAGES_CONFIG = [
  {
    id: 'basic',
    name: 'باقة المناسبة الواحدة',
    price: '50 ج.م',
    icon: '🌸',
    color: 'border-stone-300 text-stone-800',
    activeColor: 'border-amber-600 bg-amber-50/70 text-amber-950 shadow-md',
    badge: 'مناسبة واحدة فقط',
    summary: 'فرح أو خطوبة أو كتب كتاب واحد — بدون تبويبات متعددة',
    defaultMultiEvent: false,
    guidance: '💡 نصيحة الأدمن: اختر مناسبة واحدة فقط (فرح أو خطوبة أو كتب كتاب). لا تقم بتفعيل التبويبات المتعددة حتى تظل الدعوة بسيطة ومطابقة للباقة.',
  },
  {
    id: 'wedding-journey',
    name: 'باقة رحلة الفرح الشاملة',
    price: '95 ج.م',
    icon: '👑',
    color: 'border-stone-300 text-stone-800',
    activeColor: 'border-rose-900 bg-rose-50/70 text-[#720925] shadow-md',
    badge: 'الأكثر طلباً والأفضل قيمة 👑',
    summary: 'حتى 4 مناسبات (خطوبة + حنة + كتب كتاب + فرح) برابط واحد',
    defaultMultiEvent: true,
    guidance: '💡 نصيحة الأدمن: قم بتفعيل رحلة الفرح المتعددة، وأضف تفاصيل الخطوبة والحنة وكتب الكتاب، وفعل خيار فتح الظرف وتأكيد الحضور (RSVP).',
  },
  {
    id: 'luxury-vip',
    name: 'باقة التصميم الخاص VIP',
    price: '150 ج.م',
    icon: '💎',
    color: 'border-stone-300 text-stone-800',
    activeColor: 'border-amber-500 bg-amber-50/70 text-stone-900 shadow-md',
    badge: 'فخامة ملكية وتخصيص كامل 💎',
    summary: 'تخصيص كامل للألوان + ليلة الحنة للسيدات بخصوصية تامة + جاليري صور غير محدود',
    defaultMultiEvent: true,
    guidance: '💡 نصيحة الأدمن: باقة VIP تتيح لك تخصيص ألوان وثيم خاص للعروسين، وتفعيل تنبيه خصوصية ليلة الحنة للسيدات، ورفع ألبوم صور عالي الدقة لجلسة التصوير.',
  },
];

export default function NewInvitationPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [themes, setThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Selected Package State
  const [selectedPackage, setSelectedPackage] = useState<string>('wedding-journey');

  // Customer Mode State: 'quick' (no customer required) | 'existing' | 'new'
  const [customerMode, setCustomerMode] = useState<'quick' | 'existing' | 'new'>('quick');
  const [customerId, setCustomerId] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');

  // Invitation Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState('wedding');
  const [coupleGroomAr, setCoupleGroomAr] = useState('');
  const [coupleBrideAr, setCoupleBrideAr] = useState('');
  const [eventDate, setEventDate] = useState('2026-11-20T19:00:00');
  const [themeId, setThemeId] = useState('');
  const [isMultiEvent, setIsMultiEvent] = useState(true);
  const [selectedFont, setSelectedFont] = useState("'Cairo', sans-serif");

  useEffect(() => {
    Promise.all([adminFetch('/customers'), adminFetch('/themes')]).then(
      ([custRes, themeRes]) => {
        if (custRes.success && custRes.data.customers?.length > 0) {
          setCustomers(custRes.data.customers);
          setCustomerId(custRes.data.customers[0].id);
        }
        if (themeRes.success && themeRes.data?.length > 0) {
          setThemes(themeRes.data);
          setThemeId(themeRes.data[0].id);
        }
        setLoading(false);
      }
    );
  }, []);

  const handlePackageSelect = (pkgId: string) => {
    setSelectedPackage(pkgId);
    const target = PACKAGES_CONFIG.find((p) => p.id === pkgId);
    if (target) {
      setIsMultiEvent(target.defaultMultiEvent);
    }
  };

  // Auto-fill suggested slug & title from couple names
  const handleCoupleNameChange = (groom: string, bride: string) => {
    setCoupleGroomAr(groom);
    setCoupleBrideAr(bride);
    if (!title && (groom || bride)) {
      setTitle(`دعوة زفاف ${groom} & ${bride} ❤️`);
    }
    if (!slug && groom) {
      const cleanGroom = groom.trim().split(' ')[0] || 'groom';
      const cleanBride = bride ? bride.trim().split(' ')[0] : 'bride';
      setSlug(`${cleanGroom}-${cleanBride}`.toLowerCase().replace(/[^a-z0-9-]/g, ''));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      let resolvedCustomerId = '';

      // If existing customer selected
      if (customerMode === 'existing' && customerId) {
        resolvedCustomerId = customerId;
      } else if (customerMode === 'new' && newCustomerName && newCustomerPhone) {
        // Fast create customer
        const custRes = await adminFetch('/customers', {
          method: 'POST',
          body: JSON.stringify({
            name: newCustomerName,
            phone: newCustomerPhone,
            whatsapp: newCustomerPhone,
            notes: `تم إنشاؤه أثناء إنشاء دعوة ${title}`,
            source: 'website',
          }),
        });
        if (custRes.success && custRes.data?.id) {
          resolvedCustomerId = custRes.data.id;
        }
      }
      // If customerMode === 'quick', leave resolvedCustomerId empty so backend auto-assigns fast guest!

      const res = await adminFetch('/invitations', {
        method: 'POST',
        body: JSON.stringify({
          customerId: resolvedCustomerId || undefined,
          title: title || `دعوة فرح - ${coupleGroomAr || 'العروسين'}`,
          slug: slug.toLowerCase().trim() || `farah-${Date.now().toString().slice(-6)}`,
          type,
          coupleGroomAr: coupleGroomAr || 'العريس',
          coupleBrideAr: coupleBrideAr || 'العروس',
          eventDate: new Date(eventDate).toISOString(),
          themeId: themeId || (themes[0]?.id || 'theme-royal-burgundy'),
          isMultiEvent,
          status: 'draft',
          themeConfig: {
            selectedPackage,
            fontFamily: selectedFont,
          },
        }),
      });

      if (res.success && res.data?.id) {
        router.push(`/admin/invitations/${res.data.id}/builder`);
      } else {
        setErrorMsg(res.message || 'فشل إنشاء الدعوة');
      }
    } catch (e) {
      setErrorMsg('حدث خطأ في الاتصال بالخادم');
    } finally {
      setSubmitting(false);
    }
  };

  const currentPkg = PACKAGES_CONFIG.find((p) => p.id === selectedPackage) || PACKAGES_CONFIG[1];

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-right font-cairo">
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
          <h1 className="text-2xl font-black text-stone-900">إنشاء وتجهيز دعوة جديدة 🪄</h1>
          <p className="text-xs text-stone-500">
            حدد باقة العميل وأدخل البيانات الأساسية، وسيتم فتح المحرر المرئي التفاعلي لضبط كافة التفاصيل
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs p-6 sm:p-8 space-y-8">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* 1. Package Selection Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-stone-900 block flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#720925]" />
              <span>١. حدد باقة الدعوة المطلوبة للعميل: *</span>
            </label>
            <span className="text-[11px] font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              الباقة المحددة: {currentPkg.name} ({currentPkg.price})
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
          {/* 2. Customer Assignment (Optional & Fast) */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-stone-900 block flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#720925]" />
                <span>٢. ربط الدعوة بالعميل (اختياري لسرعة الإنجاز):</span>
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
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* New Customer Inline Fields */}
            {customerMode === 'new' && (
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 block">اسم العميل:</label>
                  <input
                    type="text"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="مثال: أحمد محمود"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-700 block">رقم هاتف / واتساب:</label>
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

          {/* 3. Couple Names */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <label className="text-xs font-black text-stone-900 block flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#720925]" />
              <span>٣. بيانات العروسين وعنوان الدعوة: *</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">اسم العريس (عربي): *</label>
                <input
                  type="text"
                  required
                  value={coupleGroomAr}
                  onChange={(e) => handleCoupleNameChange(e.target.value, coupleBrideAr)}
                  placeholder="أحمد محمود"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">اسم العروسة (عربي): *</label>
                <input
                  type="text"
                  required
                  value={coupleBrideAr}
                  onChange={(e) => handleCoupleNameChange(coupleGroomAr, e.target.value)}
                  placeholder="سارة إبراهيم"
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
                placeholder="مثال: دعوة زفاف أحمد وسارة ❤️"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">
                الرابط المختصر الفريد (Slug بالإنجليزية والأرقام): *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-mono">
                  /invitation/{type}/
                </span>
                <input
                  type="text"
                  required
                  pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                  minLength={3}
                  maxLength={60}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="ahmed-sara"
                  className="w-full pl-44 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs font-mono text-left dir-ltr"
                />
              </div>
              {slug && slug.length < 3 && (
                <span className="text-[10px] text-amber-700 block">⚠️ الرابط يجب أن يكون 3 أحرف على الأقل</span>
              )}
              {['admin', 'api', 'auth', 'login', 'preview', 'settings', 'static', 'storage', 'health', 'media'].includes(slug) && (
                <span className="text-[10px] text-rose-700 font-bold block">❌ هذا الاسم محجوز لصفحات النظام، يرجى اختيار اسم آخر</span>
              )}
            </div>
          </div>

          {/* 4. Type & Theme & Date */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">نوع الدعوة:</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white"
                >
                  <option value="wedding">زفاف وفرح (Wedding)</option>
                  <option value="engagement">خطوبة (Engagement)</option>
                  <option value="henna">ليلة حنة (Henna)</option>
                  <option value="katb_ketab">كتب كتاب (Katb Ketab)</option>
                </select>
              </div>

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
                  تفعيل رحلة الفرح المتعددة (Multi-Event Tabs)
                </span>
                <span className="text-[11px] text-amber-800">
                  {selectedPackage === 'basic'
                    ? '⚠️ ملحوظة: باقة المناسبة الواحدة (50 ج.م) لا تدعم تبويبات متعددة، ويفضل تركها غير مفعلة.'
                    : 'يتيح إضافة الخطوبة والحنة وكتب الكتاب والفرح في نفس الدعوة برابط موحد'}
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
              {submitting ? 'جاري تجهيز الدعوة والمحرر...' : 'إنشاء الدعوة والانتقال إلى المحرر المرئي التفاعلي 🪄'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
