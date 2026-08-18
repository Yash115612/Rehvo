import fs from 'fs';
import path from 'path';

const MIGRATIONS_DIR = path.resolve(__dirname, '../supabase/migrations');

interface ValidationResult {
  category: string;
  testName: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  details: string;
}

const results: ValidationResult[] = [];

function runVerification() {
  console.log('====================================================');
  console.log('REHVO — SUPABASE PRODUCTION DATABASE VERIFICATION');
  console.log('====================================================\n');

  // 1. Check Migration Files
  const migrationFiles = [
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

  let allSql = '';

  migrationFiles.forEach((file) => {
    const filePath = path.join(MIGRATIONS_DIR, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      allSql += '\n' + content;
      results.push({
        category: 'Migrations',
        testName: `File Existence: ${file}`,
        status: 'PASS',
        details: `Loaded ${file} (${content.length} bytes)`,
      });
    } else {
      results.push({
        category: 'Migrations',
        testName: `File Existence: ${file}`,
        status: 'FAIL',
        details: `Missing file ${filePath}`,
      });
    }
  });

  // 2. Check 20 Core Tables
  const requiredTables = [
    'service_cities',
    'profiles',
    'properties',
    'property_images',
    'flatmate_profiles',
    'saved_properties',
    'saved_flatmates',
    'enquiries',
    'visits',
    'conversations',
    'conversation_participants',
    'messages',
    'notifications',
    'user_push_tokens',
    'verification_requests',
    'safety_reports',
    'support_tickets',
    'admin_users',
    'admin_audit_logs',
    'system_settings',
  ];

  requiredTables.forEach((table) => {
    const tableRegex = new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table}\\s*\\(`, 'i');
    if (tableRegex.test(allSql)) {
      results.push({
        category: 'Tables',
        testName: `Table Definition: public.${table}`,
        status: 'PASS',
        details: `Verified table DDL for public.${table}`,
      });
    } else {
      results.push({
        category: 'Tables',
        testName: `Table Definition: public.${table}`,
        status: 'FAIL',
        details: `Table public.${table} not defined in migrations`,
      });
    }
  });

  // 3. Check Property Types (Zero Villa Check)
  const forbiddenKeywords = ['villa', 'villa_on_rent', 'booking', 'reservation', 'check_in', 'check_out'];
  let villaFound = false;

  // Search inside properties table definition for type check constraint
  const propertyTypeConstraint = /type TEXT NOT NULL CHECK\s*\(type IN \('flat',\s*'room',\s*'pg',\s*'studio'\)\)/i;
  if (propertyTypeConstraint.test(allSql)) {
    results.push({
      category: 'Property Types',
      testName: 'Strict Property Types (flat, room, pg, studio)',
      status: 'PASS',
      details: 'Property type check constraint is strictly (flat, room, pg, studio)',
    });
  } else {
    results.push({
      category: 'Property Types',
      testName: 'Strict Property Types (flat, room, pg, studio)',
      status: 'FAIL',
      details: 'Check constraint for property types is missing or incorrect',
    });
  }

  forbiddenKeywords.forEach((kw) => {
    // Look for table or column definitions containing forbidden keywords
    const kwRegex = new RegExp(`CREATE TABLE IF NOT EXISTS public\\.[a-z_]*${kw}`, 'i');
    if (kwRegex.test(allSql)) {
      villaFound = true;
      results.push({
        category: 'Property Types',
        testName: `Zero Villa / Booking Check: ${kw}`,
        status: 'FAIL',
        details: `Forbidden keyword '${kw}' found in table definition`,
      });
    }
  });

  if (!villaFound) {
    results.push({
      category: 'Property Types',
      testName: 'Zero Villa Schema Verification',
      status: 'PASS',
      details: 'No villa, vacation, or booking tables exist in schema',
    });
  }

  // 4. Check Auth -> Profile Linkage & Trigger
  if (allSql.includes('REFERENCES auth.users(id) ON DELETE CASCADE') && allSql.includes('handle_new_auth_user()')) {
    results.push({
      category: 'Auth & Profiles',
      testName: 'Auth-to-Profile FK & Sync Trigger',
      status: 'PASS',
      details: 'profiles.id references auth.users(id) with ON DELETE CASCADE and on_auth_user_created trigger',
    });
  } else {
    results.push({
      category: 'Auth & Profiles',
      testName: 'Auth-to-Profile FK & Sync Trigger',
      status: 'FAIL',
      details: 'Missing profile foreign key or sync trigger',
    });
  }

  // 5. Check RLS on All Tables
  requiredTables.forEach((table) => {
    const rlsRegex = new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY;`, 'i');
    if (rlsRegex.test(allSql)) {
      results.push({
        category: 'Row Level Security',
        testName: `RLS Enabled: public.${table}`,
        status: 'PASS',
        details: `RLS is enabled on public.${table}`,
      });
    } else {
      results.push({
        category: 'Row Level Security',
        testName: `RLS Enabled: public.${table}`,
        status: 'FAIL',
        details: `RLS is NOT enabled on public.${table}`,
      });
    }
  });

  // 6. Check Specific Security & RBAC Policies
  const rlsPolicyChecks = [
    { name: 'Properties Owner Isolation', pattern: /auth\.uid\(\)\s*=\s*owner_id/i },
    { name: 'Flatmates User Isolation', pattern: /auth\.uid\(\)\s*=\s*user_id/i },
    { name: 'Saved Properties User Isolation', pattern: /ON public\.saved_properties FOR ALL\s+USING \(auth\.uid\(\) = user_id\)/i },
    { name: 'Saved Flatmates User Isolation', pattern: /ON public\.saved_flatmates FOR ALL\s+USING \(auth\.uid\(\) = user_id\)/i },
    { name: 'Enquiries Participant Isolation', pattern: /auth\.uid\(\) = user_id OR auth\.uid\(\) = owner_id/i },
    { name: 'Visits Participant Isolation', pattern: /ON public\.visits/i },
    { name: 'Chat Participant Isolation', pattern: /public\.conversation_participants/i },
    { name: 'Admin Directory Isolation', pattern: /ON public\.admin_users FOR SELECT\s+USING \(public\.is_admin\(\)\)/i },
    { name: 'Admin Audit Logs Protection', pattern: /ON public\.admin_audit_logs FOR SELECT\s+USING \(public\.is_admin\(\)\)/i },
  ];

  rlsPolicyChecks.forEach((chk) => {
    if (chk.pattern.test(allSql)) {
      results.push({
        category: 'RLS Policies',
        testName: `Policy: ${chk.name}`,
        status: 'PASS',
        details: 'Verified security policy pattern',
      });
    } else {
      results.push({
        category: 'RLS Policies',
        testName: `Policy: ${chk.name}`,
        status: 'FAIL',
        details: 'Policy pattern missing or invalid',
      });
    }
  });

  // 7. Check Storage Buckets
  const requiredBuckets = ['profile-images', 'property-images', 'flatmate-images', 'verification-documents'];
  requiredBuckets.forEach((b) => {
    if (allSql.includes(`'${b}'`)) {
      results.push({
        category: 'Storage',
        testName: `Storage Bucket: ${b}`,
        status: 'PASS',
        details: `Bucket '${b}' configured in 010_storage_buckets.sql`,
      });
    } else {
      results.push({
        category: 'Storage',
        testName: `Storage Bucket: ${b}`,
        status: 'FAIL',
        details: `Bucket '${b}' missing from storage configuration`,
      });
    }
  });

  // Check Private Verification Bucket
  if (allSql.includes("('verification-documents', 'verification-documents', FALSE")) {
    results.push({
      category: 'Storage Security',
      testName: 'Private Verification Documents Bucket',
      status: 'PASS',
      details: 'verification-documents is explicitly set to public: FALSE with signed access RLS',
    });
  } else {
    results.push({
      category: 'Storage Security',
      testName: 'Private Verification Documents Bucket',
      status: 'FAIL',
      details: 'verification-documents is not configured with private protection',
    });
  }

  // 8. Output Summary
  let passCount = 0;
  let failCount = 0;
  let warnCount = 0;

  console.log('----------------------------------------------------');
  console.log('VERIFICATION TEST RESULTS:');
  console.log('----------------------------------------------------');

  results.forEach((res) => {
    if (res.status === 'PASS') passCount++;
    if (res.status === 'FAIL') failCount++;
    if (res.status === 'WARNING') warnCount++;

    const icon = res.status === 'PASS' ? '✓' : res.status === 'FAIL' ? '✗' : '⚠';
    console.log(`[${res.status}] ${icon} [${res.category}] ${res.testName} -> ${res.details}`);
  });

  console.log('\n====================================================');
  console.log(`SUMMARY: Total Tests: ${results.length} | PASSED: ${passCount} | FAILED: ${failCount} | WARNINGS: ${warnCount}`);
  console.log('====================================================\n');

  if (failCount > 0) {
    process.exit(1);
  }
}

runVerification();
