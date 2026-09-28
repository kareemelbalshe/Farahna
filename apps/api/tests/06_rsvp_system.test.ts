import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('8. RSVP Attendance & Capacity Test Suite', () => {
  let adminToken = '';
  let invitationId = '';
  let slug = `rsvp-test-${Date.now().toString().slice(-6)}`;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@farahna.com', password: 'Farahna@2026!' });
    adminToken = loginRes.body.data.token;

    const [themesRes, custRes] = await Promise.all([
      request(app).get('/api/themes').set('Authorization', `Bearer ${adminToken}`),
      request(app).post('/api/customers').set('Authorization', `Bearer ${adminToken}`).send({
        name: 'عميل اختبار RSVP',
        phone: '01011112222',
      }),
    ]);

    const themeId = (themesRes.body.data?.themes || themesRes.body.data)[0].id;
    const customerId = custRes.body.data.id;

    // Create invitation with rsvpEnabled: true
    const invRes = await request(app)
      .post('/api/invitations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId,
        themeId,
        slug,
        title: 'دعوة لاختبار تأكيد الحضور',
        type: 'wedding',
        status: 'published',
        rsvpEnabled: true,
        coupleGroomAr: 'حازم',
        coupleBrideAr: 'دنيا',
        eventDate: '2026-11-05T00:00:00.000Z',
      });
    invitationId = invRes.body.data.id;
  });

  it('8.1 should successfully submit attending RSVP response', async () => {
    const res = await request(app)
      .post(`/api/public/invitations/${invitationId}/rsvp`)
      .send({
        name: 'صديق العريس كابتن حسام',
        phone: '01001234567',
        attendanceStatus: 'attending',
        guestCount: 2,
        message: 'ألف مبروك يا حازم وربنا يتمملكم على خير يا رب ❤️',
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
    expect(res.body.data.attendanceStatus).toBe('attending');
    expect(res.body.data.guestCount).toBe(2);
  });

  it('8.2 should submit declined RSVP response (normalized guestCount to 0)', async () => {
    const res = await request(app)
      .post(`/api/public/invitations/${invitationId}/rsvp`)
      .send({
        name: 'د. سمير (معتذر للسفر)',
        attendanceStatus: 'not_attending',
        message: 'للأسف مسافر خارج مصر، مع أطيب التمنيات بدوام السعادة',
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
    expect(res.body.data.attendanceStatus).toBe('not_attending');
    expect(res.body.data.guestCount).toBe(0);
  });

  it('8.3 should update RSVP summary and return real breakdown counts', async () => {
    const summaryRes = await request(app).get(`/api/public/invitations/${invitationId}/rsvp`);

    expect(summaryRes.status).toBe(200);
    expect(summaryRes.body.success).toBe(true);
    expect(summaryRes.body.data.totalResponses).toBeGreaterThanOrEqual(2);
    expect(summaryRes.body.data.attendingCount).toBeGreaterThanOrEqual(1);
    expect(summaryRes.body.data.notAttendingCount).toBeGreaterThanOrEqual(1);
    expect(summaryRes.body.data.totalGuests).toBeGreaterThanOrEqual(2);
  });

  it('8.4 should reject RSVP submissions when rsvpEnabled is disabled on invitation (400 Bad Request)', async () => {
    // Disable RSVP
    await request(app)
      .patch(`/api/invitations/${invitationId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ rsvpEnabled: false });

    const attemptRes = await request(app)
      .post(`/api/public/invitations/${invitationId}/rsvp`)
      .send({
        name: 'ضيف متأخر',
        attendanceStatus: 'attending',
        guestCount: 1,
      });

    expect(attemptRes.status).toBe(400);
    expect(attemptRes.body.success).toBe(false);
    expect(attemptRes.body.message).toContain('غير مفعّل');
  });
});
