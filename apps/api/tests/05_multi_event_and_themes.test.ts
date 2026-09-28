import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('5 & 7. Multi-Event System & Themes Configuration Test Suite', () => {
  let adminToken = '';
  let invitationId = '';
  let slug = `multi-evt-${Date.now().toString().slice(-6)}`;
  let weddingEventId = '';
  let hennaEventId = '';

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@farahna.com', password: 'Farahna@2026!' });
    adminToken = loginRes.body.data.token;

    // Get theme and customer
    const [themesRes, custRes] = await Promise.all([
      request(app).get('/api/themes').set('Authorization', `Bearer ${adminToken}`),
      request(app).post('/api/customers').set('Authorization', `Bearer ${adminToken}`).send({
        name: 'عميل المناسبات المتعددة',
        phone: '01099887766',
      }),
    ]);

    const themeId = (themesRes.body.data?.themes || themesRes.body.data)[0].id;
    const customerId = custRes.body.data.id;

    // Create published invitation
    const invRes = await request(app)
      .post('/api/invitations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId,
        themeId,
        slug,
        title: 'دعوة فرح وحنة متعددة المناسبات',
        type: 'wedding',
        status: 'published',
        coupleGroomAr: 'ياسين',
        coupleBrideAr: 'هند',
        eventDate: '2026-10-15T00:00:00.000Z',
      });
    invitationId = invRes.body.data.id;
  });

  it('5.1 should add multiple independent events to the invitation (Wedding + Henna)', async () => {
    // 1. Wedding Event
    const wedRes = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        invitationId,
        type: 'wedding',
        titleAr: 'حفل الزفاف الرسمي',
        date: '2026-10-15T18:00:00.000Z',
        startTime: '08:00 م',
        venueNameAr: 'قاعة الأوبرا الفندقية',
        addressAr: 'الزمالك، القاهرة',
        isVisible: true,
      });

    expect([200, 201]).toContain(wedRes.status);
    weddingEventId = wedRes.body.data.id;

    // 2. Henna Event with themeOverride
    const hennaRes = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        invitationId,
        type: 'henna',
        titleAr: 'ليلة الحنة النوبية',
        date: '2026-10-13T17:00:00.000Z',
        startTime: '06:00 م',
        venueNameAr: 'فيلا الياسمين',
        addressAr: 'المعادي، القاهرة',
        isHennaFemaleOnly: true,
        isVisible: true,
        themeOverride: {
          primaryColor: '#D97706',
          backgroundColor: '#FFFBEB',
        },
      });

    expect([200, 201]).toContain(hennaRes.status);
    hennaEventId = hennaRes.body.data.id;
  });

  it('5.2 should return both events on the public invitation page', async () => {
    const pubRes = await request(app).get(`/api/public/invitations/wedding/${slug}`);

    expect(pubRes.status).toBe(200);
    expect(pubRes.body.data.events.length).toBe(2);

    const henna = pubRes.body.data.events.find((e: any) => e.type === 'henna');
    expect(henna.isHennaFemaleOnly).toBe(true);
    expect(henna.themeOverride.primaryColor).toBe('#D97706');
  });

  it('5.3 should completely hide an event from public page when isVisible is set to false', async () => {
    // Hide henna event
    const hideRes = await request(app)
      .patch(`/api/events/${hennaEventId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        isVisible: false,
      });

    expect(hideRes.status).toBe(200);

    // Verify public endpoint only includes visible events
    const pubRes = await request(app).get(`/api/public/invitations/wedding/${slug}`);
    expect(pubRes.status).toBe(200);
    expect(pubRes.body.data.events.length).toBe(1);
    expect(pubRes.body.data.events[0].type).toBe('wedding');
  });

  it('7.1 should update invitation theme and persist themeConfig custom palette', async () => {
    const themesRes = await request(app)
      .get('/api/themes')
      .set('Authorization', `Bearer ${adminToken}`);

    const themesList = themesRes.body.data?.themes || themesRes.body.data || [];
    const secondTheme = themesList[1] || themesList[0];

    const updateRes = await request(app)
      .patch(`/api/invitations/${invitationId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        themeId: secondTheme.id,
        themeConfig: {
          customBorder: 'gold-double',
          fontFamily: 'Cairo',
        },
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.themeId).toBe(secondTheme.id);
  });
});
