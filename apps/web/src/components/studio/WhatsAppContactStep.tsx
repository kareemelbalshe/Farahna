'use client';

import React from 'react';
import { MessageCircle, ExternalLink, Info, Sparkles } from 'lucide-react';

interface WhatsAppContactStepProps {
  sectionsVisibility: Record<string, boolean>;
  setSectionsVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  whatsappContactPhone: string;
  setWhatsappContactPhone: (phone: string) => void;
  whatsappContactEnabled: boolean;
  setWhatsappContactEnabled: (enabled: boolean) => void;
  customerPhone: string;
  handleOpenCheckoutModal: () => void;
}

export function WhatsAppContactStep({
  sectionsVisibility,
  setSectionsVisibility,
  whatsappContactPhone,
  setWhatsappContactPhone,
  whatsappContactEnabled,
  setWhatsappContactEnabled,
  customerPhone,
  handleOpenCheckoutModal,
}: WhatsAppContactStepProps) {
  const isEnabled = Boolean(
    sectionsVisibility.whatsapp && whatsappContactEnabled && whatsappContactPhone.trim()
  );

  return (
    <div className="space-y-6 text-right">
      {/* 8. WhatsApp Direct Contact Section */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
                <span>زر تواصل المعازيم عبر واتساب مع أصحاب الفرح</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  مباشر 💬
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                حدد رقم هاتف بمزاجك، عدّله بأي وقت، أو ألغه بالكامل لحفظ خصوصيتكم
              </p>
            </div>
          </div>

          {/* Main Enable / Disable Toggle */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-stone-700">
              {isEnabled ? 'الزر مفعل بالدعوة' : 'الزر ملغي / محذوف'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setWhatsappContactEnabled(checked);
                  setSectionsVisibility((prev) => ({ ...prev, whatsapp: checked }));
                  if (checked && !whatsappContactPhone.trim()) {
                    setWhatsappContactPhone(customerPhone || '201019262075');
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
            </label>
          </div>
        </div>

        {/* Status explanation & controls */}
        {isEnabled ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 block">
                  رقم الواتساب لاستقبال رسائل المعازيم (WhatsApp Number):
                </label>
                <div className="flex items-center gap-2">
                  {customerPhone && customerPhone !== whatsappContactPhone && (
                    <button
                      type="button"
                      onClick={() => setWhatsappContactPhone(customerPhone)}
                      className="text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                    >
                      استخدام رقم الحجز ({customerPhone})
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setWhatsappContactPhone('');
                      setWhatsappContactEnabled(false);
                      setSectionsVisibility((p) => ({ ...p, whatsapp: false }));
                    }}
                    className="text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                  >
                    مسح وإلغاء الزر ❌
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type="tel"
                  value={whatsappContactPhone}
                  onChange={(e) => setWhatsappContactPhone(e.target.value)}
                  placeholder="مثال: 201019262075 أو 01019262075 أو +9665..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-mono text-left dir-ltr bg-stone-50 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                💡 اكتب كود الدولة بدون مسافات (مثال لمصر: <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-800">201019262075</code> أو <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-800">01019262075</code>).
              </p>
            </div>

            {/* Live preview badge */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-stone-700">معاينة شكل الزر في أسفل الدعوة:</span>
                {whatsappContactPhone.replace(/[^0-9]/g, '').length >= 5 && (
                  <a
                    href={`https://wa.me/${whatsappContactPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>تجربة فتح المحادثة</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="text-center py-2">
                <p className="text-[11px] text-stone-500 mb-2">لأي استفسار أو تواصل مباشر مع أصحاب الفرح</p>
                <div className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#25D366] text-white font-black text-sm shadow-md shadow-emerald-500/20 max-w-sm w-full mx-auto">
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>تواصل عبر واتساب مع أصحاب الدعوة 💬</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <Info className="w-4 h-4 text-amber-700" />
              <span>زر واتساب التواصل ملغي ومخفي تماماً من دعوتك! 🔒</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              لن يظهر أي زر اتصال أو مراسلة في أسفل دعوتك لحفظ خصوصيتكم التامة. لن يتمكن الضيوف إلا من مشاهدة تفاصيل الحفل وتأكيد الحضور فقط.
            </p>
            <button
              type="button"
              onClick={() => {
                setWhatsappContactPhone(customerPhone || '201019262075');
                setWhatsappContactEnabled(true);
                setSectionsVisibility((p) => ({ ...p, whatsapp: true }));
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              إعادة تفعيل زر الواتساب ➕
            </button>
          </div>
        )}
      </section>

      {/* Bottom Actions Card (High-Contrast Burgundy Gold Luxury Styling) */}
      <div
        className="relative overflow-hidden p-6 sm:p-8 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl border-2 border-amber-400/50 bg-gradient-to-r from-[#4A0E17] via-[#720925] to-[#3B0712]"
        style={{
          background: 'linear-gradient(135deg, #4A0E17 0%, #720925 50%, #35060F 100%)',
        }}
      >
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 rounded-full bg-rose-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2 text-right">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>خطوتك الأخيرة لتفعيل الرابط الملكي</span>
          </span>
          <h3 className="font-black text-xl sm:text-2xl text-white font-cairo drop-shadow-xs">
            جاهز لاعتماد ونشر دعوتك؟ 💍
          </h3>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-xl font-medium">
            كل تعديلاتك محفوظة في متصفحك. اضغط حفظ لمتابعة الدفع عبر InstaPay وتفعيل الرابط فوراً.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCheckoutModal}
          className="relative z-10 w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-sm sm:text-base shadow-xl shadow-amber-950/40 hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 border border-amber-200"
        >
          <Sparkles className="w-5 h-5 text-stone-950" />
          <span>حفظ وتفعيل الدعوة 🚀</span>
        </button>
      </div>
    </div>
  );
}
