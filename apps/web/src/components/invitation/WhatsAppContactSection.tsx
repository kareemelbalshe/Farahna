'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { recordPublicAnalytics } from '@/lib/api';

interface WhatsAppContactSectionProps {
  coupleNames: string;
  whatsappPhone?: string | null;
  primaryColor?: string;
  invitationId?: string;
}

export function WhatsAppContactSection({
  coupleNames,
  whatsappPhone = '201012345678',
  primaryColor = '#720925',
  invitationId,
}: WhatsAppContactSectionProps) {
  const phone = whatsappPhone || '201012345678';
  const message = `السلام عليكم ❤️
بخصوص دعوة فرح (${coupleNames})، حابب أبارك وأستفسر عن تفاصيل الحضور.`;

  const waUrl = getWhatsAppUrl(phone, message);

  const handleClick = () => {
    if (invitationId) {
      recordPublicAnalytics({ invitationId, eventType: 'whatsapp_click' });
    }
  };

  return (
    <section className="py-6 px-4 max-w-xl mx-auto text-center space-y-3">
      <p className="text-xs text-stone-500 font-medium">
        لديك استفسار أو ترغب بتهنئة العروسين مباشرة؟
      </p>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
        style={{ backgroundColor: '#25D366' }}
      >
        <MessageCircle className="w-4 h-4 fill-current" />
        <span>تواصل مع العروسين عبر واتساب ❤️</span>
      </a>
    </section>
  );
}
