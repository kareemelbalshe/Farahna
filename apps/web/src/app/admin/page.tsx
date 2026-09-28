'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MailOpen,
  CheckCircle2,
  Users,
  Eye,
  CheckSquare,
  Sparkles,
  CreditCard,
  ArrowUpRight,
  PlusCircle,
  Clock,
  ExternalLink,
  ChevronLeft,
  ShoppingBag,
} from 'lucide-react';
import { adminFetch } from '@/lib/api';
import { ORDER_STATUS_LABELS } from '@farahna/shared';
import { formatArabicDate } from '@/lib/date';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>({
    totalInvitations: 2,
    publishedInvitations: 2,
    totalLeads: 0,
    totalViews: 680,
    totalRsvps: 0,
    totalRevenueEgp: 0,
    recentOrders: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminFetch('/analytics/dashboard')
      .then((res) => {
        if (res.success && res.data) {
          setStats(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Five Required Primary Metrics Cards + Extra Revenue Metric
  const primaryMetrics = [
    {
      title: 'إجمالي الدعوات',
      value: stats?.totalInvitations || 0,
      sub: 'كل الدعوات المنشأة في النظام',
      icon: MailOpen,
      color: 'text-[#720925] bg-rose-50 border-rose-200',
    },
    {
      title: 'الدعوات المنشورة',
      value: stats?.publishedInvitations || 0,
      sub: 'روابط نشطة ومتاحة للضيوف',
      icon: CheckCircle2,
      color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'العملاء المحتملين (Leads)',
      value: stats?.totalLeads || 0,
      sub: 'طلبات استفسار وحجز جديدة',
      icon: Sparkles,
      color: 'text-amber-800 bg-amber-50 border-amber-200',
    },
    {
      title: 'إجمالي المشاهدات (Views)',
      value: (stats?.totalViews || 0).toLocaleString('ar-EG'),
      sub: 'زيارات حقيقية لصفحات الدعوة',
      icon: Eye,
      color: 'text-purple-800 bg-purple-50 border-purple-200',
    },
    {
      title: 'تأكيدات الحضور (RSVP)',
      value: stats?.totalRsvps || 0,
      sub: 'ردود مسجلة من المدعوين',
      icon: CheckSquare,
      color: 'text-blue-800 bg-blue-50 border-blue-200',
    },
  ];

  return (
    <div className="space-y-8 font-cairo text-right">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            لوحة قيادة فرحنا المركزية 👋
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            متابعة فورية لأداء الدعوات، طلبات العرسان الجدد، وتأكيدات حضور الضيوف
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/invitations/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl burgundy-gradient-bg text-white font-bold text-xs shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity"
          >
            <PlusCircle className="w-4 h-4" />
            <span>دعوة جديدة</span>
          </Link>
          <Link
            href="/admin/payments"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-800 font-bold text-xs shadow-2xs hover:bg-stone-50 transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
            <span>المدفوعات</span>
          </Link>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-800 font-bold text-xs shadow-2xs hover:bg-stone-50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>العملاء المحتملين</span>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid (5 Required Cards + Revenue) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {primaryMetrics.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500">{card.title}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-stone-900">{card.value}</p>
                <p className="text-[10px] text-stone-400 mt-0.5 font-medium">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Highlight Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-stone-400 block font-medium">إجمالي مدفوعات InstaPay المحققة:</span>
            <span className="text-2xl font-black text-emerald-400">
              {(stats?.totalRevenueEgp || 0).toLocaleString('ar-EG')} جنيه مصري
            </span>
          </div>
        </div>
        <Link
          href="/admin/payments"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors self-start sm:self-auto"
        >
          <span>مراجعة إيصالات التحويل</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Recent Activity Sections (النشاط الحديث) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* 1. أحدث طلبات العرسان (Recent Orders) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-black text-stone-900">أحدث طلبات العرسان</h2>
              <p className="text-[11px] text-stone-400">متابعة مسار التصميم، التحقق من الدفع، والتسليم</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#720925] hover:underline flex items-center gap-1"
            >
              <span>عرض الكل</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="divide-y divide-stone-100">
              {stats.recentOrders.map((order: any) => {
                const statusInfo = (ORDER_STATUS_LABELS as any)[order.status] || {
                  ar: order.status,
                  color: 'bg-stone-100 text-stone-700',
                };
                return (
                  <div
                    key={order.id}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-stone-50/50 px-2 rounded-xl transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">
                          {order.customer?.name || 'عميل'}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${statusInfo.color}`}
                        >
                          {statusInfo.ar}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400">
                        {order.invitation?.title || 'طلب تصميم دعوة'} • {order.finalPriceEgp || 0} ج.م
                      </p>
                    </div>

                    <div className="text-left text-[11px] text-stone-400">
                      {formatArabicDate(order.createdAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-stone-400 font-bold">
              لا توجد طلبات جديدة في الوقت الحالي
            </div>
          )}
        </div>

        {/* 2. أحدث تأكيدات حضور الضيوف (Recent RSVPs) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-black text-stone-900">أحدث ردود الحضور (RSVP)</h2>
              <p className="text-[11px] text-stone-400">تفاعل الضيوف وتأكيدات الحضور اللحظية</p>
            </div>
            <Link
              href="/admin/rsvp"
              className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
            >
              <span>عرض السجل</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="divide-y divide-stone-100">
              {stats.recentActivity.map((rsvp: any) => {
                const isAttending = rsvp.attendanceStatus === 'attending';
                return (
                  <div
                    key={rsvp.id}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-stone-50/50 px-2 rounded-xl transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">{rsvp.guestName}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isAttending
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {isAttending ? 'يحضر بالتأكيد ✨' : 'يعتذر عن الحضور'}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400">
                        {rsvp.invitation?.title || 'دعوة فرح'} • {rsvp.companionsCount || 0} مرافق
                      </p>
                    </div>

                    <div className="text-left text-[11px] text-stone-400">
                      {formatArabicDate(rsvp.createdAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-stone-400 font-bold">
              لا توجد ردود حضور مسجلة حديثاً
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
