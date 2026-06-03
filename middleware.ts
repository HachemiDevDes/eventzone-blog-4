import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all admin routes except login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            request.cookies.set({ name, value: '', ...options });
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  // Redirect /blog to /fr/blog (default locale)
  if (pathname === '/blog') {
    return NextResponse.redirect(new URL('/fr/blog', request.url));
  }

  // Handle subpaths of /blog that don't have a locale
  // e.g. /blog/[slug] -> /fr/blog/[slug]
  if (pathname.startsWith('/blog/') && !pathname.startsWith('/blog/category/') && !pathname.startsWith('/blog/tag/')) {
     // Check if it's potentially a language prefix or literally starts with /blog/
     // Since our locales are fr and en, we can be specific
     return NextResponse.redirect(new URL(`/fr${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/blog/:path*', '/blog'],
};
