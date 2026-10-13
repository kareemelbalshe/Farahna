'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Sparkles, Music, MapPin, Calendar, Check, Volume2, ArrowLeft, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

export function LiveInvitationPreview() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'wedding' | 'henna' | 'katb_ketab'>('wedding');

  const handleOpen = () => {
    setIsOpen(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#720925', '#FFFFFF'],
      });
    } catch (e) {}
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-[#FAF7F2] to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-[#720925] border border-rose-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            معاينة حية وتفاعلية
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight font-cairo">
            جرب تجربة الضيف بنفسك الآن <br />
            <span className="text-[#720925]">انقر لفتح الظرف وعيش إحساس الفرحة</span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            شاهد كيف يستلم معازيمكم الدعوة على هواتفهم، مع المؤثرات الصوتية والمواعيد التفاعلية.
          </p>
        </div>

        {/* Mobile Mockup Simulator */}
        <div className="mt-12 flex justify-center">
          <div className="relative w-full max-w-sm sm:max-w-md">
            {/* Phone Outer Shell */}
            <div className="relative mx-auto border-[10px] border-stone-900 rounded-[48px] shadow-2xl bg-[#FAF7F2] overflow-hidden min-h-[580px] flex flex-col justify-between p-6">
              {/* Speaker Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-stone-900 rounded-full z-20 flex items-center justify-center">
                <div className="w-10 h-1 bg-stone-700 rounded-full" />
              </div>

              {!isOpen ? (
                /* Closed Envelope State */
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 pt-6">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-700">إلى من يهمهم فرحتنا ❤️</span>
                    <h3 className="text-2xl font-black text-stone-900 font-cairo">
                      دعوة زفاف أحمد وسارة
                    </h3>
                    <p className="text-xs text-stone-500 font-amiri">فندق ماريوت الزمالك — القاهرة</p>
                  </div>

                  {/* Royal 3D Wax Seal Graphic */}
                  <div className="relative my-3">
                    {/* Satin Ribbons */}
                    <div className="absolute top-[80%] left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 pointer-events-none -z-10">
                      <div
                        className="w-2.5 h-8 bg-gradient-to-b from-[#8C0B2A] to-[#540619] shadow-md transform -rotate-12 origin-top"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}
                      />
                      <div
                        className="w-2.5 h-8 bg-gradient-to-b from-[#8C0B2A] to-[#540619] shadow-md transform rotate-12 origin-top"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleOpen}
                      className="w-24 h-24 rounded-full border-2 border-amber-300 shadow-2xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                      style={{
                        background: 'radial-gradient(circle at 35% 35%, #B5183F 0%, #800A25 50%, #4D0313 100%)',
                        boxShadow: '0 12px 28px rgba(0,0,0,0.4), 0 0 20px rgba(212,175,55,0.45)',
                      }}
                    >
                      <div className="w-20 h-20 rounded-full border border-dashed border-amber-300/80 flex flex-col items-center justify-center text-amber-200">
                        <Crown className="w-5 h-5 text-amber-300 mb-0.5" />
                        <Heart className="w-4 h-4 fill-amber-300 text-amber-300" />
                      </div>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpen}
                    className="relative group overflow-hidden px-6 py-2.5 rounded-full font-black text-xs bg-gradient-to-r from-[#720925] via-[#8E1032] to-[#500619] text-white border border-amber-300/80 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-gold-shimmer pointer-events-none" />
                    <span>اضغط لفض الختم وفتح الدعوة 💌</span>
                  </button>
                </div>
              ) : (
                /* Opened Invitation State */
                <div className="flex-1 flex flex-col space-y-4 pt-6 text-right animate-fade-in-up">
                  <div className="text-center space-y-2 pb-3 border-b border-stone-200">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-[#720925]">
                      👑 تم فتح الدعوة بنجاح
                    </span>
                    <h3 className="text-2xl font-black text-[#720925] font-cairo">
                      أحمد محمود &amp; سارة إبراهيم
                    </h3>
                    <p className="text-[11px] text-stone-600 font-amiri italic">
                      "يسعدنا ويشرفنا حضوركم لتشاركونا أجمل لحظات حياتنا"
                    </p>
                  </div>

                  {/* Multi-event switcher inside simulator */}
                  <div className="flex justify-center gap-1.5 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveTab('wedding')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        activeTab === 'wedding'
                          ? 'bg-[#720925] text-white shadow-xs'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      ليلة العمر 👑
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('henna')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        activeTab === 'henna'
                          ? 'bg-[#720925] text-white shadow-xs'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      ليلة الحنة 🌿
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('katb_ketab')}
                      className={`px-3 py-1.5 rounded-xl transition-all ${
                        activeTab === 'katb_ketab'
                          ? 'bg-[#720925] text-white shadow-xs'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      كتب الكتاب 📜
                    </button>
                  </div>

                  {/* Event Details Card */}
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
                    {activeTab === 'wedding' && (
                      <>
                        <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                          <Calendar className="w-4 h-4 text-amber-600" />
                          <span>الجمعة ٢٠ نوفمبر ٢٠٢٦ — ٨:٠٠ م</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                          <MapPin className="w-4 h-4 text-[#720925]" />
                          <span>فندق ماريوت الزمالك — قاعة عايدة</span>
                        </div>
                        <p className="text-[11px] text-stone-500">حفل الزفاف والزفة الكبرى والعشاء الملكي.</p>
                      </>
                    )}
                    {activeTab === 'henna' && (
                      <>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <span>الثلاثاء ١٧ نوفمبر ٢٠٢٦ — ٥:٠٠ م</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                          <MapPin className="w-4 h-4 text-[#720925]" />
                          <span>قاعة اللوتس — مصر الجديدة</span>
                        </div>
                        <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          🌿 سهرة خاصة بالسيدات فقط
                        </span>
                      </>
                    )}
                    {activeTab === 'katb_ketab' && (
                      <>
                        <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                          <Calendar className="w-4 h-4 text-amber-600" />
                          <span>الخميس ١٩ نوفمبر ٢٠٢٦ — ٤:٣٠ م</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                          <MapPin className="w-4 h-4 text-[#720925]" />
                          <span>مسجد الشرطة — التجمع الخامس</span>
                        </div>
                        <p className="text-[11px] text-stone-500">عقد القران المبارك على كتاب الله وسنة رسوله.</p>
                      </>
                    )}
                  </div>

                  {/* Reset button to re-experience */}
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="text-[11px] text-stone-400 hover:text-stone-700 underline"
                    >
                      إعادة تجربة فتح الظرف ↺
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Full Demo Link */}
              <div className="pt-4 border-t border-stone-200/80">
                <Link
                  href="/invitation/wedding/ahmed-sara"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl burgundy-gradient-bg text-white font-bold text-xs shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity"
                >
                  <span>افتح الدعوة الكاملة في صفحة مستقلة</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
