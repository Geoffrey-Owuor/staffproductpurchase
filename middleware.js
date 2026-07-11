import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Verify JWT
async function verifyEdgeJWT(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { valid: true, role: payload.role };
  } catch {
    // Catching expired or tampered tokens
    return { valid: false };
  }
}

const redirectIfLoggedInPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// Define protected base routes
const protectedDashboards = [
  "/staffdashboard",
  "/payrolldashboard",
  "/hrdashboard",
  "/ccdashboard",
  "/bidashboard",
];

export default async function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("session_token")?.value;

  // 1. HANDLE PROTECTED DASHBOARD ROUTES
  const isProtectedRoute = protectedDashboards.some((dash) =>
    pathname.startsWith(dash),
  );

  if (isProtectedRoute) {
    // Case A: No token at all
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { valid, role } = await verifyEdgeJWT(sessionToken);

    // Case B: Token has expired or is invalid
    if (!valid) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("session_token"); // Hard clean from browser
      return response;
    }

    // Case C: Valid token, but trying to access someone else's dashboard (Role Enforcement)
    if (!pathname.startsWith(`/${role}dashboard`)) {
      return NextResponse.redirect(new URL(`/${role}dashboard`, request.url));
    }
  }

  // 2. HANDLE PUBLIC AUTH PATHS (Your existing redirect logic)
  if (redirectIfLoggedInPaths.includes(pathname)) {
    if (sessionToken) {
      const { valid, role } = await verifyEdgeJWT(sessionToken);

      if (valid) {
        return NextResponse.redirect(new URL(`/${role}dashboard`, request.url));
      }
    }
  }

  return NextResponse.next();
}

// CRITICAL: Update matcher to monitor your dashboard routes
export const config = {
  matcher: [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/staffdashboard/:path*",
    "/hrdashboard/:path*",
    "/ccdashboard/:path*",
    "/bidashboard/:path*",
  ],
};
