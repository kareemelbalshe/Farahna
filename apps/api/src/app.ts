import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler } from './middleware/error';
import { ENV } from './config/env';

const app = express();

// 1. Security Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: false, // allow rich media, maps & iframe previews
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow client to fetch images/media
    hsts: ENV.NODE_ENV === 'production' ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
  })
);

// 2. CORS Production Lockdown
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

// 3. Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Logging
if (ENV.NODE_ENV !== 'test') {
  app.use(morgan(ENV.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// 5. Rate Limiters
// General API Limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً',
  },
});
app.use('/api', generalLimiter);

// Auth Login Limiter (Brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: ENV.NODE_ENV === 'test' ? 100 : 10, // 10 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تم حظر محاولات الدخول مؤقتاً بسبب تكرار المحاولات الخاطئة، يرجى الانتظار 15 دقيقة',
  },
});
app.use('/api/auth/login', authLimiter);

// Public RSVP Limiter (Anti-Spam)
const rsvpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: ENV.NODE_ENV === 'test' ? 100 : 20, // 20 RSVPs per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'لقد قمت بإرسال عدد كبير من تأكيدات الحضور، يرجى الانتظار قليلاً',
  },
});
app.use('/api/public/invitations/:id/rsvp', rsvpLimiter);

// Public Analytics Limiter
const analyticsLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: ENV.NODE_ENV === 'test' ? 200 : 150, // 150 events per 10 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تم تجاوز معدل تتبع التحليلات المسموح به',
  },
});
app.use('/api/public/analytics', analyticsLimiter);

// 6. Health check endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'farahna-api',
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'farahna-api',
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// 7. API Routes
app.use('/api', routes);

// 8. 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار المطلوب غير موجود',
  });
});

// 9. Global error handler
app.use(errorHandler);

export default app;
