import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export function createSupabaseServerClient(request: NextRequest, response?: NextResponse) {
  let res = response || NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          const cookieOptions = {
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
          };
          
          request.cookies.set({
            name,
            value,
            ...cookieOptions,
          });
          res = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          res.cookies.set({
            name,
            value,
            ...cookieOptions,
          });
        },
        remove(name: string, options: any) {
          const cookieOptions = {
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
          };
          
          request.cookies.set({
            name,
            value: '',
            ...cookieOptions,
          });
          res = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          res.cookies.set({
            name,
            value: '',
            ...cookieOptions,
          });
        },
      },
    }
  );
} 