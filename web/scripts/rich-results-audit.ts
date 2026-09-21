import fs from 'fs';
import path from 'path';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  generateFaqSchema,
  generatePropertySchema,
  generatePgSchema,
  generateCommercialSchema,
  generateVideoObjectSchema,
  generateArticleSchema,
  generateImageObject,
  generateLocalBusinessSchema,
  generateLocalityEntitySchema,
  generateTransitAndLandmarkSchema,
  generateAuthorSchema,
} from '../src/lib/seo/schema';
import { LOCALITIES_DATA } from '../src/lib/seo/localityData';
import { SEARCH_LANDING_PAGES } from '../src/lib/seo/rentData';
import { BLOG_POSTS } from '../src/lib/seo/blogData';

console.log('====================================================');
console.log('   REHVO V20 — RICH RESULTS VALIDATION AUDIT        ');
console.log('====================================================');

interface ValidationResult {
  schemaType: string;
  target: string;
  status: 'PASS' | 'FAIL';
  errors: string[];
  warnings: string[];
  details: Record<string, any>;
}

const auditResults: ValidationResult[] = [];

function validate(
  schemaType: string,
  target: string,
  schema: any,
  validator: (s: any, errs: string[], warns: string[]) => void
) {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!schema) {
    errors.push('Schema object is null or undefined');
  } else {
    if (schema['@context'] !== 'https://schema.org') {
      errors.push(`Expected @context 'https://schema.org', got '${schema['@context']}'`);
    }
    validator(schema, errors, warnings);
  }

  const status = errors.length === 0 ? 'PASS' : 'FAIL';
  auditResults.push({
    schemaType,
    target,
    status,
    errors,
    warnings,
    details: {
      type: schema?.['@type'] || 'Unknown',
      graphLength: Array.isArray(schema?.['@graph']) ? schema['@graph'].length : undefined,
    },
  });

  const icon = status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} [${status}] ${schemaType} (${target})`);
  if (errors.length > 0) {
    errors.forEach((e) => console.error(`    🔴 Error: ${e}`));
  }
}

// 1. Organization Schema
const org = generateOrganizationSchema();
validate('Organization', 'Site Layout', org, (s, errs) => {
  if (!s.name || s.name !== 'REHVO') errs.push('Organization name must be REHVO');
  if (!s.url) errs.push('Organization URL is missing');
  if (!s.logo) errs.push('Organization logo is missing');
  if (!s.address) errs.push('Organization address is missing');
});

// 2. RealEstateListing Schema
const mockProperty: any = {
  id: 'prop-test-01',
  title: 'Luxury 2 BHK Apartment in Andheri West',
  description: 'Verified direct homeowner apartment with modular kitchen.',
  price: 65000,
  locality: 'Andheri West',
  city: 'Mumbai',
  bedrooms: 2,
  bathrooms: 2,
  square_feet: 850,
  created_at: '2026-01-01',
  property_images: [{ image_url: 'https://images.unsplash.com/photo-test-01.jpg' }],
};
const propSchema = generatePropertySchema(mockProperty, 'https://rehvo.in/property/luxury-2-bhk-andheri-west');
validate('RealEstateListing', 'Property Detail Page', propSchema, (s, errs) => {
  if (!s['@type']?.includes('RealEstateListing')) errs.push('Missing RealEstateListing in @type');
  if (!s.name) errs.push('Property name missing');
  if (!s.offers || !s.offers.price) errs.push('Offer price missing in RealEstateListing');
  if (s.aggregateRating) errs.push('Unverified aggregateRating must not be present');
});

// 3. FAQPage Schema
const sampleFaqs = [
  { question: 'What is the average rent in Bandra West?', answer: 'Average 2 BHK rent ranges between ₹95,000 to ₹1,65,000/mo.' },
  { question: 'Does REHVO charge commission fees?', answer: 'No, all direct owner listings on REHVO have 0% Commission Fee.' },
];
const faqSchema = generateFaqSchema(sampleFaqs);
validate('FAQPage', 'Locality & Landing Pages', faqSchema, (s, errs) => {
  if (s['@type'] !== 'FAQPage') errs.push('@type must be FAQPage');
  if (!Array.isArray(s.mainEntity) || s.mainEntity.length !== 2) errs.push('FAQ mainEntity count mismatch');
  s.mainEntity.forEach((q: any) => {
    if (q['@type'] !== 'Question') errs.push('Entity must be Question');
    if (!q.name) errs.push('Question name missing');
    if (!q.acceptedAnswer || !q.acceptedAnswer.text) errs.push('Question acceptedAnswer missing');
  });
});

// 4. BreadcrumbList Schema
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Mumbai', url: '/mumbai' },
  { name: 'Bandra West', url: '/mumbai/bandra-west' },
]);
validate('BreadcrumbList', 'All Subpages', breadcrumbSchema, (s, errs) => {
  if (s['@type'] !== 'BreadcrumbList') errs.push('@type must be BreadcrumbList');
  if (!Array.isArray(s.itemListElement) || s.itemListElement.length !== 3) errs.push('itemListElement length mismatch');
  s.itemListElement.forEach((item: any, idx: number) => {
    if (item.position !== idx + 1) errs.push(`Breadcrumb position mismatch at ${idx}`);
    if (!item.item || !item.item.startsWith('http')) errs.push(`Breadcrumb item URL must be absolute: ${item.item}`);
  });
});

// 5. VideoObject Schema
const videoSchema = generateVideoObjectSchema({
  title: 'Bandra West Neighborhood Tour',
  description: 'A visual walkthrough of Pali Hill and Carter Road.',
  thumbnailUrl: 'https://rehvo.in/thumbnails/bandra-tour.jpg',
  uploadDate: '2026-01-15T09:00:00+05:30',
  contentUrl: 'https://rehvo.in/videos/bandra-tour.mp4',
});
validate('VideoObject', 'ShowReels Video Showcase', videoSchema, (s, errs) => {
  if (s['@type'] !== 'VideoObject') errs.push('@type must be VideoObject');
  if (!s.name) errs.push('Video name is missing');
  if (!s.thumbnailUrl) errs.push('Video thumbnailUrl missing');
  if (!s.uploadDate) errs.push('Video uploadDate missing');
});

// 6. Article Schema
const sampleBlog = Object.values(BLOG_POSTS)[0];
const articleSchema = generateArticleSchema({
  title: sampleBlog.title,
  description: sampleBlog.metaDescription,
  slug: sampleBlog.slug,
  publishDate: sampleBlog.publishDate,
  authorName: sampleBlog.author.name,
  imageUrl: sampleBlog.coverImage,
  category: sampleBlog.category,
});
validate('Article', 'Blog & Market Reports', articleSchema, (s, errs) => {
  if (s['@type'] !== 'BlogPosting' && s['@type'] !== 'Article') errs.push('@type must be Article or BlogPosting');
  if (!s.headline) errs.push('Article headline missing');
  if (!s.author) errs.push('Article author missing');
  if (!s.publisher) errs.push('Article publisher missing');
});

// 7. ImageObject Schema
const imageObj = generateImageObject('https://images.unsplash.com/photo-sample.jpg', 'Living room high ceiling view', 1200, 800, true);
validate('ImageObject', 'Image SEO & Gallery', imageObj, (s, errs) => {
  if (s['@type'] !== 'ImageObject') errs.push('@type must be ImageObject');
  if (!s.contentUrl) errs.push('Image contentUrl missing');
  if (s.width !== 1200 || s.height !== 800) errs.push('Image dimensions missing');
});

// 8. Person Schema (E-E-A-T Author)
const authorSchema = generateAuthorSchema({
  name: 'REHVO Editorial & Real Estate Intelligence Desk',
  role: 'Market Research & Verification',
  bio: 'Authoritative Mumbai real estate intelligence.',
  url: 'https://rehvo.in/authors/rehvo-editorial',
});
validate('Person', 'Author Authority Profiles', authorSchema, (s, errs) => {
  if (!Array.isArray(s['@graph'])) errs.push('Expected @graph array');
  const person = s['@graph'].find((item: any) => item['@type'] === 'Person');
  if (!person) errs.push('Missing Person entity in author graph');
  if (!person.worksFor) errs.push('Person worksFor missing');
  if (!person.knowsAbout) errs.push('Person knowsAbout missing');
});

// 9. LocalBusiness Schema
const localBiz = generateLocalBusinessSchema({
  name: 'Green Acres Co-operative Housing Society',
  locality: 'Andheri West',
  city: 'Mumbai',
  description: 'Verified residential co-operative society.',
});
validate('LocalBusiness', 'Society Services', localBiz, (s, errs) => {
  if (s['@type'] !== 'LocalBusiness') errs.push('@type must be LocalBusiness');
  if (!s.name) errs.push('LocalBusiness name missing');
  if (!s.address) errs.push('LocalBusiness address missing');
});

// 10. Place Schema (Locality & Transit Infrastructure)
const sampleLoc = LOCALITIES_DATA['bandra-west'];
const placeSchema = generateLocalityEntitySchema(sampleLoc, 'https://rehvo.in/mumbai/bandra-west');
validate('Place', 'Locality Landing Pages', placeSchema, (s, errs) => {
  if (!Array.isArray(s['@graph'])) errs.push('Expected @graph in locality entity schema');
  const place = s['@graph'].find((item: any) => item['@type'] === 'Place');
  if (!place) errs.push('Place entity missing in locality graph');
  if (!place.geo || !place.geo.latitude || !place.geo.longitude) errs.push('Place geo coordinates missing');
});

// Summary & Report Generation
const totalTests = auditResults.length;
const passCount = auditResults.filter((r) => r.status === 'PASS').length;
const failCount = totalTests - passCount;

const reportData = {
  timestamp: new Date().toISOString(),
  totalAudited: totalTests,
  passed: passCount,
  failed: failCount,
  healthScore: Math.round((passCount / totalTests) * 100),
  results: auditResults,
};

const reportPath = path.join(__dirname, 'rich-results-report.json');
fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2), 'utf-8');

console.log('====================================================');
console.log(`REPORT SAVED: ${reportPath}`);
console.log(`AUDIT SUMMARY: ${passCount}/${totalTests} PASSED (Health: ${reportData.healthScore}%)`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
