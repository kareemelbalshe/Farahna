'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Sparkles } from 'lucide-react';
import { getWhatsAppUrl, createInquiryWhatsAppMessage } from '@/lib/whatsapp';

interface NavbarProps {
  whatsappNumber?: string;
}

export function Navbar({ whatsappNumber = '201019262075' }: NavbarProps) {
  const whatsappUrl = getWhatsAppUrl(whatsappNumber, createInquiryWhatsAppMessage());

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-stone-200/60 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-rose-950/20 border border-amber-300/40 group-hover:scale-105 transition-transform">
            <img src="/favicon.png" alt="فرحنا - Farahna" className="w-full h-full object-cover" />
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
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/create"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all active:scale-95 border border-amber-400"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-950" />
            <span>صمم دعوتك بنفسك 🪄</span>
          </Link>
          <Link
            href="/admin/login"
            className="hidden lg:inline-flex text-xs font-bold text-stone-600 hover:text-stone-900 px-2.5 py-2 rounded-lg hover:bg-stone-100 transition-colors"
          >
            لوحة الإدارة
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full burgundy-gradient-bg text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-950/20 hover:shadow-rose-950/30 hover:opacity-95 transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>واتساب</span>
          </a>
        </div>
      </div>
    </header>
  );
}
