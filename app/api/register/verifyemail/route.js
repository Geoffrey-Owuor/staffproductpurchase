// app/api/register/verifyemail/route.js
import { pool } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/verificationEmail";
import crypto from "crypto";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

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

    // Store or update verification code
    await client.query(
      `INSERT INTO verification_codes (email, code, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '5 minutes')
       ON CONFLICT (email) 
       DO UPDATE SET code = EXCLUDED.code, expires_at = NOW() + INTERVAL '5 minutes', verified = 0`,
      [email, code],
    );

    //Sign the JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("5m")
      .sign(secret);

    //Store in a HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("verify_email", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/register",
      maxAge: 300, // 5 Minutes
    });

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

export async function PUT(request) {
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
        { message: "Email already registered" },
        { status: 400 },
      );
    }

    // Generate 6-digit code
    const code = crypto.randomInt(100000, 999999).toString();

    // Store or update verification code
    await client.query(
      `INSERT INTO verification_codes (email, code, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '5 minutes')
       ON CONFLICT (email) 
       DO UPDATE SET code = EXCLUDED.code, expires_at = NOW() + INTERVAL '5 minutes', verified = 0`,
      [email, code],
    );

    // Send verification email
    await sendVerificationEmail(email, code);

    return Response.json(
      { message: "Verification code sent to your email" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return Response.json(
      { message: "Failed to send verification code" },
      { status: 500 },
    );
  } finally {
    if (client) client.release();
  }
}
