import pool from "@/lib/db";
import { hashPassword } from "@/app/lib/auth";

export async function POST(request) {
  const { token, newPassword } = await request.json();
  const conn = await pool.getConnection();

  try {
    //Verify token
    const [users] = await conn.execute(
      "SELECT id from users WHERE reset_token = ? AND reset_token_expiry > NOW()",
      [token],
    );

    if (users.length === 0) {
      return Response.json(
        { message: " Invalid or expired token" },
        { status: 400 },
      );
    }

    //Hash New Password
    const hashedPassword = await hashPassword(newPassword);

    //Update password and clear the token
    await conn.execute(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
      [hashedPassword, users[0].id],
    );

    return Response.json({ message: "Password Updated Successfully" });
  } catch (error) {
    console.error("Password Reset Error:", error);
    return Response.json(
      { message: "Failed to reset password" },
      { status: 500 },
    );
  } finally {
    conn.release();
  }
}
