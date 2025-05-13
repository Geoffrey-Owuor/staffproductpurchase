import { roleProtectedRoute } from "@/app/lib/auth-edge";
import { NextResponse } from "next/server";

// Define protected paths and their required roles
const protectedPaths = {
  "/staffdashboard": ["staff"],
  "/hrdashboard": ["hr"],
  "/ccdashboard": ["cc"],
  "/bidashboard": ["bi"],
};

export default async function middleware(request) {
  const { pathname } = request.nextUrl;
  // Find matching protected path
  const matchedPath = Object.keys(protectedPaths).find((path) =>
    pathname.startsWith(path),
  );

  if (matchedPath) {
    return roleProtectedRoute(protectedPaths[matchedPath])(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|login|register|_next/static|_next/image|favicon.ico).*)"],
};
