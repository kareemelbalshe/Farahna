const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sourceImage = 'C:\\Users\\11\\.gemini\\antigravity-ide\\brain\\1ccb60ff-08a7-4f03-96d1-37b19c6d6e47\\farahna_luxury_logo_1791576602134.jpg';
const publicDir = path.join(__dirname, '..', 'public');
const appDir = path.join(__dirname, '..', 'src', 'app');

async function main() {
  if (!fs.existsSync(sourceImage)) {
    console.error('Source image does not exist:', sourceImage);
    process.exit(1);
  }

  console.log('Processing Farahna luxury logo assets...');

  // 1. High-Res Luxury JPG
  const destJpg = path.join(publicDir, 'farahna-logo.jpg');
  await sharp(sourceImage)
    .jpeg({ quality: 96 })
    .toFile(destJpg);
  console.log('✓ Created:', destJpg);

  // 2. High-Res Luxury PNG
  const destPng = path.join(publicDir, 'farahna-logo.png');
  await sharp(sourceImage)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(destPng);
  console.log('✓ Created:', destPng);

  // 3. Browser Tab Icons & Favicons
  // The emblem is centered around the upper-middle area (crown + rings + heart).
  // For small tab icons (16px, 32px, 64px, 180px, 192px), resizing with high sharpness ensures
  // the gold crown and rings stand out brilliantly in browser tabs!

  // App Icon (Next.js App Router automatically uses src/app/icon.png)
  const appIcon = path.join(appDir, 'icon.png');
  await sharp(sourceImage)
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(appIcon);
  console.log('✓ Created Next.js App Router icon:', appIcon);

  // Favicon PNG (32x32 & 48x48)
  const favicon32 = path.join(publicDir, 'favicon.png');
  await sharp(sourceImage)
    .resize(64, 64, { fit: 'cover' })
    .png()
    .toFile(favicon32);
  console.log('✓ Created:', favicon32);

  // Apple Touch Icon (180x180)
  const appleTouch = path.join(publicDir, 'apple-touch-icon.png');
  await sharp(sourceImage)
    .resize(180, 180, { fit: 'cover' })
    .png()
    .toFile(appleTouch);
  console.log('✓ Created:', appleTouch);

  // PWA 192x192
  const icon192 = path.join(publicDir, 'icon-192.png');
  await sharp(sourceImage)
    .resize(192, 192, { fit: 'cover' })
    .png()
    .toFile(icon192);
  console.log('✓ Created:', icon192);

  // PWA 512x512
  const icon512 = path.join(publicDir, 'icon-512.png');
  await sharp(sourceImage)
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(icon512);
  console.log('✓ Created:', icon512);

  // Favicon.ico
  // Write a 32x32 PNG to favicon.ico (modern browsers accept PNG in .ico)
  const faviconIco = path.join(publicDir, 'favicon.ico');
  await sharp(sourceImage)
    .resize(32, 32, { fit: 'cover' })
    .toFormat('png')
    .toFile(faviconIco);
  console.log('✓ Created:', faviconIco);

  // Also copy to root src/app/favicon.ico so Next.js serves it directly
  const appFaviconIco = path.join(appDir, 'favicon.ico');
  await sharp(sourceImage)
    .resize(32, 32, { fit: 'cover' })
    .toFormat('png')
    .toFile(appFaviconIco);
  console.log('✓ Created Next.js App Router favicon:', appFaviconIco);

  console.log('🎉 All logo and browser tab assets generated successfully!');
}

main().catch(console.error);
