import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import { ENV } from '../config/env';

/**
 * 🛡️ Farahna Production Security Suite
 * Comprehensive defenses against Top OWASP Vulnerabilities:
 * - XSS (Cross-Site Scripting) & HTML Injection
 * - SQL Injection & Query Tampering
 * - DoS & Brute-Force Attacks (Granular Rate Limiting)
 * - Clickjacking, MIME-Sniffing & Unsafe Headers (Helmet Hardening)
 * - HTTP Parameter Pollution (HPP)
 * - Prototype Pollution & Poison Null Bytes
 */

// ============================================================================
// 1. XSS & HTML Injection Sanitization
// ============================================================================

/**
 * Deeply sanitizes a string from executable scripts, malicious HTML tags,
 * event handlers, and dangerous pseudoprotocol schemes.
 */
export function sanitizeString(val: string): string {
  if (typeof val !== 'string') return val;

  let cleaned = val;

  // 1. Remove poison null bytes
  cleaned = cleaned.replace(/\0/g, '');

  // 2. Strip executable/dangerous HTML tags with their contents
  cleaned = cleaned.replace(
    /<\s*(script|style|iframe|object|embed|applet|meta|link|base|form)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,
    ''
  );
  cleaned = cleaned.replace(
    /<\s*(script|style|iframe|object|embed|applet|meta|link|base|form)[^>]*\/?>/gi,
    ''
  );

  // 3. Strip inline event handlers (onerror=, onload=, onclick=, etc.)
  cleaned = cleaned.replace(/\bon[a-zA-Z]+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, '');

  // 4. Block javascript:, vbscript:, and data:text/html URI schemes
  cleaned = cleaned.replace(/(javascript|vbscript|data\s*:\s*text\/html)\s*:/gi, 'blocked:');

  // 5. Clean standalone tags containing suspicious script handlers
  cleaned = cleaned.replace(/<[^>]+(onload|onerror|onclick|onmouseover|onfocus|onblur)[^>]*>/gi, '');

  return cleaned;
}

/**
 * Recursively sanitizes objects and arrays while defending against Prototype Pollution
 */
export function sanitizeObject<T>(input: T): T {
  if (input === null || input === undefined) return input;
  if (typeof input === 'string') return sanitizeString(input) as unknown as T;

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (typeof input === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      // Prototype Pollution Guard
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }

  return input;
}

/**
 * Express middleware for automatic input sanitization across body, query, and params
 */
export function xssSanitizer(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }
  next();
}

// ============================================================================
// 2. SQL Injection & Malicious Pattern Guard
// ============================================================================

const SQLI_PATTERNS = [
  /(\b(union(\s+all)?)\s+select\b)/i,
  /(\bselect\b.+\bfrom\b.+(\bwhere\b|\binformation_schema\b|\bpg_catalog\b))/i,
  /(\b(drop|truncate|alter)\s+(table|database|schema)\b)/i,
  /(\bexec(ute)?\s*\(|\bxp_cmdshell\b)/i,
  /(\b(waitfor\s+delay|pg_sleep\s*\(\s*\d+\s*\)|benchmark\s*\(\s*\d+))/i,
  /(\b(or|and)\s+['"]?[a-z0-9_]+['"]?\s*=\s*['"]?[a-z0-9_]+['"]?)/i,
  /(';\s*(shutdown|drop|delete|update|insert)\b)/i,
  /(\b(or|and)\s+true\s*=\s*true\b)/i,
  /(\b(or|and)\s+1\s*=\s*1\b)/i,
  /('--|;\s*--|\/\*|\*\/)/,
];

function containsSqlInjection(value: any): boolean {
  if (!value) return false;
  if (typeof value === 'string') {
    return SQLI_PATTERNS.some((pattern) => pattern.test(value));
  }
  if (Array.isArray(value)) {
    return value.some(containsSqlInjection);
  }
  if (typeof value === 'object') {
    return Object.values(value).some(containsSqlInjection);
  }
  return false;
}

/**
 * Detects and blocks SQL injection payloads in queries, parameters, and payloads
 */
export function sqlInjectionGuard(req: Request, res: Response, next: NextFunction) {
  const isAttackInQuery = containsSqlInjection(req.query);
  const isAttackInParams = containsSqlInjection(req.params);

  // For body, inspect strings (excluding raw passwords which may contain special chars)
  let isAttackInBody = false;
  if (req.body && typeof req.body === 'object') {
    const { password: _, oldPassword: __, newPassword: ___, ...restBody } = req.body;
    isAttackInBody = containsSqlInjection(restBody);
  }

  if (isAttackInQuery || isAttackInParams || isAttackInBody) {
    console.warn(`[Security Alert]: SQL Injection Attempt Blocked! IP: ${req.ip}, Path: ${req.originalUrl}`);
    return res.status(400).json({
      success: false,
      message: 'طلب غير صالح ومرفوض لأسباب أمنية (Suspicious Request Blocked)',
    });
  }

  next();
}

// ============================================================================
// 3. HTTP Parameter Pollution (HPP)
// ============================================================================

export const parameterPollutionGuard = hpp({
  whitelist: ['tags', 'status', 'type', 'category', 'sort', 'order'],
});

// ============================================================================
// 4. Granular Rate Limiters (Anti-DoS & Anti-Brute-Force)
// ============================================================================

const isTestEnv = ENV.NODE_ENV === 'test';

/**
 * General API Limiter: Prevents general scraping & DoS
 */
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTestEnv ? 1000 : 300, // 300 requests per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تم تجاوز الحد الأقصى للطلبات المسموح بها، يرجى المحاولة بعد قليل (429 Too Many Requests)',
  },
});

/**
 * Authentication Limiter: Strict brute-force protection for login & credentials
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTestEnv ? 100 : 5, // 5 attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تم حظر محاولات الدخول مؤقتاً بسبب تكرار المحاولات الخاطئة لحماية الحساب. يرجى الانتظار 15 دقيقة.',
  },
});

/**
 * Public RSVP Limiter: Prevents bot spamming on guest confirmations
 */
export const rsvpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isTestEnv ? 200 : 15, // 15 RSVPs per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تم تجاوز الحد المسموح لإرسال تأكيدات الحضور من هذا الجهاز، يرجى الانتظار قليلاً.',
  },
});

/**
 * Public Leads Limiter: Prevents bot inquiries and contact form abuse
 */
export const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isTestEnv ? 100 : 10, // 10 leads per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'لقد قمت بإرسال عدة طلبات مؤخراً، سيقوم فريق خدمة عملاء فرحنا بالتواصل معك قريباً.',
  },
});

/**
 * Media Upload Limiter: Prevents disk storage exhaustion
 */
export const mediaUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTestEnv ? 200 : 30, // 30 uploads per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تم تجاوز حد رفع الملفات المسموح به في هذه الفترة، يرجى الانتظار قليلاً.',
  },
});

/**
 * Analytics Limiter: Prevents tracking event flooding
 */
export const analyticsLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: isTestEnv ? 300 : 120, // 120 events per 10 mins per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تم تجاوز معدل تسجيل التحليلات المسموح به.',
  },
});

// ============================================================================
// 5. Helmet & Advanced HTTP Security Headers
// ============================================================================

export const helmetSecurityHeaders = helmet({
  contentSecurityPolicy: false, // Allows rich interactive map tiles (Leaflet), Google Fonts, and mobile iframe previews
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows client apps to render uploaded images & audio
  crossOriginEmbedderPolicy: false,
  xContentTypeOptions: true, // Prevents MIME-sniffing
  xFrameOptions: { action: 'sameorigin' }, // Clickjacking protection (allows internal iframe previews)
  xXssProtection: true, // Legacy browser XSS filter
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  dnsPrefetchControl: { allow: false },
  hsts:
    ENV.NODE_ENV === 'production'
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false,
});

/**
 * Custom response headers: permissions policy, cross domain lockdown, fingerprint removal
 */
export function customSecurityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.removeHeader('X-Powered-By');
  next();
}
