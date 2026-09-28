'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Lock, Mail, ArrowRight } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@farahna.com');
  const [password, setPassword] = useState('Farahna@2026!');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success && data.data?.token) {
        localStorage.setItem('farahna_token', data.data.token);
        localStorage.setItem('farahna_user', JSON.stringify(data.data.user));
        router.push('/admin');
      } else {
        setErrorMsg(data.message || 'بيانات الدخول غير صحيحة');
      }
    } catch (err) {
      setErrorMsg('تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 font-cairo">
      <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-8 sm:p-10 space-y-8 text-right">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl burgundy-gradient-bg flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-950/20">
            <Heart className="w-7 h-7 fill-rose-300 text-rose-300" />
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            لوحة تحكم فرحنا
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            تسجيل دخول المشرفين لإدارة الطلبات والدعوات والمدفوعات
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">البريد الإلكتروني:</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@farahna.com"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#720925] text-sm text-left dir-ltr"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">كلمة المرور:</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#720925] text-sm text-left dir-ltr"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl burgundy-gradient-bg text-white font-bold text-sm shadow-md shadow-rose-950/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>{loading ? 'جاري التحقق...' : 'تسجيل الدخول'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-stone-100 text-center">
          <a href="/" className="text-xs font-bold text-stone-500 hover:text-[#720925] transition-colors">
            ← العودة للصفحة الرئيسية لموقع فرحنا
          </a>
        </div>
      </div>
    </div>
  );
}
