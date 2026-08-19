// Supabase public configuration.
// Publishable keys are intended for browser use.
// Database security is enforced with Row Level Security (RLS).
const SUPABASE_URL = 'https://yewaudnwthgmxivxlrkq.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_rHYXOaAtrrrNzSrbszKEKw_w1lE10TY';
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
