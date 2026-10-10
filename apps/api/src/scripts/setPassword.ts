import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

function generateSecurePassword(length = 16): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()_+~|}{[]';
  const all = upper + lower + digits + symbols;

  let pwd = '';
  // Ensure at least one of each class
  pwd += upper[crypto.randomInt(upper.length)];
  pwd += lower[crypto.randomInt(lower.length)];
  pwd += digits[crypto.randomInt(digits.length)];
  pwd += symbols[crypto.randomInt(symbols.length)];

  for (let i = 4; i < length; i++) {
    pwd += all[crypto.randomInt(all.length)];
  }

  // Shuffle characters
  return pwd.split('').sort(() => 0.5 - Math.random()).join('');
}

async function main() {
  const email = process.argv[2];
  let newPassword = process.argv[3];

  if (!email) {
    console.log(`
=============================================================
👑 Farahna Production Password Utility
=============================================================
Usage:
  npx tsx src/scripts/setPassword.ts <email> [new_password]

Examples:
  npx tsx src/scripts/setPassword.ts admin@farahna.com
  npx tsx src/scripts/setPassword.ts admin@farahna.com "MySecureP@ss2026!"
=============================================================
`);
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!user) {
    console.error(`❌ Error: User with email "${email}" not found in database!`);
    process.exit(1);
  }

  if (!newPassword) {
    newPassword = generateSecurePassword(16);
    console.log(`ℹ️ No password provided. Generated high-entropy production password.`);
  }

  if (newPassword.length < 8) {
    console.error(`❌ Error: Password must be at least 8 characters long!`);
    process.exit(1);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  console.log(`
=============================================================
✅ PASSWORD UPDATED SUCCESSFULLY
=============================================================
User Name: ${user.name}
Email:     ${user.email}
Role:      ${user.role}
Password:  ${newPassword}
=============================================================
⚠️  Make sure to save this password in your secure password manager!
`);
}

main()
  .catch((err) => {
    console.error('❌ Failed to update password:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
