'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Download,
  Printer,
  Share2,
  Search,
  Phone,
  MessageSquare,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Heart,
  Calendar,
  Lock,
  ArrowRight,
  ShieldCheck,
  Check,
  UserCheck,
} from 'lucide-react';
import { fetchPrivateGuestList } from '@/lib/api';
import { formatArabicDate, formatArabicTime } from '@/lib/date';

interface GuestRsvp {
  id: string;
  name: string;
  phone?: string | null;
  attendanceStatus: 'attending' | 'not_attending' | 'maybe';
  guestCount: number;
  message?: string | null;
  attendingEventIds?: string[];
  createdAt: string;
}

interface GuestPageData {
  invitation: {
    id: string;
    title: string;
    slug: string;
    type: string;
    coupleGroomAr: string;
    coupleBrideAr: string;
    eventDate: string;
    coverImageUrl?: string | null;
    rsvpEnabled: boolean;
    previewToken: string;
    events?: any[];
  };
  stats: {
    totalResponses: number;
    attendingCount: number;
    notAttendingCount: number;
    maybeCount: number;
    totalGuests: number;
  };
  rsvps: GuestRsvp[];
}

export default function CoupleGuestListPage({ params }: { params: { token: string } }) {
  const { token } = params;
  const [data, setData] = useState<GuestPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'not_attending' | 'maybe'>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  const loadData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setRefreshing(true);
    setErrorMsg('');

    try {
      const res = await fetchPrivateGuestList(token);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setErrorMsg(res.message || 'تعذر تحميل كشف المعازيم. تأكد من صحة الرابط الخاص بك.');
      }
    } catch {
      setErrorMsg('حدث خطأ في الاتصال بالخادم. يرجى إعادة المحاولة.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  // Filtered RSVPs
  const filteredRsvps = useMemo(() => {
    if (!data?.rsvps) return [];
    return data.rsvps.filter((r) => {
      const matchStatus = statusFilter === 'all' || r.attendanceStatus === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        (r.phone && r.phone.includes(q)) ||
        (r.message && r.message.toLowerCase().includes(q));
      return matchStatus && matchQuery;
    });
  }, [data?.rsvps, statusFilter, searchQuery]);

  // Export CSV with UTF-8 BOM for perfect Arabic display in Excel
  const handleExportCsv = () => {
    if (!data?.rsvps || data.rsvps.length === 0) return;

    const headers = ['الاسم الكريم', 'موقف الحضور', 'عدد الأفراد', 'رقم الهاتف', 'رسالة التهنئة', 'تاريخ ووقت التسجيل'];
    const rows = filteredRsvps.map((r) => [
      `"${(r.name || '').replace(/"/g, '""')}"`,
      r.attendanceStatus === 'attending' ? 'يشرفني الحضور 🟢' : r.attendanceStatus === 'maybe' ? 'سأحاول الحضور 🟡' : 'أعتذر لظروف 🔴',
      r.guestCount || 1,
      `"${(r.phone || '—').replace(/"/g, '""')}"`,
      `"${(r.message || '—').replace(/"/g, '""')}"`,
      `"${formatArabicDate(r.createdAt)} ${formatArabicTime(r.createdAt)}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `كشف-معازيم-${data.invitation.slug || 'farahna'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy private link
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // Share via WhatsApp
  const handleShareWhatsApp = () => {
    if (!data || typeof window === 'undefined') return;
    const shareUrl = window.location.href;
    const text = encodeURIComponent(
      `رابط كشف وتأكيدات حضور المعازيم الخاص بنا (${data.invitation.title}) لمتابعة الضيوف لحظة بلحظة:\n${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] font-cairo flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm max-w-sm w-full space-y-4">
          <div className="w-16 h-16 rounded-full burgundy-gradient-bg text-white mx-auto flex items-center justify-center animate-pulse">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-black text-stone-900">جاري تحميل كشف المعازيم...</h3>
            <p className="text-xs text-stone-500 mt-1">يتم جلب أحدث الردود وتأكيدات الحضور المسجلة</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] font-cairo flex items-center justify-center p-4 text-center text-right">
        <div className="bg-white p-8 rounded-3xl border border-rose-200 shadow-sm max-w-md w-full space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 mx-auto flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-black text-stone-900">تعذر فتح كشف المعازيم</h2>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              {errorMsg || 'الرابط السري غير صالح أو انتهت صلاحيته. يرجى التواصل مع إدارة منصة فرحنا للحصول على الرابط المحدث.'}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 w-full py-3 rounded-xl burgundy-gradient-bg text-white font-bold text-xs"
          >
            <span>العودة للرئيسية</span>
          </Link>
        </div>
      </div>
    );
  }

  const { invitation, stats } = data;
  const publicInvitationUrl = `/invitation/${invitation.type || 'wedding'}/${invitation.slug}`;

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-cairo text-right text-stone-900 pb-16">
      {/* Top Private Security Bar */}
      <div className="bg-gradient-to-r from-[#500418] via-[#720925] to-[#500418] text-white py-2.5 px-4 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-full bg-white/10">
              <Lock className="w-3.5 h-3.5 text-amber-300" />
            </span>
            <span className="font-bold text-amber-200">
              كشف خاص بالعروسين وأصحاب المناسبة فقط 🔒 (رابط سري ومحمي)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="hover:underline flex items-center gap-1 text-[11px] text-white/90 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'تم نسخ الرابط!' : 'نسخ الرابط'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header Hero Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-50 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-50 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#720925] text-xs font-black shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>كشف ضيوف وتأكيدات حضور (RSVP Live)</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                {invitation.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 font-medium pt-1">
                <span className="flex items-center gap-1 font-bold text-stone-700">
                  <Heart className="w-4 h-4 text-[#720925] fill-[#720925]" />
                  <span>
                    {invitation.coupleGroomAr} & {invitation.coupleBrideAr}
                  </span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-stone-400" />
                  <span>{formatArabicDate(invitation.eventDate)}</span>
                </span>
              </div>
            </div>

            {/* Quick Actions for Couple */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => loadData(true)}
                disabled={refreshing}
                className="p-3 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="تحديث البيانات لحظياً"
              >
                <RefreshCw className={`w-4 h-4 text-stone-600 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">تحديث</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>مشاركة الكشف مع شريكك 💬</span>
              </button>

              <Link
                href={publicInvitationUrl}
                target="_blank"
                className="px-4 py-3 rounded-2xl border border-stone-300 hover:border-stone-400 bg-white text-stone-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <span>عرض الدعوة العامة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Dashboard Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Confirmed Attending */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-emerald-200 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-emerald-600">
              <span className="text-xs font-bold text-emerald-900">يشرفني الحضور 🟢</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-800 block">
                {stats.attendingCount}
              </span>
              <span className="text-[11px] text-emerald-700/80 font-medium">رد مؤكد حضورهم</span>
            </div>
          </div>

          {/* Total Attending Guests Sum */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white p-4 sm:p-5 rounded-3xl border-2 border-emerald-300 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-teal-800">
              <span className="text-xs font-black text-teal-950">إجمالي الأفراد المتوقعين 🪑</span>
              <Users className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-teal-950 block">
                {stats.totalGuests}
              </span>
              <span className="text-[11px] text-teal-800 font-bold">لحصر كراسي القاعة والبوفيه</span>
            </div>
          </div>

          {/* Not Attending */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-rose-200 shadow-2xs hover:border-rose-300 transition-all flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-rose-600">
              <span className="text-xs font-bold text-rose-900">أعتذر لظروف 🔴</span>
              <XCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-rose-800 block">
                {stats.notAttendingCount}
              </span>
              <span className="text-[11px] text-rose-700/80 font-medium">اعتذروا عن الحضور</span>
            </div>
          </div>

          {/* Maybe Attending */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-amber-200 shadow-2xs hover:border-amber-300 transition-all flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-amber-600">
              <span className="text-xs font-bold text-amber-900">سأحاول الحضور 🟡</span>
              <HelpCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-amber-800 block">
                {stats.maybeCount}
              </span>
              <span className="text-[11px] text-amber-700/80 font-medium">موقفهم غير مؤكد</span>
            </div>
          </div>
        </div>

        {/* Toolbar: Search, Filter, Export CSV & Print */}
        <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="ابحث باسم الضيف، رقم الهاتف، أو رسالة التهنئة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50/60 focus:bg-white focus:border-[#720925] focus:outline-hidden"
              />
            </div>

            {/* Export & Print Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                disabled={filteredRsvps.length === 0}
                className="px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-40"
                title="تنزيل ملف إكسيل"
              >
                <Download className="w-4 h-4 text-stone-600" />
                <span>تحميل كشف Excel</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                title="طباعة الكشف لاستقبال القاعة"
              >
                <Printer className="w-4 h-4 text-stone-600" />
                <span>طباعة الكشف 🖨️</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
              }`}
            >
              الكل ({data.rsvps.length})
            </button>

            <button
              onClick={() => setStatusFilter('attending')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === 'attending'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100'
              }`}
            >
              <span>يشرفني الحضور</span>
              <span className="font-mono">({stats.attendingCount})</span>
            </button>

            <button
              onClick={() => setStatusFilter('not_attending')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === 'not_attending'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'bg-rose-50 text-rose-800 border border-rose-200/60 hover:bg-rose-100'
              }`}
            >
              <span>أعتذر لظروف</span>
              <span className="font-mono">({stats.notAttendingCount})</span>
            </button>

            <button
              onClick={() => setStatusFilter('maybe')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === 'maybe'
                  ? 'bg-amber-700 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-200/60 hover:bg-amber-100'
              }`}
            >
              <span>سأحاول الحضور</span>
              <span className="font-mono">({stats.maybeCount})</span>
            </button>
          </div>
        </div>

        {/* Guest Responses List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 px-1">
            <span>قائمة الضيوف والردود المسجلة ({filteredRsvps.length})</span>
            <span>مرتبة من الأحدث إلى الأقدم</span>
          </div>

          {filteredRsvps.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-stone-800">
                {searchQuery || statusFilter !== 'all' ? 'لا توجد نتائج مطابقة لفلترة البحث' : 'لم يتم تسجيل ردود حضور حتى الآن'}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {searchQuery || statusFilter !== 'all'
                  ? 'جرب البحث بكلمات أخرى أو اختر عرض "الكل"'
                  : 'شارك رابط الدعوة مع أهلك وأصدقائك، وستظهر ردودهم هنا فوراً وبشكل تلقائي!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredRsvps.map((rsvp) => {
                const isAttending = rsvp.attendanceStatus === 'attending';
                const isMaybe = rsvp.attendanceStatus === 'maybe';
                const isNotAttending = rsvp.attendanceStatus === 'not_attending';

                return (
                  <div
                    key={rsvp.id}
                    className="bg-white rounded-3xl border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Guest Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                              isAttending
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : isMaybe
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-rose-100 text-rose-900 border border-rose-300'
                            }`}
                          >
                            {rsvp.name.charAt(0) || 'ض'}
                          </div>

                          <div>
                            <h3 className="font-black text-stone-900 text-sm leading-tight">
                              {rsvp.name}
                            </h3>
                            <span className="text-[11px] text-stone-400 font-mono block mt-0.5">
                              {formatArabicDate(rsvp.createdAt)} • {formatArabicTime(rsvp.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full border shadow-2xs whitespace-nowrap ${
                            isAttending
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                              : isMaybe
                              ? 'bg-amber-50 text-amber-950 border-amber-200'
                              : 'bg-rose-50 text-rose-900 border-rose-200'
                          }`}
                        >
                          {isAttending ? 'يشرفني الحضور 🟢' : isMaybe ? 'سأحاول الحضور 🟡' : 'أعتذر لظروف 🔴'}
                        </span>
                      </div>

                      {/* Guest Count Badge (if attending or maybe) */}
                      {!isNotAttending && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-stone-600">عدد الأفراد:</span>
                          <span className="font-black px-2.5 py-0.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 font-mono text-[11px]">
                            {rsvp.guestCount === 1 ? 'فرد واحد (شخصي)' : `${rsvp.guestCount} أفراد`}
                          </span>
                        </div>
                      )}

                      {/* Message or Congratulations note */}
                      {rsvp.message && (
                        <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 text-xs text-stone-700 space-y-1 relative">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-[#720925]">
                            <MessageSquare className="w-3 h-3" />
                            <span>رسالة تهنئة من الضيف:</span>
                          </div>
                          <p className="leading-relaxed font-medium italic text-stone-800">
                            &ldquo;{rsvp.message}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Guest Card Footer Actions */}
                    {rsvp.phone && (
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="font-mono text-xs text-stone-500 dir-ltr text-right">
                          {rsvp.phone}
                        </span>

                        <a
                          href={`https://wa.me/${rsvp.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `أهلاً بحضرتك ${rsvp.name}، شكراً جزيلاً لتأكيد حضورك ومشاركتك فرحتنا! ❤️`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-700" />
                          <span>شكر عبر واتساب</span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="text-center pt-8 text-stone-400 text-xs space-y-1">
          <p>منصة فرحنا • نظام حصر المعازيم وتأكيدات الحضور الرقمي 👑</p>
          <p className="text-[11px]">جميع الردود مشفرة ومحفوظة بأمان لأصحاب المناسبة</p>
        </div>
      </div>
    </div>
  );
}
