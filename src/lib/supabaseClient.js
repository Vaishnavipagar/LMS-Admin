import { createClient } from '@supabase/supabase-js';

// Admin Supabase client (frontend-safe: anon key only).
// Configure via environment variables — never commit real values:
//   VITE_SUPABASE_URL=https://xyzcompany.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
// See .env.example. The service_role key must NEVER be used here.

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        storageKey: 'learnloop_admin_auth',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;
