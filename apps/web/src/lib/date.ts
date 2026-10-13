export function formatArabicDate(dateInput?: string | Date | null): string {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Africa/Cairo',
  }).format(date);
}

export function formatArabicTime(dateInput?: string | Date | null, fallbackTime?: string): string {
  if (fallbackTime) return fallbackTime;
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('ar-EG', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'Africa/Cairo',
  }).format(date);
}

export function getCountdown(targetDate?: string | Date | null) {
  if (!targetDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: false, isValid: false };
  }
  const dateObj = new Date(targetDate);
  const target = dateObj.getTime();
  if (isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: false, isValid: false };
  }

  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true, isValid: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPassed: false, isValid: true };
}

/**
 * Automatically renews/rolls forward target dates for demo/mock invitations.
 * If the date has passed or has fewer than 2 hours remaining, it calculates
 * a fresh future date (e.g. +15 days ahead, preserving event hours/minutes).
 * This ensures the countdown timer for demo invitations NEVER expires and continuously ticks!
 */
export function getAutoRenewingDemoDate(
  initialDate?: string | Date | null,
  daysAhead = 15
): Date {
  const now = new Date();
  if (!initialDate) {
    const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    future.setHours(20, 0, 0, 0);
    return future;
  }

  const dateObj = new Date(initialDate);
  if (isNaN(dateObj.getTime())) {
    const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    future.setHours(20, 0, 0, 0);
    return future;
  }

  // If the date is comfortably in the future (more than 2 hours ahead), keep it!
  const diffMs = dateObj.getTime() - now.getTime();
  if (diffMs > 2 * 60 * 60 * 1000) {
    return dateObj;
  }

  // If the date has passed or is expiring:
  // Calculate how many interval cycles to add so it lands in the future
  const intervalMs = daysAhead * 24 * 60 * 60 * 1000;
  const passedMs = Math.max(0, now.getTime() - dateObj.getTime());
  const cyclesNeeded = Math.floor(passedMs / intervalMs) + 1;
  const renewed = new Date(dateObj.getTime() + cyclesNeeded * intervalMs);

  // Preserve hours and minutes (or fallback to 8:00 PM)
  renewed.setHours(dateObj.getHours() || 20, dateObj.getMinutes() || 0, 0, 0);

  // Guarantee renewed is strictly in the future
  if (renewed.getTime() <= now.getTime()) {
    renewed.setTime(now.getTime() + intervalMs);
    renewed.setHours(20, 0, 0, 0);
  }

  return renewed;
}

