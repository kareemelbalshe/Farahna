'use client';

import React, { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/api';
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
} from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import Link from 'next/link';

const ORDER_STATUS_LIST = [
  { key: 'new', label: 'طلب جديد', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  { key: 'contacted', label: 'تم التواصل', color: 'bg-purple-100 text-purple-900 border-purple-300' },
  { key: 'details_received', label: 'تم استلام التفاصيل', color: 'bg-teal-100 text-teal-900 border-teal-300' },
  { key: 'designing', label: 'قيد التصميم', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { key: 'preview_sent', label: 'أُرسلت المعاينة', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  { key: 'awaiting_payment', label: 'بانتظار الدفع', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { key: 'payment_proof_received', label: 'تم استلام إيصال الدفع', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
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

  // Form State
  const [formData, setFormData] = useState({
    customerId: '',
    packageId: 'wedding-journey',
    amount: '650',
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
          amount: '650',
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

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-stone-500 font-bold space-y-2">
            <div className="w-8 h-8 border-3 border-[#720925] border-t-transparent rounded-full animate-spin mx-auto" />
            <p>جاري تحميل قائمة الطلبات...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-sm font-bold text-stone-700">لا توجد طلبات مطابقة للبحث</p>
            <p className="text-xs text-stone-400">أنشئ طلباً جديداً أو حوّل أحد العملاء المحتملين إلى طلب</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF7F2] border-b border-stone-200 text-stone-600 font-bold">
                <tr>
                  <th className="p-4">رقم الطلب</th>
                  <th className="p-4">العميل</th>
                  <th className="p-4">الدعوة المرتبطة</th>
                  <th className="p-4">المبلغ</th>
                  <th className="p-4">حالة المسار</th>
                  <th className="p-4">تاريخ الإنشاء</th>
                  <th className="p-4 text-center">إجراءات سريعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((o) => {
                  const statusInfo =
                    ORDER_STATUS_LIST.find((s) => s.key === o.status) || ORDER_STATUS_LIST[0];
                  const whatsappChatUrl = o.customer?.phone
                    ? getWhatsAppUrl(o.customer.phone, `مرحباً أستاذ ${o.customer.name} بخصوص طلبكم #${o.orderNumber} من فرحنا ❤️`)
                    : null;

                  return (
                    <tr key={o.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-4 font-mono font-black text-stone-900">
                        <button
                          type="button"
                          onClick={() => openOrderDetails(o)}
                          className="hover:text-[#720925] hover:underline cursor-pointer"
                        >
                          #{o.orderNumber}
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-stone-900 block">{o.customer?.name || 'عميل'}</span>
                          <div className="flex items-center gap-1.5 text-stone-500 font-mono text-[11px]">
                            <span>{o.customer?.phone}</span>
                            {whatsappChatUrl && (
                              <a
                                href={whatsappChatUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-700"
                                title="محادثة واتساب"
                              >
                                <MessageCircle className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        {o.invitation ? (
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
                        )}
                      </td>

                      <td className="p-4 font-black text-stone-900">
                        {Number(o.amount).toLocaleString('ar-EG')} ج.م
                      </td>

                      <td className="p-4">
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
                      </td>

                      <td className="p-4 text-stone-500">{formatArabicDate(o.createdAt)}</td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openOrderDetails(o)}
                            className="p-1.5 text-stone-500 hover:text-[#720925] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                            title="عرض تفاصيل الطلب والمدفوعات"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(o.id, o.orderNumber)}
                            className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                            title="حذف الطلب"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
                            ? '350'
                            : e.target.value === 'luxury-vip'
                            ? '1100'
                            : '650',
                      });
                    }}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white"
                  >
                    <option value="wedding-journey">باقة رحلة الفرح الشاملة (650 ج.م)</option>
                    <option value="basic">باقة المناسبة الواحدة (350 ج.م)</option>
                    <option value="luxury-vip">باقة التصميم الخاص VIP (1100 ج.م)</option>
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
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-bold text-stone-900 text-sm">{orderDetails.invitation.title}</h3>
                        <p className="text-stone-500 font-mono text-[11px]">
                          الرابط: /{orderDetails.invitation.slug} (الحالة: {orderDetails.invitation.status})
                        </p>
                      </div>
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
                  ) : (
                    <p className="text-stone-400 text-xs py-1">لا توجد دعوة مرتبطة بهذا الطلب حالياً</p>
                  )}
                </div>

                {/* 3. Payments Card */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      3. مدفوعات InstaPay ({orderDetails.payments?.length || 0})
                    </span>
                    <span className="font-black text-stone-900 text-sm">
                      المبلغ المطلوب: {orderDetails.amount} ج.م
                    </span>
                  </div>

                  {orderDetails.payments && orderDetails.payments.length > 0 ? (
                    <div className="divide-y divide-stone-100">
                      {orderDetails.payments.map((p: any) => (
                        <div key={p.id} className="py-2 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-stone-900 font-mono">{p.amount} ج.م</span>
                            <span className="text-stone-500 mr-2 text-[11px]">
                              عبر: {p.method === 'vodafone_cash' ? 'فودافون كاش 📱' : 'InstaPay 📲'}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              p.status === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {p.status === 'verified' ? 'معتمد ✅' : 'بانتظار المراجعة'}
                          </span>
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
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
