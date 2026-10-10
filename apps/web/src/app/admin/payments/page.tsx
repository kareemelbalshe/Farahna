'use client';

import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Search,
  Filter,
  Plus,
  MessageCircle,
  ExternalLink,
  Clock,
  User,
  ShieldCheck,
  FileImage,
  UploadCloud,
  X,
  Edit2,
  Trash2,
  ShoppingBag,
} from 'lucide-react';
import { adminFetch } from '@/lib/api';
import { PAYMENT_STATUS_LABELS } from '@farahna/shared';
import { formatArabicDate } from '@/lib/date';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import Link from 'next/link';
import { AppTable, type ColumnDef } from '@/components/ui/AppTable';

const PAYMENT_STATUS_PILLS: Record<string, { label: string; color: string }> = {
  pending: { label: 'بانتظار التحويل', color: 'bg-stone-100 text-stone-700 border-stone-300' },
  proof_received: { label: 'إيصال مستلم 📸', color: 'bg-amber-100 text-amber-900 border-amber-300 font-bold' },
  verified: { label: 'معتمد ومؤكد ✅', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold' },
  rejected: { label: 'مرفوض ❌', color: 'bg-rose-100 text-rose-900 border-rose-300' },
  refunded: { label: 'مسترد ↩️', color: 'bg-purple-100 text-purple-900 border-purple-300' },
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState<any>(null);
  const [rejectingPayment, setRejectingPayment] = useState<any>(null);
  const [editingPayment, setEditingPayment] = useState<any>(null);

  // Verification Form State
  const [verifyRef, setVerifyRef] = useState('');
  const [verifyNotes, setVerifyNotes] = useState('');
  const [publishImmediately, setPublishImmediately] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Reject Form State
  const [rejectReason, setRejectReason] = useState('عدم مطابقة بيانات التحويل أو عدم وضوح الإيصال');

  // Create Manual Payment Form State
  const [createData, setCreateData] = useState({
    orderId: '',
    customerId: '',
    amount: '',
    method: 'instapay',
    referenceNumber: '',
    paymentProofUrl: '',
    notes: '',
  });

  const [toastMsg, setToastMsg] = useState('');

  const loadPayments = () => {
    setLoading(true);
    let url = '/payments?limit=100';
    if (statusFilter !== 'all') url += `&status=${statusFilter}`;

    adminFetch(url)
      .then((res) => {
        if (res.success && res.data) {
          setPayments(res.data.payments || []);
        }
      })
      .finally(() => setLoading(false));
  };

  const loadOrders = () => {
    adminFetch('/orders?limit=100').then((res) => {
      if (res.success && res.data) {
        setOrders(res.data.orders || []);
      }
    });
  };

  useEffect(() => {
    loadPayments();
    loadOrders();
  }, [statusFilter]);

  // Handle Image Upload to Base64 (Local Secure Storage)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCreateData((prev) => ({ ...prev, paymentProofUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Manual Payment
  const handleCreatePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createData.orderId) {
      alert('يرجى اختيار الطلب');
      return;
    }
    setActionLoading(true);
    try {
      const res = await adminFetch('/payments', {
        method: 'POST',
        body: JSON.stringify({
          orderId: createData.orderId,
          customerId: createData.customerId,
          amount: Number(createData.amount),
          currency: 'EGP',
          method: createData.method || 'instapay',
          status: createData.paymentProofUrl ? 'proof_received' : 'pending',
          referenceNumber: createData.referenceNumber || null,
          paymentProofUrl: createData.paymentProofUrl || null,
          notes: createData.notes || null,
        }),
      });

      if (res.success) {
        setToastMsg('تم تسجيل التحويل بنجاح وإدراجه في قائمة المراجعة 📸');
        setShowCreateModal(false);
        setCreateData({
          orderId: '',
          customerId: '',
          amount: '',
          method: 'instapay',
          referenceNumber: '',
          paymentProofUrl: '',
          notes: '',
        });
        loadPayments();
      } else {
        alert(res.message || 'فشل تسجيل التحويل');
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm Verification / Mark Paid
  const handleConfirmVerify = async () => {
    if (!verifyingPayment) return;
    setActionLoading(true);
    try {
      const res = await adminFetch(`/payments/${verifyingPayment.id}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({
          referenceNumber: verifyRef || verifyingPayment.referenceNumber || null,
          notes: verifyNotes || verifyingPayment.notes || null,
          publishImmediately,
        }),
      });

      if (res.success) {
        setToastMsg(
          'تم اعتماد التحويل بنجاح! تم تحديث حالة الطلب لـ Paid' +
            (publishImmediately ? ' ونشر الدعوة لايف ✅' : ' ✅')
        );
        setVerifyingPayment(null);
        setVerifyRef('');
        setVerifyNotes('');
        loadPayments();
      } else {
        alert(res.message || 'فشل الاعتماد');
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm Rejection
  const handleConfirmReject = async () => {
    if (!rejectingPayment) return;
    setActionLoading(true);
    try {
      const res = await adminFetch(`/payments/${rejectingPayment.id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ notes: rejectReason }),
      });

      if (res.success) {
        setToastMsg('تم رفض التحويل وتحديث الحالة إلى مرفوض');
        setRejectingPayment(null);
        loadPayments();
      } else {
        alert(res.message || 'فشل رفض العملية');
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Update Notes / Reference
  const handleUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;
    setActionLoading(true);
    try {
      const res = await adminFetch(`/payments/${editingPayment.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          referenceNumber: editingPayment.referenceNumber,
          notes: editingPayment.notes,
          amount: Number(editingPayment.amount),
        }),
      });
      if (res.success) {
        setToastMsg('تم تحديث بيانات التحويل');
        setEditingPayment(null);
        loadPayments();
      }
    } finally {
      setActionLoading(false);
    }
  };

  const totalVerifiedRevenue = payments
    .filter((p) => p.status === 'verified')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const paymentColumns: ColumnDef<any>[] = [
    {
      key: 'order',
      title: 'الطلب / العميل',
      align: 'right',
      render: (_, p) => {
        const whatsappUrl = p.customer?.phone
          ? getWhatsAppUrl(
              p.customer.phone,
              `أهلاً أستاذ ${p.customer.name} بخصوص تحويل إنستاباي للطلب #${p.order?.orderNumber || ''}`
            )
          : null;
        return (
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-stone-900 font-mono">
                #{p.order?.orderNumber || 'طلب'}
              </span>
              <span className="text-stone-400 text-[10px]">({p.order?.status})</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <span className="font-medium">{p.customer?.name}</span>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700"
                  title="محادثة واتساب"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'amount',
      title: 'المبلغ',
      align: 'right',
      sortable: true,
      render: (val) => (
        <span className="font-mono font-black text-stone-900 text-sm">
          {Number(val).toLocaleString('ar-EG')} ج.م
        </span>
      ),
    },
    {
      key: 'method',
      title: 'طريقة التحويل',
      align: 'right',
      render: (method) =>
        method === 'vodafone_cash' ? (
          <span className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 font-bold text-[11px] inline-flex items-center gap-1">
            <span>فودافون كاش</span>
            <span>📱</span>
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold text-[11px] inline-flex items-center gap-1">
            <span>InstaPay</span>
            <span>📲</span>
          </span>
        ),
    },
    {
      key: 'status',
      title: 'الحالة',
      align: 'right',
      render: (status) => {
        const statusInfo =
          PAYMENT_STATUS_PILLS[status] || {
            label: status,
            color: 'bg-stone-100 text-stone-700',
          };
        return (
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        );
      },
    },
    {
      key: 'referenceNumber',
      title: 'رقم المرجع (Ref #)',
      align: 'right',
      render: (ref) =>
        ref ? (
          <span className="font-bold font-mono text-stone-700 text-xs">{ref}</span>
        ) : (
          <span className="text-stone-400 italic text-xs">بدون مرجع</span>
        ),
    },
    {
      key: 'paymentProofUrl',
      title: 'إيصال التحويل (Proof)',
      align: 'center',
      render: (proofUrl) =>
        proofUrl ? (
          <button
            type="button"
            onClick={() => setSelectedProofUrl(proofUrl)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold transition-colors cursor-pointer"
            title="عرض صورة الإيصال المحمية"
          >
            <FileImage className="w-3.5 h-3.5 text-amber-700" />
            <span>عرض الإيصال 📸</span>
          </button>
        ) : (
          <span className="text-[11px] text-stone-400">لا يوجد إيصال</span>
        ),
    },
    {
      key: 'createdAt',
      title: 'التاريخ والاعتماد',
      align: 'right',
      sortable: true,
      render: (_, p) => (
        <div className="text-[11px] text-stone-500">
          <div>التسجيل: {formatArabicDate(p.createdAt)}</div>
          {p.verifiedAt && (
            <div className="text-emerald-700 font-semibold mt-0.5">
              اعتمد: {formatArabicDate(p.verifiedAt)}
              {p.verifiedBy?.name && ` (${p.verifiedBy.name})`}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'إجراءات المراجعة',
      align: 'center',
      render: (_, p) => (
        <div className="flex items-center justify-center gap-1.5">
          {p.status !== 'verified' && (
            <button
              type="button"
              onClick={() => {
                setVerifyingPayment(p);
                setVerifyRef(p.referenceNumber || '');
                setVerifyNotes(p.notes || '');
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1"
              title="اعتماد وتأكيد الدفع"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>اعتماد</span>
            </button>
          )}

          {p.status !== 'rejected' && p.status !== 'verified' && (
            <button
              type="button"
              onClick={() => {
                setRejectingPayment(p);
                setRejectReason('عدم مطابقة بيانات التحويل أو عدم وضوح الإيصال');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors cursor-pointer"
              title="رفض التحويل"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setEditingPayment(p)}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="تعديل المرجع والملاحظات"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-cairo text-right">
      {/* Toast */}
      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs">
          <span>{toastMsg}</span>
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
              مدفوعات وتحويلات المنصة اليدوية (InstaPay / فودافون كاش) 💳
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
              تحقق ومراجعة إدارية يدوية
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            مراجعة صور إيصالات التحويل، تسجيل أرقام المرجع، واعتماد تفعيل ونشر الدعوات فورياً
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (orders.length > 0) {
              setCreateData({
                orderId: orders[0].id,
                customerId: orders[0].customerId,
                amount: orders[0].amount || '95',
                method: 'instapay',
                referenceNumber: '',
                paymentProofUrl: '',
                notes: '',
              });
            }
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl burgundy-gradient-bg text-white font-bold text-xs shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل تحويل يدوي جديد</span>
        </button>
      </div>

      {/* Revenue Highlight Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-stone-400 block font-medium">
              إجمالي التحويلات المعتمدة (Verified Revenue):
            </span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {totalVerifiedRevenue.toLocaleString('ar-EG')} جنيه مصري
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-left">
            <span className="text-stone-400 block text-[10px]">إيصالات بانتظار المراجعة:</span>
            <span className="font-bold text-amber-400 text-sm">
              {payments.filter((p) => p.status === 'proof_received').length} إيصال
            </span>
          </div>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors"
          >
            <span>بيانات حساب إنستاباي</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-3xl border border-stone-200 shadow-2xs flex items-center gap-2 overflow-x-auto">
        {['all', 'proof_received', 'pending', 'verified', 'rejected'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === st
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {st === 'all' ? `كل العمليات (${payments.length})` : PAYMENT_STATUS_PILLS[st]?.label || st}
          </button>
        ))}
      </div>

      {/* Payments Table powered by @kareemelbalshe/any-table */}
      <AppTable
        data={payments}
        columns={paymentColumns}
        rowKey="id"
        loading={loading}
        search={false}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [10, 25, 50],
          showPageSizeSelector: true,
          showTotalCount: true,
        }}
        emptyTitle="لا توجد عمليات تحويل في هذا القسم حالياً"
        emptyDescription="أي تحويل يسجله العميل أو المشرف سيظهر هنا فورياً"
      />

      {/* High-Resolution Protected Proof Modal */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 border border-stone-200 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-black text-stone-900">
                  إيصال تحويل InstaPay (معاينة آمنة للإدارة)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProofUrl(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 max-h-[70vh] flex items-center justify-center p-2">
              <img
                src={selectedProofUrl}
                alt="Payment Proof"
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedProofUrl(null)}
                className="px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verify & Mark Paid Modal */}
      {verifyingPayment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-stone-200 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-stone-900">
                    اعتماد تحويل InstaPay وتأكيد الدفع ✅
                  </h2>
                  <p className="text-xs text-stone-400">
                    طلب #{verifyingPayment.order?.orderNumber} • {verifyingPayment.amount} ج.م
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVerifyingPayment(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">
                  رقم مرجع التحويل (Reference Number / Transaction ID):
                </label>
                <input
                  type="text"
                  placeholder="مثال: IP-20260927-8492"
                  value={verifyRef}
                  onChange={(e) => setVerifyRef(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">ملاحظات الاعتماد (اختياري):</label>
                <textarea
                  rows={2}
                  placeholder="ملاحظات المراجعة..."
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden"
                />
              </div>

              {/* Publish Toggle */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="publishImmediately"
                  checked={publishImmediately}
                  onChange={(e) => setPublishImmediately(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                />
                <label htmlFor="publishImmediately" className="font-bold text-emerald-950 cursor-pointer text-xs">
                  نشر الدعوة المرتبطة بالطلب فورياً لايف بعد اعتماد الدفع
                </label>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVerifyingPayment(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleConfirmVerify}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading ? 'جاري الاعتماد...' : 'تأكيد الاعتماد ونشر الطلب 🚀'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Payment Modal */}
      {rejectingPayment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-stone-200 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-stone-900">رفض عملية التحويل</h2>
                  <p className="text-xs text-stone-400">طلب #{rejectingPayment.order?.orderNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRejectingPayment(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">سبب الرفض:</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingPayment(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleConfirmReject}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading ? 'جاري الرفض...' : 'تأكيد الرفض'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record Manual Payment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-stone-200 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#720925]" />
                <h2 className="text-base font-black text-stone-900">تسجيل تحويل يدوي (InstaPay / فودافون كاش) 📲</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePaymentSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">اختر الطلب المرتبط بالتحويل *</label>
                <select
                  required
                  value={createData.orderId}
                  onChange={(e) => {
                    const ord = orders.find((o) => o.id === e.target.value);
                    setCreateData({
                      ...createData,
                      orderId: e.target.value,
                      customerId: ord?.customerId || '',
                      amount: ord?.amount || '95',
                    });
                  }}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white"
                >
                  <option value="" disabled>-- اضغط لاختيار الطلب --</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      #{o.orderNumber} - {o.customer?.name} ({o.amount} ج.م) [{o.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">طريقة التحويل *</label>
                  <select
                    required
                    value={createData.method}
                    onChange={(e) => setCreateData({ ...createData, method: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white text-xs"
                  >
                    <option value="instapay">📲 إنستاباي (InstaPay)</option>
                    <option value="vodafone_cash">📱 فودافون كاش (Vodafone Cash)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">المبلغ المحول (ج.م) *</label>
                  <input
                    type="number"
                    required
                    value={createData.amount}
                    onChange={(e) => setCreateData({ ...createData, amount: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">مرجع التحويل (إن وجد)</label>
                  <input
                    type="text"
                    placeholder="رقم العملية / المرجع"
                    value={createData.referenceNumber}
                    onChange={(e) => setCreateData({ ...createData, referenceNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Upload Proof / Screenshot */}
              <div className="space-y-2">
                <label className="font-bold text-stone-700 block">
                  صورة إيصال التحويل (Screenshot) من العميل:
                </label>
                <div className="border-2 border-dashed border-stone-300 rounded-2xl p-4 text-center bg-stone-50 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="proofUpload"
                  />
                  <label
                    htmlFor="proofUpload"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-800 font-bold text-xs shadow-2xs hover:bg-stone-50 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-stone-500" />
                    <span>اختيار صورة الإيصال من جهازك</span>
                  </label>
                  {createData.paymentProofUrl && (
                    <div className="pt-2 text-emerald-700 font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تم تحميل صورة الإيصال بنجاح</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">ملاحظات التحويل</label>
                <textarea
                  rows={2}
                  placeholder="اسم المحوّل من إنستاباي، أو وقت التحويل..."
                  value={createData.notes}
                  onChange={(e) => setCreateData({ ...createData, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl burgundy-gradient-bg text-white font-bold shadow-md hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading ? 'جاري الحفظ...' : 'تسجيل التحويل'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Payment Reference / Notes Modal */}
      {editingPayment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-stone-200 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-base font-black text-stone-900">تعديل بيانات الحوالة</h2>
              <button
                type="button"
                onClick={() => setEditingPayment(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePayment} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">رقم المرجع (Ref #):</label>
                <input
                  type="text"
                  value={editingPayment.referenceNumber || ''}
                  onChange={(e) =>
                    setEditingPayment({ ...editingPayment, referenceNumber: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">المبلغ (ج.م):</label>
                <input
                  type="number"
                  value={editingPayment.amount || ''}
                  onChange={(e) =>
                    setEditingPayment({ ...editingPayment, amount: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">ملاحظات:</label>
                <textarea
                  rows={2}
                  value={editingPayment.notes || ''}
                  onChange={(e) =>
                    setEditingPayment({ ...editingPayment, notes: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPayment(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl burgundy-gradient-bg text-white font-bold shadow-md cursor-pointer"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
