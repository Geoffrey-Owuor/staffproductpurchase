import { redirect } from "next/navigation";
import pool from "@/lib/db";
import CompleteRegistrationComponent from "@/components/RegistrationComponents/CompleteRegistrationComponent";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function Step3Page() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("verify_email")?.value;
  if (!cookie) redirect("/register");

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(cookie, secret);
    const email = payload.email;

    if (!email) redirect("/register");

    const conn = await pool.getConnection();
    const [results] = await conn.execute(
      `SELECT * FROM verification_codes 
     WHERE email = ? AND verified = 1 AND expires_at > NOW()`,
      [email],
    );
    conn.release();

    if (results.length === 0) {
      redirect("/register");
    }

    return <CompleteRegistrationComponent email={email} />;
  } catch (error) {
    console.error(error);
    redirect("/register");
  }
}
