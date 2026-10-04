'use client';

import React, { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/api';
import {
  BarChart3,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  MessageCircle,
  Share2,
  MailOpen,
  Music,
  Smartphone,
  Laptop,
  Globe,
  RefreshCw,
  CheckCircle2,
  ArrowLeft,
  ChevronDown,
  Layers,
  Sparkles,
  Clock,
  ShieldCheck,
  CreditCard,
  Send,
  UserCheck,
  Palette,
} from 'lucide-react';
import { AppTable, type ColumnDef } from '@/components/ui/AppTable';

interface FunnelStage {
  key: string;
  nameAr: string;
  count: number;
  color: string;
}

interface ActionClicks {
  whatsappClicks: number;
  mapClicks: number;
  calendarClicks: number;
  shareClicks: number;
  envelopeOpens: number;
  musicPlays: number;
  rsvpSubmissions: number;
}

interface InvitationSummary {
  id: string;
  title: string;
  slug: string;
  status: string;
  coupleGroomAr?: string;
  coupleBrideAr?: string;
}

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'funnel' | 'invitations'>('funnel');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Funnel state
  const [funnelData, setFunnelData] = useState<{
    funnelStages: FunnelStage[];
    totalLeads: number;
    totalCustomers: number;
    totalOrders: number;
    paymentsVerified: number;
    publishedInvitations: number;
    totalRsvps: number;
  } | null>(null);

  // Invitations state
  const [invitationsList, setInvitationsList] = useState<InvitationSummary[]>([]);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string>('');
  const [invitationAnalytics, setInvitationAnalytics] = useState<any>(null);
  const [loadingInvitationStats, setLoadingInvitationStats] = useState(false);

  // Load Funnel and Invitations List
  const loadInitialData = async () => {
    try {
      setRefreshing(true);
      const [funnelRes, invRes] = await Promise.all([
        adminFetch('/analytics/funnel'),
        adminFetch('/invitations'),
      ]);

      if (funnelRes?.success && funnelRes?.data) {
        setFunnelData(funnelRes.data);
      }

      if (invRes?.success && invRes?.data?.invitations) {
        const list: InvitationSummary[] = invRes.data.invitations;
        setInvitationsList(list);
        if (list.length > 0 && !selectedInvitationId) {
          setSelectedInvitationId(list[0].id);
        }
      }
    } catch (e) {
      console.error('Error loading analytics:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Load Per-Invitation Analytics when selectedInvitationId changes
  useEffect(() => {
    if (!selectedInvitationId) return;

    let isMounted = true;
    setLoadingInvitationStats(true);
    adminFetch(`/analytics/${selectedInvitationId}`)
      .then((res) => {
        if (isMounted && res?.success && res?.data) {
          setInvitationAnalytics(res.data);
        }
      })
      .catch((err) => console.error('Error fetching invitation analytics:', err))
      .finally(() => {
        if (isMounted) setLoadingInvitationStats(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedInvitationId]);

  const actionClicks: ActionClicks = invitationAnalytics?.actionClicks || {
    whatsappClicks: 0,
    mapClicks: 0,
    calendarClicks: 0,
    shareClicks: 0,
    envelopeOpens: 0,
    musicPlays: 0,
    rsvpSubmissions: 0,
  };

  // Funnel calculations
  const stages = funnelData?.funnelStages || [];
  const maxFunnelCount = stages.length > 0 ? Math.max(...stages.map((s) => s.count), 1) : 1;

  // Device & Browser counts
  const deviceList = invitationAnalytics?.deviceBreakdown || [];
  const totalDeviceEvents = deviceList.reduce(
    (sum: number, item: any) => sum + (item._count?.deviceType || 0),
    0
  );

  const browserList = invitationAnalytics?.browserBreakdown || [];
  const totalBrowserEvents = browserList.reduce(
    (sum: number, item: any) => sum + (item._count?.browser || 0),
    0
  );

  const rsvpList = invitationAnalytics?.rsvpBreakdown || [];
  const attendingRsvp = rsvpList.find((r: any) => r.attendanceStatus === 'attending');
  const declinedRsvp = rsvpList.find((r: any) => r.attendanceStatus === 'not_attending');
  const maybeRsvp = rsvpList.find((r: any) => r.attendanceStatus === 'maybe');

  const recentEventColumns: ColumnDef<any>[] = [
    {
      key: 'eventType',
      title: 'نوع الحدث',
      align: 'right',
      render: (type) => {
        const eventLabel =
          type === 'page_view'
            ? 'مشاهدة صفحة (Page View)'
            : type === 'whatsapp_click'
            ? 'نقرة واتساب (WhatsApp Click)'
            : type === 'map_click'
            ? 'فتح الخريطة (Map Click)'
            : type === 'calendar_click'
            ? 'إضافة للتقويم (Calendar Add)'
            : type === 'share_click'
            ? 'مشاركة الرابط (Share Click)'
            : type === 'envelope_open'
            ? 'فتح الظرف (Envelope Open)'
            : type === 'rsvp_submission'
            ? 'تأكيد الحضور (RSVP Submitted)'
            : type;
        return (
          <span className="inline-flex items-center gap-1.5 font-bold text-stone-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            {eventLabel}
          </span>
        );
      },
    },
    {
      key: 'browser',
      title: 'المتصفح',
      align: 'right',
      render: (val) => <span className="font-mono text-stone-600">{val || 'Chrome'}</span>,
    },
    {
      key: 'deviceType',
      title: 'الجهاز',
      align: 'right',
      render: (val) => <span className="text-stone-600">{val || 'mobile'}</span>,
    },
    {
      key: 'country',
      title: 'البلد',
      align: 'right',
      render: (val) => <span className="text-stone-600">{val || 'EG (مصر)'}</span>,
    },
    {
      key: 'createdAt',
      title: 'الوقت',
      align: 'right',
      render: (val) => (
        <span className="font-mono text-[11px] text-stone-400" dir="ltr">
          {new Date(val).toLocaleTimeString('ar-EG')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-right font-cairo">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-stone-900">
              التحليلات وقمع التحويل (Analytics & Funnel)
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-200 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              بيانات حية من قاعدة البيانات
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            متابعة تفاعل الضيوف مع الدعوات، النقرات على الأزرار الحيوية، وقمع تحويل المبيعات المتكامل
          </p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={loadInitialData}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 active:scale-95 transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-stone-600 ${refreshing ? 'animate-spin' : ''}`} />
          <span>تحديث الإحصائيات الحية</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-100/90 max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab('funnel')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'funnel'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-600" />
          <span>قمع التحويل الكامل (Business Funnel)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('invitations')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'invitations'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-purple-600" />
          <span>تحليلات الدعوات (Per-Invitation)</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: BUSINESS CONVERSION FUNNEL                            */}
      {/* ============================================================ */}
      {activeTab === 'funnel' && (
        <div className="space-y-6">
          {/* Funnel Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-400">العملاء المحتملين</span>
              <p className="text-2xl font-black text-purple-700 mt-1">{funnelData?.totalLeads || 0}</p>
              <span className="text-[10px] text-stone-400">Leads مسجلين</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-400">العملاء المؤكدين</span>
              <p className="text-2xl font-black text-pink-700 mt-1">{funnelData?.totalCustomers || 0}</p>
              <span className="text-[10px] text-stone-400">Customers بالداتابيز</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-400">إجمالي الطلبات</span>
              <p className="text-2xl font-black text-amber-700 mt-1">{funnelData?.totalOrders || 0}</p>
              <span className="text-[10px] text-stone-400">طلبات Orders</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-400">المدفوعات المعتمدة</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">{funnelData?.paymentsVerified || 0}</p>
              <span className="text-[10px] text-stone-400">تحويلات إنستاباي</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-400">الدعوات المنشورة</span>
              <p className="text-2xl font-black text-stone-900 mt-1">{funnelData?.publishedInvitations || 0}</p>
              <span className="text-[10px] text-stone-400">دعوات Live متاحة</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[11px] font-bold text-stone-400">ردود RSVP</span>
              <p className="text-2xl font-black text-green-700 mt-1">{funnelData?.totalRsvps || 0}</p>
              <span className="text-[10px] text-stone-400">تأكيدات حضور</span>
            </div>
          </div>

          {/* Detailed 14-Stage Visual Funnel Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  <span>مراحل قمع التحويل الكامل (End-to-End Business Funnel)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  تتبع رحلة العميل من أول زيارة للموقع حتى تأكيد حضور ضيوف الفرح (14 مرحلة دقيقة مرتبطة بكيانات النظام الفعلية)
                </p>
              </div>
              <span className="text-xs text-stone-400 self-end sm:self-auto font-mono">
                14 Stages
              </span>
            </div>

            {/* Stages Stack */}
            <div className="space-y-3.5">
              {stages.map((stage, idx) => {
                const widthPct = Math.max(8, Math.round((stage.count / maxFunnelCount) * 100));
                const prevStage = idx > 0 ? stages[idx - 1] : null;
                const conversionFromPrev =
                  prevStage && prevStage.count > 0
                    ? Math.round((stage.count / prevStage.count) * 100)
                    : 100;

                return (
                  <div key={stage.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-stone-100 border border-stone-200 text-stone-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-stone-800">{stage.nameAr}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {idx > 0 && (
                          <span className="text-[10px] text-stone-400 hidden sm:inline">
                            تحويل: {conversionFromPrev}%
                          </span>
                        )}
                        <span className="font-black text-stone-900 font-mono text-sm">
                          {stage.count.toLocaleString('ar-EG')}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-4 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${widthPct}%`,
                          backgroundColor: stage.color || '#D4AF37',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Funnel Flow Architecture Legend */}
            <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-stone-600">
              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1">
                <span className="font-bold text-blue-900">مرحلة الاكتشاف (Top)</span>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  زيارة الصفحة الرئيسية وتصفح نماذج الدعوات الحية وضغط زر واتساب للاستفسار.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
                <span className="font-bold text-purple-900">تسجيل الطلب (Mid)</span>
                <p className="text-[11px] text-purple-800 leading-relaxed">
                  تحويل العميل من استفسار (Lead) إلى عميل مسجل (Customer) وإنشاء طلب دعوة (Order).
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
                <span className="font-bold text-amber-900">التصميم والدفع</span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  تجهيز رابط المعاينة، الموافقة، التحويل عبر إنستاباي، واعتماد الإيصال الإداري.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <span className="font-bold text-emerald-900">النشر وتفاعل الضيوف (Bottom)</span>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  إطلاق الدعوة أونلاين، إرسالها للضيوف، وحصد ردود تأكيد الحضور (RSVP) بدقة.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: PER-INVITATION ANALYTICS                              */}
      {/* ============================================================ */}
      {activeTab === 'invitations' && (
        <div className="space-y-6">
          {/* Invitation Selector Header */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-500">اختر الدعوة لعرض تحليلاتها بالتفصيل:</label>
                <div className="relative max-w-md">
                  <select
                    value={selectedInvitationId}
                    onChange={(e) => setSelectedInvitationId(e.target.value)}
                    className="w-full appearance-none px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-300 text-stone-800 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all cursor-pointer"
                  >
                    {invitationsList.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.title} ({inv.slug})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {invitationAnalytics?.invitation && (
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-200">
                    العروسين: {invitationAnalytics.invitation.coupleGroomAr} & {invitationAnalytics.invitation.coupleBrideAr}
                  </span>
                  <a
                    href={`/invitation/${invitationAnalytics.invitation.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-700 hover:text-amber-800 font-bold underline inline-flex items-center gap-1"
                  >
                    فتح الدعوة كضيف
                    <ArrowLeft className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {loadingInvitationStats ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
              <p className="text-xs text-stone-500">جاري تحميل سجلات وإحصائيات الدعوة المحددة...</p>
            </div>
          ) : invitationAnalytics ? (
            <>
              {/* Primary Metrics 4-Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-500">إجمالي المشاهدات</span>
                    <Eye className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-3xl font-black text-stone-900">
                    {(invitationAnalytics.invitation.viewsCount || 0).toLocaleString('ar-EG')}
                  </p>
                  <p className="text-[11px] text-stone-400">مرات فتح الدعوة من الضيوف</p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-500">الزوار الفريدون</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-3xl font-black text-stone-900">
                    {(invitationAnalytics.invitation.uniqueVisitorsCount || 0).toLocaleString('ar-EG')}
                  </p>
                  <p className="text-[11px] text-stone-400">أجهزة ومستخدمين مختلفين</p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-500">إجمالي الردود على RSVP</span>
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-3xl font-black text-emerald-700">
                    {(actionClicks.rsvpSubmissions || 0).toLocaleString('ar-EG')}
                  </p>
                  <p className="text-[11px] text-stone-400">استمارة تأكيد حضور مسجلة</p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-500">تفاعل الأزرار الإجمالي</span>
                    <Sparkles className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-3xl font-black text-stone-900">
                    {(
                      actionClicks.whatsappClicks +
                      actionClicks.mapClicks +
                      actionClicks.calendarClicks +
                      actionClicks.shareClicks
                    ).toLocaleString('ar-EG')}
                  </p>
                  <p className="text-[11px] text-stone-400">نقرات واتساب، خريطة، تقويم، ومشاركة</p>
                </div>
              </div>

              {/* Action Clicks Breakdown Section */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-5">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-amber-600" />
                    <span>تفاعل الضيوف مع الأزرار والإجراءات التفاعلية (Action Clicks)</span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    إحصائيات الضغط الفعلي على كل زر داخل صفحة الدعوة العامة
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {/* WhatsApp */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-center space-y-1">
                    <MessageCircle className="w-5 h-5 text-emerald-600 mx-auto" />
                    <span className="text-[11px] font-bold text-emerald-900 block">نقرات واتساب</span>
                    <p className="text-2xl font-black text-emerald-700">
                      {actionClicks.whatsappClicks.toLocaleString('ar-EG')}
                    </p>
                    <span className="text-[10px] text-emerald-600/80 block">تواصل أو تهنئة</span>
                  </div>

                  {/* Map */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-center space-y-1">
                    <MapPin className="w-5 h-5 text-blue-600 mx-auto" />
                    <span className="text-[11px] font-bold text-blue-900 block">فتح الخريطة</span>
                    <p className="text-2xl font-black text-blue-700">
                      {actionClicks.mapClicks.toLocaleString('ar-EG')}
                    </p>
                    <span className="text-[10px] text-blue-600/80 block">الاتجاهات والموقع</span>
                  </div>

                  {/* Calendar */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-center space-y-1">
                    <Calendar className="w-5 h-5 text-amber-600 mx-auto" />
                    <span className="text-[11px] font-bold text-amber-900 block">إضافة للتقويم</span>
                    <p className="text-2xl font-black text-amber-700">
                      {actionClicks.calendarClicks.toLocaleString('ar-EG')}
                    </p>
                    <span className="text-[10px] text-amber-600/80 block">Google / iCal</span>
                  </div>

                  {/* Share */}
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-center space-y-1">
                    <Share2 className="w-5 h-5 text-purple-600 mx-auto" />
                    <span className="text-[11px] font-bold text-purple-900 block">مشاركة الرابط</span>
                    <p className="text-2xl font-black text-purple-700">
                      {actionClicks.shareClicks.toLocaleString('ar-EG')}
                    </p>
                    <span className="text-[10px] text-purple-600/80 block">نسخ أو مشاركة</span>
                  </div>

                  {/* Envelope Opens */}
                  <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-center space-y-1">
                    <MailOpen className="w-5 h-5 text-rose-600 mx-auto" />
                    <span className="text-[11px] font-bold text-rose-900 block">فتح الظرف</span>
                    <p className="text-2xl font-black text-rose-700">
                      {actionClicks.envelopeOpens.toLocaleString('ar-EG')}
                    </p>
                    <span className="text-[10px] text-rose-600/80 block">Envelope Opened</span>
                  </div>

                  {/* Music Play */}
                  <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 text-center space-y-1">
                    <Music className="w-5 h-5 text-stone-600 mx-auto" />
                    <span className="text-[11px] font-bold text-stone-800 block">تشغيل الموسيقى</span>
                    <p className="text-2xl font-black text-stone-800">
                      {actionClicks.musicPlays.toLocaleString('ar-EG')}
                    </p>
                    <span className="text-[10px] text-stone-500 block">Music Played</span>
                  </div>
                </div>
              </div>

              {/* Technical Distribution: Devices & Browsers (2 columns) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Devices */}
                <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="text-sm font-black text-stone-900 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-amber-600" />
                      <span>توزيع الأجهزة (Device Type)</span>
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      {totalDeviceEvents} حدث مسجل
                    </span>
                  </div>

                  {deviceList.length === 0 ? (
                    <p className="text-xs text-stone-400 py-4 text-center">لا توجد بيانات أجهزة مسجلة بعد</p>
                  ) : (
                    <div className="space-y-3">
                      {deviceList.map((item: any) => {
                        const count = item._count?.deviceType || 0;
                        const pct = totalDeviceEvents > 0 ? Math.round((count / totalDeviceEvents) * 100) : 0;
                        const label =
                          item.deviceType === 'mobile'
                            ? 'هاتف ذكي (Mobile)'
                            : item.deviceType === 'desktop'
                            ? 'كمبيوتر مكتبي (Desktop)'
                            : item.deviceType === 'tablet'
                            ? 'جهاز لوحي (Tablet)'
                            : item.deviceType;

                        return (
                          <div key={item.deviceType} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                              <span>{label}</span>
                              <span className="font-mono text-stone-900">
                                {count} ({pct}%)
                              </span>
                            </div>
                            <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-600 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Browsers */}
                <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="text-sm font-black text-stone-900 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span>توزيع المتصفحات (Browsers)</span>
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      {totalBrowserEvents} حدث مسجل
                    </span>
                  </div>

                  {browserList.length === 0 ? (
                    <p className="text-xs text-stone-400 py-4 text-center">لا توجد بيانات متصفحات مسجلة بعد</p>
                  ) : (
                    <div className="space-y-3">
                      {browserList.map((item: any) => {
                        const count = item._count?.browser || 0;
                        const pct = totalBrowserEvents > 0 ? Math.round((count / totalBrowserEvents) * 100) : 0;

                        return (
                          <div key={item.browser} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                              <span>{item.browser || 'Unknown'}</span>
                              <span className="font-mono text-stone-900">
                                {count} ({pct}%)
                              </span>
                            </div>
                            <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* RSVP Breakdown Card */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <span className="text-sm font-black text-stone-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>توزيع ردود تأكيد الحضور (RSVP Summary)</span>
                  </span>
                  <span className="text-xs text-stone-400">
                    حالة الـ RSVP بالدعوة: {invitationAnalytics.invitation.rsvpEnabled ? 'مفعّل ✅' : 'معطّل ❌'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                    <span className="text-xs font-bold text-emerald-800">حاضرون بالتأكيد</span>
                    <p className="text-2xl font-black text-emerald-700">
                      {attendingRsvp?._count?.attendanceStatus || 0}
                    </p>
                    <span className="text-[11px] text-emerald-600 block">
                      إجمالي الأفراد: {attendingRsvp?._sum?.guestCount || 0} فرد
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-1">
                    <span className="text-xs font-bold text-rose-800">معتذرون</span>
                    <p className="text-2xl font-black text-rose-700">
                      {declinedRsvp?._count?.attendanceStatus || 0}
                    </p>
                    <span className="text-[11px] text-rose-600 block">أرسلوا اعتذاراً لطيفاً</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
                    <span className="text-xs font-bold text-amber-800">غير متأكدين</span>
                    <p className="text-2xl font-black text-amber-700">
                      {maybeRsvp?._count?.attendanceStatus || 0}
                    </p>
                    <span className="text-[11px] text-amber-600 block">
                      الأفراد المحتملين: {maybeRsvp?._sum?.guestCount || 0} فرد
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Events Stream Table (Recent 10 Events) */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-stone-500" />
                    <span>سجل التفاعل المباشر (آخر 10 أحداث مسجلة لحظياً)</span>
                  </h3>
                  <span className="text-xs text-stone-400">Privacy-Conscious Logging</span>
                </div>

                <div className="mt-3">
                  <AppTable
                    data={invitationAnalytics.recentEvents || []}
                    columns={recentEventColumns}
                    rowKey="id"
                    search={false}
                    pagination={false}
                    emptyTitle="لا توجد أحداث مسجلة لهذه الدعوة حتى الآن"
                    emptyDescription="سيتم تسجيل تفاعلات الضيوف فورياً بمجرد فتح الدعوة"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-stone-200">
              <p className="text-xs text-stone-500">اختر دعوة لعرض تفاصيلها</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
