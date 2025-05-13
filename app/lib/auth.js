import { cookies } from "next/headers";
import pool from "../../lib/db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// Password Hashing (Node.js only)
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Session Management (Node.js only)
export const createSession = async (userId, role) => {
  const sessionToken = uuidv4();
  const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days

  const conn = await pool.getConnection();
  try {
    await conn.execute("DELETE FROM sessions WHERE user_id = ?", [userId]);

    await conn.execute(
      "INSERT INTO sessions (user_id, session_token, expires_at, role) VALUES (?, ?, ?, ?)",
      [userId, sessionToken, expiresAt, role],
    );

    const cookieStore = await cookies();

    cookieStore.set("session_token", sessionToken, {
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  } finally {
    conn.release();
  }
};

// User Lookup (Node.js only)
export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT users.*, sessions.role FROM users 
       JOIN sessions ON users.id = sessions.user_id 
       WHERE sessions.session_token = ? 
       AND sessions.expires_at > NOW()`,
      [sessionToken],
    );
    return rows[0] ? { ...rows[0], role: rows[0].role } : null;
  } finally {
    conn.release();
  }
};
