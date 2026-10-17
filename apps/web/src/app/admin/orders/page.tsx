'use client';

import React, { useEffect, useState } from 'react';
import { adminFetch, getMediaUrl } from '@/lib/api';
import { ORDER_STATUS_LABELS } from '@farahna/shared';
import { formatArabicDate } from '@/lib/date';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
  CreditCard,
  MailOpen,
  X,
  UserCheck,
  Camera,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import Link from 'next/link';
import { AppTable, type ColumnDef, type TableAction } from '@/components/ui/AppTable';

const ORDER_STATUS_LIST = [
  { key: 'new', label: 'طلب جديد', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  { key: 'contacted', label: 'تم التواصل', color: 'bg-purple-100 text-purple-900 border-purple-300' },
  { key: 'details_received', label: 'تم استلام التفاصيل', color: 'bg-teal-100 text-teal-900 border-teal-300' },
  { key: 'designing', label: 'قيد التصميم', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { key: 'preview_sent', label: 'أُرسلت المعاينة', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  { key: 'awaiting_payment', label: 'بانتظار الدفع', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { key: 'payment_proof_received', label: 'تم استلام إيصال الدفع 📸', color: 'bg-amber-100 text-amber-900 border-amber-300 font-bold' },
  { key: 'paid', label: 'تم الدفع بنجاح', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { key: 'published', label: 'تم النشر لايف', color: 'bg-rose-100 text-rose-900 border-rose-300' },
  { key: 'completed', label: 'مكتمل بالكامل', color: 'bg-green-100 text-green-900 border-green-300' },
  { key: 'cancelled', label: 'ملغي', color: 'bg-stone-100 text-stone-600 border-stone-300' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals & Details
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [approvingPaymentId, setApprovingPaymentId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    customerId: '',
    packageId: 'wedding-journey',
    amount: '95',
    currency: 'EGP',
    status: 'new',
    createStarterInvitation: true,
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadOrders = () => {
    setLoading(true);
    let url = '/orders?limit=100';
    if (statusFilter !== 'all') url += `&status=${statusFilter}`;
    if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

    adminFetch(url)
      .then((res) => {
        if (res.success && res.data) {
          setOrders(res.data.orders || []);
        }
      })
      .finally(() => setLoading(false));
  };

  const loadCustomers = () => {
    adminFetch('/customers?limit=100').then((res) => {
      if (res.success && res.data) {
        setCustomers(res.data.customers || []);
      }
    });
  };

  useEffect(() => {
    loadOrders();
    loadCustomers();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  const handleQuickStatusChange = async (orderId: string, newStatus: string) => {
    const res = await adminFetch(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.success) {
      setToastMsg('تم تحديث حالة الطلب بنجاح');
      loadOrders();
      if (selectedOrder?.id === orderId) {
        openOrderDetails({ id: orderId });
      }
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId) {
      alert('يرجى اختيار العميل');
      return;
    }
    setSaving(true);
    try {
      const res = await adminFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          customerId: formData.customerId,
          packageId: formData.packageId,
          amount: Number(formData.amount),
          currency: 'EGP',
          status: formData.status,
          createStarterInvitation: formData.createStarterInvitation,
          notes: formData.notes,
        }),
      });
      if (res.success) {
        setToastMsg('تم إنشاء الطلب بنجاح وربطه بالعميل والدعوة 🎉');
        setShowCreateModal(false);
        setFormData({
          customerId: '',
          packageId: 'wedding-journey',
          amount: '95',
          currency: 'EGP',
          status: 'new',
          createStarterInvitation: true,
          notes: '',
        });
        loadOrders();
      }
    } finally {
      setSaving(false);
    }
  };

  const openOrderDetails = async (order: any) => {
    setSelectedOrder(order);
    setLoadingDetails(true);
    try {
      const res = await adminFetch(`/orders/${order.id}`);
      if (res.success) {
        setOrderDetails(res.data);
      }
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDeleteOrder = async (id: string, orderNumber: string) => {
    if (!confirm(`هل أنت متأكد من حذف الطلب #${orderNumber}؟`)) return;
    const res = await adminFetch(`/orders/${id}`, { method: 'DELETE' });
    if (res.success) {
      setToastMsg('تم حذف الطلب بنجاح');
      loadOrders();
      if (selectedOrder?.id === id) setSelectedOrder(null);
    }
  };

  const handleVerifyPayment = async (paymentId: string) => {
    setApprovingPaymentId(paymentId);
    try {
      const res = await adminFetch(`/payments/${paymentId}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ publishImmediately: true }),
      });
      if (res.success) {
        setToastMsg('تم اعتماد الدفع وتفعيل رابط الدعوة ونشرها بنجاح! 🚀');
        loadOrders();
        if (selectedOrder) {
          openOrderDetails(selectedOrder);
        }
      } else {
        alert(res.message || 'فشل اعتماد الدفع');
      }
    } finally {
      setApprovingPaymentId(null);
    }
  };

  const orderColumns: ColumnDef<any>[] = [
    {
      key: 'orderNumber',
      title: 'رقم الطلب',
      align: 'right',
      sortable: true,
      render: (_, o) => (
        <button
          type="button"
          onClick={() => openOrderDetails(o)}
          className="font-mono font-black text-stone-900 hover:text-[#720925] hover:underline cursor-pointer"
        >
          #{o.orderNumber}
        </button>
      ),
    },
    {
      key: 'customer',
      title: 'العميل',
      align: 'right',
      render: (_, o) => {
        const whatsappChatUrl = o.customer?.phone
          ? getWhatsAppUrl(o.customer.phone, `مرحباً أستاذ ${o.customer.name} بخصوص طلبكم #${o.orderNumber} من فرحنا ❤️`)
          : null;
        return (
          <div className="space-y-0.5">
            <span className="font-bold text-stone-900 block">{o.customer?.name || 'عميل'}</span>
            <div className="flex items-center gap-1.5 text-stone-500 font-mono text-[11px]">
              <span>{o.customer?.phone}</span>
              {whatsappChatUrl && (
                <a
                  href={whatsappChatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 p-0.5"
                  title="محادثة واتساب"
                >
                  <MessageCircle className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'invitation',
      title: 'الدعوة المرتبطة',
      align: 'right',
      render: (_, o) =>
        o.invitation ? (
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">{o.invitation.title}</span>
            <a
              href={`/invitation/${o.invitation.type || 'wedding'}/${o.invitation.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#720925] hover:underline flex items-center gap-0.5 font-bold"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : (
          <span className="text-stone-400">بانتظار الربط بدعوة</span>
        ),
    },
    {
      key: 'amount',
      title: 'المبلغ',
      align: 'right',
      sortable: true,
      render: (val) => (
        <span className="font-black font-mono text-stone-900">
          {Number(val).toLocaleString('ar-EG')} ج.م
        </span>
      ),
    },
    {
      key: 'status',
      title: 'حالة المسار',
      align: 'right',
      render: (_, o) => {
        const statusInfo =
          ORDER_STATUS_LIST.find((s) => s.key === o.status) || ORDER_STATUS_LIST[0];
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            <select
              value={o.status}
              onChange={(e) => handleQuickStatusChange(o.id, e.target.value)}
              className={`text-[11px] font-bold p-1.5 rounded-xl border ${statusInfo.color} focus:outline-hidden cursor-pointer`}
            >
              {ORDER_STATUS_LIST.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            {o.status === 'payment_proof_received' && (
              <button
                type="button"
                onClick={() => openOrderDetails(o)}
                className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-[10px] animate-pulse cursor-pointer shadow-xs whitespace-nowrap"
                title="مراجعة الإيصال واعتماد التفعيل فوراً"
              >
                📸 مراجعة الإيصال
              </button>
            )}
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      title: 'تاريخ الإنشاء',
      align: 'right',
      sortable: true,
      render: (val) => <span className="text-stone-500">{formatArabicDate(val)}</span>,
    },
  ];

  const orderActions: TableAction<any>[] = [
    {
      id: 'view',
      tooltip: 'عرض تفاصيل الطلب والمدفوعات',
      icon: <Eye className="w-3.5 h-3.5" />,
      className: '!p-1.5 !text-stone-500 hover:!text-[#720925] hover:!bg-stone-100 !rounded-lg transition-colors cursor-pointer !bg-transparent !border-0 shadow-none',
      onClick: (o) => openOrderDetails(o),
    },
    {
      id: 'delete',
      tooltip: 'حذف الطلب',
      icon: <Trash2 className="w-3.5 h-3.5" />,
      className: '!p-1.5 !text-stone-500 hover:!text-rose-600 hover:!bg-stone-100 !rounded-lg transition-colors cursor-pointer !bg-transparent !border-0 shadow-none',
      onClick: (o) => handleDeleteOrder(o.id, o.orderNumber),
    },
  ];

  return (
    <div className="space-y-6 font-cairo text-right">
      {/* Toast Notification */}
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
              إدارة الطلبات ومسار العمل 🛍️
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-[#720925] font-bold border border-rose-200">
              {orders.length} طلب
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            الطلب هو الكيان المركزي الذي يربط بيانات العميل بالدعوة المصممة وتأكيد مدفوعات InstaPay
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (customers.length > 0 && !formData.customerId) {
              setFormData({ ...formData, customerId: customers[0].id });
            }
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl burgundy-gradient-bg text-white font-bold text-xs shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء طلب جديد</span>
        </button>
      </div>

      {/* Alert Banner for Orders Awaiting Proof Review */}
      {orders.filter((o) => o.status === 'payment_proof_received').length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
              📸
            </div>
            <div>
              <h4 className="font-black text-amber-950 text-sm">
                يوجد {orders.filter((o) => o.status === 'payment_proof_received').length} طلبات بانتظار مراجعة إيصال التحويل وتفعيل الدعوة!
              </h4>
              <p className="text-amber-800 text-xs mt-0.5">
                قام العرسان بتصميم دعواتهم ورفع لقطة شاشة التحويل. راجع الإيصال واعتمد الطلب لتفعيل رابط الدعوة لايف فوراً.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStatusFilter('payment_proof_received')}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-sm whitespace-nowrap cursor-pointer transition-colors"
          >
            تصفية الطلبات المعلقة ({orders.filter((o) => o.status === 'payment_proof_received').length})
          </button>
        </div>
      )}

      {/* Search & Status Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-2xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
            <input
              type="text"
              placeholder="ابحث برقم الطلب (FARAH-...) أو اسم العميل أو هاتفه..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#720925] focus:outline-hidden"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
          >
            بحث
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-2 rounded-xl border border-stone-200 bg-stone-50 font-bold text-stone-800 focus:outline-hidden focus:border-[#720925] cursor-pointer"
          >
            <option value="all">كل الحالات ({orders.length})</option>
            {ORDER_STATUS_LIST.map((st) => (
              <option key={st.key} value={st.key}>
                {st.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table powered by @kareemelbalshe/any-table */}
      <AppTable
        data={orders}
        columns={orderColumns}
        actions={orderActions}
        rowKey="id"
        loading={loading}
        search={false}
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [10, 25, 50],
          showPageSizeSelector: true,
          showTotalCount: true,
        }}
        emptyTitle="لا توجد طلبات مطابقة للبحث"
        emptyDescription="أنشئ طلباً جديداً أو حوّل أحد العملاء المحتملين إلى طلب"
      />

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-stone-200 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-lg font-black text-stone-900">إنشاء طلب جديد 🛍️</h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">اختر العميل *</label>
                <select
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white"
                >
                  <option value="" disabled>-- اضغط لاختيار العميل من السجل --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">الباقة المختارة</label>
                  <select
                    value={formData.packageId}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        packageId: e.target.value,
                        amount:
                          e.target.value === 'basic'
                            ? '50'
                            : e.target.value === 'luxury-vip'
                            ? '150'
                            : '95',
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white"
                  >
                    <option value="wedding-journey">باقة رحلة الفرح الشاملة (95 ج.م)</option>
                    <option value="basic">باقة المناسبة الواحدة (50 ج.م)</option>
                    <option value="luxury-vip">باقة التصميم الخاص VIP (150 ج.م)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">المبلغ الإجمالي (ج.م) *</label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">حالة الطلب المبدئية</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white"
                >
                  {ORDER_STATUS_LIST.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Starter Invitation Toggle */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="createStarterInvitation"
                  checked={formData.createStarterInvitation}
                  onChange={(e) =>
                    setFormData({ ...formData, createStarterInvitation: e.target.checked })
                  }
                  className="w-4 h-4 text-[#720925] rounded-sm focus:ring-[#720925]"
                />
                <label htmlFor="createStarterInvitation" className="font-bold text-amber-900 cursor-pointer text-xs">
                  إنشاء مسودة دعوة مبدئية تلقائياً وربطها بهذا الطلب
                </label>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">ملاحظات الطلب</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="ملاحظات العريس الخاصة بالتصميم، أو توقيت التسليم..."
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
                  disabled={saving}
                  className="px-5 py-2 rounded-xl burgundy-gradient-bg text-white font-bold shadow-md hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'جاري الإنشاء...' : 'إنشاء الطلب'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal (Bridge View: Customer + Invitation + Payment) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 border border-stone-200 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h2 className="text-xl font-black text-stone-900 font-mono">
                  طلب #{selectedOrder.orderNumber}
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">تفاصيل الربط المركزي بين العميل والدعوة والمدفوعات</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingDetails ? (
              <div className="py-12 text-center text-xs text-stone-500 font-bold">جاري تحميل تفاصيل الطلب...</div>
            ) : orderDetails ? (
              <div className="space-y-6 text-xs">
                {/* 1. Customer Information Card */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200 space-y-2">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    1. بيانات العميل
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-stone-900 text-sm">{orderDetails.customer?.name}</h3>
                      <p className="text-stone-500 font-mono">{orderDetails.customer?.phone}</p>
                    </div>
                    {orderDetails.customer?.phone && (
                      <a
                        href={getWhatsAppUrl(
                          orderDetails.customer.phone,
                          `مرحباً أستاذ ${orderDetails.customer.name} بخصوص طلبكم #${orderDetails.orderNumber}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-[11px] shadow-xs hover:bg-emerald-700"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>محادثة واتساب</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* 2. Linked Invitation Card */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    2. الدعوة المرتبطة بالطلب
                  </span>
                  {orderDetails.invitation ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h3 className="font-bold text-stone-900 text-sm">{orderDetails.invitation.title}</h3>
                          <p className="text-stone-500 font-mono text-[11px]">
                            الرابط: /{orderDetails.invitation.slug} (الحالة: {orderDetails.invitation.status})
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/invitations/${orderDetails.invitation.id}/builder`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-200"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>تعديل في المحرر</span>
                          </Link>
                          <a
                            href={`/invitation/${orderDetails.invitation.type}/${orderDetails.invitation.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[11px]"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>معاينة حية</span>
                          </a>
                        </div>
                      </div>

                      {/* WhatsApp link preview thumbnail info */}
                      {(orderDetails.invitation.customOgImageUrl ||
                        orderDetails.invitation.themeConfig?.customOgImageUrl ||
                        orderDetails.invitation.coverImageUrl) && (
                        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                          <img
                            src={
                              orderDetails.invitation.customOgImageUrl ||
                              orderDetails.invitation.themeConfig?.customOgImageUrl ||
                              orderDetails.invitation.coverImageUrl
                            }
                            alt="غلاف رابط واتساب"
                            className="w-14 h-10 object-cover rounded-lg border border-stone-300 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] text-stone-500 font-bold block">
                              صورة معاينة الرابط على واتساب (WhatsApp Social Thumbnail):
                            </span>
                            <span className="text-[11px] font-mono text-stone-700 truncate block dir-ltr text-left">
                              {orderDetails.invitation.customOgImageUrl ||
                                orderDetails.invitation.themeConfig?.customOgImageUrl ||
                                orderDetails.invitation.coverImageUrl}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-stone-400 text-xs py-1">لا توجد دعوة مرتبطة بهذا الطلب حالياً</p>
                  )}
                </div>

                {/* 3. Payments Card */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      3. مدفوعات InstaPay / فودافون كاش ({orderDetails.payments?.length || 0})
                    </span>
                    <span className="font-black text-stone-900 text-sm">
                      المبلغ المطلوب: {orderDetails.amount} ج.م
                    </span>
                  </div>

                  {orderDetails.payments && orderDetails.payments.length > 0 ? (
                    <div className="divide-y divide-stone-100">
                      {orderDetails.payments.map((p: any) => (
                        <div key={p.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {p.paymentProofUrl ? (
                              <button
                                type="button"
                                onClick={() => setPreviewImage(getMediaUrl(p.paymentProofUrl))}
                                className="relative group shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 border-amber-400 shadow-xs cursor-pointer hover:scale-105 transition-transform"
                                title="اضغط لتكبير صورة إيصال التحويل"
                              >
                                <img src={getMediaUrl(p.paymentProofUrl)} alt="إيصال الدفع" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                                  <Camera className="w-4 h-4 text-white drop-shadow" />
                                </div>
                              </button>
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-400 flex items-center justify-center text-[10px] shrink-0 font-bold">
                                لا يوجد إيصال
                              </div>
                            )}

                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-stone-900 font-mono text-sm">{p.amount} ج.م</span>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                    p.status === 'verified'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : p.status === 'proof_received'
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                      : 'bg-stone-100 text-stone-700'
                                  }`}
                                >
                                  {p.status === 'verified'
                                    ? 'معتمد ومؤكد ✅'
                                    : p.status === 'proof_received'
                                    ? 'إيصال مستلم 📸'
                                    : 'بانتظار الدفع'}
                                </span>
                              </div>
                              <p className="text-stone-500 text-[11px]">
                                طريقة الدفع: {p.method === 'vodafone_cash' ? 'فودافون كاش 📱' : 'InstaPay 📲'}
                                {p.referenceNumber && ` — مرجع: ${p.referenceNumber}`}
                              </p>
                              {p.notes && <p className="text-stone-600 text-[10px] italic">ملاحظات: {p.notes}</p>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {p.status !== 'verified' ? (
                              <button
                                type="button"
                                disabled={approvingPaymentId === p.id}
                                onClick={() => handleVerifyPayment(p.id)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{approvingPaymentId === p.id ? 'جاري الاعتماد...' : 'اعتماد ونشر الدعوة لايف 🚀'}</span>
                              </button>
                            ) : (
                              <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                تم الاعتماد بنجاح
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-stone-400 text-xs py-2 flex items-center justify-between">
                      <span>لم يتم تسجيل أي مدفوعات لهذا الطلب بعد</span>
                      <Link
                        href="/admin/payments"
                        className="text-xs font-bold text-[#720925] hover:underline"
                      >
                        إضافة إيصال دفع
                      </Link>
                    </div>
                  )}
                </div>

                {/* 4. Live Link WhatsApp Notifier (Shown once published or paid) */}
                {orderDetails.invitation && orderDetails.invitation.status === 'published' && orderDetails.customer?.phone && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <h4 className="font-black text-emerald-950 text-xs">رابط الدعوة لايف ومتاح لجميع الضيوف الآن! 🎉</h4>
                      </div>
                      <p className="text-stone-600 font-mono text-[11px] mt-1">
                        /invitation/{orderDetails.invitation.type || 'wedding'}/{orderDetails.invitation.slug}
                      </p>
                    </div>
                    <a
                      href={getWhatsAppUrl(
                        orderDetails.customer.phone,
                        `ألف مبروك يا أستاذ ${orderDetails.customer.name}! 🎉 تم اعتماد التحويل وتفعيل رابط دعوتكم رسمياً ليصبح متاحاً لجميع المعازيم والضيوف:\nhttps://farahna.com/invitation/${orderDetails.invitation.type || 'wedding'}/${orderDetails.invitation.slug}\n\nفرحنا يتمنى لكم زواجاً مباركاً وحياة سعيدة ملؤها المحبة ❤️💍`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>إرسال الرابط للعروسين على واتساب 📲</span>
                    </a>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Fullscreen Proof Preview Lightbox */}
      {previewImage && (
        <div
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-xl max-h-[85vh] bg-stone-900 rounded-3xl p-4 shadow-2xl border border-stone-700 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 px-1 text-white text-xs font-bold border-b border-stone-800 mb-3">
              <span>📸 معاينة إيصال تحويل InstaPay / كاش</span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={getMediaUrl(previewImage)}
              alt="إيصال الدفع"
              className="w-full max-h-[65vh] object-contain rounded-2xl bg-black"
            />
            <div className="pt-3 text-center">
              <a
                href={getMediaUrl(previewImage)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline text-xs font-bold"
              >
                فتح الصورة بالحجم الكامل في نافذة مستقلة ↗️
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
