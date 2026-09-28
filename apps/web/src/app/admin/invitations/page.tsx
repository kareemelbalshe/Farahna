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
  Share2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { adminFetch } from '@/lib/api';
import { formatArabicDate } from '@/lib/date';
import { INVITATION_TYPE_LABELS } from '@farahna/shared';

export default function AdminInvitationsPage() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');

  const loadInvitations = () => {
    setLoading(true);
    adminFetch(`/invitations?search=${encodeURIComponent(search)}`)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 font-cairo">
            إدارة الدعوات الإلكترونية 💌
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            سرد وتعديل ونشر ومعاينة جميع دعوات العرسان.
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
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg('')} className="text-emerald-700">×</button>
        </div>
      )}

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

      {/* Invitations Table */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-stone-500 font-bold">جاري تحميل الدعوات...</div>
        ) : invitations.length === 0 ? (
          <div className="py-12 text-center text-xs text-stone-400">لا توجد دعوات مطابقة للبحث</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF7F2] border-b border-stone-200 text-stone-600 font-bold">
                <tr>
                  <th className="p-4">عنوان الدعوة / العروسين</th>
                  <th className="p-4">النوع والثيم</th>
                  <th className="p-4">الرابط المباشر</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">المشاهدات</th>
                  <th className="p-4">تاريخ المناسبة</th>
                  <th className="p-4 text-center">الإجراءات السريعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {invitations.map((inv) => {
                  const typeLabel = (INVITATION_TYPE_LABELS as any)[inv.type]?.ar || inv.type;
                  const publicUrl = `/invitation/${inv.type}/${inv.slug}`;
                  const previewUrl = `/preview/${inv.previewToken}`;

                  return (
                    <tr key={inv.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-stone-900">{inv.title}</p>
                        <p className="text-[11px] text-stone-500">
                          {inv.coupleGroomAr} &amp; {inv.coupleBrideAr}
                        </p>
                      </td>

                      <td className="p-4 space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold">
                          {typeLabel}
                        </span>
                        <span className="block text-[10px] text-amber-700 font-medium">
                          {inv.theme?.nameAr || 'ثيم قياسي'}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-[11px] text-blue-600 dir-ltr text-right">
                        <a
                          href={publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline inline-flex items-center gap-1"
                        >
                          <span>/{inv.slug}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            inv.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inv.status === 'paused'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {inv.status === 'published'
                            ? 'منشورة لايف'
                            : inv.status === 'paused'
                            ? 'متوقفة مؤقتاً'
                            : 'مسودة'}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-stone-800">
                        {inv.viewsCount} زيارة
                      </td>

                      <td className="p-4 text-stone-500 text-[11px]">
                        {formatArabicDate(inv.eventDate)}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Live Preview Button */}
                          <a
                            href={inv.status === 'published' ? publicUrl : previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                            title="معاينة الدعوة"
                          >
                            <Eye className="w-4 h-4 text-amber-600" />
                          </a>

                          {/* Builder Button */}
                          <Link
                            href={`/admin/invitations/${inv.id}/builder`}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#720925] transition-colors"
                            title="فتح المحرر المرئي"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Duplicate */}
                          <button
                            type="button"
                            onClick={() => handleDuplicate(inv.id)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
                            title="نسخ الدعوة"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Toggle Publish / Pause */}
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(inv.id, inv.status)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                            title={inv.status === 'published' ? 'إيقاف مؤقت' : 'نشر'}
                          >
                            {inv.status === 'published' ? (
                              <Pause className="w-4 h-4 text-amber-600" />
                            ) : (
                              <Play className="w-4 h-4 text-emerald-600" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
