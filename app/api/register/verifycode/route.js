// app/api/register/verifycode/route.js
import { pool } from "@/lib/db";

export async function POST(request) {
  let client;
  try {
    const { email, code } = await request.json();

    client = await pool.connect();

    // Verify the code
    const { rows } = await client.query(
      `SELECT * FROM verification_codes 
       WHERE email = $1 
         AND code = $2 
         AND expires_at > NOW() 
         AND verified = 0`,
      [email, code],
    );

    if (rows.length === 0) {
      return Response.json(
        { success: false, message: "Invalid or expired verification code" },
        { status: 400 },
      );
    }

    // ✅ Mark as verified
    await client.query(
      `UPDATE verification_codes 
       SET verified = 1 
       WHERE email = $1`,
      [email],
    );

    return Response.json(
      { success: true, message: "Code verified successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Code verification error:", error);
    return Response.json(
      { success: false, message: "Verification failed" },
      { status: 500 },
    );
  } finally {
    if (client) client.release();
  }
}

export async function PUT(request) {
  let client;
  try {
    const { code, newemail, oldemail } = await request.json();

    client = await pool.connect();

    //Verify the code
    const { rows: result } = await client.query(
      `SELECT id from verification_codes
      WHERE code = $1 AND email = $2 AND expires_at > NOW() AND verified = 0`,
      [code, newemail],
    );

    if (!result.length) {
      return Response.json(
        { message: "Invalid or expired verification code" },
        { status: 400 },
      );
    }

    const { rowCount } = await client.query(
      `UPDATE users SET email = $1 WHERE email = $2`,
      [newemail, oldemail],
    );

    if (rowCount === 0) {
      return Response.json({ message: "Email Not Updated" }, { status: 400 });
    }

    //Cleanup the verification code
    await client.query(`DELETE FROM verification_codes WHERE email = $1`, [
      newemail,
    ]);

    return Response.json(
      { message: "Email Updated Successfully, you'll be logged out shortly" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Code verification error:", error);
    return Response.json({ message: "Verification failed" }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
