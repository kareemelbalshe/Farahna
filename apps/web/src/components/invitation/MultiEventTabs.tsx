'use client';

import React, { useState } from 'react';
import { InvitationEventDTO, EVENT_TYPE_LABELS } from '@farahna/shared';
import { Calendar, Clock, MapPin, Navigation, Sparkles } from 'lucide-react';
import { formatArabicDate } from '@/lib/date';
import { AddToCalendar } from './AddToCalendar';
import { FarahnaMap } from '../map/FarahnaMap';

interface MultiEventTabsProps {
  invitationId?: string;
  events: InvitationEventDTO[];
  coupleNames: string;
  primaryColor?: string;
  secondaryColor?: string;
  initialEventId?: string;
}

export function MultiEventTabs({
  invitationId,
  events,
  coupleNames,
  primaryColor = '#720925',
  secondaryColor = '#D4AF37',
  initialEventId,
}: MultiEventTabsProps) {
  // Filter only visible events (respecting isVisible flag)
  const visibleEvents = (events || []).filter((ev) => ev.isVisible !== false);

  // If 0 or 1 event is visible, automatically hide multi-event tabs navigation
  if (visibleEvents.length <= 1) {
    return null;
  }

  // Active tab state
  const defaultId = initialEventId || visibleEvents[0]?.id;
  const [selectedEventId, setSelectedEventId] = useState<string>(defaultId);
  const activeEvent =
    visibleEvents.find((e) => e.id === selectedEventId) || visibleEvents[0];

  return (
    <section className="py-10 px-4 max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          مواعيد فرحتنا
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-cairo">
          جدول مناسبات رحلة الفرح
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          اضغط على أي مناسبة لمعرفة تفاصيل موعدها وموقعها المخصص
        </p>
      </div>

      {/* Navigation Tabs (Only Visible Events) */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {visibleEvents.map((ev) => {
          const isSelected = ev.id === activeEvent.id;
          const labelInfo = EVENT_TYPE_LABELS[ev.type] || { icon: '✨', ar: ev.titleAr };
          const override = ev.themeOverride as Record<string, any> | undefined;

          return (
            <button
              key={ev.id}
              type="button"
              onClick={() => setSelectedEventId(ev.id)}
              className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 active:scale-95 shadow-xs cursor-pointer ${
                isSelected
                  ? 'text-white shadow-lg shadow-rose-950/20 scale-105'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
              style={{
                backgroundColor: isSelected ? (override?.primaryColor || primaryColor) : undefined,
                borderColor: override ? override.primaryColor : undefined,
              }}
            >
              <span>{labelInfo.icon}</span>
              <span>{ev.titleAr}</span>
              {override && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  ثيم خاص
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Event Card Display */}
      <div className="transition-all duration-300">
        <SingleEventCard
          invitationId={invitationId}
          event={activeEvent}
          coupleNames={coupleNames}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      </div>
    </section>
  );
}

function SingleEventCard({
  invitationId,
  event,
  coupleNames,
  primaryColor,
  secondaryColor = '#D4AF37',
}: {
  invitationId?: string;
  event: InvitationEventDTO;
  coupleNames: string;
  primaryColor: string;
  secondaryColor?: string;
}) {
  const labelInfo = EVENT_TYPE_LABELS[event.type] || { icon: '👑', ar: event.titleAr };

  // Support event-level themeOverride
  const override = event.themeOverride as Record<string, any> | undefined;
  const eventPrimaryColor = override?.primaryColor || primaryColor;
  const eventCardBg = override?.backgroundColor || '#FFFFFF';
  const eventTextColor = override?.textColor || '#1A1819';

  return (
    <div
      className="rounded-3xl border border-stone-200/90 shadow-xl overflow-hidden p-6 sm:p-10 space-y-6 transition-colors duration-300"
      style={{
        backgroundColor: eventCardBg,
        color: eventTextColor,
      }}
    >
      {/* Event Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 text-right">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {labelInfo.icon} {labelInfo.ar}
            </span>
            {override && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-[#720925] border border-rose-200">
                ✨ طابع تصميم مخصص
              </span>
            )}
          </div>
          <h3
            className="text-2xl sm:text-3xl font-black font-cairo mt-2"
            style={{ color: eventPrimaryColor }}
          >
            {event.titleAr}
          </h3>
          {event.subtitleAr && (
            <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
              {event.subtitleAr}
            </p>
          )}
        </div>

        {/* Date & Time pill */}
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200/80 space-y-1.5 sm:text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
            <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
            <span suppressHydrationWarning>{formatArabicDate(event.date) || 'الموعد يُحدد لاحقاً'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
            <Clock className="w-4 h-4 text-rose-800 shrink-0" />
            <span>
              {event.startTime
                ? `من ${event.startTime} ${event.endTime ? `حتى ${event.endTime}` : ''}`
                : 'التوقيت سيُحدد لاحقاً'}
            </span>
          </div>
        </div>
      </div>

      {/* Description & Henna Privacy Notice */}
      {event.descriptionAr && (
        <p className="text-sm text-stone-600 leading-relaxed font-normal whitespace-pre-line text-right">
          {event.descriptionAr}
        </p>
      )}

      {event.isHennaFemaleOnly && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 text-right">
          <span className="text-lg">🌿</span>
          <span>
            تنبيه خاص: هذه المناسبة مخصصة للسيدات فقط مع أجواء الحنة المصرية المبهجة، ونرجو عدم التصوير احتراماً للخصوصية.
          </span>
        </div>
      )}

      {/* Event Location & Interactive Map */}
      <div className="space-y-3 text-right">
        <FarahnaMap
          invitationId={invitationId}
          venueName={event.venueNameAr || 'قاعة المناسبة'}
          address={event.addressAr || 'العنوان بالتفصيل'}
          latitude={event.latitude}
          longitude={event.longitude}
          googleMapsUrl={event.googleMapsUrl}
          openStreetMapUrl={event.openStreetMapUrl}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />

        {event.dressCodeAr && (
          <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 text-xs text-stone-600">
            <strong className="text-stone-800">إرشادات المظهر (Dress Code): </strong>
            <span>{event.dressCodeAr}</span>
          </div>
        )}
      </div>

      {/* Independent Event Add to Calendar Button with Africa/Cairo timezone */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-100">
        <span className="text-xs font-bold text-stone-500">
          تذكير بالمناسبة في تقويمك:
        </span>
        <AddToCalendar
          invitationId={invitationId}
          eventTitle={`${event.titleAr} - ${coupleNames}`}
          eventDate={event.date}
          startTime={event.startTime}
          endTime={event.endTime}
          venueName={event.venueNameAr}
          address={event.addressAr}
        />
      </div>
    </div>
  );
}
