/**
 * Map utilities for coordinates extraction and map link generation
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Validates whether latitude and longitude are valid geographical coordinates.
 */
export function isValidCoordinates(lat?: number | null, lng?: number | null): boolean {
  if (lat === undefined || lat === null || lng === undefined || lng === null) {
    return false;
  }
  if (isNaN(lat) || isNaN(lng)) {
    return false;
  }
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Validates whether a URL is safe and valid.
 * Rejects malicious schemes like javascript:, vbscript:, data:, file:
 */
export function isValidSafeUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return true;
  const trimmed = url.trim();
  if (trimmed === '') return true;

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:')
  ) {
    return false;
  }

  if (lower.startsWith('/storage/') || lower.startsWith('/')) {
    return true;
  }

  if (lower.startsWith('http://') || lower.startsWith('https://')) {
    try {
      new URL(trimmed);
      return true;
    } catch {
      return false;
    }
  }

  // Bare domains like maps.google.com/xyz or cdn.site.com/image.png
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/.*)?$/.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Normalizes a URL to ensure it has a proper scheme (https://)
 * and won't be interpreted as a relative path by browsers.
 */
export function normalizeWebUrl(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:')
  ) {
    return null;
  }

  if (lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('/')) {
    return trimmed;
  }

  // Bare domain without protocol -> prepend https://
  if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/.*)?$/.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return null;
}

/**
 * Converts Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩) to standard Western digits (0123456789)
 */
export function toWesternDigits(str: string): string {
  if (!str) return '';
  return str.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));
}

/**
 * Known geographical coordinates dictionary for major Egyptian governorates, Cairo districts,
 * prominent wedding venues, hotels, and Arab capitals.
 */
export const ARAB_LOCATIONS_DATABASE: Record<string, Coordinates> = {
  // --- Famous Cairo Wedding Hotels & Landmarks ---
  'ماريوت': { latitude: 30.0571, longitude: 31.2250 },
  'marriott': { latitude: 30.0571, longitude: 31.2250 },
  'فور سيزونز': { latitude: 30.0211, longitude: 31.2268 },
  'four seasons': { latitude: 30.0211, longitude: 31.2268 },
  'الماسة': { latitude: 30.0633, longitude: 31.3120 },
  'al masa': { latitude: 30.0633, longitude: 31.3120 },
  'almasa': { latitude: 30.0633, longitude: 31.3120 },
  'القوات الجوية': { latitude: 30.0882, longitude: 31.3256 },
  'air force': { latitude: 30.0882, longitude: 31.3256 },
  'دار المشاة': { latitude: 30.0812, longitude: 31.3190 },
  'دار المدرعات': { latitude: 30.0845, longitude: 31.3278 },
  'دار الدفاع الجوي': { latitude: 30.0910, longitude: 31.3340 },
  'مسجد الشرطة': { latitude: 30.0152, longitude: 31.4398 },
  'police mosque': { latitude: 30.0152, longitude: 31.4398 },
  'مسجد المشير': { latitude: 30.0272, longitude: 31.4116 },
  'tantawy': { latitude: 30.0272, longitude: 31.4116 },
  'جراند نايل تاور': { latitude: 30.0336, longitude: 31.2287 },
  'grand nile tower': { latitude: 30.0336, longitude: 31.2287 },
  'سميراميس': { latitude: 30.0435, longitude: 31.2330 },
  'semiramis': { latitude: 30.0435, longitude: 31.2330 },
  'كمبنسكي': { latitude: 30.0388, longitude: 31.2312 },
  'kempinski': { latitude: 30.0388, longitude: 31.2312 },
  'سوفيتيل': { latitude: 30.0396, longitude: 31.2241 },
  'sofitel': { latitude: 30.0396, longitude: 31.2241 },
  'انتركونتيننتال': { latitude: 30.0992, longitude: 31.3481 },
  'intercontinental': { latitude: 30.0992, longitude: 31.3481 },
  'شتيجنبرجر': { latitude: 31.2008, longitude: 29.9015 },
  'steigenberger': { latitude: 31.2008, longitude: 29.9015 },
  'سان ستيفانو': { latitude: 31.2444, longitude: 29.9658 },
  'san stefano': { latitude: 31.2444, longitude: 29.9658 },
  'هيلتون': { latitude: 30.0468, longitude: 31.2327 },
  'hilton': { latitude: 30.0468, longitude: 31.2327 },

  // --- Greater Cairo Districts ---
  'القاهرة': { latitude: 30.0444, longitude: 31.2357 },
  'cairo': { latitude: 30.0444, longitude: 31.2357 },
  'الجيزة': { latitude: 30.0131, longitude: 31.2089 },
  'giza': { latitude: 30.0131, longitude: 31.2089 },
  'التجمع': { latitude: 30.0254, longitude: 31.4913 },
  'التجمع الخامس': { latitude: 30.0074, longitude: 31.4296 },
  'fifth settlement': { latitude: 30.0074, longitude: 31.4296 },
  'القاهرة الجديدة': { latitude: 30.0254, longitude: 31.4913 },
  'new cairo': { latitude: 30.0254, longitude: 31.4913 },
  'الشيخ زايد': { latitude: 30.0538, longitude: 30.9822 },
  'zayed': { latitude: 30.0538, longitude: 30.9822 },
  'زايد': { latitude: 30.0538, longitude: 30.9822 },
  'أكتوبر': { latitude: 29.9723, longitude: 30.9575 },
  'اكتوبر': { latitude: 29.9723, longitude: 30.9575 },
  'october': { latitude: 29.9723, longitude: 30.9575 },
  'السادس من أكتوبر': { latitude: 29.9723, longitude: 30.9575 },
  'المعادي': { latitude: 29.9602, longitude: 31.2568 },
  'معادي': { latitude: 29.9602, longitude: 31.2568 },
  'maadi': { latitude: 29.9602, longitude: 31.2568 },
  'الزمالك': { latitude: 30.0609, longitude: 31.2197 },
  'زمالك': { latitude: 30.0609, longitude: 31.2197 },
  'zamalek': { latitude: 30.0609, longitude: 31.2197 },
  'مدينة نصر': { latitude: 30.0614, longitude: 31.3364 },
  'nasr city': { latitude: 30.0614, longitude: 31.3364 },
  'مصر الجديدة': { latitude: 30.0898, longitude: 31.3285 },
  'heliopolis': { latitude: 30.0898, longitude: 31.3285 },
  'المهندسين': { latitude: 30.0531, longitude: 31.2003 },
  'mohandessin': { latitude: 30.0531, longitude: 31.2003 },
  'الدقي': { latitude: 30.0385, longitude: 31.2114 },
  'dokki': { latitude: 30.0385, longitude: 31.2114 },
  'الشروق': { latitude: 30.1444, longitude: 31.6319 },
  'مدينتي': { latitude: 30.0984, longitude: 31.6366 },
  'الرحاب': { latitude: 30.0633, longitude: 31.4925 },
  'العاصمة الإدارية': { latitude: 30.0131, longitude: 31.7454 },
  'الهرم': { latitude: 29.9869, longitude: 31.1443 },
  'فيصل': { latitude: 30.0150, longitude: 31.1850 },

  // --- Egyptian Governorates ---
  'الإسكندرية': { latitude: 31.2001, longitude: 29.9187 },
  'اسكندرية': { latitude: 31.2001, longitude: 29.9187 },
  'alexandria': { latitude: 31.2001, longitude: 29.9187 },
  'سموحة': { latitude: 31.2156, longitude: 29.9493 },
  'المنصورة': { latitude: 31.0409, longitude: 31.3785 },
  'منصورة': { latitude: 31.0409, longitude: 31.3785 },
  'طنطا': { latitude: 30.7865, longitude: 31.0004 },
  'الزقازيق': { latitude: 30.5877, longitude: 31.5020 },
  'الإسماعيلية': { latitude: 30.5965, longitude: 32.2715 },
  'اسماعيلية': { latitude: 30.5965, longitude: 32.2715 },
  'بورسعيد': { latitude: 31.2653, longitude: 32.3019 },
  'السويس': { latitude: 29.9668, longitude: 32.5498 },
  'بنها': { latitude: 30.4660, longitude: 31.1853 },
  'شبين الكوم': { latitude: 30.5526, longitude: 31.0090 },
  'دمنهور': { latitude: 31.0409, longitude: 30.4704 },
  'كفر الشيخ': { latitude: 31.1107, longitude: 30.9388 },
  'دمياط': { latitude: 31.4175, longitude: 31.8144 },
  'الفيوم': { latitude: 29.3084, longitude: 30.8428 },
  'بني سويف': { latitude: 29.0661, longitude: 31.0994 },
  'المنيا': { latitude: 28.0871, longitude: 30.7618 },
  'أسيوط': { latitude: 27.1783, longitude: 31.1859 },
  'اسيوط': { latitude: 27.1783, longitude: 31.1859 },
  'سوهاج': { latitude: 26.5569, longitude: 31.6948 },
  'قنا': { latitude: 26.1551, longitude: 32.7160 },
  'الأقصر': { latitude: 25.6872, longitude: 32.6396 },
  'اقصر': { latitude: 25.6872, longitude: 32.6396 },
  'أسوان': { latitude: 24.0889, longitude: 32.8998 },
  'اسوان': { latitude: 24.0889, longitude: 32.8998 },
  'شرم الشيخ': { latitude: 27.9158, longitude: 34.3299 },
  'الغردقة': { latitude: 27.2579, longitude: 33.8116 },
  'الجونة': { latitude: 27.3949, longitude: 33.6766 },
  'مرسى مطروح': { latitude: 31.3543, longitude: 27.2373 },
  'الساحل الشمالي': { latitude: 30.9632, longitude: 29.1582 },

  // --- Arab Capitals & Major Cities ---
  'الرياض': { latitude: 24.7136, longitude: 46.6753 },
  'جدة': { latitude: 21.4858, longitude: 39.1925 },
  'مكة': { latitude: 21.3891, longitude: 39.8579 },
  'المدينة': { latitude: 24.5247, longitude: 39.5692 },
  'الدمام': { latitude: 26.4207, longitude: 50.0888 },
  'دبي': { latitude: 25.2048, longitude: 55.2708 },
  'أبوظبي': { latitude: 24.4539, longitude: 54.3773 },
  'ابوظبي': { latitude: 24.4539, longitude: 54.3773 },
  'الشارقة': { latitude: 25.3463, longitude: 55.4209 },
  'الكويت': { latitude: 29.3759, longitude: 47.9774 },
  'الدوحة': { latitude: 25.2854, longitude: 51.5310 },
  'المنامة': { latitude: 26.2285, longitude: 50.5860 },
  'مسقط': { latitude: 23.5859, longitude: 58.4059 },
  'عمان': { latitude: 31.9454, longitude: 35.9284 },
  'بيروت': { latitude: 33.8938, longitude: 35.5018 },
  'بغداد': { latitude: 33.3152, longitude: 44.3661 },
};

/**
 * Resolves coordinates based on venue name or address string using dictionary matching
 */
export function resolveCityCoordinates(query?: string | null): Coordinates | null {
  if (!query || typeof query !== 'string') return null;

  const normalized = toWesternDigits(query)
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[،,.-]/g, ' ')
    .trim();

  // 1. Direct key match
  for (const [key, coords] of Object.entries(ARAB_LOCATIONS_DATABASE)) {
    const normKey = key
      .toLowerCase()
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي');

    if (normalized.includes(normKey)) {
      return coords;
    }
  }

  return null;
}

/**
 * Extracts latitude and longitude from Google Maps URLs or direct coordinate strings.
 * Handles desktop/mobile URLs, embed URLs, query params, and Arabic-Indic numerals.
 */
export function extractCoordinatesFromUrl(urlOrText: string): Coordinates | null {
  if (!urlOrText || typeof urlOrText !== 'string') {
    return null;
  }

  let clean = urlOrText.trim();
  try {
    clean = decodeURIComponent(clean);
  } catch (e) {}

  clean = toWesternDigits(clean);

  // 1. Direct "lat, lng" string (e.g. "30.0444, 31.2357" or "30.0444 31.2357")
  const directMatch = clean.match(/^([+-]?\d{1,2}(?:\.\d+)?)[,\s]+([+-]?\d{1,3}(?:\.\d+)?)$/);
  if (directMatch) {
    const lat = parseFloat(directMatch[1]);
    const lng = parseFloat(directMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  // 2. Pattern: @lat,lng (e.g. /@30.0444,31.2357,17z)
  const atMatch = clean.match(/@([+-]?\d{1,2}(?:\.\d+)?)[,\s]+([+-]?\d{1,3}(?:\.\d+)?)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  // 3. Pattern: q=lat,lng or query=lat,lng or ll=lat,lng or destination=lat,lng or center=lat,lng or daddr=lat,lng
  const queryMatch = clean.match(
    /(?:[?&](?:q|query|ll|destination|center|daddr)=(?:loc:)?)([+-]?\d{1,2}(?:\.\d+)?)[,+\s]+([+-]?\d{1,3}(?:\.\d+)?)/i
  );
  if (queryMatch) {
    const lat = parseFloat(queryMatch[1]);
    const lng = parseFloat(queryMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  // 4. Pattern: /place/lat,lng or /dir/lat,lng or /search/lat,lng or loc:lat,lng
  const pathMatch = clean.match(
    /(?:(?:\/dir\/|\/search\/|\/place\/|loc:))([+-]?\d{1,2}(?:\.\d+)?)[,+\s]+([+-]?\d{1,3}(?:\.\d+)?)/i
  );
  if (pathMatch) {
    const lat = parseFloat(pathMatch[1]);
    const lng = parseFloat(pathMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  // 5. Pattern: Google Maps Embed / Protobuf parameters (!3d = lat, !2d/!4d = lng or !1d/!2d)
  const d3Match = clean.match(/!3d([+-]?\d{1,2}(?:\.\d+)?)/);
  const d2Match = clean.match(/![24]d([+-]?\d{1,3}(?:\.\d+)?)/);
  if (d3Match && d2Match) {
    const lat = parseFloat(d3Match[1]);
    const lng = parseFloat(d2Match[1]);
    if (isValidCoordinates(lat, lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  // 6. Pattern: OpenStreetMap mlat & mlon or lat & lon / lat & lng
  const osmMlatMatch = clean.match(/[?&](?:mlat|lat)=([+-]?\d{1,2}(?:\.\d+)?)(?:.*?[?&](?:mlon|lon|lng)=([+-]?\d{1,3}(?:\.\d+)?))/i);
  if (osmMlatMatch) {
    const lat = parseFloat(osmMlatMatch[1]);
    const lng = parseFloat(osmMlatMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return { latitude: lat, longitude: lng };
    }
  }
  const osmMlonFirstMatch = clean.match(/[?&](?:mlon|lon|lng)=([+-]?\d{1,3}(?:\.\d+)?)(?:.*?[?&](?:mlat|lat)=([+-]?\d{1,2}(?:\.\d+)?))/i);
  if (osmMlonFirstMatch) {
    const lng = parseFloat(osmMlonFirstMatch[1]);
    const lat = parseFloat(osmMlonFirstMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  // 7. Pattern: OpenStreetMap hash format (#map=zoom/lat/lng)
  const osmHashMapMatch = clean.match(/#map=\d+\/([+-]?\d{1,2}(?:\.\d+)?)\/([+-]?\d{1,3}(?:\.\d+)?)/i);
  if (osmHashMapMatch) {
    const lat = parseFloat(osmHashMapMatch[1]);
    const lng = parseFloat(osmHashMapMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  // 8. Pattern: Static map / markers (e.g. markers=color:red|30.0444,31.2357 or center=30.0444,31.2357)
  const markerMatch = clean.match(/(?:markers=[^&]*?|center=)([+-]?\d{1,2}(?:\.\d+)?)[,%7C|]+([+-]?\d{1,3}(?:\.\d+)?)/i);
  if (markerMatch) {
    const lat = parseFloat(markerMatch[1]);
    const lng = parseFloat(markerMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  return null;
}

/**
 * Checks if a URL is a Google Maps shortened sharing URL that requires redirect resolution.
 */
export function isGoogleMapsShortUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.trim().toLowerCase();
  return (
    lower.includes('maps.app.goo.gl') ||
    lower.includes('goo.gl/maps') ||
    lower.includes('app.goo.gl')
  );
}

/**
 * Formats coordinates into standard comma-separated string (e.g. "30.0571, 31.2250")
 */
export function formatCoordinates(coords: Coordinates, precision: number = 5): string {
  return `${coords.latitude.toFixed(precision)}, ${coords.longitude.toFixed(precision)}`;
}

/**
 * Generates unified navigation and map view links across Google Maps, OpenStreetMap and Apple Maps.
 */
export function buildUnifiedMapLinks(options: {
  latitude: number;
  longitude: number;
  venueName?: string;
  address?: string;
}): {
  googleMapsDirectionsUrl: string;
  openStreetMapUrl: string;
  appleMapsUrl: string;
} {
  const { latitude, longitude, venueName = '', address = '' } = options;
  const label = [venueName, address].filter(Boolean).join(' - ') || 'قاعة الحفل';
  return {
    googleMapsDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    openStreetMapUrl: getOpenStreetMapUrl(latitude, longitude),
    appleMapsUrl: `https://maps.apple.com/?ll=${latitude},${longitude}&q=${encodeURIComponent(label)}`,
  };
}

/**
 * Builds a direct Google Maps directions URL (turn-by-turn navigation deep link).
 */
export function getGoogleMapsDirectionsUrl(options: {
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string | null;
  venueName?: string;
  address?: string;
}): string {
  const { latitude, longitude, googleMapsUrl, venueName, address } = options;

  const normalizedGoogleUrl = normalizeWebUrl(googleMapsUrl);
  
  // If the user pasted a specific Google Maps URL (place link, shortlink, or directions link)
  if (normalizedGoogleUrl) {
    const lower = normalizedGoogleUrl.toLowerCase();
    if (
      lower.includes('maps.app.goo.gl') ||
      lower.includes('goo.gl/maps') ||
      lower.includes('google.com/maps')
    ) {
      return normalizedGoogleUrl;
    }
  }

  // If valid coordinates are available, generate direct navigation
  if (isValidCoordinates(latitude, longitude)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  }

  if (normalizedGoogleUrl) {
    return normalizedGoogleUrl;
  }

  const cleanVenue = venueName && venueName !== 'مكان الحفل' && venueName !== 'قاعة الفرح' ? venueName.trim() : '';
  const cleanAddress = address && address !== 'العنوان هنا' && address !== 'القاهرة، مصر' ? address.trim() : '';
  const queryParts = [cleanVenue, cleanAddress].filter(Boolean).join(' ');
  if (queryParts) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(queryParts)}`;
  }

  return 'https://maps.google.com';
}

/**
 * Builds an OpenStreetMap interactive view URL with marker.
 */
export function getOpenStreetMapUrl(latitude: number, longitude: number, zoom: number = 16): string {
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`;
}

const ARABIC_TO_LATIN_MAP: Record<string, string> = {
  'أ': 'a', 'إ': 'e', 'آ': 'a', 'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th',
  'ج': 'g', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
  'غ': 'gh', 'ف': 'f', 'ق': 'k', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a', 'ئ': 'e', 'ء': 'a', 'ة': 'a',
  'ؤ': 'o', 'پ': 'p', 'چ': 'ch', 'ژ': 'zh', 'ڤ': 'v', 'گ': 'g',
};

/**
 * Transliterates Arabic names/phrases into clean URL slug compatible text
 */
export function transliterateArabicToSlug(text: string): string {
  if (!text) return '';
  let result = '';
  const lower = text.toLowerCase().trim();
  for (const char of lower) {
    if (ARABIC_TO_LATIN_MAP[char]) {
      result += ARABIC_TO_LATIN_MAP[char];
    } else if (/[a-z0-9]/.test(char)) {
      result += char;
    } else if (/\s|_|-/.test(char)) {
      result += '-';
    }
  }
  return result.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * Generates a valid unique URL slug from groom & bride names with random suffix to prevent duplicates
 */
export function generateInvitationSlug(groom?: string, bride?: string, customSuffix?: string): string {
  const cleanGroom = transliterateArabicToSlug((groom || '').trim().split(/\s+/)[0]) || 'groom';
  const cleanBride = transliterateArabicToSlug((bride || '').trim().split(/\s+/)[0]) || 'bride';
  const combined = `${cleanGroom}-${cleanBride}`.replace(/^-+|-+$/g, '');
  
  // 4-character random alphanumeric suffix to prevent duplicate collision
  const randomSuffix =
    customSuffix ||
    Math.random().toString(36).substring(2, 6).toLowerCase();

  if (combined.length >= 3 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(combined)) {
    return `${combined}-${randomSuffix}`;
  }
  return `farah-${Date.now().toString().slice(-6)}-${randomSuffix}`;
}
