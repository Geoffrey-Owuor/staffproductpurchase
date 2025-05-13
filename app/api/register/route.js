import { hashPassword, createSession } from "@/app/lib/auth";
import pool from "@/lib/db";

const getRoleFromEmail = (email) => {
  // Ensure email ends with @hotpoint.co.ke
  if (!email.endsWith("@hotpoint.co.ke")) {
    return "staff"; // Default role for non-company emails
  }

  // Extract the prefix before the @ symbol
  const prefix = email.split("@")[0].toLowerCase();

  // Define role mappings based on prefixes
  const roleMappings = {
    hr: "hr",
    cc: "cc",
    bi: "bi",
    admin: "admin",
  };

  // Check if prefix matches any role
  for (const [key, role] of Object.entries(roleMappings)) {
    if (prefix.startsWith(key)) {
      return role;
    }
  }

  return "staff"; // Default role if no prefix matches
};

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    const conn = await pool.getConnection();

    const [existingUsers] = await conn.execute(
      "SELECT id FROM users WHERE email = ? ",
      [email],
    );

    if (existingUsers.length > 0) {
      conn.release();
      return Response.json(
        { success: false, message: "Email already registered" },
        { status: 400 },
      );
    }

    const role = getRoleFromEmail(email);

    const hashedPassword = await hashPassword(password);

    const [userResult] = await conn.execute(
      `INSERT INTO users (name, email, password, role) VALUES(?,?,?,?)`,
      [name, email, hashedPassword, role],
    );

    await createSession(userResult.insertId, role);

    conn.release();

    return Response.json(
      { success: true, userId: userResult.insertId, role: role },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error); // Optional but useful for debugging

    if (error.code === "ER_DUP_ENTRY") {
      return Response.json(
        { success: false, message: "Email already registered" },
        { status: 400 },
      );
    }

    // 🔴 Always return a fallback response
    return Response.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
