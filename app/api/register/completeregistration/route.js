// app/api/register/completeregistration/route.js - Complete Registration
import { hashPassword, createSession } from "@/app/lib/auth";
import pool from "@/lib/db";
import { cookies } from "next/headers";

const getRoleFromEmail = (email) => {
  // Extract the prefix before the @ symbol
  const prefix = email.split("@")[0].toLowerCase();

  // Define role mappings based on prefixes
  const roleMappings = {
    hr: "hr",
    cc: "cc",
    bi: "bi",
    admin: "admin",
  };

  // Check if prefix matches any role
  for (const [key, role] of Object.entries(roleMappings)) {
    if (prefix.startsWith(key)) {
      return role;
    }
  }

  return "staff"; // Default role if no prefix matches
};

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    const conn = await pool.getConnection();

    // Verify email was previously verified
    const [verified] = await conn.execute(
      `SELECT * FROM verification_codes WHERE email = ?`,
      [email],
    );

    if (verified.length === 0) {
      conn.release();
      return Response.json(
        { success: false, message: "Email not verified" },
        { status: 400 },
      );
    }

    const role = getRoleFromEmail(email);
    const hashedPassword = await hashPassword(password);

    // Create user
    const [userResult] = await conn.execute(
      `INSERT INTO users (name, email, password, role) VALUES(?,?,?,?)`,
      [name, email, hashedPassword, role],
    );

    // Clean up verification code
    await conn.execute(`DELETE FROM verification_codes WHERE email = ?`, [
      email,
    ]);

    await createSession(userResult.insertId, role, name, email);

    conn.release();

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
        userId: userResult.insertId,
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
  }
}
