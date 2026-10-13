import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { WhyFarahna } from '@/components/landing/WhyFarahna';
import { ThemesGallery } from '@/components/landing/ThemesGallery';
import { DemoGallery } from '@/components/landing/DemoGallery';
import { InvitationTypes } from '@/components/landing/InvitationTypes';
import { MultiEventJourneyExplainer } from '@/components/landing/MultiEventJourneyExplainer';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { PricingSection } from '@/components/landing/PricingSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { LocalGeoSeoSection } from '@/components/landing/LocalGeoSeoSection';
import { WhatsAppCallToAction } from '@/components/landing/WhatsAppCallToAction';
import { Footer } from '@/components/landing/Footer';
import { fetchSiteSettings } from '@/lib/api';
import { LandingJsonLd } from '@/components/seo/LandingJsonLd';

export const revalidate = 60; // Revalidate every minute

export default async function LandingPage() {
  const settings = await fetchSiteSettings();
  const whatsappNumber =
    settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201019262075';
  const supportPhone =
    settings?.supportPhone || process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+201019262075';

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col justify-between bg-[#FAF7F2] text-stone-900 selection:bg-rose-100 selection:text-[#720925]">
      {/* 1. Enhanced Local SEO & Geo JSON-LD Structured Data */}
      <LandingJsonLd whatsappNumber={whatsappNumber} />

      {/* 2. Top Sticky Navigation */}
      <Navbar whatsappNumber={whatsappNumber} />

      {/* 3. Hero — Hook, Trust Badges & Direct CTAs */}
      <Hero whatsappNumber={whatsappNumber} />

      {/* 4. Why Farahna — The Value Proposition & Digital vs Paper Comparison */}
      <WhyFarahna whatsappNumber={whatsappNumber} />

      {/* 5. Themes Showcase — 5 Visual Styles with Audio Signatures & Wax Seals */}
      <ThemesGallery whatsappNumber={whatsappNumber} />

      {/* 6. Package Demos — Live Interactive Demos */}
      <DemoGallery whatsappNumber={whatsappNumber} />

      {/* 6. Invitation Types — Deep Dive into Wedding, Henna, Katb Ketab & Engagement */}
      <InvitationTypes whatsappNumber={whatsappNumber} />

      {/* 7. Multi-Event Journey Explainer — The Superpower: All Milestones in One Smart Link */}
      <MultiEventJourneyExplainer />

      {/* 8. Features Grid — 9 Rich Interactive Capabilities (RSVP, GPS, Music, Countdown, Privacy) */}
      <FeaturesGrid />

      {/* 9. How It Works — 4 Simple Steps with Complete Transparency */}
      <HowItWorks />

      {/* 10. Pricing & Packages — Honest, Clear Pricing with InstaPay Guarantee */}
      <PricingSection whatsappNumber={whatsappNumber} />

      {/* 11. FAQ — Comprehensive Answers to All Egyptian & Arab Wedding Questions */}
      <FaqSection />

      {/* 12. Local Geo-SEO — Governorates, Hubs, Venues & Targeted Search Visibility */}
      <LocalGeoSeoSection />

      {/* 13. Pre-Footer High-Conversion WhatsApp CTA */}
      <WhatsAppCallToAction whatsappNumber={whatsappNumber} />

      {/* 14. Footer — Corporate Info, Support Phone & Quick Links */}
      <Footer whatsappNumber={whatsappNumber} supportPhone={supportPhone} />
    </main>
  );
}
