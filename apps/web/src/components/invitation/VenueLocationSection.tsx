import React from 'react';
import { Calendar, Clock, MapPin, Building, Sparkles } from 'lucide-react';
import { InvitationEventDTO } from '@farahna/shared';
import { formatArabicDate } from '@/lib/date';

interface VenueLocationSectionProps {
  primaryEvent?: InvitationEventDTO;
  primaryColor?: string;
  secondaryColor?: string;
}

export function VenueLocationSection({
  primaryEvent,
  primaryColor = '#720925',
  secondaryColor = '#D4AF37',
}: VenueLocationSectionProps) {
  if (!primaryEvent) return null;

  return (
    <section className="py-8 px-4 max-w-3xl mx-auto space-y-6 text-right">
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
          <Building className="w-3.5 h-3.5 text-amber-600" />
          مكان وموعد الفرح
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-cairo">
          تفاصيل موعد وقاعة الفرح
        </h2>
      </div>

      <div className="rounded-3xl bg-white border border-stone-200/90 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <span className="text-xs font-bold text-amber-700 block mb-1">
              {primaryEvent.titleAr}
            </span>
            <h3
              className="text-2xl font-black font-cairo"
              style={{ color: primaryColor }}
            >
              {primaryEvent.venueNameAr}
            </h3>
            {primaryEvent.subtitleAr && (
              <p className="text-xs text-stone-500 mt-0.5">{primaryEvent.subtitleAr}</p>
            )}
          </div>

          <div className="space-y-1 text-right sm:text-left self-start sm:self-auto">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
              <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{formatArabicDate(primaryEvent.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
              <Clock className="w-4 h-4 text-stone-400 shrink-0" />
              <span>من {primaryEvent.startTime} {primaryEvent.endTime ? `إلى ${primaryEvent.endTime}` : ''}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-xs sm:text-sm text-stone-700">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#720925] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-stone-800">العنوان:</p>
              <p className="text-stone-600 mt-0.5">{primaryEvent.addressAr}</p>
            </div>
          </div>

          {primaryEvent.descriptionAr && (
            <p className="text-stone-500 text-xs leading-relaxed pt-2">
              {primaryEvent.descriptionAr}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
