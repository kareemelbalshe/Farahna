'use client';

import React, { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/api';
import {
  CheckSquare,
  Users,
  Phone,
  MessageSquare,
  Download,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Filter,
  Search,
  X,
  ExternalLink,
} from 'lucide-react';
import { formatArabicDate } from '@/lib/date';
import { AppTable, type ColumnDef } from '@/components/ui/AppTable';

export default function AdminRsvpPage() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [selectedInvId, setSelectedInvId] = useState<string>('');
  const [currentInv, setCurrentInv] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toggling, setToggling] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchInvitations = () => {
    adminFetch('/invitations').then((res) => {
      if (res.success && res.data.invitations?.length > 0) {
        setInvitations(res.data.invitations);
        if (!selectedInvId) {
          setSelectedInvId(res.data.invitations[0].id);
        }
      }
      setLoading(false);
    });
  };

  const fetchCurrentInvitation = (id: string) => {
    adminFetch(`/invitations/${id}`).then((res) => {
      if (res.success) {
        setCurrentInv(res.data);
      }
    });
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  useEffect(() => {
    if (!selectedInvId) return;
    fetchCurrentInvitation(selectedInvId);
  }, [selectedInvId]);

  const handleToggleRsvp = async () => {
    if (!currentInv || toggling) return;
    setToggling(true);
    const newStatus = !currentInv.rsvpEnabled;
    try {
      const res = await adminFetch(`/invitations/${currentInv.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ rsvpEnabled: newStatus }),
      });
      if (res.success) {
        setCurrentInv((prev: any) => ({ ...prev, rsvpEnabled: newStatus }));
        setToastMsg(
          newStatus
            ? 'تم تفعيل قسم تأكيد الحضور (RSVP) في الدعوة بنجاح 🟢'
            : 'تم تعطيل قسم تأكيد الحضور (RSVP) وإخفاؤه تماماً من الدعوة 🔴'
        );
      }
    } catch (e: any) {
      alert(e.message || 'فشل تغيير حالة القسم');
    } finally {
      setToggling(false);
    }
  };

  const rsvps = currentInv?.rsvps || [];
  const attendingCount = rsvps.filter((r: any) => r.attendanceStatus === 'attending').length;
  const notAttendingCount = rsvps.filter((r: any) => r.attendanceStatus === 'not_attending').length;
  const maybeCount = rsvps.filter((r: any) => r.attendanceStatus === 'maybe').length;
  const totalGuestsSum = rsvps
    .filter((r: any) => r.attendanceStatus === 'attending')
    .reduce((sum: number, r: any) => sum + (r.guestCount || 1), 0);

  const filteredRsvps = rsvps.filter((r: any) => {
    const matchesStatus = statusFilter === 'all' || r.attendanceStatus === statusFilter;
    const matchesSearch =
      !searchQuery ||
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone?.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const exportCsv = () => {
    if (rsvps.length === 0) return;
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      ['الاسم,الهاتف,الموقف,عدد الأفراد,رسالة التهنئة,التاريخ']
        .concat(
          rsvps.map(
            (r: any) =>
              `"${r.name}","${r.phone || ''}","${r.attendanceStatus}","${r.guestCount}","${(
                r.message || ''
              ).replace(/"/g, '""')}","${r.createdAt}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rsvp-${currentInv?.slug || 'guests'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const rsvpColumns: ColumnDef<any>[] = [
    {
      key: 'name',
      title: 'اسم الضيف',
      align: 'right',
      sortable: true,
      render: (val) => <span className="font-bold text-stone-900">{val}</span>,
    },
    {
      key: 'phone',
      title: 'رقم الهاتف',
      align: 'right',
      render: (val) => (
        <span className="font-mono dir-ltr text-right text-stone-600">{val || '—'}</span>
      ),
    },
    {
      key: 'attendanceStatus',
      title: 'الموقف من الحضور',
      align: 'right',
      render: (val) => (
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
            val === 'attending'
              ? 'bg-emerald-100 text-emerald-800'
              : val === 'not_attending'
              ? 'bg-rose-100 text-rose-800'
              : 'bg-amber-100 text-amber-900'
          }`}
        >
          {val === 'attending'
            ? '🎉 حاضر بحول الله'
            : val === 'not_attending'
            ? '💌 معتذر'
            : '⏳ ربما أحضر'}
        </span>
      ),
    },
    {
      key: 'guestCount',
      title: 'عدد الأفراد',
      align: 'center',
      sortable: true,
      render: (_, r) => (
        <span className="font-black text-stone-800">
          {r.attendanceStatus === 'not_attending' ? '0' : r.guestCount}
        </span>
      ),
    },
    {
      key: 'message',
      title: 'رسالة التهنئة',
      align: 'right',
      render: (val) => <span className="text-stone-600 italic max-w-xs block">{val || '—'}</span>,
    },
    {
      key: 'createdAt',
      title: 'تاريخ الرد',
      align: 'right',
      sortable: true,
      render: (val) => <span className="text-stone-400 text-[11px]">{formatArabicDate(val)}</span>,
    },
  ];

  return (
    <div className="space-y-6 text-right font-cairo">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-stone-900">
              تأكيدات الحضور والضيوف (RSVP) 📋
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-[#720925] font-bold border border-rose-200">
              {rsvps.length} رد مستلم
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            حصر أعداد الضيوف المؤكدين، المعتذرين، وتصدير كشوف الحضور لكل دعوة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentInv && (
            <a
              href={`/invitation/wedding/${currentInv.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>معاينة صفحة الضيف</span>
            </a>
          )}

          <button
            type="button"
            onClick={exportCsv}
            disabled={rsvps.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-800 font-bold text-xs shadow-2xs hover:bg-stone-50 disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>تصدير كشف الضيوف CSV</span>
          </button>
        </div>
      </div>

      {/* Invitation Selector & Section Enable/Disable Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selector */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs space-y-2">
          <label className="text-xs font-bold text-stone-700 block">اختر الدعوة لعرض كشف ضيوفها:</label>
          <select
            value={selectedInvId}
            onChange={(e) => setSelectedInvId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-white font-bold focus:border-[#720925] focus:outline-hidden"
          >
            {invitations.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.title} ({inv.coupleGroomAr} &amp; {inv.coupleBrideAr})
              </option>
            ))}
          </select>
        </div>

        {/* Section Enable/Disable Toggle Card */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-2xs flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-stone-700 block">
              حالة قسم تأكيد الحضور (RSVP):
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black border ${
                  currentInv?.rsvpEnabled
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-rose-50 text-rose-800 border-rose-300'
                }`}
              >
                {currentInv?.rsvpEnabled ? 'مفعّل وظاهر للضيوف 🟢' : 'معطّل ومخفي عن الضيوف 🔴'}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              {currentInv?.rsvpEnabled
                ? 'السكشن ظاهر للضيوف في صفحة الدعوة لاستقبال الردود.'
                : 'السكشن مخفي بالكامل ولن يظهر للضيوف في صفحة الدعوة.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleRsvp}
            disabled={toggling}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
              currentInv?.rsvpEnabled
                ? 'bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {currentInv?.rsvpEnabled ? (
              <>
                <ToggleRight className="w-4 h-4 text-rose-700" />
                <span>تعطيل السكشن</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4" />
                <span>تفعيل السكشن</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5 Stats Summary Cards (Exact requirement) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* 1. Total Responses */}
        <div className="p-4 rounded-3xl bg-white border border-stone-200/90 shadow-2xs">
          <p className="text-[11px] text-stone-500 font-bold">إجمالي الردود</p>
          <p className="text-2xl font-black text-stone-900 font-cairo mt-1">{rsvps.length}</p>
        </div>

        {/* 2. Attending */}
        <div className="p-4 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 shadow-2xs">
          <p className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>حاضرون مؤكدون</span>
          </p>
          <p className="text-2xl font-black text-emerald-900 font-cairo mt-1">{attendingCount}</p>
        </div>

        {/* 3. Not Attending */}
        <div className="p-4 rounded-3xl bg-rose-50/60 border border-rose-200/80 shadow-2xs">
          <p className="text-[11px] text-rose-800 font-bold flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>معتذرون</span>
          </p>
          <p className="text-2xl font-black text-rose-900 font-cairo mt-1">{notAttendingCount}</p>
        </div>

        {/* 4. Maybe */}
        <div className="p-4 rounded-3xl bg-amber-50/60 border border-amber-200/80 shadow-2xs">
          <p className="text-[11px] text-amber-800 font-bold flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>ربما يحضرون</span>
          </p>
          <p className="text-2xl font-black text-amber-900 font-cairo mt-1">{maybeCount}</p>
        </div>

        {/* 5. Total Guests Sum */}
        <div className="p-4 rounded-3xl bg-stone-900 text-white shadow-2xs col-span-2 sm:col-span-1">
          <p className="text-[11px] text-amber-300 font-bold">إجمالي الأفراد</p>
          <p className="text-2xl font-black font-cairo mt-1 text-white">{totalGuestsSum} أفراد</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
              statusFilter === 'all'
                ? 'bg-[#720925] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            الكل ({rsvps.length})
          </button>
          <button
            onClick={() => setStatusFilter('attending')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
              statusFilter === 'attending'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            حاضر ({attendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('not_attending')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
              statusFilter === 'not_attending'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            معتذر ({notAttendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('maybe')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
              statusFilter === 'maybe'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            ربما ({maybeCount})
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="بحث بالاسم أو الهاتف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 pr-9 rounded-xl border border-stone-200 text-xs focus:border-[#720925] focus:outline-hidden"
          />
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
        </div>
      </div>

      {/* RSVPs Table powered by @kareemelbalshe/any-table */}
      <AppTable
        data={filteredRsvps}
        columns={rsvpColumns}
        rowKey="id"
        search={false}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [10, 25, 50],
          showPageSizeSelector: true,
          showTotalCount: true,
        }}
        emptyTitle="لا توجد ردود مسجلة مطابقة للبحث"
        emptyDescription={
          rsvps.length === 0
            ? 'لم يقم أي ضيف بتسجيل تأكيد الحضور لهذه الدعوة حتى الآن'
            : 'جرّب تغيير فلتر البحث أو إزالة النص المكتوب'
        }
      />
    </div>
  );
}
