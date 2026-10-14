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
  whatsappPhone,
  primaryColor = '#720925',
  invitationId,
}: WhatsAppContactSectionProps) {
  if (!whatsappPhone || typeof whatsappPhone !== 'string' || !whatsappPhone.trim()) {
    return null;
  }

  const rawPhone = whatsappPhone.trim();
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  if (!cleanPhone || cleanPhone.length < 5) {
    return null;
  }

  const message = `السلام عليكم ورحمة الله وبركاته 🌹
بخصوص بطاقة دعوة الفرح (${coupleNames})، حابب استفسر عن بعض التفاصيل.`;

  const waUrl = getWhatsAppUrl(cleanPhone, message);

  const handleClick = () => {
    if (invitationId) {
      recordPublicAnalytics({ invitationId, eventType: 'whatsapp_click' });
    }
  };

  return (
    <section className="py-6 px-4 max-w-xl mx-auto text-center space-y-3">
      <p className="text-xs text-stone-500 font-medium theme-muted">
        لأي استفسار أو تواصل مباشر مع أصحاب الفرح
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
        <span>تواصل عبر واتساب مع أصحاب الدعوة 💬</span>
      </a>
    </section>
  );
}
