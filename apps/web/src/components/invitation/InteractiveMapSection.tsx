'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { FarahnaMap } from '../map/FarahnaMap';

export interface InteractiveMapSectionProps {
  venueName?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string | null;
  openStreetMapUrl?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  invitationId?: string;
}

export function InteractiveMapSection({
  venueName = 'قاعة الفرح',
  address = 'القاهرة، مصر',
  latitude,
  longitude,
  googleMapsUrl,
  openStreetMapUrl,
  primaryColor = '#720925',
  secondaryColor = '#D4AF37',
  invitationId,
}: InteractiveMapSectionProps) {
  return (
    <section className="py-8 px-4 max-w-3xl mx-auto space-y-5 text-right font-cairo">
      <div className="text-center space-y-1.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
          <MapPin className="w-3.5 h-3.5 text-amber-700" />
          <span>موقع المناسبة والوصول</span>
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
          خريطة الوصول التفاعلية
        </h3>
        <p className="text-xs text-stone-500">
          استكشف موقع القاعة عبر OpenStreetMap أو ابدأ الملاحة عبر Google Maps
        </p>
      </div>

      <FarahnaMap
        venueName={venueName}
        address={address}
        latitude={latitude}
        longitude={longitude}
        googleMapsUrl={googleMapsUrl}
        openStreetMapUrl={openStreetMapUrl}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        invitationId={invitationId}
      />
    </section>
  );
}
