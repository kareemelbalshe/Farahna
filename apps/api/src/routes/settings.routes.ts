import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

// Public can fetch site settings (phone, whatsapp number, branding)
router.get('/', getSettings);

// Super admin can update settings
router.use(authenticateJWT);
router.patch('/', requireRole(['super_admin']), updateSettings);

export default router;
