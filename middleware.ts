import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // If user is trying to access settings or api/admin
  if (request.nextUrl.pathname.startsWith('/settings')) {
    const authCookie = request.cookies.get('admin_session');
    
    // Check if authenticated
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/settings/:path*'],
};
