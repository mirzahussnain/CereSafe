import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const protectedRoutes = ["/dashboard", "/profile"];
  const loginRoutes = ["/login", "/register"];

  // Redirect unauthenticated users trying to access protected routes to /login
  if (
    !user &&
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !loginRoutes.some((route) => pathname.startsWith(route))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from login routes to /dashboard
  if (
    user &&
    loginRoutes.some(route => pathname.startsWith(route))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // // Refresh session
  // await supabase.auth.getUser();

  // // Handle route protection
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  // const pathname = request.nextUrl.pathname;

  // // Protected routes
  // const protectedRoutes = ["/dashboard", "/profile"];
  // const authRoutes = ["/login", "/register"];

  // // Redirect to dashboard if logged in and trying to access auth pages
  // if (user && authRoutes.some((route) => pathname.startsWith(route))) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // // Redirect to login if not logged in and trying to access protected routes
  // if (!user && protectedRoutes.some((route) => pathname.startsWith(route))) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}

export const config = {
  matcher: ["/login", "/register", "/dashboard"], // Exclude /auth/callback
}