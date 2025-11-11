import { redirect } from "next/navigation";
import pool from "@/lib/db";
import VerifyCodeComponent from "@/components/RegistrationComponents/VerifyCodeComponent";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function Step2Page() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("verify_email")?.value;
  if (!cookie) return redirect("/register");

  let connection;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(cookie, secret);
    const email = payload.email;

    if (!email) return redirect("/register");

    connection = await pool.getConnection();
    const [results] = await connection.execute(
      `SELECT * FROM verification_codes
         WHERE email = ? and verified = 0 and expires_at > NOW()`,
      [email],
    );

    if (results.length === 0) {
      return redirect("/register");
    }

    connection.release();

    return <VerifyCodeComponent email={email} />;
  } catch (error) {
    console.error(error);
    connection.release();
    return redirect("/register");
  }
}
