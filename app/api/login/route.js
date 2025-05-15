import { verifyPassword, createSession } from "@/app/lib/auth";
import { pool } from "@/lib/db";

export async function POST(request) {
  let client;
  try {
    const { email, password } = await request.json();
    client = await pool.connect();

    // Find user by email
    const { rows } = await client.query(
      "SELECT id, password, role FROM users WHERE email = $1 LIMIT 1",
      [email],
    );

    if (!rows.length) {
      return Response.json(
        { success: false, message: "Invalid Credentials" },
        { status: 401 },
      );
    }
    const user = rows[0];

    // Verify Password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return Response.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Create Session
    await createSession(user.id, user.role);

    return Response.json({ success: true, role: user.role });
  } catch (error) {
    console.error("Login Error:", error);
    return Response.json(
      { success: false, message: "Login Failed" },
      { status: 500 },
    );
  } finally {
    if (client) client.release();
  }
}
