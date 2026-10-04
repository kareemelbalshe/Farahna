'use client';

import React from 'react';
import {
  AnyTable,
  type AnyTableProps,
  type ColumnDef,
  type TableAction,
  type SwitchAction,
  type TableInstance,
  type AnyTableTheme,
} from '@kareemelbalshe/any-table';

export type { ColumnDef, TableAction, SwitchAction, TableInstance, AnyTableProps };

export const FARAHNA_TABLE_THEME: Partial<AnyTableTheme> = {
  colors: {
    primary: '#720925',
    primaryHover: '#5a071d',
    primaryLight: '#fdf2f4',
    secondary: '#BF953F',
    border: '#e7e5e4',
    textPrimary: '#1c1917',
    textSecondary: '#57534e',
    textMuted: '#a8a29e',
    rowHover: '#fafaf9',
    card: '#ffffff',
    theadBg: '#FAF7F2',
    theadText: '#44403c',
  },
  borderRadius: '1.5rem',
  classes: {
    container: 'w-full space-y-3',
    tableWrapper: 'w-full overflow-x-auto rounded-3xl border border-stone-200/90 bg-white shadow-2xs transition-all',
    table: 'w-full border-collapse text-right text-xs',
    thead: 'bg-[#FAF7F2] border-b border-stone-200 text-stone-700 font-bold',
    th: 'p-4 text-right font-bold text-stone-700 select-none whitespace-nowrap text-xs',
    td: 'p-4 text-xs align-middle text-stone-800 border-b border-stone-100',
    tr: 'hover:bg-stone-50/80 transition-colors',
    searchInput: 'w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs text-right focus:outline-hidden focus:ring-2 focus:ring-[#720925] bg-stone-50/50',
    paginationContainer: 'w-full flex flex-wrap items-center justify-between gap-4 p-4 border-t border-stone-100 text-xs text-stone-500 font-medium',
    paginationButtonActive: 'bg-[#720925] text-white shadow-xs font-bold rounded-xl',
    paginationButton: 'h-8 min-w-[32px] px-2.5 flex items-center justify-center rounded-xl font-bold text-xs bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors disabled:opacity-40 cursor-pointer',
    paginationSelect: 'h-8 px-2.5 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-700 focus:outline-hidden focus:ring-2 focus:ring-[#720925] cursor-pointer',
  },
};

export const FarahnaLoadingComponent = () => (
  <div className="py-16 text-center text-xs text-stone-500 font-bold space-y-2">
    <div className="w-8 h-8 border-3 border-[#720925] border-t-transparent rounded-full animate-spin mx-auto" />
    <p>جاري تحميل البيانات...</p>
  </div>
);

export function AppTable<TData = any>(props: AnyTableProps<TData>) {
  const mergedTheme: Partial<AnyTableTheme> = {
    ...FARAHNA_TABLE_THEME,
    ...props.theme,
    colors: {
      ...FARAHNA_TABLE_THEME.colors,
      ...props.theme?.colors,
    },
    classes: {
      ...FARAHNA_TABLE_THEME.classes,
      ...props.theme?.classes,
    },
  };

  return (
    <AnyTable<TData>
      bordered={props.bordered ?? true}
      hoverable={props.hoverable ?? true}
      striped={props.striped ?? false}
      actionsTitle={props.actionsTitle ?? 'الإجراءات'}
      actionsWidth={props.actionsWidth ?? 140}
      theme={mergedTheme}
      loadingComponent={props.loadingComponent ?? <FarahnaLoadingComponent />}
      emptyTitle={props.emptyTitle ?? 'لا توجد بيانات مطابقة للبحث'}
      emptyDescription={props.emptyDescription ?? 'جرّب تغيير كلمات البحث أو إضافة سجل جديد'}
      {...props}
    />
  );
}

export default AppTable;
