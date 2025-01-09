import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Development fallbacks
const isDevelopment = import.meta.env.DEV;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (isDevelopment ? 'http://localhost:54321' : undefined);
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (isDevelopment ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' : undefined);

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase configuration missing. Please make sure to:',
    '\n1. Connect to Supabase using the "Connect to Supabase" button',
    '\n2. Copy the environment variables from .env.example to .env',
    '\n3. Update the variables with your Supabase project credentials'
  );
  
  if (!isDevelopment) {
    throw new Error('Missing Supabase environment variables');
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'testimonial-generator',
      'apikey': supabaseKey
    },
    fetch: (url, options = {}) => {
      const retryOptions = {
        retries: 3,
        retryDelay: (attempt) => Math.min(1000 * Math.pow(2, attempt), 5000)
      };

      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'apikey': supabaseKey,
          'Cache-Control': 'no-cache'
        }
      }).catch(async (error) => {
        if (retryOptions.retries > 0) {
          await new Promise(resolve => 
            setTimeout(resolve, retryOptions.retryDelay(retryOptions.retries))
          );
          retryOptions.retries--;
          return fetch(url, options);
        }
        throw error;
      });
    }
  }
});

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Authorization': `Bearer ${session?.access_token}`,
    'apikey': supabaseKey
  };
}