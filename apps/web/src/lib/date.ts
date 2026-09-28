export function formatArabicDate(dateInput: string | Date): string {
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

export function formatArabicTime(dateInput: string | Date, fallbackTime?: string): string {
  if (fallbackTime) return fallbackTime;
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('ar-EG', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'Africa/Cairo',
  }).format(date);
}

export function getCountdown(targetDate: string | Date) {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPassed: false };
}
