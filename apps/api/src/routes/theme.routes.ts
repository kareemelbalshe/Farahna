import { Router } from 'express';
import { getThemes, getThemeById, updateTheme } from '../controllers/theme.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

// Public can view active themes for demo showcase
router.get('/', getThemes);
router.get('/:id', getThemeById);

// Admin can update themes
router.use(authenticateJWT);
router.patch('/:id', requireRole(['super_admin', 'admin']), updateTheme);

export default router;
