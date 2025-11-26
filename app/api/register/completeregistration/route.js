// app/api/register/completeregistration/route.js - Complete Registration
import { hashPassword, createSession } from "@/app/lib/auth";
import pool from "@/lib/db";
import { cookies } from "next/headers";

const getRoleFromEmail = (email) => {
  // Get the normalized email
  const normalizedEmail = email.toLowerCase();

  const emailRoleMappings = {
    "bmulwa@hotpoint.co.ke": "payroll",
    "hrassist@hotpoint.co.ke": "hr",
    "cc@hotpoint.co.ke": "cc",
    "sales@hotpoint.co.ke": "bi",
  };

  return emailRoleMappings[normalizedEmail] || "staff";
};

export async function POST(request) {
  let conn;
  try {
    const { name, email, password, payrollNo, department } =
      await request.json();

    conn = await pool.getConnection();

    // Verify email was previously verified
    const [verified] = await conn.execute(
      `SELECT * FROM verification_codes WHERE email = ? AND verified = 1 and expires_at > NOW()`,
      [email],
    );

    if (verified.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Email not verified or verification pending",
        },
        { status: 400 },
      );
    }

    // --- START TRANSACTION: Ensure atomicity for DB writes ---
    await conn.beginTransaction();

    const role = getRoleFromEmail(email);
    const hashedPassword = await hashPassword(password);

    // Create user
    const [userResult] = await conn.execute(
      `INSERT INTO users (name, email, password, payrollNo, department, role) VALUES(?,?,?,?,?,?)`,
      [name, email, hashedPassword, payrollNo, department, role],
    );

    const userId = userResult.insertId;

    // Clean up verification code
    await conn.execute(`DELETE FROM verification_codes WHERE email = ?`, [
      email,
    ]);

    // --- COMMIT: Save all changes permanently to the DB ---
    await conn.commit();

    await createSession(userId, role, name, email, payrollNo, department);

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
        userId,
        role,
      },
      { status: 201 },
    );
  } catch (error) {
    // Attempt rollback if error occurred during transaction phase
    if (conn) await conn.rollback();
    console.error("Complete registration error:", error);

    return Response.json(
      {
        success: false,
        message: "Registration failed. This may be due to an existing account.",
      },
      { status: 500 },
    );
  } finally {
    if (conn) conn.release();
  }
}
