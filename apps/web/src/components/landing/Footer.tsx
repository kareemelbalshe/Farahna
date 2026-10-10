'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Phone, Instagram, Facebook } from 'lucide-react';
import { getWhatsAppUrl, createInquiryWhatsAppMessage } from '@/lib/whatsapp';

interface FooterProps {
  whatsappNumber?: string;
  supportPhone?: string;
}

export function Footer({
  whatsappNumber = '201019262075',
  supportPhone = '+201019262075',
}: FooterProps) {
  const whatsappUrl = getWhatsAppUrl(whatsappNumber, createInquiryWhatsAppMessage());

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
              <li>
                <Link
                  href="/admin/login"
                  className="hover:text-stone-400 text-stone-500 transition-colors text-[11px]"
                >
                  دخول لوحة تحكم المشرفين
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
            <div className="space-y-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 font-bold"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>واتساب: {whatsappNumber}</span>
              </a>
              <div className="text-xs text-stone-400 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>هاتف: {supportPhone}</span>
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
