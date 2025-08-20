// app/api/register/verifycode/route.js - Code Verification
import pool from "@/lib/db";

export async function POST(request) {
  const conn = await pool.getConnection();
  try {
    const { email, code } = await request.json();

    // Verify the code
    const [results] = await conn.execute(
      `SELECT * FROM verification_codes 
       WHERE email = ? AND code = ? AND expires_at > NOW() AND verified = 0`,
      [email, code],
    );

    if (results.length === 0) {
      return Response.json(
        { success: false, message: "Invalid or expired verification code" },
        { status: 400 },
      );
    }

    // ✅ Mark as verified
    await conn.execute(
      `UPDATE verification_codes 
       SET verified = 1 
       WHERE email = ?`,
      [email],
    );

    conn.release();

    return Response.json(
      { success: true, message: "Code verified successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Code verification error:", error);
    return Response.json(
      { success: false, message: "Verification failed" },
      { status: 500 },
    );
  } finally {
    if (conn) conn.release();
  }
}
