import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/auth",
  "/forgot-password",
  "/about",
  "/properties",
  "/apartment",
];

function getRole(user: any, userEmail: string): string {
  const metadataRole = user?.user_metadata?.role || user?.app_metadata?.role;
  if (metadataRole) {
    return metadataRole.toString().toLowerCase();
  }

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

  return "customer";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("[Middleware] Processing request for:", pathname);

  // Ignore static files and api routes for middleware auth
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    console.log("[Middleware] Skipping static/api route:", pathname);
    return NextResponse.next();
  }

  try {
    const isPublicRoute = pathname === "/" || PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
    console.log("[Middleware] isPublicRoute:", isPublicRoute);

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
    console.log("[Middleware] User logged in:", !!user, user?.email);

    // If the user is not logged in
    if (!user) {
      if (!isPublicRoute) {
        const redirectUrl = new URL("/login", request.url);
        console.log("[Middleware] Redirecting unauthenticated user to:", redirectUrl.toString());
        return NextResponse.redirect(redirectUrl);
      }
      return response;
    }

    // User is logged in
    const userEmail = user.email?.toLowerCase() ?? "";
    const role = getRole(user, userEmail);
    console.log("[Middleware] Authenticated user role:", role);

    // If a logged-in user accesses the root path, redirect to their dashboard
    if (pathname === "/") {
      let dest = "/dashboard";
      if (role === "admin") dest = "/admin";
      else if (role === "resident") dest = "/resident";
      const redirectUrl = new URL(dest, request.url);
      console.log("[Middleware] Root path redirect for logged-in user to:", redirectUrl.toString());
      return NextResponse.redirect(redirectUrl);
    }

    // Strict routing based on role
    if (role === "admin") {
        // Admin should only access /admin and related admin routes
        if (pathname.startsWith("/customer") || pathname.startsWith("/dashboard") || pathname.startsWith("/resident")) {
            const redirectUrl = new URL("/admin", request.url);
            console.log("[Middleware] Redirecting Admin from", pathname, "to:", redirectUrl.toString());
            return NextResponse.redirect(redirectUrl);
        }
    } else if (role === "resident") {
        // Resident should only access /resident
        if (pathname.startsWith("/customer") || pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
            const redirectUrl = new URL("/resident", request.url);
            console.log("[Middleware] Redirecting Resident from", pathname, "to:", redirectUrl.toString());
            return NextResponse.redirect(redirectUrl);
        }
    } else {
        // Customer should only access customer features (/dashboard, etc)
        if (pathname.startsWith("/resident") || pathname.startsWith("/admin")) {
            const redirectUrl = new URL("/dashboard", request.url);
            console.log("[Middleware] Redirecting Customer/User from", pathname, "to:", redirectUrl.toString());
            return NextResponse.redirect(redirectUrl);
        }
    }

    console.log("[Middleware] Allowing access to:", pathname);
    return response;
  } catch (err) {
    console.error("[Middleware] FATAL EXCEPTION caught:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};