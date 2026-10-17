'use client';

import React from 'react';
import { Sliders, Sparkles, AlertCircle } from 'lucide-react';

interface SectionsManagerStepProps {
  sectionsVisibility: Record<string, boolean>;
  toggleSection: (key: string) => void;
  setSectionsVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  parentsGroomAr: string;
  parentsBrideAr: string;
  setParentsGroomAr: (val: string) => void;
  setParentsBrideAr: (val: string) => void;
  whatsappContactPhone: string;
  setWhatsappContactPhone: (val: string) => void;
  customerPhone: string;
}

export const STUDIO_SECTION_ITEMS = [
  {
    key: 'cover',
    title: 'صورة الغلاف (Hero Cover) 🖼️',
    desc: 'البانر الترحيبي العريض في أعلى الدعوة مع البسملة الملكية ولقطة فوتوسيشن',
  },
  {
    key: 'couple',
    title: 'أسماء العروسين (Couple Names) 💍',
    desc: 'الاسمين بالعربي والإنجليزي في قلب البطاقة بخط الثلث والديواني',
  },
  {
    key: 'message',
    title: 'الآية القرآنية والرسالة الترحيبية 📖',
    desc: 'آية المودة والرحمة أو كلمة إهداء خاصة للضيوف والمعازيم',
  },
  {
    key: 'envelope',
    title: 'حركة فتح الظرف ثلاثي الأبعاد (3D Envelope) 💌',
    desc: 'الحركة السينمائية الملكية عند فتح الرابط مع الختم الشمعي الفاخر',
  },
  {
    key: 'countdown',
    title: 'العداد التنازلي التفاعلي (Countdown) ⏳',
    desc: 'عداد حي يحسب الأيام والساعات والدقائق المتبقية حتى ليلة العمر',
  },
  {
    key: 'events',
    title: 'تبويبات مناسبات رحلة الفرح (Multi-Events) 👑',
    desc: 'جدول مناسبات الخطوبة، الحنة، كتب الكتاب، والفرح برابط واحد',
  },
  {
    key: 'timeline',
    title: 'الجدول الزمني للفقرات (Timeline) ⏰',
    desc: 'مواعيد الاستقبال، الزفة الكبرى، البوفيه، وتورتة الفرح',
  },
  {
    key: 'venue',
    title: 'تفاصيل القاعة ومكان الحفل 🏛️',
    desc: 'اسم القاعة، العنوان بالتفصيل، وتوقيت بدء الحفل',
  },
  {
    key: 'map',
    title: 'الخريطة التفاعلية ورابط Maps 🗺️',
    desc: 'زر التوجيه المباشر عبر Google Maps وخريطة الموقع',
  },
  {
    key: 'music',
    title: 'الموسيقى والخلفية الصوتية 🎵',
    desc: 'تشغيل مقطع رومانسي تلقائياً (حذفه يجعل الدعوة صامتة تماماً)',
  },
  {
    key: 'rsvp',
    title: 'نموذج تأكيد الحضور (RSVP) 📝',
    desc: 'استقبال تأكيدات الحضور وحصر عدد الضيوف القادمين واعتذاراتهم',
  },
  {
    key: 'parents',
    title: 'إهداء أولياء الأمور والعائلات 👨‍👩‍👧‍👦',
    desc: 'أسماء آباء العروسين والعائلات الكريمة في الدعوة',
  },
  {
    key: 'couple_photo',
    title: 'صورة العروسين الشخصية (Portrait) 📸',
    desc: 'صورة العريس والعروسة الرسمية في قلب الدعوة',
  },
  {
    key: 'gallery',
    title: 'معرض ألبوم الصور والذكريات 🖼️',
    desc: 'ألبوم صور جلسة التصوير وفوتوسيشن الخطوبة',
  },
  {
    key: 'calendar',
    title: 'إضافة الموعد لتقويم الهاتف 📅',
    desc: 'زر حفظ الموعد في Google Calendar و Apple Calendar',
  },
  {
    key: 'whatsapp',
    title: 'زر التواصل السريع عبر واتساب 💬',
    desc: 'تمكين الضيوف من تهنئتكم أو الاستفسار مباشرة عبر واتساب',
  },
  {
    key: 'share',
    title: 'أزرار مشاركة الدعوة 🔗',
    desc: 'نسخ رابط الدعوة ومشاركته عبر واتساب وتطبيقات التواصل',
  },
];

export function SectionsManagerStep({
  sectionsVisibility,
  toggleSection,
  setSectionsVisibility,
  parentsGroomAr,
  parentsBrideAr,
  setParentsGroomAr,
  setParentsBrideAr,
  whatsappContactPhone,
  setWhatsappContactPhone,
  customerPhone,
}: SectionsManagerStepProps) {
  return (
    <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <label className="text-sm font-black text-stone-900 block flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#720925]" />
            <span>التحكم الشامل في أقسام الدعوة (تفعيل أو حذف أي سكشن) 🎛️</span>
          </label>
          <p className="text-[11px] text-stone-500 mt-0.5">
            يمكنك حذف أو إخفاء أي قسم لا تريده في دعوتك بنقرة واحدة لتظهر الدعوة وتفاصيلها على مزاجك تماماً:
          </p>
        </div>

        {/* Quick Bulk Actions */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              const allEnabled: Record<string, boolean> = {};
              STUDIO_SECTION_ITEMS.forEach((s) => {
                allEnabled[s.key] = true;
              });
              setSectionsVisibility(allEnabled);
            }}
            className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 transition-colors cursor-pointer"
          >
            تفعيل كافة الأقسام ✨
          </button>
          <button
            type="button"
            onClick={() => {
              // Minimal essentials: cover, couple, message, venue, map
              setSectionsVisibility({
                cover: true,
                couple: true,
                message: true,
                envelope: false,
                countdown: false,
                events: false,
                timeline: false,
                venue: true,
                map: true,
                music: false,
                rsvp: false,
                parents: false,
                couple_photo: false,
                gallery: false,
                calendar: false,
                whatsapp: false,
                share: true,
              });
            }}
            className="px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold transition-colors cursor-pointer"
          >
            الوضع الهادئ المختصر ⚡
          </button>
        </div>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {STUDIO_SECTION_ITEMS.map((sec) => {
          const isEnabled = sectionsVisibility[sec.key] !== false;
          return (
            <div
              key={sec.key}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 overflow-hidden ${
                isEnabled
                  ? 'bg-stone-50/70 border-stone-200 hover:border-amber-300'
                  : 'bg-rose-50/30 border-dashed border-rose-200 opacity-75'
              }`}
            >
              {/* Top Header: Title, Status Badge, and Toggle Action */}
              <div className="flex items-start justify-between gap-2 w-full">
                <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                  <span className="text-xs font-black text-stone-900 leading-snug">{sec.title}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isEnabled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {isEnabled ? 'مُفعّل' : 'محذوف من الدعوة'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleSection(sec.key)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold shrink-0 transition-all cursor-pointer whitespace-nowrap self-start ${
                    isEnabled
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
                  }`}
                >
                  {isEnabled ? 'حذف السكشن ❌' : 'استعادة السكشن ➕'}
                </button>
              </div>

              {/* Description */}
              <p className="text-[11px] text-stone-500 leading-snug break-words">{sec.desc}</p>

              {/* Inline editor inputs if parents section is enabled */}
              {sec.key === 'parents' && isEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-200/60 w-full">
                  <input
                    type="text"
                    value={parentsGroomAr}
                    onChange={(e) => setParentsGroomAr(e.target.value)}
                    placeholder="أهل العريس: نجل الأستاذ..."
                    className="w-full min-w-0 px-2.5 py-1.5 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                  <input
                    type="text"
                    value={parentsBrideAr}
                    onChange={(e) => setParentsBrideAr(e.target.value)}
                    placeholder="أهل العروسة: كريمة المهندس..."
                    className="w-full min-w-0 px-2.5 py-1.5 rounded-xl border border-stone-300 text-xs bg-white"
                  />
                </div>
              )}

              {/* Inline editor inputs if whatsapp section is enabled */}
              {sec.key === 'whatsapp' && isEnabled && (
                <div className="space-y-1.5 pt-2 border-t border-stone-200/60 w-full">
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 w-full">
                    <input
                      type="tel"
                      value={whatsappContactPhone}
                      onChange={(e) => setWhatsappContactPhone(e.target.value)}
                      placeholder="رقم الواتساب (مثال: 201019262075)"
                      className="min-w-0 flex-1 px-2.5 py-1.5 rounded-xl border border-stone-300 text-xs bg-white text-left font-mono dir-ltr"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      {customerPhone && customerPhone !== whatsappContactPhone && (
                        <button
                          type="button"
                          onClick={() => setWhatsappContactPhone(customerPhone)}
                          className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold transition-colors cursor-pointer whitespace-nowrap"
                        >
                          رقم الحجز
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const clean = whatsappContactPhone.replace(/[^0-9]/g, '');
                          if (clean.length >= 8) {
                            window.open(`https://wa.me/${clean}`, '_blank');
                          } else {
                            alert('يرجى إدخال رقم واتساب صحيح لتجربته');
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition-colors cursor-pointer whitespace-nowrap"
                      >
                        تجربة 💬
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
