'use client';

import React from 'react';
import {
  Info,
  PlusCircle,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  Tag,
} from 'lucide-react';

interface BuilderEventsTabProps {
  invitation: any;
  handleChange: (field: string, value: any) => void;
}

export function BuilderEventsTab({ invitation, handleChange }: BuilderEventsTabProps) {
  const events = Array.isArray(invitation.events) ? invitation.events : [];

  // Helper to update an event and auto-sync with root invitation when idx === 0
  const updateEventField = (idx: number, field: string, value: any) => {
    const updated = [...events];
    updated[idx] = { ...updated[idx], [field]: value };
    handleChange('events', updated);

    // Synchronize root invitation attributes with primary event (idx === 0)
    if (idx === 0) {
      if (field === 'date') handleChange('eventDate', value);
      if (field === 'venueNameAr') handleChange('venueNameAr', value);
      if (field === 'addressAr') handleChange('addressAr', value);
      if (field === 'googleMapsUrl') handleChange('googleMapsUrl', value);
      if (field === 'dressCodeAr') handleChange('dressCodeAr', value);
    }
  };

  const handleAddEvent = (preset?: Partial<any>) => {
    const baseDate = invitation.eventDate ? new Date(invitation.eventDate) : new Date(Date.now() + 30 * 86400000);
    const newEvt = {
      id: `evt-${preset?.type || 'custom'}-${Date.now()}`,
      type: preset?.type || 'wedding',
      titleAr: preset?.titleAr || 'مناسبة جديدة',
      subtitleAr: preset?.subtitleAr || '',
      date: preset?.date || baseDate.toISOString(),
      startTime: preset?.startTime || '08:00 م',
      endTime: preset?.endTime || '01:00 ص',
      venueNameAr: preset?.venueNameAr || 'قاعة الحفل الملكية',
      addressAr: preset?.addressAr || 'القاهرة، مصر',
      googleMapsUrl: preset?.googleMapsUrl || 'https://maps.google.com/?q=Cairo',
      dressCodeAr: preset?.dressCodeAr || 'ملابس رسمية أنيقة 🎩👗',
      descriptionAr: preset?.descriptionAr || '',
      isVisible: true,
      isHennaFemaleOnly: Boolean(preset?.isHennaFemaleOnly),
      sortOrder: events.length + 1,
    };

    const newEvents = [...events, newEvt];
    handleChange('events', newEvents);
    if (events.length === 0) {
      handleChange('eventDate', newEvt.date);
      handleChange('venueNameAr', newEvt.venueNameAr);
      handleChange('addressAr', newEvt.addressAr);
      handleChange('googleMapsUrl', newEvt.googleMapsUrl);
    }
  };

  return (
    <div className="space-y-4 text-right font-cairo">
      {/* Admin Tip */}
      <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5 shadow-2xs">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          💡 نصيحة الإدارة: المناسبة الأولى (رقم 1) هي المناسبة الأساسية التي يُبنى عليها العداد التنازلي والخريطة الرئيسية. يمكنك إضافة مناسبات أخرى كليلة الحنة أو عقد القران وستظهر كتبويبات تفاعلية في الدعوة.
        </span>
      </div>

      {/* Header & Quick Add Presets */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-xs font-black text-stone-900 block">
              مواعيد ومناسبات الفرح (المسجلة: {events.length}):
            </span>
            <span className="text-[10px] text-stone-400">
              أضف مناسبة جاهزة بنقرة زر سريعة:
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleAddEvent()}
            className="px-3.5 py-1.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>إضافة مناسبة ➕</span>
          </button>
        </div>

        {/* 1-Click Event Presets */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-stone-100">
          <button
            type="button"
            onClick={() =>
              handleAddEvent({
                type: 'wedding',
                titleAr: 'حفل الزفاف والزفة الكبرى 👑',
                subtitleAr: 'الليلة الملكية في قاعة عايدة',
                venueNameAr: 'فندق ماريوت الزمالك — قاعة عايدة الملكية',
                addressAr: '١٦ شارع سراي الجزيرة، حي الزمالك، القاهرة',
                googleMapsUrl: 'https://maps.google.com/?q=Cairo+Marriott+Hotel+Zamalek',
                dressCodeAr: 'Black Tie / بدلة رسمية وفستان سواريه 🎩👗',
              })
            }
            className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold cursor-pointer"
          >
            + حفل الزفاف 👑
          </button>
          <button
            type="button"
            onClick={() => {
              const baseDate = invitation.eventDate ? new Date(invitation.eventDate) : new Date();
              const hennaDate = new Date(baseDate.getTime() - 2 * 86400000).toISOString();
              handleAddEvent({
                type: 'henna',
                titleAr: 'ليلة الحنة وسهرة البنات 🌿',
                subtitleAr: 'أجواء دافئة ورسم حنة وزغاريد',
                date: hennaDate,
                startTime: '05:00 م',
                endTime: '10:00 م',
                venueNameAr: 'فيلا النرجس للمناسبات الخاصة',
                addressAr: 'التجمع الخامس، القاهرة الجديدة',
                googleMapsUrl: 'https://maps.google.com/?q=New+Cairo+Villa',
                dressCodeAr: 'جلابيب شرقية وملابس مبهجة 💃',
                isHennaFemaleOnly: true,
              });
            }}
            className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-bold cursor-pointer"
          >
            + ليلة الحنة 🌿
          </button>
          <button
            type="button"
            onClick={() => {
              const baseDate = invitation.eventDate ? new Date(invitation.eventDate) : new Date();
              const katbDate = new Date(baseDate.getTime() - 14 * 86400000).toISOString();
              handleAddEvent({
                type: 'katb_ketab',
                titleAr: 'عقد القران وكتب الكتاب 📜',
                subtitleAr: 'اللحظة الشرعية المباركة',
                date: katbDate,
                startTime: '03:00 م',
                endTime: '05:00 م',
                venueNameAr: 'قاعة الماسة — مسجد المشير طنطاوي',
                addressAr: 'محور المشير، التجمع الخامس، القاهرة',
                googleMapsUrl: 'https://maps.google.com/?q=Mosheer+Tantawy+Mosque',
                dressCodeAr: 'ملابس رسمية محتشمة',
              });
            }}
            className="px-2.5 py-1 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-[10px] font-bold cursor-pointer"
          >
            + عقد القران 📜
          </button>
          <button
            type="button"
            onClick={() => {
              const baseDate = invitation.eventDate ? new Date(invitation.eventDate) : new Date();
              const engDate = new Date(baseDate.getTime() - 60 * 86400000).toISOString();
              handleAddEvent({
                type: 'engagement',
                titleAr: 'حفل الخطوبة الرسمي 💍',
                subtitleAr: 'بداية الرحلة والارتباط',
                date: engDate,
                startTime: '06:00 م',
                endTime: '11:00 م',
                venueNameAr: 'فندق رويال توليب — التراس المفتوح',
                addressAr: 'كورنيش الإسكندرية، سيدي جابر',
                googleMapsUrl: 'https://maps.google.com/?q=Tolip+Hotel+Alexandria',
                dressCodeAr: 'فورمال صيفي أنيق',
              });
            }}
            className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-[10px] font-bold cursor-pointer"
          >
            + خطوبة 💍
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-dashed border-stone-300 text-center space-y-3">
            <p className="text-xs text-stone-500 font-bold">لا توجد مناسبات مسجلة بعد في هذه الدعوة.</p>
            <button
              type="button"
              onClick={() => handleAddEvent()}
              className="px-4 py-2 rounded-xl bg-[#720925] text-white text-xs font-bold hover:bg-rose-900 transition-colors cursor-pointer"
            >
              إضافة مناسبة الفرح الأساسية 💍
            </button>
          </div>
        ) : (
          events.map((ev: any, idx: number) => {
            const formattedDateInput = ev.date
              ? new Date(ev.date).toISOString().slice(0, 16)
              : '';

            return (
              <div
                key={ev.id || idx}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3.5 text-xs"
              >
                {/* Event Card Header */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-stone-100">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={ev.titleAr || ''}
                      onChange={(e) => updateEventField(idx, 'titleAr', e.target.value)}
                      placeholder="عنوان المناسبة"
                      className="font-black text-sm text-stone-900 bg-transparent focus:outline-none border-b border-transparent focus:border-[#720925] flex-1"
                    />
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={ev.type || 'wedding'}
                      onChange={(e) => updateEventField(idx, 'type', e.target.value)}
                      className="text-[11px] font-bold px-2 py-1 rounded-xl border border-stone-200 bg-stone-50"
                    >
                      <option value="wedding">زفاف 👑</option>
                      <option value="engagement">خطوبة 💍</option>
                      <option value="katb_ketab">عقد قران 📜</option>
                      <option value="henna">ليلة حنة 🌿</option>
                      <option value="reception">استقبال 🎉</option>
                      <option value="custom">مخصصة ✨</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف مناسبة "${ev.titleAr}"؟`)) {
                          const updated = events.filter((_: any, i: number) => i !== idx);
                          handleChange('events', updated);
                          if (idx === 0 && updated[0]) {
                            handleChange('eventDate', updated[0].date);
                            handleChange('venueNameAr', updated[0].venueNameAr);
                            handleChange('addressAr', updated[0].addressAr);
                            handleChange('googleMapsUrl', updated[0].googleMapsUrl);
                          }
                        }
                      }}
                      className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="حذف المناسبة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Date & Times */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 block flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-600" />
                      <span>التاريخ والموعد:</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formattedDateInput}
                      onChange={(e) => updateEventField(idx, 'date', e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-stone-200 text-xs font-mono dir-ltr bg-stone-50 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 block flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>وقت البدء:</span>
                    </label>
                    <input
                      type="text"
                      value={ev.startTime || ''}
                      onChange={(e) => updateEventField(idx, 'startTime', e.target.value)}
                      placeholder="08:00 م"
                      className="w-full px-2.5 py-2 rounded-xl border border-stone-200 text-xs text-left dir-ltr bg-stone-50 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 block flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>وقت الانتهاء:</span>
                    </label>
                    <input
                      type="text"
                      value={ev.endTime || ''}
                      onChange={(e) => updateEventField(idx, 'endTime', e.target.value)}
                      placeholder="01:00 ص"
                      className="w-full px-2.5 py-2 rounded-xl border border-stone-200 text-xs text-left dir-ltr bg-stone-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Venue & Detailed Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 block">
                      اسم القاعة / المكان:
                    </label>
                    <input
                      type="text"
                      value={ev.venueNameAr || ''}
                      onChange={(e) => updateEventField(idx, 'venueNameAr', e.target.value)}
                      placeholder="فندق ماريوت الزمالك — قاعة عايدة"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:bg-white font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 block">
                      العنوان التفصيلي:
                    </label>
                    <input
                      type="text"
                      value={ev.addressAr || ''}
                      onChange={(e) => updateEventField(idx, 'addressAr', e.target.value)}
                      placeholder="١٦ شارع سراي الجزيرة، الزمالك، القاهرة"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Google Maps Link with Quick Shortcuts */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-stone-600 block flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-600" />
                      <span>رابط موقع القاعة على Google Maps:</span>
                    </label>
                    <div className="flex gap-1">
                      {[
                        { name: 'ماريوت الزمالك', url: 'https://maps.google.com/?q=Cairo+Marriott+Hotel+Zamalek' },
                        { name: 'فورسيزونز', url: 'https://maps.google.com/?q=Four+Seasons+Hotel+Cairo+at+Nile+Plaza' },
                        { name: 'مسجد المشير', url: 'https://maps.google.com/?q=Mosheer+Tantawy+Mosque' },
                      ].map((m) => (
                        <button
                          key={m.name}
                          type="button"
                          onClick={() => updateEventField(idx, 'googleMapsUrl', m.url)}
                          className="text-[9px] font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 px-1.5 py-0.5 rounded-md cursor-pointer"
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="url"
                    value={ev.googleMapsUrl || ''}
                    onChange={(e) => updateEventField(idx, 'googleMapsUrl', e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-mono text-left dir-ltr bg-stone-50 focus:bg-white"
                  />
                </div>

                {/* Dress Code & Henna Privacy */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-600 block">
                      كود الملابس (Dress Code):
                    </label>
                    <input
                      type="text"
                      value={ev.dressCodeAr || ''}
                      onChange={(e) => updateEventField(idx, 'dressCodeAr', e.target.value)}
                      placeholder="Black Tie / بدلة رسمية وفستان سواريه"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:bg-white"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 self-end">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-[11px] font-bold text-stone-800">
                        خاص بالسيدات فقط (ليلة الحنة)
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(ev.isHennaFemaleOnly)}
                      onChange={(e) => updateEventField(idx, 'isHennaFemaleOnly', e.target.checked)}
                      className="w-4 h-4 rounded text-[#720925] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
