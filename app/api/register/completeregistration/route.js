// app/api/register/completeregistration/route.js - Complete Registration
import { hashPassword, createSession } from "@/app/lib/auth";
import pool from "@/lib/db";
import { cookies } from "next/headers";

const getRoleFromEmail = (email) => {
  // Get the normalized email
  const normalizedEmail = email.toLowerCase();

  const emailRoleMappings = {
    "geoffreyowuor22@gmail.com": "payroll",
    "geoffrey@hotpoint.co.ke": "hr",
    "bilha@hotpoint.co.ke": "cc",
    "gt010@hotpoint.co.ke": "bi",
  };

  return emailRoleMappings[normalizedEmail] || "staff";
};

export async function POST(request) {
  try {
    const { name, email, password, payrollNo, department } =
      await request.json();

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
      `INSERT INTO users (name, email, password, payrollNo, department, role) VALUES(?,?,?,?,?,?)`,
      [name, email, hashedPassword, payrollNo, department, role],
    );

    // Clean up verification code
    await conn.execute(`DELETE FROM verification_codes WHERE email = ?`, [
      email,
    ]);

    await createSession(
      userResult.insertId,
      role,
      name,
      email,
      payrollNo,
      department,
    );

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
