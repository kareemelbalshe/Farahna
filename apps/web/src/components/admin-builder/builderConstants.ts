// Shared constants and helper utilities for the Visual Invitation Builder

export type BuilderTab = 'couple' | 'theme' | 'events' | 'sections' | 'media';

// Robust color normalizer accepting Hex (with/without #, trailing #), RGB/RGBA, bare numbers, Arabic numerals & named colors
export function normalizeColor(input: string): string | null {
  if (!input || typeof input !== 'string') return null;
  let clean = input.trim();
  clean = clean.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
  clean = clean.replace(/،/g, ',');
  clean = clean.toLowerCase();
  clean = clean.replace(/#+$/, '').trim();
  const hexPart = clean.startsWith('#') ? clean.slice(1) : clean;
  if (/^[0-9a-f]{3}$/i.test(hexPart)) {
    return `#${hexPart[0]}${hexPart[0]}${hexPart[1]}${hexPart[1]}${hexPart[2]}${hexPart[2]}`.toLowerCase();
  }
  if (/^[0-9a-f]{6}$/i.test(hexPart)) {
    return `#${hexPart}`.toLowerCase();
  }
  if (/^[0-9a-f]{8}$/i.test(hexPart)) {
    return `#${hexPart.slice(0, 6)}`.toLowerCase();
  }
  const rgbMatch = clean.match(/^rgba?\s*\(\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})\s*[\s,]\s*(\d{1,3})/i);
  if (rgbMatch) {
    const r = Math.min(255, Math.max(0, parseInt(rgbMatch[1], 10))).toString(16).padStart(2, '0');
    const g = Math.min(255, Math.max(0, parseInt(rgbMatch[2], 10))).toString(16).padStart(2, '0');
    const b = Math.min(255, Math.max(0, parseInt(rgbMatch[3], 10))).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toLowerCase();
  }
  const bareRgb = clean.match(/^(\d{1,3})\s*[\s,.-]\s*(\d{1,3})\s*[\s,.-]\s*(\d{1,3})$/);
  if (bareRgb) {
    const rNum = parseInt(bareRgb[1], 10);
    const gNum = parseInt(bareRgb[2], 10);
    const bNum = parseInt(bareRgb[3], 10);
    if (rNum <= 255 && gNum <= 255 && bNum <= 255) {
      const r = rNum.toString(16).padStart(2, '0');
      const g = gNum.toString(16).padStart(2, '0');
      const b = bNum.toString(16).padStart(2, '0');
      return `#${r}${g}${b}`.toLowerCase();
    }
  }
  const NAMED_COLORS: Record<string, string> = {
    white: '#ffffff', black: '#000000', gold: '#d4af37', silver: '#c0c0c0',
    bronze: '#cd7f32', burgundy: '#720925', maroon: '#800000', navy: '#0f172a',
    cream: '#faf7f2', beige: '#fffbeb', emerald: '#064e3b', purple: '#4a044e',
    rose: '#9f1239', pink: '#fda4af', champagne: '#f59e0b', red: '#dc2626',
    blue: '#2563eb', green: '#16a34a', yellow: '#eab308', gray: '#6b7280',
    'عنابي': '#720925', 'ذهبي': '#d4af37', 'ذهب': '#d4af37', 'ابيض': '#ffffff',
    'أبيض': '#ffffff', 'اسود': '#000000', 'أسود': '#000000', 'كحلي': '#0f172a',
    'زمردي': '#064e3b', 'وردي': '#fda4af', 'كريمي': '#faf7f2', 'بيج': '#fffbeb',
  };
  return NAMED_COLORS[clean] || null;
}
