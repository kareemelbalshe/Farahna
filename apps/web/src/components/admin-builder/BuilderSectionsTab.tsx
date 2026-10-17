'use client';

import React from 'react';
import {
  Info,
  CheckCircle2,
  XCircle,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { DEFAULT_SECTIONS } from '@farahna/shared';

interface BuilderSectionsTabProps {
  invitation: any;
  setInvitation: React.Dispatch<React.SetStateAction<any>>;
  handleChange: (field: string, value: any) => void;
  handleNestedThemeConfigChange: (key: string, value: any) => void;
  handleToggleSection: (sectionKey: string, isEnabled: boolean) => void;
  onNavigateToTab?: (tab: string) => void;
}

export function BuilderSectionsTab({
  invitation,
  setInvitation,
  handleChange,
  handleNestedThemeConfigChange,
  handleToggleSection,
  onNavigateToTab,
}: BuilderSectionsTabProps) {
  const currentWhatsapp =
    invitation.themeConfig?.whatsappPhone !== undefined
      ? invitation.themeConfig.whatsappPhone
      : invitation.whatsappPhone !== undefined
      ? invitation.whatsappPhone
      : invitation.customer?.whatsapp || invitation.customer?.phone || '';

  const hennaPasscode =
    invitation.themeConfig?.hennaPasscode || invitation.hennaPasscode || '2026';

  const hennaMessage =
    invitation.themeConfig?.hennaMessage ||
    invitation.hennaMessage ||
    'يسعدنا تشريفكم في ليلة الحنة المبهجة في أجواء راقية ومخصصة للسيدات فقط للاحتفال بالعروس 🌸🌿';

  return (
    <div className="space-y-4 text-right font-cairo">
      {/* Admin Tip */}
      <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5 shadow-2xs">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          💡 تحكم كامل بالأقسام: يمكنك تفعيل أو إخفاء أي سكشن بنقرة زر واحدة. كل تغيير يظهر مباشرة في المحاكي الحية.
        </span>
      </div>

      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs font-black text-stone-900">أقسام الدعوة التفاعلية:</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const allEnabled = DEFAULT_SECTIONS.map((s, idx) => ({
                sectionKey: s.key,
                isEnabled: true,
                sortOrder: idx,
              }));
              setInvitation((prev: any) => ({
                ...prev,
                sections: allEnabled,
                envelopeAnimationEnabled: true,
                countdownEnabled: true,
                rsvpEnabled: true,
              }));
            }}
            className="text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-200 cursor-pointer transition-colors shadow-2xs"
          >
            تفعيل الكل ✨
          </button>
          <button
            type="button"
            onClick={() => {
              const minimal = DEFAULT_SECTIONS.map((s, idx) => ({
                sectionKey: s.key,
                isEnabled: ['cover', 'couple', 'venue'].includes(s.key),
                sortOrder: idx,
              }));
              setInvitation((prev: any) => ({
                ...prev,
                sections: minimal,
                envelopeAnimationEnabled: false,
                countdownEnabled: false,
                rsvpEnabled: false,
              }));
            }}
            className="text-[11px] font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1 rounded-xl border border-stone-200 cursor-pointer transition-colors"
          >
            الأساسي فقط ⚡
          </button>
        </div>
      </div>

      {/* Dynamic Sections Switch List */}
      <div className="space-y-2.5">
        {DEFAULT_SECTIONS.map((sec) => {
          const currentSec = invitation.sections?.find((s: any) => s.sectionKey === sec.key);
          let isEnabled = currentSec !== undefined ? currentSec.isEnabled : sec.defaultEnabled;

          if (sec.key === 'envelope' && invitation.envelopeAnimationEnabled !== undefined) {
            isEnabled = invitation.envelopeAnimationEnabled;
          } else if (sec.key === 'countdown' && invitation.countdownEnabled !== undefined) {
            isEnabled = invitation.countdownEnabled;
          } else if (sec.key === 'rsvp' && invitation.rsvpEnabled !== undefined) {
            isEnabled = invitation.rsvpEnabled;
          }

          return (
            <div
              key={sec.key}
              className={`p-3.5 rounded-2xl border transition-all ${
                isEnabled
                  ? 'bg-white border-stone-200 shadow-2xs hover:border-amber-400'
                  : 'bg-stone-50 border-dashed border-stone-300 opacity-65'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">{sec.labelAr}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isEnabled
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-stone-200/80 text-stone-600'
                      }`}
                    >
                      {isEnabled ? 'ظاهر للضيوف ✅' : 'مخفي ❌'}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono" dir="ltr">
                    {sec.key}
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      handleToggleSection(sec.key, checked);
                      if (sec.key === 'whatsapp') {
                        handleNestedThemeConfigChange('whatsappContactEnabled', checked);
                      }
                      if (sec.key === 'henna_special') {
                        handleNestedThemeConfigChange('hennaSpecialEnabled', checked);
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>

              {/* Extra WhatsApp Settings if enabled */}
              {sec.key === 'whatsapp' && isEnabled && (
                <div className="pt-2.5 mt-2.5 border-t border-stone-100 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <input
                    type="tel"
                    value={currentWhatsapp || ''}
                    onChange={(e) => {
                      handleNestedThemeConfigChange('whatsappPhone', e.target.value);
                      handleChange('whatsappPhone', e.target.value);
                    }}
                    placeholder="رقم واتساب العروسين (مثال: 201019262075)"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-mono text-left dir-ltr bg-stone-50 focus:bg-white"
                  />
                </div>
              )}

              {/* Extra Henna Special Settings if enabled */}
              {sec.key === 'henna_special' && isEnabled && (
                <div className="pt-2.5 mt-2.5 border-t border-stone-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="text-[11px] font-bold text-stone-700">رمز الدخول الخاص بليلة الحنة:</span>
                    <input
                      type="text"
                      value={hennaPasscode}
                      onChange={(e) => handleNestedThemeConfigChange('hennaPasscode', e.target.value)}
                      placeholder="2026"
                      className="w-28 px-2 py-1 rounded-lg border border-stone-200 text-xs font-mono text-center bg-stone-50"
                    />
                  </div>
                  <input
                    type="text"
                    value={hennaMessage}
                    onChange={(e) => handleNestedThemeConfigChange('hennaMessage', e.target.value)}
                    placeholder="رسالة ليلة الحنة..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs bg-stone-50"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
