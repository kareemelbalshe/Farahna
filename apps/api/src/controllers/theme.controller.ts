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
