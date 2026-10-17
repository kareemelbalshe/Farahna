'use client';

import React from 'react';
import {
  ShieldCheck,
  X,
  Check,
  AlertTriangle,
  Copy,
  Upload,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { validatePhoneNumber } from '@/lib/validation';
import { PackageTier } from './studioConstants';

interface CheckoutModalProps {
  showCheckoutModal: boolean;
  setShowCheckoutModal: (show: boolean) => void;
  currentPkg: PackageTier;
  submitError: string;
  customerName: string;
  setCustomerName: (name: string) => void;
  coupleGroomAr: string;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  customerEmail?: string;
  setCustomerEmail?: (email: string) => void;
  paymentMethod: 'instapay' | 'vodafone_cash';
  setPaymentMethod: (method: 'instapay' | 'vodafone_cash') => void;
  paymentPhone: string;
  copySuccess: string | null;
  copyToClipboard: (text: string, label: string) => void;
  paymentProofBase64: string | null;
  proofFileName: string;
  handleProofFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  referenceNumber: string;
  setReferenceNumber: (ref: string) => void;
  submitting: boolean;
  handleFinalSubmit: (e: React.FormEvent) => void;
}

export function CheckoutModal({
  showCheckoutModal,
  setShowCheckoutModal,
  currentPkg,
  submitError,
  customerName,
  setCustomerName,
  coupleGroomAr,
  customerPhone,
  setCustomerPhone,
  customerEmail = '',
  setCustomerEmail,
  paymentMethod,
  setPaymentMethod,
  paymentPhone,
  copySuccess,
  copyToClipboard,
  paymentProofBase64,
  proofFileName,
  handleProofFileChange,
  referenceNumber,
  setReferenceNumber,
  submitting,
  handleFinalSubmit,
}: CheckoutModalProps) {
  if (!showCheckoutModal) return null;

  const phoneCheck = validatePhoneNumber(customerPhone);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in text-right">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>تأكيد الحفظ وتفعيل دعوتكم 💍</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              التحويل آمن ومباشر عبر InstaPay أو فودافون كاش
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCheckoutModal(false)}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold leading-relaxed">
            {submitError}
          </div>
        )}

        {/* Summary Box */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium">الباقة المختارة:</span>
            <span className="font-bold text-stone-900">{currentPkg.name}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium">إجمالي التكلفة:</span>
            <span className="text-base font-black text-[#720925]">{currentPkg.priceLabel}</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-200/60">
            <span className="text-stone-500 font-medium">حالة الرابط:</span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
              يتم التفعيل الفوري بمجرد مراجعة الإيصال
            </span>
          </div>
        </div>

        <form onSubmit={handleFinalSubmit} className="space-y-5">
          {/* Step 1: Customer Contact Info */}
          <div className="space-y-3">
            <label className="text-xs font-black text-stone-900 block">
              ١. بيانات التواصل مع العروسين: *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-600 block">
                  اسم صاحب الطلب / العريس: *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={coupleGroomAr || 'أحمد محمود'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-[#720925] focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-600 block">
                  رقم واتساب للتفعيل وإرسال الرابط: *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="01012345678"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-left dir-ltr focus:ring-2 focus:ring-[#720925] focus:outline-hidden transition-all ${
                    customerPhone && !phoneCheck.isValid
                      ? 'border-amber-400 ring-2 ring-amber-100 bg-amber-50/20'
                      : customerPhone && phoneCheck.isValid
                      ? 'border-emerald-400 ring-2 ring-emerald-100 bg-emerald-50/20'
                      : 'border-stone-200'
                  }`}
                />
                {customerPhone && phoneCheck.isValid && (
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>رقم هاتف صالح ومجهز لاستلام رسالة تفعيل الرابط عبر واتساب ✅</span>
                  </span>
                )}
                {customerPhone && !phoneCheck.isValid && (
                  <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>يرجى كتابة رقم هاتف مصري من 11 رقم (يبدأ بـ 010 أو 011 أو 012 أو 015) أو رقم دولي</span>
                  </span>
                )}
              </div>

              {setCustomerEmail && (
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-stone-600 block flex items-center justify-between">
                    <span>البريد الإلكتروني للعروسين (لاستلام نسخة وتأكيد الطلب فوراً):</span>
                    <span className="text-[10px] text-stone-400 font-normal">اختياري</span>
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-left dir-ltr focus:ring-2 focus:ring-[#720925] focus:outline-hidden"
                  />
                  <p className="text-[10px] text-stone-400">
                    سنرسل لك تفاصيل دعوتك ورابط المعاينة وإشعار التفعيل فور اعتماد الطلب 💌
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Payment Instructions & Copy Handles */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <label className="text-xs font-black text-stone-900 block">
              ٢. طريقة وبيانات التحويل: *
            </label>

            {/* Method Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-2xl text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => setPaymentMethod('instapay')}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
                  paymentMethod === 'instapay'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500'
                }`}
              >
                InstaPay (إنستاباي) ⚡
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('vodafone_cash')}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
                  paymentMethod === 'vodafone_cash'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500'
                }`}
              >
                فودافون كاش 📱
              </button>
            </div>

            {/* Handle display with 1-click copy */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-amber-900 font-bold block">
                    {paymentMethod === 'instapay'
                      ? 'رقم تحويل إنستاباي (InstaPay):'
                      : 'رقم محفظة فودافون كاش (Vodafone Cash):'}
                  </span>
                  <span className="text-base font-black text-amber-950 font-mono tracking-wider" dir="ltr">
                    {paymentPhone}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(paymentPhone, paymentMethod)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copySuccess === paymentMethod ? 'تم النسخ ✅' : 'نسخ الرقم'}</span>
                </button>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                قم بتحويل مبلغ <strong className="font-bold">{currentPkg.priceLabel}</strong> إلى الرقم <strong className="font-mono font-bold" dir="ltr">{paymentPhone}</strong> عبر {paymentMethod === 'instapay' ? 'تطبيق InstaPay' : 'فودافون كاش'} ثم
                التقط لقطة شاشة (Screenshot) لرسالة التأكيد وارفعها بالأسفل.
              </p>
            </div>
          </div>

          {/* Step 3: Payment Screenshot Upload */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="text-xs font-black text-stone-900 block flex items-center justify-between">
              <span>٣. ارفع لقطة شاشة إيصال التحويل (Screenshot): *</span>
              <span className="text-[10px] text-emerald-700 font-bold">ضروري للاعتماد</span>
            </label>

            <div className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
              !paymentProofBase64 && submitError
                ? 'border-rose-400 bg-rose-50/30 ring-2 ring-rose-200'
                : 'border-stone-300 hover:border-[#720925] bg-stone-50/60 hover:bg-stone-50'
            }`}>
              <input
                type="file"
                required={!paymentProofBase64}
                accept="image/*"
                onChange={handleProofFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />

              {paymentProofBase64 ? (
                <div className="space-y-2 flex flex-col items-center">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-300 shadow-sm">
                    <img
                      src={paymentProofBase64}
                      alt="إيصال التحويل"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>تم تجهيز الإيصال بنجاح ({proofFileName || 'صورة'})</span>
                  </span>
                  <span className="text-[10px] text-stone-400">انقر لتغيير الصورة</span>
                </div>
              ) : (
                <div className="space-y-2 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-[#720925] flex items-center justify-center shadow-2xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-stone-800">
                      اضغط هنا لاختيار لقطة الشاشة أو اسحبها هنا
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      صيغ الصور المدعومة: JPG, PNG, WEBP حتى 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Optional Reference Number */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-600 block">
              رقم المعاملة / المرجع (اختياري إن وُجد):
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="مثال: Ref #12345678"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-mono"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl burgundy-gradient-bg text-white font-black text-sm shadow-lg shadow-rose-950/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>جاري إرسال الطلب وحفظ الإيصال...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>تأكيد الإرسال وتفعيل دعوتي 🚀</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
