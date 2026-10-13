const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchPublicInvitation(type: string, slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/public/invitations/${type}/${slug}`, {
      cache: 'no-store',
    });
    return await res.json();
  } catch (error) {
    console.error('Error fetching public invitation:', error);
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
    const res = await fetch(`${API_BASE_URL}/settings`, { next: { revalidate: 60 } });
    const json = await res.json();
    return json.data;
  } catch (e) {
    return {
      siteNameAr: 'فرحنا',
      whatsappNumber: '201019262075',
      supportPhone: '+201019262075',
      paymentInstructionsAr: 'الدفع متاح عبر InstaPay أو فودافون كاش — سيتم إرسال تفاصيل الدفع لحضرتك على واتساب',
    };
  }
}

export async function adminFetch(endpoint: string, options: RequestInit = {}) {
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
  }

  return await res.json();
}
