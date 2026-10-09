export type MediaCategory =
  | 'cover'
  | 'gallery'
  | 'event'
  | 'music'
  | 'theme'
  | 'payment_proof'
  | 'general';

export interface SaveFileParams {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  category: MediaCategory;
  invitationId?: string;
  eventId?: string;
  customerId?: string;
  themeSlug?: string;
}

export interface StoredFileResult {
  fileName: string;
  originalName: string;
  filePath: string; // Relative path, e.g. invitations/uuid/cover/uuid.webp
  absolutePath: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  isPublic: boolean;
}

export interface IStorageService {
  saveFile(params: SaveFileParams): Promise<StoredFileResult>;
  deleteFile(relativePath: string): Promise<boolean>;
  getAbsoluteFilePath(relativePath: string): string;
  validateFile(file: { mimetype: string; size: number }): { valid: boolean; error?: string };
}
