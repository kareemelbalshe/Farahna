'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Sparkles, Menu, X, Facebook, Instagram } from 'lucide-react';
import { getWhatsAppUrl, createInquiryWhatsAppMessage } from '@/lib/whatsapp';
import { FARAHNA_SOCIAL_LINKS } from '@farahna/shared';

interface NavbarProps {
  whatsappNumber?: string;
}

export function Navbar({ whatsappNumber = '201019262075' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const whatsappUrl = getWhatsAppUrl(whatsappNumber, createInquiryWhatsAppMessage());

  const navLinks = [
    { href: '#journey', label: 'رحلة الفرح' },
    { href: '#themes', label: 'نماذج التصاميم' },
    { href: '#features', label: 'المميزات' },
    { href: '#how-it-works', label: 'كيف نعمل؟' },
    { href: '#pricing', label: 'الأسعار' },
    { href: '#faq', label: 'الأسئلة الشائعة' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-stone-200/60 shadow-sm transition-all">
      {/* Top Announcement & Social Links Bar */}
      <div className="bg-[#720925] text-white text-[11px] py-1.5 px-4 border-b border-rose-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span className="hidden sm:inline">✨ صمم دعوة زفافك الملكية التفاعلية أو تابع أحدث أعمالنا</span>
            <span className="sm:hidden">✨ منصة فرحنا لدعوات الأعراس الملكية</span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <span className="text-amber-200/80 text-[10px] hidden md:inline">تابعونا:</span>
            <a
              href={FARAHNA_SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors py-0.5 px-2 rounded-md hover:bg-white/10"
              title="صفحة فرحنا الرسمية على فيسبوك"
            >
              <Facebook className="w-3.5 h-3.5 fill-current" />
              <span>فيسبوك</span>
            </a>
            <span className="opacity-30">|</span>
            <a
              href={FARAHNA_SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors py-0.5 px-2 rounded-md hover:bg-white/10"
              title="حساب إنستجرام الرسمي @farahna.10"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span className="font-sans">{FARAHNA_SOCIAL_LINKS.instagramHandle}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-md shadow-rose-950/20 border border-amber-300/40 group-hover:scale-105 transition-transform">
            <img src="/favicon.png" alt="فرحنا - Farahna" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#720925] flex items-center gap-1.5 font-cairo">
              فرحنا
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-normal">
                Farahna
              </span>
            </span>
            <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium">دعوات أفراح إلكترونية مخصصة</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-stone-700">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-[#720925] transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/create"
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all active:scale-95 border border-amber-400"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-950" />
            <span className="hidden xs:inline">صمم دعوتك</span>
            <span className="xs:hidden">صمم</span>
            <span>🪄</span>
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
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full burgundy-gradient-bg text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-950/20 hover:shadow-rose-950/30 hover:opacity-95 transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>واتساب</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="فتح القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-stone-900" /> : <Menu className="w-5 h-5 text-stone-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-stone-200 p-4 space-y-3 animate-fade-in shadow-xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-stone-700 hover:bg-stone-100 hover:text-[#720925] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
            {/* Social Follow Links */}
            <div className="grid grid-cols-2 gap-2 pb-1">
              <a
                href={FARAHNA_SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#1877F2]/10 text-[#1877F2] font-bold text-xs hover:bg-[#1877F2] hover:text-white transition-colors border border-[#1877F2]/20"
              >
                <Facebook className="w-4 h-4 fill-current" />
                <span>فيسبوك</span>
              </a>
              <a
                href={FARAHNA_SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-pink-50 text-[#DD2A7B] font-bold text-xs hover:bg-[#DD2A7B] hover:text-white transition-colors border border-pink-200"
              >
                <Instagram className="w-4 h-4" />
                <span className="font-sans">{FARAHNA_SOCIAL_LINKS.instagramHandle}</span>
              </a>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl burgundy-gradient-bg text-white font-bold text-xs shadow-md shadow-rose-950/20"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>تواصل مع المصمم عبر واتساب 💬</span>
            </a>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2 text-xs font-bold text-stone-500 hover:text-stone-900"
            >
              دخول لوحة تحكم الإدارة
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
