'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Sparkles } from 'lucide-react';
import { getWhatsAppUrl, createInquiryWhatsAppMessage } from '@/lib/whatsapp';

interface NavbarProps {
  whatsappNumber?: string;
}

export function Navbar({ whatsappNumber = '201012345678' }: NavbarProps) {
  const whatsappUrl = getWhatsAppUrl(whatsappNumber, createInquiryWhatsAppMessage());

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-stone-200/60 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl burgundy-gradient-bg flex items-center justify-center text-white shadow-md shadow-rose-950/20 group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6 fill-rose-300 text-rose-300 animate-pulse" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-[#720925] flex items-center gap-1.5 font-cairo">
              فرحنا
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-normal">
                Farahna
              </span>
            </span>
            <p className="text-[11px] text-stone-500 font-medium">دعوات أفراح إلكترونية مخصصة</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-stone-700">
          <a href="#journey" className="hover:text-[#720925] transition-colors">
            رحلة الفرح
          </a>
          <a href="#themes" className="hover:text-[#720925] transition-colors">
            نماذج التصاميم
          </a>
          <a href="#features" className="hover:text-[#720925] transition-colors">
            المميزات
          </a>
          <a href="#how-it-works" className="hover:text-[#720925] transition-colors">
            كيف نعمل؟
          </a>
          <a href="#pricing" className="hover:text-[#720925] transition-colors">
            الأسعار
          </a>
          <a href="#faq" className="hover:text-[#720925] transition-colors">
            الأسئلة الشائعة
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/login"
            className="hidden sm:inline-flex text-xs font-bold text-stone-600 hover:text-stone-900 px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
          >
            لوحة الإدارة
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full burgundy-gradient-bg text-white font-bold text-sm shadow-lg shadow-rose-950/20 hover:shadow-rose-950/30 hover:opacity-95 transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>تواصل على واتساب</span>
          </a>
        </div>
      </div>
    </header>
  );
}
