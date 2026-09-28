'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface LeafletMapViewProps {
  latitude: number;
  longitude: number;
  venueName: string;
  address: string;
  primaryColor?: string;
  zoom?: number;
}

export default function LeafletMapView({
  latitude,
  longitude,
  venueName,
  address,
  primaryColor = '#720925',
  zoom = 15,
}: LeafletMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      // 1. Initialize Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: false, // Prevent page scroll interception
        attributionControl: true,
      });

      // 2. Add OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
      }).addTo(map);

      // 3. Custom luxury Farahna Pin (Gold & Burgundy SVG DivIcon)
      const customPinIcon = L.divIcon({
        className: 'custom-farahna-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
            <div style="position: absolute; width: 42px; height: 42px; border-radius: 50%; background: ${primaryColor}40; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 36px; height: 36px; border-radius: 50%; background: ${primaryColor}; border: 3px solid #D4AF37; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 40],
        popupAnchor: [0, -36],
      });

      // 4. Add Marker with Rich Popup
      const marker = L.marker([latitude, longitude], { icon: customPinIcon }).addTo(map);

      const popupContent = `
        <div style="text-align: right; direction: rtl; padding: 4px; font-family: Cairo, sans-serif;">
          <strong style="display: block; font-weight: 800; font-size: 13px; color: ${primaryColor}; margin-bottom: 2px;">
            📍 ${venueName}
          </strong>
          <span style="font-size: 11px; color: #57534e; line-height: 1.4; display: block;">
            ${address}
          </span>
        </div>
      `;

      marker.bindPopup(popupContent).openPopup();

      mapInstanceRef.current = map;

      // Invalidate size to ensure proper rendering after container layout settles
      const timeout = setTimeout(() => {
        map.invalidateSize();
      }, 250);

      return () => {
        clearTimeout(timeout);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } catch (err) {
      console.error('Error initializing Leaflet map:', err);
    }
  }, [latitude, longitude, venueName, address, primaryColor, zoom]);

  return <div ref={mapContainerRef} className="w-full h-full min-h-[260px] sm:min-h-[320px] rounded-2xl" />;
}
