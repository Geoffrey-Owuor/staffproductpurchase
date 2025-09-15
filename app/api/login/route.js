import { verifyPassword, createSession } from "@/app/lib/auth";
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const conn = await pool.getConnection();

    //Find user by email
    const [users] = await conn.execute(
      "SELECT id, password, name, role FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    if (!users.length) {
      conn.release();
      return Response.json(
        { success: false, message: "Wrong username or password" },
        { status: 401 },
      );
    }
    const user = users[0];

    //Verify Password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      conn.release();

      return Response.json(
        { success: false, message: "Wrong username or password" },
        { status: 401 },
      );
    }

    //Create Session

    await createSession(user.id, user.role, user.name, email);
    conn.release();

    return Response.json({ success: true, role: user.role });
  } catch (error) {
    console.error("Login Error:", error);
    return Response.json(
      { success: false, message: "Server error. Please try again" },
      { status: 500 },
    );
  }
}
