import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function syncSuperAdmin() {
  const superAdminEmail = 'farahna.connect@gmail.com';
  const defaultPassword = 'Farahna@2026!';

  console.log(`Checking super admin user with email: ${superAdminEmail}...`);

  const existingUser = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        role: 'super_admin',
        isActive: true,
        name: 'كريم مدير منصة فرحنا',
      },
    });
    console.log(`✅ Super Admin updated successfully for: ${superAdminEmail}`);
  } else {
    await prisma.user.create({
      data: {
        email: superAdminEmail,
        password: hashedPassword,
        name: 'كريم مدير منصة فرحنا',
        role: 'super_admin',
        isActive: true,
      },
    });
    console.log(`✅ Super Admin created successfully for: ${superAdminEmail}`);
  }

  const allUsers = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, isActive: true },
  });
  console.log('Current Admin Users in Database:', allUsers);
}

syncSuperAdmin()
  .catch((err) => {
    console.error('Error syncing super admin:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
