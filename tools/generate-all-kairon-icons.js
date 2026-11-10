#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const SVG_SOURCE = path.join(ROOT_DIR, 'src/assets/icons/sp.svg');

/**
 * Packs multiple PNG buffers of various resolutions into a single valid Windows .ICO file.
 * Compatible with Vista, Windows 7, 8, 10, 11 and Electron.
 */
function createIco(pngItems) {
  const count = pngItems.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4); // Number of images

  const dirEntrySize = 16;
  let offset = 6 + count * dirEntrySize;

  const entries = [];
  for (const item of pngItems) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // Size
    entry.writeUInt32LE(offset, 12); // Offset
    entries.push(entry);
    offset += item.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngItems.map((i) => i.buffer)]);
}

async function run() {
  console.log('🚀 Starting KaironTask Icon Generator...');

  if (!fs.existsSync(SVG_SOURCE)) {
    throw new Error(`SVG source not found: ${SVG_SOURCE}`);
  }

  const svgBuffer = fs.readFileSync(SVG_SOURCE);

  // 1. High-res transparent master PNG (2048x2048)
  console.log('📦 Rendering master 2048x2048 transparent PNG...');
  const transparentMasterBuffer = await sharp(svgBuffer, { density: 600 })
    .resize(2048, 2048, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // 2. High-res solid square master PNG (2160x2160) on deep sleek dark slate (#0F172A)
  console.log('📦 Rendering master 2160x2160 square PNG with dark slate background...');
  const iconOnSquare = await sharp(svgBuffer, { density: 600 })
    .resize(1500, 1500, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const squareMasterBuffer = await sharp({
    create: {
      width: 2160,
      height: 2160,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 1 }, // #0F172A
    },
  })
    .composite([
      {
        input: iconOnSquare,
        gravity: 'center',
      },
    ])
    .png()
    .toBuffer();

  // Save square masters in build/icons
  console.log('💾 Saving build/icons sq* files...');
  fs.writeFileSync(
    path.join(ROOT_DIR, 'build/icons/sq2160x2160.png'),
    squareMasterBuffer,
  );
  fs.writeFileSync(
    path.join(ROOT_DIR, 'build/icons/sq1080x1080.png'),
    await sharp(squareMasterBuffer).resize(1080, 1080).png().toBuffer(),
  );
  fs.writeFileSync(
    path.join(ROOT_DIR, 'build/icons/sq300x300.png'),
    await sharp(squareMasterBuffer).resize(300, 300).png().toBuffer(),
  );

  // 3. Transparent icons in build/icons/
  console.log('💾 Saving build/icons transparent resolutions...');
  const buildSizes = [16, 24, 32, 48, 64, 128, 256, 300, 512, 1024, 1080];
  for (const size of buildSizes) {
    const resized = await sharp(transparentMasterBuffer)
      .resize(size, size, { fit: 'contain' })
      .png()
      .toBuffer();
    fs.writeFileSync(path.join(ROOT_DIR, `build/icons/${size}x${size}.png`), resized);
  }

  // Also root build/ files
  const p512 = path.join(ROOT_DIR, 'build/icons/512x512.png');
  fs.copyFileSync(p512, path.join(ROOT_DIR, 'build/512x512.png'));
  fs.copyFileSync(p512, path.join(ROOT_DIR, 'build/icon.png'));

  // 4. Generate build/icon.ico for Windows desktop executable
  console.log('🪟 Generating build/icon.ico (multi-resolution)...');
  const icoSizes = [16, 24, 32, 48, 64, 128, 256];
  const icoItems = [];
  for (const size of icoSizes) {
    const buf = await sharp(transparentMasterBuffer)
      .resize(size, size, { fit: 'contain' })
      .png()
      .toBuffer();
    icoItems.push({ width: size, height: size, buffer: buf });
  }
  const electronIco = createIco(icoItems);
  fs.writeFileSync(path.join(ROOT_DIR, 'build/icon.ico'), electronIco);

  // 5. Generate Web / PWA icons in src/assets/icons/
  console.log('🌐 Generating src/assets/icons/ web & PWA assets...');
  const webSizes = [72, 96, 128, 144, 192, 512];
  for (const size of webSizes) {
    const resized = await sharp(transparentMasterBuffer)
      .resize(size, size, { fit: 'contain' })
      .png()
      .toBuffer();
    fs.writeFileSync(
      path.join(ROOT_DIR, `src/assets/icons/icon-${size}x${size}.png`),
      resized,
    );
  }

  // Favicons PNG
  fs.writeFileSync(
    path.join(ROOT_DIR, 'src/assets/icons/favicon-16x16.png'),
    await sharp(transparentMasterBuffer).resize(16, 16).png().toBuffer(),
  );
  fs.writeFileSync(
    path.join(ROOT_DIR, 'src/assets/icons/favicon-32x32.png'),
    await sharp(transparentMasterBuffer).resize(32, 32).png().toBuffer(),
  );
  fs.writeFileSync(
    path.join(ROOT_DIR, 'src/assets/icons/favicon-192x192.png'),
    await sharp(transparentMasterBuffer).resize(192, 192).png().toBuffer(),
  );

  // Apple touch icon (180x180 with solid dark background)
  const appleTouch = await sharp(squareMasterBuffer)
    .resize(180, 180, { fit: 'cover' })
    .removeAlpha()
    .png()
    .toBuffer();
  fs.writeFileSync(
    path.join(ROOT_DIR, 'src/assets/icons/apple-touch-icon.png'),
    appleTouch,
  );

  // mstile-150x150.png
  fs.writeFileSync(
    path.join(ROOT_DIR, 'src/assets/icons/mstile-150x150.png'),
    await sharp(transparentMasterBuffer).resize(150, 150).png().toBuffer(),
  );

  // src/favicon.ico
  console.log('🌐 Generating src/favicon.ico...');
  const faviconIco = createIco(icoItems.filter((i) => [16, 32, 48].includes(i.width)));
  fs.writeFileSync(path.join(ROOT_DIR, 'src/favicon.ico'), faviconIco);

  // 6. Generate Android Mipmaps in android/app/src/main/res/
  console.log('🤖 Generating Android mipmap launcher icons...');
  const androidMipmaps = [
    { dir: 'mipmap-mdpi', size: 48 },
    { dir: 'mipmap-hdpi', size: 72 },
    { dir: 'mipmap-xhdpi', size: 96 },
    { dir: 'mipmap-xxhdpi', size: 144 },
    { dir: 'mipmap-xxxhdpi', size: 192 },
  ];

  for (const { dir, size } of androidMipmaps) {
    const targetDir = path.join(ROOT_DIR, 'android/app/src/main/res', dir);
    if (fs.existsSync(targetDir)) {
      // ic_launcher.png (square with background)
      const launcherBuf = await sharp(squareMasterBuffer)
        .resize(size, size, { fit: 'cover' })
        .png()
        .toBuffer();
      fs.writeFileSync(path.join(targetDir, 'ic_launcher.png'), launcherBuf);

      // ic_launcher_round.png (circular mask)
      const circleSvg = Buffer.from(
        `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff" /></svg>`,
      );
      const roundBuf = await sharp(launcherBuf)
        .composite([{ input: circleSvg, blend: 'dest-in' }])
        .png()
        .toBuffer();
      fs.writeFileSync(path.join(targetDir, 'ic_launcher_round.png'), roundBuf);
    }
  }

  // 7. Generate Electron Tray & Indicator Icons
  console.log('⚡ Generating Electron Tray and Indicator assets...');
  const electronIconsDir = path.join(ROOT_DIR, 'electron/assets/icons');
  const indicatorDir = path.join(electronIconsDir, 'indicator');
  const svgWhiteSource = path.join(ROOT_DIR, 'src/assets/icons/sp-white.svg');
  const svgWhiteBuffer = fs.existsSync(svgWhiteSource)
    ? fs.readFileSync(svgWhiteSource)
    : svgBuffer;

  // icon_256x256.png
  fs.writeFileSync(
    path.join(electronIconsDir, 'icon_256x256.png'),
    await sharp(transparentMasterBuffer).resize(256, 256).png().toBuffer(),
  );

  // White icon for dark tray / taskbar
  const whiteIcon16 = await sharp(svgWhiteBuffer, { density: 300 })
    .resize(16, 16)
    .png()
    .toBuffer();
  const whiteIcon32 = await sharp(svgWhiteBuffer, { density: 300 })
    .resize(32, 32)
    .png()
    .toBuffer();
  // Dark icon for light tray / taskbar
  const darkIcon16 = await sharp(svgBuffer, { density: 300 })
    .resize(16, 16)
    .png()
    .toBuffer();
  const darkIcon32 = await sharp(svgBuffer, { density: 300 })
    .resize(32, 32)
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(electronIconsDir, 'tray-ico-d.png'), whiteIcon16);
  fs.writeFileSync(path.join(electronIconsDir, 'tray-ico-d@2x.png'), whiteIcon32);
  fs.writeFileSync(path.join(electronIconsDir, 'tray-ico-l.png'), darkIcon16);
  fs.writeFileSync(path.join(electronIconsDir, 'tray-ico-l@2x.png'), darkIcon32);

  if (fs.existsSync(indicatorDir)) {
    fs.writeFileSync(path.join(indicatorDir, 'running-d.png'), whiteIcon16);
    fs.writeFileSync(path.join(indicatorDir, 'running-d@2x.png'), whiteIcon32);
    fs.writeFileSync(path.join(indicatorDir, 'running-l.png'), darkIcon16);
    fs.writeFileSync(path.join(indicatorDir, 'running-l@2x.png'), darkIcon32);
    fs.writeFileSync(path.join(indicatorDir, 'stopped-d.png'), whiteIcon16);
    fs.writeFileSync(path.join(indicatorDir, 'stopped-d@2x.png'), whiteIcon32);
    fs.writeFileSync(path.join(indicatorDir, 'stopped-l.png'), darkIcon16);
    fs.writeFileSync(path.join(indicatorDir, 'stopped-l@2x.png'), darkIcon32);
  }

  // 8. Generate Windows Store AppX Assets
  console.log('🪟 Generating Windows Store AppX assets in build/appx/...');
  const appxDir = path.join(ROOT_DIR, 'build/appx');
  if (fs.existsSync(appxDir)) {
    const appxFiles = fs.readdirSync(appxDir);
    for (const file of appxFiles) {
      if (!file.endsWith('.png')) continue;
      const targetPath = path.join(appxDir, file);
      const meta = await sharp(targetPath).metadata();
      const w = meta.width;
      const h = meta.height;

      if (file.startsWith('BadgeLogo')) {
        // Monochrome white on transparent
        const badgeBuf = await sharp(svgWhiteBuffer, { density: 300 })
          .resize(w, h, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
        fs.writeFileSync(targetPath, badgeBuf);
      } else if (file.startsWith('SplashScreen') || file.startsWith('Wide')) {
        // Wide canvas on dark slate (#0F172A)
        const iconH = Math.round(h * 0.7);
        const iconBuf = await sharp(svgBuffer, { density: 300 })
          .resize(iconH, iconH, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .png()
          .toBuffer();
        const wideBuf = await sharp({
          create: {
            width: w,
            height: h,
            channels: 4,
            background: { r: 15, g: 23, b: 42, alpha: 1 },
          },
        })
          .composite([{ input: iconBuf, gravity: 'center' }])
          .png()
          .toBuffer();
        fs.writeFileSync(targetPath, wideBuf);
      } else {
        // Square tiles with background
        const squareBuf = await sharp(squareMasterBuffer)
          .resize(w, h, { fit: 'cover' })
          .png()
          .toBuffer();
        fs.writeFileSync(targetPath, squareBuf);
      }
    }
  }

  // 9. Run tools/generate-mac-icon.js and tools/generate-ios-icon.js
  console.log('🍎 Generating macOS .icns and iOS icon assets...');
  try {
    execSync('node tools/generate-mac-icon.js', { cwd: ROOT_DIR, stdio: 'inherit' });
  } catch (err) {
    console.warn(
      '⚠️ Warning: tools/generate-mac-icon.js failed (non-critical on Windows):',
      err.message,
    );
  }

  try {
    execSync('node tools/generate-ios-icon.js', { cwd: ROOT_DIR, stdio: 'inherit' });
  } catch (err) {
    console.warn(
      '⚠️ Warning: tools/generate-ios-icon.js failed (non-critical):',
      err.message,
    );
  }

  console.log(
    '\n✨ All KaironTask icons generated successfully across Web, Desktop, Android, and iOS!\n',
  );
}

run().catch((err) => {
  console.error('❌ Icon generation failed:', err);
  process.exit(1);
});
