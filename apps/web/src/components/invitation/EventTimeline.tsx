'use client';

import React from 'react';
import { InvitationEventDTO, EVENT_TYPE_LABELS, getGoogleMapsDirectionsUrl } from '@farahna/shared';
import { formatArabicDate } from '@/lib/date';
import { Calendar, Clock, MapPin, Navigation, Sparkles } from 'lucide-react';
import { AddToCalendar } from './AddToCalendar';

interface EventTimelineProps {
  invitationId?: string;
  events: InvitationEventDTO[];
  primaryColor?: string;
  coupleNames?: string;
  isPreview?: boolean;
}

export function EventTimeline({
  invitationId,
  events,
  primaryColor = '#720925',
  coupleNames = 'العروسين',
  isPreview = false,
}: EventTimelineProps) {
  // Filter only visible events (respecting isVisible flag)
  const visibleEvents = (events || [])
    .filter((ev) => ev.isVisible !== false)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (visibleEvents.length <= 1) return null;

  return (
    <section className={`mx-auto text-right ${isPreview ? 'py-4 px-2 max-w-full space-y-4' : 'py-12 px-4 max-w-4xl space-y-8'}`}>
      <div className="text-center space-y-1.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          مواعيد الفرح
        </span>
        <h2 className={`font-black text-stone-900 font-cairo ${isPreview ? 'text-lg min-[360px]:text-xl' : 'text-2xl sm:text-3xl'}`}>
          خطة مواعيد وأيام المناسبات كاملة
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          جدول المواعيد لجميع أيام وليالي الاحتفال بالترتيب الزمني
        </p>
      </div>

      <div className={`relative ${isPreview ? 'space-y-4 pr-6' : 'space-y-6 sm:space-y-8 pr-7 sm:pr-10'}`}>
        {/* Continuous luxury golden gradient timeline line */}
        <div
          className="absolute top-4 bottom-4 w-0.5 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-300 rounded-full"
          style={{ right: isPreview ? '8px' : '12px' }}
        />

        {visibleEvents.map((ev, idx) => {
          const labelInfo = EVENT_TYPE_LABELS[ev.type] || { icon: '🎉', ar: ev.titleAr };
          const override = ev.themeOverride as Record<string, any> | undefined;
          const eventPrimary = override?.primaryColor || primaryColor;
          const eventBg = override?.backgroundColor || '#FFFFFF';
          const eventText = override?.textColor || '#1c1917';

          const hasLocation =
            Boolean(ev.latitude && ev.longitude) ||
            Boolean(ev.googleMapsUrl?.trim()) ||
            Boolean(ev.venueNameAr?.trim()) ||
            Boolean(ev.addressAr?.trim());

          const directionsUrl = getGoogleMapsDirectionsUrl({
            latitude: ev.latitude,
            longitude: ev.longitude,
            googleMapsUrl: ev.googleMapsUrl,
            venueName: ev.venueNameAr,
            address: ev.addressAr,
          });

          return (
            <div key={ev.id} className="relative group">
              {/* Circle Step Marker centered perfectly on the vertical line */}
              <div
                className="absolute top-5 rounded-full border-2 border-white shadow-md flex items-center justify-center z-10"
                style={{
                  backgroundColor: eventPrimary,
                  width: isPreview ? '18px' : '22px',
                  height: isPreview ? '18px' : '22px',
                  right: isPreview ? '8px' : '12px',
                  transform: 'translate(50%, -50%)',
                }}
              >
                <div
                  className="rounded-full bg-amber-300"
                  style={{
                    width: isPreview ? '6px' : '7px',
                    height: isPreview ? '6px' : '7px',
                  }}
                />
              </div>

              {/* Event Content Card */}
              <div
                className={`rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all ${
                  isPreview ? 'p-3.5 space-y-3' : 'p-4 sm:p-6 space-y-4'
                }`}
                style={{
                  backgroundColor: eventBg,
                  color: eventText,
                  borderColor: override?.primaryColor ? `${override.primaryColor}60` : undefined,
                }}
              >
                {/* Header: Title + Day & Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl shrink-0">{labelInfo.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3
                          className={`${
                            isPreview ? 'text-sm min-[360px]:text-base' : 'text-base sm:text-xl'
                          } font-black font-cairo truncate`}
                          style={{ color: override?.primaryColor || undefined }}
                        >
                          {ev.titleAr}
                        </h3>
                        {override && (
                          <span
                            className="text-[9px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap"
                            style={{
                              backgroundColor: `${override.primaryColor}15`,
                              color: override.primaryColor,
                              borderColor: `${override.primaryColor}40`,
                            }}
                          >
                            ✨ ثيم خاص
                          </span>
                        )}
                      </div>
                      {ev.subtitleAr && (
                        <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{ev.subtitleAr}</p>
                      )}
                    </div>
                  </div>

                  <span
                    suppressHydrationWarning
                    className="text-[11px] sm:text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full self-start sm:self-auto shadow-2xs whitespace-nowrap"
                  >
                    {formatArabicDate(ev.date) || 'الموعد قريباً'}
                  </span>
                </div>

                {/* Henna Special Notice if applicable */}
                {ev.isHennaFemaleOnly && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                    <span>🌸</span>
                    <span>حفل الحناء مخصص للسيدات فقط - نرجو عدم اصطحاب الأطفال حرصاً على الخصوصية</span>
                  </div>
                )}

                {/* Venue & Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-700">
                  <div className="flex items-center gap-2 min-w-0">
                    <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                    <span className="font-semibold text-xs leading-normal">
                      {ev.startTime
                        ? `من ${ev.startTime} ${ev.endTime ? `حتى ${ev.endTime}` : ''}`
                        : 'التوقيت سيحدد لاحقاً'}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 min-w-0">
                    <MapPin className="w-4 h-4 text-[#720925] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="font-bold text-stone-800 block truncate">{ev.venueNameAr || 'قاعة الاحتفال'}</span>
                      {ev.addressAr && (
                        <span className="text-[11px] text-stone-500 block truncate">{ev.addressAr}</span>
                      )}
                    </div>
                  </div>
                </div>

                {ev.descriptionAr && (
                  <p className="text-xs text-stone-600 leading-relaxed pt-1">
                    {ev.descriptionAr}
                  </p>
                )}

                {/* Action Bar: Google Maps Link + Independent Add to Calendar */}
                <div className="pt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100">
                  {hasLocation ? (
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50/80 hover:bg-amber-100/90 px-3 py-1.5 rounded-xl border border-amber-200/80 transition-all shadow-2xs"
                    >
                      <Navigation className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                      <span className="whitespace-nowrap">موقع القاعة على Google Maps 📍</span>
                    </a>
                  ) : (
                    <span />
                  )}

                  {/* Independent Add to Calendar for this specific event */}
                  {ev.date && !isNaN(new Date(ev.date).getTime()) && (
                    <div className="shrink-0">
                      <AddToCalendar
                        invitationId={invitationId}
                        eventTitle={`${ev.titleAr} - ${coupleNames}`}
                        eventDate={ev.date}
                        startTime={ev.startTime}
                        endTime={ev.endTime}
                        venueName={ev.venueNameAr}
                        address={ev.addressAr}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
