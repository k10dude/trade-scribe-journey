
import { createClient } from '@supabase/supabase-js'

// Try to get Supabase credentials from localStorage first, fall back to environment variables
const getSupabaseCredentials = () => {
  const storedUrl = localStorage.getItem('supabase_url');
  const storedKey = localStorage.getItem('supabase_key');
  
  return {
    url: storedUrl || import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co',
    key: storedKey || import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
  };
};

let supabase;

try {
  const { url, key } = getSupabaseCredentials();
  supabase = createClient(url, key);
  console.log("Supabase client initialized");
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  // Provide a mock client to prevent the app from crashing
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: async () => ({ error: new Error("Supabase not configured") }),
      signInWithPassword: async () => ({ error: new Error("Supabase not configured") }),
      signOut: async () => ({ error: null })
    },
    from: () => ({
      select: () => ({
        order: () => ({
          eq: () => ({ data: [], error: null }),
          single: () => ({ data: null, error: null }),
          delete: () => ({ error: null }),
          insert: () => ({ error: null }),
          update: () => ({ error: null })
        })
      })
    })
  };
}

export { supabase };
