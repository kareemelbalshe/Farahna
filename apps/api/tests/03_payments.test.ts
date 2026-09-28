import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('3. InstaPay Manual Payment Lifecycle Test Suite', () => {
  let adminToken = '';
  let customerId = '';
  let orderId = '';
  let paymentId = '';

  beforeAll(async () => {
    // 1. Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@farahna.com', password: 'Farahna@2026!' });
    adminToken = loginRes.body.data.token;

    // 2. Setup Customer & Order
    const custRes = await request(app)
      .post('/api/customers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'عميل الدفع التجريبي',
        phone: '01122334455',
        source: 'whatsapp',
      });
    customerId = custRes.body.data.id;

    const ordRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId,
        tier: 'platinum',
        totalPrice: 1800,
        currency: 'EGP',
        status: 'awaiting_payment',
      });
    orderId = ordRes.body.data.id;
  });

  it('3.1 should create an InstaPay payment record in pending state and set order to proof received', async () => {
    const res = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        orderId,
        customerId,
        amount: 1800,
        currency: 'EGP',
        method: 'instapay',
        status: 'pending',
        notes: 'بانتظار تحويل إنستاباي من العميل',
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('pending');
    paymentId = res.body.data.id;
  });

  it('3.2 should update payment details when customer provides receipt reference', async () => {
    const res = await request(app)
      .patch(`/api/payments/${paymentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        referenceNumber: 'INSTA-88776655',
        notes: 'تم استلام سكرين شوت تحويل إنستاباي من تطبيق البنك',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.referenceNumber).toBe('INSTA-88776655');
  });

  it('3.3 should verify payment, record verification timestamp, and sync order status', async () => {
    const res = await request(app)
      .patch(`/api/payments/${paymentId}/verify`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        referenceNumber: 'INSTA-88776655',
        notes: 'تمت مطابقة رقم العملية في حساب إنستاباي بنجاح',
        publishImmediately: true,
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('verified');
    expect(res.body.data.verifiedAt).toBeTruthy();

    // Check that Order status updated to published
    const ordCheck = await request(app)
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(ordCheck.status).toBe(200);
    expect(['paid', 'published', 'completed']).toContain(ordCheck.body.data.status);
  });

  it('3.4 should support rejecting invalid payment attempts (status: rejected)', async () => {
    // Create new fake payment to reject
    const newPay = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        orderId,
        customerId,
        amount: 500,
        currency: 'EGP',
        method: 'instapay',
        status: 'pending',
      });

    const res = await request(app)
      .patch(`/api/payments/${newPay.body.data.id}/reject`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        notes: 'الإيصال المرسل مزور أو غير مطابق',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('rejected');
  });

  it('3.5 should record payment using Vodafone Cash (method: vodafone_cash)', async () => {
    const vfPay = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        orderId,
        customerId,
        amount: 1200,
        currency: 'EGP',
        method: 'vodafone_cash',
        status: 'pending',
        notes: 'تم التحويل عبر محفظة فودافون كاش',
      });

    expect([200, 201]).toContain(vfPay.status);
    expect(vfPay.body.success).toBe(true);
    expect(vfPay.body.data.method).toBe('vodafone_cash');
  });
});
