// Zod Schemas for Farahna input validation across frontend & backend

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

export const customerSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(10, 'رقم الهاتف غير صالح'),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email('البريد غير صالح').optional().nullable().or(z.literal('')),
  notes: z.string().optional().nullable(),
  source: z.enum(['whatsapp', 'facebook', 'instagram', 'tiktok', 'google', 'referral', 'website', 'other']).default('whatsapp'),
  status: z.enum(['active', 'vip', 'inactive', 'lead', 'archived']).default('active'),
});

export const leadSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(10, 'رقم الهاتف غير صالح'),
  whatsapp: z.string().optional().nullable(),
  source: z.enum(['whatsapp', 'facebook', 'instagram', 'tiktok', 'google', 'referral', 'website', 'other']).default('whatsapp'),
  campaign: z.string().optional().nullable(),
  eventType: z.string().default('wedding'),
  selectedTheme: z.string().optional().nullable(),
  status: z.enum([
    'new',
    'contacted',
    'waiting_details',
    'details_received',
    'designing',
    'preview_sent',
    'awaiting_payment',
    'paid',
    'completed',
    'cancelled',
  ]).default('new'),
  notes: z.string().optional().nullable(),
});

export const orderSchema = z.object({
  customerId: z.string().uuid('معرف العميل غير صالح'),
  invitationId: z.string().uuid().optional().nullable(),
  packageId: z.string().optional().nullable(),
  amount: z.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
  currency: z.string().default('EGP'),
  status: z.enum([
    'new',
    'contacted',
    'details_received',
    'designing',
    'preview_sent',
    'awaiting_payment',
    'payment_proof_received',
    'paid',
    'published',
    'completed',
    'cancelled',
  ]).default('new'),
  notes: z.string().optional().nullable(),
});

export const paymentSchema = z.object({
  orderId: z.string().uuid('معرف الطلب غير صالح'),
  customerId: z.string().uuid('معرف العميل غير صالح'),
  amount: z.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
  currency: z.string().default('EGP'),
  method: z.enum(['instapay', 'vodafone_cash']).default('instapay'),
  status: z.enum(['pending', 'proof_received', 'verified', 'rejected', 'refunded']).default('pending'),
  referenceNumber: z.string().optional().nullable(),
  paymentProofUrl: z.string().url().optional().nullable().or(z.literal('')),
  notes: z.string().optional().nullable(),
});

export const verifyPaymentSchema = z.object({
  referenceNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  publishImmediately: z.boolean().default(true),
});

export const invitationSchema = z.object({
  customerId: z.string().uuid('معرف العميل غير صالح'),
  orderId: z.string().uuid().optional().nullable(),
  slug: z.string().min(3, 'الرابط المختصر يجب أن يكون 3 أحرف على الأقل').regex(/^[a-z0-9-]+$/, 'الرابط يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشُرط فقط'),
  title: z.string().min(2, 'عنوان الدعوة مطلوب'),
  type: z.enum(['wedding', 'engagement', 'henna', 'katb_ketab', 'custom']).default('wedding'),
  status: z.enum(['draft', 'preview', 'published', 'paused', 'expired', 'archived']).default('draft'),
  privacy: z.enum(['public', 'unlisted', 'private']).default('unlisted'),
  
  // Couple & Family
  coupleGroomAr: z.string().min(1, 'اسم العريس بالعربية مطلوب'),
  coupleBrideAr: z.string().min(1, 'اسم العروسة بالعربية مطلوب'),
  coupleGroomEn: z.string().optional().nullable(),
  coupleBrideEn: z.string().optional().nullable(),
  parentsGroomAr: z.string().optional().nullable(),
  parentsBrideAr: z.string().optional().nullable(),
  weddingMessageAr: z.string().optional().nullable(),
  weddingMessageEn: z.string().optional().nullable(),

  // Media
  coverImageUrl: z.string().optional().nullable(),
  coupleImageUrl: z.string().optional().nullable(),
  galleryImages: z.array(z.string()).default([]),
  musicUrl: z.string().optional().nullable(),
  musicTitle: z.string().optional().nullable(),

  // Theme
  themeId: z.string().min(1, 'يرجى اختيار الثيم'),
  themeConfig: z.record(z.any()).optional().nullable(),

  // Features
  isMultiEvent: z.boolean().default(false),
  rsvpEnabled: z.boolean().default(true),
  countdownEnabled: z.boolean().default(true),
  envelopeAnimationEnabled: z.boolean().default(true),

  // Dates
  eventDate: z.string().min(1, 'تاريخ المناسبة مطلوب'),
  startDate: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
});

export const invitationEventSchema = z.object({
  invitationId: z.string().uuid('معرف الدعوة غير صالح'),
  type: z.enum(['engagement', 'henna', 'katb_ketab', 'wedding', 'reception', 'custom']).default('wedding'),
  titleAr: z.string().min(1, 'اسم المناسبة بالعربية مطلوب'),
  titleEn: z.string().optional().nullable(),
  subtitleAr: z.string().optional().nullable(),
  date: z.string().min(1, 'تاريخ المناسبة مطلوب'),
  startTime: z.string().min(1, 'وقت البدء مطلوب'),
  endTime: z.string().optional().nullable(),

  venueNameAr: z.string().min(1, 'اسم القاعة أو المكان مطلوب'),
  venueNameEn: z.string().optional().nullable(),
  addressAr: z.string().min(1, 'العنوان التفصيلي مطلوب'),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  googleMapsUrl: z.string().url('رابط جوجل مابس غير صالح').optional().nullable().or(z.literal('')),
  openStreetMapUrl: z.string().optional().nullable(),

  descriptionAr: z.string().optional().nullable(),
  dressCodeAr: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  sortOrder: z.number().default(0),
  isVisible: z.boolean().default(true),
  isHennaFemaleOnly: z.boolean().default(false),
  themeOverride: z.record(z.any()).optional().nullable(),
});

export const rsvpSubmissionSchema = z.object({
  name: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().optional().nullable(),
  attendanceStatus: z.enum(['attending', 'not_attending', 'maybe']),
  guestCount: z.number().int().min(1, 'عدد الضيوف لا يقل عن 1').max(20).default(1),
  message: z.string().max(500, 'الرسالة طويلة للغاية').optional().nullable(),
  attendingEventIds: z.array(z.string()).optional(),
});

export const analyticsEventSchema = z.object({
  invitationId: z.string(),
  eventType: z.enum([
    'page_view',
    'envelope_open',
    'music_play',
    'map_click',
    'calendar_add',
    'calendar_click',
    'share_click',
    'whatsapp_click',
    'rsvp_open',
    'rsvp_submission',
  ]),
  deviceType: z.string().optional(),
  browser: z.string().optional(),
  referrer: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});
