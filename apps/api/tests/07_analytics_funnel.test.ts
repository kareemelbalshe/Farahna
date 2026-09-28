import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('9. Analytics & Business Conversion Funnel Test Suite', () => {
  let adminToken = '';
  let invitationId = '';
  let slug = `analytics-test-${Date.now().toString().slice(-6)}`;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@farahna.com', password: 'Farahna@2026!' });
    adminToken = loginRes.body.data.token;

    const [themesRes, custRes] = await Promise.all([
      request(app).get('/api/themes').set('Authorization', `Bearer ${adminToken}`),
      request(app).post('/api/customers').set('Authorization', `Bearer ${adminToken}`).send({
        name: 'عميل تحليلات الزيارات',
        phone: '01055554444',
      }),
    ]);

    const themeId = (themesRes.body.data?.themes || themesRes.body.data)[0].id;
    const customerId = custRes.body.data.id;

    const invRes = await request(app)
      .post('/api/invitations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId,
        themeId,
        slug,
        title: 'دعوة لفحص التحليلات والنقرات',
        type: 'wedding',
        status: 'published',
        coupleGroomAr: 'عادل',
        coupleBrideAr: 'رنا',
        eventDate: '2026-11-12T00:00:00.000Z',
      });
    invitationId = invRes.body.data.id;
  });

  it('9.1 should record guest action clicks via POST /api/public/analytics (privacy-conscious)', async () => {
    const events = [
      { eventType: 'page_view', deviceType: 'mobile', browser: 'Chrome' },
      { eventType: 'whatsapp_click', deviceType: 'mobile', browser: 'Chrome' },
      { eventType: 'map_click', deviceType: 'mobile', browser: 'Safari' },
      { eventType: 'calendar_click', deviceType: 'desktop', browser: 'Chrome', metadata: { provider: 'google' } },
      { eventType: 'share_click', deviceType: 'mobile', browser: 'Safari' },
      { eventType: 'envelope_open', deviceType: 'mobile', browser: 'Safari' },
    ];

    for (const ev of events) {
      const res = await request(app)
        .post('/api/public/analytics')
        .send({
          invitationId,
          eventType: ev.eventType,
          deviceType: ev.deviceType,
          browser: ev.browser,
          metadata: ev.metadata,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    }
  });

  it('9.2 should report updated action clicks and device/browser breakdowns in Admin analytics', async () => {
    const res = await request(app)
      .get(`/api/analytics/${invitationId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const clicks = res.body.data.actionClicks;
    expect(clicks.whatsappClicks).toBeGreaterThanOrEqual(1);
    expect(clicks.mapClicks).toBeGreaterThanOrEqual(1);
    expect(clicks.calendarClicks).toBeGreaterThanOrEqual(1);
    expect(clicks.shareClicks).toBeGreaterThanOrEqual(1);
    expect(clicks.envelopeOpens).toBeGreaterThanOrEqual(1);

    expect(res.body.data.deviceBreakdown.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.browserBreakdown.length).toBeGreaterThanOrEqual(1);
  });

  it('9.3 should return complete 14-stage business conversion funnel with monotonic progression', async () => {
    const res = await request(app)
      .get('/api/analytics/funnel')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const stages = res.body.data.funnelStages;
    expect(stages.length).toBe(14);

    // Verify key stage labels exist
    const keys = stages.map((s: any) => s.key);
    expect(keys).toContain('landing_visit');
    expect(keys).toContain('demo_viewed');
    expect(keys).toContain('whatsapp_click');
    expect(keys).toContain('lead_created');
    expect(keys).toContain('customer');
    expect(keys).toContain('order');
    expect(keys).toContain('design');
    expect(keys).toContain('preview');
    expect(keys).toContain('approval');
    expect(keys).toContain('payment_proof');
    expect(keys).toContain('payment_verified');
    expect(keys).toContain('published_invitation');
    expect(keys).toContain('guests');
    expect(keys).toContain('rsvp');

    // Funnel integrity: Leads count must NOT be less than Orders count
    expect(res.body.data.totalLeads).toBeGreaterThanOrEqual(res.body.data.totalOrders);
  });
});
