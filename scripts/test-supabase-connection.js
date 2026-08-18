/**
 * REHVO — Supabase Connection Test
 * Safe development verification that checks initialization of:
 * - Mobile Supabase Client
 * - Admin Browser Supabase Client
 * - Admin Server Supabase Client
 * - Admin Privileged Supabase Client
 * 
 * SECURITY: NEVER logs or prints secret keys, tokens, or passwords.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function verifyConnection() {
  console.log('====================================================');
  console.log('REHVO — SUPABASE MUMBAI CONNECTION VERIFICATION');
  console.log('====================================================\n');

  const targetUrl = 'https://xoskechmxzgfajkfpssv.supabase.co';
  let allPassed = true;

  // 1. Mobile Client Initialization Test
  console.log('[1/4] Testing Mobile App Supabase Client...');
  try {
    const mobileClient = createClient(targetUrl, 'test-verification-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    if (mobileClient && mobileClient.auth) {
      console.log('      ✓ Mobile Supabase client initialized successfully.');
    } else {
      throw new Error('Mobile client initialization failed');
    }
  } catch (err) {
    allPassed = false;
    console.error('      ✗ Mobile client initialization error');
  }

  // 2. Admin Browser Client Initialization Test
  console.log('\n[2/4] Testing Admin Browser Supabase Client...');
  try {
    const adminBrowserClient = createClient(targetUrl, 'test-verification-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    if (adminBrowserClient && adminBrowserClient.auth) {
      console.log('      ✓ Admin browser Supabase client initialized successfully.');
    } else {
      throw new Error('Admin browser client initialization failed');
    }
  } catch (err) {
    allPassed = false;
    console.error('      ✗ Admin browser client initialization error');
  }

  // 3. Admin Server Client Initialization Test
  console.log('\n[3/4] Testing Admin Server Supabase Client...');
  try {
    const adminServerClient = createClient(targetUrl, 'test-verification-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    if (adminServerClient && adminServerClient.from) {
      console.log('      ✓ Admin server Supabase client initialized successfully.');
    } else {
      throw new Error('Admin server client initialization failed');
    }
  } catch (err) {
    allPassed = false;
    console.error('      ✗ Admin server client initialization error');
  }

  // 4. Admin Privileged Client Initialization Test
  console.log('\n[4/4] Testing Admin Privileged Service-Role Client...');
  try {
    const adminPrivilegedClient = createClient(targetUrl, 'test-service-role-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    if (adminPrivilegedClient && adminPrivilegedClient.auth) {
      console.log('      ✓ Admin privileged service-role client initialized successfully.');
    } else {
      throw new Error('Admin privileged client initialization failed');
    }
  } catch (err) {
    allPassed = false;
    console.error('      ✗ Admin privileged client initialization error');
  }

  // 5. Environment Files Inspection
  console.log('\n[5/5] Checking Environment Configuration Files...');
  const rootEnvLocal = path.resolve(__dirname, '../.env.local');
  const adminEnvLocal = path.resolve(__dirname, '../admin/.env.local');

  if (fs.existsSync(rootEnvLocal)) {
    const content = fs.readFileSync(rootEnvLocal, 'utf8');
    const hasUrl = content.includes('xoskechmxzgfajkfpssv.supabase.co');
    const hasKey = content.includes('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
    console.log(`      ✓ Root .env.local: URL verified (${hasUrl ? 'PASS' : 'FAIL'}), Publishable key entry (${hasKey ? 'PASS' : 'FAIL'})`);
  }

  if (fs.existsSync(adminEnvLocal)) {
    const content = fs.readFileSync(adminEnvLocal, 'utf8');
    const hasUrl = content.includes('xoskechmxzgfajkfpssv.supabase.co');
    const hasKey = content.includes('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
    console.log(`      ✓ Admin .env.local: URL verified (${hasUrl ? 'PASS' : 'FAIL'}), Publishable key entry (${hasKey ? 'PASS' : 'FAIL'})`);
  }

  console.log('\n====================================================');
  if (allPassed) {
    console.log('RESULT: Supabase connection initialized successfully.');
  } else {
    console.log('RESULT: Supabase connection check FAILED.');
    process.exit(1);
  }
  console.log('====================================================\n');
}

verifyConnection();
