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
}

export function EventTimeline({
  invitationId,
  events,
  primaryColor = '#720925',
  coupleNames = 'العروسين',
}: EventTimelineProps) {
  // Filter only visible events (respecting isVisible flag)
  const visibleEvents = (events || [])
    .filter((ev) => ev.isVisible !== false)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (visibleEvents.length <= 1) return null;

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto space-y-8 text-right">
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          مواعيد الفرح
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-cairo">
          خطة مواعيد وأيام المناسبات كاملة
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          جدول المواعيد لجميع أيام وليالي الاحتفال بالترتيب الزمني
        </p>
      </div>

      <div className="relative border-r-2 border-amber-300 mr-4 sm:mr-8 space-y-8 pr-6 sm:pr-10">
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
              {/* Circle Step Marker on the vertical line */}
              <div
                className="absolute -right-[31px] sm:-right-[47px] top-2 w-6 h-6 rounded-full border-4 border-white shadow-md flex items-center justify-center text-xs"
                style={{ backgroundColor: eventPrimary }}
              >
                <div className="w-2 h-2 rounded-full bg-amber-300" />
              </div>

              {/* Event Content Card */}
              <div
                className="rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-sm hover:shadow-lg transition-all space-y-4"
                style={{
                  backgroundColor: eventBg,
                  color: eventText,
                  borderColor: override?.primaryColor ? `${override.primaryColor}60` : undefined,
                }}
              >
                {/* Header: Title + Day & Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{labelInfo.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className="text-lg sm:text-xl font-black font-cairo"
                          style={{ color: override?.primaryColor || undefined }}
                        >
                          {ev.titleAr}
                        </h3>
                        {override && (
                          <span
                            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
                            style={{
                              backgroundColor: `${override.primaryColor}15`,
                              color: override.primaryColor,
                              borderColor: `${override.primaryColor}40`,
                            }}
                          >
                            ✨ ثيم مخصص خاص
                          </span>
                        )}
                      </div>
                      {ev.subtitleAr && (
                        <p className="text-xs text-stone-500 mt-0.5">{ev.subtitleAr}</p>
                      )}
                    </div>
                  </div>

                  <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full self-start sm:self-auto shadow-xs">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                    <span className="font-semibold">
                      {ev.startTime
                        ? `من ${ev.startTime} ${ev.endTime ? `حتى ${ev.endTime}` : ''}`
                        : 'التوقيت سيحدد لاحقاً'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#720925] shrink-0" />
                    <div>
                      <span className="font-bold text-stone-800">{ev.venueNameAr || 'قاعة الاحتفال'}</span>
                      {ev.addressAr && (
                        <span className="text-[11px] text-stone-500 block">{ev.addressAr}</span>
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
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100">
                  {hasLocation ? (
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>عرض موقع القاعة على Google Maps</span>
                    </a>
                  ) : (
                    <span />
                  )}

                  {/* Independent Add to Calendar for this specific event */}
                  {ev.date && !isNaN(new Date(ev.date).getTime()) && (
                    <AddToCalendar
                      invitationId={invitationId}
                      eventTitle={`${ev.titleAr} - ${coupleNames}`}
                      eventDate={ev.date}
                      startTime={ev.startTime}
                      endTime={ev.endTime}
                      venueName={ev.venueNameAr}
                      address={ev.addressAr}
                    />
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
