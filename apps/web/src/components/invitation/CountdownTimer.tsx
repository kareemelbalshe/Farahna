'use client';

import React, { useState, useEffect } from 'react';
import { getCountdown, formatArabicDate } from '@/lib/date';
import { Calendar, Sparkles } from 'lucide-react';

interface CountdownTimerProps {
  eventDate: string | Date;
  primaryColor?: string;
}

export function CountdownTimer({ eventDate, primaryColor = '#720925' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getCountdown(eventDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getCountdown(eventDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  return (
    <section className="py-8 px-4 max-w-3xl mx-auto text-center space-y-6">
      <div className="space-y-1">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700">
          <Calendar className="w-3.5 h-3.5" />
          {formatArabicDate(eventDate)}
        </span>
        <h3 className="text-xl font-black text-stone-800 font-cairo">
          باقي على ليلة العمر ومشاركتكم فرحتنا ❤️
        </h3>
      </div>

      {timeLeft.isPassed ? (
        <div className="p-6 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 font-black text-lg">
          🎉 اليوم فرحتنا... مستنيينكم تنورونا وتشاركونا أجمل لحظات حياتنا!
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto">
          {/* Days */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-1">
            <span
              className="text-3xl sm:text-4xl font-black font-cairo block"
              style={{ color: primaryColor }}
            >
              {timeLeft.days}
            </span>
            <span className="text-[11px] font-bold text-stone-500">يوم</span>
          </div>

          {/* Hours */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-1">
            <span
              className="text-3xl sm:text-4xl font-black font-cairo block"
              style={{ color: primaryColor }}
            >
              {timeLeft.hours}
            </span>
            <span className="text-[11px] font-bold text-stone-500">ساعة</span>
          </div>

          {/* Minutes */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-1">
            <span
              className="text-3xl sm:text-4xl font-black font-cairo block"
              style={{ color: primaryColor }}
            >
              {timeLeft.minutes}
            </span>
            <span className="text-[11px] font-bold text-stone-500">دقيقة</span>
          </div>

          {/* Seconds */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-1">
            <span
              className="text-3xl sm:text-4xl font-black font-cairo block"
              style={{ color: primaryColor }}
            >
              {timeLeft.seconds}
            </span>
            <span className="text-[11px] font-bold text-stone-500">ثانية</span>
          </div>
        </div>
      )}
    </section>
  );
}
