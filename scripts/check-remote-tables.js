const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function checkRemote() {
  const url = 'https://xoskechmxzgfajkfpssv.supabase.co';
  
  // Read publishable key from .env.local if present
  let key = 'placeholder';
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      if (line.startsWith('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=')) {
        key = line.split('=')[1].trim();
      }
    }
  }

  console.log(`Checking remote project: ${url}`);
  const client = createClient(url, key);

  const tables = [
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

  const results = {};

  for (const table of tables) {
    try {
      const { data, error } = await client.from(table).select('*').limit(1);
      if (error) {
        results[table] = { exists: false, error: error.message, code: error.code };
      } else {
        results[table] = { exists: true, count: data ? data.length : 0 };
      }
    } catch (e) {
      results[table] = { exists: false, error: e.message };
    }
  }

  console.log('\n--- Remote Table Audit Results ---');
  for (const [table, res] of Object.entries(results)) {
    console.log(`${table.padEnd(30)}: ${res.exists ? 'EXISTS' : 'NOT FOUND / ERROR'} (${res.error || 'OK'})`);
  }
}

checkRemote().catch(console.error);
