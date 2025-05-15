import { cookies } from "next/headers";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const createSession = async (userId, role) => {
  const sessionToken = uuidv4();
  const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days

  const client = await pool.connect();
  try {
    await client.query("DELETE FROM sessions WHERE user_id = $1", [userId]);
    await client.query(
      "INSERT INTO sessions (user_id, session_token, expires_at, role) VALUES ($1, $2, $3, $4)",
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
    client.release();
  }
};

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;

  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `SELECT users.*, sessions.role 
       FROM users 
       JOIN sessions ON users.id = sessions.user_id 
       WHERE sessions.session_token = $1 
       AND sessions.expires_at > NOW()`,
      [sessionToken],
    );
    return rows[0] || null;
  } finally {
    client.release();
  }
};
