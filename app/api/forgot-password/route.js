// api/auth/reset-password/route.js
import { pool } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request) {
  let client;
  try {
    const { email } = await request.json();
    client = await pool.connect();

    const { rows } = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (rows.length === 0) {
      // Respond as if email was found to avoid user enumeration
      return Response.json(
        { message: "A reset link was sent to this email if it exists" },
        { status: 200 },
      );
    }

    // Generate a secure token
    const token = uuidv4();
    const expiry = new Date(Date.now() + 3600000); // 1 hour expiry

    // Store the reset token and expiry in the database
    await client.query(
      `UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3`,
      [token, expiry, rows[0].id],
    );

    // Send password reset email
    await sendPasswordResetEmail(email, token);

    return Response.json({ message: "Reset link sent if email exists" });
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
