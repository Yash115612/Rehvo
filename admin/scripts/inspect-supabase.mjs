import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xoskechmxzgfajkfpssv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvc2tlY2hteHpnZmFqa2Zwc3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5Nzg3ODksImV4cCI6MjEwMjU1NDc4OX0.sJA39oV-GycfrcNUlLOFiZa5dWcnkmAYh2Acu0tchGg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectData() {
  const { data: props } = await supabase.from('properties').select('id, title, price, locality, city, type, status, verification_status, owner_id');
  console.log('REAL PROPERTIES IN SUPABASE (' + (props?.length || 0) + '):');
  console.dir(props, { depth: null });

  const { data: profiles } = await supabase.from('profiles').select('id, full_name, email, phone, role, verification_status, is_blocked');
  console.log('\nREAL PROFILES IN SUPABASE (' + (profiles?.length || 0) + '):');
  console.dir(profiles, { depth: null });

  const { data: settings } = await supabase.from('system_settings').select('*');
  console.log('\nREAL SYSTEM SETTINGS (' + (settings?.length || 0) + '):');
  console.dir(settings, { depth: null });
}

inspectData();
