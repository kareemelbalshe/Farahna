'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  Compass,
  AlertCircle,
} from 'lucide-react';
import {
  isValidCoordinates,
  getGoogleMapsDirectionsUrl,
  getOpenStreetMapUrl,
  extractCoordinatesFromUrl,
  resolveCityCoordinates,
  isGoogleMapsShortUrl,
} from '@farahna/shared';
import { recordPublicAnalytics, resolveMapLocationApi } from '@/lib/api';

// Dynamically import Leaflet view without SSR
const LeafletMapView = dynamic(() => import('./LeafletMapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[260px] sm:min-h-[320px] bg-stone-100 rounded-2xl flex flex-col items-center justify-center space-y-3 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center text-stone-400">
        <Compass className="w-6 h-6 text-amber-600 animate-pulse" />
      </div>
      <span className="text-xs font-bold text-stone-500 font-cairo">
        جاري تحميل خريطة OpenStreetMap التفاعلية...
      </span>
    </div>
  ),
});

export interface FarahnaMapProps {
  venueName?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string | null;
  openStreetMapUrl?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
  showCardHeader?: boolean;
  invitationId?: string;
  isPreview?: boolean;
}

export function FarahnaMap({
  venueName = 'قاعة الفرح',
  address = 'القاهرة، مصر',
  latitude,
  longitude,
  googleMapsUrl,
  openStreetMapUrl,
  primaryColor = '#720925',
  secondaryColor = '#D4AF37',
  className = '',
  showCardHeader = false,
  invitationId,
  isPreview = false,
}: FarahnaMapProps) {
  const [copied, setCopied] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Direct coordinates from props
  const directValid = isValidCoordinates(latitude, longitude);

  // 2. Extracted coordinates from Google Maps URL or OpenStreetMap URL
  const urlCoords =
    !directValid
      ? (googleMapsUrl ? extractCoordinatesFromUrl(googleMapsUrl) : null) ||
        (openStreetMapUrl ? extractCoordinatesFromUrl(openStreetMapUrl) : null)
      : null;

  // 3. Fast city / venue name database resolution
  const cityCoords = !directValid && !urlCoords ? resolveCityCoordinates(`${venueName} ${address}`) : null;

  // Active resolved coordinates state
  const [resolvedCoords, setResolvedCoords] = useState<{ lat: number; lng: number } | null>(() => {
    if (directValid && latitude && longitude) return { lat: latitude, lng: longitude };
    if (urlCoords) return { lat: urlCoords.latitude, lng: urlCoords.longitude };
    if (cityCoords) return { lat: cityCoords.latitude, lng: cityCoords.longitude };
    return null;
  });

  // Re-sync and geocode whenever location inputs change
  useEffect(() => {
    if (directValid && latitude && longitude) {
      setResolvedCoords({ lat: latitude, lng: longitude });
      return;
    }

    if (googleMapsUrl) {
      const fromUrl = extractCoordinatesFromUrl(googleMapsUrl);
      if (fromUrl) {
        setResolvedCoords({ lat: fromUrl.latitude, lng: fromUrl.longitude });
        return;
      }
    }

    if (openStreetMapUrl) {
      const fromOsm = extractCoordinatesFromUrl(openStreetMapUrl);
      if (fromOsm) {
        setResolvedCoords({ lat: fromOsm.latitude, lng: fromOsm.longitude });
        return;
      }
    }

    const fromCity = resolveCityCoordinates(`${venueName} ${address}`);
    if (fromCity) {
      setResolvedCoords({ lat: fromCity.latitude, lng: fromCity.longitude });
      return;
    }

    // Call unified map resolver API to expand shortlinks (maps.app.goo.gl) or resolve location
    let isCancelled = false;
    const targetUrl = googleMapsUrl || openStreetMapUrl;
    if (targetUrl && (isGoogleMapsShortUrl(targetUrl) || targetUrl.includes('goo.gl') || targetUrl.includes('maps.app'))) {
      resolveMapLocationApi({ urlOrText: targetUrl, venueName, address })
        .then((res) => {
          if (!isCancelled && res?.success && res.data?.resolved && res.data.latitude && res.data.longitude) {
            setResolvedCoords({ lat: res.data.latitude, lng: res.data.longitude });
          }
        })
        .catch(() => {});
      return () => {
        isCancelled = true;
      };
    }

    // Try OpenStreetMap Nominatim geocoder asynchronously if still unresolved
    const query = [venueName, address].filter(Boolean).join(', ');
    if (query && typeof window !== 'undefined') {
      const controller = new AbortController();
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        {
          signal: controller.signal,
          headers: { 'Accept-Language': 'ar,en' },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0 && data[0].lat && data[0].lon) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            if (isValidCoordinates(lat, lng)) {
              setResolvedCoords({ lat, lng });
            }
          }
        })
        .catch(() => {});

      return () => controller.abort();
    }
  }, [latitude, longitude, googleMapsUrl, openStreetMapUrl, venueName, address, directValid]);

  const effectiveLat = resolvedCoords?.lat ?? (directValid ? latitude! : null);
  const effectiveLng = resolvedCoords?.lng ?? (directValid ? longitude! : null);
  const hasCoords = isValidCoordinates(effectiveLat, effectiveLng);

  // Lazy loading using IntersectionObserver to ensure fast mobile performance
  useEffect(() => {
    if (!containerRef.current) return;

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { rootMargin: '200px' }
      );

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    } else {
      // Fallback for older browsers
      setIsInView(true);
    }
  }, []);

  const handleCopy = () => {
    const text = `${venueName} - ${address}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const directionsUrl = getGoogleMapsDirectionsUrl({
    latitude: effectiveLat,
    longitude: effectiveLng,
    googleMapsUrl,
    venueName,
    address,
  });

  const handleMapClick = () => {
    if (invitationId) {
      recordPublicAnalytics({ invitationId, eventType: 'map_click' });
    }
  };

  const osmUrl =
    hasCoords && effectiveLat && effectiveLng
      ? openStreetMapUrl || getOpenStreetMapUrl(effectiveLat, effectiveLng)
      : `https://www.openstreetmap.org/search?query=${encodeURIComponent([venueName, address].filter(Boolean).join(' '))}`;

  // -------------------------------------------------------------
  // Case A: Missing or invalid coordinates -> Render Graceful Fallback Card
  // -------------------------------------------------------------
  if (!hasCoords) {
    return (
      <div
        ref={containerRef}
        className={`rounded-3xl bg-white border border-stone-200/90 shadow-sm p-6 space-y-5 text-right font-cairo ${className}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>موقع ومكان المناسبة</span>
            </span>
            <h3 className="text-xl font-black text-stone-900 mt-1">{venueName}</h3>
            <p className="text-xs text-stone-600 leading-relaxed">{address}</p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-amber-700" />
          </div>
        </div>

        {/* Notice that coordinates are in address mode */}
        <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-600 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-stone-500 shrink-0" />
          <span>تم تسجيل العنوان نصياً، يمكنك استعراضه مباشرة عبر تطبيق الخرائط.</span>
        </div>

        {/* Action Buttons for Fallback */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleMapClick}
            className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-xs shadow-md hover:opacity-95 transition-opacity"
            style={{ backgroundColor: primaryColor }}
          >
            <Navigation className="w-4 h-4" />
            <span>احصل على الاتجاهات 🚗</span>
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">تم نسخ العنوان بنجاح!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-500" />
                <span>نسخ العنوان</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Case B: Valid coordinates -> Render Leaflet + OpenStreetMap Map
  // -------------------------------------------------------------
  return (
    <div
      ref={containerRef}
      className={`rounded-3xl bg-white border border-stone-200/90 shadow-md overflow-hidden font-cairo ${className}`}
    >
      {showCardHeader && (
        <div className="p-5 border-b border-stone-100 flex items-center justify-between text-right">
          <div>
            <h3 className="text-base font-black text-stone-900">{venueName}</h3>
            <p className="text-xs text-stone-500">{address}</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>خريطة تفاعلية</span>
          </span>
        </div>
      )}

      {/* Embedded Leaflet Map Container */}
      <div className="relative w-full h-[260px] sm:h-[340px] bg-stone-100">
        {isInView && effectiveLat && effectiveLng ? (
          <LeafletMapView
            latitude={effectiveLat}
            longitude={effectiveLng}
            venueName={venueName}
            address={address}
            primaryColor={primaryColor}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 bg-[#FAF7F2]">
            <MapPin className="w-8 h-8 text-amber-700 animate-bounce" />
            <span className="text-xs font-bold text-stone-500">جاري تجهيز الخريطة التفاعلية...</span>
          </div>
        )}
      </div>

      {/* Two Main Action Buttons Below the Map (as specified) */}
      <div className="p-5 sm:p-6 space-y-3 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600 pb-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#720925] shrink-0" />
            <span className="font-bold text-stone-800">{venueName}:</span>
            <span className="text-stone-600">{address}</span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="text-[11px] font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">تم النسخ</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ العنوان</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Button 1: افتح الخريطة (OpenStreetMap) */}
          <a
            href={osmUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleMapClick}
            className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors border border-stone-200/80 shadow-xs"
          >
            <ExternalLink className="w-4 h-4 text-amber-700" />
            <span>افتح الخريطة (OpenStreetMap) 🗺️</span>
          </a>

          {/* Button 2: احصل على الاتجاهات (Google Maps Deep link) */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleMapClick}
            className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-xs shadow-md hover:opacity-95 transition-opacity"
            style={{ backgroundColor: primaryColor }}
          >
            <Navigation className="w-4 h-4" />
            <span>احصل على الاتجاهات (Google Maps) 🚗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
