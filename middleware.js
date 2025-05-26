import { roleProtectedRoute } from "@/app/lib/auth-edge";
import { NextResponse } from "next/server";

// Define protected paths and their required roles
const protectedPaths = {
  "/staffdashboard": ["staff"],
  "/hrdashboard": ["hr"],
  "/ccdashboard": ["cc"],
  "/bidashboard": ["bi"],
};

// Paths to redirect if already logged in
const redirectIfLoggedInPaths = ["/", "/login", "/register"];

export default async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. ✅ Redirect from homepage,login, or register based on role if already logged in
  if (redirectIfLoggedInPaths.includes(pathname)) {
    const sessionToken = request.cookies.get("session_token")?.value;

    if (sessionToken) {
      const validationUrl = new URL("/api/validate-session", request.url);
      const res = await fetch(validationUrl, {
        headers: {
          cookie: `session_token=${sessionToken}`,
        },
      });

      if (res.ok) {
        const { role, valid } = await res.json();

        if (valid) {
          let redirectPath = null;

          switch (role) {
            case "staff":
              redirectPath = "/staffdashboard";
              break;
            case "hr":
              redirectPath = "/hrdashboard";
              break;
            case "cc":
              redirectPath = "/ccdashboard";
              break;
            case "bi":
              redirectPath = "/bidashboard";
              break;
            // Add more roles here if needed
          }

          if (redirectPath) {
            return NextResponse.redirect(new URL(redirectPath, request.url));
          }
        }
      }
    }

    return NextResponse.next(); // No session or invalid, let user see homepage
  }

  // 2. ✅ Protect dashboard routes by role
  const matchedPath = Object.keys(protectedPaths).find((path) =>
    pathname.startsWith(path),
  );

  if (matchedPath) {
    return roleProtectedRoute(protectedPaths[matchedPath])(request);
  }

  return NextResponse.next();
}

// Apply to all routes except static/public/api ones
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
