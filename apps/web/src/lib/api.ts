const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchPublicInvitation(type: string, slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/public/invitations/${type}/${slug}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(1500),
    });
    return await res.json();
  } catch (error) {
    return { success: false, message: 'تعذر الاتصال بالخادم' };
  }
}

export async function fetchPreviewInvitation(token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/public/preview/${token}`, {
      cache: 'no-store',
    });
    return await res.json();
  } catch (error) {
    console.error('Error fetching preview invitation:', error);
    return { success: false, message: 'تعذر الاتصال بالخادم' };
  }
}

export async function fetchPrivateGuestList(token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/public/guests/${token}`, {
      cache: 'no-store',
    });
    return await res.json();
  } catch (error) {
    console.error('Error fetching private guest list:', error);
    return { success: false, message: 'تعذر الاتصال بالخادم لجلب كشف المعازيم' };
  }
}

export async function submitPublicRsvp(invitationId: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/public/invitations/${invitationId}/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function submitPublicDesign(data: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/public/submit-design`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: 'حدث خطأ في الاتصال بالخادم، يرجى المحاولة مرة أخرى' };
  }
}

export async function recordPublicAnalytics(data: {
  invitationId: string;
  eventType: string;
  deviceType?: string;
  browser?: string;
  referrer?: string;
  metadata?: any;
}) {
  try {
    if (!data.invitationId) return;

    let deviceType = data.deviceType;
    let browser = data.browser;
    let referrer = data.referrer;

    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent;
      if (!browser) {
        if (ua.includes('Edg/')) browser = 'Edge';
        else if (ua.includes('Chrome') && !ua.includes('Edg/')) browser = 'Chrome';
        else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else browser = 'Mobile Browser';
      }
      if (!deviceType) {
        deviceType = window.innerWidth < 768 ? 'mobile' : 'desktop';
      }
      if (referrer === undefined) {
        referrer = document.referrer || '';
      }
    }

    fetch(`${API_BASE_URL}/public/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        deviceType: deviceType || 'mobile',
        browser: browser || 'Chrome',
        referrer: referrer || '',
      }),
      keepalive: true,
    }).catch(() => {});
  } catch (e) {
    // Silent non-blocking failure
  }
}

export async function fetchSiteSettings() {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(1000),
    });
    const json = await res.json();
    return json.data;
  } catch (e) {
    return {
      siteNameAr: 'فرحنا',
      whatsappNumber: '201019262075',
      supportPhone: '+201019262075',
      paymentPhone: '01064906723',
      paymentInstructionsAr: 'الدفع متاح عبر InstaPay أو فودافون كاش',
    };
  }
}

export async function adminFetch(endpoint: string, options: RequestInit = {}) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('farahna_token') : null;
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('farahna_token');
      window.location.href = '/admin/login';
      return { success: false, message: 'انتهت صلاحية الجلسة' };
    }

    return await res.json();
  } catch (err: any) {
    console.error('adminFetch network error:', err);
    return { success: false, message: err?.message || 'تعذر الاتصال بالخادم' };
  }
}

export interface PricingPlanItem {
  id?: string;
  name: string;
  nameAr: string;
  slug: string;
  price: number;
  priceLabel: string;
  currency: string;
  durationDays?: number;
  features?: string[];
  featuresAr?: string[];
  badge?: string;
  isPopular?: boolean;
}

export const DEFAULT_PRICING_PLANS: PricingPlanItem[] = [
  {
    name: 'Basic Event',
    nameAr: 'باقة المناسبة الواحدة',
    slug: 'basic',
    price: 50,
    priceLabel: '50 ج.م',
    currency: 'EGP',
    durationDays: 30,
    badge: 'اقتصادية لمناسبة واحدة 🌸',
    isPopular: false,
  },
  {
    name: 'Wedding Journey',
    nameAr: 'باقة رحلة الفرح الشاملة',
    slug: 'wedding-journey',
    price: 95,
    priceLabel: '95 ج.م',
    currency: 'EGP',
    durationDays: 90,
    badge: 'الأكثر طلباً والأفضل قيمة 👑',
    isPopular: true,
  },
  {
    name: 'Luxury Custom VIP',
    nameAr: 'باقة التصميم الخاص VIP',
    slug: 'luxury-vip',
    price: 150,
    priceLabel: '150 ج.م',
    currency: 'EGP',
    durationDays: 180,
    badge: 'فخامة ملكية وتخصيص كامل 💎',
    isPopular: false,
  },
];

export async function fetchPricingPlans(): Promise<PricingPlanItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/pricing-plans`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(1500),
    });
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((p: any) => ({
        ...p,
        price: Number(p.price) || 50,
        priceLabel: `${Number(p.price) || 50} ${p.currency === 'EGP' ? 'ج.م' : p.currency || 'ج.م'}`,
      }));
    }
    return DEFAULT_PRICING_PLANS;
  } catch (e) {
    return DEFAULT_PRICING_PLANS;
  }
}

export async function updatePricingPlan(idOrSlug: string, data: any) {
  return await adminFetch(`/pricing-plans/${idOrSlug}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function bulkUpdatePricingPlans(plans: any[]) {
  return await adminFetch(`/pricing-plans/bulk`, {
    method: 'PATCH',
    body: JSON.stringify({ plans }),
  });
}

export async function deleteInvitation(id: string) {
  return await adminFetch(`/invitations/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Helper to ensure secure media endpoints receive the required JWT token
 * for protected files like payment proofs.
 */
export function getMediaUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  let finalUrl = url;
  const token = typeof window !== 'undefined' ? localStorage.getItem('farahna_token') : null;

  if (finalUrl.includes('/api/media/secure/') && token && !finalUrl.includes('token=')) {
    const separator = finalUrl.includes('?') ? '&' : '?';
    finalUrl = `${finalUrl}${separator}token=${encodeURIComponent(token)}`;
  }
  return finalUrl;
}



