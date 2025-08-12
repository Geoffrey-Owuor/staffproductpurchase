// app/api/register/verifyemail/route.js
import { pool } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/verificationEmail";
import crypto from "crypto";

export async function POST(request) {
  let client;
  try {
    const { email } = await request.json();

    client = await pool.connect();

    // Check if email already registered
    const { rows: existingUsers } = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (existingUsers.length > 0) {
      return Response.json(
        { success: false, message: "Email already registered" },
        { status: 400 },
      );
    }

    // Generate 6-digit code
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store or update verification code
    await client.query(
      `INSERT INTO verification_codes (email, code, expires_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) 
       DO UPDATE SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at`,
      [email, code, expiresAt],
    );

    // Send verification email
    await sendVerificationEmail(email, code);

    return Response.json(
      { success: true, message: "Verification code sent to your email" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return Response.json(
      { success: false, message: "Failed to send verification code" },
      { status: 500 },
    );
  } finally {
    if (client) client.release();
  }
}
