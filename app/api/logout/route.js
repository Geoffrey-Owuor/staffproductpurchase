// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
// import pool from "@/lib/db";

// export async function POST() {
//   const cookieStore = await cookies();
//   const sessionToken = cookieStore.get("session_token")?.value;

//   if (sessionToken) {
//     const conn = await pool.getConnection();
//     try {
//       await conn.execute("DELETE FROM sessions WHERE session_token = ?", [
//         sessionToken,
//       ]);
//     } finally {
//       conn.release();
//     }
//   }

//   const response = NextResponse.json({ message: "Logged out" });

//   // Clear cookie on the client by setting it with an expired date
//   response.cookies.set("session_token", "", {
//     expires: new Date(0),
//     path: "/",
//   });

//   return response;
// }

import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // ✅ Clear the session_token cookie
  cookieStore.set("session_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // expires immediately
  });

  return Response.json({ success: true, message: "Logged out successfully" });
}
