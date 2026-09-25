import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('admin_session');
  const isAuthenticated = authCookie && authCookie.value === 'true';

  // Protect settings page
  if (request.nextUrl.pathname.startsWith('/settings')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect sensitive API routes
  if (
    request.nextUrl.pathname.startsWith('/api/match') ||
    request.nextUrl.pathname.startsWith('/api/penalty') ||
    request.nextUrl.pathname.startsWith('/api/setup')
  ) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized: Referee access required" }, { status: 401 });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/settings/:path*', '/api/match', '/api/penalty', '/api/setup'],
};
