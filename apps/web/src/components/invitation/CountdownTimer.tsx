'use client';

import React, { useState, useEffect } from 'react';
import { getCountdown, formatArabicDate } from '@/lib/date';
import { Calendar } from 'lucide-react';

interface CountdownTimerProps {
  eventDate: string | Date;
  primaryColor?: string;
}

export function CountdownTimer({ eventDate, primaryColor = '#720925' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getCountdown(eventDate));

  useEffect(() => {
    if (!eventDate) return;
    const timer = setInterval(() => {
      setTimeLeft(getCountdown(eventDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  // If date is missing or invalid, don't show an ugly empty/broken countdown
  if (!eventDate || !timeLeft.isValid) {
    return (
      <section className="py-6 px-4 max-w-xl mx-auto text-center space-y-2">
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs sm:text-sm">
          ✨ موعد الفرح قريباً بإذن الله... نسأل الله تمام الخير والبركة للعروسين ❤️
        </div>
      </section>
    );
  }

  const formattedDate = formatArabicDate(eventDate);

  return (
    <section className="py-8 px-4 max-w-3xl mx-auto text-center space-y-6">
      <div className="space-y-1">
        {formattedDate && (
          <span
            suppressHydrationWarning
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700"
          >
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
        )}
        <h3 className="text-xl font-black text-stone-800 font-cairo theme-heading">
          باقي على ليلة العمر ومشاركتكم فرحتنا ❤️
        </h3>
      </div>

      {timeLeft.isPassed ? (
        <div className="p-6 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 font-black text-lg theme-card">
          🎉 اليوم فرحتنا... مستنيينكم تنورونا وتشاركونا أجمل لحظات حياتنا!
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto">
          {/* Days */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-1 theme-card">
            <span
              suppressHydrationWarning
              className="text-3xl sm:text-4xl font-black font-cairo block"
              style={{ color: primaryColor }}
            >
              {timeLeft.days}
            </span>
            <span className="text-[11px] font-bold text-stone-500 theme-muted">يوم</span>
          </div>

          {/* Hours */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-1 theme-card">
            <span
              suppressHydrationWarning
              className="text-3xl sm:text-4xl font-black font-cairo block"
              style={{ color: primaryColor }}
            >
              {timeLeft.hours}
            </span>
            <span className="text-[11px] font-bold text-stone-500 theme-muted">ساعة</span>
          </div>

          {/* Minutes */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-1 theme-card">
            <span
              suppressHydrationWarning
              className="text-3xl sm:text-4xl font-black font-cairo block"
              style={{ color: primaryColor }}
            >
              {timeLeft.minutes}
            </span>
            <span className="text-[11px] font-bold text-stone-500 theme-muted">دقيقة</span>
          </div>

          {/* Seconds */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-1 theme-card">
            <span
              suppressHydrationWarning
              className="text-3xl sm:text-4xl font-black font-cairo block"
              style={{ color: primaryColor }}
            >
              {timeLeft.seconds}
            </span>
            <span className="text-[11px] font-bold text-stone-500 theme-muted">ثانية</span>
          </div>
        </div>
      )}
    </section>
  );
}
