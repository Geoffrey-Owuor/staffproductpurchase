// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

// export const getSessionToken = async () => {
//   const cookieStore = await cookies();
//   return cookieStore.get("session_token")?.value;
// };

// export const protectRoute = async (request, allowedRoles = []) => {
//   const sessionToken = await getSessionToken();
//   if (!sessionToken) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   const validationUrl = new URL("/api/validate-session", request.url);
//   const res = await fetch(validationUrl, {
//     headers: { cookie: `session_token=${sessionToken}` },
//   });

//   const { valid, role, user } = await res.json();

//   if (!valid || !user) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
//     return NextResponse.redirect(new URL("/unauthorized", request.url));
//   }

//   return NextResponse.next();
// };

// export const roleProtectedRoute = (allowedRoles) => {
//   return async (request) => {
//     return protectRoute(request, allowedRoles);
//   };
// };
