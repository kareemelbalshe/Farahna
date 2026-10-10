'use client';

import React, { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/api';
import {
  Sparkles,
  Phone,
  MessageCircle,
  Calendar,
  UserCheck,
  Search,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { formatArabicDate } from '@/lib/date';
import Link from 'next/link';

const LEAD_PIPELINE_STAGES = [
  { key: 'new', label: 'طلب جديد', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  { key: 'contacted', label: 'تم التواصل', color: 'bg-purple-100 text-purple-900 border-purple-300' },
  { key: 'waiting_details', label: 'بانتظار التفاصيل', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { key: 'details_received', label: 'تم استلام التفاصيل', color: 'bg-teal-100 text-teal-900 border-teal-300' },
  { key: 'designing', label: 'قيد التصميم', color: 'bg-rose-100 text-rose-900 border-rose-300' },
  { key: 'preview_sent', label: 'أُرسلت المعاينة', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  { key: 'awaiting_payment', label: 'بانتظار الدفع', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { key: 'paid', label: 'تم الدفع', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { key: 'completed', label: 'مكتمل', color: 'bg-green-100 text-green-900 border-green-300' },
  { key: 'cancelled', label: 'ملغي', color: 'bg-stone-100 text-stone-600 border-stone-300' },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState('all');
  const [search, setSearch] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [convertingLead, setConvertingLead] = useState<any>(null);
  const [convertPackage, setConvertPackage] = useState('wedding-journey');
  const [convertAmount, setConvertAmount] = useState('95');
  const [convertSaving, setConvertSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    source: 'whatsapp',
    campaign: '',
    eventType: 'wedding',
    selectedTheme: 'royal-burgundy',
    status: 'new',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadLeads = () => {
    setLoading(true);
    let url = '/leads?limit=100';
    if (activeStage !== 'all') url += `&status=${activeStage}`;
    if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

    adminFetch(url)
      .then((res) => {
        if (res.success && res.data) {
          setLeads(res.data.leads || []);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLeads();
  }, [activeStage]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminFetch('/leads', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      if (res.success) {
        setToastMsg('تم إضافة العميل المحتمل بنجاح إلى مسار العمل');
        setShowCreateModal(false);
        setFormData({
          name: '',
          phone: '',
          whatsapp: '',
          source: 'whatsapp',
          campaign: '',
          eventType: 'wedding',
          selectedTheme: 'royal-burgundy',
          status: 'new',
          notes: '',
        });
        loadLeads();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatusChange = async (leadId: string, newStatus: string) => {
    const res = await adminFetch(`/leads/${leadId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.success) {
      setToastMsg('تم تحديث مرحلة العميل المحتمل في الـ Pipeline');
      loadLeads();
    }
  };

  const handleConvertLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingLead) return;
    setConvertSaving(true);
    try {
      const res = await adminFetch(`/leads/${convertingLead.id}/convert`, {
        method: 'POST',
        body: JSON.stringify({
          packageId: convertPackage,
          amount: Number(convertAmount),
          notes: convertingLead.notes,
        }),
      });
      if (res.success) {
        setToastMsg(
          `🎉 تم تحويل ${convertingLead.name} إلى عميل فعلي وإنشاء الطلب والدعوة بنجاح!`
        );
        setConvertingLead(null);
        loadLeads();
      }
    } finally {
      setConvertSaving(false);
    }
  };

  const handleDeleteLead = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف العميل المحتمل "${name}"؟`)) return;
    const res = await adminFetch(`/leads/${id}`, { method: 'DELETE' });
    if (res.success) {
      setToastMsg('تم حذف العميل المحتمل');
      loadLeads();
    }
  };

  // Stage counter calculation
  const getStageCount = (stageKey: string) => {
    return leads.filter((l) => l.status === stageKey).length;
  };

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
              مسار العملاء المحتملين (Sales Pipeline & Leads) 🚀
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
              {leads.length} طلب
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            متابعة مراحل تحويل الزوار من طلب استفسار أولي حتى استلام التفاصيل والتحويل لطلبات رسمية
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl burgundy-gradient-bg text-white font-bold text-xs shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة عميل محتمل جديد</span>
        </button>
      </div>

      {/* Pipeline Stages Tabs Bar (Kanban Horizontal Bar) */}
      <div className="bg-white p-3 rounded-3xl border border-stone-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max pb-1">
          <button
            type="button"
            onClick={() => setActiveStage('all')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              activeStage === 'all'
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            كل المراحل ({leads.length})
          </button>
          {LEAD_PIPELINE_STAGES.map((st) => {
            const count = getStageCount(st.key);
            const isCurrent = activeStage === st.key;
            return (
              <button
                key={st.key}
                type="button"
                onClick={() => setActiveStage(st.key)}
                className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-stone-900 text-white shadow-2xs scale-102'
                    : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span>{st.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isCurrent ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Leads List / Cards Grid */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-stone-500 font-bold space-y-2">
            <div className="w-8 h-8 border-3 border-[#720925] border-t-transparent rounded-full animate-spin mx-auto" />
            <p>جاري تحميل قائمة مسار المبيعات...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
            <p className="text-sm font-bold text-stone-700">لا توجد طلبات في هذه المرحلة حالياً</p>
            <p className="text-xs text-stone-400">أي استفسار جديد يرسله العريس أو الزائر سيظهر هنا فورياً</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {leads.map((lead) => {
              const currentStage =
                LEAD_PIPELINE_STAGES.find((s) => s.key === lead.status) || LEAD_PIPELINE_STAGES[0];
              const whatsappUrl = getWhatsAppUrl(
                lead.phone,
                `أهلاً أستاذ ${lead.name}، بخصوص استفسارك عن دعوة ${lead.eventType === 'wedding' ? 'الفرح' : 'المناسبة'} من فرحنا ❤️`
              );

              return (
                <div
                  key={lead.id}
                  className="p-5 hover:bg-stone-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Lead Info */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-stone-900 text-sm">{lead.name}</span>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${currentStage.color}`}
                      >
                        {currentStage.label}
                      </span>
                      {lead.customerId && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>تم التحويل لعميل</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
                      <div className="flex items-center gap-1 font-mono">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>{lead.phone}</span>
                        {whatsappUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 p-0.5"
                            title="محادثة واتساب"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      <span>المناسبة: <strong>{lead.eventType || 'فرح'}</strong></span>
                      <span>المصدر: <strong>{lead.source}</strong></span>
                      {lead.campaign && <span>الحملة: <strong>{lead.campaign}</strong></span>}
                      <span className="text-stone-400">{formatArabicDate(lead.createdAt)}</span>
                    </div>

                    {lead.notes && (
                      <p className="text-xs text-stone-600 bg-[#FAF7F2] p-2.5 rounded-xl border border-stone-200/60 max-w-xl">
                        <strong>ملاحظات:</strong> {lead.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions & Pipeline Stepper */}
                  <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
                    {/* Stage Selector Dropdown */}
                    <select
                      value={lead.status}
                      onChange={(e) => handleQuickStatusChange(lead.id, e.target.value)}
                      className="text-xs p-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-800 focus:outline-hidden focus:border-[#720925] cursor-pointer"
                    >
                      {LEAD_PIPELINE_STAGES.map((s) => (
                        <option key={s.key} value={s.key}>
                          نقل إلى: {s.label}
                        </option>
                      ))}
                    </select>

                    {/* Convert Button */}
                    {!lead.customerId && (
                      <button
                        type="button"
                        onClick={() => {
                          setConvertingLead(lead);
                          setConvertAmount('95');
                          setConvertPackage('wedding-journey');
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        title="تحويل العميل المحتمل إلى عميل رسمي وإنشاء طلب له"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>تحويل لعميل وإنشاء طلب</span>
                      </button>
                    )}

                    {lead.customerId && (
                      <Link
                        href={`/admin/orders?customerId=${lead.customerId}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#720925]" />
                        <span>عرض طلباته</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteLead(lead.id, lead.name)}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Convert Lead to Customer & Order Modal */}
      {convertingLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-stone-200 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-stone-900">
                    تحويل إلى عميل رسمي وإنشاء طلب 🎉
                  </h2>
                  <p className="text-xs text-stone-400">العميل المحتمل: {convertingLead.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setConvertingLead(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConvertLead} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                <p className="font-bold">سيقوم النظام آلياً بالآتي:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                  <li>إنشاء ملف عميل جديد باسم <strong>"{convertingLead.name}"</strong> وهاتفه.</li>
                  <li>إنشاء مسودة دعوة مبدئية وربطها بالعميل.</li>
                  <li>إنشاء طلب جديد برقم تسلسلي وربطه بالدعوة.</li>
                  <li>تحديث حالة الـ Lead إلى "تم استلام التفاصيل".</li>
                </ul>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">الباقة المختارة للطلب</label>
                <select
                  value={convertPackage}
                  onChange={(e) => {
                    setConvertPackage(e.target.value);
                    if (e.target.value === 'basic') setConvertAmount('50');
                    if (e.target.value === 'wedding-journey') setConvertAmount('95');
                    if (e.target.value === 'luxury-vip') setConvertAmount('150');
                  }}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white"
                >
                  <option value="wedding-journey">باقة رحلة الفرح الشاملة (95 ج.م) — الأكثر طلباً 👑</option>
                  <option value="basic">باقة المناسبة الواحدة (50 ج.م)</option>
                  <option value="luxury-vip">باقة التصميم الخاص VIP (150 ج.م)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">المبلغ الإجمالي (جنيه مصري)</label>
                <input
                  type="number"
                  required
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden font-mono"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConvertingLead(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={convertSaving}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {convertSaving ? 'جاري التحويل...' : 'تأكيد التحويل وإنشاء الطلب 🚀'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Lead Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-stone-200 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-lg font-black text-stone-900">إضافة عميل محتمل جديد 🪄</h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">اسم صاحب الطلب *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: يوسف ومريم"
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
                  <label className="font-bold text-stone-700 block">نوع المناسبة</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white"
                  >
                    <option value="wedding">فرح / زفاف (Wedding)</option>
                    <option value="engagement">خطوبة (Engagement)</option>
                    <option value="henna">حنة (Henna)</option>
                    <option value="katb_ketab">كتب كتاب (Katb Ketab)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">مصدر الاستفسار</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white"
                  >
                    <option value="whatsapp">واتساب (WhatsApp)</option>
                    <option value="facebook">فيسبوك (Facebook)</option>
                    <option value="instagram">إنستجرام (Instagram)</option>
                    <option value="tiktok">تيك توك (TikTok)</option>
                    <option value="google">جوجل (Google)</option>
                    <option value="website">الموقع المباشر</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">مرحلة الـ Pipeline</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white"
                  >
                    {LEAD_PIPELINE_STAGES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">ملاحظات الاستفسار</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="موعد الفرح المتوقع، القاعة، أي متطلبات خاصة..."
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
                  {saving ? 'جاري الإضافة...' : 'إضافة إلى المسار'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
