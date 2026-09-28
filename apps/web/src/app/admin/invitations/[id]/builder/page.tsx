'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Save,
  Eye,
  Send,
  Share2,
  Check,
  Sparkles,
  ArrowRight,
  Music,
  Calendar,
  MapPin,
  Heart,
  Palette,
  ExternalLink,
} from 'lucide-react';
import { adminFetch } from '@/lib/api';
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer';

export default function VisualInvitationBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const invitationId = params.id as string;

  const [invitation, setInvitation] = useState<any>(null);
  const [themes, setThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'couple' | 'events' | 'theme' | 'sections' | 'media'>('couple');
  const [previewTokenCopied, setPreviewTokenCopied] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  useEffect(() => {
    Promise.all([
      adminFetch(`/invitations/${invitationId}`),
      adminFetch('/themes'),
    ]).then(([invRes, themesRes]) => {
      if (invRes.success) {
        setInvitation(invRes.data);
      }
      if (themesRes.success) {
        setThemes(themesRes.data);
      }
      setLoading(false);
    });
  }, [invitationId]);

  if (loading || !invitation) {
    return (
      <div className="py-20 text-center text-xs font-bold text-stone-500 font-cairo">
        جاري تحميل المحرر المرئي للدعوة...
      </div>
    );
  }

  // Handle form changes inline
  const handleChange = (field: string, value: any) => {
    setInvitation((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminFetch(`/invitations/${invitationId}`, {
        method: 'PATCH',
        body: JSON.stringify(invitation),
      });

      if (res.success) {
        setSuccessNotice('تم حفظ التعديلات بنجاح!');
        setTimeout(() => setSuccessNotice(''), 3000);
      } else {
        alert(res.message || 'حدث خطأ أثناء الحفظ');
      }
    } catch (e) {
      alert('خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  };

  const previewUrl = `${window.location.origin}/preview/${invitation.previewToken}`;

  const copyPreviewLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(previewUrl);
      setPreviewTokenCopied(true);
      setTimeout(() => setPreviewTokenCopied(false), 2500);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col -m-4 sm:-m-8 bg-[#F3ECE1]/60 overflow-hidden font-cairo">
      {/* Top Builder Bar */}
      <header className="h-16 bg-white border-b border-stone-200 px-6 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/invitations')}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-black text-stone-900 truncate max-w-xs">
              محرر: {invitation.title}
            </h2>
            <p className="text-[10px] text-stone-400 font-mono">
              /invitation/{invitation.type}/{invitation.slug}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {successNotice && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 animate-pulse">
              {successNotice}
            </span>
          )}

          <button
            type="button"
            onClick={copyPreviewLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-colors shadow-2xs"
          >
            {previewTokenCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{previewTokenCopied ? 'تم نسخ الرابط!' : 'نسخ رابط معاينة للعميل'}</span>
          </button>

          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-stone-500" />
            <span>معاينة في نافذة كاملة</span>
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl burgundy-gradient-bg text-white font-bold text-xs shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات 💾'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace (Editor Panel on Right, Live Mobile on Center/Left) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Sidebar (Right in RTL) */}
        <div className="w-full md:w-[480px] bg-white border-l border-stone-200 flex flex-col justify-between shrink-0 overflow-y-auto p-6 space-y-6">
          {/* Tab Navigation */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 rounded-2xl text-xs font-bold text-stone-600 text-center">
            <button
              onClick={() => setActiveTab('couple')}
              className={`py-2 rounded-xl transition-colors ${
                activeTab === 'couple' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              العروسين
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`py-2 rounded-xl transition-colors ${
                activeTab === 'theme' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              الثيم والألوان
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-2 rounded-xl transition-colors ${
                activeTab === 'events' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              المناسبات ({invitation.events?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`py-2 rounded-xl transition-colors ${
                activeTab === 'sections' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              الأقسام
            </button>
          </div>

          {/* Tab 1: Couple Names & Message */}
          {activeTab === 'couple' && (
            <div className="space-y-4 text-right">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">عنوان الدعوة الرئيسي:</label>
                <input
                  type="text"
                  value={invitation.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">اسم العريس (عربي):</label>
                  <input
                    type="text"
                    value={invitation.coupleGroomAr}
                    onChange={(e) => handleChange('coupleGroomAr', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">اسم العروسة (عربي):</label>
                  <input
                    type="text"
                    value={invitation.coupleBrideAr}
                    onChange={(e) => handleChange('coupleBrideAr', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">اسم العريس (English):</label>
                  <input
                    type="text"
                    value={invitation.coupleGroomEn || ''}
                    onChange={(e) => handleChange('coupleGroomEn', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-left dir-ltr"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">اسم العروسة (English):</label>
                  <input
                    type="text"
                    value={invitation.coupleBrideEn || ''}
                    onChange={(e) => handleChange('coupleBrideEn', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-left dir-ltr"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">أولياء الأمور / إهداء العائلة:</label>
                <input
                  type="text"
                  value={invitation.parentsGroomAr || ''}
                  onChange={(e) => handleChange('parentsGroomAr', e.target.value)}
                  placeholder="نجل الأستاذ ... وكريمة المهندس ..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">رسالة الدعوة والآية الكريمة:</label>
                <textarea
                  rows={4}
                  value={invitation.weddingMessageAr || ''}
                  onChange={(e) => handleChange('weddingMessageAr', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">رابط ملف الموسيقى (MP3 URL):</label>
                <input
                  type="url"
                  value={invitation.musicUrl || ''}
                  onChange={(e) => handleChange('musicUrl', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-left dir-ltr"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Theme & Colors */}
          {activeTab === 'theme' && (
            <div className="space-y-4 text-right">
              <label className="text-xs font-bold text-stone-700 block">اختر ثيم الدعوة الأساسي:</label>
              <div className="space-y-2">
                {themes.map((th) => {
                  const isSelected = invitation.themeId === th.id;
                  return (
                    <div
                      key={th.id}
                      onClick={() => {
                        handleChange('themeId', th.id);
                        handleChange('theme', th);
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-rose-50 border-[#720925] shadow-xs'
                          : 'bg-white border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-full shadow-xs border border-white"
                          style={{ backgroundColor: th.config?.primaryColor || '#720925' }}
                        />
                        <div>
                          <p className="text-xs font-bold text-stone-900">{th.nameAr}</p>
                          <p className="text-[10px] text-stone-400">{th.name}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#720925]" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Events list */}
          {activeTab === 'events' && (
            <div className="space-y-4 text-right">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">مناسبات رحلة الفرح:</span>
                <span className="text-[11px] text-stone-400">
                  {invitation.events?.length || 0} مناسبات
                </span>
              </div>

              <div className="space-y-3">
                {invitation.events?.map((ev: any, idx: number) => (
                  <div
                    key={ev.id || idx}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{ev.titleAr}</span>
                      <span className="text-[10px] font-mono text-stone-500">{ev.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600">
                      <MapPin className="w-3.5 h-3.5 text-[#720925]" />
                      <span>{ev.venueNameAr}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Sections Toggles */}
          {activeTab === 'sections' && (
            <div className="space-y-3 text-right">
              <label className="text-xs font-bold text-stone-700 block">
                تفعيل وإلغاء أقسام الدعوة:
              </label>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
                  <span className="text-xs font-bold text-stone-800">تجربة فتح الظرف التفاعلي</span>
                  <input
                    type="checkbox"
                    checked={invitation.envelopeAnimationEnabled}
                    onChange={(e) => handleChange('envelopeAnimationEnabled', e.target.checked)}
                    className="w-4 h-4 rounded text-[#720925]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
                  <span className="text-xs font-bold text-stone-800">العد التنازلي لموعد الفرح</span>
                  <input
                    type="checkbox"
                    checked={invitation.countdownEnabled}
                    onChange={(e) => handleChange('countdownEnabled', e.target.checked)}
                    className="w-4 h-4 rounded text-[#720925]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
                  <span className="text-xs font-bold text-stone-800">تأكيد الحضور (RSVP)</span>
                  <input
                    type="checkbox"
                    checked={invitation.rsvpEnabled}
                    onChange={(e) => handleChange('rsvpEnabled', e.target.checked)}
                    className="w-4 h-4 rounded text-[#720925]"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Live Mobile Preview Frame (Center) */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <div className="w-[380px] h-[740px] bg-stone-900 border-[10px] border-stone-800 rounded-[50px] shadow-2xl overflow-hidden relative flex flex-col">
            {/* Phone speaker notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-stone-900 rounded-full z-30 flex items-center justify-center">
              <div className="w-12 h-1 bg-stone-700 rounded-full" />
            </div>

            {/* Inner Live Screen */}
            <div className="flex-1 overflow-y-auto bg-[#FAF7F2]">
              <InvitationRenderer
                invitation={invitation}
                events={invitation.events || []}
                theme={invitation.theme}
                sections={invitation.sections || []}
                isPreview={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
