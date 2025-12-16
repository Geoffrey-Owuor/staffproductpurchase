import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// ✅ Verify JWT
async function verifyEdgeJWT(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { valid: true, role: payload.role };
  } catch {
    return { valid: false };
  }
}

// ✅ Define paths to redirect if already logged in
const redirectIfLoggedInPaths = ["/login", "/register", "/forgot-password"];

export default async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ✅ Redirect authenticated users away from login/register/forgot-password
  if (redirectIfLoggedInPaths.includes(pathname)) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (sessionToken) {
      const { valid, role } = await verifyEdgeJWT(sessionToken);

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
        }

        if (redirectPath) {
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

// ✅ Apply middleware to all except static/public/api routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)"],
};
