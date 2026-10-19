'use client';

import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Check,
  AlertCircle,
  AlertTriangle,
  ExternalLink,
  Sparkles,
  Loader2,
  Compass,
  Settings2,
  Navigation,
} from 'lucide-react';
import { validateMapUrl, isDateInPast } from '@/lib/validation';
import { resolveMapLocationApi } from '@/lib/api';
import { JourneyEvent } from './studioConstants';

interface EventVenueStepProps {
  eventDate: string;
  venueNameAr: string;
  addressAr: string;
  googleMapsUrl: string;
  primaryLatitude?: number | null;
  primaryLongitude?: number | null;
  primaryOpenStreetMapUrl?: string | null;
  handlePrimaryDateChange: (val: string) => void;
  handlePrimaryVenueChange: (val: string) => void;
  handlePrimaryAddressChange: (val: string) => void;
  handlePrimaryMapUrlChange: (val: string) => void;
  handlePrimaryCoordinatesChange?: (
    lat: number | null,
    lng: number | null,
    osmUrl?: string | null
  ) => void;
  designValidationError: string | null;
  selectedPackage: string;
  journeyEvents: JourneyEvent[];
  activeJourneyEventIndex: number;
  setActiveJourneyEventIndex: (index: number) => void;
  updateJourneyEvent: (index: number, updates: Partial<JourneyEvent>) => void;
  handleToggleEventEnabled: (index: number, checked: boolean) => void;
  setSelectedPackage: (pkgId: string) => void;
  setIsMultiEvent: (val: boolean) => void;
  setSectionsVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export function EventVenueStep({
  eventDate,
  venueNameAr,
  addressAr,
  googleMapsUrl,
  primaryLatitude,
  primaryLongitude,
  primaryOpenStreetMapUrl,
  handlePrimaryDateChange,
  handlePrimaryVenueChange,
  handlePrimaryAddressChange,
  handlePrimaryMapUrlChange,
  handlePrimaryCoordinatesChange,
  designValidationError,
  selectedPackage,
  journeyEvents,
  activeJourneyEventIndex,
  setActiveJourneyEventIndex,
  updateJourneyEvent,
  handleToggleEventEnabled,
  setSelectedPackage,
  setIsMultiEvent,
  setSectionsVisibility,
}: EventVenueStepProps) {
  const isBasic = selectedPackage === 'basic';

  // Primary event location resolution state
  const [resolvingPrimary, setResolvingPrimary] = useState(false);
  const [primaryFeedback, setPrimaryFeedback] = useState<{
    text: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);
  const [showPrimaryAdvanced, setShowPrimaryAdvanced] = useState(false);

  // Sub-event location resolution state
  const [resolvingSubEvent, setResolvingSubEvent] = useState(false);
  const [subEventFeedback, setSubEventFeedback] = useState<{
    text: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);
  const [showSubEventAdvanced, setShowSubEventAdvanced] = useState(false);

  const activeSubEvent = journeyEvents[activeJourneyEventIndex];

  // Resolve primary wedding venue map location automatically
  const handleAutoResolvePrimary = async () => {
    if (!googleMapsUrl && !venueNameAr && !addressAr) {
      setPrimaryFeedback({
        text: 'يرجى وضع رابط خرائط جوجل أو اسم القاعة أولاً لتوحيد الخريطة',
        type: 'info',
      });
      setTimeout(() => setPrimaryFeedback(null), 4000);
      return;
    }

    setResolvingPrimary(true);
    setPrimaryFeedback(null);

    try {
      const res = await resolveMapLocationApi({
        urlOrText: googleMapsUrl,
        venueName: venueNameAr,
        address: addressAr,
      });

      if (res?.success && res.data?.resolved && res.data.latitude && res.data.longitude) {
        handlePrimaryCoordinatesChange?.(
          res.data.latitude,
          res.data.longitude,
          res.data.openStreetMapUrl
        );

        if (res.data.googleMapsUrl && res.data.googleMapsUrl !== googleMapsUrl) {
          handlePrimaryMapUrlChange(res.data.googleMapsUrl);
        }

        setPrimaryFeedback({
          text: `تم توحيد الخريطة بنجاح على الإحداثيات (${res.data.formattedCoords || `${res.data.latitude.toFixed(5)}, ${res.data.longitude.toFixed(5)}`})! خريطة OpenStreetMap التفاعلية وزر Google Maps موحدان بنسبة 100% بدون أي تعب 📍`,
          type: 'success',
        });
        setTimeout(() => setPrimaryFeedback(null), 8000);
      } else {
        setPrimaryFeedback({
          text: 'لم نتمكن من التقاط الإحداثيات تلقائياً من الرابط، يمكنك إدخال الإحداثيات مباشرة أو فتح "الإعدادات المتقدمة" لتحديدها بدقة.',
          type: 'info',
        });
        setTimeout(() => setPrimaryFeedback(null), 6000);
      }
    } catch (err) {
      setPrimaryFeedback({
        text: 'حدث خطأ أثناء فحص الرابط، يمكنك إدخال الإحداثيات أو الرابط يدوياً.',
        type: 'error',
      });
      setTimeout(() => setPrimaryFeedback(null), 5000);
    } finally {
      setResolvingPrimary(false);
    }
  };

  // Resolve active journey sub-event map location
  const handleAutoResolveSubEvent = async () => {
    if (!activeSubEvent) return;

    if (!activeSubEvent.googleMapsUrl && !activeSubEvent.venueNameAr && !activeSubEvent.addressAr) {
      setSubEventFeedback({
        text: 'يرجى وضع رابط خرائط جوجل أو اسم المكان لهذه المناسبة أولاً',
        type: 'info',
      });
      setTimeout(() => setSubEventFeedback(null), 4000);
      return;
    }

    setResolvingSubEvent(true);
    setSubEventFeedback(null);

    try {
      const res = await resolveMapLocationApi({
        urlOrText: activeSubEvent.googleMapsUrl,
        venueName: activeSubEvent.venueNameAr,
        address: activeSubEvent.addressAr,
      });

      if (res?.success && res.data?.resolved && res.data.latitude && res.data.longitude) {
        updateJourneyEvent(activeJourneyEventIndex, {
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          openStreetMapUrl: res.data.openStreetMapUrl,
          ...(res.data.googleMapsUrl ? { googleMapsUrl: res.data.googleMapsUrl } : {}),
        });

        setSubEventFeedback({
          text: `تم توحيد موقع (${activeSubEvent.titleAr}) بنجاح! الإحداثيات: (${res.data.formattedCoords}) 📍`,
          type: 'success',
        });
        setTimeout(() => setSubEventFeedback(null), 8000);
      } else {
        setSubEventFeedback({
          text: 'يمكنك وضع رابط مباشر من خرائط جوجل أو كتابة الإحداثيات يدوياً لتوحيد الموقع بدقة.',
          type: 'info',
        });
        setTimeout(() => setSubEventFeedback(null), 6000);
      }
    } catch (err) {
      setSubEventFeedback({
        text: 'تعذر توحيد الرابط تلقائياً، يرجى التحقق من الرابط والمحاولة مجدداً.',
        type: 'error',
      });
      setTimeout(() => setSubEventFeedback(null), 5000);
    } finally {
      setResolvingSubEvent(false);
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-6 shadow-2xs text-right">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-sm font-black text-stone-900 flex items-center gap-2">
          <Calendar className="w-4.5 h-4.5 text-[#720925]" />
          <span>٦. تفاصيل ومواعيد المناسبة وموقع القاعة على الخريطة:</span>
        </label>
        <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
          بيانات دقيقة لوصول المعازيم بسهولة 📍
        </span>
      </div>

      {/* Primary Wedding Details */}
      <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-4">
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
            <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
              <span>تاريخ وتوقيت المناسبة: <span className="text-rose-600">*</span></span>
              {!eventDate && (
                <span className="text-[10px] text-rose-600 font-bold">مطلوب</span>
              )}
            </label>
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => handlePrimaryDateChange(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border text-xs text-left dir-ltr bg-white transition-all ${
                !eventDate && designValidationError
                  ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                  : 'border-stone-200'
              }`}
            />
            {!eventDate && designValidationError ? (
              <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>يرجى تحديد تاريخ وتوقيت الحفل</span>
              </p>
            ) : isDateInPast(eventDate) ? (
              <p className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 shrink-0 text-amber-600" />
                <span>تنبيه: التاريخ المحدد قد مضى، يرجى مراجعة السنة</span>
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
              <span>اسم القاعة / الفندق / المكان: <span className="text-rose-600">*</span></span>
              {!venueNameAr.trim() && (
                <span className="text-[10px] text-rose-600 font-bold">مطلوب</span>
              )}
            </label>
            <input
              type="text"
              value={venueNameAr}
              onChange={(e) => handlePrimaryVenueChange(e.target.value)}
              placeholder="مثال: قاعة الماسة - فندق فورسيزونز"
              className={`w-full px-4 py-2.5 rounded-xl border text-xs bg-white transition-all ${
                !venueNameAr.trim() && designValidationError
                  ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                  : 'border-stone-200'
              }`}
            />
            {!venueNameAr.trim() && designValidationError && (
              <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>يرجى كتابة اسم قاعة أو مكان الحفل</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
              <span>العنوان بالتفصيل: <span className="text-rose-600">*</span></span>
              {!addressAr.trim() && (
                <span className="text-[10px] text-rose-600 font-bold">مطلوب</span>
              )}
            </label>
            <input
              type="text"
              value={addressAr}
              onChange={(e) => handlePrimaryAddressChange(e.target.value)}
              placeholder="مثال: كورنيش النيل، جاردن سيتي، القاهرة"
              className={`w-full px-4 py-2.5 rounded-xl border text-xs bg-white transition-all ${
                !addressAr.trim() && designValidationError
                  ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                  : 'border-stone-200'
              }`}
            />
            {!addressAr.trim() && designValidationError && (
              <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>يرجى إدخال العنوان بالتفصيل</span>
              </p>
            )}
          </div>

          {/* Unified Map Input & Instant Resolver */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-1">
              <label className="text-xs font-bold text-stone-700 block">
                رابط خريطة Google Maps أو الإحداثيات:
              </label>
              <button
                type="button"
                onClick={handleAutoResolvePrimary}
                disabled={resolvingPrimary}
                className="text-[11px] font-bold text-[#720925] hover:text-rose-800 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                title="فك الرابط وتوحيد موقع OpenStreetMap مع Google Maps تلقائياً"
              >
                {resolvingPrimary ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>جاري التوحيد...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-3.5 h-3.5 text-amber-600" />
                    <span>توحيد وضبط الخريطة 📍</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type="url"
                value={googleMapsUrl}
                onChange={(e) => handlePrimaryMapUrlChange(e.target.value)}
                onBlur={() => {
                  if (googleMapsUrl.trim().length > 10 && !primaryLatitude) {
                    handleAutoResolvePrimary();
                  }
                }}
                placeholder="https://maps.google.com/?q=... أو رابط مشاركة خرائط جوجل أو الإحداثيات"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs text-left dir-ltr font-mono bg-white transition-all ${
                  validateMapUrl(googleMapsUrl).status === 'invalid'
                    ? 'border-amber-400 ring-2 ring-amber-100 bg-amber-50/20'
                    : 'border-stone-200'
                }`}
              />
            </div>

            {/* Resolution feedback notification */}
            {primaryFeedback && (
              <div
                className={`flex items-start gap-1.5 text-[11px] p-2.5 rounded-xl font-bold leading-relaxed animate-fade-in ${
                  primaryFeedback.type === 'success'
                    ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                    : primaryFeedback.type === 'error'
                    ? 'text-rose-800 bg-rose-50 border border-rose-200'
                    : 'text-amber-800 bg-amber-50 border border-amber-200'
                }`}
              >
                {primaryFeedback.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <span>{primaryFeedback.text}</span>
              </div>
            )}

            {/* Smart Unified Map Status Badge */}
            {primaryLatitude && primaryLongitude ? (
              <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] text-emerald-800 bg-emerald-50/90 border border-emerald-200 px-3 py-1.5 rounded-xl mt-1.5 font-bold">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    الخريطة موحدة 100% بين OpenStreetMap و Google Maps ({primaryLatitude.toFixed(4)},{' '}
                    {primaryLongitude.toFixed(4)})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrimaryAdvanced((prev) => !prev)}
                  className="text-[10px] text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
                >
                  {showPrimaryAdvanced ? 'إخفاء الإعدادات المتقدمة' : 'الإعدادات المتقدمة ⚙️'}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1">
                <span>
                  💡 يمكنك وضع رابط مشاركة جوجل مابس، وسيقوم النظام بتوحيد نقطة الخريطة المفتوحة (OpenStreetMap) تلقائياً بدون تعب.
                </span>
                <button
                  type="button"
                  onClick={() => setShowPrimaryAdvanced((prev) => !prev)}
                  className="text-stone-600 hover:text-stone-900 flex items-center gap-1 shrink-0 font-bold cursor-pointer"
                >
                  <Settings2 className="w-3 h-3" />
                  <span>{showPrimaryAdvanced ? 'إخفاء' : 'إعدادات متقدمة'}</span>
                </button>
              </div>
            )}

            {/* Advanced Map Settings (Manual Coordinates & OpenStreetMap Link) */}
            {showPrimaryAdvanced && (
              <div className="mt-3 p-3.5 rounded-2xl bg-white border border-stone-300/80 shadow-xs space-y-3 animate-fade-in text-right">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-stone-800 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-amber-600" />
                    <span>إعدادات الإحداثيات والخرائط المفتوحة (OpenStreetMap):</span>
                  </span>
                  <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                    اختياري ودقيق
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono" dir="ltr">
                  <div>
                    <label className="text-[10px] font-bold text-stone-600 block text-right font-cairo">
                      خط العرض (Latitude):
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={primaryLatitude ?? ''}
                      onChange={(e) => {
                        const val = e.target.value ? parseFloat(e.target.value) : null;
                        handlePrimaryCoordinatesChange?.(val, primaryLongitude ?? null);
                      }}
                      placeholder="30.0571"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-stone-600 block text-right font-cairo">
                      خط الطول (Longitude):
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={primaryLongitude ?? ''}
                      onChange={(e) => {
                        const val = e.target.value ? parseFloat(e.target.value) : null;
                        handlePrimaryCoordinatesChange?.(primaryLatitude ?? null, val);
                      }}
                      placeholder="31.2250"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs bg-stone-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-600 block">
                    رابط الخريطة المفتوحة المباشر (OpenStreetMap URL):
                  </label>
                  <input
                    type="url"
                    value={primaryOpenStreetMapUrl || ''}
                    onChange={(e) =>
                      handlePrimaryCoordinatesChange?.(
                        primaryLatitude ?? null,
                        primaryLongitude ?? null,
                        e.target.value
                      )
                    }
                    placeholder="https://www.openstreetmap.org/?mlat=...#map=..."
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-left dir-ltr font-mono bg-stone-50/50"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Journey Events Multi-Tabs Manager */}
      {!isBasic ? (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="text-xs sm:text-sm font-black text-amber-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>جدول ومواعيد باقي مناسبات رحلة الفرح (تظهر في تبويبات الدعوة):</span>
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5">
                يمكنك تفعيل أو تعديل مواعيد وقاعات كل مناسبة من مناسباتكم وتوحيد خرائطها بشكل منفصل:
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
                  <span
                    className={`w-2 h-2 rounded-full ${
                      jev.enabled ? 'bg-emerald-500' : 'bg-stone-300'
                    }`}
                  />
                </div>
                <span className="text-[10px] text-stone-500 font-mono" dir="ltr">
                  {jev.time}
                </span>
              </button>
            ))}
          </div>

          {/* Active Sub-Event Editor Card */}
          {activeSubEvent && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">📅</span>
                  <span className="text-xs font-black text-amber-950">
                    تعديل تفاصيل: {activeSubEvent.titleAr}
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200">
                  <input
                    type="checkbox"
                    checked={activeSubEvent.enabled}
                    onChange={(e) =>
                      handleToggleEventEnabled(activeJourneyEventIndex, e.target.checked)
                    }
                    className="w-4 h-4 rounded text-[#720925] focus:ring-[#720925]"
                  />
                  <span className="text-xs font-bold text-amber-900">تضمين في الدعوة</span>
                </label>
              </div>

              {activeSubEvent.enabled ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* Venue Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 flex items-center justify-between">
                      <span>اسم المكان / القاعة: <span className="text-rose-600">*</span></span>
                      {!activeSubEvent.venueNameAr.trim() && (
                        <span className="text-[10px] text-rose-600 font-bold">مطلوب</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={activeSubEvent.venueNameAr}
                      onChange={(e) =>
                        updateJourneyEvent(activeJourneyEventIndex, {
                          venueNameAr: e.target.value,
                        })
                      }
                      placeholder="مثال: قاعة الحفل الملكية"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white transition-all ${
                        !activeSubEvent.venueNameAr.trim() && designValidationError
                          ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                          : 'border-stone-200'
                      }`}
                    />
                    {!activeSubEvent.venueNameAr.trim() && designValidationError && (
                      <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>يرجى كتابة اسم المكان أو القاعة لهذه المناسبة</span>
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 flex items-center justify-between">
                      <span>تاريخ المناسبة: <span className="text-rose-600">*</span></span>
                      {!activeSubEvent.date && (
                        <span className="text-[10px] text-rose-600 font-bold">مطلوب</span>
                      )}
                    </label>
                    <input
                      type="date"
                      value={
                        activeSubEvent.date ? activeSubEvent.date.slice(0, 10) : ''
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        const prevTime = activeSubEvent.date?.includes('T')
                          ? activeSubEvent.date.split('T')[1]
                          : '19:00';
                        updateJourneyEvent(activeJourneyEventIndex, {
                          date: val ? `${val}T${prevTime}` : '',
                        });
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white text-left font-mono dir-ltr transition-all ${
                        !activeSubEvent.date && designValidationError
                          ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                          : 'border-stone-200'
                      }`}
                    />
                    {!activeSubEvent.date && designValidationError ? (
                      <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>يرجى تحديد تاريخ المناسبة</span>
                      </p>
                    ) : isDateInPast(activeSubEvent.date) ? (
                      <p className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 shrink-0 text-amber-600" />
                        <span>تنبيه: التاريخ المحدد قد مضى، يرجى مراجعة السنة</span>
                      </p>
                    ) : null}
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 flex items-center justify-between">
                      <span>العنوان أو الحي: <span className="text-rose-600">*</span></span>
                      {!activeSubEvent.addressAr.trim() && (
                        <span className="text-[10px] text-rose-600 font-bold">مطلوب</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={activeSubEvent.addressAr}
                      onChange={(e) =>
                        updateJourneyEvent(activeJourneyEventIndex, { addressAr: e.target.value })
                      }
                      placeholder="مثال: فندق فورسيزونز نايل بلازا، القاهرة"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white transition-all ${
                        !activeSubEvent.addressAr.trim() && designValidationError
                          ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                          : 'border-stone-200'
                      }`}
                    />
                    {!activeSubEvent.addressAr.trim() && designValidationError && (
                      <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>يرجى إدخال العنوان أو الحي لتسهيل وصول الضيوف</span>
                      </p>
                    )}
                  </div>

                  {/* Sub-event Map URL & Auto-Resolver */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <label className="text-[11px] font-bold text-stone-700 block">
                        رابط خريطة Google Maps (لهذه المناسبة):
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoResolveSubEvent}
                        disabled={resolvingSubEvent}
                        className="text-[10px] font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                        title="توحيد موقع هذه المناسبة تلقائياً"
                      >
                        {resolvingSubEvent ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>جاري التوحيد...</span>
                          </>
                        ) : (
                          <>
                            <Compass className="w-3 h-3 text-amber-700" />
                            <span>توحيد الخريطة 📍</span>
                          </>
                        )}
                      </button>
                    </div>

                    <input
                      type="url"
                      value={activeSubEvent.googleMapsUrl || ''}
                      onChange={(e) =>
                        updateJourneyEvent(activeJourneyEventIndex, {
                          googleMapsUrl: e.target.value,
                        })
                      }
                      placeholder="https://maps.google.com/?q=... أو رابط مشاركة خرائط جوجل"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs bg-white text-left font-mono dir-ltr transition-all"
                    />

                    {subEventFeedback && (
                      <div className="text-[10px] p-2 rounded-lg font-bold bg-amber-100 text-amber-950 border border-amber-300">
                        {subEventFeedback.text}
                      </div>
                    )}

                    {activeSubEvent.latitude && activeSubEvent.longitude && (
                      <div className="flex items-center justify-between text-[10px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md font-bold mt-1">
                        <span>
                          موحد على النقطة: ({activeSubEvent.latitude.toFixed(4)},{' '}
                          {activeSubEvent.longitude.toFixed(4)})
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowSubEventAdvanced((prev) => !prev)}
                          className="text-emerald-700 underline cursor-pointer"
                        >
                          {showSubEventAdvanced ? 'إخفاء' : 'إعدادات متقدمة'}
                        </button>
                      </div>
                    )}

                    {showSubEventAdvanced && (
                      <div className="mt-2 p-2.5 rounded-xl bg-white border border-amber-200 space-y-2 text-right">
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono" dir="ltr">
                          <input
                            type="number"
                            step="any"
                            value={activeSubEvent.latitude ?? ''}
                            onChange={(e) =>
                              updateJourneyEvent(activeJourneyEventIndex, {
                                latitude: e.target.value ? parseFloat(e.target.value) : null,
                              })
                            }
                            placeholder="Lat"
                            className="px-2 py-1 rounded border border-stone-200 text-xs"
                          />
                          <input
                            type="number"
                            step="any"
                            value={activeSubEvent.longitude ?? ''}
                            onChange={(e) =>
                              updateJourneyEvent(activeJourneyEventIndex, {
                                longitude: e.target.value ? parseFloat(e.target.value) : null,
                              })
                            }
                            placeholder="Lng"
                            className="px-2 py-1 rounded border border-stone-200 text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-stone-100/80 border border-stone-200 text-stone-500 text-xs text-center font-medium">
                  هذه المناسبة غير مفعلة حالياً ولن تظهر في كارت وموقع الدعوة. قم بتحديد "تضمين في الدعوة" بالأعلى لتفعيلها.
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
  );
}
