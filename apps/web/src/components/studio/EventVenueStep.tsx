'use client';

import React from 'react';
import { Calendar, MapPin, Check, AlertCircle, AlertTriangle, ExternalLink, Sparkles } from 'lucide-react';
import { validateMapUrl, isDateInPast } from '@/lib/validation';
import { JourneyEvent } from './studioConstants';

interface EventVenueStepProps {
  eventDate: string;
  venueNameAr: string;
  addressAr: string;
  googleMapsUrl: string;
  handlePrimaryDateChange: (val: string) => void;
  handlePrimaryVenueChange: (val: string) => void;
  handlePrimaryAddressChange: (val: string) => void;
  handlePrimaryMapUrlChange: (val: string) => void;
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
  handlePrimaryDateChange,
  handlePrimaryVenueChange,
  handlePrimaryAddressChange,
  handlePrimaryMapUrlChange,
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

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">
              رابط خرائط جوجل (Google Maps Link):
            </label>
            <input
              type="url"
              value={googleMapsUrl}
              onChange={(e) => handlePrimaryMapUrlChange(e.target.value)}
              placeholder="https://maps.google.com/?q=... أو رابط مشاركة خرائط جوجل"
              className={`w-full px-4 py-2.5 rounded-xl border text-xs text-left dir-ltr font-mono bg-white transition-all ${
                validateMapUrl(googleMapsUrl).status === 'invalid'
                  ? 'border-amber-400 ring-2 ring-amber-100 bg-amber-50/20'
                  : 'border-stone-200'
              }`}
            />
            {(() => {
              const mapCheck = validateMapUrl(googleMapsUrl);
              if (mapCheck.status === 'valid_google') {
                return (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl mt-1.5 font-bold">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{mapCheck.message}</span>
                  </div>
                );
              }
              if (mapCheck.status === 'valid_coords') {
                return (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl mt-1.5 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{mapCheck.message}</span>
                  </div>
                );
              }
              if (mapCheck.status === 'valid_url') {
                return (
                  <div className="flex items-center gap-1.5 text-[11px] text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl mt-1.5 font-bold">
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{mapCheck.message}</span>
                  </div>
                );
              }
              if (mapCheck.status === 'invalid') {
                return (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-xl mt-1.5 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{mapCheck.message}</span>
                  </div>
                );
              }
              return (
                <p className="text-[10px] text-stone-400 mt-1">
                  💡 يمكنك وضع رابط خرائط جوجل أو الإحداثيات مباشرة لفتح اتجاهات الملاحة بدقة لضيوفك.
                </p>
              );
            })()}
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
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">📅</span>
                  <span className="text-xs font-black text-amber-950">
                    تعديل تفاصيل: {journeyEvents[activeJourneyEventIndex].titleAr}
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200">
                  <input
                    type="checkbox"
                    checked={journeyEvents[activeJourneyEventIndex].enabled}
                    onChange={(e) => handleToggleEventEnabled(activeJourneyEventIndex, e.target.checked)}
                    className="w-4 h-4 rounded text-[#720925] focus:ring-[#720925]"
                  />
                  <span className="text-xs font-bold text-amber-900">تضمين في الدعوة</span>
                </label>
              </div>

              {journeyEvents[activeJourneyEventIndex].enabled ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* Venue Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 flex items-center justify-between">
                      <span>اسم المكان / القاعة: <span className="text-rose-600">*</span></span>
                      {!journeyEvents[activeJourneyEventIndex].venueNameAr.trim() && (
                        <span className="text-[10px] text-rose-600 font-bold">مطلوب</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={journeyEvents[activeJourneyEventIndex].venueNameAr}
                      onChange={(e) =>
                        updateJourneyEvent(activeJourneyEventIndex, { venueNameAr: e.target.value })
                      }
                      placeholder="مثال: قاعة الحفل الملكية"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white transition-all ${
                        !journeyEvents[activeJourneyEventIndex].venueNameAr.trim() && designValidationError
                          ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                          : 'border-stone-200'
                      }`}
                    />
                    {!journeyEvents[activeJourneyEventIndex].venueNameAr.trim() && designValidationError && (
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
                      {!journeyEvents[activeJourneyEventIndex].date && (
                        <span className="text-[10px] text-rose-600 font-bold">مطلوب</span>
                      )}
                    </label>
                    <input
                      type="date"
                      value={
                        journeyEvents[activeJourneyEventIndex].date
                          ? journeyEvents[activeJourneyEventIndex].date.slice(0, 10)
                          : ''
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        const prevTime = journeyEvents[activeJourneyEventIndex].date?.includes('T')
                          ? journeyEvents[activeJourneyEventIndex].date.split('T')[1]
                          : '19:00';
                        updateJourneyEvent(activeJourneyEventIndex, {
                          date: val ? `${val}T${prevTime}` : '',
                        });
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white text-left font-mono dir-ltr transition-all ${
                        !journeyEvents[activeJourneyEventIndex].date && designValidationError
                          ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                          : 'border-stone-200'
                      }`}
                    />
                    {!journeyEvents[activeJourneyEventIndex].date && designValidationError ? (
                      <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>يرجى تحديد تاريخ المناسبة</span>
                      </p>
                    ) : isDateInPast(journeyEvents[activeJourneyEventIndex].date) ? (
                      <p className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 shrink-0 text-amber-600" />
                        <span>تنبيه: التاريخ المحدد قد مضى، يرجى مراجعة السنة</span>
                      </p>
                    ) : null}
                  </div>

                  {/* Time with Quick Presets */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <label className="text-[11px] font-bold text-stone-700 block">
                        التوقيت والساعة: <span className="text-rose-600">*</span>
                      </label>
                      <div className="flex items-center gap-1">
                        {['06:00 م', '07:00 م', '08:00 م', '09:00 م', '10:00 م'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => updateJourneyEvent(activeJourneyEventIndex, { time: preset })}
                            className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-100/80 hover:bg-amber-200 text-amber-900 font-mono transition-colors cursor-pointer"
                            title={`تحديد ${preset}`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={journeyEvents[activeJourneyEventIndex].time}
                      onChange={(e) =>
                        updateJourneyEvent(activeJourneyEventIndex, { time: e.target.value })
                      }
                      placeholder="08:00 م"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white text-left dir-ltr transition-all ${
                        !journeyEvents[activeJourneyEventIndex].time.trim() && designValidationError
                          ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                          : 'border-stone-200'
                      }`}
                    />
                    {!journeyEvents[activeJourneyEventIndex].time.trim() && designValidationError && (
                      <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>يرجى كتابة التوقيت والساعة</span>
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-700 flex items-center justify-between">
                      <span>العنوان أو الحي: <span className="text-rose-600">*</span></span>
                      {!journeyEvents[activeJourneyEventIndex].addressAr.trim() && (
                        <span className="text-[10px] text-rose-600 font-bold">مطلوب</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={journeyEvents[activeJourneyEventIndex].addressAr}
                      onChange={(e) =>
                        updateJourneyEvent(activeJourneyEventIndex, { addressAr: e.target.value })
                      }
                      placeholder="مثال: فندق فورسيزونز نايل بلازا، القاهرة"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white transition-all ${
                        !journeyEvents[activeJourneyEventIndex].addressAr.trim() && designValidationError
                          ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                          : 'border-stone-200'
                      }`}
                    />
                    {!journeyEvents[activeJourneyEventIndex].addressAr.trim() && designValidationError && (
                      <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>يرجى إدخال العنوان أو الحي لتسهيل وصول الضيوف</span>
                      </p>
                    )}
                  </div>

                  {/* Google Maps URL with Smart Validation Feedback */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-bold text-stone-700 block">
                      رابط خريطة Google Maps (اختياري):
                    </label>
                    <input
                      type="url"
                      value={journeyEvents[activeJourneyEventIndex].googleMapsUrl || ''}
                      onChange={(e) =>
                        updateJourneyEvent(activeJourneyEventIndex, { googleMapsUrl: e.target.value })
                      }
                      placeholder="https://maps.google.com/?q=... أو رابط مشاركة خرائط جوجل"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-white text-left font-mono dir-ltr transition-all ${
                        validateMapUrl(journeyEvents[activeJourneyEventIndex].googleMapsUrl).status === 'invalid'
                          ? 'border-amber-400 ring-2 ring-amber-100 bg-amber-50/20'
                          : 'border-stone-200'
                      }`}
                    />
                    {(() => {
                      const mapCheck = validateMapUrl(journeyEvents[activeJourneyEventIndex].googleMapsUrl);
                      if (mapCheck.status === 'valid_google') {
                        return (
                          <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg mt-1 font-bold">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{mapCheck.message}</span>
                          </div>
                        );
                      }
                      if (mapCheck.status === 'valid_coords') {
                        return (
                          <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg mt-1 font-bold">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{mapCheck.message}</span>
                          </div>
                        );
                      }
                      if (mapCheck.status === 'valid_url') {
                        return (
                          <div className="flex items-center gap-1.5 text-[10px] text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-lg mt-1 font-bold">
                            <ExternalLink className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{mapCheck.message}</span>
                          </div>
                        );
                      }
                      if (mapCheck.status === 'invalid') {
                        return (
                          <div className="flex items-center gap-1.5 text-[10px] text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-1.5 rounded-lg mt-1 font-bold">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{mapCheck.message}</span>
                          </div>
                        );
                      }
                      return (
                        <p className="text-[10px] text-stone-500 mt-1">
                          💡 {mapCheck.message}
                        </p>
                      );
                    })()}
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
