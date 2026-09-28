import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('2. Customer, Lead & Order Pipeline Test Suite', () => {
  let adminToken = '';
  let createdLeadId = '';
  let createdCustomerId = '';
  let createdOrderId = '';

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@farahna.com', password: 'Farahna@2026!' });
    adminToken = res.body.data.token;
  });

  it('2.1 should create a new Lead in the sales pipeline', async () => {
    const res = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'أحمد كمال (عميل تجريبي)',
        phone: '01011223344',
        whatsapp: '01011223344',
        eventDate: '2026-11-20T00:00:00.000Z',
        eventType: 'wedding',
        source: 'whatsapp',
        notes: 'استفسار عبر واتساب عن باقة الملكية',
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    createdLeadId = res.body.data.id;
  });

  it('2.2 should update Lead status across pipeline (contacted -> waiting_details)', async () => {
    const res = await request(app)
      .patch(`/api/leads/${createdLeadId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'contacted',
        notes: 'تم التواصل مع العريس وتم الاتفاق على تفاصيل الفرح',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('contacted');
  });

  it('2.3 should create a Customer record from converted lead', async () => {
    const res = await request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'أحمد كمال',
        phone: '01011223344',
        whatsapp: '01011223344',
        email: 'ahmed.kamal@example.com',
        source: 'whatsapp',
        notes: 'تم تحويل العميل من استفسار (Lead)',
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
    createdCustomerId = res.body.data.id;
  });

  it('2.4 should create an Order linked to the Customer', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: createdCustomerId,
        tier: 'gold',
        totalPrice: 1200,
        currency: 'EGP',
        status: 'designing',
        notes: 'طلب باقة جولد لدعوة زفاف وكتب كتاب',
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
    expect(res.body.data.customerId).toBe(createdCustomerId);
    createdOrderId = res.body.data.id;
  });

  it('2.5 should retrieve Order details including linked Customer data', async () => {
    const res = await request(app)
      .get(`/api/orders/${createdOrderId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.customer.name).toBe('أحمد كمال');
  });
});
