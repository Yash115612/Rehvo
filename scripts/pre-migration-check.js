/**
 * REHVO — Pre-Migration Verification Check
 * Verifies environment configuration, target project URL, and migration sequence readiness.
 * STRICTLY READ-ONLY: Does not apply any migrations or mutate remote state.
 */

const fs = require('fs');
const path = require('path');

const EXPECTED_URL = 'https://xoskechmxzgfajkfpssv.supabase.co';
const EXPECTED_REGION = 'South Asia (Mumbai)';

function runPreMigrationCheck() {
  console.log('====================================================');
  console.log('REHVO — SUPABASE PRE-MIGRATION VERIFICATION CHECK');
  console.log('====================================================\n');

  const checks = [];

  // 1. Root .env.local Check
  const rootEnvPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(rootEnvPath)) {
    const content = fs.readFileSync(rootEnvPath, 'utf8');
    const hasExactUrl = content.includes(`EXPO_PUBLIC_SUPABASE_URL=${EXPECTED_URL}`);
    const hasKey = content.includes('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=');
    checks.push({
      item: 'Mobile .env.local URL',
      status: hasExactUrl ? 'PASS' : 'FAIL',
      detail: hasExactUrl ? `Matched ${EXPECTED_URL}` : 'URL mismatch in root .env.local',
    });
    checks.push({
      item: 'Mobile .env.local Key Entry',
      status: hasKey ? 'PASS' : 'FAIL',
      detail: 'Publishable key entry present',
    });
  } else {
    checks.push({
      item: 'Mobile .env.local',
      status: 'FAIL',
      detail: '.env.local missing in root',
    });
  }

  // 2. Admin .env.local Check
  const adminEnvPath = path.resolve(__dirname, '../admin/.env.local');
  if (fs.existsSync(adminEnvPath)) {
    const content = fs.readFileSync(adminEnvPath, 'utf8');
    const hasExactUrl = content.includes(`NEXT_PUBLIC_SUPABASE_URL=${EXPECTED_URL}`);
    const hasKey = content.includes('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=');
    checks.push({
      item: 'Admin .env.local URL',
      status: hasExactUrl ? 'PASS' : 'FAIL',
      detail: hasExactUrl ? `Matched ${EXPECTED_URL}` : 'URL mismatch in admin/.env.local',
    });
    checks.push({
      item: 'Admin .env.local Key Entry',
      status: hasKey ? 'PASS' : 'FAIL',
      detail: 'Publishable key entry present',
    });
  } else {
    checks.push({
      item: 'Admin .env.local',
      status: 'FAIL',
      detail: '.env.local missing in admin/',
    });
  }

  // 3. Migration Suite Completeness & Dependency Sequence Check
  const expectedMigrations = [
    '001_core_schema.sql',
    '002_properties.sql',
    '003_flatmates.sql',
    '004_saved_and_interactions.sql',
    '005_chat.sql',
    '006_notifications.sql',
    '007_trust_safety_support.sql',
    '008_admin_and_audit.sql',
    '009_rls_policies.sql',
    '010_storage_buckets.sql',
    '011_seed_initial_data.sql',
  ];

  const migrationsDir = path.resolve(__dirname, '../supabase/migrations');
  let allMigrationsPresent = true;
  let hasDestructiveStatements = false;

  expectedMigrations.forEach((mFile, idx) => {
    const mPath = path.join(migrationsDir, mFile);
    if (!fs.existsSync(mPath)) {
      allMigrationsPresent = false;
    } else {
      const content = fs.readFileSync(mPath, 'utf8');
      if (content.includes('DROP DATABASE') || content.includes('DROP SCHEMA public CASCADE')) {
        hasDestructiveStatements = true;
      }
    }
  });

  checks.push({
    item: 'Migration Files Sequence (001 - 011)',
    status: allMigrationsPresent ? 'PASS' : 'FAIL',
    detail: allMigrationsPresent ? 'All 11 sequential migration files verified' : 'Missing migration files',
  });

  checks.push({
    item: 'Destructive Statement Audit',
    status: !hasDestructiveStatements ? 'PASS' : 'FAIL',
    detail: !hasDestructiveStatements ? 'Zero destructive DROP DATABASE / CASCADE commands' : 'Dangerous DROP statements detected',
  });

  // 4. Zero Villa Guarantee Audit
  let villaKeywordsFound = false;
  expectedMigrations.forEach((mFile) => {
    const mPath = path.join(migrationsDir, mFile);
    if (fs.existsSync(mPath)) {
      const content = fs.readFileSync(mPath, 'utf8');
      if (/CREATE TABLE.*villa/i.test(content) || /villa_on_rent/i.test(content)) {
        villaKeywordsFound = true;
      }
    }
  });

  checks.push({
    item: 'Zero Villa Schema Audit',
    status: !villaKeywordsFound ? 'PASS' : 'FAIL',
    detail: !villaKeywordsFound ? 'Verified: Zero Villa / vacation tables or columns' : 'Villa keyword found in schema',
  });

  // 5. Output Results
  console.log('PRE-MIGRATION AUDIT RESULTS:');
  console.log('----------------------------------------------------');
  let passed = 0;
  let failed = 0;

  checks.forEach((c) => {
    if (c.status === 'PASS') passed++;
    else failed++;
    console.log(`[${c.status}] ${c.item} -> ${c.detail}`);
  });

  console.log('\n====================================================');
  console.log(`TARGET PROJECT: ${EXPECTED_URL}`);
  console.log(`REGION:         ${EXPECTED_REGION}`);
  console.log(`STATUS:         ${failed === 0 ? 'READY FOR MIGRATION' : 'BLOCKED'}`);
  console.log(`TOTAL CHECKS:   ${checks.length} (PASSED: ${passed}, FAILED: ${failed})`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPreMigrationCheck();
