import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Header used to forward the *already-verified* user id from middleware to
// Server Components, so pages don't need to re-call supabase.auth.getUser()
// (a network round-trip to Supabase's Auth server) on every single request.
const VERIFIED_USER_ID_HEADER = "x-verified-user-id";
const VERIFIED_USER_EMAIL_HEADER = "x-verified-user-email";

export async function updateSession(request: NextRequest) {
  request.headers.delete(VERIFIED_USER_ID_HEADER);
  request.headers.delete(VERIFIED_USER_EMAIL_HEADER);

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
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect Dashboard Route
  if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect Logged in users away from Login page
  if (request.nextUrl.pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (user) {
    response.headers.set(VERIFIED_USER_ID_HEADER, user.id);
    if (user.email) {
      response.headers.set(
        VERIFIED_USER_EMAIL_HEADER,
        encodeURIComponent(user.email)
      );
    }
  }

  return response;
}
