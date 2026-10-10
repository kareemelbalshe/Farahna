'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Sparkles,
  MailOpen,
  Calendar,
  Palette,
  Image,
  CheckSquare,
  CreditCard,
  BarChart3,
  Tag,
  Settings,
  LogOut,
  ExternalLink,
  Heart,
  PlusCircle,
  Menu,
  X,
  ShieldAlert,
  ArrowRight,
  Smartphone,
  Download,
  Wifi,
  WifiOff,
  Check,
} from 'lucide-react';
import { UserRole } from '@farahna/shared';

interface AdminNavItem {
  name: string;
  nameEn: string;
  href: string;
  icon: any;
  allowedRoles: UserRole[];
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    name: 'لوحة القيادة',
    nameEn: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    allowedRoles: ['super_admin', 'admin', 'editor'],
  },
  {
    name: 'الطلبات',
    nameEn: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
    allowedRoles: ['super_admin', 'admin'],
  },
  {
    name: 'سجل العملاء',
    nameEn: 'Customers',
    href: '/admin/customers',
    icon: Users,
    allowedRoles: ['super_admin', 'admin'],
  },
  {
    name: 'العملاء المحتملين',
    nameEn: 'Leads',
    href: '/admin/leads',
    icon: Sparkles,
    allowedRoles: ['super_admin', 'admin'],
  },
  {
    name: 'إدارة الدعوات',
    nameEn: 'Invitations',
    href: '/admin/invitations',
    icon: MailOpen,
    allowedRoles: ['super_admin', 'admin', 'editor'],
  },
  {
    name: 'المناسبات',
    nameEn: 'Events',
    href: '/admin/events',
    icon: Calendar,
    allowedRoles: ['super_admin', 'admin', 'editor'],
  },
  {
    name: 'الثيمات والتصاميم',
    nameEn: 'Themes',
    href: '/admin/themes',
    icon: Palette,
    allowedRoles: ['super_admin', 'admin', 'editor'],
  },
  {
    name: 'مكتبة الوسائط',
    nameEn: 'Media',
    href: '/admin/media',
    icon: Image,
    allowedRoles: ['super_admin', 'admin', 'editor'],
  },
  {
    name: 'تأكيدات الحضور',
    nameEn: 'RSVP',
    href: '/admin/rsvp',
    icon: CheckSquare,
    allowedRoles: ['super_admin', 'admin', 'editor'],
  },
  {
    name: 'مدفوعات InstaPay',
    nameEn: 'Payments',
    href: '/admin/payments',
    icon: CreditCard,
    allowedRoles: ['super_admin', 'admin'],
  },
  {
    name: 'الإحصائيات والزيارات',
    nameEn: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    allowedRoles: ['super_admin', 'admin'],
  },
  {
    name: 'باقات الأسعار',
    nameEn: 'Pricing',
    href: '/admin/pricing',
    icon: Tag,
    allowedRoles: ['super_admin', 'admin'],
  },
  {
    name: 'إعدادات المنصة',
    nameEn: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    allowedRoles: ['super_admin'],
  },
];

const ROLE_LABELS: Record<string, { ar: string; color: string }> = {
  super_admin: { ar: 'المدير العام (Super Admin)', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  admin: { ar: 'مشرف إدارة (Admin)', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  editor: { ar: 'محرر محتوى (Editor)', color: 'bg-purple-100 text-purple-900 border-purple-300' },
  customer: { ar: 'عميل (Customer)', color: 'bg-stone-100 text-stone-800 border-stone-300' },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('مدير المنصة');
  const [userRole, setUserRole] = useState<UserRole>('super_admin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // PWA State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // 1. Register Service Worker specifically for /admin scope
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/admin' }).catch((err) => {
        console.warn('Admin Service Worker registration failed:', err);
      });
    }

    // 2. Check standalone display mode (already installed)
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }

      // Online/Offline listeners
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Listen for beforeinstallprompt event
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
      };
      window.addEventListener('beforeinstallprompt', handleBeforeInstall);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      alert('لتثبيت لوحة التحكم كتطبيق مستقل، يمكنك الضغط على قائمة المتصفح (⋮) ثم اختيار "Install app" أو "Add to Home screen".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  useEffect(() => {
    if (pathname === '/admin/login' || pathname === '/admin/offline') {
      return;
    }
    const token = localStorage.getItem('farahna_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    const userStr = localStorage.getItem('farahna_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUserName(u.name || 'مدير المنصة');
        if (u.role) {
          setUserRole(u.role);
        }
      } catch (e) {}
    }
    setAuthChecked(true);
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('farahna_token');
    localStorage.removeItem('farahna_user');
    router.push('/admin/login');
  };

  // If on /admin/login or /admin/offline, don't show the dashboard shell
  if (pathname === '/admin/login' || pathname === '/admin/offline') {
    return <>{children}</>;
  }

  // Filter navigation items by active user role
  const visibleNavItems = ADMIN_NAV_ITEMS.filter((item) =>
    item.allowedRoles.includes(userRole)
  );

  // Check if current route is allowed for the active user role
  const currentNavRule = ADMIN_NAV_ITEMS.find((item) =>
    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
  );

  const isAccessAllowed = !currentNavRule || currentNavRule.allowedRoles.includes(userRole);

  const roleMeta = ROLE_LABELS[userRole] || { ar: userRole, color: 'bg-stone-100 text-stone-800 border-stone-300' };

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex text-stone-900 font-cairo">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-l border-stone-200/90 flex-col justify-between shrink-0 shadow-xs h-screen sticky top-0 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-amber-300/40 shadow-md shadow-rose-950/20 shrink-0">
              <img src="/favicon.png" alt="فرحنا - Farahna" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-xl font-black text-[#720925] flex items-center gap-1.5">
                فرحنا
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                  Admin
                </span>
              </span>
              <p className="text-[11px] text-stone-400">لوحة الإدارة المركزية</p>
            </div>
          </Link>

          {/* Quick Create CTA (Only for users with invitation create rights) */}
          {(userRole === 'super_admin' || userRole === 'admin' || userRole === 'editor') && (
            <div>
              <Link
                href="/admin/invitations/new"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl burgundy-gradient-bg text-white font-bold text-xs shadow-md shadow-rose-950/20 hover:opacity-95 transition-opacity"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إنشاء دعوة جديدة 🪄</span>
              </Link>
            </div>
          )}

          {/* Navigation Links (Filtered by Role) */}
          <nav className="space-y-1">
            <span className="text-[10px] font-bold text-stone-400 px-3 uppercase tracking-wider block mb-2">
              الأقسام والخدمات ({visibleNavItems.length})
            </span>
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-colors ${
                    isActive
                      ? 'bg-rose-50 text-[#720925] border border-rose-200/60 shadow-2xs'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#720925]' : 'text-stone-400'}`} />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout Footer */}
        <div className="p-6 border-t border-stone-100 space-y-3 bg-stone-50/50">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-black text-stone-800 truncate max-w-[140px]">{userName}</p>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleMeta.color}`}>
                {roleMeta.ar}
              </span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-[#720925] p-2 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-stone-200"
              title="زيارة الموقع العام"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* PWA Install Button for Admin */}
          <button
            type="button"
            onClick={handleInstallApp}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 font-bold text-xs hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer"
            title="تثبيت لوحة التحكم كتطبيق مستقل PWA"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-700" />
            <span>{isInstalled ? 'التطبيق مثبت ✅' : 'تثبيت تطبيق الأدمن (PWA)'}</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 font-bold text-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* PWA Head tags */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#720925" />

        {/* Offline Banner when disconnected */}
        {!isOnline && (
          <div className="bg-amber-600 text-white text-xs font-bold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-sm z-40">
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span>أنت تعمل حالياً في وضع عدم الاتصال (Offline Mode) — يُرجى التأكد من اتصال الإنترنت.</span>
          </div>
        )}

        {/* Mobile & Tablet Top Header */}
        <header className="lg:hidden bg-white border-b border-stone-200 p-4 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl burgundy-gradient-bg flex items-center justify-center text-white">
              <Heart className="w-4 h-4 fill-rose-300" />
            </div>
            <span className="font-black text-stone-900 text-base">فرحna Admin</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleMeta.color}`}>
              {userRole}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-600 rounded-xl hover:bg-stone-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-stone-200 p-4 space-y-2 max-h-[80vh] overflow-y-auto z-20">
            <div className="pb-2 border-b border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500">القائمة الرئيسية ({visibleNavItems.length} قسم)</span>
              <span className="text-xs text-stone-400">{userName}</span>
            </div>
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs ${
                    isActive
                      ? 'bg-rose-50 text-[#720925] border border-rose-200'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <button
                type="button"
                onClick={handleInstallApp}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 font-bold text-xs hover:bg-amber-100"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                <span>{isInstalled ? 'التطبيق مثبت ✅' : 'تثبيت تطبيق الأدمن'}</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-right px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        )}

        {/* Page Inner Container with RBAC Guard Check */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {authChecked && !isAccessAllowed ? (
            /* 403 Forbidden Screen */
            <div className="min-h-[60vh] flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 shadow-xl text-center space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-rose-100 text-[#720925] flex items-center justify-center mx-auto border border-rose-200">
                  <ShieldAlert className="w-8 h-8 text-[#720925]" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                    صلاحية غير كافية (403 Forbidden)
                  </span>
                  <h2 className="text-xl font-black text-stone-900 font-cairo">
                    هذا القسم غير متاح لحسابك
                  </h2>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    حسابك الحالي مسجل بدور{' '}
                    <strong className="text-stone-800 font-bold">"{roleMeta.ar}"</strong>، ولا يملك
                    صلاحيات كافية للوصول إلى قسم{' '}
                    <strong className="text-[#720925]">
                      {currentNavRule?.name || pathname}
                    </strong>
                    .
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full burgundy-gradient-bg text-white text-xs font-bold shadow-md hover:opacity-95"
                  >
                    <span>العودة إلى لوحة القيادة</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
