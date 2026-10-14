'use client';

import React, { useState, useEffect } from 'react';
import { getCountdown, formatArabicDate, getAutoRenewingDemoDate } from '@/lib/date';
import { Calendar, Sparkles } from 'lucide-react';

interface CountdownTimerProps {
  eventDate: string | Date;
  primaryColor?: string;
  secondaryColor?: string;
  isDark?: boolean;
  autoRenew?: boolean;
  isPreview?: boolean;
}

export function CountdownTimer({
  eventDate,
  primaryColor = '#720925',
  secondaryColor = '#D4AF37',
  isDark = false,
  autoRenew = false,
  isPreview = false,
}: CountdownTimerProps) {
  // If autoRenew is true, initialize with an active future date if eventDate has passed
  const [activeDate, setActiveDate] = useState<Date | string>(() => {
    if (autoRenew && eventDate) {
      return getAutoRenewingDemoDate(eventDate);
    }
    return eventDate;
  });

  const [timeLeft, setTimeLeft] = useState(() => getCountdown(activeDate));

  // Sync when eventDate or autoRenew changes
  useEffect(() => {
    if (!eventDate) return;
    const resolved = autoRenew ? getAutoRenewingDemoDate(eventDate) : eventDate;
    setActiveDate(resolved);
    setTimeLeft(getCountdown(resolved));
  }, [eventDate, autoRenew]);

  // Running 1-second ticker loop with instant auto-renewal on expiry
  useEffect(() => {
    if (!activeDate) return;

    const timer = setInterval(() => {
      let cd = getCountdown(activeDate);

      // If autoRenew is enabled and the countdown expired / reached zero:
      if (autoRenew && (cd.isPassed || !cd.isValid)) {
        // Automatically calculate next rolling cycle and renew seamlessly
        const renewedDate = getAutoRenewingDemoDate(activeDate, 15);
        setActiveDate(renewedDate);
        cd = getCountdown(renewedDate);
      }

      setTimeLeft(cd);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeDate, autoRenew]);

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

  const formattedDate = formatArabicDate(activeDate);

  // Format single digits with leading zero for aesthetic balance (01 instead of 1)
  const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

  const units = [
    { label: 'يوم', value: pad(timeLeft.days), key: 'days' },
    { label: 'ساعة', value: pad(timeLeft.hours), key: 'hours' },
    { label: 'دقيقة', value: pad(timeLeft.minutes), key: 'minutes' },
    { label: 'ثانية', value: pad(timeLeft.seconds), key: 'seconds' },
  ];

  return (
    <section
      className={`relative mx-auto text-center ${
        isPreview
          ? 'py-4 px-2 max-w-full space-y-3'
          : 'py-8 px-4 max-w-2xl space-y-5'
      }`}
    >
      {/* Soft Ambient Glow Aura behind timer */}
      <div
        className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-36 rounded-full blur-3xl opacity-25 pointer-events-none -z-10"
        style={{ backgroundColor: secondaryColor || '#D4AF37' }}
      />

      {/* Header Info */}
      <div className="space-y-1.5">
        {formattedDate && (
          <div className="flex items-center justify-center">
            <span
              suppressHydrationWarning
              className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold shadow-xs border transition-all backdrop-blur-md"
              style={{
                backgroundColor: isDark ? 'rgba(212, 175, 55, 0.12)' : '#FEFBF5',
                borderColor: isDark ? 'rgba(212, 175, 55, 0.4)' : '#F0E2C8',
                color: isDark ? '#F5D77F' : '#8A5D14',
                boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.4)' : '0 1px 4px rgba(212,175,55,0.1)',
              }}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{formattedDate}</span>
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0 opacity-80" />
            </span>
          </div>
        )}

        <h3
          className={`font-black font-cairo tracking-tight ${
            isPreview ? 'text-sm min-[360px]:text-base' : 'text-lg sm:text-2xl'
          }`}
          style={{
            color: isDark ? '#FFFFFF' : '#1A1819',
            textShadow: isDark ? '0 2px 14px rgba(0,0,0,0.8)' : undefined,
          }}
        >
          باقي على ليلة العمر ومشاركتكم فرحتنا ❤️
        </h3>
      </div>

      {timeLeft.isPassed && !autoRenew ? (
        <div className="p-4 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 font-black text-sm">
          🎉 اليوم فرحتنا... مستنيينكم تنورونا وتشاركونا أجمل لحظات حياتنا!
        </div>
      ) : (
        /* Luxury Royal Timer Grid */
        <div className="grid grid-cols-4 gap-1 min-[360px]:gap-1.5 max-w-sm mx-auto items-stretch">
          {units.map((unit) => (
            <div
              key={unit.key}
              className={`relative rounded-xl min-[360px]:rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all duration-300 border shadow-md group ${
                isPreview ? 'p-1 min-[360px]:p-1.5' : 'p-1.5 min-[360px]:p-2.5 sm:p-4 sm:rounded-3xl hover:-translate-y-0.5 hover:shadow-xl'
              }`}
              style={{
                background: isDark
                  ? 'linear-gradient(165deg, rgba(28, 26, 33, 0.95) 0%, rgba(14, 13, 17, 0.98) 100%)'
                  : 'linear-gradient(165deg, #FFFFFF 0%, #FAF8F4 100%)',
                borderColor: isDark
                  ? 'rgba(212, 175, 55, 0.38)'
                  : 'rgba(212, 175, 55, 0.32)',
                boxShadow: isDark
                  ? '0 12px 30px -5px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.12), 0 0 16px rgba(212, 175, 55, 0.08)'
                  : '0 10px 24px -5px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(212, 175, 55, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
              }}
            >
              {/* Fine Top Gold Foil Shimmer Line */}
              <div className="absolute inset-x-2 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-300/60 to-transparent pointer-events-none" />

              {/* Number Display */}
              <span
                suppressHydrationWarning
                className={`font-black font-cairo tracking-tight tabular-nums block leading-none py-0.5 drop-shadow-sm ${
                  isPreview
                    ? 'text-lg min-[360px]:text-xl'
                    : 'text-xl min-[360px]:text-2xl sm:text-4xl lg:text-5xl sm:py-1'
                }`}
                style={{
                  color: isDark ? '#F5D77F' : primaryColor || '#720925',
                  textShadow: isDark
                    ? '0 2px 10px rgba(212, 175, 55, 0.35)'
                    : '0 1px 2px rgba(0, 0, 0, 0.06)',
                }}
              >
                {unit.value}
              </span>

              {/* Subtle Luxury Divider Bar */}
              <div
                className="w-4 min-[360px]:w-5 h-[1px] my-0.5 min-[360px]:my-1 opacity-60"
                style={{
                  background: isDark
                    ? 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.45), transparent)',
                }}
              />

              {/* Unit Label */}
              <span
                className={`font-bold font-cairo tracking-wide block ${
                  isPreview ? 'text-[9px] min-[360px]:text-[10px]' : 'text-[10px] sm:text-xs'
                }`}
                style={{
                  color: isDark ? '#E5DDD0' : '#6B6358',
                }}
              >
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
