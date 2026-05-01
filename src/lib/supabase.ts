import { createClient } from '@supabase/supabase-js';

// Both clients are factory functions so Supabase is never instantiated at module
// evaluation time (which happens during Next.js build with placeholder env vars).

export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export type Guest = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  attending: boolean;
  rsvp_token: string;
  created_at: string;
  updated_at: string;
};
