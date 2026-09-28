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
 * Extracts latitude and longitude from Google Maps URLs or direct coordinate strings.
 * Supports:
 * - Direct coordinate string: "30.0571, 31.2248" or "30.0571 31.2248"
 * - Place with @lat,lng: https://www.google.com/maps/place/Marriott/@30.0571,31.2248,17z/...
 * - Query param q=lat,lng: https://maps.google.com/?q=30.0571,31.2248 or ?q=loc:30.0571,31.2248
 * - Param ll=lat,lng: https://www.google.com/maps?ll=30.0571,31.2248
 * - Search API: https://www.google.com/maps/search/?api=1&query=30.0571,31.2248
 * - Directions API destination: destination=30.0571,31.2248
 * - Protobuf coordinates: !3d30.0571!4d31.2248
 */
export function extractCoordinatesFromUrl(urlOrText: string): Coordinates | null {
  if (!urlOrText || typeof urlOrText !== 'string') {
    return null;
  }

  const clean = urlOrText.trim();

  // 1. Direct "lat, lng" string
  const directMatch = clean.match(/^([+-]?\d{1,2}(?:\.\d+)?)[,\s]+([+-]?\d{1,3}(?:\.\d+)?)$/);
  if (directMatch) {
    const lat = parseFloat(directMatch[1]);
    const lng = parseFloat(directMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  // 2. Pattern: @lat,lng
  const atMatch = clean.match(/@([+-]?\d{1,2}\.\d+),([+-]?\d{1,3}\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  // 3. Pattern: q=lat,lng or query=lat,lng or ll=lat,lng or destination=lat,lng
  const queryMatch = clean.match(/(?:[?&](?:q|query|ll|destination)=(?:loc:)?)([+-]?\d{1,2}\.\d+)[,+]([+-]?\d{1,3}\.\d+)/i);
  if (queryMatch) {
    const lat = parseFloat(queryMatch[1]);
    const lng = parseFloat(queryMatch[2]);
    if (isValidCoordinates(lat, lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  // 4. Pattern: Google Maps Embed / Protobuf parameters (!3d = lat, !2d/!4d = lng)
  const d3Match = clean.match(/!3d([+-]?\d{1,2}\.\d+)/);
  const d2Match = clean.match(/![24]d([+-]?\d{1,3}\.\d+)/);
  if (d3Match && d2Match) {
    const lat = parseFloat(d3Match[1]);
    const lng = parseFloat(d2Match[1]);
    if (isValidCoordinates(lat, lng)) {
      return { latitude: lat, longitude: lng };
    }
  }

  return null;
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

  if (isValidCoordinates(latitude, longitude)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  }

  if (googleMapsUrl && googleMapsUrl.startsWith('http')) {
    return googleMapsUrl;
  }

  const queryParts = [venueName, address].filter(Boolean).join(' ');
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
