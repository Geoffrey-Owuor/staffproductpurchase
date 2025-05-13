import pool from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request) {
  const { email } = await request.json();
  const conn = await pool.getConnection();

  try {
    const [users] = await conn.execute("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return Response.json(
        { message: "A reset link was sent to this email if it exists" },
        { status: 200 },
      );
    }

    //Generate a secure token of 32 characters
    const token = uuidv4();
    const expiry = new Date(Date.now() + 3600000); //1 day expiry

    //Store generated token in the database
    await conn.execute(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?",
      [token, expiry, users[0].id],
    );

    //Send Email
    await sendPasswordResetEmail(email, token);

    return Response.json({ message: "Reset link sent if email exists" });
  } catch (error) {
    console.error("Password reset error: ", error);
    return Response.json(
      { message: "Failed to process request" },
      { status: 500 },
    );
  } finally {
    conn.release();
  }
}
