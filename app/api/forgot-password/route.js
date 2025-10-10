// api/auth/reset-password/route.js
import { pool } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { sendResetEmail } from "@/lib/nodemailer";

export async function POST(request) {
  let client;
  try {
    const { email } = await request.json();
    client = await pool.connect();

    const { rows } = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    // Always return the same message to prevent email enumeration
    if (rows.length === 0) {
      return Response.json(
        { message: "If an account exists, a reset link has been sent" },
        { status: 200 },
      );
    }

    // Generate a secure token
    const token = uuidv4();

    // Store the reset token and expiry in the database
    await client.query(
      `UPDATE users SET reset_token = $1, reset_token_expiry = NOW() + INTERVAL '1 hour' WHERE id = $2`,
      [token, rows[0].id],
    );

    // Generate reset link and send email
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
    await sendResetEmail(email, resetLink);

    return Response.json({
      message: "If an account exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("Password reset error: ", error);
    return Response.json(
      { message: "Failed to process request" },
      { status: 500 },
    );
  } finally {
    if (client) client.release();
  }
}
