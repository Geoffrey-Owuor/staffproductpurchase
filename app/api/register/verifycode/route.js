// app/api/register/verifycode/route.js
import { pool } from "@/lib/db";

export async function POST(request) {
  let client;
  try {
    const { email, code } = await request.json();

    client = await pool.connect();

    // Verify the code
    const { rows } = await client.query(
      `SELECT * FROM verification_codes 
       WHERE email = $1 
         AND code = $2 
         AND expires_at > NOW() 
         AND verified = 0`,
      [email, code],
    );

    if (rows.length === 0) {
      return Response.json(
        { success: false, message: "Invalid or expired verification code" },
        { status: 400 },
      );
    }

    // ✅ Mark as verified
    await client.query(
      `UPDATE verification_codes 
       SET verified = 1 
       WHERE email = $1`,
      [email],
    );

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
    if (client) client.release();
  }
}
