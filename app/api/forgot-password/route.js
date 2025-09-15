// app/api/forgot-password/route.js
import pool from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { sendResetEmail } from "@/lib/nodemailer";

export async function POST(request) {
  const { email } = await request.json();
  const conn = await pool.getConnection();

  try {
    const [users] = await conn.execute("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    // Always return the same message to prevent email enumeration
    if (users.length === 0) {
      return Response.json(
        { message: "If an account exists, a reset link has been sent" },
        { status: 200 },
      );
    }

    const token = uuidv4();
    const expiry = new Date(Date.now() + 3600000); // 1 hour expiry

    await conn.execute(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?",
      [token, expiry, users[0].id],
    );

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
    await sendResetEmail(email, resetLink);

    return Response.json({
      message: "If an account exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return Response.json(
      { message: "Failed to process request" },
      { status: 500 },
    );
  } finally {
    conn.release();
  }
}
