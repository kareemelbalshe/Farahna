'use client';

import React, { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/api';
import {
  Users,
  Plus,
  Phone,
  MessageCircle,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  ShoppingBag,
  MailOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  PlusCircle,
} from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { formatArabicDate } from '@/lib/date';
import Link from 'next/link';

const SOURCE_LABELS: Record<string, { ar: string; color: string }> = {
  whatsapp: { ar: 'واتساب', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  facebook: { ar: 'فيسبوك', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  instagram: { ar: 'إنستجرام', color: 'bg-pink-50 text-pink-800 border-pink-200' },
  tiktok: { ar: 'تيك توك', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  google: { ar: 'جوجل', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  referral: { ar: 'ترشيح شخصي', color: 'bg-teal-50 text-teal-800 border-teal-200' },
  website: { ar: 'الموقع المباشر', color: 'bg-stone-100 text-stone-800 border-stone-200' },
  other: { ar: 'أخرى', color: 'bg-stone-50 text-stone-600 border-stone-200' },
};

const STATUS_LABELS: Record<string, { ar: string; color: string }> = {
  active: { ar: 'نشط', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  vip: { ar: 'عميل VIP ⭐', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  inactive: { ar: 'غير نشط', color: 'bg-stone-100 text-stone-600 border-stone-300' },
  lead: { ar: 'محتمل', color: 'bg-blue-100 text-blue-800 border-blue-300' },
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals & drawers
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    source: 'whatsapp',
    status: 'active',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadCustomers = () => {
    setLoading(true);
    let url = '/customers?limit=100';
    if (statusFilter !== 'all') url += `&status=${statusFilter}`;
    if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

    adminFetch(url)
      .then((res) => {
        if (res.success && res.data) {
          setCustomers(res.data.customers || []);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCustomers();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCustomers();
  };

  const openCreateModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      phone: '',
      whatsapp: '',
      email: '',
      source: 'whatsapp',
      status: 'active',
      notes: '',
    });
    setShowModal(true);
  };

  const openEditModal = (customer: any) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || '',
      phone: customer.phone || '',
      whatsapp: customer.whatsapp || customer.phone || '',
      email: customer.email || '',
      source: customer.source || 'whatsapp',
      status: customer.status || 'active',
      notes: customer.notes || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCustomer) {
        // PATCH
        const res = await adminFetch(`/customers/${editingCustomer.id}`, {
          method: 'PATCH',
          body: JSON.stringify(formData),
        });
        if (res.success) {
          setToastMsg('تم تحديث بيانات العميل بنجاح');
          setShowModal(false);
          loadCustomers();
        }
      } else {
        // POST
        const res = await adminFetch('/customers', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        if (res.success) {
          setToastMsg('تم إضافة العميل بنجاح');
          setShowModal(false);
          loadCustomers();
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const openCustomerDetails = async (customer: any) => {
    setSelectedCustomer(customer);
    setLoadingDetails(true);
    try {
      const res = await adminFetch(`/customers/${customer.id}`);
      if (res.success) {
        setCustomerDetails(res.data);
      }
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف العميل "${name}"؟`)) return;
    const res = await adminFetch(`/customers/${id}`, { method: 'DELETE' });
    if (res.success) {
      setToastMsg('تم حذف العميل بنجاح');
      loadCustomers();
      if (selectedCustomer?.id === id) setSelectedCustomer(null);
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

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-stone-900">سجل العملاء والعرسان 👥</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-[#720925] font-bold border border-rose-200">
              {customers.length} عميل
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            إدارة بيانات العرسان، أرقام التواصل، مصادر الوصول، وسجل طلباتهم ودعواتهم
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl burgundy-gradient-bg text-white font-bold text-xs shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة عميل جديد</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-2xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
            <input
              type="text"
              placeholder="ابحث بالاسم، أو رقم الموبايل، أو الواتساب..."
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
          {['all', 'active', 'vip', 'inactive'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {st === 'all' ? 'الكل' : STATUS_LABELS[st]?.ar || st}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-stone-500 font-bold space-y-2">
            <div className="w-8 h-8 border-3 border-[#720925] border-t-transparent rounded-full animate-spin mx-auto" />
            <p>جاري تحميل سجل العملاء...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Users className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-sm font-bold text-stone-700">لا يوجد عملاء مطابقين للبحث</p>
            <p className="text-xs text-stone-400">جرّب تغيير كلمات البحث أو أضف عميلاً جديداً</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF7F2] border-b border-stone-200 text-stone-600 font-bold">
                <tr>
                  <th className="p-4">اسم العميل</th>
                  <th className="p-4">الهاتف / واتساب</th>
                  <th className="p-4">المصدر</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-center">الطلبات / الدعوات</th>
                  <th className="p-4">تاريخ التسجيل</th>
                  <th className="p-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {customers.map((c) => {
                  const sourceInfo = SOURCE_LABELS[c.source] || { ar: c.source, color: 'bg-stone-100 text-stone-700' };
                  const statusInfo = STATUS_LABELS[c.status] || { ar: c.status, color: 'bg-stone-100 text-stone-700' };
                  const whatsappUrl = getWhatsAppUrl(c.phone, `مرحباً أستاذ ${c.name} من منصة فرحنا ❤️`);

                  return (
                    <tr key={c.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-4 font-black text-stone-900">
                        <button
                          type="button"
                          onClick={() => openCustomerDetails(c)}
                          className="hover:text-[#720925] hover:underline cursor-pointer text-right"
                        >
                          {c.name}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-stone-800">{c.phone}</span>
                          {whatsappUrl && (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 p-1 hover:bg-emerald-50 rounded-lg"
                              title="محادثة واتساب"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${sourceInfo.color}`}>
                          {sourceInfo.ar}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.color}`}>
                          {statusInfo.ar}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-bold text-stone-700">
                          {c._count?.orders || 0} طلب • {c._count?.invitations || 0} دعوة
                        </span>
                      </td>
                      <td className="p-4 text-stone-500">{formatArabicDate(c.createdAt)}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openCustomerDetails(c)}
                            className="p-1.5 text-stone-500 hover:text-[#720925] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                            title="عرض التفاصيل والطلبات"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(c)}
                            className="p-1.5 text-stone-500 hover:text-blue-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                            title="تعديل بيانات العميل"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(c.id, c.name)}
                            className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                            title="حذف العميل"
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

      {/* Create / Edit Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-stone-200 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-lg font-black text-stone-900">
                {editingCustomer ? 'تعديل بيانات العميل' : 'إضافة عميل جديد 👤'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">اسم العميل (العروس أو العريس) *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: أحمد عبد الرحمن"
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01012345678"
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">رقم الواتساب</label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="01012345678"
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">البريد الإلكتروني (اختياري)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ahmed@example.com"
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">مصدر العميل (Source)</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white"
                  >
                    <option value="whatsapp">واتساب (WhatsApp)</option>
                    <option value="facebook">فيسبوك (Facebook)</option>
                    <option value="instagram">إنستجرام (Instagram)</option>
                    <option value="tiktok">تيك توك (TikTok)</option>
                    <option value="google">بحث جوجل (Google)</option>
                    <option value="referral">ترشيح شخصي (Referral)</option>
                    <option value="website">الموقع المباشر (Website)</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">حالة العميل (Status)</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white"
                  >
                    <option value="active">نشط (Active)</option>
                    <option value="vip">عميل مميز (VIP ⭐)</option>
                    <option value="inactive">غير نشط (Inactive)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">ملاحظات داخلية</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="ملاحظات المبيعات أو متطلبات خاصة للعميل..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl burgundy-gradient-bg text-white font-bold shadow-md hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'جاري الحفظ...' : editingCustomer ? 'حفظ التعديلات' : 'إضافة العميل'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Details Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 border border-stone-200 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h2 className="text-xl font-black text-stone-900">{selectedCustomer.name}</h2>
                <p className="text-xs text-stone-400 mt-0.5">الملف الشامل للعميل وطلباته</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingDetails ? (
              <div className="py-12 text-center text-xs text-stone-500 font-bold">جاري تحميل تفاصيل العميل...</div>
            ) : customerDetails ? (
              <div className="space-y-6 text-xs">
                {/* Profile Card */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-stone-700">
                    <div>
                      <span className="text-[11px] text-stone-400 block">الهاتف:</span>
                      <strong className="font-mono">{customerDetails.phone}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-400 block">الواتساب:</span>
                      <strong className="font-mono">{customerDetails.whatsapp || customerDetails.phone}</strong>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-400 block">المصدر:</span>
                      <span className="font-bold">{SOURCE_LABELS[customerDetails.source]?.ar || customerDetails.source}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-stone-400 block">الحالة:</span>
                      <span className="font-bold">{STATUS_LABELS[customerDetails.status]?.ar || customerDetails.status}</span>
                    </div>
                  </div>
                  {customerDetails.notes && (
                    <p className="pt-2 border-t border-stone-200 text-stone-600">
                      <strong>ملاحظات: </strong>
                      {customerDetails.notes}
                    </p>
                  )}
                </div>

                {/* Orders List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-stone-900 text-sm flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-[#720925]" />
                      <span>طلبات العميل ({customerDetails.orders?.length || 0})</span>
                    </h3>
                    <Link
                      href={`/admin/orders?customerId=${customerDetails.id}`}
                      className="text-xs font-bold text-[#720925] hover:underline"
                    >
                      إدارة طلبات العميل
                    </Link>
                  </div>

                  {customerDetails.orders && customerDetails.orders.length > 0 ? (
                    <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white">
                      {customerDetails.orders.map((ord: any) => (
                        <div key={ord.id} className="p-3 flex items-center justify-between hover:bg-stone-50">
                          <div>
                            <span className="font-bold text-stone-900 font-mono">#{ord.orderNumber}</span>
                            <span className="text-[11px] text-stone-500 mr-2">{ord.amount} ج.م</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold">
                            {ord.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-400 text-xs py-2">لا توجد طلبات مسجلة لهذا العميل حتى الآن</p>
                  )}
                </div>

                {/* Invitations List */}
                <div className="space-y-2">
                  <h3 className="font-black text-stone-900 text-sm flex items-center gap-1.5">
                    <MailOpen className="w-4 h-4 text-[#720925]" />
                    <span>الدعوات المرتبطة ({customerDetails.invitations?.length || 0})</span>
                  </h3>

                  {customerDetails.invitations && customerDetails.invitations.length > 0 ? (
                    <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white">
                      {customerDetails.invitations.map((inv: any) => (
                        <div key={inv.id} className="p-3 flex items-center justify-between hover:bg-stone-50">
                          <div>
                            <span className="font-bold text-stone-900">{inv.title}</span>
                            <span className="text-[10px] text-stone-400 mr-2">/{inv.slug}</span>
                          </div>
                          <a
                            href={`/invitation/${inv.type}/${inv.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#720925] font-bold hover:underline"
                          >
                            <span>معاينة</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-400 text-xs py-2">لا توجد دعوات منشأة لهذا العميل حتى الآن</p>
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
