-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('super_admin', 'admin', 'editor');

-- CreateEnum
CREATE TYPE "CustomerSource" AS ENUM ('whatsapp', 'facebook', 'instagram', 'tiktok', 'google', 'referral', 'website', 'other');

-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('active', 'inactive', 'archived');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('new', 'contacted', 'waiting_details', 'details_received', 'designing', 'preview_sent', 'awaiting_payment', 'paid', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('new', 'contacted', 'details_received', 'designing', 'preview_sent', 'awaiting_payment', 'payment_proof_received', 'paid', 'published', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('instapay', 'vodafone_cash');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'proof_received', 'verified', 'rejected', 'refunded');

-- CreateEnum
CREATE TYPE "InvitationType" AS ENUM ('wedding', 'engagement', 'henna', 'katb_ketab', 'custom');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('draft', 'preview', 'published', 'paused', 'expired', 'archived');

-- CreateEnum
CREATE TYPE "InvitationPrivacy" AS ENUM ('public', 'unlisted', 'private');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('engagement', 'henna', 'katb_ketab', 'wedding', 'reception', 'custom');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'audio', 'video', 'document');

-- CreateEnum
CREATE TYPE "CheckInStatus" AS ENUM ('pending', 'checked_in');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('attending', 'not_attending', 'maybe');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'admin',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "source" "CustomerSource" NOT NULL DEFAULT 'whatsapp',
    "status" "CustomerStatus" NOT NULL DEFAULT 'active',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customDomain" TEXT,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "source" "CustomerSource" NOT NULL DEFAULT 'whatsapp',
    "campaign" TEXT,
    "eventType" TEXT NOT NULL DEFAULT 'wedding',
    "selectedTheme" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'new',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "invitationId" TEXT,
    "packageId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "status" "OrderStatus" NOT NULL DEFAULT 'new',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "method" "PaymentMethod" NOT NULL DEFAULT 'instapay',
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "referenceNumber" TEXT,
    "paymentProofUrl" TEXT,
    "notes" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verifiedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderId" TEXT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "InvitationType" NOT NULL DEFAULT 'wedding',
    "status" "InvitationStatus" NOT NULL DEFAULT 'draft',
    "privacy" "InvitationPrivacy" NOT NULL DEFAULT 'unlisted',
    "previewToken" TEXT NOT NULL,
    "coupleGroomAr" TEXT NOT NULL,
    "coupleBrideAr" TEXT NOT NULL,
    "coupleGroomEn" TEXT,
    "coupleBrideEn" TEXT,
    "parentsGroomAr" TEXT,
    "parentsBrideAr" TEXT,
    "weddingMessageAr" TEXT,
    "weddingMessageEn" TEXT,
    "coverImageUrl" TEXT,
    "coupleImageUrl" TEXT,
    "galleryImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "musicUrl" TEXT,
    "musicTitle" TEXT,
    "themeId" TEXT NOT NULL,
    "themeConfig" JSONB,
    "isMultiEvent" BOOLEAN NOT NULL DEFAULT false,
    "rsvpEnabled" BOOLEAN NOT NULL DEFAULT true,
    "countdownEnabled" BOOLEAN NOT NULL DEFAULT true,
    "envelopeAnimationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "customDomain" TEXT,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitorsCount" INTEGER NOT NULL DEFAULT 0,
    "isDeleted" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitation_events" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "type" "EventType" NOT NULL DEFAULT 'wedding',
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT,
    "subtitleAr" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT,
    "venueNameAr" TEXT NOT NULL,
    "venueNameEn" TEXT,
    "addressAr" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "googleMapsUrl" TEXT,
    "openStreetMapUrl" TEXT,
    "descriptionAr" TEXT,
    "dressCodeAr" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isHennaFemaleOnly" BOOLEAN NOT NULL DEFAULT false,
    "themeOverride" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitation_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitation_sections" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "customConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invitation_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "themes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "previewImage" TEXT,
    "config" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "eventId" TEXT,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "type" "MediaType" NOT NULL DEFAULT 'image',
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "inviteCode" TEXT,
    "qrCodeUrl" TEXT,
    "isAttending" BOOLEAN,
    "guestCount" INTEGER NOT NULL DEFAULT 1,
    "tableNumber" TEXT,
    "checkInStatus" "CheckInStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rsvps" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "guestId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "attendanceStatus" "AttendanceStatus" NOT NULL DEFAULT 'attending',
    "guestCount" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT,
    "attendingEventIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rsvps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "deviceType" TEXT,
    "browser" TEXT,
    "referrer" TEXT,
    "country" TEXT DEFAULT 'EG',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "durationDays" INTEGER NOT NULL DEFAULT 60,
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featuresAr" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "badge" TEXT,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "siteName" TEXT NOT NULL DEFAULT 'Farahna',
    "siteNameAr" TEXT NOT NULL DEFAULT 'فرحنا',
    "supportPhone" TEXT NOT NULL DEFAULT '+201012345678',
    "whatsappNumber" TEXT NOT NULL DEFAULT '201012345678',
    "paymentInstructionsAr" TEXT NOT NULL DEFAULT 'الدفع متاح عبر InstaPay أو فودافون كاش — سيتم إرسال تفاصيل الدفع لحضرتك على واتساب',
    "defaultTimezone" TEXT NOT NULL DEFAULT 'Africa/Cairo',
    "defaultDurationDays" INTEGER NOT NULL DEFAULT 60,
    "instagramUrl" TEXT,
    "facebookUrl" TEXT,
    "tiktokUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "customers_phone_idx" ON "customers"("phone");

-- CreateIndex
CREATE INDEX "customers_status_idx" ON "customers"("status");

-- CreateIndex
CREATE INDEX "customers_createdAt_idx" ON "customers"("createdAt");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_createdAt_idx" ON "leads"("createdAt");

-- CreateIndex
CREATE INDEX "leads_customerId_idx" ON "leads"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "orders_invitationId_key" ON "orders"("invitationId");

-- CreateIndex
CREATE INDEX "orders_customerId_idx" ON "orders"("customerId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- CreateIndex
CREATE INDEX "payments_orderId_idx" ON "payments"("orderId");

-- CreateIndex
CREATE INDEX "payments_customerId_idx" ON "payments"("customerId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_createdAt_idx" ON "payments"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_slug_key" ON "invitations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_previewToken_key" ON "invitations"("previewToken");

-- CreateIndex
CREATE INDEX "invitations_slug_idx" ON "invitations"("slug");

-- CreateIndex
CREATE INDEX "invitations_status_idx" ON "invitations"("status");

-- CreateIndex
CREATE INDEX "invitations_type_idx" ON "invitations"("type");

-- CreateIndex
CREATE INDEX "invitations_customerId_idx" ON "invitations"("customerId");

-- CreateIndex
CREATE INDEX "invitations_previewToken_idx" ON "invitations"("previewToken");

-- CreateIndex
CREATE INDEX "invitations_createdAt_idx" ON "invitations"("createdAt");

-- CreateIndex
CREATE INDEX "invitation_events_invitationId_idx" ON "invitation_events"("invitationId");

-- CreateIndex
CREATE INDEX "invitation_events_date_idx" ON "invitation_events"("date");

-- CreateIndex
CREATE INDEX "invitation_events_sortOrder_idx" ON "invitation_events"("sortOrder");

-- CreateIndex
CREATE INDEX "invitation_sections_invitationId_idx" ON "invitation_sections"("invitationId");

-- CreateIndex
CREATE INDEX "invitation_sections_sortOrder_idx" ON "invitation_sections"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "invitation_sections_invitationId_sectionKey_key" ON "invitation_sections"("invitationId", "sectionKey");

-- CreateIndex
CREATE UNIQUE INDEX "themes_slug_key" ON "themes"("slug");

-- CreateIndex
CREATE INDEX "themes_slug_idx" ON "themes"("slug");

-- CreateIndex
CREATE INDEX "themes_isActive_idx" ON "themes"("isActive");

-- CreateIndex
CREATE INDEX "media_invitationId_idx" ON "media"("invitationId");

-- CreateIndex
CREATE INDEX "media_eventId_idx" ON "media"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "guests_inviteCode_key" ON "guests"("inviteCode");

-- CreateIndex
CREATE INDEX "guests_invitationId_idx" ON "guests"("invitationId");

-- CreateIndex
CREATE INDEX "guests_phone_idx" ON "guests"("phone");

-- CreateIndex
CREATE INDEX "guests_inviteCode_idx" ON "guests"("inviteCode");

-- CreateIndex
CREATE INDEX "rsvps_invitationId_idx" ON "rsvps"("invitationId");

-- CreateIndex
CREATE INDEX "rsvps_guestId_idx" ON "rsvps"("guestId");

-- CreateIndex
CREATE INDEX "rsvps_attendanceStatus_idx" ON "rsvps"("attendanceStatus");

-- CreateIndex
CREATE INDEX "rsvps_createdAt_idx" ON "rsvps"("createdAt");

-- CreateIndex
CREATE INDEX "analytics_events_invitationId_idx" ON "analytics_events"("invitationId");

-- CreateIndex
CREATE INDEX "analytics_events_eventType_idx" ON "analytics_events"("eventType");

-- CreateIndex
CREATE INDEX "analytics_events_createdAt_idx" ON "analytics_events"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "pricing_plans_slug_key" ON "pricing_plans"("slug");

-- CreateIndex
CREATE INDEX "pricing_plans_slug_idx" ON "pricing_plans"("slug");

-- CreateIndex
CREATE INDEX "pricing_plans_isActive_idx" ON "pricing_plans"("isActive");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation_events" ADD CONSTRAINT "invitation_events_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation_sections" ADD CONSTRAINT "invitation_sections_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "invitation_events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
