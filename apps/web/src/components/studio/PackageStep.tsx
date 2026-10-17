'use client';

import React from 'react';
import { Crown, Check } from 'lucide-react';
import { PackagePlan } from './studioConstants';

interface PackageStepProps {
  selectedPackage: string;
  packagesList: PackagePlan[];
  currentPkg: PackagePlan;
  onSelectPackage: (pkgId: 'basic' | 'wedding-journey' | 'luxury-vip') => void;
}

export function PackageStep({
  selectedPackage,
  packagesList,
  currentPkg,
  onSelectPackage,
}: PackageStepProps) {
  return (
    <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-5 shadow-2xs">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-sm font-black text-stone-900 flex items-center gap-2">
          <Crown className="w-5 h-5 text-[#720925]" />
          <span>١. اختر خطة وباقة الدعوة (معاينة الفروق والمميزات المفتوحة):</span>
        </label>
        <span className="text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
          الباقة المحددة: {currentPkg.name} ({currentPkg.priceLabel})
        </span>
      </div>

      {/* Package Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {packagesList.map((pkg) => {
          const isSelected = selectedPackage === pkg.id;
          const isVipTier = pkg.id === 'luxury-vip';
          const isPopularTier = pkg.id === 'wedding-journey';

          return (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg.id)}
              className={`relative p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? isVipTier
                    ? 'border-amber-400 bg-gradient-to-b from-amber-50/90 via-white to-amber-50/40 text-stone-950 shadow-md ring-2 ring-amber-300'
                    : isPopularTier
                    ? 'border-[#720925] bg-rose-50/80 text-[#720925] shadow-md ring-2 ring-rose-200'
                    : 'border-stone-800 bg-stone-50 text-stone-900 shadow-md ring-2 ring-stone-200'
                  : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/60 text-stone-800 opacity-90'
              }`}
            >
              {/* Top Badge */}
              <div className="flex items-center justify-between gap-1">
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shadow-2xs ${
                    isVipTier
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : isPopularTier
                      ? 'bg-rose-100 text-rose-900 border-rose-300'
                      : 'bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {pkg.badge}
                </span>
                <span className="text-2xl">{pkg.icon}</span>
              </div>

              {/* Header & Price */}
              <div className="space-y-1">
                <h3 className="font-black text-sm sm:text-base text-stone-950 flex items-center justify-between">
                  <span>{pkg.name}</span>
                  <span className="text-sm font-black font-mono text-[#720925]">
                    {pkg.priceLabel}
                  </span>
                </h3>
                <p className="text-[11px] text-stone-500 leading-snug">
                  {pkg.summary}
                </p>
              </div>

              {/* Feature Highlights Checklist */}
              <ul className="space-y-1.5 text-xs pt-1 border-t border-stone-200/60">
                {pkg.features.slice(0, 5).map((f, fIdx) => (
                  <li
                    key={fIdx}
                    className={`flex items-start gap-1.5 ${
                      f.included
                        ? f.highlight
                          ? 'text-stone-900 font-bold'
                          : 'text-stone-700'
                        : 'text-stone-400 line-through opacity-75'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        f.included
                          ? isVipTier
                            ? 'bg-amber-500 text-white'
                            : 'bg-[#720925] text-white'
                          : 'bg-stone-200 text-stone-400'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span className="text-[11px] leading-tight">{f.text}</span>
                  </li>
                ))}
              </ul>

              {/* Selection Button */}
              <button
                type="button"
                className={`w-full py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isSelected
                    ? isVipTier
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-sm'
                      : isPopularTier
                      ? 'bg-[#720925] text-white shadow-sm'
                      : 'bg-stone-900 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {isSelected ? '✓ الباقة المحددة حالياً' : `اختيار هذه الباقة (${pkg.priceLabel})`}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
