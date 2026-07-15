import { createClient } from '@supabase/supabase-js';

// Factory function so Supabase is never instantiated at module evaluation time
// (which happens during Next.js build with placeholder env vars).

export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export type Seating = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  table_number: number;
  message: string;
  is_family: boolean | null;
  created_at: string;
  updated_at: string;
};
