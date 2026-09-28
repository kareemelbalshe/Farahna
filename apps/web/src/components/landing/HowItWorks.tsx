'use client';

import React from 'react';
import { Send, Palette, Wand2, CheckCircle2, ArrowLeft } from 'lucide-react';

const STEPS = [
  {
    step: '١',
    title: 'ابعتلنا تفاصيل فرحتك',
    description: 'تواصل معانا على واتساب بالأسماء، التواريخ، موقع القاعة، والصور اللي حابب تضيفها.',
    icon: Send,
  },
  {
    step: '٢',
    title: 'اختار الشكل اللي يعجبك',
    description: 'حدد الثيم المفضل لكم (الملكي البورجوندي، الذهبي، الأبيض، الزهري، أو الشرقي).',
    icon: Palette,
  },
  {
    step: '٣',
    title: 'إحنا نصمم دعوتك ونبعتلك معاينة',
    description: 'فريقنا بيجهز الدعوة بالكامل، وبنبعتلك لينك معاينة سري وتعدل عليه براحتك حتى يعجبك.',
    icon: Wand2,
  },
  {
    step: '٤',
    title: 'ادفع عبر InstaPay أو فودافون كاش واستلم اللينك',
    description: 'بعد ما تعتمد التصميم، بنبعتلك تفاصيل التحويل على واتساب عبر إنستاباي أو فودافون كاش وننشر لك اللينك فوراً.',
    icon: CheckCircle2,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-[#720925] border border-rose-200 text-xs font-bold">
            خطوات بسيطة وسريعة
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight font-cairo">
            كيف نعمل؟ <br />
            <span className="text-[#720925]">دعوتك جاهزة في دقائق بدون تعقيد</span>
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            مش هتشغل بالك بأي تفاصيل تقنية؛ إحنا بنصمم كل حاجة مخصوص علشانكم.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-7 rounded-3xl bg-white border border-stone-200/80 shadow-md space-y-4 text-right flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-black text-sm flex items-center justify-center font-cairo">
                      {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-[#720925]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 font-cairo">{step.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">{step.description}</p>
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <span className="text-[11px] font-bold text-[#720925] flex items-center gap-1">
                    <span>الخطوة {step.step}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Methods Note Banner */}
        <div className="mt-12 max-w-3xl mx-auto p-6 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-4 text-right">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white shrink-0 flex items-center justify-center font-black text-lg">
            ⚡
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-900 font-cairo">الدفع بعد اعتماد التصميم عبر InstaPay أو فودافون كاش</h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              لا نطلب أي دفع مسبق قبل أن تشاهد المعاينة وتطمئن لتصميم دعوتك بنسبة ١٠٠٪. التحويل يدوي بالكامل وتفاصيل التحويل بنبعتهالك على واتساب مباشرة.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
