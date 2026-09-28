'use client';

import React, { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/api';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Compass,
  AlertCircle,
  ExternalLink,
  Navigation,
  CheckCircle2,
  X,
  Edit3,
  Search,
  Check,
} from 'lucide-react';
import {
  EVENT_TYPE_LABELS,
  extractCoordinatesFromUrl,
  isValidCoordinates,
} from '@farahna/shared';
import { formatArabicDate } from '@/lib/date';
import { FarahnaMap } from '@/components/map/FarahnaMap';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [saving, setSaving] = useState(false);

  // Form states for location editor
  const [pastedUrl, setPastedUrl] = useState('');
  const [formVenueName, setFormVenueName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formLatitude, setFormLatitude] = useState<string>('');
  const [formLongitude, setFormLongitude] = useState<string>('');
  const [formGoogleMapsUrl, setFormGoogleMapsUrl] = useState('');
  const [extractFeedback, setExtractFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const fetchEvents = () => {
    adminFetch('/invitations')
      .then((res) => {
        if (res.success && res.data) {
          const allEvents: any[] = [];
          res.data.forEach((inv: any) => {
            if (inv.events) {
              inv.events.forEach((ev: any) => {
                allEvents.push({ ...ev, invitationTitle: inv.title, slug: inv.slug });
              });
            }
          });
          setEvents(allEvents);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openLocationEditor = (ev: any) => {
    setSelectedEvent(ev);
    setFormVenueName(ev.venueNameAr || '');
    setFormAddress(ev.addressAr || '');
    setFormLatitude(ev.latitude !== null && ev.latitude !== undefined ? String(ev.latitude) : '');
    setFormLongitude(ev.longitude !== null && ev.longitude !== undefined ? String(ev.longitude) : '');
    setFormGoogleMapsUrl(ev.googleMapsUrl || '');
    setPastedUrl(ev.googleMapsUrl || '');
    setExtractFeedback(null);
  };

  const handleExtractCoordinates = () => {
    if (!pastedUrl) {
      setExtractFeedback({ success: false, message: 'يرجى إدخال رابط خرائط جوجل أو نص الإحداثيات أولاً' });
      return;
    }

    const coords = extractCoordinatesFromUrl(pastedUrl);
    if (coords) {
      setFormLatitude(String(coords.latitude));
      setFormLongitude(String(coords.longitude));
      if (!formGoogleMapsUrl && pastedUrl.startsWith('http')) {
        setFormGoogleMapsUrl(pastedUrl);
      }
      setExtractFeedback({
        success: true,
        message: `تم استخراج الإحداثيات بنجاح! خط العرض: ${coords.latitude} | خط الطول: ${coords.longitude}`,
      });
    } else {
      setExtractFeedback({
        success: false,
        message:
          'لم يتم العثور على إحداثيات مباشرة في هذا الرابط. يمكنك كتابة خط العرض وخط الطول يدوياً، أو استخدام صيغة "@lat,lng" أو "lat, lng".',
      });
    }
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setSaving(true);
    try {
      const lat = formLatitude ? parseFloat(formLatitude) : null;
      const lng = formLongitude ? parseFloat(formLongitude) : null;

      const res = await adminFetch(`/events/${selectedEvent.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          venueNameAr: formVenueName,
          addressAr: formAddress,
          latitude: lat,
          longitude: lng,
          googleMapsUrl: formGoogleMapsUrl || null,
        }),
      });

      if (res.success) {
        setToastMsg(`تم تحديث موقع وخريطة مناسبة "${selectedEvent.titleAr}" بنجاح!`);
        setSelectedEvent(null);
        fetchEvents();
      } else {
        alert(res.message || 'فشل تحديث المناسبة');
      }
    } catch (err: any) {
      alert(err.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setSaving(false);
    }
  };

  const filteredEvents =
    filterType === 'all'
      ? events
      : events.filter((ev) => ev.type === filterType);

  const previewLat = formLatitude ? parseFloat(formLatitude) : null;
  const previewLng = formLongitude ? parseFloat(formLongitude) : null;
  const isPreviewValid = isValidCoordinates(previewLat, previewLng);

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
            <h1 className="text-2xl font-black text-stone-900">إدارة المناسبات والخرائط (Events & Maps) 🗺️</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-[#720925] font-bold border border-rose-200">
              {events.length} مناسبة مسجلة
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            جدول ومواعيد جميع مناسبات الفرح وإدارة مواقعها وإحداثيات الخرائط التفاعلية (OpenStreetMap + Google Maps)
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#720925] text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            الكل ({events.length})
          </button>
          {['engagement', 'henna', 'katb_ketab', 'wedding', 'reception'].map((t) => {
            const label = (EVENT_TYPE_LABELS as any)[t]?.ar || t;
            const count = events.filter((e) => e.type === t).length;
            return (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  filterType === t
                    ? 'bg-[#720925] text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Table / Card Shell */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <span className="text-xs font-bold text-stone-700">قائمة المناسبات المسجلة وحالة الخرائط</span>
          <span className="text-[11px] text-stone-400">Leaflet + OpenStreetMap Engine</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-stone-400 text-xs font-bold">جاري تحميل البيانات...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Calendar className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="text-sm font-bold text-stone-700">لا توجد مناسبات مسجلة بهذا التصنيف</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredEvents.map((ev) => {
              const labelInfo = (EVENT_TYPE_LABELS as any)[ev.type] || { icon: '✨', ar: ev.type };
              const hasGps = isValidCoordinates(ev.latitude, ev.longitude);

              return (
                <div
                  key={ev.id}
                  className="p-5 hover:bg-stone-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg">{labelInfo.icon}</span>
                      <span className="font-black text-stone-900 text-sm">{ev.titleAr}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-bold border border-stone-200">
                        {labelInfo.ar}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-[#720925] font-bold border border-rose-200">
                        دعوة: {ev.invitationTitle}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-stone-500">
                      <span className="flex items-center gap-1 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {formatArabicDate(ev.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        من {ev.startTime} {ev.endTime ? `إلى ${ev.endTime}` : ''}
                      </span>
                      {ev.venueNameAr && (
                        <span className="flex items-center gap-1 text-stone-700 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-[#720925]" />
                          {ev.venueNameAr}
                        </span>
                      )}
                    </div>

                    {/* GPS Status Badge */}
                    <div className="pt-1 flex items-center gap-2">
                      {hasGps ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold">
                          <Compass className="w-3.5 h-3.5 text-emerald-600" />
                          <span>إحداثيات GPS مفعلة ({ev.latitude}, {ev.longitude})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-[11px] font-bold">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>بدون إحداثيات (يعرض الكارت البديل الأنيق)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                    <button
                      onClick={() => openLocationEditor(ev)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 font-bold hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#720925]" />
                      <span>تعديل الموقع والخريطة</span>
                    </button>

                    <a
                      href={`/invitation/wedding/${ev.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors cursor-pointer"
                      title="معاينة في الدعوة الحية"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Location & Map Editor Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 text-right font-cairo my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h2 className="text-lg font-black text-stone-900">
                  إعدادات الموقع والخريطة - {selectedEvent.titleAr}
                </h2>
                <p className="text-xs text-stone-500">
                  حدد موقع المناسبة واستخرج الإحداثيات تلقائياً من رابط Google Maps
                </p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Google Maps URL Auto-Extractor Tool */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-amber-700" />
                  <span>المستخرج التلقائي للإحداثيات من Google Maps ⚡</span>
                </label>
                <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                  تلقائي
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="الصق رابط Google Maps هنا (مثلاً: https://maps.google.com/?q=30.0571,31.2248 أو @30.0571,31.2248)"
                  value={pastedUrl}
                  onChange={(e) => setPastedUrl(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden text-xs bg-white text-left dir-ltr"
                />
                <button
                  type="button"
                  onClick={handleExtractCoordinates}
                  className="px-4 py-2.5 rounded-xl burgundy-gradient-bg text-white font-bold text-xs shadow-xs hover:opacity-95 cursor-pointer shrink-0"
                >
                  استخراج الإحداثيات 🚀
                </button>
              </div>

              {extractFeedback && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    extractFeedback.success
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {extractFeedback.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{extractFeedback.message}</span>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSaveLocation} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">اسم المكان / القاعة (بالعربي):</label>
                  <input
                    type="text"
                    required
                    value={formVenueName}
                    onChange={(e) => setFormVenueName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">العنوان بالتفصيل:</label>
                  <input
                    type="text"
                    required
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">خط العرض (Latitude):</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="مثال: 30.0571"
                    value={formLatitude}
                    onChange={(e) => setFormLatitude(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white text-left dir-ltr"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">خط الطول (Longitude):</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="مثال: 31.2248"
                    value={formLongitude}
                    onChange={(e) => setFormLongitude(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white text-left dir-ltr"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700 block">رابط خرائط جوجل (Google Maps URL):</label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={formGoogleMapsUrl}
                  onChange={(e) => setFormGoogleMapsUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 focus:border-[#720925] focus:outline-hidden bg-white text-left dir-ltr"
                />
              </div>

              {/* Live Preview of Map */}
              <div className="pt-2 space-y-1.5">
                <span className="font-bold text-stone-700 block">معاينة مباشرة للخريطة في الدعوة:</span>
                <div className="rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
                  <FarahnaMap
                    venueName={formVenueName || 'قاعة الفرح'}
                    address={formAddress || 'العنوان'}
                    latitude={previewLat}
                    longitude={previewLng}
                    googleMapsUrl={formGoogleMapsUrl}
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl burgundy-gradient-bg text-white font-bold shadow-md hover:opacity-95 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ بيانات الخريطة ✅'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
