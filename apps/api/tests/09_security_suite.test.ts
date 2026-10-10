import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { storageService } from '../src/services/storage';

describe('9. Comprehensive Security Suite & Vulnerability Protection', () => {
  // --------------------------------------------------------------------------
  // 9.1 Helmet & Security Headers
  // --------------------------------------------------------------------------
  it('9.1 should include strict security headers and hide server fingerprint', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    // X-Powered-By should be completely stripped
    expect(res.headers['x-powered-by']).toBeUndefined();
    // Helmet headers
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(res.headers['x-download-options']).toBe('noopen');
    expect(res.headers['x-permitted-cross-domain-policies']).toBe('none');
    expect(res.headers['permissions-policy']).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // 9.2 Rate Limiting Headers
  // --------------------------------------------------------------------------
  it('9.2 should return standard rate-limiting headers on API endpoints', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.headers['ratelimit-limit']).toBeDefined();
    expect(res.headers['ratelimit-remaining']).toBeDefined();
  });

  // --------------------------------------------------------------------------
  // 9.3 XSS Protection & HTML Injection Defense
  // --------------------------------------------------------------------------
  it('9.3 should strip dangerous executable HTML and scripts from input bodies', async () => {
    // Send a lead submission with injected XSS script
    const res = await request(app)
      .post('/api/leads/public')
      .send({
        name: 'أحمد محمود <script>alert("XSS Attack")</script>',
        phone: '01019262075',
        notes: '<img src=x onerror=alert(1)>ملاحظة حفل الزفاف <iframe src="evil.com"></iframe>',
        source: 'website',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    // Verified: script tag was completely eliminated
    expect(res.body.data.name).not.toContain('<script>');
    expect(res.body.data.name).not.toContain('alert("XSS Attack")');
    expect(res.body.data.name).toContain('أحمد محمود');

    // Verified: iframe and onerror were stripped from notes
    expect(res.body.data.notes).not.toContain('onerror');
    expect(res.body.data.notes).not.toContain('<iframe>');
    expect(res.body.data.notes).toContain('ملاحظة حفل الزفاف');
  });

  it('9.3b should neutralize javascript: pseudoprotocol in URL inputs', async () => {
    const res = await request(app)
      .post('/api/leads/public')
      .send({
        name: 'سارة إبراهيم',
        phone: '01019262076',
        notes: 'رابط المشاهدة: javascript:alert(document.cookie)',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.notes).not.toContain('javascript:');
    expect(res.body.data.notes).toContain('blocked:');
  });

  // --------------------------------------------------------------------------
  // 9.4 SQL Injection Guard
  // --------------------------------------------------------------------------
  it('9.4 should detect and immediately block SQL Injection attempts in query parameters', async () => {
    const res = await request(app).get(
      "/api/public/invitations/wedding/test?search=1' UNION SELECT username, password FROM users--"
    );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Suspicious Request Blocked');
  });

  it('9.4b should block classic 1=1 tautology injection payloads in search queries', async () => {
    const res = await request(app).get(
      "/api/public/invitations/wedding/test?search=admin' OR '1'='1"
    );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // --------------------------------------------------------------------------
  // 9.5 Path Traversal Protection
  // --------------------------------------------------------------------------
  it('9.5 should block Path Traversal attempts trying to escape the storage root', async () => {
    expect(() => {
      storageService.getAbsoluteFilePath('../../etc/passwd');
    }).toThrow('Path Traversal Detected');

    expect(() => {
      storageService.getAbsoluteFilePath('..\\..\\windows\\system32\\cmd.exe');
    }).toThrow('Path Traversal Detected');

    expect(() => {
      storageService.getAbsoluteFilePath('%2e%2e%2f%2e%2e%2fetc%2fpasswd');
    }).toThrow('Path Traversal Detected');
  });

  // --------------------------------------------------------------------------
  // 9.6 HTTP Parameter Pollution (HPP)
  // --------------------------------------------------------------------------
  it('9.6 should safely handle parameter pollution without server crash', async () => {
    const res = await request(app).get('/api/invitations?type=wedding&type=henna');

    // Should not crash or throw unhandled exceptions
    expect([200, 401]).toContain(res.status);
  });

  // --------------------------------------------------------------------------
  // 9.7 Malformed JSON Payload Protection
  // --------------------------------------------------------------------------
  it('9.7 should reject malformed JSON body payloads with safe 400 Bad Request', async () => {
    const res = await request(app)
      .post('/api/leads')
      .set('Content-Type', 'application/json')
      .send('{"name": "broken json payload,');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Malformed JSON Payload');
  });
});
