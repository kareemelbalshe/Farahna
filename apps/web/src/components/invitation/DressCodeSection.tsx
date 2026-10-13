import React from 'react';
import { Sparkles, ShieldAlert, Shirt, CameraOff } from 'lucide-react';

interface DressCodeSectionProps {
  dressCodeAr?: string | null;
  isHennaFemaleOnly?: boolean;
  notesAr?: string | null;
  secondaryColor?: string;
}

export function DressCodeSection({
  dressCodeAr,
  isHennaFemaleOnly = false,
  notesAr,
  secondaryColor = '#D4AF37',
}: DressCodeSectionProps) {
  if (!dressCodeAr && !isHennaFemaleOnly && !notesAr) return null;

  return (
    <section className="py-8 px-4 max-w-2xl mx-auto space-y-4 text-center">
      <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-stone-200/90 shadow-sm space-y-4 theme-card">
        {/* Henna Female Only Banner */}
        {isHennaFemaleOnly && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-[#720925] border border-rose-300 text-xs font-black shadow-xs mx-auto">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>ليلة خاصة بالسيدات فقط — خصوصية وأمان تام 🌿</span>
          </div>
        )}

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 text-stone-800 font-bold text-sm font-cairo theme-heading">
            <Shirt className="w-4 h-4 text-amber-600" />
            <span>قواعد اللباس والملاحظات الخاصة (Dress Code)</span>
          </div>
          {dressCodeAr && (
            <p className="text-sm sm:text-base font-bold pt-1" style={{ color: secondaryColor }}>
              {dressCodeAr}
            </p>
          )}
        </div>

        {/* Privacy Note or Camera Off Note */}
        {isHennaFemaleOnly && (
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center justify-center gap-2 font-medium">
            <CameraOff className="w-4 h-4 text-rose-600 shrink-0" />
            <span>نرجو عدم التصوير احتراماً لخصوصية العروس والمعازيم ❤️</span>
          </div>
        )}

        {notesAr && (
          <p className="text-xs text-stone-500 leading-relaxed font-medium theme-muted">
            {notesAr}
          </p>
        )}
      </div>
    </section>
  );
}
