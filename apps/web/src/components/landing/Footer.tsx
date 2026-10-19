'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Phone, Instagram, Facebook } from 'lucide-react';
import { getWhatsAppUrl, createInquiryWhatsAppMessage } from '@/lib/whatsapp';
import { FARAHNA_SOCIAL_LINKS } from '@farahna/shared';

interface FooterProps {
  whatsappNumber?: string;
  supportPhone?: string;
}

export function Footer({
  whatsappNumber = '201019262075',
  supportPhone = '+201019262075',
}: FooterProps) {
  // Official communication number is strictly +20 10 1926 2075
  const contactWhatsApp =
    whatsappNumber && !whatsappNumber.includes('64906723')
      ? whatsappNumber.replace(/[^0-9]/g, '')
      : '201019262075';
  const whatsappUrl = getWhatsAppUrl(contactWhatsApp, createInquiryWhatsAppMessage());

  return (
    <footer className="bg-stone-950 text-white pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800 text-right">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl burgundy-gradient-bg flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-rose-300 text-rose-300" />
              </div>
              <span className="text-2xl font-black font-cairo">فرحنا</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-normal">
              المنصة المصرية الرائدة في تصميم دعوات الأفراح والمناسبات الإلكترونية الفاخرة بأسلوب شخصي متفرد يجمع كل تفاصيل فرحتكم في لينك واحد.
            </p>
            <div className="pt-2">
              <a
                href="https://menuflowx.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>إحدى خدمات شبكة MenuFlowX الرقمية</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-300 font-cairo">روابط سريعة</h4>
            <ul className="space-y-2 text-xs text-stone-300 font-medium">
              <li>
                <a href="#journey" className="hover:text-white transition-colors">
                  رحلة الفرح (Multi-Event)
                </a>
              </li>
              <li>
                <a href="#themes" className="hover:text-white transition-colors">
                  تصاميم الثيمات
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  المميزات التقنية
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  باقات الأسعار
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  الأسئلة الشائعة
                </a>
              </li>
            </ul>
          </div>

          {/* Demos */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-300 font-cairo">نماذج حية تعمل الآن</h4>
            <ul className="space-y-2 text-xs text-stone-300 font-medium">
              <li>
                <Link
                  href="/invitation/wedding/ahmed-sara"
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <span>👑 زفاف أحمد وسارة (٤ مناسبات كاملة)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/invitation/engagement/omar-salma"
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <span>💍 خطوبة عمر وسلمى (ثيم ذهبي فاخر)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-amber-300 font-cairo">تواصل معنا</h4>
            <p className="text-xs text-stone-400">
              متاحون للرد على استفساراتكم وتصميم دعوتكم على مدار الأسبوع عبر واتساب.
            </p>
            <div className="space-y-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                <span className="inline-flex items-center gap-1.5 text-xs">
                  <span>واتساب:</span>
                  <bdi dir="ltr" className="font-mono font-bold tracking-wide">+20 10 1926 2075</bdi>
                </span>
              </a>

              <a
                href="tel:+201019262075"
                className="text-xs text-stone-300 hover:text-white flex items-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0 text-amber-400" />
                <span className="inline-flex items-center gap-1.5 text-xs">
                  <span>هاتف:</span>
                  <bdi dir="ltr" className="font-mono font-bold tracking-wide">+20 10 1926 2075</bdi>
                </span>
              </a>

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <a
                  href={FARAHNA_SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-[#1877F2] text-stone-300 hover:text-white transition-all text-xs font-bold border border-stone-800"
                  title="صفحة فيسبوك"
                >
                  <Facebook className="w-3.5 h-3.5 fill-current" />
                  <span>فيسبوك</span>
                </a>
                <a
                  href={FARAHNA_SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-[#DD2A7B] text-stone-300 hover:text-white transition-all text-xs font-bold border border-stone-800"
                  title="حساب إنستجرام @farahna.10"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span className="font-sans">{FARAHNA_SOCIAL_LINKS.instagramHandle}</span>
                </a>
                {FARAHNA_SOCIAL_LINKS.googlePlay && (
                  <a
                    href={FARAHNA_SOCIAL_LINKS.googlePlay}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-emerald-950 text-emerald-400 hover:text-emerald-300 transition-all text-xs font-bold border border-stone-800 hover:border-emerald-600/50"
                    title="تحميل تطبيق فرحنا على Google Play"
                  >
                    <span>تطبيق Google Play</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-medium text-center sm:text-right">
          <p>© {new Date().getFullYear()} فرحنا (Farahna) — جميع الحقوق محفوظة لجمهورية مصر العربية.</p>
          <p className="text-[11px]">الدفع عبر InstaPay أو فودافون كاش • لا يتم خصم أي مبالغ أونلاين</p>
        </div>
      </div>
    </footer>
  );
}
