import { NextResponse } from 'next/server';
import { DRIVER_AUTH_COOKIE, driverAuthToken } from '@/lib/driver-auth';

export async function POST(request: Request) {
  const password = process.env.DRIVER_PASSWORD;
  if (!password) {
    return NextResponse.json({ error: 'DRIVER_PASSWORD is not configured on the server.' }, { status: 500 });
  }

  let submitted = '';
  try {
    const body = await request.json();
    submitted = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (submitted !== password) {
    return NextResponse.json({ error: 'Wrong password.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(DRIVER_AUTH_COOKIE, driverAuthToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/driver',
    maxAge: 60 * 60 * 24 * 180, // 180 days
  });
  return response;
}
