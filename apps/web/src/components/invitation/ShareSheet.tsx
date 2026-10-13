'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, MessageCircle, Facebook, Send } from 'lucide-react';
import { createGuestShareWhatsAppMessage, getWhatsAppUrl } from '@/lib/whatsapp';
import { recordPublicAnalytics } from '@/lib/api';

interface ShareSheetProps {
  coupleNames: string;
  invitationUrl: string;
  primaryColor?: string;
  invitationId?: string;
}

export function ShareSheet({
  coupleNames,
  invitationUrl,
  primaryColor = '#720925',
  invitationId,
}: ShareSheetProps) {
  const [copied, setCopied] = useState(false);

  const shareText = createGuestShareWhatsAppMessage(coupleNames, invitationUrl);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    invitationUrl
  )}`;

  const trackShare = () => {
    if (invitationId) {
      recordPublicAnalytics({ invitationId, eventType: 'share_click' });
    }
  };

  const handleCopy = () => {
    trackShare();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(invitationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    trackShare();
    if (navigator?.share) {
      try {
        await navigator.share({
          title: `دعوة فرح ${coupleNames} ❤️`,
          text: `فرحتنا قربت ويسعدنا حضوركم لتشاركونا أجمل لحظات حياتنا (${coupleNames})`,
          url: invitationUrl,
        });
      } catch (e) {
        // user cancelled or share unsupported
      }
    } else {
      handleCopy();
    }
  };

  return (
    <section className="py-10 px-4 max-w-xl mx-auto text-center space-y-6">
      <div className="space-y-1">
        <h3 className="text-xl font-black text-stone-900 font-cairo theme-heading">
          شاركوا فرحتنا مع من تحبون
        </h3>
        <p className="text-xs text-stone-500 theme-muted">
          أرسلوا رابط الدعوة إلى الأهل والأصدقاء بلمسة واحدة
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* WhatsApp Share */}
        <a
          suppressHydrationWarning
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>مشاركة عبر واتساب</span>
        </a>

        {/* Facebook Share */}
        <a
          suppressHydrationWarning
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          <Facebook className="w-4 h-4 fill-current" />
          <span>فيسبوك</span>
        </a>

        {/* Native Mobile Share */}
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          <Share2 className="w-4 h-4" />
          <span>مشاركة عامة</span>
        </button>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>تم نسخ الرابط!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-stone-500" />
              <span>نسخ الرابط</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
