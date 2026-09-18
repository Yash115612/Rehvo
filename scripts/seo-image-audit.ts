import fs from 'fs';
import path from 'path';

interface AuditResult {
  file: string;
  rawImgTags: number;
  missingAlt: number;
  missingDimensions: number;
}

const SRC_DIR = path.join(__dirname, '../web/src');

function scanDirectory(dir: string, fileList: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.next', 'dist'].includes(entry.name)) {
        scanDirectory(fullPath, fileList);
      }
    } else if (/\.(tsx|jsx|ts|js)$/.test(entry.name)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function auditFiles(): void {
  console.log('🔍 Starting REHVO V18 Image & SEO Audit...\n');

  const files = scanDirectory(SRC_DIR);
  let totalRawImg = 0;
  let totalMissingAlt = 0;
  let totalMissingDimensions = 0;
  const issues: AuditResult[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');

    // 1. Audit raw <img> tags (excluding comments)
    const rawImgMatches = content.match(/<img[\s\S]*?>/gi) || [];
    const validRawImgs = rawImgMatches.filter((tag) => !tag.includes('{/*') && !tag.includes('//'));

    // 2. Audit next/image missing alt
    const imageTagMatches = content.match(/<Image[\s\S]*?\/>/gi) || [];
    let missingAltInFile = 0;
    let missingDimInFile = 0;

    for (const imgTag of imageTagMatches) {
      if (!/alt=(["'{]|`)/.test(imgTag)) {
        missingAltInFile++;
      }
      // Check if neither width/height nor fill is supplied
      if (!/fill/.test(imgTag) && (!/width=/.test(imgTag) || !/height=/.test(imgTag))) {
        missingDimInFile++;
      }
    }

    if (validRawImgs.length > 0 || missingAltInFile > 0 || missingDimInFile > 0) {
      issues.push({
        file: path.relative(path.join(__dirname, '..'), file),
        rawImgTags: validRawImgs.length,
        missingAlt: missingAltInFile,
        missingDimensions: missingDimInFile,
      });
      totalRawImg += validRawImgs.length;
      totalMissingAlt += missingAltInFile;
      totalMissingDimensions += missingDimInFile;
    }
  }

  console.log('====================================================');
  console.log('       REHVO PHASE 5 IMAGE SEO AUDIT REPORT         ');
  console.log('====================================================');
  console.log(`Total Source Files Scanned : ${files.length}`);
  console.log(`Raw <img> HTML Tags Found  : ${totalRawImg}`);
  console.log(`Images Missing Alt Text    : ${totalMissingAlt}`);
  console.log(`Images Missing Dimensions  : ${totalMissingDimensions}`);
  console.log('----------------------------------------------------');

  if (issues.length > 0) {
    console.log('Detailed Findings:');
    issues.forEach((issue) => {
      console.log(`- ${issue.file}: rawImg=${issue.rawImgTags}, missingAlt=${issue.missingAlt}, missingDimensions=${issue.missingDimensions}`);
    });
  }

  // Verify Image Sitemap
  const imageSitemapPath = path.join(__dirname, '../web/src/app/image-sitemap.xml/route.ts');
  const hasImageSitemap = fs.existsSync(imageSitemapPath);
  console.log(`Image Sitemap Route Exists : ${hasImageSitemap ? '✅ PASS' : '❌ FAIL'}`);

  // Verify localityData schema
  const localityDataPath = path.join(__dirname, '../web/src/lib/seo/localityData.ts');
  const localityContent = fs.readFileSync(localityDataPath, 'utf8');
  const hasPostalCode = localityContent.includes('postalCode:');
  const hasGeoShape = localityContent.includes('geoShape:');
  const hasNearby = localityContent.includes('nearbyLocalities:');

  console.log(`Locality Entity Data:`);
  console.log(`- Postal Codes Present     : ${hasPostalCode ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`- GeoShapes Present        : ${hasGeoShape ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`- Nearby Localities Present: ${hasNearby ? '✅ PASS' : '❌ FAIL'}`);

  console.log('====================================================');
  if (totalRawImg === 0 && totalMissingAlt === 0 && totalMissingDimensions === 0 && hasImageSitemap) {
    console.log('🎉 AUDIT STATUS: 100% PERFECT PASS (READY FOR PRODUCTION)');
  } else {
    console.log('⚠️ AUDIT STATUS: ISSUES FOUND');
  }
  console.log('====================================================\n');
}

auditFiles();
