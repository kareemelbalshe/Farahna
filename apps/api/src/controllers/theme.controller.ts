import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';

export async function getThemes(req: Request, res: Response, next: NextFunction) {
  try {
    const themes = await prisma.theme.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    return res.json({ success: true, data: themes });
  } catch (error) {
    next(error);
  }
}

export async function getThemeById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const theme = await prisma.theme.findUnique({
      where: { id },
    });
    if (!theme) {
      return res.status(404).json({ success: false, message: 'الثيم غير موجود' });
    }
    return res.json({ success: true, data: theme });
  } catch (error) {
    next(error);
  }
}

export async function updateTheme(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const theme = await prisma.theme.update({
      where: { id },
      data: req.body,
    });
    return res.json({ success: true, data: theme, message: 'تم تحديث الثيم بنجاح' });
  } catch (error) {
    next(error);
  }
}

export async function createTheme(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, nameAr, slug, config, previewImage, sortOrder = 10 } = req.body;

    if (!name || !nameAr || !slug || !config) {
      return res.status(400).json({
        success: false,
        message: 'يرجى تقديم كافة البيانات الأساسية للثيم (الاسم، الاسم بالعربي، الرابط المختصر، وإعدادات الألوان)',
      });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    const existing = await prisma.theme.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'اسم الرابط المختصر لهذا الثيم مستخدم بالفعل، يرجى اختيار اسم آخر',
      });
    }

    const theme = await prisma.theme.create({
      data: {
        name,
        nameAr,
        slug: cleanSlug,
        config,
        previewImage: previewImage || null,
        sortOrder: Number(sortOrder) || 10,
        isActive: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: theme,
      message: 'تم حفظ الثيم الجديد في النظام بنجاح وأصبح متاحاً لكافة الدعوات 🎨',
    });
  } catch (error) {
    next(error);
  }
}

