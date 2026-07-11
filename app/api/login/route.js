import { verifyPassword, createSession } from "@/app/lib/auth";
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Find user by email (added is_active and password_attempts to SELECT)
    const [users] = await pool.execute(
      "SELECT id, password, name, payrollNo, department, role, is_active, password_attempts FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    if (!users.length) {
      return Response.json(
        { success: false, message: "Wrong email or password" },
        { status: 401 },
      );
    }
    const user = users[0];

    // 2. Check if the account is already deactivated
    if (!user.is_active) {
      return Response.json(
        {
          success: false,
          message: "Account is disabled, contact the administrator",
        },
        { status: 403 }, // 403 Forbidden is ideal for locked accounts
      );
    }

    // 3. Verify Password
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      const newAttempts = user.password_attempts + 1;

      if (newAttempts >= 3) {
        // Lock the account and update total attempts
        await pool.execute(
          "UPDATE users SET password_attempts = ?, is_active = false WHERE id = ?",
          [newAttempts, user.id],
        );
        return Response.json(
          {
            success: false,
            message:
              "Too many failed attempts. Please contact the administrator.",
          },
          { status: 403 },
        );
      } else {
        // Just increment the counter
        await pool.execute(
          "UPDATE users SET password_attempts = ? WHERE id = ?",
          [newAttempts, user.id],
        );
        return Response.json(
          { success: false, message: "Wrong email or password" },
          { status: 401 },
        );
      }
    }

    // 4. SUCCESS: Reset attempts back to 0 if they previously had failed attempts
    if (user.password_attempts > 0) {
      await pool.execute(
        "UPDATE users SET password_attempts = 0 WHERE id = ?",
        [user.id],
      );
    }

    // 5. Create Session
    await createSession(
      user.id,
      user.role,
      user.name,
      email,
      user.payrollNo,
      user.department,
    );

    return Response.json({ success: true, role: user.role, id: user.id });
  } catch (error) {
    console.error("Login Error:", error);
    return Response.json(
      { success: false, message: "Server error. Please try again" },
      { status: 500 },
    );
  }
}
