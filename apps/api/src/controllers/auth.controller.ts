import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { comparePassword, generateToken } from '../utils/auth';
import { ROLE_PERMISSIONS, UserRole } from '@farahna/shared';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
      name: user.name,
    });

    const permissions = ROLE_PERMISSIONS[user.role as UserRole] || [];

    return res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'غير مصرح' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود أو معطل' });
    }

    const permissions = ROLE_PERMISSIONS[user.role as UserRole] || [];

    return res.json({
      success: true,
      data: {
        ...user,
        permissions,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyTokenValidity(req: Request, res: Response) {
  return res.json({
    success: true,
    data: {
      valid: true,
      user: req.user,
    },
  });
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'غير مصرح' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور الجديدة يجب ألا تقل عن 8 خانات',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور الحالية غير صحيحة',
      });
    }

    const { hashPassword } = await import('../utils/auth');
    const newHashed = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHashed },
    });

    return res.json({
      success: true,
      message: 'تم تحديث كلمة المرور بنجاح لحسابك',
    });
  } catch (error) {
    next(error);
  }
}
