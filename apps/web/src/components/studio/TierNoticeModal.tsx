'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  Crown,
  Sparkles,
  Lock,
  CheckCircle2,
  Eye,
  Check,
  Copy,
  MessageCircle,
} from 'lucide-react';
import { PackageTier } from './studioConstants';

interface TierNoticeModalProps {
  tierNoticeModal: {
    isOpen: boolean;
    featureTitle: string;
    featureDescription: string;
    requiredPackageId: 'basic' | 'wedding-journey' | 'luxury-vip';
    onUpgradeAction?: () => void;
  } | null;
  setTierNoticeModal: (modal: any) => void;
  selectedPackage: string;
  packagesList: PackageTier[];
  vipPlan: PackageTier;
  journeyPlan: PackageTier;
  handleUpgradeToPackage: (
    pkgId: 'basic' | 'wedding-journey' | 'luxury-vip',
    featureName: string
  ) => void;
  tierFeedbackToast: string | null;
  setTierFeedbackToast: (toast: string | null) => void;
  submittedOrder: any;
  setSubmittedOrder: (order: any) => void;
  type: string;
  generatedSlug: string;
  copySuccess: string | null;
  copyToClipboard: (text: string, label: string) => void;
}

export function TierNoticeModal({
  tierNoticeModal,
  setTierNoticeModal,
  selectedPackage,
  packagesList,
  vipPlan,
  journeyPlan,
  handleUpgradeToPackage,
  tierFeedbackToast,
  setTierFeedbackToast,
  submittedOrder,
  setSubmittedOrder,
  type,
  generatedSlug,
  copySuccess,
  copyToClipboard,
}: TierNoticeModalProps) {
  return (
    <>
      {/* 1. Interactive Tier Upgrade Notice Modal */}
      {tierNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in text-right">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border-2 border-amber-300 text-center relative overflow-hidden">
            <button
              type="button"
              onClick={() => setTierNoticeModal(null)}
              className="absolute top-4 left-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center shadow-xs">
              {tierNoticeModal.requiredPackageId === 'luxury-vip' ? (
                <Crown className="w-8 h-8 text-amber-600" />
              ) : (
                <Sparkles className="w-8 h-8 text-[#720925]" />
              )}
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-900 border border-amber-300">
                <Lock className="w-3.5 h-3.5 text-amber-700" />
                <span>
                  {tierNoticeModal.requiredPackageId === 'luxury-vip'
                    ? `ميزة حصرية لباقة VIP الملكية (${vipPlan.priceLabel})`
                    : `متاحة في باقة رحلة الفرح (${journeyPlan.priceLabel}) وباقة VIP`}
                </span>
              </div>
              <h3 className="text-lg font-black text-stone-900 font-cairo">
                {tierNoticeModal.featureTitle}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                {tierNoticeModal.featureDescription}
              </p>
            </div>

            {/* Difference calculation & current plan */}
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-amber-200 text-right space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-600 font-medium">
                <span>باقتك الحالية في التصميم:</span>
                <span className="font-bold text-stone-900">
                  {packagesList.find((p) => p.id === selectedPackage)?.name} ({packagesList.find((p) => p.id === selectedPackage)?.priceLabel})
                </span>
              </div>
              <div className="flex items-center justify-between text-amber-950 font-black pt-1 border-t border-amber-200/60">
                <span>فرق الترقية لـ {tierNoticeModal.requiredPackageId === 'luxury-vip' ? 'باقة VIP' : 'باقة رحلة الفرح'}:</span>
                <span className="text-sm font-black text-[#720925]">
                  +{Math.max(
                    0,
                    (packagesList.find((p) => p.id === tierNoticeModal.requiredPackageId)?.price || 0) -
                      (packagesList.find((p) => p.id === selectedPackage)?.price || 0)
                  )}{' '}
                  ج.م فقط
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const req = tierNoticeModal.requiredPackageId;
                  const feat = tierNoticeModal.featureTitle;
                  const callback = tierNoticeModal.onUpgradeAction;
                  handleUpgradeToPackage(req, feat);
                  if (callback) callback();
                }}
                className="w-full py-3.5 px-4 rounded-xl burgundy-gradient-bg text-white font-black text-xs sm:text-sm hover:opacity-95 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  ترقية باقتي الآن وتفعيل الميزة ({packagesList.find((p) => p.id === tierNoticeModal.requiredPackageId)?.priceLabel}) 🪄
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTierNoticeModal(null)}
                className="w-full py-2 text-xs text-stone-400 hover:text-stone-700 font-bold transition-colors cursor-pointer"
              >
                متابعة مع باقتي الحالية
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Tier Upgrade Feedback Toast */}
      {tierFeedbackToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 animate-slide-up text-xs sm:text-sm font-bold max-w-md text-right">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="flex-1">{tierFeedbackToast}</span>
          <button
            type="button"
            onClick={() => setTierFeedbackToast(null)}
            className="text-stone-400 hover:text-white mr-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Post-Submission Success Celebration Modal */}
      {submittedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in text-right">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-amber-300 text-center">
            {/* Celebration Icon */}
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-md animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-stone-900 font-cairo">
                ألف مبروك! تم استلام تصميم دعوتك بنجاح 🎉
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                رقم طلبك: <strong className="font-mono text-stone-900">#{submittedOrder.orderNumber}</strong>
                <br />
                تم إرسال إيصال الدفع إلى لوحة الإدارة لمطابقته وتفعيل الرابط الرسمي لحضرتك فوراً خلال دقائق!
              </p>
            </div>

            {/* Private Preview Link Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-right space-y-2">
              <span className="text-xs font-black text-amber-950 block">
                👀 يمكنك الآن رؤية ومعاينة دعوتك برابطك الخاص:
              </span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                هذا الرابط مخصص لمعاينتك للتأكد من كل التفاصيل، وسيتفعل الرابط العام للضيوف فور اعتماد الأدمن.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <Link
                  href={`/preview/${submittedOrder.previewToken}`}
                  target="_blank"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 text-white font-black text-xs hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>معاينة دعوتي برابط المعاينة 💌</span>
                </Link>
              </div>
            </div>

            {/* Official Link preview with collision-proof random suffix */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-right space-y-1.5">
              <span className="text-xs font-bold text-stone-700 block">
                🔗 رابط دعوتك المخصص للضيوف (سيتفعل رسمياً فور الاعتماد):
              </span>
              <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono text-stone-800">
                <span className="truncate text-left dir-ltr flex-1 font-semibold text-[#720925]">
                  https://farahna.menuflowx.com/invitation/{submittedOrder.invitation?.type || type}/{submittedOrder.invitation?.slug || generatedSlug}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `https://farahna.menuflowx.com/invitation/${submittedOrder.invitation?.type || type}/${submittedOrder.invitation?.slug || generatedSlug}`,
                      'final-slug'
                    )
                  }
                  className="p-1 rounded-lg text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                  title="نسخ الرابط"
                >
                  {copySuccess === 'final-slug' ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Direct WhatsApp Contact button */}
            <div className="pt-2 space-y-2">
              <a
                href={`https://wa.me/201019262075?text=${encodeURIComponent(
                  `السلام عليكم، قمت بتصميم دعوتي على موقع فرحنا برقم طلب #${submittedOrder.orderNumber} ورفعت إيصال التحويل لتأكيد التفعيل.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>تواصل معنا على واتساب للتفعيل السريع 📲</span>
              </a>

              <button
                type="button"
                onClick={() => setSubmittedOrder(null)}
                className="text-xs text-stone-400 hover:text-stone-700 font-bold block mx-auto pt-2 cursor-pointer"
              >
                إغلاق هذه النافذة والعودة للتعديل
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
