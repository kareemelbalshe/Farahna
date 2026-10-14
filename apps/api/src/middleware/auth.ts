import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { verifyToken, TokenPayload } from '../utils/auth';
import { UserRole, Permission, ROLE_PERMISSIONS } from '@farahna/shared';
import { prisma } from '../config/db';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload & {
        permissions?: Permission[];
      };
    }
  }
}

/**
 * Strict Brute-Force Rate Limiter for Login Endpoint
 * Limits to 5 failed attempts per 15 minutes per IP
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // maximum attempts in window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تم تجاوز الحد المسموح لمحاولات تسجيل الدخول. يرجى المحاولة بعد 15 دقيقة لحماية الحساب.',
  },
});

/**
 * Rate Limiter for Public RSVP Submissions
 * Prevents spam/abuse on public invitations
 */
export const rsvpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // maximum RSVP submissions per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تم تجاوز الحد المسموح لإرسال الردود من هذا الجهاز. يرجى الانتظار قليلاً قبل المحاولة مجدداً.',
  },
});

/**
 * JWT Authentication Middleware
 * Validates JWT, verifies user existence & active status in DB
 */
export async function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : (req.query.token as string | undefined);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح - يرجى تسجيل الدخول أولاً',
    });
  }
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({
      success: false,
      message: 'رمز التحقق منتهي أو غير صالح، يرجى إعادة تسجيل الدخول',
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'الحساب معطل أو غير موجود، يرجى مراجعة إدارة المنصة',
      });
    }

    const permissions = ROLE_PERMISSIONS[user.role as UserRole] || [];

    req.user = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      permissions,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'فشل التحقق من هوية المستخدم',
    });
  }
}

/**
 * Role-Based Access Control (RBAC) Middleware
 * Checks if user possesses one of the allowed roles
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح - يلزم تسجيل الدخول',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `ليس لديك صلاحية لتنفيذ هذا الإجراء (يتطلب رتبة: ${allowedRoles.join(' أو ')})`,
      });
    }

    next();
  };
}

/**
 * Granular Permission-Based Middleware
 * Enables future extensibility (e.g. customer role, agent role) without changing route definitions
 */
export function requirePermission(requiredPermission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح - يلزم تسجيل الدخول',
      });
    }

    const userPermissions = req.user.permissions || [];
    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: `ليس لديك الصلاحية المطلوبة (${requiredPermission}) لتنفيذ هذا الإجراء`,
      });
    }

    next();
  };
}
