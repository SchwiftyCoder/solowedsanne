import { neon } from '@neondatabase/serverless';

// Factory function so the client is never instantiated at module evaluation
// time (which happens during Next.js build with placeholder env vars).
export function db() {
  return neon(process.env.DATABASE_URL!);
}

export type Seating = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  table_number: string;
  message: string;
  is_family: boolean | null;
  rsvp_status: 'pending' | 'yes' | 'no';
  excluded_from_texts: boolean;
  created_at: string;
  updated_at: string;
};
