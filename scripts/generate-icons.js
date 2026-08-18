/**
 * Generates REHVO-branded PNG icon & splash assets from the CANONICAL approved brand logo:
 * assets/brand/rehvo-logo.png
 *
 * Output targets:
 * - assets/icon.png (1024x1024 iOS/Universal App Icon)
 * - assets/adaptive-icon.png (1024x1024 Android Adaptive Icon Foreground, safe-area centered)
 * - assets/splash.png (1284x2778 Native Splash Screen on #F8F7F4 ivory canvas)
 * - assets/favicon.png (48x48 Web Favicon)
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ---- CRC32 Implementation ----
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
  ihdr[8] = 8;  // 8-bit depth
  ihdr[9] = 6;  // RGBA color type
  ihdr[10] = 0; // deflate compression
  ihdr[11] = 0; // default filter
  ihdr[12] = 0; // non-interlaced

  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // filter byte 0 (None)
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

// ---- Decode Source PNG to Raw RGBA Buffer ----
function decodePNG(filePath) {
  const buf = fs.readFileSync(filePath);
  let pos = 8;
  let idatList = [];
  let width = 0;
  let height = 0;

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
    // Draw an image onto canvas with bilinear resampling & alpha blending
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

          // Alpha compositing
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

// ---- Main Generation ----
const assetsDir = path.join(__dirname, '..', 'assets');
const logoPath = path.join(assetsDir, 'brand', 'rehvo-logo.png');

if (!fs.existsSync(logoPath)) {
  console.error('Error: Locked canonical logo not found at ' + logoPath);
  process.exit(1);
}

console.log('Reading approved canonical logo from:', logoPath);
const logo = decodePNG(logoPath);
console.log(`Decoded source logo: ${logo.width}x${logo.height}`);

// 1. icon.png (1024x1024, crisp ivory/white canvas, locked logo centered with comfortable safe-margin)
function generateIcon() {
  const size = 1024;
  const canvas = makeCanvas(size, size);
  // Pure white or warm ivory background
  canvas.fillBackground(255, 255, 255, 255);
  // Logo target size: 840x840 centered (approx 82% of canvas)
  const drawSize = 840;
  const offset = Math.round((size - drawSize) / 2);
  canvas.drawImage(logo, offset, offset, drawSize, drawSize);
  return encodePNG(size, size, canvas.data);
}

// 2. adaptive-icon.png (1024x1024, Android adaptive icon safe zone ~66% center)
function generateAdaptiveIcon() {
  const size = 1024;
  const canvas = makeCanvas(size, size);
  canvas.fillBackground(255, 255, 255, 255);
  // Safe zone for Android adaptive icon is inner 66% (675px)
  const drawSize = 670;
  const offset = Math.round((size - drawSize) / 2);
  canvas.drawImage(logo, offset, offset, drawSize, drawSize);
  return encodePNG(size, size, canvas.data);
}

// 3. splash.png (1284x2778, background #F8F7F4 matching app theme, locked logo centered)
function generateSplash() {
  const w = 1284;
  const h = 2778;
  const canvas = makeCanvas(w, h);
  // #F8F7F4 -> r: 248, g: 247, b: 244
  canvas.fillBackground(248, 247, 244, 255);
  // Logo width ~ 760px centered
  const drawW = 760;
  const drawH = 760;
  const offsetX = Math.round((w - drawW) / 2);
  const offsetY = Math.round((h - drawH) / 2);
  canvas.drawImage(logo, offsetX, offsetY, drawW, drawH);
  return encodePNG(w, h, canvas.data);
}

// 4. favicon.png (48x48 web favicon)
function generateFavicon() {
  const size = 48;
  const canvas = makeCanvas(size, size);
  canvas.fillBackground(255, 255, 255, 0); // transparent background
  canvas.drawImage(logo, 2, 2, 44, 44);
  return encodePNG(size, size, canvas.data);
}

const outputs = {
  'icon.png': generateIcon(),
  'adaptive-icon.png': generateAdaptiveIcon(),
  'splash.png': generateSplash(),
  'favicon.png': generateFavicon(),
};

for (const [filename, data] of Object.entries(outputs)) {
  const targetPath = path.join(assetsDir, filename);
  fs.writeFileSync(targetPath, data);
  console.log(`Generated ${filename} (${data.length} bytes)`);
}

console.log('✓ All REHVO app icons and splash assets updated with locked brand logo.');