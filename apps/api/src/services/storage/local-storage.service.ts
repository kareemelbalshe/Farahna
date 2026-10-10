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
];

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_AUDIO_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export class LocalStorageService implements IStorageService {
  private baseStorageDir: string;

  constructor(customStoragePath?: string) {
    this.baseStorageDir =
      customStoragePath ||
      process.env.STORAGE_PATH ||
      path.resolve(process.cwd(), 'storage');

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

    // 3. Process & Optimize buffer (if image, optimize with sharp)
    const isImage = ALLOWED_IMAGE_MIMES.includes(mimeType);
    let finalBuffer = buffer;
    let finalMime = mimeType;
    let extension = path.extname(originalName).replace('.', '').toLowerCase() || 'bin';

    if (isImage) {
      try {
        // Resize if width > 2000 or height > 2000, and convert to WebP for maximum compression
        const image = sharp(buffer);
        const metadata = await image.metadata();

        if ((metadata.width && metadata.width > 2000) || (metadata.height && metadata.height > 2000)) {
          image.resize({
            width: 2000,
            height: 2000,
            fit: 'inside',
            withoutEnlargement: true,
          });
        }

        // Convert to WebP for modern performance, quality 85
        finalBuffer = await image.webp({ quality: 85 }).toBuffer();
        finalMime = 'image/webp';
        extension = 'webp';
      } catch (err) {
        // If sharp processing encounters an edge case, fallback to original buffer
        finalBuffer = buffer;
      }
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
}
