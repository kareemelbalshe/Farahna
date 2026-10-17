'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MailOpen,
  PlusCircle,
  Eye,
  Edit,
  Copy,
  Pause,
  Play,
  Trash2,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  X,
  Clock,
  Layers,
} from 'lucide-react';
import { adminFetch, deleteInvitation } from '@/lib/api';
import { formatArabicDate } from '@/lib/date';
import { INVITATION_TYPE_LABELS } from '@farahna/shared';
import { AppTable, type ColumnDef } from '@/components/ui/AppTable';

const isNewInvitation = (createdAt: string | Date | undefined) => {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diffHours = (now - created) / (1000 * 60 * 60);
  return diffHours <= 48; // within last 48 hours
};

const formatRelativeArabicTime = (dateStr: string | Date | undefined) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const diffMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
  if (diffMinutes < 5) return 'الآن ⚡';
  if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `منذ ${diffHours} ${diffHours === 1 ? 'ساعة' : diffHours === 2 ? 'ساعتين' : diffHours <= 10 ? 'ساعات' : 'ساعة'}`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'أمس';
  if (diffDays === 2) return 'أول أمس';
  if (diffDays <= 7) return `منذ ${diffDays} أيام`;
  return formatArabicDate(dateStr);
};

export default function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'published' | 'draft'>('all');
  const [msg, setMsg] = useState('');
  const [invitationToDelete, setInvitationToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadInvitations = () => {
    setLoading(true);
    adminFetch(`/invitations?limit=100&search=${encodeURIComponent(search)}`)
      .then((res) => {
        if (res.success) {
          setInvitations(res.data.invitations || []);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInvitations();
  }, [search]);

  const handleDuplicate = async (id: string) => {
    const res = await adminFetch(`/invitations/${id}/duplicate`, { method: 'POST' });
    if (res.success) {
      setMsg('تم نسخ الدعوة بنجاح!');
      loadInvitations();
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    const action = currentStatus === 'published' ? 'pause' : 'publish';
    const res = await adminFetch(`/invitations/${id}/${action}`, { method: 'POST' });
    if (res.success) {
      setMsg(`تم ${action === 'publish' ? 'نشر' : 'إيقاف'} الدعوة بنجاح!`);
      loadInvitations();
    }
  };

  const handleConfirmDelete = async () => {
    if (!invitationToDelete) return;
    setDeleting(true);
    try {
      const res = await deleteInvitation(invitationToDelete.id);
      if (res.success) {
        setInvitations((prev) => prev.filter((inv) => inv.id !== invitationToDelete.id));
        setMsg(`تم حذف دعوة "${invitationToDelete.title}" بنجاح وتفريغ الرابط 🗑️`);
        setInvitationToDelete(null);
      } else {
        alert(res.message || 'فشل حذف الدعوة');
      }
    } catch (err: any) {
      alert('حدث خطأ أثناء محاولة حذف الدعوة');
    } finally {
      setDeleting(false);
    }
  };

  // Filter calculations
  const newCount = invitations.filter((i) => isNewInvitation(i.createdAt)).length;
  const publishedCount = invitations.filter((i) => i.status === 'published').length;
  const draftCount = invitations.filter((i) => i.status === 'draft').length;

  const filteredInvitations = invitations.filter((inv) => {
    if (activeFilter === 'new') return isNewInvitation(inv.createdAt);
    if (activeFilter === 'published') return inv.status === 'published';
    if (activeFilter === 'draft') return inv.status === 'draft';
    return true;
  });

  const invitationColumns: ColumnDef<any>[] = [
    {
      key: 'title',
      title: 'عنوان الدعوة / العروسين',
      align: 'right',
      sortable: true,
      render: (_, inv) => {
        const isNew = isNewInvitation(inv.createdAt);
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-stone-900">{inv.title}</p>
              {isNew && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-[#720925] border border-rose-300 animate-pulse shadow-xs">
                  <Sparkles className="w-3 h-3 text-[#720925]" />
                  <span>جديدة ✨</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-stone-500">
              <span>
                {inv.coupleGroomAr} &amp; {inv.coupleBrideAr}
              </span>
              {inv.customer?.name && (
                <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium">
                  العميل: {inv.customer.name}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'type',
      title: 'النوع والثيم',
      align: 'right',
      render: (_, inv) => {
        const typeLabel = (INVITATION_TYPE_LABELS as any)[inv.type]?.ar || inv.type;
        return (
          <div className="space-y-1">
            <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold">
              {typeLabel}
            </span>
            <span className="block text-[10px] text-amber-700 font-medium">
              {inv.theme?.nameAr || 'ثيم قياسي'}
            </span>
          </div>
        );
      },
    },
    {
      key: 'slug',
      title: 'الرابط المباشر',
      align: 'right',
      render: (slug, inv) => (
        <a
          href={`/invitation/${inv.type}/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline inline-flex items-center gap-1 font-mono text-[11px] text-blue-600 dir-ltr"
        >
          <span>/{slug}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      ),
    },
    {
      key: 'status',
      title: 'الحالة',
      align: 'right',
      render: (status, inv) => {
        const isNew = isNewInvitation(inv.createdAt);
        return (
          <div className="space-y-1">
            <span
              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black border ${
                status === 'published'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : status === 'paused'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : isNew
                  ? 'bg-rose-50 text-[#720925] border-rose-300 ring-2 ring-rose-100 animate-pulse'
                  : 'bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              {status === 'published'
                ? 'منشورة لايف 🟢'
                : status === 'paused'
                ? 'متوقفة مؤقتاً ⏸️'
                : isNew
                ? 'مسودة جديدة ⏳'
                : 'مسودة 📝'}
            </span>
            <span className="block text-[10px] text-stone-400 font-medium">
              {formatRelativeArabicTime(inv.createdAt)}
            </span>
          </div>
        );
      },
    },
    {
      key: 'viewsCount',
      title: 'المشاهدات',
      align: 'right',
      sortable: true,
      render: (val) => <span className="font-bold text-stone-800">{val || 0} زيارة</span>,
    },
    {
      key: 'eventDate',
      title: 'تاريخ المناسبة',
      align: 'right',
      sortable: true,
      render: (val) => <span className="text-stone-500 text-[11px]">{formatArabicDate(val)}</span>,
    },
    {
      key: 'actions',
      title: 'الإجراءات السريعة',
      align: 'center',
      render: (_, inv) => {
        const publicUrl = `/invitation/${inv.type}/${inv.slug}`;
        const previewUrl = `/preview/${inv.previewToken}`;

        return (
          <div className="flex items-center justify-center gap-1.5">
            <a
              href={inv.status === 'published' ? publicUrl : previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              title="معاينة الدعوة"
            >
              <Eye className="w-4 h-4 text-amber-600" />
            </a>

            <Link
              href={`/admin/invitations/${inv.id}/builder`}
              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#720925] transition-colors"
              title="فتح المحرر المرئي"
            >
              <Edit className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => handleDuplicate(inv.id)}
              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
              title="نسخ الدعوة"
            >
              <Copy className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleTogglePublish(inv.id, inv.status)}
              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              title={inv.status === 'published' ? 'إيقاف مؤقت' : 'نشر'}
            >
              {inv.status === 'published' ? (
                <Pause className="w-4 h-4 text-amber-600" />
              ) : (
                <Play className="w-4 h-4 text-emerald-600" />
              )}
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => setInvitationToDelete(inv)}
              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
              title="حذف الدعوة نهائياً"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 font-cairo">
            إدارة الدعوات الإلكترونية 💌
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            سرد وتعديل ونشر ومعاينة وحذف جميع دعوات العرسان.
          </p>
        </div>

        <Link
          href="/admin/invitations/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl burgundy-gradient-bg text-white font-bold text-xs shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إنشاء دعوة جديدة 🪄</span>
        </Link>
      </div>

      {msg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between animate-fade-in">
          <span>{msg}</span>
          <button onClick={() => setMsg('')} className="text-emerald-700 hover:text-emerald-950 text-base font-bold cursor-pointer">
            ×
          </button>
        </div>
      )}

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-[#720925] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          الكل ({invitations.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('new')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
            activeFilter === 'new'
              ? 'bg-rose-100 text-[#720925] border border-rose-300 ring-2 ring-rose-200 shadow-xs'
              : 'bg-white text-rose-800 border border-rose-200 hover:bg-rose-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#720925]" />
          <span>طلبات جديدة ✨ ({newCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('published')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'published'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          منشورة لايف 🟢 ({publishedCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('draft')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'draft'
              ? 'bg-stone-800 text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          مسودات 📝 ({draftCount})
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالاسم، الرابط المختصر، أو أسماء العروسين..."
          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-right focus:outline-none focus:ring-2 focus:ring-[#720925]"
        />
      </div>

      {/* Invitations Table powered by @kareemelbalshe/any-table */}
      <AppTable
        data={filteredInvitations}
        columns={invitationColumns}
        rowKey="id"
        loading={loading}
        search={false}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [10, 25, 50],
          showPageSizeSelector: true,
          showTotalCount: true,
        }}
        emptyTitle="لا توجد دعوات مطابقة للبحث أو الفلتر المحدد"
        emptyDescription="جرّب تغيير كلمات البحث أو اختر تبويب آخر أو أنشئ دعوة جديدة"
      />

      {/* Delete Confirmation Modal */}
      {invitationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in text-right font-cairo">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2 text-rose-700">
                <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <h3 className="text-base font-black text-stone-900">تأكيد حذف الدعوة 🗑️</h3>
              </div>
              <button
                type="button"
                onClick={() => setInvitationToDelete(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-stone-700 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف دعوة:
              </p>
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <p className="text-xs font-black text-stone-900">{invitationToDelete.title}</p>
                <p className="text-[11px] text-stone-500">
                  {invitationToDelete.coupleGroomAr} &amp; {invitationToDelete.coupleBrideAr}
                </p>
                <p className="text-[10px] text-blue-600 font-mono dir-ltr text-right">
                  /{invitationToDelete.slug}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-medium leading-relaxed">
                ⚠️ سيتم إزالة الدعوة من القائمة وإلغاء تفعيل رابطها وحذف المقاطع الصوتية الخاصة بها، وتفريغ الرابط المختصر لإعادة استخدامه.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setInvitationToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {deleting ? 'جاري الحذف...' : 'نعم، حذف نهائي 🗑️'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

