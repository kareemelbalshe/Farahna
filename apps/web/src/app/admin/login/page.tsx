'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Heart,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  X,
  MessageCircle,
  Loader2,
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Auto-fill saved email if rememberMe was previously active
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('farahna_saved_email');
      if (savedEmail) {
        setEmail(savedEmail);
      }
    } catch {}
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('يرجى كتابة البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (data.success && data.data?.token) {
        localStorage.setItem('farahna_token', data.data.token);
        localStorage.setItem('farahna_user', JSON.stringify(data.data.user));

        if (rememberMe) {
          localStorage.setItem('farahna_saved_email', email.trim());
        } else {
          localStorage.removeItem('farahna_saved_email');
        }

        router.push(redirectTarget);
      } else {
        setErrorMsg(
          data.message || 'بيانات الدخول غير صحيحة، يرجى التأكد من البريد وكلمة المرور'
        );
      }
    } catch (err) {
      setErrorMsg('تعذر الاتصال بخادم المنصة، يرجى التأكد من الاتصال بالإنترنت والمحاولة مجدداً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-8 sm:p-10 space-y-7 text-right relative overflow-hidden">
      {/* Top subtle golden shimmer accent bar */}
      <div className="absolute top-0 inset-x-0 h-1.5 burgundy-gradient-bg" />

      {/* Brand Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-2xl burgundy-gradient-bg flex items-center justify-center text-white mx-auto shadow-xl shadow-rose-950/25 border-2 border-amber-300/40 transform hover:scale-105 transition-transform">
            <Heart className="w-8 h-8 fill-amber-300 text-amber-300" />
          </div>
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-[10px] font-black shadow-xs">
            ✨
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-cairo">
            لوحة تحكم فرحنا
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-1">
            تسجيل دخول آمن لإدارة الدعوات، الحجوزات، ومدفوعات InstaPay
          </p>
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold text-center animate-fade-in-up">
          {errorMsg}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
            <span>البريد الإلكتروني:</span>
            <span className="text-[10px] text-stone-400 font-normal">اسم المستخدم الرسمي</span>
          </label>
          <div className="relative">
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@farahna.com"
              className="w-full pl-4 pr-10 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#720925] focus:border-transparent text-sm text-left dir-ltr bg-stone-50/50 hover:bg-white transition-colors"
            />
            <Mail className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Password field with show/hide toggle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-700">كلمة المرور:</label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-[11px] font-bold text-[#720925] hover:underline cursor-pointer"
            >
              نسيت كلمة المرور؟
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#720925] focus:border-transparent text-sm text-left dir-ltr bg-stone-50/50 hover:bg-white transition-colors"
            />
            <Lock className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

            {/* Toggle Visibility */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me option */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-stone-600 font-medium">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-[#720925] focus:ring-[#720925] border-stone-300 accent-[#720925]"
            />
            <span>تذكر بريدي على هذا الجهاز</span>
          </label>
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl burgundy-gradient-bg text-white font-bold text-sm shadow-md shadow-rose-950/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري التحقق وتسجيل الدخول...</span>
              </>
            ) : (
              <>
                <span>تسجيل الدخول إلى النظام</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Security Assurance Badge */}
      <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-stone-400 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>جلسة عمل مشفرة وآمنة وفق معايير 256-bit SSL</span>
      </div>

      {/* Return to website */}
      <div className="pt-4 border-t border-stone-100 text-center">
        <Link
          href="/"
          className="text-xs font-bold text-stone-500 hover:text-[#720925] transition-colors inline-flex items-center gap-1"
        >
          <span>← العودة للصفحة الرئيسية لمنصة فرحنا</span>
        </Link>
      </div>

      {/* Forgot password guidance modal */}
      {showForgotModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-up"
          onClick={() => setShowForgotModal(false)}
        >
          <div
            className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-stone-900 font-cairo">
              استعادة كلمة المرور
            </h3>

            <p className="text-xs text-stone-600 leading-relaxed">
              لحماية بيانات العملاء والمناسبات في بيئة الإنتاج (Production)، يتم إعادة تعيين كلمات المرور حصرياً عبر المدير العام (Super Admin) أو عبر الأمر المباشر في السيرفر:
            </p>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 font-mono text-[11px] text-left text-stone-700 dir-ltr select-all">
              ./manage.sh set-password &lt;email&gt; &lt;new_password&gt;
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/201019262075?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%AD%D8%A7%D8%A8%D8%A8%20%D8%A3%D8%B9%D9%8A%D8%AF%20%D8%AA%D8%B9%D9%8A%D9%8A%D9%86%20%D9%83%D9%84%D9%85%D8%A9%20%D9%85%D8%B1%D9%88%D8%B1%20%D8%AD%D8%B3%D8%A7%D8%A8%D9%8A%20%D9%81%D9%8A%20%D9%81%D8%B1%D8%AD%D9%86%D8%A7"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>مراسلة الدعم الفني عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 font-cairo relative overflow-hidden">
      {/* Background ambient aesthetic lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="p-12 text-center text-stone-500 font-bold">
            جاري تحميل نموذج الدخول...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
