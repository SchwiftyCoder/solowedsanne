import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase';
import RsvpCard from './RsvpCard';

type Props = { params: Promise<{ token: string }> };

export default async function RsvpPage({ params }: Props) {
  const { token } = await params;

  const db = createServiceClient();
  const { data: guest, error } = await db
    .from('guests')
    .select('*')
    .eq('rsvp_token', token)
    .maybeSingle();

  if (error || !guest) {
    notFound();
  }

  return <RsvpCard guest={guest} token={token} />;
}
