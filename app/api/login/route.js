import { verifyPassword, createSession } from "@/app/lib/auth";
import { pool } from "@/lib/db";

export async function POST(request) {
  let client;
  try {
    const { email, password } = await request.json();
    client = await pool.connect();

    // Find user by email
    const { rows } = await client.query(
      "SELECT id, password, name, role FROM users WHERE email = $1 LIMIT 1",
      [email],
    );

    if (!rows.length) {
      return Response.json(
        { success: false, message: "Email not found" },
        { status: 401 },
      );
    }
    const user = rows[0];

    // Verify Password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return Response.json(
        { success: false, message: "Wrong password, please try again" },
        { status: 401 },
      );
    }

    // Create Session
    await createSession(user.id, user.role, user.name, email);

    return Response.json({ success: true, role: user.role });
  } catch (error) {
    console.error("Login Error:", error);
    return Response.json(
      { success: false, message: "Server error. Please try again" },
      { status: 500 },
    );
  } finally {
    if (client) client.release();
  }
}
