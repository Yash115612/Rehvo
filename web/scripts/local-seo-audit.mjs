import { RENT_LANDING_PAGES, SEARCH_LANDING_PAGES } from '../src/lib/seo/rentData.js';
import { LOCALITIES_DATA, CITIES_DATA } from '../src/lib/seo/localityData.js';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  generateFaqSchema,
  generateLocalityEntitySchema,
  generateTransitAndLandmarkSchema,
  generateAuthorSchema,
} from '../src/lib/seo/schema.js';

console.log('====================================================');
console.log('   REHVO V19 LOCAL SEO & E-E-A-T AUDIT SUITE       ');
console.log('====================================================');

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failedTests++;
  }
}

// TEST 1: Programmatic Rent Landing Pages (100+ required)
const totalRentPages = Object.keys(SEARCH_LANDING_PAGES).length;
assert(totalRentPages >= 100, `Total rent landing pages count >= 100 (Found: ${totalRentPages})`);

// TEST 2: Landmark Intent Pages
const landmarkQueries = [
  'flats-near-iit-bombay',
  'flats-near-nmims',
  'flats-near-bkc',
  'flats-near-mumbai-airport',
  'flats-near-tcs-powai',
  'flats-near-mindspace-malad',
  'flats-near-jio-world-drive',
];

landmarkQueries.forEach((slug) => {
  const page = SEARCH_LANDING_PAGES[slug];
  assert(
    page && page.metaTitle && page.metaDescription && page.faqs?.length > 0,
    `Landmark page '/rent/${slug}' exists with metadata and FAQs`
  );
});

// TEST 3: Locality Engine (Mumbai Localities Count)
const mumbaiLocalities = Object.values(LOCALITIES_DATA).filter((l) => l.citySlug === 'mumbai');
assert(
  mumbaiLocalities.length >= 25,
  `Mumbai localities count >= 25 (Found: ${mumbaiLocalities.length})`
);

// TEST 4: Locality Rich Data Validation (Prices, Transit, Amenities, 8 FAQs)
const sampleLocalities = ['andheri-west', 'bandra-west', 'powai', 'worli', 'bkc'];
sampleLocalities.forEach((slug) => {
  const loc = LOCALITIES_DATA[slug];
  assert(
    loc &&
      loc.avgRent1BHK > 0 &&
      loc.avgRent2BHK > 0 &&
      loc.avgRent3BHK > 0 &&
      loc.avgRentPG > 0 &&
      loc.avgRentFlatmate > 0,
    `Locality '${slug}' has complete price table (1BHK, 2BHK, 3BHK, PG, Flatmate)`
  );
  assert(
    loc && loc.faqs && loc.faqs.length >= 8,
    `Locality '${slug}' has 8+ unique FAQs (Found: ${loc?.faqs?.length || 0})`
  );
  assert(
    loc && loc.aboutNarrative && loc.aboutNarrative.length > 300,
    `Locality '${slug}' has comprehensive narrative text (${loc?.aboutNarrative?.length || 0} chars)`
  );
  assert(
    loc && loc.topSchools?.length >= 5 && loc.topHospitals?.length >= 5,
    `Locality '${slug}' has top 5 schools and top 5 hospitals`
  );
});

// TEST 5: Schema.org Validation
try {
  const locSample = LOCALITIES_DATA['bandra-west'];
  const entitySchema = generateLocalityEntitySchema(locSample, 'https://rehvo.in/mumbai/bandra-west');
  assert(
    entitySchema && entitySchema['@graph'] && entitySchema['@graph'].length === 2,
    "Locality entity schema generates valid '@graph' with Place and RealEstateAgent"
  );

  const transitSchema = generateTransitAndLandmarkSchema(locSample, 'https://rehvo.in/mumbai/bandra-west');
  assert(
    transitSchema && transitSchema['@graph'] && transitSchema['@graph'].length > 0,
    `Transit & Landmark schema generates ${transitSchema['@graph'].length} structured items`
  );

  const authorSchema = generateAuthorSchema({
    name: 'REHVO Editorial & Real Estate Intelligence Desk',
    role: 'Market Research & Verification',
    bio: 'Test Bio',
    url: 'https://rehvo.in/authors/rehvo-editorial',
  });
  assert(
    authorSchema && authorSchema['@graph'] && authorSchema['@graph'][0]['@type'] === 'Person',
    'Author E-E-A-T schema generates valid Person & Organization graph'
  );
} catch (err) {
  assert(false, `Schema generation threw error: ${err.message}`);
}

console.log('====================================================');
console.log(`AUDIT COMPLETE: ${passedTests} passed, ${failedTests} failed.`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
