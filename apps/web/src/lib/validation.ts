import {
  toWesternDigits,
  isValidCoordinates,
  isValidSafeUrl,
  extractCoordinatesFromUrl,
  Coordinates,
} from '@farahna/shared';

export type MapUrlValidationStatus =
  | 'empty'
  | 'valid_coords'
  | 'valid_google'
  | 'valid_url'
  | 'invalid';

export interface MapUrlValidationResult {
  status: MapUrlValidationStatus;
  message: string;
  coords?: Coordinates | null;
}

/**
 * Validates map links (Google Maps, Waze, Apple Maps) or direct coordinates
 */
export function validateMapUrl(urlOrText?: string | null): MapUrlValidationResult {
  if (!urlOrText || !urlOrText.trim()) {
    return {
      status: 'empty',
      message: 'اختياري: يمكنك وضع رابط لوكيشن جوجل ماب أو إحداثيات المكان (Lat, Lng) لتسهيل وصول الضيوف.',
      coords: null,
    };
  }

  const clean = toWesternDigits(urlOrText.trim());

  // 1. Direct coordinates or extracted from URL
  const coords = extractCoordinatesFromUrl(clean);
  if (coords && isValidCoordinates(coords.latitude, coords.longitude)) {
    return {
      status: 'valid_coords',
      message: `تم تحديد الإحداثيات الجغرافية بدقة (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}) وجاهزة للملاحة والخريطة التفاعلية 📍`,
      coords,
    };
  }

  // 2. Recognized Maps patterns (Google Maps, Waze, Apple Maps)
  const lower = clean.toLowerCase();
  const isRecognizedMap =
    lower.includes('maps.google.') ||
    lower.includes('google.com/maps') ||
    lower.includes('maps.app.goo.gl') ||
    lower.includes('goo.gl/maps') ||
    lower.includes('g.page/') ||
    lower.includes('maps.apple.com') ||
    lower.includes('waze.com');

  if (isRecognizedMap) {
    if (isValidSafeUrl(clean)) {
      return {
        status: 'valid_google',
        message: 'رابط خرائط جوجل معتمد وجاهز للربط مع نظام الملاحة وخريطة OpenStreetMap 🗺️',
        coords: null,
      };
    }
  }

  // 3. Other generic valid HTTP/HTTPS URLs
  if (isValidSafeUrl(clean) && (lower.startsWith('http://') || lower.startsWith('https://'))) {
    return {
      status: 'valid_url',
      message: 'رابط موقع ويب صالح ومتاح في تفاصيل المناسبة 🌐',
      coords: null,
    };
  }

  // 4. Invalid input (e.g. plain non-URL text or broken link)
  return {
    status: 'invalid',
    message: '⚠️ هذا الرابط لا يبدو كرابط خرائط صالح. يرجى نسخ رابط المشاركة (Share Link) من تطبيق Google Maps أو كتابة الإحداثيات مباشرة.',
    coords: null,
  };
}

export interface PhoneValidationResult {
  isValid: boolean;
  normalized: string;
  error?: string;
}

/**
 * Validates Egyptian mobile numbers (010, 011, 012, 015) or valid international numbers
 */
export function validatePhoneNumber(phone?: string | null): PhoneValidationResult {
  if (!phone || !phone.trim()) {
    return {
      isValid: false,
      normalized: '',
      error: 'رقم الهاتف / واتساب مطلوب لتأكيد التفعيل وإرسال الرابط',
    };
  }

  let clean = toWesternDigits(phone.trim()).replace(/[\s\-\(\)]/g, '');

  // Strip leading international Egyptian prefixes
  if (clean.startsWith('+20')) {
    clean = '0' + clean.slice(3);
  } else if (clean.startsWith('0020')) {
    clean = '0' + clean.slice(4);
  } else if (clean.startsWith('20') && clean.length === 12 && /^201[0125]\d{8}$/.test(clean)) {
    clean = '0' + clean.slice(2);
  }

  // Egyptian mobile format: 010, 011, 012, 015 + 8 digits = 11 digits
  if (/^01[0125]\d{8}$/.test(clean)) {
    return {
      isValid: true,
      normalized: clean,
    };
  }

  // International phone format: starts with + or valid digits 9 to 15 chars
  if (/^\+?[1-9]\d{8,14}$/.test(clean)) {
    return {
      isValid: true,
      normalized: clean.startsWith('+') ? clean : `+${clean}`,
    };
  }

  return {
    isValid: false,
    normalized: clean,
    error: 'يرجى إدخال رقم هاتف محمول مصري صحيح (11 رقم يبدأ بـ 010 أو 011 أو 012 أو 015) أو رقم دولي مع كود الدولة',
  };
}

/**
 * Checks if a date string is in the past (more than toleranceDays days ago)
 */
export function isDateInPast(dateStr?: string | null, toleranceDays = 1): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const cutoff = new Date(now.getTime() - toleranceDays * 24 * 60 * 60 * 1000);

  return d.getTime() < cutoff.getTime();
}

/**
 * Safely parses any date string into an ISO string without throwing RangeError
 */
export function safeIsoDate(dateStr?: string | null, fallbackDaysFromNow = 30): string {
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  }
  return new Date(Date.now() + fallbackDaysFromNow * 24 * 60 * 60 * 1000).toISOString();
}
