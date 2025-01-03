import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'testimonial-generator'
    }
  }
});

export async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    Authorization: `Bearer ${session?.access_token}`
  };
}