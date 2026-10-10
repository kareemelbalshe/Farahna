import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('1. Authentication & RBAC Test Suite', () => {
  let superAdminToken = '';
  let adminToken = '';
  let editorToken = '';

  it('1.1 should successfully login as Super Admin and return JWT with role super_admin', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@farahna.com', password: 'Farahna@2026!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.role).toBe('super_admin');
    superAdminToken = res.body.data.token;
  });

  it('1.2 should successfully login as Admin (Moderator)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'moderator@farahna.com', password: 'Moderator@2026!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('admin');
    adminToken = res.body.data.token;
  });

  it('1.3 should successfully login as Editor', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'editor@farahna.com', password: 'Editor@2026!' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('editor');
    editorToken = res.body.data.token;
  });

  it('1.4 should reject login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@farahna.com', password: 'WrongPassword123' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('1.5 should reject login for non-existent user email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'doesnotexist@farahna.com', password: 'AnyPassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('1.6 should reject unauthenticated requests to protected endpoints (401)', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('1.7 should allow Super Admin to access settings (200)', async () => {
    const res = await request(app)
      .get('/api/settings')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect([200, 304]).toContain(res.status);
    expect(res.body.success).toBe(true);
  });

  it('1.8 should prevent Editor from updating system settings (403 Forbidden)', async () => {
    const res = await request(app)
      .patch('/api/settings')
      .set('Authorization', `Bearer ${editorToken}`)
      .send({ platformName: 'Forbidden Edit' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('صلاحية');
  });

  it('1.9 should prevent Editor from viewing or accessing payments (403 Forbidden)', async () => {
    const res = await request(app)
      .get('/api/payments')
      .set('Authorization', `Bearer ${editorToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('صلاحية');
  });

  it('1.10 should reject password change with incorrect current password (400 Bad Request)', async () => {
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        currentPassword: 'WrongPassword123!',
        newPassword: 'BrandNewSecure@2026!',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('غير صحيحة');
  });

  it('1.11 should reject password change with too short new password (400 Bad Request)', async () => {
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        currentPassword: 'Moderator@2026!',
        newPassword: 'short',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('1.12 should successfully change password and verify login with new password', async () => {
    // 1. Change password
    const res = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        currentPassword: 'Moderator@2026!',
        newPassword: 'NewModSecure@2026!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // 2. Login with new password
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'moderator@farahna.com', password: 'NewModSecure@2026!' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);

    // 3. Reset back for future test consistency
    const resetRes = await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${loginRes.body.data.token}`)
      .send({
        currentPassword: 'NewModSecure@2026!',
        newPassword: 'Moderator@2026!',
      });
    expect(resetRes.status).toBe(200);
  });
});
