import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          );
          response = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session – keeps auth tokens valid
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;
  console.log(`[MIDDLEWARE] Path: ${path}, User: ${user?.id || 'null'}, AuthError: ${authError?.message || 'none'}`);

  const isProtectedRoute =
    path.startsWith('/dashboard') ||
    path.startsWith('/jobs') ||
    path.startsWith('/candidates') ||
    path.startsWith('/analytics') ||
    path.startsWith('/settings') ||
    path.startsWith('/reports');

  const isAuthRoute =
    path.startsWith('/login') ||
    path.startsWith('/signup') ||
    path.startsWith('/(auth)');

  // Skip auth for placeholder / dev environment
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
    return response;
  }

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', path);
    console.log(`[MIDDLEWARE] Redirecting unauthenticated user from ${path} to /login`);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
