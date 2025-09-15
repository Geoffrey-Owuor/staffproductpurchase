// app/api/register/completeregistration/route.js
import { hashPassword, createSession } from "@/app/lib/auth";
import { pool } from "@/lib/db";
import { cookies } from "next/headers";

const getRoleFromEmail = (email) => {
  const prefix = email.split("@")[0].toLowerCase();
  const roleMappings = {
    hr: "hr",
    cc: "cc",
    bi: "bi",
    admin: "admin",
  };

  for (const [key, role] of Object.entries(roleMappings)) {
    if (prefix.startsWith(key)) {
      return role;
    }
  }
  return "staff";
};

export async function POST(request) {
  let client;
  try {
    const { name, email, password } = await request.json();

    client = await pool.connect();

    // Verify email was previously verified
    const { rows: verified } = await client.query(
      `SELECT * FROM verification_codes 
       WHERE email = $1 AND verified = 1`,
      [email],
    );

    if (verified.length === 0) {
      return Response.json(
        { success: false, message: "Email not verified" },
        { status: 400 },
      );
    }

    const role = getRoleFromEmail(email);
    const hashedPassword = await hashPassword(password);

    // Create user
    const { rows: userResult } = await client.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      [name, email, hashedPassword, role],
    );

    // Clean up verification code
    await client.query(`DELETE FROM verification_codes WHERE email = $1`, [
      email,
    ]);

    await createSession(userResult[0].id, role, name, email);

    // Delete the verify_email cookie now that it's no longer needed
    const cookieStore = await cookies();
    cookieStore.set({
      name: "verify_email",
      value: "",
      path: "/",
      maxAge: 0, // Immediately expires
    });

    return Response.json(
      {
        success: true,
        userId: userResult[0].id,
        role,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Complete registration error:", error);
    return Response.json(
      { success: false, message: "Registration failed" },
      { status: 500 },
    );
  } finally {
    if (client) client.release();
  }
}
