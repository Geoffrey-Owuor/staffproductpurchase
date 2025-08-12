// import { roleProtectedRoute } from "@/app/lib/auth-edge";
// import { NextResponse } from "next/server";

// // Define protected paths and their required roles
// const protectedPaths = {
//   "/staffdashboard": ["staff"],
//   "/hrdashboard": ["hr"],
//   "/ccdashboard": ["cc"],
//   "/bidashboard": ["bi"],
// };

// // Paths to redirect if already logged in
// const redirectIfLoggedInPaths = ["/", "/login", "/register"];

// export default async function middleware(request) {
//   const { pathname } = request.nextUrl;

//   // 1. ✅ Redirect from homepage,login, or register based on role if already logged in
//   if (redirectIfLoggedInPaths.includes(pathname)) {
//     const sessionToken = request.cookies.get("session_token")?.value;

//     if (sessionToken) {
//       const validationUrl = new URL("/api/validate-session", request.url);
//       const res = await fetch(validationUrl, {
//         headers: {
//           cookie: `session_token=${sessionToken}`,
//         },
//       });

//       if (res.ok) {
//         const { role, valid } = await res.json();

//         if (valid) {
//           let redirectPath = null;

//           switch (role) {
//             case "staff":
//               redirectPath = "/staffdashboard";
//               break;
//             case "hr":
//               redirectPath = "/hrdashboard";
//               break;
//             case "cc":
//               redirectPath = "/ccdashboard";
//               break;
//             case "bi":
//               redirectPath = "/bidashboard";
//               break;
//             // Add more roles here if needed
//           }

//           if (redirectPath) {
//             return NextResponse.redirect(new URL(redirectPath, request.url));
//           }
//         }
//       }
//     }

//     return NextResponse.next(); // No session or invalid, let user see homepage
//   }

//   // 2. ✅ Protect dashboard routes by role
//   const matchedPath = Object.keys(protectedPaths).find((path) =>
//     pathname.startsWith(path),
//   );

//   if (matchedPath) {
//     return roleProtectedRoute(protectedPaths[matchedPath])(request);
//   }

//   return NextResponse.next();
// }

// // Apply to all routes except static/public/api ones
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

// import { NextResponse } from "next/server";
// import { jwtVerify } from "jose";
// import { cookies } from "next/headers";

// const SECRET = new TextEncoder().encode(
//   process.env.JWT_SECRET || "supersecret",
// );

// // ✅ Verify JWT directly in middleware (replaces auth-edge.js)
// async function verifyEdgeJWT(token) {
//   try {
//     const { payload } = await jwtVerify(token, SECRET);
//     return { valid: true, role: payload.role, userId: payload.userId };
//   } catch {
//     return { valid: false };
//   }
// }

// // ✅ Role-protected route logic (replaces roleProtectedRoute & protectRoute)
// async function protectRoute(request, allowedRoles = []) {
//   const cookieStore = await cookies();
//   const sessionToken = cookieStore.get("session_token")?.value;

//   if (!sessionToken) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   const { valid, role } = await verifyEdgeJWT(sessionToken);

//   if (!valid) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
//     return NextResponse.redirect(new URL("/unauthorized", request.url));
//   }

//   return NextResponse.next();
// }

// // ✅ Define protected paths and their roles
// const protectedPaths = {
//   "/staffdashboard": ["staff"],
//   "/hrdashboard": ["hr"],
//   "/ccdashboard": ["cc"],
//   "/bidashboard": ["bi"],
// };

// // ✅ Paths to redirect if already logged in
// const redirectIfLoggedInPaths = ["/", "/login", "/register"];

// export default async function middleware(request) {
//   const { pathname } = request.nextUrl;

//   // 1. ✅ Redirect logged-in users away from login/register/home
//   if (redirectIfLoggedInPaths.includes(pathname)) {
//     const cookieStore = await cookies();
//     const sessionToken = cookieStore.get("session_token")?.value;

//     if (sessionToken) {
//       const { valid, role } = await verifyEdgeJWT(sessionToken);

//       if (valid) {
//         let redirectPath = null;
//         switch (role) {
//           case "staff":
//             redirectPath = "/staffdashboard";
//             break;
//           case "hr":
//             redirectPath = "/hrdashboard";
//             break;
//           case "cc":
//             redirectPath = "/ccdashboard";
//             break;
//           case "bi":
//             redirectPath = "/bidashboard";
//             break;
//         }

//         if (redirectPath) {
//           return NextResponse.redirect(new URL(redirectPath, request.url));
//         }
//       }
//     }

//     return NextResponse.next();
//   }

//   // 2. ✅ Protect dashboard routes by role
//   const matchedPath = Object.keys(protectedPaths).find((path) =>
//     pathname.startsWith(path),
//   );

//   if (matchedPath) {
//     return protectRoute(request, protectedPaths[matchedPath]);
//   }

//   return NextResponse.next();
// }

// // ✅ Apply middleware to all except static/public/api
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "supersecret",
);

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
const redirectIfLoggedInPaths = ["/", "/login", "/register"];

export default async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ✅ Redirect authenticated users away from login/register/home
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
