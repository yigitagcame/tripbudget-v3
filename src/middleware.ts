import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Get session
  const { data: { session }, error } = await supabase.auth.getSession();
  
  // Debug logging
  console.log('Middleware - Path:', req.nextUrl.pathname);
  console.log('Middleware - Session exists:', !!session);
  console.log('Middleware - Session user:', session?.user?.email);

  // Handle OAuth callback
  if (req.nextUrl.pathname.startsWith('/auth/callback')) {
    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(new URL('/login?error=auth_callback_failed', req.url));
    }

    if (session) {
      // Successful OAuth login, redirect to chat
      return NextResponse.redirect(new URL('/chat', req.url));
    }
  }

  // Protected routes
  const protectedRoutes = ['/chat'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Protected API routes
  const protectedApiRoutes = ['/api/chat'];
  const isProtectedApiRoute = protectedApiRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // For API routes, we need server-side session validation
  if (isProtectedApiRoute && !session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // For frontend routes, let the client-side protection handle it
  // This allows the auth context to properly initialize
  if (isProtectedRoute && !session) {
    // Don't redirect immediately, let the client-side auth context handle it
    console.log('Middleware - Protected route without session, but allowing client-side check');
  }

  // If accessing login page with session, redirect to chat
  if (req.nextUrl.pathname === '/login' && session) {
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