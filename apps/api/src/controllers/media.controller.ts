import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { prisma } from '../config/db';
import { storageService, MediaCategory } from '../services/storage';

// 1. Configure Multer with Memory Storage & Size limits
// This ensures file buffer is held in memory and validated BEFORE writing to disk
export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB absolute ceiling
  },
}).single('file');

export async function uploadMedia(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'لم يتم إرسال أي ملف للرفع' });
    }

    const category = (req.body.category || 'general') as MediaCategory;
    const { invitationId, eventId, customerId, themeSlug, caption, sortOrder } = req.body;

    // Check file against whitelist & size rules
    const validation = storageService.validateFile({
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.error });
    }

    // Save & optimize through storage service
    const stored = await storageService.saveFile({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      category,
      invitationId,
      eventId,
      customerId,
      themeSlug,
    });

    // Validate foreign keys safely before creating Media record
    let validInvitationId: string | null = null;
    if (invitationId) {
      const inv = await prisma.invitation.findUnique({ where: { id: invitationId } });
      if (inv) validInvitationId = inv.id;
    }

    let validEventId: string | null = null;
    if (eventId) {
      const ev = await prisma.invitationEvent.findUnique({ where: { id: eventId } });
      if (ev) validEventId = ev.id;
    }

    let validCustomerId: string | null = null;
    if (customerId) {
      const cust = await prisma.customer.findUnique({ where: { id: customerId } });
      if (cust) validCustomerId = cust.id;
    }

    // Record in database
    const mediaType = stored.mimeType.startsWith('audio') ? 'audio' : 'image';
    const media = await prisma.media.create({
      data: {
        filePath: stored.filePath,
        fileName: stored.fileName,
        originalName: stored.originalName,
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes,
        url: stored.url,
        type: mediaType,
        category,
        isPublic: stored.isPublic,
        caption: caption || null,
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
        invitationId: validInvitationId,
        eventId: validEventId,
        customerId: validCustomerId,
      },
    });

    return res.status(201).json({
      success: true,
      data: media,
      message: 'تم رفع الملف بنجاح وتخزينه في التخزين المحلي الآمن',
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'فشل رفع الملف' });
  }
}

export async function servePublicMedia(req: Request, res: Response, next: NextFunction) {
  try {
    // Parameter wildcard from /api/media/public/*
    const relativePath = (req.params as any)[0] || (req.params as any).filePath;
    if (!relativePath) {
      return res.status(404).json({ success: false, message: 'الملف غير موجود' });
    }

    // STRICT PRIVACY RULE: Payment proofs must NEVER be served publicly!
    if (relativePath.includes('payment-proofs') || relativePath.includes('payment_proof')) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح: صور إثبات الدفع لا يمكن الوصول إليها من هذا المسار العام',
      });
    }

    const absolutePath = storageService.getAbsoluteFilePath(relativePath);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ success: false, message: 'الملف المطلوب غير موجود على الخادم' });
    }

    // Set cache headers for fast delivery
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.sendFile(absolutePath);
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'خطأ في جلب الملف' });
  }
}

export async function serveSecureMedia(req: Request, res: Response, next: NextFunction) {
  try {
    const relativePath = (req.params as any)[0] || (req.params as any).filePath;
    if (!relativePath) {
      return res.status(404).json({ success: false, message: 'الملف غير موجود' });
    }

    const absolutePath = storageService.getAbsoluteFilePath(relativePath);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ success: false, message: 'الملف المطلوب غير موجود' });
    }

    // Sensitive files are served with private no-store headers
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    return res.sendFile(absolutePath);
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message || 'خطأ في جلب الملف' });
  }
}

export async function getInvitationMedia(req: Request, res: Response, next: NextFunction) {
  try {
    const { invitationId } = req.params;
    const media = await prisma.media.findMany({
      where: { invitationId },
      orderBy: { sortOrder: 'asc' },
    });
    return res.json({ success: true, data: media });
  } catch (error) {
    next(error);
  }
}

export async function getAllMedia(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, type, search, page = '1', limit = '100' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(limit as string, 10) || 100));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (category && category !== 'all') {
      where.category = category as string;
    }

    if (type && type !== 'all') {
      where.type = type as string;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      where.OR = [
        { originalName: { contains: q } },
        { fileName: { contains: q } },
        { caption: { contains: q } },
        { category: { contains: q } },
      ];
    }

    const [total, mediaList, statsGroup] = await Promise.all([
      prisma.media.count({ where }),
      prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          invitation: {
            select: {
              id: true,
              title: true,
              slug: true,
              type: true,
              coupleGroomAr: true,
              coupleBrideAr: true,
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          event: {
            select: {
              id: true,
              titleAr: true,
              type: true,
            },
          },
        },
      }),
      prisma.media.groupBy({
        by: ['category', 'type'],
        _count: { id: true },
        _sum: { sizeBytes: true },
      }),
    ]);

    let totalSizeBytes = 0;
    let imagesCount = 0;
    let audioCount = 0;
    let paymentProofsCount = 0;

    statsGroup.forEach((s) => {
      totalSizeBytes += s._sum.sizeBytes || 0;
      if (s.type === 'image') imagesCount += s._count.id;
      if (s.type === 'audio') audioCount += s._count.id;
      if (s.category === 'payment_proof') paymentProofsCount += s._count.id;
    });

    return res.json({
      success: true,
      data: {
        media: mediaList,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
        stats: {
          totalFiles: total,
          totalSizeBytes,
          imagesCount,
          audioCount,
          paymentProofsCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMedia(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return res.status(404).json({ success: false, message: 'الملف غير موجود' });
    }

    // Delete from disk
    if (media.filePath) {
      await storageService.deleteFile(media.filePath);
    }

    // Delete from database
    await prisma.media.delete({ where: { id } });

    return res.json({ success: true, message: 'تم حذف الملف بنجاح من التخزين وقاعدة البيانات' });
  } catch (error) {
    next(error);
  }
}

