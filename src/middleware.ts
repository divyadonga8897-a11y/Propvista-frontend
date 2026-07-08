import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/auth",
  "/forgot-password",
];

function getRole(user: any, userEmail: string): string {
  let role = (
    user?.user_metadata?.role ||
    user?.app_metadata?.role ||
    "customer"
  )
    .toString()
    .toLowerCase();

  const adminEmails = [
    "divyadonga8897@gmail.com",
    "divyause2@gmail.com",
    "admin@propvista.com",
  ];
  const residentEmails = ["resident@propvista.com"];

  if (adminEmails.includes(userEmail) || (userEmail.includes("admin") && userEmail.endsWith("@propvista.com"))) {
    return "admin";
  }
  if (residentEmails.includes(userEmail) || userEmail.startsWith("resident")) {
    return "resident";
  }

  return role;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore static files and api routes for middleware auth
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If the user is not logged in
  if (!user) {
    if (!isPublicRoute) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    return response;
  }

  // User is logged in
  const userEmail = user.email?.toLowerCase() ?? "";
  const role = getRole(user, userEmail);

  // If a logged-in user tries to visit a public route (like /login) or root, redirect to their dashboard
  if (isPublicRoute || pathname === "/") {
      if (role === "admin") return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      if (role === "resident") return NextResponse.redirect(new URL("/resident", request.url));
      return NextResponse.redirect(new URL("/customer", request.url));
  }

  // Strict routing based on role
  if (role === "admin") {
      // Admin should only access /dashboard/admin and related admin routes
      if (pathname.startsWith("/customer") || pathname.startsWith("/resident")) {
          return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }
  } else if (role === "resident") {
      // Resident should only access /resident
      if (pathname.startsWith("/customer") || pathname.startsWith("/dashboard/admin") || pathname.startsWith("/admin")) {
          return NextResponse.redirect(new URL("/resident", request.url));
      }
  } else {
      // Customer should only access customer features
      if (pathname.startsWith("/resident") || pathname.startsWith("/dashboard/admin") || pathname.startsWith("/admin")) {
          return NextResponse.redirect(new URL("/customer", request.url));
      }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};