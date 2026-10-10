import { Router } from 'express';
import { getThemes, getThemeById, updateTheme, createTheme } from '../controllers/theme.controller';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

// Public can view active themes for demo showcase
router.get('/', getThemes);
router.get('/:id', getThemeById);

// Admin can create and update themes
router.use(authenticateJWT);
router.post('/', requireRole(['super_admin', 'admin']), createTheme);
router.patch('/:id', requireRole(['super_admin', 'admin']), updateTheme);

export default router;
