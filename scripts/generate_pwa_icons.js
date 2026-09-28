const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'apps', 'web', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function createIconSvg(size, isMaskable = false) {
  const padding = isMaskable ? Math.round(size * 0.15) : Math.round(size * 0.05);
  const innerSize = size - padding * 2;
  const radius = isMaskable ? 0 : Math.round(size * 0.22);

  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B0E30" />
      <stop offset="60%" stop-color="#720925" />
      <stop offset="100%" stop-color="#420414" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF2D6" />
      <stop offset="50%" stop-color="#D4AF37" />
      <stop offset="100%" stop-color="#AA820A" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="${Math.round(size * 0.02)}" stdDeviation="${Math.round(size * 0.03)}" flood-color="rgba(0,0,0,0.5)" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="100%" height="100%" fill="#720925" />

  ${
    !isMaskable
      ? `<rect x="${padding}" y="${padding}" width="${innerSize}" height="${innerSize}" rx="${radius}" fill="url(#bg)" stroke="url(#gold)" stroke-width="${Math.max(2, Math.round(size * 0.025))}" />`
      : `<circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.4}" fill="url(#bg)" stroke="url(#gold)" stroke-width="${Math.max(2, Math.round(size * 0.025))}" />`
  }

  <!-- Stylized Diamond / Ring Motif -->
  <g transform="translate(${size / 2}, ${size * 0.38})" filter="url(#shadow)">
    <!-- Ring circle -->
    <circle cx="0" cy="0" r="${size * 0.13}" fill="none" stroke="url(#gold)" stroke-width="${Math.round(size * 0.035)}" />
    <!-- Sparkle diamond on top -->
    <path d="M 0,${-size * 0.17} L ${size * 0.04},${-size * 0.13} L 0,${-size * 0.09} L ${-size * 0.04},${-size * 0.13} Z" fill="#FFF8E7" stroke="url(#gold)" stroke-width="${Math.max(1, Math.round(size * 0.01))}" />
  </g>

  <!-- Farahna Letter "ف" / Title Text -->
  <text
    x="${size / 2}"
    y="${size * 0.76}"
    font-size="${Math.round(size * 0.22)}"
    font-weight="900"
    fill="#FFFFFF"
    text-anchor="middle"
    font-family="Segoe UI, Tahoma, Cairo, Arial, sans-serif"
    filter="url(#shadow)"
  >
    فرحنا
  </text>
</svg>
`;
}

async function generateAllIcons() {
  const configs = [
    { name: 'icon-192.png', size: 192, maskable: false },
    { name: 'icon-512.png', size: 512, maskable: false },
    { name: 'icon-maskable.png', size: 512, maskable: true },
    { name: 'apple-touch-icon.png', size: 180, maskable: false },
    { name: 'favicon.png', size: 64, maskable: false },
  ];

  for (const c of configs) {
    const svg = createIconSvg(c.size, c.maskable);
    const dest = path.join(publicDir, c.name);
    await sharp(Buffer.from(svg)).png().toFile(dest);
    console.log(`✅ Generated ${c.name} (${c.size}x${c.size}) at ${dest}`);
  }
}

generateAllIcons().catch(console.error);
