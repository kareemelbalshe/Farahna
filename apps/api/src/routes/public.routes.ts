import { Router } from 'express';
import {
  getPublicInvitation,
  getPreviewInvitation,
  getInvitationRsvpSummary,
  getPrivateGuestList,
  submitRsvp,
  recordAnalyticsEvent,
  getSitemapInvitations,
  submitPublicDesign,
  uploadPublicAudio,
} from '../controllers/public.controller';
import { getPricingPlans } from '../controllers/pricing-plan.controller';
import { uploadMiddleware } from '../controllers/media.controller';
import { validateBody } from '../middleware/validate';
import { rsvpRateLimiter } from '../middleware/auth';
import { rsvpSubmissionSchema, analyticsEventSchema } from '@farahna/shared';

const router = Router();

// 1. Self-Service Design Submission, Audio Upload & Pricing Plans
router.get('/pricing-plans', getPricingPlans);
router.post('/submit-design', submitPublicDesign);
router.post('/upload-audio', uploadMiddleware, uploadPublicAudio);

// 2. Sitemap indexable invitations (Must be before wildcard!)
router.get('/sitemap-invitations', getSitemapInvitations);

// 3. RSVP Endpoints & Couple Private Guest List
router.get('/invitations/:id/rsvp', getInvitationRsvpSummary);
router.post('/invitations/:id/rsvp', rsvpRateLimiter, validateBody(rsvpSubmissionSchema), submitRsvp);
router.get('/guests/:token', getPrivateGuestList);

// 4. Guest public views
router.get('/invitations/:type/:slug', getPublicInvitation);
router.get('/preview/:token', getPreviewInvitation);

// 4. Guest actions
router.post('/analytics', validateBody(analyticsEventSchema), recordAnalyticsEvent);

export default router;
