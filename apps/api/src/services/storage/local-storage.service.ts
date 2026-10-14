import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { nanoid } from 'nanoid';
import { IStorageService, SaveFileParams, StoredFileResult } from './storage.interface';

export const ALLOWED_IMAGE_MIMES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const ALLOWED_AUDIO_MIMES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/ogg',
  'audio/m4a',
  'audio/x-m4a',
  'audio/mp4',
  'audio/aac',
  'audio/webm',
];

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_AUDIO_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export class LocalStorageService implements IStorageService {
  private baseStorageDir: string;

  constructor(customStoragePath?: string) {
    if (customStoragePath) {
      this.baseStorageDir = path.resolve(customStoragePath);
    } else {
      let candidate = process.env.STORAGE_PATH || 'storage';
      const cwd = process.cwd();
      if (
        candidate === 'apps/api/storage' &&
        (cwd.endsWith(path.join('apps', 'api')) || cwd.endsWith('apps/api') || cwd.endsWith('apps\\api'))
      ) {
        candidate = 'storage';
      }
      this.baseStorageDir = path.resolve(candidate);
    }

    // Ensure base storage directory exists
    if (!fs.existsSync(this.baseStorageDir)) {
      fs.mkdirSync(this.baseStorageDir, { recursive: true });
    }
  }

  public validateFile(file: { mimetype: string; size: number }): { valid: boolean; error?: string } {
    const isImage = ALLOWED_IMAGE_MIMES.includes(file.mimetype);
    const isAudio = ALLOWED_AUDIO_MIMES.includes(file.mimetype);

    if (!isImage && !isAudio) {
      return {
        valid: false,
        error: `نوع الملف غير مدعوم (${file.mimetype}). الأنواع المسموحة فقط: JPG, PNG, WebP, MP3, WAV`,
      };
    }

    if (isImage && file.size > MAX_IMAGE_SIZE_BYTES) {
      return {
        valid: false,
        error: `حجم الصورة يتجاوز الحد الأقصى المسموح به (10 ميجابايت). الحجم المرفوع: ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      };
    }

    if (isAudio && file.size > MAX_AUDIO_SIZE_BYTES) {
      return {
        valid: false,
        error: `حجم المقطع الصوتي يتجاوز الحد الأقصى المسموح به (15 ميجابايت). الحجم المرفوع: ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      };
    }

    return { valid: true };
  }

  public async saveFile(params: SaveFileParams): Promise<StoredFileResult> {
    const {
      buffer,
      originalName,
      mimeType,
      category,
      invitationId,
      eventId,
      customerId,
      themeSlug,
    } = params;

    // 1. Validate
    const validation = this.validateFile({ mimetype: mimeType, size: buffer.length });
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // 2. Determine target subfolder based on category
    // Hierarchy:
    // invitations/{invitationId}/cover/
    // invitations/{invitationId}/gallery/
    // invitations/{invitationId}/events/{eventId}/
    // invitations/{invitationId}/music/
    // themes/{themeSlug}/assets/
    // customers/{customerId}/payment-proofs/
    let subDir = '';
    const isPublic = category !== 'payment_proof';

    switch (category) {
      case 'cover':
        subDir = path.join('invitations', invitationId || 'general', 'cover');
        break;
      case 'gallery':
        subDir = path.join('invitations', invitationId || 'general', 'gallery');
        break;
      case 'event':
        subDir = path.join(
          'invitations',
          invitationId || 'general',
          'events',
          eventId || 'default'
        );
        break;
      case 'music':
        subDir = path.join('invitations', invitationId || 'general', 'music');
        break;
      case 'theme':
        subDir = path.join('themes', themeSlug || 'default', 'assets');
        break;
      case 'payment_proof':
        subDir = path.join('customers', customerId || 'general', 'payment-proofs');
        break;
      default:
        subDir = path.join('general', 'uploads');
        break;
    }

    const targetDir = path.join(this.baseStorageDir, subDir);
    await fs.promises.mkdir(targetDir, { recursive: true });

    // 3. Process & Optimize buffer (if image, aggressively compress with sharp to WebP)
    const isImage = ALLOWED_IMAGE_MIMES.includes(mimeType);
    let finalBuffer = buffer;
    let finalMime = mimeType;
    let extension = path.extname(originalName).replace('.', '').toLowerCase() || 'bin';

    if (isImage) {
      const optimized = await this.optimizeImageBuffer(buffer, category);
      finalBuffer = optimized.buffer;
      finalMime = optimized.mimeType;
      extension = optimized.extension;

      const savedPercent = buffer.length > finalBuffer.length
        ? (((buffer.length - finalBuffer.length) / buffer.length) * 100).toFixed(1)
        : '0.0';
      console.log(
        `⚡ [Storage] Optimized ${originalName} (${category}): ${(buffer.length / 1024).toFixed(1)} KB -> ${(finalBuffer.length / 1024).toFixed(1)} KB (${savedPercent}% space saved)`
      );
    }

    // 4. Generate Safe Unique Filename (UUID/nanoid) to prevent Path Traversal
    const safeUniqueName = `${nanoid(16)}_${Date.now()}.${extension}`;
    const relativeFilePath = path.join(subDir, safeUniqueName);
    const absoluteFilePath = path.join(this.baseStorageDir, relativeFilePath);

    // 5. Write to disk
    await fs.promises.writeFile(absoluteFilePath, finalBuffer);

    // 6. Generate URL
    // Public files served via /api/media/public/*
    // Sensitive payment proofs served via /api/media/payment-proof/*
    const normalizedRelative = relativeFilePath.replace(/\\/g, '/');
    const url = isPublic
      ? `/api/media/public/${normalizedRelative}`
      : `/api/media/secure/${normalizedRelative}`;

    return {
      fileName: safeUniqueName,
      originalName,
      filePath: normalizedRelative,
      absolutePath: absoluteFilePath,
      mimeType: finalMime,
      sizeBytes: finalBuffer.length,
      url,
      isPublic,
    };
  }

  public async deleteFile(relativePath: string): Promise<boolean> {
    try {
      const absolutePath = this.getAbsoluteFilePath(relativePath);
      if (fs.existsSync(absolutePath)) {
        await fs.promises.unlink(absolutePath);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  public async deleteDirectory(relativePath: string): Promise<boolean> {
    try {
      const absolutePath = this.getAbsoluteFilePath(relativePath);
      if (fs.existsSync(absolutePath)) {
        await fs.promises.rm(absolutePath, { recursive: true, force: true });
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  public getAbsoluteFilePath(relativePath: string): string {
    if (!relativePath || typeof relativePath !== 'string') {
      throw new Error('المسار غير صالح');
    }

    // 1. Decode URI encoding to catch obfuscated %2e%2e traversal
    let cleanRelative = relativePath;
    try {
      cleanRelative = decodeURIComponent(relativePath);
    } catch {
      // Keep original if malformed URI
    }

    // 2. Detect poison null bytes
    if (cleanRelative.includes('\0')) {
      throw new Error('محاولة وصول غير مصرح بها (Path Traversal Detected: Null Byte)');
    }

    // 3. Resolve path directly against base storage directory
    const baseDirResolved = path.resolve(this.baseStorageDir);
    const absolutePath = path.resolve(baseDirResolved, cleanRelative);

    // 4. Strict directory jail boundary check
    if (!absolutePath.startsWith(baseDirResolved + path.sep) && absolutePath !== baseDirResolved) {
      throw new Error('محاولة وصول غير مصرح بها (Path Traversal Detected)');
    }

    return absolutePath;
  }

  /**
   * Ultra-efficient image optimization & space-saving compressor:
   * 1. Auto-rotates image according to EXIF orientation.
   * 2. Strips all unnecessary camera/GPS bloat and metadata.
   * 3. Resizes down to category-tailored maximum dimensions.
   * 4. Converts to high-efficiency WebP with maximum compression effort (effort: 6).
   * 5. Progressive multi-pass compression if the resulting WebP exceeds the size ceiling.
   */
  public async optimizeImageBuffer(
    buffer: Buffer,
    category?: string
  ): Promise<{ buffer: Buffer; mimeType: string; extension: string }> {
    try {
      // 1. Determine optimal max dimensions and target quality based on category
      let maxWidth = 1280;
      let maxHeight = 1280;
      let targetQuality = 78;

      if (category === 'payment_proof') {
        // Payment receipts don't need giant dimensions, just crisp readable text
        maxWidth = 1000;
        maxHeight = 1000;
        targetQuality = 72;
      } else if (category === 'theme') {
        maxWidth = 800;
        maxHeight = 800;
        targetQuality = 80;
      } else if (category === 'gallery') {
        maxWidth = 1200;
        maxHeight = 1200;
        targetQuality = 76;
      } else if (category === 'cover') {
        maxWidth = 1280;
        maxHeight = 1280;
        targetQuality = 78;
      }

      // 2. Initial pass with Sharp
      const pipeline = sharp(buffer)
        .rotate() // Auto-orient based on EXIF before stripping metadata
        .resize({
          width: maxWidth,
          height: maxHeight,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality: targetQuality,
          effort: 6, // Maximum compression effort (0-6)
          smartSubsample: true,
        });

      let optimized = await pipeline.toBuffer();

      // 3. Multi-pass aggressive compression if still larger than target ceiling
      // Receipts: max 150KB, General images: max 280KB
      const maxAllowedBytes = category === 'payment_proof' ? 150 * 1024 : 280 * 1024;
      if (optimized.length > maxAllowedBytes) {
        optimized = await sharp(optimized)
          .resize({
            width: Math.min(maxWidth, 1000),
            height: Math.min(maxHeight, 1000),
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({
            quality: 68,
            effort: 6,
          })
          .toBuffer();
      }

      return {
        buffer: optimized,
        mimeType: 'image/webp',
        extension: 'webp',
      };
    } catch (err) {
      console.error('Image compression failed, falling back to original buffer:', err);
      return {
        buffer,
        mimeType: 'image/webp',
        extension: 'webp',
      };
    }
  }
}
