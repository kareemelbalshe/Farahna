import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('10 & 11. Public Access, Privacy Levels & Lifecycle States Test Suite', () => {
  let adminToken = '';
  let customerId = '';
  let themeId = '';

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@farahna.com', password: 'Farahna@2026!' });
    adminToken = loginRes.body.data.token;

    const [themesRes, custRes] = await Promise.all([
      request(app).get('/api/themes').set('Authorization', `Bearer ${adminToken}`),
      request(app).post('/api/customers').set('Authorization', `Bearer ${adminToken}`).send({
        name: 'عميل اختبار الخصوصية والحالات',
        phone: '01077778888',
      }),
    ]);

    themeId = (themesRes.body.data?.themes || themesRes.body.data)[0].id;
    customerId = custRes.body.data.id;
  });

  it('10.1 should include public published invitations in /sitemap-invitations, and exclude unlisted/private ones', async () => {
    const publicSlug = `pub-sitemap-${Date.now().toString().slice(-5)}`;
    const unlistedSlug = `unlisted-sitemap-${Date.now().toString().slice(-5)}`;

    // Create 1 public and 1 unlisted invitation
    await Promise.all([
      request(app)
        .post('/api/invitations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          customerId,
          themeId,
          slug: publicSlug,
          title: 'دعوة عامة مفهرسة',
          type: 'wedding',
          status: 'published',
          privacy: 'public',
          coupleGroomAr: 'باسل',
          coupleBrideAr: 'سلمى',
          eventDate: '2026-10-30T00:00:00.000Z',
        }),
      request(app)
        .post('/api/invitations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          customerId,
          themeId,
          slug: unlistedSlug,
          title: 'دعوة خاصة غير مفهرسة',
          type: 'wedding',
          status: 'published',
          privacy: 'unlisted',
          coupleGroomAr: 'ماجد',
          coupleBrideAr: 'نورا',
          eventDate: '2026-10-30T00:00:00.000Z',
        }),
    ]);

    const sitemapRes = await request(app).get('/api/public/sitemap-invitations');
    expect(sitemapRes.status).toBe(200);
    expect(sitemapRes.body.success).toBe(true);

    const sitemapSlugs = sitemapRes.body.data.map((i: any) => i.slug);
    expect(sitemapSlugs).toContain(publicSlug);
    expect(sitemapSlugs).not.toContain(unlistedSlug);
  });

  it('11.1 should return 403 with status: "paused" when invitation is paused by couple', async () => {
    const pausedSlug = `paused-test-${Date.now().toString().slice(-5)}`;

    await request(app)
      .post('/api/invitations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId,
        themeId,
        slug: pausedSlug,
        title: 'دعوة متوقفة مؤقتاً',
        type: 'wedding',
        status: 'paused',
        coupleGroomAr: 'رامي',
        coupleBrideAr: 'شيرين',
        eventDate: '2026-10-10T00:00:00.000Z',
      });

    const res = await request(app).get(`/api/public/invitations/wedding/${pausedSlug}`);
    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe('paused');
    expect(res.body.message).toContain('مؤقتاً');
  });

  it('11.2 should return 410 with status: "expired" when invitation has expired after event date', async () => {
    const expiredSlug = `expired-test-${Date.now().toString().slice(-5)}`;

    await request(app)
      .post('/api/invitations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId,
        themeId,
        slug: expiredSlug,
        title: 'دعوة منتهية الصلاحية',
        type: 'wedding',
        status: 'expired',
        coupleGroomAr: 'وليد',
        coupleBrideAr: 'داليا',
        eventDate: '2025-01-01T00:00:00.000Z',
      });

    const res = await request(app).get(`/api/public/invitations/wedding/${expiredSlug}`);
    expect(res.status).toBe(410);
    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe('expired');
  });

  it('11.3 should return 404 when invitation is soft-deleted', async () => {
    const deletedSlug = `del-test-${Date.now().toString().slice(-5)}`;

    const createRes = await request(app)
      .post('/api/invitations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId,
        themeId,
        slug: deletedSlug,
        title: 'دعوة للحذف',
        type: 'wedding',
        status: 'published',
        coupleGroomAr: 'هيثم',
        coupleBrideAr: 'مها',
        eventDate: '2026-10-10T00:00:00.000Z',
      });

    // Soft delete via admin
    await request(app)
      .delete(`/api/invitations/${createRes.body.data.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    // Verify public endpoint returns 404
    const pubRes = await request(app).get(`/api/public/invitations/wedding/${deletedSlug}`);
    expect(pubRes.status).toBe(404);
  });
});
