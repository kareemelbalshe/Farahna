import { Router } from 'express';
import { login, getMe, verifyTokenValidity } from '../controllers/auth.controller';
import { authenticateJWT, loginRateLimiter } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { loginSchema } from '@farahna/shared';

const router = Router();

// Login endpoint protected by strict brute-force rate limiter & Zod validation
router.post('/login', loginRateLimiter, validateBody(loginSchema), login);

// Authenticated session checks
router.get('/me', authenticateJWT, getMe);
router.get('/verify', authenticateJWT, verifyTokenValidity);

export default router;
