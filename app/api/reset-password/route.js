import { pool } from "@/lib/db";
import { hashPassword } from "@/app/lib/auth";

export async function POST(request) {
  let client;
  try {
    const { token, newPassword } = await request.json();
    client = await pool.connect();

    // Verify token
    const { rows: users } = await client.query(
      "SELECT id FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()  LIMIT 1",
      [token],
    );

    if (users.length === 0) {
      return Response.json(
        { message: "Invalid or expired token" }, // Fixed typo in "message"
        { status: 400 },
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and clear the token
    const { rowCount } = await client.query(
      "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2",
      [hashedPassword, users[0].id],
    );

    if (rowCount === 0) {
      return Response.json(
        { message: "Failed to update password" },
        { status: 500 },
      );
    }

    return Response.json(
      { message: "Password updated successfully" }, // Consistent casing
      { status: 200 },
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return Response.json(
      {
        message: "Failed to reset password",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  } finally {
    if (client) client.release();
  }
}
