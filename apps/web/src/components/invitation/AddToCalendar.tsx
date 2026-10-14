'use client';

import React, { useState } from 'react';
import { CalendarPlus, Download, Check } from 'lucide-react';
import { recordPublicAnalytics } from '@/lib/api';

interface AddToCalendarProps {
  invitationId?: string;
  eventTitle: string;
  eventDate: string | Date;
  startTime?: string | null;
  endTime?: string | null;
  venueName?: string | null;
  address?: string | null;
}

/**
 * Helper to parse Egyptian time strings like '08:00 م' or '5:00 م' or '20:00'
 */
function parseTimeToHoursAndMinutes(timeStr?: string | null): { hours: number; minutes: number } {
  if (!timeStr) return { hours: 20, minutes: 0 }; // Default 8:00 PM
  // Normalize Arabic-Indic digits (٠-٩) to Western (0-9)
  const clean = timeStr
    .trim()
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));

  const isPM = clean.includes('م') || clean.toUpperCase().includes('PM');
  const isAM = clean.includes('ص') || clean.toUpperCase().includes('AM');
  const numericPart = clean.replace(/[^0-9:]/g, '');
  const [hStr, mStr] = numericPart.split(':');
  let hours = parseInt(hStr || '20', 10);
  const minutes = parseInt(mStr || '00', 10);

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;
  return { hours, minutes };
}

export function AddToCalendar({
  invitationId,
  eventTitle,
  eventDate,
  startTime = '08:00 م',
  endTime = '01:00 ص',
  venueName = 'قاعة الفرح',
  address = 'القاهرة، مصر',
}: AddToCalendarProps) {
  const [downloaded, setDownloaded] = useState(false);

  if (!eventDate) return null;

  // Safe Date resolution avoiding UTC rollover
  let year: number;
  let month: string;
  let day: string;
  let baseDate: Date;

  if (typeof eventDate === 'string' && /^\d{4}-\d{2}-\d{2}/.test(eventDate)) {
    const parts = eventDate.split('T')[0].split('-');
    year = parseInt(parts[0], 10);
    month = parts[1].padStart(2, '0');
    day = parts[2].padStart(2, '0');
    baseDate = new Date(year, parseInt(month, 10) - 1, parseInt(day, 10));
  } else {
    const d = new Date(eventDate);
    if (isNaN(d.getTime())) return null;
    year = d.getFullYear();
    month = String(d.getMonth() + 1).padStart(2, '0');
    day = String(d.getDate()).padStart(2, '0');
    baseDate = new Date(year, d.getMonth(), d.getDate());
  }

  const { hours: startH, minutes: startM } = parseTimeToHoursAndMinutes(startTime);
  const { hours: endH, minutes: endM } = parseTimeToHoursAndMinutes(endTime);

  // If end time is before or equal to start time (e.g. starts 20:00, ends 01:00), end date is the next day!
  let endYear = year;
  let endMonth = month;
  let endDay = day;

  if (endH < startH || (endH === startH && endM <= startM)) {
    const nextDay = new Date(baseDate);
    nextDay.setDate(nextDay.getDate() + 1);
    endYear = nextDay.getFullYear();
    endMonth = String(nextDay.getMonth() + 1).padStart(2, '0');
    endDay = String(nextDay.getDate()).padStart(2, '0');
  }

  const startFormatted = `${year}${month}${day}T${String(startH).padStart(2, '0')}${String(startM).padStart(2, '0')}00`;
  const endFormatted = `${endYear}${endMonth}${endDay}T${String(endH).padStart(2, '0')}${String(endM).padStart(2, '0')}00`;

  // Google Calendar deep link with explicit Africa/Cairo timezone (ctz=Africa/Cairo)
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventTitle
  )}&dates=${startFormatted}/${endFormatted}&ctz=Africa/Cairo&details=${encodeURIComponent(
    `يسعدنا ويشرفنا حضوركم ومشاركتنا الفرحة في: ${venueName} - ${address}\n\nصُنعت الدعوة عبر منصة فرحنا — Farahna`
  )}&location=${encodeURIComponent(`${venueName}, ${address}`)}`;

  // Download RFC 5545 compliant .ics file with Africa/Cairo VTIMEZONE
  const handleIcsDownload = () => {
    if (invitationId) {
      recordPublicAnalytics({
        invitationId,
        eventType: 'calendar_click',
        metadata: { provider: 'ical', eventTitle },
      });
    }

    const safeDescription = `يسعدنا ويشرفنا حضوركم ومشاركتنا الفرحة في ${venueName} - ${address}\\n\\nصُنعت الدعوة عبر منصة فرحنا — Farahna`.replace(
      /[\r\n]+/g,
      '\\n'
    );

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Farahna Weddings//EG',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VTIMEZONE',
      'TZID:Africa/Cairo',
      'X-LIC-LOCATION:Africa/Cairo',
      'BEGIN:STANDARD',
      'TZOFFSETFROM:+0200',
      'TZOFFSETTO:+0200',
      'TZNAME:EET',
      'DTSTART:19700101T000000',
      'END:STANDARD',
      'END:VTIMEZONE',
      'BEGIN:VEVENT',
      `UID:farahna-${Date.now()}@farahna.menuflowx.com`,
      `SUMMARY:${eventTitle}`,
      `DESCRIPTION:${safeDescription}`,
      `LOCATION:${venueName}, ${address}`,
      `DTSTART;TZID=Africa/Cairo:${startFormatted}`,
      `DTEND;TZID=Africa/Cairo:${endFormatted}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${eventTitle}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleGoogleCalendarClick = () => {
    if (invitationId) {
      recordPublicAnalytics({
        invitationId,
        eventType: 'calendar_click',
        metadata: { provider: 'google', eventTitle },
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Google Calendar */}
      <a
        href={googleCalendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleGoogleCalendarClick}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-200 font-bold text-xs hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors shadow-xs"
      >
        <CalendarPlus className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
        <span>أضف للتقويم (Google)</span>
      </a>

      {/* Apple / Outlook iCal */}
      <button
        type="button"
        onClick={handleIcsDownload}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-bold text-xs hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
      >
        {downloaded ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-emerald-700 dark:text-emerald-300">تم الحفظ</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            <span>Apple / iCal</span>
          </>
        )}
      </button>
    </div>
  );
}
