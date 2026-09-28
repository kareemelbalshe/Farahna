import { Router } from 'express';
import authRoutes from './auth.routes';
import customerRoutes from './customer.routes';
import leadRoutes from './lead.routes';
import orderRoutes from './order.routes';
import paymentRoutes from './payment.routes';
import invitationRoutes from './invitation.routes';
import eventRoutes from './event.routes';
import themeRoutes from './theme.routes';
import settingsRoutes from './settings.routes';
import analyticsRoutes from './analytics.routes';
import mediaRoutes from './media.routes';
import publicRoutes from './public.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/leads', leadRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/invitations', invitationRoutes);
router.use('/events', eventRoutes);
router.use('/themes', themeRoutes);
router.use('/settings', settingsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/media', mediaRoutes);
router.use('/public', publicRoutes);

export default router;
