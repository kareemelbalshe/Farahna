'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'إزاي بيتم الدفع؟ وهل فيه دفع أونلاين؟',
    a: 'لا نطلب أي دفع أونلاين بالفيزا أو كروت بنكية. الدفع متاح عبر InstaPay أو فودافون كاش — التحويل يتم يدوياً بعد أن نصمم دعوتك بالكامل وتراجعها عبر رابط المعاينة وتعتمدها بنسبة ١٠٠٪، وهيتم إرسال تفاصيل الدفع لحضرتك على واتساب مباشرة.',
  },
  {
    q: 'هل ضيوفي محتاجين ينزلوا تطبيق أو يسجلوا حساب لفتح الدعوة؟',
    a: 'إطلاقاً! الضيف بيستلم منك اللينك على واتساب أو ماسنجر، ويضغط عليه يفتح فوراً في متصفح الموبايل خلال ثانية واحدة بدون أي تسجيل أو تنزيل تطبيقات.',
  },
  {
    q: 'إيه فايدة تجميع المناسبات (الخطوبة، الحنة، كتب الكتاب، الفرح) في لينك واحد؟',
    a: 'بدل تشتيت المعازيم بـ ٤ لينكات مختلفة ورسائل تضيع وسط الشات، ضيوفك بيلاقوا كل محطات فرحتكم منظمة في مكان واحد، وكل مناسبة ليها معادها ومكانها بالخريطة وزرار التقويم الخاص بيها.',
  },
  {
    q: 'لو ميعاد أو مكان قاعة اتغير، هل ينفع أعدل في الدعوة بعد ما نشرتها؟',
    a: 'نعم بكل تأكيد! فريق فرحنا بيحدث بيانات القاعة أو الميعاد فوراً، واللينك اللي عند ضيوفك بيظهر فيه التعديل فوراً بدون الحاجة لإنشاء أو إرسال لينك جديد.',
  },
  {
    q: 'هل ليلة الحنة ليها خصوصية لو هي خاصة بالسيدات فقط؟',
    a: 'نعم، نوفر قسماً مخصصاً لليلة الحنة نقدر نحدد فيه وسم "خاص بالسيدات فقط"، ونضيف فيه إرشادات الدريس كود وممنوع اصطحاب الأطفال أو التصوير حسب رغبتكم.',
  },
  {
    q: 'هل الدعوة سريعة وما بتسحبش باقة الموبايل؟',
    a: 'دعوات فرحنا مبنية بأحدث تقنيات الويب العالمية، والصور بتنزل بجودة عالية ومضغوطة تلقائياً بتقنية WebP عشان تفتح بسرعة البرق حتى على شبكات 3G وباقات النت الضعيفة.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-[#720925] border border-rose-200 text-xs font-bold">
            كل ما يدور في ذهنكم
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight font-cairo">
            الأسئلة الشائعة حول <span className="text-[#720925]">فرحنا</span>
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            إجابات واضحة ومباشرة لكل التفاصيل اللي تهمكم قبل طلب دعوتكم.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-stone-200/80 shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-right flex items-center justify-between gap-4 font-bold text-base text-stone-900 hover:text-[#720925] transition-colors font-cairo"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#720925]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-stone-600 leading-relaxed font-normal border-t border-stone-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
