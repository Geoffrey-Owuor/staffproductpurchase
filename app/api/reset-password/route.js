import { pool } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/app/lib/auth";

//Changing a forgotten password
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

//Changing known password
export async function PUT(request) {
  let client;
  const { email, currentPassword, newPassword } = await request.json();

  try {
    client = await pool.connect();

    //Verify user
    const { rows: verifyUser } = await client.query(
      "SELECT id, password from users WHERE email = $1 LIMIT 1",
      [email],
    );

    if (!verifyUser.length) {
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

    const hashedNewPassword = await hashPassword(newPassword);

    const { rowCount } = await client.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashedNewPassword, verifyUser[0].id],
    );

    if (rowCount === 0) {
      return Response.json(
        { message: "Failed to update password" },
        { status: 500 },
      );
    }

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
    if (client) client.release();
  }
}
