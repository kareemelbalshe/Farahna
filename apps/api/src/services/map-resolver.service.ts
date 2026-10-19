import {
  extractCoordinatesFromUrl,
  isValidCoordinates,
  isGoogleMapsShortUrl,
  getOpenStreetMapUrl,
  getGoogleMapsDirectionsUrl,
  resolveCityCoordinates,
  formatCoordinates,
  Coordinates,
} from '@farahna/shared';

export interface MapResolutionResult {
  resolved: boolean;
  latitude: number | null;
  longitude: number | null;
  googleMapsUrl: string;
  openStreetMapUrl: string | null;
  source?: 'direct' | 'url' | 'shortlink_redirect' | 'shortlink_html' | 'city_database' | 'nominatim_search' | 'none';
  formattedCoords?: string;
}

/**
 * Robust server-side location resolver that extracts and unifies coordinates
 * between Google Maps and OpenStreetMap without requiring manual user conversion.
 */
export async function resolveLocationCoordinates(options: {
  urlOrText?: string | null;
  venueName?: string | null;
  address?: string | null;
}): Promise<MapResolutionResult> {
  const { urlOrText, venueName, address } = options;
  const raw = (urlOrText || '').trim();

  // 1. Direct coordinate extraction from provided input (URL, coordinate string, etc.)
  if (raw) {
    const directCoords = extractCoordinatesFromUrl(raw);
    if (directCoords && isValidCoordinates(directCoords.latitude, directCoords.longitude)) {
      return {
        resolved: true,
        latitude: directCoords.latitude,
        longitude: directCoords.longitude,
        googleMapsUrl: raw.startsWith('http')
          ? raw
          : getGoogleMapsDirectionsUrl({
              latitude: directCoords.latitude,
              longitude: directCoords.longitude,
              venueName: venueName || undefined,
              address: address || undefined,
            }),
        openStreetMapUrl: getOpenStreetMapUrl(directCoords.latitude, directCoords.longitude),
        source: 'direct',
        formattedCoords: formatCoordinates(directCoords),
      };
    }
  }

  // 2. Unshorten mobile Google Maps share links (maps.app.goo.gl or goo.gl/maps)
  if (raw && (isGoogleMapsShortUrl(raw) || raw.includes('goo.gl') || raw.includes('maps.app'))) {
    try {
      const fullUrl = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const res = await fetch(fullUrl, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept-Language': 'ar,en;q=0.9',
        },
      });
      clearTimeout(timeoutId);

      // A: Final Redirected URL Inspection
      if (res.url && res.url !== fullUrl) {
        const fromFinalUrl = extractCoordinatesFromUrl(res.url);
        if (fromFinalUrl && isValidCoordinates(fromFinalUrl.latitude, fromFinalUrl.longitude)) {
          return {
            resolved: true,
            latitude: fromFinalUrl.latitude,
            longitude: fromFinalUrl.longitude,
            googleMapsUrl: res.url,
            openStreetMapUrl: getOpenStreetMapUrl(fromFinalUrl.latitude, fromFinalUrl.longitude),
            source: 'shortlink_redirect',
            formattedCoords: formatCoordinates(fromFinalUrl),
          };
        }
      }

      // B: HTML Body Meta Tags and Embed coordinates
      const html = await res.text();

      // Check staticmap query pattern
      const staticMatch =
        html.match(/staticmap\?center=([+-]?\d{1,2}\.\d+)%2C([+-]?\d{1,3}\.\d+)/i) ||
        html.match(/staticmap\?center=([+-]?\d{1,2}\.\d+),([+-]?\d{1,3}\.\d+)/i);
      if (staticMatch) {
        const lat = parseFloat(staticMatch[1]);
        const lng = parseFloat(staticMatch[2]);
        if (isValidCoordinates(lat, lng)) {
          const coords: Coordinates = { latitude: lat, longitude: lng };
          return {
            resolved: true,
            latitude: lat,
            longitude: lng,
            googleMapsUrl: fullUrl,
            openStreetMapUrl: getOpenStreetMapUrl(lat, lng),
            source: 'shortlink_html',
            formattedCoords: formatCoordinates(coords),
          };
        }
      }

      // Check @lat,lng pattern in body
      const atBodyMatch = html.match(/\/@([+-]?\d{1,2}\.\d+),([+-]?\d{1,3}\.\d+)/);
      if (atBodyMatch) {
        const lat = parseFloat(atBodyMatch[1]);
        const lng = parseFloat(atBodyMatch[2]);
        if (isValidCoordinates(lat, lng)) {
          const coords: Coordinates = { latitude: lat, longitude: lng };
          return {
            resolved: true,
            latitude: lat,
            longitude: lng,
            googleMapsUrl: fullUrl,
            openStreetMapUrl: getOpenStreetMapUrl(lat, lng),
            source: 'shortlink_html',
            formattedCoords: formatCoordinates(coords),
          };
        }
      }

      // Check Google Maps window state array pattern
      const stateMatch = html.match(/\[null,null,([+-]?\d{1,2}\.\d+),([+-]?\d{1,3}\.\d+)\]/);
      if (stateMatch) {
        const lat = parseFloat(stateMatch[1]);
        const lng = parseFloat(stateMatch[2]);
        if (isValidCoordinates(lat, lng)) {
          const coords: Coordinates = { latitude: lat, longitude: lng };
          return {
            resolved: true,
            latitude: lat,
            longitude: lng,
            googleMapsUrl: fullUrl,
            openStreetMapUrl: getOpenStreetMapUrl(lat, lng),
            source: 'shortlink_html',
            formattedCoords: formatCoordinates(coords),
          };
        }
      }
    } catch (err) {
      // Ignore network / timeout issues during unshortening
    }
  }

  // 3. Known Arab & Egyptian Locations Database (Major halls, hotels, districts)
  const venueAddressQuery = `${venueName || ''} ${address || ''}`.trim();
  if (venueAddressQuery) {
    const fromDict = resolveCityCoordinates(venueAddressQuery);
    if (fromDict && isValidCoordinates(fromDict.latitude, fromDict.longitude)) {
      return {
        resolved: true,
        latitude: fromDict.latitude,
        longitude: fromDict.longitude,
        googleMapsUrl:
          raw ||
          getGoogleMapsDirectionsUrl({
            latitude: fromDict.latitude,
            longitude: fromDict.longitude,
            venueName: venueName || undefined,
            address: address || undefined,
          }),
        openStreetMapUrl: getOpenStreetMapUrl(fromDict.latitude, fromDict.longitude),
        source: 'city_database',
        formattedCoords: formatCoordinates(fromDict),
      };
    }
  }

  // 4. OpenStreetMap Nominatim Geocoder Fallback (Server-side search)
  if (venueAddressQuery) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        venueAddressQuery
      )}&limit=1`;

      const nomRes = await fetch(nominatimUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Farahna-Platform/1.0 (contact@farahna.menuflowx.com)',
          'Accept-Language': 'ar,en',
        },
      });
      clearTimeout(timeoutId);

      if (nomRes.ok) {
        const data = (await nomRes.json()) as any[];
        if (Array.isArray(data) && data.length > 0 && data[0].lat && data[0].lon) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          if (isValidCoordinates(lat, lng)) {
            const coords: Coordinates = { latitude: lat, longitude: lng };
            return {
              resolved: true,
              latitude: lat,
              longitude: lng,
              googleMapsUrl:
                raw ||
                getGoogleMapsDirectionsUrl({
                  latitude: lat,
                  longitude: lng,
                  venueName: venueName || undefined,
                  address: address || undefined,
                }),
              openStreetMapUrl: getOpenStreetMapUrl(lat, lng),
              source: 'nominatim_search',
              formattedCoords: formatCoordinates(coords),
            };
          }
        }
      }
    } catch (err) {
      // Ignore geocoder timeout
    }
  }

  // Fallback unresolved
  return {
    resolved: false,
    latitude: null,
    longitude: null,
    googleMapsUrl: raw,
    openStreetMapUrl: null,
    source: 'none',
  };
}
