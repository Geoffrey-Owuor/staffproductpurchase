import pool from "@/lib/db";
import { hashPassword, verifyPassword } from "@/app/lib/auth";

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

export async function PUT(request) {
  const { email, currentPassword, newPassword } = await request.json();
  const conn = await pool.getConnection();

  try {
    //verify user
    const [verifyUser] = await conn.execute(
      "SELECT id, password from users WHERE email = ?",
      [email],
    );

    if (verifyUser.length === 0) {
      return Response.json({ message: "User does not exist" }, { status: 400 });
    }

    //verify password
    const isValid = await verifyPassword(
      currentPassword,
      verifyUser[0].password,
    );
    if (!isValid) {
      return Response.json(
        { message: "Current Password Incorrect" },
        { status: 401 },
      );
    }

    //Hashing new password
    const hashedNewPassword = await hashPassword(newPassword);

    //Update the previous password
    await conn.execute("UPDATE users SET password = ? WHERE id = ?", [
      hashedNewPassword,
      verifyUser[0].id,
    ]);

    return Response.json(
      { message: "Password Updated Successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return Response.json(
      { message: "Failed to reset password" },
      { status: 500 },
    );
  } finally {
    conn.release();
  }
}
