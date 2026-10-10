import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/error';
import { ENV } from './config/env';
import {
  helmetSecurityHeaders,
  customSecurityHeaders,
  xssSanitizer,
  sqlInjectionGuard,
  parameterPollutionGuard,
  generalApiLimiter,
  authLimiter,
  rsvpLimiter,
  leadLimiter,
  mediaUploadLimiter,
  analyticsLimiter,
} from './middleware/security';

const app = express();

// 1. Disable server fingerprinting
app.disable('x-powered-by');

// 2. HTTP Security Headers (Helmet + Custom Policies)
app.use(helmetSecurityHeaders);
app.use(customSecurityHeaders);

// 3. CORS Production Lockdown
const allowedOrigins = ENV.CORS_ORIGIN.split(',').map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      // In development or test, allow all origins
      if (ENV.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      // In production, strictly enforce allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS Error: Origin ${origin} not permitted.`));
    },
    credentials: true,
  })
);

// 4. Request Body Parsing with Strict Payload Limits (Anti-DoS)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// 5. HTTP Parameter Pollution Guard (HPP)
app.use(parameterPollutionGuard);

// 6. XSS Sanitizer & HTML Injection Defense
app.use(xssSanitizer);

// 7. SQL Injection & Query Tampering Guard
app.use(sqlInjectionGuard);

// 8. Access Logging
if (ENV.NODE_ENV !== 'test') {
  app.use(morgan(ENV.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// 9. Granular Rate Limiters
// General API Limiter across all /api routes
app.use('/api', generalApiLimiter);

// Strict Authentication Brute-Force Protection
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/change-password', authLimiter);

// Public Anti-Spam Limiters
app.use('/api/public/invitations/:id/rsvp', rsvpLimiter);
app.use('/api/leads', leadLimiter);
app.use('/api/media/upload', mediaUploadLimiter);
app.use('/api/public/analytics', analyticsLimiter);

// 10. Health & Security Status Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'farahna-api',
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    security: {
      helmet: 'active',
      xssProtection: 'active',
      sqliGuard: 'active',
      rateLimiting: 'active',
      hppProtection: 'active',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'farahna-api',
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
    security: {
      status: 'shield-active',
      mode: 'strict-production',
    },
  });
});

// 11. API Routes
app.use('/api', routes);

// 12. 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار المطلوب غير موجود',
  });
});

// 13. Production-hardened global error handler
app.use(errorHandler);

export default app;
