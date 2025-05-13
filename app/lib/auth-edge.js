import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Lightweight session check (no DB calls)
export const getSessionToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("session_token")?.value;
};

// Middleware protection
export const protectRoute = async (request, allowedRoles = []) => {
  const sessionToken = await getSessionToken(); // ✅ Await the function
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Validate via API route
  const validationUrl = new URL("/api/validate-session", request.url);
  const res = await fetch(validationUrl, {
    headers: { cookie: `session_token=${sessionToken}` },
  });

  const userData = await res.json();

  if (!res.ok || !userData.valid) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userData.role)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
};

// Role-based route protection helper
export const roleProtectedRoute = (allowedRoles) => {
  return async (request) => {
    return protectRoute(request, allowedRoles);
  };
};
