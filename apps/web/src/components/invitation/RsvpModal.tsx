'use client';

import React, { useState } from 'react';
import { CheckCircle2, Heart, MessageSquare, Send, Sparkles, User, Users } from 'lucide-react';
import { submitPublicRsvp } from '@/lib/api';
import confetti from 'canvas-confetti';

interface RsvpModalProps {
  invitationId: string;
  primaryColor?: string;
}

export function RsvpModal({ invitationId, primaryColor = '#720925' }: RsvpModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState<'attending' | 'not_attending' | 'maybe'>('attending');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('يرجى إدخال اسمك الكريم');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await submitPublicRsvp(invitationId, {
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        attendanceStatus,
        guestCount: attendanceStatus === 'not_attending' ? 1 : (parseInt(String(guestCount), 10) || 1),
        message: message ? message.trim() : null,
      });

      if (res.success) {
        setIsSuccess(true);
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#D4AF37', '#720925', '#10B981'],
          });
        } catch (e) {}
      } else {
        setErrorMsg(res.message || 'تعذر إرسال الرد، يرجى المحاولة لاحقاً');
      }
    } catch (e) {
      setErrorMsg('حدث خطأ أثناء الإرسال');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 px-4 max-w-xl mx-auto">
      <div className="rounded-3xl bg-white border border-stone-200/90 shadow-xl p-6 sm:p-8 space-y-6 text-right theme-card">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-[#720925] border border-rose-200 text-xs font-bold theme-badge">
            <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            تأكيد الحضور (RSVP)
          </span>
          <h3 className="text-2xl font-black text-stone-900 font-cairo theme-heading">
            هل ستشاركونا فرحتنا؟
          </h3>
          <p className="text-xs text-stone-500 theme-muted">
            يسعدنا تأكيد حضوركم لحصر أماكن الضيوف واستقبالكم بأفضل شكل ❤️
          </p>
        </div>

        {isSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-emerald-900 font-cairo">
              تم تسجيل تأكيد حضورك بنجاح!
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              شكراً جزيلاً لك يا {name}. مستنيينك تنورنا وتشاركنا أجمل لحظات العمر ✨
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            {/* Attendance Radios */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block theme-heading">
                موقفك من الحضور:
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setAttendanceStatus('attending')}
                  className={`p-2 sm:p-3 rounded-xl font-bold text-[11px] sm:text-xs flex flex-col items-center gap-1 border transition-all ${
                    attendanceStatus === 'attending'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-xs'
                      : 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className="text-sm sm:text-base">🎉</span>
                  <span className="truncate max-w-full">يشرفني الحضور</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendanceStatus('maybe')}
                  className={`p-2 sm:p-3 rounded-xl font-bold text-[11px] sm:text-xs flex flex-col items-center gap-1 border transition-all ${
                    attendanceStatus === 'maybe'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-300 shadow-xs'
                      : 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className="text-sm sm:text-base">⏳</span>
                  <span className="truncate max-w-full">سأحاول الحضور</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendanceStatus('not_attending')}
                  className={`p-2 sm:p-3 rounded-xl font-bold text-[11px] sm:text-xs flex flex-col items-center gap-1 border transition-all ${
                    attendanceStatus === 'not_attending'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-800 dark:text-rose-300 shadow-xs'
                      : 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className="text-sm sm:text-base">💌</span>
                  <span className="truncate max-w-full">أعتذر لظروف</span>
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block theme-heading">
                الاسم الكريم: *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: د. حسام الشافعي"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>
            </div>

            {/* Phone & Guest count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block theme-heading">
                  رقم الهاتف (اختياري):
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010xxxxxxxx"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-left dir-ltr"
                />
              </div>

              {attendanceStatus !== 'not_attending' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block theme-heading">
                    عدد الأفراد الحاضرين:
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num === 1 ? 'فرد واحد' : `${num} أفراد`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Congratulation Message */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block theme-heading">
                رسالة أو كلمة تهنئة للعروسين:
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="ألف مبروك يا أجمل عرايس، ربنا يتمملكم على خير ❤️"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-black text-sm shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
              style={{
                backgroundColor: primaryColor,
                color:
                  primaryColor.toLowerCase().startsWith('#d') ||
                  primaryColor.toLowerCase().startsWith('#f')
                    ? '#121114'
                    : '#FFFFFF',
              }}
            >
              <Send className="w-4 h-4 fill-current" />
              <span>{isSubmitting ? 'جاري الإرسال...' : 'تأكيد الرد وإرسال التهنئة ❤️'}</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
