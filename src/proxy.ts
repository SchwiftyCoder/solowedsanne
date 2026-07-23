import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DRIVER_AUTH_COOKIE, driverAuthToken } from '@/lib/driver-auth';

function handleAdmin(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return new Response('ADMIN_PASSWORD is not configured on the server.', { status: 500 });
  }

  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf-8');
    const [, pass] = decoded.split(':');
    if (pass === password) {
      return NextResponse.next();
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
  });
}

function handleDriver(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // login page and static assets (manifest, icons) stay reachable
  if (pathname === '/driver/login' || pathname.includes('.')) {
    return NextResponse.next();
  }

  const password = process.env.DRIVER_PASSWORD;
  if (!password) {
    return new Response('DRIVER_PASSWORD is not configured on the server.', { status: 500 });
  }

  const cookie = request.cookies.get(DRIVER_AUTH_COOKIE)?.value;
  if (cookie === driverAuthToken(password)) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/driver/login';
  loginUrl.search = '';
  return NextResponse.redirect(loginUrl);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/driver' || pathname.startsWith('/driver/')) {
    return handleDriver(request);
  }
  return handleAdmin(request);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/driver', '/driver/:path*'],
};
