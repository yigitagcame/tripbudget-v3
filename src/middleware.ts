import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // Debug logging
  console.log('Middleware - Path:', req.nextUrl.pathname);

  // Handle OAuth callback
  if (req.nextUrl.pathname.startsWith('/auth/callback')) {
    // Mock successful OAuth login, redirect to chat
    return NextResponse.redirect(new URL('/chat', req.url));
  }

  // Protected routes - allow all for mock implementation
  const protectedRoutes = ['/chat'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Protected API routes - allow all for mock implementation
  const protectedApiRoutes = ['/api/chat'];
  const isProtectedApiRoute = protectedApiRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // For mock implementation, allow all requests
  if (isProtectedRoute || isProtectedApiRoute) {
    console.log('Middleware - Protected route accessed, allowing for mock implementation');
  }

  // If accessing login page, redirect to chat for mock implementation
  if (req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/chat', req.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/chat/:path*',
    '/api/chat/:path*',
    '/login',
    '/auth/callback',
  ],
}; 