import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  PROTECTED_ROUTES,
  AUTH_ONLY_ROUTES,
  POST_LOGIN_REDIRECT,
  LOGIN_PATH,
} from "@/config/auth";

/** Matcher excludes static assets and image files from proxy processing */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export async function proxy(request: NextRequest) {
  // Read env vars directly instead of importing from @/config/env because:
  // 1. Proxy runs in Edge runtime where module-level throws can crash all requests
  // 2. Graceful pass-through is safer than crashing the entire application
  // In production, these vars are always present (set in Vercel/hosting env)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials missing — proxy auth checks disabled");
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Always use getUser() — getSession() does not validate the token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users away from protected routes
  if (
    !user &&
    PROTECTED_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth-only routes
  if (
    user &&
    AUTH_ONLY_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
  ) {
    const url = request.nextUrl.clone();
    url.pathname = POST_LOGIN_REDIRECT;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
