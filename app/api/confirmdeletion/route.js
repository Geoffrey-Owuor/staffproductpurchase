import pool from "@/lib/db";
import { verifyPassword } from "@/app/lib/auth";

export async function POST(request) {
  const { password, email } = await request.json();

  let connection;

  try {
    connection = await pool.getConnection();
    const [result] = await connection.execute(
      ` SELECT password from users WHERE email = ? LIMIT 1`,
      [email],
    );
    const userPassword = result[0].password;

    const isValid = await verifyPassword(password, userPassword);

    return Response.json({ valid: isValid }, { status: 200 });
  } catch (error) {
    console.error("Error verifying your password", error);
    return Response.json({ valid: false }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
