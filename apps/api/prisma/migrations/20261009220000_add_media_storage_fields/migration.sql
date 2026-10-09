-- AlterTable
ALTER TABLE "media" ALTER COLUMN "invitationId" DROP NOT NULL;
ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "customerId" TEXT;
ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "filePath" TEXT NOT NULL DEFAULT '';
ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "fileName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "originalName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "mimeType" TEXT NOT NULL DEFAULT 'image/jpeg';
ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "sizeBytes" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "category" TEXT;
ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_customerId_fkey') THEN
        ALTER TABLE "media" ADD CONSTRAINT "media_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "media_customerId_idx" ON "media"("customerId");
CREATE INDEX IF NOT EXISTS "media_category_idx" ON "media"("category");
