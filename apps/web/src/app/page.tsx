import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { LiveInvitationPreview } from '@/components/landing/LiveInvitationPreview';
import { InvitationTypes } from '@/components/landing/InvitationTypes';
import { DemoGallery } from '@/components/landing/DemoGallery';
import { WhyFarahna } from '@/components/landing/WhyFarahna';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { MultiEventJourneyExplainer } from '@/components/landing/MultiEventJourneyExplainer';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ThemesGallery } from '@/components/landing/ThemesGallery';
import { MapLocationPreview } from '@/components/landing/MapLocationPreview';
import { PricingSection } from '@/components/landing/PricingSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { WhatsAppCallToAction } from '@/components/landing/WhatsAppCallToAction';
import { Footer } from '@/components/landing/Footer';
import { fetchSiteSettings } from '@/lib/api';
import { LandingJsonLd } from '@/components/seo/LandingJsonLd';

export const revalidate = 60; // Revalidate every minute

export default async function LandingPage() {
  const settings = await fetchSiteSettings();
  const whatsappNumber =
    settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '201012345678';
  const supportPhone =
    settings?.supportPhone || process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+201012345678';

  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#FAF7F2] text-stone-900 selection:bg-rose-100 selection:text-[#720925]">
      {/* JSON-LD Structured Data (Organization, Service, FAQPage) */}
      <LandingJsonLd whatsappNumber={whatsappNumber} />

      {/* Top Sticky Navigation */}
      <Navbar whatsappNumber={whatsappNumber} />

      {/* 1. Hero */}
      <Hero whatsappNumber={whatsappNumber} />

      {/* 2. Live Invitation Preview (Interactive Open Envelope Simulation) */}
      <LiveInvitationPreview />

      {/* 3. Invitation Types (Wedding, Henna, Katb Ketab, Engagement) */}
      <InvitationTypes whatsappNumber={whatsappNumber} />

      {/* 4. Demo Gallery (Realistic Egyptian Couples Showcase) */}
      <DemoGallery whatsappNumber={whatsappNumber} />

      {/* 5. Why Farahna (Value proposition & Differentiators) */}
      <WhyFarahna whatsappNumber={whatsappNumber} />

      {/* 6. Features Grid (Rich Interactive Elements) */}
      <FeaturesGrid />

      {/* 7. Multi-Event Journey Explainer (One Link for All Stages) */}
      <MultiEventJourneyExplainer />

      {/* 8. How It Works (4 Simple Steps with InstaPay Transparency) */}
      <HowItWorks />

      {/* 9. Themes Showcase Gallery */}
      <ThemesGallery whatsappNumber={whatsappNumber} />

      {/* 10. Map / Location Preview (GPS & One-Tap Google Maps) */}
      <MapLocationPreview whatsappNumber={whatsappNumber} />

      {/* 11. Pricing Section (Informational Only) */}
      <PricingSection whatsappNumber={whatsappNumber} />

      {/* 12. FAQ Section */}
      <FaqSection />

      {/* Natural SEO Keywords & Editorial Context */}
      <section className="py-12 bg-white/70 border-t border-stone-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3 font-cairo">
          <h2 className="text-lg font-black text-stone-800">
            فرحنا — المنصة المصرية الأولى لتصميم دعوات أفراح إلكترونية ورقمية فاخرة
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed max-w-2xl mx-auto">
            سواء كنت تستعد لطلب <strong>دعوة فرح إلكترونية</strong> أو <strong>دعوة زفاف إلكترونية</strong>، نوفر لك إمكانية تصميم <strong>دعوة خطوبة</strong>، <strong>دعوة حنة</strong>، أو <strong>دعوة كتب كتاب</strong> تحت رابط واحد أنيق. نمنحك تجربة مميزة لإرسال <strong>دعوة فرح واتساب</strong> تجمع بين روعة التصميم ودقة <strong>دعوة زفاف رقمية</strong> و<strong>دعوة فرح اونلاين</strong> تناسب أرقى <strong>دعوات أفراح مصرية</strong> مع ميزة تأكيد الحضور (RSVP) والخريطة التفاعلية.
          </p>
        </div>
      </section>

      {/* 13. WhatsApp Call To Action (High-Conversion Pre-Footer Banner) */}
      <WhatsAppCallToAction whatsappNumber={whatsappNumber} />

      {/* 14. Footer */}
      <Footer whatsappNumber={whatsappNumber} supportPhone={supportPhone} />
    </main>
  );
}
