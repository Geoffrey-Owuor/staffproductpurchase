// api/auth/logout/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  let client;
  if (sessionToken) {
    client = await pool.connect();
    try {
      await client.query("DELETE FROM sessions WHERE session_token = $1", [
        sessionToken,
      ]);
    } finally {
      client.release();
    }
  }

  const response = NextResponse.json({ message: "Logged out" });

  // Clear cookie on the client by setting it with an expired date
  response.cookies.set("session_token", "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}
