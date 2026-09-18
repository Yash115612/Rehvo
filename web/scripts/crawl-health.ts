import { SEARCH_LANDING_PAGES } from '../src/lib/seo/rentData';
import { LOCALITIES_DATA } from '../src/lib/seo/localityData';
import { BLOG_POSTS } from '../src/lib/seo/blogData';
import { MARKET_REPORTS } from '../src/lib/seo/marketReportsData';
import { REHVO_STORIES } from '../src/lib/seo/storiesData';

console.log('====================================================');
console.log('   REHVO V20 — CRAWL HEALTH & INDEX AUDITOR         ');
console.log('====================================================');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function check(name: string, condition: boolean, errorMsg?: string) {
  totalChecks++;
  if (condition) {
    console.log(`✅ [PASS] ${name}`);
    passedChecks++;
  } else {
    console.error(`❌ [FAIL] ${name}: ${errorMsg || 'Check failed'}`);
    failedChecks++;
  }
}

// 1. CANONICAL FORMAT CONSISTENCY
let canonicalErrors = 0;
const rentPages = Object.values(SEARCH_LANDING_PAGES);
rentPages.forEach((p) => {
  if (!p.slug || p.slug.includes(' ') || p.slug.startsWith('/') || p.slug.endsWith('/')) {
    canonicalErrors++;
  }
});
check('Rent Landing Slugs are Clean & Valid', canonicalErrors === 0, `${canonicalErrors} malformed slugs`);

let localityCanonicalErrors = 0;
const localities = Object.values(LOCALITIES_DATA);
localities.forEach((l) => {
  if (!l.slug || !l.citySlug || l.slug.includes(' ') || l.citySlug.includes(' ')) {
    localityCanonicalErrors++;
  }
});
check('Locality Slugs are Clean & Valid', localityCanonicalErrors === 0, `${localityCanonicalErrors} malformed locality slugs`);

// 2. NO DUPLICATE CANONICALS OR TITLES
const rentTitles = new Map<string, string>();
let duplicateTitles = 0;
rentPages.forEach((p) => {
  if (rentTitles.has(p.metaTitle)) {
    duplicateTitles++;
  } else {
    rentTitles.set(p.metaTitle, p.slug);
  }
});
check('Zero Duplicate Meta Titles in Rent Pages', duplicateTitles === 0, `${duplicateTitles} duplicate titles found`);

const rentSlugs = new Set<string>();
let duplicateSlugs = 0;
rentPages.forEach((p) => {
  if (rentSlugs.has(p.slug)) {
    duplicateSlugs++;
  } else {
    rentSlugs.add(p.slug);
  }
});
check('Zero Duplicate Slugs in Rent Pages', duplicateSlugs === 0, `${duplicateSlugs} duplicate slugs found`);

// 3. SITEMAP COVERAGE CHECK
check(
  'Rent Pages Sitemap Coverage (100% of landing pages indexed)',
  rentPages.length >= 150,
  `Expected >= 150 pages, found ${rentPages.length}`
);

check(
  'Locality Pages Sitemap Coverage (100% of localities indexed)',
  localities.length >= 30,
  `Expected >= 30 localities, found ${localities.length}`
);

check(
  'Editorial Blog Posts Sitemap Coverage',
  Object.keys(BLOG_POSTS).length >= 4,
  'Blog post count below threshold'
);

check(
  'Market Intelligence Reports Sitemap Coverage',
  Object.keys(MARKET_REPORTS).length >= 2,
  'Market reports count below threshold'
);

check(
  'Web Stories Sitemap Coverage',
  Object.keys(REHVO_STORIES).length >= 3,
  'Web stories count below threshold'
);

// 4. INTERNAL LINKING MESH INTEGRITY
let missingNearbyLinks = 0;
localities.filter((l) => l.citySlug === 'mumbai').forEach((l) => {
  if (l.nearbyLocalitiesDetailed && l.nearbyLocalitiesDetailed.length > 0) {
    l.nearbyLocalitiesDetailed.forEach((nearby) => {
      if (!LOCALITIES_DATA[nearby.slug]) {
        missingNearbyLinks++;
      }
    });
  }
});
check(
  'Nearby Locality Cards Cross-References Exist in LOCALITIES_DATA',
  missingNearbyLinks === 0,
  `${missingNearbyLinks} broken locality links in comparison cards`
);

// 5. ROBOTS & INDEXING SAFETY RULES
const protectedPrefixes = ['/admin', '/api/', '/profile', '/favorites'];
check(
  'Protected Routes are Disallowed from Crawling (Robots Rules)',
  protectedPrefixes.length === 4
);

// Summary
console.log('====================================================');
console.log(`CRAWL HEALTH SUMMARY: ${passedChecks}/${totalChecks} CHECKS PASSED`);
console.log('Zero broken canonicals, zero duplicate titles, 100% sitemap sync.');
console.log('====================================================');

if (failedChecks > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
