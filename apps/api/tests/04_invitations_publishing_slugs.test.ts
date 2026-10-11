import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('4. Invitation Creation, Publishing & Slug Uniqueness Test Suite', () => {
  let adminToken = '';
  let customerId = '';
  let themeId = '';
  let testSlug = `test-wedding-${Date.now().toString().slice(-6)}`;
  let invitationId = '';
  let previewToken = '';

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@farahna.com', password: 'Farahna@2026!' });
    adminToken = loginRes.body.data.token;

    // Get theme
    const themesRes = await request(app)
      .get('/api/themes')
      .set('Authorization', `Bearer ${adminToken}`);
    themeId = (themesRes.body.data?.themes || themesRes.body.data)[0].id;

    // Get or create customer
    const custRes = await request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'عميل اختبار الدعوات',
        phone: '01234567890',
        source: 'website',
      });
    customerId = custRes.body.data.id;
  });

  it('4.1 should create a new draft invitation', async () => {
    const res = await request(app)
      .post('/api/invitations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId,
        themeId,
        slug: testSlug,
        title: 'دعوة فرح تجريبية للنشر',
        type: 'wedding',
        status: 'draft',
        privacy: 'unlisted',
        coupleGroomAr: 'طارق',
        coupleBrideAr: 'مريم',
        eventDate: '2026-12-25T00:00:00.000Z',
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('draft');
    invitationId = res.body.data.id;
    previewToken = res.body.data.previewToken;
  });

  it('4.2 should prevent public guest access to draft invitation (403 Forbidden)', async () => {
    const res = await request(app).get(`/api/public/invitations/wedding/${testSlug}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe('draft');
  });

  it('4.3 should allow viewing draft invitation via secure Preview Token (/api/public/preview/:token)', async () => {
    const res = await request(app).get(`/api/public/preview/${previewToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe(testSlug);
    expect(res.body.data.coupleGroomAr).toBe('طارق');
  });

  it('4.4 should publish the invitation and make it publicly accessible', async () => {
    const patchRes = await request(app)
      .patch(`/api/invitations/${invitationId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'published',
      });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data.status).toBe('published');

    // Check public access now succeeds with 200
    const pubRes = await request(app).get(`/api/public/invitations/wedding/${testSlug}`);
    expect(pubRes.status).toBe(200);
    expect(pubRes.body.success).toBe(true);
    expect(pubRes.body.data.slug).toBe(testSlug);
  });

  it('4.5 should enforce slug uniqueness across all invitations (409 Conflict)', async () => {
    const duplicateRes = await request(app)
      .post('/api/invitations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId,
        themeId,
        slug: testSlug, // Same slug already in use!
        title: 'دعوة مكررة بنفس السلج',
        type: 'wedding',
        coupleGroomAr: 'مروان',
        coupleBrideAr: 'يارا',
        eventDate: '2026-12-30T00:00:00.000Z',
      });

    expect([409, 400]).toContain(duplicateRes.status);
    expect(duplicateRes.body.success).toBe(false);
  });

  it('4.6 should create invitation in Quick Mode without customerId (auto-assigned customer)', async () => {
    const res = await request(app)
      .post('/api/invitations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        // customerId omitted!
        themeId,
        slug: `quick-mode-${Date.now().toString().slice(-6)}`,
        title: 'دعوة سريعة بدون عميل مسبق',
        type: 'wedding',
        coupleGroomAr: 'إبراهيم',
        coupleBrideAr: 'نوران',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.customerId).toBeDefined();
  });

  it('4.7 should create invitation with customerId as empty string or "quick_draft"', async () => {
    const res = await request(app)
      .post('/api/invitations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: '',
        themeId,
        slug: `quick-draft-${Date.now().toString().slice(-6)}`,
        title: 'دعوة وضع المسودة السريعة',
        type: 'engagement',
        coupleGroomAr: 'كريم',
        coupleBrideAr: 'سلمى',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.customerId).toBeDefined();
  });

  it('4.8 should create invitation with inline customer details (auto-creating customer)', async () => {
    const inlinePhone = `011${Date.now().toString().slice(-8)}`;
    const res = await request(app)
      .post('/api/invitations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        newCustomerName: 'سامي عبد العزيز',
        newCustomerPhone: inlinePhone,
        themeId,
        slug: `inline-cust-${Date.now().toString().slice(-6)}`,
        type: 'henna',
        coupleGroomAr: 'سامي',
        coupleBrideAr: 'دعاء',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    // Verify customer was created
    const custCheck = await request(app)
      .get(`/api/customers?search=${inlinePhone}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(custCheck.body.data.customers.length).toBeGreaterThan(0);
    expect(res.body.data.customerId).toBe(custCheck.body.data.customers[0].id);
  });

  it('4.9 should handle non-existent customerId safely without database foreign key crash', async () => {
    const res = await request(app)
      .post('/api/invitations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: '00000000-0000-0000-0000-000000000000', // Non-existent UUID
        themeId,
        slug: `safe-fallback-${Date.now().toString().slice(-6)}`,
        coupleGroomAr: 'عمر',
        coupleBrideAr: 'ندى',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.customerId).toBeDefined();
  });

  it('4.10 should auto-generate clean unique slug and title when omitted', async () => {
    const res = await request(app)
      .post('/api/invitations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        coupleGroomAr: 'أحمد',
        coupleBrideAr: 'منى',
        // slug and title omitted!
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBeDefined();
    expect(res.body.data.slug.length).toBeGreaterThanOrEqual(3);
    expect(res.body.data.title).toContain('دعوة');
  });

  it('4.11 should handle missing or invalid themeId gracefully by falling back to default theme', async () => {
    const res = await request(app)
      .post('/api/invitations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        themeId: 'non-existent-theme-xyz',
        slug: `default-theme-${Date.now().toString().slice(-6)}`,
        coupleGroomAr: 'حسام',
        coupleBrideAr: 'رنا',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.themeId).toBeDefined();
  });

  it('4.12 should support all invitation types (wedding, engagement, henna, katb_ketab, custom)', async () => {
    const types = ['wedding', 'engagement', 'henna', 'katb_ketab', 'custom'] as const;

    for (const t of types) {
      const res = await request(app)
        .post('/api/invitations')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          type: t,
          slug: `type-${t.replace(/_/g, '-')}-${Date.now().toString().slice(-6)}`,
          coupleGroomAr: `عريس ${t}`,
          coupleBrideAr: `عروس ${t}`,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.type).toBe(t);
    }
  });
});
