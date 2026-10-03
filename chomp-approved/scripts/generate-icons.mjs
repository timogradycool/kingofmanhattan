// Generates favicons, app icons, a social share image, and web-sized logo files
// from src/assets/chomp-approved.png. Run with: npm run icons
// (The logo and badge shown on the pages are resized automatically by Astro at build time;
// these files are for browsers, phones, link previews, and anywhere else you need the logo.)
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';

const SOURCE = 'src/assets/chomp-approved.png';
const OUT = 'public';
const CREAM = { r: 253, g: 248, b: 237, alpha: 1 };
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

await mkdir(`${OUT}/logo`, { recursive: true });

const resize = (size, opts = {}) =>
  sharp(SOURCE).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, ...opts });

// Transparent favicons
const icoSizes = [16, 32, 48];
const icoPngs = await Promise.all(icoSizes.map((s) => resize(s).png().toBuffer()));
await writeFile(`${OUT}/favicon.ico`, buildIco(icoPngs, icoSizes));
await resize(32).png().toFile(`${OUT}/favicon-32.png`);

// App icons (iOS ignores transparency, so give it a solid background with some padding)
await padded(180, 14, WHITE).toFile(`${OUT}/apple-touch-icon.png`);
await padded(192, 12, WHITE).toFile(`${OUT}/icon-192.png`);
await padded(512, 32, WHITE).toFile(`${OUT}/icon-512.png`);

// Web-sized logo + badge files
for (const size of [1024, 512, 256]) {
  await resize(size).png({ compressionLevel: 9, palette: true }).toFile(`${OUT}/logo/chomp-approved-${size}.png`);
  await resize(size).webp({ quality: 85 }).toFile(`${OUT}/logo/chomp-approved-${size}.webp`);
}
for (const size of [128, 64]) {
  await resize(size).png().toFile(`${OUT}/logo/badge-${size}.png`);
}

// Social share preview (1200x630)
const ogLogo = await resize(540).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: CREAM } })
  .composite([{ input: ogLogo, gravity: 'center' }])
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(`${OUT}/og-image.jpg`);

console.log('Icons and logo files written to public/');

function padded(size, pad, background) {
  return {
    async toFile(file) {
      const inner = await resize(size - pad * 2).png().toBuffer();
      return sharp({ create: { width: size, height: size, channels: 4, background } })
        .composite([{ input: inner, gravity: 'center' }])
        .png({ compressionLevel: 9, palette: true })
        .toFile(file);
    },
  };
}

// Minimal .ico writer: an ICO file can simply wrap PNG images.
function buildIco(pngs, sizes) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  pngs.forEach((png, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 0);
    e.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    entries.push(e);
  });
  return Buffer.concat([header, ...entries, ...pngs]);
}
