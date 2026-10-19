// FARAHNA Shared Types & Interfaces

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'customer';

export type Permission =
  | 'settings:read'
  | 'settings:update'
  | 'users:manage'
  | 'payments:verify'
  | 'payments:read'
  | 'customers:manage'
  | 'orders:manage'
  | 'invitations:manage'
  | 'invitations:edit'
  | 'events:manage'
  | 'rsvp:read'
  | 'analytics:read';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    'settings:read',
    'settings:update',
    'users:manage',
    'payments:verify',
    'payments:read',
    'customers:manage',
    'orders:manage',
    'invitations:manage',
    'invitations:edit',
    'events:manage',
    'rsvp:read',
    'analytics:read',
  ],
  admin: [
    'settings:read',
    'payments:verify',
    'payments:read',
    'customers:manage',
    'orders:manage',
    'invitations:manage',
    'invitations:edit',
    'events:manage',
    'rsvp:read',
    'analytics:read',
  ],
  editor: [
    'invitations:edit',
    'events:manage',
    'rsvp:read',
  ],
  customer: [
    'invitations:edit',
    'rsvp:read',
  ],
};

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions?: Permission[];
  createdAt: string;
}

export type CustomerSource = 
  | 'whatsapp'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'google'
  | 'referral'
  | 'website'
  | 'other';

export type CustomerStatus = 'active' | 'inactive' | 'archived';

export interface CustomerDTO {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  notes?: string | null;
  source: CustomerSource;
  status: CustomerStatus;
  createdAt: string;
}

export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'waiting_details'
  | 'details_received'
  | 'designing'
  | 'preview_sent'
  | 'awaiting_payment'
  | 'paid'
  | 'completed'
  | 'cancelled';

export interface LeadDTO {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string | null;
  source: CustomerSource;
  campaign?: string | null;
  eventType: string;
  selectedTheme?: string | null;
  status: LeadStatus;
  notes?: string | null;
  createdAt: string;
}

export type OrderStatus =
  | 'new'
  | 'contacted'
  | 'details_received'
  | 'designing'
  | 'preview_sent'
  | 'awaiting_payment'
  | 'payment_proof_received'
  | 'paid'
  | 'published'
  | 'completed'
  | 'cancelled';

export interface OrderDTO {
  id: string;
  orderNumber: string;
  customerId: string;
  invitationId?: string | null;
  packageId?: string | null;
  amount: number;
  currency: string;
  status: OrderStatus;
  notes?: string | null;
  createdAt: string;
  customer?: CustomerDTO;
  invitation?: InvitationSummaryDTO;
  payments?: PaymentDTO[];
}

export type PaymentMethod = 'instapay' | 'vodafone_cash';

export type PaymentStatus = 
  | 'pending'
  | 'proof_received'
  | 'verified'
  | 'rejected'
  | 'refunded';

export interface PaymentDTO {
  id: string;
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  referenceNumber?: string | null;
  paymentProofUrl?: string | null;
  notes?: string | null;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  createdAt: string;
}

export type InvitationType = 'wedding' | 'engagement' | 'henna' | 'katb_ketab' | 'custom';

export type InvitationStatus = 
  | 'draft'
  | 'preview'
  | 'published'
  | 'paused'
  | 'expired'
  | 'archived';

export type InvitationPrivacy = 'public' | 'unlisted' | 'private';

export type OpeningStyleType = 'wax-seal' | 'gatefold' | 'slider' | 'blooming';
export type BackgroundPatternType =
  | 'damask'
  | 'marble'
  | 'floral'
  | 'zellige'
  | 'parchment'
  | 'stars'
  | 'geometric'
  | 'dots'
  | 'none';
export type InnerCardStyleType =
  | 'arched'
  | 'double-gold'
  | 'frosted'
  | 'deckle'
  | 'royal-crest'
  | 'minimal';
export type FloatingParticlesType = 'none' | 'golden-dust' | 'rose-petals' | 'sparkles';

export interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  envelopeStyle?: string;
  cardStyle?: string;
  animationStyle?: string;
  decorations?: string[];
  whatsappPhone?: string | null;
  whatsappContactEnabled?: boolean;
  openingStyle?: OpeningStyleType | string;
  backgroundPattern?: BackgroundPatternType | string;
  innerCardStyle?: InnerCardStyleType | string;
  floatingParticles?: FloatingParticlesType | string;
}

export interface InvitationDTO {
  id: string;
  customerId: string;
  orderId?: string | null;
  slug: string;
  title: string;
  type: InvitationType;
  status: InvitationStatus;
  privacy: InvitationPrivacy;
  previewToken: string;
  
  // Couple & Family
  coupleGroomAr: string;
  coupleBrideAr: string;
  coupleGroomEn?: string | null;
  coupleBrideEn?: string | null;
  parentsGroomAr?: string | null;
  parentsBrideAr?: string | null;
  weddingMessageAr?: string | null;
  weddingMessageEn?: string | null;
  whatsappPhone?: string | null;

  // Media
  coverImageUrl?: string | null;
  coupleImageUrl?: string | null;
  galleryImages: string[];
  musicUrl?: string | null;
  musicTitle?: string | null;

  // Theme & Style
  themeId: string;
  themeConfig?: ThemeConfig | null;

  // Configuration
  isMultiEvent: boolean;
  rsvpEnabled: boolean;
  countdownEnabled: boolean;
  envelopeAnimationEnabled: boolean;
  
  // Dates
  eventDate: string;
  startDate?: string | null;
  expiresAt?: string | null;

  // Counters
  viewsCount: number;
  uniqueVisitorsCount: number;

  createdAt: string;
  updatedAt: string;

  // Relations
  events?: InvitationEventDTO[];
  sections?: InvitationSectionDTO[];
  theme?: ThemeDTO;
}

export interface InvitationSummaryDTO {
  id: string;
  slug: string;
  title: string;
  type: InvitationType;
  status: InvitationStatus;
  coupleGroomAr: string;
  coupleBrideAr: string;
  eventDate: string;
  viewsCount: number;
}

export type EventType = 
  | 'engagement'
  | 'henna'
  | 'katb_ketab'
  | 'wedding'
  | 'reception'
  | 'custom';

export interface InvitationEventDTO {
  id: string;
  invitationId: string;
  type: EventType;
  titleAr: string;
  titleEn?: string | null;
  subtitleAr?: string | null;
  date: string;
  startTime: string;
  endTime?: string | null;
  
  // Location
  venueNameAr: string;
  venueNameEn?: string | null;
  addressAr: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string | null;
  openStreetMapUrl?: string | null;

  // Specifics
  descriptionAr?: string | null;
  dressCodeAr?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isVisible: boolean;
  isHennaFemaleOnly?: boolean;
  themeOverride?: ThemeConfig | null;
}

export type SectionKey = 
  | 'envelope'
  | 'cover'
  | 'couple'
  | 'couple_photo'
  | 'message'
  | 'countdown'
  | 'events'
  | 'timeline'
  | 'parents'
  | 'henna_special'
  | 'gallery'
  | 'venue'
  | 'map'
  | 'music'
  | 'dresscode'
  | 'rsvp'
  | 'calendar'
  | 'share'
  | 'whatsapp'
  | 'footer';

export interface InvitationSectionDTO {
  id: string;
  invitationId: string;
  sectionKey: SectionKey;
  isEnabled: boolean;
  sortOrder: number;
  customConfig?: Record<string, any> | null;
}

export interface ThemeDTO {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  previewImage?: string | null;
  config: ThemeConfig;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
}

export type AttendanceStatus = 'attending' | 'not_attending' | 'maybe';

export interface RsvpDTO {
  id: string;
  invitationId: string;
  name: string;
  phone?: string | null;
  attendanceStatus: AttendanceStatus;
  guestCount: number;
  message?: string | null;
  attendingEventIds?: string[];
  createdAt: string;
}

export interface PricingPlanDTO {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  price: number;
  currency: string;
  durationDays: number;
  features: string[];
  featuresAr: string[];
  badge?: string | null;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface SettingsDTO {
  siteName: string;
  siteNameAr: string;
  supportPhone: string;
  whatsappNumber: string;
  paymentInstructionsAr: string;
  defaultTimezone: string;
  defaultDurationDays: number;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
}

export interface PublicInvitationResponse {
  invitation: InvitationDTO;
  events: InvitationEventDTO[];
  theme: ThemeDTO;
  sections: InvitationSectionDTO[];
  settings: {
    whatsappNumber: string;
    siteNameAr: string;
  };
}
