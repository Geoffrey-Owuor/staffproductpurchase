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
