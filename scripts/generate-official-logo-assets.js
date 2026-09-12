const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ---- CRC32 & PNG Encoding ----
function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      table[n] = c;
    }
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function decodePNG(filePath) {
  const buf = fs.readFileSync(filePath);
  let pos = 8;
  let idatList = [];
  let width = 0, height = 0;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.slice(pos + 4, pos + 8).toString('ascii');
    if (type === 'IHDR') {
      width = buf.readUInt32BE(pos + 8);
      height = buf.readUInt32BE(pos + 12);
    } else if (type === 'IDAT') {
      idatList.push(buf.slice(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }
  const decompressed = zlib.inflateSync(Buffer.concat(idatList));
  const bpp = 4;
  const stride = width * bpp + 1;
  const rawData = Buffer.alloc(width * height * bpp);
  let prevRow = Buffer.alloc(width * bpp);
  for (let y = 0; y < height; y++) {
    const filter = decompressed[y * stride];
    const row = decompressed.slice(y * stride + 1, (y + 1) * stride);
    const uncompressedRow = Buffer.alloc(width * bpp);
    for (let x = 0; x < width * bpp; x++) {
      const rawByte = row[x];
      const left = x >= bpp ? uncompressedRow[x - bpp] : 0;
      const up = prevRow[x];
      const upLeft = x >= bpp ? prevRow[x - bpp] : 0;
      let val = 0;
      if (filter === 0) val = rawByte;
      else if (filter === 1) val = (rawByte + left) & 0xff;
      else if (filter === 2) val = (rawByte + up) & 0xff;
      else if (filter === 3) val = (rawByte + Math.floor((left + up) / 2)) & 0xff;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        let pr = left;
        if (pb < pa && pb <= pc) pr = up;
        else if (pc < pa && pc <= pb) pr = upLeft;
        val = (rawByte + pr) & 0xff;
      }
      uncompressedRow[x] = val;
    }
    uncompressedRow.copy(rawData, y * width * bpp);
    uncompressedRow.copy(prevRow, 0);
  }
  return { width, height, data: rawData };
}

// ---- Canvas Builder ----
function makeCanvas(width, height) {
  return {
    width,
    height,
    data: Buffer.alloc(width * height * 4),
    fillBackground(r, g, b, a = 255) {
      for (let i = 0; i < width * height; i++) {
        this.data[i * 4] = r;
        this.data[i * 4 + 1] = g;
        this.data[i * 4 + 2] = b;
        this.data[i * 4 + 3] = a;
      }
    },
    drawImage(src, destX, destY, destW, destH) {
      const scaleX = src.width / destW;
      const scaleY = src.height / destH;

      for (let dy = 0; dy < destH; dy++) {
        const cy = destY + dy;
        if (cy < 0 || cy >= this.height) continue;

        for (let dx = 0; dx < destW; dx++) {
          const cx = destX + dx;
          if (cx < 0 || cx >= this.width) continue;

          const sx = dx * scaleX;
          const sy = dy * scaleY;
          const sxFloor = Math.floor(sx);
          const syFloor = Math.floor(sy);
          const fx = sx - sxFloor;
          const fy = sy - syFloor;

          const sxNext = Math.min(sxFloor + 1, src.width - 1);
          const syNext = Math.min(syFloor + 1, src.height - 1);

          const i00 = (syFloor * src.width + sxFloor) * 4;
          const i10 = (syFloor * src.width + sxNext) * 4;
          const i01 = (syNext * src.width + sxFloor) * 4;
          const i11 = (syNext * src.width + sxNext) * 4;

          const interp = (ch) => {
            const top = (1 - fx) * src.data[i00 + ch] + fx * src.data[i10 + ch];
            const bot = (1 - fx) * src.data[i01 + ch] + fx * src.data[i11 + ch];
            return (1 - fy) * top + fy * bot;
          };

          const sr = interp(0);
          const sg = interp(1);
          const sb = interp(2);
          const sa = interp(3) / 255;

          const destIdx = (cy * this.width + cx) * 4;
          const da = this.data[destIdx + 3] / 255;

          const outA = sa + da * (1 - sa);
          if (outA > 0) {
            this.data[destIdx] = Math.round((sr * sa + this.data[destIdx] * da * (1 - sa)) / outA);
            this.data[destIdx + 1] = Math.round((sg * sa + this.data[destIdx + 1] * da * (1 - sa)) / outA);
            this.data[destIdx + 2] = Math.round((sb * sa + this.data[destIdx + 2] * da * (1 - sa)) / outA);
            this.data[destIdx + 3] = Math.round(outA * 255);
          }
        }
      }
    },
  };
}

// ---- Main Pipeline ----
const srcImagePath = '/Users/yashchoudhary/.gemini/antigravity/brain/7f31b10b-a4f0-4f01-8f02-d709fd5cc293/.user_uploaded/media_1789010857023.png';
if (!fs.existsSync(srcImagePath)) {
  console.error('Source image not found at ' + srcImagePath);
  process.exit(1);
}

const rawSource = decodePNG(srcImagePath);
console.log(`Loaded source image: ${rawSource.width}x${rawSource.height}`);

// Step 1: Create Transparent Brand Logo by removing white background with clean alpha de-multiplication
const transparentLogoData = Buffer.alloc(rawSource.width * rawSource.height * 4);
const whiteLogoData = Buffer.alloc(rawSource.width * rawSource.height * 4);

for (let i = 0; i < rawSource.width * rawSource.height; i++) {
  const idx = i * 4;
  const r = rawSource.data[idx];
  const g = rawSource.data[idx + 1];
  const b = rawSource.data[idx + 2];

  // Alpha is proportional to darkness (distance from pure white)
  const minVal = Math.min(r, g, b);
  let alpha = 0;
  if (minVal < 250) {
    alpha = (255 - minVal) / 255;
    alpha = Math.min(1, Math.pow(alpha, 0.85) * 1.08);
  }

  const aByte = Math.round(alpha * 255);

  if (aByte > 0) {
    const unmult = (c) => {
      const fg = (c - 255 * (1 - alpha)) / alpha;
      return Math.round(Math.max(0, Math.min(255, fg)));
    };

    const fgR = unmult(r);
    const fgG = unmult(g);
    const fgB = unmult(b);

    transparentLogoData[idx] = fgR;
    transparentLogoData[idx + 1] = fgG;
    transparentLogoData[idx + 2] = fgB;
    transparentLogoData[idx + 3] = aByte;

    // Green 'h' has fgG significantly higher than fgR and fgB
    const isGreenH = fgG > 80 && fgG > fgR * 1.3 && fgG > fgB * 1.1;

    if (isGreenH) {
      whiteLogoData[idx] = fgR;
      whiteLogoData[idx + 1] = fgG;
      whiteLogoData[idx + 2] = fgB;
      whiteLogoData[idx + 3] = aByte;
    } else {
      whiteLogoData[idx] = 255;
      whiteLogoData[idx + 1] = 255;
      whiteLogoData[idx + 2] = 255;
      whiteLogoData[idx + 3] = aByte;
    }
  } else {
    transparentLogoData[idx + 3] = 0;
    whiteLogoData[idx + 3] = 0;
  }
}

// Step 2: Extract Tight Cropped Foreground Bounding Box
let minX = rawSource.width, maxX = 0, minY = rawSource.height, maxY = 0;
for (let y = 0; y < rawSource.height; y++) {
  for (let x = 0; x < rawSource.width; x++) {
    const idx = (y * rawSource.width + x) * 4;
    if (transparentLogoData[idx + 3] > 20) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log(`Foreground bounds: (${minX}, ${minY}) to (${maxX}, ${maxY}) -> ${maxX - minX + 1}x${maxY - minY + 1}`);

// Add an 8px cushion around cropped logo
const pad = 8;
const cropX = Math.max(0, minX - pad);
const cropY = Math.max(0, minY - pad);
const cropW = Math.min(rawSource.width - cropX, (maxX - minX + 1) + pad * 2);
const cropH = Math.min(rawSource.height - cropY, (maxY - minY + 1) + pad * 2);

const croppedLogoData = Buffer.alloc(cropW * cropH * 4);
const croppedWhiteLogoData = Buffer.alloc(cropW * cropH * 4);
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcIdx = ((cropY + y) * rawSource.width + (cropX + x)) * 4;
    const destIdx = (y * cropW + x) * 4;
    transparentLogoData.copy(croppedLogoData, destIdx, srcIdx, srcIdx + 4);
    whiteLogoData.copy(croppedWhiteLogoData, destIdx, srcIdx, srcIdx + 4);
  }
}

const croppedLogo = { width: cropW, height: cropH, data: croppedLogoData };
const croppedWhiteLogo = { width: cropW, height: cropH, data: croppedWhiteLogoData };
console.log(`Cropped wordmark: ${cropW}x${cropH} (aspect ratio: ${(cropW / cropH).toFixed(2)})`);

// ---- Asset Generators ----

// 1. App Icon (1024x1024, crisp solid #FFFFFF canvas, locked official logo centered with ~15% safe margin)
function generateAppIcon() {
  const size = 1024;
  const canvas = makeCanvas(size, size);
  canvas.fillBackground(255, 255, 255, 255);

  const drawW = 740;
  const drawH = Math.round(drawW * (cropH / cropW));
  const offsetX = Math.round((size - drawW) / 2);
  const offsetY = Math.round((size - drawH) / 2);

  canvas.drawImage(croppedLogo, offsetX, offsetY, drawW, drawH);
  return encodePNG(size, size, canvas.data);
}

// 2. Android Adaptive Icon Foreground (1024x1024, centered inside 66% safe area)
function generateAdaptiveIcon() {
  const size = 1024;
  const canvas = makeCanvas(size, size);
  canvas.fillBackground(255, 255, 255, 255);

  const drawW = 600;
  const drawH = Math.round(drawW * (cropH / cropW));
  const offsetX = Math.round((size - drawW) / 2);
  const offsetY = Math.round((size - drawH) / 2);

  canvas.drawImage(croppedLogo, offsetX, offsetY, drawW, drawH);
  return encodePNG(size, size, canvas.data);
}

// 3. Native Splash Screen (1284x2778, pure white #FFFFFF canvas, logo centered)
function generateSplashScreen() {
  const w = 1284;
  const h = 2778;
  const canvas = makeCanvas(w, h);
  canvas.fillBackground(255, 255, 255, 255);

  const drawW = 720;
  const drawH = Math.round(drawW * (cropH / cropW));
  const offsetX = Math.round((w - drawW) / 2);
  const offsetY = Math.round((h - drawH) / 2);

  canvas.drawImage(croppedLogo, offsetX, offsetY, drawW, drawH);
  return encodePNG(w, h, canvas.data);
}

// 4. Web Favicon (48x48)
function generateFavicon() {
  const size = 48;
  const canvas = makeCanvas(size, size);
  canvas.fillBackground(255, 255, 255, 255);

  const drawW = 44;
  const drawH = Math.round(drawW * (cropH / cropW));
  const offsetX = Math.round((size - drawW) / 2);
  const offsetY = Math.round((size - drawH) / 2);

  canvas.drawImage(croppedLogo, offsetX, offsetY, drawW, drawH);
  return encodePNG(size, size, canvas.data);
}

// 5. Native Android splashscreen_logo.png variants
function generateAndroidSplashLogo(targetW, targetH) {
  const canvas = makeCanvas(targetW, targetH);
  canvas.fillBackground(255, 255, 255, 0);

  const drawW = Math.round(targetW * 0.88);
  const drawH = Math.round(drawW * (cropH / cropW));
  const offsetX = Math.round((targetW - drawW) / 2);
  const offsetY = Math.round((targetH - drawH) / 2);

  canvas.drawImage(croppedLogo, offsetX, offsetY, drawW, drawH);
  return encodePNG(targetW, targetH, canvas.data);
}

// Generate all target files
const projectRoot = path.join(__dirname, '..');

const outputs = [
  // Brand Logos
  { path: 'assets/brand/rehvo-logo.png', data: encodePNG(croppedLogo.width, croppedLogo.height, croppedLogo.data) },
  { path: 'assets/brand/rehvo-logo-white.png', data: encodePNG(croppedWhiteLogo.width, croppedWhiteLogo.height, croppedWhiteLogo.data) },
  { path: 'web/public/rehvo-logo.png', data: encodePNG(croppedLogo.width, croppedLogo.height, croppedLogo.data) },
  { path: 'web/public/rehvo-logo-white.png', data: encodePNG(croppedWhiteLogo.width, croppedWhiteLogo.height, croppedWhiteLogo.data) },

  // Expo Root Assets
  { path: 'assets/icon.png', data: generateAppIcon() },
  { path: 'assets/adaptive-icon.png', data: generateAdaptiveIcon() },
  { path: 'assets/splash.png', data: generateSplashScreen() },
  { path: 'assets/favicon.png', data: generateFavicon() },

  // Web Public
  { path: 'web/public/icon.png', data: generateAppIcon() },
  { path: 'web/public/favicon.ico', data: generateFavicon() },

  // iOS Native xcassets
  { path: 'ios/REHVO/Images.xcassets/AppIcon.appiconset/App-Icon-1024x1024@1x.png', data: generateAppIcon() },
  { path: 'ios/REHVO/Images.xcassets/SplashScreenLegacy.imageset/image.png', data: generateAndroidSplashLogo(200, Math.round(200 * cropH / cropW)) },
  { path: 'ios/REHVO/Images.xcassets/SplashScreenLegacy.imageset/image@2x.png', data: generateAndroidSplashLogo(400, Math.round(400 * cropH / cropW)) },
  { path: 'ios/REHVO/Images.xcassets/SplashScreenLegacy.imageset/image@3x.png', data: generateAndroidSplashLogo(600, Math.round(600 * cropH / cropW)) },

  // Android Native Drawables
  { path: 'android/app/src/main/res/drawable-mdpi/splashscreen_logo.png', data: generateAndroidSplashLogo(160, 60) },
  { path: 'android/app/src/main/res/drawable-hdpi/splashscreen_logo.png', data: generateAndroidSplashLogo(240, 90) },
  { path: 'android/app/src/main/res/drawable-xhdpi/splashscreen_logo.png', data: generateAndroidSplashLogo(320, 120) },
  { path: 'android/app/src/main/res/drawable-xxhdpi/splashscreen_logo.png', data: generateAndroidSplashLogo(480, 180) },
  { path: 'android/app/src/main/res/drawable-xxxhdpi/splashscreen_logo.png', data: generateAndroidSplashLogo(640, 240) },
];

console.log('Writing generated assets...');
for (const item of outputs) {
  const fullPath = path.join(projectRoot, item.path);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, item.data);
  console.log(`✓ Generated ${item.path} (${item.data.length} bytes)`);
}

console.log('\nAll official REHVO logo and icon assets successfully generated!');
